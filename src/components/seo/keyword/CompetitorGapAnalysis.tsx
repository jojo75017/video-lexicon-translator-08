
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Target, TrendingUp, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { KeywordSuggestion } from "@/types/seo/Keyword";

interface CompetitorGapAnalysisProps {
  keywords: KeywordSuggestion[];
}

interface GapOpportunity {
  keyword: string;
  ourPosition: number | null;
  competitorPosition: number;
  competitor: string;
  volume: number;
  difficulty: number;
  opportunity: 'high' | 'medium' | 'low';
  reason: string;
}

const CompetitorGapAnalysis: React.FC<CompetitorGapAnalysisProps> = ({ keywords }) => {
  const [competitors, setCompetitors] = useState<string[]>(['']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [gaps, setGaps] = useState<GapOpportunity[]>([]);
  const [activeTab, setActiveTab] = useState('opportunities');

  const addCompetitor = () => {
    setCompetitors([...competitors, '']);
  };

  const updateCompetitor = (index: number, value: string) => {
    const newCompetitors = [...competitors];
    newCompetitors[index] = value;
    setCompetitors(newCompetitors);
  };

  const removeCompetitor = (index: number) => {
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  const analyzeGaps = async () => {
    const validCompetitors = competitors.filter(c => c.trim() !== '');
    
    if (validCompetitors.length === 0) {
      toast.error("Veuillez ajouter au moins un concurrent");
      return;
    }

    if (keywords.length === 0) {
      toast.error("Aucun mot-clé à analyser");
      return;
    }

    setIsAnalyzing(true);

    // Simulation d'analyse de gaps
    setTimeout(() => {
      const mockGaps: GapOpportunity[] = keywords.slice(0, 8).map((keyword, index) => {
        const competitor = validCompetitors[index % validCompetitors.length];
        const competitorPos = Math.floor(Math.random() * 10) + 1;
        const ourPos = Math.random() > 0.3 ? Math.floor(Math.random() * 50) + 11 : null;
        
        let opportunity: 'high' | 'medium' | 'low' = 'medium';
        let reason = '';
        
        if (!ourPos && competitorPos <= 3) {
          opportunity = 'high';
          reason = `${competitor} est dans le top 3, nous ne sommes pas classés`;
        } else if (ourPos && ourPos > competitorPos + 20) {
          opportunity = 'high';
          reason = `Écart important avec ${competitor} (${ourPos - competitorPos} positions)`;
        } else if (ourPos && ourPos > competitorPos + 10) {
          opportunity = 'medium';
          reason = `Opportunité d'amélioration face à ${competitor}`;
        } else {
          opportunity = 'low';
          reason = `Position competitive avec ${competitor}`;
        }

        return {
          keyword: keyword.keyword,
          ourPosition: ourPos,
          competitorPosition: competitorPos,
          competitor,
          volume: keyword.volume || 0,
          difficulty: keyword.difficulty || 0,
          opportunity,
          reason
        };
      });

      setGaps(mockGaps.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.opportunity] - priorityOrder[a.opportunity];
      }));
      
      setIsAnalyzing(false);
      toast.success(`${mockGaps.length} opportunités détectées`);
    }, 3000);
  };

  const getOpportunityColor = (opportunity: string) => {
    switch (opportunity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const highOpportunities = gaps.filter(g => g.opportunity === 'high');
  const mediumOpportunities = gaps.filter(g => g.opportunity === 'medium');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-red-500" />
          Analyse des gaps concurrentiels
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Concurrents à analyser</label>
          {competitors.map((competitor, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={competitor}
                onChange={(e) => updateCompetitor(index, e.target.value)}
                placeholder="concurrent.com"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeCompetitor(index)}
                disabled={competitors.length === 1}
              >
                ×
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addCompetitor}>
            + Ajouter un concurrent
          </Button>
        </div>

        <Button 
          onClick={analyzeGaps}
          disabled={isAnalyzing || keywords.length === 0}
          className="w-full gap-2"
        >
          {isAnalyzing ? (
            <>Analyse en cours...</>
          ) : (
            <>
              <Target className="h-4 w-4" />
              Analyser les gaps
            </>
          )}
        </Button>

        {gaps.length > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="opportunities" className="flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                Opportunités ({highOpportunities.length})
              </TabsTrigger>
              <TabsTrigger value="potential" className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Potentiel ({mediumOpportunities.length})
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                Tout ({gaps.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="opportunities" className="space-y-3">
              {highOpportunities.map((gap, index) => (
                <div key={index} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{gap.keyword}</span>
                    <Badge className={getOpportunityColor(gap.opportunity)}>
                      {gap.opportunity}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">{gap.reason}</div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Notre pos.:</span>
                      <span className="font-medium ml-1">
                        {gap.ourPosition ? `#${gap.ourPosition}` : 'Non classé'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Concurrent:</span>
                      <span className="font-medium ml-1">#{gap.competitorPosition}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Volume:</span>
                      <span className="font-medium ml-1">{gap.volume.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Difficulté:</span>
                      <span className="font-medium ml-1">{gap.difficulty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="potential" className="space-y-3">
              {mediumOpportunities.map((gap, index) => (
                <div key={index} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{gap.keyword}</span>
                    <Badge className={getOpportunityColor(gap.opportunity)}>
                      {gap.opportunity}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">{gap.reason}</div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Notre pos.:</span>
                      <span className="font-medium ml-1">
                        {gap.ourPosition ? `#${gap.ourPosition}` : 'Non classé'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Concurrent:</span>
                      <span className="font-medium ml-1">#{gap.competitorPosition}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Volume:</span>
                      <span className="font-medium ml-1">{gap.volume.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Difficulté:</span>
                      <span className="font-medium ml-1">{gap.difficulty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="all" className="space-y-3">
              {gaps.map((gap, index) => (
                <div key={index} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{gap.keyword}</span>
                    <Badge className={getOpportunityColor(gap.opportunity)}>
                      {gap.opportunity}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">{gap.reason}</div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Notre pos.:</span>
                      <span className="font-medium ml-1">
                        {gap.ourPosition ? `#${gap.ourPosition}` : 'Non classé'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Concurrent:</span>
                      <span className="font-medium ml-1">#{gap.competitorPosition}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Volume:</span>
                      <span className="font-medium ml-1">{gap.volume.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Difficulté:</span>
                      <span className="font-medium ml-1">{gap.difficulty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default CompetitorGapAnalysis;
