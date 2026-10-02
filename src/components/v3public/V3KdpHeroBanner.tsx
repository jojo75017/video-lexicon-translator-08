import { CheckCircle2, Palette, Search, Clock, BookUp } from 'lucide-react';
import heroBooks from '@/assets/v3-kdp-hero-books.jpg';

const BADGES = [
  { icon: Clock, label: 'Écrit en quelques minutes' },
  { icon: Palette, label: 'Couverture professionnelle' },
  { icon: Search, label: '100 % optimisé KDP' },
  { icon: BookUp, label: 'Prêt à publier sur Amazon' },
];

export default function V3KdpHeroBanner() {
  return (
    <div
      className="relative mx-auto mt-8 max-w-6xl overflow-hidden rounded-3xl"
      style={{
        background: 'color-mix(in srgb, var(--v3-joy-ink) 88%, white)',
        boxShadow: '0 20px 40px -24px color-mix(in srgb, var(--v3-joy-ink) 55%, transparent)',
      }}
    >
      {/* Titre */}
      <div className="px-5 pt-6 text-center sm:px-8 sm:pt-7 lg:px-12">
        <h3 className="v3-serif text-xl font-semibold leading-snug text-white sm:text-2xl lg:text-3xl">
          EbookStudio écrit et publie pour vous des{' '}
          <span style={{ color: 'var(--v3-joy-orange)' }}>livres KDP complets et rentables</span>
        </h3>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 sm:px-6 sm:py-2" style={{ background: 'var(--v3-joy-orange)' }}>
          <span className="text-sm font-bold italic text-white sm:text-lg">en moins de 30 minutes&nbsp;!</span>
        </div>
      </div>

      {/* Visuel des couvertures — bandeau compact */}
      <div className="relative mt-4 sm:mt-5">
        <img
          src={heroBooks}
          alt="Cinq couvertures de livres KDP professionnelles sur fond bleu nuit"
          width={1600}
          height={912}
          className="h-32 w-full object-cover object-center sm:h-44 lg:h-52"
        />
        {/* Voiles haut et bas pour l'intégration et la lisibilité */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-10"
          style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--v3-joy-ink) 88%, white), transparent)' }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
          style={{ background: 'linear-gradient(to top, color-mix(in srgb, var(--v3-joy-ink) 88%, white), transparent)' }}
          aria-hidden="true"
        />
      </div>

      {/* Badges */}
      <div className="relative px-4 pb-4 pt-1 sm:px-8 sm:pb-5 lg:px-12">
        <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
          {BADGES.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center justify-center gap-2 sm:gap-2.5">
              <span
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full sm:h-8 sm:w-8"
                style={{ background: 'color-mix(in srgb, var(--v3-joy-orange) 25%, transparent)', color: 'var(--v3-joy-orange)' }}
                aria-hidden="true"
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </span>
              <span className="text-[11px] font-semibold leading-tight text-white sm:text-sm">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
