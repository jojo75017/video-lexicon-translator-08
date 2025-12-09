import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  Trophy, Star, Award, Crown, Zap, Target, Rocket, 
  GraduationCap, BookOpen, Sparkles, Medal, Flame
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BadgeInfo {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  requirement: string;
  unlocked: boolean;
  progress: number;
}

interface FormationBadgesProps {
  completedModules: number[];
  quizScores: Record<number, number>;
  favorites: number[];
  totalModules: number;
}

const FormationBadges: React.FC<FormationBadgesProps> = ({ 
  completedModules, 
  quizScores, 
  favorites,
  totalModules 
}) => {
  const completedCount = completedModules.length;
  const quizzesPassed = Object.values(quizScores).filter(score => score >= 70).length;
  const perfectScores = Object.values(quizScores).filter(score => score === 100).length;
  const avgScore = Object.values(quizScores).length > 0 
    ? Object.values(quizScores).reduce((a, b) => a + b, 0) / Object.values(quizScores).length 
    : 0;

  const badges: BadgeInfo[] = [
    {
      id: 'first_step',
      name: 'Premier Pas',
      description: 'Terminer votre premier module',
      icon: BookOpen,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      requirement: '1 module terminé',
      unlocked: completedCount >= 1,
      progress: Math.min((completedCount / 1) * 100, 100)
    },
    {
      id: 'apprentice',
      name: 'Apprenti',
      description: 'Terminer 3 modules',
      icon: GraduationCap,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      requirement: '3 modules terminés',
      unlocked: completedCount >= 3,
      progress: Math.min((completedCount / 3) * 100, 100)
    },
    {
      id: 'intermediate',
      name: 'Intermédiaire',
      description: 'Terminer la moitié des modules',
      icon: Target,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      requirement: `${Math.ceil(totalModules / 2)} modules terminés`,
      unlocked: completedCount >= Math.ceil(totalModules / 2),
      progress: Math.min((completedCount / Math.ceil(totalModules / 2)) * 100, 100)
    },
    {
      id: 'expert',
      name: 'Expert',
      description: 'Terminer tous les modules',
      icon: Crown,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      requirement: 'Tous les modules terminés',
      unlocked: completedCount >= totalModules,
      progress: (completedCount / totalModules) * 100
    },
    {
      id: 'quiz_starter',
      name: 'Quizz Starter',
      description: 'Réussir votre premier quiz',
      icon: Zap,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      requirement: '1 quiz réussi (≥70%)',
      unlocked: quizzesPassed >= 1,
      progress: Math.min((quizzesPassed / 1) * 100, 100)
    },
    {
      id: 'quiz_master',
      name: 'Quiz Master',
      description: 'Réussir 5 quiz',
      icon: Award,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      requirement: '5 quiz réussis (≥70%)',
      unlocked: quizzesPassed >= 5,
      progress: Math.min((quizzesPassed / 5) * 100, 100)
    },
    {
      id: 'perfectionist',
      name: 'Perfectionniste',
      description: 'Obtenir 100% à un quiz',
      icon: Star,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      requirement: '1 score parfait',
      unlocked: perfectScores >= 1,
      progress: Math.min((perfectScores / 1) * 100, 100)
    },
    {
      id: 'legend',
      name: 'Légende',
      description: 'Obtenir 100% à tous les quiz',
      icon: Flame,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      requirement: 'Scores parfaits partout',
      unlocked: perfectScores >= totalModules,
      progress: (perfectScores / totalModules) * 100
    },
    {
      id: 'collector',
      name: 'Collectionneur',
      description: 'Ajouter 5 modules en favoris',
      icon: Sparkles,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      requirement: '5 favoris',
      unlocked: favorites.length >= 5,
      progress: Math.min((favorites.length / 5) * 100, 100)
    },
    {
      id: 'champion',
      name: 'Champion',
      description: 'Terminer la formation avec excellence',
      icon: Trophy,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      requirement: 'Tous modules + moyenne ≥80%',
      unlocked: completedCount >= totalModules && avgScore >= 80,
      progress: completedCount >= totalModules && avgScore >= 80 ? 100 : 
               (completedCount / totalModules * 50) + (Math.min(avgScore, 80) / 80 * 50)
    },
    {
      id: 'rocket',
      name: 'Fusée',
      description: 'Compléter 5 modules en une session',
      icon: Rocket,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
      requirement: '5 modules rapides',
      unlocked: completedCount >= 5,
      progress: Math.min((completedCount / 5) * 100, 100)
    },
    {
      id: 'medal',
      name: 'Médaillé',
      description: 'Débloquer 5 badges',
      icon: Medal,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      requirement: '5 badges débloqués',
      unlocked: false, // Calculé dynamiquement ci-dessous
      progress: 0
    }
  ];

  // Calculer le badge "Médaillé"
  const unlockedCount = badges.filter(b => b.id !== 'medal' && b.unlocked).length;
  const medalBadge = badges.find(b => b.id === 'medal');
  if (medalBadge) {
    medalBadge.unlocked = unlockedCount >= 5;
    medalBadge.progress = Math.min((unlockedCount / 5) * 100, 100);
  }

  const totalUnlocked = badges.filter(b => b.unlocked).length;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Trophées & Badges
          </CardTitle>
          <Badge variant="secondary" className="gap-1">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            {totalUnlocked} / {badges.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <TooltipProvider>
            {badges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <Tooltip key={badge.id}>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`relative group cursor-pointer`}
                    >
                      <div className={`
                        flex flex-col items-center p-4 rounded-xl border-2 transition-all
                        ${badge.unlocked 
                          ? `${badge.bgColor} border-current ${badge.color} shadow-lg` 
                          : 'bg-muted/50 border-muted-foreground/20 text-muted-foreground opacity-50'
                        }
                        group-hover:scale-105
                      `}>
                        {/* Effet de brillance pour badges débloqués */}
                        {badge.unlocked && (
                          <motion.div
                            className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            initial={{ x: '-100%' }}
                            animate={{ x: '200%' }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity, 
                              repeatDelay: 5,
                              ease: "easeInOut"
                            }}
                          />
                        )}
                        
                        <div className={`relative p-3 rounded-full ${badge.unlocked ? badge.bgColor : 'bg-muted'}`}>
                          <Icon className={`h-6 w-6 ${badge.unlocked ? badge.color : 'text-muted-foreground'}`} />
                          {badge.unlocked && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                            >
                              <Star className="h-2.5 w-2.5 text-white fill-white" />
                            </motion.div>
                          )}
                        </div>
                        
                        <span className="text-xs font-medium mt-2 text-center line-clamp-1">
                          {badge.name}
                        </span>
                        
                        {!badge.unlocked && (
                          <div className="w-full mt-2">
                            <Progress value={badge.progress} className="h-1" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <div className="space-y-1">
                      <p className="font-semibold">{badge.name}</p>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                      <p className="text-xs mt-2">
                        <span className={badge.unlocked ? 'text-green-500' : 'text-muted-foreground'}>
                          {badge.unlocked ? '✓ Débloqué' : `Requis: ${badge.requirement}`}
                        </span>
                      </p>
                      {!badge.unlocked && (
                        <p className="text-xs text-muted-foreground">
                          Progression: {Math.round(badge.progress)}%
                        </p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>

        {/* Statistiques rapides */}
        <div className="mt-6 pt-6 border-t grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{completedCount}</div>
            <div className="text-xs text-muted-foreground">Modules terminés</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">{quizzesPassed}</div>
            <div className="text-xs text-muted-foreground">Quiz réussis</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-500">{perfectScores}</div>
            <div className="text-xs text-muted-foreground">Scores parfaits</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-500">{Math.round(avgScore)}%</div>
            <div className="text-xs text-muted-foreground">Moyenne quiz</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormationBadges;
