
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
}
