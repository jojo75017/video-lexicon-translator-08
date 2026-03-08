import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Zap, Play, Pause, RotateCcw, CheckCircle2, Clock, BookOpen, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Chapter } from '@/hooks/useSubscriptionGeneration';

interface EbookDraftModeProps {
  chapters: Chapter[];
  ebookTitle: string;
  authorName: string;
  isGenerating: boolean;
  onGenerateAll: () => Promise<void>;
  generationProgress: { current: number; total: number; currentItem: string };
}

export const EbookDraftMode: React.FC<EbookDraftModeProps> = ({
  chapters,
  ebookTitle,
  authorName,
  isGenerating,
  onGenerateAll,
  generationProgress,
}) => {
  const [skipExisting, setSkipExisting] = useState(true);
  const [startTime, setStartTime] = useState<number | null>(null);

  const chaptersWithContent = chapters.filter(c => c.content && c.content.length > 50).length;
  const subChaptersTotal = chapters.reduce((acc, c) => acc + c.subChapters.length, 0);
  const subChaptersWithContent = chapters.reduce(
    (acc, c) => acc + c.subChapters.filter(sc => sc.content && sc.content.length > 50).length, 0
  );
  const totalItems = chapters.length + subChaptersTotal;
  const completedItems = chaptersWithContent + subChaptersWithContent;
  const completionPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const progressPercent = generationProgress.total > 0
    ? Math.round((generationProgress.current / generationProgress.total) * 100)
    : 0;

  const estimatedTimeRemaining = () => {
    if (!startTime || generationProgress.current === 0) return null;
    const elapsed = (Date.now() - startTime) / 1000;
    const perItem = elapsed / generationProgress.current;
    const remaining = perItem * (generationProgress.total - generationProgress.current);
    const mins = Math.floor(remaining / 60);
    const secs = Math.floor(remaining % 60);
    return `${mins}m ${secs}s`;
  };

  const handleStart = async () => {
    if (!ebookTitle) {
      toast.error('Veuillez entrer un titre d\'ebook');
      return;
    }
    if (chapters.length === 0) {
      toast.error('Générez d\'abord un plan (chapitres)');
      return;
    }
    setStartTime(Date.now());
    await onGenerateAll();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-xl bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            Mode Brouillon Rapide
            <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30">⚡ Express</Badge>
          </CardTitle>
          <p className="text-muted-foreground">
            Générez l'intégralité de votre manuscrit en un seul clic. L'IA rédige chaque chapitre et sous-chapitre séquentiellement avec un fil conducteur cohérent.
          </p>
        </CardHeader>
      </Card>

      {/* Pre-check */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Pré-vérification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl border ${ebookTitle ? 'border-green-500/30 bg-green-500/5' : 'border-destructive/30 bg-destructive/5'}`}>
              <div className="flex items-center gap-2 mb-1">
                {ebookTitle ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-destructive" />}
                <span className="font-medium text-sm">Titre</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{ebookTitle || 'Non défini'}</p>
            </div>
            <div className={`p-4 rounded-xl border ${chapters.length > 0 ? 'border-green-500/30 bg-green-500/5' : 'border-destructive/30 bg-destructive/5'}`}>
              <div className="flex items-center gap-2 mb-1">
                {chapters.length > 0 ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-destructive" />}
                <span className="font-medium text-sm">Plan</span>
              </div>
              <p className="text-xs text-muted-foreground">{chapters.length} chapitres, {subChaptersTotal} sous-chapitres</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/30">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Estimation</span>
              </div>
              <p className="text-xs text-muted-foreground">~{Math.max(2, totalItems * 2)} min pour {totalItems} éléments</p>
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Switch id="skip" checked={skipExisting} onCheckedChange={setSkipExisting} />
            <Label htmlFor="skip" className="text-sm cursor-pointer">Passer les chapitres déjà rédigés</Label>
          </div>
        </CardContent>
      </Card>

      {/* Progression actuelle */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">État du manuscrit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm mb-2">
            <span>{completedItems} / {totalItems} éléments rédigés</span>
            <span className="font-bold text-primary">{completionPercent}%</span>
          </div>
          <Progress value={completionPercent} className="h-3" />

          {/* Per-chapter breakdown */}
          <div className="grid gap-2 mt-4">
            {chapters.map((chapter, i) => {
              const hasContent = chapter.content && chapter.content.length > 50;
              const subsDone = chapter.subChapters.filter(sc => sc.content && sc.content.length > 50).length;
              const subsTotal = chapter.subChapters.length;
              return (
                <div key={chapter.id} className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${hasContent ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                    {i + 1}
                  </span>
                  <span className="flex-1 truncate">{chapter.title || `Chapitre ${i + 1}`}</span>
                  {subsTotal > 0 && (
                    <Badge variant="outline" className="text-xs">{subsDone}/{subsTotal} sous-ch.</Badge>
                  )}
                  {hasContent ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Generation in progress */}
      {isGenerating && (
        <Card className="border-primary/30 animate-pulse">
          <CardContent className="py-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                <span className="font-medium">Génération en cours...</span>
              </div>
              {estimatedTimeRemaining() && (
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  ~{estimatedTimeRemaining()}
                </Badge>
              )}
            </div>
            <Progress value={progressPercent} className="h-4" />
            <p className="text-sm text-muted-foreground">{generationProgress.currentItem}</p>
            <div className="text-xs text-muted-foreground text-right">
              {generationProgress.current} / {generationProgress.total}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleStart}
          disabled={isGenerating || !ebookTitle || chapters.length === 0}
          className="h-14 px-10 text-lg bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
        >
          {isGenerating ? (
            <>
              <Pause className="h-5 w-5 mr-2" />
              Génération en cours... {progressPercent}%
            </>
          ) : completionPercent === 100 ? (
            <>
              <RotateCcw className="h-5 w-5 mr-2" />
              Régénérer tout
            </>
          ) : (
            <>
              <Play className="h-5 w-5 mr-2" />
              {completionPercent > 0 ? 'Compléter le manuscrit' : 'Générer tout le manuscrit'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default EbookDraftMode;
