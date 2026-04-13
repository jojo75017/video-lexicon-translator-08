import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BarChart3, CheckCircle2, Clock, Eye, AlertCircle, Lock, Play,
  Trash2, Cloud, RefreshCw, Loader2, Headphones, BookOpen, Plus, FileText,
  Rocket, Sparkles, BookMarked
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkflowResults } from '@/hooks/useWorkflowResults';
import { useWorkflowCloudSync } from '@/hooks/useWorkflowCloudSync';
import { WORKFLOW_STEPS, STEP_TO_TAB } from './WorkflowNavigation';
import { toast } from 'sonner';

interface WorkflowDashboardProps {
  ebookTitle: string;
  onNavigate: (tabId: string) => void;
  onStartAutoWorkflow?: () => void;
  authorName?: string;
  bookDescription?: string;
  genre?: string;
  targetAudience?: string;
  numberOfChapters?: number;
  chapters?: Array<{ id: string; title: string; content?: string }>;
  onUpdateTitle?: (value: string) => void;
  onUpdateAuthor?: (value: string) => void;
  onUpdateDescription?: (value: string) => void;
  onUpdateGenre?: (value: string) => void;
  onUpdateTargetAudience?: (value: string) => void;
  onUpdateNumberOfChapters?: (value: number) => void;
  onUpdateChapterTitle?: (chapterId: string, title: string) => void;
  onAddChapter?: () => void;
}

const STEP_ESTIMATES: Record<string, { minutes: number; tip: string }> = {
  P1: { minutes: 2, tip: "Définissez bien votre titre et sous-titre pour un meilleur positionnement." },
  P2: { minutes: 3, tip: "Les 7 mots-clés KDP sont cruciaux pour la visibilité sur Amazon." },
  P3: { minutes: 3, tip: "Une bonne structure = un livre plus facile à rédiger. Visez 8-15 chapitres." },
  P4: { minutes: 15, tip: "L'étape la plus longue. Chaque chapitre est rédigé individuellement." },
  P5: { minutes: 5, tip: "L'humanisation rend votre texte naturel et engageant." },
  P6: { minutes: 3, tip: "Vérifiez la cohérence, la grammaire et le style." },
  P7: { minutes: 2, tip: "Description et accroche optimisées pour Amazon." },
  P8: { minutes: 3, tip: "Diagnostic complet avant publication." },
  P9: { minutes: 2, tip: "Capture de votre voix d'auteur unique." },
  P10: { minutes: 3, tip: "Transitions fluides entre tous les chapitres." },
  P11: { minutes: 3, tip: "Analyse critique sans complaisance." },
  P12: { minutes: 5, tip: "Améliorations automatiques basées sur P11." },
  P13: { minutes: 2, tip: "Unification du style sur l'ensemble du manuscrit." },
  P14: { minutes: 2, tip: "Validation finale par l'éditeur IA." },
  P15: { minutes: 5, tip: "🎁 BONUS — Rend le texte indétectable par les outils anti-IA." },
};

