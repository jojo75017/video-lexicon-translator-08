import React from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ScrapedMetricWarningProps {
  className?: string;
  size?: number;
}

/**
 * Indicateur de données scrapées. KDP Pilot est en préparation :
 * le lien est bloqué, seule l'info-bulle s'affiche.
 */
export const ScrapedMetricWarning: React.FC<ScrapedMetricWarningProps> = ({
  className = '',
  size = 14,
}) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={`inline-flex items-center justify-center rounded-full p-0.5 ${className}`}
            aria-label="Données issues du scraping — KDP Pilot en préparation"
          >
            <AlertTriangle className="text-amber-500" style={{ width: size, height: size }} />
          </span>
        </TooltipTrigger>

        <TooltipContent side="top" className="max-w-xs text-xs">
          <p className="font-medium mb-1">Données issues du scraping public Amazon</p>
          <p className="text-muted-foreground">
            Ce chiffre peut être incomplet ou momentanément imprécis. Le lien KDP Pilot est
            actuellement en préparation et sera réactivé prochainement pour consulter des données
            historiques plus justes — outil tiers indépendant d'EbookStudio.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ScrapedMetricWarning;

