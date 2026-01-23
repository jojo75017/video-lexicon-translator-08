import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  TrendingUp, 
  DollarSign, 
  Star, 
  BookOpen, 
  Target, 
  Zap, 
  BarChart3, 
  Eye, 
  ShoppingCart,
  Crown,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Rocket,
  Award,
  Users,
  Globe,
  Shield,
  Clock,
  Lightbulb,
  PieChart,
  LineChart
} from 'lucide-react';
import { motion } from 'framer-motion';

interface EbookPresentationProps {
  onNavigate: (tab: string) => void;
}

const features = [
  {
    icon: Search,
    title: 'Recherche de Niches KDP',
    description: 'Analysez les niches rentables sur Amazon KDP. Découvrez les opportunités cachées et les marchés mal desservis.',
    tab: 'kdp-research',
    color: 'from-blue-500 to-cyan-500',
    badge: 'Essentiel'
  },
  {
    icon: BarChart3,
    title: 'Analyse du Marché',
    description: 'Évaluez la demande, la concurrence et le potentiel de revenus pour chaque niche. Données BSR, ventes estimées et revenus.',
    tab: 'market-analysis',
    color: 'from-purple-500 to-pink-500',
    badge: 'PRO'
  },
  {
    icon: Eye,
    title: 'Simulateur Amazon',
    description: 'Visualisez votre livre tel qu\'il apparaîtra sur Amazon. Prévisualisez le titre, la couverture et la description.',
    tab: 'amazon-simulator',
    color: 'from-orange-500 to-red-500',
    badge: 'Nouveau'
  },
  {
    icon: Target,
    title: 'Amazon Ads Simulator',
    description: 'Planifiez vos campagnes publicitaires. Estimez les clics, conversions, ACOS et ROI avant de dépenser.',
    tab: 'amazon-ads',
    color: 'from-green-500 to-emerald-500',
    badge: 'Marketing'
  },
  {
    icon: TrendingUp,
    title: 'Prédicteur de Tendances',
    description: 'Anticipez les futures tendances du marché. Identifiez les niches émergentes avant vos concurrents.',
    tab: 'trend-predictor',
    color: 'from-violet-500 to-purple-500',
    badge: '2026'
  },
  {
    icon: Lightbulb,
    title: 'Niches Rentables',
    description: 'Accédez à une base de données de niches validées avec métriques détaillées et potentiel de revenus.',
    tab: 'niches',
    color: 'from-amber-500 to-yellow-500',
    badge: 'Top'
  }
];

const kdpMetrics = [
  { label: 'ASIN', description: 'Identifiant unique Amazon', icon: ShoppingCart },
  { label: 'BSR', description: 'Classement Best Seller', icon: TrendingUp },
  { label: 'Prix', description: 'Prix de vente actuel', icon: DollarSign },
  { label: 'Notes', description: 'Évaluations clients', icon: Star },
  { label: 'Ventes Estimées', description: 'Volume de ventes mensuel', icon: BarChart3 },
  { label: 'Revenus Estimés', description: 'Chiffre d\'affaires mensuel', icon: PieChart }
];

const benefits = [
  { icon: Clock, text: 'Gagnez des heures de recherche manuelle' },
  { icon: Target, text: 'Ciblez les niches à forte demande' },
  { icon: DollarSign, text: 'Maximisez vos royalties KDP' },
  { icon: Shield, text: 'Évitez les niches saturées' },
  { icon: Rocket, text: 'Lancez plus vite sur le marché' },
  { icon: Award, text: 'Créez des bestsellers dès le premier livre' }
];

export const EbookPresentation: React.FC<EbookPresentationProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-8 md:p-12 text-white"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTZzLTItNC0yLTYgMi00IDItNi0yLTQtMi02IDItNCAyLTYtMi00LTItNiAyLTQgMi02Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
              <Search className="w-8 h-8" />
            </div>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-1">
              <Sparkles className="w-3 h-3 mr-1" />
              Outils de Recherche KDP
            </Badge>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Découvrez les Niches Rentables sur Amazon KDP
          </h1>
          
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mb-6">
            Notre suite d'outils vous permet d'analyser le marché Amazon, identifier les opportunités 
            et créer des livres qui se vendent. Inspiré des meilleurs outils de recherche KDP, 
            <span className="font-bold"> 100% intégré à votre flux de travail.</span>
          </p>

          <div className="flex flex-wrap gap-3">
            <Button 
              size="lg" 
              onClick={() => onNavigate('kdp-research')}
              className="bg-white text-purple-600 hover:bg-white/90 shadow-xl"
            >
              <Search className="w-4 h-4 mr-2" />
              Lancer une Recherche
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => onNavigate('complete-workflow')}
              className="border-white/50 text-white hover:bg-white/10"
            >
              <Zap className="w-4 h-4 mr-2" />
              Workflow Complet
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-fuchsia-400/20 blur-2xl" />
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-2 border-violet-200/50 dark:border-violet-800/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-violet-500" />
              Métriques KDP Analysées
            </CardTitle>
            <CardDescription>
              Toutes les données essentielles pour évaluer le potentiel d'une niche
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {kdpMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border border-violet-200/50 dark:border-violet-800/30 text-center hover:shadow-lg transition-shadow"
                >
                  <metric.icon className="w-6 h-6 mx-auto mb-2 text-violet-500" />
                  <p className="font-bold text-sm">{metric.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Outils de Recherche</h2>
            <p className="text-muted-foreground">Tout ce dont vous avez besoin pour dominer votre niche</p>
          </div>
          <Badge variant="outline" className="bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border-violet-300 dark:border-violet-700">
            <Globe className="w-3 h-3 mr-1" />
            Marchés Mondiaux
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.tab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card 
                className="h-full cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-violet-400/50 dark:hover:border-violet-600/50 group"
                onClick={() => onNavigate(feature.tab)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg`}>
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-3 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                  <div className="mt-4 flex items-center text-sm text-violet-600 dark:text-violet-400 font-medium">
                    Accéder
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-emerald-200/50 dark:border-emerald-800/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Pourquoi Utiliser Nos Outils KDP ?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/60 dark:bg-white/5 border border-emerald-200/50 dark:border-emerald-800/30"
                >
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <benefit.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center py-8"
      >
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200/50 dark:border-amber-800/30 p-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-8 h-8 text-amber-500" />
            <h3 className="text-2xl font-bold">Prêt à Dominer Amazon KDP ?</h3>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Commencez par une recherche de niche, analysez la concurrence, puis créez votre livre 
            avec notre workflow IA complet. De l'idée à la publication en quelques clics.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => onNavigate('kdp-research')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
            >
              <Search className="w-4 h-4 mr-2" />
              Rechercher une Niche
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => onNavigate('complete-workflow')}
              className="border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Créer Mon Livre
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Disclaimer */}
      <div className="text-center text-xs text-muted-foreground p-4 bg-muted/30 rounded-xl border border-muted-foreground/10">
        <Shield className="w-4 h-4 inline-block mr-1" />
        <strong>Avertissement :</strong> Les données affichées (BSR, ventes, revenus) sont des estimations générées par IA 
        à des fins d'inspiration et de planification. Pour des données en temps réel, nous recommandons de consulter 
        directement Amazon ou d'utiliser des outils spécialisés comme Book Bolt.
      </div>
    </div>
  );
};

export default EbookPresentation;
