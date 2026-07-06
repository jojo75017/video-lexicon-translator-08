import React, { useState } from 'react';
import { Check, Crown, Sparkles, Lock, ChevronDown, CheckCircle2, Clock, Gift, Layers, FlaskConical } from 'lucide-react';
import {
  V3_PRICE, V3_BASE_INSTALLMENTS, V3_UPSELL_PACKS, V3_ESSENTIAL_PACKS, V3_ALACARTE_PACKS,
  V3_UPSELLS_TOTAL, V3_ALL_PACKS_TOTAL, V3_FULL_PACK,
  V3_MODULES, getModuleAccess, getModuleById, type V3Module, type V3UpsellPack,
  V3_GIFT_PRICE, V3_GIFT_DISCOUNT,
  V3_INCLUDED_COUNT, V3_PREMIUM_COUNT, V3_TOTAL_COUNT, V3_FULL_PACK_EXTRA_IDS,
} from '@/data/roadmapV3';
import { isModuleClickable, V3ModuleDialog } from './v3ModuleRegistry';
import { isPaymentsTestMode } from '@/lib/stripe';
import V3PackCheckout from './V3PackCheckout';
import V3UpsellCheckout from './V3UpsellCheckout';
import V3GiftCheckout from './V3GiftCheckout';
import giftCard1 from '@/assets/gift-card-noel-1.jpg';
import giftCard2 from '@/assets/gift-card-noel-2.jpg';


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
 *   3. Pack Pro Vendeur 347€ (−200€) mis en avant
 */
