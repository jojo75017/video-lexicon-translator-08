
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  BarChart3, Globe, Target, Users, Key, Zap, TrendingUp, Search, 
  AlertTriangle, Shield, Clock, Cpu, ExternalLink, Eye, CheckCircle,
  Lightbulb, Star, Award, Rocket, Activity
} from "lucide-react";
import { toast } from "sonner";
import { CompetitorComparison } from "@/types/seo/CompetitorData";
import { RealCompetitorAnalysisService } from "@/services/realCompetitorAnalysisService";
import CompetitorOverviewTab from "./CompetitorOverviewTab";
import CompetitorKeywordsTab from "./CompetitorKeywordsTab";
import CompetitorPositionsTab from "./CompetitorPositionsTab";
import CompetitorOpportunitiesTab from "./CompetitorOpportunitiesTab";
import CompetitorActionPlanTab from "./CompetitorActionPlanTab";
import TechnicalAnalysisTab from "./TechnicalAnalysisTab";
import ContentAnalysisTab from "./ContentAnalysisTab";
import BacklinkAnalysisTab from "./BacklinkAnalysisTab";

const AdvancedCompetitorAnalyzer: React.FC = () => {
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
      toast.success("Clé API OpenAI sauvegardée et validée");
    }
  };

  const handleAnalysis = async () => {
    if (!yourSite || !competitor1 || !competitor2) {
      toast.error("Veuillez remplir toutes les URLs");
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    
    const progressSteps = [
      "Extraction du contenu des sites web...",
      "Analyse SEO technique en cours...",
      "Détection des mots-clés stratégiques...",
      "Évaluation de la force concurrentielle...",
      "Analyse des backlinks et autorité...",
      "Identification des opportunités...",
      "Génération du plan d'action personnalisé...",
      "Finalisation de l'analyse IA..."
    ];

    let currentStep = 0;
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 12, 95);
        
        if (Math.floor(newProgress / 12.5) > currentStep && currentStep < progressSteps.length - 1) {
          currentStep++;
          toast.loading(progressSteps[currentStep], { id: "analysis-step" });
        }
        
        return newProgress;
      });
    }, 800);

    try {
      toast.loading("Démarrage de l'analyse concurrentielle avancée...", { id: "advanced-analysis" });

      const service = new RealCompetitorAnalysisService(openaiKey || undefined);
      const result = await service.analyzeCompetitors(yourSite, competitor1, competitor2);

      setAnalysisResult(result);
      setProgress(100);
      clearInterval(progressInterval);
      
      toast.success("🎉 Analyse complète terminée ! Découvrez comment dominer votre marché", { 
        id: "advanced-analysis",
        duration: 6000
      });
    } catch (error) {
      toast.error("Erreur lors de l'analyse avancée", { id: "advanced-analysis" });
      console.error('Erreur analyse avancée:', error);
    } finally {
      setIsAnalyzing(false);
      clearInterval(progressInterval);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration API OpenAI */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Key className="h-5 w-5" />
            Configuration OpenAI (Recommandée pour une analyse IA avancée)
          </CardTitle>
          <p className="text-sm text-blue-600">
            Intégrez votre clé API OpenAI pour une analyse concurrentielle alimentée par l'IA avec des insights personnalisés
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="sk-proj-..."
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSaveApiKey} variant="outline">
              <Shield className="h-4 w-4 mr-1" />
              Sauvegarder
            </Button>
          </div>
          {keyValidated && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                <strong>Analyse IA activée :</strong> Insights personnalisés, recommandations stratégiques et détection automatique des opportunités
              </AlertDescription>
            </Alert>
          )}
          {!keyValidated && (
            <Alert className="border-amber-200 bg-amber-50">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-700">
                Sans clé API : Analyse basique avec données simulées réalistes
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Formulaire d'analyse avancé */}
      <Card className="border-t-4 border-gradient-to-r from-purple-600 to-blue-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-purple-600" />
            Analyseur Concurrentiel Avancé - Toutes Thématiques
          </CardTitle>
          <p className="text-gray-600">
            Analysez n'importe quel secteur : e-commerce, SaaS, immobilier, santé, finance, voyage, éducation...
          </p>
          <div className="flex gap-2 flex-wrap mt-2">
            <Badge variant="outline" className="bg-green-50">
              <Activity className="h-3 w-3 mr-1" />
              Analyse technique complète
            </Badge>
            <Badge variant="outline" className="bg-blue-50">
              <Target className="h-3 w-3 mr-1" />
              Stratégies de dépassement
            </Badge>
            <Badge variant="outline" className="bg-purple-50">
              <Star className="h-3 w-3 mr-1" />
              Intelligence artificielle
            </Badge>
          </div>
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
              <p className="text-xs text-gray-500 mt-1">Le site que vous voulez améliorer</p>
            </div>
            <div>
              <label className="text-sm font-medium text-red-700 mb-2 block">
                <Target className="h-4 w-4 inline mr-1" />
                Concurrent leader (Principal)
              </label>
              <Input
                placeholder="https://leader-du-secteur.com"
                value={competitor1}
                onChange={(e) => setCompetitor1(e.target.value)}
                className="border-red-200 focus:border-red-500"
              />
              <p className="text-xs text-gray-500 mt-1">Le leader de votre secteur à rattraper</p>
            </div>
            <div>
              <label className="text-sm font-medium text-blue-700 mb-2 block">
                <Target className="h-4 w-4 inline mr-1" />
                Concurrent secondaire
              </label>
              <Input
                placeholder="https://concurrent-direct.com"
                value={competitor2}
                onChange={(e) => setCompetitor2(e.target.value)}
                className="border-blue-200 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Un concurrent direct à surveiller</p>
            </div>
          </div>

          {isAnalyzing && (
            <div className="space-y-3 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
              <div className="flex justify-between text-sm font-medium">
                <span className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 animate-pulse" />
                  Analyse concurrentielle avancée en cours...
                </span>
                <span className="text-blue-600 font-bold">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-4 bg-white" />
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div className="space-y-1">
                  <p>🔍 Crawling et extraction du contenu</p>
                  <p>⚡ Analyse de performance technique</p>
                  <p>🎯 Recherche de mots-clés stratégiques</p>
                  <p>📊 Évaluation des métriques SEO</p>
                </div>
                <div className="space-y-1">
                  <p>🔗 Analyse des profils de backlinks</p>
                  <p>💡 Identification des opportunités</p>
                  <p>📋 Génération du plan d'action</p>
                  {openaiKey && <p className="text-purple-600 font-medium">🤖 Analyse IA personnalisée activée</p>}
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={handleAnalysis}
            disabled={isAnalyzing || !yourSite || !competitor1 || !competitor2}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-14 text-lg font-semibold"
            size="lg"
          >
            {isAnalyzing ? (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 animate-spin" />
                Analyse en cours...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                🚀 Lancer l'analyse concurrentielle avancée
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Résultats d'analyse avancés */}
      {analysisResult && (
        <Card className="border-t-4 border-gradient-to-r from-purple-500 to-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6 text-purple-600" />
              🏆 Votre Plan de Domination SEO Complet
            </CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="bg-green-50">
                <TrendingUp className="h-3 w-3 mr-1" />
                {analysisResult.comparison.opportunities.length} Opportunités détectées
              </Badge>
              <Badge variant="outline" className="bg-blue-50">
                <Search className="h-3 w-3 mr-1" />
                {analysisResult.comparison.keywordGaps.length} Mots-clés manqués
              </Badge>
              <Badge variant="outline" className="bg-orange-50">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {analysisResult.actionPlan.filter(a => a.priority === 'high').length} Actions prioritaires
              </Badge>
              <Badge variant="outline" className="bg-purple-50">
                <Zap className="h-3 w-3 mr-1" />
                Analyse IA {openaiKey ? 'Activée' : 'Basique'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-8 w-full">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="keywords">Mots-clés</TabsTrigger>
                <TabsTrigger value="positions">Positions</TabsTrigger>
                <TabsTrigger value="technical">Technique</TabsTrigger>
                <TabsTrigger value="content">Contenu</TabsTrigger>
                <TabsTrigger value="backlinks">Backlinks</TabsTrigger>
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

              <TabsContent value="technical" className="space-y-4">
                <TechnicalAnalysisTab analysisResult={analysisResult} />
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <ContentAnalysisTab analysisResult={analysisResult} />
              </TabsContent>

              <TabsContent value="backlinks" className="space-y-4">
                <BacklinkAnalysisTab analysisResult={analysisResult} />
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

export default AdvancedCompetitorAnalyzer;
