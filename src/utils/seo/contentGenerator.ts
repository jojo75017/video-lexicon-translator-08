
import { OpenAIService } from './openaiService';

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

// Detect travel/tourism keywords
const isTravelKeyword = (keyword: string): boolean => {
  const travelTerms = [
    'voyage', 'visiter', 'itinéraire', 'vacances', 'tourisme', 'destination', 'hôtel',
    'restaurant', 'guide', 'activité', 'excursion', 'culture', 'monument', 'musée',
    'plage', 'montagne', 'ville', 'pays', 'région', 'transport', 'avion', 'train'
  ];
  return travelTerms.some(term => keyword.toLowerCase().includes(term));
};

// Generate travel content
const generateTravelContent = (keyword: string, targetWordCount: number): GeneratedContent => {
  const title = `${keyword} : Guide pratique et conseils utiles`;

  const intro = `Découvrez tout ce qu'il faut savoir sur ${keyword} avec notre guide détaillé. Que vous prépariez votre premier voyage ou que vous soyez un voyageur expérimenté, vous trouverez ici toutes les informations essentielles, des conseils pratiques et des recommandations pour profiter au maximum de votre expérience. Notre guide couvre tous les aspects importants de ${keyword} pour vous aider à organiser un séjour inoubliable.`;

  const sections: ContentSection[] = [
    {
      heading: `Planifier votre voyage : ${keyword}`,
      content: `La planification est la clé d'un voyage réussi. Pour ${keyword}, il est important de bien préparer votre itinéraire en tenant compte de la saison, du budget et de vos centres d'intérêt. Renseignez-vous sur les conditions météorologiques, les formalités d'entrée et les vaccinations éventuellement nécessaires. Réservez vos hébergements à l'avance, surtout pendant la haute saison, et vérifiez les horaires des transports. N'oubliez pas de souscrire une assurance voyage et de faire des copies de vos documents importants.`
    },
    {
      heading: `Les incontournables de ${keyword}`,
      content: `Chaque destination a ses attractions phares qu'il ne faut pas manquer. Pour ${keyword}, identifiez les sites historiques, les monuments emblématiques, les musées incontournables et les expériences authentiques qui font la réputation de cette destination. Prévoyez suffisamment de temps pour visiter les lieux les plus importants sans vous presser. Renseignez-vous sur les horaires d'ouverture, les tarifs et les possibilités de réservation en ligne pour éviter les files d'attente.`
    },
    {
      heading: `Conseils pratiques pour ${keyword}`,
      content: `Voici quelques conseils pratiques qui vous aideront à profiter pleinement de ${keyword}. Apprenez quelques mots de base dans la langue locale, respectez les coutumes et traditions, et adoptez un comportement responsable. Gardez toujours sur vous une copie de vos documents, ayez de l'argent liquide en petites coupures, et restez vigilant dans les zones touristiques. N'hésitez pas à demander conseil aux habitants locaux pour découvrir des endroits authentiques.`
    },
    {
      heading: `Budget et dépenses pour ${keyword}`,
      content: `Bien gérer son budget est essentiel pour un voyage réussi. Pour ${keyword}, prévoyez les coûts d'hébergement, de restauration, de transport local et d'activités. Comparez les prix et cherchez les bons plans comme les pass touristiques qui peuvent vous faire économiser. Gardez une marge pour les imprévus et les petits plaisirs. Utilisez des applications pour suivre vos dépenses et trouvez l'équilibre entre économies et expériences mémorables.`
    },
    {
      heading: `Que rapporter de ${keyword}`,
      content: `Les souvenirs font partie intégrante de l'expérience de voyage. Pour ${keyword}, renseignez-vous sur les spécialités locales, l'artisanat traditionnel et les produits typiques de la région. Vérifiez les restrictions douanières pour éviter les problèmes au retour. Privilégiez les achats qui soutiennent l'économie locale et évitez les produits dérivés d'espèces protégées. Pensez aussi aux souvenirs immatériels : photos, carnets de voyage et nouvelles rencontres qui enrichiront vos souvenirs.`
    }
  ];

  return { title, intro, sections };
};

