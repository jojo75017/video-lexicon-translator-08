import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, History, RotateCcw, Save, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  clearBookBrief,
  clearTitleHistory,
  pushTitleHistory,
  readBookBrief,
  readTitleHistory,
  removeTitleFromHistory,
  writeBookBrief,
  type TitleHistoryEntry,
} from '@/lib/v3/bookBrief';

/**
 * Point de départ de l'accueil V3 : on saisit un titre, on est redirigé
 * vers /v3/create avec la fiche déjà préremplie.
 */
export default function V3StartBookBar() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [currentTitle, setCurrentTitle] = useState<string>('');
  const [history, setHistory] = useState<TitleHistoryEntry[]>([]);

  useEffect(() => {
    const brief = readBookBrief();
    const t = (brief?.title || '').trim();
    setCurrentTitle(t);
    setTitle(t);
    setHistory(readTitleHistory());
  }, []);

  const save = () => {
    const clean = title.trim();
    if (!clean) return;
    const brief = readBookBrief() || {};
    writeBookBrief({ ...brief, title: clean });
    setCurrentTitle(clean);
    setHistory(pushTitleHistory(clean));
    toast.success('Titre sauvegardé', { description: clean });
  };

  const erase = () => {
    clearBookBrief();
    setTitle('');
    setCurrentTitle('');
    toast.success('Fiche du livre effacée', { description: 'Vous pouvez saisir un nouveau titre.' });
  };

  const restore = (entry: TitleHistoryEntry) => {
    const brief = readBookBrief() || {};
    writeBookBrief({ ...brief, title: entry.title });
    setTitle(entry.title);
    setCurrentTitle(entry.title);
    setHistory(pushTitleHistory(entry.title));
    toast.success('Titre restauré', { description: entry.title });
  };

  const start = () => {
    const clean = title.trim();
    if (!clean) return;
    const brief = readBookBrief() || {};
    writeBookBrief({ ...brief, title: clean });
    pushTitleHistory(clean);
    navigate('/v3/create');
  };


  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 pt-10">
      <div
        className="rounded-[28px] border p-6 md:p-8"
        style={{
          borderColor: 'rgba(201,168,76,0.45)',
          background: 'linear-gradient(135deg, #ffffff 0%, var(--v3-paper) 60%, #f7f2e2 100%)',
          boxShadow: '0 24px 50px -34px rgba(6,78,59,0.35)',
        }}
      >
        <span className="v3-chip v3-chip-gold">
          <BookOpen className="w-3.5 h-3.5" /> Commencez votre livre
        </span>

        <h2 className="v3-serif text-2xl md:text-3xl font-bold mt-3" style={{ color: 'var(--v3-ink)' }}>
          Quel est le titre de votre livre&nbsp;?
        </h2>
        <p className="mt-1.5 text-[13.5px]" style={{ color: 'var(--v3-muted)' }}>
          Donnez un titre — vous serez redirigé vers la fiche du livre pour compléter les informations.
        </p>

        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') start(); }}
            placeholder="Ex : Les petites victoires de Jules"
            aria-label="Titre du livre"
            className="flex-1 rounded-xl border px-4 py-3.5 text-[16px] outline-none focus:ring-2"
            style={{
              borderColor: 'rgba(201,168,76,0.6)',
              background: '#fff',
              color: 'var(--v3-ink)',
            }}
          />
          <button
            type="button"
            onClick={start}
            disabled={!title.trim()}
            className="v3-btn v3-btn-gold text-[14px] px-6 py-3.5 whitespace-nowrap disabled:opacity-45 disabled:cursor-not-allowed"
          >
            Continuer <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={save}
            disabled={!title.trim()}
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-[13px] font-semibold disabled:opacity-45 disabled:cursor-not-allowed"
            style={{ borderColor: 'rgba(6,78,59,0.3)', color: 'var(--v3-emerald)', background: '#fff' }}
          >
            <Save className="w-3.5 h-3.5" /> Sauvegarder
          </button>
          <button
            type="button"
            onClick={erase}
            disabled={!title.trim() && !currentTitle}
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-[13px] font-semibold disabled:opacity-45 disabled:cursor-not-allowed"
            style={{ borderColor: 'rgba(190,60,60,0.35)', color: '#b23b3b', background: '#fff' }}
          >
            <Trash2 className="w-3.5 h-3.5" /> Effacer
          </button>
        </div>

        {!title.trim() && (
          <p className="mt-2 text-[12px]" style={{ color: 'var(--v3-muted)' }}>
            Donnez d’abord un titre — vous pourrez le modifier ensuite.
          </p>
        )}

        {currentTitle && (
          <button
            type="button"
            onClick={() => navigate('/v3/create')}
            className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold"
            style={{ color: 'var(--v3-emerald)' }}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reprendre : <em className="v3-serif">{currentTitle}</em>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </section>
  );
}
