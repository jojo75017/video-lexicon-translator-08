import { BarChart3, BookOpenCheck, Search, Sparkles, Target, TrendingUp } from 'lucide-react';

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
              <h3 className="v3-serif mt-4 text-2xl font-semibold leading-tight text-white md:text-3xl">
                Moteur de recherche de niches et de mots-clés
              </h3>
              <ul className="mt-5 space-y-3">
                {BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-[14px] leading-6 text-white/90 md:text-[15px]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: 'var(--v3-joy-orange)' }} />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="overflow-hidden rounded-2xl p-2.5 sm:p-3"
              style={{ background: 'var(--v3-joy-orange-soft)', border: '1px solid var(--v3-joy-orange)' }}
              aria-label="Aperçu du Radar de niches EbookStudio"
            >
              <div className="overflow-hidden rounded-xl bg-white shadow-xl">
                <div className="flex h-10 items-center gap-2 px-4" style={{ background: 'var(--v3-joy-ink)' }}>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--v3-joy-orange)' }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--v3-joy-yellow)' }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--v3-emerald-600)' }} />
                  <span className="ml-auto text-[10px] font-semibold text-white/80">EbookStudio · Espace KDP</span>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[9px] font-bold uppercase" style={{ color: 'var(--v3-joy-orange-600)' }}>Radar de niches</p>
                      <p className="mt-1 text-[15px] font-bold" style={{ color: 'var(--v3-joy-ink)' }}>Trouvez votre prochaine idée de livre</p>
                    </div>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ background: 'var(--v3-joy-orange-soft)', color: 'var(--v3-joy-orange-600)' }}>
                      <Target className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                    <div className="rounded-lg border px-3 py-2 text-[11px]" style={{ borderColor: 'var(--v3-joy-orange-soft)', color: 'var(--v3-joy-muted)' }}>
                      Bien-être et sommeil
                    </div>
                    <div className="grid place-items-center rounded-lg px-3" style={{ background: 'var(--v3-joy-orange)', color: 'var(--v3-joy-ink)' }}>
                      <Search className="h-4 w-4" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {NICHE_RESULTS.map((item) => (
                      <div key={item.name} className="rounded-lg border p-3" style={{ borderColor: 'var(--v3-joy-orange-soft)', background: 'var(--v3-joy-cream)' }}>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[11px] font-bold" style={{ color: 'var(--v3-joy-ink)' }}>{item.name}</span>
                          <BookOpenCheck className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--v3-emerald)' }} aria-hidden="true" />
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--v3-joy-orange-soft)' }}>
                          <div className="h-full rounded-full" style={{ width: item.width, background: 'var(--v3-joy-orange)' }} />
                        </div>
                        <div className="mt-2 flex gap-2 text-[9px] font-semibold" style={{ color: 'var(--v3-joy-muted)' }}>
                          <span className="inline-flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Demande {item.demand.toLowerCase()}</span>
                          <span className="inline-flex items-center gap-1"><BarChart3 className="h-3 w-3" /> Concurrence {item.competition.toLowerCase()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}