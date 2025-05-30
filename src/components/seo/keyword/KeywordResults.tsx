
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
  console.log('KeywordResults - activeTab:', activeTab);
  console.log('KeywordResults - standardKeywords length:', standardKeywords.length);
  console.log('KeywordResults - longTailKeywords length:', longTailKeywords.length);
  
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger 
            value="standard" 
            className="flex items-center gap-1"
            onClick={() => {
              console.log('Clicking standard tab');
              setActiveTab('standard');
            }}
          >
            <Sparkles className="h-4 w-4" />
            <span>Standards</span>
          </TabsTrigger>
          <TabsTrigger 
            value="long-tail" 
            className="flex items-center gap-1"
            onClick={() => {
              console.log('Clicking long-tail tab');
              setActiveTab('long-tail');
            }}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Longue traîne</span>
          </TabsTrigger>
          <TabsTrigger 
            value="view" 
            className="flex items-center gap-1"
            onClick={() => {
              console.log('Clicking view tab');
              setActiveTab('view');
            }}
          >
            <Table2 className="h-4 w-4" />
            <span>Vue tableau</span>
          </TabsTrigger>
          {hasCompetitorData && (
            <TabsTrigger 
              value="competitors" 
              className="flex items-center gap-1"
              onClick={() => {
                console.log('Clicking competitors tab');
                setActiveTab('competitors');
              }}
            >
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
