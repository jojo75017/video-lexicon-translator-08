
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, TrendingUp, Target, Lightbulb, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { ContentGap } from "@/types/seo/Keyword";

const ContentGapAnalyzer = () => {
  const [domainUrl, setDomainUrl] = useState('');
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [contentGaps, setContentGaps] = useState<ContentGap[]>([]);
  const [missingTopics, setMissingTopics] = useState<any[]>([]);
  const [improvementAreas, setImprovementAreas] = useState<any[]>([]);

  const analyzeContentGaps = async () => {
    if (!domainUrl.trim() || !competitorUrl.trim()) {
      toast.error("Veuillez entrer les deux URLs à comparer");
      return;
    }

    setIsAnalyzing(true);
    
    setTimeout(() => {
      const gaps: ContentGap[] = [
        {
          keyword: 'aquarium débutant guide complet',
          searchVolume: 2400,
          difficulty: 35,
          currentRanking: null,
          competitorRanking: [2, 5, 8],
          contentSuggestion: 'Créer un guide complet pour débutants avec étapes détaillées',
          priority: 'high'
        },
        {
          keyword: 'maintenance aquarium hebdomadaire',
          searchVolume: 1800,
          difficulty: 28,
          currentRanking: 15,
          competitorRanking: [1, 3, 7],
          contentSuggestion: 'Optimiser le contenu existant avec checklist pratique',
          priority: 'high'
        },
        {
          keyword: 'poissons tropicaux compatibles',
          searchVolume: 3200,
          difficulty: 42,
          currentRanking: null,
          competitorRanking: [4, 6, 9],
          contentSuggestion: 'Créer un tableau de compatibilité interactif',
          priority: 'medium'
        },
        {
          keyword: 'aquascaping techniques avancées',
          searchVolume: 1200,
          difficulty: 55,
          currentRanking: 23,
          competitorRanking: [2, 8, 12],
          contentSuggestion: 'Développer du contenu vidéo avec tutoriels étape par étape',
          priority: 'medium'
        },
        {
          keyword: 'problèmes eau aquarium solutions',
          searchVolume: 2800,
          difficulty: 38,
          currentRanking: null,
          competitorRanking: [1, 4, 6],
          contentSuggestion: 'Créer une FAQ détaillée avec diagnostics et solutions',
          priority: 'high'
        }
      ];

      const topics = [
        {
          topic: 'Aquarium nano - Guide spécialisé',
          searchVolume: 1600,
          competition: 'Faible',
          opportunity: 88,
          reason: 'Tendance émergente, peu de contenu spécialisé'
        },
        {
          topic: 'Aquarium biotope naturel',
          searchVolume: 980,
          competition: 'Moyenne',
          opportunity: 72,
          reason: 'Niche spécialisée avec forte demande croissante'
        },
        {
          topic: 'Élevage crevettes aquarium',
          searchVolume: 1400,
          competition: 'Faible',
          opportunity: 85,
          reason: 'Marché en expansion, concurrence limitée'
        },
        {
          topic: 'Aquarium connecté domotique',
          searchVolume: 720,
          competition: 'Très faible',
          opportunity: 95,
          reason: 'Innovation technologique, premiers entrants avantagés'
        }
      ];

      const improvements = [
        {
          area: 'Contenu FAQ et Support',
          currentScore: 45,
          competitorScore: 78,
          impact: 'Élevé',
          actions: ['Créer section FAQ complète', 'Ajouter chat support', 'Guides de dépannage']
        },
        {
          area: 'Contenu Vidéo',
          currentScore: 32,
          competitorScore: 85,
          impact: 'Très élevé',
          actions: ['Tutoriels YouTube', 'Démonstrations produits', 'Témoignages clients']
        },
        {
          area: 'Contenu Débutants',
          currentScore: 58,
          competitorScore: 82,
          impact: 'Élevé',
          actions: ['Guides pas-à-pas', 'Glossaire aquariophilie', 'Kits starter recommandés']
        },
        {
          area: 'Comparatifs Produits',
          currentScore: 41,
          competitorScore: 76,
          impact: 'Moyen',
          actions: ['Tableaux comparatifs', 'Tests produits', 'Avis détaillés']
        }
      ];

      setContentGaps(gaps);
      setMissingTopics(topics);
      setImprovementAreas(improvements);
      setIsAnalyzing(false);
      toast.success("Analyse des gaps de contenu terminée");
    }, 4000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Très élevé': return 'text-red-600';
      case 'Élevé': return 'text-orange-600';
      case 'Moyen': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          Analyseur de Gaps de Contenu
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder="Votre domaine (ex: monsite.com)"
            value={domainUrl}
            onChange={(e) => setDomainUrl(e.target.value)}
          />
          <Input
            placeholder="Concurrent à analyser (ex: concurrent.com)"
            value={competitorUrl}
            onChange={(e) => setCompetitorUrl(e.target.value)}
          />
        </div>
        
        <Button onClick={analyzeContentGaps} disabled={isAnalyzing} className="w-full">
          {isAnalyzing ? 'Analyse en cours...' : 'Analyser les gaps de contenu'}
        </Button>

        {contentGaps.length > 0 && (
          <Tabs defaultValue="gaps">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="gaps">Gaps détectés ({contentGaps.length})</TabsTrigger>
              <TabsTrigger value="topics">Sujets manquants ({missingTopics.length})</TabsTrigger>
              <TabsTrigger value="improvements">Améliorations ({improvementAreas.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="gaps" className="space-y-3">
              {contentGaps.map((gap, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{gap.keyword}</h4>
                      <Badge className={getPriorityColor(gap.priority)}>
                        {gap.priority === 'high' ? 'Priorité haute' : 
                         gap.priority === 'medium' ? 'Priorité moyenne' : 'Priorité basse'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-gray-600">Volume:</span>
                        <div className="font-medium">{gap.searchVolume.toLocaleString()}/mois</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Difficulté:</span>
                        <div className="font-medium">{gap.difficulty}/100</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Position actuelle:</span>
                        <div className="font-medium">
                          {gap.currentRanking ? gap.currentRanking : 'Non classé'}
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 mb-1">Concurrents positionnés:</p>
                      <div className="flex gap-1">
                        {gap.competitorRanking.map((pos, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            #{pos}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="p-2 bg-blue-50 rounded">
                      <p className="text-xs text-blue-800">
                        <Lightbulb className="h-3 w-3 inline mr-1" />
                        {gap.contentSuggestion}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="topics" className="space-y-3">
              {missingTopics.map((topic, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{topic.topic}</h4>
                      <Badge className="bg-green-100 text-green-800">
                        {topic.opportunity}% opportunité
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Volume de recherche:</span>
                        <div className="font-medium">{topic.searchVolume.toLocaleString()}/mois</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Concurrence:</span>
                        <div className="font-medium">{topic.competition}</div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700">{topic.reason}</p>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="improvements" className="space-y-3">
              {improvementAreas.map((area, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{area.area}</h4>
                      <Badge className={getImpactColor(area.impact)}>
                        Impact {area.impact}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Votre score:</span>
                        <div className="text-lg font-bold text-red-600">{area.currentScore}%</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Score concurrent:</span>
                        <div className="text-lg font-bold text-green-600">{area.competitorScore}%</div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Actions recommandées:</p>
                      <ul className="space-y-1">
                        {area.actions.map((action: string, idx: number) => (
                          <li key={idx} className="text-sm flex items-center gap-2">
                            <Target className="h-3 w-3 text-blue-600" />
                            {action}
                          </li>
                        ))}
                      </ul>
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

export default ContentGapAnalyzer;
