import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STORAGE_KEYS_TO_CLEAR = [
  "subscriber_email",
  "subscriber_data",
  "demo_plans_generated",
  "ebook-planner-autosave",
  "OPENAI_API_KEY",
  "OPENAI_MODEL",
  "openai_api_key",
  "openai_model",
  "user_openai_key",
  "user_openai_model",
];

export default function LogoutTotalPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"running" | "done" | "error">("running");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        // 1) Supprimer la session admin (si présente)
        await supabase.auth.signOut();

        // 2) Purger les caches locaux (abonnement + démo + autosave + clés)
        for (const key of STORAGE_KEYS_TO_CLEAR) {
          localStorage.removeItem(key);
        }

        // 3) Purge large (au cas où d'autres clés existent)
        // On garde quand même un fallback doux : si ça jette (quota/iframe), on continue.
        try {
          localStorage.removeItem("supabase.auth.token");
        } catch {
          // ignore
        }

        if (cancelled) return;
        setStatus("done");

        // Rediriger vers /offres après 1s (laisse le temps de voir le message)
        setTimeout(() => {
          if (!cancelled) navigate("/offres", { replace: true });
        }, 900);
      } catch {
        if (cancelled) return;
        setStatus("error");
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <Card className="w-full max-w-lg p-6 space-y-4">
        <h1 className="text-xl font-semibold">Réinitialisation complète…</h1>
        {status === "running" && (
          <p className="text-sm text-muted-foreground">
            Déconnexion + purge du cache en cours. Cela permet de tester l'expérience comme un vrai visiteur.
          </p>
        )}
        {status === "done" && (
          <p className="text-sm text-muted-foreground">
            OK. Redirection en cours…
          </p>
        )}
        {status === "error" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Impossible de tout réinitialiser automatiquement. Clique ci-dessous pour revenir à la page d'offres.
            </p>
            <Button type="button" className="w-full" onClick={() => navigate("/offres", { replace: true })}>
              Retour aux offres
            </Button>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Astuce : pour vérifier l'accès, tu peux ensuite aller sur /ebook-planner?debug=1 (ça affiche l'état : admin oui/non,
          email abonné oui/non, code oui/non).
        </p>
      </Card>
    </main>
  );
}
