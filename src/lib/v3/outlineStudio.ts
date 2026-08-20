/**
 * Sommaire Stratégique — moteur du sommaire V3.
 *
 * Regroupe :
 *  - la manipulation du sommaire (déplacer, fusionner, scinder, dupliquer, insérer) ;
 *  - la santé du sommaire (doublons, titres génériques, objectifs manquants, passages non couverts) ;
 *  - le budget KDP (mots, pages, royalties estimées) ;
 *  - la mise en forme riche (listes, encadrés, exercices, tableaux) transmise à l'IA rédactrice.
 *
 * Aucune donnée simulée : tout est calculé à partir du brief réel de l'auteur.
 */
import {
  type BookBrief,
  type BriefOutlineChapter,
  type OutlineBlockId,
  countWords,
  listSourcePassages,
  normalizeOutline,
} from './bookBrief';
import { estimatePages, type KdpFormatId, DEFAULT_KDP_FORMAT } from '@/utils/kdpPageDensity';

/* ------------------------------------------------------------------ */
/* 1. Mise en forme riche                                              */
/* ------------------------------------------------------------------ */

export type OutlineBlockDef = {
  id: OutlineBlockId;
  label: string;
  hint: string;
  /** Consigne exacte envoyée à l'IA rédactrice. */
  instruction: string;
};

export const OUTLINE_BLOCKS: OutlineBlockDef[] = [
  {
    id: 'bullets',
    label: 'Liste à puces',
    hint: '4 à 7 puces courtes',
    instruction:
      'Insère une liste à puces de 4 à 7 éléments (une ligne commençant par « - »), chaque puce concrète et utile, jamais un simple mot.',
  },
  {
    id: 'numbered',
    label: 'Liste numérotée',
    hint: 'Étapes dans l’ordre',
    instruction:
      'Insère une liste numérotée (« 1. », « 2. »…) présentant des étapes dans l’ordre, chacune actionnable en une phrase complète.',
  },
  {
    id: 'keypoints',
    label: 'Points clés encadrés',
    hint: 'Encadré doré « À retenir »',
    instruction:
      'Ajoute un encadré introduit par la ligne « À retenir : » suivi de 3 points essentiels du chapitre, en phrases complètes.',
  },
  {
    id: 'quote',
    label: 'Citation mise en avant',
    hint: 'Une phrase forte isolée',
    instruction:
      'Isole une phrase forte du chapitre sur sa propre ligne, précédée de « > ». Elle doit provenir du contenu du chapitre, jamais d’un auteur inventé.',
  },
  {
    id: 'callout',
    label: 'Avertissement',
    hint: 'Erreur à éviter',
    instruction:
      'Ajoute un paragraphe court introduit par « Attention : » qui nomme l’erreur la plus fréquente sur ce sujet et comment l’éviter.',
  },
  {
    id: 'exercise',
    label: 'Exercice pratique',
    hint: 'À faire par le lecteur',
    instruction:
      'Termine par un encadré « Exercice : » contenant une consigne réalisable en moins de 15 minutes, avec le résultat attendu.',
  },
  {
    id: 'checklist',
    label: 'Checklist',
    hint: 'Cases à cocher',
    instruction:
      'Ajoute une checklist de 5 lignes maximum, chaque ligne commençant par « [ ] », vérifiable objectivement.',
  },
  {
    id: 'table',
    label: 'Tableau simple',
    hint: '2 colonnes comparatives',
    instruction:
      'Insère un tableau Markdown simple à deux colonnes (en-tête + 3 à 5 lignes) comparant deux approches du sujet.',
  },
  {
    id: 'summary',
    label: 'Résumé de fin',
    hint: 'Transition vers le suivant',
    instruction:
      'Termine le chapitre par un paragraphe de synthèse de 3 phrases qui referme le propos et annonce le chapitre suivant.',
  },
];

