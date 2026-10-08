import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Crown, FolderOpen, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ACTIONS = [
  {
    to: '/v3/couverture-express',
    title: 'Créer ma couverture',
    description: 'L’assistant vous guide du titre jusqu’au téléchargement.',
    icon: BookOpen,
    primary: true,
  },
  {
    to: '/v3/studio-v4',
    title: 'Mes couvertures',
    description: 'Retrouvez, modifiez ou téléchargez un projet existant.',
    icon: FolderOpen,
    primary: false,
  },
  {
    to: '/v3/studio-v4',
    title: 'Ouvrir le Studio V4',
    description: 'Titres, styles, images et variantes : le studio complet de votre maison d’édition.',
    icon: ShoppingBag,
    primary: false,
  },
];

/**
 * Module unique « Maison d'Édition Couverture » (fusion des anciennes bannières
 * Cover Studio Pro + Mes couvertures). Carte ivoire éditoriale sur fond papier,
 * sobre et reposante. Purement présentationnel : aucun appel IA, aucun crédit
 * consommé, aucune logique de paiement ici.
 */
export default function V3CoverStudioBanner() {
  return (
    <section
      className="w-full border-b"
      style={{
        background: 'var(--v3-joy-cream)',
        borderColor: 'var(--v3-joy-orange-soft)',
      }}
    >
      <div className="v3-shell py-8">
        <div
          className="relative overflow-hidden rounded-3xl bg-white px-5 py-6 sm:px-8 sm:py-7"
          style={{
            border: '1px solid var(--v3-joy-orange-soft)',
            boxShadow: '0 18px 40px -30px rgba(30, 41, 59, 0.35)',
          }}
        >
          {/* Filet orange supérieur discret */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: 'var(--v3-joy-orange-soft)' }}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{ background: 'var(--v3-joy-orange-soft)', color: 'var(--v3-joy-orange-600)' }}
              >
                <BookOpen className="h-5 w-5" />
              </span>
              <div>
                <span
                  className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: 'var(--v3-joy-orange-600)' }}
                >
                  <Crown className="h-3.5 w-3.5" /> Studio de couverture V4 — Inclus dans votre accès
                </span>
                <h2
                  className="v3-serif mt-1 text-2xl font-bold leading-tight sm:text-3xl"
                  style={{ color: 'var(--v3-joy-ink)' }}
                >
                  Votre maison d’édition de couvertures
                </h2>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-relaxed sm:text-right" style={{ color: 'var(--v3-joy-muted)' }}>
              Créez l’illustration, ajoutez vos textes et téléchargez une couverture prête pour Amazon KDP.
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {ACTIONS.map(({ to, title, description, icon: Icon, primary }) => (
              <div
                key={to}
                className="flex min-h-[112px] flex-col rounded-2xl p-3"
                style={{ border: '1px solid var(--v3-joy-orange-soft)', background: 'var(--v3-joy-cream)' }}
              >
                <div className="flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--v3-joy-ink)' }}>
                  <Icon className="h-4 w-4" style={{ color: 'var(--v3-joy-orange-600)' }} /> {title}
                </div>
                <p className="mt-1 flex-1 text-xs leading-relaxed" style={{ color: 'var(--v3-joy-muted)' }}>{description}</p>
                <Button
                  asChild
                  size="sm"
                  variant={primary ? 'default' : 'outline'}
                  className={primary
                    ? 'v3-joy-cta mt-3 w-full'
                    : 'mt-3 w-full bg-transparent'}
                  style={primary
                    ? undefined
                    : { borderColor: 'var(--v3-joy-orange-soft)', color: 'var(--v3-joy-orange-600)' }}
                >
                  <Link to={to}>
                    {primary ? 'Commencer' : 'Ouvrir'} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
