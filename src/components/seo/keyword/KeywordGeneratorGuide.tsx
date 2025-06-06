
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BookOpen, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Globe,
  Brain,
  Users,
  FileText,
  BarChart3,
  Search,
  Smartphone,
  Mic,
  Calendar,
  Eye,
  Link,
  Zap,
  PieChart,
  MessageSquare,
  Settings,
  Download,
  Key,
  ChevronRight,
  CheckCircle,
  Star,
  ArrowRight,
  Lightbulb,
  Info
} from 'lucide-react';

const KeywordGeneratorGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    {
      id: 'overview',
      title: 'Vue d\'ensemble',
      icon: BookOpen,
      description: 'Introduction générale au générateur'
    },
    {
      id: 'getting-started',
      title: 'Démarrage rapide',
      icon: Sparkles,
      description: 'Comment commencer à utiliser l\'outil'
    },
    {
      id: 'api-config',
      title: 'Configuration API',
      icon: Key,
      description: 'Configuration de votre clé OpenAI'
    },
    {
      id: 'basic-features',
      title: 'Fonctions de base',
      icon: Target,
      description: 'Générateur standard et longue traîne'
    },
    {
      id: 'advanced-features',
      title: 'Fonctions avancées',
      icon: Brain,
      description: 'IA, analyse concurrentielle, tendances'
    },
    {
      id: 'analysis-tools',
      title: 'Outils d\'analyse',
      icon: BarChart3,
      description: 'Analytics, ROI, difficulté, clustering'
    },
    {
      id: 'optimization',
      title: 'Optimisation',
      icon: Smartphone,
      description: 'Mobile, vocal, saisonnier'
    },
    {
      id: 'content-tools',
      title: 'Outils de contenu',
      icon: FileText,
      description: 'FAQ, liens internes, opportunités'
    },
    {
      id: 'export-tips',
      title: 'Export et conseils',
      icon: Download,
      description: 'Comment exporter et optimiser vos résultats'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* En-tête du guide */}
      <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            Guide complet du Générateur de Mots-clés
          </h1>
          <p className="text-lg text-blue-700 max-w-3xl mx-auto">
            Maîtrisez toutes les fonctionnalités de notre générateur de mots-clés alimenté par l'IA. 
            De la recherche basique aux analyses concurrentielles avancées.
          </p>
        </div>
      </Card>

      {/* Navigation du guide */}
      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="grid grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-1 h-auto p-1">
          {sections.map((section) => (
            <TabsTrigger 
              key={section.id}
              value={section.id}
              className="flex flex-col items-center gap-1 h-auto py-3 px-2 text-xs"
            >
              <section.icon className="w-4 h-4" />
              <span className="text-center leading-tight">{section.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Contenu - Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              Vue d'ensemble du Générateur
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">🎯 Qu'est-ce que c'est ?</h3>
                <p className="text-gray-600 mb-4">
                  Un outil complet de recherche et d'analyse de mots-clés qui utilise l'intelligence artificielle 
                  pour vous aider à optimiser votre stratégie SEO.
                </p>
                
                <h3 className="text-lg font-semibold mb-3">✨ Fonctionnalités principales</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Génération de mots-clés standards et longue traîne
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Analyse de la concurrence en temps réel
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Suggestions intelligentes par IA
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Analyse des tendances et saisonnalité
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Optimisation mobile et recherche vocale
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">📊 Métriques analysées</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-900">Volume de recherche</div>
                    <div className="text-sm text-blue-600">Popularité mensuelle</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-900">Difficulté SEO</div>
                    <div className="text-sm text-green-600">Compétitivité (0-100)</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-medium text-purple-900">CPC moyen</div>
                    <div className="text-sm text-purple-600">Coût par clic</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="font-medium text-orange-900">Intent utilisateur</div>
                    <div className="text-sm text-orange-600">Type de recherche</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Contenu - Démarrage rapide */}
        <TabsContent value="getting-started" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-green-600" />
              Démarrage rapide (5 minutes)
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-semibold mb-2">Saisissez votre mot-clé principal</h3>
                  <p className="text-gray-600">Entrez un terme de 1-3 mots représentant votre sujet (ex: "marketing digital")</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-semibold mb-2">Cliquez sur "Générer"</h3>
                  <p className="text-gray-600">L'outil va analyser et générer des suggestions automatiquement</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-semibold mb-2">Explorez les résultats</h3>
                  <p className="text-gray-600">Naviguez entre les onglets pour voir différents types d'analyses</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="font-semibold mb-2">Sélectionnez et exportez</h3>
                  <p className="text-gray-600">Cochez les mots-clés intéressants et exportez-les en CSV</p>
                </div>
              </div>
            </div>
            
            <Alert className="mt-6">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Conseil :</strong> Commencez par des mots-clés génériques, puis affinez avec les suggestions d'IA pour des termes plus spécifiques.
              </AlertDescription>
            </Alert>
          </Card>
        </TabsContent>

        {/* Contenu - Configuration API */}
        <TabsContent value="api-config" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Key className="h-6 w-6 text-purple-600" />
              Configuration de l'API OpenAI
            </h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">🔑 Pourquoi configurer OpenAI ?</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Suggestions de mots-clés plus intelligentes et contextuelles</li>
                  <li>• Analyse sémantique avancée</li>
                  <li>• Génération de contenu SEO optimisé</li>
                  <li>• Recommandations personnalisées</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">📝 Comment obtenir votre clé API :</h3>
                <ol className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Badge className="bg-blue-600">1</Badge>
                    <div>
                      <p><strong>Créez un compte OpenAI :</strong></p>
                      <p className="text-gray-600 text-sm">Rendez-vous sur <code>platform.openai.com</code> et créez un compte</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Badge className="bg-blue-600">2</Badge>
                    <div>
                      <p><strong>Accédez aux API Keys :</strong></p>
                      <p className="text-gray-600 text-sm">Dans votre dashboard, allez dans "API Keys"</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Badge className="bg-blue-600">3</Badge>
                    <div>
                      <p><strong>Créez une nouvelle clé :</strong></p>
                      <p className="text-gray-600 text-sm">Cliquez sur "Create new secret key" et copiez-la</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Badge className="bg-blue-600">4</Badge>
                    <div>
                      <p><strong>Configurez dans l'outil :</strong></p>
                      <p className="text-gray-600 text-sm">Collez votre clé dans le bouton "Configurer API" (carte bleue)</p>
                    </div>
                  </li>
                </ol>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Sécurité :</strong> Votre clé API est stockée localement dans votre navigateur et n'est jamais envoyée à nos serveurs.
                </AlertDescription>
              </Alert>
            </div>
          </Card>
        </TabsContent>

        {/* Contenu - Fonctions de base */}
        <TabsContent value="basic-features" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Target className="h-6 w-6 text-green-600" />
              Fonctionnalités de base
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Générateur Standard
                </h3>
                <p className="text-gray-600 mb-3">
                  L'onglet principal qui génère des mots-clés basiques à partir de votre terme initial.
                </p>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">Mots-clés standards</div>
                    <div className="text-sm text-gray-600">Variations directes de votre terme principal</div>
                    <div className="text-xs text-blue-600 mt-1">Ex: "marketing" → "marketing digital", "marketing en ligne"</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">Mots-clés longue traîne</div>
                    <div className="text-sm text-gray-600">Expressions plus longues et spécifiques</div>
                    <div className="text-xs text-blue-600 mt-1">Ex: "comment faire du marketing digital pour débutants"</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Suggestions Avancées
                </h3>
                <p className="text-gray-600 mb-3">
                  L'onglet "Suggestions" regroupe tous vos mots-clés générés avec filtres et tri.
                </p>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">Métriques affichées</div>
                    <div className="text-sm text-gray-600">Volume, difficulté, CPC, intent</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">Sélection multiple</div>
                    <div className="text-sm text-gray-600">Cochez pour créer votre liste personnalisée</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">Export facile</div>
                    <div className="text-sm text-gray-600">CSV prêt pour vos outils SEO</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Contenu - Fonctions avancées */}
        <TabsContent value="advanced-features" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-600" />
              Fonctionnalités avancées
            </h2>
            
            <div className="grid gap-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold">Tendances</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Analyse l'évolution temporelle de vos mots-clés avec des graphiques de tendances.
                  </p>
                  <ul className="text-xs text-gray-500 mt-2 space-y-1">
                    <li>• Données historiques sur 12 mois</li>
                    <li>• Prédictions de croissance</li>
                    <li>• Comparaison avec la concurrence</li>
                  </ul>
                </div>
                
                <div className="p-4 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">Analyse Concurrentielle</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Découvre les mots-clés utilisés par vos concurrents directs.
                  </p>
                  <ul className="text-xs text-gray-500 mt-2 space-y-1">
                    <li>• Top 10 des concurrents</li>
                    <li>• Mots-clés manqués</li>
                    <li>• Opportunités de gap</li>
                  </ul>
                </div>
                
                <div className="p-4 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold">IA Avancée</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Utilise OpenAI pour des suggestions contextuelles intelligentes.
                  </p>
                  <ul className="text-xs text-gray-500 mt-2 space-y-1">
                    <li>• Analyse sémantique</li>
                    <li>• Suggestions par intent</li>
                    <li>• Mots-clés émergents</li>
                  </ul>
                </div>
              </div>
              
              <Alert className="bg-purple-50 border-purple-200">
                <Star className="h-4 w-4 text-purple-600" />
                <AlertDescription>
                  <strong>Pro Tip :</strong> Combinez l'analyse concurrentielle avec l'IA pour découvrir des opportunités de mots-clés que vos concurrents n'exploitent pas encore.
                </AlertDescription>
              </Alert>
            </div>
          </Card>
        </TabsContent>

        {/* Contenu - Outils d'analyse */}
        <TabsContent value="analysis-tools" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              Outils d'analyse approfondie
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Analytics</h3>
                  </div>
                  <p className="text-sm text-blue-800 mb-2">
                    Tableaux de bord complets avec métriques détaillées
                  </p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>✓ Graphiques de performance</li>
                    <li>✓ Comparaisons temporelles</li>
                    <li>✓ Distribution par difficulté</li>
                    <li>✓ Analyse des volumes</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <PieChart className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">Calculateur ROI</h3>
                  </div>
                  <p className="text-sm text-green-800 mb-2">
                    Estimez le retour sur investissement potentiel
                  </p>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>✓ Projection de trafic</li>
                    <li>✓ Estimation des conversions</li>
                    <li>✓ Calcul du chiffre d'affaires</li>
                    <li>✓ Temps de retour sur investissement</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-orange-600" />
                    <h3 className="font-semibold text-orange-900">Analyse de Difficulté</h3>
                  </div>
                  <p className="text-sm text-orange-800 mb-2">
                    Évalue la compétitivité de chaque mot-clé
                  </p>
                  <ul className="text-xs text-orange-700 space-y-1">
                    <li>✓ Score de difficulté 0-100</li>
                    <li>✓ Analyse de la SERP</li>
                    <li>✓ Force des domaines concurrents</li>
                    <li>✓ Recommandations de ciblage</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-900">Clustering</h3>
                  </div>
                  <p className="text-sm text-purple-800 mb-2">
                    Regroupe automatiquement vos mots-clés par thème
                  </p>
                  <ul className="text-xs text-purple-700 space-y-1">
                    <li>✓ Groupes sémantiques</li>
                    <li>✓ Intent de recherche</li>
                    <li>✓ Priorités de contenu</li>
                    <li>✓ Structure de site optimale</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Contenu - Optimisation */}
        <TabsContent value="optimization" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Smartphone className="h-6 w-6 text-green-600" />
              Optimisation spécialisée
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <Smartphone className="h-6 w-6 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Mobile</h3>
                </div>
                <p className="text-sm text-blue-800 mb-3">
                  Optimise vos mots-clés pour la recherche mobile
                </p>
                <div className="space-y-2">
                  <div className="text-xs text-blue-700">
                    <strong>Fonctionnalités :</strong>
                  </div>
                  <ul className="text-xs text-blue-600 space-y-1">
                    <li>• Volume mobile vs desktop</li>
                    <li>• Intent de recherche locale</li>
                    <li>• Compatibilité écran tactile</li>
                    <li>• Suggestions de formats rapides</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <Mic className="h-6 w-6 text-green-600" />
                  <h3 className="font-semibold text-green-900">Recherche Vocale</h3>
                </div>
                <p className="text-sm text-green-800 mb-3">
                  Adapte votre contenu aux assistants vocaux
                </p>
                <div className="space-y-2">
                  <div className="text-xs text-green-700">
                    <strong>Analyse :</strong>
                  </div>
                  <ul className="text-xs text-green-600 space-y-1">
                    <li>• Questions naturelles</li>
                    <li>• Phrases conversationnelles</li>
                    <li>• Potentiel featured snippets</li>
                    <li>• Optimisation réponses courtes</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-6 w-6 text-orange-600" />
                  <h3 className="font-semibold text-orange-900">Saisonnier</h3>
                </div>
                <p className="text-sm text-orange-800 mb-3">
                  Identifie les variations saisonnières
                </p>
                <div className="space-y-2">
                  <div className="text-xs text-orange-700">
                    <strong>Données :</strong>
                  </div>
                  <ul className="text-xs text-orange-600 space-y-1">
                    <li>• Pics de recherche annuels</li>
                    <li>• Calendrier éditorial optimal</li>
                    <li>• Prédictions de tendances</li>
                    <li>• Planning de contenu</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <Alert className="mt-6 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
              <ArrowRight className="h-4 w-4 text-blue-600" />
              <AlertDescription>
                <strong>Stratégie :</strong> Utilisez ces trois analyses ensemble pour créer une stratégie de contenu omnicanale qui capture le trafic sur tous les appareils et contextes de recherche.
              </AlertDescription>
            </Alert>
          </Card>
        </TabsContent>

        {/* Contenu - Outils de contenu */}
        <TabsContent value="content-tools" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-purple-600" />
              Outils de création de contenu
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-900">Générateur FAQ</h3>
                  </div>
                  <p className="text-sm text-purple-800 mb-2">
                    Crée automatiquement des questions-réponses optimisées SEO
                  </p>
                  <div className="space-y-1 text-xs text-purple-700">
                    <div>✓ Questions fréquentes sur votre sujet</div>
                    <div>✓ Réponses optimisées pour les featured snippets</div>
                    <div>✓ Format JSON-LD pour les rich snippets</div>
                    <div>✓ Intégration schema.org</div>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Opportunités</h3>
                  </div>
                  <p className="text-sm text-blue-800 mb-2">
                    Identifie les gaps de contenu et nouvelles opportunités
                  </p>
                  <div className="space-y-1 text-xs text-blue-700">
                    <div>✓ Mots-clés non exploités</div>
                    <div>✓ Sujets connexes à développer</div>
                    <div>✓ Niches peu concurrentielles</div>
                    <div>✓ Tendances émergentes</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Link className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">Liens Internes</h3>
                  </div>
                  <p className="text-sm text-green-800 mb-2">
                    Suggère des opportunités de maillage interne optimisé
                  </p>
                  <div className="space-y-1 text-xs text-green-700">
                    <div>✓ Pages à relier entre elles</div>
                    <div>✓ Ancres optimales à utiliser</div>
                    <div>✓ Structure de cocon sémantique</div>
                    <div>✓ Répartition du PageRank</div>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="h-5 w-5 text-yellow-600" />
                    <h3 className="font-semibold text-yellow-900">Analyse SERP</h3>
                  </div>
                  <p className="text-sm text-yellow-800 mb-2">
                    Analyse en profondeur des résultats de recherche
                  </p>
                  <div className="space-y-1 text-xs text-yellow-700">
                    <div>✓ Top 10 des résultats actuels</div>
                    <div>✓ Types de contenu qui ranke</div>
                    <div>✓ Features SERP présentes</div>
                    <div>✓ Stratégie de positionnement</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Contenu - Export et conseils */}
        <TabsContent value="export-tips" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Download className="h-6 w-6 text-green-600" />
              Export et conseils d'utilisation
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-900">📥 Comment exporter vos résultats</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="font-medium text-green-900 mb-1">1. Sélection</div>
                    <div className="text-sm text-green-800">
                      Cochez les cases des mots-clés qui vous intéressent dans l'onglet "Générateur"
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="font-medium text-green-900 mb-1">2. Export</div>
                    <div className="text-sm text-green-800">
                      Cliquez sur "Exporter" dans la barre de sélection ou utilisez l'onglet "Export"
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="font-medium text-green-900 mb-1">3. Format CSV</div>
                    <div className="text-sm text-green-800">
                      Le fichier contient : mot-clé, volume, difficulté, CPC, intent
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-900">💡 Conseils d'utilisation avancée</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="font-medium text-blue-900 mb-1">Priorisez intelligemment</div>
                    <div className="text-sm text-blue-800">
                      Commencez par les mots-clés à faible difficulté et fort volume pour des victoires rapides
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="font-medium text-blue-900 mb-1">Créez des clusters</div>
                    <div className="text-sm text-blue-800">
                      Groupez les mots-clés similaires pour créer des pages piliers et de support
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="font-medium text-blue-900 mb-1">Suivez l'intent</div>
                    <div className="text-sm text-blue-800">
                      Adaptez votre contenu à l'intention (informationnelle, commerciale, transactionnelle)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2">🎯 Workflow recommandé</h3>
              <div className="grid md:grid-cols-4 gap-3 text-sm">
                <div className="text-center">
                  <div className="font-medium text-purple-800">1. Recherche</div>
                  <div className="text-purple-600">Générateur + IA</div>
                </div>
                <ArrowRight className="hidden md:block h-4 w-4 text-purple-400 mx-auto mt-1" />
                <div className="text-center">
                  <div className="font-medium text-purple-800">2. Analyse</div>
                  <div className="text-purple-600">Difficulté + Concurrence</div>
                </div>
                <ArrowRight className="hidden md:block h-4 w-4 text-purple-400 mx-auto mt-1" />
                <div className="text-center">
                  <div className="font-medium text-purple-800">3. Planification</div>
                  <div className="text-purple-600">Clustering + Calendrier</div>
                </div>
                <ArrowRight className="hidden md:block h-4 w-4 text-purple-400 mx-auto mt-1" />
                <div className="text-center">
                  <div className="font-medium text-purple-800">4. Action</div>
                  <div className="text-purple-600">Création + Optimisation</div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KeywordGeneratorGuide;
