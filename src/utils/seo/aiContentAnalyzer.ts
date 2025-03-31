
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
  
  // Simulation du temps d'analyse IA
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return suggestions;
};
