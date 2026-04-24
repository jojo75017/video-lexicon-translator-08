import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StripeCheckoutButtonProps {
  email: string;
  className?: string;
  children?: React.ReactNode;
  successPath?: string;
  cancelPath?: string;
  planId?: string;
  onError?: (msg: string) => void;
}

/**
 * Bouton réutilisable pour lancer un paiement carte via Stripe Checkout.
 * Utilise l'edge function existante `stripe-checkout`.
 */
const StripeCheckoutButton = ({
  email,
  className = "",
  children,
  successPath = "/paiement-succes",
  cancelPath = "/offres",
  planId = "annual",
  onError,
}: StripeCheckoutButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      const msg = "Merci de saisir un email valide avant de payer.";
      toast.error(msg);
      onError?.(msg);
      return;
    }

    setLoading(true);
    try {
      const origin = window.location.origin;
      const { data, error } = await supabase.functions.invoke("stripe-checkout", {
        body: {
          planId,
          email: trimmedEmail,
          successUrl: `${origin}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${origin}${cancelPath}`,
        },
      });

      if (error) throw new Error(error.message || "Erreur de paiement");
      const url = (data as { url?: string })?.url;
      if (!url) throw new Error("URL Stripe manquante");

      // Redirection vers la page Stripe sécurisée
      window.location.href = url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Paiement impossible";
      toast.error(msg);
      onError?.(msg);
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={
        className ||
        "w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 text-base font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:hover:scale-100"
      }
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Redirection sécurisée…
        </>
      ) : (
        <>
          <CreditCard className="h-5 w-5" />
          {children || "Payer par carte (7 jours gratuits)"}
        </>
      )}
    </button>
  );
};

export default StripeCheckoutButton;
