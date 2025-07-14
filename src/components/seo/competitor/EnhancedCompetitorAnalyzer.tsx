
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Globe, Target, Users, Key, Zap, TrendingUp, Search, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { CompetitorComparison } from "@/types/seo/CompetitorData";
import { CompetitorAnalysisService } from "@/services/competitorAnalysisService";
import CompetitorOverviewTab from "./CompetitorOverviewTab";
import CompetitorKeywordsTab from "./CompetitorKeywordsTab";
import CompetitorPositionsTab from "./CompetitorPositionsTab";
import CompetitorOpportunitiesTab from "./CompetitorOpportunitiesTab";
import CompetitorActionPlanTab from "./CompetitorActionPlanTab";

const EnhancedCompetitorAnalyzer: React.FC = () => {
  const [yourSite, setYourSite] = useState('');
  const [competitor1, setCompetitor1] = useState('');
  const [competitor2, setCompetitor2] = useState('');
  const [openaiKey, setOpenaiKey] = useState(localStorage.getItem('openaiKey') || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<CompetitorComparison | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [keyValidated, setKeyValidated] = useState(false);

  const handleSaveApiKey = () => {
    if (openaiKey) {
      localStorage.setItem('openaiKey', openaiKey);
      setKeyValidated(true);
      toast.success("Clé API OpenAI sauvegardée");
    }
  };

  const handleAnalysis = async () => {
    if (!yourSite || !competitor1 || !competitor2) {
      toast.error("Veuillez remplir toutes les URLs");
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 800);

    try {
      toast.loading("Analyse concurrentielle approfondie en cours...", { id: "enhanced-analysis" });

      const service = new CompetitorAnalysisService(openaiKey || undefined);
      const result = await service.analyzeCompetitors(yourSite, competitor1, competitor2);

      setAnalysisResult(result);
      setProgress(100);
      clearInterval(progressInterval);
      
      toast.success("Analyse complète terminée ! Découvrez toutes vos opportunités", { 
        id: "enhanced-analysis",
        duration: 5000
      });
    } catch (error) {
      toast.error("Erreur lors de l'analyse", { id: "enhanced-analysis" });
      console.error('Erreur analyse:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration API OpenAI */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Key className="h-5 w-5" />
            Configuration OpenAI (Optionnelle)
          </CardTitle>
          <p className="text-sm text-blue-600">
            Ajoutez votre clé API OpenAI pour une analyse plus précise et personnalisée
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="sk-..."
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSaveApiKey} variant="outline">
              Sauvegarder
            </Button>
          </div>
          {keyValidated && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Zap className="h-4 w-4" />
              <span>Analyse IA activée</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Formulaire d'analyse */}
      <Card className="border-t-4 border-purple-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-600" />
            Analyse Concurrentielle Complète
          </CardTitle>
          <p className="text-gray-600">
            Analysez n'importe quelle thématique : e-commerce, voyage, santé, tech, finance...
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-green-700 mb-2 block">
                <Globe className="h-4 w-4 inline mr-1" />
                Votre site web
              </label>
              <Input
                placeholder="https://votre-site.com"
                value={yourSite}
                onChange={(e) => setYourSite(e.target.value)}
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
                onChange={(e) => setCompetitor1(e.target.value)}
                className="border-red-200 focus:border-red-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-blue-700 mb-2 block">
                <Target className="h-4 w-4 inline mr-1" />
                Concurrent secondaire
              </label>
              <Input
                placeholder="https://autre-concurrent.com"
                value={competitor2}
                onChange={(e) => setCompetitor2(e.target.value)}
                className="border-blue-200 focus:border-blue-500"
              />
            </div>
          </div>

          {isAnalyzing && (
            <div className="space-y-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
              <div className="flex justify-between text-sm font-medium">
                <span>Analyse SEO approfondie en cours...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="text-xs text-gray-600 space-y-1">
                <p>🔍 Extraction du contenu des sites web...</p>
                <p>📊 Analyse des mots-clés et positions SERP...</p>
                <p>🏆 Évaluation de la force SEO technique...</p>
                <p>💡 Identification des opportunités de dépassement...</p>
                <p>📋 Génération de recommandations stratégiques...</p>
                {openaiKey && <p>🤖 Analyse IA personnalisée activée...</p>}
              </div>
            </div>
          )}

          <Button 
            onClick={handleAnalysis}
            disabled={isAnalyzing || !yourSite || !competitor1 || !competitor2}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12 text-lg"
            size="lg"
          >
            {isAnalyzing ? "Analyse en cours..." : "🚀 Analyser et découvrir comment les surpasser"}
          </Button>
        </CardContent>
      </Card>

      {/* Résultats d'analyse */}
      {analysisResult && (
        <Card className="border-t-4 border-gradient-to-r from-purple-500 to-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Votre Plan de Bataille SEO Complet
            </CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="bg-green-50">
                <TrendingUp className="h-3 w-3 mr-1" />
                Opportunités détectées
              </Badge>
              <Badge variant="outline" className="bg-blue-50">
                <Search className="h-3 w-3 mr-1" />
                Analyse des mots-clés
              </Badge>
              <Badge variant="outline" className="bg-orange-50">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Points d'amélioration
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="keywords">Mots-clés</TabsTrigger>
                <TabsTrigger value="positions">Positions</TabsTrigger>
                <TabsTrigger value="opportunities">Opportunités</TabsTrigger>
                <TabsTrigger value="action-plan">Plan d'action</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <CompetitorOverviewTab analysisResult={analysisResult} />
              </TabsContent>

              <TabsContent value="keywords" className="space-y-4">
                <CompetitorKeywordsTab analysisResult={analysisResult} />
              </TabsContent>

              <TabsContent value="positions" className="space-y-4">
                <CompetitorPositionsTab analysisResult={analysisResult} />
              </TabsContent>

              <TabsContent value="opportunities" className="space-y-4">
                <CompetitorOpportunitiesTab analysisResult={analysisResult} />
              </TabsContent>

              <TabsContent value="action-plan" className="space-y-6">
                <CompetitorActionPlanTab analysisResult={analysisResult} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedCompetitorAnalyzer;
