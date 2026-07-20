import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles, Feather, BookOpen, Palette, Library, Wand2, ArrowRight, Star, Quote,
} from 'lucide-react';

const IDEA_EXAMPLES = [
  'Deux rivaux en cuisine tombent amoureux lors d\'un…',
  'Une héro·ïne hérité d\'un manoir au chagr…',
  'Un détective insomniaque résout ses affaires…',
];

const GENRES = [
  { label: 'Romance', emoji: '❤️' },
  { label: 'Thriller', emoji: '🔪' },
  { label: 'Polar', emoji: '🔎' },
  { label: 'Fantasy', emoji: '🐉' },
  { label: 'Science-Fiction', emoji: '🚀' },
  { label: 'Historique', emoji: '🏛️' },
  { label: 'Drame', emoji: '🎭' },
  { label: 'Aventure', emoji: '🗺️' },
  { label: 'Horreur', emoji: '👻' },
  { label: 'Young Adult', emoji: '⭐' },
  { label: 'Poésie', emoji: '🌸' },
  { label: 'Jeunesse', emoji: '🎈' },
];

const STEPS = [
  { emoji: '📝', title: 'Décris ton idée', text: 'Une phrase, un pitch, une intuition. L\'atelier fait le reste.' },
  { emoji: '🎨', title: 'Choisis ton style', text: 'Genre, ton, longueur, personnages. L\'IA s\'adapte à ta vision.' },
  { emoji: '📖', title: 'Lis & partage', text: 'Ton livre est généré en quelques minutes. Lis, exporte, partage.' },
];

const FEATURES = [
  { icon: Sparkles, title: 'Génération intelligente', text: 'L\'IA structure ton récit en chapitres cohérents, avec un fil narratif solide et des personnages vivants.' },
  { icon: Wand2, title: 'Ta voix, ton style', text: 'Poétique, punchy, sombre, humoristique — choisis le ton qui correspond à ton univers.' },
  { icon: Library, title: 'Bibliothèque personnelle', text: 'Retrouve tous tes livres, reprends la lecture ou l\'écriture, garde tes brouillons.' },
  { icon: Palette, title: 'Couverture auto', text: 'Une couverture unique est générée pour chaque livre, inspirée de ton histoire.' },
];

