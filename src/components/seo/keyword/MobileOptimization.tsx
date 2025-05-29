
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Smartphone, MapPin, Clock, Zap } from "lucide-react";
import { toast } from "sonner";
import { KeywordSuggestion } from "@/types/seo/Keyword";
import { MobileOptimization as MobileOptimizationType } from "@/types/seo";

interface MobileOptimizationProps {
  keywords: KeywordSuggestion[];
}

const MobileOptimization: React.FC<MobileOptimizationProps> = ({ keywords }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mobileResults, setMobileResults] = useState<MobileOptimizationType[]>([]);
  const [mobileInsights, setMobileInsights] = useState<any>({});

  const analyzeMobileOptimization = async () => {
    if (keywords.length === 0) {
      toast.error("Aucun mot-clé à analyser");
      return;
    }

    setIsAnalyzing(true);

    // Simulation d'analyse mobile
    setTimeout(() => {
      const mobileData: MobileOptimizationType[] = keywords.slice(0, 6).map((keyword) => {
        const desktopVolume = keyword.volume || 1000;
        const mobileVolume = Math.round(desktopVolume * (1.2 + Math.random() * 0.8)); // 120-200% du desktop
        const mobileRatio = (mobileVolume / desktopVolume) * 100;
        
        return {
          keyword: keyword.keyword,
          mobileVolume,
          mobilevsDesktop: mobileRatio,
          localSearchIntent: Math.random() > 0.6,
          voiceSearchCompatible: Math.random() > 0.5,
          mobileCompetition: Math.random() * 0.8,
          quickAnswerFormat: ['snippet', 'map', 'app', 'call'][Math.floor(Math.random() * 4)]
        };
      });

      const insights = {
        averageMobileRatio: mobileData.reduce((acc, curr) => acc + curr.mobilevsDesktop, 0) / mobileData.length,
        localSearchKeywords: mobileData.filter(k => k.localSearchIntent).length,
        voiceCompatibleKeywords: mobileData.filter(k => k.voiceSearchCompatible).length,
        highMobileTrafficKeywords: mobileData.filter(k => k.mobilevsDesktop > 150).length,
        quickAnswerOpportunities: mobileData.filter(k => k.quickAnswerFormat === 'snippet').length
      };

      setMobileResults(mobileData);
      setMobileInsights(insights);
      setIsAnalyzing(false);
      toast.success(`${mobileData.length} mots-clés analysés pour mobile`);
    }, 3000);
  };

  const getMobileRatioColor = (ratio: number) => {
    if (ratio >= 150) return 'text-green-600';
    if (ratio >= 120) return 'text-blue-600';
    if (ratio >= 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQuickAnswerIcon = (format: string) => {
    switch (format) {
      case 'snippet': return '📝';
      case 'map': return '🗺️';
      case 'app': return '📱';
      case 'call': return '📞';
      default: return '💡';
    }
  };

  const getMobileCompetitionLevel = (competition: number) => {
    if (competition >= 0.7) return { level: 'Élevée', color: 'bg-red-100 text-red-800' };
    if (competition >= 0.4) return { level: 'Moyenne', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Faible', color: 'bg-green-100 text-green-800' };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-green-500" />
          Optimisation mobile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={analyzeMobileOptimization}
          disabled={isAnalyzing || keywords.length === 0}
          className="w-full gap-2"
        >
          {isAnalyzing ? (
            <>Analyse mobile en cours...</>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Analyser l'optimisation mobile
            </>
          )}
        </Button>

        {Object.keys(mobileInsights).length > 0 && (
          <div className="p-4 bg-blue-50 rounded-lg space-y-3">
            <h4 className="font-medium text-blue-800">Insights mobile</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-600">Ratio mobile moyen:</span>
                <div className="font-bold">{mobileInsights.averageMobileRatio?.toFixed(0)}%</div>
              </div>
              <div>
                <span className="text-blue-600">Recherches locales:</span>
                <div className="font-bold">{mobileInsights.localSearchKeywords} mots-clés</div>
              </div>
              <div>
                <span className="text-blue-600">Compatible vocal:</span>
                <div className="font-bold">{mobileInsights.voiceCompatibleKeywords} mots-clés</div>
              </div>
              <div>
                <span className="text-blue-600">Fort trafic mobile:</span>
                <div className="font-bold">{mobileInsights.highMobileTrafficKeywords} mots-clés</div>
              </div>
            </div>
          </div>
        )}

        {mobileResults.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Analyse par mot-clé</h4>
            {mobileResults.map((mobile, index) => {
              const competitionData = getMobileCompetitionLevel(mobile.mobileCompetition);
              return (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h5 className="font-medium">{mobile.keyword}</h5>
                    <div className="flex gap-2">
                      {mobile.localSearchIntent && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700">
                          <MapPin className="h-3 w-3 mr-1" />
                          Local
                        </Badge>
                      )}
                      {mobile.voiceSearchCompatible && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          🎤 Vocal
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Volume mobile:</span>
                      <div className="font-medium">{mobile.mobileVolume.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Mobile vs Desktop:</span>
                      <div className={`font-medium ${getMobileRatioColor(mobile.mobilevsDesktop)}`}>
                        {mobile.mobilevsDesktop.toFixed(0)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Compétition:</span>
                      <Badge className={competitionData.color}>
                        {competitionData.level}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Format de réponse rapide:</span>
                      <div className="flex items-center gap-1">
                        <span>{getQuickAnswerIcon(mobile.quickAnswerFormat)}</span>
                        <Badge variant="secondary" className="text-xs">
                          {mobile.quickAnswerFormat}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Performance mobile</span>
                      <span>{mobile.mobilevsDesktop.toFixed(0)}%</span>
                    </div>
                    <Progress 
                      value={Math.min(mobile.mobilevsDesktop, 200)} 
                      className="h-2"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileOptimization;
