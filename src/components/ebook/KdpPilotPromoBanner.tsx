import React from 'react';
import { BarChart3, TrendingUp, Target } from 'lucide-react';
import { KDP_PILOT_URL } from '@/data/externalLinks';

/**
 * Bandeau V2 : KDP Pilot est en préparation, le lien est masqué/bloqué.
 * Le lien de suivi n'est jamais affiché : l'ouverture se fera par un bouton
 * quand l'intégration sera finalisée.
 */
export const KdpPilotPromoBanner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`rounded-xl border border-amber-200/60 bg-gradient-to-r from-amber-50/60 via-background to-background p-5 md:p-6 ${className}`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/50 bg-amber-100/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-800">
            <BarChart3 className="h-3.5 w-3.5" />
            Données Amazon avancées — En préparation
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Vous voulez des données plus justes et savoir où en est votre livre ?
          </h3>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Suivez vos ventes réelles, l'historique des positions, la concurrence de votre niche et
            ajustez votre livre (prix, mots-clés, catégories) au bon moment. Un tableau de bord
            complet, mis à jour chaque jour.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1.5 pt-1 text-sm text-muted-foreground">
            <li className="inline-flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-amber-600" /> Historique des ventes & BSR
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Target className="h-4 w-4 text-amber-600" /> Niches et concurrents suivis
            </li>
            <li className="inline-flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-amber-600" /> Ajustez votre livre au bon moment
            </li>
          </ul>
        </div>

        <div className="shrink-0">
          <button
            type="button"
            disabled
            className="inline-flex items-center justify-center rounded-md bg-muted px-5 py-2.5 text-sm font-semibold text-muted-foreground opacity-70 cursor-not-allowed"
          >
            Bientôt disponible
          </button>

          <p className="mt-2 text-center text-[11px] text-muted-foreground md:text-right">
            Lien KDP Pilot en cours de préparation — invisible pour l'instant
          </p>
        </div>
      </div>
    </div>
  );
};

export default KdpPilotPromoBanner;

