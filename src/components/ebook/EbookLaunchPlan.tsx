import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Rocket, Calendar, CheckCircle2, Clock, Target, TrendingUp,
  Share2, Mail, MessageSquare, Star, Gift, Users, Megaphone,
  BarChart3, RefreshCw, Award, Zap, BookOpen, ExternalLink,
  ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import EbookLaunchSocialPosts from './EbookLaunchSocialPosts';

interface LaunchTask {
  id: string;
  day: number;
  title: string;
  description: string;
  category: 'preparation' | 'launch' | 'promotion' | 'optimization' | 'scaling';
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  tips?: string[];
}

const launchTasks: LaunchTask[] = [
  // Phase 1: Pré-lancement (J-7 à J0)
  { id: 'prep-1', day: -7, title: 'Finaliser la page Amazon', description: 'Vérifier titre, description, mots-clés et catégories', category: 'preparation', priority: 'high', estimatedTime: '2h', tips: ['Utilisez les 7 mots-clés autorisés', 'Description de 4000 caractères max'] },
  { id: 'prep-2', day: -6, title: 'Préparer les visuels promotionnels', description: 'Créer bannières, posts réseaux sociaux, mockups 3D', category: 'preparation', priority: 'high', estimatedTime: '3h', tips: ['Format carré pour Instagram', 'Format 16:9 pour YouTube'] },
  { id: 'prep-3', day: -5, title: 'Rédiger les emails de lancement', description: 'Préparer séquence de 3-5 emails pour votre liste', category: 'preparation', priority: 'high', estimatedTime: '2h', tips: ['Email teaser J-3', 'Email lancement J0', 'Email rappel J+1'] },
  { id: 'prep-4', day: -4, title: 'Contacter les blogueurs/influenceurs', description: 'Envoyer des copies ARC aux reviewers potentiels', category: 'preparation', priority: 'medium', estimatedTime: '2h', tips: ['Proposez une copie gratuite', 'Demandez une review honnête'] },
  { id: 'prep-5', day: -3, title: 'Configurer la promotion KDP', description: 'Planifier Kindle Countdown Deal ou promo gratuite', category: 'preparation', priority: 'medium', estimatedTime: '30min' },
  { id: 'prep-6', day: -2, title: 'Tester les liens et la page', description: 'Vérifier que tout fonctionne correctement', category: 'preparation', priority: 'high', estimatedTime: '1h' },
  { id: 'prep-7', day: -1, title: 'Préparer le contenu J0', description: 'Programmer posts réseaux sociaux et emails', category: 'preparation', priority: 'high', estimatedTime: '2h' },
  
  // Phase 2: Jour de lancement (J0)
  { id: 'launch-1', day: 0, title: '🚀 LANCEMENT OFFICIEL', description: 'Publier sur tous vos canaux simultanément', category: 'launch', priority: 'high', estimatedTime: '4h', tips: ['Postez entre 9h et 11h', 'Soyez présent pour répondre'] },
  { id: 'launch-2', day: 0, title: 'Envoyer email à la liste', description: 'Email principal avec lien direct Amazon', category: 'launch', priority: 'high', estimatedTime: '30min' },
  { id: 'launch-3', day: 0, title: 'Posts réseaux sociaux', description: 'Facebook, Instagram, LinkedIn, Twitter/X', category: 'launch', priority: 'high', estimatedTime: '1h' },
  { id: 'launch-4', day: 0, title: 'Demander les premières reviews', description: 'Contacter famille, amis, bêta-lecteurs', category: 'launch', priority: 'high', estimatedTime: '1h', tips: ['5-10 reviews le jour J booste le classement'] },
  
  // Phase 3: Première semaine (J1-J7)
  { id: 'promo-1', day: 1, title: 'Email de rappel', description: 'Relancer ceux qui n\'ont pas ouvert', category: 'promotion', priority: 'high', estimatedTime: '30min' },
  { id: 'promo-2', day: 2, title: 'Partager les premières reviews', description: 'Capturer et partager les témoignages positifs', category: 'promotion', priority: 'medium', estimatedTime: '1h' },
  { id: 'promo-3', day: 3, title: 'Lancer campagne Amazon Ads', description: 'Démarrer avec budget test de 5€/jour', category: 'promotion', priority: 'high', estimatedTime: '1h', tips: ['Commencez par les mots-clés exacts', 'ACOS cible: 30-50%'] },
  { id: 'promo-4', day: 4, title: 'Créer contenu bonus', description: 'Article de blog, vidéo, podcast en lien avec le livre', category: 'promotion', priority: 'medium', estimatedTime: '3h' },
  { id: 'promo-5', day: 5, title: 'Engagement communautaire', description: 'Répondre aux commentaires, participer aux groupes', category: 'promotion', priority: 'medium', estimatedTime: '2h' },
  { id: 'promo-6', day: 6, title: 'Analyser les premières stats', description: 'Vérifier ventes, pages lues, classement', category: 'promotion', priority: 'high', estimatedTime: '1h' },
  { id: 'promo-7', day: 7, title: 'Bilan semaine 1', description: 'Ajuster stratégie selon résultats', category: 'promotion', priority: 'high', estimatedTime: '1h' },
  
  // Phase 4: Semaine 2-3 (J8-J21)
  { id: 'opt-1', day: 8, title: 'Optimiser les Amazon Ads', description: 'Couper les mots-clés non rentables', category: 'optimization', priority: 'high', estimatedTime: '1h' },
  { id: 'opt-2', day: 10, title: 'Solliciter plus de reviews', description: 'Email de suivi aux acheteurs', category: 'optimization', priority: 'high', estimatedTime: '30min' },
  { id: 'opt-3', day: 12, title: 'Tester nouveaux mots-clés Ads', description: 'Ajouter des mots-clés pertinents découverts', category: 'optimization', priority: 'medium', estimatedTime: '1h' },
  { id: 'opt-4', day: 14, title: 'Bilan mi-parcours', description: 'Analyser ROI et ajuster budget pub', category: 'optimization', priority: 'high', estimatedTime: '2h' },
  { id: 'opt-5', day: 16, title: 'Cross-promotion', description: 'Échanger visibilité avec autres auteurs', category: 'optimization', priority: 'medium', estimatedTime: '2h' },
  { id: 'opt-6', day: 18, title: 'Contenu evergreen', description: 'Créer du contenu qui génère du trafic long terme', category: 'optimization', priority: 'medium', estimatedTime: '3h' },
  { id: 'opt-7', day: 21, title: 'Bilan semaine 3', description: 'Évaluer ce qui fonctionne le mieux', category: 'optimization', priority: 'high', estimatedTime: '1h' },
  
  // Phase 5: Semaine 4 (J22-J30)
  { id: 'scale-1', day: 22, title: 'Augmenter budget gagnant', description: 'Doubler le budget sur les campagnes rentables', category: 'scaling', priority: 'high', estimatedTime: '30min' },
  { id: 'scale-2', day: 24, title: 'Planifier le prochain livre', description: 'Capitaliser sur le momentum', category: 'scaling', priority: 'medium', estimatedTime: '2h' },
  { id: 'scale-3', day: 26, title: 'Créer une box set/bundle', description: 'Si vous avez plusieurs livres', category: 'scaling', priority: 'low', estimatedTime: '3h' },
  { id: 'scale-4', day: 28, title: 'Automatiser la promotion', description: 'Configurer des rappels et posts récurrents', category: 'scaling', priority: 'medium', estimatedTime: '2h' },
  { id: 'scale-5', day: 30, title: '🎯 BILAN FINAL 30 JOURS', description: 'Analyser les résultats et définir la stratégie long terme', category: 'scaling', priority: 'high', estimatedTime: '3h', tips: ['Documentez ce qui a marché', 'Calculez votre ROI réel', 'Planifiez les 90 prochains jours'] },
];

