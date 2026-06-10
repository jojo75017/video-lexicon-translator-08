import React, { useState } from 'react';
import { Check, Crown, Sparkles, Lock, ChevronDown, CheckCircle2, Clock } from 'lucide-react';
import {
  V3_PRICE, V3_BASE_INSTALLMENTS, V3_UPSELL_PACKS, V3_UPSELLS_TOTAL, V3_FULL_PACK,
  getModuleById, type V3Module,
} from '@/data/roadmapV3';
import { isModuleClickable, V3ModuleDialog } from './v3ModuleRegistry';
import V3PackCheckout from './V3PackCheckout';

// Palette « Clair Ambre » — cohérente avec V3HubPage.
const AMBER = '#E8951E';
const AMBER_DEEP = '#C97A14';
const AMBER_SOFT = '#FFF3DF';
const INK = '#2A2118';
const SERIF = "'Georgia', 'Times New Roman', serif";

/**
 * Bloc Tarifs V3 — 3 niveaux de lecture :
 *   1. Base 197€ (ce qui est inclus)
 *   2. Packs upsell à la carte (total 400€) — dépliables pour voir les modules
 *   3. Pack Tout Complet 497€ (−100€) mis en avant
 */
const V3PricingTiers: React.FC = () => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [baseCheckoutOpen, setBaseCheckoutOpen] = useState(false);
  const [openPack, setOpenPack] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<V3Module | null>(null);

  return (
    <section id="tarifs" className="mt-16 scroll-mt-20">
      <V3PackCheckout open={checkoutOpen} onClose={() => setCheckoutOpen(false)} product="full" />
      <V3PackCheckout open={baseCheckoutOpen} onClose={() => setBaseCheckoutOpen(false)} product="base" />
      <V3ModuleDialog module={activeModule} onClose={() => setActiveModule(null)} />
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-3">
          <Crown className="h-5 w-5" style={{ color: AMBER }} />
          <span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: AMBER_DEEP }}>
            Tarifs Publication Assistée Pro
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: SERIF, color: INK }}>
          Commence à la base, ajoute ce dont tu as besoin
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-sm" style={{ color: '#6f5e47' }}>
          La base te permet d'écrire et publier de A à Z. Les packs premium ajoutent le marketing,
          les réseaux, les couvertures haut de gamme et la monétisation avancée.
        </p>
      </div>

      {/* 1. Base */}
      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        <article className="rounded-2xl p-6 border bg-white border-[#eadfc9] shadow-[0_2px_14px_-8px_rgba(180,140,60,0.25)]">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5" style={{ color: AMBER }} />
            <h3 className="text-lg font-bold" style={{ fontFamily: SERIF, color: INK }}>Base — Création & Publication</h3>
          </div>
          <p className="text-sm mb-4" style={{ color: '#6f5e47' }}>
            Tout pour écrire et publier ton livre : IA d'écriture, pipeline complet, export et
            publication KDP. Accès à vie.
          </p>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-4xl font-black" style={{ color: AMBER_DEEP }}>{V3_PRICE}€</span>
            <span className="text-sm pb-1" style={{ color: '#a18a6c' }}>à vie</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-5">
            {V3_BASE_INSTALLMENTS.map((opt) => (
              <span key={opt} className="text-[11px] font-semibold rounded-full px-3 py-1 border"
                style={{ borderColor: `${AMBER}55`, color: AMBER_DEEP }}>
                {opt}
              </span>
            ))}
          </div>
          <button
            onClick={() => setBaseCheckoutOpen(true)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition-transform hover:-translate-y-0.5 border"
            style={{ borderColor: AMBER, color: AMBER_DEEP, background: AMBER_SOFT }}
          >
            <Sparkles className="h-4 w-4" />
            Démarrer avec la Base — {V3_PRICE}€
          </button>
        </article>

        {/* 3. Pack Tout Complet (highlight) */}
        <article className="relative rounded-2xl p-6 border-2 overflow-hidden bg-white shadow-[0_8px_30px_-12px_rgba(232,149,30,0.4)]"
          style={{ borderColor: AMBER }}>
          <div className="pointer-events-none absolute -inset-px opacity-70"
            style={{ background: `radial-gradient(180px 120px at 50% 0%, ${AMBER}22, transparent 70%)` }} />
          <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-wider rounded-full px-2.5 py-1"
            style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)`, color: '#fff' }}>
            Le plus malin
          </span>
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="h-5 w-5" style={{ color: AMBER }} />
              <h3 className="text-lg font-bold" style={{ fontFamily: SERIF, color: INK }}>{V3_FULL_PACK.title}</h3>
            </div>
            <p className="text-sm mb-4" style={{ color: '#6f5e47' }}>
              La base + les 4 packs premium débloqués d'un coup. Tout l'arsenal, sans rien à ajouter.
            </p>
            <div className="flex items-end gap-3 mb-1">
              <span className="text-4xl font-black" style={{ color: AMBER_DEEP }}>{V3_FULL_PACK.price}€</span>
              <span className="text-lg line-through pb-1" style={{ color: '#bcaa8c' }}>{V3_FULL_PACK.compareAt}€</span>
            </div>
            <p className="text-sm font-bold mb-4" style={{ color: '#1f9d6b' }}>
              Tu économises {V3_FULL_PACK.saves}€
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {V3_FULL_PACK.installments.map((opt) => (
                <span key={opt} className="text-[11px] font-semibold rounded-full px-3 py-1"
                  style={{ background: AMBER_SOFT, color: AMBER_DEEP }}>
                  {opt}
                </span>
              ))}
            </div>
            <button
              onClick={() => setCheckoutOpen(true)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-black transition-transform hover:-translate-y-0.5"
              style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)`, color: '#fff' }}
            >
              <Crown className="h-4 w-4" />
              Obtenir le Pack Tout Complet
            </button>
          </div>
        </article>
      </div>

      {/* 2. Packs à la carte */}
      <div className="flex items-center gap-2 mb-4 mt-10">
        <Lock className="h-4 w-4" style={{ color: AMBER }} />
        <h3 className="text-base font-bold" style={{ fontFamily: SERIF, color: INK }}>Packs premium à la carte</h3>
        <span className="text-xs" style={{ color: '#a18a6c' }}>total {V3_UPSELLS_TOTAL}€</span>
        <div className="flex-1 h-px ml-2" style={{ background: `linear-gradient(90deg, ${AMBER}44, transparent)` }} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {V3_UPSELL_PACKS.map((pack) => {
          const isOpen = openPack === pack.id;
          return (
            <article key={pack.id} className="rounded-2xl border bg-white border-[#eadfc9] flex flex-col overflow-hidden shadow-[0_2px_14px_-8px_rgba(180,140,60,0.25)]">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold leading-tight" style={{ fontFamily: SERIF, color: INK }}>{pack.title}</h4>
                  <span className="text-base font-black shrink-0 ml-2" style={{ color: AMBER_DEEP }}>{pack.price}€</span>
                </div>
                <p className="text-[11px] leading-snug mb-3" style={{ color: '#7c6b54' }}>{pack.desc}</p>
                <button
                  onClick={() => setOpenPack(isOpen ? null : pack.id)}
                  className="w-full flex items-center justify-between gap-1.5 text-[11px] font-semibold rounded-lg px-3 py-2 border transition-colors hover:bg-[#FFF3DF]"
                  style={{ borderColor: `${AMBER}40`, color: AMBER_DEEP }}
                  aria-expanded={isOpen}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="h-3 w-3" style={{ color: '#1f9d6b' }} />
                    {pack.modules.length} modules inclus
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {isOpen && (
                <ul className="border-t border-[#f0e7d4] divide-y divide-[#f5efe2]">
                  {pack.modules.map((mid) => {
                    const mod = getModuleById(mid);
                    const ready = isModuleClickable(mid);
                    return (
                      <li key={mid} className="flex items-start gap-2 px-4 py-2.5">
                        {ready
                          ? <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: '#1f9d6b' }} />
                          : <Clock className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: '#a18a6c' }} />}
                        <div className="min-w-0">
                          <div className="text-[12px] font-semibold leading-tight" style={{ color: INK }}>
                            {mod?.title ?? mid}
                          </div>
                          {mod?.description && (
                            <div className="text-[10.5px] leading-snug mt-0.5 line-clamp-2" style={{ color: '#8a7860' }}>
                              {mod.description}
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </article>
          );
        })}
      </div>

      <p className="text-center text-[11px] mt-6" style={{ color: '#a18a6c' }}>
        Pris séparément : {V3_PRICE}€ + {V3_UPSELLS_TOTAL}€ = {V3_FULL_PACK.compareAt}€.
        Le Pack Tout Complet est à {V3_FULL_PACK.price}€ ({V3_FULL_PACK.saves}€ d'économie).
      </p>
    </section>
  );
};

export default V3PricingTiers;
