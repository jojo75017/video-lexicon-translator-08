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
      className="relative mx-auto mt-10 max-w-6xl overflow-hidden rounded-3xl"
      style={{
        background: 'var(--v3-joy-ink)',
        boxShadow: '0 30px 60px -30px color-mix(in srgb, var(--v3-joy-ink) 70%, transparent)',
      }}
    >
      {/* Titre */}
      <div className="px-5 pt-8 text-center sm:px-8 sm:pt-10 lg:px-12">
        <h3 className="v3-serif text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
          EbookStudio écrit et publie pour vous des{' '}
          <span style={{ color: 'var(--v3-joy-orange)' }}>livres KDP complets et rentables</span>
        </h3>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2 sm:mt-5 sm:px-7 sm:py-2.5" style={{ background: 'var(--v3-joy-orange)' }}>
          <span className="text-lg font-bold italic text-white sm:text-2xl">en moins de 30 minutes&nbsp;!</span>
        </div>
      </div>

      {/* Visuel des couvertures */}
      <div className="relative mt-6 sm:mt-8">
        <img
          src={heroBooks}
          alt="Cinq couvertures de livres KDP professionnelles sur fond bleu nuit"
          width={1600}
          height={912}
          className="h-auto w-full object-cover"
        />
        {/* Voile bas pour la lisibilité des badges */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
          style={{ background: 'linear-gradient(to top, color-mix(in srgb, var(--v3-joy-ink) 92%, transparent), transparent)' }}
          aria-hidden="true"
        />
      </div>

      {/* Badges */}
      <div className="relative border-t border-white/10 px-4 py-4 sm:px-8 sm:py-5 lg:px-12">
        <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
          {BADGES.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center justify-center gap-2 sm:gap-2.5">
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full sm:h-9 sm:w-9"
                style={{ background: 'color-mix(in srgb, var(--v3-joy-orange) 25%, transparent)', color: 'var(--v3-joy-orange)' }}
                aria-hidden="true"
              >
                <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </span>
              <span className="text-[12px] font-semibold leading-tight text-white sm:text-sm">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