// Livres de l'auteur invité (Georges Boubet) — 6 vraies couvertures Amazon.
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
      {/* HERO */}
      <section className="v3-halo relative overflow-hidden">
        {/* Decor livres flottants */}
        <div className="hidden lg:block absolute left-6 top-32 w-24 h-32 rounded-md bg-[var(--v3-orange)] shadow-2xl v3-float" />
        <div className="hidden lg:block absolute right-8 top-28 w-24 h-32 rounded-md bg-[var(--v3-ink)] shadow-2xl v3-float" style={{ animationDelay: '1.5s' }} />

        <div className="max-w-3xl mx-auto px-5 pt-16 pb-20 text-center">
          <span className="v3-chip v3-chip-orange">
            <Sparkles className="w-3.5 h-3.5" /> Atelier d'écriture par IA
          </span>

          <h1 className="v3-serif mt-6 font-bold leading-[1.05] tracking-tight">
            <span className="block text-4xl md:text-5xl whitespace-nowrap">Ton histoire mérite d'être écrite.</span>
            <span className="block text-2xl md:text-3xl text-[var(--v3-orange)] italic mt-2">Ebookstudio la révèle en quelques minutes.</span>
          </h1>

          <p className="mt-5 text-[15px] text-[var(--v3-muted)] max-w-xl mx-auto">
            Décris une idée, choisis ton style, et Ebookstudio écrit ton livre en quelques minutes.
            Romans, nouvelles, ebooks — à toi l'histoire.
          </p>

          <figure className="mt-6 mx-auto max-w-md text-left">
            <div className="relative rounded-xl bg-white border border-black/5 shadow-sm p-4">
              <Quote className="absolute left-3 top-3 w-5 h-5 text-[var(--v3-orange)]/40" />
              <blockquote className="pl-6 text-[13px] italic leading-relaxed text-[var(--v3-ink)]/85">
                Le problème n'est pas d'écrire.<br />
                C'est de ne jamais commencer.<br />
                <span className="font-semibold not-italic">Commencez votre livre.</span>
              </blockquote>
              <div className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-[var(--v3-orange)]" />
            </div>
          </figure>

          {/* Champ idée */}
          <div className="mt-8 flex items-stretch gap-2 rounded-full border border-black/10 bg-white p-1.5 shadow-lg">
            <div className="pl-4 flex items-center text-[var(--v3-muted)]">
              <Feather className="w-4 h-4" />
            </div>
            <input
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitIdea()}
              placeholder={IDEA_EXAMPLES[phIdx]}
              className="flex-1 bg-transparent outline-none text-sm px-2"
            />
            <button onClick={submitIdea} className="v3-btn v3-btn-primary">
              <Sparkles className="w-4 h-4" /> Écrire mon livre
            </button>
          </div>

          {/* Exemples chips */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {IDEA_EXAMPLES.map((s) => (
              <button key={s} onClick={() => setIdea(s)} className="v3-chip text-xs">
                {s.slice(0, 42)}…
              </button>
            ))}
          </div>

          {/* Social proof */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {['#F97316', '#0A0A0A', '#EA580C', '#1a1a1a', '#F97316'].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white" style={{ background: c }} />
              ))}
            </div>
            <div className="flex items-center gap-1 text-[var(--v3-orange)]">
              <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
            </div>
            <span className="text-xs text-[var(--v3-muted)]">Rejoignez les 1 247 auteurs d'Ebookstudio</span>
          </div>
        </div>
      </section>

      {/* AUTEUR INVITÉ (dark) */}
      <section className="v3-section-dark">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-14">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <span className="v3-chip" style={{ background: 'rgba(249,115,22,0.15)', color: '#F97316', borderColor: 'transparent' }}>
                ✨ Auteur invité
              </span>
              <h2 className="v3-serif mt-4 text-3xl md:text-4xl font-bold">Mr Georges Boubet</h2>
              <p className="mt-2 text-white/60 max-w-xl text-sm">
                71 livres publiés. Thrillers, sagas, jeunesse — découvrez le catalogue d'un auteur passionné.
              </p>
            </div>
            <a
              href={AUTHOR_AMAZON_URL}
              target="_blank" rel="noopener noreferrer"
              className="v3-btn"
              style={{ background: '#fff', color: '#000' }}
            >
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

          <div className="mt-8 flex justify-center">
            <a
              href={AUTHOR_AMAZON_URL}
              target="_blank" rel="noopener noreferrer"
              className="v3-btn v3-btn-primary"
            >
              Découvrir tous les livres sur Amazon <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>



      {/* Vos sauvegardes */}
      <section className="max-w-3xl mx-auto px-5 md:px-8 py-16 text-center">
        <div className="v3-card">
          <div className="w-12 h-12 rounded-xl bg-[var(--v3-cloud)] grid place-items-center mx-auto">
            <Library className="w-6 h-6 text-[var(--v3-ink)]" />
          </div>
          <h2 className="v3-serif mt-4 text-2xl font-bold">Vos sauvegardes</h2>
          <p className="mt-2 text-sm text-[var(--v3-muted)]">
            Retrouvez tous les livres que vous avez créés, mis en favori ou en cours de rédaction.
          </p>
          <button
            onClick={() => nav('/v3/library')}
            className="mt-6 v3-btn v3-btn-primary"
          >
            <BookOpen className="w-4 h-4" /> Voir mes sauvegardes
          </button>
        </div>
      </section>

      {/* Comment ça marche (dark) */}
      <section id="how" className="v3-section-dark">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-16 text-center">
          <span className="v3-chip v3-chip-orange">✨ En 3 étapes</span>
          <h2 className="v3-serif mt-4 text-4xl font-bold">De l'idée à la dernière page</h2>
          <p className="mt-3 text-white/60 max-w-lg mx-auto text-sm">
            Ebookstudio transforme ton intuition en livre complet. Pas de page blanche. Pas de blocage. Juste l'écriture.
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.title} className="text-left">
                <div className="w-11 h-11 rounded-lg bg-white/10 grid place-items-center text-xl mb-4">{s.emoji}</div>
                <div className="font-bold">{s.title}</div>
                <p className="mt-1 text-sm text-white/60">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Un atelier complet */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-16">
        <div className="text-center">
          <h2 className="v3-serif text-3xl font-bold">Un atelier complet</h2>
          <p className="text-sm text-[var(--v3-muted)] mt-1">Tout ce qu'il faut pour donner vie à tes histoires.</p>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="v3-card">
                <div className="w-10 h-10 rounded-lg bg-[var(--v3-cloud)] grid place-items-center">
                  <Icon className="w-5 h-5 text-[var(--v3-ink)]" />
                </div>
                <div className="mt-4 font-bold">{f.title}</div>
                <p className="mt-1 text-sm text-[var(--v3-muted)]">{f.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Genres */}
      <section className="max-w-5xl mx-auto px-5 md:px-8">
        <div className="rounded-3xl bg-[var(--v3-cloud)] py-14 px-6 text-center">
          <h2 className="v3-serif text-3xl font-bold">12 genres à explorer</h2>
          <p className="text-sm text-[var(--v3-muted)] mt-1">Romance, thriller, fantasy, et bien plus. Quelle histoire vas-tu raconter ?</p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {GENRES.map((g) => (
              <Link key={g.label} to={`/v3/create?genre=${encodeURIComponent(g.label)}`} className="v3-chip">
                <span>{g.emoji}</span> {g.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-5xl mx-auto px-5 md:px-8 mt-16">
        <div className="rounded-3xl v3-section-dark text-center px-6 py-16 relative overflow-hidden">
          <div className="absolute -top-20 -right-16 w-64 h-64 rounded-full bg-[var(--v3-orange)] blur-3xl opacity-30" />
          <div className="relative">
            <Feather className="w-8 h-8 text-[var(--v3-orange)] mx-auto v3-pulse" />
            <h2 className="v3-serif mt-4 text-4xl font-bold">Ton histoire t'attend.</h2>
            <p className="mt-3 text-white/60 text-sm max-w-md mx-auto">
              Commence gratuitement. En quelques minutes, tu tiens ton premier livre entre les mains.
            </p>
            <button onClick={() => nav('/v3/create')} className="mt-8 v3-btn v3-btn-primary">
              <Sparkles className="w-4 h-4" /> Écrire mon premier livre <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
