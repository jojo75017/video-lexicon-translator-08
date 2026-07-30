import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, RotateCcw } from 'lucide-react';
import { readBookBrief, writeBookBrief } from '@/lib/v3/bookBrief';

/**
 * Point de départ de l'accueil V3 : on saisit un titre, on est redirigé
 * vers /v3/create avec la fiche déjà préremplie.
 */
export default function V3StartBookBar() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [currentTitle, setCurrentTitle] = useState<string>('');

  useEffect(() => {
    const brief = readBookBrief();
    setCurrentTitle((brief?.title || '').trim());
  }, []);

  const start = () => {
    const clean = title.trim();
    if (!clean) return;
    const brief = readBookBrief() || {};
    writeBookBrief({ ...brief, title: clean });
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
