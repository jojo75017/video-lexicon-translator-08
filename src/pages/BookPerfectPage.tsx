import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, Play, RotateCcw, Sparkles, Bug, Feather, ShoppingCart, FileText, Square, Columns,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { OpenAIConfigPanel } from '@/components/shared/OpenAIConfigPanel';
import { isAIConfigured } from '@/services/aiWritingService';
import { BookPerfectDashboard } from '@/components/bookperfect/BookPerfectDashboard';
import { AnalysisProgress } from '@/components/bookperfect/AnalysisProgress';
import { ScoreDashboard } from '@/components/bookperfect/ScoreDashboard';
import { IssueListTab } from '@/components/bookperfect/shared/IssueListTab';
import { AmazonKdpTab } from '@/components/bookperfect/tabs/AmazonKdpTab';
import { RapportFinalTab } from '@/components/bookperfect/tabs/RapportFinalTab';
import {
  runAnalysis, loadAnalysis, updateIssueStatus,
} from '@/lib/bookperfect/analysisOrchestrator';
import type { Analysis, Manuscript } from '@/lib/bookperfect/types';

const BookPerfectPage: React.FC = () => {
  const navigate = useNavigate();
  const [manuscript, setManuscript] = useState<Manuscript | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [running, setRunning] = useState(false);
  const [runningIndex, setRunningIndex] = useState<number | null>(null);
  const [hasKey, setHasKey] = useState(false);
  const abortRef = useRef<{ aborted: boolean }>({ aborted: false });

  useEffect(() => { setHasKey(isAIConfigured()); }, []);

  const onImported = useCallback((m: Manuscript) => {
    setManuscript(m);
    const existing = loadAnalysis(m.id);
    setAnalysis(existing);
  }, []);

  const start = useCallback(async (resumeOnly: boolean) => {
    if (!manuscript) return;
    if (!isAIConfigured()) {
      toast.error('Configurez votre clé API IA avant de lancer l\'analyse.');
      setHasKey(false);
      return;
    }
    abortRef.current = { aborted: false };
    setRunning(true);
    try {
      const result = await runAnalysis(
        manuscript,
        { resumeOnly, existing: resumeOnly ? analysis : null, signal: abortRef.current },
        {
          onChapterStart: (_c, i) => setRunningIndex(i),
          onProgress: (a) => setAnalysis({ ...a }),
        },
      );
      setAnalysis({ ...result });
      if (!abortRef.current.aborted) {
        const failed = result.chapterResults.filter((r) => r.status === 'failed').length;
        if (failed > 0) toast.warning(`Analyse terminée. ${failed} chapitre(s) en échec — relancez-les.`);
        else toast.success('Analyse terminée ✓');
      }
    } catch (e: any) {
      toast.error(e?.message || 'Erreur pendant l\'analyse.');
    } finally {
      setRunning(false);
      setRunningIndex(null);
    }
  }, [manuscript, analysis]);

  const stop = () => { abortRef.current.aborted = true; setRunning(false); toast.info('Analyse interrompue. Vous pourrez la reprendre.'); };

  const setStatus = useCallback((id: string, status: 'applied' | 'ignored' | 'pending') => {
    setAnalysis((prev) => (prev ? updateIssueStatus(prev, id, status) : prev));
  }, []);
  const onApply = (id: string) => setStatus(id, 'applied');
  const onIgnore = (id: string) => setStatus(id, 'ignored');
  const onReset = (id: string) => setStatus(id, 'pending');

  const reset = () => { setManuscript(null); setAnalysis(null); };

  const hasResults = !!analysis && analysis.chapterResults.some((r) => r.status === 'done' || r.status === 'failed');
  const failedCount = analysis?.chapterResults.filter((r) => r.status === 'failed').length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Retour
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" /> BookPerfect AI · Directeur éditorial
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-primary" /> BookPerfect AI
          </h1>
          <p className="text-muted-foreground mt-1">
            Votre directeur éditorial IA pour Amazon KDP. Analyse chapitre par chapitre, corrections
            non-destructives, export Word propre.
          </p>
        </div>

        {!hasKey && (
          <div className="mb-6">
            <OpenAIConfigPanel
              title="🔑 Clé API IA requise"
              description="BookPerfect AI utilise votre clé IA (Gemini, Claude, OpenAI ou OpenRouter) pour l'analyse éditoriale."
              compact
            />
            <div className="mt-2">
              <Button size="sm" variant="outline" onClick={() => setHasKey(isAIConfigured())}>
                J'ai configuré ma clé
              </Button>
            </div>
          </div>
        )}

        {!manuscript && <BookPerfectDashboard onImported={onImported} />}

        {manuscript && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{manuscript.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {manuscript.wordCount.toLocaleString('fr-FR')} mots · ~{manuscript.pageEstimate} pages · {manuscript.chapters.length} chapitres
                  </div>
                </div>
                {!running ? (
                  <div className="flex flex-wrap gap-2">
                    {!hasResults && (
                      <Button onClick={() => start(false)} className="gap-2">
                        <Play className="h-4 w-4" /> Lancer l'analyse
                      </Button>
                    )}
                    {hasResults && failedCount > 0 && (
                      <Button onClick={() => start(true)} className="gap-2">
                        <RotateCcw className="h-4 w-4" /> Reprendre ({failedCount} en échec)
                      </Button>
                    )}
                    {hasResults && (
                      <Button variant="outline" onClick={() => start(false)} className="gap-2">
                        <RotateCcw className="h-4 w-4" /> Tout réanalyser
                      </Button>
                    )}
                    <Button variant="ghost" onClick={reset}>Changer de fichier</Button>
                  </div>
                ) : (
                  <Button variant="outline" onClick={stop} className="gap-2">
                    <Square className="h-4 w-4" /> Interrompre
                  </Button>
                )}
              </CardContent>
            </Card>

            {running && analysis && (
              <AnalysisProgress manuscript={manuscript} analysis={analysis} runningIndex={runningIndex} />
            )}

            {analysis?.scores && <ScoreDashboard scores={analysis.scores} />}

            {hasResults && analysis && (
              <Tabs defaultValue="traces-ia">
                <TabsList className="flex flex-wrap h-auto">
                  <TabsTrigger value="traces-ia" className="gap-1"><Bug className="h-4 w-4" /> Traces IA</TabsTrigger>
                  <TabsTrigger value="orthographe" className="gap-1"><FileText className="h-4 w-4" /> Orthographe</TabsTrigger>
                  <TabsTrigger value="style" className="gap-1"><Feather className="h-4 w-4" /> Style</TabsTrigger>
                  <TabsTrigger value="kdp" className="gap-1"><ShoppingCart className="h-4 w-4" /> Amazon KDP</TabsTrigger>
                  <TabsTrigger value="rapport" className="gap-1"><FileText className="h-4 w-4" /> Rapport</TabsTrigger>
                </TabsList>

                <TabsContent value="traces-ia" className="mt-4">
                  <IssueListTab analysis={analysis} category="traces-ia"
                    description="Placeholders, titres provisoires et formulations d'IA à retirer avant publication."
                    icon={<Bug className="h-5 w-5 text-primary" />}
                    onApply={onApply} onIgnore={onIgnore} onReset={onReset} />
                </TabsContent>
                <TabsContent value="orthographe" className="mt-4">
                  <IssueListTab analysis={analysis} category="orthographe"
                    description="Orthographe, grammaire, accords et typographie française."
                    icon={<FileText className="h-5 w-5 text-primary" />}
                    onApply={onApply} onIgnore={onIgnore} onReset={onReset} />
                </TabsContent>
                <TabsContent value="style" className="mt-4">
                  <IssueListTab analysis={analysis} category="style"
                    description="Répétitions, lourdeurs et passages à fluidifier — votre style est préservé."
                    icon={<Feather className="h-5 w-5 text-primary" />}
                    onApply={onApply} onIgnore={onIgnore} onReset={onReset} />
                </TabsContent>
                <TabsContent value="kdp" className="mt-4">
                  <AmazonKdpTab analysis={analysis} onApply={onApply} onIgnore={onIgnore} onReset={onReset} />
                </TabsContent>
                <TabsContent value="rapport" className="mt-4">
                  <RapportFinalTab manuscript={manuscript} analysis={analysis} onRelaunchFailed={() => start(true)} />
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookPerfectPage;