const phaseInfo = {
  preparation: { label: 'Pré-lancement', color: 'from-blue-500 to-cyan-500', icon: Calendar, days: 'J-7 à J-1' },
  launch: { label: 'Jour J', color: 'from-orange-500 to-red-500', icon: Rocket, days: 'J0' },
  promotion: { label: 'Semaine 1', color: 'from-purple-500 to-pink-500', icon: Megaphone, days: 'J1 à J7' },
  optimization: { label: 'Semaines 2-3', color: 'from-green-500 to-emerald-500', icon: TrendingUp, days: 'J8 à J21' },
  scaling: { label: 'Semaine 4', color: 'from-amber-500 to-yellow-500', icon: Award, days: 'J22 à J30' },
};

const EbookLaunchPlan: React.FC = () => {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('ebook_launch_plan_completed');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<string>('checklist');
  const [launchDate, setLaunchDate] = useState<Date | null>(() => {
    const saved = localStorage.getItem('ebook_launch_date');
    return saved ? new Date(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('ebook_launch_plan_completed', JSON.stringify([...completedTasks]));
  }, [completedTasks]);

  const toggleTask = (taskId: string) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  const toggleExpand = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const filteredTasks = selectedPhase === 'all' 
    ? launchTasks 
    : launchTasks.filter(t => t.category === selectedPhase);

  const totalTasks = launchTasks.length;
  const completedCount = completedTasks.size;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  const getPhaseProgress = (phase: string) => {
    const phaseTasks = launchTasks.filter(t => t.category === phase);
    const phaseCompleted = phaseTasks.filter(t => completedTasks.has(t.id)).length;
    return { completed: phaseCompleted, total: phaseTasks.length };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDayLabel = (day: number) => {
    if (day < 0) return `J${day}`;
    if (day === 0) return 'J0';
    return `J+${day}`;
  };

  const resetProgress = () => {
    if (confirm('Réinitialiser toute la progression ?')) {
      setCompletedTasks(new Set());
      localStorage.removeItem('ebook_launch_plan_completed');
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="checklist" className="flex items-center gap-2">
          <Rocket className="h-4 w-4" />
          Plan de Lancement
        </TabsTrigger>
        <TabsTrigger value="social" className="flex items-center gap-2">
          <Megaphone className="h-4 w-4" />
          Posts Réseaux Sociaux
        </TabsTrigger>
      </TabsList>

      <TabsContent value="checklist">
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-violet-900/30 to-purple-900/20 border-violet-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  Plan de Lancement 30 Jours
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs">
                    2026
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Checklist interactive pour maximiser vos ventes
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetProgress}
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Réinitialiser
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Barre de progression globale */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progression globale</span>
                <span className="font-medium text-violet-400">
                  {completedCount}/{totalTasks} tâches ({progressPercent}%)
                </span>
              </div>
              <Progress value={progressPercent} className="h-3" />
            </div>

            {/* Stats par phase */}
            <div className="grid grid-cols-5 gap-2 mt-4">
              {Object.entries(phaseInfo).map(([key, info]) => {
                const progress = getPhaseProgress(key);
                const Icon = info.icon;
                const isComplete = progress.completed === progress.total;
                return (
                  <motion.button
                    key={key}
                    onClick={() => setSelectedPhase(selectedPhase === key ? 'all' : key)}
                    className={cn(
                      "p-3 rounded-lg border transition-all text-center",
                      selectedPhase === key
                        ? "border-violet-500 bg-violet-500/20"
                        : "border-border/50 bg-card/50 hover:bg-card"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className={cn(
                      "h-5 w-5 mx-auto mb-1",
                      isComplete ? "text-green-400" : "text-muted-foreground"
                    )} />
                    <div className="text-xs font-medium truncate">{info.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {progress.completed}/{progress.total}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline des phases */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Button
          variant={selectedPhase === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedPhase('all')}
          className="shrink-0"
        >
          <Calendar className="h-4 w-4 mr-1" />
          Toutes les phases
        </Button>
        {Object.entries(phaseInfo).map(([key, info]) => {
          const Icon = info.icon;
          return (
            <Button
              key={key}
              variant={selectedPhase === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPhase(key)}
              className={cn(
                "shrink-0",
                selectedPhase === key && `bg-gradient-to-r ${info.color} border-0`
              )}
            >
              <Icon className="h-4 w-4 mr-1" />
              {info.label}
              <Badge variant="secondary" className="ml-1 text-xs">
                {info.days}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Liste des tâches */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task, index) => {
            const isCompleted = completedTasks.has(task.id);
            const isExpanded = expandedTasks.has(task.id);
            const phase = phaseInfo[task.category];

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.02 }}
              >
                <Card className={cn(
                  "transition-all duration-300",
                  isCompleted 
                    ? "bg-green-500/10 border-green-500/30" 
                    : "bg-card/50 border-border/50 hover:border-violet-500/30"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="mt-1 h-5 w-5"
                      />

                      {/* Contenu principal */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs font-mono",
                              `bg-gradient-to-r ${phase.color} text-white border-0`
                            )}
                          >
                            {getDayLabel(task.day)}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs", getPriorityColor(task.priority))}
                          >
                            {task.priority === 'high' ? '🔴 Priorité haute' : 
                             task.priority === 'medium' ? '🟡 Priorité moyenne' : '🟢 Optionnel'}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.estimatedTime}
                          </span>
                        </div>

                        <h4 className={cn(
                          "font-medium mt-2 transition-all",
                          isCompleted && "line-through text-muted-foreground"
                        )}>
                          {task.title}
                        </h4>

                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description}
                        </p>

                        {/* Tips expandables */}
                        {task.tips && task.tips.length > 0 && (
                          <div className="mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpand(task.id)}
                              className="h-7 px-2 text-xs text-violet-400 hover:text-violet-300"
                            >
                              <Sparkles className="h-3 w-3 mr-1" />
                              {task.tips.length} conseils
                              {isExpanded ? (
                                <ChevronUp className="h-3 w-3 ml-1" />
                              ) : (
                                <ChevronDown className="h-3 w-3 ml-1" />
                              )}
                            </Button>

                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-2 p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                                    <ul className="space-y-1">
                                      {task.tips.map((tip, i) => (
                                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                          <CheckCircle2 className="h-3 w-3 text-violet-400 mt-0.5 shrink-0" />
                                          {tip}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>

                      {/* Indicateur de complétion */}
                      {isCompleted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="shrink-0"
                        >
                          <CheckCircle2 className="h-6 w-6 text-green-400" />
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Résumé et conseils */}
      <Card className="bg-gradient-to-br from-amber-900/20 to-orange-900/10 border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-amber-400" />
            Objectifs clés du lancement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-card/50 border border-border/50 text-center">
              <div className="text-3xl font-bold text-amber-400">10+</div>
              <div className="text-sm text-muted-foreground">Reviews à obtenir</div>
              <div className="text-xs text-muted-foreground mt-1">dans les 7 premiers jours</div>
            </div>
            <div className="p-4 rounded-lg bg-card/50 border border-border/50 text-center">
              <div className="text-3xl font-bold text-green-400">30-50%</div>
              <div className="text-sm text-muted-foreground">ACOS cible</div>
              <div className="text-xs text-muted-foreground mt-1">pour les Amazon Ads</div>
            </div>
            <div className="p-4 rounded-lg bg-card/50 border border-border/50 text-center">
              <div className="text-3xl font-bold text-violet-400">3x</div>
              <div className="text-sm text-muted-foreground">ROI minimum</div>
              <div className="text-xs text-muted-foreground mt-1">sur investissement pub</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EbookLaunchPlan;
