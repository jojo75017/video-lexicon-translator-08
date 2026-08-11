import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  BibleContent,
  BookBible,
  BookChapter,
  BookProject,
  EMPTY_BIBLE,
  MasterSheetDraft,
  emptyMasterSheet,
} from '@/types/studioPro';

// Les tables Studio Pro sont récentes : on passe par un client non typé pour
// rester compatible même si les types générés n'ont pas encore été rafraîchis.
const db = supabase as any;

const toBible = (row: any): BookBible => ({
  id: row.id,
  project_id: row.project_id,
  version: row.version,
  engine: row.engine || 'gemini',
  validated_at: row.validated_at,
  created_at: row.created_at,
  concept: row.concept || '',
  promise: row.promise || '',
  synopsis: row.synopsis || '',
  structure: Array.isArray(row.structure) ? row.structure : [],
  characters: Array.isArray(row.characters) ? row.characters : [],
  timeline: Array.isArray(row.timeline) ? row.timeline : [],
  places: Array.isArray(row.places) ? row.places : [],
  plot_threads: Array.isArray(row.plot_threads) ? row.plot_threads : [],
  pedagogy: Array.isArray(row.pedagogy) ? row.pedagogy : [],
  notes: row.notes || '',
});

export const useBookProject = (projectId?: string | null) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [project, setProject] = useState<BookProject | null>(null);
  const [bible, setBible] = useState<BookBible | null>(null);
  const [bibleVersions, setBibleVersions] = useState<BookBible[]>([]);
  const [chapters, setChapters] = useState<BookChapter[]>([]);

  const load = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const [{ data: p }, { data: bibles }, { data: chaps }] = await Promise.all([
        db.from('book_projects').select('*').eq('id', id).maybeSingle(),
        db.from('book_bibles').select('*').eq('project_id', id).order('version', { ascending: false }),
        db.from('book_chapters').select('*').eq('project_id', id).order('position', { ascending: true }),
      ]);
      setProject((p as BookProject) || null);
      const list = (bibles || []).map(toBible);
      setBibleVersions(list);
      setBible(list[0] || null);
      setChapters((chaps || []) as BookChapter[]);
    } catch (e) {
      console.error('[StudioPro] load', e);
      toast.error("Impossible de charger le projet");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (projectId) load(projectId);
  }, [projectId, load]);

  /** Crée ou met à jour la fiche maître. Retourne l'id du projet. */
  const saveMasterSheet = useCallback(async (sheet: MasterSheetDraft, id?: string | null): Promise<string | null> => {
    setSaving(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth?.user?.id;
      if (!userId) {
        toast.error('Connectez-vous pour enregistrer votre livre');
        return null;
      }
      const payload = { ...sheet, user_id: userId };
      if (id) {
        const { data, error } = await db.from('book_projects').update(payload).eq('id', id).select().maybeSingle();
        if (error) throw error;
        setProject(data as BookProject);
        return id;
      }
      const { data, error } = await db.from('book_projects').insert(payload).select().maybeSingle();
      if (error) throw error;
      setProject(data as BookProject);
      return data?.id ?? null;
    } catch (e: any) {
      console.error('[StudioPro] saveMasterSheet', e);
      toast.error(e?.message || "Enregistrement impossible");
      return null;
    } finally {
      setSaving(false);
    }
  }, []);

  /** Enregistre une NOUVELLE version de Bible (aucun écrasement). */
  const saveBibleVersion = useCallback(
    async (id: string, content: BibleContent, opts?: { validate?: boolean; engine?: string }): Promise<BookBible | null> => {
      setSaving(true);
      try {
        const { data: auth } = await supabase.auth.getUser();
        const userId = auth?.user?.id;
        if (!userId) {
          toast.error('Connectez-vous pour enregistrer la Bible');
          return null;
        }
        const { data: last } = await db
          .from('book_bibles')
          .select('version')
          .eq('project_id', id)
          .order('version', { ascending: false })
          .limit(1)
          .maybeSingle();
        const nextVersion = (last?.version || 0) + 1;

        const { data, error } = await db
          .from('book_bibles')
          .insert({
            project_id: id,
            user_id: userId,
            version: nextVersion,
            engine: opts?.engine || 'gemini',
            concept: content.concept,
            promise: content.promise,
            synopsis: content.synopsis,
            structure: content.structure,
            characters: content.characters,
            timeline: content.timeline,
            places: content.places,
            plot_threads: content.plot_threads,
            pedagogy: content.pedagogy,
            notes: content.notes,
            validated_at: opts?.validate ? new Date().toISOString() : null,
          })
          .select()
          .maybeSingle();
        if (error) throw error;

        const saved = toBible(data);
        setBible(saved);
        setBibleVersions((prev) => [saved, ...prev]);

        if (opts?.validate) {
          await syncChaptersFromBible(id, userId, content);
          await db.from('book_projects').update({ status: 'redaction' }).eq('id', id);
          setProject((p) => (p ? { ...p, status: 'redaction' } : p));
        } else {
          await db.from('book_projects').update({ status: 'bible' }).eq('id', id);
          setProject((p) => (p ? { ...p, status: 'bible' } : p));
        }
        return saved;
      } catch (e: any) {
        console.error('[StudioPro] saveBibleVersion', e);
        toast.error(e?.message || "Enregistrement de la Bible impossible");
        return null;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  /** Crée/met à jour les lignes de chapitres à partir de la structure validée. */
  const syncChaptersFromBible = useCallback(async (id: string, userId: string, content: BibleContent) => {
    const rows = content.structure.map((c, i) => ({
      project_id: id,
      user_id: userId,
      position: i + 1,
      title: c.titre || `Chapitre ${i + 1}`,
      objective: c.objectif || null,
      planned_summary: c.resume || null,
      subsections: c.sous_chapitres || [],
      word_target: c.mots_vises || null,
      status: 'a_ecrire',
    }));
    // On repart d'une liste propre : les chapitres non encore rédigés sont
    // remplacés, ceux déjà écrits (brouillon/validé) sont préservés.
    const { data: existing } = await db
      .from('book_chapters')
      .select('id,position,status')
      .eq('project_id', id);
    const written = new Set(
      (existing || []).filter((c: any) => c.status !== 'a_ecrire').map((c: any) => c.position),
    );
    const toDelete = (existing || []).filter((c: any) => !written.has(c.position)).map((c: any) => c.id);
    if (toDelete.length) await db.from('book_chapters').delete().in('id', toDelete);
    const toInsert = rows.filter((r) => !written.has(r.position));
    if (toInsert.length) await db.from('book_chapters').insert(toInsert);

    const { data: chaps } = await db
      .from('book_chapters')
      .select('*')
      .eq('project_id', id)
      .order('position', { ascending: true });
    setChapters((chaps || []) as BookChapter[]);
  }, []);

  const restoreBibleVersion = useCallback((version: number) => {
    const found = bibleVersions.find((b) => b.version === version);
    if (found) {
      setBible(found);
      toast.success(`Version ${version} de la Bible restaurée à l'écran`);
    }
  }, [bibleVersions]);

  return {
    loading,
    saving,
    project,
    bible,
    bibleVersions,
    chapters,
    emptySheet: emptyMasterSheet,
    emptyBible: EMPTY_BIBLE,
    load,
    saveMasterSheet,
    saveBibleVersion,
    restoreBibleVersion,
  };
};

export default useBookProject;
