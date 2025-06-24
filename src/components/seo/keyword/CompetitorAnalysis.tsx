
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Users, ExternalLink, Target, TrendingUp, AlertTriangle, Eye, BarChart3, Share2, Download } from "lucide-react";
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
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);

  const analyzeCompetitors = async () => {
    if (!searchKeyword.trim()) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulation d'analyse concurrentielle avec plus de données
    setTimeout(() => {
      const mockCompetitors: CompetitorData[] = [
        {
          name: 'FormationPro Leader',
          url: 'https://formation-pro-leader.com',
          strength: 92,
          organic_traffic: 85000,
          keywords: ['formation professionnelle', 'cours en ligne certifiants', 'e-learning pro', 'formation continue'],
          domain: 'formation-pro-leader.com',
          estimatedTraffic: 85000,
          topKeywords: ['formation professionnelle certifiée', 'cours pro en ligne', 'certification métier'],
          gaps: ['formation accélérée', 'micro-apprentissage', 'formation IA']
        },
        {
          name: 'École Digitale Expert',
          url: 'https://ecole-digitale-expert.fr',
          strength: 78,
          organic_traffic: 52000,
          keywords: ['formation numérique', 'cours digital', 'apprentissage en ligne', 'école virtuelle'],
          domain: 'ecole-digitale-expert.fr',
          estimatedTraffic: 52000,
          topKeywords: ['formation digitale certifiante', 'cours interactifs en ligne'],
          gaps: ['formation mobile', 'réalité virtuelle formation', 'gamification']
        },
        {
          name: 'Campus Virtuel Pro',
          url: 'https://campus-virtuel-pro.com',
          strength: 71,
          organic_traffic: 38000,
          keywords: ['campus en ligne', 'université virtuelle', 'formation à distance'],
          domain: 'campus-virtuel-pro.com',
          estimatedTraffic: 38000,
          topKeywords: ['campus numérique', 'formation universitaire en ligne'],
          gaps: ['formation express', 'cours du soir en ligne']
        },
        {
          name: 'Skills Academy',
          url: 'https://skills-academy.fr',
          strength: 65,
          organic_traffic: 29000,
          keywords: ['développement compétences', 'academy formation', 'skills training'],
          domain: 'skills-academy.fr',
          estimatedTraffic: 29000,
          topKeywords: ['développement skills', 'formation compétences'],
          gaps: ['soft skills formation', 'leadership training']
        },
        {
          name: 'Learn & Work Platform',
          url: 'https://learn-work-platform.com',
          strength: 58,
          organic_traffic: 21000,
          keywords: ['formation travail', 'learn at work', 'corporate training'],
          domain: 'learn-work-platform.com',
          estimatedTraffic: 21000,
          topKeywords: ['formation entreprise', 'corporate learning'],
          gaps: ['formation télétravail', 'team building online']
        }
      ];

      const mockSerp: SerpResult[] = [
        {
          title: 'Formation Professionnelle Certifiée 2024 | Guide Complet',
          url: 'https://formation-pro-leader.com/formation-certifiee',
          description: 'Découvrez nos formations professionnelles certifiées. Plus de 50 domaines, experts reconnus, certification officielle garantie.',
          position: 1
        },
        {
          title: 'Cours en Ligne Professionnels - École Digitale Expert',
          url: 'https://ecole-digitale-expert.fr/cours-pro',
          description: 'Formations professionnelles 100% en ligne. Accompagnement personnalisé, diplômes reconnus, financement CPF disponible.',
          position: 2
        },
        {
          title: 'Campus Virtuel Pro : Votre Formation à Distance',
          url: 'https://campus-virtuel-pro.com/formation-distance',
          description: 'Formation professionnelle à distance avec suivi individualisé. Plus de 10 000 apprenants satisfaits.',
          position: 3
        },
        {
          title: 'Skills Academy | Développez Vos Compétences Pro',
          url: 'https://skills-academy.fr/competences',
          description: 'Académie de formation pour développer vos compétences professionnelles. Méthodes innovantes et certifications.',
          position: 4
        },
        {
          title: 'Learn & Work Platform - Formation Entreprise',
          url: 'https://learn-work-platform.com/entreprise',
          description: 'Solutions de formation pour entreprises. Programmes sur-mesure, ROI mesurable, accompagnement expert.',
          position: 5
        }
      ];

      setCompetitors(mockCompetitors);
      setSerpResults(mockSerp);
      setIsAnalyzing(false);
      toast.success(`Analyse terminée pour "${searchKeyword}" - ${mockCompetitors.length} concurrents identifiés`);
    }, 3000);
  };

  const exportCompetitorData = () => {
    const csvContent = [
      'Nom,Domaine,Force,Trafic Organique,Mots-clés Top,Opportunités',
      ...competitors.map(comp => 
        `"${comp.name}","${comp.domain}",${comp.strength},${comp.estimatedTraffic},"${comp.topKeywords.join('; ')}","${comp.gaps.join('; ')}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analyse-concurrents-${searchKeyword.replace(/\s+/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Données concurrents exportées');
  };

  const getStrengthLevel = (strength: number) => {
    if (strength >= 90) return { label: 'Dominant', color: 'bg-red-500', textColor: 'text-red-600' };
    if (strength >= 75) return { label: 'Fort', color: 'bg-orange-500', textColor: 'text-orange-600' };
    if (strength >= 60) return { label: 'Moyen', color: 'bg-yellow-500', textColor: 'text-yellow-600' };
    return { label: 'Faible', color: 'bg-green-500', textColor: 'text-green-600' };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-red-500" />
          Analyse Concurrentielle Avancée
          {competitors.length > 0 && (
            <Badge className="bg-blue-100 text-blue-800">
              {competitors.length} concurrents analysés
            </Badge>
          )}
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
          {competitors.length > 0 && (
            <Button variant="outline" onClick={exportCompetitorData}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          )}
        </div>

        {competitors.length > 0 && (
          <Tabs defaultValue="competitors">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="competitors">Concurrents ({competitors.length})</TabsTrigger>
              <TabsTrigger value="serp">SERP Analysis ({serpResults.length})</TabsTrigger>
              <TabsTrigger value="opportunities">Opportunités</TabsTrigger>
            </TabsList>

            <TabsContent value="competitors" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {competitors.map((competitor, index) => {
                  const strengthInfo = getStrengthLevel(competitor.strength);
                  return (
                    <Card 
                      key={index} 
                      className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                        selectedCompetitor === competitor.domain ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedCompetitor(
                        selectedCompetitor === competitor.domain ? null : competitor.domain
                      )}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{competitor.name}</h3>
                            <p className="text-sm text-gray-600">{competitor.domain}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={competitor.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Visiter
                              </a>
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              Analyser
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">Force du domaine</span>
                              <Badge className={`${strengthInfo.textColor} bg-opacity-20`}>
                                {strengthInfo.label}
                              </Badge>
                            </div>
                            <Progress 
                              value={competitor.strength} 
                              className="h-2"
                            />
                            <p className="text-xs text-gray-500 mt-1">{competitor.strength}/100</p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-2 bg-blue-50 rounded">
                              <div className="text-blue-600 font-bold">{competitor.estimatedTraffic.toLocaleString()}</div>
                              <div className="text-xs text-gray-600">Trafic/mois</div>
                            </div>
                            <div className="text-center p-2 bg-green-50 rounded">
                              <div className="text-green-600 font-bold">{competitor.keywords.length}</div>
                              <div className="text-xs text-gray-600">Mots-clés</div>
                            </div>
                          </div>
                        </div>

                        {selectedCompetitor === competitor.domain && (
                          <div className="space-y-3 pt-3 border-t">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Top mots-clés:</h4>
                              <div className="flex flex-wrap gap-1">
                                {competitor.topKeywords.map((kw, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {kw}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Opportunités gaps:</h4>
                              <div className="flex flex-wrap gap-1">
                                {competitor.gaps.map((gap, idx) => (
                                  <Badge key={idx} className="text-xs bg-yellow-100 text-yellow-800">
                                    {gap}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
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
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="opportunities" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Gaps détectés
                  </h3>
                  <div className="space-y-2">
                    {competitors.flatMap(comp => comp.gaps).slice(0, 8).map((gap, idx) => (
                      <div key={idx} className="p-2 bg-orange-50 border border-orange-200 rounded">
                        <span className="text-sm font-medium">{gap}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          Opportunité
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Tendances marché
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded">
                      <div className="font-medium text-sm">Formation en ligne</div>
                      <div className="text-xs text-gray-600">Croissance +45% cette année</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <div className="font-medium text-sm">Certification professionnelle</div>
                      <div className="text-xs text-gray-600">Demande forte +32%</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded">
                      <div className="font-medium text-sm">Formation IA/Tech</div>
                      <div className="text-xs text-gray-600">Secteur émergent +78%</div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default CompetitorAnalysis;