export function blockLabel(id: OutlineBlockId): string {
  return OUTLINE_BLOCKS.find((b) => b.id === id)?.label || id;
}

/* ------------------------------------------------------------------ */
/* 2. Manipulation du sommaire                                         */
/* ------------------------------------------------------------------ */

export function moveChapterTo(outline: BriefOutlineChapter[], from: number, to: number): BriefOutlineChapter[] {
  if (from === to || from < 0 || to < 0 || from >= outline.length || to >= outline.length) return outline;
  const next = [...outline];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return normalizeOutline(next);
}

export function insertChapterAt(outline: BriefOutlineChapter[], index: number, chapter?: Partial<BriefOutlineChapter>): BriefOutlineChapter[] {
  const next = [...outline];
  next.splice(Math.max(0, Math.min(index, next.length)), 0, {
    numero: 0,
    titre: String(chapter?.titre || 'Nouveau chapitre'),
    objectif: String(chapter?.objectif || ''),
    ...chapter,
  } as BriefOutlineChapter);
  return normalizeOutline(next);
}

export function duplicateChapter(outline: BriefOutlineChapter[], index: number): BriefOutlineChapter[] {
  const src = outline[index];
  if (!src) return outline;
  return insertChapterAt(outline, index + 1, {
    ...src,
    titre: `${src.titre} (variante)`,
    locked: undefined,
  });
}

/** Fusionne le chapitre `index` avec le suivant : titres, objectifs, points et blocs réunis. */
export function mergeWithNext(outline: BriefOutlineChapter[], index: number): BriefOutlineChapter[] {
  const a = outline[index];
  const b = outline[index + 1];
  if (!a || !b) return outline;
  const merged: BriefOutlineChapter = {
    ...a,
    titre: `${a.titre} & ${b.titre}`.slice(0, 140),
    objectif: [a.objectif, b.objectif].filter(Boolean).join(' Puis : '),
    points: [...(a.points || []), ...(b.points || [])],
    note: [a.note, b.note].filter(Boolean).join(' — ') || undefined,
    blocks: Array.from(new Set([...(a.blocks || []), ...(b.blocks || [])])),
    sources: [...(a.sources || []), ...(b.sources || [])].sort((x, y) => x - y),
    wordsTarget: (a.wordsTarget || 0) + (b.wordsTarget || 0) || undefined,
  };
  const next = [...outline];
  next.splice(index, 2, merged);
  return normalizeOutline(next);
}

/** Scinde un chapitre en deux : les points sont répartis en deux moitiés. */
export function splitChapter(outline: BriefOutlineChapter[], index: number): BriefOutlineChapter[] {
  const src = outline[index];
  if (!src) return outline;
  const points = src.points || [];
  const half = Math.ceil(points.length / 2);
  const sources = src.sources || [];
  const halfSources = Math.ceil(sources.length / 2);
  const words = src.wordsTarget ? Math.round(src.wordsTarget / 2) : undefined;
  const first: BriefOutlineChapter = {
    ...src,
    titre: `${src.titre} — partie 1`,
    points: points.slice(0, half),
    sources: sources.slice(0, halfSources),
    wordsTarget: words,
  };
  const second: BriefOutlineChapter = {
    ...src,
    titre: `${src.titre} — partie 2`,
    points: points.slice(half),
    sources: sources.slice(halfSources),
    wordsTarget: words,
    locked: undefined,
  };
  const next = [...outline];
  next.splice(index, 1, first, second);
  return normalizeOutline(next);
}

/* ------------------------------------------------------------------ */
/* 3. Santé du sommaire                                                */
/* ------------------------------------------------------------------ */

export type OutlineIssue = {
  level: 'error' | 'warning' | 'info';
  message: string;
  chapter?: number;
};

const GENERIC_PATTERNS = [
  /^chapitre\s*\d+$/i,
  /^partie\s*\d+$/i,
  /^introduction$/i,
  /^conclusion$/i,
  /^nouveau chapitre$/i,
  /^sans titre$/i,
  /^divers$/i,
];

