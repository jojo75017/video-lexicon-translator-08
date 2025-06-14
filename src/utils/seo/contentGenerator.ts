
// Utility for generating content based on keywords
type ContentSection = {
  heading: string;
  content: string;
};

type GeneratedContent = {
  title: string;
  intro: string;
  sections: ContentSection[];
};

// Function to count words in a string
const countWords = (text: string): number => {
  return text.split(/\s+/).filter(word => word.length > 0).length;
};

// Detect if keyword is about technology/software
const isTechKeyword = (keyword: string): boolean => {
  const techTerms = [
    'seo', 'marketing', 'digital', 'web', 'site', 'internet', 'google', 'référencement',
    'analyse', 'optimisation', 'mot-clé', 'contenu', 'blog', 'article', 'rédaction',
    'stratégie', 'technique', 'outil', 'logiciel', 'application', 'développement',
    'api', 'code', 'programmation', 'html', 'css', 'javascript', 'python', 'java'
  ];
  return techTerms.some(term => keyword.toLowerCase().includes(term));
};

// Detect if keyword is about business/marketing
const isBusinessKeyword = (keyword: string): boolean => {
  const businessTerms = [
    'entreprise', 'business', 'marketing', 'vente', 'client', 'service', 'produit',
    'stratégie', 'croissance', 'profit', 'chiffre', 'affaires', 'commerce', 'marché',
    'concurrence', 'brand', 'marque', 'communication', 'publicité', 'promotion'
  ];
  return businessTerms.some(term => keyword.toLowerCase().includes(term));
};

