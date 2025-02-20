
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
  const avgWordsPerSentence = wordCount / sentences.length;
  
  if (avgWordsPerSentence > 20) {
    suggestions.push({
      type: 'amélioration',
      message: 'Les phrases sont trop longues en moyenne. Essayez de les raccourcir pour améliorer la lisibilité.',
      priorité: 'moyenne'
    });
  }

  return suggestions;
};
