import { useState } from 'react';
import { Check, Sparkles, Crown, Feather, Info, X } from 'lucide-react';
import V3SubscribeCheckout from '@/components/v3public/V3SubscribeCheckout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

type Billing = 'monthly' | 'annual';

type Tier = {
  id: string;
  name: string;
  tagline: string;
  books: string;
  highlight?: boolean;
  icon: React.ReactNode;
  features: string[];
  monthly: { price: string; priceId: string };
  annual: { price: string; strike: string; priceId: string; perMonth: string };
};

const TIERS: Tier[] = [
  {
    id: 'debutant',
    name: 'Débutant',
    tagline: 'Lisez et publiez vos premières histoires.',
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
    monthly: { price: '6,99 €', priceId: 'v3_debutant_monthly' },
    annual: { price: '69,00 €', strike: '83,88 €', perMonth: '5,75 €/mois', priceId: 'v3_debutant_annual' },
  },
  {
    id: 'expert',
    name: 'Expert',
    tagline: 'Créez des histoires sur-mesure.',
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
    monthly: { price: '9,99 €', priceId: 'v3_expert_monthly' },
    annual: { price: '79,00 €', strike: '119,88 €', perMonth: '6,58 €/mois', priceId: 'v3_expert_annual' },
  },
  {
    id: 'auteur',
    name: 'Auteur',
    tagline: 'Publiez vos propres livres, sérieusement.',
    books: 'Livres illimités / mois',
    icon: <Crown className="w-5 h-5" />,
    features: [
      'Tout le plan Expert',
      '15 agents Croissance (suite complète)',
      'Amazon Spy — analyse de niche',
      'Sélection maisons d’édition',
      'Jusqu’à 60 chapitres par livre',
      'Accès anticipé aux nouveautés',
    ],
    monthly: { price: '59,00 €', priceId: 'v3_auteur_monthly' },
    annual: { price: '597,00 €', strike: '708,00 €', perMonth: '49,75 €/mois', priceId: 'v3_auteur_annual' },
  },
];

type Upsell = {
  id: string;
  name: string;
  price: string;
  suffix: string;
  priceId?: string;
  href?: string;
  desc: string;
  badge?: string;
};

const UPSELLS: Upsell[] = [
  {
    id: 'bookperfect',
    name: 'BookPerfect AI — Directeur éditorial',
    price: '67 €',
    suffix: '· au lieu de 97 €',
    href: '/bookperfect-offre',
    badge: 'Lancement',
    desc: "Analyse votre roman Word chapitre par chapitre : traces d'IA, orthographe, style, contrôle Amazon KDP et export Word corrigé — sans jamais altérer votre texte original.",
  },
  { id: 'selection', name: 'Sélection maisons d’édition', price: '19 €', suffix: '+ taxes / mois', priceId: 'v3_upsell_selection_month', desc: 'Trouvez les éditeurs susceptibles de publier votre livre.' },
  { id: 'aplus', name: 'A+ Content Amazon', price: '9 €', suffix: '+ taxes / mois', priceId: 'v3_upsell_aplus_month', desc: 'Modules visuels optimisés pour vos fiches KDP.' },
  { id: 'lookinside', name: 'Look Inside Optimizer', price: '7 €', suffix: '+ taxes / mois', priceId: 'v3_upsell_lookinside_month', desc: 'Optimise l’aperçu Amazon des premières pages.' },
  { id: 'bookbub', name: 'BookBub Ad Builder', price: '9 €', suffix: '+ taxes / mois', priceId: 'v3_upsell_bookbub_month', desc: 'Générateur de visuels publicitaires BookBub.' },
  { id: 'newsletter', name: 'Newsletter Auteur', price: '12 €', suffix: '+ taxes / mois', priceId: 'v3_upsell_newsletter_month', desc: 'Séquences email prêtes à l’emploi.' },
  { id: 'relecture', name: 'Relecture éditoriale humaine', price: '49 €', suffix: '+ taxes / livre', priceId: 'v3_upsell_relecture_once', desc: 'Correction professionnelle par un relecteur humain.' },
];

