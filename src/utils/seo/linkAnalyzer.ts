
export const analyzeLinkStructure = (doc: Document, url: string) => {
  const links = Array.from(doc.getElementsByTagName('a'));
  const internalLinks = links.filter(link => {
    try {
      const linkUrl = new URL(link.href);
      const pageUrl = new URL(url);
      return linkUrl.hostname === pageUrl.hostname;
    } catch {
      return false;
    }
  });

  return {
    total: links.length,
    internal: internalLinks.length,
    external: links.length - internalLinks.length,
    withTitle: links.filter(link => link.title).length,
    withDescription: links.filter(link => link.getAttribute('aria-label')).length,
    nofollow: links.filter(link => link.rel.includes('nofollow')).length,
    dofollow: links.filter(link => !link.rel.includes('nofollow')).length
  };
};
