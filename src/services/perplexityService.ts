
interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

class PerplexityService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getKeywordSuggestions(keyword: string) {
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'Générez 5 suggestions de mots-clés SEO pertinents en français en format JSON avec les propriétés suivantes : keyword (string), volume (number 0-10000), difficulty (0-100), cpc (0-5), competition (0-1). Répondez uniquement avec le JSON.'
            },
            {
              role: 'user',
              content: `Suggérez des mots-clés SEO pertinents pour : ${keyword}`
            }
          ],
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la requête Perplexity');
      }

      const data = await response.json() as PerplexityResponse;
      const suggestions = JSON.parse(data.choices[0].message.content);

      return suggestions.map((suggestion: any) => ({
        keyword: suggestion.keyword,
        volume: suggestion.volume,
        difficulty: suggestion.difficulty,
        cpc: suggestion.cpc,
        competition: suggestion.competition
      }));
    } catch (error) {
      console.error('Erreur Perplexity:', error);
      return [];
    }
  }
}

export const createPerplexityService = (apiKey: string) => {
  return new PerplexityService(apiKey);
};
