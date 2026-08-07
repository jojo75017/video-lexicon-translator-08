import { useEffect } from 'react';
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
        <p className="text-lg font-semibold text-foreground">Ouverture de KDP Pilot…</p>
        <p className="text-sm text-muted-foreground">
          Si rien ne se passe, cliquez sur « Continuer ».
        </p>
        <button
          type="button"
          onClick={() => window.location.replace(KDP_PILOT_URL)}
          className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
