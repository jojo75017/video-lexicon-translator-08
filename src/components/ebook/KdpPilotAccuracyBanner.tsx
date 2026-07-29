import React from 'react';
import { ExternalLink, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Petit bandeau d'information honnête sur la fiabilité des données scrapées.
 * On ne gagne rien sur KDP Pilot : c'est un service tiers indépendant recommandé aux utilisateurs
 * qui veulent des données historiques et plus fiables que le scraping public.
 */
export const KdpPilotAccuracyBanner: React.FC = () => {
  return (
    <Card className="border-l-4 border-l-blue-500 bg-blue-50/40 dark:bg-blue-950/15 rounded-r-lg">
      <CardContent className="p-3.5 flex items-start gap-3">
        <div className="shrink-0 mt-0.5 text-blue-600">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            Données indicatives
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Les chiffres Amazon affichés ici sont obtenus par scraping public en temps réel : ils peuvent être
            incomplets ou momentanément imprécis. Si vous avez besoin de données historiques et plus fiables,
            vous pouvez utiliser{' '}
            <a
              href="https://kdp-pilot.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-blue-700 underline hover:text-blue-800"
            >
              KDP Pilot <ExternalLink className="w-3.5 h-3.5" />
            </a>
            . C'est un outil tiers indépendant d'EbookStudio — nous ne touchons aucune commission.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default KdpPilotAccuracyBanner;
