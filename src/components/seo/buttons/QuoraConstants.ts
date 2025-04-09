
// Constantes pour les réponses Quora
import { shuffle } from '@/lib/utils';

// Définition des différentes structures de réponses
const responseTemplates = [
  "Pour répondre à cette question sur %SUJET%, il est important de comprendre que %POINT_CLE_1%. D'abord, %EXPLICATION_1%. Ensuite, %EXPLICATION_2%. Enfin, %CONCLUSION%.",
  "%SUJET% est un domaine fascinant. Si l'on considère que %POINT_CLE_1%, on peut affirmer que %EXPLICATION_1%. Par ailleurs, %EXPLICATION_2%. En résumé, %CONCLUSION%.",
  "En tant qu'expert en %SUJET%, je peux vous dire que %POINT_CLE_1%. Voici pourquoi: %EXPLICATION_1%. Il faut aussi considérer que %EXPLICATION_2%. Pour conclure, %CONCLUSION%.",
  "D'après mon expérience avec %SUJET%, je dirais que %POINT_CLE_1%. En effet, %EXPLICATION_1%. De plus, %EXPLICATION_2%. En définitive, %CONCLUSION%.",
  "La question sur %SUJET% mérite une analyse approfondie. Premièrement, %POINT_CLE_1%. À cet égard, %EXPLICATION_1%. Aussi, n'oublions pas que %EXPLICATION_2%. Pour résumer, %CONCLUSION%."
];

