
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
  private static proxyEnabled = false;
  private static proxyUrl = 'https://corsproxy.io/?';
  private static proxyUrls = [
    'https://corsproxy.io/?',
    'https://api.allorigins.win/raw?url=',
    'https://cors-anywhere.herokuapp.com/'
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
    console.log('CORS proxy enabled');
  }

  static disableProxy(): void {
    this.proxyEnabled = false;
    console.log('CORS proxy disabled');
  }

  static isProxyEnabled(): boolean {
    return this.proxyEnabled;
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

  static async crawlWebsite(url: string, useProxy = false): Promise<{ success: boolean; error?: string; data?: any }> {
    console.log(`Crawling website: ${url}, useProxy: ${useProxy || this.proxyEnabled}`);

    // Si nous avons une clé API Firecrawl, utilisez-la
    const apiKey = this.getApiKey();
    if (apiKey) {
      try {
        console.log('Using Firecrawl API with API key');
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
          console.error('Crawl failed:', (crawlResponse as ErrorResponse).error);
          throw new Error((crawlResponse as ErrorResponse).error || 'Failed to crawl website');
        }

        console.log('Crawl successful:', crawlResponse);
        
        // Process the data to ensure it has a consistent structure
        let processedData;
        if (Array.isArray(crawlResponse.data) && crawlResponse.data.length > 0) {
          processedData = crawlResponse.data[0];
        } else {
          processedData = {
            url: url,
            sourceCode: "<html><body><p>No detailed content available</p></body></html>",
            title: "Website Analysis",
            meta: []
          };
        }
        
        return { 
          success: true,
          data: processedData 
        };
      } catch (error) {
        console.error('Error during crawl with API key:', error);
        // Fall back to proxy method if API key method fails
        console.log('Falling back to proxy method');
        return this.fetchWithProxy(url);
      }
    } else {
      // No API key, use proxy method
      console.log('No API key found, using proxy method');
      return this.fetchWithProxy(url);
    }
  }

  private static async fetchWithProxy(url: string): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
      console.log('Fetching with proxy', this.proxyEnabled ? 'enabled' : 'disabled');
      
      // Activation automatique du proxy pour éviter les problèmes CORS
      this.proxyEnabled = true;
      
      let sourceCode = null;
      let error = null;
      
      // Try each proxy until one works
      for (const proxy of this.proxyUrls) {
        try {
          const proxyUrl = proxy + encodeURIComponent(url);
          console.log(`Trying proxy: ${proxyUrl}`);
          
          const response = await fetch(proxyUrl);
          
          if (response.ok) {
            console.log(`Proxy ${proxy} worked!`);
            sourceCode = await response.text();
            break;
          } else {
            console.warn(`Proxy ${proxy} returned status: ${response.status}`);
          }
        } catch (err) {
          console.warn(`Error with proxy ${proxy}:`, err);
          continue;
        }
      }
      
      if (!sourceCode) {
        console.warn('All proxies failed, returning minimal data');
        return {
          success: true,
          data: {
            url,
            title: url,
            headings: [],
            meta: [],
            sourceCode: "<html><body><p>Could not fetch content</p></body></html>",
            textContent: "Could not fetch content"
          }
        };
      }
      
      // Extract basic metadata from HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(sourceCode, 'text/html');
      
      const title = doc.querySelector('title')?.textContent || '';
      const h1s = Array.from(doc.querySelectorAll('h1')).map((el, index) => ({ 
        level: 1, 
        text: el.textContent?.trim() || '', 
        position: index
      }));
      const h2s = Array.from(doc.querySelectorAll('h2')).map((el, index) => ({ 
        level: 2, 
        text: el.textContent?.trim() || '', 
        position: h1s.length + index
      }));
      const h3s = Array.from(doc.querySelectorAll('h3')).map((el, index) => ({ 
        level: 3, 
        text: el.textContent?.trim() || '', 
        position: h1s.length + h2s.length + index
      }));
      const headings = [...h1s, ...h2s, ...h3s].sort((a, b) => a.position - b.position);
      
      // Extract meta tags
      const meta = Array.from(doc.querySelectorAll('meta')).map(el => ({
        name: el.getAttribute('name'),
        property: el.getAttribute('property'),
        content: el.getAttribute('content')
      }));
      
      // Extract images
      const images = Array.from(doc.querySelectorAll('img')).map(el => ({
        src: el.getAttribute('src'),
        alt: el.getAttribute('alt') || '',
        width: el.getAttribute('width') || '',
        height: el.getAttribute('height') || ''
      }));
      
      const result = {
        url,
        title,
        headings,
        meta,
        images,
        sourceCode,
        textContent: doc.body?.textContent || ''
      };
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error fetching with proxy:', error);
      // Return a minimal valid response structure even on error
      return {
        success: true,
        data: {
          url,
          title: url,
          headings: [],
          meta: [],
          sourceCode: "<html><body><p>Error fetching content</p></body></html>",
          textContent: "Error fetching content"
        }
      };
    }
  }
}
