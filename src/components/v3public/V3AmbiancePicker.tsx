import { Link } from 'react-router-dom';
import { Palette, ArrowRight, Check } from 'lucide-react';
import { useAmbiance } from '@/hooks/useAmbiance';

/**
 * « Ambiance » — modifiable à tout moment, même après la génération du livre.
 * Ne change que l'apparence de l'écriture et du sommaire, jamais le texte.
 */
export default function V3AmbiancePicker({ compact = false }: { compact?: boolean }) {
  const { ambianceId, ambiance, setAmbiance, ambiances } = useAmbiance();

  return (
    <details className="rounded-[22px] border p-3 md:p-4" style={{ borderColor: 'var(--v3-border)', background: '#fff' }}>
      <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2 text-[12px]" style={{ color: 'var(--v3-muted)' }}>
        <span className="inline-flex items-center gap-1.5">
          <Palette className="h-3.5 w-3.5" />
          Ambiance : <strong style={{ color: 'var(--v3-ink)' }}>{ambiance.name}</strong>
          <span className="flex gap-1">
            {[ambiance.palette.bg, ambiance.palette.accent, ambiance.palette.text].map((c, i) => (
              <span key={i} className="h-3 w-3 rounded-full border" style={{ background: c, borderColor: 'rgba(0,0,0,0.10)' }} />
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
        {ambiances.map((amb) => {
          const active = amb.id === ambianceId;
          return (
            <button
              key={amb.id}
              type="button"
              onClick={() => setAmbiance(amb.id)}
              aria-pressed={active}
              className="relative overflow-hidden rounded-2xl border text-left transition hover:-translate-y-0.5"
              style={{
                borderColor: active ? amb.palette.accent : 'rgba(0,0,0,0.10)',
                boxShadow: active ? `0 0 0 2px ${amb.palette.accent}33` : 'none',
              }}
            >
              {/* Aperçu réel : fond, titre en couleur d'accent, typographie de l'ambiance */}
              <div
                className="px-3 py-4"
                style={{ background: amb.palette.bg, color: amb.palette.text }}
              >
                <div
                  className="text-lg leading-tight"
                  style={{ fontFamily: `'${amb.fonts.headingFamily}', Georgia, serif`, color: amb.palette.accent }}
                >
                  {amb.name}
                </div>
                <div className="mt-1 flex gap-1">
                  {[amb.palette.surface, amb.palette.surfaceAlt, amb.palette.accent, amb.palette.text].map((c, i) => (
                    <span key={i} className="h-3.5 w-3.5 rounded-full border" style={{ background: c, borderColor: 'rgba(0,0,0,0.15)' }} />
                  ))}
                </div>
              </div>
              <div
                className="px-3 py-1.5 text-[10.5px] leading-tight"
                style={{ background: amb.palette.surfaceAlt, color: amb.palette.textMuted }}
              >
                {amb.tagline}
              </div>
              {active && (
                <span
                  className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full"
                  style={{ background: amb.palette.accent, color: amb.palette.accentText }}
                >
                  <Check className="h-3 w-3" />
                </span>
              )}
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
