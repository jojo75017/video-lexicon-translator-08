import React from 'react';
import { BarChart3, TrendingUp, Target, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KDP_PILOT_GO_PATH, leaveForKdpPilot } from '@/data/externalLinks';

/**
 * Bandeau V2 : invite à consulter des données Amazon plus précises via KDP Pilot.
 * Le lien de suivi n'est jamais affiché : l'ouverture se fait par le bouton.
 */
export const KdpPilotPromoBanner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-background to-background p-5 md:p-6 ${className}`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
            <BarChart3 className="h-3.5 w-3.5" />
            Données Amazon avancées
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
              <TrendingUp className="h-4 w-4 text-primary" /> Historique des ventes & BSR
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Target className="h-4 w-4 text-primary" /> Niches et concurrents suivis
            </li>
            <li className="inline-flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-primary" /> Ajustez votre livre au bon moment
            </li>
          </ul>
        </div>

        <div className="shrink-0">
          <Button size="lg" asChild className="w-full md:w-auto">
            <a
              href={KDP_PILOT_GO_PATH}
              onClick={(event) => {
                event.preventDefault();
                leaveForKdpPilot();
              }}
            >
              Voir mes données précises
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>

          <p className="mt-2 text-center text-[11px] text-muted-foreground md:text-right">
            Outil tiers indépendant d'EbookStudio
          </p>
        </div>
      </div>
    </div>
  );
};

export default KdpPilotPromoBanner;
