import { ArrowRight } from 'lucide-react';

const AUTHOR_AMAZON_URL = 'https://www.amazon.fr/Mr-Georges-Boubet/e/B0CGVLHNX7';

// 8 couvertures officielles fournies par Georges (Amazon, haute définition).
const COVERS = [
  'https://m.media-amazon.com/images/I/918zLvnFYpL._SL1500_.jpg',
  'https://m.media-amazon.com/images/I/71F5oIMMJhL._SL1499_.jpg',
  'https://m.media-amazon.com/images/I/71bx0hCAteL._SL1499_.jpg',
  'https://m.media-amazon.com/images/I/71Nx8sX+yKL._SL1499_.jpg',
  'https://m.media-amazon.com/images/I/81TDpyFFJRL._SL1500_.jpg',
  'https://m.media-amazon.com/images/I/71M9vInJYiL._SL1499_.jpg',
  'https://m.media-amazon.com/images/I/71dtOsRjyFL._SL1329_.jpg',
  'https://m.media-amazon.com/images/I/71XFHkhKPyL._SL1491_.jpg',
];

export default function V3CoversGallery() {
  return (
    <section style={{ background: '#2A2624' }}>
      <div className="v3-shell py-8">
        <div
          className="rounded-3xl p-6 md:p-8"
          style={{ background: '#332E2B', border: '1px solid rgba(246,189,42,.28)', boxShadow: '0 18px 40px -28px rgba(0,0,0,.7)' }}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <span className="inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider" style={{ background: '#D97706', color: '#ffffff' }}>
                Réalisés avec EbookStudio
              </span>
              <h2 className="v3-serif mt-3 text-2xl font-semibold" style={{ color: '#F6BD2A' }}>
                8 couvertures publiées sur Amazon KDP
              </h2>
              <p className="mt-1 text-sm" style={{ color: '#B9AFA6' }}>
                Des livres de Georges Boubet, écrits et mis en page avec les ateliers que vous avez sous la main.
              </p>
            </div>
            <a
              href={AUTHOR_AMAZON_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="v3-chip-toggle inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
              style={{ background: '#EA580C', border: '1px solid #EA580C', color: '#ffffff' }}
            >
              Page auteur Amazon <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {COVERS.map((src, i) => (
              <a key={src} href={AUTHOR_AMAZON_URL} target="_blank" rel="noopener noreferrer" className="group block" title={`Couverture ${i + 1}`}>
                <div
                  className="aspect-[2/3] overflow-hidden rounded-xl transition-transform group-hover:-translate-y-1"
                  style={{ background: '#1A1D24', border: '1px solid rgba(246,189,42,.35)', boxShadow: '0 10px 24px -12px rgba(0,0,0,.8)' }}
                >
                  <img src={src} alt={`Couverture de livre ${i + 1} de Georges Boubet`} loading="lazy" className="h-full w-full object-cover" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
