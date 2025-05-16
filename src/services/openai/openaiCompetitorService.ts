
import { toast } from 'sonner';
import { CompetitorData, SerpResult } from '@/types/seo/Keyword';
import { validateOpenAIApiKey } from './openaiApiUtils';
import { validateCompetitorData, validateSerpResults, generateFallbackData } from './openaiDataUtils';

export class OpenAICompetitorService {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4o') {
    this.apiKey = apiKey;
    this.model = model;
  }

  /**
   * Validate if the API key is valid by making a simple test request
   */
  async validateApiKey(): Promise<boolean> {
    return validateOpenAIApiKey(this.apiKey, this.model);
  }

  /**
   * Fetch competitor information and SERP results for a keyword
   */
  async getCompetitorData(keyword: string): Promise<{ competitors: CompetitorData[], serps: SerpResult[] }> {
    try {
      toast.loading(`Analyse des concurrents pour "${keyword}"...`, {
        id: "competitor-analysis"
      });

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `Vous êtes un assistant SEO expert qui fournit des données sur les concurrents et les résultats de recherche pour un mot-clé donné.
              Analysez le mot-clé et fournissez un JSON contenant:
              1. "competitors": un tableau des 5 principaux concurrents avec leurs données:
                - name: nom du site
                - url: URL du site (format valide)
                - strength: force relative (0-100)
                - organic_traffic: estimation du trafic organique mensuel
                - keywords: nombre de mots-clés pour lesquels ils se positionnent
              
              2. "serps": un tableau des 10 premiers résultats de recherche avec:
                - title: titre de la page
                - url: URL complète
                - description: meta description ou extrait
                - position: position dans les résultats (1-10)
              
              IMPORTANT: Répondez UNIQUEMENT avec le JSON valide, sans texte avant ou après. Utilisez des données aussi réalistes que possible.`
            },
            {
              role: 'user',
              content: `Fournissez une analyse concurrentielle complète pour le mot-clé: "${keyword}"`
            }
          ],
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        const parsedData = JSON.parse(content);
        
        toast.success(`Analyse concurrentielle complétée pour "${keyword}"`, {
          id: "competitor-analysis"
        });
        
        return {
          competitors: validateCompetitorData(parsedData.competitors || []),
          serps: validateSerpResults(parsedData.serps || [])
        };
      } catch (error) {
        console.error('Erreur de parsing JSON:', error);
        console.error('Contenu reçu:', content);
        
        toast.warning("Format de réponse OpenAI incorrect", {
          id: "competitor-analysis",
          description: "Des données simulées sont utilisées à la place"
        });
        
        return generateFallbackData(keyword);
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse concurrentielle:', error);
      toast.error("Erreur lors de l'analyse", {
        id: "competitor-analysis",
        description: error instanceof Error ? error.message : "Erreur inconnue"
      });
      
      return generateFallbackData(keyword);
    }
  }

  /**
   * Factory method to create an OpenAICompetitorService instance
   */
  static createService(apiKey: string): OpenAICompetitorService {
    return new OpenAICompetitorService(apiKey);
  }
}
