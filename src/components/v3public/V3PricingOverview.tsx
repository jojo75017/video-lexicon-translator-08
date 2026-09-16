import { ArrowRight, Check, Crown, Feather, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { V3_PLANS, formatPrice } from '@/data/v3Pricing';
import { V2_LEGACY_MODULES } from '@/data/v2LegacyAccess';
import { Button } from '@/components/ui/button';

const cards = [
  {
    key: 'legacy',
    title: 'Déjà abonné',
    price: 'Votre V2 reste acquise',
    note: `${V2_LEGACY_MODULES.length} modules V3 inclus`,
    description: 'Une entrée essentielle dans la V3, sans nouvel achat obligatoire.',
    items: ['Génie et sommaire', 'Correcteur et exports', 'Discussion IA et idées'],
    to: '/v3/migration',
    icon: Gift,
  },
  {
    key: 'plume',
    title: 'Plume',
    price: `${formatPrice(V3_PLANS[0].monthlyPrice)} / mois`,
    note: `${V3_PLANS[0].booksPerMonth} livres par mois`,
    description: V3_PLANS[0].idealFor,
    items: ['40 chapitres · 5 000 mots', 'Kindle, KDP et audiolivre', '10 langues incluses'],
    to: '/v3/forfaits',
    icon: Feather,
  },
  {
    key: 'edition',
    title: 'Édition',
    price: `${formatPrice(V3_PLANS[1].monthlyPrice)} / mois`,
    note: 'Livres illimités',
    description: V3_PLANS[1].idealFor,
    items: ['Cover Studio Pro', 'BD Studio Pro', 'Recherche et KDP avancés'],
    to: '/v3/forfaits',
    icon: Crown,
  },
] as const;

export default function V3PricingOverview() {
  return (
    <section className="v3-shell" aria-labelledby="v3-offers-title">
      <div className="rounded-lg px-5 py-7 md:px-7" style={{ background: 'var(--v3-cream)', border: '1px solid var(--v3-line)' }}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--v3-gold-600)' }}>Trois façons d’entrer dans la V3</p>
            <h2 id="v3-offers-title" className="v3-serif mt-1 text-2xl font-semibold" style={{ color: 'var(--v3-emerald)' }}>
              Choisissez seulement ce dont vous avez besoin
            </h2>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/v3/forfaits">Comparer en détail <ArrowRight /></Link>
          </Button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {cards.map(({ icon: Icon, ...card }) => (
            <article key={card.key} className="flex flex-col rounded-lg bg-background p-5" style={{ border: card.key === 'plume' ? '2px solid var(--v3-gold)' : '1px solid var(--v3-line)' }}>
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" style={{ color: 'var(--v3-gold-600)' }} />
                <h3 className="v3-serif text-lg font-semibold" style={{ color: 'var(--v3-ink)' }}>{card.title}</h3>
              </div>
              <p className="mt-3 text-lg font-bold" style={{ color: 'var(--v3-emerald)' }}>{card.price}</p>
              <p className="text-xs font-semibold" style={{ color: 'var(--v3-gold-600)' }}>{card.note}</p>
              <p className="mt-3 min-h-12 text-xs leading-relaxed" style={{ color: 'var(--v3-muted)' }}>{card.description}</p>
              <ul className="mt-3 space-y-1.5">
                {card.items.map((item) => <li key={item} className="flex gap-2 text-xs"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: 'var(--v3-emerald)' }} />{item}</li>)}
              </ul>
              <Link to={card.to} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--v3-emerald)' }}>
                Voir cette offre <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}