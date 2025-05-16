
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sparkles, BarChart3, Globe, ExternalLink } from "lucide-react";
import { KeywordSuggestion } from '@/types/seo/Keyword';
import KeywordCard from './KeywordCard';
import CompetitorAnalysis from './CompetitorAnalysis';
import SerpResults from './SerpResults';

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
  exportSelectedKeywords
}) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Résultats ({totalKeywords})</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearSelectedKeywords}
            disabled={selectedKeywords.length === 0}
          >
            Désélectionner tout ({selectedKeywords.length})
          </Button>
          <Button
            size="sm"
            onClick={exportSelectedKeywords}
            disabled={selectedKeywords.length === 0}
          >
            Exporter la sélection ({selectedKeywords.length})
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="standard" className="flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            Standards <span className="ml-1 bg-blue-100 text-blue-700 text-xs px-1.5 rounded-full">{standardKeywords.length}</span>
          </TabsTrigger>
          <TabsTrigger value="longTail" className="flex items-center gap-1">
            <BarChart3 className="w-4 h-4" />
            Longue traîne <span className="ml-1 bg-blue-100 text-blue-700 text-xs px-1.5 rounded-full">{longTailKeywords.length}</span>
          </TabsTrigger>
          {hasCompetitorData && (
            <TabsTrigger value="competitors" className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              Concurrents
            </TabsTrigger>
          )}
          {serpResults && serpResults.length > 0 && (
            <TabsTrigger value="serps" className="flex items-center gap-1">
              <ExternalLink className="w-4 h-4" />
              SERP
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="standard" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {standardKeywords.map((kw, idx) => (
              <KeywordCard 
                key={idx} 
                keywordData={kw} 
                isSelected={selectedKeywords.includes(kw.keyword)}
                onToggleSelection={toggleKeywordSelection}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="longTail" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {longTailKeywords.map((kw, idx) => (
              <KeywordCard 
                key={idx} 
                keywordData={kw} 
                isSelected={selectedKeywords.includes(kw.keyword)}
                onToggleSelection={toggleKeywordSelection}
              />
            ))}
          </div>
        </TabsContent>
        
        {hasCompetitorData && (
          <TabsContent value="competitors" className="mt-0">
            <CompetitorAnalysis competitors={competitors} />
          </TabsContent>
        )}
        
        {serpResults && serpResults.length > 0 && (
          <TabsContent value="serps" className="mt-0">
            <SerpResults serps={serpResults} />
          </TabsContent>
        )}
      </Tabs>
    </Card>
  );
};

export default KeywordResults;