// Generate tech/SEO focused content
const generateTechContent = (keyword: string, targetWordCount: number): GeneratedContent => {
  const title = `Guide complet : Maîtriser ${keyword} en 2024`;

  const intro = `Dans cet article complet, nous allons explorer en profondeur ${keyword} et vous fournir toutes les clés pour réussir dans ce domaine. Que vous soyez débutant ou expert, vous trouverez ici des conseils pratiques, des stratégies éprouvées et des techniques avancées pour optimiser vos résultats. Notre guide couvre tous les aspects essentiels de ${keyword}, depuis les fondamentaux jusqu'aux méthodes les plus sophistiquées utilisées par les professionnels.`;

  const sections: ContentSection[] = [
    {
      heading: `Comprendre ${keyword} : Les fondamentaux`,
      content: `${keyword} est un domaine complexe qui nécessite une approche méthodique et des connaissances solides. Pour bien démarrer, il est essentiel de maîtriser les concepts de base qui constituent les piliers de cette discipline. Les professionnels qui excellent dans ${keyword} comprennent l'importance de construire une base solide avant de se lancer dans des techniques plus avancées. Cette compréhension fondamentale vous permettra d'éviter les erreurs courantes et d'adopter une approche stratégique efficace. Les éléments clés incluent la terminologie spécialisée, les méthodes de base, et les outils indispensables que tout praticien doit connaître. En maîtrisant ces fondamentaux, vous serez en mesure de progresser rapidement et de développer une expertise reconnue dans le domaine de ${keyword}.`
    },
    {
      heading: `Stratégies avancées pour ${keyword}`,
      content: `Une fois les bases maîtrisées, il est temps d'explorer les stratégies avancées qui distinguent les experts des débutants. Ces techniques sophistiquées demandent une compréhension approfondie des mécanismes sous-jacents et une capacité d'adaptation aux évolutions constantes du domaine. Les professionnels expérimentés utilisent des approches multicouches qui combinent plusieurs méthodologies pour maximiser leurs résultats. L'innovation et la créativité jouent un rôle crucial dans le développement de stratégies uniques qui permettent de se démarquer de la concurrence. Il est également important de rester à jour avec les dernières tendances et d'adapter continuellement ses méthodes aux nouvelles opportunités qui émergent dans l'écosystème de ${keyword}.`
    },
    {
      heading: `Outils et technologies pour ${keyword}`,
      content: `Le choix des bons outils peut considérablement améliorer votre efficacité et la qualité de vos résultats dans ${keyword}. L'écosystème technologique offre une vaste gamme de solutions, depuis les outils gratuits pour débuter jusqu'aux plateformes professionnelles sophistiquées. Il est crucial de sélectionner les outils qui correspondent à vos besoins spécifiques et à votre niveau d'expertise. Les solutions automatisées peuvent vous faire gagner un temps précieux, mais il est important de comprendre leurs limites et de maintenir un contrôle humain sur les aspects stratégiques. L'intégration harmonieuse de différents outils dans un workflow cohérent est souvent la clé du succès pour les professionnels accomplis.`
    },
    {
      heading: `Mesurer et optimiser vos résultats en ${keyword}`,
      content: `La mesure des performances est un aspect souvent négligé mais absolument crucial pour réussir dans ${keyword}. Sans métriques appropriées, il est impossible d'évaluer l'efficacité de vos actions et d'identifier les axes d'amélioration. Les professionnels utilisent des tableaux de bord sophistiqués qui leur permettent de suivre en temps réel l'évolution de leurs indicateurs clés. L'analyse des données doit déboucher sur des actions concrètes d'optimisation. Cette approche itérative d'amélioration continue est ce qui permet aux experts de maintenir leur avantage concurrentiel et d'adapter leur stratégie aux évolutions du marché. L'objectif est de créer un cercle vertueux d'optimisation permanente.`
    },
    {
      heading: `Tendances futures et évolution de ${keyword}`,
      content: `Le domaine de ${keyword} évolue rapidement, et il est essentiel d'anticiper les tendances futures pour rester compétitif. Les innovations technologiques, les changements de comportement des utilisateurs, et l'évolution des réglementations influencent constamment les meilleures pratiques. Les professionnels visionnaires investissent du temps dans la veille technologique et la formation continue pour rester à la pointe des développements. Il est également important de développer une capacité d'adaptation qui vous permettra de pivoter rapidement lorsque de nouvelles opportunités émergent. En cultivant une mentalité d'apprentissage permanent et en restant connecté à la communauté professionnelle, vous serez prêt à saisir les opportunités de demain dans l'univers en constante évolution de ${keyword}.`
    }
  ];

  return { title, intro, sections };
};

