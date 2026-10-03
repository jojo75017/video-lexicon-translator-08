import { Search, Sparkles } from 'lucide-react';
import nicheResearchImg from '@/assets/v3-kdp-niche-research.jpg';

const BENEFITS = [
  'Explorez des niches de livres à partir d’un thème précis.',
  'Évaluez la demande et la concurrence avec des estimations clairement présentées.',
  'Trouvez les 7 expressions à renseigner dans Amazon KDP.',
  'Repérez des angles éditoriaux pour différencier votre livre.',
  'Préparez vos titres, sous-titres et métadonnées dans un même espace.',
  'Conservez vos dernières recherches pour comparer vos pistes.',
];

const NICHE_RESULTS = [
  { name: 'Journal guidé du sommeil', demand: 'Forte', competition: 'Modérée', width: '78%' },
  { name: 'Routine du soir familiale', demand: 'Moyenne', competition: 'Faible', width: '62%' },
  { name: 'Carnet anti-écrans', demand: 'Forte', competition: 'Modérée', width: '72%' },
];

export default function V3KdpFeatureShowcase() {
  return (
    <section
      className="border-b"
      style={{ background: 'var(--v3-joy-cream)', borderColor: 'var(--v3-joy-orange-soft)' }}
      aria-labelledby="kdp-feature-showcase-title"
    >
      <div className="v3-shell py-10 md:py-12">
        <header className="mx-auto max-w-4xl text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase"
            style={{ background: 'var(--v3-joy-orange-soft)', color: 'var(--v3-joy-orange-600)' }}
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> La plateforme tout-en-un
          </span>
          <h2
            id="kdp-feature-showcase-title"
            className="v3-serif mt-4 text-3xl font-semibold leading-tight md:text-4xl"
            style={{ color: 'var(--v3-joy-ink)' }}
          >
            Tout ce dont vous avez besoin pour réussir sur Amazon KDP
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-[15px] leading-7 md:text-base" style={{ color: 'var(--v3-joy-muted)' }}>
            Des fonctionnalités puissantes pilotées par l’IA qui fonctionnent de concert pour rechercher,
            créer, concevoir, publier et développer votre catalogue de livres depuis une seule plateforme.
          </p>
        </header>

        <article
          className="mx-auto mt-8 max-w-6xl overflow-hidden rounded-3xl"
          style={{
            background: 'var(--v3-joy-ink)',
            border: '1px solid var(--v3-joy-orange)',
            boxShadow: '0 24px 50px -32px color-mix(in srgb, var(--v3-joy-ink) 55%, transparent)',
          }}
        >
          <div className="grid items-center gap-8 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:p-10">
            <div>
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase"
                style={{ background: 'color-mix(in srgb, var(--v3-joy-orange) 18%, transparent)', color: 'var(--v3-joy-orange)' }}
              >
                Caractéristique 01 <Search className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <h3 className="v3-serif mt-4 text-2xl font-semibold leading-tight md:text-3xl" style={{ color: 'var(--v3-on-emerald)' }}>
                Moteur de recherche de niches et de mots-clés
              </h3>
              <ul className="mt-5 space-y-3">
                {BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-[14px] leading-6 md:text-[15px]" style={{ color: 'color-mix(in srgb, var(--v3-on-emerald) 90%, transparent)' }}>
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: 'var(--v3-joy-orange)' }} />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="overflow-hidden rounded-2xl p-2"
              style={{ background: 'var(--v3-joy-orange-soft)', border: '1px solid var(--v3-joy-orange)' }}
            >
              <img
                src={nicheResearchImg}
                alt="Ordinateur portable affichant des graphiques de recherche de niches, carnet de notes et livres sur un bureau en bois"
                width={1024}
                height={1024}
                loading="lazy"
                className="h-40 w-full rounded-xl object-cover sm:h-48 lg:h-56"
              />
            </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}