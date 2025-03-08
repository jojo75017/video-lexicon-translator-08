
import React from 'react';
import { Card } from "@/components/ui/card";
import LinkBuilding from '@/components/seo/LinkBuilding';
import OrganicSearch from '@/components/seo/OrganicSearch';
import DomainOverview from '@/components/seo/DomainOverview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Search, Link2 } from 'lucide-react';

const InfoCards = () => {
  return (
    <Card className="p-6 shadow-lg bg-white border-0 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="w-1 h-6 bg-indigo-600 rounded-full mr-3"></span>
        Aperçu des performances
      </h2>
      
      <Tabs defaultValue="domain" className="w-full">
        <TabsList className="mb-6 bg-gray-50 p-1">
          <TabsTrigger value="domain" className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-indigo-600" /> 
            <span>Domaine</span>
          </TabsTrigger>
          <TabsTrigger value="organic" className="flex items-center gap-2">
            <Search className="h-4 w-4 text-green-600" /> 
            <span>Trafic organique</span>
          </TabsTrigger>
          <TabsTrigger value="backlinks" className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-blue-600" /> 
            <span>Backlinks</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="domain" className="p-4 bg-white rounded-lg border border-gray-100">
          <DomainOverview />
        </TabsContent>
        
        <TabsContent value="organic" className="p-4 bg-white rounded-lg border border-gray-100">
          <OrganicSearch />
        </TabsContent>
        
        <TabsContent value="backlinks" className="p-4 bg-white rounded-lg border border-gray-100">
          <LinkBuilding />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default InfoCards;