// Generate business/marketing focused content
const generateBusinessContent = (keyword: string, targetWordCount: number): GeneratedContent => {
  const title = `${keyword} : Stratégies gagnantes pour votre entreprise`;

  const intro = `Dans un environnement économique de plus en plus compétitif, maîtriser ${keyword} est devenu un enjeu stratégique majeur pour les entreprises de toutes tailles. Ce guide complet vous présente les meilleures pratiques, les stratégies éprouvées et les techniques innovantes qui vous permettront de développer votre activité et d'atteindre vos objectifs commerciaux. Nous aborderons les aspects stratégiques, opérationnels et techniques de ${keyword} pour vous donner toutes les clés du succès.`;

  const sections: ContentSection[] = [
    {
      heading: `Développer une stratégie ${keyword} efficace`,
      content: `Une stratégie bien conçue est la foundation de tout succès en ${keyword}. Cette approche stratégique doit s'appuyer sur une analyse approfondie de votre marché, de vos concurrents et de vos objectifs commerciaux. La définition d'objectifs SMART (Spécifiques, Mesurables, Atteignables, Réalistes, Temporels) est essentielle pour orienter vos efforts vers les résultats concrets. Il est crucial d'identifier votre proposition de valeur unique et de comprendre parfaitement les besoins de votre audience cible. Une stratégie efficace combine vision à long terme et tactiques à court terme, permettant une adaptation agile aux évolutions du marché tout en maintenant le cap vers vos objectifs principaux.`
    },
    {
      heading: `Mettre en place les bonnes pratiques de ${keyword}`,
      content: `L'implémentation successful de ${keyword} repose sur l'adoption de méthodologies éprouvées et l'évitement des erreurs courantes. Les meilleures pratiques incluent une approche centrée sur le client, une attention particulière à la qualité, et une culture d'amélioration continue. Il est important de mettre en place des processus clairs et reproductibles qui permettent de maintenir un niveau de qualité constant. La formation des équipes et la création d'une culture d'entreprise alignée avec vos objectifs en ${keyword} sont des facteurs clés de succès. L'investissement dans les bons outils et technologies peut considérablement améliorer votre efficacité opérationnelle.`
    },
    {
      heading: `Optimiser vos résultats commerciaux avec ${keyword}`,
      content: `L'optimisation des performances commerciales grâce à ${keyword} nécessite une approche data-driven et une compréhension fine des métriques qui comptent vraiment. Il est essentiel de mettre en place un système de suivi robuste qui vous permet de mesurer l'impact de vos actions sur vos résultats commerciaux. L'analyse des données doit déboucher sur des insights actionnables qui orientent vos décisions stratégiques. L'automatisation des tâches répétitives libère du temps pour se concentrer sur les activités à haute valeur ajoutée. Une approche d'optimisation continue, basée sur des tests et des ajustements réguliers, permet d'améliorer progressivement vos performances.`
    },
    {
      heading: `Surmonter les défis de ${keyword}`,
      content: `Tout projet lié à ${keyword} rencontre des obstacles qu'il faut savoir anticiper et surmonter. Les défis les plus courants incluent la résistance au changement, les contraintes budgétaires, et la complexité technique. Une approche proactive de gestion des risques permet d'identifier les problèmes potentiels avant qu'ils ne deviennent critiques. Il est important de développer une culture de résolution de problèmes au sein de votre équipe et de mettre en place des processus d'escalade efficaces. La collaboration étroite entre les différents départements et une communication transparente sont essentielles pour surmonter les obstacles organisationnels.`
    },
    {
      heading: `Évolutions et perspectives d'avenir de ${keyword}`,
      content: `Le paysage de ${keyword} évolue rapidement sous l'influence des innovations technologiques, des changements réglementaires et des nouvelles attentes des consommateurs. Pour rester compétitif, il est crucial d'anticiper ces évolutions et d'adapter votre stratégie en conséquence. L'émergence de nouvelles technologies comme l'intelligence artificielle, l'automatisation et l'analyse prédictive ouvre de nouvelles opportunités. Il est important d'investir dans la formation continue de vos équipes et de maintenir une veille stratégique active. Les entreprises qui réussissent sont celles qui parviennent à équilibrer innovation et stabilité, en adoptant les nouvelles tendances tout en préservant leurs avantages concurrentiels existants.`
    }
  ];

  return { title, intro, sections };
};

