
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

  // Analyse des titres et structure
  const h1Count = (content.match(/<h1>/g) || []).length;
  const h2Count = (content.match(/<h2>/g) || []).length;
  const h3Count = (content.match(/<h3>/g) || []).length;
  
  if (h1Count > 1) {
    suggestions.push({
      type: 'erreur',
      message: 'Vous avez utilisé plusieurs balises H1. Une seule balise H1 est recommandée par page.',
      priorité: 'haute'
    });
  }
  
  if (h1Count === 0 && content.length > 300) {
    suggestions.push({
      type: 'erreur',
      message: 'Aucune balise H1 détectée. Ajoutez un titre principal pour améliorer la structure de votre contenu.',
      priorité: 'haute'
    });
  }
  
  if (h2Count === 0 && content.length > 500) {
    suggestions.push({
      type: 'optimisation',
      message: 'Aucune balise H2 détectée. Ajoutez des sous-titres pour améliorer la structure et la lisibilité.',
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

  // Analyse des listes
  const hasUnorderedList = content.includes('<ul>') || content.includes('<li>');
  const hasOrderedList = content.includes('<ol>');
  
  if (!hasUnorderedList && !hasOrderedList && content.length > 700) {
    suggestions.push({
      type: 'amélioration',
      message: 'Utilisez des listes à puces ou numérotées pour présenter des informations de manière plus claire.',
      priorité: 'basse'
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
