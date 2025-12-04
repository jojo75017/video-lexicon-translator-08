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
  enfants: {
    id: 'enfants',
    title: "Livre pour Enfants",
    author: "Auteur Jeunesse",
    preface: "Bienvenue dans un monde merveilleux où l'imagination n'a pas de limites ! Cette histoire est faite pour rêver, rire et apprendre.",
    conclusion: "Et voilà, l'aventure se termine... mais les rêves, eux, continuent ! À bientôt pour de nouvelles histoires !",
    chapters: [
      { title: "La rencontre magique", subChapters: ["Un personnage attachant", "Un monde coloré", "Une amitié naissante"] },
      { title: "L'aventure commence", subChapters: ["Le défi inattendu", "Les premiers obstacles", "Des alliés surprenants"] },
      { title: "Le grand voyage", subChapters: ["Découvertes étonnantes", "Moments rigolos", "Une leçon importante"] },
      { title: "L'épreuve finale", subChapters: ["Le courage du héros", "L'entraide", "La victoire du cœur"] },
      { title: "Le retour à la maison", subChapters: ["La joie du retour", "Les souvenirs précieux", "Et après..."] }
    ],
    image: templateFiction,
    description: "Histoires enchantées pour les petits et grands enfants",
    borderColor: "border-l-yellow-400",
    icon: "🧸"
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
  },
  finance: {
    id: 'finance',
    title: "Investissement et Gestion Financière",
    author: "Expert Financier",
    preface: "L'indépendance financière commence par l'éducation. Ce guide vous révèle les stratégies d'investissement et de gestion pour bâtir votre patrimoine.",
    conclusion: "Votre avenir financier est entre vos mains. Avec ces connaissances, investissez intelligemment et construisez la vie que vous méritez.",
    chapters: [
      { title: "Bases de la finance personnelle", subChapters: ["Budget et épargne", "Sortir des dettes", "Fonds d'urgence"] },
      { title: "Investissement en bourse", subChapters: ["Actions et ETF", "Diversification", "Analyse fondamentale"] },
      { title: "Immobilier et patrimoine", subChapters: ["Investissement locatif", "SCPI", "Fiscalité immobilière"] },
      { title: "Cryptomonnaies et finance décentralisée", subChapters: ["Bitcoin et Ethereum", "DeFi", "Sécurité crypto"] },
      { title: "Stratégies long terme", subChapters: ["Retraite anticipée", "Revenus passifs", "Optimisation fiscale"] }
    ],
    image: templateBusiness,
    description: "Devenez autonome financièrement grâce aux investissements",
    borderColor: "border-l-yellow-500",
    icon: "💰"
  },
  parentalite: {
    id: 'parentalite',
    title: "Guide de la Parentalité Positive",
    author: "Expert Parentalité",
    preface: "Être parent est la plus belle aventure de la vie. Ce guide vous accompagne avec bienveillance dans l'éducation de vos enfants.",
    conclusion: "Chaque enfant est unique, chaque parent fait de son mieux. Continuez avec amour, patience et confiance en vous.",
    chapters: [
      { title: "Les premiers mois", subChapters: ["Grossesse et préparation", "Accouchement", "Post-partum"] },
      { title: "Développement de l'enfant", subChapters: ["Étapes clés 0-3 ans", "Apprentissages", "Motricité"] },
      { title: "Éducation bienveillante", subChapters: ["Communication non-violente", "Gestion des émotions", "Poser des limites"] },
      { title: "Vie quotidienne", subChapters: ["Sommeil", "Alimentation", "Autonomie"] },
      { title: "Défis et solutions", subChapters: ["Crises et colères", "Fratrie", "Écrans et digital"] }
    ],
    image: templateGuide,
    description: "Accompagnez votre enfant avec bienveillance",
    borderColor: "border-l-pink-500",
    icon: "👶"
  },
  marketing: {
    id: 'marketing',
    title: "Marketing Digital Performant",
    author: "Expert Marketing",
    preface: "Le marketing digital transforme les business. Maîtrisez les stratégies qui génèrent croissance et revenus en ligne.",
    conclusion: "Le digital évolue constamment. Restez agile, testez, analysez et optimisez pour rester au sommet.",
    chapters: [
      { title: "Fondamentaux du marketing digital", subChapters: ["Persona et positionnement", "Funnel marketing", "KPI essentiels"] },
      { title: "SEO et référencement", subChapters: ["Optimisation on-page", "Link building", "SEO local"] },
      { title: "Réseaux sociaux et influence", subChapters: ["Stratégie social media", "Content marketing", "Influence et partenariats"] },
      { title: "Publicité en ligne", subChapters: ["Google Ads", "Facebook Ads", "Retargeting"] },
      { title: "Conversion et growth hacking", subChapters: ["CRO et A/B testing", "Email marketing", "Automation"] }
    ],
    image: templateBusiness,
    description: "Développez votre business grâce au digital",
    borderColor: "border-l-red-500",
    icon: "📱"
  },
  fitness: {
    id: 'fitness',
    title: "Programme Fitness et Musculation",
    author: "Coach Sportif",
    preface: "Transformez votre corps et votre esprit. Ce programme vous guide vers vos objectifs fitness avec méthode et motivation.",
    conclusion: "La transformation physique est un marathon, pas un sprint. Restez constant, les résultats suivront !",
    chapters: [
      { title: "Démarrer en fitness", subChapters: ["Évaluation physique", "Objectifs réalistes", "Équipement de base"] },
      { title: "Programmes d'entraînement", subChapters: ["Split routine", "Full body", "HIIT et cardio"] },
      { title: "Nutrition sportive", subChapters: ["Macronutriments", "Timing des repas", "Supplémentation"] },
      { title: "Techniques avancées", subChapters: ["Progressive overload", "Périodisation", "Récupération active"] },
      { title: "Mindset et progression", subChapters: ["Motivation durable", "Suivi des progrès", "Éviter les blessures"] }
    ],
    image: templateGuide,
    description: "Sculptez le corps de vos rêves",
    borderColor: "border-l-orange-500",
    icon: "💪"
  },
  romance: {
    id: 'romance',
    title: "Romance Contemporaine",
    author: "Auteure Romance",
    preface: "L'amour frappe quand on s'y attend le moins. Plongez dans une histoire où passion et émotion se rencontrent.",
    conclusion: "Et ils vécurent heureux... Mais leur histoire ne s'arrête pas là, elle ne fait que commencer.",
    chapters: [
      { title: "Rencontre inattendue", subChapters: ["Premier regard", "Attirance mutuelle", "Premiers échanges"] },
      { title: "Rapprochement progressif", subChapters: ["Complicité grandissante", "Moments partagés", "Premiers doutes"] },
      { title: "Obstacles et malentendus", subChapters: ["Secrets du passé", "Incompréhensions", "Séparation temporaire"] },
      { title: "Révélations et vérités", subChapters: ["Confessions", "Vulnérabilité", "Choix du cœur"] },
      { title: "Happy ending", subChapters: ["Réunion émotionnelle", "Déclarations", "Avenir ensemble"] }
    ],
    image: templateFiction,
    description: "Histoire d'amour moderne et passionnée",
    borderColor: "border-l-fuchsia-500",
    icon: "💕"
  },
  thriller: {
    id: 'thriller',
    title: "Thriller Psychologique",
    author: "Auteur Suspense",
    preface: "La vérité se cache dans l'ombre. Une enquête haletante où rien n'est ce qu'il paraît vous attend.",
    conclusion: "Le mystère est résolu, mais certaines questions restent sans réponse. La réalité est parfois plus troublante que la fiction.",
    chapters: [
      { title: "Le crime", subChapters: ["Découverte macabre", "Scène de crime", "Premières pistes"] },
      { title: "L'enquête commence", subChapters: ["Interrogatoires", "Indices contradictoires", "Suspects multiples"] },
      { title: "Rebondissements", subChapters: ["Fausses pistes", "Nouveau meurtre", "Tension montante"] },
      { title: "La vérité émerge", subChapters: ["Révélation choc", "Course contre la montre", "Confrontation finale"] },
      { title: "Épilogue troublant", subChapters: ["Arrestation", "Motivations révélées", "Fin ambiguë"] }
    ],
    image: templateFiction,
    description: "Suspense et frissons garantis",
    borderColor: "border-l-slate-500",
    icon: "🔍"
  },
  fantasy: {
    id: 'fantasy',
    title: "Épopée Fantasy Épique",
    author: "Auteur Fantasy",
    preface: "Dans un monde où la magie existe et où les dragons règnent dans le ciel, une quête légendaire va changer le destin des royaumes.",
    conclusion: "La prophétie s'est accomplie. Mais dans ce monde de magie, chaque fin n'est qu'un nouveau commencement...",
    chapters: [
      { title: "Le monde magique", subChapters: ["Royaumes et races", "Système de magie", "Prophétie ancienne"] },
      { title: "L'appel à l'aventure", subChapters: ["Le héros improbable", "Formation de la troupe", "Première quête"] },
      { title: "Périples et dangers", subChapters: ["Créatures légendaires", "Épreuves magiques", "Trahisons"] },
      { title: "La bataille finale", subChapters: ["Forces du mal", "Sacrifice héroïque", "Pouvoir ultime"] },
      { title: "Nouveau monde", subChapters: ["Victoire coûteuse", "Reconstruction", "Héritage légendaire"] }
    ],
    image: templateFiction,
    description: "Aventure magique dans un monde fantastique",
    borderColor: "border-l-violet-500",
    icon: "🗡️"
  },
  photographie: {
    id: 'photographie',
    title: "Maîtriser l'Art de la Photographie",
    author: "Photographe Professionnel",
    preface: "La photographie est l'art de capturer l'instant. Apprenez à maîtriser votre appareil et votre œil créatif.",
    conclusion: "Continuez à shooter, à expérimenter et à développer votre vision unique. Chaque photo raconte une histoire.",
    chapters: [
      { title: "Bases techniques", subChapters: ["Exposition triangle", "Modes de prise de vue", "Mise au point"] },
      { title: "Composition et cadrage", subChapters: ["Règle des tiers", "Lignes directrices", "Perspective"] },
      { title: "Lumière et couleur", subChapters: ["Lumière naturelle", "Flash et studio", "Balance des blancs"] },
      { title: "Genres photographiques", subChapters: ["Portrait", "Paysage", "Street photography"] },
      { title: "Post-traitement", subChapters: ["Lightroom essentials", "Retouche avancée", "Workflow professionnel"] }
    ],
    image: templateGuide,
    description: "Devenez un photographe accompli",
    borderColor: "border-l-sky-500",
    icon: "📷"
  },
  jardinage: {
    id: 'jardinage',
    title: "Permaculture et Jardin Écologique",
    author: "Expert Permaculture",
    preface: "Créez un jardin productif en harmonie avec la nature. La permaculture est bien plus qu'une technique, c'est une philosophie de vie.",
    conclusion: "Votre jardin est maintenant un écosystème vivant et autonome. Continuez à observer, apprendre de la nature et partager vos récoltes.",
    chapters: [
      { title: "Principes de permaculture", subChapters: ["Éthique et design", "Observer et imiter la nature", "Zones de culture"] },
      { title: "Préparer son terrain", subChapters: ["Analyse du sol", "Compostage", "Buttes et lasagnes"] },
      { title: "Planter et cultiver", subChapters: ["Associations bénéfiques", "Semis et plantations", "Gestion de l'eau"] },
      { title: "Biodiversité et auxiliaires", subChapters: ["Attirer les pollinisateurs", "Lutte biologique", "Haies nourricières"] },
      { title: "Récoltes et autonomie", subChapters: ["Calendrier des récoltes", "Conservation", "Graines et reproductions"] }
    ],
    image: templateGuide,
    description: "Créez un jardin abondant et écologique",
    borderColor: "border-l-lime-500",
    icon: "🌱"
  },
  spiritualite: {
    id: 'spiritualite',
    title: "Éveil Spirituel et Méditation",
    author: "Guide Spirituel",
    preface: "Le chemin spirituel est un voyage intérieur vers la paix et la conscience. Découvrez les pratiques millénaires adaptées à notre époque.",
    conclusion: "L'éveil est un processus continu. Chaque respiration, chaque moment présent est une opportunité de croissance spirituelle.",
    chapters: [
      { title: "Introduction à la spiritualité", subChapters: ["Différentes traditions", "Trouver sa voie", "Intentions et objectifs"] },
      { title: "Pratiques méditatives", subChapters: ["Méditation assise", "Pleine conscience", "Méditation guidée"] },
      { title: "Énergie et chakras", subChapters: ["Système énergétique", "Équilibrage des chakras", "Kundalini"] },
      { title: "Développement intuitif", subChapters: ["Écoute intérieure", "Synchronicités", "Connexion spirituelle"] },
      { title: "Intégration quotidienne", subChapters: ["Rituels matinaux", "Gratitude", "Vivre en conscience"] }
    ],
    image: templateGuide,
    description: "Trouvez la paix intérieure et l'éveil",
    borderColor: "border-l-purple-400",
    icon: "🧘"
  }
};