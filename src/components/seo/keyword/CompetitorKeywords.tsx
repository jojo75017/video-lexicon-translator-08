
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, ExternalLink, Target } from "lucide-react";
import { toast } from "sonner";

interface CompetitorKeywordsProps {
  onKeywordsFound: (keywords: string[]) => void;
}

const CompetitorKeywords: React.FC<CompetitorKeywordsProps> = ({ onKeywordsFound }) => {
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [competitorKeywords, setCompetitorKeywords] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeCompetitor = async () => {
    if (!competitorUrl.trim()) {
      toast.error("Veuillez entrer l'URL d'un concurrent");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulation d'analyse concurrent
    setTimeout(() => {
      const mockKeywords = [
        { keyword: 'formation professionnelle', volume: 8900, position: 3, difficulty: 65 },
        { keyword: 'cours en ligne certifiant', volume: 5400, position: 7, difficulty: 58 },
        { keyword: 'apprentissage digital', volume: 3200, position: 12, difficulty: 42 },
        { keyword: 'certification professionnelle', volume: 6700, position: 5, difficulty: 72 },
        { keyword: 'e-learning entreprise', volume: 2800, position: 8, difficulty: 55 }
      ];
      
      setCompetitorKeywords(mockKeywords);
      onKeywordsFound(mockKeywords.map(k => k.keyword));
      setIsAnalyzing(false);
      toast.success(`${mockKeywords.length} mots-clés concurrents analysés`);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-red-500" />
          Analyse concurrentielle
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="URL du concurrent (ex: concurrent.com)"
            value={competitorUrl}
            onChange={(e) => setCompetitorUrl(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={analyzeCompetitor}
            disabled={isAnalyzing}
            className="gap-2"
          >
            {isAnalyzing ? (
              <>Analyse...</>
            ) : (
              <>
                <Target className="h-4 w-4" />
                Analyser
              </>
            )}
          </Button>
        </div>

        {competitorKeywords.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Mots-clés du concurrent</h4>
              <Button 
                variant="outline" 
                size="sm"
                asChild
              >
                <a 
                  href={`https://${competitorUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Visiter
                </a>
              </Button>
            </div>
            
            <div className="space-y-2">
              {competitorKeywords.map((keyword, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{keyword.keyword}</div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span>Vol: {keyword.volume.toLocaleString()}</span>
                      <span>Pos: #{keyword.position}</span>
                      <span>Diff: {keyword.difficulty}</span>
                    </div>
                  </div>
                  <Badge 
                    variant={keyword.position <= 5 ? "default" : "secondary"}
                    className="ml-2"
                  >
                    Top {keyword.position <= 10 ? '10' : '20'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompetitorKeywords;
