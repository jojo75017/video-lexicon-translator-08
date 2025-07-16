
interface ContentSection {
  heading: string;
  content: string;
}

interface GeneratedContent {
  title: string;
  intro: string;
  sections: ContentSection[];
  improvements: string[];
  externalResources: Array<{
    title: string;
    url: string;
    description: string;
  }>;
}

// Détection du domaine d'activité basé sur le mot-clé
const detectDomain = (keyword: string): string => {
  const travelKeywords = ['voyage', 'vacances', 'hotel', 'destination', 'tourisme', 'séjour', 'circuit', 'croisière', 'vol', 'réservation'];
  const techKeywords = ['développement', 'programmation', 'logiciel', 'application', 'web', 'digital', 'tech'];
  const businessKeywords = ['marketing', 'entreprise', 'business', 'vente', 'commerce', 'stratégie'];
  const healthKeywords = ['santé', 'médical', 'bien-être', 'fitness', 'nutrition', 'thérapie'];
  
  const lowerKeyword = keyword.toLowerCase();
  
  if (travelKeywords.some(word => lowerKeyword.includes(word))) return 'travel';
  if (techKeywords.some(word => lowerKeyword.includes(word))) return 'tech';
  if (businessKeywords.some(word => lowerKeyword.includes(word))) return 'business';
  if (healthKeywords.some(word => lowerKeyword.includes(word))) return 'health';
  
  return 'general';
};

// Génération de contenu spécifique au voyage
const generateTravelContent = (keyword: string): ContentSection[] => [
  {
    heading: `Guide complet pour ${keyword}`,
    content: `${keyword} représente une destination ou une expérience de voyage unique qui mérite une planification soignée. Que vous soyez un voyageur expérimenté ou que vous planifiez votre première aventure, ce guide vous accompagnera dans toutes les étapes de votre voyage.

La préparation d'un voyage vers ${keyword} nécessite de prendre en compte plusieurs facteurs essentiels : la saison idéale pour partir, les formalités administratives, le budget nécessaire, et les activités incontournables. Une bonne planification vous permettra de profiter pleinement de votre séjour et d'éviter les désagréments.

Les voyageurs qui ont visité ${keyword} recommandent unanimement de réserver à l'avance les hébergements et les activités principales, surtout pendant la haute saison touristique.`
  },
  {
    heading: `Meilleure période pour visiter ${keyword}`,
    content: `Le choix de la période de voyage est crucial pour une expérience optimale à ${keyword}. Chaque saison offre ses propres avantages et il est important de les connaître pour planifier au mieux votre séjour.

La haute saison touristique offre généralement les meilleures conditions météorologiques et la plus grande variété d'activités disponibles. Cependant, c'est aussi la période où les prix sont les plus élevés et l'affluence la plus importante.

La basse saison peut être une excellente alternative pour les voyageurs recherchant plus d'authenticité et des tarifs avantageux. Les conditions peuvent être différentes, mais l'expérience n'en sera pas moins enrichissante.

Les saisons intermédiaires représentent souvent le meilleur compromis entre conditions favorables, tarifs raisonnables et affluence modérée.`
  },
  {
    heading: `Hébergements et logements à ${keyword}`,
    content: `Le choix de l'hébergement influence grandement la qualité de votre séjour à ${keyword}. Selon votre budget et vos préférences, plusieurs options s'offrent à vous.

Les hôtels de luxe offrent un service premium et des équipements haut de gamme, parfaits pour un séjour romantique ou une occasion spéciale. Ces établissements proposent souvent des spas, des restaurants gastronomiques et des services de conciergerie.

Les hébergements de charme, comme les maisons d'hôtes ou les petits hôtels boutique, permettent de vivre une expérience plus authentique et personnalisée. Ces établissements offrent souvent un excellent rapport qualité-prix.

Pour les voyageurs à budget serré, les auberges de jeunesse et les locations de vacances constituent d'excellentes alternatives sans sacrifier le confort essentiel.`
  },
  {
    heading: `Activités incontournables à ${keyword}`,
    content: `${keyword} regorge d'activités et d'expériences uniques qui rendront votre voyage mémorable. Voici une sélection des activités les plus appréciées par les voyageurs.

Les visites culturelles permettent de découvrir l'histoire et les traditions locales. Musées, monuments historiques et sites patrimoniaux offrent un aperçu fascinant de la richesse culturelle de la destination.

Les activités de plein air sont parfaites pour les amateurs d'aventure et de nature. Randonnées, sports nautiques, excursions permettent de découvrir les paysages sous un angle différent.

La gastronomie locale est un aspect essentiel de l'expérience de voyage. Restaurants traditionnels, marchés locaux et cours de cuisine vous feront découvrir les saveurs authentiques de ${keyword}.`
  },
  {
    heading: `Conseils pratiques pour votre voyage à ${keyword}`,
    content: `Une bonne préparation pratique est essentielle pour un voyage réussi à ${keyword}. Voici les conseils les plus importants à retenir.

Les documents de voyage doivent être vérifiés bien avant le départ. Passeport, visa éventuel, assurance voyage et vaccinations nécessaires selon la destination.

La gestion du budget voyage nécessite une planification minutieuse. Prévoyez les coûts de transport, hébergement, repas, activités et achats souvenirs. N'oubliez pas de prévoir une réserve pour les imprévus.

Les questions de santé et sécurité ne doivent pas être négligées. Renseignez-vous sur les conditions sanitaires locales, souscrivez une assurance voyage adaptée et restez informé des conditions de sécurité.

La communication sur place sera facilitée par quelques préparatifs : applications de traduction, cartes hors ligne, coordonnées des services d'urgence locaux.`
  }
];

