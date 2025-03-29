
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ExternalLink, Calendar, BarChart2 } from 'lucide-react';

const BacklinksPage = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  
  const handleAnalyze = () => {
    if (!url) return;
    
    setIsAnalyzing(true);
    
    // Simuler un temps d'analyse
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasResults(true);
    }, 1500);
  };
  
  return (
    <PageLayout title="Analyse de Backlinks" description="Analysez vos backlinks et leur qualité">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Analyse de backlinks</h1>
        
        <Card className="p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input 
              placeholder="Entrez l'URL de votre site" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              className="flex-1"
            />
            <Button 
              onClick={handleAnalyze}
              disabled={!url || isAnalyzing}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isAnalyzing ? 'Analyse en cours...' : 'Analyser les backlinks'}
            </Button>
          </div>
          
          {hasResults && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="domains">Domaines sources</TabsTrigger>
                <TabsTrigger value="links">Liens détaillés</TabsTrigger>
                <TabsTrigger value="growth">Croissance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-gray-500 text-sm">Total des backlinks</div>
                    <div className="text-2xl font-bold mt-2">1,245</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-gray-500 text-sm">Domaines référents</div>
                    <div className="text-2xl font-bold mt-2">87</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-gray-500 text-sm">Score de référencement</div>
                    <div className="text-2xl font-bold mt-2">68/100</div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Qualité des backlinks</h3>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between mb-2">
                      <span>Autorité élevée</span>
                      <span className="font-medium">24%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '24%' }}></div>
                    </div>
                    
                    <div className="flex justify-between mb-2">
                      <span>Autorité moyenne</span>
                      <span className="font-medium">56%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '56%' }}></div>
                    </div>
                    
                    <div className="flex justify-between mb-2">
                      <span>Autorité faible</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="domains">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domaine</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liens</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autorité</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">example.com</td>
                        <td className="px-6 py-4 whitespace-nowrap">18</td>
                        <td className="px-6 py-4 whitespace-nowrap">74</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">blog.com</td>
                        <td className="px-6 py-4 whitespace-nowrap">12</td>
                        <td className="px-6 py-4 whitespace-nowrap">62</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">directory.org</td>
                        <td className="px-6 py-4 whitespace-nowrap">9</td>
                        <td className="px-6 py-4 whitespace-nowrap">58</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="links">
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-blue-600">Article sur le SEO pour débutants</h4>
                          <div className="text-green-600 text-sm flex items-center mt-1">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            example{item}.com/blog/article-seo
                          </div>
                        </div>
                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          DoFollow
                        </div>
                      </div>
                      <div className="mt-3 text-gray-600 text-sm">
                        "...et pour améliorer votre SEO, consultez ce <span className="bg-yellow-100">guide complet</span> qui détaille toutes les étapes essentielles..."
                      </div>
                      <div className="mt-3 flex items-center text-gray-500 text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        Découvert le 14 mai 2023
                        <BarChart2 className="h-3 w-3 ml-4 mr-1" />
                        Autorité: 68
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="growth">
                <div className="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Graphique de croissance des backlinks au fil du temps</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </Card>
      </div>
    </PageLayout>
  );
};

export default BacklinksPage;