// Banque de données pour les différents sujets
const subjectData: Record<string, {
  points: string[],
  explications: string[],
  conclusions: string[]
}> = {
  "marketing": {
    points: [
      "la stratégie doit être adaptée à votre audience cible",
      "l'analyse des données est fondamentale pour optimiser vos campagnes",
      "le contenu de qualité reste le roi du marketing digital",
      "la personnalisation est devenue incontournable",
      "une approche omnicanal est généralement plus efficace"
    ],
    explications: [
      "les études montrent que 76% des consommateurs préfèrent les marques qui comprennent leurs besoins spécifiques",
      "les entreprises qui utilisent l'analyse de données voient une augmentation moyenne de 30% de leur ROI marketing",
      "il est crucial d'établir des KPIs clairs pour mesurer l'efficacité de vos actions",
      "l'automatisation permet de réduire les coûts tout en augmentant l'efficacité",
      "le marketing d'influence continue de générer un excellent retour sur investissement pour de nombreuses marques"
    ],
    conclusions: [
      "une stratégie marketing efficace nécessite de l'expérimentation, de l'analyse et des ajustements constants",
      "investir dans la connaissance client reste le meilleur moyen d'optimiser votre marketing",
      "l'équilibre entre acquisition et fidélisation est la clé d'une croissance durable",
      "rester informé des dernières tendances vous permettra de garder un avantage concurrentiel",
      "le marketing n'est plus un département isolé mais doit être intégré à l'ensemble de l'entreprise"
    ]
  },
  "seo": {
    points: [
      "Google modifie constamment ses algorithmes",
      "le contenu de qualité reste le facteur le plus important",
      "les signaux utilisateurs ont un impact croissant sur le classement",
      "l'optimisation technique est fondamentale",
      "une stratégie de backlinks naturelle est essentielle"
    ],
    explications: [
      "les mises à jour comme Core Web Vitals montrent l'importance croissante de l'expérience utilisateur",
      "les sites avec un contenu E-A-T (Expertise, Autorité, Fiabilité) sont favorisés",
      "la vitesse de chargement est un facteur crucial tant pour les utilisateurs que pour les moteurs de recherche",
      "l'optimisation pour la recherche vocale devient de plus en plus importante",
      "une structure de site claire aide les robots à comprendre et indexer votre contenu"
    ],
    conclusions: [
      "le SEO est un marathon, pas un sprint, et nécessite des efforts constants",
      "une approche holistique combinant contenu, technique et autorité est nécessaire",
      "rester à jour avec les meilleures pratiques SEO est essentiel pour maintenir vos positions",
      "mesurer et analyser vos performances vous permettra d'affiner votre stratégie",
      "le SEO doit s'intégrer dans votre stratégie marketing globale pour maximiser son impact"
    ]
  },
  "voyage": {
    points: [
      "la planification à l'avance peut vous faire économiser beaucoup d'argent",
      "les expériences locales offrent souvent le meilleur rapport qualité-prix",
      "la flexibilité est votre meilleur atout pour voyager à petit budget",
      "les programmes de fidélité peuvent offrir des avantages significatifs",
      "les applications de voyage modernes facilitent grandement l'organisation"
    ],
    explications: [
      "réserver vos vols 2-3 mois à l'avance permet généralement d'obtenir les meilleurs tarifs",
      "les hébergements alternatifs comme les auberges ou Airbnb sont souvent moins chers que les hôtels traditionnels",
      "voyager hors saison peut réduire vos coûts de 20 à 50% selon la destination",
      "les cartes bancaires avec avantages voyage peuvent vous faire économiser sur les frais de change",
      "participer à des tours gratuits ('free walking tours') est un excellent moyen de découvrir une ville"
    ],
    conclusions: [
      "voyager à petit budget demande de la recherche et de la planification, mais les récompenses en valent la peine",
      "prioriser vos dépenses en fonction de ce qui compte le plus pour vous permet de profiter pleinement de votre voyage",
      "la technologie moderne a rendu le voyage économique plus accessible que jamais",
      "même avec un budget limité, des expériences authentiques et mémorables sont possibles",
      "le voyage enrichit toujours, quel que soit le montant dépensé"
    ]
  },
  "santé": {
    points: [
      "l'alimentation équilibrée est la base d'une bonne santé",
      "l'activité physique régulière est essentielle",
      "la qualité du sommeil impacte tous les aspects de notre santé",
      "la gestion du stress est souvent négligée mais cruciale",
      "la prévention est toujours préférable au traitement"
    ],
    explications: [
      "consommer au moins 5 portions de fruits et légumes par jour réduit significativement les risques de maladies chroniques",
      "30 minutes d'activité modérée par jour suffisent pour maintenir une bonne santé cardiovasculaire",
      "le sommeil est essentiel pour la récupération musculaire, la consolidation de la mémoire et la régulation hormonale",
      "des techniques comme la méditation ou la respiration profonde peuvent réduire efficacement les niveaux de stress",
      "des bilans de santé réguliers permettent de détecter et traiter les problèmes avant qu'ils ne s'aggravent"
    ],
    conclusions: [
      "la santé est un investissement à long terme qui mérite notre attention quotidienne",
      "les petits changements progressifs sont souvent plus durables que les transformations radicales",
      "écouter son corps et adapter ses habitudes en conséquence est essentiel",
      "un mode de vie sain n'est pas synonyme de privation mais d'équilibre",
      "prendre soin de sa santé mentale est tout aussi important que sa santé physique"
    ]
  },
  "technologie": {
    points: [
      "l'intelligence artificielle transforme rapidement tous les secteurs",
      "la cybersécurité devient une préoccupation majeure pour les entreprises",
      "l'adoption du cloud continue d'accélérer",
      "l'internet des objets (IoT) connecte de plus en plus notre environnement",
      "le développement no-code/low-code démocratise la création d'applications"
    ],
    explications: [
      "les modèles de langage comme GPT révolutionnent notre façon d'interagir avec la technologie",
      "les attaques de ransomware ont augmenté de plus de 150% ces dernières années",
      "plus de 90% des entreprises utilisent désormais des services cloud d'une manière ou d'une autre",
      "on estime qu'il y aura plus de 75 milliards d'appareils IoT connectés d'ici 2025",
      "les plateformes no-code permettent aux non-développeurs de créer des solutions personnalisées"
    ],
    conclusions: [
      "rester à jour avec les tendances technologiques est essentiel pour la compétitivité",
      "l'équilibre entre innovation et sécurité représente un défi majeur",
      "la transformation digitale n'est plus une option mais une nécessité pour la survie des entreprises",
      "l'éthique et la confidentialité des données deviennent des considérations de plus en plus importantes",
      "la technologie doit rester un moyen et non une fin en soi"
    ]
  },
  "entreprise": {
    points: [
      "la validation de votre idée est une étape cruciale avant tout lancement",
      "un business plan solide est essentiel pour attirer des investisseurs",
      "comprendre votre marché cible est fondamental",
      "la gestion de trésorerie est souvent le facteur décisif de survie",
      "construire une équipe complémentaire est déterminant pour le succès"
    ],
    explications: [
      "plus de 90% des startups échouent, souvent parce qu'elles ne répondent pas à un besoin réel du marché",
      "les investisseurs recherchent des projets avec un potentiel de croissance et une équipe solide",
      "une étude de marché approfondie peut révéler des opportunités et des menaces insoupçonnées",
      "même des entreprises rentables peuvent faire faillite si elles ne gèrent pas correctement leur cash-flow",
      "les fondateurs qui savent s'entourer de personnes ayant des compétences complémentaires ont plus de chances de réussir"
    ],
    conclusions: [
      "l'entrepreneuriat est un parcours d'apprentissage continu qui demande persévérance et adaptabilité",
      "combiner passion et pragmatisme est la clé d'un business durable",
      "ne pas avoir peur de pivoter si le marché l'exige",
      "prendre soin de sa santé mentale est aussi important que de prendre soin de son entreprise",
      "le succès entrepreneurial vient rarement du premier coup, mais de l'apprentissage constant"
    ]
  },
  "développement personnel": {
    points: [
      "fixer des objectifs clairs et mesurables est la première étape",
      "sortir de sa zone de confort est nécessaire pour progresser",
      "l'apprentissage continu est une habitude des personnes qui réussissent",
      "l'entourage joue un rôle crucial dans notre développement",
      "la patience et la persévérance sont essentielles"
    ],
    explications: [
      "la méthode SMART (Spécifique, Mesurable, Atteignable, Pertinent, Temporel) est efficace pour définir ses objectifs",
      "le cerveau forme de nouvelles connexions neuronales lorsque nous relevons des défis",
      "consacrer même 20 minutes par jour à l'apprentissage peut transformer vos compétences sur le long terme",
      "selon Jim Rohn, nous sommes la moyenne des 5 personnes que nous fréquentons le plus",
      "le succès vient rarement d'un sprint mais plutôt d'un marathon constant d'efforts"
    ],
    conclusions: [
      "le développement personnel est un voyage qui dure toute la vie, pas une destination",
      "célébrer les petites victoires renforce la motivation sur le long terme",
      "l'authenticité et la connaissance de soi sont des fondations solides pour tout développement",
      "l'équilibre entre ambition et acceptation de soi est crucial pour un développement sain",
      "aider les autres à se développer contribue également à notre propre croissance"
    ]
  },
  "default": {
    points: [
      "chaque question mérite une analyse approfondie",
      "il est important de considérer différentes perspectives",
      "la recherche et les données sont essentielles pour une réponse informée",
      "le contexte spécifique influence grandement la réponse",
      "les solutions ne sont jamais universelles"
    ],
    explications: [
      "les experts dans ce domaine recommandent généralement une approche méthodique",
      "plusieurs études ont montré des résultats variés selon les circonstances",
      "l'expérience pratique montre souvent des nuances que la théorie ne capture pas",
      "en analysant des cas similaires, on observe des tendances intéressantes",
      "les dernières recherches dans ce domaine suggèrent de nouvelles approches"
    ],
    conclusions: [
      "il n'existe pas de solution miracle, mais plutôt des approches adaptées à chaque situation",
      "rester informé et ouvert aux nouvelles idées est essentiel dans ce domaine",
      "la clé est de trouver un équilibre adapté à votre situation spécifique",
      "l'apprentissage continu et l'adaptation sont nécessaires pour réussir",
      "commencer par des étapes simples et progresser graduellement reste la meilleure approche"
    ]
  }
};

