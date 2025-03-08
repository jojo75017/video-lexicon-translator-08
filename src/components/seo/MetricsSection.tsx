
import React from 'react';
import { Card } from '@/components/ui/card';

interface MetricsSectionProps {
  isLoading: boolean;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({ isLoading }) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Métriques SEO détaillées</h2>
      <p className="text-gray-600 mb-4">
        Cette section présente des métriques détaillées sur la performance 
        de votre site en termes de référencement.
      </p>
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-500 text-center py-8">
            Analysez un site pour voir ses métriques détaillées
          </p>
        </div>
      )}
    </Card>
  );
};

export default MetricsSection;
