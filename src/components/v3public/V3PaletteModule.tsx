import { useState } from 'react';
import { Palette, ChevronDown, ChevronUp } from 'lucide-react';

const GROUPS: Array<{ label: string; swatches: Array<{ name: string; token: string; value: string; dark?: boolean }> }> = [
  {
    label: 'Émeraude',
    swatches: [
      { name: 'Émeraude', token: '--v3-emerald', value: '#064e3b', dark: true },
      { name: 'Émeraude 600', token: '--v3-emerald-600', value: '#0d7a5f', dark: true },
      { name: 'Émeraude 50', token: '--v3-emerald-50', value: '#ecf5f1' },
    ],
  },
  {
    label: 'Or',
    swatches: [
      { name: 'Or', token: '--v3-gold', value: '#c9a84c' },
      { name: 'Or 600', token: '--v3-gold-600', value: '#b0902f' },
      { name: 'Or pâle', token: '--v3-gold-soft', value: '#f5f0e0' },
    ],
  },
  {
    label: 'Fonds',
    swatches: [
      { name: 'Papier', token: '--v3-paper', value: '#fbfaf6' },
      { name: 'Crème', token: '--v3-cream', value: '#f5f3ee' },
    ],
  },
  {
    label: 'Textes',
    swatches: [
      { name: 'Encre', token: '--v3-ink', value: '#0a1f18', dark: true },
      { name: 'Encre 2', token: '--v3-ink-2', value: '#1a2e26', dark: true },
      { name: 'Texte discret', token: '--v3-muted', value: '#5b6b64', dark: true },
    ],
  },
];

const BORDER = 'rgba(6, 78, 59, 0.10)';

/** Petit module « Couleurs V3 » : palette officielle, clic = copie du code. */
export default function V3PaletteModule() {
  const [open, setOpen] = useState(false);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      const { toast } = await import('sonner');
      toast.success(`${value} copié`);
    } catch { /* clipboard indisponible */ }
  };

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-10">
      <div className="rounded-2xl border p-4 md:p-5" style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-paper)' }}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-3"
        >
          <span className="flex items-center gap-2 text-[13px] font-bold" style={{ color: 'var(--v3-ink)' }}>
            <Palette className="w-4 h-4" style={{ color: 'var(--v3-gold)' }} />
            Couleurs V3 — « Émeraude Prestige »
          </span>
          <span className="flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--v3-muted)' }}>
            {open ? 'Masquer' : 'Voir la palette'}
            {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </span>
        </button>

        {open && (
          <div className="mt-4 space-y-4">
            {GROUPS.map((group) => (
              <div key={group.label}>
                <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--v3-muted)' }}>
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.swatches.map((s) => (
                    <button
                      key={s.token}
                      type="button"
                      onClick={() => copy(s.value)}
                      title={`${s.token} — cliquer pour copier`}
                      className="rounded-xl px-3 py-2 text-left transition hover:scale-[1.02]"
                      style={{ background: s.value, border: `1px solid ${BORDER}`, minWidth: 132 }}
                    >
                      <span className="block text-[11.5px] font-semibold" style={{ color: s.dark ? '#fff' : '#0a1f18' }}>
                        {s.name}
                      </span>
                      <span className="block text-[11px] font-mono" style={{ color: s.dark ? 'rgba(255,255,255,0.85)' : 'rgba(10,31,24,0.7)' }}>
                        {s.value}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--v3-muted)' }}>
                Filets / bordures
              </p>
              <button
                type="button"
                onClick={() => copy(BORDER)}
                className="rounded-xl px-3 py-2 text-left bg-white"
                style={{ border: `1px solid ${BORDER}`, minWidth: 220 }}
              >
                <span className="block text-[11.5px] font-semibold" style={{ color: 'var(--v3-ink)' }}>--v3-line / --v3-border</span>
                <span className="block text-[11px] font-mono" style={{ color: 'var(--v3-muted)' }}>{BORDER}</span>
              </button>
            </div>

            <p className="text-[11.5px]" style={{ color: 'var(--v3-muted)' }}>
              Typographie : Cormorant Garamond (titres) + Inter (texte). Cliquez sur une couleur pour copier son code.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
