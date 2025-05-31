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
  Info,
  Calculator,
  Snowflake,
  Sun
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
      id: 'advanced-features',
      title: 'Fonctionnalités avancées',
      icon: Calculator,
      description: 'Analyse de difficulté, prédictions et saisonnalité'
    },
    {
      id: 'best-practices',
      title: 'Bonnes pratiques',
      icon: CheckCircle,
      description: 'Conseils pour optimiser votre utilisation'
    }
  ];

  const tabs = [
    { id: 'generator', name: 'Standard', icon: Target, description: 'Générateur de base + analyses avancées' },
    { id: 'intelligent', name: 'IA', icon: Brain, description: 'Suggestions intelligentes par IA + analyse difficulté' },
    { id: 'trends', name: 'Tendances', icon: TrendingUp, description: 'Analyse des tendances + saisonnalité' },
    { id: 'trend-analyzer', name: 'Analyse Trends', icon: Calendar, description: 'Analyse avancée des tendances' },
    { id: 'competitors', name: 'Concurrents', icon: Users, description: 'Analyse concurrentielle' },
    { id: 'competitive-intel', name: 'Intelligence', icon: Eye, description: 'Intelligence concurrentielle' },
    { id: 'content', name: 'Contenu', icon: FileText, description: 'Opportunités de contenu' },
    { id: 'content-strategy', name: 'Stratégie', icon: PenTool, description: 'Planification de contenu' },
    { id: 'predictions', name: 'Prédictions', icon: BarChart3, description: 'Prédictions de volume + performance' },
    { id: 'links', name: 'Liens', icon: Link, description: 'Suggestions de liens internes' },
    { id: 'serp', name: 'SERP', icon: Search, description: 'Analyse des résultats de recherche' },
    { id: 'grouping', name: 'Groupes', icon: Network, description: 'Groupement de mots-clés' },
    { id: 'ranking', name: 'Positions', icon: Trophy, description: 'Suivi des positions' },
    { id: 'gaps', name: 'Gaps', icon: AlertTriangle, description: 'Analyse des lacunes' },
    { id: 'roi', name: 'ROI', icon: DollarSign, description: 'Calculateur de ROI + prédicteur performance' },
    { id: 'multilang', name: 'Multi-langues', icon: Globe, description: 'Support multi-langues' },
    { id: 'voice', name: 'Vocal', icon: Mic, description: 'Optimisation recherche vocale' },
    { id: 'mobile', name: 'Mobile', icon: Smartphone, description: 'Optimisation mobile' }
  ];

  const newFeatures = [
    {
      name: 'Analyseur de difficulté',
      description: 'Analyse automatique de la difficulté avec score d\'opportunité',
      icon: Target,
      location: 'Onglets Standard et IA'
    },
    {
      name: 'Analyse saisonnière',
      description: 'Détection automatique des mots-clés saisonniers avec graphiques',
      icon: Snowflake,
      location: 'Onglets Standard et Tendances'
    },
    {
      name: 'Prédicteur de performance',
      description: 'Calcul ROI, clics, conversions estimés selon votre budget',
      icon: Calculator,
      location: 'Onglets Prédictions et ROI'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-l-blue-500">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Guide complet du Générateur de Mots-clés</h1>
          <Badge className="bg-green-100 text-green-800">Version améliorée</Badge>
        </div>
        <p className="text-gray-700">
          Ce guide vous accompagne étape par étape dans l'utilisation complète du générateur de mots-clés. 
          Nouvelles fonctionnalités : analyse de difficulté automatique, détection saisonnière, et prédicteur de performance !
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
                      <span>Génération de 12+ mots-clés standards et longue traîne</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Analyse automatique de difficulté avec scores d'opportunité</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Détection automatique des tendances saisonnières</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Prédicteur de performance avec calculs ROI</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Analyse concurrentielle avancée</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Suggestions de contenu et stratégie</span>
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
                      Ce sera la base de toutes vos recherches et analyses.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-2">Étape 2 : Cliquez sur "Générer"</h3>
                    <p className="text-green-700">
                      Une fois votre mot-clé saisi, cliquez sur le bouton "Générer" pour lancer l'analyse. 
                      L'outil va créer automatiquement 12 mots-clés standards et 12 mots-clés longue traîne avec analyse complète.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-purple-800 mb-2">Étape 3 : Explorez les analyses</h3>
                    <p className="text-purple-700">
                      Les résultats apparaissent dans l'onglet "Standard" avec trois nouvelles analyses automatiques : 
                      difficulté des mots-clés, détection saisonnière, et prédicteur de performance.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'advanced-features' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="h-5 w-5 text-purple-600" />
                  <h2 className="text-xl font-bold">Nouvelles fonctionnalités avancées</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {newFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <Card key={index} className="p-4 border-l-4 border-l-purple-500">
                        <div className="flex items-start gap-3">
                          <Icon className="h-6 w-6 text-purple-600 mt-1" />
                          <div>
                            <h3 className="font-semibold text-lg">{feature.name}</h3>
                            <p className="text-gray-700 mb-2">{feature.description}</p>
                            <Badge variant="outline" className="text-xs">
                              Disponible dans : {feature.location}
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    <h3 className="font-semibold text-yellow-800">Nouveau workflow recommandé</h3>
                  </div>
                  <ol className="list-decimal list-inside space-y-2 text-yellow-700">
                    <li>Générez vos mots-clés dans l'onglet Standard</li>
                    <li>Consultez l'analyse de difficulté pour identifier les opportunités</li>
                    <li>Vérifiez la saisonnalité pour planifier votre calendrier</li>
                    <li>Utilisez le prédicteur de performance pour estimer le ROI</li>
                    <li>Exportez vos sélections et planifiez votre stratégie</li>
                  </ol>
                </div>
              </div>
            )}

            {activeSection === 'tabs-overview' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="h-5 w-5 text-purple-600" />
                  <h2 className="text-xl font-bold">Navigation par onglets (18 onglets disponibles)</h2>
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
                      Onglet Standard - Générateur + Analyses avancées
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <p><strong>Objectif :</strong> Générer des mots-clés principaux avec analyses automatiques complètes.</p>
                      <div className="space-y-2">
                        <p><strong>Actions :</strong></p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Entrez votre mot-clé dans le champ de recherche</li>
                          <li>Cliquez sur "Générer" pour obtenir 24 mots-clés (12 standards + 12 longue traîne)</li>
                          <li>Consultez automatiquement l'analyse de difficulté avec scores d'opportunité</li>
                          <li>Vérifiez la détection saisonnière pour planifier votre contenu</li>
                          <li>Utilisez le prédicteur de performance pour estimer clics, conversions et ROI</li>
                          <li>Sélectionnez vos mots-clés en cliquant dessus</li>
                          <li>Exportez votre sélection avec le bouton "Exporter"</li>
                        </ul>
                      </div>
                      <Badge variant="outline" className="mt-2">✨ Nouveau : 3 analyses automatiques intégrées</Badge>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="difficulty">
                    <AccordionTrigger className="flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      Analyseur de difficulté automatique
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <p><strong>Objectif :</strong> Évaluer automatiquement la difficulté et identifier les meilleures opportunités.</p>
                      <div className="space-y-2">
                        <p><strong>Fonctionnalités :</strong></p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Classification automatique : Facile (≤20), Moyen (21-40), Difficile (41-60), Très difficile (>60)</li>
                          <li>Score d'opportunité calculé selon volume vs difficulté</li>
                          <li>Top 5 des meilleures opportunités mis en avant</li>
                          <li>Statistiques globales : mots-clés faciles, fort volume, meilleures opportunités</li>
                          <li>Barres de progression visuelles pour chaque mot-clé</li>
                        </ul>
                      </div>
                      <Badge variant="outline" className="mt-2">🎯 Disponible dans Standard et IA</Badge>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="seasonal">
                    <AccordionTrigger className="flex items-center gap-2">
                      <Snowflake className="h-4 w-4" />
                      Analyse saisonnière automatique
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <p><strong>Objectif :</strong> Détecter automatiquement les mots-clés saisonniers et leurs tendances.</p>
                      <div className="space-y-2">
                        <p><strong>Détection automatique :</strong></p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Mots-clés d'été, hiver, printemps, automne</li>
                          <li>Événements spéciaux : Noël, vacances, rentrée</li>
                          <li>Graphiques de tendances mensuelles</li>
                          <li>Code couleur par saison avec icônes dédiées</li>
                          <li>Recommandations de planification de contenu</li>
                        </ul>
                      </div>
                      <Badge variant="outline" className="mt-2">📅 Disponible dans Standard et Tendances</Badge>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="predictor">
                    <AccordionTrigger className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Prédicteur de performance
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <p><strong>Objectif :</strong> Calculer les performances estimées selon votre budget et période.</p>
                      <div className="space-y-2">
                        <p><strong>Calculs automatiques :</strong></p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Définissez votre budget mensuel et période (en mois)</li>
                          <li>Estimation automatique des clics par mot-clé</li>
                          <li>Calcul des conversions avec taux de conversion réaliste</li>
                          <li>ROI estimé par mot-clé et global</li>
                          <li>Position moyenne estimée selon l'investissement</li>
                          <li>Classement par meilleur ROI potentiel</li>
                        </ul>
                      </div>
                      <Badge variant="outline" className="mt-2">💰 Disponible dans Prédictions et ROI</Badge>
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
                  <h2 className="text-xl font-bold">Bonnes pratiques mises à jour</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4 border-l-4 border-l-green-500">
                    <h3 className="font-semibold text-green-800 mb-3">✅ Nouvelles pratiques recommandées</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Utilisez l'analyse de difficulté pour prioriser vos efforts</li>
                      <li>• Consultez systématiquement la saisonnalité détectée</li>
                      <li>• Définissez un budget réaliste dans le prédicteur</li>
                      <li>• Focalisez-vous sur les scores d'opportunité élevés</li>
                      <li>• Planifiez selon les tendances saisonnières</li>
                      <li>• Vérifiez le ROI estimé avant de lancer une campagne</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-4 border-l-4 border-l-red-500">
                    <h3 className="font-semibold text-red-800 mb-3">❌ Nouveaux pièges à éviter</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Ignorer les scores d'opportunité dans l'analyse</li>
                      <li>• Ne pas tenir compte de la saisonnalité détectée</li>
                      <li>• Définir un budget irréaliste dans les prédictions</li>
                      <li>• Choisir uniquement selon le volume sans difficulté</li>
                      <li>• Oublier de vérifier le ROI estimé</li>
                      <li>• Ne pas exporter les analyses avancées</li>
                    </ul>
                  </Card>
                </div>
                
                <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    <h3 className="font-semibold">Workflow expert amélioré</h3>
                  </div>
                  <p className="text-gray-700">
                    Nouveau workflow en 6 étapes : <strong>1)</strong> Générez vos mots-clés, <strong>2)</strong> Analysez la difficulté automatique, 
                    <strong>3)</strong> Identifiez la saisonnalité, <strong>4)</strong> Calculez les performances estimées, 
                    <strong>5)</strong> Sélectionnez selon les scores d'opportunité, <strong>6)</strong> Exportez et planifiez votre stratégie.
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
