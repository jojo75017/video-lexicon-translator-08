import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, Palette, Sparkles } from 'lucide-react';
import V3UpsellCheckout from '@/components/admin/V3UpsellCheckout';
import type { V3UpsellPack, V3PackId } from '@/data/roadmapV3';

/**
 * OTO affichée juste après l'achat 47 € : Pack Édition Pro 97 €,
 * puis version allégée Cover Studio Pro 67 € si le client refuse.
 * « Non merci » mène toujours à la page de confirmation d'achat.
 */
const PRO_FEATURES = [
  'Cover Studio KDP Pro (valeur 67 €)',
  'Outils KDP avancés : Amazon Spy, mots-clés Pro, audit complet',
  'BD Studio et BookPerfect',
  'Livres illimités et chapitres plus longs',
  'Accès à vie, sans abonnement',
];

const EDITION_PRO: V3UpsellPack = {
  id: 'edition_pro' as V3PackId,
  title: 'Pack Édition Pro — Accès à vie',
  desc: 'Tous les studios professionnels, en un seul paiement.',
  price: 97,
  priceId: 'v3_pack_edition_pro_once',
  to: '/v3',
  modules: [],
};

const COVER_PRO: V3UpsellPack = {
  id: 'cover_studio_pro' as V3PackId,
  title: 'Cover Studio KDP Pro — Accès à vie',
  desc: 'Le studio de couverture professionnel.',
  price: 67,
  priceId: 'v3_pack_cover_studio_pro_once',
  to: '/v3/studio-v4',
  modules: [],
};

export default function V3OtoEditionProPage() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const [step, setStep] = useState<'pro' | 'cover'>('pro');
  const [checkout, setCheckout] = useState<V3UpsellPack | null>(null);
  const finish = () => {
    window.location.href = `/paiement-succes${sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : ''}`;
  };

  const isPro = step === 'pro';

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <title>Offre unique réservée aux nouveaux membres — EbookStudio</title>
      <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-6 shadow-lg md:p-10">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Votre commande est validée · Offre unique, visible une seule fois
        </p>
        <h1 className="mt-3 text-center text-3xl font-bold text-foreground md:text-4xl">
          {isPro ? 'Passez directement en Édition Pro, à vie' : 'Dernière chance : le Cover Studio Pro seul'}
        </h1>
        <p className="mt-3 text-center text-muted-foreground">
          {isPro
            ? "Ajoutez les studios professionnels à votre accès EbookStudio : 97 € en un seul paiement, sans abonnement."
            : 'Pas besoin de tout ? Gardez au moins le studio de couverture professionnel.'}
        </p>

        {isPro ? (
          <ul className="mt-6 space-y-2">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-foreground">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> {f}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 flex items-center gap-3 rounded-xl bg-muted p-4 text-foreground">
            <Palette className="h-6 w-6 text-primary" />
            Couvertures Kindle et brochées pro, illustrations IA, exports KDP 300 DPI.
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-4xl font-bold text-foreground">
            {isPro ? '97 €' : '67 €'}
            <span className="ml-2 text-base font-medium text-muted-foreground">paiement unique</span>
          </p>
          <button
            type="button"
            onClick={() => setCheckout(isPro ? EDITION_PRO : COVER_PRO)}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-lg font-bold text-primary-foreground transition hover:opacity-90"
          >
            <Sparkles className="h-5 w-5" />
            {isPro ? "Oui, j'ajoute l'Édition Pro à vie" : "Oui, j'ajoute le Cover Studio Pro"}
          </button>
          <button
            type="button"
            onClick={() => (isPro ? setStep('cover') : finish())}
            className="mt-4 text-sm text-muted-foreground underline"
          >
            Non merci, je continue avec mon accès actuel
          </button>
        </div>
      </div>

      {checkout && <V3UpsellCheckout pack={checkout} onClose={() => setCheckout(null)} />}
    </main>
  );
}
