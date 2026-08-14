import { X, Check } from 'lucide-react';

const EMERALD = '#064e3b';
const GOLD = '#c9a84c';
const GOLD_DEEP = '#8a6d16';
const LINE = 'rgba(6,78,59,0.14)';

const BEFORE = [
  'Un texte, pas un flux de travail d\u2019édition.',
  'Du contenu, pas de positionnement.',
  'Un classeur à livres : un outil d\u2019édition incomplet.',
  'Un modèle d\u2019IA unique, pas une équipe d\u2019édition.',
];

const AFTER = [
  'Recherche & niche',
  'Écriture du manuscrit',
  'Création des visuels',
  'Conception de couverture',
  'Voix (livre audio)',
  'SEO & mots-clés KDP',
  'Traduction',
  'Publication & métadonnées',
];

/** Section de conviction « Avant / Après » — informative, non cliquable. */
export default function V3BeforeAfterPanel({ className = '' }: { className?: string }) {
  return (
    <section className={`max-w-7xl mx-auto px-5 md:px-8 py-12 ${className}`}>
      <div className="text-center max-w-3xl mx-auto">
        <div className="text-[10px] uppercase tracking-[0.24em] font-bold" style={{ color: GOLD_DEEP }}>
          La nouvelle voie
        </div>
        <h2 className="v3-serif mt-2 text-2xl md:text-3xl font-semibold leading-tight" style={{ color: EMERALD }}>
          Les anciens outils KDP séduisent cinq minutes, puis lâchent au moment de publier
        </h2>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 md:p-7" style={{ border: `1px solid ${LINE}` }}>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#a2483d' }}>
            Avant — une seule IA
          </div>
          <ul className="mt-4 space-y-3">
            {BEFORE.map((b) => (
              <li key={b} className="flex gap-2.5 text-[13.5px] leading-snug text-slate-600">
                <X className="mt-0.5 w-4 h-4 shrink-0" style={{ color: '#a2483d' }} />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="rounded-3xl p-6 md:p-7"
          style={{ background: 'linear-gradient(160deg,#064e3b 0%,#053e2f 100%)', border: `1px solid ${GOLD}55` }}
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>
            Après — Ebookstudio V3
          </div>
          <ol className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {AFTER.map((a, i) => (
              <li key={a} className="flex items-start gap-2 text-[13.5px] leading-snug text-white/90">
                <span
                  className="grid place-items-center w-5 h-5 rounded-full shrink-0 text-[10.5px] font-bold"
                  style={{ background: `${GOLD}26`, color: GOLD, border: `1px solid ${GOLD}66` }}
                >
                  {i + 1}
                </span>
                <span>{a}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="v3-gold-rule my-8" />

      <p className="text-center v3-serif text-[18px] md:text-[21px] font-semibold leading-snug" style={{ color: EMERALD }}>
        Pas une seule IA qui tente de tout faire.
        <span className="block not-italic text-[15px] md:text-[16px] font-normal mt-1.5 text-slate-600">
          <Check className="inline w-4 h-4 mr-1 -mt-0.5" style={{ color: GOLD }} />
          Une IA spécialisée pour chaque étape de votre livre.
        </span>
      </p>
    </section>
  );
}
