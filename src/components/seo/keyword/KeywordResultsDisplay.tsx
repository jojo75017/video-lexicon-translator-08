
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Download, Trash2 } from "lucide-react";
import { KeywordSuggestion } from "@/types/seo/Keyword";
import { toast } from "sonner";

interface KeywordResultsDisplayProps {
  keywords: KeywordSuggestion[];
  selectedKeywords: string[];
  onToggleSelection: (keyword: string) => void;
  onClearSelection: () => void;
  keyword: string;
}

const KeywordResultsDisplay: React.FC<KeywordResultsDisplayProps> = ({
  keywords,
  selectedKeywords,
  onToggleSelection,
  onClearSelection,
  keyword
}) => {
  const exportKeywords = () => {
    const selected = keywords.filter(kw => selectedKeywords.includes(kw.keyword));
    let csv = "Mot-clé,Volume,Difficulté,CPC,Type,Intention,Opportunité,Titre suggéré,Description suggérée\n";
    selected.forEach(kw => {
      csv += `"${kw.keyword}","${kw.volume}","${kw.difficulty}","${kw.cpc || 'N/A'}","${kw.type}","${kw.intent}","${kw.opportunity}%","${kw.suggestedTitle?.replace(/"/g, '""') || ''}","${kw.suggestedDescription?.replace(/"/g, '""') || ''}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mots-cles-${keyword.replace(/\s+/g, '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${selectedKeywords.length} mots-clés exportés`);
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'text-green-600';
    if (difficulty < 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ai-generated': return 'bg-purple-100 text-purple-800';
      case 'long-tail': return 'bg-blue-100 text-blue-800';
      case 'semantic': return 'bg-orange-100 text-orange-800';
      case 'question': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (keywords.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Résultats ({keywords.length} mots-clés)
          </CardTitle>
          {selectedKeywords.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onClearSelection}>
                <Trash2 className="h-4 w-4 mr-1" />
                Vider ({selectedKeywords.length})
              </Button>
              <Button onClick={exportKeywords} size="sm">
                <Download className="h-4 w-4 mr-1" />
                Exporter CSV
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Tous ({keywords.length})</TabsTrigger>
            <TabsTrigger value="ai-generated">
              IA ({keywords.filter(k => k.type === 'ai-generated').length})
            </TabsTrigger>
            <TabsTrigger value="long-tail">
              Longue traîne ({keywords.filter(k => k.type === 'long-tail').length})
            </TabsTrigger>
            <TabsTrigger value="semantic">
              Sémantique ({keywords.filter(k => k.type === 'semantic').length})
            </TabsTrigger>
            <TabsTrigger value="question">
              Questions ({keywords.filter(k => k.type === 'question').length})
            </TabsTrigger>
          </TabsList>

          {['all', 'ai-generated', 'long-tail', 'semantic', 'question'].map(type => (
            <TabsContent key={type} value={type}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(type === 'all' ? keywords : keywords.filter(k => k.type === type)).map((kw, index) => (
                  <Card 
                    key={index} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedKeywords.includes(kw.keyword) ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => onToggleSelection(kw.keyword)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <h3 className="font-medium text-sm">{kw.keyword}</h3>
                        
                        <div className="flex gap-2">
                          <Badge className={getTypeColor(kw.type || 'standard')}>
                            {kw.type}
                          </Badge>
                          <Badge variant="outline">
                            {kw.intent}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>Vol: {kw.volume?.toLocaleString()}</div>
                          <div className={getDifficultyColor(kw.difficulty)}>
                            Diff: {kw.difficulty}/100
                          </div>
                          <div>CPC: {kw.cpc}€</div>
                          <div>Opp: {kw.opportunity}%</div>
                        </div>

                        {kw.suggestedTitle && (
                          <div className="mt-2 pt-2 border-t">
                            <p className="text-xs text-gray-600">Titre suggéré:</p>
                            <p className="text-xs font-medium line-clamp-2">{kw.suggestedTitle}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default KeywordResultsDisplay;
