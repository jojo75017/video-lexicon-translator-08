
import React from 'react';
import { Card } from "@/components/ui/card";
import LinkBuilding from '@/components/seo/LinkBuilding';
import OrganicSearch from '@/components/seo/OrganicSearch';
import DomainOverview from '@/components/seo/DomainOverview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const InfoCards = () => {
  return (
    <Card className="p-6 shadow-lg bg-white border-0 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Aperçu des performances</h2>
      
      <Tabs defaultValue="domain" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="domain">Domaine</TabsTrigger>
          <TabsTrigger value="organic">Trafic organique</TabsTrigger>
          <TabsTrigger value="backlinks">Backlinks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="domain" className="p-4 bg-gray-50 rounded-lg">
          <DomainOverview />
        </TabsContent>
        
        <TabsContent value="organic" className="p-4 bg-gray-50 rounded-lg">
          <OrganicSearch />
        </TabsContent>
        
        <TabsContent value="backlinks" className="p-4 bg-gray-50 rounded-lg">
          <LinkBuilding />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default InfoCards;
