import axios from 'axios';

export interface Resource {
  type: string;
  url: string;
  size?: string;
  status?: number;
}

export const analyzeResources = async (doc: Document, baseUrl: string): Promise<Resource[]> => {
  const resources: Resource[] = [];
  
  // Analyse des images
  const images = Array.from(doc.getElementsByTagName('img'));
  images.forEach(img => {
    resources.push({
      type: 'Image',
      url: new URL(img.src, baseUrl).href
    });
  });

  // Analyse des scripts
  const scripts = Array.from(doc.getElementsByTagName('script'));
  scripts.forEach(script => {
    if (script.src) {
      resources.push({
        type: 'Script',
        url: new URL(script.src, baseUrl).href
      });
    }
  });

  // Analyse des styles
  const styles = Array.from(doc.getElementsByTagName('link')).filter(
    link => link.rel === 'stylesheet'
  );
  styles.forEach(style => {
    if (style.href) {
      resources.push({
        type: 'Style',
        url: new URL(style.href, baseUrl).href
      });
    }
  });

  // Vérification des statuts
  for (let resource of resources) {
    try {
      const response = await axios.head(resource.url);
      resource.status = response.status;
    } catch (error) {
      resource.status = 404;
    }
  }

  return resources;
};