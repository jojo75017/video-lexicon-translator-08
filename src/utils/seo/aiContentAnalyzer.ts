
// Utilitaire d'analyse de contenu basé sur des règles (simulant une analyse IA)

export const analyzeContentWithAI = async (content: string): Promise<Array<{
  type: 'amélioration' | 'erreur' | 'optimisation';
  message: string;
  priorité: 'haute' | 'moyenne' | 'basse';
}>> => {
  // Cette fonction simule une analyse IA du contenu
  // Dans un cas réel, elle pourrait appeler une API comme OpenAI ou Claude
  
  const suggestions: Array<{
    type: 'amélioration' | 'erreur' | 'optimisation';
    message: string;
    priorité: 'haute' | 'moyenne' | 'basse';
  }> = [];
  
  // Identifie le sujet principal pour des suggestions adaptées
  const topicMatch = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
  const mainTopic = topicMatch ? topicMatch[1].replace(/<[^>]*>/g, '') : '';
  
  // Analyse de la longueur du contenu
  const wordCount = content.split(/\s+/).length;
  if (wordCount < 300) {
    suggestions.push({
      type: 'optimisation',
      message: 'Le contenu est relativement court. Pour un meilleur référencement, visez au moins 500-800 mots.',
      priorité: 'haute'
    });
  }
  
  // Analyse des titres et structure
  const h1Count = (content.match(/<h1/g) || []).length;
  const h2Count = (content.match(/<h2/g) || []).length;
  const h3Count = (content.match(/<h3/g) || []).length;
  
  if (h1Count === 0) {
    suggestions.push({
      type: 'erreur',
      message: 'Aucun titre H1 détecté. Chaque page devrait avoir un titre principal H1.',
      priorité: 'haute'
    });
  } else if (h1Count > 1) {
    suggestions.push({
      type: 'erreur',
      message: 'Plusieurs titres H1 détectés. Limitez-vous à un seul H1 par page pour une meilleure structure SEO.',
      priorité: 'moyenne'
    });
  }
  
  if (h2Count === 0) {
    suggestions.push({
      type: 'optimisation',
      message: 'Aucun sous-titre H2 détecté. Utilisez des H2 pour structurer votre contenu en sections principales.',
      priorité: 'moyenne'
    });
  }
  
  // Suggestions spécifiques au thème
  if (mainTopic.toLowerCase().includes('aquariophilie')) {
    suggestions.push({
      type: 'amélioration',
      message: 'Envisagez d\'ajouter une section sur les équipements essentiels pour débutants en aquariophilie.',
      priorité: 'moyenne'
    });
    
    suggestions.push({
      type: 'optimisation',
      message: 'Intégrez des mots-clés spécifiques comme "poisson d\'eau douce", "entretien aquarium" ou "filtration" pour améliorer le référencement.',
      priorité: 'haute'
    });
    
    // Vérifie si ces termes sont présents
    if (!content.toLowerCase().includes('ph de l\'eau') && !content.toLowerCase().includes('qualité de l\'eau')) {
      suggestions.push({
        type: 'amélioration',
        message: 'Mentionnez l\'importance de la qualité de l\'eau et du pH pour la santé des poissons.',
        priorité: 'moyenne'
      });
    }
  }
  
  // Analyse des paragraphes
  const paragraphs = content.split('</p>');
  if (paragraphs.some(p => p.length > 800)) {
    suggestions.push({
      type: 'amélioration',
      message: 'Certains paragraphes sont très longs. Envisagez de diviser les grands blocs de texte pour améliorer la lisibilité.',
      priorité: 'basse'
    });
  }
  
  // Vérification des listes
  if (!content.includes('<ul') && !content.includes('<ol')) {
    suggestions.push({
      type: 'amélioration',
      message: 'Pas de listes à puces ou numérotées détectées. Les listes améliorent la lisibilité et l\'engagement.',
      priorité: 'basse'
    });
  }
  
  // Vérification des liens
  const linkCount = (content.match(/<a /g) || []).length;
  if (linkCount === 0) {
    suggestions.push({
      type: 'optimisation',
      message: 'Aucun lien détecté. Ajoutez des liens internes ou externes pour améliorer la valeur SEO.',
      priorité: 'moyenne'
    });
  }
  
  // Vérification des images
  const imageCount = (content.match(/<img /g) || []).length;
  if (imageCount === 0) {
    suggestions.push({
      type: 'amélioration',
      message: 'Aucune image détectée. Les images améliorent l\'engagement et peuvent renforcer le référencement avec des attributs alt optimisés.',
      priorité: 'moyenne'
    });
  } else {
    const altAttributes = content.match(/alt="[^"]*"/g) || [];
    if (altAttributes.length < imageCount) {
      suggestions.push({
        type: 'erreur',
        message: 'Certaines images n\'ont pas d\'attributs alt. Ajoutez des descriptions alt pertinentes pour toutes les images.',
        priorité: 'haute'
      });
    }
  }
  
  // Analyse de la balise title (simulation d'extraction)
  const titleMatch = content.match(/<h1[^>]*>(.*?)<\/h1>/);
  const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '') : '';
  
  if (title) {
    if (title.length > 60) {
      suggestions.push({
        type: 'erreur',
        message: 'La balise title dépasse 60 caractères. Réduisez sa longueur pour une meilleure visibilité dans les résultats de recherche.',
        priorité: 'haute'
      });
    } else if (title.length < 30) {
      suggestions.push({
        type: 'amélioration',
        message: 'La balise title est assez courte. Envisagez d\'ajouter plus de détails tout en restant sous 60 caractères.',
        priorité: 'moyenne'
      });
    } else {
      suggestions.push({
        type: 'optimisation',
        message: 'La longueur de la balise title est optimale pour les moteurs de recherche.',
        priorité: 'basse'
      });
    }
    
    // Vérification des mots-clés dans le titre
    const potentialKeywords = extractPotentialKeywords(content);
    const mainKeyword = potentialKeywords.length > 0 ? potentialKeywords[0] : '';
    
    if (mainKeyword && !title.toLowerCase().includes(mainKeyword.toLowerCase())) {
      suggestions.push({
        type: 'amélioration',
        message: `Le mot-clé principal "${mainKeyword}" n'apparaît pas dans le titre. Envisagez de l'inclure pour améliorer le référencement.`,
        priorité: 'haute'
      });
    }
  }
  
  // Analyse de la meta description (simulation)
  const firstParagraphMatch = content.match(/<p[^>]*>(.*?)<\/p>/);
  const potentialMetaDescription = firstParagraphMatch ? 
    firstParagraphMatch[1].replace(/<[^>]*>/g, '') : '';
  
  if (potentialMetaDescription) {
    if (potentialMetaDescription.length > 155) {
      suggestions.push({
        type: 'amélioration',
        message: 'La meta description potentielle (premier paragraphe) dépasse 155 caractères. Envisagez de la raccourcir pour éviter qu\'elle soit tronquée dans les résultats de recherche.',
        priorité: 'moyenne'
      });
    } else if (potentialMetaDescription.length < 70) {
      suggestions.push({
        type: 'amélioration',
        message: 'La meta description potentielle est assez courte. Idéalement, elle devrait comporter entre 120 et 155 caractères pour être optimale.',
        priorité: 'basse'
      });
    } else {
      suggestions.push({
        type: 'optimisation',
        message: 'La longueur de la meta description potentielle est optimale.',
        priorité: 'basse'
      });
    }
  }
  
  // Analyse de l'image mise en avant
  suggestions.push({
    type: 'amélioration',
    message: 'Assurez-vous que l\'image mise en avant comporte un attribut alt décrivant précisément son contenu avec des mots-clés pertinents.',
    priorité: 'moyenne'
  });

  // Analyse du score SEO global (simulation)
  const seoScore = calculateSimulatedSeoScore(content);
  
  if (seoScore >= 90) {
    suggestions.push({
      type: 'optimisation',
      message: `Score SEO calculé : ${seoScore}/100. Excellent! Votre contenu est bien optimisé pour les moteurs de recherche.`,
      priorité: 'basse'
    });
  } else if (seoScore >= 70) {
    suggestions.push({
      type: 'amélioration',
      message: `Score SEO calculé : ${seoScore}/100. Bon score, mais quelques améliorations peuvent encore être apportées.`,
      priorité: 'moyenne'
    });
  } else {
    suggestions.push({
      type: 'erreur',
      message: `Score SEO calculé : ${seoScore}/100. Des optimisations importantes sont nécessaires pour améliorer votre référencement.`,
      priorité: 'haute'
    });
  }
  
  // Simulation du temps d'analyse IA
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return suggestions;
};

