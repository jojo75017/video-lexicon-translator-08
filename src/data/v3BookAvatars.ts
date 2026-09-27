/**
 * Répertoire des avatars lecteurs par univers KDP.
 * Chaque avatar remplit la fiche « Cible & Promesse » du livre (profil, niveau,
 * besoins, frustrations) et sa consigne est transmise telle quelle aux agents
 * rédacteurs : sommaire, chapitres et relecture éditoriale.
 */

export type BookAvatar = {
  id: string;
  /** Prénom + âge, ex. « Emma, 27 ans ». */
  name: string;
  /** Étiquette courte affichée sur le bouton, ex. « Débutante passionnée ». */
  badge: string;
  /** Profil du lecteur visé (champ « Lecteur visé »). */
  profil: string;
  /** Niveau de lecture / vocabulaire attendu. */
  niveau: 'debutant' | 'intermediaire' | 'avance' | 'tous';
  /** Ce que le lecteur vient chercher. */
  besoins: string;
  /** Ce qui l'agace ou le fait abandonner un livre. */
  frustrations: string;
  /** Ton conseillé pour ce lecteur. */
  ton: string;
  /** Consigne transmise mot pour mot aux agents d'écriture. */
  consigne: string;
};

export type BookAvatarCategory = {
  id: string;
  label: string;
  /** Catégories du parcours de création reliées à cet univers. */
  matches: string[];
  avatars: BookAvatar[];
};

