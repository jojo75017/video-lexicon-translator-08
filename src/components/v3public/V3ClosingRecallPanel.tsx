import { Link } from 'react-router-dom';
import { LayoutGrid, Wrench, LifeBuoy, ArrowRight } from 'lucide-react';

const TABS = ['Plan', 'Écrire', 'Habiller', 'Publier', 'Vendre', 'Livres spéciaux'];

const LINKS = [
  { to: '/v3/fonctionnalites', label: 'Voir les 12 modules', icon: LayoutGrid },
  { to: '/v3/outils', label: 'Tous les outils', icon: Wrench },
  { to: '/v3/contact', label: 'Support', icon: LifeBuoy },
];

/** Module de clôture de l'accueil V3 — rappel de tout ce qui est déjà disponible. */
export default function V3ClosingRecallPanel({ className = '' }: { className?: string }) {
  return (
    <section className={`v3-shell py-8 ${className}`}>
      <div
        className="rounded-3xl p-7 text-center md:p-9"
        style={{
          background: 'var(--v3-joy-cream)',
          border: '1px solid var(--v3-joy-orange-soft)',
          boxShadow: '0 18px 40px -30px rgba(30, 41, 59, 0.35)',
        }}
      >
        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]"
          style={{ background: 'var(--v3-joy-orange-soft)', color: 'var(--v3-joy-orange-600)' }}
        >
          <span aria-hidden>📌</span> Encart de démarrage
        </div>

        <h2 className="v3-serif mt-4 text-2xl font-semibold leading-tight md:text-3xl" style={{ color: 'var(--v3-joy-ink)' }}>
          Cette page vous montre tout ce que contient l’outil
        </h2>
        <p className="mt-3 text-[14.5px] leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--v3-joy-muted)' }}>
          Pour démarrer un livre, utilisez les onglets dans la barre en haut et dans la barre latérale. Plusieurs modules vous sont déjà à disposition.
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--v3-joy-muted)' }}>
          Chaque onglet mène directement au module concerné : planifier, écrire, habiller la couverture, publier, vendre ou gérer vos livres.
        </p>

        <ul className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {TABS.map((t) => (
            <li
              key={t}
              className="rounded-full px-3 py-1.5 text-[12.5px] font-semibold"
              style={{ background: 'var(--v3-joy-orange-soft)', color: 'var(--v3-joy-orange-600)' }}
            >
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
          {LINKS.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className="v3-btn v3-joy-cta text-[13px]">
              <Icon className="w-4 h-4" /> {label} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ))}
        </div>

        <p className="v3-serif mt-8 text-[20px] italic md:text-[24px]" style={{ color: 'var(--v3-joy-orange-600)' }}>
          À vos livres — et à votre succès.
        </p>
      </div>
    </section>
  );
}
