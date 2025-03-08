
import React from 'react';
import { Card } from '@/components/ui/card';
import { SiteStructure } from '@/types/seo';
import { FolderTree, Link2, ListTree } from 'lucide-react';

interface StructureSectionProps {
  isLoading: boolean;
  siteStructure: SiteStructure | null;
}

const StructureSection: React.FC<StructureSectionProps> = ({ isLoading, siteStructure }) => {
  return (
    <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-white to-slate-50">
      <div className="flex items-center mb-4">
        <div className="w-1 h-6 bg-emerald-500 rounded-full mr-3"></div>
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <FolderTree className="h-5 w-5 mr-2" />
          Structure du site
        </h2>
      </div>
      <p className="text-gray-600 mb-6">
        Visualisez l'architecture et l'organisation des pages de votre site web
      </p>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div>
          {siteStructure ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center mb-3">
                  <ListTree className="h-5 w-5 text-emerald-500" />
                  <h3 className="text-sm font-medium text-gray-700 ml-2">Hiérarchie des pages</h3>
                </div>
                <div className="pl-4 border-l-2 border-emerald-100 space-y-2">
                  <div className="font-medium text-emerald-700">Accueil</div>
                  <div className="pl-4 text-sm text-gray-600">
                    {siteStructure.children[0]?.children.slice(0, 3).map((node, index) => (
                      <div key={index} className="mb-1">{node.name}</div>
                    ))}
                    {siteStructure.children[0]?.children.length > 3 && (
                      <div className="text-gray-400 italic">
                        + {siteStructure.children[0].children.length - 3} autres pages
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center mb-3">
                  <Link2 className="h-5 w-5 text-blue-500" />
                  <h3 className="text-sm font-medium text-gray-700 ml-2">Analyse des liens</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-xs text-gray-500">Liens internes</div>
                    <div className="text-lg font-semibold text-gray-800">
                      {siteStructure.children[0]?.children.length || 0}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-xs text-gray-500">Profondeur</div>
                    <div className="text-lg font-semibold text-gray-800">
                      1 niveau
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-500 font-medium">
                Analysez un site pour voir sa structure
              </p>
              <p className="text-gray-400 text-sm mt-2">
                La structure du site s'affichera ici après l'analyse
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default StructureSection;
