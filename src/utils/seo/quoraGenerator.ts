
interface QuoraContent {
  title: string;
  question: string;
  answer: string;
  topics?: string[];
}

export const generateQuoraContent = (
  keyword: string,
  wordCount: number = 500,
  topics?: string[],
  style: 'professional' | 'conversational' | 'expert' | 'storytelling' = 'expert'
): QuoraContent => {
  const styleFormats = {
    professional: {
      intro: `En tant que professionnel dans ce domaine, je peux vous fournir une analyse détaillée sur ${keyword}.`,
      tone: 'factuel et concis',
      conclusion: 'Pour conclure, voici les points essentiels à retenir:'
    },
    conversational: {
      intro: `Ah, ${keyword}! C'est un sujet fascinant que j'adore explorer.`,
      tone: 'amical et accessible',
      conclusion: 'En résumé, voici ce que je vous conseille:'
    },
    expert: {
      intro: `Après plus de 10 ans d'expérience sur le sujet de ${keyword}, voici mon analyse approfondie.`,
      tone: 'autoritaire et approfondi',
      conclusion: 'Sur la base de mon expertise, voici les recommandations clés:'
    },
    storytelling: {
      intro: `Je me souviens de ma première expérience avec ${keyword}. C'était en 2018...`,
      tone: 'narratif et personnel',
      conclusion: 'Cette expérience m\'a appris que:'
    }
  };

  const format = styleFormats[style];
  
  // Generate content specifically about the keyword
  const title = `${keyword.charAt(0).toUpperCase() + keyword.slice(1)}: Guide complet et conseils pratiques`;
  
  // Generate a question based on the keyword's actual topic
  const question = `Quelles sont les meilleures astuces pour optimiser mon expérience avec ${keyword} ? Je cherche des conseils d'experts et des recommandations.`;
  
  // Generate an answer tailored to the specific keyword
  let answer = `${format.intro}

Voici les éléments clés à considérer pour ${keyword}:

`;

  // Customize content based on keyword
  if (keyword.toLowerCase().includes("voyage") || keyword.toLowerCase().includes("trip")) {
    answer += `1. **Planification anticipée** - Réservez vos billets et hébergements au moins 3 mois à l'avance pour obtenir les meilleurs tarifs.

2. **Flexibilité des dates** - Être flexible sur vos dates de voyage peut vous faire économiser jusqu'à 40% sur les tarifs.

3. **Recherche locale** - Informez-vous sur les coutumes locales et les attractions moins connues pour une expérience authentique.

4. **Applications utiles** - Utilisez des applications comme Maps.me pour la navigation hors-ligne et XE pour les conversions de devises.

5. **Assurance voyage** - Ne négligez jamais une bonne assurance voyage, c'est un investissement qui peut vous sauver en cas d'imprévu.`;
  } 
  else if (keyword.toLowerCase().includes("seo") || keyword.toLowerCase().includes("référencement")) {
    answer += `1. **Analyse approfondie des mots-clés** - Identifiez les termes de recherche pertinents pour votre secteur d'activité.

2. **Contenu de qualité** - Créez du contenu unique, informatif et engageant qui répond aux besoins de votre audience.

3. **Optimisation technique** - Assurez-vous que votre site est rapide, mobile-friendly et bien structuré pour les moteurs de recherche.

4. **Stratégie de backlinks** - Développez un profil de liens de qualité pointant vers votre site.

5. **Analyse des données** - Suivez régulièrement vos performances et ajustez votre stratégie en conséquence.`;
  }
  else if (keyword.toLowerCase().includes("marketing") || keyword.toLowerCase().includes("digital")) {
    answer += `1. **Stratégie omnicanale** - Développez une présence cohérente sur tous les canaux pertinents pour votre audience.

2. **Personnalisation** - Adaptez vos messages marketing en fonction des comportements et préférences de vos clients.

3. **Contenu engageant** - Créez du contenu qui apporte une réelle valeur à votre audience et encourage l'interaction.

4. **Analyse des données** - Utilisez les analytics pour comprendre ce qui fonctionne et optimiser vos campagnes.

5. **Automatisation** - Implémentez des outils d'automatisation marketing pour améliorer l'efficacité de vos campagnes.`;
  }
  else {
    answer += `1. **Comprendre les bases** - Familiarisez-vous avec les concepts fondamentaux de ${keyword} pour bâtir une solide connaissance.

2. **Approche stratégique** - Développez un plan d'action clair avec des objectifs mesurables pour ${keyword}.

3. **Ressources fiables** - Consultez des sources d'information reconnues et actualisées sur ${keyword}.

4. **Communauté d'experts** - Rejoignez des groupes et forums spécialisés pour échanger sur ${keyword}.

5. **Mise à jour continue** - Restez informé des dernières tendances et innovations concernant ${keyword}.`;
  }

  answer += `

${format.conclusion}
• Prenez le temps de bien vous informer avant de prendre des décisions
• Testez différentes approches et notez les résultats
• N'hésitez pas à demander conseil à des experts
• Adaptez-vous aux nouvelles tendances

J'espère que ces conseils vous aideront dans votre utilisation de ${keyword}. N'hésitez pas à me contacter pour des conseils plus personnalisés.`;

  // Generate topics based on the keyword
  const generatedTopics = topics || [
    keyword,
    `Conseils ${keyword}`,
    `Guide ${keyword}`,
    `Astuces ${keyword}`,
    `Expérience ${keyword}`
  ];

  return {
    title,
    question,
    answer,
    topics: generatedTopics
  };
};
