
import FirecrawlApp from '@mendable/firecrawl-js';
import axios from 'axios';

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
  private static PROXY_ENABLED_KEY = 'cors_proxy_enabled';
  private static firecrawlApp: any = null;
  private static proxyEnabled = false;
  
  // Liste des proxies CORS disponibles
  private static corsProxies = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://cors-anywhere.herokuapp.com/',
    'https://cors.eu.org/',
  ];
  
  // Index du proxy CORS actuel
  private static currentProxyIndex = 0;

  static enableProxy(): void {
    this.proxyEnabled = true;
    localStorage.setItem(this.PROXY_ENABLED_KEY, 'true');
    console.log('CORS proxy enabled');
  }

  static isProxyEnabled(): boolean {
    return this.proxyEnabled || localStorage.getItem(this.PROXY_ENABLED_KEY) === 'true';
  }

  static getCurrentProxy(): string {
    return this.corsProxies[this.currentProxyIndex];
  }

  static rotateProxy(): string {
    this.currentProxyIndex = (this.currentProxyIndex + 1) % this.corsProxies.length;
    return this.getCurrentProxy();
  }

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    try {
      this.firecrawlApp = new FirecrawlApp({ apiKey });
      console.log('API key saved successfully');
    } catch (error) {
      console.error('Error initializing FirecrawlApp:', error);
    }
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log('Testing API key with Firecrawl API');
      this.firecrawlApp = new FirecrawlApp({ apiKey });
      // A simple test crawl to verify the API key
      const testResponse = await this.firecrawlApp.crawlUrl('https://example.com', {
        limit: 1
      });
      return testResponse.success;
    } catch (error) {
      console.error('Error testing API key:', error);
      return false;
    }
  }

  static async crawlWebsite(url: string): Promise<{ success: boolean; error?: string; data?: any }> {
    console.log('Crawling website:', url);
    
    // Essayons d'abord d'utiliser l'API Firecrawl
    if (this.getApiKey() && this.firecrawlApp) {
      try {
        console.log('Using Firecrawl API...');
        const crawlResponse = await this.firecrawlApp.crawlUrl(url, {
          limit: 100,
          scrapeOptions: {
            formats: ['markdown', 'html'],
          }
        }) as CrawlResponse;

        if (!crawlResponse.success) {
          console.error('Firecrawl API crawl failed:', crawlResponse);
          // Essayons de passer au CORS proxy si l'API a échoué
        } else {
          console.log('Firecrawl API crawl successful');
          return { 
            success: true,
            data: crawlResponse.data 
          };
        }
      } catch (error) {
        console.error('Error using Firecrawl API:', error);
        // Continuons avec le CORS proxy en cas d'échec
      }
    }
    
    // Si nous n'avons pas de clé API ou si l'appel à l'API a échoué, utilisons le CORS proxy
    console.log('Using CORS proxy...');
    
    try {
      let proxyUrl = '';
      let htmlContent = '';
      let success = false;
      let proxyAttempts = 0;
      const maxProxyAttempts = this.corsProxies.length;
      
      while (!success && proxyAttempts < maxProxyAttempts) {
        proxyUrl = this.getCurrentProxy();
        console.log(`Trying CORS proxy (${proxyAttempts + 1}/${maxProxyAttempts}):`, proxyUrl);
        
        try {
          const response = await axios.get(proxyUrl + encodeURIComponent(url), {
            headers: { 
              'X-Requested-With': 'XMLHttpRequest',
              'Accept': 'text/html'
            },
            timeout: 10000
          });
          
          if (response.status === 200 && response.data) {
            htmlContent = response.data;
            success = true;
            console.log('CORS proxy request successful');
            break;
          } else {
            console.warn('CORS proxy returned empty or invalid response:', response.status);
          }
        } catch (error) {
          console.error(`Error with CORS proxy ${proxyUrl}:`, error);
          this.rotateProxy();  // Essayons le prochain proxy
        }
        
        proxyAttempts++;
      }
      
      if (!success) {
        console.error('All CORS proxies failed');
        return { 
          success: false, 
          error: 'Tous les proxies CORS ont échoué. Veuillez réessayer plus tard.' 
        };
      }
      
      // Créer un objet DOM à partir du HTML récupéré
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      
      // Extraire les informations du DOM
      const title = doc.title;
      const meta = Array.from(doc.querySelectorAll('meta')).map(metaEl => {
        return {
          name: metaEl.getAttribute('name') || metaEl.getAttribute('property') || '',
          content: metaEl.getAttribute('content') || ''
        };
      });
      
      const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(el => {
        return {
          level: el.tagName.toLowerCase(),
          text: el.textContent?.trim() || ''
        };
      });
      
      const links = Array.from(doc.querySelectorAll('a')).map(link => {
        return {
          href: link.href || link.getAttribute('href') || '',
          text: link.textContent?.trim() || '',
          rel: link.getAttribute('rel') || ''
        };
      });
      
      const images = Array.from(doc.querySelectorAll('img')).map(img => {
        return {
          src: img.src || img.getAttribute('src') || '',
          alt: img.alt || img.getAttribute('alt') || '',
          width: img.width || 0,
          height: img.height || 0
        };
      });
      
      // Créer un objet de résultat
      const crawlResult = [{
        url,
        title,
        meta,
        headings,
        links,
        images,
        sourceCode: htmlContent
      }];
      
      console.log('CORS proxy extraction successful');
      console.log('Extracted data:', {
        title,
        metaCount: meta.length,
        headingsCount: headings.length,
        linksCount: links.length,
        imagesCount: images.length
      });
      
      return {
        success: true,
        data: crawlResult
      };
      
    } catch (error) {
      console.error('Error during CORS proxy extraction:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Échec de récupération des données via proxy CORS' 
      };
    }
  }
}

// Initialize proxy status from localStorage
FirecrawlService.isProxyEnabled();