export const WorkflowDashboard: React.FC<WorkflowDashboardProps> = ({
  ebookTitle,
  onNavigate,
  onStartAutoWorkflow,
  authorName = '',
  bookDescription = '',
  genre = '',
  targetAudience = '',
  numberOfChapters = 8,
  chapters = [],
  onUpdateTitle,
  onUpdateAuthor,
  onUpdateDescription,
  onUpdateGenre,
  onUpdateTargetAudience,
  onUpdateNumberOfChapters,
  onUpdateChapterTitle,
  onAddChapter,
}) => {
  const { results, hasStepResult, getStepResult, clearResults, getCompletedStepsCount } = useWorkflowResults();
  const { isSyncing, saveAllToCloud, loadFromCloud, lastSyncedAt } = useWorkflowCloudSync();
  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [expandedPreview, setExpandedPreview] = useState<string | null>(null);

  const completedCount = getCompletedStepsCount();
  const totalSteps = WORKFLOW_STEPS.length;
  const progressPercent = (completedCount / totalSteps) * 100;
  const remainingMinutes = WORKFLOW_STEPS.filter(s => !hasStepResult(s.id))
    .reduce((sum, s) => sum + (STEP_ESTIMATES[s.id]?.minutes || 3), 0);

  const handleCloudSync = async () => {
    if (!ebookTitle) { toast.error('Titre du projet requis pour la synchronisation'); return; }
    const formattedResults: Record<string, { result: any; displayContent: string; generatedAt?: string }> = {};
    Object.entries(results).forEach(([key, val]) => {
      if (val) {
        formattedResults[key] = { result: val.result, displayContent: val.displayContent, generatedAt: val.generatedAt };
      }
    });
    const success = await saveAllToCloud(ebookTitle, formattedResults);
    if (success) { setIsCloudSynced(true); toast.success('☁️ Résultats synchronisés dans le cloud'); }
  };

  const handleCloudRestore = async () => {
    if (!ebookTitle) { toast.error('Titre du projet requis'); return; }
    const cloudResults = await loadFromCloud(ebookTitle);
    if (cloudResults.length === 0) { toast.info('Aucun résultat cloud trouvé pour ce projet'); return; }
    toast.success(`☁️ ${cloudResults.length} étapes restaurées depuis le cloud`);
  };

  const getStepStatus = (stepId: string): 'completed' | 'available' | 'locked' => {
    if (hasStepResult(stepId)) return 'completed';
    const step = WORKFLOW_STEPS.find(s => s.id === stepId);
    if (!step?.requiredSteps?.length) return 'available';
    const allReqsMet = step.requiredSteps.every(r => hasStepResult(r));
    return allReqsMet ? 'available' : 'locked';
  };

  const nextAvailableStep = WORKFLOW_STEPS.find((step) => getStepStatus(step.id) === 'available');
  const nextAvailableTabId = nextAvailableStep ? STEP_TO_TAB[nextAvailableStep.id] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground">
            <BarChart3 className="h-6 w-6 text-gold gold-icon" />
            <span className="text-gradient-gold">Tableau de Bord Workflow</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Vue d'ensemble de votre processus éditorial
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCloudSync}
            disabled={isSyncing || completedCount === 0}
            className="gap-2 border-primary/20 text-gold/70 hover:text-gold bg-muted/50"
          >
            {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Cloud className="h-4 w-4" />}
            Sauvegarder Cloud
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCloudRestore}
            className="gap-2 border-primary/20 text-gold/70 hover:text-gold bg-muted/50"
          >
            <RefreshCw className="h-4 w-4" />
            Restaurer
          </Button>
          {onStartAutoWorkflow && (
            <Button onClick={onStartAutoWorkflow} className="gap-2 bg-gold hover:bg-gold-dark text-slate-900 font-semibold" disabled={completedCount === totalSteps}>
              <Play className="h-4 w-4" />
              Lancer Auto P1→P14
            </Button>
          )}
          {(hasStepResult('P4') || hasStepResult('P5')) && (
            <Button 
              onClick={() => onNavigate('audio-express')} 
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-foreground font-semibold"
            >
              <Headphones className="h-4 w-4" />
              Exporter vers Audio Express
            </Button>
          )}
        </div>
      </div>

      {/* Agent Remyr — Créer un livre */}
      {completedCount === 0 && (
        <Card className="border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card/95 to-accent/10 shadow-xl shadow-primary/10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />
          <CardContent className="p-6 md:p-8 relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar Agent */}
              <div className="shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                  <Rocket className="h-10 w-10 text-primary-foreground" />
                </div>
              </div>

              {/* Info Agent */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className="bg-primary/20 text-primary border-primary/30 font-bold text-sm px-3 py-1">
                    🤖 Agent Remyr
                  </Badge>
                  <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground text-xs">
                    Directeur de Création
                  </Badge>
                </div>
                <h3 className="text-xl md:text-2xl font-extrabold text-foreground">
                  Créer votre livre avec le Workflow IA
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
                  Remplissez les informations ci-dessous (titre, auteur, sujet, catégorie) puis lancez les 15 agents spécialisés. 
                  <span className="text-primary font-semibold"> Remyr</span> orchestre tout le processus : de l'idée au manuscrit prêt à publier.
                </p>
                <div className="flex items-center gap-4 pt-1 flex-wrap">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" /> 15 agents IA spécialisés
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <BookMarked className="h-3.5 w-3.5 text-primary" /> Manuscrit pro 400+ pages
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" /> ~45 min automatisé
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="shrink-0 w-full md:w-auto">
                <Button
                  size="lg"
                  onClick={() => {
                    const configSection = document.getElementById('workflow-book-title');
                    if (configSection) configSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    else if (onStartAutoWorkflow) onStartAutoWorkflow();
                  }}
                  className="w-full md:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base px-8 h-14 shadow-lg shadow-primary/20"
                >
                  <Play className="h-5 w-5" />
                  Commencer la création
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Overview */}
      <Card className="border-2 border-primary/20 bg-card backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-foreground/70">Progression globale</span>
                <span className="text-sm font-bold text-gold">{Math.round(progressPercent)}%</span>
              </div>
              <Progress value={progressPercent} className="h-4 mb-3 gold-progress" />
              <p className="text-xs text-muted-foreground">
                {completedCount}/{totalSteps} étapes complétées
              </p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg border border-primary/10">
              <Clock className="h-6 w-6 mx-auto mb-1 text-gold" />
              <p className="text-2xl font-bold text-foreground">{remainingMinutes}</p>
              <p className="text-xs text-muted-foreground">min restantes</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg border border-border">
              <CheckCircle2 className="h-6 w-6 mx-auto mb-1 text-emerald-400" />
              <p className="text-2xl font-bold text-foreground">{completedCount}</p>
              <p className="text-xs text-muted-foreground">étapes terminées</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {(onUpdateTitle || onUpdateAuthor || onUpdateDescription) && (
        <Card className="border-border/60 bg-card/95 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <BookOpen className="h-5 w-5 text-primary" />
              Configuration du livre pour le workflow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workflow-book-title">Titre</Label>
                <Input
                  id="workflow-book-title"
                  value={ebookTitle}
                  onChange={(e) => onUpdateTitle?.(e.target.value)}
                  placeholder="Titre du livre"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workflow-book-author">Auteur</Label>
                <Input
                  id="workflow-book-author"
                  value={authorName}
                  onChange={(e) => onUpdateAuthor?.(e.target.value)}
                  placeholder="Nom de l'auteur"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workflow-book-description">Introduction / sujet</Label>
              <Textarea
                id="workflow-book-description"
                value={bookDescription}
                onChange={(e) => onUpdateDescription?.(e.target.value)}
                placeholder="Décrivez le sujet, l'introduction et l'intention du livre"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select value={genre || undefined} onValueChange={(value) => onUpdateGenre?.(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roman">📖 Roman</SelectItem>
                    <SelectItem value="thriller">🔪 Thriller/Policier</SelectItem>
                    <SelectItem value="romance">💕 Romance</SelectItem>
                    <SelectItem value="fantasy">🧙 Fantasy</SelectItem>
                    <SelectItem value="science-fiction">🚀 Science-Fiction</SelectItem>
                    <SelectItem value="developpement-personnel">🧠 Développement personnel</SelectItem>
                    <SelectItem value="business">💼 Business/Entrepreneuriat</SelectItem>
                    <SelectItem value="guide-pratique">📚 Guide pratique</SelectItem>
                    <SelectItem value="cuisine">🍳 Cuisine</SelectItem>
                    <SelectItem value="voyage">✈️ Voyage</SelectItem>
                    <SelectItem value="enfant">🧒 Livre pour enfants</SelectItem>
                    <SelectItem value="autre">📋 Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Public cible</Label>
                <Select value={targetAudience || undefined} onValueChange={(value) => onUpdateTargetAudience?.(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Enfants (3-6 ans)">🧒 Enfants (3-6 ans)</SelectItem>
                    <SelectItem value="Enfants (6-10 ans)">👦 Enfants (6-10 ans)</SelectItem>
                    <SelectItem value="Adolescents">🎮 Adolescents</SelectItem>
                    <SelectItem value="Jeunes adultes">🎓 Jeunes adultes</SelectItem>
                    <SelectItem value="Adultes">👔 Adultes</SelectItem>
                    <SelectItem value="Seniors">🌟 Seniors</SelectItem>
                    <SelectItem value="Tout public">🌍 Tout public</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workflow-book-chapter-count">Nombre de chapitres</Label>
                <Input
                  id="workflow-book-chapter-count"
                  type="number"
                  min="3"
                  max="100"
                  value={numberOfChapters}
                  onChange={(e) => onUpdateNumberOfChapters?.(parseInt(e.target.value, 10) || 8)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Chapitres du workflow
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Vous pouvez préparer votre structure ici avant de lancer les agents.
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => onAddChapter?.()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un chapitre
                </Button>
              </div>

              {chapters.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
                  Aucun chapitre saisi pour l'instant.
                </div>
              ) : (
                <div className="space-y-3">
                  {chapters.map((chapter, index) => (
                    <div key={chapter.id} className="rounded-lg border border-border bg-background/60 p-3">
                      <Label htmlFor={`workflow-chapter-${chapter.id}`} className="text-xs text-muted-foreground">
                        Chapitre {index + 1}
                      </Label>
                      <Input
                        id={`workflow-chapter-${chapter.id}`}
                        value={chapter.title}
                        onChange={(e) => onUpdateChapterTitle?.(chapter.id, e.target.value)}
                        placeholder={`Titre du chapitre ${index + 1}`}
                        className="mt-2"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {nextAvailableStep && nextAvailableTabId && (
        <Card className="border-2 border-cyan-500/30 bg-cyan-500/5 shadow-lg shadow-cyan-500/10">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                  Étape suivante recommandée
                </Badge>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    Continuer avec {nextAvailableStep.id} — {nextAvailableStep.label}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {nextAvailableStep.description} · ~{STEP_ESTIMATES[nextAvailableStep.id]?.minutes || 3} min
                  </p>
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => onNavigate(nextAvailableTabId)}
                className="bg-gold hover:bg-gold-dark text-slate-900 font-bold"
              >
                <Play className="h-5 w-5 mr-2" />
                Continuer maintenant
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Steps Grid */}
      <TooltipProvider delayDuration={200}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WORKFLOW_STEPS.map((step, idx) => {
            const status = getStepStatus(step.id);
            const estimate = STEP_ESTIMATES[step.id];
            const result = getStepResult(step.id);
            const tabId = STEP_TO_TAB[step.id];

            return (
              <Card
                key={step.id}
                className={cn(
                  "transition-all duration-200 cursor-pointer hover:shadow-lg bg-card/60 backdrop-blur-sm",
                  status === 'completed' && "border-emerald-500/30 bg-emerald-500/5",
                  status === 'available' && "border-border hover:border-cyan-500/30",
                  status === 'locked' && "opacity-50 border-border/50",
                  expandedPreview === step.id && "ring-2 ring-cyan-500/50"
                )}
                onClick={() => { if (status !== 'locked') onNavigate(tabId); }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold",
                        status === 'completed' && "bg-emerald-500 text-foreground",
                        status === 'available' && "bg-cyan-500/20 text-cyan-400",
                        status === 'locked' && "bg-muted text-muted-foreground"
                      )}>
                        {status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> :
                         status === 'locked' ? <Lock className="h-4 w-4" /> :
                         idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm text-foreground">{step.id}: {step.label}</h3>
                          {status === 'completed' && (
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                              Fait
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                        
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            ~{estimate?.minutes} min
                          </span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-xs text-cyan-400 cursor-help flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Conseil
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-xs bg-muted border-border text-foreground">
                              <p className="text-xs">{estimate?.tip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        {result && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedPreview(expandedPreview === step.id ? null : step.id);
                            }}
                            className="mt-2 text-xs text-cyan-400 hover:underline flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            {expandedPreview === step.id ? 'Masquer' : 'Aperçu'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedPreview === step.id && result && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-lg text-xs max-h-40 overflow-y-auto border border-border">
                      <p className="whitespace-pre-wrap text-foreground/70">
                        {result.displayContent?.substring(0, 500)}
                        {(result.displayContent?.length || 0) > 500 && '...'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </TooltipProvider>

      {/* Actions */}
      {completedCount > 0 && (
        <Card className="bg-card/60 border-border">
          <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isCloudSynced && lastSyncedAt && (
                <span className="flex items-center gap-1 text-emerald-400">
                  <Cloud className="h-4 w-4" />
                  Synchronisé
                </span>
              )}
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm('Supprimer tous les résultats du workflow ?')) {
                  clearResults();
                  setExpandedPreview(null);
                  toast.success('Résultats effacés');
                }
              }}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Réinitialiser
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkflowDashboard;