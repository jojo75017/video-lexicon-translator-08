import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Sparkles, ArrowRight, Clock, Gift, Loader2, Crown, Zap, BookOpen } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const UpsellPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState({ minutes: 15, seconds: 0 });
  const email = searchParams.get("email") || "";

  // Countdown 15 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev.minutes === 0 && prev.seconds === 0) {
          clearInterval(interval);
          return prev;
        }
        if (prev.seconds === 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const starterFeatures = [
    { text: "5 ebooks/mois", included: true },
    { text: "20 chapitres/mois", included: true },
    { text: "Export PDF uniquement", included: true },
    { text: "Modules 1-4", included: true },
    { text: "Couvertures IA", included: false },
    { text: "Traduction multi-langues", included: false },
    { text: "Générateur Audiobooks", included: false },
    { text: "Outils KDP Premium", included: false },
    { text: "Modules 5-12", included: false },
  ];

  const proFeatures = [
    { text: "Ebooks ILLIMITÉS à vie", included: true, highlight: true },
    { text: "Chapitres ILLIMITÉS", included: true, highlight: true },
    { text: "10 couvertures IA/mois", included: true },
    { text: "Export PDF / EPUB / Word", included: true },
    { text: "Toutes les formations (12 modules)", included: true },
    { text: "Traduction multi-langues", included: true },
    { text: "Générateur Audiobooks", included: true },
    { text: "Outils KDP Premium complets", included: true },
    { text: "Mises à jour gratuites à vie", included: true },
  ];

  const handleUpgrade = async () => {
    if (!email) {
      toast.error("Email manquant");
      navigate("/offres");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("stripe-checkout", {
        body: {
          planId: "pro",
          email: email,
          successUrl: `${window.location.origin}/paiement-succes?plan=pro&upgraded=true`,
          cancelUrl: `${window.location.origin}/ebook-planner`,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Upgrade error:", error);
      toast.error("Erreur lors de l'upgrade");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    toast.success("Bienvenue ! Votre accès Starter est actif.");
    navigate("/ebook-planner");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950">
      {/* Header urgence */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-black py-3 px-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <Clock className="w-5 h-5 animate-pulse" />
          <span className="font-bold text-lg">
            OFFRE SPÉCIALE UPGRADE : {countdown.minutes.toString().padStart(2, "0")}:
            {countdown.seconds.toString().padStart(2, "0")}
          </span>
          <Gift className="w-5 h-5" />
        </div>
        <p className="text-sm font-medium mt-1">
          Débloquez TOUT maintenant et économisez 100€ sur le prix standard !
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Titre */}
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-amber-500/20 text-amber-300 border-amber-500/30 px-4 py-2">
            <Crown className="w-4 h-4 mr-2" />
            OFFRE UNIQUE POST-ACHAT
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Attendez ! 🎁 Débloquez{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              TOUT
            </span>{" "}
            pour seulement 50€ de plus
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Vous avez choisi Starter à 47€. Passez à Pro Lifetime pour{" "}
            <strong className="text-white">+50€</strong> et débloquez l'accès complet à vie.
          </p>
        </div>

        {/* Comparaison */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Starter (actuel) */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="text-center pb-4">
              <Badge variant="outline" className="mb-2 w-fit mx-auto text-gray-400">
                Votre achat actuel
              </Badge>
              <CardTitle className="text-2xl text-white">Starter</CardTitle>
              <p className="text-3xl font-bold text-white">
                47€ <span className="text-sm font-normal text-gray-400">unique</span>
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {starterFeatures.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                    )}
                    <span className={feature.included ? "text-gray-200" : "text-gray-500 line-through"}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Pro Lifetime (upgrade) */}
          <Card className="bg-gradient-to-br from-violet-900/50 to-purple-900/50 border-2 border-amber-500/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500 text-black px-4 py-1 text-sm font-bold">
              RECOMMANDÉ
            </div>
            <CardHeader className="text-center pb-4">
              <Badge className="mb-2 w-fit mx-auto bg-amber-500/20 text-amber-300 border-amber-500/30">
                <Sparkles className="w-3 h-3 mr-1" />
                Upgrade spécial
              </Badge>
              <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
                <Crown className="w-6 h-6 text-amber-400" />
                Pro Lifetime
              </CardTitle>
              <div>
                <p className="text-gray-400 line-through text-lg">197€</p>
                <p className="text-4xl font-bold text-white">
                  97€ <span className="text-sm font-normal text-gray-400">unique à vie</span>
                </p>
                <Badge className="mt-2 bg-green-500/20 text-green-300">
                  +50€ seulement (économie 100€)
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {proFeatures.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check
                      className={`w-5 h-5 flex-shrink-0 ${
                        feature.highlight ? "text-amber-400" : "text-green-400"
                      }`}
                    />
                    <span className={feature.highlight ? "text-amber-200 font-semibold" : "text-gray-200"}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <Button
            size="lg"
            className="text-xl px-12 py-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold shadow-2xl shadow-amber-500/30"
            onClick={handleUpgrade}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
            ) : (
              <Zap className="w-6 h-6 mr-2" />
            )}
            OUI ! Je passe à Pro Lifetime pour +50€
          </Button>

          <div>
            <Button variant="ghost" className="text-gray-400 hover:text-gray-300" onClick={handleSkip}>
              Non merci, je reste sur Starter →
            </Button>
          </div>

          <p className="text-sm text-gray-500 max-w-md mx-auto">
            🔒 Paiement 100% sécurisé par Stripe. Cette offre expire dans{" "}
            {countdown.minutes}:{countdown.seconds.toString().padStart(2, "0")}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpsellPage;
