import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { V3_HEADER_MENU } from '@/data/v3HeaderMenu';

interface Props {
  categoryKey: string;
  onClose: () => void;
}

/** Panneau déplié sous la grille : tous les liens de la catégorie du header. */
export function FeatureCategoryPanel({ categoryKey, onClose }: Props) {
  const category = V3_HEADER_MENU.find((c) => c.key === categoryKey);
  if (!category) return null;

  return (
    <section
      className="rounded-2xl bg-white p-5"
      style={{ border: '1px solid var(--v3-line)', boxShadow: '0 8px 24px rgba(6,78,59,0.08)' }}
    >
      <header className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold" style={{ color: 'var(--v3-ink)' }}>
            {category.emoji} {category.label}
          </h2>
          {category.tagline && (
            <p className="text-[13px]" style={{ color: 'var(--v3-muted)' }}>
              {category.tagline} — {category.links.length} outils
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1.5 hover:bg-black/5"
          aria-label="Fermer"
          style={{ color: 'var(--v3-muted)' }}
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {category.links.map((link) => (
          <li key={link.to + link.label}>
            <Link
              to={link.to}
              className="flex h-full flex-col rounded-xl p-3 transition-colors hover:bg-black/[0.03]"
              style={{ border: '1px solid var(--v3-line)' }}
            >
              <span className="flex items-center gap-2">
                <span className="text-[13.5px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
                  {link.label}
                </span>
                {link.badge && (
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.12em]"
                    style={{ background: 'rgba(201,168,76,0.18)', color: '#8a6d12' }}
                  >
                    {link.badge}
                  </span>
                )}
                <ArrowRight className="ml-auto h-3.5 w-3.5" style={{ color: 'var(--v3-muted)' }} />
              </span>
              {link.desc && (
                <span className="mt-1 text-[12px] leading-snug" style={{ color: 'var(--v3-muted)' }}>
                  {link.desc}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default FeatureCategoryPanel;
