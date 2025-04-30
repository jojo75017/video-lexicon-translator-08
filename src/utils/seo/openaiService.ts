
import { OpenAI } from "openai";
import { toast } from "sonner";

export class OpenAIService {
  private static proxyEnabled = true;
  private static proxyUrls = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://thingproxy.freeboard.io/fetch/',
    'https://crossorigin.me/'
  ];
  private static currentProxyIndex = 0;
  
  private apiKey: string;
  private openai: OpenAI | null = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  static setApiKey(apiKey: string): void {
    localStorage.setItem('openaiKey', apiKey);
  }

  static getApiKey(): string | null {
    return localStorage.getItem('openaiKey');
  }

  static enableProxy(): void {
    OpenAIService.proxyEnabled = true;
    localStorage.setItem('openai_proxy_enabled', 'true');
    console.log('OpenAI CORS proxy enabled');
  }

  static disableProxy(): void {
    OpenAIService.proxyEnabled = false;
    localStorage.setItem('openai_proxy_enabled', 'false');
    console.log('OpenAI CORS proxy disabled');
  }

  static isProxyEnabled(): boolean {
    return OpenAIService.proxyEnabled;
  }

  static getNextProxy(): string {
    const proxy = OpenAIService.proxyUrls[OpenAIService.currentProxyIndex];
    // Rotate to next proxy for future requests
    OpenAIService.currentProxyIndex = (OpenAIService.currentProxyIndex + 1) % OpenAIService.proxyUrls.length;
    console.log(`Using proxy: ${proxy}`);
    return proxy;
  }

  static async fetchWithProxy(url: string): Promise<string> {
    // Try all available proxies in sequence
    let lastError: Error | null = null;
    
    for (let i = 0; i < OpenAIService.proxyUrls.length; i++) {
      const proxy = OpenAIService.proxyUrls[(OpenAIService.currentProxyIndex + i) % OpenAIService.proxyUrls.length];
      const proxyUrl = proxy + encodeURIComponent(url);
      
      try {
        console.log(`Attempting fetch with proxy (${i+1}/${OpenAIService.proxyUrls.length}): ${proxy}`);
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        if (response.ok) {
          console.log(`Proxy ${proxy} worked! Content retrieved.`);
          OpenAIService.currentProxyIndex = (OpenAIService.currentProxyIndex + i) % OpenAIService.proxyUrls.length;
          return await response.text();
        }
        
        console.log(`Proxy ${proxy} failed with status: ${response.status}`);
        lastError = new Error(`HTTP status: ${response.status}`);
      } catch (error) {
        console.error(`Error with proxy ${proxy}:`, error);
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }
    
    throw lastError || new Error('All proxies failed');
  }

  async validateApiKey(): Promise<boolean> {
    if (!this.apiKey || !this.openai) {
      return false;
    }

    try {
      console.log("Validating OpenAI API key...");
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "This is a simple test to verify API key validity." },
          { role: "user", content: "Say 'valid'" }
        ],
        max_tokens: 10
      });
      
      const isValid = response && 
                      response.choices && 
                      response.choices[0]?.message?.content?.toLowerCase().includes('valid');
      
      console.log("API key validation result:", isValid);
      return isValid;
    } catch (error) {
      console.error("API key validation error:", error);
      return false;
    }
  }

  async analyzeSeoContent(url: string, content: string): Promise<any> {
    if (!this.apiKey || !this.openai) {
      throw new Error("OpenAI API key not set");
    }
    
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful SEO expert analyzing website content. Provide an analysis of the provided content with respect to SEO best practices. Format your response as JSON, using a structure that includes sections for strengths, weaknesses, and recommendations."
          },
          {
            role: "user",
            content: `Analyze the SEO of this webpage (URL: ${url}) with the following content: ${content.substring(0, 3000)}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.5,
        response_format: { type: "json_object" }
      });
      
      const result = response.choices[0]?.message?.content;
      if (!result) {
        throw new Error("No analysis result received");
      }
      
      console.log("SEO analysis result:", result);
      return JSON.parse(result);
    } catch (error) {
      console.error("Error during SEO analysis:", error);
      throw error;
    }
  }

  async getKeywordSuggestions(seedKeyword: string): Promise<any[]> {
    if (!this.apiKey || !this.openai) {
      throw new Error("OpenAI API key not set");
    }
    
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful keyword research expert. Provide SEO keyword suggestions based on the given seed keyword. Format your response as a JSON array, where each item includes the keyword, search volume estimate (scale from 1-100), competition level (scale from 1-100, where 100 is highly competitive), estimated CPC in euros, and relevance score (scale from 1-100)."
          },
          {
            role: "user",
            content: `Generate 15 keyword suggestions related to "${seedKeyword}". Include a mix of short and long-tail keywords that would be valuable for SEO.`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        response_format: { type: "json_object" }
      });
      
      const result = response.choices[0]?.message?.content;
      if (!result) {
        throw new Error("No keyword suggestions received");
      }
      
      try {
        const parsedResult = JSON.parse(result);
        if (Array.isArray(parsedResult.keywords)) {
          return parsedResult.keywords;
        } else if (Array.isArray(parsedResult)) {
          return parsedResult;
        } else {
          console.error("Unexpected response format:", parsedResult);
          return [];
        }
      } catch (e) {
        console.error("Error parsing keyword suggestions:", e);
        return [];
      }
    } catch (error) {
      console.error("Error getting keyword suggestions:", error);
      throw error;
    }
  }
}
