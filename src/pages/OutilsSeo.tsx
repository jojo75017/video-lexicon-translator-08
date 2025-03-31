
import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BarChart, ListTree, FileText, ArrowLeft } from "lucide-react";
import { Button } from '@/components/ui/button';
import GenerateurContenuMeta from '@/components/seo/GenerateurContenuMeta';
import AnalyseurStructureSERP from '@/components/seo/AnalyseurStructureSERP';
import AnalyseAvancee from '@/components/seo/AnalyseAvancee';
import GenerateurContenuSEO from '@/components/seo/GenerateurContenuSEO';

const OutilsSeo = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-indigo-600 hover:text-indigo-800 flex items-center">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour à l'accueil
            </Link>
            <h1 className="text-xl font-bold hidden sm:block">Outils SEO Professionnels</h1>
          </div>
          <div>
            <Button variant="outline" size="sm">
              Documentation
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto p-4 space-y-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold mb-2">Suite d'outils SEO professionnels</h1>
          <p className="text-gray-600 mb-6">
            Utilisez nos outils pour analyser et améliorer le référencement de votre site web
          </p>
          
          <Tabs defaultValue="meta" className="w-full">
            <TabsList className="mb-6 w-full justify-start bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="meta" className="flex items-center gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Search className="h-4 w-4" />
                <span>Méta-Tags</span>
              </TabsTrigger>
              <TabsTrigger value="serp" className="flex items-center gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <ListTree className="h-4 w-4" />
                <span>Structure & SERP</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <BarChart className="h-4 w-4" />
                <span>Analyse avancée</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <FileText className="h-4 w-4" />
                <span>Contenu</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="meta" className="space-y-6">
              <GenerateurContenuMeta />
            </TabsContent>
            
            <TabsContent value="serp" className="space-y-6">
              <AnalyseurStructureSERP />
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-6">
              <AnalyseAvancee />
            </TabsContent>
            
            <TabsContent value="content" className="space-y-6">
              <GenerateurContenuSEO />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default OutilsSeo;
