import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, Loader2, Mail, ArrowRight, AlertTriangle, Download, KeyRound, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackPurchase } from "@/utils/analytics";

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
          trackPurchase(payload.subscriber?.plan_tier || 'pro', 67);
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* En-tête succès */}
        <div className="text-center mb-8">
          <div className={`w-24 h-24 ${ok ? "bg-green-500" : "bg-amber-500"} rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl ${ok ? "shadow-green-500/30" : "shadow-amber-500/30"}`}>
            {ok ? (
              <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
            ) : (
              <AlertTriangle className="w-14 h-14 text-white" strokeWidth={2.5} />
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-black mb-3">
            {ok ? "🎉 Bienvenue dans Ebookstudio Pro V2 !" : "Activation en attente"}
          </h1>
          <p className="text-lg text-black/60">
            {ok
              ? "Ton paiement est confirmé. Voici comment démarrer en 3 étapes."
              : "On n'a pas pu activer automatiquement ton accès pour le moment."}
          </p>
        </div>

        {ok && result?.email && result?.accessCode ? (
          <>
            {/* Bloc identifiants */}
            <Card className="border-2 border-green-200 bg-white shadow-xl mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <KeyRound className="w-5 h-5 text-orange-500" />
                  <h3 className="font-bold text-black">Tes identifiants d'accès</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                    <div className="text-xs font-semibold text-black/50 uppercase mb-1">Email</div>
                    <div className="font-semibold text-black">{result.email}</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                    <div className="text-xs font-semibold text-black/50 uppercase mb-1">Code d'accès</div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-mono text-xl font-black tracking-wider text-black">{result.accessCode}</div>
                      <Button type="button" variant="outline" size="sm" onClick={copyCode}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copier
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-black/50 mt-3">
                  💡 On vient de t'envoyer ce code par email. Si tu ne le reçois pas dans 2 min, vérifie tes spams.
                </p>
              </CardContent>
            </Card>

            {/* 3 étapes */}
            <h2 className="text-xl font-black text-black mb-4 text-center">🚀 Tes 3 prochaines étapes</h2>
            <div className="space-y-3 mb-8">
              {/* Étape 1 */}
              <Card className="border-2 border-orange-200 bg-white">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-black flex items-center justify-center shrink-0">1</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-black mb-1 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-orange-500" /> Vérifie ta boîte mail
                    </h3>
                    <p className="text-sm text-black/60">Email envoyé à <strong>{result.email}</strong> avec ton code et le lien direct vers la plateforme.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Étape 2 */}
              <Card className="border-2 border-orange-200 bg-white">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-black flex items-center justify-center shrink-0">2</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-black mb-1 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-500" /> Connecte-toi à ton espace
                    </h3>
                    <p className="text-sm text-black/60 mb-3">Accède à tous les outils : générateur d'ebooks, formations, niches, KDP keywords...</p>
                    <Button onClick={() => navigate("/subscription")} className="bg-orange-500 hover:bg-orange-600 text-white">
                      Se connecter maintenant
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Étape 3 */}
              <Card className="border-2 border-orange-200 bg-white">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-black flex items-center justify-center shrink-0">3</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-black mb-1 flex items-center gap-2">
                      <Download className="w-4 h-4 text-orange-500" /> Installe l'extension Chrome
                    </h3>
                    <p className="text-sm text-black/60 mb-3">Scanne n'importe quel livre Amazon Kindle en 1 clic depuis ton navigateur.</p>
                    <Button variant="outline" onClick={() => navigate("/extension-chrome")} className="border-orange-300 text-orange-600 hover:bg-orange-50">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger l'extension
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Footer rassurant */}
            <div className="text-center text-sm text-black/50">
              Une question ? <button onClick={() => navigate("/faq")} className="text-orange-600 font-semibold hover:underline">Consulte la FAQ</button> ou écris-nous.
            </div>
          </>
        ) : (
          <Card className="border-2 border-amber-300 bg-white shadow-xl">
            <CardContent className="p-6">
              <div className="bg-amber-50 rounded-lg p-4 text-sm text-black/70 mb-4">
                <p className="font-semibold text-black mb-1">Détail :</p>
                <p>{result?.error || "Veuillez réessayer dans quelques secondes."}</p>
              </div>
              <div className="flex flex-col gap-3">
                <Button size="lg" onClick={() => navigate("/subscription")}>
                  Se connecter avec mon code
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={() => navigate("/offres")}>
                  Retour à l'accueil
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