// Fonction pour déterminer le sujet principal à partir de la question
function determineSubject(question: string): string {
  const lowerCaseQuestion = question.toLowerCase();
  
  if (lowerCaseQuestion.includes('marketing') || lowerCaseQuestion.includes('campagne') || 
      lowerCaseQuestion.includes('publicité') || lowerCaseQuestion.includes('marque')) {
    return 'marketing';
  }
  
  if (lowerCaseQuestion.includes('seo') || lowerCaseQuestion.includes('référencement') || 
      lowerCaseQuestion.includes('google') || lowerCaseQuestion.includes('moteur de recherche')) {
    return 'seo';
  }
  
  if (lowerCaseQuestion.includes('voyage') || lowerCaseQuestion.includes('destination') || 
      lowerCaseQuestion.includes('tourisme') || lowerCaseQuestion.includes('visiter')) {
    return 'voyage';
  }
  
  if (lowerCaseQuestion.includes('santé') || lowerCaseQuestion.includes('bien-être') || 
      lowerCaseQuestion.includes('nutrition') || lowerCaseQuestion.includes('sport')) {
    return 'santé';
  }
  
  if (lowerCaseQuestion.includes('technologie') || lowerCaseQuestion.includes('tech') || 
      lowerCaseQuestion.includes('ia') || lowerCaseQuestion.includes('intelligence artificielle')) {
    return 'technologie';
  }
  
  if (lowerCaseQuestion.includes('entreprise') || lowerCaseQuestion.includes('startup') || 
      lowerCaseQuestion.includes('business') || lowerCaseQuestion.includes('entrepreneur')) {
    return 'entreprise';
  }
  
  if (lowerCaseQuestion.includes('développement personnel') || lowerCaseQuestion.includes('motivation') || 
      lowerCaseQuestion.includes('habitude') || lowerCaseQuestion.includes('objectif')) {
    return 'développement personnel';
  }
  
  return 'default';
}

