import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, Settings, Headphones, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AudiobookOfferCard from '@/components/v3public/AudiobookOfferCard';

type Row = {
  id: string;
  title: string;
  updated_at: string;
  chapters?: any[] | null;
  ebook_images?: any[] | null;
};

const PROJECT_ID_KEY = 'v3_wizard_project_id';
const WORKFLOW_RESULTS_KEY = 'ebook_workflow_results';

export default function V3LibraryPage() {
  const nav = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [audioModal, setAudioModal] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) { nav('/v3/auth'); return; }
      setEmail(auth.user.email || null);
      const { data } = await supabase
        .from('ebook_projects')
        .select('id,title,updated_at,chapters,ebook_images')
        .eq('user_id', auth.user.id)
        .order('updated_at', { ascending: false });
      setRows((data as Row[]) || []);
      setLoading(false);
    })();
  }, [nav, refreshTick]);

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
        <div className="flex gap-2">
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
                {done.map((r) => <BookCard key={r.id} r={r} done onAudio={() => setAudioModal({ id: r.id, title: r.title })} />)}
              </div>
            </div>
          )}
          {started.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-bold mb-4">En cours <span className="text-sm font-normal text-[var(--v3-muted)]">· {started.length}</span></h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {started.map((r) => <BookCard key={r.id} r={r} onAudio={() => setAudioModal({ id: r.id, title: r.title })} />)}
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

function BookCard({ r, done, onAudio }: { r: Row; done?: boolean; onAudio: () => void }) {
  const cover = (Array.isArray(r.ebook_images) && r.ebook_images[0]?.url) || undefined;
  const nbChap = Array.isArray(r.chapters) ? r.chapters.length : 0;
  const date = new Date(r.updated_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  return (
    <div className="group flex flex-col">
      <Link to={`/v3/book/${r.id}`} className="block">
        <div
          className="relative aspect-[3/4] rounded-xl overflow-hidden p-4 flex flex-col justify-end shadow-md group-hover:shadow-xl transition-all border border-[color:var(--v3-orange)]/20"
          style={
            cover
              ? { backgroundImage: `url(${cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : { background: 'linear-gradient(160deg, #FFF6E8 0%, #FFE3B8 55%, #F5B871 100%)' }
          }
        >
          {done && (
            <span className="absolute top-2 left-2 rounded-full bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 shadow">
              Terminé
            </span>
          )}
          {!cover && (
            <>
              <BookOpen className="w-5 h-5 text-[var(--v3-ink)]/60 mb-2" />
              <div className="text-[13px] font-bold leading-tight line-clamp-3 text-[var(--v3-ink)]">
                {r.title}
              </div>
            </>
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
