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

/** Étape en cours : la première non terminée et non passée. */
export function currentInterviewStep(brief: BookBrief): InterviewStep {
  const skipped = brief.interviewSkipped || [];
  const step = INTERVIEW_STEPS.find((s) => !s.isDone(brief) && !skipped.includes(s.id));
  return step || INTERVIEW_STEPS[INTERVIEW_STEPS.length - 1];
}

/** Libellé « Étape 3 sur 6 – Votre lecteur ». */
export function stepLabel(step: InterviewStep): string {
  return `Étape ${step.id} sur ${INTERVIEW_TOTAL} – ${step.title}`;
}
