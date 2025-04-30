
/**
 * Proxy Service - Handles CORS proxies for external site access
 */

import { toast } from "sonner";

export class ProxyService {
  private static proxyUrls = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://thingproxy.freeboard.io/fetch/',
    'https://crossorigin.me/',
    'https://cors-anywhere.herokuapp.com/'
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
    const savedSetting = localStorage.getItem('proxy_enabled');
    return savedSetting === 'false' ? false : this.proxyEnabled;
  }

  /**
   * Get the next proxy in the rotation
   */
  static getNextProxy(): string {
    const proxy = this.proxyUrls[this.currentProxyIndex];
    // Rotate to next proxy
    this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxyUrls.length;
    return proxy;
  }

  /**
   * Get URL with proxy prefix if enabled
   */
  static getProxiedUrl(url: string): string {
    if (!this.proxyEnabled) return url;
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
    if (!this.proxyEnabled) {
      console.log('Proxy disabled, fetching directly:', url);
      return fetch(url, options);
    }

    let lastError: Error | null = null;
    
    // Try each proxy in sequence
    for (let i = 0; i < this.proxyUrls.length; i++) {
      const proxy = this.proxyUrls[(this.currentProxyIndex + i) % this.proxyUrls.length];
      const proxyUrl = proxy + encodeURIComponent(url);
      
      try {
        console.log(`Attempting fetch with proxy (${i+1}/${this.proxyUrls.length}): ${proxy}`);
        
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
          signal: options.signal || AbortSignal.timeout(20000) // 20s timeout
        });
        
        if (response.ok) {
          console.log(`Proxy ${proxy} worked!`);
          
          // Update the current proxy index to the working proxy
          this.currentProxyIndex = (this.currentProxyIndex + i) % this.proxyUrls.length;
          
          return response;
        }
        
        console.log(`Proxy ${proxy} failed with status: ${response.status}`);
        lastError = new Error(`HTTP status: ${response.status}`);
      } catch (error) {
        console.error(`Error with proxy ${proxy}:`, error);
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }
    
    // All proxies failed
    toast.error("Tous les proxies ont échoué");
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
    
    for (const proxy of this.proxyUrls) {
      try {
        const proxyUrl = proxy + encodeURIComponent(testUrl);
        const startTime = Date.now();
        
        // Try fetching with a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        try {
          const response = await fetch(proxyUrl, {
            method: 'HEAD', 
            mode: 'cors',
            signal: controller.signal
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
    return results.sort((a, b) => {
      if (a.working !== b.working) {
        return a.working ? -1 : 1;
      }
      return a.latency - b.latency;
    });
  }
}

export default ProxyService;
