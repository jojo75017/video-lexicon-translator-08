
import { toast } from 'sonner';

export class OpenAIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateKeywords(topic: string, count: number = 20): Promise<string[]> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `Vous êtes un expert SEO. Générez ${count} mots-clés pertinents pour le sujet donné. Retournez uniquement une liste de mots-clés séparés par des virgules.`
            },
            {
              role: 'user',
              content: `Générez des mots-clés SEO pour: ${topic}`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      const keywords = data.choices[0].message.content
        .split(',')
        .map((keyword: string) => keyword.trim())
        .filter((keyword: string) => keyword.length > 0);

      return keywords.slice(0, count);
    } catch (error) {
      console.error('Erreur génération mots-clés:', error);
      toast.error('Erreur lors de la génération de mots-clés');
      return [];
    }
  }

  static async generateBlogOutline(topic: string, apiKey: string): Promise<string[]> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'Créez un plan détaillé pour un article de blog SEO-optimisé. Retournez les titres de sections séparés par des sauts de ligne.'
            },
            {
              role: 'user',
              content: `Créez un plan d'article pour: ${topic}`
            }
          ],
          temperature: 0.6,
          max_tokens: 400
        }),
      });

      const data = await response.json();
      return data.choices[0].message.content
        .split('\n')
        .filter((line: string) => line.trim().length > 0);
    } catch (error) {
      console.error('Erreur génération plan:', error);
      return [];
    }
  }
}
