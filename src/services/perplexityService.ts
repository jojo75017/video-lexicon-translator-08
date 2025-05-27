
export class PerplexityService {
  private static API_KEY_STORAGE_KEY = 'perplexity_api_key';

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async generateKeywords(query: string): Promise<string[]> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('API key not found');
    }

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'Generate relevant keywords for SEO purposes. Return only a simple list of keywords.'
            },
            {
              role: 'user',
              content: `Generate SEO keywords for: ${query}`
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 1000,
        }),
      });

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      return content.split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0)
        .slice(0, 10);
    } catch (error) {
      console.error('Error generating keywords:', error);
      return [];
    }
  }
}
