import React from 'react';
import { Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Petit bandeau d'information honnête sur la fiabilité des données scrapées.
 * Le lien KDP Pilot est bloqué/en préparation : aucun lien affiché.
 */
export const KdpPilotAccuracyBanner: React.FC = () => {
  return (
    <Card className="border-l-4 border-l-amber-500 bg-amber-50/40 dark:bg-amber-950/15 rounded-r-lg">
      <CardContent className="p-3.5 flex items-start gap-3">
        <div className="shrink-0 mt-0.5 text-amber-600">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Données indicatives — KDP Pilot en préparation</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Les chiffres Amazon affichés ici sont obtenus par scraping public en temps réel : ils
            peuvent être incomplets ou momentanément imprécis. Le lien vers KDP Pilot est actuellement
            en préparation et sera réactivé prochainement pour consulter des données historiques plus
            justes. Outil tiers indépendant d'EbookStudio.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default KdpPilotAccuracyBanner;

