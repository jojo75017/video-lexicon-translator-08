
import { KeywordSuggestion, OpenAIKeywordResponse } from '@/types/seo';

export class OpenAIService {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  // Méthode pour valider la clé API
  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.status === 200;
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
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
    "suggestedShortDescription": "Description courte optimisée pour le SEO avec le mot-clé cible et un appel à l'action clair, limitée à exactement 155 caractères.",
    "suggestedLongDescription": "Description meta optimisée détaillée qui explique en profondeur le sujet avec des informations utiles, pertinentes et qui incite à l'action. Cette description doit être complète, informative et convaincante pour les utilisateurs et les moteurs de recherche. Elle doit contenir suffisamment de détails pour donner un bon aperçu du contenu de la page tout en restant engageante et doit faire exactement 500 caractères."
  }
]

Assure-toi que les descriptions font EXACTEMENT le nombre de caractères demandé.`;
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Extraction du JSON de la réponse
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      
      if (!jsonMatch) {
        throw new Error('Format de réponse invalide');
      }
      
      const keywordData = JSON.parse(jsonMatch[0]) as OpenAIKeywordResponse[];
      
      // Conversion vers le format KeywordSuggestion
      return keywordData.map(item => ({
        keyword: item.keyword || keyword,
        searchVolume: item.searchVolume || Math.floor(Math.random() * 10000),
        difficulty: item.difficulty || Math.floor(Math.random() * 100),
        suggestedTitle: item.suggestedTitle || `${keyword} - Titre optimisé pour le SEO | Guide complet`,
        suggestedShortDescription: item.suggestedShortDescription || item.suggestedDescription || `Découvrez notre guide complet sur ${keyword}. Conseils d'experts, astuces et stratégies éprouvées pour maximiser vos résultats. Cliquez pour en savoir plus!`.padEnd(155, ' ').substring(0, 155),
        suggestedLongDescription: item.suggestedLongDescription || `${item.suggestedDescription || `Plongez dans notre guide détaillé sur ${keyword}. Nos experts partagent leurs connaissances et meilleures pratiques pour vous aider à maîtriser ce sujet essentiel. Que vous soyez débutant ou professionnel, découvrez des stratégies éprouvées, des astuces pratiques et des conseils personnalisés pour atteindre vos objectifs plus rapidement. Notre approche complète vous permettra de développer une expertise solide et d'améliorer vos performances.`}`.padEnd(500, ' ').substring(0, 500),
        suggestedDescription: item.suggestedShortDescription || item.suggestedDescription || `Découvrez notre guide complet sur ${keyword}. Conseils d'experts, astuces et stratégies éprouvées pour maximiser vos résultats.`.padEnd(155, ' ').substring(0, 155),
        relevance: Math.floor(Math.random() * 30) + 70, // Valeur aléatoire entre 70 et 100
        competition: Math.floor(Math.random() * 100),
        cpc: parseFloat((Math.random() * 3 + 0.5).toFixed(2))
      }));
    } catch (error) {
      console.error('Erreur lors de la génération de suggestions:', error);
      throw error;
    }
  }
  
  async analyzeSeoContent(url: string, content: string): Promise<any> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
