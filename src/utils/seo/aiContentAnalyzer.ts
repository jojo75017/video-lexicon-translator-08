
import { toast } from "sonner";

interface ContentSuggestion {
  type: 'amélioration' | 'erreur' | 'optimisation';
  message: string;
  priorité: 'haute' | 'moyenne' | 'basse';
}

export const analyzeContentWithAI = async (content: string): Promise<ContentSuggestion[]> => {
  const suggestions: ContentSuggestion[] = [];
  
  // Analyse de la structure
  if (content.length < 300) {
    suggestions.push({
      type: 'erreur',
      message: 'Le contenu est trop court. Ajoutez plus de contenu pertinent (minimum 300 caractères recommandé)',
      priorité: 'haute'
    });
  }

  // Analyse des mots-clés et de la densité
  const words = content.toLowerCase().split(/\s+/);
  const wordCount = words.length;
  const keywordDensity = new Map<string, number>();
  
  words.forEach(word => {
    if (word.length > 3) {
      keywordDensity.set(word, (keywordDensity.get(word) || 0) + 1);
    }
  });

  // Vérification de la sur-optimisation
  keywordDensity.forEach((count, word) => {
    const density = (count / wordCount) * 100;
    if (density > 5) {
      suggestions.push({
        type: 'optimisation',
        message: `Le mot "${word}" apparaît trop souvent (${density.toFixed(1)}%). Essayez de varier votre vocabulaire.`,
        priorité: 'moyenne'
      });
    }
  });

  // Analyse de la lisibilité
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWordsPerSentence = wordCount / sentences.length || 0;
  
  if (avgWordsPerSentence > 20) {
    suggestions.push({
      type: 'amélioration',
      message: 'Les phrases sont trop longues en moyenne. Essayez de les raccourcir pour améliorer la lisibilité.',
      priorité: 'moyenne'
    });
  }

  // Analyse des paragraphes
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  if (paragraphs.length < 3) {
    suggestions.push({
      type: 'amélioration',
      message: 'Ajoutez plus de paragraphes pour structurer votre contenu et faciliter la lecture.',
      priorité: 'basse'
    });
  }

  // Vérification des balises HTML (si présentes)
  if (content.includes('<h1>') || content.includes('<h2>') || content.includes('<h3>')) {
    // C'est bien, le contenu utilise des balises de titre
  } else if (content.length > 500) {
    suggestions.push({
      type: 'optimisation',
      message: 'Utilisez des sous-titres (H2, H3) pour structurer votre contenu et améliorer sa lisibilité.',
      priorité: 'moyenne'
    });
  }

  // Analyse de l'introduction
  const firstParagraph = paragraphs[0] || '';
  if (firstParagraph.length < 100 && content.length > 500) {
    suggestions.push({
      type: 'amélioration',
      message: 'Renforcez votre introduction pour présenter clairement le sujet et attirer l\'attention.',
      priorité: 'basse'
    });
  }

  // Analyse de la conclusion
  const lastParagraph = paragraphs[paragraphs.length - 1] || '';
  if (lastParagraph.length < 100 && content.length > 500) {
    suggestions.push({
      type: 'amélioration',
      message: 'Ajoutez une conclusion plus substantielle pour résumer vos points principaux et inciter à l\'action.',
      priorité: 'basse'
    });
  }

  // Recherche d'expressions faibles
  const weakExpressions = ['peut-être', 'je pense', 'il semble', 'il paraît', 'possiblement'];
  const weakExpressionCount = weakExpressions.reduce((count, expr) => {
    return count + (content.toLowerCase().match(new RegExp(expr, 'g')) || []).length;
  }, 0);
  
  if (weakExpressionCount > 3) {
    suggestions.push({
      type: 'optimisation',
      message: 'Utilisez un langage plus affirmatif en réduisant les expressions d\'incertitude.',
      priorité: 'basse'
    });
  }

  // Analyse du ton et du style
  const informalExpressions = ['cool', 'super', 'génial', 'top'];
  const informalCount = informalExpressions.reduce((count, expr) => {
    return count + (content.toLowerCase().match(new RegExp(expr, 'g')) || []).length;
  }, 0);
  
  if (informalCount > 3) {
    suggestions.push({
      type: 'amélioration',
      message: 'Adoptez un ton plus professionnel pour renforcer votre crédibilité.',
      priorité: 'basse'
    });
  }

  return suggestions;
};
