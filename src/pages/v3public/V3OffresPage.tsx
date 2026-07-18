import { useState } from 'react';
import { Check, Sparkles, Crown, Feather } from 'lucide-react';
import V3SubscribeCheckout from '@/components/v3public/V3SubscribeCheckout';

type Tier = {
  id: string;
  name: string;
  price: string;
  period: string;
  tagline: string;
  books: string;
  highlight?: boolean;
  icon: React.ReactNode;
  features: string[];
  cta: string;
  priceId: string;
};

const TIERS: Tier[] = [
  {
    id: 'debutant',
    name: 'Débutant',
    price: '6,99 €',
    period: '/ mois',
    tagline: 'Pour découvrir et publier son premier livre.',
    books: '5 livres / mois',
    icon: <Feather className="w-5 h-5" />,
    features: [
      '15 agents éditoriaux (Studio complet)',
      '4 agents Croissance essentiels',
      'Couverture IA incluse',
      'Export DOCX & PDF',
      'Jusqu’à 30 chapitres par livre',
      'Support par email',
    ],
    cta: 'Choisir Débutant',
    priceId: 'v3_debutant_monthly',
  },
  {
    id: 'expert',
    name: 'Expert',
    price: '9,99 €',
    period: '/ mois',
    tagline: 'Le meilleur rapport puissance / prix.',
    books: '10 livres / mois',
    highlight: true,
    icon: <Sparkles className="w-5 h-5" />,
    features: [
      'Tout le plan Débutant',
      '10 agents Croissance (SEO, mots-clés, A+)',
      'Livres spéciaux (Cuisine, Voyage, BD…)',
      'Cover Studio Pro (variations IA)',
      'Jusqu’à 45 chapitres par livre',
      'Support prioritaire',
    ],
    cta: 'Choisir Expert',
    priceId: 'v3_expert_monthly',
  },
  {
    id: 'auteur',
    name: 'Auteur',
    price: '59 €',
    period: '/ mois',
    tagline: 'La suite complète pour publier sérieusement.',
    books: '20 livres / mois',
    icon: <Crown className="w-5 h-5" />,
    features: [
      'Tout le plan Expert',
      '15 agents Croissance (suite complète)',
      'Amazon Spy — analyse de niche',
      'Sélection maisons d’édition',
      'Jusqu’à 60 chapitres par livre',
      'Accès anticipé aux nouveautés',
    ],
    cta: 'Choisir Auteur',
    priceId: 'v3_auteur_monthly',
  },
];

const UPSELLS = [
  'Sélection maisons d’édition',
  'A+ Content Amazon',
  'Look Inside Optimizer',
  'BookBub Ad Builder',
  'Newsletter Auteur',
  'Relecture éditoriale humaine',
];

export default function V3OffresPage() {
  const [checkout, setCheckout] = useState<{ priceId: string; planName: string } | null>(null);
  return (
    <div className="v3pub">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF6E8] via-white to-[#FFE3B8]" />
        <div className="relative max-w-6xl mx-auto px-5 md:px-8 pt-16 pb-10 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-[var(--v3-orange)]/10 text-[var(--v3-orange-600)] text-xs font-semibold tracking-wider uppercase">
            Lancement — 1er octobre 2026
          </span>
          <h1 className="v3-serif text-4xl md:text-5xl font-bold mt-4 text-[var(--v3-ink)]">
            Trois offres. Un seul studio de 30 agents.
          </h1>
          <p className="mt-4 text-[var(--v3-muted)] max-w-2xl mx-auto">
            Choisissez le rythme qui vous correspond. Sans engagement, résiliable en un clic.
            Tous les plans incluent le Studio Éditorial complet (15 agents) et la génération de couverture IA.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-10">
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((t) => (
            <div
              key={t.id}
              className={`relative rounded-2xl border p-6 flex flex-col bg-white transition-all hover:-translate-y-1 hover:shadow-xl ${
                t.highlight
                  ? 'border-[var(--v3-orange)] shadow-lg ring-2 ring-[var(--v3-orange)]/30'
                  : 'border-black/10'
              }`}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[var(--v3-orange)] text-white text-xs font-semibold shadow">
                  Le plus choisi
                </span>
              )}
              <div className="flex items-center gap-2 text-[var(--v3-orange)]">
                {t.icon}
                <h3 className="v3-serif text-2xl font-bold text-[var(--v3-ink)]">{t.name}</h3>
              </div>
              <p className="mt-1 text-sm text-[var(--v3-muted)]">{t.tagline}</p>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-[var(--v3-ink)]">{t.price}</span>
                <span className="text-sm text-[var(--v3-muted)]">{t.period}</span>
              </div>
              <div className="mt-1 text-sm font-semibold text-[var(--v3-orange-600)]">{t.books}</div>

              <ul className="mt-6 space-y-2.5 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[var(--v3-ink)]">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-[var(--v3-orange)]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => setCheckout({ priceId: t.priceId, planName: `${t.name} — ${t.price}${t.period}` })}
                className={`mt-6 v3-btn justify-center w-full ${
                  t.highlight ? 'v3-btn-primary' : 'v3-btn-outline'
                }`}
              >
                {t.cta}
              </button>
              <p className="mt-2 text-[11px] text-center text-[var(--v3-muted)]">
                Sans engagement — résiliable en 1 clic
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Upsells */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-10">
        <div className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
          <h2 className="v3-serif text-2xl font-bold text-[var(--v3-ink)]">
            Modules premium à la carte
          </h2>
          <p className="mt-1 text-sm text-[var(--v3-muted)]">
            Anciens modules Pack Pro — disponibles en add-on mensuel sur n'importe quel plan.
          </p>
          <div className="mt-5 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {UPSELLS.map((u) => (
              <div
                key={u}
                className="flex items-center gap-2 rounded-xl border border-black/5 bg-[#FFF9EF] px-4 py-3 text-sm"
              >
                <Sparkles className="w-4 h-4 text-[var(--v3-orange)]" />
                <span className="text-[var(--v3-ink)]">{u}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ mini */}
      <section className="max-w-4xl mx-auto px-5 md:px-8 py-12">
        <h2 className="v3-serif text-2xl font-bold text-center text-[var(--v3-ink)]">
          Questions fréquentes
        </h2>
        <div className="mt-6 space-y-3">
          {[
            {
              q: 'Puis-je changer de plan à tout moment ?',
              a: 'Oui, vous pouvez passer d’un plan à l’autre à tout moment depuis votre espace.',
            },
            {
              q: 'Que se passe-t-il si je dépasse mon quota ?',
              a: 'Vous pouvez soit attendre le renouvellement mensuel, soit passer au plan supérieur.',
            },
            {
              q: 'Les livres m’appartiennent-ils ?',
              a: '100 %. Vous conservez tous les droits sur vos manuscrits, couvertures et exports.',
            },
          ].map((f) => (
            <details
              key={f.q}
              className="rounded-xl border border-black/10 bg-white px-5 py-4 group"
            >
              <summary className="cursor-pointer font-semibold text-[var(--v3-ink)] flex justify-between items-center">
                {f.q}
                <span className="text-[var(--v3-orange)] group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-2 text-sm text-[var(--v3-muted)]">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
