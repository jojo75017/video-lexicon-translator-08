import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Palette, ArrowRight } from 'lucide-react';
import { WRITING_AMBIANCES } from '@/data/writingAmbiances';
import { BOOK_BRIEF_EVENT, readBookBrief, writeBookBrief } from '@/lib/v3/bookBrief';

/**
 * « Ambiance » — modifiable à tout moment, même après la génération du livre.
 * Ne change que l'apparence de l'écriture et du sommaire, jamais le texte.
 */
export default function V3AmbiancePicker({ compact = false }: { compact?: boolean }) {
  const [ambianceId, setAmbianceId] = useState('atelier');

  useEffect(() => {
    const sync = () => setAmbianceId(readBookBrief()?.ambianceId || 'atelier');
    sync();
    window.addEventListener(BOOK_BRIEF_EVENT, sync);
    return () => window.removeEventListener(BOOK_BRIEF_EVENT, sync);
  }, []);

  const choose = (id: string) => {
    setAmbianceId(id);
    writeBookBrief({ ...(readBookBrief() || {}), ambianceId: id });
  };

  const current = WRITING_AMBIANCES.find((a) => a.id === ambianceId) || WRITING_AMBIANCES[0];

  return (
    <details className="rounded-[22px] border p-3 md:p-4" style={{ borderColor: 'var(--v3-border)', background: '#fff' }}>
      <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2 text-[12px]" style={{ color: 'var(--v3-muted)' }}>
        <span className="inline-flex items-center gap-1.5">
          <Palette className="h-3.5 w-3.5" />
          Ambiance : <strong style={{ color: 'var(--v3-ink)' }}>{current?.name}</strong>
          <span className="flex gap-1">
            {[current?.palette.bg, current?.palette.accent, current?.palette.text].filter(Boolean).map((c, i) => (
              <span key={i} className="h-3 w-3 rounded-full border" style={{ background: c as string, borderColor: 'rgba(0,0,0,0.10)' }} />
            ))}
          </span>
        </span>
        <span className="underline">changer</span>
      </summary>

      <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
        <Link to="/ambiances" className="v3-btn v3-btn-ghost text-[11px]">
          Voir les 17 ambiances en grand <ArrowRight className="h-3 w-3" />
        </Link>
      </div>


      <div className={`mt-3 grid gap-2 ${compact ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}>
        {WRITING_AMBIANCES.map((amb) => {
          const active = amb.id === ambianceId;
          return (
            <button
              key={amb.id}
              type="button"
              onClick={() => choose(amb.id)}
              className="rounded-2xl border p-2 text-left transition hover:opacity-90"
              style={{
                borderColor: active ? 'var(--v3-gold, #c9a84c)' : 'rgba(0,0,0,0.10)',
                background: active ? 'rgba(201,168,76,0.08)' : '#fff',
              }}
            >
              <div className="flex gap-1">
                {[amb.palette.bg, amb.palette.surface, amb.palette.accent, amb.palette.text].map((c, i) => (
                  <span key={i} className="h-4 w-4 rounded-full border" style={{ background: c, borderColor: 'rgba(0,0,0,0.10)' }} />
                ))}
              </div>
              <div className="mt-1.5 text-[12px] font-semibold" style={{ color: 'var(--v3-ink)' }}>{amb.name}</div>
              <div className="text-[10.5px] leading-tight" style={{ color: 'var(--v3-muted)' }}>{amb.tagline}</div>
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-[11px]" style={{ color: 'var(--v3-muted)' }}>
        Vous pouvez changer d’ambiance quand vous voulez : cela ne modifie jamais le texte de votre livre.
      </p>
    </details>

  );
}
