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
  },
  devperso: {
    id: 'devperso',
    title: "Guide du Développement Personnel",
    author: "Coach de Vie",
    preface: "Le développement personnel est un voyage vers votre meilleure version. Ce guide vous accompagne pas à pas dans votre transformation intérieure.",
    conclusion: "Vous avez maintenant les outils pour continuer votre évolution. Le chemin continue, et chaque jour est une nouvelle opportunité de grandir.",
    chapters: [
      { title: "Connaissance de soi", subChapters: ["Auto-évaluation", "Identifier ses valeurs", "Forces et faiblesses"] },
      { title: "Définir ses objectifs", subChapters: ["Vision de vie", "Objectifs SMART", "Plan d'action"] },
      { title: "Mindset et habitudes", subChapters: ["Mentalité de croissance", "Rituels quotidiens", "Gestion du temps"] },
      { title: "Intelligence émotionnelle", subChapters: ["Comprendre ses émotions", "Empathie", "Communication assertive"] },
      { title: "Passage à l'action", subChapters: ["Surmonter la procrastination", "Sortir de sa zone de confort", "Célébrer les victoires"] }
    ],
    image: templateGuide,
    description: "Transformez votre vie grâce au développement personnel",
    borderColor: "border-l-purple-500",
    icon: "🌟"
  },
  cuisine: {
    id: 'cuisine',
    title: "L'Art de la Cuisine Gastronomique",
    author: "Chef Étoilé",
    preface: "La cuisine gastronomique est un art qui allie technique, créativité et passion. Découvrez les secrets des grands chefs.",
    conclusion: "Vous voilà prêt à créer des plats d'exception. La gastronomie n'attend que votre touche personnelle !",
    chapters: [
      { title: "Bases et techniques fondamentales", subChapters: ["Coupes et préparations", "Cuissons maîtrisées", "Fonds et sauces"] },
      { title: "Produits et saisonnalité", subChapters: ["Sélection des ingrédients", "Produits d'exception", "Respecter les saisons"] },
      { title: "Créativité et présentation", subChapters: ["Dressage artistique", "Associations de saveurs", "Texture et contraste"] },
      { title: "Menus et occasions", subChapters: ["Entrées raffinées", "Plats signature", "Desserts spectaculaires"] },
      { title: "Organisation professionnelle", subChapters: ["Mise en place", "Gestion du temps", "Équipement pro"] }
    ],
    image: templateBusiness,
    description: "Maîtrisez l'art culinaire comme un chef étoilé",
    borderColor: "border-l-amber-500",
    icon: "👨‍🍳"
  },
  scifi: {
    id: 'scifi',
    title: "Odyssée Galactique",
    author: "Auteur Science-Fiction",
    preface: "Dans l'immensité de l'espace, l'humanité cherche sa place parmi les étoiles. Une aventure épique vous attend aux confins de l'univers.",
    conclusion: "Le voyage ne fait que commencer. L'univers recèle encore d'innombrables mystères à découvrir...",
    chapters: [
      { title: "Monde et contexte futuriste", subChapters: ["L'univers en 2250", "Technologie avancée", "Sociétés galactiques"] },
      { title: "L'équipage et la mission", subChapters: ["Présentation des héros", "Le vaisseau explorateur", "Objectif mystérieux"] },
      { title: "Découvertes et dangers", subChapters: ["Planètes inconnues", "Formes de vie alien", "Menaces cosmiques"] },
      { title: "Conflits et alliances", subChapters: ["Tensions intergalactiques", "Choix moraux difficiles", "Batailles spatiales"] },
      { title: "Révélations finales", subChapters: ["Vérité cachée", "Sacrifice héroïque", "Nouvel équilibre galactique"] }
    ],
    image: templateFiction,
    description: "Aventure spatiale dans l'univers de demain",
    borderColor: "border-l-indigo-500",
    icon: "🚀"
  },
  sante: {
    id: 'sante',
    title: "Santé et Bien-être au Quotidien",
    author: "Expert Santé",
    preface: "Votre santé est votre plus grande richesse. Ce guide vous donne les clés pour vivre en pleine forme, naturellement et durablement.",
    conclusion: "Prendre soin de soi n'est pas égoïste, c'est essentiel. Continuez sur cette voie vers une vie plus saine et équilibrée.",
    chapters: [
      { title: "Nutrition équilibrée", subChapters: ["Bases de la nutrition", "Aliments santé", "Planification des repas"] },
      { title: "Activité physique", subChapters: ["Trouver son sport", "Routine d'exercices", "Récupération"] },
      { title: "Sommeil et repos", subChapters: ["Hygiène du sommeil", "Qualité du repos", "Gestion de la fatigue"] },
      { title: "Gestion du stress", subChapters: ["Techniques de relaxation", "Méditation", "Équilibre vie pro/perso"] },
      { title: "Prévention et vitalité", subChapters: ["Check-ups réguliers", "Renforcement immunitaire", "Longévité active"] }
    ],
    image: templateGuide,
    description: "Guide complet pour une santé optimale",
    borderColor: "border-l-green-500",
    icon: "💚"
  }
};