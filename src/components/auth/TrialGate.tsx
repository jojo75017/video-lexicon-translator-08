import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Loader2, Lock } from "lucide-react";
import useTrialAccess from "@/hooks/useTrialAccess";
import { useAdminAccess } from "@/contexts/AdminAccessContext";
import { Button } from "@/components/ui/button";

/**
 * Réserve un module aux abonnés payants.
 *
 * - Admins : passent toujours.
 * - Utilisateurs en essai gratuit 7 jours : écran « Réservé aux abonnés ».
 * - Tous les autres (abonnés payants, acheteurs à vie) : accès normal.
 *
 * Tant que le statut est en cours de chargement, on patiente : un abonné payant
 * ne doit jamais voir l'écran d'offre à cause d'un retard de session.
 */
export function TrialGate({ children, label }: { children: ReactNode; label?: string }) {
  const { loading, isTrial } = useTrialAccess();
  const { isAdmin, isChecking } = useAdminAccess();

  if (isAdmin) return <>{children}</>;
  if (isChecking || loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!isTrial) return <>{children}</>;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-16">
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          {label ? `${label} : réservé aux abonnés` : "Réservé aux abonnés"}
        </h1>
        <p className="mt-3 text-muted-foreground">
          Ce module n'est pas inclus dans l'essai gratuit 7 jours. Vous ne perdez rien :
          votre livre et vos chapitres restent accessibles.
        </p>

        <div className="mt-6 rounded-xl border border-border bg-background p-4 text-left text-sm">
          <p className="mb-2 font-semibold text-foreground">Inclus pendant votre essai</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>· 1 livre complet (sommaire IA + chapitres)</li>
            <li>· Correction professionnelle</li>
            <li>· Exports filigranés (Word, PDF, tablette)</li>
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link to="/v3/forfaits">Débloquer tous les modules</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/v3/mes-livres">Revenir à mon livre</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

export default TrialGate;
