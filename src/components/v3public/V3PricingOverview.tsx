import { useState } from 'react';
import { ArrowRight, Check, Crown, Feather, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { V3_NEW_OFFERS, formatPrice, V2_ACCESS_NOTE } from '@/data/v3Pricing';
import { Button } from '@/components/ui/button';
import V3PackCheckout from '@/components/admin/V3PackCheckout';

/** Offres pour les nouveaux clients : Auteur 97 €/an et Édition à vie 247 €. */
export default function V3PricingOverview(_props: { baseAvailable?: boolean }) {
  const [product, setProduct] = useState<'auteur' | 'edition247' | null>(null);
  const { auteur, edition } = V3_NEW_OFFERS;
  const Card = ({ o, highlight, onBuy, Icon }: { o: typeof auteur | typeof edition; highlight?: boolean; onBuy: () => void; Icon: typeof Feather }) => (
    <article className={`flex flex-col rounded-lg bg-card p-6 text-card-foreground ${highlight ? 'border-2 border-primary' : 'border'}`}>
      <Icon className="h-6 w-6 text-primary" />
      <h3 className="mt-3 text-xl font-semibold">{o.title}</h3>
      <p className="mt-4 text-3xl font-bold">{formatPrice(o.price)} <span className="text-base font-medium text-muted-foreground">{o.period}</span></p>
      <p className="text-sm text-muted-foreground">{o.options.map(x => x.label).join(' · ')}</p>
      <p className="mt-1 text-xs text-muted-foreground">{o.renewal}</p>
      <ul className="my-5 flex-1 space-y-3">{o.features.map(item => <li key={item} className="flex gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>)}</ul>
      <p className="mb-4 text-xs text-muted-foreground">{o.paidOptions}</p>
      <Button onClick={onBuy}>Choisir {o.title} <ArrowRight /></Button>
    </article>
  );
  return (
    <section className="v3-shell py-7" aria-labelledby="v3-offers-title">
      <header className="mb-7">
        <p className="text-xs font-bold uppercase text-primary">Paiement en 1, 3 ou 6 fois</p>
        <h2 id="v3-offers-title" className="mt-2 text-3xl font-semibold text-foreground">Deux offres claires pour écrire et publier</h2>
        <p className="mt-3 text-muted-foreground">Un accès annuel pour démarrer, ou l'accès à vie avec tous les studios professionnels.</p>
      </header>
      <div className="grid gap-5 lg:grid-cols-3">
        <Card o={auteur} Icon={Feather} onBuy={() => setProduct('auteur')} />
        <Card o={edition} Icon={Crown} highlight onBuy={() => setProduct('edition247')} />
        <article className="flex flex-col rounded-lg border bg-card p-6 text-card-foreground">
          <Gift className="h-6 w-6 text-primary" />
          <h3 className="mt-3 text-xl font-semibold">Déjà client ? Vous gardez vos droits</h3>
          <p className="mt-4 text-sm text-muted-foreground">Votre accès à vie à 47 €, vos achats et vos abonnements déjà souscrits ne changent pas. Aucun nouvel achat n'est obligatoire.</p>
          <p className="mt-4 text-sm">{V2_ACCESS_NOTE}</p>
          <Button asChild variant="outline" className="mt-5"><Link to="/v3/upsells">Voir les compléments & options <ArrowRight /></Link></Button>
          <Button asChild variant="ghost" className="mt-2"><Link to="/v3/compte">Mon accès actuel</Link></Button>
        </article>
      </div>
      <V3PackCheckout open={product !== null} onClose={() => setProduct(null)} product={product ?? 'auteur'} />
    </section>
  );
}
