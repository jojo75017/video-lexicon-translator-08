import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles, Feather, BookOpen, Library, ArrowRight, Star, Quote,
} from 'lucide-react';
import { V3_HEADER_MENU } from '@/data/v3HeaderMenu';
import homeHero from '@/assets/v3/home-hero.jpg';

const IDEA_EXAMPLES = [
  'Deux rivaux en cuisine tombent amoureux lors d\'un…',
  'Une héroïne hérite d\'un manoir au chagrin…',
  'Un détective insomniaque résout ses affaires la nuit…',
];

const FEATURED_TOOLS = [
  { emoji: '📘', title: 'Assistant V3', desc: 'Créez votre livre en 4 étapes guidées.', to: '/v3/create', badge: 'V3' },
  { emoji: '🎨', title: 'Cover Studio Pro', desc: 'Couverture haut de gamme, direction artistique IA.', to: '/v3/hub?tab=cover-pro', badge: 'Pro' },
  { emoji: '🚀', title: 'KDP Pilot', desc: 'Audit complet avant publication Amazon.', to: '/audit-pilot', badge: 'Populaire' },
  { emoji: '📖', title: 'Sommaire Ultime', desc: 'Table des matières éditable et exportable.', to: '/v3/outils/sommaire-ultime', badge: 'Nouveau' },
];

const AUTHOR_AMAZON_URL = 'https://www.amazon.fr/Mr-Georges-Boubet/e/B0CGVLHNX7';
const AUTHOR_BOOKS: Array<{ asin: string; title: string }> = [
  { asin: 'B0GXB3V5DJ', title: "L'Ancien Locataire" },
  { asin: 'B0GG7QCFTZ', title: "Axel Kiev — L'Origine du Code" },
  { asin: 'B0GY5K8GCS', title: 'Signal Zéro — Intégrale' },
  { asin: 'B0GX2SVHY4', title: 'Le Loup en Vacances' },
  { asin: 'B0GQQB7V1F', title: "Dans l'Ombre de la Villa" },
  { asin: 'B0GN34WYMK', title: 'La Bible du Voyage' },
];
const coverUrl = (asin: string) => `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`;
const fallbackCoverUrl = (asin: string) => `https://m.media-amazon.com/images/P/${asin}.jpg`;
const amazonBookUrl = (asin: string) => `https://www.amazon.fr/dp/${asin}/`;

