
import React from 'react';
import { Card } from "@/components/ui/card";

// SEO Tab Content
export const SeoTabContent = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Analyse SEO</h3>
      <p className="text-sm text-gray-600">
        Consultez l'analyse détaillée des facteurs SEO de votre site web.
      </p>
      <Card className="p-4">
        <p className="text-sm">Sélectionnez un site à analyser pour voir les détails SEO.</p>
      </Card>
    </div>
  );
};

// Structure Tab Content
export const StructureTabContent = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Structure du site</h3>
      <p className="text-sm text-gray-600">
        Visualisez l'architecture de votre site web et identifiez les améliorations possibles.
      </p>
      <Card className="p-4">
        <p className="text-sm">La structure de votre site n'a pas encore été analysée.</p>
      </Card>
    </div>
  );
};

// Backlinks Tab Content
export const BacklinksTabContent = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Backlinks</h3>
      <p className="text-sm text-gray-600">
        Analysez les liens entrants vers votre site web et leur qualité.
      </p>
      <Card className="p-4">
        <p className="text-sm">Aucune donnée de backlinks disponible.</p>
      </Card>
    </div>
  );
};

// Metrics Tab Content
export const MetricsTabContent = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Métriques</h3>
      <p className="text-sm text-gray-600">
        Consultez les indicateurs clés de performance de votre site web.
      </p>
      <Card className="p-4">
        <p className="text-sm">Aucune donnée de métriques disponible.</p>
      </Card>
    </div>
  );
};

// Advanced Tab Content
export const AdvancedTabContent = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Options avancées</h3>
      <p className="text-sm text-gray-600">
        Configurez des paramètres avancés pour l'analyse SEO de votre site.
      </p>
      <Card className="p-4">
        <p className="text-sm">Les options avancées seront disponibles prochainement.</p>
      </Card>
    </div>
  );
};

// Integrations Tab Content
export const IntegrationsTabContent = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Intégrations</h3>
      <p className="text-sm text-gray-600">
        Connectez vos outils et services préférés pour améliorer votre analyse SEO.
      </p>
      <Card className="p-4">
        <p className="text-sm">Les intégrations seront disponibles prochainement.</p>
      </Card>
    </div>
  );
};
