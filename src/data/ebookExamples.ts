// Exemples de livres "réussis" - structures éprouvées pour inspirer les utilisateurs.
// Données statiques (aucune fausse statistique générée).

export interface EbookExample {
  id: string;
  title: string;
  subtitle: string;
  niche: string;
  audience: string;
  genre: string;
  // Palette CSS pour la mini-couverture (pas d'image externe)
  palette: { from: string; to: string; text: string };
  pitch: string;
  numberOfChapters: number;
  chapters: string[];
  kdpDescription: string;
  keywords: string[];
}

export const ebookExamples: EbookExample[] = [
  {
    id: 'methode-90j',
    title: 'La Méthode 90 Jours',
    subtitle: 'Transformez votre vie en 12 semaines',
    niche: 'Développement personnel',
    audience: 'Adultes 25-45 ans en quête de changement',
    genre: 'Développement personnel',
    palette: { from: '#0F766E', to: '#F59E0B', text: '#FFFFFF' },
    pitch: 'Un programme structuré semaine par semaine pour bâtir des habitudes durables.',
    numberOfChapters: 8,
    chapters: [
      'Pourquoi 90 jours changent tout',
      'Diagnostic : où en êtes-vous vraiment ?',
      'Définir votre Nord magnétique',
      'Les 4 piliers de la transformation',
      'Semaines 1-4 : poser les fondations',
      'Semaines 5-8 : accélérer le changement',
      'Semaines 9-12 : ancrer pour la vie',
      'Et après ? Votre plan à 12 mois',
    ],
    kdpDescription:
      "Et si 90 jours suffisaient à transformer votre vie ? Ce guide pratique propose une méthode pas-à-pas, semaine par semaine, pour installer des habitudes solides et atteindre vos objectifs personnels comme professionnels. Outils, exercices et tableaux de bord inclus.",
    keywords: ['développement personnel', 'habitudes', 'productivité', '90 jours', 'transformation', 'objectifs', 'discipline'],
  },
  {
    id: 'recettes-healthy',
    title: 'Recettes Healthy Express',
    subtitle: '60 plats équilibrés en moins de 20 minutes',
    niche: 'Cuisine & Santé',
    audience: 'Parents actifs cherchant à manger sainement',
    genre: 'Cuisine',
    palette: { from: '#16A34A', to: '#FACC15', text: '#1F2937' },
    pitch: 'Des recettes rapides, équilibrées et accessibles, pensées pour la semaine.',
    numberOfChapters: 8,
    chapters: [
      'Bien équiper sa cuisine en 10 essentiels',
      'Petits-déjeuners qui boostent la journée',
      'Déjeuners à emporter sans stress',
      'Dîners rapides en famille',
      'Bowls, salades et assiettes complètes',
      'Snacks malins et collations',
      'Desserts sains pour finir en douceur',
      'Meal prep : 1h le dimanche, 7 jours sereins',
    ],
    kdpDescription:
      "Manger sainement sans passer sa vie en cuisine, c'est possible. 60 recettes simples, équilibrées et savoureuses, toutes prêtes en moins de 20 minutes. Avec listes de courses, plans de meal prep et astuces de pro.",
    keywords: ['recettes rapides', 'cuisine saine', 'healthy', 'meal prep', 'famille', '20 minutes', 'équilibré'],
  },
  {
    id: 'atelier-aquarelle',
    title: "L'Atelier Aquarelle",
    subtitle: 'Apprendre les bases en 30 leçons illustrées',
    niche: 'Loisirs créatifs',
    audience: 'Débutants en aquarelle de tout âge',
    genre: 'Art & Loisirs créatifs',
    palette: { from: '#0EA5E9', to: '#F472B6', text: '#FFFFFF' },
    pitch: 'Un manuel progressif pour découvrir et maîtriser l’aquarelle pas à pas.',
    numberOfChapters: 8,
    chapters: [
      'Matériel : choisir sans se ruiner',
      'Les 7 gestes fondamentaux',
      'Comprendre la couleur et le mélange',
      'Lavis, dégradés, transparences',
      'Paysages : ciels, mers, montagnes',
      'Botanique : fleurs et feuillages',
      'Portraits simplifiés',
      'Carnet de voyage : peindre sur le vif',
    ],
    kdpDescription:
      "Découvrez l'aquarelle en douceur grâce à 30 leçons progressives illustrées. De la sélection du matériel aux techniques avancées, ce livre vous accompagne pas à pas pour révéler l'artiste qui sommeille en vous.",
    keywords: ['aquarelle', 'débutant', 'apprendre à peindre', 'loisirs créatifs', 'leçons', 'art', 'illustration'],
  },
  {
    id: 'finance-liberte',
    title: 'Liberté Financière à 40 ans',
    subtitle: 'La feuille de route en 7 étapes',
    niche: 'Finances personnelles',
    audience: 'Salariés 30-45 ans qui veulent reprendre le contrôle',
    genre: 'Finance',
    palette: { from: '#064E3B', to: '#FBBF24', text: '#FFFFFF' },
    pitch: 'Un plan concret pour bâtir un patrimoine et s’affranchir du salaire unique.',
    numberOfChapters: 8,
    chapters: [
      'Le mythe du salaire à vie',
      'Faire le bilan sans tabou',
      'Budget : la machine à investir',
      "Réduire les dépenses sans s'appauvrir",
      'Les 5 placements à comprendre absolument',
      'Construire 3 sources de revenus',
      'Optimiser fiscalement et juridiquement',
      'La feuille de route 5 ans',
    ],
    kdpDescription:
      "Devenir libre financièrement n'est pas réservé aux entrepreneurs ni aux héritiers. Cette méthode en 7 étapes décrypte les leviers concrets pour bâtir un patrimoine, diversifier vos revenus et reprendre le contrôle de votre temps.",
    keywords: ['finances personnelles', 'liberté financière', 'investir', 'patrimoine', 'épargne', 'revenus passifs', 'budget'],
  },
  {
    id: 'enfants-emotions',
    title: 'Mes Petites Émotions',
    subtitle: '20 histoires pour grandir en confiance',
    niche: 'Livres pour enfants',
    audience: 'Enfants 4-8 ans et parents',
    genre: 'Jeunesse',
    palette: { from: '#F97316', to: '#FBBF24', text: '#1F2937' },
    pitch: 'Des histoires courtes pour apprivoiser colère, peur, joie et tristesse.',
    numberOfChapters: 8,
    chapters: [
      'Quand la colère gronde',
      'Le monstre sous le lit',
      'La joie qui éclabousse',
      'Les larmes qui font du bien',
      "L'ami qui me manque",
      "Le courage d'essayer",
      'La fierté du premier pas',
      'Le câlin du soir',
    ],
    kdpDescription:
      "20 histoires douces et illustrées pour aider les enfants de 4 à 8 ans à reconnaître et apprivoiser leurs émotions. Un compagnon précieux pour les parents qui souhaitent ouvrir le dialogue au quotidien.",
    keywords: ['enfants', 'émotions', 'histoires', 'parentalité', 'éducation positive', '4-8 ans', 'jeunesse'],
  },
  {
    id: 'ia-pro',
    title: 'ChatGPT pour les Pros',
    subtitle: '50 prompts qui font gagner 10 heures par semaine',
    niche: 'IA & Productivité',
    audience: 'Indépendants et salariés qui veulent gagner du temps',
    genre: 'Business',
    palette: { from: '#1E293B', to: '#22D3EE', text: '#FFFFFF' },
    pitch: 'Une bibliothèque de prompts éprouvés pour automatiser le quotidien pro.',
    numberOfChapters: 8,
    chapters: [
      "Comprendre l'IA générative en 15 minutes",
      "Les 7 règles d'un prompt efficace",
      'Emails : 10 prompts qui sauvent',
      'Réunions et synthèses',
      'Marketing et copywriting',
      'Analyse de données et tableurs',
      'Création de contenu social',
      'Construire ses propres assistants',
    ],
    kdpDescription:
      "ChatGPT peut vous faire gagner 10 heures par semaine - à condition de savoir lui parler. Ce guide réunit 50 prompts testés et expliqués, classés par usage pro, pour transformer l'IA en véritable bras droit.",
    keywords: ['ChatGPT', 'IA', 'prompts', 'productivité', 'business', 'automatisation', 'indépendants'],
  },
];
