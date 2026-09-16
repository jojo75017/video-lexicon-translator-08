import { Link } from 'react-router-dom';
import { ArrowRight, Gem } from 'lucide-react';
import { V3_ADDON_LIST, V3_ADDONS_TOTAL_VALUE, V3_PLANS, formatPrice } from '@/data/v3Pricing';
import V3UpsellPromoCard from '@/components/v3public/V3UpsellPromoCard';
import useV3Entitlement from '@/hooks/useV3Entitlement';
import BdComicNewsBanner from '@/components/bd/BdComicNewsBanner';

/** /v3/upsells — Gros compléments premium proposés séparément des forfaits. */
export default function V3UpsellsPage() {
  const edition = V3_PLANS[V3_PLANS.length - 1];
  const { hasFull, hasBase } = useV3Entitlement();

  return (
    <>
      <title>Compléments & options V3 — Ebookstudio</title>
      <meta
        name="description"
        content="Ajoutez la direction éditoriale, les traductions relues, l'audiolivre premium ou l'accompagnement à votre forfait."
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
            relues, version audio premium, accompagnement. Chaque option s'ajoute en un paiement unique.
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
            {V3_ADDON_LIST.map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-3 px-4 py-3" style={{ background: 'var(--v3-surface)' }}>
                <span className="text-xs font-semibold" style={{ color: 'var(--v3-ink)' }}>{item.title}</span>
                <strong className="shrink-0 text-sm" style={{ color: 'var(--v3-gold-600)' }}>{formatPrice(item.price)}</strong>
              </div>
            ))}
          </div>
          <p className="px-4 py-3 text-xs font-semibold" style={{ color: 'var(--v3-muted)', background: 'var(--v3-cream)' }}>
            Valeur cumulée des compléments : {formatPrice(V3_ADDONS_TOTAL_VALUE)} — proposés séparément des forfaits.
            Les anciens clients V2 conservent leur remise de 20 % à vie.
          </p>
        </section>

        {/* Compléments (V3_ADDON_LIST) — encarts personnifiés */}
        <h2 className="v3-serif mb-4 text-xl font-bold" style={{ color: 'var(--v3-ink)' }}>
          Compléments à la carte
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {V3_ADDON_LIST.map((addon) => {
            const included = addon.inEdition && (hasFull || hasBase);
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


        {/* Rappel du forfait Édition */}
        <section
          className="mt-12 rounded-3xl p-6 md:p-8"
          style={{ background: 'var(--v3-cream)', border: '1px solid var(--v3-line)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="v3-serif text-2xl font-bold" style={{ color: 'var(--v3-ink)' }}>
                Les studios professionnels : {edition?.name ?? 'Édition'}
              </h2>
              <p className="mt-1 text-sm" style={{ color: 'var(--v3-muted)' }}>
                {edition ? `${formatPrice(edition.monthlyPrice)} / mois` : '47 € / mois'} — livres illimités,
                Cover Studio Pro, BD Studio Pro et outils KDP avancés. Les compléments ci-dessus restent à la carte.
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
