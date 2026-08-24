import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import useTrialAccess from "@/hooks/useTrialAccess";
import { useAdminAccess } from "@/contexts/AdminAccessContext";
import { Button } from "@/components/ui/button";

/**
 * Essai gratuit = 1 seul livre.
 *
 * - Admins et abonnés payants : aucune limite.
 * - Essai en cours avec déjà un livre : écran d'offre + retour sur son livre.
 * - Essai terminé : création bloquée (le livre existant reste en lecture seule).
 */
export function TrialBookLimitGate({ children }: { children: ReactNode }) {
  const { loading, isTrial, isExpired } = useTrialAccess();
  const { isAdmin, isChecking } = useAdminAccess();
  const [counting, setCounting] = useState(true);
  const [bookCount, setBookCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (isChecking || loading) return;
      if (isAdmin || !isTrial) {
        if (!cancelled) setCounting(false);
        return;
      }
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          if (!cancelled) { setBookCount(0); setCounting(false); }
          return;
        }
        const { count } = await supabase
          .from("ebook_projects")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);
        if (!cancelled) {
          setBookCount(count ?? 0);
          setCounting(false);
        }
      } catch {
        if (!cancelled) { setBookCount(0); setCounting(false); }
      }
    })();
    return () => { cancelled = true; };
  }, [isAdmin, isChecking, isTrial, loading]);

  if (isAdmin) return <>{children}</>;
  if (isChecking || loading || counting) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!isTrial) return <>{children}</>;
  if (!isExpired && bookCount < 1) return <>{children}</>;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-16">
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          {isExpired ? "Votre essai gratuit est terminé" : "L'essai gratuit inclut 1 livre"}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {isExpired
            ? "Votre livre et vos chapitres restent visibles en lecture seule. Passez à l'accès complet pour continuer à écrire."
            : "Vous avez déjà lancé votre livre d'essai. Terminez-le, ou passez à l'accès complet pour créer autant de livres que vous voulez."}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link to="/v3/forfaits">Passer à l'accès complet</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/v3/mes-livres">Revenir à mon livre</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

export default TrialBookLimitGate;