export const V3_BOOK_AVATARS: BookAvatarCategory[] = [
  {
    id: 'romance',
    label: 'Romance & comédie romantique',
    matches: ['Romance', 'Romance historique'],
    avatars: [
      {
        id: 'romance-emma',
        name: 'Emma, 27 ans',
        badge: 'Première romance',
        profil: 'Lectrice de 25 à 35 ans, grande consommatrice de romances contemporaines, lit le soir et en week-end',
        niveau: 'tous',
        besoins: 'Une tension romantique qui monte chapitre après chapitre, des dialogues frais, des personnages attachants',
        frustrations: 'Les longueurs, les héros interchangeables, une rencontre amoureuse expédiée en deux pages',
        ton: 'Émotionnel',
        consigne:
          'Écris pour une lectrice de romance contemporaine : tension amoureuse progressive, dialogues vivants et naturels, alternance de scènes légères et de scènes émotionnelles fortes. Chaque chapitre doit finir sur une envie de tourner la page.',
      },
      {
        id: 'romance-chloe',
        name: 'Chloé, 36 ans',
        badge: 'Lectrice avertie de sagas',
        profil: 'Lectrice abonnée Kindle Unlimited, dévore plusieurs romances par mois, connaît tous les codes du genre',
        niveau: 'avance',
        besoins: 'Des codes de genre respectés (ennemis puis amants, faux couple), une continuité parfaite entre les tomes',
        frustrations: 'Les clichés mal exécutés, les incohérences de saga, une fin bâclée',
        ton: 'Romanesque',
        consigne:
          'Écris pour une lectrice experte du genre : respecte scrupuleusement le code narratif choisi, soigne les retournements attendus tout en les renouvelant, garde une cohérence stricte des personnages et des lieux d’un chapitre à l’autre.',
      },
      {
        id: 'romance-lea',
        name: 'Léa, 22 ans',
        badge: 'New adult & romance intense',
        profil: 'Jeune lectrice de 18 à 25 ans, fan de romance universitaire ou new adult, découvre ses livres sur les réseaux',
        niveau: 'debutant',
        besoins: 'Des émotions fortes et immédiates, des héros de son âge, une intensité dramatique assumée',
        frustrations: 'Les personnages trop lisses, une intrigue sans obstacles réels, un ton trop sage',
        ton: 'Émotionnel',
        consigne:
          'Écris pour une jeune lectrice de new adult : émotions à vif, obstacles puissants entre les héros, dialogues modernes et spontanés, rythme rapide. Aucune morale, aucune froideur.',
      },
    ],
  },
  {
    id: 'thriller',
    label: 'Thriller & polar',
    matches: ['Thriller / Policier', 'Policier / Enquête', 'Horreur / Suspense'],
    avatars: [
      {
        id: 'thriller-laurent',
        name: 'Laurent, 44 ans',
        badge: 'Amateur de polars noirs',
        profil: 'Lecteur de 35 à 55 ans, lit des polars dans les transports, aime deviner avant le dénouement',
        niveau: 'tous',
        besoins: 'Une chronologie des indices irréprochable, des fausses pistes honnêtes, un suspense qui ne retombe jamais',
        frustrations: 'Les incohérences d’enquête, un coupable sorti de nulle part, les scènes qui n’avancent à rien',
        ton: 'Direct',
        consigne:
          'Écris pour un lecteur de polar exigeant : chaque chapitre apporte un indice ou une menace, la chronologie est vérifiable, les fausses pistes sont plausibles. Phrases nerveuses, chapitres courts, fins de chapitre en tension.',
      },
      {
        id: 'thriller-eric',
        name: 'Éric, 51 ans',
        badge: 'Suiveur de séries noires',
        profil: 'Lecteur fidèle d’une série avec enquêteur récurrent, connaît le héros mieux que l’auteur',
        niveau: 'avance',
        besoins: 'Une mémoire sans faille du profil de l’enquêteur, une ambiance sombre constante, des enjeux personnels',
        frustrations: 'Un héros qui change de caractère, des détails contredits, une intrigue recyclée',
        ton: 'Expert',
        consigne:
          'Écris pour un lecteur de série : respecte à la lettre le caractère, le passé et les tics de langage de l’enquêteur, entretiens l’atmosphère sombre, mêle l’enquête à une blessure personnelle du héros.',
      },
      {
        id: 'thriller-marie',
        name: 'Marie, 37 ans',
        badge: 'Thriller psychologique',
        profil: 'Lectrice de thrillers psychologiques et de huis clos, aime les narrateurs dont on doute',
        niveau: 'intermediaire',
        besoins: 'Une tension intérieure, des secrets de famille ou de couple, un retournement final inattendu mais préparé',
        frustrations: 'La violence gratuite, les personnages féminins réduits à des victimes, un retournement triché',
        ton: 'Émotionnel',
        consigne:
          'Écris un thriller psychologique : la menace vient de l’intimité, pas de l’action. Distille les indices du retournement final dès le début, sans jamais tricher avec le lecteur.',
      },
    ],
  },
  {
    id: 'jeunesse',
    label: 'Jeunesse & young adult',
    matches: ['Enfants / Jeunesse', 'Livre illustré 3-7 ans', 'Éducation / Pédagogie'],
    avatars: [
      {
        id: 'jeunesse-sophie',
        name: 'Sophie, 39 ans',
        badge: 'Histoires du soir 3-8 ans',
        profil: 'Parent qui lit à voix haute le soir à un enfant de 3 à 8 ans',
        niveau: 'debutant',
        besoins: 'Des phrases courtes, un vocabulaire simple, une histoire rassurante qui se lit en 5 à 8 minutes',
        frustrations: 'Les mots trop compliqués, les histoires trop longues, les fins angoissantes',
        ton: 'Inspirant',
        consigne:
          'Écris pour être lu à voix haute à un enfant de 3 à 8 ans : phrases courtes, vocabulaire simple et concret, répétitions douces, univers chaleureux, fin rassurante. Aucune violence, aucune angoisse.',
      },
      {
        id: 'jeunesse-lucas',
        name: 'Lucas, 24 ans',
        badge: 'Young adult / BookTok',
        profil: 'Lecteur de 15 à 25 ans, découvre ses livres sur les réseaux, lit vite et abandonne vite',
        niveau: 'intermediaire',
        besoins: 'Un rythme trépidant dès la première page, des répliques qui claquent, des personnages de son âge',
        frustrations: 'Les descriptions interminables, un ton moralisateur, les clichés sur sa génération',
        ton: 'Direct',
        consigne:
          'Écris pour un lecteur jeune adulte : entre dans l’action dès la première ligne, dialogues vifs et naturels, chapitres courts, enjeux émotionnels forts. Jamais de ton donneur de leçons ni de clichés générationnels.',
      },
      {
        id: 'jeunesse-nina',
        name: 'Nina, 33 ans',
        badge: 'Premières lectures 6-9 ans',
        profil: 'Parent ou enseignant qui cherche des lectures pour un enfant qui apprend à lire seul',
        niveau: 'debutant',
        besoins: 'Des chapitres très courts, des mots simples, une intrigue claire qui donne confiance au jeune lecteur',
        frustrations: 'Les phrases à rallonge, le vocabulaire soutenu, les intrigues trop complexes',
        ton: 'Pédagogique',
        consigne:
          'Écris pour un enfant de 6 à 9 ans qui lit seul : chapitres de quelques pages, phrases simples, héros attachant, humour léger et petite victoire à la fin de chaque chapitre.',
      },
    ],
  },
  {
    id: 'imaginaire',
    label: 'Imaginaire (fantasy, SF, fantastique)',
    matches: ['Fantasy / Fantastique', 'Science-fiction', 'Aventure'],
    avatars: [
      {
        id: 'imaginaire-maxime',
        name: 'Maxime, 31 ans',
        badge: 'Explorateur d’univers',
        profil: 'Lecteur de fantasy qui veut être immergé dans un monde cohérent et original',
        niveau: 'intermediaire',
        besoins: 'Un univers dévoilé par l’action, des règles claires, une immersion immédiate',
        frustrations: 'Les longs exposés d’encyclopédie, les noms imprononçables, un premier chapitre sans enjeu',
        ton: 'Romanesque',
        consigne:
          'Écris pour un lecteur d’imaginaire : révèle l’univers par l’action et les sensations, jamais par de longs exposés. Les règles du monde restent constantes et vérifiables du premier au dernier chapitre.',
      },
      {
        id: 'imaginaire-valerie',
        name: 'Valérie, 41 ans',
        badge: 'Lectrice de sagas',
        profil: 'Lectrice de trilogies et de cycles, prend des notes sur les intrigues secondaires',
        niveau: 'avance',
        besoins: 'Tous les fils narratifs tenus, une progression sur plusieurs tomes, des révélations préparées',
        frustrations: 'Les intrigues secondaires abandonnées, une magie qui change de règles, un tome de transition creux',
        ton: 'Expert',
        consigne:
          'Écris pour une lectrice de saga : garde chaque fil narratif vivant, prépare les révélations par des indices posés à l’avance, respecte à la lettre le système de magie ou de technologie établi.',
      },
      {
        id: 'imaginaire-hugo',
        name: 'Hugo, 19 ans',
        badge: 'Aventure & progression',
        profil: 'Jeune lecteur de fantasy d’aventure et de litRPG, veut de l’action et un héros qui progresse',
        niveau: 'debutant',
        besoins: 'Un héros qui gagne en puissance, des combats lisibles, un rythme sans temps mort',
        frustrations: 'Les pavés descriptifs, un héros passif, un début trop lent',
        ton: 'Direct',
        consigne:
          'Écris une fantasy d’aventure nerveuse : le héros agit et progresse à chaque chapitre, les scènes d’action sont claires et visuelles, l’univers se découvre en chemin.',
      },
    ],
  },
  {
    id: 'developpement',
    label: 'Non-fiction & développement personnel',
    matches: ['Développement personnel', 'Psychologie / Relations', 'Productivité / Organisation'],
    avatars: [
      {
        id: 'dev-isabelle',
        name: 'Isabelle, 48 ans',
        badge: 'Méthode de coach',
        profil: 'Lectrice de 40 à 60 ans en quête de changement concret, déjà lectrice de développement personnel',
        niveau: 'tous',
        besoins: 'Une méthode progressive, des exercices concrets, des exemples de personnes réelles',
        frustrations: 'Les banalités, les promesses vagues, un livre qui parle sans jamais dire comment faire',
        ton: 'Pédagogique',
        consigne:
          'Écris pour une lectrice qui veut appliquer : chaque chapitre apporte une étape claire, un exemple concret et un exercice réalisable aujourd’hui. Aucune généralité, aucune promesse sans mode d’emploi.',
      },
      {
        id: 'dev-damien',
        name: 'Damien, 35 ans',
        badge: 'Guide pratique de niche',
        profil: 'Lecteur pressé qui achète un guide pour résoudre un problème précis',
        niveau: 'debutant',
        besoins: 'Des réponses directes, des listes à puces, un sommaire qui répond à ses questions exactes',
        frustrations: 'Les longues introductions, le remplissage, devoir chercher l’information utile',
        ton: 'Direct',
        consigne:
          'Écris un guide pratique : titres de chapitres formulés comme les questions réelles du lecteur, réponse utile dès le premier paragraphe, listes et étapes numérotées, zéro remplissage.',
      },
      {
        id: 'dev-pauline',
        name: 'Pauline, 29 ans',
        badge: 'Confiance & estime de soi',
        profil: 'Jeune lectrice qui veut gagner en confiance, sensible aux récits personnels et aux exercices doux',
        niveau: 'debutant',
        besoins: 'Un ton bienveillant et jamais culpabilisant, des petits exercices quotidiens, des exemples auxquels s’identifier',
        frustrations: 'Le ton de gourou, les injonctions au bonheur, les méthodes trop brutales',
        ton: 'Inspirant',
        consigne:
          'Écris avec bienveillance : parle à une amie, jamais d’en haut. Un petit exercice réaliste par chapitre, des exemples proches du quotidien, aucune culpabilisation.',
      },
    ],
  },
  {
    id: 'business',
    label: 'Business, entrepreneuriat & argent',
    matches: ['Business / Entrepreneuriat', 'Finances personnelles / Investissement', 'Marketing / Vente en ligne'],
    avatars: [
      {
        id: 'business-marc',
        name: 'Marc, 42 ans',
        badge: 'Indépendant en reconversion',
        profil: 'Cadre ou consultant qui veut lancer son activité et gagner en crédibilité',
        niveau: 'intermediaire',
        besoins: 'Des méthodes éprouvées, des chiffres réels, des étapes mesurables',
        frustrations: 'Le discours de motivation creux, les recettes miracles, l’absence de chiffres',
        ton: 'Expert',
        consigne:
          'Écris pour un professionnel pragmatique : appuie chaque conseil sur un raisonnement vérifiable, donne des étapes mesurables et des ordres de grandeur réalistes. Aucune promesse de gain garanti.',
      },
      {
        id: 'business-julien',
        name: 'Julien, 26 ans',
        badge: 'Jeune investisseur',
        profil: 'Jeune actif qui veut un revenu complémentaire : immobilier, activité en ligne, placements',
        niveau: 'debutant',
        besoins: 'Un vocabulaire expliqué simplement, des cas concrets chiffrés, un premier pas à faire cette semaine',
        frustrations: 'Le jargon financier, les livres théoriques, les conseils inapplicables sans capital',
        ton: 'Direct',
        consigne:
          'Écris pour un débutant motivé : explique chaque terme technique en une phrase, illustre par des cas concrets chiffrés, termine chaque chapitre par une action réalisable dans la semaine. Rappelle les risques honnêtement.',
      },
      {
        id: 'business-sandrine',
        name: 'Sandrine, 45 ans',
        badge: 'Cheffe d’entreprise',
        profil: 'Dirigeante de petite entreprise, cherche à structurer, déléguer et développer sans s’épuiser',
        niveau: 'avance',
        besoins: 'Des méthodes de gestion concrètes, des outils directement utilisables, des retours d’expérience réels',
        frustrations: 'La théorie de cabinet de conseil, les conseils pensés pour les grands groupes, le jargon anglais',
        ton: 'Expert',
        consigne:
          'Écris pour une dirigeante de TPE : conseils applicables à petite échelle, outils concrets cités, exemples d’entreprises réelles de taille modeste. Aucun anglicisme inutile.',
      },
    ],
  },
  {
    id: 'sante',
    label: 'Santé, bien-être, nutrition & cuisine',
    matches: ['Santé / Bien-être', 'Nutrition / Régimes', 'Cuisine / Recettes', 'Fitness / Sport'],
    avatars: [
      {
        id: 'sante-nathalie',
        name: 'Nathalie, 46 ans',
        badge: 'Approche naturelle',
        profil: 'Lectrice attentive à sa santé, cherche à comprendre avant d’appliquer',
        niveau: 'intermediaire',
        besoins: 'Des explications claires de ce qui se passe dans le corps, des conseils applicables au quotidien',
        frustrations: 'Les affirmations non expliquées, les régimes punitifs, le ton culpabilisant',
        ton: 'Pédagogique',
        consigne:
          'Écris avec bienveillance et prudence : explique simplement le mécanisme avant le conseil, reste dans le cadre du bien-être, n’avance aucune promesse de guérison et invite à consulter un professionnel quand c’est nécessaire.',
      },
      {
        id: 'sante-thomas',
        name: 'Thomas, 34 ans',
        badge: 'Pressé du quotidien',
        profil: 'Actif qui veut manger mieux ou se remettre en forme sans y passer ses soirées',
        niveau: 'debutant',
        besoins: 'Des recettes et séances rapides, des étapes limpides, des repères de quantités',
        frustrations: 'Les ingrédients introuvables, les explications floues, les programmes irréalistes',
        ton: 'Direct',
        consigne:
          'Écris pour quelqu’un qui manque de temps : étapes numérotées, durées et quantités précises, ingrédients ou matériel courants, alternatives simples. Jamais de programme culpabilisant.',
      },
      {
        id: 'sante-karim',
        name: 'Karim, 52 ans',
        badge: 'Retour en forme après 50 ans',
        profil: 'Lecteur de plus de 50 ans qui veut reprendre une activité douce et mieux manger, sans se blesser ni se priver',
        niveau: 'debutant',
        besoins: 'Des exercices adaptés et progressifs, des explications rassurantes, des habitudes tenables sur la durée',
        frustrations: 'Les programmes de jeune athlète, les promesses de transformation en 30 jours, le mépris des contraintes de l’âge',
        ton: 'Pédagogique',
        consigne:
          'Écris pour un lecteur de plus de 50 ans : progression douce et sécurisée, ton encourageant, alternatives pour chaque exercice ou recette. Invite à l’avis médical avant tout changement important.',
      },
    ],
  },
  {
    id: 'memoires',
    label: 'Mémoires, biographie & témoignage',
    matches: ['Biographie / Mémoires', 'Témoignage / Récit de vie', 'Histoire / Culture'],
    avatars: [
      {
        id: 'memoires-bernard',
        name: 'Bernard, 68 ans',
        badge: 'Transmission familiale',
        profil: 'Lecteur qui découvre l’histoire d’une famille, souvent proche de l’auteur',
        niveau: 'tous',
        besoins: 'Des anecdotes vivantes, des dates justes, une émotion sincère et des valeurs transmises',
        frustrations: 'Les dates contredites, les listes d’événements sans émotion, un ton figé',
        ton: 'Émotionnel',
        consigne:
          'Écris un récit de vie chaleureux : respecte scrupuleusement la chronologie et les faits donnés, garde les mots et les anecdotes de l’auteur, n’invente aucun événement, aucune date, aucun nom.',
      },
      {
        id: 'memoires-camille',
        name: 'Camille, 38 ans',
        badge: 'Témoignage de résilience',
        profil: 'Lectrice qui traverse une épreuve semblable et cherche de l’espoir',
        niveau: 'tous',
        besoins: 'Une authenticité totale, des étapes de reconstruction, un espoir crédible',
        frustrations: 'Le récit édulcoré, les leçons de morale, une souffrance étalée sans issue',
        ton: 'Émotionnel',
        consigne:
          'Écris un témoignage authentique : montre l’épreuve sans complaisance et la reconstruction pas à pas. Aucune leçon de morale, aucun conseil médical, une lueur d’espoir à la fin de chaque chapitre.',
      },
      {
        id: 'memoires-helene',
        name: 'Hélène, 55 ans',
        badge: 'Biographie de figure inspirante',
        profil: 'Lectrice de biographies de personnalités, veut comprendre le parcours et les coulisses',
        niveau: 'intermediaire',
        besoins: 'Un récit documenté, des moments charnières bien racontés, le contexte de l’époque',
        frustrations: 'Les ragots, les faits non sourcés, une admiration béate sans distance',
        ton: 'Expert',
        consigne:
          'Écris une biographie rigoureuse : faits vérifiables, contexte historique expliqué simplement, regard équilibré sur la personnalité. N’invente ni citation ni anecdote.',
      },
    ],
  },
  {
    id: 'spiritualite',
    label: 'Spiritualité, méditation & quête de sens',
    matches: ['Spiritualité', 'Poésie', 'Nature / Animaux'],
    avatars: [
      {
        id: 'spi-claire',
        name: 'Claire, 52 ans',
        badge: 'Éveil intérieur',
        profil: 'Lectrice sensible, pratique la méditation, aime les textes qui apaisent',
        niveau: 'tous',
        besoins: 'Une écriture poétique et apaisante, des méditations guidées, un rythme lent',
        frustrations: 'Le ton dogmatique, les promesses surnaturelles, un vocabulaire abscons',
        ton: 'Inspirant',
        consigne:
          'Écris avec douceur et images concrètes : phrases amples, respiration dans le texte, propositions de pratique à la fin des chapitres. Aucun dogme, aucune promesse de pouvoir ou de guérison.',
      },
      {
        id: 'spi-antoine',
        name: 'Antoine, 40 ans',
        badge: 'Chercheur de clarté',
        profil: 'Lecteur rationnel attiré par la philosophie pratique et le stoïcisme',
        niveau: 'intermediaire',
        besoins: 'Un raisonnement sobre, des citations fortes situées, des exercices d’introspection',
        frustrations: 'Le mysticisme, les citations attribuées au hasard, le flou',
        ton: 'Expert',
        consigne:
          'Écris de façon sobre et argumentée : une idée par chapitre, un exemple concret, un exercice d’introspection. N’attribue une citation que si sa source est certaine, sinon reformule sans auteur.',
      },
      {
        id: 'spi-manon',
        name: 'Manon, 34 ans',
        badge: 'Astrologie & rituels',
        profil: 'Jeune lectrice curieuse d’astrologie, de cycles lunaires et de rituels du quotidien',
        niveau: 'debutant',
        besoins: 'Des explications accessibles, des rituels simples à faire chez soi, un calendrier clair',
        frustrations: 'Le jargon ésotérique, les promesses miraculeuses, un ton qui infantilise',
        ton: 'Inspirant',
        consigne:
          'Écris pour une débutante curieuse : explique chaque notion simplement, propose des rituels courts et réalisables, reste dans l’invitation jamais dans la prédiction. Aucune promesse de résultat.',
      },
    ],
  },
  {
    id: 'carnets',
    label: 'Carnets guidés & journaux',
    matches: ['Carnet / Journal / Cahier', 'Loisirs créatifs / DIY', 'Voyage / Guide'],
    avatars: [
      {
        id: 'carnet-sarah',
        name: 'Sarah, 29 ans',
        badge: 'Carnet bien-être',
        profil: 'Utilisatrice de carnets de gratitude et de journaux créatifs, sensible à l’esthétique',
        niveau: 'debutant',
        besoins: 'Des consignes courtes par page, des citations inspirantes, une mise en page aérée',
        frustrations: 'Les pages surchargées, les consignes répétitives, les textes trop longs',
        ton: 'Inspirant',
        consigne:
          'Écris des consignes de carnet très courtes : une invitation par page, formulation positive, aucune répétition d’une page à l’autre, place laissée à l’écriture du lecteur.',
      },
      {
        id: 'carnet-romain',
        name: 'Romain, 33 ans',
        badge: 'Suivi d’habitudes',
        profil: 'Utilisateur de journaux de suivi : sport, productivité, objectifs chiffrés',
        niveau: 'intermediaire',
        besoins: 'Une structure carrée, des objectifs mesurables, un bilan hebdomadaire',
        frustrations: 'Les rubriques floues, l’absence de bilan, une structure qui change en cours de carnet',
        ton: 'Direct',
        consigne:
          'Écris un carnet de suivi structuré : mêmes rubriques à chaque page, objectifs mesurables, bilan hebdomadaire avec trois questions précises. Structure identique du début à la fin.',
      },
      {
        id: 'carnet-elodie',
        name: 'Élodie, 41 ans',
        badge: 'Carnet de voyage & souvenirs',
        profil: 'Voyageuse qui veut un carnet pour consigner itinéraires, rencontres et émotions',
        niveau: 'tous',
        besoins: 'Des pages thématiques variées, des invitations à dessiner ou coller, des listes pratiques',
        frustrations: 'Un carnet trop rigide, des rubriques inutiles, l’absence de place pour les souvenirs',
        ton: 'Inspirant',
        consigne:
          'Écris un carnet de voyage vivant : alterne pages pratiques et pages souvenirs, invitations courtes et poétiques, espace libre pour l’écriture et les collages du lecteur.',
      },
    ],
  },
];

/** Trouve l'univers d'avatars correspondant à une catégorie du parcours de création. */
export function findAvatarCategory(category?: string): BookAvatarCategory | undefined {
  const value = (category || '').trim().toLowerCase();
  if (!value) return undefined;
  return (
    V3_BOOK_AVATARS.find((group) => group.matches.some((m) => m.toLowerCase() === value)) ||
    V3_BOOK_AVATARS.find((group) => group.matches.some((m) => value.includes(m.toLowerCase().split(' ')[0])))
  );
}

export function findAvatarById(id?: string): BookAvatar | undefined {
  if (!id) return undefined;
  for (const group of V3_BOOK_AVATARS) {
    const found = group.avatars.find((a) => a.id === id);
    if (found) return found;
  }
  return undefined;
}

export const NIVEAU_LABELS: Record<BookAvatar['niveau'], string> = {
  debutant: 'Lecture facile',
  intermediaire: 'Lecture courante',
  avance: 'Lecteur exigeant',
  tous: 'Tous niveaux',
};