// Fonction pour extraire les mots-clés potentiels du contenu
const extractPotentialKeywords = (content: string): string[] => {
  // Nettoyage du contenu
  const cleanText = content.replace(/<[^>]*>/g, '').toLowerCase();
  
  // Liste de mots vides français
  const stopWords = new Set([
    'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'ce', 'cette', 'ces',
    'et', 'ou', 'à', 'en', 'sur', 'pour', 'dans', 'par', 'avec', 'sans',
    'qui', 'que', 'quoi', 'dont', 'où', 'est', 'sont', 'être', 'avoir',
    'il', 'elle', 'ils', 'elles', 'nous', 'vous', 'je', 'tu'
  ]);
  
  // Découpage en mots
  const words = cleanText.split(/\s+/);
  
  // Comptage des mots (hors mots vides)
  const wordCount: Record<string, number> = {};
  words.forEach(word => {
    if (word.length > 3 && !stopWords.has(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });
  
  // Tri par fréquence
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(entry => entry[0]);
};

// Fonction pour calculer un score SEO simulé
const calculateSimulatedSeoScore = (content: string): number => {
  let score = 60; // Score de base
  
  // Facteurs positifs
  const wordCount = content.split(/\s+/).length;
  if (wordCount >= 300) score += 5;
  if (wordCount >= 600) score += 5;
  if (wordCount >= 1000) score += 5;
  
  const h1Count = (content.match(/<h1/g) || []).length;
  if (h1Count === 1) score += 10;
  
  const h2Count = (content.match(/<h2/g) || []).length;
  if (h2Count >= 2) score += 5;
  
  const imgCount = (content.match(/<img /g) || []).length;
  if (imgCount >= 1) score += 5;
  
  const linkCount = (content.match(/<a /g) || []).length;
  if (linkCount >= 1) score += 5;
  
  if (content.includes('<ul') || content.includes('<ol')) score += 5;
  
  // Facteurs négatifs
  if (h1Count !== 1) score -= 10;
  
  const paragraphs = content.split('</p>');
  if (paragraphs.some(p => p.length > 800)) score -= 5;
  
  // Limites min/max
  return Math.max(0, Math.min(100, score));
};
