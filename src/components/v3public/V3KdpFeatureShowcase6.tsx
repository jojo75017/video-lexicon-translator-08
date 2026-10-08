import { Globe2, Languages, MapPin, Search, Store, TrendingUp } from 'lucide-react';
import multilingualImg from '@/assets/v3-kdp-multilingual.jpg';

const BENEFITS = [
  { icon: Languages, text: 'Rédaction en 10 langues ; la traduction relue d’un livre existant est un complément, selon vos droits.' },
  { icon: MapPin, text: 'Adaptation du contenu aux lecteurs de chaque pays.' },
  { icon: Search, text: 'Mots-clés propres à chaque marché Amazon.' },
  { icon: Store, text: 'Accès aux boutiques Amazon du monde entier.' },
  { icon: Globe2, text: 'Une visibilité internationale pour chacun de vos livres.' },
  { icon: TrendingUp, text: 'Un même livre, plusieurs marchés : votre catalogue grandit sans tout réécrire.' },
];

/**
 * Encart « Caractéristique 06 » — la publication multilingue.
 * Même famille visuelle que les encarts 01 à 04 (carte sombre à liseré orange),
 * compacte, avec une photo en vis-à-vis.
 */
export default function V3KdpFeatureShowcase6() {
  return (
    <div className="v3-shell">
      <article
        className="mx-auto mt-8 max-w-6xl overflow-hidden rounded-3xl"
        style={{
          background: 'var(--v3-joy-ink)',
          border: '1px solid var(--v3-joy-orange)',
          boxShadow: '0 24px 50px -32px color-mix(in srgb, var(--v3-joy-ink) 55%, transparent)',
        }}
      >
        <div className="grid items-center gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:p-10 lg:py-8">
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase"
              style={{ background: 'color-mix(in srgb, var(--v3-joy-orange) 18%, transparent)', color: 'var(--v3-joy-orange)' }}
            >
              Caractéristique 06 <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <h3 className="v3-serif mt-4 text-2xl font-semibold leading-tight md:text-3xl" style={{ color: 'var(--v3-on-emerald)' }}>
              Publication multilingue
            </h3>
            <ul className="mt-5 space-y-3">
              {BENEFITS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-[14px] leading-6 md:text-[15px]" style={{ color: 'color-mix(in srgb, var(--v3-on-emerald) 90%, transparent)' }}>
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg" style={{ background: 'color-mix(in srgb, var(--v3-joy-orange) 20%, transparent)', color: 'var(--v3-joy-orange)' }} aria-hidden="true">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="overflow-hidden rounded-2xl p-2"
            style={{ background: 'var(--v3-joy-orange-soft)', border: '1px solid var(--v3-joy-orange)' }}
          >
            <img
              src={multilingualImg}
              alt="Livres imprimés en plusieurs langues posés sur un bureau à côté d’un petit globe et d’un ordinateur portable"
              width={1024}
              height={768}
              loading="lazy"
              className="h-40 w-full rounded-xl object-cover sm:h-48 lg:h-56"
            />
          </div>
        </div>
      </article>
    </div>
  );
}
