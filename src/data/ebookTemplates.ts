import templateBusiness from '@/assets/template-business.jpg';
import templateGuide from '@/assets/template-guide.jpg';
import templateFiction from '@/assets/template-fiction.jpg';
import templateMemoir from '@/assets/template-memoir.jpg';

export interface EbookTemplate {
  id: string;
  title: string;
  author: string;
  preface: string;
  conclusion: string;
  chapters: Array<{
    title: string;
    subChapters: string[];
  }>;
  image: string;
  description: string;
  borderColor: string;
  icon: string;
}

export const ebookTemplates: Record<string, EbookTemplate> = {
  business: {
    id: 'business',
    title: "Stratégie Business Efficace",
    author: "Expert Business",
    preface: "Dans un monde en constante évolution, maîtriser les stratégies business est devenu essentiel. Ce guide vous accompagne vers le succès.",
    conclusion: "Vous avez maintenant toutes les clés pour réussir. Appliquez ces stratégies et transformez votre business !",
    chapters: [
      { title: "Analyse du marché et opportunités", subChapters: ["Étude de marché", "Identification des niches", "Analyse concurrentielle"] },
      { title: "Développement du business model", subChapters: ["Canvas business model", "Proposition de valeur", "Sources de revenus"] },
      { title: "Stratégies marketing et vente", subChapters: ["Marketing digital", "Funnel de vente", "Fidélisation client"] },
      { title: "Gestion financière et croissance", subChapters: ["Prévisions financières", "Levée de fonds", "Optimisation des coûts"] },
      { title: "Leadership et équipe", subChapters: ["Recrutement", "Management", "Culture d'entreprise"] }
    ],
    image: templateBusiness,
    description: "Guide complet pour entrepreneurs et professionnels",
    borderColor: "border-l-blue-500",
    icon: "💼"
  },
  guide: {
    id: 'guide',
    title: "Guide Pratique Complet",
    author: "Guide Expert",
    preface: "Ce guide pratique vous accompagne étape par étape pour maîtriser votre sujet. Découvrez les méthodes qui fonctionnent vraiment.",
    conclusion: "Félicitations ! Vous avez maintenant toutes les compétences nécessaires. Passez à l'action et observez les résultats.",
    chapters: [
      { title: "Les fondamentaux à connaître", subChapters: ["Concepts de base", "Erreurs à éviter", "Prérequis essentiels"] },
      { title: "Préparation et planification", subChapters: ["Définir ses objectifs", "Créer un plan d'action", "Organiser ses ressources"] },
      { title: "Mise en pratique étape par étape", subChapters: ["Première étape", "Techniques avancées", "Optimisation"] },
      { title: "Résolution des problèmes courants", subChapters: ["Diagnostic des difficultés", "Solutions pratiques", "Cas d'étude"] },
      { title: "Perfectionnement et évolution", subChapters: ["Techniques avancées", "Veille et actualisation", "Communauté et ressources"] }
    ],
    image: templateGuide,
    description: "Méthodes étape par étape et conseils pratiques",
    borderColor: "border-l-green-500",
    icon: "📚"
  },
  fiction: {
    id: 'fiction',
    title: "Histoire Captivante",
    author: "Auteur Fiction",
    preface: "Plongez dans une aventure extraordinaire où chaque page vous réserve des surprises. Laissez-vous emporter par cette histoire unique.",
    conclusion: "Cette aventure touche à sa fin, mais les émotions et les leçons resteront gravées. Merci de m'avoir accompagné dans ce voyage.",
    chapters: [
      { title: "Le commencement", subChapters: ["Présentation des personnages", "Le décor", "L'élément déclencheur"] },
      { title: "Premiers défis", subChapters: ["La découverte", "Les obstacles", "Les alliés inattendus"] },
      { title: "Le tournant", subChapters: ["La révélation", "Le conflit majeur", "Les enjeux grandissent"] },
      { title: "L'épreuve finale", subChapters: ["La confrontation", "Le sacrifice", "La résolution"] },
      { title: "L'épilogue", subChapters: ["Les conséquences", "Les nouveaux équilibres", "L'ouverture vers l'avenir"] }
    ],
    image: templateFiction,
    description: "Structure narrative pour romans et nouvelles",
    borderColor: "border-l-purple-500",
    icon: "📖"
  },
  memoir: {
    id: 'memoir',
    title: "Mon Parcours de Vie",
    author: "Votre Nom",
    preface: "Partager son histoire, c'est offrir un morceau de son âme. Ces pages retracent un parcours unique fait de joies, d'épreuves et d'apprentissages.",
    conclusion: "Chaque vie est une histoire unique qui mérite d'être racontée. J'espère que mon parcours vous inspirera dans le vôtre.",
    chapters: [
      { title: "Les origines", subChapters: ["Enfance", "Famille", "Premiers souvenirs"] },
      { title: "Formation et découvertes", subChapters: ["Études", "Premières passions", "Rencontres marquantes"] },
      { title: "Les défis de l'âge adulte", subChapters: ["Premiers emplois", "Relations importantes", "Épreuves surmontées"] },
      { title: "Accomplissements et leçons", subChapters: ["Réussites professionnelles", "Vie familiale", "Sagesse acquise"] },
      { title: "Réflexions et perspective", subChapters: ["Bilan de vie", "Valeurs importantes", "Messages aux générations futures"] }
    ],
    image: templateMemoir,
    description: "Parcours de vie et accomplissements",
    borderColor: "border-l-orange-500",
    icon: "✍️"
  }
};