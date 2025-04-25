
import { KeywordSuggestion, OpenAIKeywordResponse } from '@/types/seo';

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
  async getKeywordSuggestions(keyword: string): Promise<KeywordSuggestion[]> {
    if (!this.isValidApiKeyFormat()) {
      console.error('Tentative d\'utilisation de getKeywordSuggestions sans clé API valide');
      throw new Error('Clé API OpenAI non définie ou invalide');
    }

    if (!keyword || keyword.trim() === '') {
      console.error('Mot-clé vide fourni à getKeywordSuggestions');
      throw new Error('Mot-clé non défini');
    }

    try {
      console.log("Génération de suggestions pour le mot-clé:", keyword);
      
      const prompt = `Génère 5 suggestions de mots-clés SEO pour: "${keyword}".
Pour chaque mot-clé, fournit:
1. Le mot-clé
2. Une estimation du volume de recherche (nombre)
3. Une difficulté d'optimisation (nombre de 1 à 100)
4. Un titre optimisé pour le SEO (max 60 caractères)
5. Une meta description courte optimisée (exactement 155 caractères)
6. Une meta description longue optimisée (exactement 500 caractères)

Format en JSON comme ceci:
[
  {
    "keyword": "exemple mot-clé",
    "searchVolume": 1000,
    "difficulty": 40,
    "suggestedTitle": "Titre SEO optimisé pour ce mot-clé | Exemple",
    "suggestedDescription": "Description courte optimisée pour le SEO avec le mot-clé cible et un appel à l'action clair, limitée à exactement 155 caractères.",
    "suggestedShortDescription": "Description courte exactement 155 caractères avec mot-clé et appel à l'action",
    "suggestedLongDescription": "Description longue 500 caractères"
  }
]

Assure-toi que les descriptions font EXACTEMENT le nombre de caractères demandé.`;

      const apiUrl = 'https://api.openai.com/v1/chat/completions';
      const finalApiUrl = OpenAIService.applyProxy(apiUrl);
      
      console.log("Envoi de requête OpenAI à:", finalApiUrl);
      
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
              content: 'Tu es un expert SEO. Génère des suggestions de mots-clés au format JSON. Les descriptions doivent faire exactement le nombre de caractères spécifié.' 
            },
            { 
              role: 'user', 
              content: prompt 
            }
          ],
          temperature: 0.5,
          max_tokens: 2000
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erreur API OpenAI: ${response.status}`, errorText);
        
        // Si erreur de CORS ou connexion, essayer un autre proxy
        if (response.status === 0) {
          OpenAIService.rotateProxy();
          return this.getKeywordSuggestions(keyword);
        }
        
        // Message d'erreur plus précis selon le code d'état
        if (response.status === 401) {
          throw new Error(`Erreur d'authentification (401): Clé API invalide ou expirée`);
        } else if (response.status === 429) {
          throw new Error(`Limite de requêtes dépassée (429): Réessayez plus tard`);
        } else {
          throw new Error(`Erreur API OpenAI: ${response.status} - ${errorText.substring(0, 100)}`);
        }
      }
      
      const data = await response.json();
      console.log("Réponse OpenAI reçue");
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        console.error("Format de réponse inattendu:", data);
        throw new Error("La réponse API OpenAI est dans un format inattendu");
      }
      
      const content = data.choices[0].message.content;
      
      // Extraction du JSON de la réponse
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      
      if (!jsonMatch) {
        console.error("Format de réponse invalide:", content);
        throw new Error('Format de réponse invalide: JSON non trouvé');
      }
      
      let keywordData;
      try {
        keywordData = JSON.parse(jsonMatch[0]) as OpenAIKeywordResponse[];
        console.log("Données de mots-clés analysées:", keywordData.length, "suggestions");
      } catch (e) {
        console.error("Erreur d'analyse JSON:", e, "Réponse brute:", content);
        throw new Error('Erreur d\'analyse du format JSON');
      }
      
      if (!Array.isArray(keywordData) || keywordData.length === 0) {
        console.error("Données de mots-clés invalides:", keywordData);
        throw new Error('Aucune suggestion de mot-clé n\'a été générée');
      }
      
      // Conversion vers le format KeywordSuggestion
      return keywordData.map(item => ({
        keyword: item.keyword || keyword,
        searchVolume: item.searchVolume || Math.floor(Math.random() * 10000),
        difficulty: item.difficulty || Math.floor(Math.random() * 100),
        suggestedTitle: item.suggestedTitle || `${keyword} - Titre optimisé pour le SEO | Guide complet`,
        suggestedDescription: item.suggestedDescription || `Découvrez notre guide complet sur ${keyword}. Conseils d'experts, astuces et stratégies éprouvées pour maximiser vos résultats.`.substring(0, 155),
        suggestedShortDescription: item.suggestedShortDescription || item.suggestedDescription || `Découvrez notre guide complet sur ${keyword}. Conseils d'experts, astuces et stratégies éprouvées pour maximiser vos résultats.`.substring(0, 155),
        suggestedLongDescription: item.suggestedLongDescription || `${item.suggestedDescription || `Plongez dans notre guide détaillé sur ${keyword}. Nos experts partagent leurs connaissances et meilleures pratiques pour vous aider à maîtriser ce sujet essentiel.`}`.substring(0, 500),
        relevance: Math.floor(Math.random() * 30) + 70,
        competition: Math.random(),
        cpc: parseFloat((Math.random() * 3 + 0.5).toFixed(2)),
        volume: item.searchVolume || Math.floor(Math.random() * 10000)
      }));
    } catch (error) {
      console.error('Erreur lors de la génération de suggestions:', error);
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
