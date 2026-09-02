import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Palette, Mail } from 'lucide-react';
import SeoHead from '@/components/funnel/SeoHead';
import { BD_COMIC_OFFER } from '@/data/bdComicOffer';

/** Confirmation du tunnel BD — mène au dashboard /bd-studio. */
export default function BDMerciPage() {
  const [params] = useSearchParams();
  const isPro = params.get('pro') === '1';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SeoHead
        title="Votre Studio BD & Jeunesse est prêt"
        description="Votre accès au Studio BD & Jeunesse est ouvert. Créez votre premier livre illustré dès maintenant."
        canonical="/bd-merci"
        noindex
      />

      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
        <h1 className="mt-5 text-3xl font-black sm:text-4xl">
          {isPro ? 'Version Pro activée — bienvenue !' : 'Votre studio est ouvert !'}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {isPro
            ? `Votre Studio BD & Jeunesse Pro (${BD_COMIC_OFFER.price} € + ${BD_COMIC_OFFER.proUpsell.price} €) est actif avec les illustrations étendues et les styles Pro.`
            : `Votre Studio BD & Jeunesse (${BD_COMIC_OFFER.price} €, accès à vie) est actif.`}
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-left">
          <h2 className="text-base font-bold">Vos prochaines étapes</h2>
          <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>1. Créez vos personnages et choisissez un style de dessin.</li>
            <li>2. Laissez l’IA écrire le scénario et illustrer chaque case.</li>
            <li>3. Exportez vos fichiers prêts pour Amazon KDP.</li>
          </ol>
        </div>

        <Link
          to="/bd-studio"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          <Palette className="h-4 w-4" /> Ouvrir mon Studio BD <ArrowRight className="h-4 w-4" />
        </Link>

        <p className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground">
          <Mail className="h-3.5 w-3.5" />
          Une question ? Écrivez à contact@ebookstudio.fr
        </p>
      </main>
    </div>
  );
}
