import V3FeatureAccessInfo from './V3FeatureAccessInfo';
import { BookCopy, Layers, Repeat2, Sparkles, TrendingUp, Users } from 'lucide-react';
import seriesImg from '@/assets/v3-kdp-book-series.jpg';

const BENEFITS = [
  { icon: BookCopy, text: 'Vos livres transformés en véritables séries, avec une identité qui se reconnaît au premier regard.' },
  { icon: Layers, text: 'Des suites et des tomes créés dans la continuité de vos premiers ouvrages.' },
  { icon: Repeat2, text: 'Une même base d’histoire réutilisée pour publier plus vite, tome après tome.' },
  { icon: Users, text: 'Un lectorat fidélisé qui attend chaque nouvelle sortie de votre série.' },
  { icon: TrendingUp, text: 'Des séries qui se vendent en escalier : chaque tome met en valeur les précédents.' },
  { icon: Sparkles, text: 'Une image d’auteur professionnel, cohérente sur toute votre collection.' },
];

/**
 * Encart « Caractéristique 10 » — votre livre devient une série.
 * Même famille visuelle que les encarts 01 à 09 (carte sombre à liseré orange),
 * compacte, avec une photo en vis-à-vis.
 */
export default function V3KdpFeatureShowcase10() {
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
              Caractéristique 10 <Layers className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <h3 className="v3-serif mt-4 text-2xl font-semibold leading-tight md:text-3xl" style={{ color: 'var(--v3-on-emerald)' }}>
              Votre livre devient une série — encore plus professionnel
            </h3>
              <V3FeatureAccessInfo included="Écriture des suites et continuité de votre série de livres" />
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
              src={seriesImg}
              alt="Une série de cinq livres reliés assortis alignés sur une étagère en bois, dans une bibliothèque chaleureuse"
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
