/**
 * BookPerfect AI — Directeur éditorial IA
 * Types partagés du module. Conçu pour être extensible (Phase 2 :
 * personnages, chronologie, lieux, dialogues, rythme, suspense…).
 */

export type IssueCategory =
  | 'traces-ia'       // traces IA / titres provisoires / placeholders
  | 'orthographe'     // orthographe / grammaire / accords / typographie FR
  | 'style'           // style / répétitions / voix passive / lourdeurs
  | 'kdp';            // conformité Amazon KDP

export type IssueSeverity = 'critical' | 'warning' | 'info';
export type IssueStatus = 'pending' | 'applied' | 'ignored';

/** Une correction NON destructive proposée à l'auteur. */
export interface Issue {
  id: string;
  category: IssueCategory;
  severity: IssueSeverity;
  chapterId: string;
  chapterTitle: string;
  /** Extrait fautif exact (tel quel dans le manuscrit). */
  original: string;
  /** Proposition de remplacement. */
  suggestion: string;
  /** Explication pédagogique courte. */
  reason: string;
  status: IssueStatus;
  /** Source de détection : règle locale déterministe ou IA. */
  source: 'local' | 'ai';
}

export type ChapterStatus = 'pending' | 'running' | 'done' | 'failed';

export interface Chapter {
  id: string;
  index: number;
  title: string;
  /** Texte original INTACT (jamais muté). */
  content: string;
  wordCount: number;
}

export interface ChapterResult {
  chapterId: string;
  status: ChapterStatus;
  attempts: number;
  error?: string;
  /** Scores 0-100 par dimension (IA), optionnels si le chapitre a échoué. */
  scores?: {
    orthographe: number;
    style: number;
    kdp: number;
  };
}

export interface Manuscript {
  id: string;
  fileName: string;
  title: string;
  rawText: string;
  chapters: Chapter[];
  wordCount: number;
  pageEstimate: number;
  importedAt: number;
}

export interface Scores {
  global: number;
  orthographe: number;
  style: number;
  kdp: number;
  tracesIa: number;
  verdict: 'green' | 'orange' | 'red';
}

export interface Analysis {
  manuscriptId: string;
  chapterResults: ChapterResult[];
  issues: Issue[];
  scores: Scores | null;
  /** KDP : rapport de conformité agrégé. */
  kdpReport: KdpCheck[];
  updatedAt: number;
  /** Progression : index du dernier chapitre traité. */
  lastProcessedIndex: number;
}

export interface KdpCheck {
  label: string;
  ok: boolean;
  detail: string;
}

export const CATEGORY_LABELS: Record<IssueCategory, string> = {
  'traces-ia': 'Traces IA / provisoire',
  orthographe: 'Orthographe / Typo',
  style: 'Style / Répétitions',
  kdp: 'Amazon KDP',
};

export const SEVERITY_ORDER: Record<IssueSeverity, number> = {
  critical: 0,
  warning: 1,
  info: 2,
};
