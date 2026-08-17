/**
 * Entretien guidé du Génie (référence Wordgenie) : 6 étapes, une question à la fois,
 * un exemple dépliable, la possibilité de passer, et des cartes de choix cliquables.
 * Aucune donnée n'est inventée : chaque réponse alimente la fiche du livre (BookBrief).
 */
import type { BookBrief } from '@/lib/v3/bookBrief';

export type InterviewChoice = {
  /** Champ de la fiche renseigné par ce choix. */
  field: 'language' | 'tone' | 'category' | 'chapters';
  label: string;
  options: Array<{ value: string; label: string }>;
};

export type InterviewStep = {
  id: number;
  title: string;
  question: string;
  hint?: string;
  example: string;
  /** L'étape peut être passée (l'IA travaille avec ce qui a déjà été dit). */
  skippable: boolean;
  choice?: InterviewChoice;
  /** L'étape est terminée quand ceci renvoie vrai. */
  isDone: (brief: BookBrief) => boolean;
};

export const BOOK_LANGUAGES: Array<{ value: string; label: string }> = [
  { value: 'fr', label: '🇫🇷 Français' },
  { value: 'en', label: '🇬🇧 Anglais' },
  { value: 'es', label: '🇪🇸 Espagnol' },
  { value: 'de', label: '🇩🇪 Allemand' },
  { value: 'it', label: '🇮🇹 Italien' },
  { value: 'pt', label: '🇵🇹 Portugais' },
  { value: 'nl', label: '🇳🇱 Néerlandais' },
  { value: 'pl', label: '🇵🇱 Polonais' },
  { value: 'ja', label: '🇯🇵 Japonais' },
  { value: 'ar', label: '🇸🇦 Arabe' },
];

export const INTERVIEW_TONES = [
  'Inspirant', 'Pédagogique', 'Émotionnel', 'Direct', 'Humoristique', 'Premium', 'Romanesque', 'Expert',
];

export const INTERVIEW_STEPS: InterviewStep[] = [
  {
    id: 1,
    title: 'Vous et votre livre',
    question: 'Parlez-moi de vous et de ce que vous aimeriez écrire. Je rédigerai le manuscrit dans votre voix.',
    hint: 'Pas encore sûr ? Dites-moi simplement ce que vous faites et ce qui vous passionne.',
    example:
      "J'ai 58 ans, j'ai élevé seule mes trois enfants et j'aimerais raconter ma vie : l'enfance en Bretagne, l'exil, les recommencements — pour transmettre quelque chose à mes petits-enfants.",
    skippable: false,
    isDone: (b) => Boolean((b.title || '').trim() && (b.description || '').trim()),
  },
  {
    id: 2,
    title: 'La langue de votre livre',
    question: 'Dans quelle langue votre livre doit-il être écrit ?',
    example: 'Français — vous pourrez le traduire ensuite dans les 10 langues incluses.',
    skippable: false,
    choice: { field: 'language', label: 'Choisissez la langue du livre', options: BOOK_LANGUAGES },
    isDone: (b) => Boolean((b.language || '').trim()),
  },
  {
    id: 3,
    title: 'Votre approche',
    question: 'Avez-vous une approche unique ? Une méthode, un cadre, une façon de voir les choses qui vous est propre ?',
    hint: 'Si rien ne vient, déposez simplement ce qui vous semble pertinent — ou passez cette question.',
    example:
      'Je raconte toujours par petites scènes très concrètes : une odeur, une phrase entendue, puis la leçon qui en découle.',
    skippable: true,
    isDone: (b) => Boolean((b.promesseCentrale || '').trim()),
  },
  {
    id: 4,
    title: 'Votre lecteur',
    question: 'À qui parlez-vous ? Décrivez la personne que vous imaginez en train de lire ce livre.',
    hint: 'Âge, situation, ce qu’elle cherche, ce qui la bloque.',
    example: 'Mes enfants et petits-enfants, mais aussi toute femme qui repart de zéro après 50 ans.',
    skippable: true,
    isDone: (b) => Boolean((b.cibleProfil || '').trim()),
  },
  {
    id: 5,
    title: 'Ton et style',
    question: 'Quel ton voulez-vous donner à votre livre ?',
    example: 'Émotionnel, à la première personne, avec des chapitres courts.',
    skippable: true,
    choice: { field: 'tone', label: 'Choisissez le ton', options: INTERVIEW_TONES.map((t) => ({ value: t, label: t })) },
    isDone: (b) => Boolean((b.tone || '').trim()),
  },
  {
    id: 6,
    title: 'Le sommaire, puis validation',
    question: 'Construisons le sommaire ensemble : je propose les chapitres, vous ajustez, puis vous validez.',
    example: 'Demandez « propose-moi 18 chapitres chronologiques » puis validez le sommaire pour lancer la rédaction.',
    skippable: false,
    isDone: (b) => Boolean(b.outlineValidated && (b.outline || []).length > 0),
  },
];

