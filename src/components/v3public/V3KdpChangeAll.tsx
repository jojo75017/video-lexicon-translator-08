import { CheckCircle2, Euro, Sparkles } from 'lucide-react';
import changeEverything from '@/assets/v3-kdp-change-everything.jpg';

const BULLETS = [
  'Écrivez un livre complet en quelques jours, à votre rythme.',
  'Créez une couverture professionnelle sans designer.',
  'Ciblez des niches vérifiées, avec des données réelles du marché.',
  'Mettez en page votre livre sans logiciel compliqué.',
  'Préparez et publiez sur Amazon KDP en quelques clics.',
];

export default function V3KdpChangeAll() {
  return (
    <section
      className="border-b"
      style={{ background: 'var(--v3-joy-cream)', borderColor: 'var(--v3-joy-orange-soft)' }}
      aria-labelledby="kdp-change-all-title"
    >
      <div className="v3-shell py-10 md:py-14">
        <div className="mx-auto max-w-5xl text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase"
            style={{ background: 'var(--v3-joy-orange-soft)', color: 'var(--v3-joy-orange-600)' }}
          >
            <Euro className="h-3.5 w-3.5" /> Des royalties, mois après mois
          </span>
          <h2 id="kdp-change-all-title" className="v3-serif mt-4 text-3xl font-semibold md:text-4xl" style={{ color: 'var(--v3-joy-ink)' }}>
            EbookStudio change tout :
          </h2>
        </div>

        {/* Carte orange — structure de la référence, sans bandeau promotionnel */}
        <div
          className="mx-auto mt-8 max-w-6xl overflow-hidden rounded-3xl md:mt-10"
          style={{
            background: 'var(--v3-joy-orange)',
            boxShadow: '0 30px 60px -30px color-mix(in srgb, var(--v3-joy-orange-600) 60%, transparent)',
          }}
        >
          <div className="grid items-center gap-8 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:p-12">
            {/* Visuel produit */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="overflow-hidden rounded-2xl ring-4 ring-white/40">
                <img
                  src={changeEverything}
                  alt="Des livres publiés et un ordinateur portable, dans les couleurs d'EbookStudio"
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="aspect-square h-auto w-full object-cover"
                />
              </div>
              <span
                className="absolute -bottom-3 left-4 grid h-12 w-12 place-items-center rounded-full shadow-lg"
                style={{ background: 'var(--v3-joy-ink)', color: 'var(--v3-joy-orange)' }}
                aria-hidden="true"
              >
                <Sparkles className="h-6 w-6" />
              </span>
            </div>

            {/* Puces positives + calcul de revenus */}
            <div className="text-white">
              <ul className="space-y-3">
                {BULLETS.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="text-[15px] font-medium leading-6 md:text-base md:leading-7">{b}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-[15px] leading-7 text-white/90 md:text-base">
                EbookStudio vous accompagne à chaque étape — intelligemment et en quelques minutes.
              </p>

              <h3 className="v3-serif mt-6 text-xl font-semibold md:text-2xl">Réfléchissez-y un instant :</h3>
              <div className="mt-3 space-y-2.5 text-[15px] leading-7 text-white/95 md:text-base">
                <p>
                  Si un seul de vos livres vous rapporte <strong>5 € par jour</strong> en droits d'auteur,
                  cela représente <strong>150 € par mois</strong>.
                </p>
                <p>
                  Imaginez maintenant <strong>10 livres</strong>. Cela représente <strong>1 500 € par mois</strong>.
                </p>
                <p>
                  Imaginez maintenant <strong>100 livres</strong>. Cela représente{' '}
                  <strong>15 000 € par mois</strong> — avec des outils qui vous font gagner un temps précieux.
                </p>
              </div>

              <p className="mt-5 text-[15px] font-medium leading-7 text-white/90 md:text-base">
                EbookStudio a été conçu pour vous aider à y parvenir — plus rapidement que vous ne l'auriez jamais imaginé.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
