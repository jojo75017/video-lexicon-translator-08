
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  TrendingUp, 
  BarChart2, 
  LineChart, 
  BadgeInfo, 
  RefreshCw, 
  Timer,
  ChevronRight, 
  Search, 
  Building, 
  Globe,
  MessagesSquare,
  Brain
} from 'lucide-react';

const AnalyseAvancee = () => {
  const [activeTab, setActiveTab] = useState('trafic');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewType, setPreviewType] = useState<'concurrence' | 'ia' | 'positions'>('concurrence');
  const [notificationEmail, setNotificationEmail] = useState('');
  
  const handleOpenPreview = (type: 'concurrence' | 'ia' | 'positions') => {
    setPreviewType(type);
    setShowPreviewModal(true);
  };
  
  const handlePremiumClick = () => {
    setShowPremiumModal(true);
  };
  
  const handleNotificationSubmit = () => {
    if (!notificationEmail) {
      toast.error('Veuillez saisir une adresse email valide');
      return;
    }
    
    toast.success('Vous serez notifié(e) lors du lancement de Premium!');
    setShowPremiumModal(false);
    setNotificationEmail('');
  };
  
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-indigo-600" />
              Analyse Avancée des Données
            </h2>
            <p className="text-gray-600 mt-1">
              Visualisez les métriques avancées et tendances de votre site
            </p>
          </div>
          <Button
            onClick={handlePremiumClick}
            className="mt-3 md:mt-0 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            Découvrir Premium
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid grid-cols-3 bg-slate-100 p-1 rounded-lg">
            <TabsTrigger value="trafic" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Trafic</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-1">
              <Timer className="h-4 w-4" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
            <TabsTrigger value="tendances" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-1">
              <LineChart className="h-4 w-4" />
              <span className="hidden sm:inline">Tendances</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trafic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Visiteurs Quotidiens</h3>
                  <BadgeInfo className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-3xl font-bold">1,254</p>
                <div className="mt-2 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  <span className="text-green-500 font-medium">+12.5%</span>
                  <span className="text-gray-500 ml-1">vs sem. précédente</span>
                </div>
                <div className="mt-4 h-24 bg-slate-50 rounded-lg flex items-center justify-center text-gray-400">
                  [Graphique trafic]
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Taux de Rebond</h3>
                  <BadgeInfo className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-3xl font-bold">42.3%</p>
                <div className="mt-2 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 mr-1 text-red-500 transform rotate-180" />
                  <span className="text-red-500 font-medium">+2.1%</span>
                  <span className="text-gray-500 ml-1">vs sem. précédente</span>
                </div>
                <div className="mt-4 h-24 bg-slate-50 rounded-lg flex items-center justify-center text-gray-400">
                  [Graphique rebond]
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Temps sur Page</h3>
                  <BadgeInfo className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-3xl font-bold">2m 18s</p>
                <div className="mt-2 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  <span className="text-green-500 font-medium">+0.8%</span>
                  <span className="text-gray-500 ml-1">vs sem. précédente</span>
                </div>
                <div className="mt-4 h-24 bg-slate-50 rounded-lg flex items-center justify-center text-gray-400">
                  [Graphique temps]
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium">Sources de Trafic</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  <span>Mis à jour il y a 2h</span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Recherche Organique</span>
                    <span className="font-medium">58%</span>
                  </div>
                  <Progress value={58} className="h-2 bg-gray-100" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Trafic Direct</span>
                    <span className="font-medium">22%</span>
                  </div>
                  <Progress value={22} className="h-2 bg-gray-100" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Réseaux Sociaux</span>
                    <span className="font-medium">14%</span>
                  </div>
                  <Progress value={14} className="h-2 bg-gray-100" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Autres Références</span>
                    <span className="font-medium">6%</span>
                  </div>
                  <Progress value={6} className="h-2 bg-gray-100" />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-medium mb-4">Vitesse de Chargement</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">2.4s</p>
                    <p className="text-sm text-gray-500 mt-1">Temps de chargement moyen</p>
                  </div>
                  <div className="h-20 w-20 rounded-full border-8 border-indigo-200 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full border-8 border-indigo-500 border-r-transparent transform rotate-45"></div>
                    <span className="text-sm font-medium">Rapide</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg text-blue-600 text-sm flex items-start">
                  <BadgeInfo className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <p>Votre site est plus rapide que 75% des sites analysés cette semaine.</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-medium mb-4">Score SEO Global</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-green-600 text-xl font-bold">92/100</p>
                    <p className="text-xs text-green-800 mt-1">Desktop</p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg text-center">
                    <p className="text-amber-600 text-xl font-bold">78/100</p>
                    <p className="text-xs text-amber-800 mt-1">Mobile</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-blue-600 text-xl font-bold">85/100</p>
                    <p className="text-xs text-blue-800 mt-1">Global</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-green-50 rounded-lg text-green-600 text-sm flex items-start">
                  <BadgeInfo className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <p>Améliorez votre score Mobile en optimisant les images et en réduisant le JavaScript.</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tendances" className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-medium mb-4">Evolution du classement des mots-clés</h3>
              <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center text-gray-400 mb-4">
                [Graphique évolution sur 30 jours]
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800 mb-1">Mots-clés en hausse</p>
                  <p className="text-2xl font-bold text-green-600">14</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-800 mb-1">Mots-clés en baisse</p>
                  <p className="text-2xl font-bold text-red-600">5</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-800 mb-1">Position moyenne</p>
                  <p className="text-2xl font-bold text-gray-700">12.4</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-600 to-transparent text-white px-4 py-1 text-xs font-medium">
            Premium
          </div>
          <div className="pt-6">
            <div className="flex items-center mb-4">
              <Building className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h3 className="font-semibold">Analyse de la concurrence</h3>
                <p className="text-sm text-gray-600">Comparez votre site avec vos concurrents directs</p>
              </div>
            </div>
            <div className="space-y-2 mt-6 mb-4">
              <div className="h-2 w-4/5 bg-indigo-100 rounded-full"></div>
              <div className="h-2 w-3/5 bg-indigo-100 rounded-full"></div>
              <div className="h-2 w-2/3 bg-indigo-100 rounded-full"></div>
            </div>
            <Button onClick={() => handleOpenPreview('concurrence')} className="w-full mt-2" variant="outline">
              Aperçu
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </Card>
        
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-600 to-transparent text-white px-4 py-1 text-xs font-medium">
            Premium
          </div>
          <div className="pt-6">
            <div className="flex items-center mb-4">
              <Brain className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h3 className="font-semibold">Intelligence artificielle</h3>
                <p className="text-sm text-gray-600">Recommandations personnalisées pour votre site</p>
              </div>
            </div>
            <div className="space-y-2 mt-6 mb-4">
              <div className="h-2 w-3/4 bg-indigo-100 rounded-full"></div>
              <div className="h-2 w-full bg-indigo-100 rounded-full"></div>
              <div className="h-2 w-3/5 bg-indigo-100 rounded-full"></div>
            </div>
            <Button onClick={() => handleOpenPreview('ia')} className="w-full mt-2" variant="outline">
              Aperçu
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </Card>
        
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-600 to-transparent text-white px-4 py-1 text-xs font-medium">
            Premium
          </div>
          <div className="pt-6">
            <div className="flex items-center mb-4">
              <Search className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h3 className="font-semibold">Suivi des positions</h3>
                <p className="text-sm text-gray-600">Suivez l'évolution de vos positions sur les moteurs de recherche</p>
              </div>
            </div>
            <div className="space-y-2 mt-6 mb-4">
              <div className="h-2 w-full bg-indigo-100 rounded-full"></div>
              <div className="h-2 w-2/3 bg-indigo-100 rounded-full"></div>
              <div className="h-2 w-4/5 bg-indigo-100 rounded-full"></div>
            </div>
            <Button onClick={() => handleOpenPreview('positions')} className="w-full mt-2" variant="outline">
              Aperçu
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Modal Premium */}
      <Dialog open={showPremiumModal} onOpenChange={setShowPremiumModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Premium</span>
              <span className="ml-2">- Bientôt disponible</span>
            </DialogTitle>
            <DialogDescription>
              La version Premium de notre plateforme sera disponible prochainement. Soyez parmi les premiers à en profiter!
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h4 className="font-medium mb-2">Fonctionnalités Premium:</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                  <ChevronRight className="h-3 w-3 text-green-600" />
                </div>
                <span>Analyse de la concurrence en temps réel</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                  <ChevronRight className="h-3 w-3 text-green-600" />
                </div>
                <span>Intelligence artificielle dédiée à votre site</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                  <ChevronRight className="h-3 w-3 text-green-600" />
                </div>
                <span>Suivi quotidien des positions sur les moteurs de recherche</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                  <ChevronRight className="h-3 w-3 text-green-600" />
                </div>
                <span>Rapports hebdomadaires personnalisés</span>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Être notifié(e) lors du lancement:</p>
            <Input 
              type="email" 
              placeholder="votre@email.com" 
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleNotificationSubmit} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600">
              Être notifié(e) du lancement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal Aperçu */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {previewType === 'concurrence' && "Aperçu - Analyse de la concurrence"}
              {previewType === 'ia' && "Aperçu - Intelligence artificielle"}
              {previewType === 'positions' && "Aperçu - Suivi des positions"}
            </DialogTitle>
            <DialogDescription>
              Ceci est un aperçu de cette fonctionnalité Premium
            </DialogDescription>
          </DialogHeader>
          
          {previewType === 'concurrence' && (
            <div className="py-4 space-y-6">
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="font-medium mb-3">Comparaison avec les concurrents</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">concurrent-1.com</span>
                      <span className="text-sm">Score SEO: 82/100</span>
                    </div>
                    <Progress value={82} className="h-2 bg-gray-100" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">concurrent-2.com</span>
                      <span className="text-sm">Score SEO: 68/100</span>
                    </div>
                    <Progress value={68} className="h-2 bg-gray-100" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">concurrent-3.com</span>
                      <span className="text-sm">Score SEO: 71/100</span>
                    </div>
                    <Progress value={71} className="h-2 bg-gray-100" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="font-medium mb-2 text-sm">Mots-clés communs</h3>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="font-medium mb-2 text-sm">Opportunités identifiées</h3>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg text-blue-600 text-sm flex items-start">
                <BadgeInfo className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <p>Accédez à l'analyse complète de vos concurrents avec l'abonnement Premium.</p>
              </div>
            </div>
          )}
          
          {previewType === 'ia' && (
            <div className="py-4 space-y-6">
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="font-medium mb-3">Recommandations IA</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <ChevronRight className="h-3 w-3 text-amber-600" />
                    </div>
                    <p className="text-sm">Optimisez les balises title et description sur 3 pages clés identifiées par notre IA</p>
                  </div>
                  <div className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <ChevronRight className="h-3 w-3 text-green-600" />
                    </div>
                    <p className="text-sm">Améliorez la structure de vos URL pour une meilleure lisibilité par les moteurs de recherche</p>
                  </div>
                  <div className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <ChevronRight className="h-3 w-3 text-red-600" />
                    </div>
                    <p className="text-sm">Corrigez les 4 problèmes critiques de liens cassés détectés sur votre site</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="font-medium mb-2">Prévisions d'impact</h3>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Trafic organique</span>
                      <span>+18%</span>
                    </div>
                    <Progress value={18} className="h-1.5 bg-gray-200" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Positions</span>
                      <span>+5 rangs</span>
                    </div>
                    <Progress value={25} className="h-1.5 bg-gray-200" />
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg text-blue-600 text-sm flex items-start">
                <BadgeInfo className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <p>Accédez à toutes les recommandations IA personnalisées avec l'abonnement Premium.</p>
              </div>
            </div>
          )}
          
          {previewType === 'positions' && (
            <div className="py-4 space-y-6">
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="font-medium mb-3">Évolution des positions</h3>
                <div className="h-48 bg-white rounded-lg border p-2 flex items-center justify-center text-gray-400">
                  [Graphique d'évolution des positions sur 30 jours]
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="font-medium mb-2 text-sm">Mots-clés suivis</h3>
                  <p className="text-2xl font-bold">32</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="font-medium mb-2 text-sm">Position moyenne</h3>
                  <p className="text-2xl font-bold">14.8</p>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg text-blue-600 text-sm flex items-start">
                <BadgeInfo className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <p>Suivez jusqu'à 100 mots-clés et recevez des alertes quotidiennes avec l'abonnement Premium.</p>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => setShowPreviewModal(false)}>
              Fermer l'aperçu
            </Button>
            <Button onClick={handlePremiumClick} className="bg-gradient-to-r from-indigo-600 to-purple-600">
              En savoir plus sur Premium
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnalyseAvancee;
