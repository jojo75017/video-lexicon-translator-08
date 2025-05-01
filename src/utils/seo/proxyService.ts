
/**
 * Proxy Service - Handles CORS proxies for external site access
 */

import { toast } from "sonner";

export class ProxyService {
  private static proxyUrls = [
    'https://corsproxy.io/?',
    'https://api.allorigins.win/raw?url=',
    'https://cors-anywhere.herokuapp.com/',
    'https://thingproxy.freeboard.io/fetch/',
    'https://crossorigin.me/'
  ];
  private static currentProxyIndex = 0;
  private static proxyEnabled = true;

  /**
   * Enable the proxy for all future requests
   */
  static enableProxy(): void {
    this.proxyEnabled = true;
    localStorage.setItem('proxy_enabled', 'true');
    console.log('Proxy Service: proxy enabled');
    // Force reset proxy index to the first one
    this.currentProxyIndex = 0;
  }

  /**
   * Disable the proxy for future requests
   */
  static disableProxy(): void {
    this.proxyEnabled = false;
    localStorage.setItem('proxy_enabled', 'false');
    console.log('Proxy Service: proxy disabled');
  }

  /**
   * Check if the proxy is enabled
   */
  static isProxyEnabled(): boolean {
    // Always return true to ensure proxy is active
    return true;
  }

  /**
   * Get the next proxy in the rotation
   */
  static getNextProxy(): string {
    const proxy = this.proxyUrls[this.currentProxyIndex];
    // Rotate to next proxy
    this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxyUrls.length;
    console.log(`Using proxy: ${proxy}`);
    return proxy;
  }

  /**
   * Reset to first proxy
   */
  static resetProxyRotation(): void {
    this.currentProxyIndex = 0;
    console.log('Proxy rotation reset to first proxy');
  }

  /**
   * Get URL with proxy prefix if enabled
   */
  static getProxiedUrl(url: string): string {
    // Always apply proxy regardless of setting
    return this.getNextProxy() + encodeURIComponent(url);
  }

  /**
   * Add a custom proxy to the list
   */
  static addCustomProxy(proxyUrl: string): void {
    if (!proxyUrl.endsWith('/')) {
      proxyUrl += '/';
    }
    
    // Check if it's already in the list
    if (!this.proxyUrls.includes(proxyUrl)) {
      this.proxyUrls.push(proxyUrl);
      console.log(`Added custom proxy: ${proxyUrl}`);
    }
  }

  /**
   * Fetch content from URL using all available proxies in sequence
   */
  static async fetchWithProxies(url: string, options: RequestInit = {}): Promise<Response> {
    console.log(`Fetching ${url} with proxies enabled`);
    
    let lastError: Error | null = null;
    
    // Notify user that we're trying proxies
    toast.info("Tentative avec proxies CORS...", {
      description: `Connexion à ${url}`,
      duration: 3000
    });
    
    // Always try direct fetch first
    try {
      console.log("Attempting direct fetch first...");
      const directResponse = await fetch(url, {
        ...options,
        mode: 'cors',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: {
          ...options.headers,
          'Accept': 'text/html,application/xhtml+xml,application/xml',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        signal: options.signal || AbortSignal.timeout(8000) // 8s timeout
      });
      
      if (response.ok) {
        console.log("Direct fetch worked!");
        return directResponse;
      }
    } catch (error) {
      console.log("Direct fetch failed, trying proxies...");
    }
    
    // Try each proxy in sequence
    for (let i = 0; i < this.proxyUrls.length; i++) {
      const proxy = this.proxyUrls[(this.currentProxyIndex + i) % this.proxyUrls.length];
      const proxyUrl = proxy + encodeURIComponent(url);
      
      try {
        console.log(`Attempting fetch with proxy (${i+1}/${this.proxyUrls.length}): ${proxy}`);
        toast.loading(`Test proxy ${i+1}/${this.proxyUrls.length}...`, {
          id: `proxy-test-${i}`,
          duration: 2000
        });
        
        // Merge headers with defaults
        const headers = {
          'Accept': 'text/html,application/xhtml+xml,application/xml',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          ...options.headers
        };
        
        const response = await fetch(proxyUrl, {
          ...options,
          headers,
          cache: 'no-store',
          mode: 'cors',
          credentials: 'omit',
          signal: options.signal || AbortSignal.timeout(15000) // 15s timeout
        });
        
        if (response.ok) {
          console.log(`Proxy ${proxy} worked!`);
          toast.success(`Proxy fonctionnel trouvé`, {
            id: `proxy-test-${i}`,
          });
          
          // Update the current proxy index to the working proxy
          this.currentProxyIndex = (this.currentProxyIndex + i) % this.proxyUrls.length;
          
          return response;
        }
        
        console.log(`Proxy ${proxy} failed with status: ${response.status}`);
        toast.error(`Proxy ${i+1} échoué: ${response.status}`, {
          id: `proxy-test-${i}`,
          duration: 1000
        });
        lastError = new Error(`HTTP status: ${response.status}`);
      } catch (error) {
        console.error(`Error with proxy ${proxy}:`, error);
        toast.error(`Proxy ${i+1} erreur: ${error instanceof Error ? error.message : 'Inconnu'}`, {
          id: `proxy-test-${i}`,
          duration: 1000
        });
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }
    
    // All proxies failed
    toast.error("Tous les proxies ont échoué", {
      description: "Essayez un autre site ou vérifiez votre connexion internet"
    });
    throw lastError || new Error('All proxies failed');
  }

  /**
   * Test all proxies and return results
   */
  static async testAllProxies(testUrl = 'https://example.com'): Promise<{
    proxy: string;
    working: boolean;
    latency: number;
  }[]> {
    const results = [];
    
    toast.info("Test de tous les proxies en cours...");
    
    for (const proxy of this.proxyUrls) {
      try {
        const proxyUrl = proxy + encodeURIComponent(testUrl);
        const startTime = Date.now();
        
        // Try fetching with a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        try {
          const response = await fetch(proxyUrl, {
            method: 'HEAD', 
            mode: 'cors',
            signal: controller.signal,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });
          
          clearTimeout(timeoutId);
          const endTime = Date.now();
          
          results.push({
            proxy,
            working: response.ok,
            latency: endTime - startTime
          });
        } catch (err) {
          clearTimeout(timeoutId);
          results.push({
            proxy,
            working: false,
            latency: -1
          });
        }
      } catch (err) {
        results.push({
          proxy,
          working: false,
          latency: -1
        });
      }
    }
    
    // Sort by working status first, then by latency
    const sortedResults = results.sort((a, b) => {
      if (a.working !== b.working) {
        return a.working ? -1 : 1;
      }
      return a.latency - b.latency;
    });
    
    // If any proxy is working, update the index to the best one
    const workingProxy = sortedResults.find(r => r.working);
    if (workingProxy) {
      this.currentProxyIndex = this.proxyUrls.indexOf(workingProxy.proxy);
      console.log(`Set best proxy to: ${workingProxy.proxy} (index: ${this.currentProxyIndex})`);
    }
    
    return sortedResults;
  }
}

export default ProxyService;
