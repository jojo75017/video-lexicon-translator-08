import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft, 
  Search, 
  Youtube, 
  Mail, 
  Users, 
  MessageSquare,
  TrendingUp,
  Target,
  Calendar,
  CheckCircle2,
  Clock,
  Zap,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

interface MarketingTask {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timeframe: string;
  link?: string;
}

interface MarketingChannel {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  tasks: MarketingTask[];
}

const marketingChannels: MarketingChannel[] = [
  {
    id: 'seo',
    name: 'SEO - Trafic Organique',
    icon: <Search className="h-5 w-5" />,
    color: 'from-green-500 to-emerald-600',
    description: 'Positionnement sur Google pour les mots-clés rentables',
    tasks: [
      { id: 'seo-1', title: 'Optimiser la page /ecrire-livre-chatgpt', description: 'Mot-clé: "écrire un livre avec chatgpt" (1300/mois)', priority: 'high', timeframe: 'Semaine 1' },
      { id: 'seo-2', title: 'Optimiser la page /creer-ebook-ia', description: 'Mot-clé: "créer ebook ia" (720/mois)', priority: 'high', timeframe: 'Semaine 1' },
      { id: 'seo-3', title: 'Publier article "Guide KDP 2025"', description: 'Article long format 3000+ mots', priority: 'medium', timeframe: 'Semaine 2', link: '/blog' },
      { id: 'seo-4', title: 'Publier article "50 niches rentables"', description: 'Liste avec analyse de chaque niche', priority: 'medium', timeframe: 'Semaine 2', link: '/blog' },
      { id: 'seo-5', title: 'Créer 5 backlinks guest posts', description: 'Contacter blogs écriture/entrepreneuriat', priority: 'low', timeframe: 'Mois 1' },
      { id: 'seo-6', title: 'Soumettre sitemap à Google Search Console', description: 'Vérifier indexation des pages', priority: 'high', timeframe: 'Immédiat' },
    ]
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: <Youtube className="h-5 w-5" />,
    color: 'from-red-500 to-rose-600',
    description: 'Vidéos tutoriels et démonstrations',
    tasks: [
      { id: 'yt-1', title: 'Créer vidéo "Recherche de niche KDP"', description: 'Script Loom prêt - 5 min', priority: 'high', timeframe: 'Semaine 1' },
      { id: 'yt-2', title: 'Créer vidéo "Génération contenu IA"', description: 'Montrer le workflow complet', priority: 'high', timeframe: 'Semaine 1' },
      { id: 'yt-3', title: 'Créer vidéo "Design couverture"', description: 'Démonstration génération cover', priority: 'medium', timeframe: 'Semaine 2' },
      { id: 'yt-4', title: 'Créer vidéo "Export KDP + SEO"', description: 'Process complet publication', priority: 'medium', timeframe: 'Semaine 2' },
      { id: 'yt-5', title: 'Comparatif "EbookStudio vs KDP Spy"', description: 'Vidéo comparative pour capter trafic concurrent', priority: 'low', timeframe: 'Mois 1' },
    ]
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: <Target className="h-5 w-5" />,
    color: 'from-pink-500 to-red-500',
    description: 'Épingles visuelles et tableaux thématiques',
    tasks: [
      { id: 'pin-1', title: 'Créer compte Business Pinterest', description: 'Profil optimisé avec lien vers /offres', priority: 'high', timeframe: 'Immédiat' },
      { id: 'pin-2', title: 'Créer tableau "Idées d\'Ebooks 2025"', description: '20+ épingles avec visuels attractifs', priority: 'high', timeframe: 'Semaine 1' },
      { id: 'pin-3', title: 'Créer tableau "KDP Tips & Tricks"', description: 'Conseils auto-édition illustrés', priority: 'medium', timeframe: 'Semaine 1' },
      { id: 'pin-4', title: 'Créer tableau "Couvertures Ebook"', description: 'Showcaser les couvertures générées', priority: 'medium', timeframe: 'Semaine 2' },
      { id: 'pin-5', title: 'Programmer 5 épingles/jour', description: 'Utiliser Tailwind ou Buffer', priority: 'high', timeframe: 'Quotidien' },
      { id: 'pin-6', title: 'Rejoindre 10 group boards', description: 'Groupes écriture/entrepreneuriat', priority: 'low', timeframe: 'Mois 1' },
    ]
  },
  {
    id: 'quora',
    name: 'Quora & Reddit',
    icon: <MessageSquare className="h-5 w-5" />,
    color: 'from-orange-500 to-amber-600',
    description: 'Réponses expertes et engagement communautaire',
    tasks: [
      { id: 'qa-1', title: 'Créer profil Quora expert "IA & Écriture"', description: 'Bio optimisée avec credentials', priority: 'high', timeframe: 'Immédiat' },
      { id: 'qa-2', title: 'Répondre à 5 questions/semaine', description: 'Questions sur ebooks, KDP, IA writing', priority: 'high', timeframe: 'Hebdomadaire' },
      { id: 'qa-3', title: 'Rejoindre r/selfpublish', description: 'Participer aux discussions', priority: 'medium', timeframe: 'Semaine 1' },
      { id: 'qa-4', title: 'Rejoindre r/kdp', description: 'Aider la communauté avec valeur', priority: 'medium', timeframe: 'Semaine 1' },
      { id: 'qa-5', title: 'Créer post "Comment j\'ai publié 10 ebooks"', description: 'Étude de cas avec mention outil', priority: 'low', timeframe: 'Mois 1' },
    ]
  },
  {
    id: 'email',
    name: 'Email Marketing',
    icon: <Mail className="h-5 w-5" />,
    color: 'from-blue-500 to-indigo-600',
    description: 'Séquences automatisées et newsletter',
    tasks: [
      { id: 'email-1', title: 'Vérifier séquence 7 emails active', description: '✅ Déjà configuré', priority: 'high', timeframe: 'Fait' },
      { id: 'email-2', title: 'Vérifier popup exit-intent', description: '✅ PDF bonus 40 pages actif', priority: 'high', timeframe: 'Fait' },
      { id: 'email-3', title: 'Créer newsletter hebdomadaire', description: 'Tips KDP + nouveautés outil', priority: 'medium', timeframe: 'Semaine 2' },
      { id: 'email-4', title: 'Segmenter liste par intérêt', description: 'Fiction vs Non-fiction vs KDP', priority: 'low', timeframe: 'Mois 1' },
      { id: 'email-5', title: 'A/B test objets emails', description: 'Optimiser taux ouverture', priority: 'low', timeframe: 'Mois 2' },
    ]
  },
  {
    id: 'affiliation',
    name: 'Programme Affiliation',
    icon: <Users className="h-5 w-5" />,
    color: 'from-purple-500 to-violet-600',
    description: 'Partenaires et influenceurs',
    tasks: [
      { id: 'aff-1', title: 'Page affiliation prête', description: '✅ /affiliation avec 50% commission', priority: 'high', timeframe: 'Fait', link: '/affiliation-formation' },
      { id: 'aff-2', title: 'Contacter 10 blogueurs écriture', description: 'Proposer partenariat affilié', priority: 'high', timeframe: 'Semaine 1' },
      { id: 'aff-3', title: 'Contacter 5 YouTubeurs KDP', description: 'Collaboration vidéo sponsorisée', priority: 'medium', timeframe: 'Semaine 2' },
      { id: 'aff-4', title: 'Créer kit affilié complet', description: 'Bannières, emails, argumentaire', priority: 'medium', timeframe: 'Semaine 1' },
      { id: 'aff-5', title: 'Lancer sur plateformes affiliation', description: 'Awin, Affilae, 1tpe', priority: 'low', timeframe: 'Mois 1' },
    ]
  },
];

