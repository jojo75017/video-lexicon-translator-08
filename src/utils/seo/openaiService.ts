
export class OpenAIService {
  private apiKey: string;
  private static useProxy = false;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  static enableProxy() {
    OpenAIService.useProxy = true;
  }

  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('API Key validation failed:', error);
      return false;
    }
  }

  async generateKeywords(keyword: string): Promise<string[]> {
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
              content: 'Vous êtes un expert SEO. Générez une liste de 10 mots-clés pertinents liés au mot-clé donné.'
            },
            {
              role: 'user',
              content: `Générez des mots-clés pour: ${keyword}`
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API request failed');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      // Parse the response to extract keywords
      return content.split('\n')
        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
        .filter((kw: string) => kw.length > 0)
        .slice(0, 10);

    } catch (error) {
      console.error('Error generating keywords:', error);
      return [];
    }
  }

  async generateLongTailKeywords(keyword: string): Promise<string[]> {
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
              content: 'Générez des mots-clés de longue traîne (3-5 mots) spécifiques et détaillés.'
            },
            {
              role: 'user',
              content: `Générez des mots-clés longue traîne pour: ${keyword}`
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API request failed');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      return content.split('\n')
        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
        .filter((kw: string) => kw.length > 0)
        .slice(0, 8);

    } catch (error) {
      console.error('Error generating long tail keywords:', error);
      return [];
    }
  }

  async generateSemanticKeywords(keyword: string): Promise<string[]> {
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
              content: 'Générez des mots-clés sémantiquement liés et des synonymes.'
            },
            {
              role: 'user',
              content: `Générez des mots-clés sémantiques pour: ${keyword}`
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API request failed');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      return content.split('\n')
        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
        .filter((kw: string) => kw.length > 0)
        .slice(0, 8);

    } catch (error) {
      console.error('Error generating semantic keywords:', error);
      return [];
    }
  }

  async generateQuestions(keyword: string): Promise<string[]> {
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
              content: 'Générez des questions fréquemment posées liées au sujet.'
            },
            {
              role: 'user',
              content: `Générez des questions sur: ${keyword}`
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API request failed');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      return content.split('\n')
        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
        .filter((kw: string) => kw.length > 0 && kw.includes('?'))
        .slice(0, 8);

    } catch (error) {
      console.error('Error generating questions:', error);
      return [];
    }
  }
}
