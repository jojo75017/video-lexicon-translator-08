import { Link } from 'react-router-dom';
import { ExternalLink, BookOpen } from 'lucide-react';
import { BackButton } from '@/components/v3/BackButton';

const STATS = [
  { label: 'Livres publiés', value: '71' },
  { label: 'Genres explorés', value: '6' },
  { label: 'Années d\'écriture', value: '12' },
  { label: 'Lecteurs', value: '10k+' },
];

const CATALOG = Array.from({ length: 24 }, (_, i) => ({
  id: `axel-${i + 1}`,
  title: `AXEL — Tome ${i + 1}`,
  genre: i % 3 === 0 ? 'Thriller' : i % 3 === 1 ? 'Aventure' : 'Espionnage',
}));

export default function V3GuestAuthorPage() {
  return (
    <>
      <section className="v3-section-dark">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-16 flex items-center gap-8 flex-wrap">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--v3-orange)] to-orange-700 grid place-items-center text-3xl font-bold">
            GB
          </div>
          <div className="flex-1 min-w-64">
            <span className="v3-chip" style={{ background: 'rgba(249,115,22,0.15)', color: '#F97316', borderColor: 'transparent' }}>
              ✨ Auteur invité
            </span>
            <h1 className="v3-serif text-4xl md:text-5xl font-bold mt-3">Mr Georges Boubet</h1>
            <p className="mt-2 text-white/60 max-w-xl">
              71 livres publiés. Thrillers, sagas d'espionnage, aventure — un catalogue passionnant à découvrir.
            </p>
          </div>
          <a href="https://www.amazon.fr/stores/author/B00J4G8QOE" target="_blank" rel="noopener noreferrer" className="v3-btn" style={{ background: '#fff', color: '#000' }}>
            Amazon <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-5 md:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="v3-serif text-3xl font-bold text-[var(--v3-orange)]">{s.value}</div>
                <div className="text-xs text-white/60 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 md:px-8 py-14">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
          <h2 className="v3-serif text-3xl font-bold">Le catalogue</h2>
          <div className="flex gap-2">
            {['Tous', 'Thriller', 'Aventure', 'Espionnage'].map((g) => (
              <button key={g} className="v3-chip">{g}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {CATALOG.map((b) => (
            <div key={b.id}>
              <div className="aspect-[3/4] rounded-lg bg-gradient-to-br from-orange-600 to-orange-900 grid place-items-end p-3 text-white">
                <BookOpen className="w-4 h-4 text-white/40 self-start" />
                <div className="text-[11px] font-bold uppercase tracking-wider leading-tight">
                  {b.title}
                </div>
              </div>
              <div className="mt-2 text-[11px] text-[var(--v3-muted)]">{b.genre}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center pb-10">
        <Link to="/v3/create" className="v3-btn v3-btn-primary">Écrire mon propre livre</Link>
      </div>
    </>
  );
}
