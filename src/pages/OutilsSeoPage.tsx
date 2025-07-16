
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Wand, Link as LinkIcon, FileText } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MetaDescriptionGenerator from '@/components/seo/MetaDescriptionGenerator';
import LinkChecker from '@/components/seo/LinkChecker';
import ContentStructureTool from '@/components/seo/ContentStructureTool';

const OutilsSeoPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b p-4 mb-6">
        <div className="container mx-auto flex items-center">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour au tableau de bord
            </Button>
          </Link>
          <h1 className="ml-4 text-xl font-bold text-orange-500">Outils SEO Avancés</h1>
        </div>
      </header>
      
      <div className="container mx-auto pb-10">
        <Card className="p-6 mb-6 border-orange-500 border-t-4">
          <h2 className="text-2xl font-bold mb-2 text-orange-600">Boîte à outils SEO</h2>
          <p className="text-gray-600 mb-6">
            Utilisez ces outils spécialisés pour améliorer votre référencement et optimiser votre contenu web.
          </p>
          
          <Tabs defaultValue="meta-descriptions" className="w-full">
            <TabsList className="w-full mb-6 grid grid-cols-3 bg-orange-100">
              <TabsTrigger 
                value="meta-descriptions" 
                className="flex items-center gap-1.5 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <Wand className="h-4 w-4" />
                <span>Générateur de méta-descriptions</span>
              </TabsTrigger>
              <TabsTrigger 
                value="link-checker" 
                className="flex items-center gap-1.5 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <LinkIcon className="h-4 w-4" />
                <span>Vérificateur de liens</span>
              </TabsTrigger>
              <TabsTrigger 
                value="content-structure" 
                className="flex items-center gap-1.5 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <FileText className="h-4 w-4" />
                <span>Structure de contenu</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="meta-descriptions" className="space-y-6">
              <MetaDescriptionGenerator />
            </TabsContent>
            
            <TabsContent value="link-checker" className="space-y-6">
              <LinkChecker />
            </TabsContent>
            
            <TabsContent value="content-structure" className="space-y-6">
              <ContentStructureTool />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default OutilsSeoPage;