export function outlineIssues(brief: BookBrief | null | undefined, outline: BriefOutlineChapter[]): OutlineIssue[] {
  const issues: OutlineIssue[] = [];
  const seen = new Map<string, number>();

  outline.forEach((chapter, i) => {
    const titre = String(chapter.titre || '').trim();
    const key = titre.toLowerCase().replace(/\s+/g, ' ');
    if (!titre || titre.length < 4) {
      issues.push({ level: 'error', message: `Chapitre ${i + 1} : titre trop court.`, chapter: i });
    } else if (GENERIC_PATTERNS.some((rx) => rx.test(titre))) {
      issues.push({ level: 'warning', message: `Chapitre ${i + 1} : titre générique « ${titre} ».`, chapter: i });
    }
    if (key && seen.has(key)) {
      issues.push({ level: 'error', message: `Chapitre ${i + 1} : doublon du chapitre ${seen.get(key)! + 1}.`, chapter: i });
    } else if (key) {
      seen.set(key, i);
    }
    if (!String(chapter.objectif || '').trim()) {
      issues.push({ level: 'warning', message: `Chapitre ${i + 1} : objectif éditorial manquant.`, chapter: i });
    }
    if (!(chapter.points || []).length && !(chapter.sources || []).length) {
      issues.push({ level: 'info', message: `Chapitre ${i + 1} : aucun point à traiter, l’IA improvisera.`, chapter: i });
    }
  });

  // Passages du récit non couverts (biographie / matière dictée)
  const passages = listSourcePassages(brief?.sourceText || '');
  if (passages.length) {
    const covered = new Set(outline.flatMap((c) => c.sources || []));
    const missing: number[] = [];
    for (let n = 1; n <= passages.length; n++) if (!covered.has(n)) missing.push(n);
    if (missing.length) {
      issues.push({
        level: 'warning',
        message: `${missing.length} passage(s) de votre récit ne sont rattachés à aucun chapitre (n° ${missing.slice(0, 8).join(', ')}${missing.length > 8 ? '…' : ''}).`,
      });
    }
  }

  const target = Number(brief?.chapters) || outline.length;
  if (outline.length && target && Math.abs(outline.length - target) >= 2) {
    issues.push({
      level: 'info',
      message: `${outline.length} chapitres dans le sommaire pour ${target} prévus dans les réglages.`,
    });
  }
  return issues;
}

/** Score de santé sur 100 : 100 = sommaire prêt pour la rédaction. */
export function outlineHealth(issues: OutlineIssue[]): number {
  const penalty = issues.reduce((sum, i) => sum + (i.level === 'error' ? 14 : i.level === 'warning' ? 7 : 2), 0);
  return Math.max(0, Math.min(100, 100 - penalty));
}

/* ------------------------------------------------------------------ */
/* 4. Budget KDP                                                       */
/* ------------------------------------------------------------------ */

export type OutlineBudget = {
  chapters: number;
  words: number;
  pages: number;
  minutes: number;
  suggestedPrice: number;
  royalty: number;
};

/** Royalties KDP broché 60 % moins le coût d'impression noir & blanc (0,0107 $/page + 0,85 $). */
export function estimateRoyalty(price: number, pages: number): number {
  const printing = pages > 0 ? 0.85 + pages * 0.0107 : 0;
  return Math.max(0, price * 0.6 - printing);
}

export function outlineBudget(
  brief: BookBrief | null | undefined,
  outline: BriefOutlineChapter[],
  format: KdpFormatId = DEFAULT_KDP_FORMAT,
): OutlineBudget {
  const fallback = Math.max(300, Number(brief?.wordsPerChapter) || 1500);
  const words = outline.reduce((sum, c) => sum + (Number(c.wordsTarget) > 0 ? Number(c.wordsTarget) : fallback), 0);
  const pages = estimatePages(words, format);
  const suggestedPrice = Number(Math.max(6.99, Math.min(24.99, 4.5 + pages * 0.035)).toFixed(2));
  return {
    chapters: outline.length,
    words,
    pages,
    minutes: Math.round(words / 220),
    suggestedPrice,
    royalty: Number(estimateRoyalty(suggestedPrice, pages).toFixed(2)),
  };
}

