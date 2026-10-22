import { ArrowRight, Check, Crown, Feather, Gift, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { V2_ACCESS_NOTE } from '@/data/v3Pricing';
import { Button } from '@/components/ui/button';

/**
 * Les 3 formules validées par Georges (22/10/2026) :
 * Starter 27 € à vie · Auteur 97 € (paiement unique) · Édition 197 € à vie.
 *
 * Paiements Stripe validés : comptant ou 2/3 fois pour Auteur et Édition.
 */
const PLANS = [
  {
    name: 'EbookStudio Starter',
    price: '27 €',
    period: 'à vie',
    note: 'Un seul paiement, sans abonnement.',
    Icon: Rocket,
    highlight: false,
    badge: 'Pour démarrer',
    features: [
      'Livres illimités',
      'Rédaction guidée et sommaire',
      'Exports PDF, Word (DOCX) et EPUB',
      'Couverture ebook simple 2D',
      'Fiche KDP de base et guide pas à pas',
      'Traducteur 10 langues',
      '5 niches Amazon offertes',
    ],
    cta: { label: 'Je prends Starter à 27 €', to: '/paiement-offre?plan=starter27_1x', external: false },
    secondary: { label: 'Découvrir Starter et les 5 niches offertes', to: '/starter' },
  },
  {
    name: 'EbookStudio Auteur',
    price: '97 €',
    period: 'paiement unique',
    note: 'Tout Starter, plus les outils d’auteur.',
    Icon: Feather,
    highlight: true,
    badge: 'Le plus choisi',
    features: [
      'Tout le plan Starter',
      'Je raconte un livre (dialogue avec l’IA)',
      'BD Studio et livres spéciaux',
      'Correction éditoriale et HumanizeAI',
      'VC Books — livres humoristiques (bientôt)',
      'KDP étranger (publication multi-pays)',
      'Recherche de niches avancée',
    ],
    cta: { label: 'Acheter Auteur à 97 €', to: '/paiement-offre?plan=auteur97_1x', external: false },
    secondary: { label: 'Comparer les 3 plans', to: '/v3/plans' },
  },
  {
    name: 'EbookStudio Édition',
    price: '197 €',
    period: 'à vie',
    note: 'Tout Auteur, plus les studios professionnels.',
    Icon: Crown,
    highlight: false,
    badge: 'Studio pro',
    features: [
      'Tout le plan Auteur',
      'Studio Couverture Broché KDP (tranche, 4e de couv., PDF 300 DPI)',
      'Studio Album illustré jeunesse',
      'Audiolivres et voix off',
      'Amazon Spy et audit de marché',
      'Brand Book et outils d’éditeur',
    ],
    cta: { label: 'Acheter Édition à 197 €', to: '/paiement-offre?plan=edition247_1x', external: false },
    secondary: { label: 'Comparer les 3 plans', to: '/v3/plans' },
  },
];

export default function V3PricingOverview(_props: { baseAvailable?: boolean }) {
  return (
    <section className="v3-shell py-7" aria-labelledby="v3-offers-title">
      <header className="mb-7">
        <p className="text-xs font-bold uppercase text-primary">Paiement unique, sans abonnement</p>
        <h2 id="v3-offers-title" className="mt-2 text-3xl font-semibold text-foreground">Trois offres pour écrire et publier, dès 27 € à vie</h2>
        <p className="mt-3 text-muted-foreground">Starter pour découvrir, Auteur pour aller plus loin, Édition pour les studios professionnels. Chaque plan inclut tout le contenu des plans précédents.</p>
      </header>
      <div className="grid gap-5 lg:grid-cols-3">
        {PLANS.map((p) => (
          <article key={p.name} className={`relative flex flex-col rounded-lg bg-card p-6 text-card-foreground ${p.highlight ? 'border-2 border-primary' : 'border'}`}>
            <div className="flex items-center justify-between gap-2">
              <p.Icon className="h-6 w-6 text-primary" />
              <span className="text-xs font-bold uppercase text-primary">{p.badge}</span>
            </div>
            <h3 className="mt-3 text-xl font-semibold">{p.name}</h3>
            <p className="mt-4 text-3xl font-bold">{p.price} <span className="text-base font-medium text-muted-foreground">{p.period}</span></p>
            <p className="mt-1 text-xs text-muted-foreground">{p.note}</p>
            <ul className="my-5 flex-1 space-y-3">
              {p.features.map((item) => (
                <li key={item} className="flex gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>
              ))}
            </ul>
            <Button asChild><Link to={p.cta.to}>{p.cta.label} <ArrowRight /></Link></Button>
            <Button asChild variant="ghost" className="mt-2"><Link to={p.secondary.to}>{p.secondary.label}</Link></Button>
          </article>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Auteur et Édition : paiement comptant, en 2 ou 3 fois, sans frais et sans renouvellement automatique.
      </p>
      <section className="mt-6 border-y py-5 text-foreground">
        <Gift className="h-6 w-6 text-primary" />
        <h3 className="mt-3 text-xl font-semibold">Déjà client ? Vous gardez vos droits</h3>
        <p className="mt-4 text-sm text-muted-foreground">Votre accès à vie à 47 €, vos achats et vos abonnements déjà souscrits ne changent pas. Aucun nouvel achat n'est obligatoire.</p>
        <p className="mt-4 text-sm">{V2_ACCESS_NOTE}</p>
        <Button asChild variant="outline" className="mt-5"><Link to="/v3/upsells">Voir les compléments & options <ArrowRight /></Link></Button>
        <Button asChild variant="ghost" className="mt-2"><Link to="/v3/compte">Mon accès actuel</Link></Button>
      </section>
    </section>
  );
}
