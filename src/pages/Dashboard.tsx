import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Search, 
  Globe, 
  TrendingUp, 
  Users, 
  Lightbulb, 
  BookOpen, 
  Target, 
  MessageCircle, 
  Image, 
  Mail,
  Activity,
  Award,
  Clock,
  Eye,
  Filter,
  Star,
  Zap,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import des icônes personnalisées des bots
import DashBotIcon from '@/assets/icons/dash-bot.png';
import RivalAiIcon from '@/assets/icons/rival-ai.png';
import CrawlBotIcon from '@/assets/icons/crawl-bot.png';
import KeywOrdIcon from '@/assets/icons/keyw-ord.png';
import SerpBotIcon from '@/assets/icons/serp-bot.png';
import OptiMaxIcon from '@/assets/icons/opti-max.png';
import ContEntIcon from '@/assets/icons/cont-ent.png';
import TitleGenIcon from '@/assets/icons/title-gen.png';
import ArchBotIcon from '@/assets/icons/arch-bot.png';
import RoboTxtIcon from '@/assets/icons/robo-txt.png';
import EbookAiIcon from '@/assets/icons/ebook-ai.png';
import IdeaBotIcon from '@/assets/icons/idea-bot.png';
import PromptProIcon from '@/assets/icons/prompt-pro.png';
import QuoraBotIcon from '@/assets/icons/quora-bot.png';
import PinBotIcon from '@/assets/icons/pin-bot.png';
import SignBotIcon from '@/assets/icons/sign-bot.png';
import MailBotIcon from '@/assets/icons/mail-bot.png';
import ProdBotIcon from '@/assets/icons/prod-bot.png';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({
    totalAnalyses: 156,
    todayAnalyses: 12,
    avgSeoScore: 78,
    totalKeywords: 2340
  });

  // Simulation d'activité récente
  useEffect(() => {
    const activities = [
      { id: 1, type: 'analysis', title: 'Analyse SEO - example.com', time: '5 min ago', score: 82 },
      { id: 2, type: 'keyword', title: 'Recherche mots-clés - "chaussures running"', time: '12 min ago', count: 45 },
      { id: 3, type: 'competitor', title: 'Analyse concurrentielle - nike.com', time: '1h ago', insights: 8 },
      { id: 4, type: 'content', title: 'Génération titre SEO', time: '2h ago', generated: 15 }
    ];
    setRecentActivity(activities);
  }, []);

  const features = [
    {
      title: 'Dashboard & Analytics',
      botName: 'DASH-BOT',
      description: 'Vue d\'ensemble et métriques de performance',
      icon: BarChart3,
      customIcon: DashBotIcon,
      path: '/analytics',
      color: 'from-blue-500 to-blue-600',
      category: 'core',
      priority: 'high',
      status: 'active'
    },
    {
      title: 'Analyse Concurrentielle Pro',
      botName: 'RIVAL-AI',
      description: 'Intelligence concurrentielle avancée',
      icon: Users,
      customIcon: RivalAiIcon,
      path: '/competitor-analysis',
      color: 'from-red-500 to-red-600',
      category: 'analysis',
      priority: 'high',
      status: 'active'
    },
    {
      title: 'Crawler SEO Avancé',
      botName: 'CRAWL-BOT',
      description: 'Audit technique complet de site web',
      icon: Globe,
      customIcon: CrawlBotIcon,
      path: '/crawler',
      color: 'from-emerald-500 to-emerald-600',
      category: 'analysis',
      priority: 'high',
      status: 'active'
    },
    {
      title: 'Générateur de Mots-clés Pro',
      botName: 'KEYW-ORD',
      description: 'Research avancée avec métriques et clustering',
      icon: Search,
      customIcon: KeywOrdIcon,
      path: '/keyword-generator',
      color: 'from-purple-500 to-purple-600',
      category: 'keywords',
      priority: 'high',
      status: 'updated'
    },
    {
      title: 'Générateur SERP',
      botName: 'SERP-BOT',
      description: 'Générez des URLs pour les sites français',
      icon: Search,
      customIcon: SerpBotIcon,
      path: '/serp-generator',
      color: 'from-indigo-500 to-indigo-600',
      category: 'keywords',
      priority: 'medium',
      status: 'active'
    },
    {
      title: 'Optimiseur SEO',
      botName: 'OPTI-MAX',
      description: 'Optimisation complète de contenu',
      icon: TrendingUp,
      customIcon: OptiMaxIcon,
      path: '/seo',
      color: 'from-green-500 to-green-600',
      category: 'optimization',
      priority: 'high',
      status: 'active'
    },
    {
      title: 'Générateur SEO Content',
      botName: 'CONT-ENT',
      description: 'Création de contenu SEO optimisé',
      icon: TrendingUp,
      customIcon: ContEntIcon,
      path: '/seo-generator',
      color: 'from-orange-500 to-orange-600',
      category: 'content',
      priority: 'high',
      status: 'active'
    },
    {
      title: 'Générateur de Titres Pro',
      botName: 'TITLE-GEN',
      description: 'Titres SEO optimisés par thématique',
      icon: Lightbulb,
      customIcon: TitleGenIcon,
      path: '/title-generator',
      color: 'from-yellow-500 to-orange-600',
      category: 'content',
      priority: 'medium',
      status: 'active'
    },
    {
      title: 'Architecture & Hiérarchie',
      botName: 'ARCH-BOT',
      description: 'Structure optimale de votre site',
      icon: Globe,
      customIcon: ArchBotIcon,
      path: '/hierarchy',
      color: 'from-cyan-500 to-cyan-600',
      category: 'technical',
      priority: 'medium',
      status: 'active'
    },
    {
      title: 'Test Robots.txt',
      botName: 'ROBO-TXT',
      description: 'Validation et test de robots.txt',
      icon: Search,
      customIcon: RoboTxtIcon,
      path: '/robots-txt',
      color: 'from-slate-500 to-slate-600',
      category: 'technical',
      priority: 'low',
      status: 'active'
    },
    {
      title: 'Générateur d\'Ebook Pro',
      botName: 'EBOOK-AI',
      description: 'Création complète d\'ebooks avec export',
      icon: BookOpen,
      customIcon: EbookAiIcon,
      path: '/ebook-planner',
      color: 'from-purple-500 to-purple-600',
      category: 'content',
      priority: 'high',
      status: 'complete'
    },
    {
      title: 'Idées de Titres d\'Ebook',
      botName: 'IDEA-BOT',
      description: 'Inspiration et génération de titres',
      icon: Lightbulb,
      customIcon: IdeaBotIcon,
      path: '/ebook-ideas',
      color: 'from-pink-500 to-rose-600',
      category: 'content',
      priority: 'medium',
      status: 'active'
    },
    {
      title: 'Pack Prompts Professionnels',
      botName: 'PROMPT-PRO',
      description: 'Génération de prompts IA premium',
      icon: Target,
      customIcon: PromptProIcon,
      path: '/prompts-generator',
      color: 'from-orange-500 to-red-600',
      category: 'ai',
      priority: 'medium',
      status: 'active'
    },
    {
      title: 'Quora Marketing Pro',
      botName: 'QUORA-BOT',
      description: 'Stratégie complète pour Quora',
      icon: MessageCircle,
      customIcon: QuoraBotIcon,
      path: '/quora',
      color: 'from-red-500 to-pink-600',
      category: 'marketing',
      priority: 'medium',
      status: 'active'
    },
    {
      title: 'Pinterest Generator Pro',
      botName: 'PIN-BOT',
      description: 'Création de contenu viral Pinterest',
      icon: Image,
      customIcon: PinBotIcon,
      path: '/pinterest',
      color: 'from-pink-500 to-purple-600',
      category: 'marketing',
      priority: 'medium',
      status: 'active'
    },
    {
      title: 'Signatures Email Pro',
      botName: 'SIGN-BOT',
      description: 'Générateur de signatures professionnelles',
      icon: Mail,
      customIcon: SignBotIcon,
      path: '/signature',
      color: 'from-blue-500 to-indigo-600',
      category: 'marketing',
      priority: 'low',
      status: 'active'
    },
    {
      title: 'Email Marketing SEO',
      botName: 'MAIL-BOT',
      description: 'Optimisation complète d\'emails',
      icon: Mail,
      customIcon: MailBotIcon,
      path: '/email-marketing',
      color: 'from-green-500 to-teal-600',
      category: 'marketing',
      priority: 'medium',
      status: 'updated'
    },
    {
      title: 'Générateur de Fiches Produits',
      botName: 'PROD-BOT',
      description: 'Fiches produits complètes avec IA - 500 mots optimisés',
      icon: Target,
      customIcon: ProdBotIcon,
      path: '/product-generator',
      color: 'from-blue-500 to-cyan-600',
      category: 'content',
      priority: 'high',
      status: 'complete'
    },
    {
      title: 'Clonage de Site',
      botName: 'CLONE-BOT',
      description: 'Clonez n\'importe quel site web en entrant son URL',
      icon: Globe,
      customIcon: CrawlBotIcon, // Réutilise l'icône du crawler
      path: '/site-cloner',
      color: 'from-violet-500 to-violet-600',
      category: 'technical',
      priority: 'high',
      status: 'new'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete': return 'bg-green-500';
      case 'updated': return 'bg-blue-500';
      case 'new': return 'bg-violet-500';
      case 'active': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'complete': return CheckCircle;
      case 'updated': return Star;
      case 'new': return Zap;
      case 'active': return Activity;
      default: return Info;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredFeatures = activeFilter === 'all' 
    ? features 
    : features.filter(f => f.category === activeFilter);

  const categories = [
    { id: 'all', label: 'Tous les modules', count: features.length },
    { id: 'core', label: 'Core Analytics', count: features.filter(f => f.category === 'core').length },
    { id: 'analysis', label: 'Analyse', count: features.filter(f => f.category === 'analysis').length },
    { id: 'keywords', label: 'Mots-clés', count: features.filter(f => f.category === 'keywords').length },
    { id: 'content', label: 'Contenu', count: features.filter(f => f.category === 'content').length },
    { id: 'marketing', label: 'Marketing', count: features.filter(f => f.category === 'marketing').length },
    { id: 'technical', label: 'Technique', count: features.filter(f => f.category === 'technical').length }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header avec stats */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                🚀 Suite SEO Professionnelle
              </h1>
              <p className="text-muted-foreground mt-2">
                Tableau de bord complet pour votre stratégie SEO
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Activity className="h-3 w-3" />
                {stats.todayAnalyses} analyses aujourd'hui
              </Badge>
            </div>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Analyses totales</p>
                    <p className="text-2xl font-bold">{stats.totalAnalyses}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100 text-green-600">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Score SEO moyen</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">{stats.avgSeoScore}%</p>
                      <Progress value={stats.avgSeoScore} className="w-16 h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mots-clés analysés</p>
                    <p className="text-2xl font-bold">{stats.totalKeywords.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dernière analyse</p>
                    <p className="text-lg font-semibold">Il y a 5 min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          {/* Filtres par catégorie */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeFilter === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(category.id)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                {category.label}
                <Badge variant="secondary" className="ml-1">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Grille des modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeatures.map((feature) => {
              const StatusIcon = getStatusIcon(feature.status);
              
              return (
                <Card key={feature.title} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/20 relative overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="relative">
                          {/* Icône bot personnalisée */}
                          <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg border-2 border-white/50">
                            <img 
                              src={feature.customIcon} 
                              alt={feature.botName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {/* Badge du nom du bot */}
                          <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                            {feature.botName}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="group-hover:text-primary transition-colors text-base">
                              {feature.title}
                            </CardTitle>
                            <StatusIcon className={`h-4 w-4 ${getStatusColor(feature.status)} text-white rounded-full p-0.5`} />
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getPriorityColor(feature.priority)}`}
                      >
                        {feature.priority === 'high' && '🔥'} 
                        {feature.priority === 'medium' && '⚡'} 
                        {feature.priority === 'low' && '📝'} 
                        {feature.priority.charAt(0).toUpperCase() + feature.priority.slice(1)}
                      </Badge>
                      
                      <Badge variant="outline" className="text-xs">
                        {feature.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <Button 
                      onClick={() => navigate(feature.path)}
                      className="w-full group-hover:shadow-md transition-all"
                      variant={feature.priority === 'high' ? 'default' : 'outline'}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {feature.status === 'complete' ? 'Utiliser' : 'Accéder'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Activité récente */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Activité Récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        {activity.type === 'analysis' && <BarChart3 className="h-4 w-4 text-primary" />}
                        {activity.type === 'keyword' && <Search className="h-4 w-4 text-primary" />}
                        {activity.type === 'competitor' && <Users className="h-4 w-4 text-primary" />}
                        {activity.type === 'content' && <Lightbulb className="h-4 w-4 text-primary" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {activity.score && (
                        <Badge variant="outline" className="text-xs">
                          Score: {activity.score}%
                        </Badge>
                      )}
                      {activity.count && (
                        <Badge variant="outline" className="text-xs">
                          {activity.count} mots-clés
                        </Badge>
                      )}
                      {activity.insights && (
                        <Badge variant="outline" className="text-xs">
                          {activity.insights} insights
                        </Badge>
                      )}
                      {activity.generated && (
                        <Badge variant="outline" className="text-xs">
                          {activity.generated} générés
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;