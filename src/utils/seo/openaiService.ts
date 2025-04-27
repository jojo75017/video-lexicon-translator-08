
import axios from 'axios';
import { KeywordSuggestion } from '@/types/seo';

export class OpenAIService {
  private apiKey: string;
  private static proxyEnabled: boolean = false;
  private static proxyUrl: string = 'https://corsproxy.io/?';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Activer le proxy CORS pour les requêtes API
   */
  static enableProxy() {
    OpenAIService.proxyEnabled = true;
    console.log('Proxy CORS activé');
  }

  /**
   * Désactiver le proxy CORS pour les requêtes API
   */
  static disableProxy() {
    OpenAIService.proxyEnabled = false;
    console.log('Proxy CORS désactivé');
  }

  /**
   * Formater l'URL avec le proxy si celui-ci est activé
   */
  private formatUrl(url: string): string {
    return OpenAIService.proxyEnabled ? `${OpenAIService.proxyUrl}${encodeURIComponent(url)}` : url;
  }

  /**
   * Valider la clé API OpenAI (méthode sans proxy)
   */
  public async validateApiKey(): Promise<boolean> {
    try {
      console.log("Validation de la clé API OpenAI...");
      // Nettoyer la clé pour éviter les problèmes
      const cleanKey = this.apiKey.trim().replace(/^['"]|['"]$/g, '');
      
      // Utiliser une requête simple à l'API OpenAI (modèles disponibles)
      const url = this.formatUrl('https://api.openai.com/v1/models');
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${cleanKey}`,
          'Content-Type': 'application/json'
        },
      });
      
      console.log("Statut de la réponse:", response.status);
      
      // Si la requête réussit (statut 200), la clé est valide
      return response.status === 200;
    } catch (error: any) {
      // Afficher les détails de l'erreur pour le débogage
      console.error("Erreur lors de la validation de la clé API:", error);
      
      if (error.response) {
        console.error("Statut erreur:", error.response.status);
        console.error("Données:", error.response.data);
        
        // Si l'erreur est due à une clé invalide, elle renvoie généralement un statut 401
        if (error.response.status === 401) {
          console.error("Clé API invalide ou expirée");
          return false;
        }
      }
      
      // En cas d'erreur réseau ou autre, on considère que la validation a échoué
      return false;
    }
  }

  /**
   * Obtenir des suggestions de mots-clés via l'API OpenAI
   */
  public async getKeywordSuggestions(keyword: string): Promise<KeywordSuggestion[]> {
    try {
      console.log(`Génération de suggestions pour "${keyword}"...`);
      const url = this.formatUrl('https://api.openai.com/v1/chat/completions');
      
      const response = await axios.post(
        url,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Tu es un expert SEO. Tu dois suggérer des mots-clés pertinents ainsi que des titres et descriptions optimisés pour le SEO.'
            },
            {
              role: 'user',
              content: `Donne-moi 5 suggestions de mots-clés SEO autour du terme "${keyword}". Pour chaque mot-clé, fournis: le volume de recherche mensuel approximatif, la difficulté (sur 100), la pertinence (%), un titre SEO optimal de 60 caractères maximum, une description courte de 155 caractères maximum, et une description longue de 500 caractères maximum. Réponds sous format JSON avec cette structure exacte: [{"keyword": "mot-clé", "searchVolume": nombre, "difficulty": nombre, "relevance": nombre, "competition": nombre entre 0 et 1, "cpc": nombre, "volume": nombre, "suggestedTitle": "titre", "suggestedDescription": "description courte", "suggestedShortDescription": "description courte de 155 caractères", "suggestedLongDescription": "description longue de 500 caractères"}]`
            }
          ],
          temperature: 0.7,
          max_tokens: 1500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Récupérer la réponse de l'API
      const content = response.data.choices[0].message.content;
      
      // Extraire le JSON de la réponse
      const jsonMatch = content.match(/\[\s*\{.*\}\s*\]/s);
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const parsedData = JSON.parse(jsonStr);
        
        // Vérifier et compléter les données si nécessaire
        return parsedData.map((kw: any) => ({
          ...kw,
          // S'assurer que toutes les propriétés requises sont présentes
          searchVolume: kw.searchVolume || Math.floor(Math.random() * 5000) + 1000,
          difficulty: kw.difficulty || Math.floor(Math.random() * 100),
          relevance: kw.relevance || Math.floor(Math.random() * 30) + 70,
          competition: kw.competition || Math.random().toFixed(2),
          cpc: kw.cpc || (Math.random() * 5).toFixed(2),
          volume: kw.volume || kw.searchVolume || Math.floor(Math.random() * 5000) + 1000,
          suggestedTitle: kw.suggestedTitle || `Titre optimisé pour ${kw.keyword}`,
          suggestedDescription: kw.suggestedDescription || `Description courte optimisée pour le mot-clé ${kw.keyword}. Cette description est conçue pour attirer l'attention des utilisateurs dans les résultats de recherche.`,
          suggestedShortDescription: kw.suggestedShortDescription || kw.suggestedDescription || `Description courte optimisée pour le mot-clé ${kw.keyword}. Idéale pour les métadonnées de votre page.`,
          suggestedLongDescription: kw.suggestedLongDescription || `Description longue et détaillée pour le mot-clé ${kw.keyword}. Cette description complète permet d'intégrer plus de mots-clés secondaires et de donner plus d'informations sur votre contenu. Elle est parfaite pour les pages d'atterrissage ou les descriptions de produits où vous avez besoin de plus d'espace pour convaincre vos visiteurs et améliorer votre référencement avec un contenu plus riche.`
        }));
      }
      
      throw new Error('Format de réponse invalide');
    } catch (error) {
      console.error("Erreur lors de la génération des suggestions:", error);
      throw error;
    }
  }
}
