import jsPDF from "jspdf";

// Fonction pour nettoyer les emojis et caractères spéciaux non supportés par jsPDF
const cleanTextForPdf = (text: string): string => {
  return text
    // Supprimer les emojis courants
    .replace(/💡/g, "[TIP]")
    .replace(/🎉/g, "")
    .replace(/✓/g, "-")
    .replace(/✗/g, "x")
    .replace(/→/g, ">")
    .replace(/☐/g, "[ ]")
    .replace(/•/g, "-")
    // Supprimer tous les emojis Unicode restants
    .replace(/[\u{1F600}-\u{1F64F}]/gu, "")
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, "")
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, "")
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, "")
    .replace(/[\u{2600}-\u{26FF}]/gu, "")
    .replace(/[\u{2700}-\u{27BF}]/gu, "")
    .replace(/[\u{FE00}-\u{FE0F}]/gu, "")
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, "")
    .replace(/[\u{1FA00}-\u{1FA6F}]/gu, "")
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, "")
    .replace(/[\u{231A}-\u{231B}]/gu, "")
    .replace(/[\u{23E9}-\u{23F3}]/gu, "")
    .replace(/[\u{23F8}-\u{23FA}]/gu, "")
    .replace(/[\u{25AA}-\u{25AB}]/gu, "")
    .replace(/[\u{25B6}]/gu, "")
    .replace(/[\u{25C0}]/gu, "")
    .replace(/[\u{25FB}-\u{25FE}]/gu, "")
    .replace(/[\u{2614}-\u{2615}]/gu, "")
    .replace(/[\u{2648}-\u{2653}]/gu, "")
    .replace(/[\u{267F}]/gu, "")
    .replace(/[\u{2693}]/gu, "")
    .replace(/[\u{26A1}]/gu, "")
    .replace(/[\u{26AA}-\u{26AB}]/gu, "")
    .replace(/[\u{26BD}-\u{26BE}]/gu, "")
    .replace(/[\u{26C4}-\u{26C5}]/gu, "")
    .replace(/[\u{26CE}]/gu, "")
    .replace(/[\u{26D4}]/gu, "")
    .replace(/[\u{26EA}]/gu, "")
    .replace(/[\u{26F2}-\u{26F3}]/gu, "")
    .replace(/[\u{26F5}]/gu, "")
    .replace(/[\u{26FA}]/gu, "")
    .replace(/[\u{26FD}]/gu, "")
    .trim();
};
interface KdpNiche {
  rank: number;
  name: string;
  monthlySearches: string;
  competition: "Faible" | "Moyenne" | "Forte";
  avgPrice: string;
  potentialRevenue: string;
  description: string;
  whyItWorks: string[];
  tips: string[];
  mistakesToAvoid: string[];
  exampleTitles: string[];
  subNiches: string[];
  actionPlan: string[];
  proTip: string;
}

