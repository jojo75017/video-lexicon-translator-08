import { useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KDP_PILOT_URL } from '@/data/externalLinks';

/**
 * Page relais : masque le lien de suivi partenaire.
 * L'utilisateur ne voit que /go/kdp-pilot puis est redirigé.
 */
export default function GoKdpPilotPage() {
  useEffect(() => {
    window.location.replace(KDP_PILOT_URL);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center space-y-3">
        <p className="text-lg font-semibold text-foreground">Ouvrir KDP Pilot</p>
        <p className="text-sm text-muted-foreground">
          Cliquez pour quitter l'aperçu EbookStudio et accéder à KDP Pilot.
        </p>
        <Button asChild>
          <a href={KDP_PILOT_URL} rel="noreferrer">
            Continuer vers KDP Pilot
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
