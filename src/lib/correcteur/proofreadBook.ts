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

export interface ProofreadResult {
  corrected: string;
  corrections: Correction[];
  quality: number;
  /** Expressions latines / pseudo-latines éliminées. */
  latinRemoved: number;
  /** Expressions qui résistent malgré les passes ciblées. */
  latinRemaining: string[];
}

/** Notification d'attente (limite de débit) pour l'interface. */
export type WaitNotifier = (info: { seconds: number; reason: string } | null) => void;
let waitNotifier: WaitNotifier | null = null;
export function setProofreadWaitNotifier(fn: WaitNotifier | null) {
  waitNotifier = fn;
}

const BACKOFF_MS = [5000, 15000, 30000, 60000];

async function waitWithNotice(ms: number, reason: string) {
  waitNotifier?.({ seconds: Math.round(ms / 1000), reason });
  await sleep(ms);
  waitNotifier?.(null);
}

/** Un appel à l'edge function, avec relances patientes si la limite de débit est atteinte. */
async function callProofread(
  title: string,
  content: string,
  mode: ProofreadMode | 'latin-fix',
  latinList?: string[],
): Promise<{ corrected: string; corrections: Correction[]; quality: number }> {
  let lastError = '';
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data, error } = await supabase.functions.invoke('strict-proofread', {
      body: {
        chapterTitle: title,
        chapterContent: content,
        mode,
        latinExpressions: latinList,
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

    const wait = BACKOFF_MS[Math.min(attempt, BACKOFF_MS.length - 1)];
    // Limite de débit ou quota : on patiente puis on réessaie (jamais d'abandon du livre).
    if (/429|limite|rate|quota|402|crédit/i.test(message)) {
      await waitWithNotice(wait, 'Limite de requêtes atteinte');
      continue;
    }
    await waitWithNotice(Math.min(wait, 5000), 'Nouvelle tentative');
  }
  throw new Error(lastError || 'Correction impossible après plusieurs tentatives.');
}


/**
 * Garde-fou : une correction ne doit jamais raccourcir le chapitre.
 * Si le modèle renvoie un texte amputé (résumé, coupe de paragraphes), on refuse
 * sa réponse et on conserve la version précédente.
 */
const MIN_KEEP_RATIO = 0.9;

function isTruncated(before: string, after: string): boolean {
  const a = (before || '').replace(/\s+/g, ' ').trim().length;
  const b = (after || '').replace(/\s+/g, ' ').trim().length;
  if (a < 200) return false;
  return b < a * MIN_KEEP_RATIO;
}

/**
 * Corrige un chapitre, puis vérifie mécaniquement qu'il ne reste aucune expression
 * en latin / faux latin. Toute réponse qui ampute le texte est rejetée.
 */
export async function proofreadChapter(
  title: string,
  content: string,
  mode: ProofreadMode,
): Promise<ProofreadResult> {
  const before = detectLatin(content).length;
  const res = await callProofread(title, content, mode);

  // Réponse tronquée : on garde le texte d'origine plutôt que d'abîmer le chapitre.
  let corrected = isTruncated(content, res.corrected) ? content : res.corrected;
  let corrections = isTruncated(content, res.corrected) ? [] : res.corrections;

  // Une seule passe anti-latin, uniquement si le balayage local détecte vraiment
  // des expressions : moins d'appels IA, donc moins de risque de quota.
  const remaining = findLatinExpressions(corrected);
  if (remaining.length) {
    try {
      const fix = await callProofread(title, corrected, 'latin-fix', remaining);
      const reduced = findLatinExpressions(fix.corrected).length < remaining.length;
      // On ne garde la passe que si elle réduit le latin SANS raccourcir le texte.
      if (reduced && !isTruncated(corrected, fix.corrected)) {
        corrected = fix.corrected;
        corrections = [...corrections, ...fix.corrections];
      }
    } catch {
      // La passe anti-latin échoue : on garde le texte corrigé tel quel.
    }
  }


  const latinRemaining = findLatinExpressions(corrected);
  return {
    corrected,
    corrections,
    quality: res.quality,
    latinRemoved: Math.max(0, before - latinRemaining.length),
    latinRemaining,
  };
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
          latinRemoved: res.latinRemoved,
          latinRemaining: res.latinRemaining,
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
