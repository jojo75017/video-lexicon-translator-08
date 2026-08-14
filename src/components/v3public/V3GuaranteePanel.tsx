import { ShieldCheck, Check } from 'lucide-react';

const EMERALD = '#064e3b';
const GOLD = '#c9a84c';
const GOLD_DEEP = '#8a6d16';
const LINE = 'rgba(6,78,59,0.14)';

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
    <section className={`max-w-7xl mx-auto px-5 md:px-8 py-12 ${className}`}>
      <div
        className="rounded-3xl p-7 md:p-10"
        style={{ background: 'linear-gradient(160deg,#ffffff 0%,#fbf6ec 100%)', border: `1px solid ${GOLD}55` }}
      >
        <div className="flex flex-col md:flex-row items-start gap-6">
          <span
            className="grid place-items-center w-14 h-14 rounded-2xl shrink-0"
            style={{ background: `${EMERALD}0F`, border: `1px solid ${GOLD}66`, color: EMERALD }}
          >
            <ShieldCheck className="w-7 h-7" />
          </span>

          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.24em] font-bold" style={{ color: GOLD_DEEP }}>
              Sans risque
            </div>
            <h2 className="v3-serif mt-2 text-2xl md:text-3xl font-semibold leading-tight" style={{ color: EMERALD }}>
              Vous êtes entièrement protégé par notre garantie de remboursement de 30 jours
            </h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-slate-700">
              Pendant 30 jours, utilisez l'atelier comme si c'était le vôtre :
            </p>

            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {TRIALS.map((t) => (
                <li key={t} className="flex gap-2 text-[13.5px] leading-snug text-slate-700">
                  <Check className="mt-0.5 w-4 h-4 shrink-0" style={{ color: GOLD }} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-[14px] leading-relaxed text-slate-700">
              Voyez à quel point votre flux de travail KDP devient plus rapide. Si ce produit ne vous convient pas,
              contactez-nous dans les 30 jours et vous serez remboursé.{' '}
              <strong style={{ color: EMERALD }}>Pas de stress. Aucun risque. Aucun processus compliqué.</strong>{' '}
              Soit vous adorez le système… ou vous récupérez votre argent.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
