import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { BackButton } from '@/components/v3/BackButton';

const STATS = [
  { label: 'Livres publiés', value: '71' },
  { label: 'Genres explorés', value: '6' },
  { label: 'Années d\'écriture', value: '12' },
  { label: 'Lecteurs', value: '10k+' },
];

const CATALOG = [
  { asin: 'B0GXB3V5DJ', title: "L'Ancien Locataire", genre: 'Thriller psychologique' },
  { asin: 'B0GG7QCFTZ', title: "Axel Kiev — L'Origine du Code", genre: 'Espionnage' },
  { asin: 'B0GY5K8GCS', title: 'Signal Zéro — Intégrale', genre: 'Thriller' },
  { asin: 'B0GX2SVHY4', title: 'Le Loup en Vacances', genre: 'Jeunesse' },
  { asin: 'B0GQQB7V1F', title: "Dans l'Ombre de la Villa", genre: 'Polar' },
  { asin: 'B0GN34WYMK', title: 'La Bible du Voyage', genre: 'Voyage' },
];
const coverUrl = (asin: string) => `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`;

export default function V3GuestAuthorPage() {
  return (
    <>
      <div className="max-w-6xl mx-auto px-4 pt-4"><BackButton /></div>
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

        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {CATALOG.map((b) => (
            <a key={b.asin} href={`https://www.amazon.fr/dp/${b.asin}/`} target="_blank" rel="noopener noreferrer" className="block">
              <img src={coverUrl(b.asin)} alt={b.title} loading="lazy" className="aspect-[2/3] w-full rounded-lg object-cover bg-white/5" onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://m.media-amazon.com/images/P/${b.asin}.jpg`; }} />
              <div className="mt-2 text-[12px] font-semibold leading-tight">{b.title}</div>
              <div className="text-[11px] text-[var(--v3-muted)]">{b.genre}</div>
            </a>
          ))}
        </div>
      </section>

      <div className="text-center pb-10">
        <Link to="/v3/create" className="v3-btn v3-btn-primary">Écrire mon propre livre</Link>
      </div>
    </>
  );
}
