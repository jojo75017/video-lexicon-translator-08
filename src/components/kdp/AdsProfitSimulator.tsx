import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { simulateAds } from '@/lib/kdp/adsPlan';

export default function AdsProfitSimulator({ daily }: { daily: number }) {
  const [days, setDays] = useState('30');
  const [cpc, setCpc] = useState('');
  const [conversion, setConversion] = useState('');
  const [royalty, setRoyalty] = useState('');
  const result = simulateAds(daily, Number(days), Number(cpc), Number(conversion), Number(royalty));
  const euros = (n: number) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
  return <section className="border-y border-border bg-secondary/30 p-5">
    <h2 className="flex items-center gap-2 text-xl font-semibold"><Calculator className="h-5 w-5 text-primary" /> Simulation de rentabilité</h2>
    <p className="mt-2 text-sm text-muted-foreground">Hypothèses personnelles, pas des résultats mesurés ni une prévision garantie. Le gain KDP est votre redevance après impression, pas le prix de vente.</p>
    <div className="my-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {[
        { id: 'ads-days', label: 'Durée du test (jours)', value: days, change: setDays },
        { id: 'ads-cpc', label: 'Coût par clic supposé (€)', value: cpc, change: setCpc },
        { id: 'ads-conversion', label: 'Achats par clic supposés (%)', value: conversion, change: setConversion },
        { id: 'ads-royalty', label: 'Gain KDP par exemplaire (€)', value: royalty, change: setRoyalty },
      ].map(f => <div key={f.id}><Label htmlFor={f.id}>{f.label}</Label><Input id={f.id} type="number" min="0.01" step="any" value={f.value} onChange={e => f.change(e.target.value)} /></div>)}
    </div>
    {result ? <><div className="grid gap-4 sm:grid-cols-4">
      {[['Dépense théorique', euros(result.spend)], ['Ventes théoriques', result.sales.toFixed(1)], ['Redevances théoriques', euros(result.royalties)], ['Solde après publicité', euros(result.net)]].map(([label, value]) => <div key={label}><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-xl font-semibold">{value}</p></div>)}
    </div><p className="mt-4 text-sm">Seuil d’équilibre : {result.breakEven.toFixed(2)} % d’achats par clic avec ces hypothèses.</p></> : <p className="text-sm text-muted-foreground">Renseignez le budget total et toutes les hypothèses positives pour calculer le scénario.</p>}
  </section>;
}