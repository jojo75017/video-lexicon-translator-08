
// Questions populaires pour le SEO
export const popularQuestions = [
  "Comment améliorer le référencement de mon site e-commerce en 2024?",
  "Quelles sont les meilleures stratégies de backlinks pour un nouveau site web?",
  "Comment optimiser mon contenu pour le featured snippet de Google?",
  "Quels outils SEO sont indispensables pour analyser la concurrence?",
  "Comment rédiger du contenu qui performe bien pour le SEO et la conversion?",
  "Quelle est l'impact de l'IA sur le référencement naturel en 2024?",
  "Comment optimiser un site WordPress pour le Core Web Vitals?",
  "Quelles sont les meilleures pratiques SEO pour le e-commerce international?",
  "Comment mesurer efficacement le ROI de mes efforts SEO?",
  "Quelles sont les alternatives à Google Analytics respectueuses de la vie privée?",
  "Comment créer une stratégie de contenu efficace pour le SEO local?",
  "Pourquoi mon site a-t-il perdu son classement après la dernière mise à jour de Google?",
  "Comment optimiser les images pour améliorer les performances SEO?",
  "Quelles sont les meilleures façons d'utiliser les réseaux sociaux pour le SEO?",
  "Comment structurer les données de mon site pour les rich snippets?",
  "Quelle est la différence entre le SEO on-page et off-page?",
  "Comment améliorer mon taux de conversion avec le SEO?",
  "Quelles sont les erreurs SEO les plus courantes à éviter?"
];

