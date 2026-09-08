import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import heroAlbum from '@/assets/comic/hero-album.jpg';
import { COMIC_AGENT } from '@/data/comicAgentOffer';

/**
 * Encart discret sur la page d'accueil EbookStudio.
 * Signale la nouveauté Ebook Comic Agent sans surcharger la mise en page.
 */
export default function ComicAgentTeaser() {
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
