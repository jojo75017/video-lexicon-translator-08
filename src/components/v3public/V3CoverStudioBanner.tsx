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
    to: '/v3/mes-couvertures',
    title: 'Mes couvertures',
    description: 'Retrouvez, modifiez ou téléchargez un projet existant.',
    icon: FolderOpen,
    primary: false,
  },
  {
    to: '/v3/offre-couverture-v4',
    title: 'Découvrir l’offre 67 €',
    description: 'Description, objectifs, devis et paiement sur une page dédiée.',
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
      className="w-full"
      style={{
        background: 'var(--v3-paper)',
        borderBottom: '1px solid var(--v3-line)',
      }}
    >
      <div className="mx-auto w-full max-w-[1100px] px-5 py-8 md:px-8 md:py-10">
        <div
          className="relative overflow-hidden rounded-md px-5 py-6 sm:px-8 sm:py-7"
          style={{
            background: 'var(--v3-ivory)',
            border: '1px solid color-mix(in srgb, var(--v3-gold) 45%, var(--v3-border))',
            boxShadow: 'var(--v3-shadow-card)',
          }}
        >
          {/* Filet or supérieur discret */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, var(--v3-gold), transparent)' }}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{ background: 'var(--v3-gold-soft)', border: '1px solid color-mix(in srgb, var(--v3-gold) 50%, transparent)' }}
              >
                <BookOpen className="h-5 w-5" style={{ color: 'var(--v3-gold-600)' }} />
              </span>
              <div>
                <span
                  className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: 'var(--v3-gold-600)' }}
                >
                  <Crown className="h-3.5 w-3.5" /> Studio de couverture V4 — Nouveauté en avance
                </span>
                <h2
                  className="v3-serif mt-1 text-2xl font-bold leading-tight sm:text-3xl"
                  style={{ color: 'var(--v3-editorial-ink)' }}
                >
                  Votre maison d’édition de couvertures
                </h2>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-relaxed sm:text-right" style={{ color: 'var(--v3-muted)' }}>
              Créez l’illustration, ajoutez vos textes et téléchargez une couverture prête pour Amazon KDP.
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {ACTIONS.map(({ to, title, description, icon: Icon, primary }) => (
              <div
                key={to}
                className="flex min-h-[112px] flex-col rounded-md p-3"
                style={{ border: '1px solid var(--v3-border)', background: 'var(--v3-paper)' }}
              >
                <div className="flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--v3-editorial-ink)' }}>
                  <Icon className="h-4 w-4" style={{ color: 'var(--v3-gold-600)' }} /> {title}
                </div>
                <p className="mt-1 flex-1 text-xs leading-relaxed" style={{ color: 'var(--v3-muted)' }}>{description}</p>
                <Button
                  asChild
                  size="sm"
                  variant={primary ? 'default' : 'outline'}
                  className={primary
                    ? 'mt-3 w-full'
                    : 'mt-3 w-full bg-transparent'}
                  style={primary
                    ? { background: 'var(--v3-emerald)', color: '#f8f5ed' }
                    : { borderColor: 'color-mix(in srgb, var(--v3-emerald) 45%, transparent)', color: 'var(--v3-emerald)' }}
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
