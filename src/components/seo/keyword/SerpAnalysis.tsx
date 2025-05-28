
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Globe, TrendingUp, Eye, Clock, Star } from "lucide-react";
import { toast } from "sonner";
import { KeywordSuggestion } from "@/types/seo/Keyword";

interface SerpAnalysisProps {
  keywords: KeywordSuggestion[];
}

interface SerpResult {
  position: number;
  title: string;
  url: string;
  description: string;
  domain: string;
  authority: number;
  estimatedTraffic: number;
  titleLength: number;
  descriptionLength: number;
  hasStructuredData: boolean;
  loadTime: number;
  mobileOptimized: boolean;
}

interface SerpAnalysisData {
  keyword: string;
  totalResults: number;
  averageAuthority: number;
  averageTitleLength: number;
  averageDescriptionLength: number;
  topDomains: string[];
  results: SerpResult[];
  opportunities: string[];
}

const SerpAnalysis: React.FC<SerpAnalysisProps> = ({ keywords }) => {
  const [selectedKeyword, setSelectedKeyword] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [serpData, setSerpData] = useState<SerpAnalysisData | null>(null);

  const analyzeSerp = async (keyword: string) => {
    setIsAnalyzing(true);
    setSelectedKeyword(keyword);

    // Simulation d'analyse SERP
    setTimeout(() => {
      const mockSerpResults: SerpResult[] = Array.from({ length: 10 }, (_, index) => ({
        position: index + 1,
        title: `${keyword} - Guide complet ${index + 1}`,
        url: `https://exemple${index + 1}.com/${keyword.toLowerCase().replace(/\s+/g, '-')}`,
        description: `Découvrez tout ce qu'il faut savoir sur ${keyword}. Guide détaillé avec exemples pratiques et conseils d'experts.`,
        domain: `exemple${index + 1}.com`,
        authority: Math.floor(Math.random() * 40) + 60,
        estimatedTraffic: Math.floor(Math.random() * 5000) + 500,
        titleLength: Math.floor(Math.random() * 20) + 40,
        descriptionLength: Math.floor(Math.random() * 50) + 120,
        hasStructuredData: Math.random() > 0.5,
        loadTime: Math.random() * 2 + 1,
        mobileOptimized: Math.random() > 0.3
      }));

      const analysisData: SerpAnalysisData = {
        keyword,
        totalResults: Math.floor(Math.random() * 1000000) + 100000,
        averageAuthority: Math.floor(mockSerpResults.reduce((sum, r) => sum + r.authority, 0) / 10),
        averageTitleLength: Math.floor(mockSerpResults.reduce((sum, r) => sum + r.titleLength, 0) / 10),
        averageDescriptionLength: Math.floor(mockSerpResults.reduce((sum, r) => sum + r.descriptionLength, 0) / 10),
        topDomains: [...new Set(mockSerpResults.slice(0, 5).map(r => r.domain))],
        results: mockSerpResults,
        opportunities: generateOpportunities(mockSerpResults)
      };

      setSerpData(analysisData);
      setIsAnalyzing(false);
      toast.success("Analyse SERP terminée");
    }, 3000);
  };

  const generateOpportunities = (results: SerpResult[]): string[] => {
    const opportunities = [];
    
    const avgAuthority = results.reduce((sum, r) => sum + r.authority, 0) / results.length;
    const avgTitleLength = results.reduce((sum, r) => sum + r.titleLength, 0) / results.length;
    const mobileOptimizedCount = results.filter(r => r.mobileOptimized).length;
    const structuredDataCount = results.filter(r => r.hasStructuredData).length;

    if (avgAuthority < 70) {
      opportunities.push("Autorité de domaine moyenne faible - opportunité de positionnement");
    }
    
    if (avgTitleLength < 50) {
      opportunities.push("Titres courts en moyenne - optimiser pour des titres plus descriptifs");
    }
    
    if (mobileOptimizedCount < 8) {
      opportunities.push("Peu de sites optimisés mobile - avantage concurrentiel possible");
    }
    
    if (structuredDataCount < 6) {
      opportunities.push("Données structurées peu utilisées - opportunité de featured snippets");
    }

    return opportunities.length > 0 ? opportunities : ["SERP très compétitive - focus sur la longue traîne recommandé"];
  };

  const getAuthorityColor = (authority: number) => {
    if (authority >= 80) return 'text-red-600';
    if (authority >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-purple-500" />
          Analyse SERP en temps réel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {keywords.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Générez d'abord des mots-clés pour analyser les SERP
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sélectionner un mot-clé à analyser</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {keywords.slice(0, 6).map((keyword, index) => (
                  <Button
                    key={index}
                    variant={selectedKeyword === keyword.keyword ? "default" : "outline"}
                    size="sm"
                    onClick={() => analyzeSerp(keyword.keyword)}
                    disabled={isAnalyzing}
                    className="justify-start"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    {keyword.keyword}
                  </Button>
                ))}
              </div>
            </div>

            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Analyse en cours pour "{selectedKeyword}"...</span>
                </div>
                <Progress value={66} className="w-full" />
              </div>
            )}

            {serpData && !isAnalyzing && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                      {serpData.totalResults.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Résultats totaux</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                      {serpData.averageAuthority}
                    </div>
                    <div className="text-xs text-gray-600">Autorité moyenne</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {serpData.averageTitleLength}
                    </div>
                    <div className="text-xs text-gray-600">Caractères titre</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">
                      {serpData.averageDescriptionLength}
                    </div>
                    <div className="text-xs text-gray-600">Caractères description</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Opportunités détectées
                  </h4>
                  {serpData.opportunities.map((opportunity, index) => (
                    <div key={index} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 text-sm">
                      {opportunity}
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Top 10 résultats
                  </h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {serpData.results.map((result, index) => (
                      <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              #{result.position}
                            </Badge>
                            <span className="font-medium text-sm">{result.domain}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-medium ${getAuthorityColor(result.authority)}`}>
                              DA: {result.authority}
                            </span>
                            {result.hasStructuredData && (
                              <Badge variant="secondary" className="text-xs">Rich</Badge>
                            )}
                            {result.mobileOptimized && (
                              <Badge variant="secondary" className="text-xs">Mobile</Badge>
                            )}
                          </div>
                        </div>
                        <h5 className="font-medium text-sm text-blue-600 mb-1">
                          {result.title}
                        </h5>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {result.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {result.estimatedTraffic.toLocaleString()}/mois
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {result.loadTime.toFixed(1)}s
                            </span>
                          </div>
                          <span>
                            T: {result.titleLength} | D: {result.descriptionLength}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SerpAnalysis;
