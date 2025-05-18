
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, FileText, Megaphone, Database, LineChart } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { analyzeSearchConsoleData } from "@/utils/seo/searchConsoleAnalyzer";

interface IntegrationsSectionProps {
  isConnected?: boolean;
  onConnect?: () => void;
}

const IntegrationsSection: React.FC<IntegrationsSectionProps> = ({ 
  isConnected = false,
  onConnect
}) => {
  return (
    <Card className="shadow-md bg-white">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Database className="h-5 w-5 text-purple-600" />
          Intégrations SEO
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="search-console" className="space-y-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="search-console" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              <span className="hidden sm:inline">Search Console</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="ads" className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              <span className="hidden sm:inline">Google Ads</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="search-console">
            <div className="p-4 rounded-lg bg-slate-50 space-y-4">
              <div className="flex items-center gap-3">
                <LineChart className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-medium">Google Search Console</h3>
                  <p className="text-sm text-gray-600">Suivez vos performances dans les résultats de recherche</p>
                </div>
              </div>
              
              {isConnected ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded border space-y-1">
                    <div className="text-sm text-gray-600">Impressions (30j)</div>
                    <div className="text-xl font-bold">12,350</div>
                  </div>
                  <div className="bg-white p-3 rounded border space-y-1">
                    <div className="text-sm text-gray-600">Clics (30j)</div>
                    <div className="text-xl font-bold">1,253</div>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={onConnect}
                  className="w-full"
                >
                  <LineChart className="h-4 w-4 mr-2" />
                  Connecter Search Console
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="p-4 rounded-lg bg-slate-50 space-y-4">
              <div className="flex items-center gap-3">
                <BarChart className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-medium">Google Analytics</h3>
                  <p className="text-sm text-gray-600">Analysez le comportement des visiteurs</p>
                </div>
              </div>
              
              <Button className="w-full">
                <BarChart className="h-4 w-4 mr-2" />
                Connecter Google Analytics
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="ads">
            <div className="p-4 rounded-lg bg-slate-50 space-y-4">
              <div className="flex items-center gap-3">
                <Megaphone className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="font-medium">Google Ads</h3>
                  <p className="text-sm text-gray-600">Intégrez vos données de campagnes publicitaires</p>
                </div>
              </div>
              
              <Button className="w-full">
                <Megaphone className="h-4 w-4 mr-2" />
                Connecter Google Ads
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
            <FileText className="h-4 w-4" />
            Connectez vos outils pour débloquer des analyses avancées
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationsSection;
