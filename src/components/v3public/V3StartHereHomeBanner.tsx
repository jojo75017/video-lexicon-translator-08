import { ArrowRight, BookOpenCheck, MousePointerClick, UserRoundSearch } from 'lucide-react';
import { Link } from 'react-router-dom';

const STEPS = [
  {
    icon: UserRoundSearch,
    title: 'Choisissez votre type de livre',
    description: 'Roman, biographie, jeunesse, guide pratique, BD et bien plus encore.',
  },
  {
    icon: MousePointerClick,
    title: 'Trouvez le bon spécialiste',
    description: 'Chaque agent connaît les règles et les attentes propres à votre projet.',
  },
  {
    icon: BookOpenCheck,
    title: 'Commencez votre livre',
    description: 'Vous arrivez directement dans le parcours adapté, sans chercher parmi les outils.',
  },
];

/** Carte joviale : bordure épaisse orange/jaune alternée, macaron d'étape incliné. */
const cardStyle = (index: number) =>
  index % 2
    ? { border: '4px solid var(--v3-joy-yellow)', boxShadow: '0 20px 40px -20px color-mix(in srgb, var(--v3-joy-yellow) 45%, transparent)' }
    : { border: '4px solid var(--v3-joy-orange)', boxShadow: '0 20px 40px -20px color-mix(in srgb, var(--v3-joy-orange) 45%, transparent)' };

const macaronStyle = (index: number) =>
  index % 2
    ? { background: 'var(--v3-joy-yellow)' }
    : { background: 'var(--v3-joy-orange)' };

export default function V3StartHereHomeBanner() {
  return (
    <section
      aria-labelledby="v3-start-here-title"
      style={{ background: 'var(--v3-joy-cream)', borderTop: '1px solid var(--v3-joy-orange-soft)', borderBottom: '1px solid var(--v3-joy-orange-soft)' }}
    >
      <div className="v3-shell py-12 md:py-16">
        <div className="text-center">
          <span
            className="inline-flex items-center rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ background: 'var(--v3-joy-orange-soft)', color: 'var(--v3-joy-orange-600)' }}
          >
            Votre point de départ
          </span>
          <h2 id="v3-start-here-title" className="v3-serif mt-3 text-2xl font-semibold md:text-3xl" style={{ color: 'var(--v3-joy-ink)' }}>
            Vous êtes abonné ? Commencez ici.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed md:text-base" style={{ color: 'var(--v3-joy-muted)' }}>
            Inutile de chercher le bon outil. Indiquez simplement le livre que vous voulez créer :
            EbookStudio vous présente le spécialiste adapté et vous guide dès la première étape.
          </p>
        </div>

        <ol className="mt-12 grid gap-10 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, description }, index) => (
            <li
              key={title}
              className="group relative rounded-[3rem] bg-white p-8 pt-10 transition-transform hover:-translate-y-1.5"
              style={cardStyle(index)}
            >
              <div
                className="absolute -top-5 -left-3 grid h-12 w-12 -rotate-12 place-items-center rounded-2xl text-xl font-black text-white shadow-lg transition-transform group-hover:rotate-0"
                style={macaronStyle(index)}
                aria-hidden="true"
              >
                {index + 1}
              </div>
              <div className="flex items-center gap-2" style={{ color: index % 2 ? 'var(--v3-joy-yellow-600)' : 'var(--v3-joy-orange-600)' }}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-3 text-lg font-extrabold" style={{ color: 'var(--v3-joy-ink)' }}>{title}</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--v3-joy-muted)' }}>{description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 text-center">
          <Link
            to="/v3/commence-ici"
            className="inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-[15px] font-bold text-white transition-all hover:-translate-y-0.5"
            style={{
              background: 'var(--v3-joy-orange)',
              boxShadow: '0 12px 30px -10px color-mix(in srgb, var(--v3-joy-orange) 55%, transparent)',
            }}
          >
            Choisir mon spécialiste
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
