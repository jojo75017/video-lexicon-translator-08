import { BarChart3, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KDP_PILOT_URL, KDP_PILOT_PROMO_CODE } from '@/data/externalLinks';

export function V3StarterKdpPilotBanner() {
  return (
    <section aria-label="Option KDP Pilot pour Starter" className="mt-6 border-y border-border bg-secondary/40 px-4 py-6 sm:px-6">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-sm font-semibold text-primary"><BarChart3 className="h-5 w-5" /> Starter · option partenaire</p>
          <h2 className="mt-2 text-xl font-semibold text-foreground">Allez plus loin avec KDP Pilot</h2>
          <p className="mt-2 text-sm text-muted-foreground">Starter conserve sa fiche KDP de base. Pour le suivi des positions Amazon, les ventes estimées et l’analyse des niches, vous pouvez souscrire à KDP Pilot.</p>
          <p className="mt-2 text-sm text-muted-foreground">Abonnement indépendant et facultatif, non inclus dans les 27 €. Le tarif et le paiement sont présentés sur le site du partenaire.</p>
          <p className="mt-2 text-sm text-foreground">Code réservé aux clients EbookStudio : <strong>{KDP_PILOT_PROMO_CODE}</strong> — 15 % de réduction sur le premier mois ou la première année.</p>
        </div>
        <Button asChild className="shrink-0"><a href={KDP_PILOT_URL} target="_blank" rel="noopener noreferrer sponsored">Voir les tarifs KDP Pilot <ExternalLink className="h-4 w-4" /></a></Button>
      </div>
    </section>
  );
}