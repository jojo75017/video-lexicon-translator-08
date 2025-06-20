
export class PerplexityService {
  static async generateKeywords(query: string): Promise<string[]> {
    // Service simulé pour les mots-clés
    const mockKeywords = [
      `${query} guide`,
      `${query} tips`,
      `best ${query}`,
      `${query} tutorial`,
      `how to ${query}`,
      `${query} examples`
    ];
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockKeywords), 1000);
    });
  }

  static async generateQuoraAnswers(question: string): Promise<string[]> {
    // Service simulé pour les réponses Quora
    const mockAnswers = [
      `Voici une réponse détaillée à votre question sur ${question}...`,
      `Basé sur mon expérience avec ${question}, je recommande...`,
      `Une approche efficace pour ${question} consiste à...`
    ];
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockAnswers), 1000);
    });
  }
}

// Export par défaut pour compatibilité
export const createPerplexityService = () => PerplexityService;
