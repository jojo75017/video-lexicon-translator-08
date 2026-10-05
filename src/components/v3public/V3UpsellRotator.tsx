import V3UpsellPromoCard from '@/components/v3public/V3UpsellPromoCard';
import { V3_ADDON_LIST } from '@/data/v3Pricing';

const HOME_ADDON_KEYS = ['audio_single', 'publishers', 'serenity'];

export default function V3UpsellRotator() {
  const picks = HOME_ADDON_KEYS
    .map((key) => V3_ADDON_LIST.find((addon) => addon.key === key))
    .filter((addon): addon is (typeof V3_ADDON_LIST)[number] => Boolean(addon));

  return (
    <section className="v3-shell pt-8">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.24em]"
            style={{ color: 'var(--v3-joy-orange-600)' }}
          >
            Ils ont boosté leur livre
          </p>
          <h2 className="v3-serif text-2xl font-bold" style={{ color: 'var(--v3-joy-ink)' }}>
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