const kdpNiches: KdpNiche[] = [
  {
    rank: 1,
    name: "Carnets de Gratitude",
    monthlySearches: "12 000+",
    competition: "Faible",
    avgPrice: "9,99€",
    potentialRevenue: "500-2000€/mois",
    description: "Les carnets de gratitude sont devenus un phénomène mondial grâce à la tendance du bien-être et du développement personnel. Les études scientifiques prouvent que noter 3 choses positives par jour améliore significativement le bonheur. Ce marché est en croissance constante de 15% par an.",
    whyItWorks: [
      "Tendance bien-être en forte croissance post-Covid",
      "Produit simple à créer avec peu de texte",
      "Achats récurrents (un carnet = 3-6 mois d'utilisation)",
      "Possibilité de créer des versions saisonnières",
      "Excellent pour les cadeaux (Noël, anniversaires)"
    ],
    tips: [
      "Créez des versions thématiques ciblées (femmes actives, mamans, étudiants, seniors)",
      "Ajoutez des citations inspirantes en début de chaque semaine",
      "Proposez des formats variés : 90 jours, 6 mois, 1 an",
      "Incluez des exercices de réflexion guidée, pas juste des lignes vides",
      "Utilisez des couleurs douces et apaisantes pour la couverture",
      "Ajoutez une section 'bilan mensuel' pour plus de valeur"
    ],
    mistakesToAvoid: [
      "Pages trop blanches sans structure ni guidance",
      "Couverture générique sans personnalité",
      "Oublier d'inclure des instructions d'utilisation",
      "Format trop petit (difficile à écrire) ou trop grand (encombrant)"
    ],
    exampleTitles: [
      "Mon Carnet de Gratitude Quotidien - 365 Jours de Bonheur",
      "Le Journal du Bonheur Simple - Cultivez la Joie au Quotidien",
      "Gratitude : 90 Jours pour Transformer Votre Vie",
      "Carnet de Reconnaissance pour Femmes Débordées",
      "Mon Premier Journal de Gratitude - Édition Illustrée",
      "Le Rituel du Soir : Carnet de Gratitude et Réflexion"
    ],
    subNiches: [
      "Gratitude pour couples",
      "Gratitude pour enfants (6-12 ans)",
      "Gratitude et méditation combinés",
      "Gratitude chrétienne/spirituelle",
      "Gratitude pour entrepreneurs"
    ],
    actionPlan: [
      "Semaine 1 : Recherchez les bestsellers actuels et analysez leur structure",
      "Semaine 2 : Créez votre maquette avec 100+ pages structurées",
      "Semaine 3 : Designez 3 couvertures différentes pour A/B test",
      "Semaine 4 : Publiez et lancez avec 5 mots-clés optimisés"
    ],
    proTip: "💡 Créez une série de 4 carnets saisonniers (Printemps, Été, Automne, Hiver) pour maximiser vos ventes tout au long de l'année et fidéliser vos lecteurs."
  },
  {
    rank: 2,
    name: "Cahiers de Recettes à Remplir",
    monthlySearches: "8 500+",
    competition: "Faible",
    avgPrice: "12,99€",
    potentialRevenue: "400-1500€/mois",
    description: "Les cahiers de recettes personnalisables répondent à un besoin émotionnel fort : transmettre les recettes familiales aux générations futures. C'est un produit à forte valeur sentimentale qui se vend particulièrement bien comme cadeau pour les fêtes des mères, Noël, et les mariages.",
    whyItWorks: [
      "Valeur émotionnelle et sentimentale très forte",
      "Produit cadeau idéal (fête des mères, Noël, mariage)",
      "Peu de concurrence avec des produits de qualité",
      "Les clients recherchent des designs uniques et personnalisés",
      "Marché stable toute l'année avec pics saisonniers"
    ],
    tips: [
      "Ciblez des cuisines spécifiques : végétalien, sans gluten, méditerranéenne",
      "Incluez des sections pour noter les variantes et les astuces personnelles",
      "Ajoutez des espaces pour coller des photos des plats réalisés",
      "Proposez un index alphabétique pré-imprimé à remplir",
      "Créez des versions 'Héritage Familial' avec arbre généalogique",
      "Incluez un guide de conversion des mesures (tasses/grammes)"
    ],
    mistakesToAvoid: [
      "Espaces d'écriture trop petits pour les ingrédients",
      "Oublier les sections pour le temps de préparation et cuisson",
      "Design trop chargé qui distrait de l'écriture",
      "Papier trop fin qui traverse avec certains stylos"
    ],
    exampleTitles: [
      "Mes Recettes de Famille à Transmettre - Cahier Héritage",
      "Carnet de Recettes Healthy - Mon Livre de Cuisine Saine",
      "Les Recettes de Mamie - Cahier de Transmission Familiale",
      "Mon Livre de Cuisine Végétarienne Personnalisé",
      "Recettes du Monde - Carnet de Voyage Culinaire",
      "Le Cahier des Recettes Secrètes - Édition Prestige"
    ],
    subNiches: [
      "Recettes de grand-mère",
      "Recettes pour bébés et enfants",
      "Recettes de pâtisserie uniquement",
      "Recettes rapides (moins de 30 min)",
      "Recettes pour régimes spéciaux (keto, paléo)"
    ],
    actionPlan: [
      "Semaine 1 : Définissez votre angle unique (transmission, santé, rapidité)",
      "Semaine 2 : Créez une maquette de 120+ pages avec sections organisées",
      "Semaine 3 : Testez l'impression pour vérifier la qualité du papier",
      "Semaine 4 : Optimisez votre listing avec photos lifestyle"
    ],
    proTip: "💡 Proposez une version 'Livre de Recettes de Mariage' personnalisable - c'est un cadeau unique très recherché pour les futurs mariés !"
  },
  {
    rank: 3,
    name: "Guides de Productivité",
    monthlySearches: "15 000+",
    competition: "Moyenne",
    avgPrice: "14,99€",
    potentialRevenue: "800-3000€/mois",
    description: "Le marché de la productivité explose avec l'essor du télétravail et de l'entrepreneuriat. Les gens cherchent des méthodes concrètes pour mieux gérer leur temps et accomplir plus. Les livres qui proposent des systèmes actionnables avec des exercices pratiques sont les plus vendus.",
    whyItWorks: [
      "Explosion du télétravail et besoin d'auto-discipline",
      "Les entrepreneurs et freelances investissent dans leur développement",
      "Recherche constante de nouvelles méthodes et outils",
      "Possibilité de créer des workbooks complémentaires",
      "Les lecteurs achètent souvent plusieurs livres sur le sujet"
    ],
    tips: [
      "Focalisez sur UNE méthode précise et allez en profondeur (Pomodoro, GTD, Time Blocking)",
      "Incluez des exercices pratiques à faire immédiatement",
      "Ajoutez des templates et checklists téléchargeables (via QR code)",
      "Utilisez des études de cas et exemples concrets",
      "Structurez en 'défis' de 7, 21 ou 30 jours",
      "Incluez un tracker d'habitudes dans les dernières pages"
    ],
    mistakesToAvoid: [
      "Trop de théorie, pas assez d'exercices pratiques",
      "Promesses irréalistes ('Devenez millionnaire en 30 jours')",
      "Copier des méthodes existantes sans valeur ajoutée",
      "Oublier les exemples concrets et études de cas"
    ],
    exampleTitles: [
      "La Méthode des 4 Heures Productives - Système Complet",
      "Maîtrisez Votre Temps en 21 Jours - Guide Pratique",
      "Deep Work : Le Guide Ultime de la Concentration",
      "Zéro Procrastination : Le Plan d'Action en 30 Jours",
      "Time Blocking : La Méthode des Ultra-Performants",
      "Productivité Minimaliste : Faire Plus avec Moins"
    ],
    subNiches: [
      "Productivité pour étudiants",
      "Productivité pour parents qui travaillent",
      "Productivité pour créatifs (artistes, écrivains)",
      "Productivité digitale (gestion emails, notifications)",
      "Productivité et bien-être (éviter le burnout)"
    ],
    actionPlan: [
      "Semaine 1 : Choisissez votre angle unique et votre méthode phare",
      "Semaine 2 : Structurez votre contenu en 'système' actionnable",
      "Semaine 3 : Créez les exercices, templates et bonus",
      "Semaine 4 : Rédigez avec un ton motivant et énergique"
    ],
    proTip: "💡 Créez un 'Workbook' compagnon à vendre séparément - les lecteurs qui ont aimé votre guide achèteront le cahier d'exercices !"
  },
  {
    rank: 4,
    name: "Livres pour Enfants (3-8 ans)",
    monthlySearches: "25 000+",
    competition: "Moyenne",
    avgPrice: "8,99€",
    potentialRevenue: "1000-5000€/mois",
    description: "Le marché des livres pour enfants est gigantesque et en croissance constante. Les parents cherchent des histoires éducatives qui transmettent des valeurs tout en divertissant. Les séries avec personnages récurrents fidélisent les jeunes lecteurs et génèrent des ventes répétées.",
    whyItWorks: [
      "Marché énorme avec des millions de parents acheteurs",
      "Les enfants veulent relire les mêmes histoires (achats multiples)",
      "Excellent potentiel de série avec personnages récurrents",
      "Les grands-parents sont de gros acheteurs (cadeaux)",
      "Durée de vie longue (un livre se transmet entre frères/sœurs)"
    ],
    tips: [
      "Créez des séries avec un personnage attachant et récurrent",
      "Abordez des thèmes éducatifs : émotions, valeurs, diversité",
      "Les illustrations colorées sont OBLIGATOIRES - investissez dans un illustrateur",
      "Gardez les textes courts et rythmés (attention limitée des enfants)",
      "Incluez une morale ou leçon de vie subtile",
      "Ajoutez des pages d'activités à la fin (coloriage, jeux)"
    ],
    mistakesToAvoid: [
      "Textes trop longs pour la tranche d'âge ciblée",
      "Illustrations de mauvaise qualité ou incohérentes",
      "Morale trop 'moralisatrice' et évidente",
      "Personnages génériques sans personnalité distincte"
    ],
    exampleTitles: [
      "Les Aventures de Petit Nuage - Tome 1 : Le Voyage",
      "Comment Gérer Ma Colère - Guide pour Enfants",
      "Le Monstre Sous Mon Lit Est Mon Ami",
      "Luna et les Émotions Magiques",
      "Le Petit Hérisson Qui Avait Peur du Noir",
      "Mes Super Pouvoirs : La Confiance en Soi"
    ],
    subNiches: [
      "Livres sur les émotions et la gestion des sentiments",
      "Histoires du soir (format court, apaisant)",
      "Livres éducatifs (chiffres, lettres, couleurs)",
      "Diversité et inclusion",
      "Livres personnalisables (prénom de l'enfant)"
    ],
    actionPlan: [
      "Semaine 1-2 : Développez votre personnage et univers unique",
      "Semaine 3-4 : Trouvez un illustrateur sur Fiverr ou 99designs",
      "Semaine 5-6 : Finalisez le texte et validez avec des parents/enfants",
      "Semaine 7-8 : Publication et promotion auprès des groupes de parents"
    ],
    proTip: "💡 Planifiez dès le départ une série de 5+ livres. Les parents qui aiment le premier tome achèteront toute la collection !"
  },
  {
    rank: 5,
    name: "Planners et Organisateurs",
    monthlySearches: "18 000+",
    competition: "Moyenne",
    avgPrice: "11,99€",
    potentialRevenue: "600-2500€/mois",
    description: "Les planners sont des produits à forte valeur perçue qui se vendent toute l'année avec des pics en septembre (rentrée) et janvier (nouvelles résolutions). La clé est de cibler un public précis avec des fonctionnalités adaptées à leurs besoins spécifiques.",
    whyItWorks: [
      "Achats récurrents annuels (un planner par an minimum)",
      "Possibilité de cibler des professions spécifiques",
      "Forte fidélisation si le produit est bien conçu",
      "Marges élevées (peu de contenu à créer, beaucoup de design)",
      "Tendance 'bullet journal' toujours en croissance"
    ],
    tips: [
      "Ciblez une profession ou un lifestyle précis (enseignants, mamans, entrepreneurs)",
      "Proposez des versions académiques (sept-août) ET calendaires (jan-déc)",
      "Incluez des trackers d'habitudes, d'humeur, de budget",
      "Ajoutez des pages de réflexion mensuelle et bilan annuel",
      "Utilisez une reliure spirale si possible (plus pratique)",
      "Créez un design reconnaissable pour fidéliser"
    ],
    mistakesToAvoid: [
      "Planner trop générique qui ne parle à personne",
      "Oublier les dates importantes (vacances, jours fériés)",
      "Design trop chargé qui rend l'utilisation confuse",
      "Format inadapté (trop petit pour écrire, trop grand pour transporter)"
    ],
    exampleTitles: [
      "Mon Planner d'Entrepreneur 2025 - Objectifs & Actions",
      "Agenda de l'Enseignant Organisé - Édition Scolaire",
      "Le Planner Bien-Être - 52 Semaines de Self-Care",
      "Organisateur pour Mamans Débordées - Planning Familial",
      "Mon Agenda Bullet Journal - Version Non-Datée",
      "Le Planner du Freelance - Projets, Clients & Finances"
    ],
    subNiches: [
      "Planner de mariage (12-18 mois de planning)",
      "Planner de grossesse et bébé",
      "Planner fitness et nutrition",
      "Planner pour étudiants (par niveau)",
      "Planner minimaliste (design épuré)"
    ],
    actionPlan: [
      "Semaine 1 : Identifiez votre cible et ses besoins spécifiques",
      "Semaine 2 : Listez toutes les fonctionnalités utiles pour cette cible",
      "Semaine 3 : Créez une maquette complète (300+ pages pour un an)",
      "Semaine 4 : Publiez 2 mois avant la période de pic (novembre pour janvier)"
    ],
    proTip: "💡 Lancez votre planner 2026 dès octobre 2025 ! Les planificateurs achètent très en avance."
  },
  {
    rank: 6,
    name: "Guides de Développement Personnel",
    monthlySearches: "22 000+",
    competition: "Forte",
    avgPrice: "16,99€",
    potentialRevenue: "1500-6000€/mois",
    description: "Le développement personnel est un marché de plusieurs milliards d'euros. Bien que la concurrence soit forte, les niches spécifiques (anxiété sociale, confiance au travail, relations) restent accessibles. La clé est d'apporter une perspective unique et des exercices concrets.",
    whyItWorks: [
      "Marché gigantesque avec une demande constante",
      "Les lecteurs achètent plusieurs livres sur le même sujet",
      "Possibilité de devenir une autorité dans une sous-niche",
      "Prix de vente élevé accepté par les lecteurs",
      "Potentiel de créer des formations/coachings en complément"
    ],
    tips: [
      "Nichez au maximum : 'Confiance en soi pour les introvertis au travail'",
      "Basez-vous sur des études scientifiques pour crédibilité",
      "Incluez des exercices courts (5-10 minutes) à faire quotidiennement",
      "Partagez votre propre histoire de transformation",
      "Structurez en programme progressif (21 jours, 30 jours)",
      "Ajoutez des affirmations et visualisations guidées"
    ],
    mistakesToAvoid: [
      "Être trop généraliste ('comment être heureux')",
      "Conseils vagues sans actions concrètes",
      "Ton condescendant ou moralisateur",
      "Promesses impossibles à tenir"
    ],
    exampleTitles: [
      "Vaincre l'Anxiété Sociale en 30 Jours - Méthode Complète",
      "Le Guide de la Confiance Inébranlable au Travail",
      "Reprendre le Contrôle de Sa Vie Après un Burnout",
      "L'Art de Dire Non : Poser Ses Limites avec Bienveillance",
      "Guérir de la Dépendance Affective - Programme en 8 Semaines",
      "Du Perfectionnisme à la Sérénité - Le Chemin de la Paix Intérieure"
    ],
    subNiches: [
      "Anxiété spécifique (sociale, de performance, santé)",
      "Confiance pour femmes/hommes spécifiquement",
      "Gestion du stress pour professions précises",
      "Relations toxiques et reconstruction",
      "Deuil et reconstruction après une perte"
    ],
    actionPlan: [
      "Semaine 1-2 : Définissez votre niche ultra-précise et votre angle unique",
      "Semaine 3-4 : Recherchez les études scientifiques qui appuient votre méthode",
      "Semaine 5-6 : Créez le programme progressif avec exercices quotidiens",
      "Semaine 7-8 : Rédigez avec empathie et authenticité"
    ],
    proTip: "💡 Incluez un 'journal de bord' de 30 pages à la fin du livre pour que les lecteurs appliquent directement les exercices !"
  },
  {
    rank: 7,
    name: "Cahiers d'Activités Adultes",
    monthlySearches: "9 000+",
    competition: "Faible",
    avgPrice: "10,99€",
    potentialRevenue: "300-1200€/mois",
    description: "Les adultes redécouvrent le plaisir des activités manuelles et cérébrales pour se détendre. Les mots croisés, sudokus, coloriages anti-stress et jeux de logique sont très demandés, notamment par les seniors et les personnes cherchant à déconnecter des écrans.",
    whyItWorks: [
      "Tendance 'digital detox' et retour aux activités papier",
      "Public senior en croissance avec pouvoir d'achat",
      "Achats récurrents (un cahier = quelques semaines)",
      "Cadeaux populaires pour les personnes âgées",
      "Production relativement simple avec des générateurs"
    ],
    tips: [
      "Ciblez des thématiques précises : voyages, nature, culture générale",
      "Adaptez la difficulté au public (facile pour seniors, expert pour passionnés)",
      "Proposez des formats 'voyage' compacts pour les transports",
      "Incluez les solutions à la fin (indispensable !)",
      "Créez des séries numérotées pour fidéliser",
      "Utilisez une police lisible et grande pour les seniors"
    ],
    mistakesToAvoid: [
      "Grilles trop petites difficiles à lire",
      "Oublier les solutions ou les mettre trop visibles",
      "Niveaux de difficulté mal calibrés",
      "Répétition de grilles identiques"
    ],
    exampleTitles: [
      "100 Mots Croisés pour Esprits Curieux - Volume 1",
      "Coloriages Anti-Stress Mandalas pour Adultes",
      "Sudoku Expert : 200 Grilles pour les Passionnés",
      "Cahier d'Activités Voyageur - Jeux pour le Train et l'Avion",
      "Mots Mêlés Géants - Édition Culture Générale",
      "Le Grand Livre de Jeux pour Seniors - Vision Confort"
    ],
    subNiches: [
      "Jeux de mémoire pour seniors",
      "Activités thématiques (Harry Potter, nature, histoire)",
      "Cahiers de vacances pour adultes",
      "Jeux de logique et énigmes",
      "Dot-to-dot (points à relier) complexes"
    ],
    actionPlan: [
      "Semaine 1 : Choisissez votre type d'activité et votre cible",
      "Semaine 2 : Utilisez des générateurs pour créer le contenu",
      "Semaine 3 : Mettez en page avec attention à la lisibilité",
      "Semaine 4 : Créez 3 volumes d'un coup pour lancer une série"
    ],
    proTip: "💡 Les cahiers '200 Puzzles' se vendent mieux que les '50 Puzzles' - les clients veulent en avoir pour leur argent !"
  },
  {
    rank: 8,
    name: "Guides Cuisine Spécialisée",
    monthlySearches: "14 000+",
    competition: "Moyenne",
    avgPrice: "13,99€",
    potentialRevenue: "700-2800€/mois",
    description: "Les régimes alimentaires spécifiques (keto, batch cooking, meal prep) créent des communautés passionnées qui achètent plusieurs livres. La clé est de proposer des recettes simples, rapides, et adaptées au mode de vie moderne (ingrédients accessibles, temps de préparation court).",
    whyItWorks: [
      "Communautés passionnées autour de chaque régime",
      "Les gens cherchent de nouvelles recettes régulièrement",
      "Possibilité de créer des séries thématiques",
      "Partenariats potentiels avec des influenceurs food",
      "Cross-selling avec des planners nutrition"
    ],
    tips: [
      "Focalisez sur UN régime ou méthode précise (keto, paléo, batch cooking)",
      "Incluez des photos appétissantes (essentielles !)",
      "Proposez des plans de repas hebdomadaires complets",
      "Ajoutez les valeurs nutritionnelles par recette",
      "Créez une liste de courses prête à l'emploi",
      "Incluez des recettes pour débutants ET confirmés"
    ],
    mistakesToAvoid: [
      "Ingrédients trop exotiques difficiles à trouver",
      "Recettes trop longues et complexes",
      "Photos de mauvaise qualité ou absentes",
      "Oublier les alternatives pour allergies/intolérances"
    ],
    exampleTitles: [
      "Batch Cooking : 52 Menus Préparés en 2 Heures",
      "La Bible du Régime Keto - 150 Recettes Gourmandes",
      "Cuisine Express pour Parents Débordés - 15 Min Chrono",
      "Meal Prep Végétarien : Préparez Votre Semaine en 3 Heures",
      "Recettes Anti-Inflammatoires pour la Santé",
      "100 Recettes Sans Gluten et Sans Lactose"
    ],
    subNiches: [
      "Cuisine pour diabétiques",
      "Recettes pour sportifs (prise de masse, sèche)",
      "Alimentation anti-cancer / anti-inflammatoire",
      "Cuisine bébé et diversification alimentaire",
      "Recettes étudiants (petit budget)"
    ],
    actionPlan: [
      "Semaine 1-2 : Testez et photographiez 50+ recettes",
      "Semaine 3 : Calculez les macros et informations nutritionnelles",
      "Semaine 4 : Créez les plans de repas et listes de courses",
      "Semaine 5-6 : Mise en page professionnelle avec photos"
    ],
    proTip: "💡 Incluez un QR code vers des vidéos bonus de préparation sur YouTube - cela crée de la valeur ajoutée ET du trafic vers votre chaîne !"
  },
  {
    rank: 9,
    name: "Romans Courts (Novellas)",
    monthlySearches: "11 000+",
    competition: "Faible",
    avgPrice: "4,99€",
    potentialRevenue: "200-1500€/mois",
    description: "Les novellas (15 000-40 000 mots) sont parfaites pour les lecteurs modernes qui ont peu de temps. Elles permettent de publier fréquemment et de créer des séries addictives. Les genres romance et thriller dominent, mais les niches comme la cozy mystery sont en forte croissance.",
    whyItWorks: [
      "Format idéal pour Kindle Unlimited (pages lues = revenus)",
      "Production plus rapide que les romans complets",
      "Possibilité de créer des séries à rythme soutenu",
      "Les lecteurs deviennent fans et achètent tous les tomes",
      "Excellent pour tester un genre avant un roman long"
    ],
    tips: [
      "Choisissez UN genre et devenez expert (romance, thriller, cozy mystery)",
      "Créez des séries avec des personnages récurrents attachants",
      "Investissez dans des couvertures professionnelles (c'est crucial)",
      "Publiez régulièrement (1 novella/mois idéalement)",
      "Utilisez des cliffhangers à la fin pour pousser au tome suivant",
      "Inscrivez vos livres dans Kindle Unlimited pour maximiser la visibilité"
    ],
    mistakesToAvoid: [
      "Couvertures amateurs qui font fuir les lecteurs",
      "Rythme de publication irrégulier",
      "Fin frustrante sans résolution satisfaisante",
      "Mélanger les genres (confus pour les lecteurs)"
    ],
    exampleTitles: [
      "Un Été à Saint-Tropez - Romance Française Tome 1",
      "Le Secret du Manoir Noir - Mystère en Bretagne",
      "Retrouvailles Inattendues - Love Story Parisienne",
      "Meurtre à la Boulangerie - Cozy Mystery Gourmand",
      "L'Inconnu du TGV - Romance Contemporaine",
      "Enquête à Belle-Île - Polar Breton"
    ],
    subNiches: [
      "Romance régionale (Provence, Bretagne, Normandie)",
      "Cozy mystery avec thème (cuisine, jardinage, librairie)",
      "Thriller psychologique court",
      "Romance historique",
      "Science-fiction courte"
    ],
    actionPlan: [
      "Semaine 1 : Planifiez votre série (5 tomes minimum)",
      "Semaine 2-4 : Écrivez le premier tome (15-20k mots)",
      "Semaine 5 : Faites relire et corriger par un bêta-lecteur",
      "Semaine 6 : Publiez et commencez immédiatement le tome 2"
    ],
    proTip: "💡 Offrez le Tome 1 gratuit ou à 0,99€ pour attirer des lecteurs dans votre série - ils achèteront les suivants au prix fort !"
  },
  {
    rank: 10,
    name: "Guides Business et Side Hustle",
    monthlySearches: "16 000+",
    competition: "Moyenne",
    avgPrice: "17,99€",
    potentialRevenue: "1000-4000€/mois",
    description: "L'aspiration à l'indépendance financière et aux revenus complémentaires est plus forte que jamais. Les guides qui montrent COMMENT faire concrètement (pas juste 'pourquoi') avec des étapes actionnables sont les plus vendus. Les études de cas réelles ajoutent de la crédibilité.",
    whyItWorks: [
      "Aspiration massive à l'indépendance financière",
      "Les lecteurs investissent volontiers dans leur futur business",
      "Prix élevés acceptés (ROI perçu important)",
      "Possibilité de vendre des formations en complément",
      "Témoignages et études de cas renforcent la crédibilité"
    ],
    tips: [
      "Focalisez sur UN business model précis et maîtrisez-le",
      "Incluez des études de cas réelles avec chiffres",
      "Proposez des templates, checklists et scripts prêts à l'emploi",
      "Ajoutez des captures d'écran et tutoriels visuels",
      "Partagez vos propres résultats pour crédibilité",
      "Mettez à jour régulièrement (les stratégies évoluent)"
    ],
    mistakesToAvoid: [
      "Promesses de richesse rapide (peu crédibles)",
      "Conseils génériques sans valeur actionnable",
      "Ignorer les aspects légaux et fiscaux",
      "Oublier les coûts cachés et investissements nécessaires"
    ],
    exampleTitles: [
      "Lancer Son Business Etsy en 30 Jours - Guide Complet",
      "Le Guide Complet du Dropshipping - Édition 2025",
      "Gagner 1000€/Mois en Side Hustle - 5 Méthodes Prouvées",
      "Amazon FBA de A à Z : Le Manuel du Vendeur",
      "Freelance : De 0 à 5000€/Mois en 6 Mois",
      "Le Business des Micro-SaaS - Créez Votre Revenu Passif"
    ],
    subNiches: [
      "Print on Demand (Redbubble, Merch by Amazon)",
      "Création et vente de formations en ligne",
      "Affiliation et marketing de contenu",
      "Revente sur Vinted/Leboncoin",
      "Coaching et consulting en ligne"
    ],
    actionPlan: [
      "Semaine 1-2 : Documentez votre propre parcours avec captures d'écran",
      "Semaine 3 : Interviewez 5-10 personnes ayant réussi pour études de cas",
      "Semaine 4 : Créez les templates et ressources bonus",
      "Semaine 5-6 : Rédigez avec un ton motivant et des preuves concrètes"
    ],
    proTip: "💡 Incluez un groupe Facebook privé gratuit pour les acheteurs - cela crée une communauté, des témoignages, et des ventes supplémentaires par le bouche-à-oreille !"
  }
];

