
interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export interface SeoAnalysisResult {
  title?: string;
  recommendations?: string[];
  score?: number;
}

export class OpenAIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  static enableProxy(): void {
    console.log('Proxy enabled for OpenAI service');
  }

  static setApiKey(apiKey: string): void {
    // Méthode statique pour définir la clé API
    localStorage.setItem('openaiKey', apiKey);
  }

  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur validation OpenAI:', error);
      return false;
    }
  }

  async analyzeSeoContent(url: string, content: string): Promise<SeoAnalysisResult | null> {
    try {
      const prompt = `Analysez ce contenu web et fournissez:
1. Le titre principal de la page (si détectable)
2. 5 recommandations SEO spécifiques
3. Un score SEO sur 100

URL: ${url}
Contenu: ${content}

Répondez au format JSON:
{
  "title": "titre détecté ou null",
  "recommendations": ["rec1", "rec2", ...],
  "score": 85
}`;

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
              content: 'Vous êtes un expert SEO. Analysez le contenu et répondez en JSON valide.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1000
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur OpenAI: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      const content_response = data.choices[0].message.content;
      
      try {
        return JSON.parse(content_response);
      } catch (e) {
        console.error('Erreur parsing JSON OpenAI:', content_response);
        return null;
      }
    } catch (error) {
      console.error('Erreur OpenAI SEO analysis:', error);
      return null;
    }
  }

  async generateKeywords(keyword: string): Promise<string[]> {
    try {
      const prompt = `Générez 15 mots-clés pertinents et variés basés sur "${keyword}".
Incluez:
- Des mots-clés longue traîne
- Des questions fréquentes  
- Des synonymes et variantes
- Des termes commerciaux

Répondez avec une liste JSON simple:
["mot-clé 1", "mot-clé 2", ...]`;

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
              content: 'Vous êtes un expert en recherche de mots-clés SEO. Répondez uniquement en JSON valide.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 800
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur OpenAI: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      const content_response = data.choices[0].message.content;
      
      try {
        return JSON.parse(content_response);
      } catch (e) {
        console.error('Erreur parsing JSON keywords:', content_response);
        return [];
      }
    } catch (error) {
      console.error('Erreur génération mots-clés OpenAI:', error);
      return [];
    }
  }

  async getKeywordSuggestions(keyword: string): Promise<string[]> {
    return await this.generateKeywords(keyword);
  }

  async generateSocialContent(keyword: string): Promise<any> {
    // Placeholder pour la génération de contenu social
    return {
      facebook: `Post Facebook pour ${keyword}`,
      twitter: `Tweet pour ${keyword}`,
      linkedin: `Post LinkedIn pour ${keyword}`,
      instagram: `Post Instagram pour ${keyword}`
    };
  }
}