export default function V3OffresPage() {
  const [billing, setBilling] = useState<Billing>('monthly');
  const [checkout, setCheckout] = useState<{ priceId: string; planName: string } | null>(null);

  return (
    <div className="v3pub">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF6E8] via-white to-[#FFE3B8]" />
        <div className="relative max-w-6xl mx-auto px-5 md:px-8 pt-16 pb-8 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-[var(--v3-orange)]/10 text-[var(--v3-orange-600)] text-xs font-semibold tracking-wider uppercase">
            Lancement — 1er octobre 2026
          </span>
          <h1 className="v3-serif text-4xl md:text-5xl font-bold mt-4 text-[var(--v3-ink)]">
            Trois offres. Un seul studio de 30 agents.
          </h1>
          <p className="mt-4 text-[var(--v3-muted)] max-w-2xl mx-auto">
            Choisissez le rythme qui vous correspond. Sans engagement, résiliable en un clic.
            Studio Éditorial complet (15 agents) et couverture IA inclus dans tous les plans.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center gap-1 rounded-full bg-white border border-black/10 p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setBilling('monthly')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                billing === 'monthly' ? 'bg-[var(--v3-orange)] text-white' : 'text-[var(--v3-ink)]'
              }`}
            >
              Mensuel
            </button>
            <button
              type="button"
              onClick={() => setBilling('annual')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${
                billing === 'annual' ? 'bg-[var(--v3-orange)] text-white' : 'text-[var(--v3-ink)]'
              }`}
            >
              Annuel
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                billing === 'annual' ? 'bg-white text-[var(--v3-orange)]' : 'bg-[var(--v3-orange)]/10 text-[var(--v3-orange-600)]'
              }`}>
                -17%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-10">
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((t) => {
            const p = billing === 'monthly' ? t.monthly : t.annual;
            return (
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

                <div className="mt-5">
                  {billing === 'annual' && (
                    <div className="text-sm text-[var(--v3-muted)] line-through">{t.annual.strike}</div>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-[var(--v3-ink)]">{p.price}</span>
                    <span className="text-sm text-[var(--v3-muted)]">
                      + taxes {billing === 'monthly' ? '/ mois' : '/ an'}
                    </span>
                  </div>
                  {billing === 'annual' && (
                    <div className="text-xs text-[var(--v3-orange-600)] font-semibold mt-1">
                      soit {t.annual.perMonth}
                    </div>
                  )}
                </div>
                <div className="mt-2 text-sm font-semibold text-[var(--v3-orange-600)]">{t.books}</div>

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
                  onClick={() =>
                    setCheckout({
                      priceId: p.priceId,
                      planName: `${t.name} — ${p.price} ${billing === 'monthly' ? '/ mois' : '/ an'}`,
                    })
                  }
                  className={`mt-6 v3-btn justify-center w-full ${
                    t.highlight ? 'v3-btn-primary' : 'v3-btn-outline'
                  }`}
                >
                  Choisir {t.name} — {p.price} {billing === 'monthly' ? '/ mois' : '/ an'}
                </button>
                <p className="mt-2 text-[11px] text-center text-[var(--v3-muted)]">
                  Sans engagement — résiliable en 1 clic
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Upsells */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-10">
        <div className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
          <h2 className="v3-serif text-2xl font-bold text-[var(--v3-ink)]">
            Modules premium à la carte
          </h2>
          <p className="mt-1 text-sm text-[var(--v3-muted)]">
            Ajoutez ces modules à n’importe quel plan. Résiliables à tout moment.
          </p>
          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {UPSELLS.map((u) => (
              <div
                key={u.id}
                className="relative flex flex-col rounded-xl border border-black/10 bg-[#FFF9EF] p-4 hover:shadow-md transition-shadow"
              >
                {u.badge && (
                  <span className="absolute -top-2 right-3 rounded-full bg-[var(--v3-orange)] px-2 py-0.5 text-[10px] font-bold text-white shadow">
                    {u.badge}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--v3-orange)]" />
                  <h4 className="font-semibold text-[var(--v3-ink)]">{u.name}</h4>
                </div>
                <p className="mt-1 text-xs text-[var(--v3-muted)] flex-1">{u.desc}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="text-sm">
                    <span className="text-lg font-bold text-[var(--v3-ink)]">{u.price}</span>
                    <span className="text-[var(--v3-muted)] text-xs"> {u.suffix}</span>
                  </div>
                  {u.href ? (
                    <a href={u.href} className="v3-btn v3-btn-primary text-xs px-3 py-1.5 whitespace-nowrap">
                      Découvrir — {u.price}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        u.priceId &&
                        setCheckout({ priceId: u.priceId, planName: `${u.name} — ${u.price} ${u.suffix}` })
                      }
                      className="v3-btn v3-btn-outline text-xs px-3 py-1.5 whitespace-nowrap"
                    >
                      Ajouter — {u.price}
                    </button>
                  )}
                </div>
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
              q: 'Mensuel ou annuel : quelle différence ?',
              a: 'L’annuel vous fait économiser environ 17% — soit près de 2 mois offerts sur chaque plan.',
            },
            {
              q: 'Que se passe-t-il si je dépasse mon quota ?',
              a: 'Vous pouvez attendre le renouvellement mensuel ou passer au plan supérieur en un clic.',
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

      {checkout && (
        <V3SubscribeCheckout
          priceId={checkout.priceId}
          planName={checkout.planName}
          onClose={() => setCheckout(null)}
        />
      )}
    </div>
  );
}
