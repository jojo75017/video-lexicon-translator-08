import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProBookTierBadge from './ProBookTierBadge';
import useProBookTier from '@/hooks/useProBookTier';
import { PRO_MODULE_LABELS, type ProBookModule } from './proBookLimits';

interface Props {
  module: ProBookModule;
  children: React.ReactNode;
}

/**
 * Enveloppe visuelle unifiée pour les modules "Livres spéciaux".
 * - Affiche le badge Standard/Pro
 * - Affiche TOUJOURS un bandeau upsell 17 € (Pack Boost de Lancement)
 *   visible et cliquable, en haut du module.
 */
export const ProBookShell: React.FC<Props> = ({ module, children }) => {
  const { tier, isAdmin } = useProBookTier();
  const label = PRO_MODULE_LABELS[module];
  // Bandeau masqué uniquement pour les vrais abonnés Édition 27 € (inclus).
  // Les admins voient le bandeau pour pouvoir prévisualiser l'upsell.
  const showUpsell = isAdmin || tier !== 'pro';

  return (
    <div>
      <ProBookTierBadge module={module} />

      {/* Upsell 17 € — masqué pour le forfait Édition 27 € (inclus) */}
      {showUpsell && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-amber-300/70 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 p-4 shadow-sm dark:from-amber-950/30 dark:via-yellow-950/20 dark:to-orange-950/20">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15 text-amber-700">
            <Sparkles className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-[220px] flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Pack Boost de Lancement — 17 €
              </span>
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                Inclus dans Édition 27 €
              </span>
            </div>
            <p className="mt-0.5 text-xs text-amber-900/80 dark:text-amber-200/80">
              Boostez votre <strong>{label}</strong> : 10 visuels Pinterest, 5 posts Instagram,
              checklist KDP/ISBN, page de vente prête à copier. Débloque aussi les limites avancées du module.
            </p>
          </div>
          <Button asChild size="sm" className="bg-amber-600 text-white hover:bg-amber-700">
            <Link to="/v3/upsell-17">
              <Crown className="mr-1 h-4 w-4" />
              Ajouter le pack 17 €
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}

      {children}
    </div>
  );
};

export default ProBookShell;