export default function V3HomePage() {
  const nav = useNavigate();
  const [idea, setIdea] = useState('');
  const [phIdx, setPhIdx] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setPhIdx((n) => (n + 1) % IDEA_EXAMPLES.length), 3200);
    return () => window.clearInterval(id);
  }, []);

  const submitIdea = () => {
    const q = idea.trim();
    nav(`/v3/create${q ? `?idea=${encodeURIComponent(q)}` : ''}`);
  };

  return (
    <>
      {/* HERO — éditorial Émeraude & Or */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            'radial-gradient(60% 45% at 15% 15%, rgba(6,78,59,0.06), transparent 60%),' +
            'radial-gradient(45% 40% at 88% 12%, rgba(201,168,76,0.16), transparent 60%),' +
            'var(--v3-paper)',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 pt-14 pb-20 grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">
          {/* Colonne texte */}
          <div className="text-center lg:text-left">
            <span className="v3-chip v3-chip-gold">
              <Sparkles className="w-3.5 h-3.5" /> Atelier d'écriture premium
            </span>

            <h1 className="v3-serif mt-6 font-semibold leading-[1.02] tracking-tight" style={{ color: 'var(--v3-emerald)' }}>
              <span className="block text-4xl md:text-5xl xl:text-6xl">Publiez le livre que</span>
              <span className="block text-4xl md:text-5xl xl:text-6xl italic" style={{ color: 'var(--v3-gold-600)' }}>vous avez en vous.</span>
            </h1>

            <p className="mt-6 text-[15px] max-w-xl mx-auto lg:mx-0" style={{ color: 'var(--v3-muted)' }}>
              Un atelier éditorial complet : de l'idée à la couverture, du sommaire à la publication Amazon KDP.
              Trente agents IA au service de votre livre.
            </p>

            {/* Champ idée */}
            <div
              className="mt-8 flex items-stretch gap-2 rounded-full bg-white p-1.5 max-w-xl mx-auto lg:mx-0"
              style={{ border: '1px solid var(--v3-line)', boxShadow: '0 12px 32px -18px rgba(6,78,59,0.2)' }}
            >
              <div className="pl-4 flex items-center" style={{ color: 'var(--v3-gold)' }}>
                <Feather className="w-4 h-4" />
              </div>
              <input
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitIdea()}
                placeholder={IDEA_EXAMPLES[phIdx]}
                className="flex-1 min-w-0 bg-transparent outline-none text-sm px-2"
              />
              <button onClick={submitIdea} className="v3-btn v3-btn-primary whitespace-nowrap">
                <Sparkles className="w-4 h-4" /> Écrire
              </button>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-3">
              <div className="flex -space-x-2">
                {[
                  'https://randomuser.me/api/portraits/women/68.jpg',
                  'https://randomuser.me/api/portraits/men/32.jpg',
                  'https://randomuser.me/api/portraits/women/44.jpg',
                  'https://randomuser.me/api/portraits/men/75.jpg',
                  'https://randomuser.me/api/portraits/women/12.jpg',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Auteur ${i + 1}`}
                    loading="lazy"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                  />
                ))}
              </div>
              <div className="flex items-center gap-0.5" style={{ color: 'var(--v3-gold)' }}>
                {[0,1,2,3,4].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <span className="text-xs" style={{ color: 'var(--v3-muted)' }}>Rejoignez les 1 247 auteurs</span>
            </div>
          </div>

          {/* Colonne image */}
          <div className="relative order-first lg:order-last">
            <div
              className="relative overflow-hidden rounded-3xl aspect-[4/5] max-w-md mx-auto lg:max-w-none"
              style={{
                border: '1px solid var(--v3-line)',
                boxShadow: '0 30px 60px -30px rgba(6,78,59,0.4)',
              }}
            >
              <img
                src={homeHero}
                alt="Atelier d'écriture premium — livre ouvert, plume et lampe verte sur bureau en chêne"
                width={1024}
                height={1280}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 inset-x-0 h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, var(--v3-gold), transparent)' }} />
              <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#053e2f]/85 to-transparent" />

              {/* Citation intégrée */}
              <figure className="absolute left-5 right-5 bottom-5 rounded-xl bg-white/95 backdrop-blur px-5 py-4"
                style={{ border: '1px solid rgba(201,168,76,0.35)', boxShadow: '0 10px 30px -12px rgba(6,78,59,0.3)' }}>
                <Quote className="absolute -top-2 -left-2 w-6 h-6 p-1 rounded-full" style={{ background: 'var(--v3-gold)', color: '#1a1408' }} />
                <blockquote className="text-[13px] italic leading-relaxed" style={{ color: 'var(--v3-ink)' }}>
                  Le problème n'est pas d'écrire. C'est de ne jamais commencer.
                </blockquote>
                <figcaption className="v3-serif text-[13px] font-semibold mt-1" style={{ color: 'var(--v3-emerald)' }}>
                  Commencez votre livre.
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
        <div className="v3-gold-rule" />
      </section>

      {/* BANDE BLOG — mise en évidence */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-10">
        <a
          href="https://ebookstudio.blog/#accueil"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block overflow-hidden rounded-3xl transition-all"
          style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #053e2f 60%, #0a5a45 100%)',
            border: '1px solid rgba(201,168,76,0.45)',
            boxShadow: '0 30px 60px -30px rgba(6,78,59,0.5)',
          }}
        >
          <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, var(--v3-gold), transparent)' }} />
          <div className="grid md:grid-cols-[1fr_auto] items-center gap-6 px-6 md:px-10 py-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: 'var(--v3-gold)' }}>
                  Nouveau · Blog refait
                </span>
                <span
                  className="text-[9px] font-bold uppercase tracking-[0.15em] px-1.5 py-0.5 rounded"
                  style={{ background: '#C97A14', color: '#fff' }}
                >
                  À lire
                </span>
              </div>
              <h2 className="v3-serif text-2xl md:text-3xl font-semibold text-white leading-tight">
                Le Blog EbookStudio — la méthode, en clair
              </h2>
              <p className="mt-2 text-[14px] text-white/75 max-w-2xl">
                Articles, guides pratiques et retours d'expérience pour écrire, illustrer et publier
                votre livre. Nouvelle édition entièrement repensée.
              </p>
            </div>
            <div className="flex md:justify-end">
              <span
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-[15px] whitespace-nowrap"
                style={{
                  background: 'var(--v3-gold)',
                  color: '#1a1408',
                  boxShadow: '0 10px 30px -10px rgba(201,168,76,0.7)',
                }}
              >
                Ouvrir le blog
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </a>
      </section>

      {/* 6 CATÉGORIES PREMIUM */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-16">
        <div className="text-center mb-10">
          <div className="text-[10px] uppercase tracking-[0.24em] font-semibold" style={{ color: 'var(--v3-gold-600)' }}>
            L'atelier complet
          </div>
          <h2 className="v3-serif mt-2 text-3xl md:text-4xl font-semibold" style={{ color: 'var(--v3-emerald)' }}>
            Un studio éditorial, six univers
          </h2>
          <p className="mt-3 text-[14px] max-w-xl mx-auto" style={{ color: 'var(--v3-muted)' }}>
            Chaque étape du parcours d'auteur a ses outils dédiés — et son moment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {V3_HEADER_MENU.map((cat) => (
            <Link
              key={cat.key}
              to={cat.links[0]?.to ?? '/v3/outils'}
              className="group relative rounded-2xl bg-white p-6 transition-all"
              style={{
                border: '1px solid var(--v3-line)',
                boxShadow: '0 1px 2px rgba(6,78,59,0.03)',
              }}
              onMouseOver={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(201,168,76,0.5)';
                el.style.boxShadow = 'var(--v3-shadow-card)';
                el.style.transform = 'translateY(-3px)';
              }}
              onMouseOut={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--v3-line)';
                el.style.boxShadow = '0 1px 2px rgba(6,78,59,0.03)';
                el.style.transform = '';
              }}
            >
              <div className="flex items-start justify-between">
                <div className="text-3xl">{cat.emoji}</div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" style={{ color: 'var(--v3-gold-600)' }} />
              </div>
              <div className="text-[10px] uppercase tracking-[0.22em] font-semibold mt-4" style={{ color: 'var(--v3-gold-600)' }}>
                {cat.tagline}
              </div>
              <h3 className="v3-serif text-[22px] font-semibold mt-1" style={{ color: 'var(--v3-emerald)' }}>
                {cat.label}
              </h3>
              <ul className="mt-3 space-y-1">
                {cat.links.slice(0, 3).map((l) => (
                  <li key={l.to + l.label} className="text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>
                    · {l.label}
                  </li>
                ))}
                {cat.links.length > 3 && (
                  <li className="text-[12px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>
                    + {cat.links.length - 3} outils
                  </li>
                )}
              </ul>
            </Link>
          ))}
        </div>
      </section>

      {/* OUTILS VEDETTES */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pb-16">
        <div className="rounded-3xl p-10" style={{ background: 'var(--v3-cream)', border: '1px solid var(--v3-line)' }}>
          <div className="text-center mb-8">
            <div className="text-[10px] uppercase tracking-[0.24em] font-semibold" style={{ color: 'var(--v3-gold-600)' }}>
              Les incontournables
            </div>
            <h2 className="v3-serif mt-2 text-3xl font-semibold" style={{ color: 'var(--v3-emerald)' }}>
              Quatre outils au cœur du studio
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED_TOOLS.map((t) => (
              <Link
                key={t.title}
                to={t.to}
                className="group block rounded-2xl bg-white p-5 transition-all"
                style={{ border: '1px solid var(--v3-line)' }}
                onMouseOver={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(201,168,76,0.5)';
                  el.style.transform = 'translateY(-3px)';
                  el.style.boxShadow = 'var(--v3-shadow-card)';
                }}
                onMouseOut={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--v3-line)';
                  el.style.transform = '';
                  el.style.boxShadow = '';
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{t.emoji}</span>
                  <span className="v3-badge">{t.badge}</span>
                </div>
                <div className="v3-serif text-[18px] font-semibold mt-3" style={{ color: 'var(--v3-emerald)' }}>
                  {t.title}
                </div>
                <p className="text-[12.5px] mt-1 leading-snug" style={{ color: 'var(--v3-muted)' }}>{t.desc}</p>
                <div className="flex items-center gap-1 mt-3 text-[12px] font-semibold" style={{ color: 'var(--v3-gold-600)' }}>
                  Ouvrir <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AUTEUR INVITÉ (émeraude nuit) */}
      <section className="v3-section-dark">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-16">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <span
                className="v3-chip"
                style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--v3-gold)', borderColor: 'transparent' }}
              >
                ✨ Auteur invité
              </span>
              <h2 className="v3-serif mt-4 text-3xl md:text-4xl font-semibold text-white">Mr Georges Boubet</h2>
              <p className="mt-2 text-white/60 max-w-xl text-sm">
                71 livres publiés. Thrillers, sagas, jeunesse — le catalogue d'un auteur passionné.
              </p>
            </div>
            <a href={AUTHOR_AMAZON_URL} target="_blank" rel="noopener noreferrer" className="v3-btn v3-btn-gold">
              Voir sur Amazon <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {AUTHOR_BOOKS.map((b) => (
              <a
                key={b.asin}
                href={amazonBookUrl(b.asin)}
                target="_blank" rel="noopener noreferrer"
                className="group block"
                title={b.title}
              >
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-black/40 shadow-lg ring-1 ring-white/10 transition-transform group-hover:-translate-y-1 group-hover:shadow-2xl">
                  <img
                    src={coverUrl(b.asin)}
                    alt={`Couverture ${b.title}`}
                    loading="lazy"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img.src !== fallbackCoverUrl(b.asin)) img.src = fallbackCoverUrl(b.asin);
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-2 text-[11px] text-white/70 line-clamp-2 leading-tight">{b.title}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-5xl mx-auto px-5 md:px-8 py-20 text-center">
        <div className="v3-card">
          <div className="w-12 h-12 rounded-xl grid place-items-center mx-auto" style={{ background: 'var(--v3-gold-soft)' }}>
            <Library className="w-6 h-6" style={{ color: 'var(--v3-emerald)' }} />
          </div>
          <h2 className="v3-serif mt-4 text-3xl font-semibold" style={{ color: 'var(--v3-emerald)' }}>
            Vos sauvegardes vous attendent
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--v3-muted)' }}>
            Retrouvez tous les livres que vous avez créés, mis en favori ou en cours de rédaction.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <button onClick={() => nav('/v3/library')} className="v3-btn v3-btn-primary">
              <BookOpen className="w-4 h-4" /> Ma bibliothèque
            </button>
            <button onClick={() => nav('/v3/create')} className="v3-btn v3-btn-gold">
              <Sparkles className="w-4 h-4" /> Créer un livre
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
