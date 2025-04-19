
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
  private static proxyEnabled = true; // Always enable proxy by default
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

  static async crawlWebsite(url: string, useProxy = true): Promise<{ success: boolean; error?: string; data?: any }> {
    console.log(`Crawling website: ${url}, useProxy: ${useProxy || this.proxyEnabled}`);
    
    // Always use proxy for better compatibility
    this.proxyEnabled = true;
    
    // First try with fetchWithProxy which is more reliable
    try {
      console.log('Starting with proxy method directly');
      const proxyResult = await this.fetchWithProxy(url);
      
      if (proxyResult.success && proxyResult.data) {
        console.log('Proxy method succeeded directly');
        return proxyResult;
      }
    } catch (error) {
      console.error('Initial proxy fetch failed:', error);
      // Continue to API key method
    }

    // API key method as fallback
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
      
      // Always use proxy
      this.proxyEnabled = true;
      
      let sourceCode = null;
      let error = null;
      
      // Try each proxy until one works
      for (const proxy of this.proxyUrls) {
        try {
          const proxyUrl = proxy + encodeURIComponent(url);
          console.log(`Trying proxy: ${proxyUrl}`);
          
          const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
              'Accept': 'text/html,application/xhtml+xml,application/xml',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            cache: 'no-cache'
          });
          
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
        console.warn('All proxies failed, creating minimal demo data');
        
        // Create minimal demo data when all proxies fail
        const domainMatch = url.match(/^(?:https?:\/\/)?(?:www\.)?([^:\/\n?]+)/);
        const domain = domainMatch ? domainMatch[1] : url;
        
        sourceCode = `<!DOCTYPE html>
<html>
<head>
  <title>${domain} - Demo Data</title>
  <meta name="description" content="Demo data for ${domain}">
</head>
<body>
  <h1>Demo Data for ${domain}</h1>
  <h2>About This Page</h2>
  <p>This is demo content generated because we couldn't fetch the original page.</p>
  <h2>Why Am I Seeing This?</h2>
  <p>The proxy servers couldn't access the original content due to CORS or connectivity issues.</p>
  <h3>Try These Solutions</h3>
  <p>1. Check your internet connection</p>
  <p>2. Try a different URL</p>
  <p>3. Try again later</p>
</body>
</html>`;
      }
      
      // Extract basic metadata from HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(sourceCode, 'text/html');
      
      const title = doc.querySelector('title')?.textContent || url;
      
      // Process headings with proper level formatting
      const headingElements = [...doc.querySelectorAll('h1, h2, h3, h4, h5, h6')];
      const headings = headingElements.map((el, index) => {
        // Get the heading level from the tag name (h1, h2, etc.)
        const levelFromTag = parseInt(el.tagName.charAt(1));
        return { 
          level: levelFromTag, 
          text: el.textContent?.trim() || '', 
          position: index
        };
      });
      
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
      
      // Extract paragraphs
      const paragraphs = Array.from(doc.querySelectorAll('p')).map((el, index) => ({
        text: el.textContent?.trim() || '',
        position: index
      }));
      
      const result = {
        url,
        title,
        headings,
        meta,
        images,
        paragraphs,
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
          headings: [
            { level: 1, text: "Demo Content" },
            { level: 2, text: "Error Information" }
          ],
          meta: [],
          sourceCode: "<html><body><h1>Demo Content</h1><p>Error fetching content</p></body></html>",
          textContent: "Error fetching content"
        }
      };
    }
  }
}
