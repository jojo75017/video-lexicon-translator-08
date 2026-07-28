import { useState, useCallback } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AdminPanelNav } from "@/components/admin/AdminPanelNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertTriangle } from "lucide-react";

function CheckoutPreview({ clientSecret }: { clientSecret: string }) {
  const fetchClientSecret = useCallback(() => Promise.resolve(clientSecret), [clientSecret]);
  return (
    <div className="rounded-xl overflow-hidden border shadow-lg bg-white">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

export default function AdminTestPayPalPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const env = getStripeEnvironment();

  const handleStart = async () => {
    if (!email.includes("@")) {
      toast.error("Merci de saisir un email valide");
      return;
    }
    setLoading(true);
    setClientSecret(null);
    try {
      const returnUrl = `${window.location.origin}/admin/tester-paypal?success=1`;
      const { data, error } = await supabase.functions.invoke("test-paypal-checkout", {
        body: { email, environment: env, returnUrl },
      });
      if (error || !data?.clientSecret) {
        throw new Error(error?.message || data?.error || "Impossible de créer la session de test");
      }
      setClientSecret(data.clientSecret as string);
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'ouverture du checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="container mx-auto max-w-4xl py-8 space-y-6">
        <AdminPanelNav />

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.064 1.193 1.378 2.64 1.085 4.154-.342 1.833-1.206 3.055-2.462 3.747-.578.32-1.19.52-1.83.62.374.428.6.91.72 1.45.262 1.105.13 2.53-.387 4.257-.602 2.03-1.55 3.465-2.815 4.267-1.163.733-2.683 1.104-4.526 1.104H7.68a.65.65 0 0 1-.604-.438z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Tester PayPal</h1>
            <p className="text-muted-foreground">
              Vérifiez que le bouton PayPal apparaît dans le checkout Stripe embarqué.
            </p>
          </div>
        </div>

        <Card className="p-6 space-y-4">
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Environnement actuel : {env === "live" ? "LIVE (vrai argent)" : "SANDBOX (test)"}</p>
                <p className="mt-1">
                  {env === "live"
                    ? "Le test crée un vrai paiement de 1 €. Utilisez-le avec un vrai compte PayPal pour confirmer le flux."
                    : "Le test crée un paiement fictif de 1 €. PayPal doit aussi être activé dans votre compte Stripe SANDBOX pour que le bouton apparaisse ici."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="email"
              placeholder="Votre email de test"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleStart} disabled={loading} className="md:w-auto">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Ouvrir le checkout test (1 €)
            </Button>
          </div>
        </Card>

        {clientSecret && <CheckoutPreview clientSecret={clientSecret} />}

        <div className="text-sm text-muted-foreground space-y-2">
          <p><strong>Carte de test (sandbox) :</strong> 4242 4242 4242 4242, date future, CVC 123.</p>
          <p><strong>Pour PayPal :</strong> le bouton n'apparaît que si la devise (EUR), le pays du navigateur et le montant sont compatibles avec PayPal. Si PayPal n'est pas activé dans l'environnement Stripe utilisé, seul le formulaire de carte s'affichera.</p>
        </div>
      </div>
    </div>
  );
}
