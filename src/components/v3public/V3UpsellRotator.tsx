import { useEffect, useState } from 'react';
import V3UpsellPromoCard from '@/components/v3public/V3UpsellPromoCard';
import { V3_ADDON_LIST } from '@/data/v3Pricing';

/**
 * Bandeau rotatif « Ils ont boosté leur livre » : un encart upsell personnifié
 * affiché en alternance sous le panneau capacités de la page d'accueil V3.
 * Rotation toutes les ~6 s, 3 encarts visibles à la fois parmi le catalogue.
 */
const VISIBLE = 3;
const ROTATION_MS = 6000;

export default function V3UpsellRotator() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (V3_ADDON_LIST.length <= VISIBLE) return;
    const id = window.setInterval(() => {
      setOffset((o) => (o + VISIBLE) % V3_ADDON_LIST.length);
    }, ROTATION_MS);
    return () => window.clearInterval(id);
  }, []);

  // Fenêtre glissante sur le catalogue (boucle circulaire).
  const picks = Array.from({ length: VISIBLE }, (_, i) => {
    const idx = (offset + i) % V3_ADDON_LIST.length;
    return V3_ADDON_LIST[idx];
  });

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 pt-8">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.24em]"
            style={{ color: 'var(--v3-gold-600)' }}
          >
            Ils ont boosté leur livre
          </p>
          <h2 className="v3-serif text-2xl font-bold" style={{ color: 'var(--v3-ink)' }}>
            Un complément, un cas d'usage
          </h2>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {picks.map((addon) => (
          <V3UpsellPromoCard
            key={addon.key}
            figureId={addon.key}
            title={addon.title}
            price={addon.price}
            description={addon.description}
            to={addon.to}
            priceId={addon.priceId}
          />
        ))}
      </div>
    </section>
  );
}
