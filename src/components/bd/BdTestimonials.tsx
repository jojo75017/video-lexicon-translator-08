import { useState } from 'react';
import { BadgeCheck, Star } from 'lucide-react';
import { BD_COMIC_TESTIMONIALS } from '@/data/bdComicOffer';

/** Preuve sociale de la page de vente Studio BD & Jeunesse. */
export default function BdTestimonials() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? BD_COMIC_TESTIMONIALS : BD_COMIC_TESTIMONIALS.slice(0, 6);

  return (
    <section className="mt-14">
      <h2 className="text-center text-2xl font-bold">Ils créent déjà leurs BD</h2>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Auteurs, parents, enseignants et vendeurs Etsy : voici ce qu’ils en disent.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((t) => (
          <article key={t.name + t.role} className="flex flex-col rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-0.5" aria-label={`${t.rating} étoiles sur 5`}>
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current text-primary" />
              ))}
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">« {t.content} »</p>
            <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
              <div>
                <p className="text-sm font-bold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
                <BadgeCheck className="h-3.5 w-3.5" /> Vérifié
              </span>
            </div>
          </article>
        ))}
      </div>

      {BD_COMIC_TESTIMONIALS.length > 6 && (
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
          >
            {expanded
              ? 'Réduire les témoignages'
              : `Voir plus de témoignages (${BD_COMIC_TESTIMONIALS.length - 6})`}
          </button>
        </div>
      )}
    </section>
  );
}
