import { ShieldAlert } from 'lucide-react';

const EMERALD = '#064e3b';
const GOLD = '#c9a84c';
const GOLD_DEEP = '#8a6d16';
const CREAM = '#fbf6ec';
const LINE = 'rgba(6,78,59,0.14)';

const STATS = [
  { value: '300 M+', label: 'clients actifs Amazon' },
  { value: '70 %', label: 'de redevances KDP au maximum' },
  { value: '67 M$', label: 'versés aux auteurs Kindle Unlimited en juin' },
  { value: '17,67 Md$', label: 'marché du livre numérique projeté en 2031' },
  { value: '58,5 Md$', label: 'marché du livre audio projeté en 2033' },
];

/** Section « Voici ce que prouve le marché » — informative, non cliquable. */
export default function V3MarketProofPanel({ className = '' }: { className?: string }) {
  return (
    <section className={`max-w-7xl mx-auto px-5 md:px-8 py-12 ${className}`}>
      <div className="rounded-3xl p-7 md:p-10" style={{ background: CREAM, border: `1px solid ${LINE}` }}>
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-[10px] uppercase tracking-[0.24em] font-bold" style={{ color: GOLD_DEEP }}>
            Les chiffres
          </div>
          <h2 className="v3-serif mt-2 text-2xl md:text-3xl font-semibold" style={{ color: EMERALD }}>
            Voici ce que prouve le marché
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-3.5">
          {STATS.map((s) => (
            <div key={s.value} className="rounded-2xl bg-white p-4 text-center" style={{ border: `1px solid ${LINE}` }}>
              <div className="v3-serif text-[22px] md:text-[26px] font-semibold leading-none" style={{ color: EMERALD }}>
                {s.value}
              </div>
              <div className="mt-2 text-[12px] leading-snug text-slate-600">{s.label}</div>
            </div>
          ))}
        </div>

        <div
          className="mt-6 flex gap-2.5 rounded-2xl p-4 text-[12.5px] leading-relaxed text-slate-700"
          style={{ background: '#fff', border: `1px solid ${GOLD}44` }}
        >
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" style={{ color: GOLD_DEEP }} />
          <span>
            Les directives KDP d'Amazon autorisent le contenu généré par l'IA, mais il incombe aux éditeurs de
            vérifier la conformité et de divulguer le contenu généré par l'IA lorsque cela est requis.
          </span>
        </div>

        <p className="mt-6 text-center text-[14.5px] leading-relaxed text-slate-700 max-w-3xl mx-auto">
          L'opportunité est énorme… mais publier des ouvrages de mauvaise qualité est risqué.{' '}
          <strong style={{ color: EMERALD }}>Ebookstudio V3</strong> aide les auteurs à abandonner les livres d'IA
          bon marché et génériques pour adopter un flux de travail d'édition complet et axé sur la qualité.
        </p>
      </div>
    </section>
  );
}
