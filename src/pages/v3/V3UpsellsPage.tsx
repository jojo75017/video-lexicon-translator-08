import { Link } from 'react-router-dom';
import { ArrowRight, Gem } from 'lucide-react';
import {
  V3_ESSENTIAL_PACKS,
  V3_ALACARTE_PACKS,
  V3_FULL_PACK,
} from '@/data/roadmapV3';
import { V3_ADDON_LIST, V3_PLANS, formatPrice } from '@/data/v3Pricing';
import V3UpsellPromoCard from '@/components/v3public/V3UpsellPromoCard';
import useV3Entitlement from '@/hooks/useV3Entitlement';

/** /v3/upsells — Compléments & options personnifiés, tous inclus dans Studio Pro. */
export default function V3UpsellsPage() {
  const studio = V3_PLANS[V3_PLANS.length - 1];
  const { hasFull, hasBase } = useV3Entitlement();

  return (
    <>
      <title>Compléments & options V3 — Ebookstudio</title>
      <meta
        name="description"
        content="Ajoutez la correction BookPerfect, les traductions relues, l'audiolivre ou le pack Sérénité à votre livre. Tout est inclus dans le forfait Studio Pro."
      />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: 'var(--v3-gold-600)' }}>
            Espace auteur
          </p>
          <h1 className="v3-serif text-3xl font-bold md:text-4xl" style={{ color: 'var(--v3-ink)' }}>
            Compléments & options
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
            Renforcez un livre précis sans changer de forfait : correction professionnelle, traductions
            relues, version audio, accompagnement. Chaque option s'ajoute en un paiement unique — et tout
            est inclus dans le forfait Studio Pro.
          </p>
        </header>

        {/* Pack Pro Vendeur 547 € — en tête */}
        <section
          className="mb-10 rounded-3xl p-6 md:p-8"
          style={{
            background: 'linear-gradient(135deg, var(--v3-cream, #FAF6EE), #fff)',
            border: '1px solid var(--v3-gold, #c9a84c)',
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span
                className="inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                style={{ background: 'var(--v3-gold-600, #b4831f)' }}
              >
                {V3_FULL_PACK.title}
              </span>
              <h2 className="v3-serif mt-3 text-2xl font-bold" style={{ color: 'var(--v3-ink)' }}>
                Le Pack Pro Vendeur — tout, d'un coup
              </h2>
              <p className="mt-1 text-sm" style={{ color: 'var(--v3-muted)' }}>
                La base 197 € + tous les packs essentiels + toutes les options à la carte.
                Économie de {V3_FULL_PACK.saves} € vs achat séparé.
              </p>
              <div className="mt-3 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-black" style={{ color: 'var(--v3-gold-600, #b4831f)' }}>
                  {V3_FULL_PACK.price} €
                </span>
                <span className="text-sm line-through" style={{ color: 'var(--v3-muted)' }}>
                  {V3_FULL_PACK.compareAt} €
                </span>
                <span className="text-xs" style={{ color: 'var(--v3-muted)' }}>
                  · {V3_FULL_PACK.installments.join(' · ')}
                </span>
              </div>
            </div>
            <Link to="/v3/forfaits" className="v3-btn v3-btn-gold">
              <Gem className="h-4 w-4" /> Passer en Studio Pro <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Compléments (V3_ADDON_LIST) — encarts personnifiés */}
        <h2 className="v3-serif mb-4 text-xl font-bold" style={{ color: 'var(--v3-ink)' }}>
          Compléments à la carte
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {V3_ADDON_LIST.map((addon) => {
            const included = hasFull || (hasBase && addon.inEdition);
            return (
              <V3UpsellPromoCard
                key={addon.key}
                figureId={addon.key}
                title={addon.title}
                price={addon.price}
                description={addon.description}
                to={addon.to}
                priceId={addon.priceId}
                included={included}
              />
            );
          })}
        </div>

        {/* Packs essentiels (roadmap) — inclus dans le Pack Pro 547 € */}
        <h2 className="v3-serif mb-4 mt-12 text-xl font-bold" style={{ color: 'var(--v3-ink)' }}>
          Packs premium — inclus dans le Pack Pro 547 €
        </h2>
        <p className="mb-4 text-[13px]" style={{ color: 'var(--v3-muted)' }}>
          Ces packs ne s'achètent pas à l'unité : ils sont tous contenus dans le Pack Pro Vendeur
          (ou dans le forfait Studio Pro).
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {V3_ESSENTIAL_PACKS.map((pack) => (
            <V3UpsellPromoCard
              key={pack.id}
              figureId={pack.id}
              title={pack.title}
              price={pack.price}
              description={pack.desc}
              to="/v3/forfaits"
              badge={pack.badge}
              included={hasFull}
            />
          ))}
        </div>

        {/* Options à la carte (roadmap) */}
        <h2 className="v3-serif mb-4 mt-12 text-xl font-bold" style={{ color: 'var(--v3-ink)' }}>
          Options spécialistes
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {V3_ALACARTE_PACKS.map((pack) => (
            <V3UpsellPromoCard
              key={pack.id}
              figureId={pack.id}
              title={pack.title}
              price={pack.price}
              description={pack.desc}
              to={pack.id === 'boost_lancement' ? '/v3/upsell-17' : '/v3/forfaits'}
              badge={pack.badge}
              included={hasFull}
            />
          ))}
        </div>

        {/* Bandeau Studio Pro */}
        <section
          className="mt-12 rounded-3xl p-6 md:p-8"
          style={{ background: 'var(--v3-cream)', border: '1px solid var(--v3-line)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="v3-serif text-2xl font-bold" style={{ color: 'var(--v3-ink)' }}>
                Tout inclus : {studio?.name ?? 'Studio Pro'}
              </h2>
              <p className="mt-1 text-sm" style={{ color: 'var(--v3-muted)' }}>
                {studio ? `${formatPrice(studio.monthlyPrice)} / mois` : '97 € / mois'} — l'ensemble des
                compléments ci-dessus, sans achat à l'unité.
              </p>
            </div>
            <Link to="/v3/forfaits" className="v3-btn v3-btn-gold">
              <Gem className="h-4 w-4" /> Voir les forfaits <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

// V3_UPSELL_PACKS est conservé pour référence future ; eslint ignore l'import non utilisé.
void V3_UPSELL_PACKS;
