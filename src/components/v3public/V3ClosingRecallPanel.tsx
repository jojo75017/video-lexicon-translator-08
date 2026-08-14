import { Link } from 'react-router-dom';
import { LayoutGrid, Wrench, LifeBuoy, ArrowRight } from 'lucide-react';

const GOLD = '#c9a84c';

const TABS = ['Plan', 'Écrire', 'Habiller', 'Publier', 'Vendre', 'Livres spéciaux'];

const LINKS = [
  { to: '/v3/fonctionnalites', label: 'Voir les 12 modules', icon: LayoutGrid },
  { to: '/v3/outils', label: 'Tous les outils', icon: Wrench },
  { to: '/v3/contact', label: 'Support', icon: LifeBuoy },
];

/** Module de clôture de l'accueil V3 — rappel de tout ce qui est déjà disponible. */
export default function V3ClosingRecallPanel({ className = '' }: { className?: string }) {
  return (
    <section className={`max-w-7xl mx-auto px-5 md:px-8 py-12 ${className}`}>
      <div
        className="rounded-3xl p-7 md:p-10 text-center"
        style={{
          background: 'linear-gradient(160deg,#064e3b 0%,#053e2f 60%,#0a5a45 100%)',
          border: `1px solid ${GOLD}55`,
        }}
      >
        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]"
          style={{ background: `${GOLD}22`, color: GOLD, border: `1px solid ${GOLD}55` }}
        >
          <span aria-hidden>📌</span> Encart de démarrage
        </div>

        <h2 className="v3-serif mt-4 text-2xl md:text-3xl font-semibold text-white leading-tight">
          Cette page vous montre tout ce que contient l’outil
        </h2>
        <p className="mt-3 text-[14.5px] leading-relaxed text-white/85 max-w-2xl mx-auto">
          Pour démarrer un livre, utilisez les onglets dans la barre en haut et dans la barre latérale. Plusieurs modules vous sont déjà à disposition.
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-white/70 max-w-2xl mx-auto">
          Chaque onglet mène directement au module concerné : planifier, écrire, habiller la couverture, publier, vendre ou gérer vos livres.
        </p>

        <ul className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {TABS.map((t) => (
            <li
              key={t}
              className="rounded-full px-3 py-1.5 text-[12.5px] font-semibold"
              style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${GOLD}55`, color: '#f5f0e0' }}
            >
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
          {LINKS.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className="v3-btn v3-btn-gold text-[13px]">
              <Icon className="w-4 h-4" /> {label} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ))}
        </div>

        <p className="mt-8 v3-serif text-[20px] md:text-[24px] italic" style={{ color: GOLD }}>
          À vos livres — et à votre succès.
        </p>
      </div>
    </section>
  );
}
