
import React from 'react';
import { Card } from '@/components/ui/card';
import { SeoAnalysisResult } from '@/types/seo';

interface HierarchySectionProps {
  isLoading: boolean;
  seoAnalysis: SeoAnalysisResult | null;
}

const HierarchySection: React.FC<HierarchySectionProps> = ({ isLoading, seoAnalysis }) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Hiérarchie du contenu</h2>
      <p className="text-gray-600 mb-4">
        Cette section analyse la hiérarchie du contenu de votre site 
        pour optimiser l'organisation et l'indexation par les moteurs de recherche.
      </p>
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg">
          {seoAnalysis ? (
            <p>Hiérarchie du contenu disponible</p>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Analysez un site pour voir sa hiérarchie
            </p>
          )}
        </div>
      )}
    </Card>
  );
};

export default HierarchySection;
