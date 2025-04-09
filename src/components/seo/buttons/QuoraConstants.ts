// Constantes pour les réponses Quora

// Définition des différentes structures de réponses
const responseTemplates = [
  "Pour répondre à cette question sur **%SUJET%**, il est important de comprendre que **%POINT_CLE_1%**. D'abord, %EXPLICATION_1%. Ensuite, %EXPLICATION_2%. Par ailleurs, %EXPLICATION_3%. Pour conclure, %CONCLUSION%. \n\n**En résumé**, l'approche optimale concernant **%SUJET%** nécessite une compréhension approfondie et une application méthodique des principes évoqués.",
  "**%SUJET%** est un domaine fascinant qui mérite une analyse détaillée. Si l'on considère que **%POINT_CLE_1%**, on peut affirmer que %EXPLICATION_1%. Par ailleurs, %EXPLICATION_2%. Il est également important de noter que %EXPLICATION_3%. En résumé, %CONCLUSION%. \n\n**Pour approfondir** votre compréhension de **%SUJET%**, je vous recommande d'explorer les ressources spécialisées dans ce domaine.",
  "En tant qu'expert en **%SUJET%**, je peux vous affirmer que **%POINT_CLE_1%**. Voici pourquoi: %EXPLICATION_1%. Il faut aussi considérer que %EXPLICATION_2%. Un autre aspect souvent négligé est que %EXPLICATION_3%. Pour conclure, %CONCLUSION%. \n\n**N'hésitez pas** à me contacter pour approfondir certains aspects spécifiques de **%SUJET%** qui vous intéressent particulièrement.",
  "D'après mon expérience avec **%SUJET%**, je dirais que **%POINT_CLE_1%**. En effet, %EXPLICATION_1%. De plus, %EXPLICATION_2%. Un point crucial à ne pas négliger: %EXPLICATION_3%. En définitive, %CONCLUSION%. \n\n**Les professionnels** qui réussissent dans le domaine de **%SUJET%** comprennent l'importance de ces différents facteurs et savent les intégrer efficacement.",
  "La question sur **%SUJET%** mérite une analyse approfondie. Premièrement, **%POINT_CLE_1%**. À cet égard, %EXPLICATION_1%. Aussi, n'oublions pas que %EXPLICATION_2%. Les recherches récentes montrent également que %EXPLICATION_3%. Pour résumer, %CONCLUSION%. \n\n**Pour maximiser** vos résultats concernant **%SUJET%**, une approche systématique et informée est indispensable."
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
      "Google modifie constamment ses algorithmes et s'adapter est essentiel",
      "le contenu de qualité reste le facteur le plus important pour un bon référencement",
      "les signaux utilisateurs ont un impact croissant sur le classement dans les moteurs de recherche",
      "l'optimisation technique est fondamentale pour maximiser votre visibilité",
      "une stratégie de backlinks naturelle et cohérente est essentielle pour l'autorité de votre site"
    ],
    explications: [
      "les mises à jour comme Core Web Vitals montrent l'importance croissante de l'expérience utilisateur et un site lent ou difficile à utiliser sera pénalisé",
      "les sites avec un contenu E-A-T (Expertise, Autorité, Fiabilité) sont fortement favorisés par Google, et cette tendance se renforce chaque année",
      "la vitesse de chargement est un facteur crucial tant pour les utilisateurs que pour les moteurs de recherche, chaque milliseconde compte",
      "l'optimisation pour la recherche vocale devient incontournable avec la multiplication des assistants virtuels et des recherches mobiles",
      "une structure de site claire et une architecture de l'information bien pensée aident les robots à comprendre et indexer votre contenu efficacement",
      "les balises méta et le balisage sémantique continuent de jouer un rôle important pour aider les moteurs à comprendre votre contenu",
      "une stratégie de maillage interne bien conçue distribue efficacement le 'link juice' et améliore l'indexation"
    ],
    conclusions: [
      "le SEO est un marathon, pas un sprint, et nécessite des efforts constants et une stratégie à long terme pour obtenir des résultats durables",
      "une approche holistique combinant contenu de qualité, optimisation technique et développement de l'autorité est nécessaire pour se démarquer",
      "rester à jour avec les meilleures pratiques SEO et les évolutions des algorithmes est essentiel pour maintenir et améliorer vos positions",
      "mesurer et analyser régulièrement vos performances vous permettra d'affiner votre stratégie et d'identifier rapidement les opportunités d'amélioration",
      "le SEO doit s'intégrer dans votre stratégie marketing globale pour maximiser son impact et assurer la cohérence de votre présence en ligne"
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
      "chaque question mérite une analyse approfondie et personnalisée",
      "il est important de considérer différentes perspectives pour une vision complète",
      "la recherche et les données empiriques sont essentielles pour une réponse véritablement informée",
      "le contexte spécifique influence grandement la pertinence et l'applicabilité de toute solution",
      "les solutions universelles sont rares, et l'adaptation est généralement nécessaire"
    ],
    explications: [
      "les experts dans ce domaine recommandent généralement une approche méthodique qui tient compte de toutes les variables pertinentes",
      "plusieurs études académiques récentes ont montré des résultats variés selon les circonstances, ce qui souligne l'importance du contexte",
      "l'expérience pratique sur le terrain montre souvent des nuances importantes que la théorie pure ne capture pas toujours adéquatement",
      "en analysant des cas similaires dans différents contextes, on observe des tendances intéressantes qui peuvent guider notre approche",
      "les dernières recherches dans ce domaine suggèrent de nouvelles méthodologies qui remettent en question certaines idées reçues",
      "une analyse comparative des différentes approches révèle des avantages et inconvénients spécifiques selon les objectifs poursuivis",
      "les témoignages d'experts et de praticiens confirment l'importance d'une personnalisation basée sur les besoins spécifiques"
    ],
    conclusions: [
      "il n'existe pas de solution miracle universelle, mais plutôt des approches adaptées qui doivent être personnalisées à chaque situation particulière",
      "rester informé et ouvert aux nouvelles idées et méthodologies est essentiel pour maintenir l'efficacité de vos pratiques dans ce domaine",
      "la clé du succès réside dans un équilibre judicieux adapté à votre situation spécifique, vos ressources et vos objectifs à long terme",
      "l'apprentissage continu, l'adaptation et l'amélioration itérative sont nécessaires pour réussir durablement dans cet environnement changeant",
      "commencer par des étapes simples et progresser graduellement vers des stratégies plus sophistiquées reste généralement la meilleure approche pour obtenir des résultats"
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

// Fonction pour sélectionner aléatoirement un élément d'un tableau
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Fonction principale pour générer une réponse
export function getResponseForQuestion(question: string): string {
  // Déterminer le sujet de la question
  const subject = determineSubject(question);
  
  // Récupérer les données appropriées
  const data = subjectData[subject] || subjectData.default;
  
  // Sélectionner aléatoirement un template de réponse
  const template = getRandomElement(responseTemplates);
  
  // Sélectionner aléatoirement des éléments pour la réponse
  const point = getRandomElement(data.points);
  const explanations = [...data.explications]; // Créer une copie pour éviter de modifier l'original
  
  // Sélectionner 3 explications différentes
  const explication1 = getRandomElement(explanations);
  // Retirer l'explication sélectionnée pour éviter les doublons
  const index1 = explanations.indexOf(explication1);
  if (index1 > -1) explanations.splice(index1, 1);
  
  const explication2 = getRandomElement(explanations);
  const index2 = explanations.indexOf(explication2);
  if (index2 > -1) explanations.splice(index2, 1);
  
  const explication3 = getRandomElement(explanations);
  const conclusion = getRandomElement(data.conclusions);
  
  // Extraire un sujet mentionné dans la question ou utiliser le sujet déterminé
  let extractedSubject = subject;
  if (subject === 'default') {
    // Extraire un sujet potentiel de la question
    const words = question.split(' ');
    const potentialSubject = words.find(word => word.length > 5) || 'ce sujet';
    extractedSubject = potentialSubject;
  }
  
  // Ajouter du contenu supplémentaire pour garantir une réponse longue
  const additionalContent = `\n\n**Pour aller plus loin sur ${extractedSubject}**:\n\n` +
    `• Explorez les ressources spécialisées et les dernières recherches dans ce domaine\n` +
    `• Rejoignez des communautés professionnelles pour échanger avec d'autres experts\n` +
    `• Suivez les influenceurs et leaders d'opinion qui partagent régulièrement du contenu pertinent\n` +
    `• Participez à des webinaires et formations pour approfondir vos connaissances\n` +
    `• Expérimentez différentes approches et mesurez les résultats pour identifier ce qui fonctionne le mieux dans votre contexte spécifique`;
  
  // Remplacer les placeholders dans le template
  let response = template
    .replace(/%SUJET%/g, extractedSubject)
    .replace(/%POINT_CLE_1%/g, point)
    .replace(/%EXPLANATION_1%/g, explication1)
    .replace(/%EXPLANATION_2%/g, explication2)
    .replace(/%EXPLANATION_3%/g, explication3)
    .replace(/%CONCLUSION%/g, conclusion);
  
  // Ajouter le contenu supplémentaire pour garantir une longue réponse
  response += additionalContent;
  
  return response;
}
