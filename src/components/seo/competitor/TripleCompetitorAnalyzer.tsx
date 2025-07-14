
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { CompetitorComparison } from "@/types/seo/CompetitorData";
import { createMockAnalysisResult } from "@/utils/competitorAnalysisUtils";
import CompetitorAnalysisForm from "./CompetitorAnalysisForm";
import CompetitorOverviewTab from "./CompetitorOverviewTab";
import CompetitorKeywordsTab from "./CompetitorKeywordsTab";
import CompetitorPositionsTab from "./CompetitorPositionsTab";
import CompetitorOpportunitiesTab from "./CompetitorOpportunitiesTab";
import CompetitorActionPlanTab from "./CompetitorActionPlanTab";

const TripleCompetitorAnalyzer: React.FC = () => {
  const [yourSite, setYourSite] = useState('');
  const [competitor1, setCompetitor1] = useState('');
  const [competitor2, setCompetitor2] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<CompetitorComparison | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleAnalysis = async () => {
    if (!yourSite || !competitor1 || !competitor2) {
      toast.error("Veuillez remplir tous les champs");
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
    }, 500);

    try {
      toast.loading("Analyse complète en cours...", { id: "triple-analysis" });

      // Simulation réaliste d'analyse SEO complète
      await new Promise(resolve => setTimeout(resolve, 6000));

      const mockResult = createMockAnalysisResult(yourSite, competitor1, competitor2);

      setAnalysisResult(mockResult);
      setProgress(100);
      clearInterval(progressInterval);
      
      toast.success("Analyse terminée ! Découvrez comment surpasser vos concurrents", { 
        id: "triple-analysis",
        duration: 5000
      });
    } catch (error) {
      toast.error("Erreur lors de l'analyse", { id: "triple-analysis" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <CompetitorAnalysisForm
        yourSite={yourSite}
        competitor1={competitor1}
        competitor2={competitor2}
        isAnalyzing={isAnalyzing}
        progress={progress}
        onYourSiteChange={setYourSite}
        onCompetitor1Change={setCompetitor1}
        onCompetitor2Change={setCompetitor2}
        onAnalyze={handleAnalysis}
      />

      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Votre Plan de Bataille SEO
            </CardTitle>
            <p className="text-gray-600">
              Découvrez exactement comment surpasser vos concurrents
            </p>
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

export default TripleCompetitorAnalyzer;
