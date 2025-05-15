
import { OpenAI } from "openai";
import { toast } from "sonner";
import { ProxyService } from "./proxyService";
import { KeywordSuggestion } from "@/types/seo";

export class OpenAIService {
  private static proxyEnabled = true;
  
  private apiKey: string;
  private openai: OpenAI | null = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
    console.log("OpenAI service initialized");
  }

  static setApiKey(apiKey: string): void {
    localStorage.setItem('openaiKey', apiKey);
    console.log("API key saved to localStorage");
  }

  static getApiKey(): string | null {
    return localStorage.getItem('openaiKey');
  }

  static enableProxy(): void {
    OpenAIService.proxyEnabled = true;
    localStorage.setItem('openai_proxy_enabled', 'true');
    console.log('OpenAI CORS proxy enabled');
    
    // Also enable proxy in ProxyService
    ProxyService.enableProxy();
  }

  static disableProxy(): void {
    OpenAIService.proxyEnabled = false;
    localStorage.setItem('openai_proxy_enabled', 'false');
    console.log('OpenAI CORS proxy disabled');
  }

  static isProxyEnabled(): boolean {
    return true; // Always enable proxy
  }

  static async fetchWithProxy(url: string): Promise<string> {
    try {
      const response = await ProxyService.fetchWithProxies(url);
      return await response.text();
    } catch (error) {
      console.error("Error fetching with proxy:", error);
      throw error;
    }
  }

  async validateApiKey(): Promise<boolean> {
    if (!this.apiKey || !this.openai) {
      console.error("No API key provided");
      return false;
    }

    try {
      console.log("Validating OpenAI API key...");
      toast.loading("Validation de la clé API OpenAI...", {
        id: "validate-key"
      });
      
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
      
      if (isValid) {
        toast.success("Clé API OpenAI valide", {
          id: "validate-key"
        });
      } else {
        toast.error("Clé API OpenAI invalide", {
          id: "validate-key",
          description: "La réponse n'est pas celle attendue"
        });
      }
      
      console.log("API key validation result:", isValid);
      return isValid;
    } catch (error) {
      console.error("API key validation error:", error);
      toast.error("Erreur de validation de la clé API", {
        id: "validate-key",
        description: error instanceof Error ? error.message : "Erreur inconnue"
      });
      return false;
    }
  }

  async analyzeSeoContent(url: string, content: string): Promise<any> {
    if (!this.apiKey || !this.openai) {
      throw new Error("OpenAI API key not set");
    }
    
    try {
      toast.loading("Analyse du contenu avec OpenAI...", {
        id: "analyze-content"
      });
      
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
        toast.error("Aucun résultat d'analyse reçu", {
          id: "analyze-content"
        });
        throw new Error("No analysis result received");
      }
      
      toast.success("Analyse OpenAI terminée", {
        id: "analyze-content"
      });
      
      console.log("SEO analysis result:", result);
      return JSON.parse(result);
    } catch (error) {
      console.error("Error during SEO analysis:", error);
      toast.error("Erreur lors de l'analyse SEO", {
        id: "analyze-content",
        description: error instanceof Error ? error.message : "Erreur inconnue"
      });
      throw error;
    }
  }

  async getKeywordSuggestions(seedKeyword: string): Promise<any[]> {
    if (!this.apiKey || !this.openai) {
      throw new Error("OpenAI API key not set");
    }
    
    try {
      toast.loading(`Génération de suggestions pour "${seedKeyword}"...`, {
        id: "keyword-suggestions"
      });
      
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
        toast.error("Aucune suggestion de mots-clés reçue", {
          id: "keyword-suggestions"
        });
        throw new Error("No keyword suggestions received");
      }
      
      toast.success(`Suggestions générées pour "${seedKeyword}"`, {
        id: "keyword-suggestions"
      });
      
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
      toast.error("Erreur lors de la génération de suggestions", {
        id: "keyword-suggestions",
        description: error instanceof Error ? error.message : "Erreur inconnue"
      });
      throw error;
    }
  }
  
  async generateComprehensiveKeywordStrategy(seedKeyword: string, language: string = 'fr', niche: string = '', objective: string = 'blog'): Promise<any> {
    if (!this.apiKey || !this.openai) {
      throw new Error("OpenAI API key not set");
    }
    
    try {
      toast.loading(`Génération de la stratégie pour "${seedKeyword}"...`, {
        id: "keyword-strategy"
      });
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an expert SEO keyword researcher. Generate a comprehensive keyword strategy based on a seed keyword. 
            Format your response as a JSON object with these sections:
            1. mainKeywords: array of objects with {keyword, volume (0-10000), difficulty (0-100), cpc (0-5€), competition (0-1), relevance (0-100), suggestedTitle, suggestedDescription}
            2. longTail: array of longer keyword phrases with same structure
            3. questions: array of question-based keywords with same structure
            4. related: array of related terms with same structure
            5. semantic: array of string semantic field terms
            6. competitors: array of objects with {name, url, strength (0-100)}
            7. byIntent: object with {informational: [...keywords], transactional: [...keywords], navigational: [...keywords]}
            8. contentIdeas: array of objects with {title, type}
            
            Include realistic search volumes, competition levels, and accurate suggested titles/descriptions for each keyword.`
          },
          {
            role: "user",
            content: `Generate a complete keyword strategy for "${seedKeyword}" in ${language} language. 
            Niche/Industry: ${niche || 'general'}
            Content Objective: ${objective}
            
            Include main keywords, long-tail variations, questions, related terms, and content ideas.
            For each keyword, provide realistic search volume, difficulty score, CPC, competition level, and relevance score.
            Also include suggested titles and meta descriptions for the main keywords.`
          }
        ],
        max_tokens: 2000,
        temperature: 0.4,
        response_format: { type: "json_object" }
      });
      
      const result = response.choices[0]?.message?.content;
      if (!result) {
        toast.error("Aucune stratégie de mots-clés reçue", {
          id: "keyword-strategy"
        });
        throw new Error("No keyword strategy received");
      }
      
      toast.success(`Stratégie générée pour "${seedKeyword}"`, {
        id: "keyword-strategy"
      });
      
      try {
        return JSON.parse(result);
      } catch (e) {
        console.error("Error parsing keyword strategy:", e);
        toast.error("Format de réponse invalide", {
          description: "Impossible d'analyser les données reçues"
        });
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error generating keyword strategy:", error);
      toast.error("Erreur lors de la génération de la stratégie", {
        id: "keyword-strategy",
        description: error instanceof Error ? error.message : "Erreur inconnue"
      });
      throw error;
    }
  }
}
