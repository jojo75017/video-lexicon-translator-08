import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, Mail, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ConfirmationPaiementPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Récupérer l'email sauvegardé depuis la page de paiement
  useEffect(() => {
    const savedEmail = sessionStorage.getItem('payment_email');
    if (savedEmail) {
      setEmail(savedEmail);
      sessionStorage.removeItem('payment_email');
    }
  }, []);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Veuillez entrer votre email");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Veuillez entrer un email valide");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("payment_confirmations")
        .insert({ email: email.trim().toLowerCase() });

      if (error) throw error;

      // Notifier l'admin par email
      await supabase.functions.invoke('notify-admin-confirmation', {
        body: { email: email.trim().toLowerCase(), timestamp: new Date().toISOString() }
      });

      setIsSubmitted(true);
      toast.success("Confirmation envoyée ! Vous recevrez votre code sous peu.");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50 py-12 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full border-2 border-emerald-200 shadow-xl">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-emerald-600" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-emerald-800">Confirmation reçue ! ✨</h2>
              <p className="text-muted-foreground">
                Votre paiement est en cours de vérification.
              </p>
            </div>

            <div className="bg-violet-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-violet-700">
                <Mail className="w-5 h-5" />
                <span className="font-medium">Prochaine étape</span>
              </div>
              <p className="text-sm text-violet-600">
                Vous recevrez votre code d'accès <strong>EBK-XXXXXX</strong> par email 
                sous quelques minutes à quelques heures maximum.
              </p>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>📧 Email de réception : <strong>{email}</strong></p>
              <p className="mt-2">Vérifiez aussi vos spams !</p>
            </div>

            <Link to="/subscription">
              <Button variant="outline" className="w-full">
                Se connecter avec mon code
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Link to="/paiement-manuel" className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-800 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Retour au paiement
        </Link>

        <Card className="border-2 border-violet-200 shadow-xl">
          <CardHeader className="text-center bg-gradient-to-r from-emerald-600 to-violet-600 text-white rounded-t-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-6 h-6" />
              <CardTitle className="text-xl">Paiement effectué ?</CardTitle>
            </div>
            <p className="text-emerald-100 text-sm">Confirmez pour recevoir votre code d'accès</p>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Votre adresse email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-violet-200 focus:border-violet-400"
                  disabled={isSubmitting}
                  autoComplete="email"
                />
                <p className="text-xs text-muted-foreground">
                  Entrez l'email utilisé pour le paiement PayPal
                </p>
              </div>

              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-600 to-violet-600 hover:from-emerald-700 hover:to-violet-700"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Confirmer mon paiement
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground space-y-1">
                <p>⏱️ Traitement sous 24h maximum</p>
                <p>(souvent en quelques minutes)</p>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Pas encore payé ?</p>
          <Link to="/paiement-manuel" className="text-violet-600 hover:underline">
            Retourner à la page de paiement
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPaiementPage;
