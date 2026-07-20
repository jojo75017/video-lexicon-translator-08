import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, Settings, Headphones, AlertCircle, RefreshCw, ImageIcon, Loader2, Trash2, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AudiobookOfferCard from '@/components/v3public/AudiobookOfferCard';
import { toast } from 'sonner';

type Row = {
  id: string;
  title: string;
  author_name?: string | null;
  kdp_categories?: string | null;
  updated_at: string;
  chapters?: any[] | null;
  ebook_images?: any[] | null;
};

const PROJECT_ID_KEY = 'v3_wizard_project_id';
const WORKFLOW_RESULTS_KEY = 'ebook_workflow_results';

export default function V3LibraryPage() {
  const nav = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [audioModal, setAudioModal] = useState<{ id: string; title: string } | null>(null);
  const [dedup, setDedup] = useState<boolean>(() => localStorage.getItem('v3_lib_dedup') !== '0');
  const [rawRows, setRawRows] = useState<Row[]>([]);

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) { nav('/v3/auth'); return; }
      setEmail(auth.user.email || null);
      const { data } = await supabase
        .from('ebook_projects')
        .select('id,title,author_name,kdp_categories,updated_at,chapters,ebook_images')
        .eq('user_id', auth.user.id)
        .order('updated_at', { ascending: false });
      setRawRows((data as Row[]) || []);
      setLoading(false);
    })();
  }, [nav, refreshTick]);

  useEffect(() => { localStorage.setItem('v3_lib_dedup', dedup ? '1' : '0'); }, [dedup]);

  const rows = useMemo(() => {
    if (!dedup) return rawRows;
    // Dedup by normalized title: keep the "best" (most chapters, else most recent)
    const groups = new Map<string, Row[]>();
    for (const r of rawRows) {
      const key = (r.title || '').trim().toLowerCase().replace(/\s+/g, ' ') || r.id;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(r);
    }
    const kept: Row[] = [];
    for (const list of groups.values()) {
      list.sort((a, b) => {
        const ca = Array.isArray(a.chapters) ? a.chapters.length : 0;
        const cb = Array.isArray(b.chapters) ? b.chapters.length : 0;
        if (cb !== ca) return cb - ca;
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
      kept.push(list[0]);
    }
    kept.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    return kept;
  }, [rawRows, dedup]);

  const duplicateCount = rawRows.length - rows.length;

  const cleanupDuplicates = async () => {
    if (!confirm(`Supprimer définitivement ${duplicateCount} doublon(s) ? Le meilleur exemplaire de chaque titre est conservé.`)) return;
    const keepIds = new Set(rows.map((r) => r.id));
    const toDelete = rawRows.filter((r) => !keepIds.has(r.id)).map((r) => r.id);
    if (toDelete.length === 0) return;
    const { error } = await supabase.from('ebook_projects').delete().in('id', toDelete);
    if (error) { toast.error(error.message); return; }
    toast.success(`${toDelete.length} doublon(s) supprimé(s).`);
    setRefreshTick((t) => t + 1);
  };

  const deleteOne = async (id: string) => {
    if (!confirm('Supprimer ce livre définitivement ?')) return;
    const { error } = await supabase.from('ebook_projects').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Livre supprimé.');
    setRefreshTick((t) => t + 1);
  };

  // Detect unsaved local workflow work
  const localUnsaved = useMemo(() => {
    try {
      const raw = localStorage.getItem(WORKFLOW_RESULTS_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const chapters = parsed?.chapters || parsed?.book?.chapters || [];
      if (!Array.isArray(chapters) || chapters.length === 0) return null;
      const localProjectId = localStorage.getItem(PROJECT_ID_KEY);
      const cloudMatch = rows.find((r) => r.id === localProjectId);
      const cloudHasChapters = Array.isArray(cloudMatch?.chapters) && (cloudMatch!.chapters!.length || 0) > 0;
      if (cloudHasChapters) return null;
      return { chapters: chapters.length, title: parsed?.title || parsed?.book?.title || 'Livre en attente' };
    } catch { return null; }
  }, [rows]);

  const started = rows.filter((r) => !r.chapters || (Array.isArray(r.chapters) && r.chapters.length === 0));
  const done = rows.filter((r) => Array.isArray(r.chapters) && r.chapters.length > 0);

  return (
    <section className="max-w-6xl mx-auto px-5 md:px-8 py-14">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="v3-serif text-4xl font-bold">Ma bibliothèque</h1>
          <p className="text-sm text-[var(--v3-muted)] mt-1">{email}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setDedup((v) => !v)}
            className={`v3-btn ${dedup ? 'v3-btn-primary' : 'v3-btn-outline'}`}
            title="Regrouper automatiquement les livres portant le même titre"
          >
            <Filter className="w-4 h-4" /> {dedup ? 'Doublons masqués' : 'Afficher tout'}
          </button>
          {duplicateCount > 0 && (
            <button onClick={cleanupDuplicates} className="v3-btn v3-btn-outline text-red-600 border-red-300 hover:bg-red-50" title="Supprimer les doublons">
              <Trash2 className="w-4 h-4" /> Nettoyer {duplicateCount} doublon{duplicateCount > 1 ? 's' : ''}
            </button>
          )}
          <button onClick={() => setRefreshTick((t) => t + 1)} className="v3-btn v3-btn-outline" title="Rafraîchir">
            <RefreshCw className="w-4 h-4" /> Rafraîchir
          </button>
          <Link to="/v3/parametres" className="v3-btn v3-btn-outline"><Settings className="w-4 h-4" /> Paramètres</Link>
          <Link to="/v3/create" className="v3-btn v3-btn-primary"><Sparkles className="w-4 h-4" /> Nouveau livre</Link>
        </div>
      </div>

      {localUnsaved && (
        <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
          <div className="flex-1">
            <div className="font-bold text-amber-900">Livre non sauvegardé détecté</div>
            <div className="text-sm text-amber-800 mt-0.5">
              « {localUnsaved.title} » — {localUnsaved.chapters} chapitres générés dans le workflow n'ont pas été sauvegardés dans le cloud.
            </div>
            <Link to="/v3/create" className="inline-flex items-center gap-2 mt-3 v3-btn v3-btn-primary text-sm">
              Reprendre et sauvegarder
            </Link>
          </div>
        </div>
      )}

      {loading ? (
        <div className="mt-12 text-center text-[var(--v3-muted)]">Chargement…</div>
      ) : rows.length === 0 ? (
        <div className="v3-card mt-10 text-center py-16">
          <BookOpen className="w-10 h-10 text-[var(--v3-orange)] mx-auto" />
          <h2 className="v3-serif text-2xl font-bold mt-4">Ta bibliothèque est vide</h2>
          <p className="text-sm text-[var(--v3-muted)] mt-2">Écris ton premier livre en quelques minutes.</p>
          <button onClick={() => nav('/v3/create')} className="v3-btn v3-btn-primary mt-6">Commencer</button>
        </div>
      ) : (
        <>
          {done.length > 0 && (
            <div className="mt-10">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-lg font-bold">Terminés <span className="text-sm font-normal text-[var(--v3-muted)]">· {done.length}</span></h2>
                <span className="text-xs text-[var(--v3-muted)]">Chaque livre peut être converti en audio (option 9,99 €)</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {done.map((r) => <BookCard key={r.id} r={r} done onAudio={() => setAudioModal({ id: r.id, title: r.title })} onUpdated={() => setRefreshTick((t) => t + 1)} onDelete={() => deleteOne(r.id)} />)}
              </div>
            </div>
          )}
          {started.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-bold mb-4">En cours <span className="text-sm font-normal text-[var(--v3-muted)]">· {started.length}</span></h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {started.map((r) => <BookCard key={r.id} r={r} onAudio={() => setAudioModal({ id: r.id, title: r.title })} onUpdated={() => setRefreshTick((t) => t + 1)} onDelete={() => deleteOne(r.id)} />)}
              </div>
            </div>
          )}
        </>
      )}

      {audioModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={() => setAudioModal(null)}>
          <div className="max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <AudiobookOfferCard bookId={audioModal.id} bookTitle={audioModal.title} />
            <div className="text-center mt-3">
              <button onClick={() => setAudioModal(null)} className="text-white/80 text-sm underline">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function BookCard({ r, done, onAudio, onUpdated, onDelete }: { r: Row; done?: boolean; onAudio: () => void; onUpdated: () => void; onDelete: () => void }) {
  const [cover, setCover] = useState<string | undefined>(
    (Array.isArray(r.ebook_images) && r.ebook_images[0]?.url) || undefined,
  );
  const [genLoading, setGenLoading] = useState(false);
  const nbChap = Array.isArray(r.chapters) ? r.chapters.length : 0;
  const date = new Date(r.updated_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  const author = (r.author_name || '').trim() || 'Auteur Ebookstudio';

  const generateCover = async () => {
    if (genLoading) return;
    setGenLoading(true);
    try {
      const openaiApiKey = (typeof localStorage !== 'undefined' && localStorage.getItem('openai_real_api_key')) || undefined;
      const { data, error } = await supabase.functions.invoke('generate-front-cover', {
        body: {
          ebookTitle: r.title,
          authorName: author,
          genre: r.kdp_categories || 'fiction',
          style: 'professional',
          variation: 1,
          coverType: 'front',
          useOpenAI: !!openaiApiKey,
          openaiApiKey,
        },
      });
      if (error || !(data as any)?.imageUrl) throw new Error((error as any)?.message || 'Génération échouée');
      const imageUrl = (data as any).imageUrl as string;
      const newImages = [{ type: 'front_cover', url: imageUrl, title: r.title }];
      const { error: upErr } = await supabase
        .from('ebook_projects')
        .update({ ebook_images: newImages as any, cover_concepts: imageUrl } as any)
        .eq('id', r.id);
      if (upErr) throw upErr;
      setCover(imageUrl);
      toast.success('Couverture générée et sauvegardée.');
      onUpdated();
    } catch (e: any) {
      toast.error(e?.message || 'Impossible de générer la couverture.');
    } finally {
      setGenLoading(false);
    }
  };

  return (
    <div className="group flex flex-col">
      <Link to={`/v3/book/${r.id}`} className="block">
        <div
          className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all border border-[color:var(--v3-orange)]/20"
          style={
            cover
              ? { backgroundImage: `url(${cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : {
                  background:
                    'linear-gradient(160deg, #2A1810 0%, #4A2818 45%, #6B3820 100%)',
                }
          }
        >
          {done && (
            <span className="absolute top-2 left-2 rounded-full bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 shadow z-10">
              Terminé
            </span>
          )}
          {!cover && (
            <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-amber-300/80">
                <BookOpen className="w-3 h-3" /> Ebookstudio
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="v3-serif text-[15px] font-bold leading-tight line-clamp-4 drop-shadow">
                    {r.title}
                  </div>
                  <div className="mt-2 mx-auto h-[2px] w-8 bg-amber-300/70 rounded" />
                </div>
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-200/90 text-center line-clamp-1">
                {author}
              </div>
            </div>
          )}
        </div>
      </Link>
      <div className="mt-2 flex-1">
        <Link to={`/v3/book/${r.id}`} className="block text-[13px] font-semibold leading-tight text-[var(--v3-ink)] line-clamp-2 hover:underline">
          {r.title}
        </Link>
        <div className="text-[11px] text-[var(--v3-muted)] mt-0.5">
          {nbChap > 0 ? `${nbChap} chap.` : 'Brouillon'} · {date}
        </div>
      </div>
      {!cover && (
        <button
          onClick={generateCover}
          disabled={genLoading}
          className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full border border-[color:var(--v3-orange)]/40 bg-[var(--v3-orange)] hover:bg-[var(--v3-orange-600)] text-[11px] font-bold text-white py-1.5 px-2 transition disabled:opacity-60"
          title="Générer une vraie couverture IA pour ce livre"
        >
          {genLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
          {genLoading ? 'Génération…' : 'Générer la couverture'}
        </button>
      )}
      <button
        onClick={onAudio}
        className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full border border-[color:var(--v3-orange)]/40 bg-[#FFF6E8] hover:bg-[#FFE9C7] text-[11px] font-bold text-[var(--v3-orange-600)] py-1.5 px-2 transition"
        title="Convertir ce livre en audiobook (option payante)"
      >
        <Headphones className="w-3.5 h-3.5" /> Audio · 9,99 €
      </button>
    </div>
  );
}
