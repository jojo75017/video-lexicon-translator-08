import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Crown, FolderOpen, ShoppingBag } from 'lucide-react';
import coverProBanner from '@/assets/cover-pro-banner.jpg';
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
    to: '/v3/cover-pro?checkout=1',
    title: 'Découvrir l’offre 67 €',
    description: 'Consultez ce qui est inclus avant votre achat unique.',
    icon: ShoppingBag,
    primary: false,
  },
];

/**
 * Module unique « Maison d'Édition Couverture » (fusion des anciennes bannières
 * Cover Studio Pro + Mes couvertures). Purement présentationnel : aucun appel IA,
 * aucun crédit consommé, aucune logique de paiement ici.
 */
export default function V3CoverStudioBanner() {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-5 md:px-8">
      <div
        className="relative overflow-hidden rounded-lg shadow-lg"
        style={{
          background: 'var(--v3-emerald)',
          border: '1px solid var(--v3-gold)',
        }}
      >
        <div className="grid items-stretch lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="relative hidden min-h-[260px] overflow-hidden lg:block">
            <img
              src={coverProBanner}
              alt="Couvertures professionnelles créées avec le Studio de couverture EbookStudio"
              loading="lazy"
              width={1536}
              height={1024}
              className="h-full w-full object-cover object-center"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-transparent to-background/70" />
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
            <span
                  className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{
                    color: 'var(--v3-gold)',
              }}
            >
                  <Crown className="h-3.5 w-3.5" /> Studio de couverture V4
            </span>
            <h2
                  className="v3-serif mt-1 text-2xl font-bold leading-tight text-primary-foreground sm:text-3xl"
            >
                  Votre maison d’édition de couvertures
            </h2>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-primary-foreground/80 sm:text-right">
                Créez l’illustration, ajoutez vos textes et téléchargez une couverture prête pour Amazon KDP.
            </p>
            </div>

            <div className="mt-5 grid gap-2 md:grid-cols-3">
              {ACTIONS.map(({ to, title, description, icon: Icon, primary }) => (
                <div key={to} className="flex min-h-[118px] flex-col rounded-md border border-primary-foreground/20 bg-primary-foreground/5 p-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-primary-foreground">
                    <Icon className="h-4 w-4 text-orange-400" /> {title}
                  </div>
                  <p className="mt-1 flex-1 text-xs leading-relaxed text-primary-foreground/70">{description}</p>
                  <Button
                    asChild
                    size="sm"
                    variant={primary ? 'default' : 'outline'}
                    className={primary
                      ? 'mt-3 w-full bg-orange-500 text-primary-foreground hover:bg-orange-600'
                      : 'mt-3 w-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground'}
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
      </div>
    </section>
  );
}
