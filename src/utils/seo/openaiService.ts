
import { KeywordSuggestion, OpenAIKeywordResponse } from '@/types/seo';

export class OpenAIService {
  private apiKey: string;
  private static proxyEnabled: boolean = true; // Enabled by default to avoid CORS issues
  private static proxyUrl: string = 'https://corsproxy.io/?';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
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
      return OpenAIService.proxyUrl + encodeURIComponent(url);
    }
    return url;
  }
  
  // Méthode pour valider la clé API
  async validateApiKey(): Promise<boolean> {
    try {
      console.log('Validating OpenAI API Key...');
      const url = 'https://api.openai.com/v1/models';
      const finalUrl = OpenAIService.applyProxy(url);
      
      const response = await fetch(finalUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      const isValid = response.status === 200;
      console.log(`API key validation result: ${isValid ? 'Valid' : 'Invalid'}`);
      return isValid;
    } catch (error) {
      console.error('Erreur lors de la validation de la clé API:', error);
      return false;
    }
  }
  
  // Méthode pour analyser une page web
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
  
  // Méthode pour obtenir des suggestions de mots-clés
  async getKeywordSuggestions(keyword: string): Promise<KeywordSuggestion[]> {
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
      
      console.log("Sending OpenAI request to:", finalApiUrl);
      
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
        console.error(`OpenAI API error: ${response.status}`, await response.text());
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const data = await response.json();
      const content = data.choices[0].message.content;
      console.log("OpenAI response:", content);
      
      // Extraction du JSON de la réponse
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      
      if (!jsonMatch) {
        throw new Error('Format de réponse invalide');
      }
      
      let keywordData;
      try {
        keywordData = JSON.parse(jsonMatch[0]) as OpenAIKeywordResponse[];
        console.log("Parsed keyword data:", keywordData);
      } catch (e) {
        console.error("JSON parsing error:", e);
        throw new Error('Erreur de parsing JSON');
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
        relevance: Math.floor(Math.random() * 30) + 70, // Valeur aléatoire entre 70 et 100
        competition: Math.random(),
        cpc: parseFloat((Math.random() * 3 + 0.5).toFixed(2)),
        volume: item.searchVolume || Math.floor(Math.random() * 10000)
      }));
    } catch (error) {
      console.error('Erreur lors de la génération de suggestions:', error);
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
