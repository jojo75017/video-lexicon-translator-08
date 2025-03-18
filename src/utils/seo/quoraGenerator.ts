
export interface QuoraGeneratedContent {
  title: string;
  question: string;
  answer: string;
  topics?: string[];
}

export const generateQuoraContent = (
  keyword: string,
  targetWordCount: number = 500,
  includeLink?: string,
  style: 'professional' | 'conversational' | 'expert' | 'storytelling' = 'expert'
): QuoraGeneratedContent => {
  // Analyser le mot-clé pour une meilleure réponse
  const keywordLower = keyword.toLowerCase().trim();
  
  // Générer un titre en fonction du style
  let quoraTitle = '';
  
  if (style === 'professional') {
    quoraTitle = `Guide professionnel: ${keyword} en 2024 - Bonnes pratiques et stratégies`;
  } else if (style === 'conversational') {
    quoraTitle = `Parlons ${keyword}: Ce que vous devez absolument savoir en 2024`;
  } else if (style === 'expert') {
    quoraTitle = `Analyse d'expert: ${keyword} - Tendances et innovations 2024`;
  } else if (style === 'storytelling') {
    quoraTitle = `Comment ${keyword} a transformé mon entreprise - Un témoignage concret`;
  }
  
  // Utiliser la question directement si elle est fournie, sinon générer une question
  let quoraQuestion = '';
  
  if (keyword.includes('?')) {
    // Si le mot-clé contient un point d'interrogation, c'est probablement déjà une question
    quoraQuestion = keyword;
  } else {
    // Sinon, générer une question basée sur le style et le mot-clé
    if (style === 'professional') {
      quoraQuestion = `Quelles sont les meilleures stratégies pour optimiser ${keyword} en 2024 pour des résultats concrets ?`;
    } else if (style === 'conversational') {
      quoraQuestion = `Comment puis-je utiliser ${keyword} efficacement pour mon business en 2024 ?`;
    } else if (style === 'expert') {
      quoraQuestion = `En tant qu'expert, quelles innovations voyez-vous dans le domaine de ${keyword} pour 2024 ?`;
    } else if (style === 'storytelling') {
      quoraQuestion = `Comment avez-vous réussi à transformer votre entreprise grâce à ${keyword} ?`;
    } else {
      quoraQuestion = keyword.length > 30 ? keyword : `Quelles sont les meilleures pratiques concernant ${keyword} ?`;
    }
  }
  
  // Générer une réponse appropriée selon le style et le contenu de la question
  let quoraAnswer = '';
  
  // Déterminer la catégorie de la question pour une meilleure réponse
  if (keywordLower.includes('seo') || 
      keywordLower.includes('référencement') || 
      keywordLower.includes('visibilité') ||
      keywordLower.includes('moteur de recherche')) {
    quoraAnswer = `Pour optimiser le référencement de votre site web en 2024, plusieurs stratégies s'avèrent particulièrement efficaces :

1. **L'optimisation pour l'intention de recherche** - Au-delà des mots-clés, Google valorise désormais les contenus qui répondent véritablement à l'intention de l'utilisateur. Analysez les résultats actuels pour comprendre ce que Google considère comme pertinent pour chaque requête.

2. **L'optimisation pour les featured snippets** - Structurez votre contenu avec des listes à puces, des tableaux et des réponses concises aux questions fréquentes pour maximiser vos chances d'apparaître en position zéro.

3. **L'importance des signaux E-E-A-T** - Experience, Expertise, Authoritativeness, Trustworthiness sont désormais des facteurs cruciaux. Mettez en avant vos qualifications, vos expériences concrètes et obtenez des backlinks de sites faisant autorité dans votre domaine.

4. **L'optimisation mobile first** - Google indexe prioritairement les versions mobiles des sites. Assurez-vous que votre site offre une expérience irréprochable sur tous les appareils mobiles.

5. **L'optimisation de la vitesse de chargement** - Les Core Web Vitals sont devenus des signaux de classement officiels. Utilisez PageSpeed Insights et optimisez particulièrement le LCP, FID et CLS.

6. **Le contenu de qualité et à jour** - Publiez régulièrement du contenu approfondi, informatif et original. Mettez à jour vos anciens contenus pour maintenir leur pertinence.

La combinaison de ces approches permet d'obtenir des résultats significatifs, même dans les secteurs les plus compétitifs.`;
  } 
  else if (keywordLower.includes('marketing') || 
           keywordLower.includes('stratégie') || 
           keywordLower.includes('marque') ||
           keywordLower.includes('vente')) {
    quoraAnswer = `Pour développer une stratégie marketing performante en 2024, voici les approches qui génèrent les meilleurs résultats :

1. **Le marketing centré sur les communautés** - Plutôt que de simplement cibler des audiences, les marques qui réussissent construisent et animent des communautés engagées autour de valeurs partagées. Cela crée un sentiment d'appartenance qui favorise la fidélité et transforme vos clients en ambassadeurs.

2. **Le marketing de contenu multiformat** - Diversifiez vos formats en combinant articles de blog, podcasts, vidéos courtes, newsletters et webinaires. Chaque format touche une partie différente de votre audience et renforce votre présence globale.

3. **L'automatisation intelligente** - Utilisez l'IA pour personnaliser l'expérience client à grande échelle. Les outils d'automatisation permettent désormais de créer des parcours clients hyper-personnalisés sans multiplier les ressources nécessaires.

4. **Le marketing conversationnel** - Intégrez des chatbots, du messaging direct et des interactions en temps réel pour créer des expériences plus humaines et réactives qui répondent aux attentes des consommateurs modernes.

5. **L'approche data-driven** - Collectez et analysez systématiquement les données pour affiner votre stratégie. Les marques qui prennent des décisions basées sur des données concrètes surpassent leurs concurrents de 85% en croissance des revenus.

Cette approche multidimensionnelle permet d'obtenir un ROI marketing supérieur tout en construisant une relation durable avec votre audience.`;
  } 
  else if (keywordLower.includes('contenu') || 
           keywordLower.includes('rédaction') || 
           keywordLower.includes('blog') ||
           keywordLower.includes('article')) {
    quoraAnswer = `Pour créer du contenu qui performe à la fois en termes d'engagement et de conversion en 2024, suivez cette méthodologie en 5 étapes :

1. **Recherche approfondie des intentions** - Allez au-delà des mots-clés pour comprendre les véritables motivations derrière les recherches. Utilisez des outils comme AnswerThePublic pour identifier les questions réelles que se posent vos prospects.

2. **Structure optimisée pour la lecture en ligne** - Les internautes scannent le contenu plutôt que de le lire linéairement. Structurez votre contenu avec des sous-titres informatifs, des listes à puces, des paragraphes courts et des éléments visuels pertinents tous les 300 mots.

3. **Storytelling basé sur des données** - Combinez histoires captivantes et données concrètes. Le storytelling crée une connexion émotionnelle tandis que les données renforcent votre crédibilité et justifient vos arguments.

4. **Format adapté au canal de distribution** - Adaptez systématiquement votre contenu au format optimal pour chaque plateforme. Un article de blog destiné à être partagé sur LinkedIn nécessite une approche différente d'un contenu conçu pour Instagram.

5. **Appels à l'action contextuels** - Intégrez des CTA pertinents et non-intrusifs à différents stades de votre contenu. Les CTA qui s'alignent naturellement avec le contenu génèrent 2 à 3 fois plus de conversions que les CTA génériques.

Cette méthodologie a permis à mes clients d'augmenter leur taux de conversion de contenu de 37% en moyenne tout en améliorant significativement leur positionnement SEO.`;
  }
  else if (keywordLower.includes('social') || 
           keywordLower.includes('réseaux') || 
           keywordLower.includes('instagram') ||
           keywordLower.includes('tiktok') ||
           keywordLower.includes('facebook') ||
           keywordLower.includes('linkedin')) {
    quoraAnswer = `Pour maximiser votre impact sur les réseaux sociaux en 2024, voici les stratégies qui génèrent les meilleurs résultats :

1. **L'authenticité avant tout** - Les algorithmes et les audiences privilégient désormais le contenu authentique plutôt que le contenu trop léché. Les marques qui montrent les coulisses, partagent des histoires personnelles et adoptent un ton conversationnel génèrent 3x plus d'engagement.

2. **La vidéo courte verticale reste reine** - Le format Reels/TikTok/YouTube Shorts continue de dominer l'engagement. Concentrez-vous sur les 3 premières secondes pour capter l'attention et racontez une histoire complète en moins de 30 secondes.

3. **La stratégie multi-plateforme ciblée** - Plutôt que d'être présent partout, excellez sur 2-3 plateformes où votre audience cible est la plus active. Adaptez votre contenu aux spécificités de chaque plateforme plutôt que de simplement le dupliquer.

4. **Les communautés engagées** - Les groupes Facebook, les communautés LinkedIn et les cercles proches sur Instagram génèrent plus d'impact que les publications sur le fil principal. Investissez dans l'animation de communauté pour des résultats durables.

5. **Le social commerce intégré** - Intégrez des fonctionnalités d'achat directement dans votre contenu social pour réduire les frictions dans le parcours d'achat. Les marques qui optimisent leur social commerce voient leur taux de conversion augmenter de 40%.

Ces stratégies, combinées à une analyse régulière des performances, permettent de transformer votre présence sociale en véritable moteur de croissance pour votre entreprise.`;
  }
  else if (keywordLower.includes('e-commerce') || 
           keywordLower.includes('boutique') || 
           keywordLower.includes('vente en ligne') ||
           keywordLower.includes('conversion')) {
    quoraAnswer = `Pour optimiser les performances d'une boutique e-commerce en 2024, ces 5 stratégies se sont révélées particulièrement efficaces :

1. **L'expérience d'achat personnalisée** - Implémentez un système de recommandations produits basé sur l'IA qui analyse le comportement de navigation, l'historique d'achat et les tendances similaires. Les sites offrant une expérience personnalisée voient leur taux de conversion augmenter de 30% en moyenne.

2. **L'optimisation mobile obsessionnelle** - Au-delà d'un site responsive, optimisez spécifiquement le processus de checkout sur mobile en réduisant le nombre d'étapes et en intégrant des options comme Apple Pay/Google Pay. Plus de 70% des abandons de panier se produisent sur mobile.

3. **La stratégie de livraison comme avantage concurrentiel** - Proposez plusieurs options de livraison clairement présentées dès la page produit. 54% des consommateurs abandonnent leur panier lorsqu'ils découvrent des frais de livraison inattendus lors du checkout.

4. **Le marketing post-achat structuré** - Développez un parcours d'emails post-achat qui va au-delà de la simple confirmation de commande : conseils d'utilisation, suggestions de produits complémentaires, demande de feedback au moment optimal. Cette approche augmente la valeur vie client de 33%.

5. **L'intégration du social commerce** - Créez des points d'entrée directs depuis les réseaux sociaux vers votre boutique en utilisant Instagram Shop, Facebook Marketplace et les fonctionnalités de shopping de TikTok. Les marques qui adoptent cette approche voient leur trafic de découverte augmenter de 40%.

L'implémentation méthodique de ces stratégies a permis à mes clients e-commerce d'augmenter leur chiffre d'affaires de 28% en moyenne sur les 6 derniers mois.`;
  }
  // Pour toute autre catégorie de question
  else {
    quoraAnswer = `En tant qu'expert dans ce domaine, voici une analyse approfondie concernant "${keyword}" :

La question que vous posez touche à un aspect fondamental qui préoccupe de nombreux professionnels. Après avoir travaillé avec des dizaines d'entreprises sur cette problématique précise, j'ai identifié plusieurs approches qui se distinguent par leur efficacité.

Premièrement, il est essentiel d'adopter une vision systémique plutôt que de chercher des solutions isolées. Les organisations qui réussissent le mieux dans ce domaine sont celles qui intègrent "${keyword}" dans une stratégie globale plutôt que de le traiter comme un projet séparé.

Deuxièmement, l'analyse des données joue un rôle crucial. Dans une étude récente auprès de 500 entreprises, nous avons constaté que celles qui basent leurs décisions concernant "${keyword}" sur des données concrètes obtiennent des résultats 37% supérieurs à celles qui se fient principalement à l'intuition.

Troisièmement, l'adaptation aux spécificités de votre contexte est indispensable. Les meilleures pratiques génériques peuvent servir de point de départ, mais elles doivent être personnalisées en fonction de votre secteur d'activité, de votre audience cible et de vos ressources disponibles.

Quatrièmement, la formation continue et le développement des compétences de votre équipe autour de "${keyword}" sont souvent négligés mais constituent un facteur déterminant de réussite à long terme.

Enfin, l'établissement de métriques claires pour mesurer le succès de vos initiatives liées à "${keyword}" vous permettra d'ajuster votre approche en continu et d'optimiser votre retour sur investissement.

J'espère que ces insights vous aideront à aborder cette question avec une perspective plus structurée et stratégique.`;
  }
  
  // Ajouter le lien si fourni
  if (includeLink) {
    quoraAnswer += `\n\nPour une analyse plus détaillée et des ressources pratiques sur ${keyword}, je vous invite à consulter ce guide complet: [Ressources et stratégies avancées](${includeLink})`;
  }
  
  // Fonction pour générer des topics pertinents
  const generateTopics = (keyword: string) => {
    const keywordLower = keyword.toLowerCase();
    let baseTopics = ["Business", "Stratégie", "Innovation", "Management"];
    
    // Ajouter des topics spécifiques selon le contenu de la question
    if (keywordLower.includes('seo') || keywordLower.includes('référencement')) {
      baseTopics = ["SEO", "Référencement", "Marketing Digital", "Google"];
    } else if (keywordLower.includes('marketing')) {
      baseTopics = ["Marketing", "Stratégie Digitale", "Communication", "Marque"];
    } else if (keywordLower.includes('contenu') || keywordLower.includes('rédaction')) {
      baseTopics = ["Content Marketing", "Rédaction Web", "Copywriting", "Blog"];
    } else if (keywordLower.includes('social') || keywordLower.includes('instagram') || keywordLower.includes('facebook')) {
      baseTopics = ["Réseaux Sociaux", "Social Media", "Community Management", "Engagement"];
    } else if (keywordLower.includes('e-commerce') || keywordLower.includes('boutique')) {
      baseTopics = ["E-commerce", "Vente en ligne", "Conversion", "Commerce électronique"];
    }
    
    // Ajouter le mot-clé principal comme topic s'il n'est pas déjà inclus
    if (!baseTopics.some(topic => keywordLower.includes(topic.toLowerCase()))) {
      baseTopics.push(keyword.split(' ')[0]);
    }
    
    // Filtrer les doublons
    return baseTopics.filter((topic, index, self) => self.indexOf(topic) === index).slice(0, 5);
  };

  return {
    title: quoraTitle,
    question: quoraQuestion.length > 10 ? quoraQuestion : `Comment optimiser ${keyword} efficacement ?`,
    answer: quoraAnswer,
    topics: generateTopics(keyword)
  };
};
