
import React from 'react';
import { Card } from '@/components/ui/card';
import { SeoAnalysisResult } from '@/types/seo';
import { ListTree, Type, Heading, Quote, FileQuestion, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface HierarchySectionProps {
  isLoading: boolean;
  seoAnalysis: SeoAnalysisResult | null;
  onAnalyze?: () => void;
}

const HierarchySection: React.FC<HierarchySectionProps> = ({ 
  isLoading, 
  seoAnalysis,
  onAnalyze 
}) => {
  // Check if we have content to analyze
  const hasContent = seoAnalysis && (
    seoAnalysis.h1Count !== undefined || 
    seoAnalysis.h2Count !== undefined || 
    seoAnalysis.h3Count !== undefined ||
    seoAnalysis.wordCount !== undefined
  );

  const handleAnalyzeClick = () => {
    if (onAnalyze) {
      onAnalyze();
    } else {
      toast.info("Pour analyser un site, utilisez l'outil d'analyse SEO");
    }
  };

  return (
    <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-white to-slate-50">
      <div className="flex items-center mb-4">
        <div className="w-1 h-6 bg-amber-500 rounded-full mr-3"></div>
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <ListTree className="h-5 w-5 mr-2" />
          Structure du contenu
        </h2>
      </div>
      <p className="text-gray-600 mb-6">
        Analysez la hiérarchie et l'organisation du contenu de votre page
      </p>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      ) : (
        <div>
          {hasContent ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center mb-3">
                  <Heading className="h-5 w-5 text-amber-500" />
                  <h3 className="text-sm font-medium text-gray-700 ml-2">Titres et sous-titres</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-6 h-6 flex items-center justify-center bg-amber-100 text-amber-700 rounded-full text-xs font-medium">H1</div>
                      <span className="ml-2 text-gray-700">Titres principaux</span>
                    </div>
                    <span className="font-semibold text-gray-800">{seoAnalysis?.h1Count || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-6 h-6 flex items-center justify-center bg-amber-50 text-amber-600 rounded-full text-xs font-medium">H2</div>
                      <span className="ml-2 text-gray-700">Sous-titres</span>
                    </div>
                    <span className="font-semibold text-gray-800">{seoAnalysis?.h2Count || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-6 h-6 flex items-center justify-center bg-amber-50 text-amber-500 rounded-full text-xs font-medium">H3</div>
                      <span className="ml-2 text-gray-700">Sections</span>
                    </div>
                    <span className="font-semibold text-gray-800">{seoAnalysis?.h3Count || 0}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center mb-3">
                  <Type className="h-5 w-5 text-blue-500" />
                  <h3 className="text-sm font-medium text-gray-700 ml-2">Analyse du texte</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-500">Nombre de mots</span>
                      <span className="text-sm font-medium text-gray-700">{seoAnalysis?.wordCount || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
                        style={{ width: `${Math.min(Math.max((seoAnalysis?.wordCount || 0) / 10, 10), 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Faible</span>
                      <span>Optimal</span>
                      <span>Élevé</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-500">Lisibilité</span>
                      <span className="text-sm font-medium text-gray-700">{seoAnalysis?.readabilityScore || 0}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          (seoAnalysis?.readabilityScore || 0) > 70 
                            ? 'bg-green-500' 
                            : (seoAnalysis?.readabilityScore || 0) > 40 
                              ? 'bg-amber-500' 
                              : 'bg-red-500'
                        }`}
                        style={{ width: `${seoAnalysis?.readabilityScore || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="flex flex-col items-center justify-center">
                <FileQuestion className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-600 font-medium mb-2">
                  Aucun site web analysé
                </p>
                <p className="text-gray-400 text-sm max-w-md mb-6">
                  Pour voir la structure du contenu, commencez par analyser un site web avec l'outil d'analyse SEO
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
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default HierarchySection;
