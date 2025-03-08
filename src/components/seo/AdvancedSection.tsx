
import React from 'react';
import { Card } from '@/components/ui/card';
import { SeoAnalysisResult } from '@/types/seo';

interface AdvancedSectionProps {
  isLoading: boolean;
  seoAnalysis: SeoAnalysisResult | null;
}

const AdvancedSection: React.FC<AdvancedSectionProps> = ({ isLoading, seoAnalysis }) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Options avancées</h2>
      <p className="text-gray-600 mb-4">
        Cette section propose des options d'analyse SEO avancées 
        pour les utilisateurs expérimentés.
      </p>
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg">
          {seoAnalysis ? (
            <p>Options avancées disponibles</p>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Analysez un site pour accéder aux options avancées
            </p>
          )}
        </div>
      )}
    </Card>
  );
};

export default AdvancedSection;
