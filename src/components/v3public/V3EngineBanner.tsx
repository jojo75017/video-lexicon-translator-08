import { Link } from 'react-router-dom';
import {
  Search,
  PenTool,
  Image as ImageIcon,
  LayoutTemplate,
  AudioLines,
  Tags,
  Languages,
  Check,
  ArrowRight,
} from 'lucide-react';

const EMERALD = '#064e3b';
const GOLD = '#c9a84c';
const GOLD_DEEP = '#8a6d16';
const CREAM = '#fbf6ec';
const LINE = 'rgba(6,78,59,0.14)';

type Engine = {
  role: string;
  title: string;
  engine: string;
  desc: string;
  icon: typeof Search;
  to?: string;
};

const ENGINES: Engine[] = [
  {
    role: 'Recherche',
    title: 'Recherche & niche',
    engine: 'Gemini — recherche approfondie',
    desc: 'Niche, concurrence et angle éditorial analysés avant la première ligne.',
    icon: Search,
    to: '/v3/outils/espion-concurrents',
  },
  {
    role: 'Rédaction',
    title: 'Rédaction du manuscrit',
    engine: 'ChatGPT — la plume',
    desc: 'Chapitre par chapitre, avec mémoire de la bible du livre.',
    icon: PenTool,
    to: '/v3/studio',
  },
  {
    role: 'Visuels',
    title: 'Visuels de couverture',
    engine: 'Génération d’images IA',
    desc: 'Directions artistiques photoréalistes, déclinables à volonté.',
    icon: ImageIcon,
    to: '/v3/hub?tab=cover-pro',
  },
  {
    role: 'Mise en page',
    title: 'Couverture & mise en page',
    engine: 'Cover Studio Pro — 300 DPI',
    desc: 'Dos calculé, 4e de couverture et fonds perdus conformes KDP.',
    icon: LayoutTemplate,
    to: '/v3/hub?tab=cover-pro',
  },
  {
    role: 'Narration',
    title: 'Livre audio',
    engine: 'Synthèse vocale premium',
    desc: 'Votre manuscrit lu au format audio, prêt à publier.',
    icon: AudioLines,
    to: '/v3/outils/livre-audio',
  },
  {
    role: 'Métadonnées',
    title: 'Métadonnées Amazon',
    engine: 'Optimisation KDP',
    desc: 'Titre, sous-titre, 7 mots-clés et catégories choisis pour être trouvés.',
    icon: Tags,
    to: '/kdp-keywords',
  },
  {
    role: 'International',
    title: 'Portée mondiale',
    engine: 'Traduction 10 langues',
    desc: 'Le même livre publié sur les marchés Amazon étrangers.',
    icon: Languages,
    to: '/v3/outils/traducteur',
  },
];

const BENEFITS = [
  'Une vraie autonomie de l’IA : recherche, rédaction, couverture, audio et métadonnées.',
  'Des fichiers prêts pour KDP, pas des brouillons à retravailler pendant des semaines.',
  'Un seul enchaînement, de l’idée au fichier publiable.',
];

/** Bandeau fin pleine largeur — accroche « moteur multi-modèles ». */
export function V3EngineStrip({ className = '' }: { className?: string }) {
  return (
    <a
      href="#moteurs-ia-v3"
      className={`block w-full group ${className}`}
      style={{
        background: `linear-gradient(90deg, ${EMERALD} 0%, #053e2f 50%, ${EMERALD} 100%)`,
        borderTop: `1px solid ${GOLD}55`,
        borderBottom: `1px solid ${GOLD}55`,
      }}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-3 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center">
        <span
          className="text-[10px] font-bold uppercase tracking-[0.2em] rounded-full px-2.5 py-1 whitespace-nowrap"
          style={{ color: GOLD, background: `${GOLD}1A`, border: `1px solid ${GOLD}66` }}
        >
          Moteur multi-modèles
        </span>
        <p className="text-[13.5px] leading-snug text-white">
          <strong style={{ color: GOLD }}>EbookStudio V3 n’est pas une seule IA.</strong>{' '}
          Chaque étape de votre livre est confiée à une IA spécialisée.{' '}
          <span className="underline underline-offset-2 decoration-white/40 group-hover:decoration-white whitespace-nowrap">
            Voir les moteurs →
          </span>
        </p>
      </div>
    </a>
  );
}

/** Section détaillée — les 7 moteurs IA de la V3. */
export function V3EngineGrid({ className = '' }: { className?: string }) {
  return (
    <section id="moteurs-ia-v3" className={`max-w-7xl mx-auto px-5 md:px-8 py-14 ${className}`}>
      <div
        className="rounded-3xl p-8 md:p-10"
        style={{ background: CREAM, border: `1px solid ${LINE}` }}
      >
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-[10px] uppercase tracking-[0.24em] font-bold" style={{ color: GOLD_DEEP }}>
            Sous le capot
          </div>
          <h2
            className="v3-serif mt-2 text-3xl md:text-4xl font-semibold leading-tight"
            style={{ color: EMERALD }}
          >
            Les moteurs IA de la V3
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
            Un moteur de publication <strong>multi-modèles</strong> : là où les autres outils font tout
            passer par une seule IA généraliste, la V3 confie chaque tâche au modèle le plus doué pour elle.
          </p>
        </div>

        <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ENGINES.map((e) => {
            const Icon = e.icon;
            const inner = (
              <>
                <div className="flex items-start gap-3">
                  <span
                    className="grid place-items-center w-10 h-10 rounded-xl shrink-0"
                    style={{ background: `${EMERALD}0F`, border: `1px solid ${GOLD}55`, color: EMERALD }}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <div
                      className="text-[9.5px] font-bold uppercase tracking-[0.18em]"
                      style={{ color: GOLD_DEEP }}
                    >
                      {e.role}
                    </div>
                    <div className="v3-serif text-[16px] font-semibold leading-tight" style={{ color: EMERALD }}>
                      {e.title}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-[12px] font-semibold" style={{ color: GOLD_DEEP }}>
                  {e.engine}
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">{e.desc}</p>
                {e.to && (
                  <span
                    className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold"
                    style={{ color: EMERALD }}
                  >
                    Ouvrir le module <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </>
            );

            return e.to ? (
              <Link
                key={e.title}
                to={e.to}
                className="rounded-2xl bg-white p-5 transition-shadow hover:shadow-[0_18px_40px_-28px_rgba(6,78,59,0.55)]"
                style={{ border: `1px solid ${LINE}` }}
              >
                {inner}
              </Link>
            ) : (
              <div key={e.title} className="rounded-2xl bg-white p-5" style={{ border: `1px solid ${LINE}` }}>
                {inner}
              </div>
            );
          })}
        </div>

        <ul className="mt-9 grid gap-3 md:grid-cols-3">
          {BENEFITS.map((b) => (
            <li key={b} className="flex gap-2.5 text-[13.5px] leading-snug text-slate-700">
              <Check className="mt-0.5 w-4 h-4 shrink-0" style={{ color: GOLD }} />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default V3EngineGrid;
