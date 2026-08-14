/**
 * Correction intégrale d'un manuscrit importé, chapitre par chapitre.
 * Appelle l'edge function `strict-proofread` (IA réelle, aucune simulation),
 * séquentiellement, avec relance automatique en cas de limite de débit.
 *
 * Les chapitres longs sont découpés en blocs de paragraphes : un modèle ne peut
 * pas restituer 6 000 mots en une réponse, il tronque — et une réponse tronquée
 * était auparavant rejetée en bloc, ce qui donnait « 0 correction ».
 */
import { supabase } from '@/integrations/supabase/client';
import { getProvider, getActiveAIKey, getOpenRouterModel } from '@/services/aiWritingService';
import { detectLatin, latinExpressions as findLatinExpressions } from '@/utils/latinSweep';
import { dashesToBullets } from '@/utils/frenchTypography';

import { checkEnding, lastParagraph, replaceLastParagraph } from '@/utils/chapterEnding';
import { applyFrenchTypography, checkTypographyCompliance } from '@/utils/frenchTypography';
import type { BookContext } from './bookContext';

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
  /** Nombre de blocs dont la réponse a été refusée (texte amputé / hors format). */
  blockFailures?: number;
  /** Nombre de blocs traités pour ce chapitre. */
  blockCount?: number;
  /** La fin du chapitre a été complétée par une phrase de clôture. */
  endingFixed?: boolean;
  /** Fin toujours bancale malgré la passe de clôture (raison affichée). */
  endingIssue?: string;
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
  blockCount: number;
  blockFailures: number;
  endingFixed: boolean;
  endingIssue?: string;
  /** Passes réellement appliquées sur ce chapitre. */
  passes?: string[];
  /** Défauts typographiques réparés localement (guillemets, espaces, apostrophes…). */
  typoFixed?: number;
}

/** Notification d'attente (limite de débit) pour l'interface. */
export type WaitNotifier = (info: { seconds: number; reason: string } | null) => void;
let waitNotifier: WaitNotifier | null = null;
export function setProofreadWaitNotifier(fn: WaitNotifier | null) {
  waitNotifier = fn;
}

/** Notification de passe en cours (Correction / Typographie / Édition / Contrôle). */
export type PassNotifier = (info: { pass: number; total: number; label: string } | null) => void;
let passNotifier: PassNotifier | null = null;
export function setProofreadPassNotifier(fn: PassNotifier | null) {
  passNotifier = fn;
}

/** Relevé de cohérence du livre, transmis à chaque appel IA. */
let bookContext: BookContext | null = null;
export function setProofreadBookContext(ctx: BookContext | null) {
  bookContext = ctx;
}

export const PASS_LABELS = ['Correction', 'Typographie française', 'Édition', 'Contrôle final'];

const BACKOFF_MS = [5000, 15000];

async function waitWithNotice(ms: number, reason: string) {
  waitNotifier?.({ seconds: Math.round(ms / 1000), reason });
  await sleep(ms);
  waitNotifier?.(null);
}

type CallMode = ProofreadMode | 'latin-fix' | 'ending-fix' | 'edition' | 'final-check';

interface CallResult {
  corrected: string;
  corrections: Correction[];
  quality: number;
  /** Faux quand le modèle n'a pas renvoyé le JSON attendu (texte brut). */
  formatOk: boolean;
}

/** Un appel à l'edge function, avec relances patientes si la limite de débit est atteinte. */
async function callProofread(
  title: string,
  content: string,
  mode: CallMode,
  latinList?: string[],
): Promise<CallResult> {
  let lastError = '';
  for (let attempt = 0; attempt < 3; attempt++) {
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
        formatOk: data.formatOk !== false,
      };
    }

    const message = String(data?.error || error?.message || 'Erreur de correction');
    lastError = message;

    // Seule une limite de débit temporaire justifie un nouvel appel payant.
    // Clé refusée, quota/crédits épuisés et erreurs de format s'arrêtent tout de suite.
    if (/clé api refusée|aucune clé|402|crédit|quota épuisé|insuffisant/i.test(message)) {
      throw new Error(message);
    }
    if (/429|limite de requêtes|rate limit/i.test(message) && attempt < 2) {
      const wait = BACKOFF_MS[Math.min(attempt, BACKOFF_MS.length - 1)];
      await waitWithNotice(wait, 'Limite de requêtes atteinte');
      continue;
    }
    throw new Error(message);
  }
  throw new Error(lastError || 'Correction impossible après plusieurs tentatives.');
}


