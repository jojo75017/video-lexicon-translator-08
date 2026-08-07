import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { leaveForKdpPilot } from '@/data/externalLinks';

/**
 * Page relais : masque le lien de suivi partenaire.
 * L'utilisateur ne voit que /go/kdp-pilot puis est redirigé.
 */
export default function GoKdpPilotPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center space-y-3">
        <p className="text-lg font-semibold text-foreground">Ouvrir KDP Pilot</p>
        <p className="text-sm text-muted-foreground">
          Cliquez pour quitter l'aperçu EbookStudio et accéder à KDP Pilot.
        </p>
        <Button
          type="button"
          onClick={leaveForKdpPilot}
        >
          Continuer vers KDP Pilot
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
