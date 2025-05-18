
// Fonction principale qui génère les descriptions SEO
export const generateSeoDescription = (keyword: string, isLong: boolean = false): string => {
  // Si aucun mot-clé n'est fourni, utiliser une valeur par défaut
  if (!keyword || keyword.trim().length === 0) {
    keyword = "contenu optimisé";
  }
  
  // Convertir le mot-clé en minuscules pour les vérifications
  const keywordLowerCase = keyword.toLowerCase();
  
  // Vérifier si le mot-clé est lié au voyage
  const isTravelRelated = isTravelKeyword(keywordLowerCase);
  
  // Vérifier si le mot-clé est lié à l'aquariophilie
  const isAquariumRelated = isAquariumKeyword(keywordLowerCase);
  
  let description = "";
  const maxLength = isLong ? 500 : 155;
  
  if (isAquariumRelated) {
    // Descriptions spécifiques pour l'aquariophilie
    if (isLong) {
      const options = [
        `Découvrez tout sur ${keyword} dans notre guide complet d'aquariophilie. Nous partageons notre expertise sur le choix des équipements, l'entretien de l'eau, et les meilleures espèces de poissons adaptées à votre aquarium. Que vous soyez débutant ou passionné expérimenté, vous trouverez des conseils pratiques pour créer un environnement aquatique sain et équilibré. Apprenez à gérer les paramètres de l'eau, à sélectionner les plantes appropriées et à maintenir un écosystème prospère pour vos poissons. Notre guide aborde également les problèmes courants et leurs solutions pour vous assurer une expérience d'aquariophilie réussie.`,
        `Explorez l'univers fascinant de ${keyword} avec notre guide détaillé d'aquariophilie. De la mise en place initiale d'un aquarium à la maintenance quotidienne, en passant par le choix judicieux des habitants aquatiques, nous couvrons tous les aspects essentiels pour les passionnés. Nos experts partagent leurs connaissances sur les filtrations, l'éclairage, les substrats et l'équilibre biologique nécessaire au bien-être de vos poissons. Découvrez également nos astuces pour la création de paysages aquatiques spectaculaires et nos recommandations pour résoudre efficacement les défis que vous pourriez rencontrer dans votre passion pour l'aquariophilie.`,
        `Immergez-vous dans le monde captivant de ${keyword} grâce à notre ressource complète sur l'aquariophilie. Ce guide approfondi vous accompagne à chaque étape de votre aventure aquatique, depuis la sélection du bon équipement jusqu'à la gestion de la santé de vos poissons. Nous abordons les techniques avancées de maintenance d'aquarium, les secrets pour une eau cristalline et les compatibilités entre différentes espèces. Que vous possédiez un nano-aquarium ou une grande installation, nos conseils d'experts vous aideront à créer un habitat sous-marin magnifique et durable où vos poissons et plantes aquatiques s'épanouiront pleinement.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    } else {
      const options = [
        `Tout ce que vous devez savoir sur ${keyword} : conseils d'experts, guide d'équipement, choix des poissons et maintenance d'aquarium pour créer un écosystème aquatique équilibré et sain.`,
        `Découvrez nos astuces pour ${keyword} : sélection d'espèces compatibles, entretien optimal de l'eau, technologies de filtration et décoration naturelle pour un aquarium réussi.`,
        `Guide complet sur ${keyword} pour débutants et passionnés : types d'aquariums, poissons recommandés, plantes aquatiques et solutions aux problèmes courants d'aquariophilie.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
  } else if (isTravelRelated) {
    // Descriptions spécifiques pour le voyage
    if (isLong) {
      const options = [
        `Partez à la découverte de ${keyword} avec notre guide de voyage complet. Nous vous dévoilons les sites incontournables, les activités à ne pas manquer et les meilleures périodes pour visiter cette destination. Profitez de nos conseils d'initiés sur les hébergements, la gastronomie locale et les transports pour planifier un séjour inoubliable. Notre guide inclut également des itinéraires détaillés adaptés à différentes durées de voyage, des recommandations culturelles et des astuces pour voyager de façon responsable et authentique. Que vous soyez aventurier, amateur de culture ou en quête de détente, vous trouverez toutes les informations nécessaires pour créer votre voyage idéal.`,
        `Préparez votre voyage à ${keyword} grâce à notre guide exhaustif qui couvre tous les aspects de cette destination exceptionnelle. Découvrez l'histoire fascinante, les traditions culturelles et les merveilles naturelles qui font la renommée de ce lieu. Nos experts vous proposent une sélection des meilleurs restaurants, hôtels et expériences locales pour tous les budgets. Le guide aborde également les questions pratiques comme les formalités d'entrée, la santé, la sécurité et les moyens de communication sur place. Avec nos recommandations saisonnières et nos suggestions d'excursions hors des sentiers battus, vous vivrez une expérience authentique et mémorable lors de votre séjour.`,
        `Explorez ${keyword} en profondeur avec notre guide de voyage détaillé, fruit de nombreuses années d'expérience. Nous vous guidons à travers les quartiers emblématiques, les trésors cachés et les panoramas à couper le souffle de cette destination. Notre expertise couvre les aspects culturels essentiels, les festivals locaux et les coutumes à respecter pour une immersion réussie. Vous trouverez également des conseils pratiques sur le budget à prévoir, les moyens de transport locaux et les applications utiles pour faciliter votre séjour. Que vous planifiiez un court séjour ou un voyage prolongé, notre guide vous aide à maximiser chaque moment et à créer des souvenirs inoubliables.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    } else {
      const options = [
        `Découvrez ${keyword} : sites incontournables, conseils pratiques et itinéraires sur mesure pour un voyage inoubliable. Guide complet avec hébergements, gastronomie et activités locales.`,
        `Guide essentiel pour explorer ${keyword} : monuments historiques, trésors naturels, expériences culturelles et astuces de voyage pour profiter pleinement de votre séjour à chaque saison.`,
        `Planifiez votre aventure à ${keyword} avec notre guide expert : attractions principales, conseils d'initiés et informations pratiques pour un voyage authentique et mémorable.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
  } else {
    // Descriptions génériques pour d'autres sujets
    if (isLong) {
      const options = [
        `Découvrez tout ce que vous devez savoir sur ${keyword} dans notre guide complet. Notre équipe d'experts a rassemblé les informations essentielles, conseils pratiques et astuces pour vous aider à maîtriser ce sujet. Que vous soyez débutant ou que vous cherchiez à approfondir vos connaissances, vous trouverez des explications détaillées et méthodiques adaptées à votre niveau. Nous abordons les fondamentaux, les techniques avancées et les dernières tendances dans ce domaine. Notre contenu est régulièrement mis à jour pour garantir des informations pertinentes et actuelles. Profitez également de nos ressources complémentaires pour continuer votre apprentissage et développer vos compétences.`,
        `Explorez l'univers de ${keyword} avec notre ressource détaillée qui répond à toutes vos questions. Nous avons analysé en profondeur ce sujet pour vous offrir un contenu fiable et instructif qui vous accompagnera dans votre démarche d'apprentissage. Notre guide couvre les aspects théoriques et pratiques, avec des exemples concrets et des études de cas qui illustrent les concepts clés. Vous découvrirez également des témoignages de professionnels du secteur et des retours d'expérience pertinents. Que vous recherchiez des solutions à des problèmes spécifiques ou une compréhension globale du sujet, notre guide exhaustif vous fournira toutes les clés pour progresser.`,
        `Plongez dans le monde de ${keyword} avec notre guide approfondi spécialement conçu pour répondre à vos besoins. Notre approche pédagogique vous permet d'assimiler progressivement les concepts complexes et d'acquérir une maîtrise solide du sujet. Nous combinons théorie et applications pratiques pour un apprentissage efficace et durable. Le guide inclut des conseils d'experts, des astuces personnalisées et des recommandations adaptées à différents profils d'utilisateurs. Vous bénéficierez également d'un accès à des outils et ressources exclusifs pour mettre en pratique vos connaissances. Notre objectif est de vous fournir une compréhension complète et actualisée qui vous permettra d'exceller dans ce domaine.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    } else {
      const options = [
        `Découvrez notre guide complet sur ${keyword} : conseils d'experts, méthodologies éprouvées et solutions pratiques pour maîtriser ce sujet et obtenir des résultats concrets rapidement.`,
        `Tout ce que vous devez savoir sur ${keyword} : explications détaillées, techniques efficaces et recommandations personnalisées pour développer vos compétences dans ce domaine.`,
        `Guide essentiel de ${keyword} : principes fondamentaux, approches innovantes et conseils d'initiés pour comprendre et exploiter pleinement le potentiel de cette thématique.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
  }
  
  // Assurez-vous que la description ne dépasse pas la longueur maximale
  if (description.length > maxLength) {
    description = description.substring(0, maxLength - 1) + ".";
  }
  
  return description;
};

// Fonction qui vérifie si un mot-clé est lié au voyage
const isTravelKeyword = (keyword: string): boolean => {
  const travelTerms = [
    'voyage', 'voyageur', 'destination', 'tourisme', 'excursion', 'séjour',
    'vacances', 'circuit', 'visite', 'aventure', 'découverte', 'touriste',
    'itinéraire', 'guide', 'explorer', 'road trip', 'trek', 'randonnée',
    'hôtel', 'plage', 'montagne', 'backpacker', 'île', 'croisière',
    'vol', 'avion', 'train', 'bateau', 'bali', 'paris', 'rome', 'tokyo',
    'new york', 'londres', 'barcelone', 'thailand', 'thaïlande', 'japon',
    'france', 'italie', 'espagne', 'grèce', 'asie', 'europe', 'amérique',
    'afrique', 'océanie', 'caraïbes', 'méditerranée', 'alpes', 'pyrénées',
    'visa', 'passeport', 'valise', 'sac à dos', 'réservation', 'airbnb',
    'camping', 'guesthouse', 'auberge', 'resort', 'all-inclusive', 'spa',
    'gastronomie', 'culture', 'histoire', 'monument', 'plongée', 'safari',
    'finlande', 'corse', 'vietnam', 'australie', 'mexique', 'maroc',
    'festival', 'local', 'autochtone', 'éco-tourisme', 'durable'
  ];
  
  return travelTerms.some(term => keyword.includes(term));
};

// Fonction qui vérifie si un mot-clé est lié à l'aquariophilie
const isAquariumKeyword = (keyword: string): boolean => {
  const aquariumTerms = [
    'aquari', 'aquarium', 'poisson', 'fish', 'tank', 'eau douce', 'freshwater',
    'eau de mer', 'saltwater', 'récifal', 'reef', 'corail', 'coral',
    'betta', 'guppy', 'discus', 'cichlidé', 'cichlid', 'tetra', 'scalaire',
    'plante', 'plant', 'algue', 'algae', 'filtre', 'filter', 'pompe', 'pump',
    'chauffage', 'heater', 'éclairage', 'lighting', 'co2', 'substrat', 'substrate',
    'nourriture', 'food', 'parasite', 'maladie', 'disease', 'maintenance',
    'entretien', 'nettoyage', 'cleaning', 'eau', 'water', 'test', 'ph', 'kh', 'gh',
    'ammoniac', 'ammonia', 'nitrite', 'nitrate', 'oxygène', 'oxygen',
    'aquascape', 'aquascaping', 'biotope', 'nano', 'crevette', 'shrimp',
    'escargot', 'snail', 'reproduction', 'breeding', 'alevins', 'fry',
    'aquariosland', 'aquaportail', 'aqua', 'tropical', 'marin', 'marine'
  ];
  
  return aquariumTerms.some(term => keyword.includes(term));
};

// Fonction qui génère à la fois la description courte et longue
export const generateBothDescriptions = (keyword: string): { short: string, long: string } => {
  return {
    short: generateSeoDescription(keyword, false),
    long: generateSeoDescription(keyword, true)
  };
};