// Base de connaissances de réponses par catégorie
const responseDatabase = {
  seo: {
    general: "Le SEO (Search Engine Optimization) est un ensemble de techniques visant à améliorer le positionnement d'un site web dans les résultats des moteurs de recherche. En 2024, les pratiques SEO les plus efficaces comprennent la création de contenu E-E-A-T (Expertise, Expérience, Autorité, Fiabilité), l'optimisation pour l'intention de recherche, et l'amélioration de l'expérience utilisateur. Les moteurs de recherche comme Google évaluent plus de 200 facteurs pour classer les sites, incluant la qualité du contenu, la structure technique du site, les signaux utilisateurs et la pertinence par rapport aux requêtes.",
    
    technique: "L'aspect technique du SEO est fondamental pour assurer une bonne indexation par les moteurs de recherche. Cela inclut l'optimisation de la vitesse de chargement, l'architecture du site, la structure des URL, le balisage HTML sémantique, et les données structurées. Pour améliorer le SEO technique, il est recommandé d'utiliser des outils comme Lighthouse, PageSpeed Insights ou GTmetrix pour identifier les problèmes de performance. Les Core Web Vitals sont désormais des signaux de classement importants qui mesurent l'expérience utilisateur en termes de chargement, d'interactivité et de stabilité visuelle.",
    
    contenu: "Le contenu est au cœur du SEO moderne. Pour être efficace, votre contenu doit être approfondi, répondre précisément aux questions des utilisateurs et démontrer votre expertise. La recherche de mots-clés reste importante, mais elle doit s'orienter vers des sujets complets plutôt que des mots-clés isolés. Les formats de contenu comme les FAQ, les guides complets, et les articles de fond ont tendance à mieux performer. N'oubliez pas d'optimiser vos titres, méta-descriptions, et d'utiliser une structure hiérarchique de titres (H1, H2, H3) pour aider les moteurs de recherche à comprendre l'organisation de votre contenu.",
    
    backlinks: "Les backlinks restent l'un des facteurs de classement les plus importants. La qualité prime sur la quantité - un lien provenant d'un site autoritaire dans votre domaine vaut beaucoup plus que des dizaines de liens de sites peu pertinents. Les meilleures stratégies pour obtenir des backlinks incluent la création de contenu de référence, les relations avec les médias, le guest blogging sur des sites de qualité, et la récupération de mentions de marque non liées. Évitez absolument les services de liens payants à grande échelle ou les réseaux de liens privés qui peuvent entraîner des pénalités."
  },
  
  marketing: {
    general: "Le marketing digital englobe tous les efforts marketing utilisant des canaux électroniques. Une stratégie efficace intègre généralement plusieurs canaux comme le SEO, les réseaux sociaux, l'email marketing, le contenu, et parfois la publicité payante. L'approche la plus efficace consiste à créer un entonnoir marketing cohérent qui guide les prospects de la découverte à la conversion. En 2024, la personnalisation, l'automatisation et l'analyse de données sont devenues essentielles pour optimiser chaque étape de cet entonnoir.",
    
    social: "Le marketing sur les réseaux sociaux nécessite une approche différente pour chaque plateforme. Instagram et TikTok privilégient le contenu visuel et authentique, LinkedIn est idéal pour le B2B avec du contenu professionnel de valeur, tandis que Twitter excelle pour les actualités et les conversations en temps réel. La clé du succès sur les réseaux sociaux est la cohérence, l'engagement authentique avec votre communauté, et la création de contenu qui suscite des émotions ou apporte une valeur réelle. Les stratégies paid-to-organic fonctionnent particulièrement bien, où la publicité sert à amplifier votre meilleur contenu organique.",
    
    email: "L'email marketing reste l'un des canaux avec le meilleur ROI, générant en moyenne 42$ pour chaque dollar dépensé. Pour maximiser son efficacité, segmentez votre audience, personnalisez vos messages, et automatisez vos campagnes en fonction du comportement des utilisateurs. Les séquences d'emails de bienvenue, de réengagement et d'abandon de panier sont particulièrement efficaces. Concernant le contenu des emails, privilégiez la valeur sur la promotion, avec un ratio idéal de 80% de contenu informatif pour 20% de contenu promotionnel.",
    
    budget: "Avec un budget marketing limité, concentrez-vous sur les canaux à fort ROI comme l'email marketing et le SEO organique. Ciblez des niches spécifiques plutôt que des marchés larges et compétitifs. Utilisez le marketing de contenu pour attirer du trafic organique et construire votre autorité. Pour la publicité payante, commencez avec de petits budgets tests et optimisez en fonction des données. Les partenariats avec des créateurs de contenu ou des marques complémentaires peuvent également offrir une excellente visibilité à moindre coût."
  },
  
  ecommerce: {
    general: "La réussite d'un site e-commerce repose sur plusieurs facteurs clés : une expérience utilisateur fluide, une stratégie de prix compétitive, un excellent service client, et une présentation de produit convaincante. En 2024, les consommateurs s'attendent à une expérience omnicanale cohérente, des options de paiement flexibles, et une politique de retour transparente. Les sites e-commerce qui se démarquent utilisent également la personnalisation pour adapter l'expérience d'achat aux préférences individuelles des utilisateurs.",
    
    conversion: "Pour améliorer le taux de conversion d'un site e-commerce, optimisez d'abord le processus de paiement en le simplifiant au maximum et en offrant plusieurs options de paiement. Les descriptions de produits détaillées avec des photos de haute qualité et des avis clients authentiques renforcent la confiance. Utilisez les notifications de stock limité et les témoignages sociaux pour créer un sentiment d'urgence. Le remarketing auprès des visiteurs qui ont abandonné leur panier peut augmenter significativement les conversions, tout comme les offres d'expédition gratuite à partir d'un certain montant.",
    
    tendances: "Les tendances e-commerce de 2024 incluent l'augmentation du commerce social permettant d'acheter directement via les plateformes sociales, les expériences d'achat augmentée (AR/VR) pour visualiser les produits, et l'adoption croissante du commerce vocal. Le développement durable devient un facteur décisif d'achat, avec une demande accrue pour des produits éco-responsables et des pratiques commerciales éthiques. Les abonnements et modèles de revenus récurrents continuent également de gagner en popularité."
  },
  
  contenu: {
    general: "Une stratégie de contenu efficace doit être centrée sur les besoins et questions de votre audience cible. Commencez par créer des personas détaillés et cartographiez le parcours client pour identifier les sujets pertinents à chaque étape. Variez les formats de contenu (articles, vidéos, infographies, podcasts) pour engager différents segments d'audience. Établissez un calendrier éditorial cohérent et mesurez régulièrement la performance de vos contenus pour optimiser votre stratégie.",
    
    creation: "Pour créer du contenu de qualité, recherchez d'abord en profondeur le sujet et l'intention de recherche associée. Structurez votre contenu logiquement avec une introduction captivante, un développement clair divisé en sections, et une conclusion avec appel à l'action. Enrichissez le texte avec des données, exemples concrets, et citations d'experts. Optimisez la lisibilité en utilisant des paragraphes courts, des listes à puces, et des sous-titres descriptifs. Enfin, complétez avec des éléments visuels pertinents et assurez-vous que votre contenu apporte une valeur unique que vos concurrents n'offrent pas.",
    
    distribution: "La distribution est aussi importante que la création de contenu. Adaptez votre contenu pour chaque canal de distribution : versions courtes et visuelles pour les réseaux sociaux, formats plus détaillés pour votre blog, et peut-être des versions PDF téléchargeables pour l'email marketing. Utilisez la technique de l'atomisation de contenu, en transformant un contenu principal en plusieurs formats plus petits. Pour maximiser la portée organique, optimisez le timing de publication en fonction des habitudes de votre audience et encouragez le partage en rendant le processus simple et attrayant."
  },
  
  reseaux_sociaux: {
    general: "La gestion efficace des réseaux sociaux repose sur trois piliers : la cohérence de publication, l'engagement authentique avec votre communauté, et l'analyse régulière des performances. Créez une identité visuelle distinctive et un ton de voix reconnaissable. Adaptez votre stratégie à chaque plateforme tout en maintenant une cohérence de marque. Les outils comme Buffer, Hootsuite ou Later peuvent vous aider à planifier et analyser vos publications sur plusieurs plateformes simultanément.",
    
    algorithmes: "Les algorithmes des réseaux sociaux favorisent généralement le contenu qui génère un engagement significatif et des interactions authentiques. Sur Instagram, la durée de visionnage et les interactions sont cruciales. TikTok valorise la rétention et le taux de visionnage complet. LinkedIn privilégie les publications qui génèrent des commentaires pertinents. Facebook donne priorité aux contenus qui suscitent des conversations entre proches. Pour tous ces réseaux, la première heure après publication est déterminante - si votre contenu performe bien pendant cette période, l'algorithme amplifiera sa distribution.",
    
    croissance: "Pour développer une présence organique sur les réseaux sociaux, misez sur la constance et la qualité plutôt que la quantité. Identifiez votre créneau spécifique et devenez une référence dans ce domaine. Interagissez régulièrement avec des comptes similaires ou complémentaires au vôtre. Utilisez les hashtags stratégiquement en mélangeant des hashtags populaires et de niche. Encouragez l'engagement avec des questions, sondages ou concours. Analysez vos publications les plus performantes pour identifier les formats et sujets qui résonnent le mieux avec votre audience."
  },
  
  voyage: {
    general: "Planifier un voyage réussi commence par définir clairement vos priorités: souhaitez-vous privilégier les visites culturelles, la détente, l'aventure ou la gastronomie? Le budget détermine ensuite vos options d'hébergement, de transport et d'activités. La période de voyage affecte considérablement l'expérience: haute saison pour l'animation mais avec plus de touristes et des prix élevés, ou basse saison pour plus d'authenticité et des tarifs avantageux. Quel que soit votre choix, laissez toujours une place à l'improvisation pour découvrir des expériences inattendues.",
    
    budget: "Voyager à petit budget est tout à fait possible avec quelques astuces simples. Privilégiez les vols avec escales et soyez flexible sur les dates. Pour l'hébergement, alternez entre auberges de jeunesse, Airbnb et couchsurfing. Les cartes de transport illimité sont généralement plus économiques que les tickets individuels. Pour la nourriture, mangez où vont les locaux plutôt que dans les zones touristiques, et faites vos courses dans les marchés locaux. Enfin, de nombreuses villes proposent des attractions gratuites ou à prix réduit certains jours - renseignez-vous avant votre départ.",
    
    destinations: "Parmi les destinations tendance en 2024, on trouve l'Albanie pour ses plages méditerranéennes encore préservées, le Guyana en Amérique du Sud pour l'écotourisme, et la Slovénie pour son mélange parfait entre nature intacte et culture européenne. En Asie, le Laos se réinvente avec de nouvelles infrastructures tout en gardant son authenticité. Pour ceux qui recherchent des destinations durables, le Costa Rica, la Nouvelle-Zélande et la Suède sont en tête avec leurs initiatives écologiques dans le tourisme."
  },

  sante: {
    general: "La santé globale repose sur quatre piliers fondamentaux: une alimentation équilibrée, une activité physique régulière, un sommeil de qualité et une bonne gestion du stress. L'approche moderne de la santé intègre également le bien-être mental et émotionnel comme composantes essentielles. Les recherches récentes montrent l'importance du microbiome intestinal sur la santé générale et le système immunitaire. Pour un mode de vie sain, privilégiez les changements progressifs et durables plutôt que les régimes drastiques ou les programmes d'exercice intensifs difficiles à maintenir.",
    
    nutrition: "Une alimentation équilibrée devrait être composée principalement d'aliments non transformés: fruits, légumes, grains entiers, protéines maigres et graisses saines. Le régime méditerranéen, riche en huile d'olive, poissons, légumineuses et légumes, a démontré scientifiquement ses bénéfices pour la santé cardiovasculaire et cognitive. L'hydratation est également cruciale, avec une recommandation d'environ 2 litres d'eau par jour. La clé d'une nutrition saine n'est pas l'élimination totale de certains aliments mais plutôt la modération et l'équilibre.",
    
    mental: "La santé mentale nécessite autant d'attention que la santé physique. Des pratiques comme la méditation, la pleine conscience ou la thérapie cognitive comportementale ont prouvé leur efficacité pour réduire l'anxiété et améliorer le bien-être général. Maintenir des relations sociales de qualité joue également un rôle crucial dans notre équilibre psychologique. Si vous ressentez des symptômes persistants comme la tristesse, l'anxiété ou des troubles du sommeil, n'hésitez pas à consulter un professionnel - demander de l'aide est un signe de force, pas de faiblesse."
  },
  
  technologie: {
    general: "L'évolution technologique continue d'accélérer avec l'IA générative, l'informatique quantique et la réalité augmentée en tête des innovations de 2024. Ces technologies transforment rapidement des secteurs entiers, de la santé à l'éducation en passant par la finance. Pour les entreprises, l'adoption stratégique de ces technologies peut créer un avantage concurrentiel significatif, mais nécessite une évaluation rigoureuse du retour sur investissement et des implications éthiques. Pour rester informé, suivez des publications spécialisées comme MIT Technology Review, Wired ou les blogs de recherche des grandes entreprises technologiques.",
    
    ia: "L'intelligence artificielle est désormais accessible aux entreprises de toutes tailles grâce aux modèles pré-entraînés et aux plateformes d'IA en tant que service. Pour l'implémenter efficacement, commencez par identifier des cas d'usage spécifiques où l'IA peut résoudre un problème concret ou créer une valeur mesurable. Assurez-vous d'avoir des données de qualité et en quantité suffisante. Adoptez une approche progressive: commencez avec un projet pilote, mesurez les résultats, puis étendez progressivement. N'oubliez pas d'investir dans la formation de vos équipes et de considérer les implications éthiques et de confidentialité dès le départ.",
    
    dev: "Le développement logiciel moderne s'oriente vers des pratiques comme le DevOps, l'architecture microservices et le développement piloté par tests. L'approche 'shift left' intègre la sécurité et les tests plus tôt dans le cycle de développement. Les langages comme Python, JavaScript (notamment avec des frameworks comme React et Node.js), et Rust gagnent en popularité. Pour les débutants souhaitant apprendre la programmation, commencez par comprendre les fondamentaux (variables, boucles, fonctions) avant de vous spécialiser dans un langage spécifique, et construisez régulièrement des projets personnels pour appliquer vos connaissances."
  },
  
  business: {
    general: "Lancer et développer une entreprise prospère en 2024 exige une combinaison de vision stratégique et d'adaptabilité opérationnelle. Avant tout investissement, validez votre idée via un MVP (produit minimum viable) et des retours clients réels. Construisez une équipe complémentaire en termes de compétences et de personnalités. La proposition de valeur unique de votre entreprise doit être claire et communiquée de façon cohérente à travers tous vos canaux. Dans un environnement économique incertain, maintenez une gestion financière prudente avec suffisamment de trésorerie pour traverser les périodes difficiles.",
    
    startup: "Pour les startups cherchant du financement, préparez un pitch deck concis (10-12 diapositives maximum) qui présente clairement le problème, votre solution, le marché cible, le modèle économique, la traction actuelle et l'équipe. Les indicateurs de performance clés qui intéressent les investisseurs sont le CAC (coût d'acquisition client), le LTV (valeur vie client), le taux de croissance et le taux de rétention. Diversifiez vos sources de financement entre business angels, capital-risque, financement participatif et subventions. La levée de fonds prend généralement 4-6 mois, alors planifiez bien à l'avance.",
    
    strategie: "La planification stratégique efficace commence par une analyse SWOT approfondie (forces, faiblesses, opportunités, menaces) et une compréhension claire de votre positionnement concurrentiel. Définissez des objectifs SMART (spécifiques, mesurables, atteignables, pertinents, temporels) et décomposez-les en initiatives trimestrielles. Impliquez vos équipes dans l'élaboration de la stratégie pour garantir l'adhésion. Revisitez et ajustez régulièrement votre plan en fonction des retours du marché. Les cadres stratégiques comme le Business Model Canvas ou la matrice Ansoff peuvent vous aider à structurer votre réflexion."
  }
};

