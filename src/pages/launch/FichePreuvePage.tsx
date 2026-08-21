import { useEffect, useState } from 'react';
import { Star, ShieldCheck, Bot } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import FicheShell from '@/components/launch/FicheShell';

interface Testimonial {
  author_name: string;
  book_title: string | null;
  comment: string;
  rating: number | null;
}

const AGENTS = [
  'Analyse du marché et du lectorat',
  'Sommaire stratégique, validé par vous',
  'Rédaction chapitre par chapitre',
  'Correction professionnelle en 4 passes',
  'Couverture aux normes KDP exactes',
  'Fiche Amazon : description, 7 mots-clés, catégories',
];

/** Fiche J4 — La preuve : témoignages réels (base de données), méthode, garantie.
 *  Un seul bouton vers /commander. */
export default function FichePreuvePage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    supabase
      .from('book_testimonials')
      .select('author_name, book_title, comment, rating')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => setTestimonials((data as Testimonial[]) || []));
  }, []);

  return (
    <FicheShell
      badge="La preuve"
      title="Ils ont publié leur livre — voici leurs mots"
      metaTitle="Ils ont publié avec EbookStudio"
      metaDescription="Témoignages d'auteurs publiés sur Amazon KDP avec EbookStudio, la méthode en 15 agents et la garantie."
      gateSurface="fiche-preuve"
    >
      {testimonials.length > 0 && (
        <section className="space-y-4">
          {testimonials.map((t, i) => (
            <figure key={i} className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-1 text-[#D4AF37]">
                {Array.from({ length: t.rating ?? 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-3 leading-relaxed text-[#2A2118]">« {t.comment} »</blockquote>
              <figcaption className="mt-3 text-sm font-semibold text-[#5B5245]">
                {t.author_name}
                {t.book_title ? <span className="font-normal"> — {t.book_title}</span> : null}
              </figcaption>
            </figure>
          ))}
        </section>
      )}

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#008296]/10">
            <Bot className="h-5 w-5 text-[#008296]" />
          </span>
          <h2 className="v3-serif text-xl font-bold text-[#2A2118]">Derrière, 15 agents qui travaillent pour vous</h2>
        </div>
        <ul className="mt-4 space-y-2">
          {AGENTS.map((a) => (
            <li key={a} className="flex items-start gap-2 text-[#5B5245]">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-[#008296]" />
              {a}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-[#D4AF37]/40 bg-[#FFFBF2] p-6">
        <h2 className="v3-serif text-xl font-bold text-[#2A2118]">Sans risque</h2>
        <p className="mt-3 leading-relaxed text-[#5B5245]">
          Un seul paiement de 47 €, aucun abonnement, aucun prélèvement mensuel. Votre accès est
          conservé et la V3 vous est offerte au 1er octobre. Une question avant de vous lancer ?
          Répondez à l'email que vous avez reçu : Georges répond personnellement.
        </p>
      </section>
    </FicheShell>
  );
}
