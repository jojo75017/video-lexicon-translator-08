
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
      
      try {
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
        console.error('Erreur lors de la requête fetch:', error);
        
        // Si c'est une erreur CORS ou NetworkError et que le proxy n'est pas activé
        if (!this.isProxyEnabled && error instanceof Error && 
            (error.message.includes('CORS') || 
             error.message.includes('Failed to fetch') || 
             error.message.includes('NetworkError'))) {
          return {
            success: false,
            error: "Erreur CORS détectée. Veuillez activer le proxy pour analyser ce site.",
            completed: 0,
            total: 0
          };
        }
        
        throw error; // Re-throw for the outer catch block to handle
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'analyse du site';
      
      // Generate simulated data instead of failing completely
      if (this.isProxyEnabled) {
        // Even with proxy, we're failing - generate demo data
        return {
          success: true,
          status: 'demo',
          completed: 1,
          total: 1,
          data: [{
            url,
            title: "Démonstration - Site non accessible",
            meta: [
              { name: "description", content: "Données de démonstration pour le site demandé" }
            ],
            links: [
              { href: url + "/page1", text: "Page d'exemple 1" },
              { href: url + "/page2", text: "Page d'exemple 2" }
            ],
            images: [
              { src: "https://via.placeholder.com/150", alt: "Image d'exemple" }
            ],
            headings: [
              { level: "h1", text: "Titre principal de démonstration" },
              { level: "h2", text: "Sous-titre de démonstration" }
            ],
            sourceCode: "&lt;html&gt;&lt;body&gt;Démonstration&lt;/body&gt;&lt;/html&gt;"
          }]
        };
      }
      
      return { 
        success: false, 
        error: errorMessage,
        completed: 0,
        total: 0
      };
    }
  }
}
