import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  author_name: string;
  book_title: string | null;
  comment: string;
  rating: number | null;
  photo_url: string | null;
}

interface Props {
  amber?: string;
  ink?: string;
  serif?: string;
}

export default function TestimonialsWall({
  amber = "#E8951E",
  ink = "#2A2118",
  serif = "'Instrument Serif', Georgia, serif",
}: Props) {
  const [items, setItems] = useState<Testimonial[]>([]);

  useEffect(() => {
    supabase
      .from("book_testimonials")
      .select("id, author_name, book_title, comment, rating, photo_url")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(12)
      .then(({ data }) => setItems((data as Testimonial[]) ?? []));
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="px-4 pb-16">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h2 className="text-3xl font-black" style={{ fontFamily: serif, color: ink }}>
          Leurs premiers livres, en vrai
        </h2>
        <p className="mt-3 opacity-70">Des auteurs qui ont publié avec EbookStudio.</p>
      </div>
      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((t) => (
          <figure key={t.id} className="rounded-2xl bg-white border overflow-hidden" style={{ borderColor: "#efe3cf" }}>
            {t.photo_url && (
              <img
                src={t.photo_url}
                alt={`Livre publié par ${t.author_name}${t.book_title ? ` : ${t.book_title}` : ""}`}
                loading="lazy"
                className="w-full h-48 object-cover"
              />
            )}
            <figcaption className="p-5">
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5" style={{ fill: amber, color: amber }} />
                ))}
              </div>
              <Quote className="w-4 h-4 mb-1" style={{ color: amber }} />
              <p className="text-sm" style={{ color: "#5c5142" }}>{t.comment}</p>
              <p className="text-xs font-bold mt-3" style={{ color: ink }}>
                {t.author_name}
                {t.book_title ? <span className="font-normal opacity-60"> — {t.book_title}</span> : null}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
