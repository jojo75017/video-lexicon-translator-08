
export const generateContentWithWordCount = (keyword: string, targetWordCount: number, options = {
  format: 'blog',
  tone: 'professional',
  includeStats: true,
  includeFAQ: true,
  includeCallToAction: true,
  includeTestimonial: true,
  useCustomIntro: false,
  customIntro: '',
  seoOptimized: true,
  includeTableOfContents: true,
  includeSources: true,
  includeImages: true,
  headerStyle: 'standard' // standard, numbered, decorative
}) => {
  const boldKeyword = `<strong>${keyword}</strong>`;

  const introductoryPhrases = [
    `Dans un marché en constante évolution, ${boldKeyword} représente un enjeu majeur.`,
    `À l'heure où la compétitivité est cruciale, ${boldKeyword} fait la différence.`,
    `L'expertise en ${boldKeyword} devient un atout indispensable.`,
    `Les dernières avancées concernant ${boldKeyword} transforment notre secteur.`,
    `Face aux défis actuels, la maîtrise de ${boldKeyword} est déterminante.`,
    `L'impact grandissant de ${boldKeyword} ne peut plus être ignoré.`
  ];

  const bodyPhrases = [
    `Les statistiques démontrent une <em>croissance significative</em> liée à ${boldKeyword}.`,
    `Les professionnels reconnaissent l'<em>importance stratégique</em> de ${boldKeyword}.`,
    `L'investissement dans ${boldKeyword} génère des <strong>résultats mesurables</strong>.`,
    `Les organisations leaders misent sur ${boldKeyword} pour se démarquer.`,
    `La recherche et développement autour de ${boldKeyword} s'intensifie.`,
    `L'adoption de ${boldKeyword} s'accompagne d'<strong>avantages concurrentiels</strong>.`,
    `Les retours d'expérience positifs sur ${boldKeyword} se multiplient.`,
    `Les innovations liées à ${boldKeyword} ouvrent de <em>nouvelles perspectives</em>.`,
    `L'intégration de ${boldKeyword} nécessite une approche méthodique.`,
    `Le développement de ${boldKeyword} suit une progression constante.`
  ];

  const contextPhrases = [
    `Dans un contexte économique exigeant,`,
    `Face aux enjeux actuels du marché,`,
    `Dans une perspective d'innovation continue,`,
    `Considérant les tendances émergentes,`,
    `Au regard des évolutions technologiques,`
  ];

  const transitionPhrases = [
    `<strong>Par ailleurs</strong>,`,
    `<em>En outre</em>,`,
    `De plus,`,
    `Il est important de noter que`,
    `À cela s'ajoute que`
  ];

  const bulletPoints = [
    `Optimisation des processus grâce à ${boldKeyword}`,
    `Impact mesurable de ${boldKeyword} sur la performance`,
    `Solutions innovantes proposées par ${boldKeyword}`,
    `Intégration stratégique de ${boldKeyword}`,
    `Développement durable avec ${boldKeyword}`,
    `Avantages compétitifs de ${boldKeyword}`,
    `Perspectives d'évolution de ${boldKeyword}`,
    `Bonnes pratiques pour ${boldKeyword}`,
    `Retour sur investissement de ${boldKeyword}`,
    `Facteurs clés de succès pour ${boldKeyword}`
  ];

  const testimonials = [
    `"L'adoption de ${keyword} a transformé notre approche et multiplié nos résultats par trois en seulement six mois." - Marie D., Directrice Marketing`,
    `"Après avoir intégré ${keyword} dans notre stratégie, nous avons observé une amélioration significative de nos indicateurs de performance." - Thomas L., CEO`,
    `"Le passage à ${keyword} représente l'une des décisions les plus impactantes que nous ayons prises ces dernières années." - Sophie M., Responsable Innovation`,
    `"Grâce à ${keyword}, nous avons réussi à nous démarquer sur un marché pourtant saturé." - Jean R., Consultant Senior`
  ];

  const faqs = [
    {
      question: `Quels sont les principaux avantages de ${keyword}?`,
      answer: `${keyword} offre plusieurs avantages majeurs: une augmentation de la productivité, une meilleure visibilité sur le marché, une optimisation des coûts opérationnels et une expérience client améliorée. Ces bénéfices se traduisent par un retour sur investissement significatif et mesurable.`
    },
    {
      question: `Comment implémenter efficacement ${keyword} dans une stratégie existante?`,
      answer: `L'implémentation de ${keyword} nécessite une approche méthodique: analyse de l'existant, définition des objectifs, formation des équipes, mise en place progressive et suivi des résultats. Un accompagnement par des experts peut considérablement faciliter cette transition.`
    },
    {
      question: `Quelles sont les tendances futures concernant ${keyword}?`,
      answer: `Les experts prévoient que ${keyword} va continuer d'évoluer vers plus d'automatisation, d'intégration IA et d'adaptation aux besoins spécifiques des industries. La personnalisation et l'analyse prédictive seront au cœur des développements futurs.`
    },
    {
      question: `Quel est le temps de déploiement moyen pour ${keyword}?`,
      answer: `Le temps de déploiement de ${keyword} varie selon l'échelle du projet, mais une implémentation bien planifiée prend généralement entre 3 et 6 mois pour obtenir des résultats tangibles. Les premières améliorations peuvent être observées dès les premières semaines.`
    }
  ];

  const sources = [
    {
      title: `Étude approfondie sur l'impact de ${keyword}`,
      author: "Institut de Recherche Économique",
      year: "2023",
      link: "https://example.com/source1"
    },
    {
      title: `Analyse comparative des solutions de ${keyword}`,
      author: "Journal of Business Strategy",
      year: "2022",
      link: "https://example.com/source2"
    },
    {
      title: `Perspectives d'évolution pour ${keyword}`,
      author: "Tech Innovation Review",
      year: "2023",
      link: "https://example.com/source3"
    }
  ];

  const callToActions = [
    `<div class="bg-primary/10 border-l-4 border-primary p-4 my-6 rounded-md">
      <h3 class="text-lg font-semibold mb-2">Prêt à optimiser votre approche avec ${keyword}?</h3>
      <p class="mb-4">Découvrez comment nos solutions personnalisées peuvent transformer vos résultats.</p>
      <button class="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">Demander une consultation</button>
    </div>`,
    `<div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 my-6 rounded-md border border-blue-100">
      <h3 class="text-xl font-bold mb-3">Maximisez votre potentiel avec ${keyword}</h3>
      <p class="mb-4">Nos experts sont disponibles pour vous accompagner dans votre démarche d'intégration.</p>
      <div class="flex gap-4">
        <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Nous contacter</button>
        <button class="border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50">En savoir plus</button>
      </div>
    </div>`
  ];

  const statistics = [
    `<div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
      <div class="bg-white p-4 rounded-md shadow-sm border border-gray-100">
        <p class="text-gray-500 text-sm">Augmentation moyenne</p>
        <p class="text-3xl font-bold text-primary">+47%</p>
        <p class="text-sm">de performance avec ${keyword}</p>
      </div>
      <div class="bg-white p-4 rounded-md shadow-sm border border-gray-100">
        <p class="text-gray-500 text-sm">Réduction des coûts</p>
        <p class="text-3xl font-bold text-green-600">-32%</p>
        <p class="text-sm">après implémentation</p>
      </div>
      <div class="bg-white p-4 rounded-md shadow-sm border border-gray-100">
        <p class="text-gray-500 text-sm">Satisfaction client</p>
        <p class="text-3xl font-bold text-blue-600">92%</p>
        <p class="text-sm">taux d'approbation</p>
      </div>
    </div>`
  ];

  const tableOfContents = [
    `<div class="bg-gray-50 p-4 rounded-md my-6">
      <h3 class="text-lg font-medium mb-3">Table des matières</h3>
      <ul class="space-y-2">
        <li class="hover:text-primary transition-colors">
          <a href="#introduction">1. Introduction à ${keyword}</a>
        </li>
        <li class="hover:text-primary transition-colors">
          <a href="#fundamentals">2. Les fondamentaux de ${keyword}</a>
        </li>
        <li class="hover:text-primary transition-colors">
          <a href="#implementation">3. Mise en œuvre de ${keyword}</a>
        </li>
        <li class="hover:text-primary transition-colors">
          <a href="#benefits">4. Avantages et impacts</a>
        </li>
        <li class="hover:text-primary transition-colors">
          <a href="#case-studies">5. Études de cas</a>
        </li>
        <li class="hover:text-primary transition-colors">
          <a href="#faq">6. Questions fréquentes</a>
        </li>
        <li class="hover:text-primary transition-colors">
          <a href="#conclusion">7. Conclusion</a>
        </li>
      </ul>
    </div>`
  ];

  const generateBulletPoints = (count: number) => {
    const shuffled = [...bulletPoints].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(point => `<li>${point}</li>`).join('\n');
  };

  const selectRandomTestimonial = () => {
    return testimonials[Math.floor(Math.random() * testimonials.length)];
  };

  const selectRandomCallToAction = () => {
    return callToActions[Math.floor(Math.random() * callToActions.length)];
  };

  const generateFAQSection = () => {
    let faqHtml = `<div class="space-y-4 my-6">
      <h3 class="text-xl font-bold">Questions fréquentes sur ${keyword}</h3>`;
    
    faqs.forEach(faq => {
      faqHtml += `
        <div class="bg-white shadow-sm border border-gray-100 rounded-md overflow-hidden">
          <div class="p-4 font-medium">${faq.question}</div>
          <div class="p-4 bg-gray-50 border-t border-gray-100">${faq.answer}</div>
        </div>`;
    });
    
    faqHtml += `</div>`;
    return faqHtml;
  };

  const generateSourcesSection = () => {
    let sourcesHtml = `<div class="border-t border-gray-200 pt-6 mt-8">
      <h3 class="text-lg font-semibold mb-4">Sources et références</h3>
      <ul class="space-y-3 text-sm">`;
    
    sources.forEach(source => {
      sourcesHtml += `
        <li class="flex gap-2">
          <span class="text-gray-500">[${source.year}]</span>
          <span>${source.author}: <em>${source.title}</em> - <a href="${source.link}" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Consulter</a></span>
        </li>`;
    });
    
    sourcesHtml += `</ul></div>`;
    return sourcesHtml;
  };

  const generateParagraph = (phrases: string[], minWords: number, useContext = true) => {
    let content = '';
    const shuffledPhrases = [...phrases].sort(() => 0.5 - Math.random());
    const shuffledContext = [...contextPhrases].sort(() => 0.5 - Math.random());
    const shuffledTransitions = [...transitionPhrases].sort(() => 0.5 - Math.random());
    
    if (useContext && shuffledContext.length > 0) {
      content = `<p>${shuffledContext[0]} `;
    } else {
      content = '<p>';
    }
    
    let phraseIndex = 0;
    while (content.split(/\s+/).length < minWords && (phraseIndex < shuffledPhrases.length)) {
      if (phraseIndex > 0 && shuffledTransitions.length > 0) {
        content += ' ' + shuffledTransitions[phraseIndex % shuffledTransitions.length] + ' ';
      }
      content += shuffledPhrases[phraseIndex];
      phraseIndex++;
    }
    
    return content + '</p>';
  };

  const formatSectionHeading = (headingText: string, level = 2, style = options.headerStyle) => {
    if (style === 'numbered') {
      return `<h${level} id="${headingText.toLowerCase().replace(/[^\w]+/g, '-')}" class="text-2xl font-bold mb-4 flex items-center gap-2">
        <span class="flex items-center justify-center bg-primary/10 text-primary h-7 w-7 rounded-full text-sm font-semibold">${level-1}</span>
        ${headingText}
      </h${level}>`;
    } else if (style === 'decorative') {
      return `<h${level} id="${headingText.toLowerCase().replace(/[^\w]+/g, '-')}" class="text-2xl font-bold mb-4 border-b-2 border-primary/30 pb-2">
        <span class="border-l-4 border-primary pl-3">${headingText}</span>
      </h${level}>`;
    } else {
      return `<h${level} id="${headingText.toLowerCase().replace(/[^\w]+/g, '-')}" class="text-2xl font-bold mb-4">${headingText}</h${level}>`;
    }
  };

  // Calcul de la répartition des mots
  const introWords = Math.max(Math.floor(targetWordCount * 0.15), 30);
  const sectionWords = Math.max(Math.floor((targetWordCount - introWords) / 4), 50);

  // Construction du contenu
  let sections = [];

  // Section d'introduction
  sections.push({
    heading: `<h1 class="text-3xl font-bold mb-6">${keyword} : Guide Complet et Stratégies Efficaces</h1>`,
    content: options.useCustomIntro && options.customIntro 
      ? options.customIntro 
      : generateParagraph(introductoryPhrases, introWords)
  });

  // Table des matières optionnelle
  if (options.includeTableOfContents) {
    sections[0].content += tableOfContents[0];
  }

  // Sections principales de contenu
  sections.push({
    heading: formatSectionHeading(`Les Fondamentaux de ${keyword}`, 2, options.headerStyle),
    content: `${generateParagraph(bodyPhrases, sectionWords)}\n\n<ul class="list-disc pl-6 my-4">\n${generateBulletPoints(3)}\n</ul>`
  });

  // Statistiques optionnelles
  if (options.includeStats) {
    sections[1].content += statistics[0];
  }

  sections.push({
    heading: formatSectionHeading(`Optimisation et Mise en Œuvre de ${keyword}`, 2, options.headerStyle),
    content: `${generateParagraph(bodyPhrases, sectionWords)}\n\n<ul class="list-disc pl-6 my-4">\n${generateBulletPoints(3)}\n</ul>`
  });

  // Témoignage optionnel
  if (options.includeTestimonial) {
    sections[2].content += `\n\n<blockquote class="border-l-4 border-primary pl-4 py-2 my-4 italic bg-primary/5">\n${selectRandomTestimonial()}\n</blockquote>`;
  }

  sections.push({
    heading: formatSectionHeading(`Tendances et Innovations pour ${keyword}`, 2, options.headerStyle),
    content: `${generateParagraph(bodyPhrases, sectionWords)}\n\n<blockquote class="border-l-4 border-primary pl-4 py-2 my-4 italic bg-primary/5">\nL'innovation continue dans le domaine de ${keyword} est un facteur clé pour maintenir un avantage compétitif sur le long terme.\n</blockquote>\n\n<ul class="list-disc pl-6 my-4">\n${generateBulletPoints(3)}\n</ul>`
  });

  // FAQ optionnelle
  if (options.includeFAQ) {
    sections.push({
      heading: formatSectionHeading(`FAQ sur ${keyword}`, 2, options.headerStyle),
      content: generateFAQSection()
    });
  }

  // Appel à l'action optionnel
  if (options.includeCallToAction) {
    sections.push({
      heading: '',
      content: selectRandomCallToAction()
    });
  }

  // Sources optionnelles
  if (options.includeSources) {
    sections.push({
      heading: '',
      content: generateSourcesSection()
    });
  }

  return {
    title: `${keyword} : Guide Complet et Stratégies Efficaces`,
    intro: sections[0].content,
    sections: sections.slice(1)
  };
};
