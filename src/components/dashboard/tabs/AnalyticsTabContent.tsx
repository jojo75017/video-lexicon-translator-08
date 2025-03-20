
import React from 'react';
import EnhancedAnalytics from '@/components/seo/EnhancedAnalytics';
import KeywordAnalysis from '@/components/seo/KeywordAnalysis';
import SeoOverview from '@/components/seo/SeoOverview';

// Données d'exemple pour l'analyse des mots-clés
const keywordData = [
  { keyword: 'SEO local', frequency: 16, density: 2.4 },
  { keyword: 'optimisation', frequency: 12, density: 1.8 },
  { keyword: 'entreprises locales', frequency: 8, density: 1.2 },
  { keyword: 'Google My Business', frequency: 7, density: 1.0 },
  { keyword: 'référencement', frequency: 14, density: 2.1 }
];

// Données d'exemple pour les performances
const samplePerformance = {
  score: 78,
  loadTime: 1850,
  firstContentfulPaint: 1200,
  domLoadTime: 2500,
  timeToInteractive: 3100,
  cssCount: 12,
  scriptCount: 18,
  requestCount: 34
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
        
        {/* Analyse des mots-clés */}
        <KeywordAnalysis keywords={keywordData} />
        
        {/* Analyses avancées */}
        <EnhancedAnalytics />
      </div>
    </div>
  );
};

export default AnalyticsTabContent;
