
import React from 'react';
import { Card } from '@/components/ui/card';
import { SiteStructure } from '@/types/seo';

interface StructureSectionProps {
  isLoading: boolean;
  siteStructure: SiteStructure | null;
}

const StructureSection: React.FC<StructureSectionProps> = ({ isLoading, siteStructure }) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Structure du site</h2>
      <p className="text-gray-600 mb-4">
        Cette section affiche la structure de votre site web, 
        y compris l'architecture des pages et les relations entre elles.
      </p>
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg">
          {siteStructure ? (
            <p>Structure du site disponible</p>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Analysez un site pour voir sa structure
            </p>
          )}
        </div>
      )}
    </Card>
  );
};

export default StructureSection;
