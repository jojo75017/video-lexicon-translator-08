import { useEffect, useState } from 'react';
import { Loader2, ScanSearch, CheckCircle2, BookOpen, RefreshCw, Wand2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { edgeFunctionError } from '@/lib/edgeFunctionError';
import { applyEditorialPatches, chapterText, type EditorialPatch, type ManuscriptChapter } from '@/lib/editorialCorrections';
import { getProvider, getActiveAIKey, getOpenRouterModel } from '@/services/aiWritingService';

type Issue = { chapitre?: number; extrait?: string; probleme?: string; suggestion?: string };
type Report = { score: number | null; synthese: string; categories: Record<string, Issue[]> };

const LABELS: [string, string][] = [
  ['sujet', 'Adéquation au sujet'],
  ['personnages', 'Continuité des personnages'],
  ['chronologie', 'Chronologie'],
  ['lieux', 'Lieux'],
  ['evenements', 'Événements'],
  ['incoherences', 'Incohérences factuelles internes'],
  ['repetitions', 'Répétitions'],
  ['grammaire', 'Grammaire'],
  ['ponctuation', 'Ponctuation'],
  ['typographie', 'Typographie française'],
  ['fluidite', 'Fluidité'],
];

export type ReviewBook = { id: string; title: string; kdp_description?: string | null; chapters?: unknown };

type LoadedChapter = { title: string; content: string };

export default function EditorialReviewPanel({ books, initialBookId, autoLoad, onSaved }: { books: ReviewBook[]; initialBookId?: string; autoLoad?: boolean; onSaved?: () => void }) {
  const [bookId, setBookId] = useState(initialBookId || books[0]?.id || '');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [chapters, setChapters] = useState<LoadedChapter[]>([]);
  const [report, setReport] = useState<Report | null>(null);
  const [active, setActive] = useState('sujet');
  const [source, setSource] = useState<ManuscriptChapter[]>([]);
  const [scope, setScope] = useState('all');
  const [preparing, setPreparing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [patches, setPatches] = useState<EditorialPatch[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const busy = loading || fetching || preparing || saving;


  // Changer de livre remet le texte chargé et le rapport à zéro.
  useEffect(() => { setChapters([]); setSource([]); setReport(null); setPatches([]); setSelected([]); }, [bookId]);
  useEffect(() => { if (initialBookId) setBookId(initialBookId); }, [initialBookId]);

  const book = books.find((b) => b.id === bookId);


  /** Récupère le texte du livre : d'abord le projet, sinon la dernière sauvegarde complète. */
  const fetchBook = async () => {
    if (!book) return;
    setFetching(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error('Connexion requise.');
      const { data, error } = await supabase.from('ebook_projects').select('chapters')
        .eq('id', book.id).eq('user_id', auth.user.id).single();
      if (error) throw error;
      let raw = Array.isArray(data.chapters) ? data.chapters as ManuscriptChapter[] : [];
      if (!raw.some(c => chapterText(c).trim())) {
        const { data: versions, error: versionError } = await supabase.from('ebook_project_versions')
          .select('chapters').eq('project_id', book.id).eq('user_id', auth.user.id)
          .order('version_number', { ascending: false });
        if (versionError) throw versionError;
        const version = versions?.find(v => Array.isArray(v.chapters) && v.chapters.some(c => c && typeof c === 'object' && chapterText(c as ManuscriptChapter).trim()));
        if (version && Array.isArray(version.chapters)) raw = version.chapters as ManuscriptChapter[];
      }
      const found = raw.map(c => ({ title: String(c.title || c.titre || ''), content: chapterText(c) }));
      if (!found.length) {
        toast.error('Ce livre ne contient pas encore de texte enregistré.');
        setChapters([]);
        return;
      }
      setSource(raw); setPatches([]); setSelected([]); setReport(null);
      setChapters(found);
      toast.success(`Livre chargé : ${found.length} chapitre(s) prêts pour la relecture.`);
    } catch (e: any) {
      toast.error(e?.message || 'Chargement du livre impossible.');
    } finally {
      setFetching(false);
    }
  };

  // Chargement automatique du texte quand un livre est présélectionné depuis la liste.
  useEffect(() => {
    if (!autoLoad || !book || chapters.length || fetching) return;
    void fetchBook();
  }, [autoLoad, bookId]); // eslint-disable-line

  const signs = chapters.reduce((total, c) => total + c.content.length, 0);


  const run = async () => {
    if (!book || !chapters.length) return;
    if (!getActiveAIKey()) return toast.error('Ajoutez votre clé IA dans « Clés API » avant de lancer la relecture.');
    setLoading(true); setReport(null); setPatches([]); setSelected([]);
    try {
      const { data, error } = await supabase.functions.invoke('editorial-review', {
        body: {
          title: book.title,
          subject: subject.trim() || book.kdp_description || '',
          chapters,
          userProvider: getProvider(),
          userApiKey: getActiveAIKey(),
          userModel: getProvider() === 'openrouter' ? getOpenRouterModel() : undefined,
        },
      });
      if (error || data?.error) throw new Error(await edgeFunctionError(error, data));
      setReport(data as Report);
    } catch (e: any) {
      toast.error(e?.message || 'Analyse impossible.');
    } finally { setLoading(false); }
  };

  const prepare = async () => {
    if (!book || !report) return;
    if (!getActiveAIKey()) return toast.error('Ajoutez votre clé IA dans « Clés API » avant de préparer les corrections.');
    setPreparing(true); setPatches([]); setSelected([]);
    try {
      const notes = Object.values(report.categories).flat();
      const targets = scope === 'all'
        ? chapters.map((_, i) => i + 1).filter(n => notes.some(note => note.chapitre === n))
        : [Number(scope)];
      const proposed: EditorialPatch[] = [];
      for (const chapterNumber of targets) {
        const { data, error } = await supabase.functions.invoke('editorial-review', { body: {
          mode: 'corrections', title: book.title, subject: subject.trim() || book.kdp_description || '',
          chapters, chapterNumber, issues: notes, userProvider: getProvider(), userApiKey: getActiveAIKey(),
          userModel: getProvider() === 'openrouter' ? getOpenRouterModel() : undefined,
        } });
        if (error || data?.error) throw new Error(await edgeFunctionError(error, data));
        for (const patch of (data?.corrections || []) as EditorialPatch[]) {
          if (patch.chapitre !== chapterNumber || /[—–]/.test(patch.remplacement || '')) continue;
          try { applyEditorialPatches(source, [...proposed, patch]); proposed.push(patch); } catch { /* Ambiguous proposals stay unapplied. */ }
        }
      }
      setPatches(proposed); setSelected(proposed.map((_, i) => i));
      if (!proposed.length) toast.info('Aucun remplacement suffisamment précis proposé. Les remarques restent à examiner.');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Préparation impossible.'); }
    finally { setPreparing(false); }
  };

  const apply = async () => {
    if (!book || !selected.length) return;
    setSaving(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error('Connexion requise.');
      const { data: current, error: readError } = await supabase.from('ebook_projects').select('chapters,title,author_name,kdp_description')
        .eq('id', book.id).eq('user_id', auth.user.id).single();
      if (readError) throw readError;
      if (JSON.stringify(current.chapters) !== JSON.stringify(source)) throw new Error('Le manuscrit a changé depuis son chargement. Rechargez-le et relancez l’analyse avant de corriger.');
      const corrected = applyEditorialPatches(source, selected.map(i => patches[i]));
      const { data: latest, error: historyError } = await supabase.from('ebook_project_versions').select('version_number')
        .eq('project_id', book.id).eq('user_id', auth.user.id).order('version_number', { ascending: false }).limit(1);
      if (historyError) throw historyError;
      const { error: backupError } = await supabase.from('ebook_project_versions').insert({
        project_id: book.id, user_id: auth.user.id, version_number: (latest?.[0]?.version_number || 0) + 1,
        title: current.title, author_name: current.author_name, kdp_description: current.kdp_description,
        chapters: current.chapters,
      });
      if (backupError) throw backupError;
      const { data: saved, error: saveError } = await supabase.from('ebook_projects').update({ chapters: corrected as never })
        .eq('id', book.id).eq('user_id', auth.user.id).eq('chapters', JSON.stringify(current.chapters)).select('id');
      if (saveError) throw saveError;
      if (!saved?.length) throw new Error('Le manuscrit a changé : aucune correction appliquée. Rechargez le livre.');
      setSource(corrected); setChapters(corrected.map(c => ({ title: String(c.title || c.titre || ''), content: chapterText(c) })));
      setReport(null); setPatches([]); setSelected([]); onSaved?.();
      toast.success('Corrections enregistrées. Le manuscrit original est conservé dans les sauvegardes.');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Enregistrement impossible.'); }
    finally { setSaving(false); }
  };

  const issues = report?.categories?.[active] || [];

  return (
    <div className="mt-8 space-y-5">
      <div className="v3-card space-y-3">
        <h2 className="v3-serif text-2xl font-bold">Correction éditoriale</h2>
        <p className="text-sm text-[var(--v3-muted)]">
          Une relecture de directeur éditorial sur le livre entier : sujet, personnages, chronologie, lieux, événements,
          incohérences, répétitions, grammaire, ponctuation, typographie française et fluidité. Les corrections sont soumises à votre validation.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--v3-muted)]">
            Livre
            <select disabled={busy} value={bookId} onChange={(e) => setBookId(e.target.value)} className="mt-1 w-full h-10 rounded-lg border border-black/10 px-3 text-sm normal-case tracking-normal font-normal text-[var(--v3-ink)]">
              <option value="">Choisir un livre…</option>
              {books.map((b) => <option key={b.id} value={b.id}>{b.title || 'Sans titre'}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--v3-muted)]">
            Sujet annoncé (facultatif)
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Ex. : guide pour débuter le jardinage bio" className="mt-1 w-full h-10 rounded-lg border border-black/10 px-3 text-sm normal-case tracking-normal font-normal text-[var(--v3-ink)]" />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={fetchBook} disabled={busy || !bookId} className="v3-btn v3-btn-outline">
            {fetching ? <><Loader2 className="w-4 h-4 animate-spin" /> Chargement du livre…</> : <><BookOpen className="w-4 h-4" /> {chapters.length ? 'Recharger le livre' : 'Récupérer ce livre'}</>}
          </Button>
          {chapters.length > 0 && (
            <>
              <span className="text-xs text-[var(--v3-muted)]">
                {chapters.length} chapitre(s) · {signs.toLocaleString('fr-FR')} signes chargés
              </span>
              <Button disabled={busy} onClick={() => { setChapters([]); setSource([]); setReport(null); setPatches([]); }} className="v3-btn v3-btn-ghost text-xs"><RefreshCw className="w-3.5 h-3.5" /> Vider</Button>
            </>
          )}
        </div>

        <Button onClick={run} disabled={busy || !chapters.length} className="v3-btn v3-btn-primary">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyse du livre… (1 à 2 minutes)</> : <><ScanSearch className="w-4 h-4" /> Lancer la correction éditoriale</>}
        </Button>
        {!chapters.length && (
          <p className="text-xs text-[var(--v3-muted)]">
            Choisissez un livre puis cliquez sur « Récupérer ce livre » : son texte est chargé ici avant l'analyse.
          </p>
        )}
      </div>

      {patches.length > 0 && (
        <section className="space-y-4 border-t border-border pt-5" aria-label="Corrections à valider">
          <h3 className="text-xl font-semibold">Corrections à valider</h3>
          {patches.map((patch, i) => (
            <div key={i} className="border-b border-border pb-4 space-y-3">
              <label className="flex gap-2 items-start text-sm font-semibold">
                <input type="checkbox" disabled={busy} checked={selected.includes(i)} onChange={e => setSelected(ids => e.target.checked ? [...ids, i] : ids.filter(id => id !== i))} />
                Chapitre {patch.chapitre} : {patch.raison || 'Correction proposée'}
              </label>
              <div className="grid gap-4 md:grid-cols-2 text-sm leading-relaxed">
                <div className="min-w-0"><p className="font-semibold mb-1">Avant</p><p className="whitespace-pre-wrap break-words text-muted-foreground">{patch.extrait}</p></div>
                <div className="min-w-0"><p className="font-semibold mb-1">Après</p><p className="whitespace-pre-wrap break-words">{patch.remplacement}</p></div>
              </div>
            </div>
          ))}
          <Button disabled={busy || !selected.length} onClick={() => void apply()}><Save className="mr-2 h-4 w-4" />{saving ? 'Enregistrement…' : 'Appliquer les corrections suggérées'} ({selected.length})</Button>
          <p className="text-sm text-muted-foreground">Le manuscrit original sera sauvegardé avant toute modification.</p>
        </section>
      )}
      {report && (
        <div className="v3-card space-y-4">
          <div className="flex flex-wrap items-baseline gap-3">
            {report.score != null && <span className="text-3xl font-bold text-[var(--v3-orange)]">{report.score}/100</span>}
            <p className="text-sm flex-1">{report.synthese}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 border-y border-border py-4">
            <select aria-label="Chapitres à corriger" value={scope} disabled={busy} onChange={e => setScope(e.target.value)} className="max-w-full rounded-md border border-border bg-background text-foreground px-3 py-2 text-sm">
              <option value="all">Tout le livre</option>
              {chapters.map((c, i) => <option key={i} value={i + 1}>Chapitre {i + 1} : {c.title}</option>)}
            </select>
            <Button disabled={busy} onClick={() => void prepare()}><Wand2 className="mr-2 h-4 w-4" />{preparing ? 'Préparation des corrections…' : 'Préparer les corrections suggérées'}</Button>
            <p className="w-full text-sm text-muted-foreground">Relisez les remplacements avant de les valider. Les corrections complexes peuvent nécessiter votre décision.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {LABELS.map(([key, label]) => {
              const n = report.categories?.[key]?.length || 0;
              return (
                <Button key={key} onClick={() => setActive(key)} className={`v3-btn text-xs ${active === key ? 'v3-btn-primary' : 'v3-btn-outline'}`}>
                  {label} <span className="ml-1 font-bold">{n}</span>
                </Button>
              );
            })}
          </div>
          {issues.length === 0 ? (
            <p className="flex items-center gap-2 text-sm text-[var(--v3-muted)]"><CheckCircle2 className="w-4 h-4" /> Aucun problème relevé dans cette catégorie.</p>
          ) : (
            <ul className="space-y-3">
              {issues.map((it, i) => (
                <li key={i} className="rounded-lg border border-black/10 p-3 text-sm">
                  {it.chapitre ? <div className="text-xs font-bold text-[var(--v3-orange)]">Chapitre {it.chapitre}</div> : null}
                  {it.extrait && <blockquote className="mt-1 border-l-2 border-[var(--v3-orange)] pl-2 italic text-[var(--v3-muted)]">« {it.extrait} »</blockquote>}
                  {it.probleme && <p className="mt-1"><strong>Problème :</strong> {it.probleme}</p>}
                  {it.suggestion && <p className="mt-1"><strong>Suggestion :</strong> {it.suggestion}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
