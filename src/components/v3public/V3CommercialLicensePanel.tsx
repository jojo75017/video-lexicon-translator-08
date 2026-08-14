import { BadgeCheck, Check } from 'lucide-react';

const EMERALD = '#064e3b';
const GOLD = '#c9a84c';
const GOLD_DEEP = '#8a6d16';
const CREAM = '#fbf6ec';
const LINE = 'rgba(6,78,59,0.14)';

const DELIVERABLES = [
  'Packs de livres Kindle',
  'Packs de brouillons audio',
  'Forfaits de couverture',
  'Rapports de recherche KDP',
  'Ensembles de descriptions',
  'Packs de mots-clés et catégories',
  'Packs de traduction',
  'Kits de marque d\u2019auteur',
  'Plans de séries',
  'Packs d\u2019eBooks magnétiques',
  'Packs de publication client',
];

/** Section « Licence commerciale à vie incluse » — informative, non cliquable. */
export default function V3CommercialLicensePanel({ className = '' }: { className?: string }) {
  return (
    <section className={`max-w-7xl mx-auto px-5 md:px-8 py-12 ${className}`}>
      <div className="rounded-3xl p-7 md:p-10" style={{ background: CREAM, border: `1px solid ${LINE}` }}>
        <div className="text-center max-w-3xl mx-auto">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ background: `${GOLD}22`, border: `1px solid ${GOLD}66`, color: GOLD_DEEP }}
          >
            <BadgeCheck className="w-3 h-3" /> Incluse dans les deux forfaits
          </span>
          <h2 className="v3-serif mt-3 text-2xl md:text-3xl font-semibold" style={{ color: EMERALD }}>
            Licence commerciale à vie incluse
          </h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-slate-700">
            Ebookstudio V3 n'est pas réservé à vos propres livres. Vous pouvez aussi l'utiliser pour proposer
            des services d'édition.
          </p>
        </div>

        <ul className="mt-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {DELIVERABLES.map((d) => (
            <li
              key={d}
              className="flex gap-2 rounded-xl bg-white px-3.5 py-2.5 text-[13px] leading-snug text-slate-700"
              style={{ border: `1px solid ${LINE}` }}
            >
              <Check className="mt-0.5 w-4 h-4 shrink-0" style={{ color: GOLD }} />
              <span>{d}</span>
            </li>
          ))}
        </ul>

        <p className="mt-7 text-[14px] leading-relaxed text-slate-700 max-w-3xl mx-auto text-center">
          Des coachs, consultants, créateurs, experts locaux, chefs d'entreprise et entrepreneurs veulent un
          livre… mais ne savent pas comment faire les recherches, rédiger, concevoir, mettre en forme ou préparer
          le document. Avec Ebookstudio V3, vous devenez la personne qui les aide. Vous facturez ce service.
          Vous livrez plus rapidement.{' '}
          <strong style={{ color: EMERALD }}>Vous conservez 100 % de ce que vous facturez.</strong>
        </p>

        <p className="mt-4 text-center text-[12.5px]" style={{ color: GOLD_DEEP }}>
          Licence commerciale incluse dans les forfaits Plume et Édition — aucune option payante supplémentaire.
        </p>
      </div>
    </section>
  );
}
