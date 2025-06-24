
import OpenAI from 'openai';

export class OpenAIService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async validateApiKey(): Promise<boolean> {
    try {
      await this.openai.models.list();
      return true;
    } catch (error) {
      return false;
    }
  }

  async generateKeywords(baseKeyword: string): Promise<string[]> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert SEO. Génère une liste de mots-clés pertinents basés sur le mot-clé principal fourni. Réponds uniquement avec une liste de mots-clés séparés par des virgules.'
          },
          {
            role: 'user',
            content: `Génère 15 mots-clés SEO pertinents pour: ${baseKeyword}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const content = response.choices[0]?.message?.content || '';
      return content.split(',').map(kw => kw.trim()).filter(kw => kw.length > 0);
    } catch (error) {
      console.error('Erreur génération mots-clés:', error);
      return [];
    }
  }

  async generateLongTailKeywords(baseKeyword: string): Promise<string[]> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert SEO. Génère des mots-clés de longue traîne (3+ mots) basés sur le mot-clé principal. Réponds uniquement avec une liste séparée par des virgules.'
          },
          {
            role: 'user',
            content: `Génère 12 mots-clés de longue traîne pour: ${baseKeyword}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const content = response.choices[0]?.message?.content || '';
      return content.split(',').map(kw => kw.trim()).filter(kw => kw.length > 0);
    } catch (error) {
      console.error('Erreur génération longue traîne:', error);
      return [];
    }
  }

  async generateSemanticKeywords(baseKeyword: string): Promise<string[]> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert SEO. Génère des mots-clés sémantiquement liés et des synonymes du mot-clé principal. Réponds uniquement avec une liste séparée par des virgules.'
          },
          {
            role: 'user',
            content: `Génère 10 mots-clés sémantiques et synonymes pour: ${baseKeyword}`
          }
        ],
        temperature: 0.7,
        max_tokens: 400
      });

      const content = response.choices[0]?.message?.content || '';
      return content.split(',').map(kw => kw.trim()).filter(kw => kw.length > 0);
    } catch (error) {
      console.error('Erreur génération sémantique:', error);
      return [];
    }
  }

  async generateQuestions(baseKeyword: string): Promise<string[]> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert SEO. Génère des questions que les gens posent sur le sujet donné. Réponds uniquement avec une liste de questions séparées par des virgules.'
          },
          {
            role: 'user',
            content: `Génère 8 questions courantes sur: ${baseKeyword}`
          }
        ],
        temperature: 0.7,
        max_tokens: 400
      });

      const content = response.choices[0]?.message?.content || '';
      return content.split(',').map(q => q.trim()).filter(q => q.length > 0);
    } catch (error) {
      console.error('Erreur génération questions:', error);
      return [];
    }
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en rédaction SEO. Génère du contenu optimisé et structuré.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Erreur génération contenu:', error);
      return '';
    }
  }

  async analyzeSeoContent(content: string, targetKeyword: string): Promise<any> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert SEO. Analyse le contenu et donne des suggestions d\'amélioration pour le mot-clé cible. Réponds en JSON avec keywordDensity (nombre), suggestions (array), et score (nombre sur 100).'
          },
          {
            role: 'user',
            content: `Analyse ce contenu pour le mot-clé "${targetKeyword}":\n\n${content}`
          }
        ],
        temperature: 0.3,
        max_tokens: 600
      });

      const content_response = response.choices[0]?.message?.content || '';
      try {
        return JSON.parse(content_response);
      } catch {
        // Fallback si JSON parsing échoue
        const words = content.toLowerCase().split(/\s+/);
        const keywordOccurrences = words.filter(word => 
          word.includes(targetKeyword.toLowerCase())
        ).length;
        const density = (keywordOccurrences / words.length) * 100;
        
        return {
          keywordDensity: Math.round(density * 100) / 100,
          suggestions: [
            'Optimiser la densité de mots-clés (2-3% recommandé)',
            'Ajouter des variations du mot-clé principal',
            'Améliorer la structure du contenu avec des titres H2/H3',
            'Utiliser des synonymes et mots-clés connexes',
            'Ajouter des liens internes pertinents'
          ],
          score: Math.min(density * 25, 100)
        };
      }
    } catch (error) {
      console.error('Erreur analyse SEO:', error);
      return {
        keywordDensity: 0,
        suggestions: ['Erreur lors de l\'analyse'],
        score: 0
      };
    }
  }
}
