import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ScrapedMetricWarningProps {
  className?: string;
  size?: number;
  link?: string;
}

export const ScrapedMetricWarning: React.FC<ScrapedMetricWarningProps> = ({
  className = '',
  size = 14,
  link = 'https://kdp-pilot.com/',
}) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center rounded-full p-0.5 hover:bg-amber-100/50 transition-colors ${className}`}
            aria-label="Données issues du scraping - en savoir plus"
            onClick={(e) => e.stopPropagation()}
          >
            <AlertTriangle className="text-amber-500" style={{ width: size, height: size }} />
            <ExternalLink className="text-amber-500/70 ml-0.5" style={{ width: size * 0.6, height: size * 0.6 }} />
          </a>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs">
          <p className="font-medium mb-1">Données issues du scraping public Amazon</p>
          <p className="text-muted-foreground">
            Ce chiffre peut être incomplet ou momentanément imprécis. Pour des données historiques et plus fiables, abonnez-vous à{' '}
            <a href={link} target="_blank" rel="noopener noreferrer" className="underline text-amber-600 font-medium">
              KDP Pilot
            </a>{' '}
            — EbookStudio ne touche aucune commission.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ScrapedMetricWarning;
