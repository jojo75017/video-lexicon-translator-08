import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { V3PlanId, V3BillingInterval } from "@/data/v3Pricing";

interface Props {
  planId: V3PlanId;
  interval: V3BillingInterval;
  planName: string;
  amount: number;
  accent: string;
}

export function PayPalSubscribeButton({ planId, interval, planName, amount, accent }: Props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const startSubscribe = async () => {
    if (!email.includes("@")) {
      toast.error("Email invalide");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("paypal-subscribe", {
        body: {
          planId,
          interval,
          email: email.trim(),
          returnUrl: `${window.location.origin}/v3/paypal-retour?plan=${planId}&interval=${interval}`,
          cancelUrl: `${window.location.origin}/v3/forfaits?paypal=cancelled`,
        },
      });
      if (error || !data?.approvalUrl) {
        throw new Error(error?.message || data?.error || "Erreur PayPal");
      }
      // Persist locally so the return page can reconcile
      try {
        localStorage.setItem("paypal_sub_email", email.trim());
        localStorage.setItem("paypal_sub_id", data.subscriptionId);
      } catch { /* ignore */ }
      window.location.href = data.approvalUrl;
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Impossible d'ouvrir PayPal");
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="block w-full text-center py-2.5 rounded-lg font-semibold text-sm border-2 transition hover:opacity-90"
        style={{ borderColor: accent, color: accent, background: "#fff" }}
      >
        Payer avec PayPal
      </button>

      <Dialog open={open} onOpenChange={(o) => !loading && setOpen(o)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>S'abonner avec PayPal</DialogTitle>
            <DialogDescription>
              {planName} — {amount.toFixed(2)} € / {interval === "month" ? "mois" : "an"}<br />
              Prélèvement automatique récurrent via PayPal. Annulable à tout moment depuis votre compte.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Votre email
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.fr"
                autoFocus
                className="mt-1"
              />
            </label>
            <Button
              onClick={startSubscribe}
              disabled={loading}
              className="w-full"
              style={{ background: "#0070ba", color: "#fff" }}
            >
              {loading ? "Redirection vers PayPal…" : "Continuer vers PayPal →"}
            </Button>
            <p className="text-xs text-slate-500 text-center">
              Vous serez redirigé vers PayPal pour approuver l'abonnement.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
