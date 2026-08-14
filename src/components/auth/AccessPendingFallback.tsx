import { Link } from 'react-router-dom';
import { Loader2, LayoutDashboard, PenTool, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ADMIN_HOME_PATH } from '@/config/adminRoutes';
import { SUBSCRIBER_HOME_PATH } from '@/lib/authDestination';

type Props = {
  /** Affiche les sorties directes quand l'attente est anormalement longue. */
  timedOut: boolean;
  onRetry: () => void;
};

/**
 * Écran d'attente pendant la vérification du rôle.
 * Aucune conclusion n'est tirée : si l'attente dure, on propose des sorties
 * directes (Dashboard admin / V2) au lieu de rediriger vers la page de vente.
 */
export default function AccessPendingFallback({ timedOut, onRetry }: Props) {
  return (
    <main className="min-h-screen flex items-center justify-center px-5" aria-busy={!timedOut}>
      <div className="w-full max-w-md text-center space-y-5">
        <div className="flex items-center justify-center gap-3 text-muted-foreground">
          {!timedOut && <Loader2 className="h-5 w-5 animate-spin" />}
          <p>
            {timedOut
              ? "La vérification de votre accès prend plus de temps que prévu."
              : 'Vérification de votre accès…'}
          </p>
        </div>

        {timedOut && (
          <div className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <Button asChild>
                <Link to={ADMIN_HOME_PATH}>
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard admin
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={SUBSCRIBER_HOME_PATH}>
                  <PenTool className="h-4 w-4 mr-2" />
                  V2 — Générateur
                </Link>
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={onRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer la vérification
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
