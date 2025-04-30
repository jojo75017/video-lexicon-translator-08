export class OpenAIService {
  private static apiKey: string | null = null;
  private static proxyEnabled: boolean = true;
  private apiKeyInstance: string;

  constructor(apiKey: string) {
    this.apiKeyInstance = apiKey;
    OpenAIService.apiKey = apiKey; // Update static key as well
  }

  // Static method to set API key
  static setApiKey(key: string): void {
    OpenAIService.apiKey = key;
    // Store in localStorage as well for persistence
    localStorage.setItem('openaiKey', key);
    console.log("OpenAI API key set successfully");
  }

  // Static method to get API key
  static getApiKey(): string | null {
    if (!OpenAIService.apiKey) {
      OpenAIService.apiKey = localStorage.getItem('openaiKey');
    }
    return OpenAIService.apiKey;
  }

  static enableProxy(): void {
    OpenAIService.proxyEnabled = true;
    localStorage.setItem('openai_proxy_enabled', 'true');
    console.log("OpenAI CORS proxy enabled");
  }

  static disableProxy(): void {
    OpenAIService.proxyEnabled = false;
    localStorage.setItem('openai_proxy_enabled', 'false');
    console.log("OpenAI CORS proxy disabled");
  }

  static isProxyEnabled(): boolean {
    const savedSetting = localStorage.getItem('openai_proxy_enabled');
    if (savedSetting !== null) {
      return savedSetting === 'true';
    }
    return OpenAIService.proxyEnabled; // Default to enabled
  }

  // Ensure API key is valid format (basic validation)
  static validateKeyFormat(key: string): boolean {
    return key && key.startsWith('sk-') && key.length > 20;
  }

  // Validate API key with OpenAI (test connection)
  async validateApiKey(): Promise<boolean> {
    const key = this.apiKeyInstance || OpenAIService.getApiKey();
    if (!key || !OpenAIService.validateKeyFormat(key)) {
      console.error("Invalid API key format");
      return false;
    }

    try {
      // Using a minimal request to test the API key
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      const isValid = response.ok && result.data && Array.isArray(result.data);
      
      if (isValid) {
        console.log("OpenAI API key validation successful");
        // Save the valid key
        OpenAIService.setApiKey(key);
      } else {
        console.error("OpenAI API key validation failed:", result.error || "Unknown error");
      }
      
      return isValid;
    } catch (error) {
      console.error("Error validating OpenAI API key:", error);
      return false;
    }
  }

  async analyzeSeoContent(url: string, content: string): Promise<any> {
    const apiKey = this.apiKeyInstance || OpenAIService.getApiKey();
    if (!apiKey) {
      console.warn("No OpenAI API key provided.");
      return null;
    }

    const prompt = `Analyze the following content from ${url} for SEO best practices. Provide insights on keyword usage, readability, and potential improvements:\n\n${content}`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 150,
          temperature: 0.7
        })
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      } else {
        console.error("OpenAI content analysis failed:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Error during OpenAI content analysis:", error);
      return null;
    }
  }

  async getKeywordSuggestions(keyword: string): Promise<any> {
    const apiKey = this.apiKeyInstance || OpenAIService.getApiKey();
    if (!apiKey) {
      console.warn("No OpenAI API key provided.");
      return [];
    }

    const prompt = `Suggest 5 related keywords, their search volume, SEO difficulty (1-100), a title (max 60 chars), and a meta description (max 160 chars) for the keyword "${keyword}". Return as JSON.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1500,
          temperature: 0.7
        })
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        try {
          const content = data.choices[0].message.content.trim();
          const suggestions = this.parseKeywordSuggestions(content);
          return suggestions;
        } catch (e) {
          console.error("Failed to parse keyword suggestions:", e);
          console.log("Raw response from OpenAI:", data.choices[0].message.content);
          return [];
        }
      } else {
        console.error("OpenAI keyword suggestion failed:", data.error);
        return [];
      }
    } catch (error) {
      console.error("Error during OpenAI keyword suggestion:", error);
      return [];
    }
  }

  private parseKeywordSuggestions(jsonString: string): any[] {
    try {
      // Attempt to clean the JSON string by removing leading/trailing whitespace and extra characters
      const cleanedJsonString = jsonString.trim().replace(/^```json\n/, '').replace(/```$/, '');
      const parsedObject = JSON.parse(cleanedJsonString);

      if (Array.isArray(parsedObject)) {
        return parsedObject.map(item => ({
          keyword: item.keyword || '',
          searchVolume: item.searchVolume || 0,
          difficulty: item.difficulty || 0,
          suggestedTitle: item.suggestedTitle || '',
          suggestedDescription: item.suggestedDescription || '',
          relevance: item.relevance || 0,
          competition: item.competition || 0,
          cpc: item.cpc || 0,
          volume: item.volume || 0
        }));
      } else {
        console.error("Parsed object is not an array:", parsedObject);
        return [];
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      console.log("Failing JSON string:", jsonString);
      return [];
    }
  }

  // Add this method to help with OpenAI integration diagnostics
  static async checkApiKeyStatus(): Promise<{ exists: boolean, valid: boolean, message: string }> {
    const key = OpenAIService.getApiKey();
    
    if (!key) {
      return {
        exists: false, 
        valid: false,
        message: "No API key found. Please add your OpenAI API key in settings."
      };
    }
    
    if (!OpenAIService.validateKeyFormat(key)) {
      return {
        exists: true,
        valid: false,
        message: "API key format is invalid. It should start with 'sk-'."
      };
    }
    
    try {
      const service = new OpenAIService(key);
      const isValid = await service.validateApiKey();
      
      return {
        exists: true,
        valid: isValid,
        message: isValid 
          ? "API key is valid and ready to use."
          : "API key exists but could not be validated."
      };
    } catch (error) {
      return {
        exists: true,
        valid: false,
        message: "Error checking API key: " + (error instanceof Error ? error.message : "Unknown error")
      };
    }
  }
}
