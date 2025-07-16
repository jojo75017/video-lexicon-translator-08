
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BarChart, ListTree } from "lucide-react";
import MetaContentGenerator from './MetaContentGenerator';
import SerpStructureAnalyzer from './SerpStructureAnalyzer';
import BrokenLinkButton from './BrokenLinkButton';

const SeoTools = () => {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Outils SEO</h1>
        <BrokenLinkButton />
      </div>
      
      <Tabs defaultValue="meta" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="meta" className="flex items-center gap-1.5">
            <Search className="h-4 w-4" />
            <span>Analyses des Méta-Tags</span>
          </TabsTrigger>
          <TabsTrigger value="serp" className="flex items-center gap-1.5">
            <ListTree className="h-4 w-4" />
            <span>Structure & SERP</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1.5">
            <BarChart className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="meta" className="space-y-6">
          <MetaContentGenerator />
        </TabsContent>
        
        <TabsContent value="serp" className="space-y-6">
          <SerpStructureAnalyzer />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
            <BarChart className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <h3 className="text-lg font-medium text-gray-500">Analytics</h3>
            <p className="text-sm text-gray-400">
              Module Analytics en cours de développement. Bientôt disponible!
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SeoTools;
