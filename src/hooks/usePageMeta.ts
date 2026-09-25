import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
}

const setMeta = (selector: string, attrs: Record<string, string>) => {
  let el = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (!el) {
    el = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
};

/**
 * Renseigne titre, description, canonique et partage social d'une page.
 * Remplace une librairie externe : aucune dépendance, aucun conflit React.
 */
export function usePageMeta({ title, description, canonical, noindex }: PageMeta): void {
  useEffect(() => {
    document.title = title;
    setMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    setMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    if (description) {
      setMeta('meta[name="description"]', { name: 'description', content: description });
      setMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    }
    if (canonical) {
      setMeta('link[rel="canonical"]', { rel: 'canonical', href: canonical });
      setMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    }
    setMeta('meta[name="robots"]', { name: 'robots', content: noindex ? 'noindex' : 'index, follow' });
  }, [title, description, canonical, noindex]);
}
