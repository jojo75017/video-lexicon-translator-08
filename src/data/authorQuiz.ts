// Quiz "Quel auteur êtes-vous ?" — capture de leads + recommandation EbookStudio
// Chaque réponse attribue des points à un ou plusieurs profils.

export type ProfileKey = "methodique" | "createur" | "pragmatique" | "perfectionniste";

export interface QuizOption {
  label: string;
  scores: Partial<Record<ProfileKey, number>>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export interface AuthorProfile {
  key: ProfileKey;
  title: string;
  emoji: string;
  tagline: string;
  description: string;
  strengths: string[];
  advice: string;
  // Mis en avant comme "tag" envoyé à Systeme.io
  tag: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "Quand vous avez une idée de livre, votre premier réflexe est…",
    options: [
      { label: "Faire un plan détaillé chapitre par chapitre", scores: { methodique: 2, perfectionniste: 1 } },
      { label: "Laisser libre cours à mon imagination et écrire", scores: { createur: 2 } },
      { label: "Chercher la façon la plus rapide de le finir", scores: { pragmatique: 2 } },
      { label: "Vérifier que tout sera parfait avant de commencer", scores: { perfectionniste: 2 } },
    ],
  },
  {
    id: "q2",
    question: "Ce qui vous bloque le plus pour publier un livre :",
    options: [
      { label: "Le manque de méthode claire", scores: { methodique: 2 } },
      { label: "La peur de la page blanche", scores: { createur: 2 } },
      { label: "Le manque de temps", scores: { pragmatique: 2 } },
      { label: "Je ne suis jamais satisfait du résultat", scores: { perfectionniste: 2 } },
    ],
  },
  {
    id: "q3",
    question: "Votre relation à l'écriture, c'est plutôt…",
    options: [
      { label: "Une discipline : un créneau, des objectifs", scores: { methodique: 2 } },
      { label: "Une passion : j'écris quand l'inspiration vient", scores: { createur: 2 } },
      { label: "Un moyen : je veux un résultat concret et utile", scores: { pragmatique: 2 } },
      { label: "Un art : chaque phrase doit être ciselée", scores: { perfectionniste: 2 } },
    ],
  },
  {
    id: "q4",
    question: "Quel type de livre voulez-vous publier en priorité ?",
    options: [
      { label: "Un guide pratique / non-fiction structuré", scores: { methodique: 1, pragmatique: 1 } },
      { label: "Un roman ou une histoire originale", scores: { createur: 2 } },
      { label: "Un livre court pour générer des revenus vite", scores: { pragmatique: 2 } },
      { label: "Une œuvre de référence soignée", scores: { perfectionniste: 2 } },
    ],
  },
  {
    id: "q5",
    question: "Face à un outil d'IA pour écrire, vous êtes…",
    options: [
      { label: "Partant si ça structure mon travail", scores: { methodique: 2 } },
      { label: "Curieux, tant que ça respecte mon style", scores: { createur: 2 } },
      { label: "Emballé : gagner du temps, c'est l'objectif", scores: { pragmatique: 2 } },
      { label: "Prudent : la qualité avant tout", scores: { perfectionniste: 2 } },
    ],
  },
  {
    id: "q6",
    question: "Votre objectif n°1 avec votre livre :",
    options: [
      { label: "Avoir enfin une méthode pour aller au bout", scores: { methodique: 2 } },
      { label: "Partager une histoire qui me tient à cœur", scores: { createur: 2 } },
      { label: "Créer une source de revenus passifs", scores: { pragmatique: 2 } },
      { label: "Publier un livre dont je serai vraiment fier", scores: { perfectionniste: 2 } },
    ],
  },
];

export const PROFILES: Record<ProfileKey, AuthorProfile> = {
  methodique: {
    key: "methodique",
    title: "L'Auteur Méthodique",
    emoji: "🧭",
    tagline: "Vous avancez mieux avec un cap et une structure claire.",
    description:
      "Vous aimez quand les choses sont organisées. Votre force, c'est la rigueur — mais sans méthode adaptée, vous pouvez tourner en rond. Avec un cadre clair, vous êtes capable de finir un livre complet sans vous épuiser.",
    strengths: ["Organisation", "Régularité", "Vision d'ensemble"],
    advice:
      "EbookStudio vous offre exactement ce qu'il vous faut : un pipeline en 15 étapes qui transforme votre idée en manuscrit structuré, chapitre par chapitre.",
    tag: "quiz-auteur-methodique",
  },
  createur: {
    key: "createur",
    title: "L'Auteur Créatif",
    emoji: "🎨",
    tagline: "Les idées fusent — il vous faut juste un cadre pour les concrétiser.",
    description:
      "Vous débordez d'imagination. Votre force, c'est l'originalité — mais l'exécution et la mise en forme peuvent vous freiner. Un assistant qui respecte votre voix tout en structurant l'ouvrage change tout.",
    strengths: ["Imagination", "Style", "Originalité"],
    advice:
      "EbookStudio préserve votre voix d'auteur (Echo Author Voice) tout en vous aidant à structurer et finaliser votre œuvre sans perdre votre inspiration.",
    tag: "quiz-auteur-createur",
  },
  pragmatique: {
    key: "pragmatique",
    title: "L'Auteur Pragmatique",
    emoji: "⚡",
    tagline: "Vous voulez des résultats concrets, vite et bien.",
    description:
      "Vous êtes orienté résultat. Votre force, c'est l'efficacité — le temps est votre principale contrainte. Le bon outil peut vous faire passer de l'idée au livre publié en un temps record.",
    strengths: ["Efficacité", "Pragmatisme", "Orientation résultat"],
    advice:
      "EbookStudio automatise la rédaction, la couverture et l'export KDP. De l'idée au livre prêt à publier sur Amazon, en un temps record.",
    tag: "quiz-auteur-pragmatique",
  },
  perfectionniste: {
    key: "perfectionniste",
    title: "L'Auteur Perfectionniste",
    emoji: "💎",
    tagline: "La qualité avant tout — quitte à ne jamais publier.",
    description:
      "Vous visez l'excellence. Votre force, c'est l'exigence — mais elle peut vous empêcher de finir. Un outil qui garantit un rendu professionnel vous libère de cette pression.",
    strengths: ["Exigence", "Précision", "Sens du détail"],
    advice:
      "EbookStudio intègre relecture, contrôle qualité et conformité KDP professionnelle pour un rendu impeccable — sans le perfectionnisme paralysant.",
    tag: "quiz-auteur-perfectionniste",
  },
};

export function computeProfile(scores: Record<ProfileKey, number>): ProfileKey {
  const order: ProfileKey[] = ["methodique", "createur", "pragmatique", "perfectionniste"];
  let best: ProfileKey = "methodique";
  let bestScore = -1;
  for (const key of order) {
    if ((scores[key] || 0) > bestScore) {
      bestScore = scores[key] || 0;
      best = key;
    }
  }
  return best;
}
