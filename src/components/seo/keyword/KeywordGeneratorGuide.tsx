
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  BookOpen, 
  Search, 
  Target, 
  Brain, 
  TrendingUp, 
  Users, 
  FileText, 
  BarChart3,
  Globe,
  Mic,
  Smartphone,
  Eye,
  PenTool,
  Calendar,
  AlertTriangle,
  Network,
  Trophy,
  DollarSign,
  Link,
  ChevronRight,
  Lightbulb,
  PlayCircle,
  CheckCircle,
  Info
} from 'lucide-react';

const KeywordGeneratorGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState('introduction');

  const guideSteps = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: BookOpen,
      description: 'Vue d\'ensemble du générateur de mots-clés'
    },
    {
      id: 'getting-started',
      title: 'Premiers pas',
      icon: PlayCircle,
      description: 'Comment commencer à utiliser l\'outil'
    },
    {
      id: 'tabs-overview',
      title: 'Navigation par onglets',
      icon: Eye,
      description: 'Comprendre les différents onglets disponibles'
    },
    {
      id: 'detailed-walkthrough',
      title: 'Guide détaillé',
      icon: Target,
      description: 'Utilisation pas à pas de chaque fonctionnalité'
    },
    {
      id: 'best-practices',
      title: 'Bonnes pratiques',
      icon: CheckCircle,
      description: 'Conseils pour optimiser votre utilisation'
    }
  ];

  const tabs = [
    { id: 'generator', name: 'Standard', icon: Target, description: 'Générateur de base de mots-clés' },
    { id: 'intelligent', name: 'IA', icon: Brain, description: 'Suggestions intelligentes par IA' },
    { id: 'trends', name: 'Tendances', icon: TrendingUp, description: 'Analyse des tendances de recherche' },
    { id: 'trend-analyzer', name: 'Analyse Trends', icon: Calendar, description: 'Analyse avancée des tendances' },
    { id: 'competitors', name: 'Concurrents', icon: Users, description: 'Analyse concurrentielle' },
    { id: 'competitive-intel', name: 'Intelligence', icon: Eye, description: 'Intelligence concurrentielle' },
    { id: 'content', name: 'Contenu', icon: FileText, description: 'Opportunités de contenu' },
    { id: 'content-strategy', name: 'Stratégie', icon: PenTool, description: 'Planification de contenu' },
    { id: 'predictions', name: 'Prédictions', icon: BarChart3, description: 'Prédictions de volume' },
    { id: 'links', name: 'Liens', icon: Link, description: 'Suggestions de liens internes' },
    { id: 'serp', name: 'SERP', icon: Search, description: 'Analyse des résultats de recherche' },
    { id: 'grouping', name: 'Groupes', icon: Network, description: 'Groupement de mots-clés' },
    { id: 'ranking', name: 'Positions', icon: Trophy, description: 'Suivi des positions' },
    { id: 'gaps', name: 'Gaps', icon: AlertTriangle, description: 'Analyse des lacunes' },
    { id: 'roi', name: 'ROI', icon: DollarSign, description: 'Calculateur de ROI' },
    { id: 'multilang', name: 'Multi-langues', icon: Globe, description: 'Support multi-langues' },
    { id: 'voice', name: 'Vocal', icon: Mic, description: 'Optimisation recherche vocale' },
    { id: 'mobile', name: 'Mobile', icon: Smartphone, description: 'Optimisation mobile' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-l-blue-500">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Guide complet du Générateur de Mots-clés</h1>
        </div>
        <p className="text-gray-700">
          Ce guide vous accompagne étape par étape dans l'utilisation complète du générateur de mots-clés. 
          Apprenez à maîtriser chaque fonctionnalité pour optimiser votre stratégie SEO.
        </p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation latérale */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Navigation du guide</h3>
            <div className="space-y-2">
              {guideSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <Button
                    key={step.id}
                    variant={activeSection === step.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveSection(step.id)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {step.title}
                  </Button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Contenu principal */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            {activeSection === 'introduction' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-bold">Introduction au Générateur de Mots-clés</h2>
                </div>
                
                <div className="prose max-w-none">
                  <p>
                    Le générateur de mots-clés est un outil complet qui vous permet de découvrir, analyser et optimiser 
                    vos mots-clés pour améliorer votre référencement naturel (SEO).
                  </p>
                  
                  <h3 className="text-lg font-semibold mt-6 mb-3">Fonctionnalités principales :</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Génération de mots-clés standards et longue traîne</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Analyse concurrentielle avancée</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Prédictions de tendances et saisonnalité</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Suggestions de contenu et stratégie</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Calculateur de ROI intégré</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Optimisation pour recherche vocale et mobile</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeSection === 'getting-started' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <PlayCircle className="h-5 w-5 text-green-600" />
                  <h2 className="text-xl font-bold">Premiers pas</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-2">Étape 1 : Saisie du mot-clé principal</h3>
                    <p className="text-blue-700">
                      Commencez par entrer votre mot-clé principal dans le champ de recherche en haut de la page. 
                      Ce sera la base de toutes vos recherches.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-2">Étape 2 : Cliquez sur "Générer"</h3>
                    <p className="text-green-700">
                      Une fois votre mot-clé saisi, cliquez sur le bouton "Générer" pour lancer l'analyse. 
                      L'outil va créer automatiquement 12 mots-clés standards et 12 mots-clés longue traîne.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-purple-800 mb-2">Étape 3 : Explorez les résultats</h3>
                    <p className="text-purple-700">
                      Les résultats apparaissent dans l'onglet "Standard". Vous pouvez naviguer entre les différents onglets 
                      pour explorer toutes les fonctionnalités disponibles.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'tabs-overview' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="h-5 w-5 text-purple-600" />
                  <h2 className="text-xl font-bold">Navigation par onglets</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <Card key={tab.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <Icon className="h-5 w-5 text-blue-600 mt-1" />
                          <div>
                            <h3 className="font-semibold">{tab.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{tab.description}</p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {activeSection === 'detailed-walkthrough' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-red-600" />
                  <h2 className="text-xl font-bold">Guide détaillé pas à pas</h2>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="standard">
                    <AccordionTrigger className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Onglet Standard - Générateur de base
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <p><strong>Objectif :</strong> Générer des mots-clés principaux liés à votre terme de recherche.</p>
                      <div className="space-y-2">
                        <p><strong>Actions :</strong></p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Entrez votre mot-clé dans le champ de recherche</li>
                          <li>Cliquez sur "Générer"</li>
                          <li>Consultez les 12 mots-clés standards générés</li>
                          <li>Cliquez sur les mots-clés pour les sélectionner</li>
                          <li>Utilisez les boutons "Effacer" et "Exporter" pour gérer vos sélections</li>
                        </ul>
                      </div>
                      <Badge variant="outline" className="mt-2">💡 Conseil : Ces mots-clés sont optimaux pour le contenu principal</Badge>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="longtail">
                    <AccordionTrigger className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Sous-onglet Longue traîne
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <p><strong>Objectif :</strong> Découvrir des expressions plus longues et spécifiques.</p>
                      <div className="space-y-2">
                        <p><strong>Actions :</strong></p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Après génération, cliquez sur l'onglet "Longue traîne"</li>
                          <li>Explorez les 12 expressions longues générées</li>
                          <li>Ces mots-clés ont généralement moins de concurrence</li>
                          <li>Idéaux pour des articles de blog spécialisés</li>
                        </ul>
                      </div>
                      <Badge variant="outline" className="mt-2">💡 Conseil : Parfait pour cibler des niches spécifiques</Badge>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="tableau">
                    <AccordionTrigger className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Vue tableau
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <p><strong>Objectif :</strong> Visualiser tous les mots-clés dans un tableau comparatif.</p>
                      <div className="space-y-2">
                        <p><strong>Actions :</strong></p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Cliquez sur l'onglet "Vue tableau"</li>
                          <li>Comparez volume, difficulté, CPC pour tous les mots-clés</li>
                          <li>Triez par colonne en cliquant sur les en-têtes</li>
                          <li>Sélectionnez en masse avec les cases à cocher</li>
                        </ul>
                      </div>
                      <Badge variant="outline" className="mt-2">💡 Conseil : Idéal pour une analyse comparative rapide</Badge>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="ai">
                    <AccordionTrigger className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Onglet IA - Intelligence artificielle
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <p><strong>Objectif :</strong> Suggestions avancées basées sur l'IA.</p>
                      <div className="space-y-2">
                        <p><strong>Actions :</strong></p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Cliquez sur l'onglet "IA"</li>
                          <li>Configurez vos paramètres d'analyse</li>
                          <li>Obtenez des suggestions contextuelles</li>
                          <li>Analysez les insights comportementaux</li>
                        </ul>
                      </div>
                      <Badge variant="outline" className="mt-2">🤖 Nécessite une clé API OpenAI</Badge>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="trends">
                    <AccordionTrigger className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Onglet Tendances
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <p><strong>Objectif :</strong> Analyser les tendances de recherche et la saisonnalité.</p>
                      <div className="space-y-2">
                        <p><strong>Actions :</strong></p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Cliquez sur l'onglet "Tendances"</li>
                          <li>Visualisez les graphiques de tendances</li>
                          <li>Identifiez les pics saisonniers</li>
                          <li>Planifiez votre contenu en conséquence</li>
                        </ul>
                      </div>
                      <Badge variant="outline" className="mt-2">📈 Conseil : Utilisez pour planifier vos campagnes</Badge>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="competitors">
                    <AccordionTrigger className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Onglet Concurrents
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <p><strong>Objectif :</strong> Analyser la stratégie de mots-clés de vos concurrents.</p>
                      <div className="space-y-2">
                        <p><strong>Actions :</strong></p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Cliquez sur l'onglet "Concurrents"</li>
                          <li>Entrez les domaines de vos concurrents</li>
                          <li>Analysez leurs mots-clés performants</li>
                          <li>Identifiez les opportunités manquées</li>
                        </ul>
                      </div>
                      <Badge variant="outline" className="mt-2">🎯 Conseil : Espionnez légalement la concurrence</Badge>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="roi">
                    <AccordionTrigger className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Onglet ROI - Calculateur de retour sur investissement
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <p><strong>Objectif :</strong> Calculer le ROI potentiel de vos efforts SEO.</p>
                      <div className="space-y-2">
                        <p><strong>Actions :</strong></p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Cliquez sur l'onglet "ROI"</li>
                          <li>Renseignez votre investissement SEO</li>
                          <li>Indiquez votre trafic espéré</li>
                          <li>Définissez votre taux de conversion</li>
                          <li>Obtenez vos projections financières</li>
                        </ul>
                      </div>
                      <Badge variant="outline" className="mt-2">💰 Conseil : Justifiez vos budgets SEO</Badge>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}

            {activeSection === 'best-practices' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h2 className="text-xl font-bold">Bonnes pratiques</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4 border-l-4 border-l-green-500">
                    <h3 className="font-semibold text-green-800 mb-3">✅ À faire</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Commencez toujours par un mot-clé principal clair</li>
                      <li>• Explorez tous les onglets pour une analyse complète</li>
                      <li>• Sélectionnez 5-10 mots-clés maximum par contenu</li>
                      <li>• Vérifiez les tendances avant de planifier</li>
                      <li>• Analysez vos concurrents régulièrement</li>
                      <li>• Calculez le ROI pour prioriser vos efforts</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-4 border-l-4 border-l-red-500">
                    <h3 className="font-semibold text-red-800 mb-3">❌ À éviter</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Ne pas vérifier la difficulté des mots-clés</li>
                      <li>• Ignorer les mots-clés longue traîne</li>
                      <li>• Choisir uniquement des mots-clés à fort volume</li>
                      <li>• Négliger l'analyse concurrentielle</li>
                      <li>• Ne pas planifier selon les tendances</li>
                      <li>• Oublier d'exporter vos sélections</li>
                    </ul>
                  </Card>
                </div>
                
                <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    <h3 className="font-semibold">Conseil d'expert</h3>
                  </div>
                  <p className="text-gray-700">
                    Utilisez une approche en entonnoir : commencez par les mots-clés génériques dans l'onglet Standard, 
                    affinez avec la Longue traîne, validez avec l'analyse Concurrents, et optimisez votre ROI avec le calculateur. 
                    Cette méthode garantit une stratégie SEO complète et rentable.
                  </p>
                </Card>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default KeywordGeneratorGuide;
