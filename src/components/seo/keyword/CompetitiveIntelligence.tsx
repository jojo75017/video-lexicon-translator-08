
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Shield, Target, TrendingUp, Users, Download } from "lucide-react";
import { toast } from "sonner";
import { KeywordSuggestion } from "@/types/seo/Keyword";

interface CompetitiveIntelligenceProps {
  keywords: KeywordSuggestion[];
}

interface CompetitorProfile {
  domain: string;
  name: string;
  authorityScore: number;
  organicKeywords: number;
  organicTraffic: number;
  paidKeywords: number;
  paidTraffic: number;
  brandStrength: number;
  contentGaps: string[];
  topKeywords: Array<{
    keyword: string;
    position: number;
    volume: number;
    difficulty: number;
  }>;
  weaknesses: string[];
  opportunities: string[];
}

interface MarketIntelligence {
  totalMarketSize: number;
  competitionLevel: 'low' | 'medium' | 'high';
  marketTrends: string[];
  entryBarriers: string[];
  keyPlayers: CompetitorProfile[];
  marketShare: Array<{
    domain: string;
    share: number;
    revenue: number;
  }>;
  seasonalFactors: string[];
}

const CompetitiveIntelligence: React.FC<CompetitiveIntelligenceProps> = ({ keywords }) => {
  const [intelligence, setIntelligence] = useState<MarketIntelligence | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [targetCompetitor, setTargetCompetitor] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');

  const generateIntelligence = async () => {
    if (keywords.length === 0) {
      toast.error("Aucun mot-clé à analyser");
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      // Génération d'intelligence concurrentielle simulée
      const competitors: CompetitorProfile[] = [
        'amazon.fr', 'leboncoin.fr', 'cdiscount.com', 'fnac.com', 'darty.com'
      ].map((domain, index) => ({
        domain,
        name: domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1),
        authorityScore: Math.floor(Math.random() * 40) + 60,
        organicKeywords: Math.floor(Math.random() * 50000) + 10000,
        organicTraffic: Math.floor(Math.random() * 1000000) + 100000,
        paidKeywords: Math.floor(Math.random() * 5000) + 1000,
        paidTraffic: Math.floor(Math.random() * 100000) + 10000,
        brandStrength: Math.floor(Math.random() * 30) + 70,
        contentGaps: [
          'Guides d\'achat détaillés',
          'Comparaisons produits',
          'Contenu vidéo',
          'Avis clients authentiques'
        ].slice(0, Math.floor(Math.random() * 3) + 2),
        topKeywords: keywords.slice(0, 5).map((kw, idx) => ({
          keyword: kw.keyword,
          position: Math.floor(Math.random() * 10) + 1,
          volume: kw.volume || 1000,
          difficulty: kw.difficulty || 50
        })),
        weaknesses: [
          'Navigation complexe',
          'Temps de chargement lent',
          'Contenu dupliqué',
          'Faible engagement social'
        ].slice(0, Math.floor(Math.random() * 3) + 1),
        opportunities: [
          'Mots-clés longue traîne sous-exploités',
          'Contenu local manquant',
          'Optimisation mobile insuffisante',
          'Stratégie vidéo absente'
        ].slice(0, Math.floor(Math.random() * 3) + 2)
      }));

      const marketData: MarketIntelligence = {
        totalMarketSize: Math.floor(Math.random() * 50000000) + 10000000,
        competitionLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        marketTrends: [
          'Croissance du mobile commerce',
          'Importance des avis clients',
          'Recherche vocale en hausse',
          'Contenu vidéo privilégié',
          'IA et personnalisation'
        ],
        entryBarriers: [
          'Forte concurrence sur les mots-clés génériques',
          'Coût d\'acquisition client élevé',
          'Autorité de domaine requise',
          'Investissement contenu important'
        ],
        keyPlayers: competitors,
        marketShare: competitors.map(comp => ({
          domain: comp.domain,
          share: Math.floor(Math.random() * 20) + 5,
          revenue: Math.floor(Math.random() * 10000000) + 1000000
        })),
        seasonalFactors: [
          'Pic d\'activité en fin d\'année',
          'Baisse estivale du trafic',
          'Rentrée scolaire forte demande',
          'Soldes et promotions'
        ]
      };

      setIntelligence(marketData);
      setIsAnalyzing(false);
      toast.success("Intelligence concurrentielle générée");
    }, 4000);
  };

  const exportIntelligence = () => {
    if (!intelligence) return;
    
    const exportData = {
      'Analyse du marché': intelligence,
      'Date d\'export': new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'intelligence-concurrentielle.json';
    link.click();
    
    toast.success('Intelligence concurrentielle exportée');
  };

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-purple-500" />
          Intelligence concurrentielle
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={generateIntelligence}
            disabled={isAnalyzing || keywords.length === 0}
            className="gap-2"
          >
            {isAnalyzing ? (
              <>Analyse en cours...</>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                Analyser la concurrence
              </>
            )}
          </Button>
          
          {intelligence && (
            <Button variant="outline" onClick={exportIntelligence} className="gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          )}
        </div>

        {intelligence && (
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="overview">Marché</TabsTrigger>
              <TabsTrigger value="competitors">Concurrents</TabsTrigger>
              <TabsTrigger value="analysis">Analyse</TabsTrigger>
              <TabsTrigger value="opportunities">Opportunités</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-700">Taille du marché</h4>
                  <p className="text-2xl font-bold text-blue-900">
                    {intelligence.totalMarketSize.toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-600">recherches/mois</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="text-sm font-medium text-purple-700">Concurrence</h4>
                  <Badge className={getCompetitionColor(intelligence.competitionLevel)}>
                    {intelligence.competitionLevel}
                  </Badge>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="text-sm font-medium text-green-700">Acteurs clés</h4>
                  <p className="text-2xl font-bold text-green-900">
                    {intelligence.keyPlayers.length}
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="text-sm font-medium text-orange-700">Parts de marché</h4>
                  <p className="text-lg font-bold text-orange-900">
                    Top {intelligence.marketShare.length}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Tendances du marché</h4>
                  <div className="grid gap-2">
                    {intelligence.marketTrends.map((trend, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{trend}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="competitors" className="space-y-4">
              <div className="space-y-4">
                {intelligence.keyPlayers.map((competitor, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{competitor.name}</h4>
                      <Badge className="bg-blue-100 text-blue-800">
                        Score: {competitor.authorityScore}/100
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Mots-clés organiques:</span>
                        <div className="font-medium">{competitor.organicKeywords.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Trafic organique:</span>
                        <div className="font-medium">{competitor.organicTraffic.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Mots-clés payants:</span>
                        <div className="font-medium">{competitor.paidKeywords.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Force de marque:</span>
                        <div className="font-medium">{competitor.brandStrength}%</div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t">
                      <Button size="sm" variant="outline">
                        Analyser en détail
                      </Button>
                      <Button size="sm">
                        Comparer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Barrières à l'entrée</h4>
                  <ul className="space-y-1">
                    {intelligence.entryBarriers.map((barrier, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-red-700">
                        <span className="text-red-500 mt-1">•</span>
                        {barrier}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Facteurs saisonniers</h4>
                  <ul className="space-y-1">
                    {intelligence.seasonalFactors.map((factor, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                        <span className="text-blue-500 mt-1">•</span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="opportunities" className="space-y-4">
              <div className="space-y-4">
                {intelligence.keyPlayers.slice(0, 3).map((competitor, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <h4 className="font-medium">Opportunités vs {competitor.name}</h4>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-green-700 mb-2">Opportunités identifiées</h5>
                        <ul className="space-y-1">
                          {competitor.opportunities.map((opp, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <Target className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              {opp}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-orange-700 mb-2">Faiblesses détectées</h5>
                        <ul className="space-y-1">
                          {competitor.weaknesses.map((weakness, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <span className="text-orange-500 mt-1">•</span>
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default CompetitiveIntelligence;
