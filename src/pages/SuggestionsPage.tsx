
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MessageSquarePlus, Lightbulb, ArrowRight, CheckCircle2 } from 'lucide-react';

const SuggestionsPage = () => {
  const [keyword, setKeyword] = React.useState('');
  
  return (
    <PageLayout title="Suggestions de Contenu" description="Générez des idées pour votre contenu web">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Suggestions de Contenu</h1>
        
        <Card className="p-6 mb-8">
          <div className="mb-6">
            <label htmlFor="keyword-search" className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher des idées autour d'un sujet
            </label>
            <div className="flex gap-2">
              <Input
                id="keyword-search"
                placeholder="Entrez un mot-clé ou un sujet"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-1"
              />
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Search className="h-4 w-4 mr-2" />
                Générer des idées
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="topics">
            <TabsList className="mb-4">
              <TabsTrigger value="topics">Sujets</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="trending">Tendances</TabsTrigger>
              <TabsTrigger value="competitors">Concurrents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="topics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-medium text-gray-900 mb-2">
                      Comment augmenter votre visibilité sur les moteurs de recherche
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Guide complet sur les tactiques SEO pour améliorer votre classement dans les résultats de recherche.
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 text-xs text-gray-500">
                        <span>Difficulté: Moyenne</span>
                        <span>•</span>
                        <span>Volume: 2.4K</span>
                      </div>
                      <Button variant="outline" size="sm" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                        <MessageSquarePlus className="h-3.5 w-3.5 mr-1" />
                        Créer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="questions">
              <div className="space-y-4">
                {[
                  "Comment optimiser son contenu pour le SEO?",
                  "Quelle est la différence entre le SEO et le SEM?",
                  "Combien de temps faut-il pour voir les résultats SEO?",
                  "Quels sont les facteurs de classement les plus importants en 2023?",
                  "Comment faire une analyse de mots-clés efficace?"
                ].map((question, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-amber-100 p-2 text-amber-600">
                          <Lightbulb className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">{question}</h3>
                          <p className="text-gray-600 text-sm">
                            Cette question est recherchée ~850 fois par mois
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="trending">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-100">
                  <h3 className="text-lg font-medium text-indigo-900 mb-2">Tendances actuelles dans votre secteur</h3>
                  <p className="text-indigo-700 mb-4">
                    Basé sur les recherches populaires des 30 derniers jours
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="text-xl font-bold text-indigo-600">+64%</div>
                      <div className="text-gray-600 text-sm mt-1">
                        Intelligence artificielle dans le SEO
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="text-xl font-bold text-indigo-600">+42%</div>
                      <div className="text-gray-600 text-sm mt-1">
                        Expérience utilisateur et SEO
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="text-xl font-bold text-indigo-600">+38%</div>
                      <div className="text-gray-600 text-sm mt-1">
                        Référencement local pour PME
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-medium">
                    Sujets en forte croissance à explorer
                  </div>
                  <div className="divide-y divide-gray-200">
                    {[
                      "Optimisation pour la recherche vocale",
                      "Core Web Vitals et impact sur le SEO",
                      "Stratégies de contenu vidéo pour le référencement",
                      "Recherche visuelle et optimisation des images",
                      "Backlinks de qualité vs quantité en 2023"
                    ].map((topic, index) => (
                      <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50">
                        <div>{topic}</div>
                        <Button variant="ghost" size="sm" className="text-green-600">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Sélectionner
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="competitors">
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium mb-3">Sujets populaires de vos concurrents</h3>
                  <div className="space-y-3">
                    {[
                      "Guide complet: Comment faire un audit SEO en 2023",
                      "Les 10 tactiques SEO que vos concurrents utilisent",
                      "Comment créer une stratégie de contenu qui convertit",
                      "Étude de cas: Comment nous avons augmenté le trafic organique de 300%"
                    ].map((title, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium">{title}</div>
                        <div className="text-sm text-gray-500">~3.2K visiteurs/mois</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium mb-3">Opportunités à saisir</h3>
                  <div className="space-y-3">
                    {[
                      "SEO pour les petites entreprises: Guide complet",
                      "Comment créer un blog qui génère du trafic qualifié",
                      "Analyse de mots-clés: Guide étape par étape"
                    ].map((title, index) => (
                      <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-100">
                        <div className="font-medium text-green-800">{title}</div>
                        <div className="mt-1 text-sm text-green-600">
                          Faible concurrence, volume de recherche élevé
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </PageLayout>
  );
};

export default SuggestionsPage;
