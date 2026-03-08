import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, BookOpen, FileText, Target, Clock, CheckCircle2, AlertCircle, 
  TrendingUp, Award, Flame, AlertTriangle
} from 'lucide-react';
import { Chapter } from '@/hooks/useSubscriptionGeneration';

interface EbookManuscriptDashboardProps {
  ebookTitle: string;
  authorName: string;
  chapters: Chapter[];
  preface: string;
  conclusion: string;
  targetWordsPerChapter: number;
  kdpDescription?: string;
  kdpKeywords?: string;
  kdpCategories?: string;
}

export const EbookManuscriptDashboard: React.FC<EbookManuscriptDashboardProps> = ({
  ebookTitle,
  authorName,
  chapters,
  preface,
  conclusion,
  targetWordsPerChapter,
  kdpDescription,
  kdpKeywords,
  kdpCategories,
}) => {
  const stats = useMemo(() => {
    const chapterStats = chapters.map((ch, i) => {
      const chapterWords = ch.content ? ch.content.split(/\s+/).filter(Boolean).length : 0;
      const subWords = ch.subChapters.reduce(
        (acc, sc) => acc + (sc.content ? sc.content.split(/\s+/).filter(Boolean).length : 0), 0
      );
      const totalWords = chapterWords + subWords;
      const progressPercent = targetWordsPerChapter > 0 ? Math.min(100, (totalWords / targetWordsPerChapter) * 100) : 0;
      const hasContent = totalWords > 50;
      const subsDone = ch.subChapters.filter(sc => sc.content && sc.content.length > 50).length;

      return {
        index: i,
        title: ch.title || `Chapitre ${i + 1}`,
        words: totalWords,
        progress: progressPercent,
        hasContent,
        subsDone,
        subsTotal: ch.subChapters.length,
      };
    });

    const totalWords = chapterStats.reduce((acc, c) => acc + c.words, 0)
      + (preface ? preface.split(/\s+/).filter(Boolean).length : 0)
      + (conclusion ? conclusion.split(/\s+/).filter(Boolean).length : 0);

    const targetTotal = chapters.length * targetWordsPerChapter;
    const globalProgress = targetTotal > 0 ? Math.min(100, (totalWords / targetTotal) * 100) : 0;
    const estimatedPages = Math.ceil(totalWords / 250);
    const readingTime = Math.ceil(totalWords / 200);
    const chaptersComplete = chapterStats.filter(c => c.progress >= 80).length;

    // Quality score
    let qualityScore = 0;
    if (ebookTitle) qualityScore += 10;
    if (authorName) qualityScore += 5;
    if (preface && preface.length > 100) qualityScore += 10;
    if (conclusion && conclusion.length > 100) qualityScore += 10;
    if (kdpDescription && kdpDescription.length > 50) qualityScore += 15;
    if (kdpKeywords && kdpKeywords.length > 10) qualityScore += 10;
    if (kdpCategories && kdpCategories.length > 5) qualityScore += 5;
    const contentScore = chapters.length > 0 ? (chaptersComplete / chapters.length) * 35 : 0;
    qualityScore += Math.round(contentScore);

    return { chapterStats, totalWords, targetTotal, globalProgress, estimatedPages, readingTime, chaptersComplete, qualityScore };
  }, [chapters, preface, conclusion, targetWordsPerChapter, ebookTitle, authorName, kdpDescription, kdpKeywords, kdpCategories]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Bon';
    if (score >= 50) return 'En cours';
    return 'À améliorer';
  };

  const kdpChecklist = [
    { label: 'Titre défini', done: !!ebookTitle },
    { label: 'Nom d\'auteur', done: !!authorName },
    { label: 'Préface rédigée', done: preface.length > 100 },
    { label: 'Conclusion rédigée', done: conclusion.length > 100 },
    { label: 'Tous les chapitres rédigés', done: stats.chaptersComplete === chapters.length && chapters.length > 0 },
    { label: 'Description KDP (4000 car.)', done: (kdpDescription?.length || 0) > 200 },
    { label: '7 mots-clés KDP', done: (kdpKeywords?.split(',') || []).length >= 7 },
    { label: 'Catégories KDP', done: (kdpCategories?.length || 0) > 5 },
    { label: 'Minimum 10 000 mots', done: stats.totalWords >= 10000 },
    { label: 'Couverture créée', done: false }, // Can't check from here
  ];

  const checklistDone = kdpChecklist.filter(c => c.done).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-xl bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            Tableau de Bord Manuscrit
          </CardTitle>
          <p className="text-muted-foreground">
            Vue d'ensemble de votre projet avec progression par chapitre, score de qualité et checklist KDP.
          </p>
        </CardHeader>
      </Card>

      {/* Top Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { icon: FileText, label: 'Mots', value: stats.totalWords.toLocaleString(), sub: `/ ${stats.targetTotal.toLocaleString()}` },
          { icon: BookOpen, label: 'Pages', value: stats.estimatedPages.toString(), sub: 'estimées' },
          { icon: Clock, label: 'Lecture', value: `${stats.readingTime} min`, sub: 'temps estimé' },
          { icon: Target, label: 'Chapitres', value: `${stats.chaptersComplete}/${chapters.length}`, sub: 'complétés' },
          { icon: Award, label: 'Score', value: `${stats.qualityScore}%`, sub: getScoreLabel(stats.qualityScore) },
        ].map(({ icon: Icon, label, value, sub }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <Icon className="h-5 w-5 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Global Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Progression globale</span>
            <span className="text-lg font-bold text-primary">{Math.round(stats.globalProgress)}%</span>
          </div>
          <Progress value={stats.globalProgress} className="h-4" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Per-chapter progress */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progression par chapitre
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.chapterStats.map(ch => (
              <div key={ch.index} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      ch.progress >= 80 ? 'bg-green-500/20 text-green-500' : ch.progress > 0 ? 'bg-amber-500/20 text-amber-500' : 'bg-muted text-muted-foreground'
                    }`}>
                      {ch.index + 1}
                    </span>
                    <span className="truncate">{ch.title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground">{ch.words.toLocaleString()} mots</span>
                    {ch.subsTotal > 0 && (
                      <Badge variant="outline" className="text-[10px] px-1.5">{ch.subsDone}/{ch.subsTotal}</Badge>
                    )}
                  </div>
                </div>
                <Progress value={ch.progress} className="h-1.5" />
              </div>
            ))}
            {chapters.length === 0 && (
              <p className="text-center text-muted-foreground py-8">Aucun chapitre créé</p>
            )}
          </CardContent>
        </Card>

        {/* KDP Checklist */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Checklist Publication KDP
              </CardTitle>
              <Badge variant={checklistDone === kdpChecklist.length ? 'default' : 'secondary'}>
                {checklistDone}/{kdpChecklist.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {kdpChecklist.map(({ label, done }) => (
              <div key={label} className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-muted/50 transition-colors">
                {done ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                )}
                <span className={done ? 'text-muted-foreground line-through' : ''}>{label}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quality Score Detail */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Flame className="h-5 w-5" />
            Score de Qualité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className={`text-6xl font-black ${getScoreColor(stats.qualityScore)}`}>
              {stats.qualityScore}
            </div>
            <div className="flex-1 space-y-2">
              <Progress value={stats.qualityScore} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {stats.qualityScore < 50 
                  ? 'Continuez à rédiger vos chapitres et à compléter les métadonnées KDP pour augmenter votre score.'
                  : stats.qualityScore < 80
                  ? 'Bon travail ! Complétez la checklist KDP et atteignez l\'objectif de mots pour un score optimal.'
                  : 'Excellent ! Votre manuscrit est prêt pour la publication. Vérifiez la relecture finale.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EbookManuscriptDashboard;