// Fonction principale pour générer une réponse
export function getResponseForQuestion(question: string): string {
  // Déterminer le sujet de la question
  const subject = determineSubject(question);
  
  // Récupérer les données appropriées
  const data = subjectData[subject] || subjectData.default;
  
  // Sélectionner aléatoirement un template de réponse
  const template = responseTemplates[Math.floor(Math.random() * responseTemplates.length)];
  
  // Sélectionner aléatoirement des éléments pour la réponse
  const point = data.points[Math.floor(Math.random() * data.points.length)];
  const explication1 = data.explications[Math.floor(Math.random() * data.explications.length)];
  const explication2 = data.explications[Math.floor(Math.random() * data.explications.length)];
  const conclusion = data.conclusions[Math.floor(Math.random() * data.conclusions.length)];
  
  // Extraire un sujet mentionné dans la question ou utiliser le sujet déterminé
  let extractedSubject = subject;
  if (subject === 'default') {
    // Extraire un sujet potentiel de la question
    const words = question.split(' ');
    const potentialSubject = words.find(word => word.length > 5) || 'ce sujet';
    extractedSubject = potentialSubject;
  }
  
  // Remplacer les placeholders dans le template
  return template
    .replace('%SUJET%', extractedSubject)
    .replace('%POINT_CLE_1%', point)
    .replace('%EXPLICATION_1%', explication1)
    .replace('%EXPLICATION_2%', explication2)
    .replace('%CONCLUSION%', conclusion);
}
