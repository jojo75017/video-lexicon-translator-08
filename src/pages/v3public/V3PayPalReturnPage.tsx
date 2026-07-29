import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Clock, ArrowRight } from "lucide-react";

export default function V3PayPalReturnPage() {
  const [params] = useSearchParams();
  const planId = params.get("plan") || "";
  const interval = params.get("interval") || "";
  const paypalSubId = params.get("subscription_id") || (typeof window !== "undefined" ? localStorage.getItem("paypal_sub_id") : "");
  const [status, setStatus] = useState<"loading" | "active" | "pending" | "unknown">("loading");
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      if (!paypalSubId) { setStatus("unknown"); return; }
      const { data } = await supabase
        .from("paypal_subscriptions")
        .select("status, amount")
        .eq("paypal_subscription_id", paypalSubId)
        .maybeSingle();
      if (cancelled) return;
      if (data) {
        setAmount(Number(data.amount));
        setStatus(data.status === "active" ? "active" : "pending");
      } else {
        setStatus("unknown");
      }
    };
    check();
    // Poll a few times while webhook activates
    const iv = setInterval(check, 3000);
    setTimeout(() => clearInterval(iv), 30000);
    return () => { cancelled = true; clearInterval(iv); };
  }, [paypalSubId]);

  return (
    <div className="min-h-screen py-16 px-4" style={{ background: "#FAFAFA" }}>
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-10 border">
        {status === "active" ? (
          <>
            <div className="flex justify-center mb-6">
              <CheckCircle2 className="w-16 h-16 text-emerald-500" />
            </div>
            <h1 className="text-3xl font-bold text-center mb-3" style={{ color: "#232F3E" }}>
              Abonnement PayPal activé 🎉
            </h1>
            <p className="text-center text-slate-600 mb-6">
              Merci ! Votre abonnement <b>{planId}</b> ({interval === "month" ? "mensuel" : "annuel"}
              {amount ? ` — ${amount.toFixed(2)} €` : ""}) est actif.<br />
              Un email de confirmation PayPal vient de vous être envoyé.
            </p>
          </>
        ) : status === "pending" ? (
          <>
            <div className="flex justify-center mb-6">
              <Clock className="w-16 h-16 text-amber-500" />
            </div>
            <h1 className="text-3xl font-bold text-center mb-3" style={{ color: "#232F3E" }}>
              Approbation reçue, activation en cours…
            </h1>
            <p className="text-center text-slate-600 mb-6">
              PayPal a bien enregistré votre approbation. L'activation prend généralement quelques secondes.
              Cette page se met à jour toute seule.
            </p>
          </>
        ) : status === "unknown" ? (
          <>
            <h1 className="text-2xl font-bold text-center mb-3" style={{ color: "#232F3E" }}>
              Statut PayPal indisponible
            </h1>
            <p className="text-center text-slate-600 mb-6">
              Nous n'avons pas retrouvé votre abonnement dans cette session. Si vous avez bien approuvé
              le paiement sur PayPal, votre abonnement sera actif dès réception de la confirmation (quelques minutes).
            </p>
          </>
        ) : (
          <p className="text-center text-slate-500">Chargement…</p>
        )}

        <div className="flex flex-col gap-3 mt-6">
          <Link to="/v3/hub" className="inline-flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white" style={{ background: "#008296" }}>
            Accéder à mon espace V3 <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/v3/forfaits" className="text-center text-sm text-slate-500 underline">
            Retour aux forfaits
          </Link>
        </div>
      </div>
    </div>
  );
}
