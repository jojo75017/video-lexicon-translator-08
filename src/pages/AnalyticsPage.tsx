
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import DashboardNavigation from '@/components/dashboard/DashboardNavigation';
import { BarChart2, TrendingUp, Users, Globe, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AnalyticsPage = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

    setIsLoading(true);
    
    try {
      // Formatage de l'URL
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
      }
      
      // Validation de l'URL
      new URL(formattedUrl);
      
      toast.success("Analyse démarrée", {
        description: "Patientez pendant l'analyse..."
      });

      // Simuler une analyse
      setTimeout(() => {
        const mockData = {
          pageViews: 45231,
          uniqueVisitors: 12458,
          bounceRate: 42.5,
          conversionRate: 3.2,
          trafficSources: {
            organic: 65,
            direct: 20,
            social: 8,
            referral: 7
          }
        };
        
        setAnalysisData(mockData);
        setIsLoading(false);
        toast.success("Analyse terminée avec succès");
      }, 3000);
      
    } catch (error) {
      toast.error("URL invalide", {
        description: "Veuillez entrer une URL valide (ex: https://exemple.com)"
      });
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAnalyze();
  };

  return (
    <div>
      <DashboardNavigation />
      <PageLayout
        title="Analytics Avancé"
        description="Analysez les performances et l'audience de votre site web"
      >
        <div className="space-y-6">
          <Tabs defaultValue="analyze" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="analyze" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Analyser un site
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                Performance
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
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="url" className="text-sm font-medium">URL du site</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="url"
                          type="url"
                          placeholder="https://exemple.com"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          disabled={isLoading}
                          className="pl-10"
                        />
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                      <Button 
                        type="submit"
                        disabled={isLoading || !url.trim()}
                        className="min-w-[140px] bg-blue-600 hover:bg-blue-700"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyse...
                          </>
                        ) : (
                          <>
                            <Search className="mr-2 h-4 w-4" />
                            Analyser
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>

                {/* Résultats de l'analyse */}
                {analysisData && (
                  <div className="mt-8 space-y-4">
                    <h4 className="text-lg font-semibold">Résultats de l'analyse</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Pages vues</p>
                            <p className="text-2xl font-bold">{analysisData.pageViews.toLocaleString()}</p>
                          </div>
                          <BarChart2 className="h-8 w-8 text-blue-600" />
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Visiteurs uniques</p>
                            <p className="text-2xl font-bold">{analysisData.uniqueVisitors.toLocaleString()}</p>
                          </div>
                          <Users className="h-8 w-8 text-green-600" />
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Taux de rebond</p>
                            <p className="text-2xl font-bold">{analysisData.bounceRate}%</p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-orange-600" />
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Taux de conversion</p>
                            <p className="text-2xl font-bold">{analysisData.conversionRate}%</p>
                          </div>
                          <BarChart2 className="h-8 w-8 text-purple-600" />
                        </div>
                      </Card>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="mt-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Métriques de performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <BarChart2 className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-semibold">Temps de chargement</h4>
                        <p className="text-2xl font-bold">2.3s</p>
                      </div>
                    </div>
                    <div className="text-sm text-green-600">Excellent</div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="h-8 w-8 text-green-600" />
                      <div>
                        <h4 className="font-semibold">Score de performance</h4>
                        <p className="text-2xl font-bold">87/100</p>
                      </div>
                    </div>
                    <div className="text-sm text-green-600">Très bon</div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Users className="h-8 w-8 text-purple-600" />
                      <div>
                        <h4 className="font-semibold">Optimisation mobile</h4>
                        <p className="text-2xl font-bold">92/100</p>
                      </div>
                    </div>
                    <div className="text-sm text-green-600">Excellent</div>
                  </Card>
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
