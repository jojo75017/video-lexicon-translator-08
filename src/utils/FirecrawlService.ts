
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

  static async crawlWebsite(url: string): Promise<CrawlResponse> {
    try {
      console.log('Démarrage de l\'analyse du site:', url);
      const corsProxy = 'https://cors-anywhere.herokuapp.com/';
      
      const response = await Promise.race([
        fetch(`${corsProxy}${url}`, {
          headers: {
            'Accept': 'text/html',
            'X-Requested-With': 'XMLHttpRequest',
          }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('L\'analyse a pris trop de temps')), this.TIMEOUT)
        )
      ]) as Response;

      if (!response.ok) {
        throw new Error('Impossible d\'accéder au site');
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Analyse basique du site
      const title = doc.title;
      const meta = Array.from(doc.getElementsByTagName('meta'))
        .map(meta => ({
          name: meta.getAttribute('name') || meta.getAttribute('property'),
          content: meta.getAttribute('content')
        }))
        .filter(meta => meta.name && meta.content);

      const links = Array.from(doc.getElementsByTagName('a'))
        .map(a => ({
          href: a.href,
          text: a.textContent?.trim()
        }))
        .filter(link => link.href.startsWith('http'));

      const images = Array.from(doc.getElementsByTagName('img'))
        .map(img => ({
          src: img.src,
          alt: img.alt
        }));

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
              text: h.textContent?.trim()
            }))
        }]
      };

    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur lors de l\'analyse du site',
        completed: 0,
        total: 1
      };
    }
  }
}
