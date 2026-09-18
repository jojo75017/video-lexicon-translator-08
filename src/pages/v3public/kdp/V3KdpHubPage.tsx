import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { KDP_TAB_PAGES } from '@/data/kdpTabPages';

/** Espace KDP — sommaire de l'onglet, une page par usage. */
export default function V3KdpHubPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <Helmet>
        <title>Espace KDP — audit, mots-clés et contenu A+ | Ebookstudio</title>
        <meta name="description" content="Toutes les pages KDP réunies : fiche audit à partir d'un ASIN, mots-clés Amazon, catégories et audit avant publication." />
      </Helmet>

      <header className="mb-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--v3-gold-600)' }}>
          Espace KDP
        </p>
        <h1 className="v3-serif text-[30px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
          Tout ce qui concerne Amazon KDP
        </h1>
        <p className="mt-1 max-w-2xl text-[14px]" style={{ color: 'var(--v3-muted)' }}>
          Une page par usage. D'autres pages viendront s'ajouter ici au fil des semaines.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {KDP_TAB_PAGES.map((p) => (
          <Link
            key={p.to}
            to={p.to}
            className="group rounded-2xl border bg-white p-5 transition-shadow hover:shadow-md"
            style={{ borderColor: p.maison ? 'var(--v3-gold)' : 'var(--v3-line)' }}
          >
            <div className="flex items-center gap-2">
              <span className="v3-serif text-[17px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>{p.label}</span>
              {p.badge && <span className="v3-badge">{p.badge}</span>}
            </div>
            <p className="mt-1.5 text-[13px]" style={{ color: 'var(--v3-muted)' }}>{p.desc}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
              Ouvrir <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
