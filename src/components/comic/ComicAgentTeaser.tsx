import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import heroAlbum from '@/assets/comic/hero-album.jpg';
import { COMIC_AGENT } from '@/data/comicAgentOffer';

interface Props {
  /** Grand bandeau promo (page d'accueil) au lieu de l'encart discret. */
  variant?: 'compact' | 'large';
}

/**
 * Encart Ebook Comic Agent.
 * - `compact` : ligne discrète.
 * - `large` : grand bandeau promo avec pastille « Superbe promo » clignotante.
 */
export default function ComicAgentTeaser({ variant = 'compact' }: Props) {
  if (variant === 'large') {
    return (
      <section className="mx-auto max-w-7xl px-5 py-6 md:px-8">
        <Link
          to="/comic-agent"
          className="group block overflow-hidden rounded-3xl border-2 transition-all hover:-translate-y-0.5 hover:shadow-xl"
          style={{ borderColor: 'var(--v3-gold, #D4AF37)', background: 'linear-gradient(135deg,#12241C 0%,#1C3A2B 55%,#12241C 100%)' }}
        >
          <div className="grid items-center gap-6 p-6 md:grid-cols-[220px,1fr,auto] md:p-8">
            <img
              src={heroAlbum}
              alt="Album jeunesse illustré : enfant lisant avec un renard et un lapin"
              loading="lazy"
              className="h-40 w-full rounded-2xl object-cover md:h-44"
            />

            <div className="min-w-0">
              <span
                className="inline-flex animate-pulse items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em]"
                style={{ background: '#FF9E2D', color: '#1f2937' }}
              >
                <Sparkles className="h-3.5 w-3.5" /> Superbe promo
              </span>
              <h2 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl">
                Ebook Comic Agent — BD et albums jeunesse créés avec l’IA
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-white/80">
                Créez et vendez des bandes dessinées et des livres pour enfants sans savoir dessiner.
                Exclusivité de lancement jusqu’au {COMIC_AGENT.endLabel}.
              </p>
              <p className="mt-3 flex items-baseline gap-3">
                <span className="text-3xl font-black" style={{ color: '#F5C451' }}>
                  {COMIC_AGENT.price} €
                </span>
                <span className="text-sm text-white/60 line-through">{COMIC_AGENT.regularPrice} €</span>
              </p>
            </div>

            <span
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold"
              style={{ background: '#FF9E2D', color: '#1f2937' }}
            >
              Découvrir l’offre <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-6 md:px-8">
      <Link
        to="/comic-agent"
        className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        <img
          src={heroAlbum}
          alt="Illustration jeunesse aquarelle : enfant lisant avec un renard et un lapin"
          loading="lazy"
          className="hidden h-16 w-16 shrink-0 rounded-xl object-cover sm:block"
        />
        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            <Sparkles className="h-3 w-3" /> Nouveau
          </span>
          <p className="mt-1.5 text-sm font-bold text-foreground">
            Ebook Comic Agent pour vos enfants — {COMIC_AGENT.price} € au lieu de {COMIC_AGENT.regularPrice} €
          </p>
          <p className="truncate text-xs text-muted-foreground">
            Créez et vendez des bandes dessinées avec l’IA, sans savoir dessiner.
          </p>
        </div>
        <span className="shrink-0 text-xs font-semibold text-primary group-hover:underline">
          Découvrir →
        </span>
      </Link>
    </section>
  );
}
