import React, { useCallback, useEffect, useState } from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

// Palette « Clair Ambre »
const AMBER = '#E8951E';
const AMBER_DEEP = '#C97A14';
const INK = '#2A2118';

export const EDITORIAL_CONTROL_KEY = 'edition_editorial_control_v1';

export interface EditorialControl {
  tone: string;
  style: string;
  persona: string;
  structure: string;
}

const DEFAULT_CONTROL: EditorialControl = {
  tone: 'expert',
  style: 'concret',
  persona: '',
  structure: 'lineaire',
};

const TONES = [
  { id: 'chaleureux', label: 'Chaleureux' },
  { id: 'expert', label: 'Expert' },
  { id: 'narratif', label: 'Narratif' },
  { id: 'direct', label: 'Direct' },
];

const STYLES = [
  { id: 'concret', label: 'Concret / exemples' },
  { id: 'academique', label: 'Académique' },
  { id: 'storytelling', label: 'Storytelling' },
];

const STRUCTURES = [
  { id: 'lineaire', label: 'Linéaire' },
  { id: 'thematique', label: 'Thématique' },
  { id: 'probleme-solution', label: 'Problème → Solution' },
];

export function readEditorialControl(): EditorialControl {
  try {
    const raw = localStorage.getItem(EDITORIAL_CONTROL_KEY);
    if (!raw) return { ...DEFAULT_CONTROL };
    return { ...DEFAULT_CONTROL, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_CONTROL };
  }
}

/** Contrôle éditorial avancé (V4) : ton, style, persona lecteur, structure narrative. */
export const EditorialControlPanel: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [control, setControl] = useState<EditorialControl>(() => readEditorialControl());

  useEffect(() => {
    try { localStorage.setItem(EDITORIAL_CONTROL_KEY, JSON.stringify(control)); } catch { /* ignore */ }
    try { window.dispatchEvent(new Event('edition_editorial_control_updated')); } catch { /* ignore */ }
  }, [control]);

  const update = useCallback((patch: Partial<EditorialControl>) => {
    setControl((prev) => ({ ...prev, ...patch }));
  }, []);

  const toneLabel = TONES.find((t) => t.id === control.tone)?.label ?? '—';
  const styleLabel = STYLES.find((s) => s.id === control.style)?.label ?? '—';

  const Chip = ({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-3 py-1.5 text-[12px] font-bold transition-colors border"
      style={{
        background: active ? AMBER : '#fff',
        color: active ? '#fff' : '#8a7860',
        borderColor: active ? AMBER : '#eadfc9',
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="rounded-2xl border" style={{ borderColor: '#eadfc9', background: '#fff' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <SlidersHorizontal className="h-4 w-4" style={{ color: AMBER_DEEP }} />
        <span className="text-sm font-bold" style={{ color: INK }}>Contrôle éditorial avancé</span>
        <span className="text-[11px] truncate" style={{ color: '#a18a6c' }}>
          Ton {toneLabel} · Style {styleLabel}
        </span>
        <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} style={{ color: AMBER_DEEP }} />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4">
          <div>
            <div className="text-[12px] font-bold mb-1.5" style={{ color: INK }}>Ton</div>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <Chip key={t.id} active={control.tone === t.id} label={t.label} onClick={() => update({ tone: t.id })} />
              ))}
            </div>
          </div>

          <div>
            <div className="text-[12px] font-bold mb-1.5" style={{ color: INK }}>Style d'écriture</div>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <Chip key={s.id} active={control.style === s.id} label={s.label} onClick={() => update({ style: s.id })} />
              ))}
            </div>
          </div>

          <div>
            <div className="text-[12px] font-bold mb-1.5" style={{ color: INK }}>Structure narrative</div>
            <div className="flex flex-wrap gap-2">
              {STRUCTURES.map((s) => (
                <Chip key={s.id} active={control.structure === s.id} label={s.label} onClick={() => update({ structure: s.id })} />
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="editorial-persona" className="block text-[12px] font-bold mb-1.5" style={{ color: INK }}>
              Persona lecteur
            </label>
            <textarea
              id="editorial-persona"
              value={control.persona}
              onChange={(e) => update({ persona: e.target.value })}
              placeholder="À qui s'adresse ce livre ? (ex : parents débordés cherchant des routines simples)"
              rows={2}
              className="w-full rounded-lg border px-3 py-2 text-[13px] outline-none resize-none"
              style={{ borderColor: '#eadfc9', color: INK, background: '#FCF8F0' }}
            />
          </div>

          <p className="text-[11px]" style={{ color: '#a18a6c' }}>
            Ces réglages cadrent les agents de rédaction et de ton (voix d'auteur, adaptation du ton).
          </p>
        </div>
      )}
    </div>
  );
};

export default EditorialControlPanel;
