
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdvancedCompetitorAnalyzer from '@/components/seo/competitor/AdvancedCompetitorAnalyzer';
import SectorSpecificAnalyzer from '@/components/seo/competitor/SectorSpecificAnalyzer';
import SerpAnalyzer from '@/components/seo/serp/SerpAnalyzer';

const CompetitorAnalysisPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <header className="bg-white/80 backdrop-blur-sm border-b p-4 mb-6">
        <div className="container mx-auto flex items-center">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour au tableau de bord
            </Button>
          </Link>
          <h1 className="ml-4 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Analyseur Concurrentiel Avancé - Toutes Thématiques
          </h1>
        </div>
      </header>
      
      <div className="container mx-auto pb-10">
        <Card className="p-6 mb-6 border-purple-500 border-t-4 bg-gradient-to-r from-purple-50/50 to-blue-50/50">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🚀 Analyseur Concurrentiel Professionnel avec IA
          </h2>
          <p className="text-gray-600 mb-6">
            L'outil le plus complet pour dominer votre marché : analyse technique, contenu, backlinks, 
            opportunités et plan d'action personnalisé par intelligence artificielle.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-700 mb-2">🌐 Analyse Universelle</h3>
              <p className="text-sm text-gray-600">E-commerce, SaaS, santé, finance, immobilier, voyage...</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-700 mb-2">🤖 IA OpenAI</h3>
              <p className="text-sm text-gray-600">Insights personnalisés et recommandations stratégiques</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-700 mb-2">⚡ Analyse Technique</h3>
              <p className="text-sm text-gray-600">Core Web Vitals, sécurité, mobile, SEO technique</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-orange-200">
              <h3 className="font-semibold text-orange-700 mb-2">🎯 Plan d'Action</h3>
              <p className="text-sm text-gray-600">Roadmap détaillée pour surpasser vos concurrents</p>
            </div>
          </div>
          
        <Tabs defaultValue="sector" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sector">Analyse Sectorielle</TabsTrigger>
            <TabsTrigger value="advanced">Analyse Avancée</TabsTrigger>
            <TabsTrigger value="serp">Analyse SERP</TabsTrigger>
          </TabsList>

          <TabsContent value="sector">
            <SectorSpecificAnalyzer 
              urls={[]} 
              onAnalysisComplete={(results) => console.log('Analyse terminée:', results)}
            />
          </TabsContent>

          <TabsContent value="advanced">
            <AdvancedCompetitorAnalyzer />
          </TabsContent>

          <TabsContent value="serp">
            <SerpAnalyzer />
          </TabsContent>
        </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default CompetitorAnalysisPage;
