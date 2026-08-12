/**
 * Correction intégrale d'un manuscrit importé, chapitre par chapitre.
 * Appelle l'edge function `strict-proofread` (IA réelle, aucune simulation),
 * séquentiellement, avec relance automatique en cas de limite de débit.
 */
import { supabase } from '@/integrations/supabase/client';
import { getProvider, getActiveAIKey, getOpenRouterModel } from '@/services/aiWritingService';
import { detectLatin, latinExpressions as findLatinExpressions } from '@/utils/latinSweep';

export type ProofreadMode = 'strict' | 'polish';


export interface Correction {
  type: string;
  original: string;
  corrige: string;
  explication?: string;
}

export interface ChapterProofread {
  chapterId: string;
  index: number;
  title: string;
  original: string;
  corrected: string;
  corrections: Correction[];
  quality: number;
  status: 'pending' | 'running' | 'done' | 'failed';
  /** L'auteur a validé le texte corrigé pour ce chapitre. */
  accepted: boolean;
  /** Texte réécrit à la main par l'auteur (prioritaire sur la correction IA). */
  edited?: string;
  /** Index des corrections refusées : le mot d'origine est rétabli. */
  rejected?: number[];
  /** Nombre d'expressions latines / pseudo-latines éliminées sur ce chapitre. */
  latinRemoved?: number;
  /** Expressions latines qui résistent après les passes ciblées. */
  latinRemaining?: string[];
  error?: string;
}


/** Rétablit dans le texte corrigé les mots dont la correction a été refusée. */
export function applyRejections(chapter: ChapterProofread): string {
  const rejected = chapter.rejected || [];
  if (!chapter.corrected || rejected.length === 0) return chapter.corrected;
  let text = chapter.corrected;
  rejected.forEach((i) => {
    const corr = chapter.corrections[i];
    if (!corr?.corrige || !corr.original) return;
    if (text.includes(corr.corrige)) text = text.replace(corr.corrige, corr.original);
  });
  return text;
}

/** Texte réellement retenu pour l'export d'un chapitre. */
export function effectiveText(chapter: ChapterProofread): string {
  if (typeof chapter.edited === 'string' && chapter.edited.trim()) return chapter.edited;
  if (chapter.accepted && chapter.corrected) return applyRejections(chapter);
  return chapter.original;
}


/**
 * Nettoie la réponse du modèle : certains retours réintègrent le titre du chapitre
 * ou les séparateurs « --- » du prompt dans le texte corrigé.
 */
function cleanCorrected(raw: string, title: string): string {
  let t = (raw || '').replace(/\r\n/g, '\n').trim();
  t = t.replace(/^\s*Titre du chapitre\s*:\s*"?.*?"?\s*\n/i, '');
  t = t.replace(/^\s*-{3,}\s*\n/, '').replace(/\n\s*-{3,}\s*$/, '');
  const clean = (title || '').trim();
  if (clean) {
    const escaped = clean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    t = t.replace(new RegExp(`^\\s*${escaped}\\s*\\n+`, 'i'), '');
  }
  return t.trim();
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const CORRECTION_TYPE_LABELS: Record<string, string> = {
  orthographe: 'Orthographe',
  grammaire: 'Grammaire',
  accord: 'Accords',
  ponctuation: 'Ponctuation',
  anglicisme: 'Anglicismes',
  temps: 'Temps narratifs',
  repetition: 'Répétitions',
  style: 'Style',
};

/** Corrige un seul chapitre. Relance jusqu'à 3 fois si la limite de débit est atteinte. */
export async function proofreadChapter(
  title: string,
  content: string,
  mode: ProofreadMode,
): Promise<{ corrected: string; corrections: Correction[]; quality: number }> {
  let lastError = '';
  for (let attempt = 0; attempt < 3; attempt++) {
    const { data, error } = await supabase.functions.invoke('strict-proofread', {
      body: {
        chapterTitle: title,
        chapterContent: content,
        mode,
        // Clé de l'abonné (Gemini / ChatGPT / Claude / OpenRouter) : la correction
        // passe par son propre compte IA, aucun crédit de la plateforme n'est utilisé.
        userProvider: getProvider(),
        userApiKey: getActiveAIKey(),
        userModel: getProvider() === 'openrouter' ? getOpenRouterModel() : undefined,
      },
    });

    if (!error && data && !data.error) {
      const corrected = cleanCorrected(String(data.texteCorrige || ''), title);
      if (!corrected) throw new Error('La correction est revenue vide.');
      return {
        corrected,
        corrections: Array.isArray(data.corrections) ? data.corrections : [],
        quality: Number(data.qualiteOrthographe) || 0,
      };
    }

    const message = String(data?.error || error?.message || 'Erreur de correction');
    lastError = message;

    // Limite de débit : on patiente puis on réessaie.
    if (/429|limite|rate/i.test(message)) {
      await sleep(4000 * (attempt + 1));
      continue;
    }
    // Crédits épuisés : inutile d'insister.
    if (/402|crédit/i.test(message)) throw new Error(message);
    await sleep(1500);
  }
  throw new Error(lastError || 'Correction impossible après plusieurs tentatives.');
}

export interface ProofreadProgress {
  index: number;
  total: number;
  chapter: ChapterProofread;
}

/**
 * Corrige une liste de chapitres en série. `onProgress` est appelé après chaque
 * chapitre pour que l'interface affiche l'avancement en direct.
 * `shouldStop` permet d'interrompre proprement sans perdre le travail déjà fait.
 */
export async function proofreadChapters(
  chapters: ChapterProofread[],
  mode: ProofreadMode,
  onProgress: (p: ProofreadProgress) => void,
  shouldStop?: () => boolean,
): Promise<void> {
  for (let i = 0; i < chapters.length; i++) {
    if (shouldStop?.()) return;
    const chapter = chapters[i];
    if (chapter.status === 'done') continue;

    onProgress({ index: i, total: chapters.length, chapter: { ...chapter, status: 'running' } });

    try {
      const res = await proofreadChapter(chapter.title, chapter.original, mode);
      onProgress({
        index: i,
        total: chapters.length,
        chapter: {
          ...chapter,
          status: 'done',
          corrected: res.corrected,
          corrections: res.corrections,
          quality: res.quality,
        },
      });
    } catch (e: any) {
      onProgress({
        index: i,
        total: chapters.length,
        chapter: { ...chapter, status: 'failed', error: e?.message || 'Erreur inconnue' },
      });
      // Crédits épuisés : on arrête toute la série.
      if (/402|crédit/i.test(String(e?.message))) return;
    }
    await sleep(600);
  }
}

/** Répartition des corrections par type, pour le rapport final. */
export function correctionBreakdown(chapters: ChapterProofread[]): { type: string; label: string; count: number }[] {
  const map = new Map<string, number>();
  chapters.forEach((c) =>
    c.corrections.forEach((corr) => {
      const key = (corr.type || 'autre').toLowerCase();
      map.set(key, (map.get(key) || 0) + 1);
    }),
  );
  return Array.from(map.entries())
    .map(([type, count]) => ({ type, label: CORRECTION_TYPE_LABELS[type] || 'Autres', count }))
    .sort((a, b) => b.count - a.count);
}
