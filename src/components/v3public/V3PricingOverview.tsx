import { useState } from 'react';
import { ArrowRight, Check, Crown, Feather, Gift, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import { V3_LIFETIME_OFFERS, formatPrice, V2_ACCESS_NOTE } from '@/data/v3Pricing';
import { Button } from '@/components/ui/button';
import V3UpsellCheckout from '@/components/admin/V3UpsellCheckout';
import type { V3UpsellPack, V3PackId } from '@/data/roadmapV3';

export default function V3PricingOverview({ baseAvailable = true }: { baseAvailable?: boolean }) {
  const [checkout, setCheckout] = useState<V3UpsellPack | null>(null);
  const { base, pro, cover } = V3_LIFETIME_OFFERS;
  const openPro = () => setCheckout({ id: 'edition_pro' as V3PackId, title: pro.title, desc: 'Les studios professionnels en complément de votre accès.', price: pro.price, priceId: pro.priceId, to: '/v3', modules: [] });
  return (
    <section className="v3-shell py-7" aria-labelledby="v3-offers-title">
      <header className="mb-7">
        <p className="text-xs font-bold uppercase text-primary">Paiement unique · Sans reconduction</p>
        <h2 id="v3-offers-title" className="mt-2 text-3xl font-semibold text-foreground">Votre accès à vie, vos options à la carte</h2>
        <p className="mt-3 text-muted-foreground">Commencez à 47 €. Ajoutez les studios professionnels uniquement si vous en avez besoin.</p>
      </header>
      <div className="grid gap-5 lg:grid-cols-3">
        <article className="flex flex-col rounded-lg border bg-card p-6 text-card-foreground">
          <Feather className="h-6 w-6 text-primary" />
          <h3 className="mt-3 text-xl font-semibold">{base.title}</h3>
          <p className="mt-4 text-3xl font-bold">{formatPrice(base.price)}</p>
          <p className="text-sm text-muted-foreground">Un seul paiement pour votre accès</p>
          <ul className="my-5 flex-1 space-y-3">{base.features.map(item => <li key={item} className="flex gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>)}</ul>
          {baseAvailable ? <Button asChild><Link to="/commander">Voir l’offre à 47 € <ArrowRight /></Link></Button> : <p className="text-sm text-muted-foreground">Le contingent de lancement est fermé. Aucune nouvelle commande à 47 € n’est ouverte pour le moment.</p>}
        </article>
        <article className="flex flex-col rounded-lg border-2 border-primary bg-card p-6 text-card-foreground">
          <Crown className="h-6 w-6 text-primary" />
          <h3 className="mt-3 text-xl font-semibold">{pro.title}</h3>
          <p className="mt-4 text-3xl font-bold">+ {formatPrice(pro.price)}</p>
          <p className="text-sm text-muted-foreground">Option facultative · paiement unique</p>
          <ul className="my-5 flex-1 space-y-3">{pro.features.map(item => <li key={item} className={item.includes('Cover Studio') ? 'flex gap-2 rounded-md bg-primary px-3 py-2 text-sm font-bold text-primary-foreground' : 'flex gap-2 text-sm'}>{item.includes('Cover Studio') ? <Palette className="h-4 w-4 shrink-0" /> : <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />}{item}</li>)}</ul>
          <Button onClick={openPro}>Ajouter le Pack Édition Pro</Button>
          <p className="mt-3 text-xs text-muted-foreground">Le Pack Pro ne remplace pas l’accès de base. Les autres options restent séparées.</p>
        </article>
        <article className="flex flex-col rounded-lg border bg-card p-6 text-card-foreground">
          <Gift className="h-6 w-6 text-primary" />
          <h3 className="mt-3 text-xl font-semibold">Déjà client ? Vous gardez vos droits</h3>
          <p className="mt-4 text-sm text-muted-foreground">Vos achats à vie et vos abonnements déjà souscrits ne changent pas. Aucun nouvel achat n’est obligatoire.</p>
          <p className="mt-4 text-sm">{V2_ACCESS_NOTE}</p>
          <p className="mt-4 text-sm">La couverture incluse reste accessible aux anciens clients et à Plume. Les acheteurs du Pro et les abonnés Édition/Maison conservent le Pro.</p>
          <p className="mt-4 text-sm">Besoin uniquement du Pro pour les couvertures ? {cover.title} : {formatPrice(cover.price)}, sans abonnement.</p>
          <Button asChild variant="outline" className="mt-5"><Link to="/v3/upsells">Voir les compléments & options <ArrowRight /></Link></Button>
          <Button asChild variant="ghost" className="mt-2"><Link to="/v3/compte">Mon accès actuel</Link></Button>
        </article>
      </div>
      {checkout && <V3UpsellCheckout pack={checkout} onClose={() => setCheckout(null)} />}
    </section>
  );
}
