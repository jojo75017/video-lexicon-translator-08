
import { toast } from 'sonner';

// Simple implementation of OpenAI service for SEO analysis
export class OpenAIService {
  private apiKey: string;
  private static proxyEnabled = true;
  private static apiEndpointBase = 'https://api.openai.com/v1';
  private static proxyEndpointBase = 'https://corsproxy.io/?https%3A%2F%2Fapi.openai.com%2Fv1';
  // Add alternate proxy endpoints
  private static alternateProxyEndpoints = [
    'https://corsproxy.io/?https%3A%2F%2Fapi.openai.com%2Fv1',
    'https://api.allorigins.win/raw?url=https%3A%2F%2Fapi.openai.com%2Fv1',
    'https://crossorigin.me/https://api.openai.com/v1'
  ];
  private static currentProxyIndex = 0;

  // Store the instance for singleton pattern
  private static instance: OpenAIService | null = null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || localStorage.getItem('openaiKey') || '';
    
    // If no API key, try to get from localStorage
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('openaiKey') || '';
      console.log("OpenAI API key from localStorage:", this.apiKey ? "Found" : "Not found");
    }
  }

  // Set API key globally
  static setApiKey(key: string): void {
    if (key) {
      localStorage.setItem('openaiKey', key);
      console.log("OpenAI API key set globally");
      
      // Update instance if it exists
      if (this.instance) {
        this.instance.apiKey = key;
      }
    } else {
      console.error("Attempted to set empty API key");
    }
  }
  
  // Get current API key
  static getApiKey(): string {
    return localStorage.getItem('openaiKey') || '';
  }

  // Enable proxy for CORS
  static enableProxy(): void {
    this.proxyEnabled = true;
    localStorage.setItem('openai_proxy_enabled', 'true');
    console.log("OpenAI proxy enabled");
  }

  // Disable proxy
  static disableProxy(): void {
    this.proxyEnabled = false;
    localStorage.setItem('openai_proxy_enabled', 'false');
    console.log("OpenAI proxy disabled");
  }
  
  // Check if proxy is enabled
  static isProxyEnabled(): boolean {
    const savedSetting = localStorage.getItem('openai_proxy_enabled');
    if (savedSetting !== null) {
      return savedSetting === 'true';
    }
    return this.proxyEnabled; // Default to enabled
  }
  
  // Get the correct endpoint based on proxy setting
  private static getEndpointBase(): string {
    if (!this.isProxyEnabled()) {
      return this.apiEndpointBase;
    }
    
    // Use the current proxy from the rotation
    return this.alternateProxyEndpoints[this.currentProxyIndex];
  }
  
  // Try the next proxy in the rotation
  private static rotateProxy(): string {
    this.currentProxyIndex = (this.currentProxyIndex + 1) % this.alternateProxyEndpoints.length;
    console.log(`Rotating to next proxy: ${this.currentProxyIndex}`);
    return this.alternateProxyEndpoints[this.currentProxyIndex];
  }

  // Check API key status
  static async checkApiKeyStatus(): Promise<{ exists: boolean, valid: boolean, message: string }> {
    const apiKey = localStorage.getItem('openaiKey');
    
    if (!apiKey) {
      return {
        exists: false,
        valid: false,
        message: "Aucune clé API définie. Configurez une clé OpenAI pour activer les fonctionnalités d'analyse avancées."
      };
    }
    
    const hasValidFormat = apiKey && apiKey.length > 20 && apiKey.startsWith('sk-');
    if (!hasValidFormat) {
      return {
        exists: true,
        valid: false,
        message: "Format de clé API invalide. La clé doit commencer par 'sk-' et être suffisamment longue."
      };
    }
    
    // Create an instance to test the key
    const service = new OpenAIService(apiKey);
    
    // Make sure proxy is enabled for validation
    this.enableProxy();
    
    try {
      // Try validation with multiple proxies if needed
      let isValid = false;
      let attempts = 0;
      const maxAttempts = this.alternateProxyEndpoints.length;
      
      while (!isValid && attempts < maxAttempts) {
        try {
          console.log(`Attempting key validation with proxy ${this.currentProxyIndex}`);
          isValid = await service.validateApiKey();
          if (isValid) break;
        } catch (error) {
          console.warn(`Proxy ${this.currentProxyIndex} failed, trying next`);
          this.rotateProxy();
        }
        attempts++;
      }
      
      if (isValid) {
        return {
          exists: true,
          valid: true,
          message: "Clé OpenAI valide. Les fonctionnalités d'analyse AI sont activées."
        };
      } else {
        return {
          exists: true,
          valid: false,
          message: "La clé API existe mais semble invalide. Vérifiez les crédits et l'accès à votre compte OpenAI."
        };
      }
    } catch (error) {
      console.error("Error validating API key:", error);
      return {
        exists: true,
        valid: false,
        message: "Impossible de valider la clé API. Vérifiez votre connexion internet."
      };
    }
  }

  // Validate API key with a simple request
  public async validateApiKey(): Promise<boolean> {
    if (!this.apiKey) {
      console.error("No API key provided for validation");
      return false;
    }

    try {
      console.log("Validating API key using endpoint:", OpenAIService.getEndpointBase());
      const endpoint = OpenAIService.getEndpointBase() + '/models';
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Check if we got a valid response status before attempting to parse
      if (!response.ok) {
        console.error("API key validation failed with status:", response.status);
        const errorText = await response.text();
        console.error("Error details:", errorText);
        return false;
      }
      
      const result = await response.json();
      
      if (result && result.data && Array.isArray(result.data)) {
        console.log("API key validation successful, found models:", result.data.length);
        return true;
      } else {
        console.error("API key validation failed - unexpected response format");
        console.log("Response:", result);
        return false;
      }
    } catch (error) {
      console.error("Error validating API key:", error);
      // Try with a different proxy
      OpenAIService.rotateProxy();
      throw error;
    }
  }

  // Analyze SEO content with OpenAI
  public async analyzeSeoContent(url: string, content: string): Promise<any> {
    if (!this.apiKey) {
      console.error("No API key provided for SEO analysis");
      return null;
    }

    try {
      const prompt = `
Analyze this webpage content from "${url}" for SEO improvement:

${content.substring(0, 3000)}

Provide analysis in JSON format with these fields:
1. "metaDescription": A suggested meta description (150-160 chars)
2. "mainKeywords": Array of 5 most important keywords/phrases
3. "contentQualityScore": Number 1-10
4. "suggestions": Array of 3-5 specific improvements
5. "titleSuggestion": An optimized page title
`;

      const endpoint = OpenAIService.getEndpointBase() + '/chat/completions';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // Use 3.5 to save on costs
          messages: [
            { role: 'system', content: 'You are an SEO expert. Provide concise, actionable analysis.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 1000,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        const errorResult = await response.json();
        console.error("OpenAI API error:", errorResult);
        toast.error("Erreur lors de l'analyse OpenAI", { 
          description: errorResult.error?.message || "Vérifiez votre clé API et réessayez" 
        });
        return null;
      }

      const result = await response.json();
      const contentResponse = result.choices?.[0]?.message?.content;
      
      if (!contentResponse) {
        console.error("Empty response from OpenAI");
        return null;
      }
      
      // Try to parse JSON from the response
      try {
        // Extract JSON if it's wrapped in markdown code blocks
        const jsonMatch = contentResponse.match(/```json\n([\s\S]*)\n```/) || 
                         contentResponse.match(/```\n([\s\S]*)\n```/) ||
                         contentResponse.match(/{[\s\S]*}/);
                         
        const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : contentResponse;
        const parsedResult = JSON.parse(jsonString);
        
        console.log("Parsed OpenAI analysis:", parsedResult);
        return parsedResult;
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError, "Raw content:", contentResponse);
        // Return a formatted object with the raw content
        return {
          rawContent: contentResponse,
          error: "Could not parse JSON response"
        };
      }
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      // Try with a different proxy
      OpenAIService.rotateProxy();
      
      toast.error("Erreur de connexion à l'API OpenAI", { 
        description: "Tentative avec un autre proxy..." 
      });
      
      // Try again with a different proxy
      return await this.analyzeSeoContent(url, content);
    }
  }

  // Get keyword suggestions
  public async getKeywordSuggestions(mainKeyword: string): Promise<string[]> {
    if (!this.apiKey) {
      console.error("No API key provided for keyword suggestions");
      return [];
    }

    try {
      const prompt = `Generate 10 keyword suggestions related to "${mainKeyword}" for SEO. Return only an array of strings with no explanation or additional formatting.`;

      const endpoint = OpenAIService.getEndpointBase() + '/chat/completions';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'Return only the requested array of keywords with no additional text.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        console.error("OpenAI API error:", response.status);
        // Try with a different proxy
        OpenAIService.rotateProxy();
        return [];
      }

      const result = await response.json();
      const content = result.choices?.[0]?.message?.content;
      
      if (!content) {
        return [];
      }
      
      // Try to parse suggestions from response
      try {
        // Check for array in markdown code block or direct array
        const arrayMatch = content.match(/```(?:json)?\n(\[[\s\S]*\])\n```/) || 
                          content.match(/\[([\s\S]*)\]/);
                          
        if (arrayMatch) {
          const arrayString = arrayMatch[1].includes('[') ? arrayMatch[1] : `[${arrayMatch[1]}]`;
          return JSON.parse(arrayString);
        }
        
        // Fallback: extract keywords by lines
        const lines = content
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .map(line => line.replace(/^\d+\.\s*/, '')) // Remove numbering
          .map(line => line.replace(/^["-\s]+|["-\s]+$/g, '')); // Remove quotes and dashes
        
        return lines.slice(0, 10); // Return max 10 keywords
      } catch (parseError) {
        console.error("Error parsing keyword suggestions:", parseError);
        return [];
      }
    } catch (error) {
      console.error("Error fetching keyword suggestions:", error);
      // Try with a different proxy
      OpenAIService.rotateProxy();
      return [];
    }
  }

  // Get singleton instance
  public static getInstance(): OpenAIService {
    if (!this.instance) {
      this.instance = new OpenAIService();
    }
    return this.instance;
  }
}