const MarketingPlanPage: React.FC = () => {
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('marketing-plan-tasks');
    if (saved) {
      setCompletedTasks(JSON.parse(saved));
    }
  }, []);

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => {
      const updated = prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId];
      localStorage.setItem('marketing-plan-tasks', JSON.stringify(updated));
      return updated;
    });
  };

  const resetProgress = () => {
    setCompletedTasks([]);
    localStorage.removeItem('marketing-plan-tasks');
    toast.success('Progression réinitialisée');
  };

  const totalTasks = marketingChannels.reduce((acc, ch) => acc + ch.tasks.length, 0);
  const completedCount = completedTasks.length;
  const overallProgress = Math.round((completedCount / totalTasks) * 100);

  const getChannelProgress = (channelId: string) => {
    const channel = marketingChannels.find(ch => ch.id === channelId);
    if (!channel) return 0;
    const completed = channel.tasks.filter(t => completedTasks.includes(t.id)).length;
    return Math.round((completed / channel.tasks.length) * 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Priorité haute';
      case 'medium': return 'Priorité moyenne';
      case 'low': return 'Priorité basse';
      default: return priority;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/10">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                📈 Plan Marketing
              </h1>
              <p className="text-muted-foreground">Stratégie d'acquisition de trafic EbookStudio</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={resetProgress}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        </div>

        {/* Stats globales */}
        <Card className="mb-8 border-purple-500/20 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400">{overallProgress}%</div>
                <div className="text-sm text-muted-foreground">Progression globale</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400">{completedCount}</div>
                <div className="text-sm text-muted-foreground">Tâches complétées</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-400">{totalTasks - completedCount}</div>
                <div className="text-sm text-muted-foreground">Tâches restantes</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400">{marketingChannels.length}</div>
                <div className="text-sm text-muted-foreground">Canaux actifs</div>
              </div>
            </div>
            <Progress value={overallProgress} className="mt-6 h-3" />
          </CardContent>
        </Card>

        {/* Priorités immédiates */}
        <Card className="mb-8 border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-red-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-400" />
              Actions Prioritaires Cette Semaine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {marketingChannels.flatMap(ch => 
                ch.tasks.filter(t => t.priority === 'high' && !completedTasks.includes(t.id))
              ).slice(0, 5).map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border">
                  <Checkbox 
                    checked={completedTasks.includes(task.id)}
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-muted-foreground">{task.description}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {task.timeframe}
                  </Badge>
                </div>
              ))}
              {marketingChannels.flatMap(ch => 
                ch.tasks.filter(t => t.priority === 'high' && !completedTasks.includes(t.id))
              ).length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-400" />
                  Toutes les tâches prioritaires sont complétées ! 🎉
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Canaux marketing */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketingChannels.map(channel => {
            const progress = getChannelProgress(channel.id);
            const isExpanded = selectedChannel === channel.id;
            
            return (
              <Card 
                key={channel.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  isExpanded ? 'md:col-span-2 lg:col-span-3' : ''
                }`}
                onClick={() => setSelectedChannel(isExpanded ? null : channel.id)}
              >
                <CardHeader className={`bg-gradient-to-r ${channel.color} text-white rounded-t-lg`}>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {channel.icon}
                      {channel.name}
                    </div>
                    <Badge className="bg-white/20 text-white">
                      {progress}%
                    </Badge>
                  </CardTitle>
                  <p className="text-white/80 text-sm">{channel.description}</p>
                  <Progress value={progress} className="h-2 bg-white/20" />
                </CardHeader>
                
                {isExpanded && (
                  <CardContent className="pt-4" onClick={e => e.stopPropagation()}>
                    <div className="grid gap-3">
                      {channel.tasks.map(task => (
                        <div 
                          key={task.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                            completedTasks.includes(task.id) 
                              ? 'bg-green-500/10 border-green-500/30' 
                              : 'bg-background/50'
                          }`}
                        >
                          <Checkbox 
                            checked={completedTasks.includes(task.id)}
                            onCheckedChange={() => toggleTask(task.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className={`font-medium ${completedTasks.includes(task.id) ? 'line-through text-muted-foreground' : ''}`}>
                              {task.title}
                            </div>
                            <div className="text-sm text-muted-foreground">{task.description}</div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                {getPriorityLabel(task.priority)}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Calendar className="h-3 w-3 mr-1" />
                                {task.timeframe}
                              </Badge>
                              {task.link && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-6 px-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(task.link!);
                                  }}
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Ouvrir
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
                
                {!isExpanded && (
                  <CardContent className="pt-4">
                    <div className="text-sm text-muted-foreground">
                      {channel.tasks.filter(t => completedTasks.includes(t.id)).length} / {channel.tasks.length} tâches
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Cliquez pour voir les détails
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Calendrier recommandé */}
        <Card className="mt-8 border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-400" />
              Calendrier Recommandé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <div className="font-bold text-green-400 mb-2">Immédiat</div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Compte Pinterest Business</li>
                  <li>• Profil Quora expert</li>
                  <li>• Sitemap Google</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
                <div className="font-bold text-blue-400 mb-2">Semaine 1-2</div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• 5 vidéos Loom YouTube</li>
                  <li>• 3 tableaux Pinterest</li>
                  <li>• Kit affilié</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/20">
                <div className="font-bold text-purple-400 mb-2">Mois 1</div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• 8 articles blog SEO</li>
                  <li>• Partenariats blogueurs</li>
                  <li>• Newsletter hebdo</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
                <div className="font-bold text-orange-400 mb-2">Mois 2+</div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Programme affiliation actif</li>
                  <li>• Guest posts SEO</li>
                  <li>• A/B testing emails</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white">
          <CardContent className="py-8 text-center">
            <h3 className="text-2xl font-bold mb-2">🚀 Prêt à booster votre trafic ?</h3>
            <p className="text-white/80 mb-4">Commencez par les tâches prioritaires et progressez étape par étape</p>
            <div className="flex justify-center gap-4">
              <Button 
                variant="secondary" 
                onClick={() => navigate('/blog')}
              >
                Voir le Blog
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={() => navigate('/affiliation-formation')}
              >
                Programme Affiliation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketingPlanPage;
