
export class OpenAIService {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
  
  async generateKeywords(baseKeyword: string): Promise<string[]> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: 'Tu es un expert SEO. Génère une liste de mots-clés pertinents et variés en français basés sur le mot-clé principal fourni.'
            },
            {
              role: 'user',
              content: `Génère 15 mots-clés pertinents en français pour "${baseKeyword}". Inclus des variations longue traîne, des questions, et des termes commerciaux. Retourne uniquement la liste séparée par des virgules.`
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur API OpenAI');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      return content
        .split(',')
        .map((kw: string) => kw.trim())
        .filter((kw: string) => kw.length > 0);
    } catch (error) {
      console.error('Erreur lors de la génération de mots-clés:', error);
      return [];
    }
  }
}