/**
 * Garde-fou : une correction ne doit jamais raccourcir le texte envoyé.
 * Appliqué BLOC par BLOC : une mauvaise réponse ne fait plus perdre tout le chapitre.
 */
const MIN_KEEP_RATIO = 0.9;

function normLen(s: string): number {
  return (s || '').replace(/\s+/g, ' ').trim().length;
}

function isTruncated(before: string, after: string): boolean {
  const a = normLen(before);
  const b = normLen(after);
  if (a < 200) return false;
  return b < a * MIN_KEEP_RATIO;
}

const countParagraphs = (s: string) =>
  (s || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).length;

const countWords = (s: string) => (s || '').trim().split(/\s+/).filter(Boolean).length;

/**
 * Découpe un chapitre en blocs de paragraphes (jamais au milieu d'un paragraphe),
 * de façon à rester sous la limite de sortie du modèle.
 */
export function splitForProofread(text: string, maxWords = 1200): string[] {
  const paras = (text || '').replace(/\r\n/g, '\n').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  if (paras.length === 0) return [];
  const blocks: string[] = [];
  let current: string[] = [];
  let words = 0;
  for (const p of paras) {
    const w = countWords(p);
    if (current.length && words + w > maxWords) {
      blocks.push(current.join('\n\n'));
      current = [];
      words = 0;
    }
    current.push(p);
    words += w;
  }
  if (current.length) blocks.push(current.join('\n\n'));
  return blocks;
}

/** Corrige un bloc une seule fois : une réponse inutilisable conserve l'original
 * au lieu de consommer plusieurs appels supplémentaires. */
async function proofreadBlock(
  title: string,
  block: string,
  mode: ProofreadMode,
): Promise<{ text: string; corrections: Correction[]; quality: number; failed: boolean }> {
  const res = await callProofread(title, block, mode);
  const truncated = isTruncated(block, res.corrected);
  const lostParagraphs = countParagraphs(res.corrected) < countParagraphs(block);
  if (!truncated && !lostParagraphs && res.formatOk) {
    return { text: res.corrected, corrections: res.corrections, quality: res.quality, failed: false };
  }
  console.warn(
    `[correcteur] bloc conservé dans sa version originale (${truncated ? 'réponse amputée' : lostParagraphs ? 'paragraphes perdus' : 'format invalide'}) — ` +
    `${normLen(res.corrected)}/${normLen(block)} caractères`,
  );
  return { text: block, corrections: [], quality: res.quality, failed: true };
}

/** Passe de clôture : complète une fin de chapitre bancale par une vraie phrase. */
async function fixEnding(
  title: string,
  text: string,
): Promise<{ text: string; fixed: boolean }> {
  const para = lastParagraph(text);
  try {
    const res = await callProofread(title, para, 'ending-fix');
    const candidate = replaceLastParagraph(text, res.corrected);
    const ok = !checkEnding(candidate).incomplete && normLen(candidate) >= normLen(text);
    return ok ? { text: candidate, fixed: true } : { text, fixed: false };
  } catch {
    return { text, fixed: false };
  }
}

/**
 * Corrige un chapitre bloc par bloc, élimine le latin, puis garantit que le
 * chapitre se termine par une phrase complète ponctuée.
 */
