
import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Target, Users, Globe, Download, X } from 'lucide-react';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import KeywordList from './KeywordList';

interface KeywordResultsProps {
  standardKeywords: KeywordSuggestion[];
  longTailKeywords: KeywordSuggestion[];
  selectedKeywords: string[];
  competitors: any[];
  serpResults: any[];
  hasCompetitorData: boolean;
  totalKeywords: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleKeywordSelection: (keyword: string) => void;
  clearSelectedKeywords: () => void;
  exportSelectedKeywords: () => void;
  keyword: string;
}

const KeywordResults: React.FC<KeywordResultsProps> = ({
  standardKeywords,
  longTailKeywords,
  selectedKeywords,
  competitors,
  serpResults,
  hasCompetitorData,
  totalKeywords,
  activeTab,
  setActiveTab,
  toggleKeywordSelection,
  clearSelectedKeywords,
  exportSelectedKeywords,
  keyword
}) => {
  // Calculer les métriques moyennes
  const calculateAverageMetrics = () => {
    const allKeywords = [...standardKeywords, ...longTailKeywords];
    if (allKeywords.length === 0) return { avgVolume: 0, avgDifficulty: 0, avgCpc: 0 };
    
    const avgVolume = Math.round(allKeywords.reduce((sum, kw) => sum + (kw.volume || 0), 0) / allKeywords.length);
    const avgDifficulty = Math.round(allKeywords.reduce((sum, kw) => sum + (kw.difficulty || 0), 0) / allKeywords.length);
    const avgCpc = (allKeywords.reduce((sum, kw) => sum + (kw.cpc || 0), 0) / allKeywords.length).toFixed(2);
    
    return { avgVolume, avgDifficulty, avgCpc };
  };

  const { avgVolume, avgDifficulty, avgCpc } = calculateAverageMetrics();

  return (
    <Card className="p-6">
      {/* En-tête avec statistiques */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Résultats pour "{keyword}"</h2>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {totalKeywords} mots-clés trouvés
          </Badge>
        </div>
        
        {/* Métriques moyennes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Volume moyen</span>
            </div>
            <p className="text-lg font-bold text-blue-800">{avgVolume.toLocaleString()}</p>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700">Difficulté moy.</span>
            </div>
            <p className="text-lg font-bold text-yellow-800">{avgDifficulty}/100</p>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">CPC moyen</span>
            </div>
            <p className="text-lg font-bold text-green-800">{avgCpc}€</p>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Sélectionnés</span>
            </div>
            <p className="text-lg font-bold text-purple-800">{selectedKeywords.length}</p>
          </div>
        </div>
        
        {/* Actions */}
        {selectedKeywords.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
            <span className="text-sm font-medium text-gray-700">
              {selectedKeywords.length} mot(s)-clé(s) sélectionné(s):
            </span>
            <div className="flex flex-wrap gap-1">
              {selectedKeywords.slice(0, 3).map((kw, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {kw.length > 20 ? `${kw.substring(0, 20)}...` : kw}
                </Badge>
              ))}
              {selectedKeywords.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{selectedKeywords.length - 3} autres
                </Badge>
              )}
            </div>
            <div className="ml-auto flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={exportSelectedKeywords}
                className="flex items-center gap-1"
              >
                <Download className="h-3 w-3" />
                Exporter
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearSelectedKeywords}
                className="flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Effacer
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Onglets des résultats */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="standard" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Mots-clés standards ({standardKeywords.length})
          </TabsTrigger>
          <TabsTrigger value="longtail" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Longue traîne ({longTailKeywords.length})
          </TabsTrigger>
          {hasCompetitorData && (
            <TabsTrigger value="competitors" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Concurrents ({competitors.length})
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="standard">
          <KeywordList 
            keywords={standardKeywords}
            selectedKeywords={selectedKeywords}
            onToggleSelection={toggleKeywordSelection}
          />
        </TabsContent>
        
        <TabsContent value="longtail">
          <KeywordList 
            keywords={longTailKeywords}
            selectedKeywords={selectedKeywords}
            onToggleSelection={toggleKeywordSelection}
          />
        </TabsContent>
        
        {hasCompetitorData && (
          <TabsContent value="competitors">
            <div className="space-y-4">
              {competitors.map((competitor, idx) => (
                <Card key={idx} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{competitor.name}</h3>
                      <p className="text-sm text-gray-600">{competitor.url}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        <span className="font-medium">Force:</span> {competitor.strength}/100
                      </p>
                      <p className="text-sm text-gray-600">
                        {competitor.organic_traffic?.toLocaleString()} visites/mois
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </Card>
  );
};

export default KeywordResults;
