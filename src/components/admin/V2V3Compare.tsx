import React from 'react';
import { Check, X, Sparkles } from 'lucide-react';
import { V3_MODULES, V2_PRICE, V3_PRICE } from '@/data/roadmapV3';

const GREEN = '#10B981';
const GREEN_LIGHT = '#6ee7b7';
const GOLD = '#c9a84c';
const GOLD_LIGHT = '#f0d78c';

const V2_AGENTS = 15;
const V3_AGENTS = 30;

// Lignes du tableau comparatif (label, V2, V3). null = absent, string = détail.
const ROWS: { label: string; v2: string | false; v3: string | true }[] = [
  { label: 'Agents IA de rédaction', v2: `${V2_AGENTS} agents`, v3: `${V3_AGENTS} agents` },
  { label: 'Création de livres', v2: 'Manuelle + IA', v3: '8 sources d’import' },
  { label: 'Studio couverture KDP', v2: 'Basique', v3: 'Pro (dos + 4e + bleed)' },
  { label: 'Pack KDP prêt à uploader', v2: false, v3: true },
  { label: 'Tracker de ventes & royalties', v2: false, v3: true },
  { label: 'Auto-pricing IA', v2: false, v3: true },
  { label: 'Optimiseur d’annonces KDP', v2: false, v3: true },
  { label: 'Séquence de lancement J-7', v2: false, v3: true },
  { label: 'Audiobook professionnel', v2: 'Limité', v3: 'Complet' },
  { label: 'Modules premium inclus', v2: '—', v3: `${V3_MODULES.length} modules` },
];

function Cell({ value, tone }: { value: string | boolean; tone: 'green' | 'gold' }) {
  const color = tone === 'green' ? GREEN_LIGHT : GOLD_LIGHT;
  if (value === true) return <Check className="mx-auto h-5 w-5" style={{ color }} />;
  if (value === false) return <X className="mx-auto h-5 w-5 text-white/25" />;
  return <span className="text-sm font-medium" style={{ color }}>{value}</span>;
}

export default function V2V3Compare() {
  return (
    <section className="mt-12">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-black"
          style={{ background: `linear-gradient(90deg, ${GREEN_LIGHT}, #ffffff 50%, ${GOLD})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
          V2 vs V3 — ce que vous gagnez
        </h2>
        <p className="mt-2 text-sm text-white/50">Comparez en un coup d’œil. Le passage à V3 décuple votre puissance.</p>
      </div>

      {/* Tableau comparatif */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#161616]">
        {/* En-têtes */}
        <div className="grid grid-cols-[1.4fr_1fr_1fr]">
          <div className="px-4 py-4" />
          <div className="px-4 py-4 text-center" style={{ background: `${GREEN}14`, borderBottom: `2px solid ${GREEN}` }}>
            <div className="text-xs uppercase tracking-widest text-white/50">Actuel</div>
            <div className="text-lg font-black" style={{ color: GREEN_LIGHT }}>V2</div>
            <div className="text-xs font-bold text-white/60">{V2_PRICE}€ à vie</div>
          </div>
          <div className="px-4 py-4 text-center" style={{ background: `${GOLD}18`, borderBottom: `2px solid ${GOLD}` }}>
            <div className="text-xs uppercase tracking-widest text-white/50 flex items-center justify-center gap-1">
              <Sparkles className="h-3 w-3" /> Nouveau
            </div>
            <div className="text-lg font-black" style={{ color: GOLD_LIGHT }}>V3</div>
            <div className="text-xs font-bold text-white/60">{V3_PRICE}€ à vie</div>
          </div>
        </div>

        {/* Lignes */}
        {ROWS.map((row, i) => (
          <div key={row.label} className="grid grid-cols-[1.4fr_1fr_1fr] items-center"
            style={{ background: i % 2 ? 'transparent' : '#ffffff05' }}>
            <div className="px-4 py-3 text-sm text-white/80">{row.label}</div>
            <div className="px-4 py-3 text-center" style={{ background: `${GREEN}0a` }}><Cell value={row.v2} tone="green" /></div>
            <div className="px-4 py-3 text-center" style={{ background: `${GOLD}0d` }}><Cell value={row.v3} tone="gold" /></div>
          </div>
        ))}
      </div>

      {/* Encarts agents gauche (V2 vert) / droite (V3 doré) */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border p-6 text-center"
          style={{ borderColor: `${GREEN}55`, background: `linear-gradient(135deg, ${GREEN}1a, transparent)`, boxShadow: `0 0 30px -12px ${GREEN}` }}>
          <div className="text-xs uppercase tracking-widest text-white/50 mb-1">V2 — actuel</div>
          <div className="text-5xl font-black" style={{ color: GREEN_LIGHT }}>{V2_AGENTS}</div>
          <div className="mt-1 text-sm font-semibold" style={{ color: GREEN_LIGHT }}>agents IA</div>
        </div>
        <div className="relative rounded-2xl border p-6 text-center overflow-hidden"
          style={{ borderColor: GOLD, background: `linear-gradient(135deg, ${GOLD}26, transparent)`, boxShadow: `0 0 36px -10px ${GOLD}` }}>
          <span className="pointer-events-none absolute -inset-2 animate-pulse"
            style={{ background: `radial-gradient(60% 60% at 50% 0%, ${GOLD}22, transparent 70%)` }} aria-hidden />
          <div className="relative text-xs uppercase tracking-widest text-white/50 mb-1 flex items-center justify-center gap-1">
            <Sparkles className="h-3 w-3" /> V3 — nouveau
          </div>
          <div className="relative text-5xl font-black" style={{ color: GOLD_LIGHT }}>{V3_AGENTS}</div>
          <div className="relative mt-1 text-sm font-semibold" style={{ color: GOLD_LIGHT }}>agents IA</div>
          <div className="relative mt-2 inline-block rounded-full px-3 py-0.5 text-[11px] font-extrabold"
            style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`, color: '#1a1a1a' }}>
            ×2 plus puissant
          </div>
        </div>
      </div>
    </section>
  );
}
