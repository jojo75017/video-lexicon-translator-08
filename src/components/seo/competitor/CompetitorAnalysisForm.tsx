
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Users, Globe, Target } from "lucide-react";

interface CompetitorAnalysisFormProps {
  yourSite: string;
  competitor1: string;
  competitor2: string;
  isAnalyzing: boolean;
  progress: number;
  onYourSiteChange: (value: string) => void;
  onCompetitor1Change: (value: string) => void;
  onCompetitor2Change: (value: string) => void;
  onAnalyze: () => void;
}

const CompetitorAnalysisForm: React.FC<CompetitorAnalysisFormProps> = ({
  yourSite,
  competitor1,
  competitor2,
  isAnalyzing,
  progress,
  onYourSiteChange,
  onCompetitor1Change,
  onCompetitor2Change,
  onAnalyze
}) => {
  return (
    <Card className="border-t-4 border-purple-600">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-6 w-6 text-purple-600" />
          Analyse Concurrentielle Complète
        </CardTitle>
        <p className="text-gray-600">
          Analysez votre site vs 2 concurrents pour identifier toutes les opportunités de dépassement
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-green-700 mb-2 block">
              <Globe className="h-4 w-4 inline mr-1" />
              Votre site
            </label>
            <Input
              placeholder="https://votre-site-voyage.com"
              value={yourSite}
              onChange={(e) => onYourSiteChange(e.target.value)}
              className="border-green-200 focus:border-green-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-red-700 mb-2 block">
              <Target className="h-4 w-4 inline mr-1" />
              Concurrent principal
            </label>
            <Input
              placeholder="https://concurrent-leader.com"
              value={competitor1}
              onChange={(e) => onCompetitor1Change(e.target.value)}
              className="border-red-200 focus:border-red-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-blue-700 mb-2 block">
              <Target className="h-4 w-4 inline mr-1" />
              Concurrent secondaire
            </label>
            <Input
              placeholder="https://concurrent-2.com"
              value={competitor2}
              onChange={(e) => onCompetitor2Change(e.target.value)}
              className="border-blue-200 focus:border-blue-500"
            />
          </div>
        </div>

        {isAnalyzing && (
          <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between text-sm font-medium">
              <span>Analyse SEO approfondie en cours...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="text-xs text-gray-600 space-y-1">
              <p>• Analyse des mots-clés et positions</p>
              <p>• Évaluation de la force SEO technique</p>
              <p>• Identification des opportunités de dépassement</p>
              <p>• Génération de recommandations stratégiques</p>
            </div>
          </div>
        )}

        <Button 
          onClick={onAnalyze}
          disabled={isAnalyzing || !yourSite || !competitor1 || !competitor2}
          className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg"
          size="lg"
        >
          {isAnalyzing ? "Analyse en cours..." : "🚀 Analyser et trouver comment les surpasser"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CompetitorAnalysisForm;