// Génération de contenu technique
const generateTechContent = (keyword: string): ContentSection[] => [
  {
    heading: `Introduction technique à ${keyword}`,
    content: `${keyword} est une technologie/méthode qui joue un rôle important dans le développement moderne. Cette approche technique nécessite une compréhension approfondie des concepts fondamentaux et des meilleures pratiques du secteur.

L'implémentation de ${keyword} suit des standards industriels établis et éprouvés par la communauté des développeurs. Ces standards garantissent la compatibilité, la sécurité et la performance des solutions développées.

Les dernières évolutions dans le domaine de ${keyword} intègrent les nouvelles technologies et répondent aux défis actuels du développement logiciel moderne.`
  },
  {
    heading: `Architecture et implémentation de ${keyword}`,
    content: `L'architecture de ${keyword} repose sur des principes de conception solides qui garantissent la scalabilité et la maintenabilité des solutions.

Les composants principaux incluent les couches de présentation, de logique métier et de données. Chaque couche a des responsabilités spécifiques et communique avec les autres selon des interfaces bien définies.

Les patterns de conception couramment utilisés avec ${keyword} incluent MVC, Observer, Factory et Singleton. Ces patterns facilitent la structuration du code et améliorent sa réutilisabilité.`
  }
];

// Ressources externes spécifiques au voyage
const getTravelResources = (keyword: string) => [
  {
    title: "Office de Tourisme Officiel",
    url: `https://www.office-tourisme.fr/search?q=${encodeURIComponent(keyword)}`,
    description: "Informations officielles sur la destination, événements et conseils pratiques"
  },
  {
    title: "Lonely Planet Guide",
    url: `https://www.lonelyplanet.fr/search?q=${encodeURIComponent(keyword)}`,
    description: "Guide de voyage détaillé avec conseils d'experts et recommandations"
  },
  {
    title: "TripAdvisor Avis Voyageurs",
    url: `https://www.tripadvisor.fr/Search?q=${encodeURIComponent(keyword)}`,
    description: "Avis authentiques de voyageurs et recommandations d'activités"
  },
  {
    title: "Booking.com Hébergements",
    url: `https://www.booking.com/searchresults.fr.html?ss=${encodeURIComponent(keyword)}`,
    description: "Large sélection d'hébergements avec avis clients vérifiés"
  },
  {
    title: "Météo France Prévisions",
    url: `https://meteofrance.com/previsions-meteo-france/recherche?q=${encodeURIComponent(keyword)}`,
    description: "Prévisions météorologiques détaillées pour planifier votre voyage"
  }
];

// Suggestions d'amélioration spécifiques au voyage
const getTravelImprovements = (keyword: string) => [
  `Créer des guides saisonniers pour ${keyword} (printemps, été, automne, hiver)`,
  `Développer des itinéraires détaillés de 3, 7 et 14 jours pour ${keyword}`,
  `Ajouter une section budget détaillé avec exemples concrets de coûts`,
  `Intégrer une carte interactive avec les points d'intérêt principaux`,
  `Créer des guides thématiques : voyage en famille, voyage romantique, voyage solo`,
  `Ajouter des témoignages authentiques de voyageurs récents`,
  `Développer une section transport avec comparaisons de prix et durées`,
  `Créer un guide gastronomique local avec adresses recommandées`,
  `Intégrer des photos haute qualité et une galerie virtuelle`,
  `Ajouter une FAQ basée sur les questions fréquentes des voyageurs`
];

