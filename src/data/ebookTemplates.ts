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
  aquariophilie: {
    id: 'aquariophilie',
    title: "Guide de l'Aquariophilie",
    author: "Expert Aquariophile",
    preface: "L'aquariophilie est un art passionnant qui allie science et beauté. Ce guide vous accompagne dans la création et l'entretien de votre écosystème aquatique.",
    conclusion: "Votre aquarium est maintenant un écosystème équilibré. Continuez à observer, apprendre et profiter de ce merveilleux hobby !",
    chapters: [
      { title: "Débuter en aquariophilie", subChapters: ["Choix de l'aquarium", "Équipement essentiel", "Cycle de l'azote"] },
      { title: "Paramètres et entretien", subChapters: ["Qualité de l'eau", "Filtration", "Maintenance régulière"] },
      { title: "Population et cohabitation", subChapters: ["Sélection des poissons", "Compatibilité", "Introduction progressive"] },
      { title: "Plantes et décoration", subChapters: ["Plantes aquatiques", "Hardscape", "Éclairage adapté"] },
      { title: "Problèmes et solutions", subChapters: ["Maladies courantes", "Algues", "Dépannage technique"] }
    ],
    image: templateGuide,
    description: "Guide complet pour aquariophiles débutants et confirmés",
    borderColor: "border-l-cyan-500",
    icon: "🐠"
  },
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
  travel: {
    id: 'travel',
    title: "Guide de Voyage Ultime",
    author: "Voyageur Expert",
    preface: "Voyager, c'est découvrir le monde et se découvrir soi-même. Ce guide vous livre tous les secrets pour des voyages inoubliables.",
    conclusion: "Le monde vous attend ! Avec ces conseils, partez à l'aventure en toute confiance et créez des souvenirs mémorables.",
    chapters: [
      { title: "Préparation du voyage", subChapters: ["Choix de destination", "Budget et financement", "Documents et assurances"] },
      { title: "Logistique et réservations", subChapters: ["Transport", "Hébergement", "Activités"] },
      { title: "Voyage responsable", subChapters: ["Écotourisme", "Respect des cultures", "Impact environnemental"] },
      { title: "Sécurité et santé", subChapters: ["Précautions sanitaires", "Sécurité personnelle", "Gestion des urgences"] },
      { title: "Optimiser son expérience", subChapters: ["Immersion culturelle", "Photography de voyage", "Carnet de voyage"] }
    ],
    image: templateMemoir,
    description: "Conseils et astuces pour voyageurs indépendants",
    borderColor: "border-l-emerald-500",
    icon: "✈️"
  },
  roman: {
    id: 'roman',
    title: "Roman Contemporain",
    author: "Auteur Contemporain",
    preface: "Cette histoire explore les méandres de l'âme humaine dans notre société moderne. Une intrigue captivante vous attend.",
    conclusion: "Les personnages continuent leur vie au-delà de ces pages. Leur histoire résonne encore, comme un écho de nos propres questionnements.",
    chapters: [
      { title: "Rencontres et destins", subChapters: ["Présentation des protagonistes", "Le cadre contemporain", "Premières interactions"] },
      { title: "Complications et tensions", subChapters: ["Conflits émergents", "Secrets révélés", "Relations complexes"] },
      { title: "Développements et révélations", subChapters: ["Approfondissement psychologique", "Tournants majeurs", "Enjeux personnels"] },
      { title: "Climax et confrontations", subChapters: ["Moment de vérité", "Choix décisifs", "Conséquences"] },
      { title: "Résolution et nouveaux horizons", subChapters: ["Dénouement", "Transformation des personnages", "Ouverture"] }
    ],
    image: templateFiction,
    description: "Structure narrative pour roman contemporain",
    borderColor: "border-l-rose-500",
    icon: "📚"
  }
};