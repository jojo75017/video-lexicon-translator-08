import React from 'react';
import { Check, X, Sparkles, Crown } from 'lucide-react';
import { V3_MODULES, V2_PRICE, V3_PRICE, V3_FULL_PACK } from '@/data/roadmapV3';

const AMBER = '#E8951E';
const AMBER_DEEP = '#B36A12';
const GREEN = '#0F8A5F';
const GREEN_DEEP = '#0B6E4C';
const ROYAL = '#7A4DD6';
const ROYAL_DEEP = '#5B33B0';
const INK = '#2A2118';
const SERIF = "'Georgia', 'Times New Roman', serif";

const V2_AGENTS = 15;
const V3_AGENTS = 22;
const V3_PREMIUM_AGENTS = 30;
const PREMIUM_PRICE = V3_FULL_PACK.price; // 497

// Lignes du tableau comparatif (label, V2, V3, Premium).
// false = absent, true = inclus, string = détail.
const ROWS: { label: string; v2: string | false; v3: string | true; premium: string | true }[] = [
  { label: 'Agents IA de rédaction', v2: `${V2_AGENTS} agents`, v3: `${V3_AGENTS} agents`, premium: `${V3_PREMIUM_AGENTS} agents (qualité Pro)` },
  { label: 'Puissance IA', v2: '×1', v3: '×2 plus puissant', premium: '×4 plus puissant' },
  { label: 'Création de livres', v2: 'Manuelle + IA', v3: '8 sources d’import', premium: '8 sources d’import' },
  { label: 'Studio couverture KDP', v2: 'Basique', v3: 'Pro (dos + 4e + bleed)', premium: 'Pro + variations IA' },
  { label: 'Pack KDP prêt à uploader', v2: false, v3: true, premium: true },
  { label: 'Tracker de ventes & royalties', v2: false, v3: true, premium: true },
  { label: 'Auto-pricing IA', v2: false, v3: true, premium: true },
  { label: 'Optimiseur d’annonces KDP', v2: false, v3: true, premium: true },
  { label: 'Séquence de lancement J-7', v2: false, v3: true, premium: true },
  { label: 'Audiobook professionnel', v2: 'Limité', v3: 'Complet', premium: 'Complet' },
  { label: 'Modules premium inclus', v2: '—', v3: `${V3_MODULES.length} modules`, premium: 'Tous les modules + packs' },
];

function Cell({ value, tone }: { value: string | boolean; tone: 'green' | 'gold' | 'royal' }) {
  const color = tone === 'green' ? GREEN_DEEP : tone === 'royal' ? ROYAL_DEEP : AMBER_DEEP;
  if (value === true) return <Check className="mx-auto h-5 w-5" style={{ color }} />;
  if (value === false) return <X className="mx-auto h-5 w-5" style={{ color: `${INK}30` }} />;
  return <span className="text-sm font-semibold" style={{ color }}>{value}</span>;
}

