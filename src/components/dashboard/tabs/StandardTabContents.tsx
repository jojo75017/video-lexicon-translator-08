
import React from 'react';

export const SeoTabContent: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md" id="seo" data-section="seo">
    <h2 className="text-xl font-bold mb-4">Analyse SEO</h2>
    <p className="text-gray-600">Contenu de l'analyse SEO</p>
    <div className="mt-4 p-4 bg-gray-50 rounded-md">
      <p className="text-sm text-gray-500">Cette section vous permet d'analyser les performances SEO de votre site.</p>
    </div>
  </div>
);

export const StructureTabContent: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md" id="structure" data-section="structure">
    <h2 className="text-xl font-bold mb-4">Structure du Site</h2>
    <p className="text-gray-600">Contenu de l'analyse de structure</p>
    <div className="mt-4 p-4 bg-gray-50 rounded-md">
      <p className="text-sm text-gray-500">Cette section vous permet d'examiner l'architecture de votre site web.</p>
    </div>
  </div>
);

export const BacklinksTabContent: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md" id="backlinks" data-section="backlinks">
    <h2 className="text-xl font-bold mb-4">Analyse des Backlinks</h2>
    <p className="text-gray-600">Contenu de l'analyse des backlinks</p>
    <div className="mt-4 p-4 bg-gray-50 rounded-md">
      <p className="text-sm text-gray-500">Cette section vous permet d'examiner les liens entrants vers votre site.</p>
    </div>
  </div>
);

export const MetricsTabContent: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md" id="metrics" data-section="metrics">
    <h2 className="text-xl font-bold mb-4">Métriques</h2>
    <p className="text-gray-600">Contenu des métriques</p>
    <div className="mt-4 p-4 bg-gray-50 rounded-md">
      <p className="text-sm text-gray-500">Cette section vous montre les statistiques clés de votre site web.</p>
    </div>
  </div>
);
