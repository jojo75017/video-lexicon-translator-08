import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import { blogArticles } from '@/data/blogArticles';

const SERIF = "'Playfair Display', Georgia, serif";
const INK = '#232F3E';
const AMBER = '#E8951E';

/**
 * Section "Guides & Articles" pour le Hub V3.
 * Réutilise les guides SEO illustrés (blogArticles) et les présente aux abonnés.
 */
const V3GuidesSection: React.FC = () => {
  const navigate = useNavigate();
  const guides = blogArticles.slice(0, 8);

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-1">
        <BookOpen className="h-5 w-5" style={{ color: AMBER }} />
        <h2 className="text-lg font-bold" style={{ fontFamily: SERIF, color: INK }}>
          Guides & Articles
        </h2>
        <span className="text-[10px] font-bold tracking-widest px-1.5 py-0.5 rounded" style={{ background: '#008296', color: '#fff' }}>
          INCLUS
        </span>
        <div className="flex-1 h-px ml-2" style={{ background: `linear-gradient(90deg, ${AMBER}44, transparent)` }} />
      </div>
      <p className="text-xs mb-4" style={{ color: '#8a7860' }}>
        Tous nos guides illustrés pour réussir votre auto-édition, accessibles à vie avec votre abonnement.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {guides.map((g) => (
          <button
            key={g.slug}
            onClick={() => navigate(`/blog/${g.slug}`)}
            className="group text-left rounded-xl overflow-hidden bg-white border border-[#eadfc9] hover:border-[#E8951E] transition-all hover:shadow-lg"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={g.image}
                alt={g.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.92)', color: '#008296' }}>
                {g.category}
              </span>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-bold leading-snug line-clamp-2" style={{ fontFamily: SERIF, color: INK }}>
                {g.title}
              </h3>
              <p className="mt-1 text-[11px] line-clamp-2" style={{ color: '#8a7860' }}>
                {g.excerpt}
              </p>
              <div className="mt-2 flex items-center justify-between text-[10px]" style={{ color: '#b29a72' }}>
                <span>{g.readTime}</span>
                <span className="inline-flex items-center gap-1 font-semibold group-hover:text-[#E8951E]" style={{ color: AMBER }}>
                  Lire <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => navigate('/blog')}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold border transition-all hover:bg-[#008296] hover:text-white"
          style={{ borderColor: '#008296', color: '#008296' }}
        >
          Voir tous les guides <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
};

export default V3GuidesSection;
