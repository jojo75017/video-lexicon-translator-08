
import { toast } from 'sonner';
import { CompetitorData, SerpResult } from '@/types/seo/Keyword';

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
    try {
      toast.loading("Validation de la clé API OpenAI...", {
        id: "validate-openai-key"
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
              content: 'This is a simple test to verify API key validity.'
            },
            {
              role: 'user',
              content: 'Say "valid"'
            }
          ],
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        toast.error("Clé API OpenAI invalide", {
          id: "validate-openai-key",
          description: `Erreur ${response.status}: ${response.statusText}`
        });
        return false;
      }

      const data = await response.json();
      const isValid = data.choices[0]?.message?.content?.toLowerCase().includes('valid');
      
      if (isValid) {
        toast.success("Clé API OpenAI validée", {
          id: "validate-openai-key"
        });
      } else {
        toast.error("Réponse OpenAI inattendue", {
          id: "validate-openai-key"
        });
      }
      
      return isValid;
    } catch (error) {
      console.error('Erreur lors de la validation de la clé OpenAI:', error);
      toast.error("Erreur de validation de la clé API", {
        id: "validate-openai-key",
        description: error instanceof Error ? error.message : "Erreur inconnue"
      });
      return false;
    }
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
          competitors: this.validateCompetitors(parsedData.competitors || []),
          serps: this.validateSerps(parsedData.serps || [])
        };
      } catch (error) {
        console.error('Erreur de parsing JSON:', error);
        console.error('Contenu reçu:', content);
        
        toast.warning("Format de réponse OpenAI incorrect", {
          id: "competitor-analysis",
          description: "Des données simulées sont utilisées à la place"
        });
        
        return this.generateFallbackCompetitorData(keyword);
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse concurrentielle:', error);
      toast.error("Erreur lors de l'analyse", {
        id: "competitor-analysis",
        description: error instanceof Error ? error.message : "Erreur inconnue"
      });
      
      return this.generateFallbackCompetitorData(keyword);
    }
  }
  
  /**
   * Validate competitor data to ensure it meets our requirements
   */
  private validateCompetitors(competitors: any[]): CompetitorData[] {
    if (!competitors || competitors.length === 0) {
      return this.generateFallbackCompetitorData("").competitors;
    }
    
    return competitors.map(comp => ({
      name: comp.name || 'Concurrent',
      url: this.validateUrl(comp.url) ? comp.url : `https://example-${Math.floor(Math.random() * 1000)}.com`,
      strength: typeof comp.strength === 'number' ? comp.strength : Math.floor(Math.random() * 100),
      organic_traffic: typeof comp.organic_traffic === 'number' ? comp.organic_traffic : Math.floor(Math.random() * 50000 + 1000),
      keywords: typeof comp.keywords === 'number' ? comp.keywords : Math.floor(Math.random() * 5000 + 500)
    })).slice(0, 5);
  }
  
  /**
   * Validate SERP results to ensure they meet our requirements
   */
  private validateSerps(serps: any[]): SerpResult[] {
    if (!serps || serps.length === 0) {
      return this.generateFallbackCompetitorData("").serps;
    }
    
    return serps.map((serp, index) => ({
      title: serp.title || 'Résultat de recherche',
      url: this.validateUrl(serp.url) ? serp.url : `https://example-${Math.floor(Math.random() * 1000)}.com/page-${index}`,
      description: serp.description || 'Description non disponible pour ce résultat de recherche.',
      position: typeof serp.position === 'number' ? serp.position : index + 1
    })).slice(0, 10);
  }
  
  /**
   * Validate URL format
   */
  private validateUrl(url: string): boolean {
    try {
      if (!url) return false;
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch (e) {
      return false;
    }
  }
  
  /**
   * Generate fallback competitor data when the API fails
   */
  private generateFallbackCompetitorData(keyword: string): { competitors: CompetitorData[], serps: SerpResult[] } {
    const keywordBase = keyword.split(' ')[0] || 'exemple';
    
    const competitors: CompetitorData[] = [
      {
        name: `Guide${keywordBase.charAt(0).toUpperCase() + keywordBase.slice(1)}.fr`,
        url: `https://www.guide${keywordBase.toLowerCase()}.fr`,
        strength: Math.floor(Math.random() * 40 + 60),
        organic_traffic: Math.floor(Math.random() * 50000 + 10000),
        keywords: Math.floor(Math.random() * 5000 + 1000)
      },
      {
        name: `${keywordBase.charAt(0).toUpperCase() + keywordBase.slice(1)}Expert.com`,
        url: `https://www.${keywordBase.toLowerCase()}expert.com`,
        strength: Math.floor(Math.random() * 30 + 50),
        organic_traffic: Math.floor(Math.random() * 40000 + 8000),
        keywords: Math.floor(Math.random() * 4000 + 800)
      },
      {
        name: `Meilleur${keywordBase.charAt(0).toUpperCase() + keywordBase.slice(1)}.fr`,
        url: `https://www.meilleur${keywordBase.toLowerCase()}.fr`,
        strength: Math.floor(Math.random() * 30 + 40),
        organic_traffic: Math.floor(Math.random() * 30000 + 5000),
        keywords: Math.floor(Math.random() * 3000 + 600)
      },
      {
        name: `${keywordBase.charAt(0).toUpperCase() + keywordBase.slice(1)}Pro.com`,
        url: `https://www.${keywordBase.toLowerCase()}pro.com`,
        strength: Math.floor(Math.random() * 20 + 40),
        organic_traffic: Math.floor(Math.random() * 25000 + 3000),
        keywords: Math.floor(Math.random() * 2500 + 500)
      },
      {
        name: `Top${keywordBase.charAt(0).toUpperCase() + keywordBase.slice(1)}.com`,
        url: `https://www.top${keywordBase.toLowerCase()}.com`,
        strength: Math.floor(Math.random() * 20 + 30),
        organic_traffic: Math.floor(Math.random() * 20000 + 2000),
        keywords: Math.floor(Math.random() * 2000 + 400)
      }
    ];

    const serps: SerpResult[] = [
      {
        title: `${keyword} - Guide complet et conseils`,
        url: `https://www.guide${keywordBase.toLowerCase()}.fr/${keyword.replace(/\s+/g, '-').toLowerCase()}`,
        description: `Découvrez tout ce que vous devez savoir sur ${keyword}. Guide complet, conseils d'experts et astuces pour réussir.`,
        position: 1
      },
      {
        title: `Les meilleurs ${keyword} en ${new Date().getFullYear()} - Comparatif complet`,
        url: `https://www.meilleur${keywordBase.toLowerCase()}.fr/comparatif-${keyword.replace(/\s+/g, '-').toLowerCase()}`,
        description: `Comparatif des meilleurs ${keyword} de l'année. Avis, tests et conseils pour faire le bon choix.`,
        position: 2
      },
      {
        title: `${keyword}: tout ce qu'il faut savoir - ${keywordBase}Expert`,
        url: `https://www.${keywordBase.toLowerCase()}expert.com/guide/${keyword.replace(/\s+/g, '-').toLowerCase()}`,
        description: `Guide complet sur ${keyword}. Découvrez nos conseils d'experts pour optimiser votre expérience.`,
        position: 3
      },
      {
        title: `${keyword} pas cher - Les meilleures offres`,
        url: `https://www.bons-plans-${keywordBase.toLowerCase()}.com/${keyword.replace(/\s+/g, '-').toLowerCase()}-pas-cher`,
        description: `Économisez sur votre ${keyword} avec nos conseils et bons plans. Offres mises à jour quotidiennement.`,
        position: 4
      },
      {
        title: `Avis sur les ${keyword} - Test complet`,
        url: `https://www.avis-${keywordBase.toLowerCase()}.fr/test-${keyword.replace(/\s+/g, '-').toLowerCase()}`,
        description: `Avis détaillés et tests des ${keyword}. Découvrez les avantages, inconvénients et retours d'expérience.`,
        position: 5
      },
      {
        title: `Comment choisir son ${keyword} ? Guide d'achat`,
        url: `https://www.conseils-${keywordBase.toLowerCase()}.com/guide-achat-${keyword.replace(/\s+/g, '-').toLowerCase()}`,
        description: `Guide d'achat pour bien choisir votre ${keyword}. Critères de sélection, comparatifs et conseils personnalisés.`,
        position: 6
      },
      {
        title: `${keyword} - Wikipédia`,
        url: `https://fr.wikipedia.org/wiki/${keyword.replace(/\s+/g, '_')}`,
        description: `${keyword} désigne... Découvrez l'histoire, les caractéristiques et l'évolution du concept de ${keyword} dans cet article.`,
        position: 7
      },
      {
        title: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} | Amazon.fr`,
        url: `https://www.amazon.fr/s?k=${keyword.replace(/\s+/g, '+')}`,
        description: `Achetez ${keyword} sur Amazon.fr. Livraison rapide et prix bas garantis. Grand choix parmi des milliers de produits.`,
        position: 8
      },
      {
        title: `Les tendances ${keyword} en ${new Date().getFullYear()}`,
        url: `https://www.tendances-${keywordBase.toLowerCase()}.fr/${new Date().getFullYear()}/${keyword.replace(/\s+/g, '-').toLowerCase()}`,
        description: `Découvrez les dernières tendances ${keyword} pour cette année. Innovations, nouveautés et évolutions à connaître.`,
        position: 9
      },
      {
        title: `Formation ${keyword} - Apprenez avec des experts`,
        url: `https://www.formation-${keywordBase.toLowerCase()}.com/cours-${keyword.replace(/\s+/g, '-').toLowerCase()}`,
        description: `Formez-vous au ${keyword} avec nos cours en ligne. Formation certifiante dispensée par des experts du domaine.`,
        position: 10
      }
    ];
    
    return { competitors, serps };
  }

  /**
   * Factory method to create an OpenAICompetitorService instance
   */
  static createService(apiKey: string): OpenAICompetitorService {
    return new OpenAICompetitorService(apiKey);
  }
}
