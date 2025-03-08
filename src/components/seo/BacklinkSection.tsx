
import React from 'react';
import { Card } from '@/components/ui/card';
import { SeoAnalysisResult } from '@/types/seo';

interface BacklinkSectionProps {
  isLoading: boolean;
  seoAnalysis: SeoAnalysisResult | null;
}

const BacklinkSection: React.FC<BacklinkSectionProps> = ({ isLoading, seoAnalysis }) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Analyse des backlinks</h2>
      <p className="text-gray-600 mb-4">
        Cette section analyse les backlinks pointant vers votre site 
        pour évaluer leur qualité et leur impact sur votre référencement.
      </p>
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg">
          {seoAnalysis ? (
            <p>Analyse des backlinks disponible</p>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Analysez un site pour voir ses backlinks
            </p>
          )}
        </div>
      )}
    </Card>
  );
};

export default BacklinkSection;
