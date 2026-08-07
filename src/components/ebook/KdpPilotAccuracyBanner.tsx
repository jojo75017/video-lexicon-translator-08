import React from 'react';
import { Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { KDP_PILOT_GO_PATH } from '@/data/externalLinks';

/**
 * Petit bandeau d'information honnête sur la fiabilité des données scrapées.
 * Le lien partenaire n'est jamais affiché : on ouvre KDP Pilot via un bouton.
 */
export const KdpPilotAccuracyBanner: React.FC = () => {
  return (
    <Card className="border-l-4 border-l-blue-500 bg-blue-50/40 dark:bg-blue-950/15 rounded-r-lg">
      <CardContent className="p-3.5 flex items-start gap-3">
        <div className="shrink-0 mt-0.5 text-blue-600">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Données indicatives</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Les chiffres Amazon affichés ici sont obtenus par scraping public en temps réel : ils
            peuvent être incomplets ou momentanément imprécis. Pour des données historiques plus
            justes et suivre l'évolution de votre livre,{' '}
            <a
              href={KDP_PILOT_GO_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-700 underline hover:text-blue-800"
            >
              consultez KDP Pilot
            </a>

            . C'est un outil tiers indépendant d'EbookStudio.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default KdpPilotAccuracyBanner;
