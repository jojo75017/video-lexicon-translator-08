
import React from 'react';
import BacklinkSection from '@/components/seo/BacklinkSection';
import AdvancedSection from '@/components/seo/AdvancedSection';
import IntegrationsSection from '@/components/seo/IntegrationsSection';

export const SeoTabContent: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md" id="seo" data-section="seo" data-tab-content="seo">
    <h2 className="text-xl font-bold mb-4">Analyse SEO</h2>
    <p className="text-gray-600">Contenu de l'analyse SEO</p>
    <div className="mt-4 p-4 bg-gray-50 rounded-md">
      <p className="text-sm text-gray-500">Cette section vous permet d'analyser les performances SEO de votre site.</p>
    </div>
  </div>
);

export const StructureTabContent: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md" id="structure" data-section="structure" data-tab-content="structure">
    <h2 className="text-xl font-bold mb-4">Structure du Site</h2>
    <p className="text-gray-600">Contenu de l'analyse de structure</p>
    <div className="mt-4 p-4 bg-gray-50 rounded-md">
      <p className="text-sm text-gray-500">Cette section vous permet d'examiner l'architecture de votre site web.</p>
    </div>
  </div>
);

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
