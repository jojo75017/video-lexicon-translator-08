import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Palette, Users, Download } from 'lucide-react';
import { BD_COMIC_OFFER } from '@/data/bdComicOffer';

interface Props {
  /** Version compacte pour les pages de listes (upsells). */
  compact?: boolean;
}

/** Bandeau « Grande nouveauté V4 » — Studio BD & Jeunesse. */
export default function BdComicNewsBanner({ compact = false }: Props) {
  if (compact) {
    return (
      <Link
        to="/bd-offre"
        className="flex items-center justify-between gap-4 rounded-xl border-2 border-primary bg-card px-5 py-4 transition-transform hover:-translate-y-0.5"
      >
        <div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
            <Sparkles className="h-3 w-3" /> Grande nouveauté V4
          </span>
          <p className="mt-1 text-sm font-bold">Studio BD &amp; Jeunesse — {BD_COMIC_OFFER.price} € à vie</p>
          <p className="text-xs text-muted-foreground">
            Personnages, planches de BD, histoires illustrées et export KDP.
          </p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
      </Link>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="overflow-hidden rounded-2xl border-2 border-primary bg-card">
        <div className="grid gap-6 p-6 md:grid-cols-[1.4fr,1fr] md:p-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Grande nouveauté V4
            </span>
            <h2 className="mt-3 text-2xl font-black sm:text-3xl">
              Studio BD &amp; Jeunesse : créez une bande dessinée complète sans savoir dessiner
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Vous décrivez votre idée, l’IA crée les personnages, écrit le scénario, illustre chaque case
              et prépare vos fichiers prêts à publier sur Amazon KDP.
            </p>
            <Link
              to="/bd-offre"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Découvrir l’offre — {BD_COMIC_OFFER.price} € à vie <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ul className="space-y-3 self-center text-sm">
            {[
              { icon: Users, text: 'Personnages cohérents d’une case à l’autre' },
              { icon: Palette, text: 'Planches et histoires jeunesse illustrées' },
              { icon: Download, text: 'Exports PDF et images prêts pour KDP' },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 rounded-xl border border-border bg-muted p-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
