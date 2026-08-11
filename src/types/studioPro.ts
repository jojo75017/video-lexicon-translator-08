/**
 * Studio Pro — parcours hybride Gemini (architecte) + ChatGPT (plume).
 * Types partagés entre la fiche maître, la Bible et les chapitres.
 */

export type BookKind =
  | 'roman'
  | 'thriller'
  | 'biographie'
  | 'pratique'
  | 'guide'
  | 'educatif'
  | 'professionnel';

export const BOOK_KIND_LABELS: Record<BookKind, string> = {
  roman: 'Roman',
  thriller: 'Thriller / Policier',
  biographie: 'Biographie / Récit de vie',
  pratique: 'Livre pratique',
  guide: 'Guide / Méthode',
  educatif: 'Livre éducatif',
  professionnel: 'Ebook professionnel',
};

export const FICTION_KINDS: BookKind[] = ['roman', 'thriller', 'biographie'];

export const isFictionKind = (kind?: string | null): boolean =>
  FICTION_KINDS.includes((kind || 'roman') as BookKind);

export type BookMode = 'guide' | 'auto';
export type BookProjectStatus = 'brief' | 'bible' | 'redaction' | 'audit' | 'termine';

export interface BookProject {
  id: string;
  user_id: string;
  title: string;
  subtitle: string | null;
  book_kind: string;
  genre: string | null;
  target_audience: string | null;
  objective: string | null;
  chapters_target: number;
  length_target: string | null;
  tone: string | null;
  writing_style: string | null;
  language_level: string | null;
  narrative_pov: string | null;
  era: string | null;
  places: string | null;
  main_characters: string | null;
  constraints: string | null;
  source_notes: string | null;
  mode: string;
  status: string;
  with_images: boolean;
  created_at: string;
  updated_at: string;
}

export type MasterSheetDraft = Omit<
  BookProject,
  'id' | 'user_id' | 'created_at' | 'updated_at' | 'status'
>;

export interface BibleChapter {
  partie?: string;
  numero: number;
  titre: string;
  objectif?: string;
  resume?: string;
  sous_chapitres?: string[];
  mots_vises?: number;
}

export interface BibleCharacter {
  nom?: string;
  role?: string;
  age?: string;
  personnalite?: string;
  motivations?: string;
  relations?: string;
  secrets?: string;
  arc?: string;
}

export interface BibleTimelineEntry { repere?: string; evenement?: string; consequence?: string }
export interface BiblePlace { nom?: string; description?: string; importance?: string }
export interface BiblePlotThread {
  fil?: string;
  plante_au_chapitre?: number;
  recolte_au_chapitre?: number;
  type?: string;
  resolution?: string;
}
export interface BiblePedagogyStep { etape?: string; acquis?: string; prerequis?: string; chapitre?: number }

export interface BibleContent {
  concept: string;
  promise: string;
  synopsis: string;
  structure: BibleChapter[];
  characters: BibleCharacter[];
  timeline: BibleTimelineEntry[];
  places: BiblePlace[];
  plot_threads: BiblePlotThread[];
  pedagogy: BiblePedagogyStep[];
  notes: string;
}

export interface BookBible extends BibleContent {
  id: string;
  project_id: string;
  version: number;
  engine: string;
  validated_at: string | null;
  created_at: string;
}

export type ChapterStatus = 'a_ecrire' | 'brouillon' | 'a_corriger' | 'valide';

export const CHAPTER_STATUS_LABELS: Record<ChapterStatus, string> = {
  a_ecrire: 'À écrire',
  brouillon: 'Brouillon',
  a_corriger: 'Correction nécessaire',
  valide: 'Terminé',
};

export const CHAPTER_STATUS_ICONS: Record<ChapterStatus, string> = {
  a_ecrire: '⏳',
  brouillon: '📝',
  a_corriger: '⚠️',
  valide: '✅',
};

export interface BookChapter {
  id: string;
  project_id: string;
  position: number;
  title: string;
  objective: string | null;
  planned_summary: string | null;
  subsections: unknown;
  status: string;
  word_target: number | null;
  word_count: number;
}

/** Mémoire persistante d'un chapitre rédigé (produite par Gemini). */
export interface ChapterMemory {
  id: string;
  project_id: string;
  chapter_id: string;
  chapter_position: number;
  summary: string | null;
  events: string[] | null;
  characters_present: string[] | null;
  revealed_info: string[] | null;
  places: string[] | null;
  dates: string[] | null;
  objects: string[] | null;
  clues: string[] | null;
  decisions: string[] | null;
  relationship_changes: string[] | null;
  open_questions: string[] | null;
  created_at?: string;
}


export const EMPTY_BIBLE: BibleContent = {
  concept: '',
  promise: '',
  synopsis: '',
  structure: [],
  characters: [],
  timeline: [],
  places: [],
  plot_threads: [],
  pedagogy: [],
  notes: '',
};

export const emptyMasterSheet = (): MasterSheetDraft => ({
  title: '',
  subtitle: '',
  book_kind: 'roman',
  genre: '',
  target_audience: '',
  objective: '',
  chapters_target: 12,
  length_target: '',
  tone: '',
  writing_style: '',
  language_level: '',
  narrative_pov: '',
  era: '',
  places: '',
  main_characters: '',
  constraints: '',
  source_notes: '',
  mode: 'guide',
  with_images: false,
});
