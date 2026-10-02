import { ShieldCheck, Check } from 'lucide-react';

const INK = 'var(--v3-joy-ink)';
const MUTED = 'var(--v3-joy-muted)';
const ORANGE = 'var(--v3-joy-orange-600)';
const ORANGE_SOFT = 'var(--v3-joy-orange-soft)';

const TRIALS = [
  'Rechercher des idées de livres',
  'Générer des manuscrits',
  'Créer des couvertures',
  'Préparer les métadonnées Amazon',
  'Créer des brouillons de livres audio',
  'Tester les traductions',
  'Créer vos ressources d\u2019édition',
];

/** Section « Garantie 30 jours » — informative, non cliquable. */
export default function V3GuaranteePanel({ className = '' }: { className?: string }) {
  return (
    <section className={`v3-shell py-8 ${className}`}>
      <div
        className="rounded-3xl p-7 md:p-9"
        style={{ background: 'var(--v3-joy-cream)', border: `1px solid ${ORANGE_SOFT}` }}
      >
        <div className="flex flex-col items-start gap-6 md:flex-row">
          <span
            className="grid w-14 h-14 shrink-0 place-items-center rounded-2xl"
            style={{ background: ORANGE_SOFT, color: ORANGE }}
          >
            <ShieldCheck className="w-7 h-7" />
          </span>

          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.24em] font-bold" style={{ color: ORANGE }}>
              Sans risque
            </div>
            <h2 className="v3-serif mt-2 text-2xl font-semibold leading-tight md:text-3xl" style={{ color: INK }}>
              Vous êtes entièrement protégé par notre garantie de remboursement de 30 jours
            </h2>
            <p className="mt-3 text-[14.5px] leading-relaxed" style={{ color: MUTED }}>
              Pendant 30 jours, utilisez l'atelier comme si c'était le vôtre :
            </p>

            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {TRIALS.map((t) => (
                <li key={t} className="flex gap-2 text-[13.5px] leading-snug" style={{ color: MUTED }}>
                  <Check className="mt-0.5 w-4 h-4 shrink-0" style={{ color: ORANGE }} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-[14px] leading-relaxed" style={{ color: MUTED }}>
              Voyez à quel point votre flux de travail KDP devient plus rapide. Si ce produit ne vous convient pas,
              contactez-nous dans les 30 jours et vous serez remboursé.{' '}
              <strong style={{ color: INK }}>Pas de stress. Aucun risque. Aucun processus compliqué.</strong>{' '}
              Soit vous adorez le système… ou vous récupérez votre argent.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
