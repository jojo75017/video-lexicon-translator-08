import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, FileText, PenTool, Image, Download, BarChart3, Zap, CheckCircle2, Clock, AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
  content?: string;
  subChapters?: Array<{ id: string; title: string; content?: string }>;
}

interface EbookGlobalDashboardProps {
  ebookTitle: string;
  authorName: string;
  chapters: Chapter[];
  preface?: string;
  conclusion?: string;
  coverImage?: string;
  kdpDescription?: string;
  kdpKeywords?: string;
  onNavigate: (tab: string) => void;
}

export const EbookGlobalDashboard: React.FC<EbookGlobalDashboardProps> = ({
  ebookTitle, authorName, chapters, preface, conclusion, coverImage, kdpDescription, kdpKeywords, onNavigate
}) => {
  const stats = useMemo(() => {
    const totalWords = chapters.reduce((sum, ch) => {
      const chWords = (ch.content || '').split(/\s+/).filter(Boolean).length;
      const subWords = (ch.subChapters || []).reduce((s, sc) => s + (sc.content || '').split(/\s+/).filter(Boolean).length, 0);
      return sum + chWords + subWords;
    }, 0) + (preface || '').split(/\s+/).filter(Boolean).length + (conclusion || '').split(/\s+/).filter(Boolean).length;

    const chaptersWithContent = chapters.filter(ch => (ch.content && ch.content.length > 50) || (ch.subChapters || []).some(sc => sc.content && sc.content.length > 50)).length;
    const completionPercent = chapters.length > 0 ? Math.round((chaptersWithContent / chapters.length) * 100) : 0;
    const estimatedPages = Math.ceil(totalWords / 250);
    const readingTime = Math.ceil(totalWords / 200);

    return { totalWords, chaptersWithContent, totalChapters: chapters.length, completionPercent, estimatedPages, readingTime };
  }, [chapters, preface, conclusion]);

  const checklist = useMemo(() => [
    { label: 'Titre défini', done: !!ebookTitle.trim(), tab: 'planner' },
    { label: 'Auteur renseigné', done: !!authorName.trim(), tab: 'planner' },
    { label: 'Chapitres créés', done: chapters.length >= 3, tab: 'writing' },
    { label: 'Contenu rédigé (50%+)', done: stats.completionPercent >= 50, tab: 'writing' },
    { label: 'Préface rédigée', done: !!(preface && preface.length > 50), tab: 'planner' },
    { label: 'Conclusion rédigée', done: !!(conclusion && conclusion.length > 50), tab: 'planner' },
    { label: 'Couverture créée', done: !!coverImage, tab: 'cover' },
    { label: 'Description KDP', done: !!(kdpDescription && kdpDescription.length > 20), tab: 'kdp' },
    { label: 'Mots-clés KDP', done: !!(kdpKeywords && kdpKeywords.length > 5), tab: 'kdp' },
  ], [ebookTitle, authorName, chapters, stats, preface, conclusion, coverImage, kdpDescription, kdpKeywords]);

  const checklistDone = checklist.filter(c => c.done).length;
  const overallProgress = Math.round((checklistDone / checklist.length) * 100);

  const quickActions = [
    { label: 'Écrire', icon: PenTool, tab: 'writing', color: 'text-blue-500' },
    { label: 'Workflow IA', icon: Zap, tab: 'complete-workflow', color: 'text-amber-500' },
    { label: 'Couverture', icon: Image, tab: 'cover', color: 'text-purple-500' },
    { label: 'Description KDP', icon: FileText, tab: 'kdp', color: 'text-orange-500' },
    { label: 'Exporter', icon: Download, tab: 'export', color: 'text-green-500' },
    { label: 'Analyser Marché', icon: BarChart3, tab: 'niche-analysis', color: 'text-cyan-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{ebookTitle || 'Mon Projet'}</h2>
              <p className="text-sm text-muted-foreground mt-1">{authorName ? `par ${authorName}` : 'Auteur non défini'}</p>
            </div>
            <Badge variant={overallProgress === 100 ? 'default' : 'outline'} className="text-sm">
              {overallProgress === 100 ? '✅ Prêt à publier' : `${overallProgress}% complété`}
            </Badge>
          </div>
          <Progress value={overallProgress} className="mt-4 h-2" />
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Mots', value: stats.totalWords.toLocaleString(), icon: FileText, sub: `~${stats.estimatedPages} pages` },
          { label: 'Chapitres', value: `${stats.chaptersWithContent}/${stats.totalChapters}`, icon: BookOpen, sub: `${stats.completionPercent}% rédigés` },
          { label: 'Lecture', value: `${stats.readingTime} min`, icon: Clock, sub: 'temps estimé' },
          { label: 'Avancement', value: `${overallProgress}%`, icon: CheckCircle2, sub: `${checklistDone}/${checklist.length} étapes` },
        ].map(s => (
          <Card key={s.label} className="p-3 text-center">
            <s.icon className="h-5 w-5 mx-auto mb-1 text-primary" />
            <div className="text-xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="text-[10px] text-muted-foreground/70">{s.sub}</div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Actions Rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {quickActions.map(a => (
              <Button key={a.tab} variant="outline" className="h-auto py-3 flex flex-col gap-1" onClick={() => onNavigate(a.tab)}>
                <a.icon className={`h-5 w-5 ${a.color}`} />
                <span className="text-xs">{a.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Checklist */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Checklist Projet ({checklistDone}/{checklist.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {checklist.map(c => (
              <div key={c.label} className="flex items-center gap-2 cursor-pointer hover:bg-muted/30 rounded p-1.5 -mx-1.5 transition-colors" onClick={() => !c.done && onNavigate(c.tab)}>
                {c.done ? <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /> : <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />}
                <span className={`text-sm flex-1 ${c.done ? 'line-through text-muted-foreground' : ''}`}>{c.label}</span>
                {!c.done && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EbookGlobalDashboard;
