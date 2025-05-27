
export interface PageStructure {
  sections: Section[];
  navigation: NavigationItem[];
  contentBlocks: ContentBlock[];
  internalLinks: InternalLink[];
  externalLinks: ExternalLink[];
}

export interface Section {
  title: string;
  content: string;
  headingLevel: number;
  wordCount: number;
}

export interface NavigationItem {
  text: string;
  href: string;
  level: number;
}

export interface ContentBlock {
  type: 'text' | 'image' | 'list' | 'table';
  content: string;
  position: number;
}

export interface InternalLink {
  text: string;
  href: string;
  title?: string;
}

export interface ExternalLink {
  text: string;
  href: string;
  domain: string;
}

export function analyzePageStructure(doc: Document): PageStructure {
  return {
    sections: extractSections(doc),
    navigation: extractNavigation(doc),
    contentBlocks: extractContentBlocks(doc),
    internalLinks: extractInternalLinks(doc),
    externalLinks: extractExternalLinks(doc)
  };
}

function extractSections(doc: Document): Section[] {
  const sections: Section[] = [];
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  headings.forEach((heading, index) => {
    const title = heading.textContent?.trim() || '';
    const headingLevel = parseInt(heading.tagName.charAt(1));
    
    // Get content until next heading of same or higher level
    let content = '';
    let nextElement = heading.nextElementSibling;
    
    while (nextElement) {
      if (nextElement.matches('h1, h2, h3, h4, h5, h6')) {
        const nextLevel = parseInt(nextElement.tagName.charAt(1));
        if (nextLevel <= headingLevel) break;
      }
      content += nextElement.textContent + ' ';
      nextElement = nextElement.nextElementSibling;
    }
    
    sections.push({
      title,
      content: content.trim(),
      headingLevel,
      wordCount: content.trim().split(/\s+/).length
    });
  });
  
  return sections;
}

function extractNavigation(doc: Document): NavigationItem[] {
  const navItems: NavigationItem[] = [];
  const navElements = doc.querySelectorAll('nav a, .navigation a, .menu a, header a');
  
  navElements.forEach(link => {
    const href = link.getAttribute('href') || '';
    const text = link.textContent?.trim() || '';
    
    if (text && href && text.length > 1 && text.length < 50) {
      navItems.push({
        text,
        href,
        level: 1
      });
    }
  });
  
  return navItems;
}

function extractContentBlocks(doc: Document): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const elements = doc.querySelectorAll('p, ul, ol, table, img, div');
  
  elements.forEach((element, index) => {
    const content = element.textContent?.trim() || '';
    
    if (content.length > 20) {
      let type: 'text' | 'image' | 'list' | 'table' = 'text';
      
      if (element.tagName === 'UL' || element.tagName === 'OL') {
        type = 'list';
      } else if (element.tagName === 'TABLE') {
        type = 'table';
      } else if (element.tagName === 'IMG') {
        type = 'image';
      }
      
      blocks.push({
        type,
        content,
        position: index
      });
    }
  });
  
  return blocks;
}

function extractInternalLinks(doc: Document): InternalLink[] {
  const links: InternalLink[] = [];
  const linkElements = doc.querySelectorAll('a[href]');
  const currentDomain = window.location.hostname;
  
  linkElements.forEach(link => {
    const href = link.getAttribute('href') || '';
    const text = link.textContent?.trim() || '';
    const title = link.getAttribute('title');
    
    try {
      const url = new URL(href, window.location.origin);
      if (url.hostname === currentDomain || href.startsWith('/')) {
        links.push({
          text,
          href,
          title: title || undefined
        });
      }
    } catch (e) {
      // Invalid URL, skip
    }
  });
  
  return links;
}

function extractExternalLinks(doc: Document): ExternalLink[] {
  const links: ExternalLink[] = [];
  const linkElements = doc.querySelectorAll('a[href]');
  const currentDomain = window.location.hostname;
  
  linkElements.forEach(link => {
    const href = link.getAttribute('href') || '';
    const text = link.textContent?.trim() || '';
    
    try {
      const url = new URL(href, window.location.origin);
      if (url.hostname !== currentDomain && !href.startsWith('/')) {
        links.push({
          text,
          href,
          domain: url.hostname
        });
      }
    } catch (e) {
      // Invalid URL, skip
    }
  });
  
  return links;
}

export function extractQuestionsFromContent(content: string): string[] {
  const questions: string[] = [];
  const sentences = content.split(/[.!?]+/);
  
  sentences.forEach(sentence => {
    const trimmed = sentence.trim();
    if (trimmed.includes('?') || 
        trimmed.toLowerCase().startsWith('comment') ||
        trimmed.toLowerCase().startsWith('pourquoi') ||
        trimmed.toLowerCase().startsWith('que ') ||
        trimmed.toLowerCase().startsWith('qui ') ||
        trimmed.toLowerCase().startsWith('où ') ||
        trimmed.toLowerCase().startsWith('quand ')) {
      questions.push(trimmed + '?');
    }
  });
  
  return questions.slice(0, 10);
}