// Generate general informative content
const generateGeneralContent = (keyword: string, targetWordCount: number): GeneratedContent => {
  const title = `Tout savoir sur ${keyword} : Guide complet et pratique`;

  const intro = `${keyword} est un sujet qui mérite une attention particulière dans le contexte actuel. Ce guide complet vous propose une exploration approfondie de tous les aspects liés à ${keyword}, avec des explications claires, des exemples concrets et des conseils pratiques. Que vous souhaitiez approfondir vos connaissances ou découvrir ce domaine pour la première fois, vous trouverez ici toutes les informations nécessaires pour bien comprendre les enjeux et les opportunités liés à ${keyword}.`;

  const sections: ContentSection[] = [
    {
      heading: `Introduction à ${keyword} : Concepts essentiels`,
      content: `Pour bien appréhender ${keyword}, il est important de commencer par une compréhension claire des concepts fondamentaux. Cette base conceptuelle vous permettra de naviguer avec confiance dans les aspects plus complexes que nous aborderons par la suite. Les éléments clés incluent les définitions principales, les principes de base, et le contexte dans lequel ${keyword} s'inscrit. Une approche progressive permet d'assimiler efficacement ces notions et de construire une compréhension solide. Il est également utile de connaître l'historique et l'évolution de ${keyword} pour mieux comprendre les développements actuels et futurs dans ce domaine.`
    },
    {
      heading: `Applications pratiques de ${keyword}`,
      content: `Les applications concrètes de ${keyword} sont nombreuses et variées, touchant différents secteurs et contextes d'utilisation. Cette diversité d'applications démontre la polyvalence et l'importance de ${keyword} dans notre société actuelle. Chaque domaine d'application présente ses spécificités et ses défis particuliers qu'il convient de comprendre. Les exemples pratiques illustrent comment ${keyword} peut être mis en œuvre de manière efficace et bénéfique. Il est important d'adapter l'approche en fonction du contexte spécifique et des objectifs recherchés.`
    },
    {
      heading: `Avantages et bénéfices de ${keyword}`,
      content: `Les avantages associés à ${keyword} sont multiples et touchent différents aspects selon le contexte d'utilisation. Ces bénéfices peuvent être directs ou indirects, immédiats ou à long terme. Il est important de comprendre ces différents types d'avantages pour pouvoir les exploiter au mieux. L'identification claire des bénéfices attendus permet également de mesurer l'efficacité et le retour sur investissement. Une approche équilibrée prend en compte non seulement les avantages mais aussi les contraintes et les limitations éventuelles.`
    },
    {
      heading: `Défis et considérations importantes`,
      content: `Comme tout domaine complexe, ${keyword} présente certains défis et considérations qu'il convient d'anticiper et de prendre en compte. Ces aspects nécessitent une attention particulière pour éviter les écueils et maximiser les chances de succès. Une approche réaliste reconnaît ces défis tout en proposant des stratégies pour les surmonter. Il est important de maintenir un équilibre entre ambition et pragmatisme dans la mise en œuvre. La préparation et la planification sont essentielles pour naviguer efficacement dans ces complexités.`
    },
    {
      heading: `Perspectives et recommandations pour ${keyword}`,
      content: `En conclusion, ${keyword} représente un domaine riche en opportunités pour ceux qui sont prêts à investir le temps et les efforts nécessaires. Les perspectives d'évolution sont prometteuses, avec de nombreuses innovations et développements à venir. Il est recommandé d'adopter une approche progressive et structurée pour aborder ${keyword}. La formation continue et la veille active sont essentielles pour rester à jour avec les évolutions. Enfin, n'hésitez pas à expérimenter et à adapter les approches à votre contexte spécifique pour obtenir les meilleurs résultats possibles.`
    }
  ];

  return { title, intro, sections };
};

// Main function to generate content based on keyword and target word count
export const generateContentWithWordCount = (keyword: string, targetWordCount: number = 800): GeneratedContent => {
  // Determine content type based on keyword
  let content: GeneratedContent;
  
  if (isTechKeyword(keyword)) {
    content = generateTechContent(keyword, targetWordCount);
  } else if (isBusinessKeyword(keyword)) {
    content = generateBusinessContent(keyword, targetWordCount);
  } else {
    content = generateGeneralContent(keyword, targetWordCount);
  }
  
  // Calculate current word count
  let currentWordCount = countWords(content.intro);
  content.sections.forEach(section => {
    currentWordCount += countWords(section.content);
  });
  
  // Adjust content length if needed (simple approach)
  if (Math.abs(currentWordCount - targetWordCount) > targetWordCount * 0.2) {
    const ratio = targetWordCount / currentWordCount;
    
    if (ratio < 0.8) {
      // Need to reduce content - take fewer sections
      const sectionsToKeep = Math.max(3, Math.floor(content.sections.length * ratio));
      content.sections = content.sections.slice(0, sectionsToKeep);
    }
  }
  
  return content;
};
