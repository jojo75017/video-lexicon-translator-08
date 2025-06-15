
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CrawlForm } from '@/components/CrawlForm';
import EnhancedAnalytics from '@/components/seo/EnhancedAnalytics';
import DashboardNavigation from '@/components/dashboard/DashboardNavigation';
import { BarChart2, TrendingUp, Users, Globe } from 'lucide-react';

const AnalyticsPage = () => {
  return (
    <div>
      <DashboardNavigation />
      <PageLayout
        title="Analytics Avancé"
        description="Analysez les performances et l'audience de votre site web"
      >
        <div className="space-y-6">
          <Tabs defaultValue="analyze" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analyze" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Analyser un site
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="audience" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Audience
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analyze" className="mt-6">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Analyse d'un site web</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Entrez l'URL d'un site web pour obtenir une analyse complète de ses performances, 
                  de son SEO et de son audience.
                </p>
                <CrawlForm />
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="mt-6">
              <EnhancedAnalytics />
            </TabsContent>

            <TabsContent value="audience" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">Visiteurs uniques</h3>
                      <p className="text-2xl font-bold">12,458</p>
                    </div>
                  </div>
                  <div className="text-sm text-green-600">+15% vs mois précédent</div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold">Pages vues</h3>
                      <p className="text-2xl font-bold">45,231</p>
                    </div>
                  </div>
                  <div className="text-sm text-green-600">+8% vs mois précédent</div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart2 className="h-8 w-8 text-purple-600" />
                    <div>
                      <h3 className="font-semibold">Taux de rebond</h3>
                      <p className="text-2xl font-bold">42%</p>
                    </div>
                  </div>
                  <div className="text-sm text-red-600">-5% vs mois précédent</div>
                </Card>
              </div>

              <Card className="p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Sources de trafic</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Recherche organique</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Trafic direct</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Réseaux sociaux</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Autres sources</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-gray-600 h-2 rounded-full" style={{ width: '5%' }}></div>
                      </div>
                      <span className="text-sm font-medium">5%</span>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageLayout>
    </div>
  );
};

export default AnalyticsPage;
