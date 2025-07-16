import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Plane, Target, Fish, TrendingUp, Globe, Users, Search } from 'lucide-react';

interface SectorConfig {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  keywords: string[];
  competitors: string[];
  analysisPoints: string[];
  color: string;
}

const SECTORS: SectorConfig[] = [
  {
    id: 'health',
    name: 'Santé',
    icon: Heart,
    keywords: ['médecin', 'santé', 'hôpital', 'médicament', 'prévention', 'consultation'],
    competitors: ['doctolib.fr', 'ameli.fr', 'vidal.fr'],
    analysisPoints: [
      'Conformité réglementaire ANSM/HAS',
      'Certification HONcode',
      'Accessibilité handicap',
      'RGPD données de santé'
    ],
    color: 'text-red-600'
  },
  {
    id: 'travel',
    name: 'Voyages',
    icon: Plane,
    keywords: ['voyage', 'hotel', 'vol', 'réservation', 'destination', 'vacances'],
    competitors: ['booking.com', 'expedia.fr', 'airbnb.fr'],
    analysisPoints: [
      'Géolocalisation et cartes',
      'Système de réservation',
      'Avis clients vérifiés',
      'Multi-devises et langues'
    ],
    color: 'text-blue-600'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: Target,
    keywords: ['marketing', 'publicité', 'SEO', 'conversion', 'analytics', 'roi'],
    competitors: ['semrush.com', 'ahrefs.com', 'moz.com'],
    analysisPoints: [
      'Outils de tracking',
      'Intégrations API',
      'Tableaux de bord',
      'Automatisation'
    ],
    color: 'text-green-600'
  },
  {
    id: 'aquarium',
    name: 'Aquariophilie',
    icon: Fish,
    keywords: ['aquarium', 'poisson', 'plante aquatique', 'filtre', 'éclairage', 'eau'],
    competitors: ['zooplus.fr', 'animalis.com', 'truffaut.com'],
    analysisPoints: [
      'Fiches techniques détaillées',
      'Guides d\'entretien',
      'Calculateurs spécialisés',
      'Communauté active'
    ],
    color: 'text-cyan-600'
  }
];

interface SectorSpecificAnalyzerProps {
  urls: string[];
  onAnalysisComplete?: (results: any) => void;
}

export default function SectorSpecificAnalyzer({ urls, onAnalysisComplete }: SectorSpecificAnalyzerProps) {
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [customSector, setCustomSector] = useState('');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeSectorSpecific = async () => {
    setIsAnalyzing(true);
    
    const sector = SECTORS.find(s => s.id === selectedSector) || {
      name: customSector,
      keywords: [],
      analysisPoints: []
    };

    // Simulation d'analyse spécifique au secteur
    const results = {
      sector: sector.name,
      urls,
      sectorKeywords: sector.keywords || [],
      competitorAnalysis: urls.map(url => ({
        url,
        sectorScore: Math.floor(Math.random() * 100),
        specificFeatures: sector.analysisPoints?.slice(0, 2) || [],
        recommendations: generateSectorRecommendations(sector, url)
      })),
      opportunities: generateOpportunities(sector),
      actionPlan: generateSectorActionPlan(sector)
    };

    setAnalysisResults(results);
    onAnalysisComplete?.(results);
    setIsAnalyzing(false);
  };

  const generateSectorRecommendations = (sector: any, url: string) => {
    const baseRecs = [
      `Optimiser les mots-clés spécifiques au secteur ${sector.name}`,
      `Améliorer l'expérience utilisateur pour ${sector.name}`,
      `Développer du contenu expert en ${sector.name}`
    ];
    
    if (sector.analysisPoints) {
      return [...baseRecs, ...sector.analysisPoints.map(point => `Implémenter: ${point}`)];
    }
    
    return baseRecs;
  };

  const generateOpportunities = (sector: any) => [
    {
      title: `Niche inexploitée en ${sector.name}`,
      impact: 'High',
      effort: 'Medium',
      description: `Opportunité de se positionner sur des mots-clés long-tail spécifiques à ${sector.name}`
    },
    {
      title: 'Contenu manquant',
      impact: 'Medium',
      effort: 'Low',
      description: `Créer du contenu éducatif sur les tendances ${sector.name}`
    },
    {
      title: 'Fonctionnalité différenciante',
      impact: 'High',
      effort: 'High',
      description: `Développer une fonctionnalité unique pour le secteur ${sector.name}`
    }
  ];

  const generateSectorActionPlan = (sector: any) => [
    {
      phase: 'Court terme (1-3 mois)',
      actions: [
        `Audit SEO spécifique au secteur ${sector.name}`,
        'Optimisation des pages existantes',
        'Création de contenu ciblé'
      ]
    },
    {
      phase: 'Moyen terme (3-6 mois)',
      actions: [
        'Développement de nouvelles fonctionnalités',
        'Stratégie de backlinks sectoriels',
        'Optimisation de la conversion'
      ]
    },
    {
      phase: 'Long terme (6-12 mois)',
      actions: [
        'Expansion vers de nouveaux segments',
        'Automatisation et personnalisation',
        'Leadership d\'opinion dans le secteur'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Analyse Sectorielle Spécialisée
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SECTORS.map((sector) => {
              const IconComponent = sector.icon;
              return (
                <Button
                  key={sector.id}
                  variant={selectedSector === sector.id ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => setSelectedSector(sector.id)}
                >
                  <IconComponent className={`h-6 w-6 ${sector.color}`} />
                  <span className="text-sm">{sector.name}</span>
                </Button>
              );
            })}
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-sector">Ou définir un secteur personnalisé :</Label>
            <Input
              id="custom-sector"
              placeholder="Ex: E-commerce, Finance, Education..."
              value={customSector}
              onChange={(e) => setCustomSector(e.target.value)}
            />
          </div>

          <Button 
            onClick={analyzeSectorSpecific}
            disabled={!selectedSector && !customSector || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? 'Analyse en cours...' : 'Lancer l\'analyse sectorielle'}
          </Button>
        </CardContent>
      </Card>

      {analysisResults && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="keywords">Mots-clés secteur</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunités</TabsTrigger>
            <TabsTrigger value="action-plan">Plan d'action</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analyse Sectorielle - {analysisResults.sector}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {analysisResults.competitorAnalysis.map((comp: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold">{comp.url}</h4>
                        <Badge variant={comp.sectorScore > 70 ? "default" : "secondary"}>
                          Score: {comp.sectorScore}/100
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium">Fonctionnalités spécifiques :</p>
                          <ul className="text-sm text-muted-foreground">
                            {comp.specificFeatures.map((feature: string, i: number) => (
                              <li key={i}>• {feature}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keywords" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mots-clés Spécifiques au Secteur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysisResults.sectorKeywords.map((keyword: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-4">
            {analysisResults.opportunities.map((opp: any, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {opp.title}
                    <div className="flex gap-2">
                      <Badge variant={opp.impact === 'High' ? "default" : "secondary"}>
                        Impact: {opp.impact}
                      </Badge>
                      <Badge variant="outline">Effort: {opp.effort}</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{opp.description}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="action-plan" className="space-y-4">
            {analysisResults.actionPlan.map((phase: any, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{phase.phase}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {phase.actions.map((action: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}