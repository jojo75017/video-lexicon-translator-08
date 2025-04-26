
import { KeywordSuggestion } from '@/types/seo';

export class OpenAIService {
  private apiKey: string;
  private static proxyEnabled: boolean = true; // Enabled by default to avoid CORS issues
  private static proxyUrl: string = 'https://corsproxy.io/?';
  private static alternativeProxies: string[] = [
    'https://corsproxy.io/?',
    'https://cors-proxy.htmldriven.com/?url=',
    'https://cors-anywhere.herokuapp.com/'
  ];
  private static currentProxyIndex: number = 0;
  private static maxRetries: number = 2;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey || '';
    console.log("OpenAIService initialisé avec une clé API", apiKey ? "présente" : "manquante");
  }
  
  // Méthodes statiques pour gérer le proxy
  static enableProxy(): void {
    OpenAIService.proxyEnabled = true;
    console.log("Proxy CORS activé dans OpenAIService");
    localStorage.setItem('openai_proxy_enabled', 'true');
  }
  
  static disableProxy(): void {
    OpenAIService.proxyEnabled = false;
    console.log("Proxy CORS désactivé dans OpenAIService");
    localStorage.setItem('openai_proxy_enabled', 'false');
  }
  
  static isProxyEnabled(): boolean {
    const savedState = localStorage.getItem('openai_proxy_enabled');
    if (savedState !== null) {
      return savedState === 'true';
    }
    return OpenAIService.proxyEnabled;
  }
  
  // Applique le proxy à l'URL si nécessaire
  private static applyProxy(url: string): string {
    if (OpenAIService.isProxyEnabled()) {
      const proxyUrl = OpenAIService.alternativeProxies[OpenAIService.currentProxyIndex];
      console.log(`Utilisation du proxy: ${proxyUrl} pour ${url}`);
      return proxyUrl + encodeURIComponent(url);
    }
    return url;
  }

  // Essayer le proxy suivant
  private static rotateProxy(): string {
    OpenAIService.currentProxyIndex = (OpenAIService.currentProxyIndex + 1) % OpenAIService.alternativeProxies.length;
    const newProxy = OpenAIService.alternativeProxies[OpenAIService.currentProxyIndex];
    console.log(`Rotation vers le proxy: ${newProxy}`);
    return newProxy;
  }
  
  // Vérifie rapidement si la clé API a un format valide
  private isValidApiKeyFormat(): boolean {
    return !!this.apiKey && this.apiKey.trim().length > 20 && this.apiKey.startsWith('sk-');
  }
  
  // Méthode pour valider la clé API
  async validateApiKey(): Promise<boolean> {
    if (!this.isValidApiKeyFormat()) {
      console.log('Clé API vide, trop courte ou format incorrect');
      return false;
    }

    console.log('Vérification de la clé API OpenAI:', this.apiKey.substring(0, 5) + "...");

    try {
      console.log('Validation de la clé OpenAI avec proxy...');
      const url = 'https://api.openai.com/v1/models';
      const finalUrl = OpenAIService.applyProxy(url);
      
      console.log(`Validation avec URL: ${finalUrl}`);
      
      const response = await fetch(finalUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      const isValid = response.status === 200;
      console.log(`Résultat de validation de clé API: ${isValid ? 'Valide' : 'Invalide'} (Status: ${response.status})`);
      
      // Si la validation échoue, essayer un autre proxy
      if (!isValid && response.status === 0) {
        OpenAIService.rotateProxy();
        return this.validateApiKey(); // Essayer à nouveau avec un proxy différent
      }
      
      if (!isValid) {
        const responseText = await response.text();
        console.error('Erreur de validation OpenAI:', response.status, responseText);
        throw new Error(`Validation échouée avec statut ${response.status}: ${responseText}`);
      }
      
      return isValid;
    } catch (error) {
      console.error('Erreur lors de la validation de la clé API:', error);
      // Essayer un autre proxy en cas d'erreur de connexion
      OpenAIService.rotateProxy();
      console.log('Essai avec un autre proxy...');
      
      // Ne pas retenter indéfiniment pour éviter les boucles infinies
      if (OpenAIService.currentProxyIndex !== 0) {
        return this.validateApiKey();
      }
      return false;
    }
  }
  
  // Méthode pour obtenir des suggestions de mots-clés
  async getKeywordSuggestions(keyword: string, retryCount = 0): Promise<KeywordSuggestion[]> {
    if (!this.isValidApiKeyFormat()) {
      console.error('Tentative d\'utilisation de getKeywordSuggestions sans clé API valide');
      throw new Error('Clé API OpenAI non définie ou invalide');
    }

    try {
      console.log("Génération de suggestions pour le mot-clé:", keyword);
      
      const apiUrl = 'https://api.openai.com/v1/chat/completions';
      const finalApiUrl = OpenAIService.applyProxy(apiUrl);
      
      console.log(`Tentative d'appel à l'API: ${finalApiUrl}`);
      
      const response = await fetch(finalApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Génère des suggestions SEO au format JSON.' },
            { 
              role: 'user',
              content: `Génère 5 suggestions SEO pour le mot-clé: "${keyword}". Format JSON avec: keyword, searchVolume (nombre), difficulty (1-100), suggestedTitle (max 60 caractères), suggestedDescription (155 caractères), suggestedShortDescription (variante courte, 155 car max), suggestedLongDescription (variante longue, 500 car), relevance (1-100), competition (0-1), cpc (nombre décimal), volume (nombre).` 
            }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        console.error(`Erreur API HTTP: ${response.status}`);
        
        // Tenter avec un autre proxy
        if (retryCount < OpenAIService.maxRetries) {
          console.log(`Rotation du proxy et nouvelle tentative (${retryCount + 1}/${OpenAIService.maxRetries})`);
          OpenAIService.rotateProxy();
          return this.getKeywordSuggestions(keyword, retryCount + 1);
        }
        
        throw new Error(`Erreur API OpenAI: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        console.log("Analyse de la réponse JSON de l'API");
        const suggestions = JSON.parse(content);
        
        return suggestions.map((item: any) => ({
          ...item,
          keyword: item.keyword || keyword,
          searchVolume: item.searchVolume || Math.floor(Math.random() * 10000),
          difficulty: item.difficulty || Math.floor(Math.random() * 100),
          relevance: item.relevance || Math.floor(Math.random() * 30) + 70,
          competition: item.competition || Math.random(),
          cpc: item.cpc || parseFloat((Math.random() * 3 + 0.5).toFixed(2)),
          volume: item.volume || Math.floor(Math.random() * 10000),
          suggestedDescription: item.suggestedDescription || `Description pour "${item.keyword || keyword}" générée automatiquement.`,
          suggestedShortDescription: item.suggestedShortDescription || item.suggestedDescription || `Description courte pour "${item.keyword || keyword}" générée automatiquement.`,
          suggestedLongDescription: item.suggestedLongDescription || `Description longue pour "${item.keyword || keyword}" générée automatiquement. Cette description est plus détaillée et contient environ 500 caractères pour donner une explication complète du sujet. Elle peut inclure des points clés, des avantages, et des informations contextuelles importantes pour aider le lecteur à comprendre en profondeur le contenu lié au mot-clé.`
        }));
      } catch (error) {
        console.error("Erreur parsing JSON:", error, "Contenu:", content);
        throw new Error('Format de réponse invalide');
      }
    } catch (error) {
      console.error('Erreur lors de la génération de suggestions:', error);
      
      // Si c'est une erreur réseau (Failed to fetch) et qu'on n'a pas dépassé le nombre de tentatives
      if (error instanceof Error && 
          error.message.includes('fetch') && 
          retryCount < OpenAIService.maxRetries) {
        console.log(`Erreur réseau, rotation du proxy et nouvelle tentative (${retryCount + 1}/${OpenAIService.maxRetries})`);
        OpenAIService.rotateProxy();
        return this.getKeywordSuggestions(keyword, retryCount + 1);
      }
      
      throw error;
    }
  }
  
  async analyzeWebpage(url: string): Promise<{ keywords: string[] }> {
    try {
      console.log("Analyse de la page web:", url);
      
      const prompt = `Analyse cette URL: ${url}. Extrait les mots-clés importants pour le SEO.`;
      
      const apiUrl = 'https://api.openai.com/v1/chat/completions';
      const finalApiUrl = OpenAIService.applyProxy(apiUrl);
      
      const response = await fetch(finalApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: 'Tu es un assistant SEO expert. Extrait les mots-clés importants d\'une URL.' 
            },
            { 
              role: 'user', 
              content: prompt 
            }
          ],
          temperature: 0.3,
          max_tokens: 1000
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Extraction des mots-clés (simplifié)
      const keywords = content
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^[^a-zA-Z0-9]+/, '').trim())
        .filter(keyword => keyword.length > 0);
      
      return { keywords: keywords.slice(0, 10) }; // Limiter à 10 mots-clés
    } catch (error) {
      console.error('Erreur lors de l\'analyse de la page web:', error);
      throw error;
    }
  }
  
  async analyzeSeoContent(url: string, content: string): Promise<any> {
    try {
      const apiUrl = 'https://api.openai.com/v1/chat/completions';
      const finalApiUrl = OpenAIService.applyProxy(apiUrl);
      
      const response = await fetch(finalApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: 'Tu es un expert SEO. Analyse ce contenu et donne des recommandations.' 
            },
            { 
              role: 'user', 
              content: `Analyse SEO pour l'URL: ${url}. Contenu: ${content.substring(0, 2000)}...` 
            }
          ],
          temperature: 0.3,
          max_tokens: 1500
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        analysis: data.choices[0].message.content,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erreur lors de l\'analyse du contenu SEO:', error);
      throw error;
    }
  }
}
