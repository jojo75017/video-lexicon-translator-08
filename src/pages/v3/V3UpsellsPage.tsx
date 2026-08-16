import { Link } from 'react-router-dom';
import { ArrowRight, Gem } from 'lucide-react';
import V3AddonCards from '@/components/v3public/V3AddonCards';
import { V3_PLANS, formatPrice } from '@/data/v3Pricing';

/** /v3/upsells — Compléments & options, tous inclus dans Studio Pro. */
export default function V3UpsellsPage() {
  const studio = V3_PLANS[V3_PLANS.length - 1];

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
            relues, version audio, accompagnement. Chaque option s'ajoute en un paiement unique.
          </p>
        </header>

        <V3AddonCards title="" />

        <section
          className="mt-10 rounded-3xl p-6 md:p-8"
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