// Generate tech/SEO focused content
const generateTechContent = (keyword: string, targetWordCount: number): GeneratedContent => {
  const title = `Guide complet : Maîtriser ${keyword} en 2024`;

  const intro = `Dans cet article complet, nous allons explorer en profondeur ${keyword} et vous fournir toutes les clés pour réussir dans ce domaine. Que vous soyez débutant ou expert, vous trouverez ici des conseils pratiques, des stratégies éprouvées et des techniques avancées pour optimiser vos résultats. Notre guide couvre tous les aspects essentiels de ${keyword}, depuis les fondamentaux jusqu'aux méthodes les plus sophistiquées utilisées par les professionnels.`;

  const sections: ContentSection[] = [
    {
      heading: `Comprendre ${keyword} : Les fondamentaux`,
      content: `${keyword} est un domaine complexe qui nécessite une approche méthodique et des connaissances solides. Pour bien démarrer, il est essentiel de maîtriser les concepts de base qui constituent les piliers de cette discipline. Les professionnels qui excellent dans ${keyword} comprennent l'importance de construire une base solide avant de se lancer dans des techniques plus avancées. Cette compréhension fondamentale vous permettra d'éviter les erreurs courantes et d'adopter une approche stratégique efficace.`
    },
    {
      heading: `Stratégies avancées pour ${keyword}`,
      content: `Une fois les bases maîtrisées, il est temps d'explorer les stratégies avancées qui distinguent les experts des débutants. Ces techniques sophistiquées demandent une compréhension approfondie des mécanismes sous-jacents et une capacité d'adaptation aux évolutions constantes du domaine. Les professionnels expérimentés utilisent des approches multicouches qui combinent plusieurs méthodologies pour maximiser leurs résultats.`
    },
    {
      heading: `Outils et technologies pour ${keyword}`,
      content: `Le choix des bons outils peut considérablement améliorer votre efficacité et la qualité de vos résultats dans ${keyword}. L'écosystème technologique offre une vaste gamme de solutions, depuis les outils gratuits pour débuter jusqu'aux plateformes professionnelles sophistiquées. Il est crucial de sélectionner les outils qui correspondent à vos besoins spécifiques et à votre niveau d'expertise.`
    },
    {
      heading: `Mesurer et optimiser vos résultats en ${keyword}`,
      content: `La mesure des performances est un aspect souvent négligé mais absolument crucial pour réussir dans ${keyword}. Sans métriques appropriées, il est impossible d'évaluer l'efficacité de vos actions et d'identifier les axes d'amélioration. Les professionnels utilisent des tableaux de bord sophistiqués qui leur permettent de suivre en temps réel l'évolution de leurs indicateurs clés.`
    },
    {
      heading: `Tendances futures et évolution de ${keyword}`,
      content: `Le domaine de ${keyword} évolue rapidement, et il est essentiel d'anticiper les tendances futures pour rester compétitif. Les innovations technologiques, les changements de comportement des utilisateurs, et l'évolution des réglementations influencent constamment les meilleures pratiques. Les professionnels visionnaires investissent du temps dans la veille technologique et la formation continue.`
    }
  ];

  return { title, intro, sections };
};

// Generate business/marketing focused content
const generateBusinessContent = (keyword: string, targetWordCount: number): GeneratedContent => {
  const title = `${keyword} : Stratégies gagnantes pour votre entreprise`;

  const intro = `Dans un environnement économique de plus en plus compétitif, maîtriser ${keyword} est devenu un enjeu stratégique majeur pour les entreprises de toutes tailles. Ce guide complet vous présente les meilleures pratiques, les stratégies éprouvées et les techniques innovantes qui vous permettront de développer votre activité et d'atteindre vos objectifs commerciaux.`;

  const sections: ContentSection[] = [
    {
      heading: `Développer une stratégie ${keyword} efficace`,
      content: `Une stratégie bien conçue est la foundation de tout succès en ${keyword}. Cette approche stratégique doit s'appuyer sur une analyse approfondie de votre marché, de vos concurrents et de vos objectifs commerciaux. La définition d'objectifs SMART est essentielle pour orienter vos efforts vers les résultats concrets.`
    },
    {
      heading: `Mettre en place les bonnes pratiques de ${keyword}`,
      content: `L'implémentation successful de ${keyword} repose sur l'adoption de méthodologies éprouvées et l'évitement des erreurs courantes. Les meilleures pratiques incluent une approche centrée sur le client, une attention particulière à la qualité, et une culture d'amélioration continue.`
    },
    {
      heading: `Optimiser vos résultats commerciaux avec ${keyword}`,
      content: `L'optimisation des performances commerciales grâce à ${keyword} nécessite une approche data-driven et une compréhension fine des métriques qui comptent vraiment. Il est essentiel de mettre en place un système de suivi robuste qui vous permet de mesurer l'impact de vos actions.`
    },
    {
      heading: `Surmonter les défis de ${keyword}`,
      content: `Tout projet lié à ${keyword} rencontre des obstacles qu'il faut savoir anticiper et surmonter. Les défis les plus courants incluent la résistance au changement, les contraintes budgétaires, et la complexité technique. Une approche proactive de gestion des risques permet d'identifier les problèmes potentiels.`
    },
    {
      heading: `Évolutions et perspectives d'avenir de ${keyword}`,
      content: `Le paysage de ${keyword} évolue rapidement sous l'influence des innovations technologiques, des changements réglementaires et des nouvelles attentes des consommateurs. Pour rester compétitif, il est crucial d'anticiper ces évolutions et d'adapter votre stratégie en conséquence.`
    }
  ];

  return { title, intro, sections };
};

