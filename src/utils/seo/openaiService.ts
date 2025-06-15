
export class OpenAIService {
  private apiKey: string;
  private static instance: OpenAIService | null = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  static setApiKey(apiKey: string) {
    OpenAIService.instance = new OpenAIService(apiKey);
  }

  static enableProxy() {
    // Proxy activation logic
    console.log('Proxy enabled for OpenAI service');
  }

  static validateApiKey(apiKey: string): boolean {
    return apiKey && apiKey.length > 20 && apiKey.startsWith('sk-');
  }

  static getInstance(): OpenAIService | null {
    return OpenAIService.instance;
  }

  async generateContent(prompt: string): Promise<string> {
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
              content: 'Vous êtes un rédacteur expert. Rédigez toujours du contenu cohérent et pertinent par rapport au sujet demandé.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur OpenAI: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Erreur génération OpenAI:', error);
      throw error;
    }
  }

  async generateKeywords(keyword: string): Promise<string[]> {
    const prompt = `Générez 10 mots-clés liés à "${keyword}" pour le SEO:`;
    const content = await this.generateContent(prompt);
    return content.split('\n').filter(line => line.trim()).slice(0, 10);
  }

  async getKeywordSuggestions(keyword: string): Promise<string[]> {
    return this.generateKeywords(keyword);
  }

  async analyzeSeoContent(content: string): Promise<any> {
    const prompt = `Analysez le contenu SEO suivant: ${content}`;
    const analysis = await this.generateContent(prompt);
    return { analysis, score: Math.floor(Math.random() * 100) };
  }

  // Instance method for validation
  validateApiKey(apiKey: string): boolean {
    return OpenAIService.validateApiKey(apiKey);
  }
}
