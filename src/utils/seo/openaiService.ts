import { toast } from 'sonner';
import { KeywordSuggestion } from '@/types/seo/Keyword';

export class OpenAIService {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4o') {
    this.apiKey = apiKey;
    this.model = model;
  }

  static enableProxy() {
    // Méthode pour activer le proxy si nécessaire
    console.log('Proxy enabled for OpenAI requests');
  }

  static getApiKey(): string | null {
    return localStorage.getItem('openaiKey');
  }

  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  static async validateApiKey(apiKey?: string): Promise<boolean> {
    const key = apiKey || this.getApiKey();
    if (!key) return false;

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async generateKeywords(topic: string, count: number = 10): Promise<string[]> {
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
              content: 'Vous êtes un expert SEO. Générez des mots-clés pertinents pour le sujet donné.'
            },
            {
              role: 'user',
              content: `Générez ${count} mots-clés SEO pour: ${topic}`
            }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Parser les mots-clés de la réponse
      const keywords = content.split('\n')
        .map((line: string) => line.replace(/^\d+\.?\s*/, '').trim())
        .filter((keyword: string) => keyword.length > 0)
        .slice(0, count);
      
      return keywords;
    } catch (error) {
      console.error('Erreur génération mots-clés:', error);
      return [];
    }
  }

  async generateLongTailKeywords(mainKeyword: string): Promise<string[]> {
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
              content: 'Générez des mots-clés longue traîne pour le SEO.'
            },
            {
              role: 'user',
              content: `Générez 15 mots-clés longue traîne pour: ${mainKeyword}`
            }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      return content.split('\n')
        .map((line: string) => line.replace(/^\d+\.?\s*/, '').trim())
        .filter((keyword: string) => keyword.length > 0)
        .slice(0, 15);
    } catch (error) {
      console.error('Erreur génération longue traîne:', error);
      return [];
    }
  }

  static async generateKeywords(topic: string, count: number = 10): Promise<string[]> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Clé API OpenAI non configurée');
    }

    const service = new OpenAIService(apiKey);
    return service.generateKeywords(topic, count);
  }

  static async generateLongTailKeywords(mainKeyword: string): Promise<string[]> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Clé API OpenAI non configurée');
    }

    const service = new OpenAIService(apiKey);
    return service.generateLongTailKeywords(mainKeyword);
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

  static async generateBlogOutline(keyword: string): Promise<any> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Clé API OpenAI non configurée');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Créez un plan d\'article de blog optimisé SEO.'
            },
            {
              role: 'user',
              content: `Créez un plan d'article pour le mot-clé: ${keyword}`
            }
          ],
          temperature: 0.7,
        }),
      });

      const data: any = await response.json();
      const content = data.choices[0].message.content;
      
      return {
        title: `Guide complet sur ${keyword}`,
        outline: content,
        sections: content.split('\n').filter(line => line.trim().length > 0)
      };
    } catch (error) {
      console.error('Erreur génération plan:', error);
      return null;
    }
  }

  static async analyzeWebsiteStructure(content: string, url: string): Promise<{
    keywords: string[];
    structure: any;
    recommendations: string[];
    categories: string[];
  }> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Clé API OpenAI non configurée');
    }

    try {
      const prompt = `Analysez ce contenu de site web et fournissez:
1. Les 10 mots-clés principaux liés au contenu réel (pas de mots génériques)
2. La structure logique du site basée sur le contenu analysé
3. 5 recommandations d'amélioration spécifiques au contenu
4. Les catégories de contenu principales trouvées

URL: ${url}
Contenu: ${content.substring(0, 2000)}...

Répondez au format JSON strictement:
{
  "keywords": ["mot1", "mot2", ...],
  "structure": {
    "mainTopic": "sujet principal basé sur le contenu réel",
    "sections": ["section1", "section2", ...]
  },
  "recommendations": ["recommandation1", ...],
  "categories": ["catégorie1", ...]
}`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Vous êtes un expert SEO qui analyse les sites web. Analysez uniquement le contenu fourni et extrayez les mots-clés et sujets réels du site. Répondez toujours en JSON valide.'
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

      const data: any = await response.json();
      const content_response = data.choices[0].message.content;
      
      try {
        const parsed = JSON.parse(content_response);
        console.log('OpenAI analysis result:', parsed);
        return parsed;
      } catch (e) {
        console.error('Erreur de parsing JSON:', content_response);
        return this.fallbackAnalysis(content, url);
      }
    } catch (error) {
      console.error('Erreur OpenAI:', error);
      return this.fallbackAnalysis(content, url);
    }
  }

  private static fallbackAnalysis(content: string, url: string) {
    const words = content.toLowerCase()
      .replace(/[^\w\sàâäéèêëïîôöùûüÿç]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3)
      .filter(w => !/^\d+$/.test(w));

    const wordCount: Record<string, number> = {};
    
    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length > 3) {
        wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
      }
    });

    const keywords = Object.entries(wordCount)
      .filter(([_, count]) => count > 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);

    const domain = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const mainTopic = keywords.length > 0 ? keywords[0] : domain;
    
    return {
      keywords,
      structure: {
        mainTopic,
        sections: keywords.slice(0, 5)
      },
      recommendations: [
        'Optimiser les balises title avec les mots-clés trouvés',
        'Améliorer la structure des titres H1-H6',
        'Ajouter du contenu unique lié aux mots-clés principaux',
        'Optimiser les images avec des attributs alt pertinents',
        'Améliorer la vitesse de chargement'
      ],
      categories: ['Principal', 'Secondaire']
    };
  }
}