// Generate general informative content
const generateGeneralContent = (keyword: string, targetWordCount: number): GeneratedContent => {
  const title = `Tout savoir sur ${keyword} : Guide complet et pratique`;

  const intro = `${keyword} est un sujet qui mérite une attention particulière dans le contexte actuel. Ce guide complet vous propose une exploration approfondie de tous les aspects liés à ${keyword}, avec des explications claires, des exemples concrets et des conseils pratiques. Découvrez tout ce qu'il faut savoir pour bien comprendre les enjeux et les opportunités liés à ${keyword}.`;

  const sections: ContentSection[] = [
    {
      heading: `Introduction à ${keyword} : Concepts essentiels`,
      content: `Pour bien appréhender ${keyword}, il est important de commencer par une compréhension claire des concepts fondamentaux. Cette base conceptuelle vous permettra de naviguer avec confiance dans les aspects plus complexes que nous aborderons par la suite.`
    },
    {
      heading: `Applications pratiques de ${keyword}`,
      content: `Les applications concrètes de ${keyword} sont nombreuses et variées, touchant différents secteurs et contextes d'utilisation. Cette diversité d'applications démontre la polyvalence et l'importance de ${keyword} dans notre société actuelle.`
    },
    {
      heading: `Avantages et bénéfices de ${keyword}`,
      content: `Les avantages associés à ${keyword} sont multiples et touchent différents aspects selon le contexte d'utilisation. Ces bénéfices peuvent être directs ou indirects, immédiats ou à long terme.`
    },
    {
      heading: `Défis et considérations importantes`,
      content: `Comme tout domaine complexe, ${keyword} présente certains défis et considérations qu'il convient d'anticiper et de prendre en compte. Ces aspects nécessitent une attention particulière pour éviter les écueils.`
    },
    {
      heading: `Perspectives et recommandations pour ${keyword}`,
      content: `En conclusion, ${keyword} représente un domaine riche en opportunités pour ceux qui sont prêts à investir le temps et les efforts nécessaires. Les perspectives d'évolution sont prometteuses, avec de nombreuses innovations à venir.`
    }
  ];

  return { title, intro, sections };
};

// Generate content using OpenAI if API key is available
const generateWithOpenAI = async (keyword: string, targetWordCount: number): Promise<GeneratedContent | null> => {
  const apiKey = localStorage.getItem('openaiKey');
  if (!apiKey) return null;

  try {
    const openAIService = new OpenAIService(apiKey);
    
    const prompt = `Rédigez un article de ${targetWordCount} mots sur "${keyword}". 
    
Répondez au format JSON:
{
  "title": "titre accrocheur",
  "intro": "introduction de 2-3 phrases",
  "sections": [
    {
      "heading": "titre section 1",
      "content": "contenu détaillé section 1"
    },
    {
      "heading": "titre section 2", 
      "content": "contenu détaillé section 2"
    }
  ]
}

L'article doit être informatif, bien structuré et spécifiquement adapté au sujet "${keyword}".`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Vous êtes un rédacteur expert. Rédigez toujours du contenu cohérent et pertinent par rapport au sujet demandé. Répondez uniquement en JSON valide.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: Math.min(4000, targetWordCount * 4)
      }),
    });

    if (!response.ok) {
      console.error('Erreur OpenAI:', response.status);
      return null;
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch (e) {
      console.error('Erreur parsing JSON OpenAI:', content);
      return null;
    }
  } catch (error) {
    console.error('Erreur génération OpenAI:', error);
    return null;
  }
};

// Main function to generate content based on keyword and target word count
export const generateContentWithWordCount = async (keyword: string, targetWordCount: number = 800): Promise<GeneratedContent> => {
  // Try OpenAI first if API key is available
  const openAIContent = await generateWithOpenAI(keyword, targetWordCount);
  if (openAIContent) {
    return openAIContent;
  }

  // Fallback to template-based generation
  let content: GeneratedContent;
  
  if (isTravelKeyword(keyword)) {
    content = generateTravelContent(keyword, targetWordCount);
  } else if (isTechKeyword(keyword)) {
    content = generateTechContent(keyword, targetWordCount);
  } else if (isBusinessKeyword(keyword)) {
    content = generateBusinessContent(keyword, targetWordCount);
  } else {
    content = generateGeneralContent(keyword, targetWordCount);
  }
  
  return content;
};
