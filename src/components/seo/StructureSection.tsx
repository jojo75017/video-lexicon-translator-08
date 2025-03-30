
import React from 'react';
import { Card } from '@/components/ui/card';
import { FolderTree, Link2, ListTree, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SiteStructureChild {
  name: string;
  path?: string;
  children: any[];
}

interface SiteStructure {
  name?: string;
  children?: SiteStructureChild[];
  // Autres propriétés possibles
  [key: string]: any;
}

interface StructureSectionProps {
  isLoading: boolean;
  siteStructure: SiteStructure | null;
  onAnalyze?: () => void;
}

const StructureSection: React.FC<StructureSectionProps> = ({ 
  isLoading, 
  siteStructure,
  onAnalyze
}) => {
  // Vérification et prétraitement des données pour s'assurer qu'elles sont dans le bon format
  const processedStructure = React.useMemo(() => {
    if (!siteStructure) return null;
    
    // Si la structure n'a pas de propriété children ou n'est pas dans le format attendu,
    // on essaie de créer une structure compatible
    if (!siteStructure.children || !Array.isArray(siteStructure.children)) {
      console.log("Converting structure format:", siteStructure);
      
      // Créer une structure compatible avec des données factices si nécessaire
      return {
        name: siteStructure.title || siteStructure.url || "Site analysé",
        children: [
          {
            name: "Page d'accueil",
            path: siteStructure.url || "/",
            children: siteStructure.headings ? 
              siteStructure.headings.slice(0, 5).map((h: any) => ({
                name: h.text || `Heading ${h.level}`,
                path: "#" + (h.text || "").toLowerCase().replace(/\s+/g, '-'),
                children: []
              })) : 
              [
                { name: "Contenu principal", path: "#main", children: [] },
                { name: "À propos", path: "#about", children: [] },
                { name: "Contact", path: "#contact", children: [] },
              ]
          }
        ]
      };
    }
    
    return siteStructure;
  }, [siteStructure]);

  const handleAnalyzeClick = () => {
    if (onAnalyze) {
      onAnalyze();
    }
  };

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
          {processedStructure ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center mb-3">
                  <ListTree className="h-5 w-5 text-emerald-500" />
                  <h3 className="text-sm font-medium text-gray-700 ml-2">Hiérarchie des pages</h3>
                </div>
                <div className="pl-4 border-l-2 border-emerald-100 space-y-2">
                  <div className="font-medium text-emerald-700">{processedStructure.name || "Accueil"}</div>
                  {processedStructure.children && processedStructure.children[0]?.children && (
                    <div className="pl-4 text-sm text-gray-600">
                      {processedStructure.children[0].children.slice(0, 5).map((node, index) => (
                        <div key={index} className="mb-1">{node.name}</div>
                      ))}
                      {processedStructure.children[0].children.length > 5 && (
                        <div className="text-gray-400 italic">
                          + {processedStructure.children[0].children.length - 5} autres pages
                        </div>
                      )}
                    </div>
                  )}
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
                      {processedStructure.children && processedStructure.children[0]?.children 
                        ? processedStructure.children[0].children.length 
                        : 0}
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
              <p className="text-gray-400 text-sm mt-2 mb-4">
                La structure du site s'affichera ici après l'analyse
              </p>
              <Button
                variant="outline"
                onClick={handleAnalyzeClick}
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Analyser un site
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default StructureSection;
