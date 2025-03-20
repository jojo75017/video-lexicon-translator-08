
import React from 'react';
import BacklinkSection from '@/components/seo/BacklinkSection';
import AdvancedSection from '@/components/seo/AdvancedSection';
import IntegrationsSection from '@/components/seo/IntegrationsSection';
import SiteStructureVisualizer from '@/components/SiteStructureVisualizer';
import StructureSection from '@/components/seo/StructureSection';
import SeoStructure from '@/components/seo/SeoStructure';
import { useSiteAnalyzer } from '@/hooks/useSiteAnalyzer';
import HierarchySection from '@/components/seo/HierarchySection';

export const SeoTabContent: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md" id="seo" data-section="seo" data-tab-content="seo">
    <h2 className="text-xl font-bold mb-4">Analyse SEO</h2>
    <p className="text-gray-600">Contenu de l'analyse SEO</p>
    <div className="mt-4 p-4 bg-gray-50 rounded-md">
      <p className="text-sm text-gray-500">Cette section vous permet d'analyser les performances SEO de votre site.</p>
    </div>
  </div>
);

export const StructureTabContent: React.FC = () => {
  // Sample structure data
  const sampleStructure = {
    name: "Mon Site Web",
    children: [
      {
        name: "Page d'accueil",
        path: "/",
        children: [
          {
            name: "À propos",
            path: "/about",
            children: [
              { name: "Notre équipe", path: "/about/team", children: [] },
              { name: "Notre histoire", path: "/about/history", children: [] }
            ]
          },
          {
            name: "Services",
            path: "/services",
            children: [
              { name: "Consultation SEO", path: "/services/seo", children: [] },
              { name: "Développement web", path: "/services/web-dev", children: [] },
              { name: "Marketing digital", path: "/services/digital-marketing", children: [] }
            ]
          },
          {
            name: "Blog",
            path: "/blog",
            children: [
              { name: "Articles SEO", path: "/blog/seo", children: [] },
              { name: "Actualités", path: "/blog/news", children: [] },
              { name: "Tutoriels", path: "/blog/tutorials", children: [] }
            ]
          },
          {
            name: "Contact",
            path: "/contact",
            children: []
          }
        ]
      }
    ]
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md" id="structure" data-section="structure" data-tab-content="structure">
      <h2 className="text-xl font-bold mb-4">Structure du Site</h2>
      <p className="text-gray-600 mb-6">Examinez l'architecture et l'organisation des pages de votre site web pour optimiser la navigation et le référencement.</p>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Section structure principale */}
        <StructureSection isLoading={false} siteStructure={sampleStructure} />
        
        {/* Visualisateur de structure de site */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Visualisation de la structure</h3>
          <SiteStructureVisualizer structure={sampleStructure} />
        </div>
        
        {/* Analyse technique */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Analyse technique</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-800 mb-2">Profondeur du site</h4>
              <p className="text-sm text-gray-600">Profondeur maximale: <span className="font-semibold">3 niveaux</span></p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Recommandé: maximum 3-4 niveaux</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-800 mb-2">Breadcrumbs (fil d'Ariane)</h4>
              <p className="text-sm text-gray-600">Statut: <span className="font-semibold text-green-600">Détecté</span></p>
              <p className="text-xs text-gray-500 mt-1">Facilite la navigation et améliore le SEO</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-800 mb-2">Plan du site XML</h4>
              <p className="text-sm text-gray-600">Statut: <span className="font-semibold text-amber-600">Non détecté</span></p>
              <p className="text-xs text-gray-500 mt-1">Important pour l'indexation par les moteurs de recherche</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-800 mb-2">Structure des URLs</h4>
              <p className="text-sm text-gray-600">Qualité: <span className="font-semibold text-green-600">Bonne</span></p>
              <p className="text-xs text-gray-500 mt-1">URLs lisibles et descriptives</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Import the dedicated HierarchyTabContent instead of defining it inline
import HierarchyTabContent from './HierarchyTabContent';
export { HierarchyTabContent };

// Import the new AnalyticsTabContent
import AnalyticsTabContent from './AnalyticsTabContent';
export { AnalyticsTabContent };

export const BacklinksTabContent: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md" id="backlinks" data-section="backlinks" data-tab-content="backlinks">
    <h2 className="text-xl font-bold mb-4">Analyse des Backlinks</h2>
    <p className="text-gray-600">Examinez les liens entrants vers votre site</p>
    <div className="mt-4">
      <BacklinkSection isLoading={false} seoAnalysis={null} />
    </div>
  </div>
);

export const MetricsTabContent: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md" id="metrics" data-section="metrics" data-tab-content="metrics">
    <h2 className="text-xl font-bold mb-4">Métriques</h2>
    <p className="text-gray-600">Statistiques détaillées de performance</p>
    <div className="mt-4 p-4 bg-gray-50 rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium text-gray-700 mb-2">Visiteurs</h3>
          <p className="text-3xl font-bold text-blue-600">1,245</p>
          <p className="text-sm text-gray-500 mt-1">+12% depuis le mois dernier</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium text-gray-700 mb-2">Pages vues</h3>
          <p className="text-3xl font-bold text-green-600">3,872</p>
          <p className="text-sm text-gray-500 mt-1">+8% depuis le mois dernier</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium text-gray-700 mb-2">Taux de rebond</h3>
          <p className="text-3xl font-bold text-orange-600">42%</p>
          <p className="text-sm text-gray-500 mt-1">-3% depuis le mois dernier</p>
        </div>
      </div>
    </div>
  </div>
);

export const AdvancedTabContent: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md" id="advanced" data-section="advanced" data-tab-content="advanced">
    <h2 className="text-xl font-bold mb-4">Options avancées</h2>
    <p className="text-gray-600">Accédez aux fonctionnalités avancées pour optimiser votre site</p>
    <div className="mt-4">
      <AdvancedSection isLoading={false} seoAnalysis={null} />
    </div>
  </div>
);

export const IntegrationsTabContent: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md" id="integrations" data-section="integrations" data-tab-content="integrations">
    <h2 className="text-xl font-bold mb-4">Intégrations</h2>
    <p className="text-gray-600">Connectez vos outils préférés pour une analyse complète</p>
    <div className="mt-4">
      <IntegrationsSection />
    </div>
  </div>
);
