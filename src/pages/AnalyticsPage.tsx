
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart3, Globe, Search, Loader2, TrendingUp, Users, Eye } from 'lucide-react';
import { toast } from 'sonner';
import DashboardNavigation from '@/components/dashboard/DashboardNavigation';

const AnalyticsPage = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

    setIsLoading(true);
    toast.info("Analyse en cours...");

    // Simuler une analyse
    setTimeout(() => {
      const mockData = {
        pageViews: 12453,
        uniqueVisitors: 8921,
        bounceRate: 42.3,
        avgSessionDuration: '2m 34s'
      };
      
      setResults(mockData);
      setIsLoading(false);
      toast.success("Analyse terminée");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavigation />
      
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Avancé</h1>
          <p className="text-gray-600">Analysez les performances de votre site web</p>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
            Analyser un site
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL du site à analyser</Label>
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
                  className="bg-blue-600 hover:bg-blue-700"
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
        </Card>

        {results && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pages vues</p>
                  <p className="text-2xl font-bold">{results.pageViews.toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Visiteurs uniques</p>
                  <p className="text-2xl font-bold">{results.uniqueVisitors.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taux de rebond</p>
                  <p className="text-2xl font-bold">{results.bounceRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Durée de session</p>
                  <p className="text-2xl font-bold">{results.avgSessionDuration}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
