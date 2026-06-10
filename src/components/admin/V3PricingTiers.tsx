import React from 'react';
import { Check, Crown, Sparkles, Lock } from 'lucide-react';
import {
  V3_PRICE, V3_BASE_INSTALLMENTS, V3_UPSELL_PACKS, V3_UPSELLS_TOTAL, V3_FULL_PACK,
} from '@/data/roadmapV3';

// Palette « Noir & Or luxe » — locale à cette page (cohérente avec V3HubPage).
const GOLD = '#c9a84c';
const GOLD_LIGHT = '#f0d78c';

/**
 * Bloc Tarifs V3 — 3 niveaux de lecture :
 *   1. Base 197€ (ce qui est inclus)
 *   2. Packs upsell à la carte (total 400€)
 *   3. Pack Tout Complet 497€ (−100€) mis en avant
 *
 * Pas de paiement réel branché : les CTA pointent vers le tunnel existant.
 */
const V3PricingTiers: React.FC = () => {
  return (
    <section id="tarifs" className="mt-16 scroll-mt-20">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-3">
          <Crown className="h-5 w-5" style={{ color: GOLD }} />
          <span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}>
            Tarifs Publication Assistée Pro
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black"
          style={{ background: `linear-gradient(100deg, #ffffff, ${GOLD_LIGHT}, ${GOLD})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
          Commence à la base, ajoute ce dont tu as besoin
        </h2>
        <p className="mt-3 text-white/55 max-w-2xl mx-auto text-sm">
          La base te permet d'écrire et publier de A à Z. Les packs premium ajoutent le marketing,
          les réseaux, les couvertures haut de gamme et la monétisation avancée.
        </p>
      </div>

      {/* 1. Base */}
      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        <article className="rounded-2xl p-6 border bg-[#161616] border-[#c9a84c33]">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5" style={{ color: GOLD }} />
            <h3 className="text-lg font-bold text-white">Base — Création & Publication</h3>
          </div>
          <p className="text-white/55 text-sm mb-4">
            Tout pour écrire et publier ton livre : IA d'écriture, pipeline complet, export et
            publication KDP. Accès à vie.
          </p>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-4xl font-black" style={{ color: GOLD_LIGHT }}>{V3_PRICE}€</span>
            <span className="text-white/45 text-sm pb-1">à vie</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {V3_BASE_INSTALLMENTS.map((opt) => (
              <span key={opt} className="text-[11px] font-semibold rounded-full px-3 py-1 border"
                style={{ borderColor: `${GOLD}44`, color: 'rgba(255,255,255,0.7)' }}>
                {opt}
              </span>
            ))}
          </div>
        </article>

        {/* 3. Pack Tout Complet (highlight) */}
        <article className="relative rounded-2xl p-6 border-2 overflow-hidden"
          style={{ borderColor: GOLD, background: 'linear-gradient(160deg, #1c1810, #161616)' }}>
          <div className="pointer-events-none absolute -inset-px opacity-60"
            style={{ background: `radial-gradient(180px 120px at 50% 0%, ${GOLD}33, transparent 70%)` }} />
          <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-wider rounded-full px-2.5 py-1"
            style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`, color: '#1a1a1a' }}>
            Le plus malin
          </span>
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="h-5 w-5" style={{ color: GOLD }} />
              <h3 className="text-lg font-bold text-white">{V3_FULL_PACK.title}</h3>
            </div>
            <p className="text-white/55 text-sm mb-4">
              La base + les 4 packs premium débloqués d'un coup. Tout l'arsenal, sans rien à ajouter.
            </p>
            <div className="flex items-end gap-3 mb-1">
              <span className="text-4xl font-black" style={{ color: GOLD_LIGHT }}>{V3_FULL_PACK.price}€</span>
              <span className="text-white/40 text-lg line-through pb-1">{V3_FULL_PACK.compareAt}€</span>
            </div>
            <p className="text-sm font-bold mb-4" style={{ color: '#34d399' }}>
              Tu économises {V3_FULL_PACK.saves}€
            </p>
            <div className="flex flex-wrap gap-2">
              {V3_FULL_PACK.installments.map((opt) => (
                <span key={opt} className="text-[11px] font-semibold rounded-full px-3 py-1"
                  style={{ background: `${GOLD}22`, color: GOLD_LIGHT }}>
                  {opt}
                </span>
              ))}
            </div>
          </div>
        </article>
      </div>

      {/* 2. Packs à la carte */}
      <div className="flex items-center gap-2 mb-4 mt-10">
        <Lock className="h-4 w-4" style={{ color: GOLD }} />
        <h3 className="text-base font-bold" style={{ color: GOLD_LIGHT }}>Packs premium à la carte</h3>
        <span className="text-xs text-white/40">total {V3_UPSELLS_TOTAL}€</span>
        <div className="flex-1 h-px ml-2" style={{ background: `linear-gradient(90deg, ${GOLD}33, transparent)` }} />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {V3_UPSELL_PACKS.map((pack) => (
          <article key={pack.id} className="rounded-2xl p-4 border bg-[#161616] border-[#c9a84c22] flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-white leading-tight">{pack.title}</h4>
              <span className="text-base font-black shrink-0 ml-2" style={{ color: GOLD_LIGHT }}>{pack.price}€</span>
            </div>
            <p className="text-[11px] text-white/55 leading-snug mb-3 flex-1">{pack.desc}</p>
            <div className="flex items-center gap-1.5 text-[10px] text-white/45">
              <Check className="h-3 w-3" style={{ color: '#34d399' }} />
              {pack.modules.length} modules inclus
            </div>
          </article>
        ))}
      </div>

      <p className="text-center text-[11px] text-white/35 mt-6">
        Pris séparément : {V3_PRICE}€ + {V3_UPSELLS_TOTAL}€ = {V3_FULL_PACK.compareAt}€.
        Le Pack Tout Complet est à {V3_FULL_PACK.price}€ ({V3_FULL_PACK.saves}€ d'économie).
      </p>
    </section>
  );
};

export default V3PricingTiers;
