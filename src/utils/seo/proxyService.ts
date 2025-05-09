
// Correction de l'erreur : Cannot find name 'response'. Did you mean 'Response'?

export class ProxyService {
  private static proxyList = [
    "https://corsproxy.io/?",
    "https://api.allorigins.win/raw?url=",
    "https://cors-anywhere.herokuapp.com/",
    "https://thingproxy.freeboard.io/fetch/",
    "https://crossorigin.me/"
  ];
  
  private static proxyEnabled = true;
  private static currentProxyIndex = 0;
  private static bestProxyIndex = 0;
  
  // Active le proxy
  static enableProxy(): boolean {
    this.proxyEnabled = true;
    console.log("Proxy Service: proxy enabled");
    return true;
  }
  
  // Désactive le proxy
  static disableProxy(): boolean {
    this.proxyEnabled = false;
    console.log("Proxy Service: proxy disabled");
    return false;
  }
  
  // Vérifie si le proxy est activé
  static isProxyEnabled(): boolean {
    return this.proxyEnabled;
  }
  
  // Récupère l'URL du proxy courant
  static getCurrentProxy(): string {
    return this.proxyList[this.currentProxyIndex];
  }
  
  // Récupère le meilleur proxy
  static getBestProxy(): string {
    return this.proxyList[this.bestProxyIndex];
  }
  
  // Réinitialise la rotation du proxy
  static resetProxyRotation(): void {
    this.currentProxyIndex = 0;
    console.log("Proxy rotation reset to first proxy");
  }
  
  // Passe au proxy suivant
  static rotateProxy(): string {
    this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxyList.length;
    console.log(`Rotating to proxy: ${this.proxyList[this.currentProxyIndex]}`);
    return this.proxyList[this.currentProxyIndex];
  }
  
  // Applique le proxy à une URL
  static applyProxy(url: string): string {
    if (!url) return '';
    
    // Ajouter https:// si nécessaire
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    if (!this.proxyEnabled) {
      return url;
    }
    
    return this.getBestProxy() + encodeURIComponent(url);
  }
  
  // Teste tous les proxys
  static async testAllProxies(): Promise<{ proxy: string; working: boolean; latency?: number }[]> {
    const results = [];
    const url = 'https://example.com';
    
    for (let i = 0; i < this.proxyList.length; i++) {
      const proxy = this.proxyList[i];
      const proxyUrl = proxy + encodeURIComponent(url);
      
      try {
        const startTime = Date.now();
        const result = await fetch(proxyUrl, { 
          method: 'HEAD',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        const endTime = Date.now();
        const latency = endTime - startTime;
        
        if (result.ok) {
          results.push({ proxy, working: true, latency });
        } else {
          results.push({ proxy, working: false });
        }
      } catch (error) {
        results.push({ proxy, working: false });
      }
    }
    
    // Trouver le meilleur proxy (celui qui fonctionne avec la latence la plus basse)
    const workingProxies = results.filter(r => r.working);
    if (workingProxies.length > 0) {
      const bestProxy = workingProxies.reduce((prev, current) => {
        return (prev.latency || Infinity) < (current.latency || Infinity) ? prev : current;
      });
      
      const bestIndex = this.proxyList.indexOf(bestProxy.proxy);
      if (bestIndex !== -1) {
        this.bestProxyIndex = bestIndex;
        console.log(`Set best proxy to: ${bestProxy.proxy} (index: ${bestIndex})`);
      }
    }
    
    return results;
  }
  
  // Teste un proxy spécifique
  static async testProxy(proxy: string): Promise<boolean> {
    const url = 'https://example.com';
    const proxyUrl = proxy + encodeURIComponent(url);
    
    try {
      const result = await fetch(proxyUrl, { 
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      return result.ok;
    } catch (error) {
      return false;
    }
  }
}