export const generateContentWithWordCount = (keyword: string, wordCount: number): GeneratedContent => {
  const domain = detectDomain(keyword);
  let sections: ContentSection[] = [];
  let improvements: string[] = [];
  let externalResources: Array<{title: string; url: string; description: string;}> = [];

  // Génération de contenu selon le domaine détecté
  switch (domain) {
    case 'travel':
      sections = generateTravelContent(keyword);
      improvements = getTravelImprovements(keyword);
      externalResources = getTravelResources(keyword);
      break;
    case 'tech':
      sections = generateTechContent(keyword);
      improvements = [
        `Créer une documentation technique détaillée pour ${keyword}`,
        `Développer des exemples de code pratiques et fonctionnels`,
        `Ajouter des diagrammes d'architecture et de flux de données`,
        `Créer des tutoriels étape par étape pour débutants`,
        `Intégrer des études de cas d'implémentation réussies`
      ];
      externalResources = [
        {
          title: "Documentation officielle",
          url: `https://developer.mozilla.org/fr/search?q=${encodeURIComponent(keyword)}`,
          description: "Documentation technique officielle et références"
        },
        {
          title: "Stack Overflow Discussions",
          url: `https://stackoverflow.com/search?q=${encodeURIComponent(keyword)}`,
          description: "Questions et réponses de la communauté des développeurs"
        }
      ];
      break;
    default:
      // Contenu généraliste mais informatif
      sections = [
        {
          heading: `Comprendre ${keyword} : Guide pratique`,
          content: `${keyword} est un sujet qui mérite une approche structurée et informative. Ce guide vous présente les aspects essentiels à connaître pour bien comprendre et utiliser ces informations dans votre contexte spécifique.

L'approche méthodique est essentielle pour maîtriser ${keyword}. Commencez par les fondamentaux avant de progresser vers des aspects plus avancés. Cette progression logique vous permettra d'acquérir une compréhension solide et durable.

Les experts du domaine recommandent une approche pratique combinée à une compréhension théorique. Cette combinaison offre les meilleurs résultats et une application concrète des connaissances acquises.`
        }
      ];
      improvements = [
        `Développer des exemples concrets d'application de ${keyword}`,
        `Créer des guides étape par étape pour les débutants`,
        `Ajouter des ressources complémentaires et des références`,
        `Intégrer des témoignages d'experts du domaine`,
        `Créer une section FAQ avec les questions les plus fréquentes`
      ];
      externalResources = [
        {
          title: "Ressources expertes",
          url: `https://www.google.com/search?q=${encodeURIComponent(keyword)}+guide+expert`,
          description: "Guides et ressources d'experts reconnus dans le domaine"
        }
      ];
  }

  // Ajuster le nombre de sections selon le nombre de mots demandé
  const sectionsNeeded = Math.min(Math.ceil(wordCount / 200), sections.length);
  const selectedSections = sections.slice(0, sectionsNeeded);

  return {
    title: domain === 'travel' 
      ? `Guide de Voyage Complet : ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} ${new Date().getFullYear()}`
      : `Guide Expert : Tout Savoir sur ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} en ${new Date().getFullYear()}`,
    intro: domain === 'travel'
      ? `Découvrez tout ce qu'il faut savoir pour planifier et réussir votre voyage à ${keyword}. Ce guide complet couvre tous les aspects pratiques : quand partir, où loger, que visiter, combien budgéter, et bien plus encore.

Basé sur l'expérience de voyageurs confirmés et les dernières informations disponibles, ce guide vous aidera à organiser un séjour mémorable et sans stress. Que vous voyagiez en solo, en couple, en famille ou entre amis, vous trouverez ici toutes les informations nécessaires pour une expérience réussie.`
      : `Dans ce guide expert, nous explorons en détail tous les aspects importants de ${keyword}. Que vous soyez débutant ou que vous cherchiez à approfondir vos connaissances, ce contenu vous fournira les informations pratiques et les conseils d'experts pour maîtriser ce sujet.

${keyword} joue un rôle important dans son domaine d'application, et une compréhension solide de ses principes peut faire la différence dans vos projets. Nous aborderons les concepts clés, les meilleures pratiques, et partagerons des exemples concrets pour illustrer nos explications.`,
    sections: selectedSections,
    improvements,
    externalResources
  };
};