export async function proofreadChapter(
  title: string,
  content: string,
  mode: ProofreadMode,
): Promise<ProofreadResult> {
  const latinBefore = detectLatin(content).length;
  // 700 mots par bloc : le modèle reste minutieux sur l'orthographe et ne
  // survole plus le texte comme sur des blocs de 1200 mots.
  const blocks = splitForProofread(content, 700);

  if (blocks.length === 0) throw new Error('Chapitre vide : rien à corriger.');

  const outputs: string[] = [];
  let corrections: Correction[] = [];
  let qualitySum = 0;
  let qualityCount = 0;
  let blockFailures = 0;

  for (let i = 0; i < blocks.length; i++) {
    const res = await proofreadBlock(title, blocks[i], mode);
    outputs.push(res.text);
    corrections = [...corrections, ...res.corrections];
    if (res.failed) blockFailures++;
    if (res.quality) { qualitySum += res.quality; qualityCount++; }
    if (i < blocks.length - 1) await sleep(400);
  }

  let corrected = outputs.join('\n\n').trim();
  console.info(
    `[correcteur] « ${title} » : ${blocks.length} bloc(s), ${blockFailures} refusé(s), ` +
    `${corrections.length} correction(s), ${normLen(corrected)}/${normLen(content)} caractères`,
  );

  // Anti-latin : passe ciblée sur les seuls blocs concernés, deux tentatives max.
  for (let pass = 0; pass < 2; pass++) {
    const remaining = findLatinExpressions(corrected);
    if (!remaining.length) break;
    const parts = splitForProofread(corrected, 700);
    let changed = false;
    for (let i = 0; i < parts.length; i++) {
      const hits = findLatinExpressions(parts[i]);
      if (!hits.length) continue;
      try {
        const fix = await callProofread(title, parts[i], 'latin-fix', hits);
        const reduced = findLatinExpressions(fix.corrected).length < hits.length;
        if (reduced && !isTruncated(parts[i], fix.corrected)) {
          parts[i] = fix.corrected;
          corrections = [...corrections, ...fix.corrections];
          changed = true;
        }
      } catch {
        // Passe anti-latin en échec : on garde le bloc corrigé tel quel.
      }
    }
    if (!changed) break;
    corrected = parts.join('\n\n').trim();
  }

  // Passe locale : les puces transformées à tort en tirets de dialogue redeviennent des puces.
  corrected = dashesToBullets(corrected);

  // Fin de chapitre : jamais un mot isolé ni une phrase sans point.

  let endingFixed = false;
  let endingIssue: string | undefined;
  const ending = checkEnding(corrected);
  if (ending.incomplete) {
    const fix = await fixEnding(title, corrected);
    corrected = fix.text;
    endingFixed = fix.fixed;
    if (!fix.fixed) endingIssue = ending.reason;
  }

  const latinRemaining = findLatinExpressions(corrected);
  return {
    corrected,
    corrections,
    quality: qualityCount ? Math.round(qualitySum / qualityCount) : 0,
    latinRemoved: Math.max(0, latinBefore - latinRemaining.length),
    latinRemaining,
    blockCount: blocks.length,
    blockFailures,
    endingFixed,
    endingIssue,
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
 * Aucune erreur (crédits, quota, limite de débit) n'interrompt la série : les
 * chapitres en échec sont repris automatiquement en fin de passage.
 */
export async function proofreadChapters(
  chapters: ChapterProofread[],
  mode: ProofreadMode,
  onProgress: (p: ProofreadProgress) => void,
  shouldStop?: () => boolean,
): Promise<void> {
  const runPass = async () => {
    for (let i = 0; i < chapters.length; i++) {
      if (shouldStop?.()) return;
      const chapter = chapters[i];
      if (chapter.status === 'done') continue;

      onProgress({ index: i, total: chapters.length, chapter: { ...chapter, status: 'running' } });

      try {
        const res = await proofreadChapter(chapter.title, chapter.original, mode);
        chapters[i] = {
          ...chapter,
          status: 'done',
          corrected: res.corrected,
          corrections: res.corrections,
          quality: res.quality,
          latinRemoved: res.latinRemoved,
          latinRemaining: res.latinRemaining,
          blockCount: res.blockCount,
          blockFailures: res.blockFailures,
          endingFixed: res.endingFixed,
          endingIssue: res.endingIssue,
          error: undefined,
        };
        onProgress({ index: i, total: chapters.length, chapter: chapters[i] });
      } catch (e: any) {
        chapters[i] = { ...chapter, status: 'failed', error: e?.message || 'Erreur inconnue' };
        onProgress({ index: i, total: chapters.length, chapter: chapters[i] });
      }
      await sleep(600);
    }
  };

  await runPass();

  // Aucun second passage automatique : l'auteur choisit explicitement s'il
  // souhaite reprendre les chapitres en échec, donc aucun crédit ne part seul.
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
