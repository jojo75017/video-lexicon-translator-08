import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';
import useBookProject from '@/hooks/useBookProject';
import MasterSheetForm from '@/components/v3/studio/MasterSheetForm';
import BibleReview from '@/components/v3/studio/BibleReview';
import BookDashboard from '@/components/v3/studio/BookDashboard';
import EngineBadge from '@/components/v3/studio/EngineBadge';
import { BibleContent, EMPTY_BIBLE, MasterSheetDraft, emptyMasterSheet } from '@/types/studioPro';

/**
 * Studio Pro — parcours hybride : Gemini construit la Bible, ChatGPT rédigera
 * ensuite chapitre par chapitre (phase 2). Parcours totalement isolé de
 * l'ancien workflow, qui reste inchangé.
 */
const V3StudioProPage: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const projectId = params.get('projet');
  const { apiKey } = useOpenAIConfig();
  const {
    project, bible, chapters, saving, loading,
    saveMasterSheet, saveBibleVersion,
  } = useBookProject(projectId);

  const [sheet, setSheet] = useState<MasterSheetDraft>(emptyMasterSheet());
  const [draftBible, setDraftBible] = useState<BibleContent>(EMPTY_BIBLE);
  const [tab, setTab] = useState('fiche');
  const [generating, setGenerating] = useState(false);
  const [busySection, setBusySection] = useState<string | null>(null);

  // Hydrate depuis le projet chargé
  React.useEffect(() => {
    if (project) {
      const { id, user_id, created_at, updated_at, status, ...rest } = project as any;
      setSheet({ ...emptyMasterSheet(), ...rest });
    }
  }, [project]);
  React.useEffect(() => {
    if (bible) setDraftBible({ ...EMPTY_BIBLE, ...bible });
  }, [bible]);

  React.useEffect(() => {
    document.title = 'Studio Pro — Bible du livre | EbookStudio';
  }, []);

  const currentSheet = useMemo(() => sheet, [sheet]);

  const handleSaveSheet = async () => {
    const id = await saveMasterSheet(currentSheet, projectId);
    if (id) {
      if (!projectId) {
        const next = new URLSearchParams(params);
        next.set('projet', id);
        setParams(next, { replace: true });
      }
      toast.success('Fiche maître enregistrée');
      setTab('bible');
    }
  };

  const generateBible = async () => {
    let id = projectId;
    if (!id) {
      id = await saveMasterSheet(currentSheet);
      if (!id) return;
      const next = new URLSearchParams(params);
      next.set('projet', id);
      setParams(next, { replace: true });
    }
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('book-bible-generate', {
        body: { sheet: currentSheet, userApiKey: apiKey || undefined, section: 'full' },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const content = { ...EMPTY_BIBLE, ...((data as any).bible || {}) } as BibleContent;
      setDraftBible(content);
      await saveBibleVersion(id, content, { engine: (data as any).engine || 'gemini' });
      toast.success('Bible du livre construite par Gemini');
      setTab('bible');
    } catch (e: any) {
      console.error('[StudioPro] generateBible', e);
      toast.error(e?.message || "L'architecte IA n'a pas pu construire la Bible");
    } finally {
      setGenerating(false);
    }
  };

  const regenerateSection = async (section: string, guidance?: string) => {
    setBusySection(section);
    try {
      const { data, error } = await supabase.functions.invoke('book-bible-generate', {
        body: { sheet: currentSheet, userApiKey: apiKey || undefined, section, current: draftBible, guidance },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setDraftBible((prev) => ({ ...prev, ...((data as any).patch || {}) }));
      toast.success('Nouvelle proposition intégrée');
    } catch (e: any) {
      toast.error(e?.message || 'Régénération impossible');
    } finally {
      setBusySection(null);
    }
  };

  const saveDraft = async () => {
    if (!projectId) return;
    await saveBibleVersion(projectId, draftBible);
    toast.success('Nouvelle version de la Bible enregistrée');
  };

  const validateBible = async () => {
    if (!projectId) return;
    const saved = await saveBibleVersion(projectId, draftBible, { validate: true });
    if (saved) {
      toast.success('Bible validée — les chapitres sont prêts');
      setTab('tableau');
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <header className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Studio Pro</Badge>
          <EngineBadge engine="gemini" task="Architecture, analyse, cohérence" />
          <EngineBadge engine="chatgpt" task="Rédaction et style (étape suivante)" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Studio éditorial hybride</h1>
        <p className="max-w-3xl text-muted-foreground">
          Gemini construit la Bible complète de votre livre — synopsis, structure, personnages,
          chronologie, indices. Vous la corrigez librement, puis vous validez : rien n’est rédigé
          avant votre accord.
        </p>
      </header>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-5">
          <TabsTrigger value="fiche">1. Fiche maître</TabsTrigger>
          <TabsTrigger value="bible">2. Bible du livre</TabsTrigger>
          <TabsTrigger value="tableau">3. Tableau de bord</TabsTrigger>
          <TabsTrigger value="redaction">4. Rédaction</TabsTrigger>
        </TabsList>


        <TabsContent value="fiche">
          <MasterSheetForm
            value={currentSheet}
            onChange={(patch) => setSheet((s) => ({ ...s, ...patch }))}
            onSubmit={handleSaveSheet}
            saving={saving}
          />
        </TabsContent>

        <TabsContent value="bible">
          {draftBible.structure.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                <Sparkles className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold">Gemini va construire l’architecture de votre livre</p>
                  <p className="text-sm text-muted-foreground">
                    Concept, promesse, synopsis, {currentSheet.chapters_target} chapitres, personnages,
                    chronologie et indices. Comptez 1 à 3 minutes.
                  </p>
                </div>
                <Button size="lg" onClick={generateBible} disabled={generating || (currentSheet.title || '').trim().length < 3}>
                  {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {generating ? 'Construction en cours…' : 'Construire la Bible du livre'}
                </Button>
                {(currentSheet.title || '').trim().length < 3 && (
                  <p className="text-xs text-muted-foreground">Renseignez d’abord le titre dans la fiche maître.</p>
                )}
              </CardContent>
            </Card>
          ) : (
            <BibleReview
              bookKind={currentSheet.book_kind}
              bible={draftBible}
              onChange={(patch) => setDraftBible((b) => ({ ...b, ...patch }))}
              onRegenerateSection={regenerateSection}
              onValidate={validateBible}
              onSaveDraft={saveDraft}
              busySection={busySection}
              saving={saving}
            />
          )}
        </TabsContent>

        <TabsContent value="tableau">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : (
            <BookDashboard chaptersTarget={currentSheet.chapters_target} chapters={chapters} />
          )}
        </TabsContent>

        <TabsContent value="redaction">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : (
            <ChapterWriter
              chapters={chapters}
              contents={writing.contents}
              memories={writing.memories}
              alerts={writing.alerts}
              busyChapterId={writing.busyChapterId}
              busyLabel={writing.busyLabel}
              runningAll={writing.runningAll}
              onWrite={(chapter, opts) => writing.writeChapter(chapter, opts)}
              onWriteAll={writing.writeAll}
              onCancelAll={writing.cancelAll}
              onSave={writing.saveManual}
            />
          )}
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default V3StudioProPage;
