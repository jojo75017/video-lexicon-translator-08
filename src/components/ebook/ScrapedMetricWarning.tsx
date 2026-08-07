import React from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { KDP_PILOT_GO_PATH } from '@/data/externalLinks';

interface ScrapedMetricWarningProps {
  className?: string;
  size?: number;
}

export const ScrapedMetricWarning: React.FC<ScrapedMetricWarningProps> = ({
  className = '',
  size = 14,
}) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={KDP_PILOT_GO_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center rounded-full p-0.5 hover:bg-amber-100/50 transition-colors ${className}`}
            aria-label="Données issues du scraping - voir des données plus précises"
            onClick={(e) => e.stopPropagation()}
          >
            <AlertTriangle className="text-amber-500" style={{ width: size, height: size }} />
          </a>
        </TooltipTrigger>

        <TooltipContent side="top" className="max-w-xs text-xs">
          <p className="font-medium mb-1">Données issues du scraping public Amazon</p>
          <p className="text-muted-foreground">
            Ce chiffre peut être incomplet ou momentanément imprécis. Cliquez pour consulter des
            données historiques plus justes sur KDP Pilot — outil tiers indépendant d'EbookStudio.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ScrapedMetricWarning;
