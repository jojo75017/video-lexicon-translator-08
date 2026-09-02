import { Link } from 'react-router-dom';
import { ArrowRight, Gem } from 'lucide-react';
import {
  V3_ESSENTIAL_PACKS,
  V3_ALACARTE_PACKS,
  V3_ALL_PACKS_TOTAL,
} from '@/data/roadmapV3';
import { V3_ADDON_LIST, V3_PLANS, formatPrice } from '@/data/v3Pricing';
import V3UpsellPromoCard from '@/components/v3public/V3UpsellPromoCard';
import useV3Entitlement from '@/hooks/useV3Entitlement';
import BdComicNewsBanner from '@/components/bd/BdComicNewsBanner';

/** /v3/upsells — Compléments & options personnifiés, tous inclus dans le forfait Édition. */
export default function V3UpsellsPage() {
  const edition = V3_PLANS[V3_PLANS.length - 1];
  const { hasFull, hasBase } = useV3Entitlement();

  return (
    <>
      <title>Compléments & options V3 — Ebookstudio</title>
      <meta
        name="description"
        content="Ajoutez la correction BookPerfect, les traductions relues, l'audiolivre ou le pack Sérénité à votre livre. Tout est inclus dans le forfait Édition."
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
            est inclus dans le forfait Édition.
          </p>
        </header>

        {/* Grande nouveauté V4 — Studio BD & Jeunesse */}
        <div className="mb-8">
          <BdComicNewsBanner compact />
        </div>

        <section className="mb-10 overflow-hidden rounded-lg border" style={{ borderColor: 'var(--v3-line)' }}>
          <div className="px-4 py-3" style={{ background: 'var(--v3-cream)' }}>
            <h2 className="v3-serif text-xl font-bold" style={{ color: 'var(--v3-ink)' }}>Tarifs à l'unité</h2>
            <p className="text-xs" style={{ color: 'var(--v3-muted)' }}>Chaque complément peut être acheté séparément, en paiement unique et sans abonnement.</p>
          </div>
          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ background: 'var(--v3-line)' }}>
            {[...V3_ADDON_LIST, ...V3_ESSENTIAL_PACKS, ...V3_ALACARTE_PACKS].map((item) => (
              <div key={'key' in item ? item.key : item.id} className="flex items-center justify-between gap-3 px-4 py-3" style={{ background: 'var(--v3-surface)' }}>
                <span className="text-xs font-semibold" style={{ color: 'var(--v3-ink)' }}>{item.title}</span>
                <strong className="shrink-0 text-sm" style={{ color: 'var(--v3-gold-600)' }}>{formatPrice(item.price)}</strong>
              </div>
            ))}
          </div>
          <p className="px-4 py-3 text-xs font-semibold" style={{ color: 'var(--v3-muted)', background: 'var(--v3-cream)' }}>
            Valeur cumulée des packs premium : {formatPrice(V3_ALL_PACKS_TOTAL)}. Les anciens clients V2 conservent leur remise de 20 % à vie.
          </p>
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

        {/* Packs premium — disponibles séparément */}
        <h2 className="v3-serif mb-4 mt-12 text-xl font-bold" style={{ color: 'var(--v3-ink)' }}>
          Packs premium à l'unité
        </h2>
        <p className="mb-4 text-[13px]" style={{ color: 'var(--v3-muted)' }}>
          Choisissez uniquement le pack utile à votre livre. Chaque tarif est un paiement unique.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {V3_ESSENTIAL_PACKS.map((pack) => (
            <V3UpsellPromoCard
              key={pack.id}
              figureId={pack.id}
              title={pack.title}
              price={pack.price}
              description={pack.desc}
              to={pack.to}
              priceId={pack.priceId}
              packId={pack.id}
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
              to={pack.to}
              priceId={pack.priceId}
              packId={pack.id}
              badge={pack.badge}
              included={hasFull}
            />
          ))}
        </div>

        {/* Bandeau forfait Édition — tout inclus */}
        <section
          className="mt-12 rounded-3xl p-6 md:p-8"
          style={{ background: 'var(--v3-cream)', border: '1px solid var(--v3-line)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="v3-serif text-2xl font-bold" style={{ color: 'var(--v3-ink)' }}>
                Tout inclus : {edition?.name ?? 'Édition'}
              </h2>
              <p className="mt-1 text-sm" style={{ color: 'var(--v3-muted)' }}>
                {edition ? `${formatPrice(edition.monthlyPrice)} / mois` : '47 € / mois'} — l'ensemble des
                compléments ci-dessus. Achat séparé toujours possible au tarif affiché.
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
