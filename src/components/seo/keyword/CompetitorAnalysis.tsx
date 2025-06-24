
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
    
    // Simulation d'analyse concurrentielle avec données réalistes aquariophilie
    setTimeout(() => {
      const mockCompetitors: CompetitorData[] = [
        {
          name: 'Aquashop',
          url: 'https://www.aquashop.fr',
          strength: 87,
          organic_traffic: 125000,
          keywords: ['aquarium', 'poisson tropical', 'aquariophilie', 'pompe aquarium'],
          domain: 'aquashop.fr',
          estimatedTraffic: 125000,
          topKeywords: ['aquarium pas cher', 'poisson rouge', 'pompe à air aquarium'],
          gaps: ['aquascaping', 'plantes aquatiques rares', 'éclairage LED']
        },
        {
          name: 'Poisson d\'Or',
          url: 'https://www.poissondor.com',
          strength: 79,
          organic_traffic: 85000,
          keywords: ['poisson exotique', 'aquarium tropical', 'nourriture poisson'],
          domain: 'poissondor.com',
          estimatedTraffic: 85000,
          topKeywords: ['guppy', 'néon bleu', 'aquarium 100L'],
          gaps: ['aquarium marin', 'coraux', 'osmoseur']
        },
        {
          name: 'Zoomalia',
          url: 'https://www.zoomalia.com',
          strength: 92,
          organic_traffic: 280000,
          keywords: ['animalerie en ligne', 'aquarium complet', 'accessoires aquarium'],
          domain: 'zoomalia.com',
          estimatedTraffic: 280000,
          topKeywords: ['aquarium 60L', 'filtre externe', 'chauffage aquarium'],
          gaps: ['aquarium nano', 'crevettes aquarium', 'mousses aquatiques']
        },
        {
          name: 'Truffaut Aquariophilie',
          url: 'https://www.truffaut.com/aquariophilie',
          strength: 85,
          organic_traffic: 95000,
          keywords: ['plantes aquarium', 'décoration aquarium', 'substrat aquarium'],
          domain: 'truffaut.com',
          estimatedTraffic: 95000,
          topKeywords: ['aquarium débutant', 'poisson facile', 'kit aquarium'],
          gaps: ['aquarium biotope', 'poissons rares', 'reproduction poissons']
        },
        {
          name: 'Animalis Aquarium',
          url: 'https://www.animalis.com/aquariophilie',
          strength: 74,
          organic_traffic: 62000,
          keywords: ['aquarium design', 'meuble aquarium', 'éclairage aquarium'],
          domain: 'animalis.com',
          estimatedTraffic: 62000,
          topKeywords: ['aquarium sur mesure', 'maintenance aquarium', 'test eau'],
          gaps: ['aquarium connecté', 'automatisation', 'monitoring pH']
        }
      ];

      const mockSerp: SerpResult[] = [
        {
          title: 'Aquashop - Spécialiste Aquariophilie | Aquariums & Poissons',
          url: 'https://www.aquashop.fr/aquarium-complet',
          description: 'Découvrez notre gamme complète d\'aquariums, poissons tropicaux et accessoires. Livraison rapide, conseils d\'experts aquariophiles.',
          position: 1
        },
        {
          title: 'Poisson d\'Or - Aquariophilie Premium | Poissons Exotiques',
          url: 'https://www.poissondor.com/aquarium-tropical',
          description: 'Spécialiste des poissons exotiques et aquariums tropicaux. Plus de 200 espèces, matériel professionnel, conseils personnalisés.',
          position: 2
        },
        {
          title: 'Zoomalia Aquariophilie - Tout pour votre Aquarium',
          url: 'https://www.zoomalia.com/animalerie/aquariophilie',
          description: 'Animalerie en ligne : aquariums, filtres, pompes, poissons. Livraison gratuite dès 39€. Conseils vétérinaires inclus.',
          position: 3
        },
        {
          title: 'Truffaut Aquariophilie - Jardinerie & Aquariums',
          url: 'https://www.truffaut.com/aquariophilie/aquarium-eau-douce',
          description: 'Aquariums eau douce et marine, plantes aquatiques, poissons colorés. Magasins Truffaut partout en France.',
          position: 4
        },
        {
          title: 'Animalis - Aquarium & Poissons | Animalerie Spécialisée',
          url: 'https://www.animalis.com/aquariophilie/aquarium-complet',
          description: 'Aquariums design, poissons d\'eau douce et marine. Service installation à domicile. Garantie satisfaction.',
          position: 5
        }
      ];

      setCompetitors(mockCompetitors);
      setSerpResults(mockSerp);
      setIsAnalyzing(false);
      toast.success(`Analyse terminée pour "${searchKeyword}" - ${mockCompetitors.length} concurrents aquariophilie identifiés`);
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
    a.download = `analyse-concurrents-aquariophilie-${searchKeyword.replace(/\s+/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Données concurrents aquariophilie exportées');
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
          Analyse Concurrentielle Aquariophilie
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
            placeholder="Mot-clé aquariophilie à analyser..."
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
                    Gaps détectés - Aquariophilie
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
                    Tendances Aquariophilie
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded">
                      <div className="font-medium text-sm">Aquascaping</div>
                      <div className="text-xs text-gray-600">Croissance +65% cette année</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <div className="font-medium text-sm">Aquarium nano</div>
                      <div className="text-xs text-gray-600">Demande forte +48%</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded">
                      <div className="font-medium text-sm">Aquarium connecté</div>
                      <div className="text-xs text-gray-600">Secteur émergent +95%</div>
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
