import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, Play, RotateCcw, Sparkles, Bug, Feather, ShoppingCart, FileText, Square, Columns, Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { OpenAIConfigPanel } from '@/components/shared/OpenAIConfigPanel';
import { isAIConfigured } from '@/services/aiWritingService';
import { BookPerfectDashboard } from '@/components/bookperfect/BookPerfectDashboard';
import { AnalysisProgress } from '@/components/bookperfect/AnalysisProgress';
import { EditorAtWork } from '@/components/bookperfect/EditorAtWork';
import { AnalysisSummary } from '@/components/bookperfect/AnalysisSummary';
import { ScoreDashboard } from '@/components/bookperfect/ScoreDashboard';
import { IssueListTab } from '@/components/bookperfect/shared/IssueListTab';
import { AmazonKdpTab } from '@/components/bookperfect/tabs/AmazonKdpTab';
import { ComparaisonTab } from '@/components/bookperfect/tabs/ComparaisonTab';
import { RapportFinalTab } from '@/components/bookperfect/tabs/RapportFinalTab';
import { exportKdpPackage, DEFAULT_KDP_OPTIONS } from '@/lib/bookperfect/exporters';
import {
  runAnalysis, loadAnalysisAsync, loadRecoverySnapshotAsync, updateIssueStatus, BOOKPERFECT_RECOVERY_SCOPE, saveAnalysisSnapshotAsync,
} from '@/lib/bookperfect/analysisOrchestrator';
import type { BookPerfectRecoverySnapshot } from '@/lib/bookperfect/analysisOrchestrator';
import { readAutosaveAsync, requestPersistentStorage, writeAutosave, writeAutosaveAsync } from '@/lib/ebookProjectStorage';
import type { Analysis, Manuscript } from '@/lib/bookperfect/types';

const CURRENT_MANUSCRIPT_SCOPE = 'bookperfect_current_manuscript';

const normalizeResumableAnalysis = (value: Analysis): Analysis => ({
  ...value,
  chapterResults: value.chapterResults.map((r) => (
    r.status === 'running' ? { ...r, status: 'pending' as const } : r
  )),
});

