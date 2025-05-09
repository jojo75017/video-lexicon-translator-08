
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
    totalBlockingTime: Math.random() * 300 + 100,
    cumulativeLayoutShift: Math.random() * 0.3,
    performanceScore: Math.floor(Math.random() * 30) + 70,
    // Ajouté pour les données de performances mobile et desktop
    mobilePerformance: {
      loadTime: Math.random() * 4000 + 1500,
      firstContentfulPaint: Math.random() * 1500 + 700,
      largestContentfulPaint: Math.random() * 2500 + 1500,
      speedIndex: Math.random() * 3500 + 2000,
      timeToInteractive: Math.random() * 4500 + 2500,
      domLoadTime: Math.random() * 2500 + 1200,
      totalBlockingTime: Math.random() * 400 + 150,
      cumulativeLayoutShift: Math.random() * 0.4,
      performanceScore: Math.floor(Math.random() * 25) + 60,
      resourceCount: Math.floor(scripts.length * 0.9),
      scriptCount: Math.floor(scripts.length * 0.9),
      imageCount: Math.floor(images.length * 0.9),
      styleCount: Math.floor(styles.length * 0.9),
      resourceBreakdown: {
        images: Math.random() * 1800000,
        scripts: Math.random() * 900000,
        styles: Math.random() * 450000,
        fonts: Math.random() * 270000,
        other: Math.random() * 180000
      },
      totalSize: Math.random() * 4500000,
      responseTime: Math.random() * 350 + 70
    },
    desktopPerformance: {
      loadTime: Math.random() * 2500 + 800,
      firstContentfulPaint: Math.random() * 800 + 300,
      largestContentfulPaint: Math.random() * 1500 + 700,
      speedIndex: Math.random() * 2000 + 1000,
      timeToInteractive: Math.random() * 2500 + 1200,
      domLoadTime: Math.random() * 1500 + 600,
      totalBlockingTime: Math.random() * 200 + 80,
      cumulativeLayoutShift: Math.random() * 0.2,
      performanceScore: Math.floor(Math.random() * 25) + 75,
      resourceCount: scripts.length,
      scriptCount: scripts.length,
      imageCount: images.length,
      styleCount: styles.length,
      resourceBreakdown: {
        images: Math.random() * 2200000,
        scripts: Math.random() * 1100000,
        styles: Math.random() * 550000,
        fonts: Math.random() * 330000,
        other: Math.random() * 220000
      },
      totalSize: Math.random() * 5500000,
      responseTime: Math.random() * 250 + 40
    }
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

export const getLighthouseMobileScore = (): { score: number; issues: { category: string; description: string }[] } => {
  // Génération d'un score entre 50 et 90 pour mobile (généralement plus bas que desktop)
  const score = Math.floor(Math.random() * 40) + 50;
  
  // Génération d'issues fictives selon le score
  const issues = [];
  
  if (score < 80) {
    issues.push({
      category: 'Performance',
      description: 'Temps de chargement initial trop long sur réseau 4G'
    });
  }
  
  if (score < 75) {
    issues.push({
      category: 'Accessibilité',
      description: 'Éléments tactiles trop proches les uns des autres'
    });
  }
  
  if (score < 70) {
    issues.push({
      category: 'SEO',
      description: 'La page n\'est pas optimisée pour mobile'
    });
  }
  
  if (score < 65) {
    issues.push({
      category: 'Bonnes pratiques',
      description: 'Taille de police trop petite pour lecture mobile'
    });
  }
  
  if (score < 60) {
    issues.push({
      category: 'PWA',
      description: 'Pas de configuration pour installation sur écran d\'accueil'
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
    },
    mobile: {
      loadTime: Math.random() * 6000 + 1500,
      firstByte: Math.random() * 600 + 150,
      startRender: Math.random() * 1500 + 700,
      speedIndex: Math.random() * 2500 + 1500,
      visualComplete: Math.random() * 5000 + 4000,
      requestsCount: Math.floor(Math.random() * 45) + 25,
      bytesIn: Math.random() * 4000000,
      ttfb: Math.random() * 400 + 150,
      domLoaded: Math.random() * 2500 + 2000,
    }
  };
};