export const INTERVIEW_TOTAL = INTERVIEW_STEPS.length;

/* ------------------------------------------------------------------ */
/* Entretien « Biographie — Le récit de votre vie »                     */
/* ------------------------------------------------------------------ */

/** Une étape est racontée dès que l'auteur a envoyé un souvenir pour elle. */
const told = (id: number) => (b: BookBrief) => (b.biographySteps || []).includes(id);

export const BIOGRAPHY_STEPS: InterviewStep[] = [
  {
    id: 1,
    title: 'La langue de votre biographie',
    question: 'Dans quelle langue voulez-vous raconter votre vie ?',
    example: 'Français — la traduction dans 10 langues reste possible ensuite.',
    skippable: false,
    choice: { field: 'language', label: 'Choisissez la langue', options: BOOK_LANGUAGES },
    isDone: (b) => Boolean((b.language || '').trim()),
  },
  {
    id: 2,
    title: 'Vos origines',
    question: 'Où et quand êtes-vous né ? Parlez-moi de votre famille et de l’époque.',
    hint: 'Année, ville, parents, frères et sœurs, métier des parents, contexte.',
    example: 'Je suis né en 1952 à Berck-sur-Mer, ma mère élevait seule trois enfants après la guerre.',
    skippable: false,
    isDone: told(2),
  },
  {
    id: 3,
    title: 'Votre enfance',
    question: 'Racontez votre enfance : la maison, les jours ordinaires, les joies, les peines.',
    hint: 'Prenez tout le temps qu’il faut : vos mots seront conservés tels quels.',
    example: 'À six ans, on m’a envoyé chez ma tante Yvonne, je dormais dans la pièce du fond…',
    skippable: false,
    isDone: told(3),
  },
  {
    id: 4,
    title: 'École, apprentissage, premiers métiers',
    question: 'Comment s’est passée l’école, puis vos premiers travaux ?',
    hint: 'Les maîtres, les copains, le premier salaire, les patrons.',
    example: 'Monsieur Delattre m’a appris à lire vraiment ; à 14 ans, j’entrais en apprentissage.',
    skippable: true,
    isDone: told(4),
  },
  {
    id: 5,
    title: 'Rencontres et amours',
    question: 'Quelles rencontres ont compté ? Comment avez-vous rencontré ceux que vous aimez ?',
    example: 'J’ai rencontré Michelle au bal du 14 juillet 1972, à la salle des fêtes.',
    skippable: true,
    isDone: told(5),
  },
  {
    id: 6,
    title: 'Épreuves et tournants',
    question: 'Quelles épreuves avez-vous traversées ? Quels moments ont tout changé ?',
    example: 'La perte de mon frère en 1981 a changé ma façon de vivre.',
    skippable: true,
    isDone: told(6),
  },
  {
    id: 7,
    title: 'Votre vie adulte',
    question: 'Votre vie d’adulte : le travail, la maison, les enfants, les habitudes.',
    example: 'Vingt-huit ans dans la même usine, deux enfants, la maison achetée en 1985.',
    skippable: true,
    isDone: told(7),
  },
  {
    id: 8,
    title: 'Aujourd’hui, et ce que vous transmettez',
    question: 'Où en êtes-vous aujourd’hui, et que voulez-vous transmettre par ce livre ?',
    example: 'Je veux que mes petits-enfants sachent d’où ils viennent.',
    skippable: true,
    isDone: told(8),
  },
  {
    id: 9,
    title: 'Le sommaire de votre vie, puis validation',
    question: 'Construisons le sommaire période par période, dans l’ordre de votre vie, puis vous validez.',
    example: 'Chapitre 1 — 1952-1958, Berck-sur-Mer ; Chapitre 2 — 1958-1962, chez tante Yvonne…',
    skippable: false,
    isDone: (b) => Boolean(b.outlineValidated && (b.outline || []).length > 0),
  },
];

export const BIOGRAPHY_TOTAL = BIOGRAPHY_STEPS.length;

/** Le jeu d'étapes qui correspond au projet (livre classique ou biographie). */
export function interviewSteps(brief: BookBrief): InterviewStep[] {
  return brief.mode === 'biography' ? BIOGRAPHY_STEPS : INTERVIEW_STEPS;
}

/** Étape en cours : la première non terminée et non passée. */
export function currentInterviewStep(brief: BookBrief): InterviewStep {
  const steps = interviewSteps(brief);
  const skipped = brief.interviewSkipped || [];
  const step = steps.find((s) => !s.isDone(brief) && !skipped.includes(s.id));
  return step || steps[steps.length - 1];
}

/** Libellé « Étape 3 sur 6 – Votre lecteur ». */
export function stepLabel(step: InterviewStep, brief?: BookBrief): string {
  const total = brief?.mode === 'biography' ? BIOGRAPHY_TOTAL : INTERVIEW_TOTAL;
  return `Étape ${step.id} sur ${total} – ${step.title}`;
}
