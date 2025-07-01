
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface ContentGap {
  keyword: string;
  difficulty: number;
  opportunity: number;
  volume: number;
  currentRanking: number;
  competitorUrls: string[];
  suggestedContent: string;
}

const ContentGapAnalyzer: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [gaps, setGaps] = useState<ContentGap[]>([]);

  const mockGaps: ContentGap[] = [
    {
      keyword: 'guide complet SEO',
      difficulty: 65,
      opportunity: 85,
      volume: 2400,
      currentRanking: 0,
      competitorUrls: ['competitor1.com', 'competitor2.com'],
      suggestedContent: 'Article approfondi sur les techniques SEO modernes'
    },
    {
      keyword: 'optimisation technique',
      difficulty: 45,
      opportunity: 75,
      volume: 1800,
      currentRanking: 0,
      competitorUrls: ['competitor3.com'],
      suggestedContent: 'Guide technique détaillé sur l\'optimisation'
    }
  ];

  const analyzeGaps = async () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setGaps(mockGaps);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Analyse des lacunes de contenu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 mb-6">
            <Input
              placeholder="Entrez votre domaine ou mot-clé..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button onClick={analyzeGaps} disabled={isAnalyzing || !keyword}>
              {isAnalyzing ? 'Analyse...' : 'Analyser'}
            </Button>
          </div>

          {gaps.length > 0 && (
            <div className="space-y-4">
              {gaps.map((gap, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{gap.keyword}</h3>
                      <p className="text-sm text-gray-600">{gap.suggestedContent}</p>
                    </div>
                    <Badge variant={gap.currentRanking === 0 ? "destructive" : "secondary"}>
                      {gap.currentRanking === 0 ? "Manqué" : `Pos. ${gap.currentRanking}`}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">Volume</label>
                      <p className="font-medium">{gap.volume.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Difficulté</label>
                      <div className="flex items-center gap-2">
                        <Progress value={gap.difficulty} className="h-2" />
                        <span className="text-sm">{gap.difficulty}%</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Opportunité</label>
                      <div className="flex items-center gap-2">
                        <Progress value={gap.opportunity} className="h-2" />
                        <span className="text-sm">{gap.opportunity}%</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Concurrents</label>
                      <p className="text-sm">{gap.competitorUrls.length} sites</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentGapAnalyzer;
