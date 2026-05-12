import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";

interface Bonus {
  key: string;
  title: string;
  amount: number;
}

interface Props {
  email: string;
  firstName?: string;
  refCode?: string | null;
  returnUrl: string;
  bonuses?: Bonus[];
}

export function PromoStripeCheckout({ email, firstName, refCode, returnUrl, bonuses }: Props) {
  const fetchClientSecret = async (): Promise<string> => {
    const { data, error } = await supabase.functions.invoke("create-promo-checkout", {
      body: {
        email,
        first_name: firstName,
        ref_code: refCode,
        environment: getStripeEnvironment(),
        returnUrl,
        bonuses: bonuses || [],
      },
    });
    if (error || !data?.clientSecret) {
      throw new Error(error?.message || "Impossible d'initialiser le paiement");
    }
    return data.clientSecret;
  };

  return (
    <div id="promo-checkout" className="rounded-xl overflow-hidden">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
