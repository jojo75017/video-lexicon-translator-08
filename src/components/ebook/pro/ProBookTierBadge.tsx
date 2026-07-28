import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Sparkles, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import useProBookTier from '@/hooks/useProBookTier';
import { getProBookLimits, PRO_MODULE_LABELS, type ProBookModule } from './proBookLimits';

interface Props {
  module: ProBookModule;
  compact?: boolean;
}

/**
 * Bandeau visuel indiquant si l'utilisateur bénéficie de la version
 * Standard (3 plans) ou Pro (Éditeur 59 €) pour un module de livre spécial.
 */
export const ProBookTierBadge: React.FC<Props> = ({ module, compact }) => {
  const { tier, loading, isAdmin } = useProBookTier();
  if (loading) return null;

  const label = PRO_MODULE_LABELS[module];
  const proLimits = getProBookLimits(module, 'pro');
  const stdLimits = getProBookLimits(module, tier);

  if (tier === 'pro') {
    return (
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-2.5 dark:from-amber-950/30 dark:to-yellow-950/30">
        <Crown className="h-4 w-4 text-amber-600" aria-hidden />
        <span className="text-sm font-semibold text-amber-900 dark:text-amber-200">
          Version PRO — {label}
        </span>
        <Badge variant="outline" className="border-amber-400 text-amber-700 dark:text-amber-300">
          {isAdmin ? 'Admin' : 'Plan Éditeur 59 €'}
        </Badge>
        {!compact && (
          <span className="ml-auto text-xs text-amber-800/80 dark:text-amber-200/80">
            Jusqu'à {proLimits.maxSections} sections · {proLimits.imagesPerSection} images HD/section
          </span>
        )}
      </div>
    );
  }

  return (
    <Card className="mb-4 border-teal-200 bg-gradient-to-r from-teal-50/60 to-transparent p-4 dark:from-teal-950/20">
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-teal-600" aria-hidden />
          <span className="text-sm font-semibold text-teal-900 dark:text-teal-200">
            Version Standard — {label}
          </span>
          <Badge variant="secondary" className="text-xs">Inclus dans votre forfait</Badge>
        </div>
        <div className="flex-1 min-w-[200px] text-xs text-muted-foreground">
          Jusqu'à <strong>{stdLimits.maxSections}</strong> sections · {stdLimits.imagesPerSection} image/section ·{' '}
          {stdLimits.wordsPerSection[0]}–{stdLimits.wordsPerSection[1]} mots
        </div>
        <Button asChild size="sm" variant="outline" className="border-amber-400 text-amber-700 hover:bg-amber-50">
          <Link to="/v3/upsell-17">
            <Crown className="mr-1 h-3.5 w-3.5" />
            Débloquer le pack — 17 €
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
      {!compact && (
        <div className="mt-2 text-[11px] text-muted-foreground">
          <span className="font-medium text-amber-700">PRO :</span> jusqu'à {proLimits.maxSections} sections,{' '}
          {proLimits.wordsPerSection[0]}–{proLimits.wordsPerSection[1]} mots, {proLimits.imagesPerSection} images HD, {proLimits.extras.slice(0, 3).join(' · ')}…
        </div>
      )}
    </Card>
  );
};

export default ProBookTierBadge;
