
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Heading, List, Paragraph, Type, FileQuestion, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SeoAnalysisResult {
  h1Count?: number;
  h2Count?: number;
  h3Count?: number;
  wordCount?: number;
  readabilityScore?: number;
  hierarchy?: any[];
  [key: string]: any;
}

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
  const [showHierarchy, setShowHierarchy] = useState(false);

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
          <List className="h-5 w-5 mr-2" />
          Hiérarchie du contenu
        </h2>
      </div>
      <p className="text-gray-600 mb-6">
        Analysez les balises de titre et l'organisation du contenu de votre page
      </p>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      ) : (
        <div>
          {hasContent ? (
            <div className="space-y-6">
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

              {/* Bouton pour afficher la hiérarchie détaillée */}
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setShowHierarchy(!showHierarchy)}
                  className="flex items-center gap-2"
                >
                  <List className="h-4 w-4" />
                  {showHierarchy ? "Masquer la hiérarchie" : "Afficher la hiérarchie du contenu"}
                </Button>
              </div>

              {/* Section pour la hiérarchie détaillée */}
              {showHierarchy && seoAnalysis?.hierarchy && seoAnalysis.hierarchy.length > 0 && (
                <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm mt-4 max-h-[350px] overflow-y-auto">
                  <div className="flex items-center mb-3">
                    <Paragraph className="h-5 w-5 text-green-500" />
                    <h3 className="text-sm font-medium text-gray-700 ml-2">Hiérarchie des éléments</h3>
                  </div>
                  <HierarchyItems items={seoAnalysis.hierarchy} />
                </div>
              )}
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

// Composant pour afficher récursivement les éléments de la hiérarchie
const HierarchyItems = ({ items }: { items: any[] }) => {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <HierarchyItem key={index} item={item} level={0} />
      ))}
    </div>
  );
};

const HierarchyItem = ({ item, level }: { item: any, level: number }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const getTagBadge = () => {
    switch(item.tagName) {
      case 'h1': return 'bg-blue-100 text-blue-800';
      case 'h2': return 'bg-green-100 text-green-800';
      case 'h3': return 'bg-amber-100 text-amber-800';
      case 'h4': return 'bg-purple-100 text-purple-800';
      case 'h5': return 'bg-pink-100 text-pink-800';
      case 'h6': return 'bg-red-100 text-red-800';
      case 'p': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const hasChildren = item.children && item.children.length > 0;
  
  return (
    <div className={`ml-${level * 4}`}>
      <div className="flex items-start">
        {hasChildren && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="p-1 rounded hover:bg-gray-100"
          >
            {isExpanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            )}
          </button>
        )}
        {!hasChildren && <div className="w-6"></div>}
        <div>
          <div className="flex items-center">
            <span className={`inline-block px-2 py-0.5 text-xs rounded ${getTagBadge()}`}>
              {item.tagName}
            </span>
            <span className="ml-2 text-sm">{item.text}</span>
          </div>
          {isExpanded && hasChildren && (
            <div className="pl-4 mt-2 border-l border-gray-200">
              {item.children.map((child: any, childIndex: number) => (
                <HierarchyItem key={childIndex} item={child} level={level + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HierarchySection;