const V3PricingTiers: React.FC = () => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [baseCheckoutOpen, setBaseCheckoutOpen] = useState(false);
  const [openPack, setOpenPack] = useState<string | null>(null);
  const [buyPack, setBuyPack] = useState<V3UpsellPack | null>(null);
  const [activeModule, setActiveModule] = useState<V3Module | null>(null);
  const [giftOpen, setGiftOpen] = useState(false);

  const renderPackCard = (pack: V3UpsellPack) => {
    const isOpen = openPack === pack.id;
    return (
      <article key={pack.id} className="rounded-2xl border bg-white border-[#eadfc9] flex flex-col overflow-hidden shadow-[0_2px_14px_-8px_rgba(180,140,60,0.25)]">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <h4 className="text-sm font-bold leading-tight" style={{ fontFamily: SERIF, color: INK }}>{pack.title}</h4>
              {pack.badge && (
                <span className="text-[9px] font-black uppercase tracking-wider rounded-full px-2 py-0.5 shrink-0"
                  style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)`, color: '#fff' }}>
                  {pack.badge}
                </span>
              )}
            </div>
            <span className="text-base font-black shrink-0 ml-2" style={{ color: AMBER_DEEP }}>{pack.price}€</span>
          </div>
          <p className="text-[11px] leading-snug mb-3" style={{ color: '#7c6b54' }}>{pack.desc}</p>
          <button
            onClick={() => setOpenPack(isOpen ? null : pack.id)}
            className="w-full flex items-center justify-between gap-1.5 text-[11px] font-semibold rounded-lg px-3 py-2 border transition-colors hover:bg-[#FFF3DF] mb-2"
            style={{ borderColor: `${AMBER}40`, color: AMBER_DEEP }}
            aria-expanded={isOpen}
          >
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3 w-3" style={{ color: '#1f9d6b' }} />
              {pack.modules.length} modules inclus
            </span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={() => setBuyPack(pack)}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-[12px] font-bold transition-transform hover:-translate-y-0.5"
            style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)`, color: '#fff' }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Acheter ce pack — {pack.price}€
          </button>
        </div>
        {isOpen && (
          <ul className="border-t border-[#f0e7d4] divide-y divide-[#f5efe2]">
            {pack.modules.map((mid) => {
              const mod = getModuleById(mid);
              const ready = isModuleClickable(mid);
              return (
                <li key={mid}>
                  <button
                    type="button"
                    disabled={!ready || !mod}
                    onClick={() => mod && ready && setActiveModule(mod)}
                    className={`w-full text-left flex items-start gap-2 px-4 py-2.5 transition-colors ${ready ? 'hover:bg-[#FFF3DF] cursor-pointer' : 'cursor-default'}`}
                  >
                    {ready
                      ? <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: '#1f9d6b' }} />
                      : <Clock className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: '#a18a6c' }} />}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px] font-semibold leading-tight" style={{ color: INK }}>
                          {mod?.title ?? mid}
                        </span>
                        {ready && (
                          <span className="text-[9px] font-bold uppercase tracking-wide rounded px-1.5 py-0.5 shrink-0"
                            style={{ background: AMBER_SOFT, color: AMBER_DEEP }}>
                            Ouvrir
                          </span>
                        )}
                      </div>
                      {mod?.description && (
                        <div className="text-[10.5px] leading-snug mt-0.5 line-clamp-2" style={{ color: '#8a7860' }}>
                          {mod.description}
                        </div>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </article>
    );
  };

  return (
    <section id="tarifs" className="mt-16 scroll-mt-20">
      <V3PackCheckout open={checkoutOpen} onClose={() => setCheckoutOpen(false)} product="full" />
      <V3PackCheckout open={baseCheckoutOpen} onClose={() => setBaseCheckoutOpen(false)} product="base" />
      <V3UpsellCheckout pack={buyPack} onClose={() => setBuyPack(null)} />
      <V3GiftCheckout open={giftOpen} onClose={() => setGiftOpen(false)} />
      <V3ModuleDialog module={activeModule} onClose={() => setActiveModule(null)} />

      {/* 0. Carte cadeau Noël — mise en évidence */}
      <div className="mb-10 rounded-3xl border-2 overflow-hidden shadow-[0_12px_40px_-16px_rgba(232,149,30,0.5)]"
        style={{ borderColor: AMBER }}>
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative p-6 sm:p-8 flex flex-col justify-center" style={{ background: AMBER_SOFT }}>
            <span className="inline-flex self-start items-center gap-1.5 text-[10px] font-black uppercase tracking-wider rounded-full px-3 py-1 mb-3"
              style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)`, color: '#fff' }}>
              <Gift className="h-3.5 w-3.5" /> Offre de Noël · −{Math.round(V3_GIFT_DISCOUNT * 100)}%
            </span>
            <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: SERIF, color: INK }}>
              Offrez la création de livres en carte cadeau
            </h3>
            <p className="text-sm mb-4" style={{ color: '#6f5e47' }}>
              Offrez à un proche l'accès à vie au générateur (Base — écrire & publier). Il reçoit un
              <strong> code unique</strong> à activer sur son compte. Les packs premium restent à part.
            </p>
            <div className="flex items-end gap-3 mb-5">
              <span className="text-lg line-through" style={{ color: '#bcaa8c' }}>{V3_PRICE}€</span>
              <span className="text-4xl font-black" style={{ color: AMBER_DEEP }}>{V3_GIFT_PRICE}€</span>
              <span className="text-sm pb-1" style={{ color: '#a18a6c' }}>à vie</span>
            </div>
            <button
              onClick={() => setGiftOpen(true)}
              className="w-full sm:w-auto self-start inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-black transition-transform hover:-translate-y-0.5"
              style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)`, color: '#fff' }}
            >
              <Gift className="h-4 w-4" />
              Offrir cette carte cadeau — {V3_GIFT_PRICE}€
            </button>
            <p className="text-[11px] mt-3" style={{ color: '#a18a6c' }}>
              Déjà un code ? <a href="/carte-cadeau" className="font-semibold underline" style={{ color: AMBER_DEEP }}>Activez-le ici →</a>
            </p>
          </div>
          <div className="relative flex items-center justify-center gap-3 p-6 sm:p-8 bg-white overflow-hidden">
            <img src={giftCard1} alt="Carte cadeau EbookStudio Noël" loading="lazy" width={1024} height={1024}
              className="w-1/2 max-w-[220px] rounded-xl shadow-lg rotate-[-6deg]" />
            <img src={giftCard2} alt="Carte cadeau EbookStudio près de livres" loading="lazy" width={1024} height={1024}
              className="w-1/2 max-w-[220px] rounded-xl shadow-lg rotate-[4deg] mt-6" />
          </div>
        </div>
      </div>


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
            Tout pour écrire, publier <strong>ET lancer</strong> ton livre : IA d'écriture, pipeline complet,
            export et publication KDP, <strong>couverture premium IA incluse</strong> et tout le
            <strong> kit de lancement & visibilité</strong> (annonces, Amazon Ads, séquence J-7, page auteur…). Accès à vie.
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
              La base 197€ (écrire + publier + lancer) + <strong>tous les {V3_UPSELL_PACKS.length} packs premium</strong>
              {' '}pour vendre et scaler.<br />
              Tu débloques <strong>la totalité des {V3_TOTAL_COUNT} outils</strong>, sans aucune limitation.
            </p>

            {/* Compteur global clair : 32 base + 68 premium = 100 */}
            <div className="mb-3 flex items-center gap-2 rounded-xl border p-3" style={{ borderColor: `${AMBER}55`, background: '#fff' }}>
              <Layers className="h-5 w-5 shrink-0" style={{ color: AMBER_DEEP }} />
              <p className="text-[12px] leading-snug" style={{ color: INK }}>
                <strong>{V3_TOTAL_COUNT} outils débloqués</strong>{' '}
                <span style={{ color: '#a18a6c' }}>
                  ({V3_INCLUDED_COUNT} de la base + {V3_PREMIUM_COUNT} premium)
                </span>
              </p>
            </div>

            <div className="mb-3 rounded-xl border p-3" style={{ borderColor: `${AMBER}55`, background: AMBER_SOFT }}>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: AMBER_DEEP }}>
                Les {V3_UPSELL_PACKS.length} packs inclus :
              </p>
              <ul className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]" style={{ color: '#6f5e47' }}>
                {V3_UPSELL_PACKS.map((p) => (
                  <li key={p.id} className="flex items-center gap-1.5">
                    <Check className="h-3 w-3 shrink-0" style={{ color: '#1f9d6b' }} />
                    <span className="font-semibold" style={{ color: INK }}>{p.title}</span>{' '}
                    <span style={{ color: '#a18a6c' }}>({p.modules.length})</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[10px] font-medium" style={{ color: AMBER_DEEP }}>
                + {V3_FULL_PACK_EXTRA_IDS.length} outils supplémentaires (IA avancée, communauté, séries…)
                + la base ({V3_INCLUDED_COUNT} modules)
              </p>
            </div>
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
            {isPaymentsTestMode() && (
              <button
                onClick={() => setCheckoutOpen(true)}
                className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-[12px] font-bold border transition-colors hover:bg-[#FFF3DF]"
                style={{ borderColor: `${AMBER}66`, color: AMBER_DEEP }}
              >
                <FlaskConical className="h-3.5 w-3.5" />
                Tester le paiement 347€ · Mode test
              </button>
            )}

          </div>
        </article>
      </div>

      {/* Bandeau de transition : pourquoi des upsells si le livre est déjà publié */}
      <div className="mt-10 rounded-2xl border p-5 sm:p-6"
        style={{ borderColor: `${AMBER}55`, background: AMBER_SOFT }}>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 shrink-0 mt-0.5" style={{ color: '#1f9d6b' }} />
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-1" style={{ fontFamily: SERIF, color: INK }}>
              Avec la Base, ton livre est déjà écrit, publié et prêt à la vente.
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: '#6f5e47' }}>
              Tu n'as <strong>rien d'autre à acheter</strong> pour lancer ton livre. Les packs ci-dessous
              ne servent pas à « finir » ton livre — ils servent à <strong>vendre plus, plus vite et plus cher</strong> :
              couvertures haut de gamme, audiobook, page de vente, séquences email, réseaux sociaux et
              monétisation avancée. À ajouter quand tu veux, uniquement si tu veux accélérer tes ventes.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Packs premium inclus dans le Pack Pro 347€ */}
      <div className="flex items-center gap-2 mb-4 mt-8">
        <Lock className="h-4 w-4" style={{ color: AMBER }} />
        <h3 className="text-base font-bold" style={{ fontFamily: SERIF, color: INK }}>Packs premium pour vendre & scaler</h3>
        <span className="text-xs" style={{ color: '#a18a6c' }}>tous inclus dans le Pack Pro</span>
        <div className="flex-1 h-px ml-2" style={{ background: `linear-gradient(90deg, ${AMBER}44, transparent)` }} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {V3_ESSENTIAL_PACKS.map((pack) => renderPackCard(pack))}
      </div>

      {/* 3. Options spécialistes — incluses dans le Pack Pro, aussi vendables seules */}
      {V3_ALACARTE_PACKS.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-4 mt-10">
            <Sparkles className="h-4 w-4" style={{ color: AMBER }} />
            <h3 className="text-base font-bold" style={{ fontFamily: SERIF, color: INK }}>Options spécialistes</h3>
            <span className="text-xs" style={{ color: '#a18a6c' }}>incluses dans le Pack Pro · aussi disponibles seules</span>
            <div className="flex-1 h-px ml-2" style={{ background: `linear-gradient(90deg, ${AMBER}44, transparent)` }} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {V3_ALACARTE_PACKS.map((pack) => renderPackCard(pack))}
          </div>
        </>
      )}

      {/* 4. Modules premium supplémentaires débloqués par le Pack Pro (non rattachés à un pack) */}
      {V3_FULL_PACK_EXTRA_IDS.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-4 mt-10">
            <Crown className="h-4 w-4" style={{ color: AMBER }} />
            <h3 className="text-base font-bold" style={{ fontFamily: SERIF, color: INK }}>Inclus en plus dans le Pack Pro</h3>
            <span className="text-xs" style={{ color: '#a18a6c' }}>{V3_FULL_PACK_EXTRA_IDS.length} outils premium débloqués par le 347€</span>
            <div className="flex-1 h-px ml-2" style={{ background: `linear-gradient(90deg, ${AMBER}44, transparent)` }} />
          </div>
          <ul className="grid sm:grid-cols-2 gap-2">
            {V3_FULL_PACK_EXTRA_IDS.map((mid) => {
              const mod = getModuleById(mid);
              const ready = isModuleClickable(mid);
              return (
                <li key={mid}>
                  <button
                    type="button"
                    disabled={!ready || !mod}
                    onClick={() => mod && ready && setActiveModule(mod)}
                    className={`w-full text-left flex items-start gap-2 rounded-xl border px-3 py-2.5 bg-white transition-colors ${ready ? 'hover:bg-[#FFF3DF] cursor-pointer' : 'cursor-default'}`}
                    style={{ borderColor: '#eadfc9' }}
                  >
                    {ready
                      ? <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: '#1f9d6b' }} />
                      : <Clock className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: '#a18a6c' }} />}
                    <div className="min-w-0 flex-1">
                      <span className="text-[12px] font-semibold leading-tight" style={{ color: INK }}>
                        {mod?.title ?? mid}
                      </span>
                      {mod?.description && (
                        <div className="text-[10.5px] leading-snug mt-0.5 line-clamp-2" style={{ color: '#8a7860' }}>
                          {mod.description}
                        </div>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <p className="text-center text-[11px] mt-6" style={{ color: '#a18a6c' }}>
        Pris séparément : {V3_PRICE}€ + {V3_ALL_PACKS_TOTAL}€ (tous les packs) = {V3_FULL_PACK.compareAt}€.
        Le {V3_FULL_PACK.title} est à {V3_FULL_PACK.price}€ ({V3_FULL_PACK.saves}€ d'économie) et débloque les {V3_TOTAL_COUNT} outils.
      </p>

    </section>
  );
};

export default V3PricingTiers;
