import { ArrowRight, Check, Crown, Feather, Rocket, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import V3SubscribeCheckout from '@/components/v3public/V3SubscribeCheckout';
import { V2_ACCESS_NOTE, V3_MONTHLY_OFFERS } from '@/data/v3Pricing';
import { Button } from '@/components/ui/button';
import { V3StarterKdpPilotBanner } from '@/components/v3public/V3StarterKdpPilotBanner';

/**
 * Formule mensuelle validée par Georges (1er novembre 2026) :
 * Plan Débutant 19 €/mois · Plan Auteur 29 €/mois · Plan Édition VIP 59 €/mois.
 * Les formules à vie (27 € / 97 € / 197 €) restent vendables par leurs tunnels
 * existants ; les droits des anciens clients sont sanctuarisés.
 */
const ICONS = { debutant: Rocket, auteur: Feather, vip: Crown } as const;
const BADGES: Record<string, string> = {
  debutant: 'Pour démarrer',
  auteur: 'Le plus choisi',
  vip: 'Studio pro',
};

const MONTHLY_PRICE_IDS = {
  debutant: 'v3m_debutant_monthly',
  auteur: 'v3m_auteur_monthly',
  vip: 'v3m_vip_monthly',
} as const;

export default function V3PricingOverview(_props: { baseAvailable?: boolean }) {
  const [checkout, setCheckout] = useState<{ priceId: string; name: string } | null>(null);
  return (
    <section className="v3-shell py-7" aria-labelledby="v3-offers-title">
      <header className="mb-7">
        <p className="text-xs font-bold uppercase text-primary">Formule mensuelle, sans engagement</p>
        <h2 id="v3-offers-title" className="mt-2 text-3xl font-semibold text-foreground">Trois formules pour écrire et publier, dès 19 €/mois</h2>
        <p className="mt-3 text-muted-foreground">Débutant pour découvrir, Auteur pour aller plus loin, Édition VIP pour les studios professionnels. Chaque formule inclut tout le contenu des formules précédentes.</p>
      </header>
      <div className="grid gap-5 lg:grid-cols-3">
        {V3_MONTHLY_OFFERS.map((p) => {
          const Icon = ICONS[p.id];
          const highlight = p.id === 'auteur';
          return (
            <article key={p.id} className={`relative flex flex-col rounded-lg bg-card p-6 text-card-foreground ${highlight ? 'border-2 border-primary' : 'border'}`}>
              <div className="flex items-center justify-between gap-2">
                <Icon className="h-6 w-6 text-primary" />
                <span className="text-xs font-bold uppercase text-primary">{BADGES[p.id]}</span>
              </div>
              <h3 className="mt-3 text-xl font-semibold">{p.name}</h3>
              <p className="mt-4 text-3xl font-bold">{p.price} € <span className="text-base font-medium text-muted-foreground">/mois</span></p>
              <p className="mt-1 text-xs text-muted-foreground">
                {p.booksPerMonth === null ? 'Livres illimités' : `${p.booksPerMonth} livres par mois`} · {p.coversPerMonth} couvertures par mois
              </p>
              <ul className="my-5 flex-1 space-y-3">
                {p.features.map((item) => (
                  <li key={item} className="flex gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>
                ))}
              </ul>
              <Button onClick={() => setCheckout({ priceId: MONTHLY_PRICE_IDS[p.id], name: `${p.name} — ${p.price} €/mois` })}>
                S'abonner — {p.price} €/mois <ArrowRight />
              </Button>
              <Button asChild variant="ghost" className="mt-2"><Link to="/v3/plans">Voir tout ce qui est inclus</Link></Button>
            </article>
          );
        })}
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Sans engagement : vous pouvez arrêter à tout moment, l'accès reste ouvert jusqu'à la fin du mois payé.
        En cas d'impayé, l'accès est simplement mis en pause — vous le retrouvez dès le règlement.
      </p>
      {checkout && (
        <V3SubscribeCheckout priceId={checkout.priceId} planName={checkout.name} onClose={() => setCheckout(null)} />
      )}
      <V3StarterKdpPilotBanner />
      <section className="mt-6 border-y py-5 text-foreground">
        <Gift className="h-6 w-6 text-primary" />
        <h3 className="mt-3 text-xl font-semibold">Déjà client ? Vous gardez vos droits</h3>
        <p className="mt-4 text-sm text-muted-foreground">Vos achats, vos formules à vie et vos abonnements déjà souscrits ne changent pas. Aucun nouvel achat n'est obligatoire.</p>
        <p className="mt-4 text-sm">{V2_ACCESS_NOTE}</p>
        <Button asChild variant="outline" className="mt-5"><Link to="/v3/upsells">Voir les compléments & options <ArrowRight /></Link></Button>
        <Button asChild variant="ghost" className="mt-2"><Link to="/v3/compte">Mon accès actuel</Link></Button>
      </section>
    </section>
  );
}
