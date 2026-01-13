import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, Loader2, Mail, ArrowRight, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type VerifyResult = {
  ok: boolean;
  email?: string;
  accessCode?: string;
  subscriber?: any;
  error?: string;
};

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<VerifyResult | null>(null);

  const sessionId = searchParams.get("session_id") || "";

  const safeSessionId = useMemo(() => sessionId.trim(), [sessionId]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!safeSessionId) {
        setIsLoading(false);
        setResult({ ok: false, error: "Session de paiement introuvable." });
        return;
      }

      try {
        // Vérifie le paiement et crée (ou récupère) le code côté backend
        const { data, error } = await supabase.functions.invoke("stripe-verify-session", {
          body: { sessionId: safeSessionId },
        });

        if (cancelled) return;

        if (error) {
          setResult({ ok: false, error: error.message });
          setIsLoading(false);
          return;
        }

        const payload = data as VerifyResult;
        setResult(payload);

        // Si OK, on connecte automatiquement l'utilisateur via le système email + code
        if (payload?.ok && payload.email && payload.subscriber) {
          localStorage.setItem("subscriber_email", payload.email);
          localStorage.setItem("subscriber_data", JSON.stringify(payload.subscriber));
        }
      } catch (e: any) {
        if (cancelled) return;
        setResult({ ok: false, error: e?.message || "Erreur inconnue" });
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [safeSessionId]);

  const copyCode = async () => {
    const code = result?.accessCode;
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copié");
    } catch {
      toast.error("Impossible de copier le code");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-semibold mb-2">Activation de votre accès...</h2>
            <p className="text-muted-foreground">On finalise votre code de connexion</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ok = !!result?.ok;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className={`max-w-lg w-full border-2 ${ok ? "border-green-500/20" : "border-amber-500/20"}`}>
        <CardHeader className="text-center pb-2">
          <div className={`w-20 h-20 ${ok ? "bg-green-500/10" : "bg-amber-500/10"} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {ok ? (
              <CheckCircle className="w-12 h-12 text-green-500" />
            ) : (
              <AlertTriangle className="w-12 h-12 text-amber-500" />
            )}
          </div>
          <CardTitle className={`text-2xl ${ok ? "text-green-600" : "text-amber-600"}`}>
            {ok ? "Paiement confirmé !" : "Activation en attente"}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {ok
              ? "Votre accès est actif. Voici votre code de connexion."
              : "On n'a pas pu activer automatiquement votre accès pour le moment."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {ok && result?.email && result?.accessCode ? (
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div className="w-full">
                  <p className="font-medium">Vos identifiants</p>
                  <p className="text-sm text-muted-foreground">Email : {result.email}</p>

                  <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border bg-background p-3">
                    <div className="font-mono text-base font-semibold tracking-wide">{result.accessCode}</div>
                    <Button type="button" variant="outline" size="sm" onClick={copyCode}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copier
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2">
                    Si l'email n'arrive pas, vous pouvez quand même vous connecter avec ce code.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Détail :</p>
              <p>{result?.error || "Veuillez réessayer dans quelques secondes."}</p>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <Button
              size="lg"
              className="w-full"
              onClick={() => navigate("/subscription")}
            >
              Se connecter (Email + Code)
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button variant="outline" onClick={() => navigate("/offres")}>
              Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
