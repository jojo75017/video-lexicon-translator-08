
export interface OpenAIKeywordResponse {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  competition: number;
}

export class OpenAIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getKeywordSuggestions(baseKeyword: string): Promise<OpenAIKeywordResponse[]> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Vous êtes un expert en SEO qui fournit des suggestions de mots-clés. 
              Retournez toujours un JSON valide contenant un tableau d'objets avec ces propriétés:
              keyword: string - le mot-clé suggéré en français
              volume: number - volume de recherche mensuel estimé entre 100 et 10000
              difficulty: number - difficulté de classement entre 0-100
              cpc: number - coût par clic moyen entre 0.1 et 10
              competition: number - niveau de concurrence entre 0 et 1`
            },
            {
              role: 'user',
              content: `Générez 5 suggestions de mots-clés pertinents relatifs à "${baseKeyword}" en français avec leurs métriques. Répondez uniquement au format JSON.`
            }
          ],
          temperature: 0.3,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur de l'API OpenAI: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Extraction du JSON de la réponse
      const jsonMatch = content.match(/\[.*\]/s);
      if (!jsonMatch) {
        throw new Error("Format de réponse incorrect");
      }
      
      const keywordSuggestions = JSON.parse(jsonMatch[0]);
      return keywordSuggestions;
    } catch (error) {
      console.error("Erreur lors de la récupération des suggestions via OpenAI:", error);
      throw error;
    }
  }
}