/* ------------------------------------------------------------------ */
/* 5. Consignes transmises à l'IA rédactrice                           */
/* ------------------------------------------------------------------ */

/** Bloc de consignes strictes pour un chapitre (points, note, ton, mise en forme). */
export function chapterInstructions(chapter: BriefOutlineChapter): string {
  const lines: string[] = [];
  if (chapter.readerQuestion) lines.push(`Question du lecteur à laquelle ce chapitre répond : ${chapter.readerQuestion}`);
  if (chapter.keyword) lines.push(`Mot-clé à employer naturellement (jamais en bourrage) : ${chapter.keyword}`);
  if (chapter.tone) lines.push(`Ton imposé pour ce chapitre : ${chapter.tone}`);
  if (chapter.wordsTarget) lines.push(`Longueur visée : environ ${chapter.wordsTarget} mots.`);
  const points = (chapter.points || []).filter(Boolean);
  if (points.length) {
    lines.push('Points à traiter obligatoirement, dans cet ordre :');
    points.forEach((p, i) => lines.push(`  ${i + 1}. ${p}`));
  }
  const blocks = (chapter.blocks || [])
    .map((id) => OUTLINE_BLOCKS.find((b) => b.id === id))
    .filter(Boolean) as OutlineBlockDef[];
  if (blocks.length) {
    lines.push('Mise en forme imposée (respecte la syntaxe demandée) :');
    blocks.forEach((b) => lines.push(`  - ${b.instruction}`));
  }
  if (chapter.note) lines.push(`Consigne de l'auteur (à respecter mot pour mot) : ${chapter.note}`);
  if (chapter.locked) lines.push("Ce chapitre est verrouillé par l'auteur : n'en change ni le titre ni l'angle.");
  return lines.join('\n');
}

/** Sommaire complet mis en forme pour un prompt de rédaction. */
export function outlineForPrompt(outline: BriefOutlineChapter[]): string {
  return outline
    .map((chapter) => {
      const head = `Chapitre ${chapter.numero} — ${chapter.titre}`;
      const goal = `Objectif : ${chapter.objectif || 'Objectif éditorial à préciser.'}`;
      const extra = chapterInstructions(chapter);
      return [head, goal, extra].filter(Boolean).join('\n');
    })
    .join('\n\n');
}

/* ------------------------------------------------------------------ */
/* 6. Export lisible du sommaire                                       */
/* ------------------------------------------------------------------ */

export function outlineToText(brief: BookBrief | null | undefined, outline: BriefOutlineChapter[]): string {
  const header = [
    (brief?.title || 'Livre sans titre').toUpperCase(),
    brief?.subtitle ? brief.subtitle : '',
    '',
    'SOMMAIRE',
    '',
  ].filter((l) => l !== undefined);
  const body = outline.map((c) => {
    const bits = [`${c.numero}. ${c.titre}`];
    if (c.objectif) bits.push(`   Objectif : ${c.objectif}`);
    (c.points || []).forEach((p) => bits.push(`   - ${p}`));
    if (c.blocks?.length) bits.push(`   Mise en forme : ${c.blocks.map(blockLabel).join(', ')}`);
    if (c.note) bits.push(`   Note : ${c.note}`);
    return bits.join('\n');
  });
  return [...header, ...body].join('\n');
}

export function outlineWordsTotal(brief: BookBrief | null | undefined, outline: BriefOutlineChapter[]): number {
  return outlineBudget(brief, outline).words;
}

export { countWords };
