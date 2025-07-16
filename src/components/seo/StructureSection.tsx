
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { FolderTree, Link2, ListTree, Search, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { OpenAIService } from '@/utils/openaiService';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SiteStructureChild {
  name: string;
  path?: string;
  children: any[];
}

interface SiteStructure {
  name?: string;
  children?: SiteStructureChild[];
  textContent?: string;
  url?: string;
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
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzingWithAI, setIsAnalyzingWithAI] = useState(false);
  const [hasOpenAIKey, setHasOpenAIKey] = useState(false);

  useEffect(() => {
    const apiKey = localStorage.getItem('openaiKey');
    setHasOpenAIKey(!!apiKey);
    console.log('OpenAI key status:', !!apiKey);
  }, []);

  useEffect(() => {
    // Analyser automatiquement avec OpenAI si des données sont disponibles
    if (siteStructure && siteStructure.textContent && hasOpenAIKey && !aiAnalysis) {
      console.log('Auto-starting AI analysis...');
      handleAIAnalysis();
    }
  }, [siteStructure, hasOpenAIKey]);

  const handleAIAnalysis = async () => {
    if (!siteStructure || !siteStructure.textContent) {
      toast.error("Aucun contenu à analyser");
      return;
    }

    if (!hasOpenAIKey) {
      toast.error("Clé API OpenAI non configurée", {
        description: "Configurez votre clé API dans les paramètres"
      });
      return;
    }

    setIsAnalyzingWithAI(true);
    try {
      console.log('Starting AI analysis for:', siteStructure.url);
      toast.info("Analyse IA en cours...", {
        description: "Extraction des mots-clés et analyse de la structure réelle"
      });

      const analysis = await OpenAIService.analyzeWebsiteStructure(
        siteStructure.textContent,
        siteStructure.url || 'Site analysé'
      );

      console.log('AI analysis completed:', analysis);
      setAiAnalysis(analysis);
      toast.success("Analyse IA terminée", {
        description: `Mots-clés extraits: ${analysis.keywords.slice(0, 3).join(', ')}`
      });
    } catch (error) {
      console.error('Erreur analyse IA:', error);
      toast.error("Erreur lors de l'analyse IA", {
        description: error instanceof Error ? error.message : "Erreur inconnue"
      });
    } finally {
      setIsAnalyzingWithAI(false);
    }
  };

  // Utiliser l'analyse IA si disponible, sinon les données de base
  const displayData = aiAnalysis || siteStructure;
  const keywords = aiAnalysis?.keywords || [];
  const recommendations = aiAnalysis?.recommendations || [];
  const mainTopic = aiAnalysis?.structure?.mainTopic || siteStructure?.name || "Site analysé";

  const handleAnalyzeClick = () => {
    if (onAnalyze) {
      onAnalyze();
    }
  };

  return (
    <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-white to-slate-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-emerald-500 rounded-full mr-3"></div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <FolderTree className="h-5 w-5 mr-2" />
            Structure du site
          </h2>
        </div>
        
        {siteStructure && hasOpenAIKey && (
          <Button
            onClick={handleAIAnalysis}
            disabled={isAnalyzingWithAI}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {isAnalyzingWithAI ? "Analyse IA..." : "Réanalyser avec IA"}
          </Button>
        )}
      </div>

      {!hasOpenAIKey && siteStructure && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Configurez votre clé API OpenAI dans les paramètres pour obtenir une analyse intelligente des mots-clés réels du site.
          </AlertDescription>
        </Alert>
      )}
      
      <p className="text-gray-600 mb-6">
        Visualisez l'architecture et l'organisation des pages de votre site web
        {aiAnalysis && " avec une analyse IA des mots-clés réels"}
      </p>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div>
          {displayData ? (
            <div className="space-y-6">
              {/* Sujet principal */}
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center mb-3">
                  <ListTree className="h-5 w-5 text-emerald-500" />
                  <h3 className="text-lg font-medium text-gray-700 ml-2">{mainTopic}</h3>
                  {aiAnalysis && (
                    <Badge variant="secondary" className="ml-2">
                      <Sparkles className="h-3 w-3 mr-1" />
                      IA - Contenu réel
                    </Badge>
                  )}
                </div>
                
                {/* Mots-clés principaux du contenu réel */}
                {keywords.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                      Mots-clés extraits du contenu réel
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {keywords.slice(0, 8).map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-emerald-50 text-emerald-700">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Structure hiérarchique */}
                <div className="pl-4 border-l-2 border-emerald-100 space-y-2">
                  <div className="font-medium text-emerald-700">
                    {siteStructure?.name || mainTopic}
                  </div>
                  {aiAnalysis?.structure?.sections ? (
                    <div className="pl-4 text-sm text-gray-600">
                      <div className="text-xs text-gray-500 mb-1">Sections identifiées:</div>
                      {aiAnalysis.structure.sections.map((section: string, index: number) => (
                        <div key={index} className="mb-1 bg-gray-50 px-2 py-1 rounded text-xs">
                          {section}
                        </div>
                      ))}
                    </div>
                  ) : siteStructure?.children && siteStructure.children[0]?.children ? (
                    <div className="pl-4 text-sm text-gray-600">
                      {siteStructure.children[0].children.slice(0, 5).map((node, index) => (
                        <div key={index} className="mb-1">{node.name}</div>
                      ))}
                      {siteStructure.children[0].children.length > 5 && (
                        <div className="text-gray-400 italic">
                          + {siteStructure.children[0].children.length - 5} autres pages
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
              
              {/* Métriques */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <Link2 className="h-5 w-5 text-blue-500" />
                    <h3 className="text-sm font-medium text-gray-700 ml-2">Analyse des liens</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-xs text-gray-500">Pages trouvées</div>
                      <div className="text-lg font-semibold text-gray-800">
                        {siteStructure?.children?.[0]?.children?.length || 0}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-xs text-gray-500">Mots-clés</div>
                      <div className="text-lg font-semibold text-gray-800">
                        {keywords.length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommandations IA */}
                {recommendations.length > 0 && (
                  <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-center mb-3">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      <h3 className="text-sm font-medium text-gray-700 ml-2">Recommandations IA</h3>
                    </div>
                    <div className="space-y-2">
                      {recommendations.slice(0, 3).map((rec, index) => (
                        <div key={index} className="text-xs text-gray-600 bg-purple-50 p-2 rounded">
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