export default function V2V3Compare() {
  return (
    <section className="mt-12">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-black" style={{ fontFamily: SERIF, color: INK }}>
          V2 vs V3 vs V3 Premium — <span style={{ color: AMBER_DEEP }}>ce que vous gagnez</span>
        </h2>
        <p className="mt-2 text-sm" style={{ color: `${INK}99` }}>Comparez en un coup d’œil. Chaque palier décuple votre puissance.</p>
      </div>

      {/* Tableau comparatif */}
      <div className="overflow-x-auto rounded-2xl border bg-white shadow-[0_10px_40px_-20px_rgba(42,33,24,0.25)]"
        style={{ borderColor: `${INK}14` }}>
        <div className="min-w-[640px]">
          {/* En-têtes */}
          <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div className="px-4 py-4" style={{ background: '#FBF6EC' }} />
            <div className="px-4 py-4 text-center" style={{ background: `${GREEN}12`, borderBottom: `2px solid ${GREEN}` }}>
              <div className="text-xs uppercase tracking-widest" style={{ color: `${INK}70` }}>Actuel</div>
              <div className="text-lg font-black" style={{ color: GREEN_DEEP }}>V2</div>
              <div className="text-xs font-bold" style={{ color: `${INK}80` }}>{V2_PRICE}€ à vie</div>
            </div>
            <div className="px-4 py-4 text-center" style={{ background: `${AMBER}1f`, borderBottom: `2px solid ${AMBER}` }}>
              <div className="text-xs uppercase tracking-widest flex items-center justify-center gap-1" style={{ color: `${INK}70` }}>
                <Sparkles className="h-3 w-3" /> Nouveau
              </div>
              <div className="text-lg font-black" style={{ color: AMBER_DEEP }}>V3</div>
              <div className="text-xs font-bold" style={{ color: `${INK}80` }}>{V3_PRICE}€ à vie</div>
            </div>
            <div className="px-4 py-4 text-center" style={{ background: `${ROYAL}1f`, borderBottom: `2px solid ${ROYAL}` }}>
              <div className="text-xs uppercase tracking-widest flex items-center justify-center gap-1" style={{ color: `${INK}70` }}>
                <Crown className="h-3 w-3" /> Premium
              </div>
              <div className="text-lg font-black" style={{ color: ROYAL_DEEP }}>V3 Premium</div>
              <div className="text-xs font-bold" style={{ color: `${INK}80` }}>{PREMIUM_PRICE}€ à vie</div>
            </div>
          </div>

          {/* Lignes */}
          {ROWS.map((row, i) => (
            <div key={row.label} className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center border-t"
              style={{ borderColor: `${INK}0d`, background: i % 2 ? '#FCFAF4' : '#ffffff' }}>
              <div className="px-4 py-3 text-sm font-medium" style={{ color: `${INK}cc` }}>{row.label}</div>
              <div className="px-4 py-3 text-center" style={{ background: `${GREEN}08` }}><Cell value={row.v2} tone="green" /></div>
              <div className="px-4 py-3 text-center" style={{ background: `${AMBER}10` }}><Cell value={row.v3} tone="gold" /></div>
              <div className="px-4 py-3 text-center" style={{ background: `${ROYAL}10` }}><Cell value={row.premium} tone="royal" /></div>
            </div>
          ))}
        </div>
      </div>

      {/* Encarts agents : V2 (vert) / V3 (doré) / V3 Premium (royal) */}
      <style>{`
        @keyframes gold-shimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        @keyframes gold-halo {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        @keyframes green-pulse {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.6; }
        }
        @keyframes royal-halo {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.06); }
        }
      `}</style>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Encart V2 */}
        <div className="group relative rounded-2xl border p-6 text-center overflow-hidden bg-white transition-all duration-500 hover:scale-[1.02]"
          style={{ borderColor: `${GREEN}40`, boxShadow: `0 10px 30px -18px ${GREEN}` }}>
          <span className="pointer-events-none absolute -inset-2"
            style={{ background: `radial-gradient(60% 60% at 50% 0%, ${GREEN}14, transparent 70%)`, animation: 'green-pulse 3s ease-in-out infinite' }} aria-hidden />
          <div className="relative">
            <div className="text-xs uppercase tracking-widest mb-1" style={{ color: `${INK}70` }}>V2 — actuel</div>
            <div className="text-5xl font-black transition-transform duration-300 group-hover:scale-110" style={{ color: GREEN_DEEP }}>{V2_AGENTS}</div>
            <div className="mt-1 text-sm font-semibold" style={{ color: GREEN_DEEP }}>agents IA</div>
            <div className="relative mt-2 inline-block rounded-full px-3 py-0.5 text-[11px] font-extrabold"
              style={{ background: `${GREEN}1a`, color: GREEN_DEEP }}>
              ×1 puissance
            </div>
          </div>
        </div>

        {/* Encart V3 */}
        <div className="group relative rounded-2xl border p-6 text-center overflow-hidden bg-white transition-all duration-500 hover:scale-[1.02]"
          style={{ borderColor: AMBER, boxShadow: `0 12px 36px -14px ${AMBER}` }}>
          <span className="pointer-events-none absolute -inset-2"
            style={{ background: `radial-gradient(60% 60% at 50% 0%, ${AMBER}26, transparent 70%)`, animation: 'gold-halo 2.5s ease-in-out infinite' }} aria-hidden />
          <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden>
            <span className="absolute inset-0" style={{ background: `linear-gradient(90deg, transparent, ${AMBER}1f, transparent)`, animation: 'gold-shimmer 3.5s ease-in-out infinite' }} />
          </span>
          <div className="relative">
            <div className="text-xs uppercase tracking-widest mb-1 flex items-center justify-center gap-1" style={{ color: `${INK}70` }}>
              <Sparkles className="h-3 w-3" /> V3 — nouveau
            </div>
            <div className="text-5xl font-black transition-transform duration-300 group-hover:scale-110" style={{ color: AMBER_DEEP }}>{V3_AGENTS}</div>
            <div className="relative mt-1 text-sm font-semibold" style={{ color: AMBER_DEEP }}>agents IA</div>
            <div className="relative mt-2 inline-block rounded-full px-3 py-0.5 text-[11px] font-extrabold"
              style={{ background: `linear-gradient(90deg, ${AMBER}, #f0b450)`, color: '#fff' }}>
              ×2 plus puissant
            </div>
          </div>
        </div>

        {/* Encart V3 Premium */}
        <div className="group relative rounded-2xl border p-6 text-center overflow-hidden bg-white transition-all duration-500 hover:scale-[1.02]"
          style={{ borderColor: ROYAL, boxShadow: `0 14px 40px -12px ${ROYAL}` }}>
          <span className="pointer-events-none absolute -inset-2"
            style={{ background: `radial-gradient(60% 60% at 50% 0%, ${ROYAL}2e, transparent 70%)`, animation: 'royal-halo 2.5s ease-in-out infinite' }} aria-hidden />
          <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden>
            <span className="absolute inset-0" style={{ background: `linear-gradient(90deg, transparent, ${ROYAL}24, transparent)`, animation: 'gold-shimmer 3.5s ease-in-out infinite' }} />
          </span>
          <div className="relative">
            <div className="text-xs uppercase tracking-widest mb-1 flex items-center justify-center gap-1" style={{ color: `${INK}70` }}>
              <Crown className="h-3 w-3" /> V3 Premium
            </div>
            <div className="text-5xl font-black transition-transform duration-300 group-hover:scale-110" style={{ color: ROYAL_DEEP }}>{V3_PREMIUM_AGENTS}</div>
            <div className="relative mt-1 text-sm font-semibold" style={{ color: ROYAL_DEEP }}>agents IA</div>
            <div className="relative mt-1 text-[11px] font-medium" style={{ color: `${INK}80` }}>qualité IA Pro</div>
            <div className="relative mt-2 inline-block rounded-full px-3 py-0.5 text-[11px] font-extrabold"
              style={{ background: `linear-gradient(90deg, ${ROYAL}, #9d76e8)`, color: '#fff' }}>
              ×4 plus puissant
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
