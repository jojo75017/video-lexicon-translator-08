
import React from 'react';
import EnhancedAnalytics from '@/components/seo/EnhancedAnalytics';
import KeywordAnalysis from '@/components/seo/KeywordAnalysis';
import SeoOverview from '@/components/seo/SeoOverview';
import LoadingSpeedAnalysis from '@/components/seo/LoadingSpeedAnalysis';
import LoadingPerformance from '@/components/seo/LoadingPerformance';

// Données d'exemple pour l'analyse des mots-clés
const keywordData = [
  { keyword: 'SEO local', frequency: 16, density: 2.4 },
  { keyword: 'optimisation', frequency: 12, density: 1.8 },
  { keyword: 'entreprises locales', frequency: 8, density: 1.2 },
  { keyword: 'Google My Business', frequency: 7, density: 1.0 },
  { keyword: 'référencement', frequency: 14, density: 2.1 }
];

// Données d'exemple pour les performances compatibles avec l'interface Performance
const samplePerformance = {
  score: 78,
  loadTime: 1850,
  firstContentfulPaint: 1200,
  domLoadTime: 2500,
  timeToInteractive: 3100,
  cssCount: 12,
  scriptCount: 18,
  requestCount: 34,
  resourceCount: 45,
  imageCount: 15,
  cacheLifetime: 3600,
  largestContentfulPaint: 1800,
  speedIndex: 2200,
  resourceBreakdown: {
    images: 1250000,
    scripts: 850000,
    styles: 320000,
    fonts: 180000,
    other: 450000
  },
  totalSize: 3050000,
  styleCount: 12,
  responseTime: 320,
  impressions: 28500,
  clickThroughRate: 0.065
};

const AnalyticsTabContent: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md" id="analytics" data-section="analytics" data-tab-content="analytics">
      <h2 className="text-xl font-bold mb-4">Analyses et Statistiques Avancées</h2>
      <p className="text-gray-600 mb-6">Explorez les données détaillées de performance, trafic et mots-clés pour votre site web.</p>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Vue d'ensemble SEO */}
        <SeoOverview 
          score={78} 
          suggestions={[
            "Optimisez vos balises meta pour améliorer le CTR dans les résultats de recherche.",
            "Augmentez la vitesse de chargement des pages en compressant les images.",
            "Améliorez la structure des liens internes pour renforcer l'autorité des pages importantes."
          ]}
          performance={samplePerformance}
        />
        
        {/* Analyse des performances de chargement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <LoadingPerformance 
            loadTime={samplePerformance.loadTime}
            firstContentfulPaint={samplePerformance.firstContentfulPaint}
            domLoadTime={samplePerformance.domLoadTime}
          />
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Optimisations recommandées</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full mr-2 mt-0.5">Priorité haute</span>
                <span>Compresser et optimiser les images (économie potentielle: 35%)</span>
              </li>
              <li className="flex items-start">
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full mr-2 mt-0.5">Priorité haute</span>
                <span>Activer la mise en cache du navigateur (TTL recommandé: 7 jours)</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mt-0.5">Priorité moyenne</span>
                <span>Réduire les scripts tiers non essentiels</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mt-0.5">Priorité moyenne</span>
                <span>Utiliser un CDN pour les ressources statiques</span>
              </li>
              <li className="flex items-start">
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mr-2 mt-0.5">Priorité basse</span>
                <span>Implémenter le chargement paresseux pour les images hors écran</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Analyse détaillée des performances */}
        <LoadingSpeedAnalysis performance={samplePerformance} />
        
        {/* Analyse des mots-clés */}
        <KeywordAnalysis keywords={keywordData} />
        
        {/* Analyses avancées */}
        <EnhancedAnalytics />
      </div>
    </div>
  );
};

export default AnalyticsTabContent;
