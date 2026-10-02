import { Link } from 'react-router-dom';
import {
  Search,
  PenTool,
  Image as ImageIcon,
  LayoutTemplate,
  AudioLines,
  Tags,
  Languages,
  LineChart,
  Check,
  ArrowRight,
} from 'lucide-react';
import { TWO_STEP_ENGINES } from '@/data/v3TwoStepEngines';

const INK = 'var(--v3-joy-ink)';
const MUTED = 'var(--v3-joy-muted)';
const ORANGE = 'var(--v3-joy-orange-600)';
const ORANGE_SOFT = 'var(--v3-joy-orange-soft)';
const CREAM = 'var(--v3-joy-cream)';

const ICONS: Record<string, typeof Search> = {
  recherche: Search,
  manuscrit: PenTool,
  correction: PenTool,
  visuels: ImageIcon,
  'mise-en-page': LayoutTemplate,
  audio: AudioLines,
  metadonnees: Tags,
  traduction: Languages,
};

const BENEFITS = [
  'Chaque module travaille en 2 temps : Gemini analyse, ChatGPT rédige.',
  'Vous relisez le brief du temps 1 avant que le texte soit écrit.',
  'Vos clés Gemini et OpenRouter restent les vôtres, dans votre navigateur.',
];

/** Bandeau fin pleine largeur — accroche « moteur multi-modèles ». */
export function V3EngineStrip({ className = '' }: { className?: string }) {
  return (
    <a
      href="#moteurs-ia-v3"
      className={`block w-full group ${className}`}
      style={{
        background: CREAM,
        borderTop: `1px solid ${ORANGE_SOFT}`,
        borderBottom: `1px solid ${ORANGE_SOFT}`,
      }}
    >
      <div className="v3-shell py-3 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center">
        <span
          className="text-[10px] font-bold uppercase tracking-[0.2em] rounded-full px-2.5 py-1 whitespace-nowrap"
          style={{ color: ORANGE, background: ORANGE_SOFT }}
        >
          Moteur multi-modèles
        </span>
        <p className="text-[13.5px] leading-snug" style={{ color: INK }}>
          <strong style={{ color: ORANGE }}>EbookStudio V3 n’est pas une seule IA.</strong>{' '}
          Chaque étape de votre livre est confiée à une IA spécialisée.{' '}
          <span className="whitespace-nowrap underline underline-offset-2" style={{ color: ORANGE }}>
            Voir les moteurs →
          </span>
        </p>
      </div>
    </a>
  );
}

/** Section détaillée — les modules de la V3, tous en 2 temps. */
export function V3EngineGrid({ className = '' }: { className?: string }) {
  return (
    <section id="moteurs-ia-v3" className={`v3-shell py-8 ${className}`}>
      <div className="rounded-3xl p-6 md:p-8" style={{ background: CREAM, border: `1px solid ${ORANGE_SOFT}` }}>
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-[10px] uppercase tracking-[0.24em] font-bold" style={{ color: ORANGE }}>
            Sous le capot
          </div>
          <h2 className="v3-serif mt-2 text-2xl font-semibold leading-tight md:text-3xl" style={{ color: INK }}>
            Chaque module travaille en 2 temps
          </h2>
          <p className="mt-2.5 text-[14px] leading-relaxed" style={{ color: MUTED }}>
            <strong style={{ color: ORANGE }}>Temps 1 : Gemini analyse</strong> et prépare le travail.{' '}
            <strong style={{ color: ORANGE }}>Temps 2 : ChatGPT rédige</strong> à partir de cette préparation. Vous voyez les deux
            temps, et vous pouvez relire le brief avant que le texte soit écrit.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {TWO_STEP_ENGINES.map((e) => {
            const Icon = ICONS[e.id] ?? Search;
            const inner = (
              <>
                <div className="flex items-start gap-3">
                  <span
                    className="grid place-items-center w-10 h-10 rounded-xl shrink-0"
                    style={{ background: ORANGE_SOFT, color: ORANGE }}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[9.5px] font-bold uppercase tracking-[0.18em]" style={{ color: ORANGE }}>
                      {e.role}
                    </div>
                    <div className="v3-serif text-[16px] font-semibold leading-tight" style={{ color: INK }}>
                      {e.title}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="text-[11.5px] leading-snug" style={{ color: MUTED }}>
                    <strong style={{ color: ORANGE }}>Temps 1 · {e.temps1.label}</strong>
                    <br />
                    {e.temps1.output}
                  </div>
                  <div className="text-[11.5px] leading-snug" style={{ color: MUTED }}>
                    <strong style={{ color: ORANGE }}>Temps 2 · {e.temps2.label}</strong>
                    <br />
                    {e.temps2.output}
                  </div>
                </div>
                <p className="mt-2 text-[12.5px] leading-relaxed" style={{ color: MUTED }}>{e.desc}</p>
                {!e.live && (
                  <span
                    className="mt-2 inline-block text-[11px] font-semibold rounded-full px-2 py-0.5"
                    style={{ color: ORANGE, background: ORANGE_SOFT }}
                  >
                    2 temps en cours de branchement
                  </span>
                )}
                {e.route && (
                  <span className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold" style={{ color: ORANGE }}>
                    Ouvrir le module <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </>
            );

            const cardStyle = { background: '#fff', border: `1px solid ${ORANGE_SOFT}` };

            return e.route ? (
              <Link
                key={e.id}
                to={e.route}
                className="rounded-2xl p-4 transition-shadow hover:shadow-[0_18px_40px_-28px_rgba(30,41,59,0.5)]"
                style={cardStyle}
              >
                {inner}
              </Link>
            ) : (
              <div key={e.title} className="rounded-2xl p-4" style={cardStyle}>
                {inner}
              </div>
            );
          })}
        </div>

        <ul className="mt-6 grid gap-3 md:grid-cols-3">
          {BENEFITS.map((b) => (
            <li key={b} className="flex gap-2.5 text-[13px] leading-snug" style={{ color: MUTED }}>
              <Check className="mt-0.5 w-4 h-4 shrink-0" style={{ color: ORANGE }} />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default V3EngineGrid;