const BookPerfectPage: React.FC = () => {
  const navigate = useNavigate();
  const [manuscript, setManuscript] = useState<Manuscript | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [running, setRunning] = useState(false);
  const [runningIndex, setRunningIndex] = useState<number | null>(null);
  const [hasKey, setHasKey] = useState(false);
  const [paused, setPaused] = useState(false);
  const [pausedMessage, setPausedMessage] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const [justCompleted, setJustCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState('traces-ia');
  const [kdpBusy, setKdpBusy] = useState(false);
  const [savingNow, setSavingNow] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [saveNote, setSaveNote] = useState('Sauvegarde navigateur active');

  const prepareForKdp = useCallback(async () => {
    if (!manuscript || !analysis) return;
    try {
      setKdpBusy(true);
      toast.loading('Création du pack KDP 6 × 9 (Word + PDF + fiche marges)…', { id: 'bp-kdp-page' });
      await exportKdpPackage(manuscript, analysis, { ...DEFAULT_KDP_OPTIONS, formatId: '6x9' }, true);
      toast.success('Pack KDP 6 × 9 exporté : Word + PDF + fiche marges ✓', { id: 'bp-kdp-page' });
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la préparation KDP.', { id: 'bp-kdp-page' });
    } finally {
      setKdpBusy(false);
    }
  }, [manuscript, analysis]);
  const [recoverySnapshot, setRecoverySnapshot] = useState<BookPerfectRecoverySnapshot | null>(null);
  const abortRef = useRef<{ aborted: boolean }>({ aborted: false });
  const startTimeRef = useRef<number>(0);

  const saveCurrentWork = useCallback(async (silent = false) => {
    if (!manuscript) return;
    setSavingNow(true);
    try {
      await writeAutosaveAsync(CURRENT_MANUSCRIPT_SCOPE, manuscript);
      if (analysis) {
        await saveAnalysisSnapshotAsync(analysis);
        await writeAutosaveAsync<BookPerfectRecoverySnapshot>(BOOKPERFECT_RECOVERY_SCOPE, { manuscript, analysis });
      }
      const now = Date.now();
      setLastSavedAt(now);
      setSaveNote(`Sauvegardé à ${new Date(now).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`);
      if (!silent) toast.success('Travail sauvegardé. Vous pourrez reprendre sans réimporter le fichier.');
    } catch (e: any) {
      if (!silent) toast.error(e?.message || 'Impossible de sauvegarder le travail.');
    } finally {
      setSavingNow(false);
    }
  }, [manuscript, analysis]);

  useEffect(() => {
    let mounted = true;
    setHasKey(isAIConfigured());
    void requestPersistentStorage();

    (async () => {
      const recovery = await loadRecoverySnapshotAsync();
      if (!mounted) return;
      setRecoverySnapshot(recovery);

      const savedManuscript = await readAutosaveAsync<Manuscript>(CURRENT_MANUSCRIPT_SCOPE);
      if (!mounted) return;
      if (savedManuscript?.id) {
        setManuscript(savedManuscript);
        const savedAnalysis = await loadAnalysisAsync(savedManuscript.id);
        if (!mounted) return;
        const normalizedAnalysis = savedAnalysis ? normalizeResumableAnalysis(savedAnalysis) : null;
        setAnalysis(normalizedAnalysis);
        const savedAt = normalizedAnalysis?.updatedAt || savedManuscript.importedAt || Date.now();
        setLastSavedAt(savedAt);
        setSaveNote('Dernière sauvegarde retrouvée automatiquement');
        if (normalizedAnalysis?.chapterResults.some((r) => r.status !== 'done')) {
          setPaused(true);
          setPausedMessage('Analyse interrompue : vous pouvez reprendre exactement où elle s’est arrêtée.');
        }
        return;
      }

      if (recovery?.manuscript?.id && recovery.analysis?.chapterResults?.some((r) => r.status !== 'done')) {
        setManuscript(recovery.manuscript);
        await writeAutosaveAsync(CURRENT_MANUSCRIPT_SCOPE, recovery.manuscript);
        if (!mounted) return;
        setAnalysis(normalizeResumableAnalysis(recovery.analysis));
        setLastSavedAt(recovery.analysis.updatedAt || Date.now());
        setSaveNote('Sauvegarde de reprise restaurée');
        setPaused(true);
        setPausedMessage('Analyse interrompue : vous pouvez reprendre exactement où elle s’est arrêtée.');
      }
    })();

    return () => { mounted = false; };
  }, []);

  const onImported = useCallback(async (m: Manuscript) => {
    setManuscript(m);
    await writeAutosaveAsync(CURRENT_MANUSCRIPT_SCOPE, m);
    const savedAt = Date.now();
    setLastSavedAt(savedAt);
    setSaveNote(`Fichier sauvegardé à ${new Date(savedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`);
    const existing = await loadAnalysisAsync(m.id);
    const normalizedExisting = existing ? normalizeResumableAnalysis(existing) : null;
    setAnalysis(normalizedExisting);
    setPaused(!!normalizedExisting?.chapterResults.some((r) => r.status !== 'done'));
    setPausedMessage(normalizedExisting?.chapterResults.some((r) => r.status !== 'done') ? 'Analyse précédente retrouvée : cliquez sur Reprendre.' : null);
  }, []);

  const start = useCallback(async (resumeOnly: boolean) => {
    if (!manuscript) return;
    if (!isAIConfigured()) {
      toast.error('Configurez votre clé API IA avant de lancer l\'analyse.');
      setHasKey(false);
      return;
    }
    abortRef.current = { aborted: false };
    setPaused(false);
    setPausedMessage(null);
    setJustCompleted(false);
    setRunning(true);
    startTimeRef.current = Date.now();
    const resumeAnalysis = resumeOnly ? (analysis || await loadAnalysisAsync(manuscript.id)) : null;
    if (resumeAnalysis) setAnalysis({ ...resumeAnalysis });
    try {
      const result = await runAnalysis(
        manuscript,
        { resumeOnly, existing: resumeAnalysis, signal: abortRef.current },
        {
          onChapterStart: (_c, i) => setRunningIndex(i),
          onProgress: (a) => setAnalysis({ ...a }),
        },
      );
      setAnalysis({ ...result });
      setLastSavedAt(result.updatedAt || Date.now());
      setSaveNote('Analyse sauvegardée automatiquement');
      if (!abortRef.current.aborted) {
        setElapsedMs(Date.now() - startTimeRef.current);
        const failed = result.chapterResults.filter((r) => r.status === 'failed').length;
        if (failed > 0) toast.warning(`Analyse terminée. ${failed} chapitre(s) en échec — relancez-les.`);
        else {
          setJustCompleted(true);
          setActiveTab('rapport');
          toast.success('Analyse terminée ✓ Votre export est prêt dans l\'onglet Rapport.');
        }
      }
    } catch (e: any) {
      const msg = e?.message || 'Erreur pendant l\'analyse.';
      const saved = await loadAnalysisAsync(manuscript.id);
      if (saved) {
        setAnalysis({ ...saved });
        setLastSavedAt(saved.updatedAt || Date.now());
        setSaveNote('Analyse en pause sauvegardée');
      }
      // Erreur fatale : l'analyse est en pause, on propose « Reprendre ».
      setPaused(true);
      setPausedMessage(msg);
      toast.error(msg);
    } finally {
      setRunning(false);
      setRunningIndex(null);
    }
  }, [manuscript, analysis]);


  const stop = () => {
    abortRef.current.aborted = true;
    setRunning(false);
    setPaused(true);
    setPausedMessage('Analyse interrompue : cliquez sur Reprendre pour continuer sans repartir du début.');
    toast.info('Analyse interrompue. Vous pourrez la reprendre.');
  };

  const setStatus = useCallback((id: string, status: 'applied' | 'ignored' | 'pending') => {
    setAnalysis((prev) => (prev ? updateIssueStatus(prev, id, status) : prev));
  }, []);
  const onApply = (id: string) => setStatus(id, 'applied');
  const onIgnore = (id: string) => setStatus(id, 'ignored');
  const onReset = (id: string) => setStatus(id, 'pending');

  const reset = () => {
    const ok = window.confirm('Supprimer la sauvegarde actuelle et choisir un autre fichier ?');
    if (!ok) return;
    setManuscript(null);
    setAnalysis(null);
    setPaused(false);
    setPausedMessage(null);
    setElapsedMs(null);
    setJustCompleted(false);
    setLastSavedAt(null);
    setSaveNote('Sauvegarde navigateur active');
    writeAutosave<Manuscript | null>(CURRENT_MANUSCRIPT_SCOPE, null);
    writeAutosave(BOOKPERFECT_RECOVERY_SCOPE, null);
    setRecoverySnapshot(null);
  };

  const restoreRecovery = async () => {
    const recovery = recoverySnapshot || await loadRecoverySnapshotAsync();
    if (!recovery?.manuscript?.id) return;
    const normalizedAnalysis = normalizeResumableAnalysis(recovery.analysis);
    setManuscript(recovery.manuscript);
    await writeAutosaveAsync(CURRENT_MANUSCRIPT_SCOPE, recovery.manuscript);
    setAnalysis(normalizedAnalysis);
    setLastSavedAt(normalizedAnalysis.updatedAt || Date.now());
    setSaveNote('Sauvegarde de reprise restaurée');
    setPaused(true);
    setPausedMessage('Analyse retrouvée : cliquez sur Reprendre pour continuer exactement où elle s’est arrêtée.');
    setRecoverySnapshot(recovery);
  };

  const hasResults = !!analysis && analysis.chapterResults.some((r) => r.status === 'done' || r.status === 'failed');
  const hasIncompleteAnalysis = !!analysis && analysis.chapterResults.some((r) => r.status !== 'done');
  const showResumeButton = !!manuscript && hasIncompleteAnalysis;
  const failedCount = analysis?.chapterResults.filter((r) => r.status === 'failed').length ?? 0;
  const pendingCount = analysis?.chapterResults.filter((r) => r.status === 'pending' || r.status === 'running').length ?? 0;
  const remainingCount = failedCount + pendingCount;
  const recoveryRemainingCount = recoverySnapshot?.analysis.chapterResults.filter((r) => r.status !== 'done').length ?? 0;

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

        {!manuscript && (
          <BookPerfectDashboard
            onImported={onImported}
            onResume={recoveryRemainingCount > 0 ? restoreRecovery : undefined}
            resumeLabel={recoveryRemainingCount > 0 ? `Reprendre (${recoveryRemainingCount} restant${recoveryRemainingCount > 1 ? 's' : ''})` : undefined}
          />
        )}

        {manuscript && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{manuscript.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {manuscript.wordCount.toLocaleString('fr-FR')} mots · ~{manuscript.pageEstimate} pages · {manuscript.chapters.length} chapitres
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-primary">
                    <Save className="h-3.5 w-3.5" /> {saveNote}{lastSavedAt ? ' — reprise possible sans repartir de zéro.' : ''}
                  </div>
                </div>
                {!running ? (
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => saveCurrentWork()} disabled={savingNow} variant="outline" className="gap-2 border-primary/50">
                      <Save className="h-4 w-4" /> {savingNow ? 'Sauvegarde…' : '💾 Sauvegarder'}
                    </Button>
                    {showResumeButton && (
                      <Button onClick={() => start(true)} className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                        <RotateCcw className="h-4 w-4" /> Reprendre ({remainingCount} restant{remainingCount > 1 ? 's' : ''})
                      </Button>
                    )}
                    {!hasResults && !showResumeButton && (
                      <Button onClick={() => start(false)} className="gap-2">
                        <Play className="h-4 w-4" /> Lancer l'analyse
                      </Button>
                    )}
                    {hasResults && (
                      <Button onClick={prepareForKdp} disabled={kdpBusy} className="gap-2 bg-primary text-primary-foreground">
                        <BookOpen className="h-4 w-4" /> 📖 Préparer pour Amazon KDP (6 × 9)
                      </Button>
                    )}
                    {hasResults && (
                      <Button variant="outline" onClick={() => start(false)} className="gap-2">
                        <RotateCcw className="h-4 w-4" /> Tout réanalyser
                      </Button>
                    )}
                    <Button variant="ghost" onClick={reset}>Supprimer / changer</Button>
                  </div>
                ) : (
                  <Button variant="outline" onClick={stop} className="gap-2">
                    <Square className="h-4 w-4" /> Interrompre
                  </Button>
                )}
              </CardContent>
            </Card>

            {showResumeButton && !running && (
              <Card className="border-amber-500/40 bg-amber-500/5">
                <CardContent className="p-4 flex flex-wrap items-center gap-3">
                  <span className="text-sm text-amber-700 dark:text-amber-400 flex-1 min-w-[200px]">
                    ⏸️ Analyse incomplète. {pausedMessage || 'Cliquez sur Reprendre pour continuer exactement où elle s’est arrêtée.'}
                  </span>
                  <Button onClick={() => start(true)} className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                    <RotateCcw className="h-4 w-4" /> Reprendre ({remainingCount} restant{remainingCount > 1 ? 's' : ''})
                  </Button>
                </CardContent>
              </Card>
            )}

            {running && analysis && (
              <div className="grid gap-6 lg:grid-cols-[1fr_360px] items-start">
                <AnalysisProgress manuscript={manuscript} analysis={analysis} runningIndex={runningIndex} />
                <EditorAtWork manuscript={manuscript} analysis={analysis} runningIndex={runningIndex} />
              </div>
            )}

            {justCompleted && !running && analysis && (
              <AnalysisSummary manuscript={manuscript} analysis={analysis} elapsedMs={elapsedMs} />
            )}


            {analysis?.scores && <ScoreDashboard scores={analysis.scores} />}

            {hasResults && !running && !showResumeButton && analysis && (
              <Card className="border-primary/40 bg-primary/5">
                <CardContent className="p-4 flex flex-wrap items-center gap-3">
                  <span className="text-sm flex-1 min-w-[200px]">
                    ✅ Analyse terminée. Obtenez en un clic votre pack prêt pour Amazon KDP (Word + PDF + fiche marges).
                  </span>
                  <Button onClick={prepareForKdp} disabled={kdpBusy} className="gap-2">
                    <BookOpen className="h-4 w-4" /> 📖 Préparer pour Amazon KDP (6 × 9)
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('rapport')} className="gap-2">
                    <FileText className="h-4 w-4" /> Personnaliser
                  </Button>
                </CardContent>
              </Card>
            )}

            {hasResults && analysis && (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="flex flex-wrap h-auto">
                  <TabsTrigger value="traces-ia" className="gap-1"><Bug className="h-4 w-4" /> Traces IA</TabsTrigger>
                  <TabsTrigger value="orthographe" className="gap-1"><FileText className="h-4 w-4" /> Orthographe</TabsTrigger>
                  <TabsTrigger value="style" className="gap-1"><Feather className="h-4 w-4" /> Style</TabsTrigger>
                  <TabsTrigger value="comparer" className="gap-1"><Columns className="h-4 w-4" /> Comparer</TabsTrigger>
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
                <TabsContent value="comparer" className="mt-4">
                  <ComparaisonTab manuscript={manuscript} analysis={analysis} />
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
