
import FirecrawlApp from '@mendable/firecrawl-js';

interface ErrorResponse {
  success: false;
  error: string;
}

interface CrawlStatusResponse {
  success: true;
  status: string;
  completed: number;
  total: number;
  creditsUsed: number;
  expiresAt: string;
  data: any[];
}

type CrawlResponse = CrawlStatusResponse | ErrorResponse;

export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  private static firecrawlApp: FirecrawlApp | null = null;
  private static TIMEOUT = 30000; // 30 secondes de timeout

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    this.firecrawlApp = new FirecrawlApp({ apiKey });
    console.log('API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log('Testing API key with Firecrawl API');
      this.firecrawlApp = new FirecrawlApp({ apiKey });
      const testResponse = await Promise.race([
        this.firecrawlApp.crawlUrl('https://example.com', { limit: 1 }) as Promise<CrawlResponse>,
        new Promise<CrawlResponse>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout testing API key')), this.TIMEOUT)
        )
      ]);
      return testResponse.success;
    } catch (error) {
      console.error('Error testing API key:', error);
      return false;
    }
  }

  static async crawlWebsite(url: string): Promise<{ success: boolean; error?: string; data?: any }> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return { success: false, error: 'API key not found' };
    }

    try {
      console.log('Making crawl request to Firecrawl API');
      if (!this.firecrawlApp) {
        this.firecrawlApp = new FirecrawlApp({ apiKey });
      }

      const crawlResponse = await Promise.race([
        this.firecrawlApp.crawlUrl(url, {
          limit: 10, // Réduit à 10 pages au lieu de 100
          scrapeOptions: {
            formats: ['markdown', 'html'],
          }
        }) as Promise<CrawlResponse>,
        new Promise<CrawlResponse>((_, reject) => 
          setTimeout(() => reject(new Error('Le crawl a pris trop de temps, veuillez réessayer')), this.TIMEOUT)
        )
      ]);

      if (!crawlResponse.success) {
        const error = (crawlResponse as ErrorResponse).error;
        console.error('Crawl failed:', error);
        
        // Gestion spécifique de l'erreur 402
        if (error.includes('402') || error.toLowerCase().includes('insufficient credits')) {
          return { 
            success: false, 
            error: 'Crédits insuffisants. Veuillez mettre à jour votre plan sur firecrawl.dev/pricing ou réduire le nombre de pages à crawler.' 
          };
        }
        
        return { 
          success: false, 
          error: error || 'Échec du crawl du site' 
        };
      }

      console.log('Crawl successful:', crawlResponse);
      return { 
        success: true,
        data: crawlResponse 
      };
    } catch (error) {
      console.error('Error during crawl:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Échec de la connexion à l\'API Firecrawl' 
      };
    }
  }
}
