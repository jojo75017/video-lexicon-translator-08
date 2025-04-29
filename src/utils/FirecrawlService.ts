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
  private static proxyEnabled = true; // Par défaut, le proxy est ACTIVÉ
  private static proxyUrl = 'https://corsproxy.io/?';
  private static proxyUrls = [
    'https://corsproxy.io/?',
    'https://api.allorigins.win/raw?url=',
    'https://cors-anywhere.herokuapp.com/',
    'https://cors.bridged.cc/'
  ];

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    this.firecrawlApp = new FirecrawlApp({ apiKey });
    console.log('API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static enableProxy(): void {
    this.proxyEnabled = true;
    localStorage.setItem('firecrawl_proxy_enabled', 'true');
    console.log('CORS proxy enabled');
  }

  static disableProxy(): void {
    this.proxyEnabled = false;
    localStorage.setItem('firecrawl_proxy_enabled', 'false');
    console.log('CORS proxy disabled');
  }

  static isProxyEnabled(): boolean {
    const savedSetting = localStorage.getItem('firecrawl_proxy_enabled');
    if (savedSetting !== null) {
      return savedSetting === 'true';
    }
    return this.proxyEnabled; // Utiliser la valeur par défaut si rien n'est enregistré
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

  static async crawlWebsite(url: string, useProxy = this.isProxyEnabled()): Promise<{ success: boolean; error?: string; data?: any }> {
    console.log(`Crawling website: ${url}, useProxy: ${useProxy}`);
    
    // S'assurer que l'URL a un protocole
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Vérifier le statut du proxy
    const isProxyEnabled = this.isProxyEnabled();
    console.log(`État actuel du proxy: ${isProxyEnabled ? 'activé' : 'désactivé'}, useProxy paramètre: ${useProxy}`);
    
    // Forcer l'activation du proxy si nécessaire
    if (useProxy && !isProxyEnabled) {
      console.log("Activation forcée du proxy avant l'analyse");
      this.enableProxy();
    }
    
    // Méthode de fetch avec proxy
    if (useProxy) {
      try {
        console.log('Using direct fetch with proxy method for URL:', url);
        return await this.fetchWithProxy(url);
      } catch (proxyError) {
        console.error('Error with proxy fetch method:', proxyError);
        
        // Fallback to API key method if available
        const apiKey = this.getApiKey();
        if (apiKey) {
          console.log('Falling back to Firecrawl API method after proxy failure');
          try {
            return await this.fetchWithApiKey(url, apiKey);
          } catch (apiError) {
            console.error('Error with API key method (fallback):', apiError);
            throw apiError;
          }
        } else {
          throw proxyError;
        }
      }
    } else {
      // Méthode API key directe
      const apiKey = this.getApiKey();
      if (apiKey) {
        try {
          console.log('Using Firecrawl API with API key');
          return await this.fetchWithApiKey(url, apiKey);
        } catch (error) {
          console.error('Error with API key method:', error);
          
          // Si l'API échoue, essayons le proxy comme dernier recours
          console.log('Falling back to proxy method after API key failure');
          return await this.fetchWithProxy(url);
        }
      } else {
        // No API key, use proxy method
        console.log('No API key found, using proxy method by default');
        return await this.fetchWithProxy(url);
      }
    }
  }

  private static async fetchWithApiKey(url: string, apiKey: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      if (!this.firecrawlApp) {
        this.firecrawlApp = new FirecrawlApp({ apiKey });
      }

      const crawlResponse = await this.firecrawlApp.crawlUrl(url, {
        limit: 100,
        scrapeOptions: {
          formats: ['markdown', 'html'],
        }
      }) as CrawlResponse;

      if (!crawlResponse.success) {
        console.error('Crawl failed with API key:', (crawlResponse as ErrorResponse).error);
        return { 
          success: false, 
          error: (crawlResponse as ErrorResponse).error || 'Failed to crawl website with API key' 
        };
      }

      console.log('Crawl successful with API key:', crawlResponse);
      
      // Traiter les données pour assurer une structure cohérente
      let processedData;
      if (Array.isArray(crawlResponse.data) && crawlResponse.data.length > 0) {
        processedData = crawlResponse.data[0];
      } else {
        processedData = {
          url: url,
          sourceCode: "<html><body><p>No detailed content available from API</p></body></html>",
          title: "Website Analysis",
          meta: []
        };
      }
      
      return { success: true, data: processedData };
    } catch (error) {
      console.error('Error during crawl with API key:', error);
      throw error;
    }
  }

  private static async fetchWithProxy(url: string): Promise<{ success: boolean; error?: string; data?: any }> {
    console.log('Fetching with proxy method', { url });
    
    let sourceCode = null;
    let lastError = null;
    
    // Essayer chaque proxy jusqu'à ce qu'un fonctionne
    for (const proxy of this.proxyUrls) {
      try {
        const proxyUrl = proxy + encodeURIComponent(url);
        console.log(`Trying proxy: ${proxyUrl}`);
        
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest'
          },
          cache: 'no-cache',
          mode: 'cors',
          credentials: 'omit'
        });
        
        if (response.ok) {
          console.log(`Proxy ${proxy} worked! Status: ${response.status}`);
          sourceCode = await response.text();
          console.log(`Received ${sourceCode.length} chars of HTML`);
          break;
        } else {
          console.warn(`Proxy ${proxy} returned status: ${response.status}`);
          lastError = `HTTP status: ${response.status} from proxy ${proxy}`;
        }
      } catch (err) {
        console.warn(`Error with proxy ${proxy}:`, err);
        lastError = err instanceof Error ? err.message : String(err);
        continue;
      }
    }
    
    if (!sourceCode) {
      console.warn('All proxies failed:', lastError);
      
      // Retourner une erreur claire indiquant que tous les proxies ont échoué
      return {
        success: false,
        error: `Impossible de se connecter au site. Tous les proxies ont échoué. Dernière erreur: ${lastError}`
      };
    }
    
    try {
      // Extraire les métadonnées de base du HTML
      console.log('Parsing HTML content...');
      const parser = new DOMParser();
      const doc = parser.parseFromString(sourceCode, 'text/html');
      
      const title = doc.querySelector('title')?.textContent || url;
      console.log('Extracted title:', title);
      
      // Traiter les titres avec un formatage de niveau approprié
      const headingElements = [...doc.querySelectorAll('h1, h2, h3, h4, h5, h6')];
      console.log(`Found ${headingElements.length} heading elements`);
      const headings = headingElements.map((el, index) => {
        // Obtenir le niveau de titre à partir du nom de balise (h1, h2, etc.)
        const levelFromTag = parseInt(el.tagName.charAt(1));
        return { 
          level: levelFromTag, 
          text: el.textContent?.trim() || '', 
          position: index
        };
      });
      
      // Extraire les balises meta
      const meta = Array.from(doc.querySelectorAll('meta')).map(el => ({
        name: el.getAttribute('name'),
        property: el.getAttribute('property'),
        content: el.getAttribute('content')
      }));
      
      // Extraire les images
      const images = Array.from(doc.querySelectorAll('img')).map(el => ({
        src: el.getAttribute('src'),
        alt: el.getAttribute('alt') || '',
        width: el.getAttribute('width') || '',
        height: el.getAttribute('height') || ''
      }));
      
      // Extraire les paragraphes
      const paragraphs = Array.from(doc.querySelectorAll('p')).map((el, index) => ({
        text: el.textContent?.trim() || '',
        position: index
      }));
      
      // Extraire les liens
      const links = Array.from(doc.querySelectorAll('a')).map(el => ({
        href: el.getAttribute('href') || '#',
        text: el.textContent?.trim() || '',
        isExternal: !(el.getAttribute('href')?.startsWith('http') || false)
      }));
      
      const result = {
        url,
        title,
        headings,
        meta,
        images,
        paragraphs,
        links,
        sourceCode,
        textContent: doc.body?.textContent || ''
      };
      
      console.log('Analysis complete, returning data');
      
      return {
        success: true,
        data: result
      };
    } catch (parseError) {
      console.error('Error parsing HTML:', parseError);
      return {
        success: false,
        error: `Erreur d'analyse du HTML: ${parseError instanceof Error ? parseError.message : 'Erreur inconnue'}`
      };
    }
  }

  // Méthode utilitaire pour tester la connectivité avec chaque proxy
  static async testProxyConnectivity(): Promise<{ proxy: string; working: boolean; latency: number }[]> {
    const testUrl = 'https://example.com';
    const results = [];
    
    for (const proxy of this.proxyUrls) {
      try {
        const proxyUrl = proxy + encodeURIComponent(testUrl);
        const startTime = Date.now();
        
        const response = await fetch(proxyUrl, { 
          method: 'HEAD',
          mode: 'cors',
          credentials: 'omit'
        });
        
        const endTime = Date.now();
        const latency = endTime - startTime;
        
        results.push({
          proxy,
          working: response.ok,
          latency
        });
      } catch (error) {
        results.push({
          proxy,
          working: false,
          latency: -1
        });
      }
    }
    
    // Trier par les proxies qui fonctionnent et par latence
    return results.sort((a, b) => {
      if (a.working === b.working) {
        // Si les deux fonctionnent ou ne fonctionnent pas, trier par latence
        if (!a.working) return 0; // Pour les non-fonctionnels, l'ordre n'importe pas
        return a.latency - b.latency;
      }
      // Mettre les proxy fonctionnels en premier
      return a.working ? -1 : 1;
    });
  }
}
