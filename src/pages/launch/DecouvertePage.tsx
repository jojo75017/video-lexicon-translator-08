import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, PenLine, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { trackCaptureEvent } from '@/lib/captureTracking';

interface Testimonial {
  id: string;
  author_name: string;
  book_title: string | null;
  comment: string;
  rating: number | null;
}

const STEPS = [
  'Vous décrivez votre idée en une phrase',
  'Le titre, le sommaire et le chapitre 1 sont écrits pour vous',
  'Vous lisez avant de décider quoi que ce soit',
];

/**
 * Page d'arrivée courte pour les visiteurs venant des réseaux (shorts
 * YouTube, TikTok). Promesse unique : voir son livre commencer, gratuitement,
 * avant toute question de prix. Un seul bouton : l'essai gratuit.
 */
export default function DecouvertePage() {
  const [params] = useSearchParams();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    document.title = 'Voyez votre livre commencer — gratuit, sans carte — EbookStudio';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        "Donnez votre idée de livre : le titre, le sommaire et le chapitre 1 sont écrits pour vous. Gratuit, sans carte bancaire, en français.",
      );
    }
    void trackCaptureEvent('decouverte', 'view');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Avis réels et approuvés uniquement : aucun témoignage fabriqué.
  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from('book_testimonials')
        .select('id,author_name,book_title,comment,rating')
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(3);
      if (active && data) setTestimonials(data as Testimonial[]);
    })();
    return () => {
      active = false;
    };
  }, []);

  const essaiUrl = (() => {
    const q = new URLSearchParams(params);
    q.set('utm_source', q.get('utm_source') || 'shorts');
    return `/essai?${q.toString()}`;
  })();

  return (
    <div className="min-h-screen" style={{ background: 'var(--v3-cream, #FBF8F3)' }}>
      <header className="border-b border-black/5 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <span className="v3-serif text-lg font-bold" style={{ color: 'var(--v3-ink, #2A2118)' }}>
            EbookStudio
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0F2E1F]">
            En français · sans carte bancaire
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-12 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8A6D1B]">
          <PenLine className="h-3.5 w-3.5" /> Vous venez de la vidéo ? C'est ici.
        </span>
        <h1
          className="v3-serif mt-5 text-4xl font-bold leading-tight md:text-5xl"
          style={{ color: 'var(--v3-ink, #2A2118)' }}
        >
          Voyez votre livre commencer, gratuitement.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[#5B5245]">
          Pas de prix à regarder, rien à installer. Vous donnez votre idée en une phrase,
          et vous lisez immédiatement le titre, le sommaire et le début de votre chapitre 1.
        </p>

        <ol className="mx-auto mt-8 max-w-md space-y-3 text-left">
          {STEPS.map((s, i) => (
            <li key={s} className="flex items-start gap-3 rounded-xl border border-black/5 bg-white p-4 shadow-sm">
              <span className="v3-serif flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#0F2E1F] text-sm font-bold text-white">
                {i + 1}
              </span>
              <span className="pt-1 text-sm font-medium text-[#2A2118]">{s}</span>
            </li>
          ))}
        </ol>

        <a
          href={essaiUrl}
          onClick={() => void trackCaptureEvent('decouverte', 'click', { leadMagnet: 'essai' })}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F2E1F] px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-[#14532D] sm:w-auto"
        >
          <PenLine className="h-5 w-5" /> Écrire mon chapitre 1 gratuitement <ArrowRight className="h-4 w-4" />
        </a>
        <p className="mt-3 text-xs text-[#8A8072]">
          Gratuit · aucune carte bancaire · votre livre reste le vôtre
        </p>

        {testimonials.length > 0 && (
          <section className="mt-12 text-left">
            <h2 className="v3-serif text-center text-xl font-bold text-[#2A2118]">
              Ce qu'en disent les auteurs
            </h2>
            <div className="mt-5 space-y-4">
              {testimonials.map((t) => (
                <figure key={t.id} className="rounded-xl border border-black/5 bg-white p-5 shadow-sm">
                  {t.rating ? (
                    <div className="flex gap-0.5 text-[#D4AF37]" aria-label={`${t.rating} étoiles`}>
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  ) : null}
                  <blockquote className="mt-2 text-sm leading-relaxed text-[#2A2118]">
                    « {t.comment} »
                  </blockquote>
                  <figcaption className="mt-2 text-xs font-semibold text-[#5B5245]">
                    {t.author_name}
                    {t.book_title ? ` — ${t.book_title}` : ''}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        <p className="mt-10 flex items-center justify-center gap-2 text-xs text-[#8A8072]">
          <CheckCircle2 className="h-4 w-4 text-[#147A4A]" />
          Créé par Georges Boubet, auteur de 71 livres publiés.
        </p>
      </main>
    </div>
  );
}
