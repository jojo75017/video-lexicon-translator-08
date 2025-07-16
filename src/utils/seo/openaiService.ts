import { toast } from 'sonner';
import { KeywordSuggestion } from '@/types/seo/KeywordSuggestion';

declare const OpenAI: any;

export class OpenAIService {
  private static instance: any = null;
  private static proxyEnabled: boolean = false;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  static enableProxy(enabled: boolean) {
    this.proxyEnabled = enabled;
  }

  static async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  static async analyzeSeoContent(content: string, apiKey?: string): Promise<any> {
    return {
      score: Math.floor(Math.random() * 100),
      suggestions: ['Améliorer les méta descriptions', 'Ajouter plus de mots-clés'],
      keywordDensity: Math.random() * 5
    };
  }

  static async generateLongTailKeywords(prompt: string, apiKey?: string): Promise<KeywordSuggestion[]> {
    const fallbackKeywords = [
      `${prompt} guide complet`,
      `${prompt} conseils pratiques`,
      `${prompt} pour débutants`
    ];
    
    return fallbackKeywords.map(keyword => ({
      keyword,
      volume: Math.floor(Math.random() * 1000) + 50,
      difficulty: Math.floor(Math.random() * 80) + 20,
      cpc: Math.random() * 3 + 0.5,
      type: 'long-tail' as const,
      relevance: Math.floor(Math.random() * 90) + 10,
      competition: 'low'
    }));
  }

  static async generateSemanticKeywords(prompt: string, apiKey?: string): Promise<KeywordSuggestion[]> {
    const fallbackKeywords = [
      `${prompt} définition`,
      `${prompt} avantages`,
      `${prompt} inconvénients`
    ];
    
    return fallbackKeywords.map(keyword => ({
      keyword,
      volume: Math.floor(Math.random() * 2000) + 100,
      difficulty: Math.floor(Math.random() * 70) + 15,
      cpc: Math.random() * 4 + 0.3,
      type: 'semantic' as const,
      relevance: Math.floor(Math.random() * 85) + 15,
      competition: 'medium'
    }));
  }

  static async generateKeywords(prompt: string, apiKey?: string): Promise<KeywordSuggestion[]> {
    try {
      if (!apiKey) {
        const fallbackKeywords = [
          prompt,
          `${prompt} prix`,
          `${prompt} avis`,
          `meilleur ${prompt}`,
          `${prompt} gratuit`
        ];

        return fallbackKeywords.map(keyword => ({
          keyword,
          volume: Math.floor(Math.random() * 5000) + 100,
          difficulty: Math.floor(Math.random() * 100) + 1,
          cpc: Math.random() * 5 + 0.1,
          type: 'ai-generated' as const,
          relevance: Math.floor(Math.random() * 100) + 1,
          competition: 'medium'
        }));
      }

      // If API key is available, try to use OpenAI
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
              content: 'Générez 10 mots-clés SEO pertinents. Retournez uniquement une liste séparée par des virgules.'
            },
            {
              role: 'user',
              content: `Mots-clés pour: ${prompt}`
            }
          ],
          temperature: 0.7,
          max_tokens: 300
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const keywords = data.choices[0].message.content
          .split(',')
          .map((keyword: string) => keyword.trim())
          .filter((keyword: string) => keyword.length > 0);

        return keywords.map((keyword: string) => ({
          keyword,
          volume: Math.floor(Math.random() * 5000) + 100,
          difficulty: Math.floor(Math.random() * 100) + 1,
          cpc: Math.random() * 5 + 0.1,
          type: 'ai-generated' as const,
          relevance: Math.floor(Math.random() * 100) + 1,
          competition: 'medium'
        }));
      }
    } catch (error) {
      console.error('Erreur API OpenAI:', error);
    }

    // Fallback data
    const fallbackKeywords = [
      prompt,
      `${prompt} guide`,
      `${prompt} conseils`,
      `${prompt} gratuit`,
      `meilleur ${prompt}`
    ];

    return fallbackKeywords.map(keyword => ({
      keyword,
      volume: Math.floor(Math.random() * 1000) + 50,
      difficulty: Math.floor(Math.random() * 80) + 20,
      cpc: Math.random() * 3 + 0.5,
      type: 'ai-generated' as const,
      relevance: Math.floor(Math.random() * 90) + 10,
      competition: 'medium'
    }));
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

  async generateLongTailKeywords(topic: string): Promise<string[]> {
    return [
      `${topic} guide complet`,
      `${topic} pour débutants`,
      `${topic} étape par étape`
    ];
  }

  static async generateBlogOutline(topic: string, keywords: string[], apiKey?: string): Promise<any> {
    return {
      title: `Guide complet sur ${topic}`,
      sections: [
        'Introduction',
        'Présentation générale',
        'Conseils pratiques',
        'Conclusion'
      ]
    };
  }
}