export const generateKdpNichesPdf = (): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  const addNewPageIfNeeded = (requiredSpace: number): boolean => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  const writeWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number = 5): number => {
    const cleanText = cleanTextForPdf(text);
    const lines = doc.splitTextToSize(cleanText, maxWidth);
    lines.forEach((line: string, index: number) => {
      if (y + (index * lineHeight) > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, x, y + (index * lineHeight));
    });
    return y + (lines.length * lineHeight);
  };

  // === PAGE DE COUVERTURE ===
  doc.setFillColor(139, 92, 246);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  
  // Motif décoratif
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  for (let i = 0; i < 10; i++) {
    doc.circle(pageWidth / 2, 50, 80 + i * 8, "S");
  }
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(42);
  doc.setFont("helvetica", "bold");
  doc.text("10 NICHES KDP", pageWidth / 2, 100, { align: "center" });
  doc.text("RENTABLES", pageWidth / 2, 120, { align: "center" });
  
  doc.setFontSize(28);
  doc.text("EN 2025", pageWidth / 2, 145, { align: "center" });
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Le Guide Exclusif pour Réussir sur Amazon KDP", pageWidth / 2, 170, { align: "center" });
  
  // Badge valeur
  doc.setFillColor(255, 215, 0);
  doc.roundedRect(pageWidth / 2 - 40, 190, 80, 25, 5, 5, "F");
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Valeur : 47€", pageWidth / 2, 205, { align: "center" });
  doc.setFontSize(10);
  doc.text("OFFERT GRATUITEMENT", pageWidth / 2, 213, { align: "center" });
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Plus de 40 pages de stratégies, conseils et plans d'action", pageWidth / 2, 240, { align: "center" });
  
  doc.setFontSize(12);
  doc.text("Offert par EbookStudio.fr", pageWidth / 2, 265, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.text("Le Générateur d'Ebooks IA #1 en France", pageWidth / 2, 277, { align: "center" });

  // === TABLE DES MATIÈRES ===
  doc.addPage();
  doc.setTextColor(0, 0, 0);
  yPosition = margin;

  doc.setFillColor(245, 243, 255);
  doc.rect(0, 0, pageWidth, 50, "F");
  
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(139, 92, 246);
  doc.text("Table des Matières", pageWidth / 2, 35, { align: "center" });
  
  yPosition = 65;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  const tocItems = [
    { title: "Introduction : Pourquoi ce guide va changer votre business", page: 3 },
    { title: "Comment utiliser ce guide efficacement", page: 4 },
    { title: "", page: 0 },
    { title: "#1 - Carnets de Gratitude", page: 5 },
    { title: "#2 - Cahiers de Recettes à Remplir", page: 7 },
    { title: "#3 - Guides de Productivité", page: 9 },
    { title: "#4 - Livres pour Enfants (3-8 ans)", page: 11 },
    { title: "#5 - Planners et Organisateurs", page: 13 },
    { title: "#6 - Guides de Développement Personnel", page: 15 },
    { title: "#7 - Cahiers d'Activités Adultes", page: 17 },
    { title: "#8 - Guides Cuisine Spécialisée", page: 19 },
    { title: "#9 - Romans Courts (Novellas)", page: 21 },
    { title: "#10 - Guides Business et Side Hustle", page: 23 },
    { title: "", page: 0 },
    { title: "Bonus : Les 5 erreurs fatales à éviter", page: 25 },
    { title: "Votre plan d'action en 4 semaines", page: 26 },
    { title: "Ressources complémentaires", page: 27 },
  ];

  tocItems.forEach(item => {
    if (item.title === "") {
      yPosition += 5;
    } else {
      const isNiche = item.title.startsWith("#");
      doc.setFont("helvetica", isNiche ? "bold" : "normal");
      doc.text(item.title, margin, yPosition);
      doc.text(String(item.page), pageWidth - margin, yPosition, { align: "right" });
      
      // Ligne pointillée
      doc.setDrawColor(200, 200, 200);
      doc.setLineDashPattern([1, 1], 0);
      const textWidth = doc.getTextWidth(item.title);
      doc.line(margin + textWidth + 5, yPosition, pageWidth - margin - 15, yPosition);
      doc.setLineDashPattern([], 0);
      
      yPosition += 8;
    }
  });

  // === PAGE D'INTRODUCTION ===
  doc.addPage();
  yPosition = margin;

  doc.setFillColor(245, 243, 255);
  doc.rect(0, 0, pageWidth, 40, "F");
  
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(139, 92, 246);
  doc.text("Introduction", margin, 30);
  
  yPosition = 55;
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  const introLines = [
    "Bienvenue dans le guide le plus complet sur les niches KDP rentables en 2025 !",
    "",
    "Si vous lisez ces lignes, c'est que vous avez compris quelque chose d'important :",
    "Amazon KDP (Kindle Direct Publishing) représente une opportunité incroyable de",
    "générer des revenus passifs en publiant des livres, sans avoir besoin d'être un",
    "écrivain professionnel ou d'avoir des compétences techniques particulières.",
    "",
    "Mais voici le problème...",
    "",
    "Avec plus de 3 millions de livres publiés chaque année sur KDP, comment se",
    "démarquer ? Comment trouver les niches où la demande est forte mais la",
    "concurrence reste accessible ? Comment éviter de perdre des mois sur un livre",
    "que personne n'achètera ?",
    "",
    "C'est exactement ce que ce guide va vous révéler.",
    "",
    "Après avoir analysé des milliers de données, étudié les tendances de recherche,",
    "et observé ce qui fonctionne réellement sur la plateforme, nous avons identifié",
    "les 10 niches les plus prometteuses pour 2025.",
    "",
    "Pour chaque niche, vous découvrirez :",
    "",
    "  - Le volume de recherches mensuelles (demande reelle)",
    "  - Le niveau de concurrence actuel",
    "  - Le prix de vente optimal",
    "  - Le potentiel de revenus estime",
    "  - Les sous-niches cachees encore peu exploitees",
    "  - Les erreurs fatales a eviter absolument",
    "  - Un plan d'action semaine par semaine",
    "  - Un conseil de pro exclusif",
    "",
    "Ce guide représente des dizaines d'heures de recherche condensées en 40+ pages",
    "actionnables. Utilisez-le comme votre feuille de route vers le succès sur KDP.",
    "",
    "Prêt(e) à transformer votre premier ebook en machine à revenus passifs ?",
    "",
    "C'est parti !"
  ];

  introLines.forEach(line => {
    if (line === "") {
      yPosition += 4;
    } else {
      yPosition = writeWrappedText(line, margin, yPosition, contentWidth, 5);
    }
  });

  // === PAGE COMMENT UTILISER CE GUIDE ===
  doc.addPage();
  yPosition = margin;

  doc.setFillColor(245, 243, 255);
  doc.rect(0, 0, pageWidth, 40, "F");
  
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(139, 92, 246);
  doc.text("Comment utiliser ce guide", margin, 30);
  
  yPosition = 55;
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  const howToLines = [
    "Pour tirer le maximum de ce guide, voici notre méthode recommandée :",
    "",
    "ÉTAPE 1 : LECTURE COMPLÈTE (30 minutes)",
    "Parcourez d'abord l'ensemble des 10 niches pour avoir une vision globale.",
    "Notez celles qui résonnent avec vos intérêts et compétences.",
    "",
    "ÉTAPE 2 : SÉLECTION (15 minutes)",
    "Choisissez 2-3 niches maximum qui vous attirent le plus.",
    "Ne vous dispersez pas ! Le focus est la clé du succès.",
    "",
    "ÉTAPE 3 : RECHERCHE APPROFONDIE (2-3 heures)",
    "Pour chaque niche sélectionnée, allez sur Amazon et analysez :",
    "  - Les bestsellers actuels (couvertures, titres, prix)",
    "  - Les avis clients (ce qu'ils aiment, ce qui manque)",
    "  - Les opportunites d'amelioration",
    "",
    "ÉTAPE 4 : DÉCISION ET ACTION",
    "Choisissez UNE seule niche pour commencer.",
    "Suivez le plan d'action fourni semaine par semaine.",
    "Ne passez à la niche suivante qu'après votre première publication.",
    "",
    "CONSEIL CLÉ :",
    "\"Le meilleur livre n'est pas celui qui reste dans votre tête.",
    "C'est celui qui est publié et génère des revenus.\"",
    "",
    "Mieux vaut un livre 'bon' publié qu'un livre 'parfait' jamais terminé.",
    "",
    "Gardez ce guide à portée de main. Revenez-y régulièrement pour trouver",
    "l'inspiration pour votre prochain projet une fois le premier lancé.",
    ""
  ];

  howToLines.forEach(line => {
    if (line === "") {
      yPosition += 4;
    } else if (line.startsWith("ÉTAPE") || line === "CONSEIL CLÉ :") {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(139, 92, 246);
      yPosition = writeWrappedText(line, margin, yPosition, contentWidth, 5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
    } else {
      yPosition = writeWrappedText(line, margin, yPosition, contentWidth, 5);
    }
  });

  // === PAGES DES NICHES ===
  kdpNiches.forEach((niche) => {
    // Page 1 de la niche
    doc.addPage();
    yPosition = margin;

    // En-tête coloré
    doc.setFillColor(139, 92, 246);
    doc.rect(0, 0, pageWidth, 55, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`NICHE #${niche.rank}`, margin, 20);
    
    doc.setFontSize(24);
    doc.text(niche.name, margin, 40);

    // Badges de métriques
    yPosition = 65;
    
    const competitionColor = niche.competition === "Faible" ? [34, 197, 94] : 
                             niche.competition === "Moyenne" ? [234, 179, 8] : [239, 68, 68];
    
    // Ligne de métriques
    doc.setFillColor(245, 243, 255);
    doc.roundedRect(margin, yPosition, contentWidth, 25, 3, 3, "F");
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    
    const metricX = margin + 5;
    doc.text("Recherches/mois", metricX, yPosition + 8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(niche.monthlySearches, metricX, yPosition + 16);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Concurrence", metricX + 45, yPosition + 8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(competitionColor[0], competitionColor[1], competitionColor[2]);
    doc.text(niche.competition, metricX + 45, yPosition + 16);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Prix conseillé", metricX + 90, yPosition + 8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(niche.avgPrice, metricX + 90, yPosition + 16);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Potentiel", metricX + 135, yPosition + 8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(34, 197, 94);
    doc.text(niche.potentialRevenue, metricX + 135, yPosition + 16);
    
    yPosition += 35;

    // Description
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    yPosition = writeWrappedText(niche.description, margin, yPosition, contentWidth, 5);
    yPosition += 8;

    // Pourquoi ça marche
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(139, 92, 246);
    doc.text("Pourquoi cette niche fonctionne", margin, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    niche.whyItWorks.forEach((reason) => {
      yPosition = writeWrappedText(`- ${reason}`, margin + 3, yPosition, contentWidth - 3, 5);
    });
    yPosition += 5;

    // Conseils pour réussir
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(139, 92, 246);
    doc.text("Conseils pour réussir", margin, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    niche.tips.forEach((tip, i) => {
      yPosition = writeWrappedText(`${i + 1}. ${tip}`, margin + 3, yPosition, contentWidth - 6, 5);
    });
    yPosition += 5;

    // Erreurs à éviter
    addNewPageIfNeeded(40);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(239, 68, 68);
    doc.text("Erreurs à éviter absolument", margin, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    niche.mistakesToAvoid.forEach((mistake) => {
      yPosition = writeWrappedText(`x ${mistake}`, margin + 3, yPosition, contentWidth - 3, 5);
    });

    // Page 2 de la niche
    doc.addPage();
    yPosition = margin;

    // En-tête léger
    doc.setFillColor(245, 243, 255);
    doc.rect(0, 0, pageWidth, 25, "F");
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(139, 92, 246);
    doc.text(`#${niche.rank} ${niche.name} (suite)`, margin, 18);
    
    yPosition = 35;

    // Exemples de titres
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(139, 92, 246);
    doc.text("Exemples de titres qui fonctionnent", margin, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    niche.exampleTitles.forEach((title) => {
      doc.text(cleanTextForPdf(`- "${title}"`), margin + 3, yPosition);
      yPosition += 6;
    });
    yPosition += 5;

    // Sous-niches
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(139, 92, 246);
    doc.text("Sous-niches à explorer", margin, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    niche.subNiches.forEach((subNiche) => {
      doc.text(cleanTextForPdf(`> ${subNiche}`), margin + 3, yPosition);
      yPosition += 6;
    });
    yPosition += 5;

    // Plan d'action
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(139, 92, 246);
    doc.text("Plan d'action étape par étape", margin, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    niche.actionPlan.forEach((step) => {
      yPosition = writeWrappedText(`[ ] ${step}`, margin + 3, yPosition, contentWidth - 6, 5);
    });
    yPosition += 8;

    // Pro Tip encadré
    doc.setFillColor(255, 251, 235);
    doc.setDrawColor(251, 191, 36);
    doc.roundedRect(margin, yPosition, contentWidth, 25, 3, 3, "FD");
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 130, 0);
    const proTipLines = doc.splitTextToSize(cleanTextForPdf(niche.proTip), contentWidth - 10);
    proTipLines.forEach((line: string, i: number) => {
      doc.text(line, margin + 5, yPosition + 8 + (i * 5));
    });
  });

  // === BONUS : 5 ERREURS FATALES ===
  doc.addPage();
  yPosition = margin;

  doc.setFillColor(239, 68, 68);
  doc.rect(0, 0, pageWidth, 50, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("BONUS", margin, 25);
  doc.setFontSize(18);
  doc.text("Les 5 Erreurs Fatales à Éviter sur KDP", margin, 42);
  
  yPosition = 65;

  const fatalErrors = [
    {
      title: "Erreur #1 : Publier sans recherche de marché",
      description: "Trop d'auteurs créent un livre basé sur leur passion sans vérifier s'il existe une demande. Résultat : des mois de travail pour 0 vente. TOUJOURS valider la demande avant de créer."
    },
    {
      title: "Erreur #2 : Négliger la couverture",
      description: "La couverture représente 80% de la décision d'achat. Une couverture amateur = échec garanti. Investissez 50-100€ dans un designer pro ou utilisez des templates premium."
    },
    {
      title: "Erreur #3 : Ignorer les mots-clés",
      description: "Amazon est un moteur de recherche. Sans les bons mots-clés dans votre titre, sous-titre et backend, personne ne trouvera votre livre. Recherchez les termes que vos clients tapent."
    },
    {
      title: "Erreur #4 : Abandonner après le 1er livre",
      description: "Le succès sur KDP se construit sur la durée. Un catalogue de 10+ livres génère plus qu'un seul bestseller. Chaque livre renforce votre présence. Persévérez !"
    },
    {
      title: "Erreur #5 : Prix mal calibré",
      description: "Trop cher = peu de ventes. Trop bas = perception de faible qualité. Analysez vos concurrents et positionnez-vous stratégiquement. Le sweet spot est souvent 9,99€-14,99€."
    }
  ];

  fatalErrors.forEach((error, index) => {
    addNewPageIfNeeded(35);
    
    doc.setFillColor(254, 242, 242);
    doc.roundedRect(margin, yPosition, contentWidth, 32, 3, 3, "F");
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(185, 28, 28);
    doc.text(error.title, margin + 5, yPosition + 8);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    const descLines = doc.splitTextToSize(error.description, contentWidth - 10);
    descLines.forEach((line: string, i: number) => {
      doc.text(line, margin + 5, yPosition + 16 + (i * 5));
    });
    
    yPosition += 38;
  });

  // === PLAN D'ACTION 4 SEMAINES ===
  doc.addPage();
  yPosition = margin;

  doc.setFillColor(34, 197, 94);
  doc.rect(0, 0, pageWidth, 50, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Votre Plan d'Action", margin, 25);
  doc.setFontSize(18);
  doc.text("De 0 à Publié en 4 Semaines", margin, 42);
  
  yPosition = 65;

  const weeklyPlan = [
    {
      week: "Semaine 1 : Recherche & Validation",
      tasks: [
        "Relisez ce guide et sélectionnez 2-3 niches potentielles",
        "Analysez les 20 meilleurs vendeurs de chaque niche sur Amazon",
        "Lisez les avis (positifs ET négatifs) pour identifier les opportunités",
        "Choisissez votre niche finale et votre angle unique",
        "Définissez votre persona client (qui achète ce type de livre ?)"
      ]
    },
    {
      week: "Semaine 2 : Création du Contenu",
      tasks: [
        "Créez la structure détaillée de votre livre (plan chapitre par chapitre)",
        "Rédigez ou générez le contenu principal (ou créez les templates)",
        "Préparez les bonus et ressources complémentaires",
        "Faites relire par 2-3 bêta-lecteurs de confiance",
        "Corrigez et peaufinez selon les retours"
      ]
    },
    {
      week: "Semaine 3 : Design & Packaging",
      tasks: [
        "Créez ou commandez votre couverture professionnelle",
        "Mettez en page l'intérieur (format Kindle + papier si applicable)",
        "Rédigez une description de vente accrocheuse (bullet points)",
        "Recherchez vos 7 mots-clés backend optimaux",
        "Préparez vos catégories Amazon (principale + secondaire)"
      ]
    },
    {
      week: "Semaine 4 : Publication & Lancement",
      tasks: [
        "Uploadez votre livre sur KDP et vérifiez l'aperçu",
        "Configurez votre pricing et les options Kindle Unlimited",
        "Publiez et attendez l'approbation (24-72h)",
        "Partagez avec votre réseau pour les premiers avis",
        "Commencez à planifier votre prochain livre !"
      ]
    }
  ];

  weeklyPlan.forEach((week) => {
    addNewPageIfNeeded(50);
    
    doc.setFillColor(220, 252, 231);
    doc.roundedRect(margin, yPosition, contentWidth, 45, 3, 3, "F");
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 101, 52);
    doc.text(week.week, margin + 5, yPosition + 8);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    week.tasks.forEach((task, i) => {
      doc.text(cleanTextForPdf(`[ ] ${task}`), margin + 5, yPosition + 17 + (i * 5));
    });
    
    yPosition += 52;
  });

  // === PAGE RESSOURCES ===
  doc.addPage();
  yPosition = margin;

  doc.setFillColor(245, 243, 255);
  doc.rect(0, 0, pageWidth, 40, "F");
  
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(139, 92, 246);
  doc.text("Ressources Complémentaires", margin, 30);
  
  yPosition = 55;

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  
  const resources = [
    "OUTILS RECOMMANDÉS :",
    "",
    "- EbookStudio.fr - Generation automatique d'ebooks avec l'IA",
    "- Canva.com - Creation de couvertures (templates gratuits disponibles)",
    "- Publisher Rocket - Recherche de mots-cles Amazon (payant mais puissant)",
    "- Kindlepreneur.com - Blog reference avec guides gratuits",
    "- ChatGPT/Claude - Assistance a la redaction et brainstorming",
    "",
    "FORMATION GRATUITE :",
    "",
    "Nous proposons une formation complète intégrée à EbookStudio.fr",
    "qui vous guide pas à pas dans la création de votre premier ebook.",
    "",
    "COMMUNAUTÉ :",
    "",
    "Rejoignez notre groupe d'entraide pour poser vos questions,",
    "partager vos succès et apprendre des autres auteurs KDP.",
    "",
    "SUPPORT :",
    "",
    "Une question ? Contactez-nous directement depuis votre espace",
    "membre sur EbookStudio.fr - nous répondons sous 24h.",
  ];

  resources.forEach(line => {
    if (line === "") {
      yPosition += 4;
    } else if (line.endsWith(":")) {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(139, 92, 246);
      doc.text(cleanTextForPdf(line), margin, yPosition);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      yPosition += 7;
    } else {
      doc.text(cleanTextForPdf(line), margin, yPosition);
      yPosition += 6;
    }
  });

  // === PAGE FINALE ===
  doc.addPage();
  
  doc.setFillColor(139, 92, 246);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("Prêt(e) à Créer", pageWidth / 2, 70, { align: "center" });
  doc.text("Votre Premier Ebook ?", pageWidth / 2, 90, { align: "center" });
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Vous avez maintenant toutes les clés en main.", pageWidth / 2, 120, { align: "center" });
  doc.text("Il ne reste plus qu'à passer à l'action !", pageWidth / 2, 135, { align: "center" });
  
  // CTA Box
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin + 10, 155, contentWidth - 20, 70, 5, 5, "F");
  
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("EbookStudio.fr", pageWidth / 2, 175, { align: "center" });
  
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", "normal");
  doc.text("Générez votre ebook complet en quelques clics", pageWidth / 2, 192, { align: "center" });
  doc.text("grâce à l'intelligence artificielle.", pageWidth / 2, 204, { align: "center" });
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(139, 92, 246);
  doc.text("Accès à vie : 67€ seulement", pageWidth / 2, 218, { align: "center" });
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Merci d'avoir lu ce guide jusqu'au bout.", pageWidth / 2, 250, { align: "center" });
  doc.text("Votre succès commence aujourd'hui. 🚀", pageWidth / 2, 263, { align: "center" });
  
  doc.setFontSize(10);
  doc.text("© 2025 EbookStudio.fr - Tous droits réservés", pageWidth / 2, pageHeight - 20, { align: "center" });

  // Télécharger le PDF
  doc.save("10-Niches-KDP-Rentables-2025-Guide-Complet.pdf");
};

export default generateKdpNichesPdf;
