interface ScrapedData {
  title: string;
  content: string;
  html: string;
  images: string[];
  links: string[];
  metadata: {
    title?: string;
    description?: string;
    keywords?: string;
    author?: string;
    sourceURL: string;
  };
}

export class SimpleScraper {
  static async scrapeUrl(url: string): Promise<{ success: boolean; data?: ScrapedData; error?: string }> {
    try {
      // Utilisation d'un proxy CORS gratuit
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const htmlContent = data.contents;
      
      // Parser le HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      
      // Extraire les données
      const title = doc.querySelector('title')?.textContent || 'Site cloné';
      const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const keywords = doc.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';
      const author = doc.querySelector('meta[name="author"]')?.getAttribute('content') || '';
      
      // Extraire le contenu textuel principal
      const contentElements = doc.querySelectorAll('p, h1, h2, h3, h4, h5, h6, article, section');
      const textContent = Array.from(contentElements)
        .map(el => el.textContent?.trim())
        .filter(text => text && text.length > 20)
        .join('\n\n');
      
      // Convertir en Markdown basique
      const markdown = this.htmlToBasicMarkdown(doc, textContent);
      
      // Extraire les images
      const images = Array.from(doc.querySelectorAll('img'))
        .map(img => img.getAttribute('src'))
        .filter(src => src)
        .map(src => this.resolveUrl(src!, url));
      
      // Extraire les liens
      const links = Array.from(doc.querySelectorAll('a[href]'))
        .map(link => link.getAttribute('href'))
        .filter(href => href)
        .map(href => this.resolveUrl(href!, url));
      
      const scrapedData: ScrapedData = {
        title,
        content: markdown,
        html: htmlContent,
        images: [...new Set(images)], // Supprimer les doublons
        links: [...new Set(links)], // Supprimer les doublons
        metadata: {
          title,
          description,
          keywords,
          author,
          sourceURL: url
        }
      };
      
      return { success: true, data: scrapedData };
      
    } catch (error) {
      console.error('Erreur lors du scraping:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue lors du scraping' 
      };
    }
  }
  
  private static htmlToBasicMarkdown(doc: Document, textContent: string): string {
    let markdown = '';
    
    // Titre principal
    const h1 = doc.querySelector('h1');
    if (h1) {
      markdown += `# ${h1.textContent?.trim()}\n\n`;
    }
    
    // Sous-titres et contenu
    const elements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol, blockquote');
    
    elements.forEach(el => {
      const text = el.textContent?.trim();
      if (!text) return;
      
      switch (el.tagName.toLowerCase()) {
        case 'h1':
          markdown += `# ${text}\n\n`;
          break;
        case 'h2':
          markdown += `## ${text}\n\n`;
          break;
        case 'h3':
          markdown += `### ${text}\n\n`;
          break;
        case 'h4':
          markdown += `#### ${text}\n\n`;
          break;
        case 'h5':
          markdown += `##### ${text}\n\n`;
          break;
        case 'h6':
          markdown += `###### ${text}\n\n`;
          break;
        case 'p':
          if (text.length > 20) {
            markdown += `${text}\n\n`;
          }
          break;
        case 'blockquote':
          markdown += `> ${text}\n\n`;
          break;
        case 'ul':
        case 'ol':
          const listItems = el.querySelectorAll('li');
          listItems.forEach(li => {
            const itemText = li.textContent?.trim();
            if (itemText) {
              markdown += `- ${itemText}\n`;
            }
          });
          markdown += '\n';
          break;
      }
    });
    
    return markdown || textContent;
  }
  
  private static resolveUrl(url: string, baseUrl: string): string {
    try {
      return new URL(url, baseUrl).href;
    } catch {
      return url;
    }
  }
}