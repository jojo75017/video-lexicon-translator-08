import { toast } from 'sonner';
import { KeywordSuggestion } from '@/types/seo/Keyword';

export class OpenAIService {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4o') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async analyzeSeoContent(url: string, content: string): Promise<any> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'Vous êtes un expert SEO qui analyse le contenu web et fournit des recommandations.'
            },
            {
              role: 'user',
              content: `Analysez ce contenu SEO pour l'URL ${url}: ${content.substring(0, 2000)}`
            }
          ],
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur OpenAI: ${response.status}`);
      }

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('Erreur analyse OpenAI:', error);
      return null;
    }
  }

  async getKeywordSuggestions(keyword: string): Promise<KeywordSuggestion[]> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'Vous êtes un expert SEO qui suggère des mots-clés pertinents. Répondez uniquement en JSON.'
            },
            {
              role: 'user',
              content: `Suggérez 10 mots-clés liés à "${keyword}" avec volume et difficulté estimés. Format JSON: [{"keyword": "mot", "volume": 1000, "difficulty": 50, "relevance": 90}]`
            }
          ],
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur OpenAI: ${response.status}`);
      }

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('Erreur suggestions OpenAI:', error);
      return [];
    }
  }
}
