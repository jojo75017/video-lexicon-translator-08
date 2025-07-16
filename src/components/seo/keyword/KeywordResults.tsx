
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, Target, TrendingUp, MessageSquare } from "lucide-react";
import { KeywordSuggestion } from '@/types/seo/Keyword';
import KeywordCard from './KeywordCard';

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
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-green-600" />
          <h2 className="text-xl font-bold">Résultats de la recherche</h2>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {totalKeywords} mots-clés trouvés
          </Badge>
        </div>
        
        <div className="flex gap-2">
          {selectedKeywords.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={clearSelectedKeywords}>
                <Trash2 className="h-4 w-4 mr-1" />
                Vider ({selectedKeywords.length})
              </Button>
              <Button size="sm" onClick={exportSelectedKeywords}>
                <Download className="h-4 w-4 mr-1" />
                Exporter CSV
              </Button>
            </>
          )}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="standard" className="flex items-center gap-1.5">
            <Target className="h-4 w-4" />
            Standard ({standardKeywords.length})
          </TabsTrigger>
          <TabsTrigger value="long-tail" className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4" />
            Longue traîne ({longTailKeywords.length})
          </TabsTrigger>
          {hasCompetitorData && (
            <TabsTrigger value="competitors" className="flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" />
              Concurrents ({competitors.length})
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="standard">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {standardKeywords.map((kw, index) => (
              <KeywordCard
                key={index}
                keywordData={kw}
                isSelected={selectedKeywords.includes(kw.keyword)}
                onToggleSelection={toggleKeywordSelection}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="long-tail">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {longTailKeywords.map((kw, index) => (
              <KeywordCard
                key={index}
                keywordData={kw}
                isSelected={selectedKeywords.includes(kw.keyword)}
                onToggleSelection={toggleKeywordSelection}
              />
            ))}
          </div>
        </TabsContent>
        
        {hasCompetitorData && (
          <TabsContent value="competitors">
            <div className="space-y-4">
              {competitors.map((competitor, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{competitor.name}</h3>
                        <p className="text-sm text-gray-600">{competitor.url}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{competitor.strength}/100</div>
                        <div className="text-xs text-gray-600">Force du domaine</div>
                      </div>
                    </div>
                  </CardContent>
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
