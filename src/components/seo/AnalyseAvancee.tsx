
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Lock, Sparkles, Unlock, BarChart2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const AnalyseAvancee = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  const handlePremiumClick = (feature: string) => {
    setSelectedFeature(feature);
    setShowDemo(true);
  };

  const handleSubscribeClick = () => {
    setIsSubscriptionModalOpen(true);
    toast.info("Fonctionnalité Premium", {
      description: "Cette démonstration montre ce que vous obtiendriez avec un abonnement Premium."
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">
          Analyse avancée des données SEO
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="mb-4 text-gray-600">
          Les analyses avancées vous permettent d'obtenir des insights détaillés sur votre référencement et vos performances
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all">
            <div className="text-indigo-600 mb-4">
              <BarChart className="h-10 w-10" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Analyse de la concurrence</h3>
            <p className="text-sm text-gray-600 mb-4">
              Comparez votre site avec vos concurrents directs et identifiez les opportunités d'amélioration
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                Premium
              </span>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                onClick={() => handlePremiumClick('concurrence')}
              >
                <ExternalLink className="h-4 w-4 mr-1" /> Aperçu
              </Button>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all">
            <div className="text-amber-600 mb-4">
              <Sparkles className="h-10 w-10" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Intelligence artificielle</h3>
            <p className="text-sm text-gray-600 mb-4">
              Utilisez notre IA pour générer des recommandations personnalisées pour votre site
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                Premium
              </span>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-amber-600 hover:text-amber-800 hover:bg-amber-50"
                onClick={() => handlePremiumClick('ia')}
              >
                <ExternalLink className="h-4 w-4 mr-1" /> Aperçu
              </Button>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all">
            <div className="text-green-600 mb-4">
              <BarChart2 className="h-10 w-10" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Suivi des positions</h3>
            <p className="text-sm text-gray-600 mb-4">
              Suivez l'évolution de vos positions sur les moteurs de recherche au fil du temps
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">
                Premium
              </span>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-green-600 hover:text-green-800 hover:bg-green-50"
                onClick={() => handlePremiumClick('positions')}
              >
                <ExternalLink className="h-4 w-4 mr-1" /> Aperçu
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-indigo-50 p-6 rounded-lg border border-indigo-100 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-indigo-900 mb-1">Passez à la version Premium</h3>
            <p className="text-sm text-indigo-700">
              Débloquez toutes les fonctionnalités avancées et maximisez votre potentiel SEO
            </p>
          </div>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700 mt-4 md:mt-0"
            onClick={handleSubscribeClick}
          >
            Découvrir Premium
          </Button>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Fonctionnalités incluses</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <Unlock className="h-4 w-4 text-green-500 mr-2" />
                Analyse de base des méta-tags
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Unlock className="h-4 w-4 text-green-500 mr-2" />
                Structure et aperçu SERP
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Unlock className="h-4 w-4 text-green-500 mr-2" />
                Recommandations basiques
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Unlock className="h-4 w-4 text-green-500 mr-2" />
                Génération de méta-tags
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Premium exclusif</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <Lock className="h-4 w-4 text-indigo-500 mr-2" />
                Analyse de la concurrence
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Lock className="h-4 w-4 text-indigo-500 mr-2" />
                Suivi des positions
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Lock className="h-4 w-4 text-indigo-500 mr-2" />
                Audit technique complet
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Lock className="h-4 w-4 text-indigo-500 mr-2" />
                Recommandations IA avancées
              </li>
            </ul>
          </div>
        </div>

        {/* Démo des fonctionnalités Premium */}
        <Dialog open={showDemo} onOpenChange={setShowDemo}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {selectedFeature === 'concurrence' && "Démo: Analyse de la concurrence"}
                {selectedFeature === 'ia' && "Démo: Recommandations IA"}
                {selectedFeature === 'positions' && "Démo: Suivi des positions"}
              </DialogTitle>
              <DialogDescription>
                Aperçu de cette fonctionnalité Premium (démonstration uniquement)
              </DialogDescription>
            </DialogHeader>

            {selectedFeature === 'concurrence' && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Comparaison avec vos concurrents</h3>
                  <p className="text-sm text-blue-700 mb-4">
                    Cette analyse compare votre site avec 3 concurrents principaux dans votre secteur.
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Votre site</span>
                        <span className="text-sm font-medium">Score SEO: 76/100</span>
                      </div>
                      <Progress value={76} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">concurrent-1.com</span>
                        <span className="text-sm">Score SEO: 82/100</span>
                      </div>
                      <Progress value={82} className="h-2 bg-gray-100" indicatorClassName="bg-green-500" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">concurrent-2.com</span>
                        <span className="text-sm">Score SEO: 68/100</span>
                      </div>
                      <Progress value={68} className="h-2 bg-gray-100" indicatorClassName="bg-amber-500" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">concurrent-3.com</span>
                        <span className="text-sm">Score SEO: 71/100</span>
                      </div>
                      <Progress value={71} className="h-2 bg-gray-100" indicatorClassName="bg-orange-500" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-2">Mots-clés à cibler</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span>référencement naturel</span>
                        <span className="text-green-600">Opportunité élevée</span>
                      </li>
                      <li className="flex justify-between">
                        <span>améliorer seo</span>
                        <span className="text-amber-600">Opportunité moyenne</span>
                      </li>
                      <li className="flex justify-between">
                        <span>analyse concurrentielle</span>
                        <span className="text-green-600">Opportunité élevée</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-2">Avantages concurrentiels</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        <span>Backlinks: 23% moins que la moyenne</span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span>Vitesse: 18% plus rapide que la moyenne</span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                        <span>Contenu: similaire à la moyenne</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedFeature === 'ia' && (
              <div className="space-y-4">
                <Tabs defaultValue="recommandations">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="recommandations">Recommandations</TabsTrigger>
                    <TabsTrigger value="contenu">Optimisation contenu</TabsTrigger>
                    <TabsTrigger value="technique">Audit technique</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="recommandations" className="space-y-4 mt-4">
                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg">
                      <h3 className="font-medium text-amber-800 mb-2 flex items-center">
                        <Sparkles className="h-4 w-4 mr-2" /> 
                        Intelligence artificielle - Recommandations personnalisées
                      </h3>
                      <p className="text-sm text-amber-700 mb-4">
                        Notre IA a analysé votre site et celui de vos concurrents pour générer ces recommandations.
                      </p>
                      
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded border border-amber-200">
                          <h4 className="text-sm font-medium text-gray-800">Améliorez votre structure de contenu</h4>
                          <p className="text-xs text-gray-600">
                            Vos concurrents utilisent une hiérarchie de titres plus claire. Ajoutez des sous-titres H2 et H3 pour mieux structurer votre contenu.
                          </p>
                        </div>
                        
                        <div className="bg-white p-3 rounded border border-amber-200">
                          <h4 className="text-sm font-medium text-gray-800">Augmentez votre présence de mots-clés</h4>
                          <p className="text-xs text-gray-600">
                            Intégrez davantage les termes "analyse seo", "optimisation web" et "performance site" dans vos textes.
                          </p>
                        </div>
                        
                        <div className="bg-white p-3 rounded border border-amber-200">
                          <h4 className="text-sm font-medium text-gray-800">Renforcez vos backlinks</h4>
                          <p className="text-xs text-gray-600">
                            Développez une stratégie pour obtenir plus de liens depuis des sites d'autorité dans votre secteur.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="contenu" className="space-y-4 mt-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3">Suggestions d'amélioration du contenu</h4>
                      <div className="space-y-3">
                        <div className="text-sm p-3 bg-gray-50 rounded">
                          <p className="font-medium">Titre actuel:</p>
                          <p className="text-gray-600">Comment améliorer votre référencement</p>
                          <p className="font-medium mt-2">Suggestion optimisée:</p>
                          <p className="text-green-600">10 Techniques Prouvées pour Améliorer votre Référencement Naturel en 2023</p>
                        </div>
                        
                        <div className="text-sm p-3 bg-gray-50 rounded">
                          <p className="font-medium">Densité de mots-clés:</p>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                              <p className="text-xs text-gray-500">Référencement</p>
                              <div className="flex items-center mt-1">
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                                <span className="text-xs ml-2">1.3%</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">SEO</p>
                              <div className="flex items-center mt-1">
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                                <span className="text-xs ml-2">2.1%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="technique" className="space-y-4 mt-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3">Audit technique IA</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                          <span className="text-sm">Images sans attribut alt</span>
                          <span className="text-sm font-medium text-red-600">12 trouvées</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-amber-50 rounded">
                          <span className="text-sm">Balises meta dupliquées</span>
                          <span className="text-sm font-medium text-amber-600">3 trouvées</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <span className="text-sm">Balisage Schema.org</span>
                          <span className="text-sm font-medium text-green-600">Bien implémenté</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-amber-50 rounded">
                          <span className="text-sm">Temps de chargement mobile</span>
                          <span className="text-sm font-medium text-amber-600">2.8s (à améliorer)</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {selectedFeature === 'positions' && (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">Suivi des positions dans Google</h3>
                  <p className="text-sm text-green-700 mb-4">
                    Suivez l'évolution de vos positions pour vos mots-clés principaux.
                  </p>
                  
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Évolution sur 30 jours</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        +2.3 positions en moyenne
                      </span>
                    </div>
                    
                    <div className="h-32 flex items-end space-x-1">
                      {[8, 7, 8, 7, 6, 7, 6, 5, 6, 5, 4, 5, 4, 3, 4, 3, 4, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3].map((pos, i) => (
                        <div
                          key={i}
                          className="bg-green-500 w-full rounded-t"
                          style={{ 
                            height: `${Math.max(10, (10-pos) * 10)}%`,
                            opacity: 0.3 + (i/30) * 0.7
                          }}
                          title={`Jour ${i+1}: position ${pos}`}
                        ></div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-500">15 sept.</span>
                      <span className="text-xs text-gray-500">15 oct.</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-3">Mots-clés principaux</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">référencement naturel</span>
                        <div className="flex items-center">
                          <span className="text-sm font-medium mr-2">#3</span>
                          <span className="text-xs text-green-600">↑ 2</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">améliorer seo</span>
                        <div className="flex items-center">
                          <span className="text-sm font-medium mr-2">#5</span>
                          <span className="text-xs text-green-600">↑ 3</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">outils seo</span>
                        <div className="flex items-center">
                          <span className="text-sm font-medium mr-2">#4</span>
                          <span className="text-xs text-amber-600">↓ 1</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">analyse sites web</span>
                        <div className="flex items-center">
                          <span className="text-sm font-medium mr-2">#7</span>
                          <span className="text-xs text-green-600">↑ 5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-3">Trafic organique estimé</h4>
                    <div className="flex flex-col items-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">1,246</div>
                      <div className="text-sm text-green-600 mb-4">+18.3% ce mois-ci</div>
                      
                      <div className="w-full bg-gray-100 h-2 rounded-full mb-4">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        68% du trafic de votre principal concurrent
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setShowDemo(false)}>
                Fermer la démo
              </Button>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={handleSubscribeClick}
              >
                Obtenir Premium
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal d'abonnement */}
        <Dialog open={isSubscriptionModalOpen} onOpenChange={setIsSubscriptionModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Passez à la version Premium</DialogTitle>
              <DialogDescription>
                Débloquez toutes les fonctionnalités avancées pour maximiser votre potentiel SEO
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="rounded-lg border p-4 bg-amber-50 border-amber-200">
                <h3 className="font-medium mb-2 text-amber-800">Fonctionnalité en développement</h3>
                <p className="text-sm text-amber-700">
                  L'abonnement Premium est actuellement en cours de développement et sera bientôt disponible. 
                  Vous pourrez alors accéder à toutes nos fonctionnalités avancées.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Abonnement Premium</h3>
                <p className="text-2xl font-bold">29,99€ <span className="text-sm font-normal text-gray-500">/mois</span></p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm">
                    <Unlock className="h-4 w-4 text-green-500 mr-2" />
                    Toutes les fonctionnalités de base
                  </li>
                  <li className="flex items-center text-sm">
                    <Unlock className="h-4 w-4 text-green-500 mr-2" />
                    Analyse de la concurrence
                  </li>
                  <li className="flex items-center text-sm">
                    <Unlock className="h-4 w-4 text-green-500 mr-2" />
                    Recommandations IA avancées
                  </li>
                  <li className="flex items-center text-sm">
                    <Unlock className="h-4 w-4 text-green-500 mr-2" />
                    Suivi des positions
                  </li>
                  <li className="flex items-center text-sm">
                    <Unlock className="h-4 w-4 text-green-500 mr-2" />
                    Support prioritaire
                  </li>
                </ul>
              </div>
            </div>
            
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              onClick={() => {
                setIsSubscriptionModalOpen(false);
                toast.success("Bientôt disponible", {
                  description: "Vous serez informé(e) dès que l'abonnement Premium sera disponible."
                });
              }}
            >
              Être notifié(e) du lancement
            </Button>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AnalyseAvancee;
