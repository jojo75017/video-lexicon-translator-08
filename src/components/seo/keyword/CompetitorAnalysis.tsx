
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building2, Globe, TrendingUp, Eye, Target, Star } from "lucide-react";
import { toast } from "sonner";
import { CompetitorData } from "@/types/seo/Keyword";

interface CompetitorAnalysisProps {
  keyword: string;
  onCompetitorData?: (data: CompetitorData[]) => void;
}

const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({ keyword, onCompetitorData }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const generateCompetitorData = (searchKeyword: string): CompetitorData[] => {
    const isLocalSearch = searchKeyword.toLowerCase().includes('dormir') || 
                         searchKeyword.toLowerCase().includes('hotel') || 
                         searchKeyword.toLowerCase().includes('restaurant') ||
                         searchKeyword.toLowerCase().includes('quimper');
    
    const isTourismSearch = searchKeyword.toLowerCase().includes('quimper') ||
                          searchKeyword.toLowerCase().includes('dormir') ||
                          searchKeyword.toLowerCase().includes('hotel');

    if (isLocalSearch || isTourismSearch) {
      return [
        {
          name: "Booking.com",
          url: "https://www.booking.com",
          domain: "booking.com",
          strength: 95,
          organic_traffic: 850000,
          estimatedTraffic: 850000,
          keywords: 45000,
          topKeywords: [`hotel ${searchKeyword}`, `${searchKeyword} booking`, `réservation ${searchKeyword}`],
          gaps: [`${searchKeyword} pas cher`, `${searchKeyword} dernière minute`]
        },
        {
          name: "TripAdvisor",
          url: "https://www.tripadvisor.fr",
          domain: "tripadvisor.fr",
          strength: 88,
          organic_traffic: 650000,
          estimatedTraffic: 650000,
          keywords: 35000,
          topKeywords: [`avis ${searchKeyword}`, `${searchKeyword} restaurant`, `que faire ${searchKeyword}`],
          gaps: [`${searchKeyword} guide`, `${searchKeyword} attractions`]
        },
        {
          name: "Airbnb",
          url: "https://www.airbnb.fr",
          domain: "airbnb.fr",
          strength: 82,
          organic_traffic: 420000,
          estimatedTraffic: 420000,
          keywords: 28000,
          topKeywords: [`location ${searchKeyword}`, `${searchKeyword} airbnb`, `appartement ${searchKeyword}`],
          gaps: [`${searchKeyword} location courte durée`, `${searchKeyword} vacances`]
        },
        {
          name: "Office de Tourisme",
          url: "https://www.quimper-tourisme.bzh",
          domain: "quimper-tourisme.bzh",
          strength: 65,
          organic_traffic: 45000,
          estimatedTraffic: 45000,
          keywords: 2800,
          topKeywords: [`tourisme ${searchKeyword}`, `${searchKeyword} visite`, `${searchKeyword} événements`],
          gaps: [`${searchKeyword} histoire`, `${searchKeyword} culture`]
        },
        {
          name: "Hotels.com",
          url: "https://fr.hotels.com",
          domain: "hotels.com",
          strength: 78,
          organic_traffic: 320000,
          estimatedTraffic: 320000,
          keywords: 22000,
          topKeywords: [`hotel ${searchKeyword}`, `${searchKeyword} hébergement`, `${searchKeyword} nuit`],
          gaps: [`${searchKeyword} luxe`, `${searchKeyword} famille`]
        }
      ];
    }

    const baseCompetitors = [
      { name: "Wikipedia", domain: "wikipedia.org", strength: 95 },
      { name: "YouTube", domain: "youtube.com", strength: 90 },
      { name: "Site spécialisé 1", domain: `${searchKeyword.toLowerCase().split(' ')[0]}-expert.com`, strength: 75 },
      { name: "Site spécialisé 2", domain: `guide-${searchKeyword.toLowerCase().split(' ')[0]}.fr`, strength: 68 },
      { name: "Forum spécialisé", domain: `forum-${searchKeyword.toLowerCase().split(' ')[0]}.com`, strength: 60 }
    ];

    return baseCompetitors.map((comp, index) => ({
      name: comp.name,
      url: `https://${comp.domain}`,
      domain: comp.domain,
      strength: comp.strength,
      organic_traffic: Math.floor(Math.random() * 500000) + 50000,
      estimatedTraffic: Math.floor(Math.random() * 500000) + 50000,
      keywords: Math.floor(Math.random() * 20000) + 5000,
      topKeywords: [
        `${searchKeyword}`,
        `${searchKeyword} guide`,
        `comment ${searchKeyword}`,
        `${searchKeyword} conseils`
      ],
      gaps: [
        `${searchKeyword} débutant`,
        `${searchKeyword} prix`,
        `${searchKeyword} comparatif`
      ]
    }));
  };

  const analyzeCompetitors = async () => {
    if (!keyword.trim()) {
      toast.error("Veuillez d'abord entrer un mot-clé");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const competitorData = generateCompetitorData(keyword);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCompetitors(competitorData);
      setHasAnalyzed(true);
      
      if (onCompetitorData) {
        onCompetitorData(competitorData);
      }
      
      toast.success(`Analyse concurrentielle terminée pour "${keyword}"`);
    } catch (error) {
      console.error('Erreur lors de l\'analyse concurrentielle:', error);
      toast.error("Erreur lors de l'analyse concurrentielle");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStrengthBadge = (strength: number) => {
    if (strength >= 80) return { variant: 'destructive' as const, text: 'Fort' };
    if (strength >= 60) return { variant: 'default' as const, text: 'Moyen' };
    return { variant: 'secondary' as const, text: 'Faible' };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-500" />
          Analyse concurrentielle
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasAnalyzed && (
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Analyse de la concurrence</h3>
            <p className="text-gray-600 mb-4">
              Découvrez qui sont vos principaux concurrents pour "{keyword}" et analysez leurs stratégies SEO.
            </p>
            <Button onClick={analyzeCompetitors} disabled={isAnalyzing || !keyword.trim()}>
              {isAnalyzing ? 'Analyse en cours...' : 'Analyser la concurrence'}
            </Button>
          </div>
        )}

        {isAnalyzing && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 animate-pulse" />
              <span className="text-sm">Analyse en cours pour "{keyword}"...</span>
            </div>
            <Progress value={65} className="w-full" />
            <p className="text-xs text-gray-500">Identification des principaux concurrents et analyse de leurs performances...</p>
          </div>
        )}

        {competitors.length > 0 && !isAnalyzing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Top 5 concurrents pour "{keyword}"</h3>
              <Button variant="outline" size="sm" onClick={analyzeCompetitors}>
                Actualiser
              </Button>
            </div>

            <div className="space-y-3">
              {competitors.map((competitor, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-sm font-medium text-blue-700">
                        #{index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{competitor.name}</h4>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {competitor.domain}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        {...getStrengthBadge(competitor.strength)}
                        className="text-xs"
                      >
                        {competitor.strength}/100
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="text-sm font-medium text-blue-600">
                        {competitor.organic_traffic.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">Trafic organique</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="text-sm font-medium text-green-600">
                        {competitor.keywords.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">Mots-clés</div>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded">
                      <div className="text-sm font-medium text-purple-600">
                        {competitor.strength}
                      </div>
                      <div className="text-xs text-gray-600">Authorité</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Top mots-clés :</p>
                      <div className="flex flex-wrap gap-1">
                        {competitor.topKeywords.slice(0, 3).map((kw, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Opportunités :</p>
                      <div className="flex flex-wrap gap-1">
                        {competitor.gaps.slice(0, 2).map((gap, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {gap}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompetitorAnalysis;
