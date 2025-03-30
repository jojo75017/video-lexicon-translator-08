
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
  private static proxyUrl = 'https://api.allorigins.win/raw?url=';

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

    // If we have a Firecrawl API key, use it
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
        return { 
          success: true,
          data: crawlResponse 
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
      console.log('Fetching with proxy:', this.proxyUrl + encodeURIComponent(url));
      
      // Try multiple CORS proxies in order
      const proxies = [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?',
        'https://cors-anywhere.herokuapp.com/'
      ];
      
      let response = null;
      let sourceCode = null;
      let error = null;
      
      // Try each proxy until one works
      for (const proxy of proxies) {
        try {
          console.log(`Trying proxy: ${proxy}`);
          response = await fetch(proxy + encodeURIComponent(url));
          
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
        throw new Error('Failed to fetch page content through any proxy');
      }
      
      // Extract basic metadata from HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(sourceCode, 'text/html');
      
      const title = doc.querySelector('title')?.textContent || '';
      const h1s = Array.from(doc.querySelectorAll('h1')).map(el => ({ 
        level: 1, 
        text: el.textContent?.trim() || '', 
        position: 0
      }));
      const h2s = Array.from(doc.querySelectorAll('h2')).map(el => ({ 
        level: 2, 
        text: el.textContent?.trim() || '', 
        position: 0
      }));
      const h3s = Array.from(doc.querySelectorAll('h3')).map(el => ({ 
        level: 3, 
        text: el.textContent?.trim() || '', 
        position: 0
      }));
      const headings = [...h1s, ...h2s, ...h3s].sort((a, b) => a.position - b.position);
      
      const meta = Array.from(doc.querySelectorAll('meta')).map(el => ({
        name: el.getAttribute('name'),
        property: el.getAttribute('property'),
        content: el.getAttribute('content')
      }));
      
      const result = {
        url,
        title,
        headings,
        meta,
        sourceCode,
        textContent: doc.body.textContent
      };
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error fetching with proxy:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch website content',
        data: null
      };
    }
  }
}
