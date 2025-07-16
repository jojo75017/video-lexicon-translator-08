import { toast } from 'sonner';
import { SerpResult } from '@/types/seo/Keyword';

export interface SerpApiConfig {
  googleApiKey?: string;
  googleCseId?: string;
  bingApiKey?: string;
  serpApiKey?: string;
}

export interface SerpSearchResult {
  source: 'google' | 'bing' | 'serpapi';
  keyword: string;
  results: SerpResult[];
  totalResults: number;
  searchTime: number;
}

export class SerpApiService {
  private static config: SerpApiConfig = {};

  static setConfig(config: SerpApiConfig) {
    this.config = { ...this.config, ...config };
    // Sauvegarder la config dans localStorage
    localStorage.setItem('serpApiConfig', JSON.stringify(this.config));
  }

  static getConfig(): SerpApiConfig {
    const saved = localStorage.getItem('serpApiConfig');
    if (saved) {
      this.config = JSON.parse(saved);
    }
    return this.config;
  }

  // Recherche Google via Custom Search API
  static async searchGoogle(keyword: string, numResults = 10): Promise<SerpSearchResult> {
    const config = this.getConfig();
    
    if (!config.googleApiKey || !config.googleCseId) {
      throw new Error('Google API Key et Custom Search Engine ID requis');
    }

    try {
      const url = `https://www.googleapis.com/customsearch/v1?key=${config.googleApiKey}&cx=${config.googleCseId}&q=${encodeURIComponent(keyword)}&num=${numResults}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Erreur API Google');
      }

      const results: SerpResult[] = (data.items || []).map((item: any, index: number) => ({
        title: item.title,
        url: item.link,
        description: item.snippet,
        position: index + 1,
        domain: new URL(item.link).hostname,
        authority: Math.floor(Math.random() * 100) // Simulation - nécessite une API séparée
      }));

      return {
        source: 'google',
        keyword,
        results,
        totalResults: parseInt(data.searchInformation?.totalResults || '0'),
        searchTime: parseFloat(data.searchInformation?.searchTime || '0')
      };
    } catch (error) {
      console.error('Erreur recherche Google:', error);
      throw error;
    }
  }

  // Recherche Bing via Bing Search API
  static async searchBing(keyword: string, numResults = 10): Promise<SerpSearchResult> {
    const config = this.getConfig();
    
    if (!config.bingApiKey) {
      throw new Error('Bing API Key requis');
    }

    try {
      const url = `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(keyword)}&count=${numResults}`;
      
      const response = await fetch(url, {
        headers: {
          'Ocp-Apim-Subscription-Key': config.bingApiKey
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Erreur API Bing');
      }

      const results: SerpResult[] = (data.webPages?.value || []).map((item: any, index: number) => ({
        title: item.name,
        url: item.url,
        description: item.snippet,
        position: index + 1,
        domain: new URL(item.url).hostname,
        authority: Math.floor(Math.random() * 100) // Simulation
      }));

      return {
        source: 'bing',
        keyword,
        results,
        totalResults: data.webPages?.totalEstimatedMatches || 0,
        searchTime: 0 // Bing ne fournit pas ce data
      };
    } catch (error) {
      console.error('Erreur recherche Bing:', error);
      throw error;
    }
  }

  // Recherche via SerpAPI (service tiers payant mais plus fiable)
  static async searchSerpApi(keyword: string, engine: 'google' | 'bing' = 'google', numResults = 10): Promise<SerpSearchResult> {
    const config = this.getConfig();
    
    if (!config.serpApiKey) {
      throw new Error('SerpAPI Key requis');
    }

    try {
      const params = new URLSearchParams({
        api_key: config.serpApiKey,
        engine: engine,
        q: keyword,
        num: numResults.toString()
      });

      const url = `https://serpapi.com/search?${params}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Erreur SerpAPI');
      }

      const results: SerpResult[] = (data.organic_results || []).map((item: any) => ({
        title: item.title,
        url: item.link,
        description: item.snippet,
        position: item.position,
        domain: new URL(item.link).hostname,
        authority: Math.floor(Math.random() * 100) // Simulation
      }));

      return {
        source: 'serpapi',
        keyword,
        results,
        totalResults: data.search_information?.total_results || 0,
        searchTime: data.search_information?.time_taken_displayed || 0
      };
    } catch (error) {
      console.error('Erreur SerpAPI:', error);
      throw error;
    }
  }

  // Recherche combinée (tous les moteurs disponibles)
  static async searchAllEngines(keyword: string, numResults = 10): Promise<SerpSearchResult[]> {
    const config = this.getConfig();
    const results: SerpSearchResult[] = [];
    const promises: Promise<SerpSearchResult>[] = [];

    // Google si configuré
    if (config.googleApiKey && config.googleCseId) {
      promises.push(this.searchGoogle(keyword, numResults));
    }

    // Bing si configuré
    if (config.bingApiKey) {
      promises.push(this.searchBing(keyword, numResults));
    }

    // SerpAPI si configuré
    if (config.serpApiKey) {
      promises.push(this.searchSerpApi(keyword, 'google', numResults));
      promises.push(this.searchSerpApi(keyword, 'bing', numResults));
    }

    // Attendre toutes les recherches avec gestion d'erreur individuelle
    const settledResults = await Promise.allSettled(promises);
    
    settledResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        console.error('Erreur recherche SERP:', result.reason);
      }
    });

    return results;
  }

  // Analyser les concurrents dans les SERP
  static analyzeSerpCompetitors(serpResults: SerpSearchResult[]): {
    topDomains: { domain: string; appearances: number; avgPosition: number }[];
    opportunities: { keyword: string; position: number; competitor: string }[];
    analysis: string;
  } {
    const domainStats = new Map<string, { count: number; positions: number[] }>();
    
    serpResults.forEach(serpResult => {
      serpResult.results.forEach(result => {
        if (result.domain) {
          if (!domainStats.has(result.domain)) {
            domainStats.set(result.domain, { count: 0, positions: [] });
          }
          const stats = domainStats.get(result.domain)!;
          stats.count++;
          stats.positions.push(result.position);
        }
      });
    });

    const topDomains = Array.from(domainStats.entries())
      .map(([domain, stats]) => ({
        domain,
        appearances: stats.count,
        avgPosition: stats.positions.reduce((a, b) => a + b, 0) / stats.positions.length
      }))
      .sort((a, b) => b.appearances - a.appearances)
      .slice(0, 10);

    const opportunities = serpResults.flatMap(serpResult =>
      serpResult.results
        .filter(result => result.position > 3 && result.position <= 10)
        .map(result => ({
          keyword: serpResult.keyword,
          position: result.position,
          competitor: result.domain || result.url
        }))
    );

    const analysis = `Analyse des ${serpResults.length} recherches SERP effectuées. 
Les domaines les plus présents sont: ${topDomains.slice(0, 3).map(d => d.domain).join(', ')}.
${opportunities.length} opportunités identifiées pour améliorer le positionnement.`;

    return {
      topDomains,
      opportunities,
      analysis
    };
  }
}