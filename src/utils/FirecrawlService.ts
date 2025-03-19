
interface CrawlResponse {
  success: boolean;
  status?: string;
  completed?: number;
  total?: number;
  data?: any[];
  error?: string;
}

export class FirecrawlService {
  private static readonly TIMEOUT = 15000; // 15 secondes de timeout
  private static isProxyEnabled = false;

  static enableProxy() {
    this.isProxyEnabled = true;
    console.log('Proxy CORS activé');
    return this.isProxyEnabled;
  }

  static isProxyActive() {
    return this.isProxyEnabled;
  }

  static async crawlWebsite(url: string): Promise<CrawlResponse> {
    if (!url) {
      return {
        success: false,
        error: "URL non fournie",
        completed: 0,
        total: 0
      };
    }
    
    try {
      // Validate URL format
      const urlObj = new URL(url);
      if (!urlObj.protocol.startsWith('http')) {
        return {
          success: false,
          error: "L'URL doit commencer par http:// ou https://",
          completed: 0,
          total: 0
        };
      }
      
      console.log('Démarrage de l\'analyse du site:', url);
      const corsProxy = this.isProxyEnabled ? 'https://cors-anywhere.herokuapp.com/' : '';
      
      const response = await Promise.race([
        fetch(`${corsProxy}${url}`, {
          headers: {
            'Accept': 'text/html',
            'X-Requested-With': 'XMLHttpRequest',
          }
        }),
        new Promise<Response>((_, reject) => 
          setTimeout(() => reject(new Error('L\'analyse a pris trop de temps')), this.TIMEOUT)
        )
      ]) as Response;

      if (!response.ok) {
        throw new Error(`Impossible d'accéder au site (Statut: ${response.status})`);
      }

      const html = await response.text();
      if (!html || html.trim().length === 0) {
        return {
          success: false,
          error: "Le site a retourné un contenu vide",
          completed: 0,
          total: 0
        };
      }
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Analyse basique du site
      const title = doc.title || "Sans titre";
      const meta = Array.from(doc.getElementsByTagName('meta'))
        .map(meta => ({
          name: meta.getAttribute('name') || meta.getAttribute('property'),
          content: meta.getAttribute('content')
        }))
        .filter(meta => meta.name && meta.content);

      const links = Array.from(doc.getElementsByTagName('a'))
        .map(a => ({
          href: a.href,
          text: a.textContent?.trim() || "Sans texte"
        }))
        .filter(link => link.href.startsWith('http'));

      const images = Array.from(doc.getElementsByTagName('img'))
        .map(img => ({
          src: img.src,
          alt: img.alt || "Sans description"
        }));

      // Ajouter le code source formaté
      const formattedHtml = html
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>')
        .replace(/\s{2}/g, '&nbsp;&nbsp;');

      return {
        success: true,
        status: 'completed',
        completed: 1,
        total: 1,
        data: [{
          url,
          title,
          meta,
          links: links.slice(0, 20), // Limite à 20 liens
          images: images.slice(0, 20), // Limite à 20 images
          headings: Array.from(doc.querySelectorAll('h1, h2, h3'))
            .map(h => ({
              level: h.tagName.toLowerCase(),
              text: h.textContent?.trim() || "Sans texte"
            })),
          sourceCode: formattedHtml // Ajout du code source
        }]
      };

    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      // Vérifier si c'est une erreur CORS
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'analyse du site';
      
      if (!this.isProxyEnabled && (errorMessage.includes('CORS') || errorMessage.includes('cross-origin'))) {
        return {
          success: false,
          error: "Erreur CORS détectée. Activez le proxy pour analyser ce site.",
          completed: 0,
          total: 1,
          data: []
        };
      }
      
      return { 
        success: false, 
        error: errorMessage,
        completed: 0,
        total: 1
      };
    }
  }
}
