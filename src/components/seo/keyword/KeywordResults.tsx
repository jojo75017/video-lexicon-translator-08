import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Download, 
  Trash2, 
  Filter, 
  Sparkles,
  List,
  Table2,
  BarChart3,
  Building2,
  Lightbulb
} from 'lucide-react';
import KeywordTable from './KeywordTable';
import KeywordList from './KeywordList';
import CompetitorAnalysis from './CompetitorAnalysis';

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
  keyword: string; // Ajout du mot-clé principal
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
  // Fonction pour afficher le type de mot-clé
  const getKeywordTypeDisplay = (type: string) => {
    switch (type) {
      case 'standard':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Standard</Badge>;
      case 'long-tail':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Longue traîne</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };
  
  // Fonction pour afficher l'intention du mot-clé
  const getKeywordIntentDisplay = (intent: string | undefined) => {
    if (!intent) return null;
    
    switch (intent) {
      case 'informational':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Informationnel</Badge>;
      case 'navigational':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Navigationnel</Badge>;
      case 'transactional':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Transactionnel</Badge>;
      case 'commercial':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Commercial</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2 items-center">
          <h2 className="text-xl font-bold">Résultats ({totalKeywords})</h2>
          <Badge variant="secondary" className="ml-2">
            {selectedKeywords.length} sélectionné{selectedKeywords.length > 1 ? 's' : ''}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={clearSelectedKeywords}
            disabled={selectedKeywords.length === 0}
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Effacer</span>
          </Button>
          
          <Button 
            variant="secondary" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={exportSelectedKeywords}
            disabled={selectedKeywords.length === 0}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exporter</span>
          </Button>
        </div>
      </div>
      
      <Tabs className="space-y-5" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="standard" className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            <span>Standards</span>
          </TabsTrigger>
          <TabsTrigger value="long-tail" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span>Longue traîne</span>
          </TabsTrigger>
          <TabsTrigger value="view" className="flex items-center gap-1">
            <Table2 className="h-4 w-4" />
            <span>Vue tableau</span>
          </TabsTrigger>
          {hasCompetitorData && (
            <TabsTrigger value="competitors" className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              <span>Concurrents</span>
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="standard" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Mots-clés standards ({standardKeywords.length})</h3>
          </div>
          
          <KeywordList 
            keywords={standardKeywords} 
            selectedKeywords={selectedKeywords}
            toggleKeywordSelection={toggleKeywordSelection}
          />
        </TabsContent>
        
        <TabsContent value="long-tail" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Mots-clés longue traîne ({longTailKeywords.length})</h3>
          </div>
          
          <KeywordList 
            keywords={longTailKeywords} 
            selectedKeywords={selectedKeywords}
            toggleKeywordSelection={toggleKeywordSelection}
          />
        </TabsContent>
        
        <TabsContent value="view" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Vue d'ensemble</h3>
          </div>
          
          <div className="overflow-x-auto">
            <KeywordTable 
              keywords={[...standardKeywords, ...longTailKeywords]} 
              selectedKeywords={selectedKeywords}
              toggleKeywordSelection={toggleKeywordSelection}
            />
          </div>
        </TabsContent>
        
        {hasCompetitorData && (
          <TabsContent value="competitors" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Analyse concurrentielle</h3>
            </div>
            
            <CompetitorAnalysis 
              competitors={competitors} 
              keyword={keyword}
            />
          </TabsContent>
        )}
      </Tabs>
    </Card>
  );
};

export default KeywordResults;