// Fonction pour trouver les mots-clés dans une question
const extractKeywords = (question) => {
  const questionLower = question.toLowerCase();
  
  // Liste de mots à ignorer dans l'analyse des mots-clés
  const stopWords = [
    "comment", "pourquoi", "quelles", "quels", "quelle", "quel", 
    "sont", "est", "les", "la", "le", "des", "du", "un", "une",
    "pour", "avec", "sans", "dans", "sur", "en", "à", "au", "aux",
    "et", "ou", "mais", "donc", "car", "ni", "que", "qui", "quoi",
    "dont", "où", "quand", "comment", "combien", "meilleur", "meilleure",
    "meilleures", "meilleurs"
  ];
  
  // Extraire tous les mots de la question
  let words = questionLower.split(/\s+/).map(word => 
    word.replace(/[.,?!;:()'"]/g, '') // Supprimer la ponctuation
  );
  
  // Filtrer les mots vides
  words = words.filter(word => word.length > 2 && !stopWords.includes(word));
  
  return words;
};

// Fonction pour déterminer la catégorie de la question
const determineCategory = (keywords) => {
  const categoryKeywords = {
    seo: ["seo", "référencement", "google", "serp", "position", "classement", "organique", "balises", "meta", "backlink", "lien", "snippet", "indexation"],
    marketing: ["marketing", "marque", "stratégie", "campagne", "publicité", "audience", "cible", "persona", "acquisition", "roi", "conversion", "tunnel", "entonnoir"],
    ecommerce: ["ecommerce", "boutique", "vente", "produit", "panier", "paiement", "livraison", "retour", "client", "achat", "prix", "catalogue", "fiche"],
    contenu: ["contenu", "article", "blog", "rédaction", "texte", "écriture", "copywriting", "storytelling", "format", "éditorial", "publication"],
    reseaux_sociaux: ["social", "réseau", "instagram", "facebook", "linkedin", "twitter", "tiktok", "algorithme", "post", "engagement", "communauté", "abonné", "follower"],
    voyage: ["voyage", "destination", "tourisme", "vacances", "séjour", "hôtel", "avion", "visa", "budget", "itinéraire", "visite", "plage", "montagne"],
    sante: ["santé", "bien-être", "nutrition", "alimentation", "sport", "exercice", "méditation", "sommeil", "stress", "mental", "régime", "poids"],
    technologie: ["technologie", "tech", "ia", "intelligence", "artificielle", "développement", "programmation", "code", "logiciel", "application", "mobile", "cloud", "data"],
    business: ["business", "entreprise", "startup", "entrepreneur", "financement", "investissement", "croissance", "revenu", "profit", "modèle", "économique", "pitch", "stratégie"]
  };
  
  // Compte les occurrences de chaque catégorie
  const categoryCounts = {};
  
  for (const category in categoryKeywords) {
    categoryCounts[category] = 0;
    for (const keyword of keywords) {
      if (categoryKeywords[category].includes(keyword)) {
        categoryCounts[category]++;
      }
    }
  }
  
  // Trouve la catégorie avec le plus d'occurrences
  let maxCount = 0;
  let dominantCategory = "general";
  
  for (const category in categoryCounts) {
    if (categoryCounts[category] > maxCount) {
      maxCount = categoryCounts[category];
      dominantCategory = category;
    }
  }
  
  // Si aucune catégorie n'est dominante, utiliser une catégorie par défaut
  return maxCount > 0 ? dominantCategory : "seo";
};

// Fonction pour déterminer la sous-catégorie de la question
const determineSubcategory = (keywords, category) => {
  const subcategoryKeywords = {
    seo: {
      technique: ["technique", "vitesse", "structure", "mobile", "core", "web", "vitals", "schema", "xml", "sitemap", "robots", "redirections", "canonical", "https", "sécurité"],
      backlinks: ["backlinks", "lien", "linking", "netlinking", "autorité", "domaine", "ancre", "nofollow", "dofollow", "guest", "partenariat"],
      contenu: ["contenu", "mot-clé", "longue", "traîne", "rédaction", "title", "meta", "description", "h1", "h2", "structure", "featured", "snippet"]
    },
    marketing: {
      social: ["social", "média", "facebook", "instagram", "linkedin", "twitter", "tiktok", "communauté", "engagement", "organique", "payant"],
      email: ["email", "newsletter", "automation", "séquence", "ouverture", "clic", "conversion", "segmentation", "personnalisation"],
      budget: ["budget", "limité", "petit", "roi", "retour", "investissement", "mesure", "optimisation", "allocation"]
    },
    ecommerce: {
      conversion: ["conversion", "taux", "panier", "abandon", "checkout", "paiement", "upsell", "cross-sell", "confiance", "avis", "témoignage"],
      tendances: ["tendance", "innovation", "futur", "2024", "mobile", "omnicanal", "personnalisation", "social", "commerce", "voice", "commerce", "ai"]
    },
    contenu: {
      creation: ["création", "rédaction", "écriture", "production", "format", "longueur", "structure", "recherche", "keyword"],
      distribution: ["distribution", "promotion", "diffusion", "canal", "amplification", "partage", "syndication", "republication"]
    },
    reseaux_sociaux: {
      algorithmes: ["algorithme", "portée", "reach", "organique", "engagement", "interaction", "visibilité", "feed", "timeline"],
      croissance: ["croissance", "followers", "abonnés", "audience", "développement", "stratégie", "hashtag", "viral", "tendance"]
    },
    voyage: {
      budget: ["budget", "économie", "pas", "cher", "économique", "abordable", "low", "cost", "backpacker", "sac", "dos", "auberge"],
      destinations: ["destination", "pays", "ville", "région", "populaire", "tendance", "visiter", "découvrir", "explorer"]
    },
    sante: {
      nutrition: ["nutrition", "alimentation", "régime", "manger", "diète", "nourriture", "repas", "calorie", "macro", "protéine", "glucide", "lipide"],
      mental: ["mental", "psychologie", "stress", "anxiété", "dépression", "bien-être", "méditation", "pleine", "conscience", "mindfulness", "thérapie"]
    },
    technologie: {
      ia: ["ia", "intelligence", "artificielle", "machine", "learning", "apprentissage", "modèle", "données", "algorithme", "automatisation", "chatgpt", "gpt"],
      dev: ["développement", "code", "programmation", "logiciel", "application", "web", "frontend", "backend", "framework", "api", "interface"]
    },
    business: {
      startup: ["startup", "lancement", "financement", "investisseur", "pitch", "capital", "risque", "angel", "incubateur", "accélérateur", "seed", "série"],
      strategie: ["stratégie", "business", "plan", "modèle", "revenu", "monétisation", "croissance", "objectif", "kpi", "indicateur", "performance"]
    }
  };
  
  // Vérifie si la catégorie existe dans notre mapping
  if (!subcategoryKeywords[category]) {
    return "general";
  }
  
  // Compte les occurrences de chaque sous-catégorie
  const subcategoryCounts = {};
  for (const subcategory in subcategoryKeywords[category]) {
    subcategoryCounts[subcategory] = 0;
    for (const keyword of keywords) {
      if (subcategoryKeywords[category][subcategory].includes(keyword)) {
        subcategoryCounts[subcategory]++;
      }
    }
  }
  
  // Trouve la sous-catégorie avec le plus d'occurrences
  let maxCount = 0;
  let dominantSubcategory = "general";
  
  for (const subcategory in subcategoryCounts) {
    if (subcategoryCounts[subcategory] > maxCount) {
      maxCount = subcategoryCounts[subcategory];
      dominantSubcategory = subcategory;
    }
  }
  
  // Si aucune sous-catégorie n'est dominante, utiliser "general"
  return maxCount > 0 ? dominantSubcategory : "general";
};

// Fonction pour trouver la réponse la plus pertinente à une question
export const getResponseForQuestion = (question) => {
  // Extraction des mots-clés de la question
  const keywords = extractKeywords(question);
  
  // Détermination de la catégorie
  const category = determineCategory(keywords);
  
  // Détermination de la sous-catégorie
  const subcategory = determineSubcategory(keywords, category);
  
  console.log(`Question: ${question}`);
  console.log(`Keywords: ${keywords.join(', ')}`);
  console.log(`Catégorie détectée: ${category}`);
  console.log(`Sous-catégorie détectée: ${subcategory}`);
  
  // Récupération de la réponse
  if (responseDatabase[category] && responseDatabase[category][subcategory]) {
    return responseDatabase[category][subcategory];
  } else if (responseDatabase[category] && responseDatabase[category]['general']) {
    return responseDatabase[category]['general'];
  } else {
    return responseDatabase['seo']['general']; // Réponse par défaut
  }
};

// Suggestions de questions par catégorie
export const suggestedQuestionsByCategory = {
  seo: [
    "Comment optimiser mon site pour le mobile-first indexing?",
    "Quelles sont les meilleures pratiques SEO pour un site e-commerce?",
    "Comment créer une stratégie de backlinks efficace en 2024?"
  ],
  marketing: [
    "Comment mesurer le ROI de mes campagnes marketing digital?",
    "Quelles sont les meilleures stratégies d'email marketing pour augmenter les conversions?",
    "Comment créer un plan marketing efficace avec un petit budget?"
  ],
  ecommerce: [
    "Comment réduire le taux d'abandon de panier sur mon site e-commerce?",
    "Quelles sont les tendances e-commerce à suivre en 2024?",
    "Comment améliorer l'expérience utilisateur sur un site de vente en ligne?"
  ],
  contenu: [
    "Comment créer un calendrier éditorial efficace pour mon blog?",
    "Quelles sont les meilleures pratiques pour la rédaction SEO?",
    "Comment mesurer l'impact de ma stratégie de contenu?"
  ],
  reseaux_sociaux: [
    "Comment augmenter mon engagement organique sur Instagram?",
    "Quelles sont les meilleures heures pour poster sur LinkedIn?",
    "Comment créer une stratégie TikTok efficace pour mon entreprise?"
  ],
  voyage: [
    "Comment voyager en Europe avec un petit budget?",
    "Quelles sont les destinations tendance pour 2024?",
    "Comment planifier un voyage éco-responsable?"
  ],
  sante: [
    "Quels sont les meilleurs exercices pour renforcer son dos?",
    "Comment adopter une alimentation équilibrée sans se priver?",
    "Quelles techniques de méditation pour réduire le stress quotidien?"
  ],
  technologie: [
    "Comment implémenter l'IA dans une petite entreprise?",
    "Quels langages de programmation apprendre en 2024?",
    "Comment protéger efficacement ses données personnelles en ligne?"
  ],
  business: [
    "Comment créer un pitch deck efficace pour lever des fonds?",
    "Quelles sont les étapes clés pour lancer une startup?",
    "Comment développer une stratégie de croissance durable?"
  ]
};
