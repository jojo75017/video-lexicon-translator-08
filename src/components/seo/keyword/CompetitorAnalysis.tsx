
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, ExternalLink, Target, TrendingUp, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { CompetitorData, SerpResult } from "@/types/seo/Keyword";

interface CompetitorAnalysisProps {
  keyword?: string;
}

const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({ keyword = '' }) => {
  const [searchKeyword, setSearchKeyword] = useState(keyword);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [serpResults, setSerpResults] = useState<SerpResult[]>([]);

  const analyzeCompetitors = async () => {
    if (!searchKeyword.trim()) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulation d'analyse concurrentielle
    setTimeout(() => {
      const mockCompetitors: CompetitorData[] = [
        {
          name: 'Concurrent Leader',
          url: 'https://leader-concurrent.com',
          strength: 85,
          organic_traffic: 45000,
          keywords: ['formation professionnelle', 'cours en ligne', 'e-learning'],
          domain: 'leader-concurrent.com',
          estimatedTraffic: 45000,
          topKeywords: ['formation pro', 'cours certifiant', 'apprentissage digital'],
          gaps: ['formation rapide', 'cours intensif']
        },
        {
          name: 'Concurrent Expert',
          url: 'https://expert-formation.fr',
          strength: 72,
          organic_traffic: 28000,
          keywords: ['formation continue', 'certification', 'développement compétences'],
          domain: 'expert-formation.fr',
          estimatedTraffic: 28000,
          topKeywords: ['formation certifiante', 'apprentissage professionnel'],
          gaps: ['formation express', 'micro-learning']
        },
        {
          name: 'Plateforme Éducative',
          url: 'https://plateforme-edu.com',
          strength: 68,
          organic_traffic: 22000,
          keywords: ['cours en ligne', 'formation distance', 'e-learning'],
          domain: 'plateforme-edu.com',
          estimatedTraffic: 22000,
          topKeywords: ['formation digitale', 'cours interactifs'],
          gaps: ['formation mobile', 'apprentissage adaptatif']
        }
      ];

      const mockSerp: SerpResult[] = [
        {
          title: 'Formation Professionnelle : Guide Complet 2024',
          url: 'https://leader-concurrent.com/formation-pro',
          description: 'Découvrez les meilleures formations professionnelles. Guide complet avec conseils d\'experts.',
          position: 1
        },
        {
          title: 'Cours Certifiants en Ligne - Expert Formation',
          url: 'https://expert-formation.fr/cours-certifiants',
          description: 'Formations certifiantes reconnues. Développez vos compétences avec nos experts.',
          position: 2
        },
        {
          title: 'E-learning et Formation Distance | Plateforme Éducative',
          url: 'https://plateforme-edu.com/e-learning',
          description: 'Plateforme d\'apprentissage en ligne. Cours interactifs et formation à distance.',
          position: 3
        }
      ];

      setCompetitors(mockCompetitors);
      setSerpResults(mockSerp);
      setIsAnalyzing(false);
      toast.success(`Analyse terminée pour "${searchKeyword}"`);
    }, 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-red-500" />
          Analyse Concurrentielle Avancée
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Mot-clé à analyser..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="flex-1"
          />
          <Button onClick={analyzeCompetitors} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyse...' : 'Analyser'}
          </Button>
        </div>

        {competitors.length > 0 && (
          <Tabs defaultValue="competitors">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="competitors">Concurrents ({competitors.length})</TabsTrigger>
              <TabsTrigger value="serp">SERP Top 10 ({serpResults.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="competitors" className="space-y-4">
              {competitors.map((competitor, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{competitor.name}</h3>
                      <p className="text-sm text-gray-600">{competitor.domain}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={competitor.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Visiter
                      </a>
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="text-center p-2 bg-red-50 rounded">
                      <div className="text-red-600 font-bold">{competitor.strength}/100</div>
                      <div className="text-xs text-gray-600">Force</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="text-blue-600 font-bold">{competitor.estimatedTraffic.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Trafic/mois</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="text-green-600 font-bold">{competitor.keywords.length}</div>
                      <div className="text-xs text-gray-600">Mots-clés</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Top mots-clés:</h4>
                      <div className="flex flex-wrap gap-1">
                        {competitor.topKeywords.slice(0, 3).map((kw, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Opportunités gaps:</h4>
                      <div className="flex flex-wrap gap-1">
                        {competitor.gaps.map((gap, idx) => (
                          <Badge key={idx} className="text-xs bg-yellow-100 text-yellow-800">
                            {gap}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="serp" className="space-y-3">
              {serpResults.map((result, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">#{result.position}</Badge>
                    <div className="flex-1">
                      <h3 className="font-medium text-blue-600 hover:underline cursor-pointer mb-1">
                        {result.title}
                      </h3>
                      <p className="text-sm text-green-700 mb-2">{result.url}</p>
                      <p className="text-sm text-gray-600">{result.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default CompetitorAnalysis;
