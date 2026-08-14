import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { LifeBuoy, ArrowRight } from 'lucide-react';
import BackButton from '@/components/v3/BackButton';
import FeatureTile from '@/components/v3/features/FeatureTile';
import FeatureCategoryPanel from '@/components/v3/features/FeatureCategoryPanel';
import { FEATURE_ROWS } from '@/data/v3Features';

/** Module « Fonctionnalités » : 12 tuiles (3 lignes × 4) + support. */
export default function V3FeaturesPage() {
  const [openTile, setOpenTile] = useState<string | null>(null);

  const openCategory = FEATURE_ROWS.flatMap((r) => r.tiles).find(
    (t) => t.id === openTile && t.kind === 'category',
  );

  const toggle = (id: string) => setOpenTile((cur) => (cur === id ? null : id));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <Helmet>
        <title>Fonctionnalités Ebookstudio — tout votre espace en 12 modules</title>
        <meta
          name="description"
          content="Clés IA, coordonnées, réseaux sociaux, intégrations e-mailing, création, écriture, habillage, vente, livres spéciaux, forfaits, parrainage et questions-réponses : tout Ebookstudio en un écran."
        />
      </Helmet>

      <BackButton to="/v3" label="Retour à l'accueil V3" />

      <header className="mb-8 mt-2">
        <p
          className="text-[10.5px] font-bold uppercase tracking-[0.22em]"
          style={{ color: 'var(--v3-gold-600)' }}
        >
          Votre espace
        </p>
        <h1 className="mt-1 text-3xl font-bold md:text-4xl" style={{ color: 'var(--v3-ink)' }}>
          Toutes les fonctionnalités
        </h1>
        <p className="mt-2 max-w-2xl text-[14.5px]" style={{ color: 'var(--v3-muted)' }}>
          Vos réglages privés, le parcours complet du livre et les réponses à vos questions : douze
          modules, un seul écran.
        </p>
      </header>

      <div className="space-y-8">
        {FEATURE_ROWS.map((row) => (
          <section key={row.label}>
            <h2
              className="mb-3 flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.22em]"
              style={{ color: 'var(--v3-emerald)' }}
            >
              <span
                className="inline-block h-1 w-1 rounded-full"
                style={{ background: 'var(--v3-gold)' }}
              />
              {row.label}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {row.tiles.map((tile) => (
                <FeatureTile
                  key={tile.id}
                  tile={tile}
                  open={openTile === tile.id}
                  onToggle={toggle}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {openCategory?.categoryKey && (
        <div className="mt-8">
          <FeatureCategoryPanel
            categoryKey={openCategory.categoryKey}
            onClose={() => setOpenTile(null)}
          />
        </div>
      )}

      <section
        className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl p-5 sm:flex-row sm:items-center"
        style={{ background: 'var(--v3-emerald-50)', border: '1px solid var(--v3-line)' }}
      >
        <div className="flex items-start gap-3">
          <span
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: '#fff' }}
          >
            <LifeBuoy className="h-5 w-5" style={{ color: 'var(--v3-emerald)' }} />
          </span>
          <div>
            <p className="text-[15px] font-bold" style={{ color: 'var(--v3-ink)' }}>
              Une question, un blocage, un bug ?
            </p>
            <p className="text-[13px]" style={{ color: 'var(--v3-muted)' }}>
              Écrivez-nous : réponse personnelle, avec la marche à suivre.
            </p>
          </div>
        </div>
        <Link
          to="/v3/contact"
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[14px] font-semibold text-white"
          style={{ background: 'var(--v3-emerald)' }}
        >
          Contacter le support <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
