export interface Resource {
  url: string;
  type: string;
  status: number;
  size?: string;
}

export const analyzeResources = async (doc: Document, baseUrl: string): Promise<Resource[]> => {
  const resources: Resource[] = [];

  // Analyse des images
  const images = doc.getElementsByTagName('img');
  for (const img of images) {
    try {
      const url = new URL(img.src, baseUrl).href;
      const response = await fetch(url, { method: 'HEAD' });
      resources.push({
        url,
        type: 'image',
        status: response.status,
        size: response.headers.get('content-length') 
          ? `${Math.round(parseInt(response.headers.get('content-length')!) / 1024)} KB` 
          : undefined
      });
    } catch (error) {
      resources.push({
        url: img.src,
        type: 'image',
        status: 404
      });
    }
  }

  // Analyse des scripts
  const scripts = doc.getElementsByTagName('script');
  for (const script of scripts) {
    if (script.src) {
      try {
        const url = new URL(script.src, baseUrl).href;
        const response = await fetch(url, { method: 'HEAD' });
        resources.push({
          url,
          type: 'script',
          status: response.status,
          size: response.headers.get('content-length')
            ? `${Math.round(parseInt(response.headers.get('content-length')!) / 1024)} KB`
            : undefined
        });
      } catch (error) {
        resources.push({
          url: script.src,
          type: 'script',
          status: 404
        });
      }
    }
  }

  // Analyse des styles
  const styles = doc.getElementsByTagName('link');
  for (const style of styles) {
    if (style.rel === 'stylesheet') {
      try {
        const url = new URL(style.href, baseUrl).href;
        const response = await fetch(url, { method: 'HEAD' });
        resources.push({
          url,
          type: 'style',
          status: response.status,
          size: response.headers.get('content-length')
            ? `${Math.round(parseInt(response.headers.get('content-length')!) / 1024)} KB`
            : undefined
        });
      } catch (error) {
        resources.push({
          url: style.href,
          type: 'style',
          status: 404
        });
      }
    }
  }

  return resources;
};