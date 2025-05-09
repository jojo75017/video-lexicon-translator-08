
// Corriger les erreurs de compilation en ajoutant les propriétés manquantes

import { Performance } from '@/types/seo';

export const analyzePerformance = (doc: Document, startTime: number): Performance => {
  console.log("Analyzing performance...");
  
  // Mesurer le temps de chargement
  const loadTime = window.performance.now() - startTime;
  
  // Compter les ressources
  const scripts = doc.querySelectorAll('script');
  const styles = doc.querySelectorAll('link[rel="stylesheet"], style');
  const images = doc.querySelectorAll('img');
  
  // Simulation de métriques supplémentaires
  const mockPerformance: Performance = {
    loadTime: loadTime,
    firstContentfulPaint: Math.random() * 1000 + 500,
    largestContentfulPaint: Math.random() * 2000 + 1000,
    speedIndex: Math.random() * 3000 + 1500,
    timeToInteractive: Math.random() * 3500 + 2000,
    domLoadTime: Math.random() * 2000 + 900,
    resourceCount: scripts.length + styles.length + images.length,
    scriptCount: scripts.length,
    imageCount: images.length,
    cacheLifetime: 3600,
    score: Math.floor(Math.random() * 30) + 70,
    styleCount: styles.length,
    resourceBreakdown: {
      images: Math.random() * 2000000,
      scripts: Math.random() * 1000000,
      styles: Math.random() * 500000,
      fonts: Math.random() * 300000,
      other: Math.random() * 200000
    },
    totalSize: Math.random() * 5000000,
    responseTime: Math.random() * 300 + 50,
    impressions: Math.floor(Math.random() * 10000),
    clickThroughRate: Math.random() * 10,
    // Propriétés manquantes ajoutées pour corriger l'erreur de compilation
    totalBlockingTime: Math.random() * 300 + 100,
    cumulativeLayoutShift: Math.random() * 0.3,
    performanceScore: Math.floor(Math.random() * 30) + 70
  };
  
  return mockPerformance;
};

export const getLighthouseScore = (): { score: number; issues: { category: string; description: string }[] } => {
  // Génération d'un score entre 60 et 100
  const score = Math.floor(Math.random() * 40) + 60;
  
  // Génération d'issues fictives selon le score
  const issues = [];
  
  if (score < 90) {
    issues.push({
      category: 'Performance',
      description: 'Ressources JavaScript bloquant le rendu'
    });
  }
  
  if (score < 85) {
    issues.push({
      category: 'Accessibilité',
      description: 'Contraste des couleurs insuffisant'
    });
  }
  
  if (score < 80) {
    issues.push({
      category: 'SEO',
      description: 'Meta description manquante ou trop courte'
    });
  }
  
  if (score < 75) {
    issues.push({
      category: 'Bonnes pratiques',
      description: 'Utilisation de bibliothèques JavaScript avec vulnérabilités connues'
    });
  }
  
  return {
    score,
    issues
  };
};

export const getMockedWpt = (): any => {
  return {
    score: Math.floor(Math.random() * 100),
    firstView: {
      loadTime: Math.random() * 5000 + 1000,
      firstByte: Math.random() * 500 + 100,
      startRender: Math.random() * 1000 + 500,
      speedIndex: Math.random() * 2000 + 1000,
      visualComplete: Math.random() * 4000 + 3000,
      requestsCount: Math.floor(Math.random() * 50) + 30,
      bytesIn: Math.random() * 5000000,
      ttfb: Math.random() * 300 + 100,
      domLoaded: Math.random() * 2000 + 1500,
    }
  };
};
