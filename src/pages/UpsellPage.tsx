import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Sparkles, ArrowRight, Clock, Gift, Crown, Zap, Cpu, Headphones, Image as ImageIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const LAUNCH_PRICE = 67;
const NORMAL_PRICE = 147;

const UpsellPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState({ minutes: 15, seconds: 0 });
  const email = searchParams.get("email") || "";

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

  const handleUpgrade = () => {
    window.location.href = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=boubetgeorges@gmail.com&amount=${LAUNCH_PRICE}&currency_code=EUR&item_name=EbookStudio%20Pro%20Lifetime&return=${encodeURIComponent(window.location.origin + '/confirmation-paiement')}&cancel_return=${encodeURIComponent(window.location.origin + '/offres')}`;
  };

  const handleSkip = () => {
    toast.success("Bienvenue ! Votre accès est actif.");
    navigate("/ebook-planner");
  };

  const proFeatures = [
    { text: "Workflow 15 rôles IA complet", included: true, highlight: true },
    { text: "Gemini 3 Flash — IA la plus rapide", included: true, highlight: true },
    { text: "Imagen 3 — couvertures photoréalistes", included: true },
    { text: "Azure Neural Voices — audiobooks", included: true },
    { text: "Export PDF / EPUB / Word", included: true },
    { text: "Toutes les formations (18 modules)", included: true },
    { text: "Traduction multi-langues (30+)", included: true },
    { text: "P15 Humanisation Anti-IA", included: true },
    { text: "Outils KDP Premium complets", included: true },
    { text: "Mises à jour gratuites à vie", included: true },
    { text: "Support prioritaire + Zoom gratuit", included: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-violet-950 to-background">
      {/* Header urgence */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-black py-3 px-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <Clock className="w-5 h-5 animate-pulse" />
          <span className="font-bold text-lg">
            OFFRE DE LANCEMENT : {countdown.minutes.toString().padStart(2, "0")}:
            {countdown.seconds.toString().padStart(2, "0")}
          </span>
          <Gift className="w-5 h-5" />
        </div>
        <p className="text-sm font-medium mt-1">
          Accès Pro Lifetime à {LAUNCH_PRICE}€ au lieu de {NORMAL_PRICE}€ — Économisez {NORMAL_PRICE - LAUNCH_PRICE}€ !
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Titre */}
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-amber-500/20 text-amber-300 border-amber-500/30 px-4 py-2">
            <Crown className="w-4 h-4 mr-2" />
            OFFRE DE LANCEMENT PREMIUM
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Accédez à la{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              technologie IA la plus puissante
            </span>{" "}
            pour vos ebooks
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Gemini 3 Flash, Imagen 3, Azure Neural Voices — tout inclus à vie pour seulement{" "}
            <strong className="text-white">{LAUNCH_PRICE}€</strong>.
          </p>
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {[
            { icon: Cpu, name: "Gemini 3 Flash", desc: "Rédaction IA ultra-rapide", color: "from-blue-500 to-cyan-500" },
            { icon: ImageIcon, name: "Imagen 3", desc: "Couvertures pro", color: "from-violet-500 to-purple-500" },
            { icon: Headphones, name: "Azure Speech", desc: "Voix neuronales", color: "from-emerald-500 to-teal-500" },
          ].map((tech, i) => (
            <div key={i} className="flex items-center gap-3 bg-muted border border-border rounded-xl px-4 py-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tech.color} flex items-center justify-center`}>
                <tech.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{tech.name}</p>
                <p className="text-gray-400 text-xs">{tech.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pro card */}
        <Card className="bg-gradient-to-br from-violet-900/50 to-purple-900/50 border-2 border-amber-500/50 relative overflow-hidden mb-10">
          <div className="absolute top-0 right-0 bg-amber-500 text-black px-4 py-1 text-sm font-bold">
            LANCEMENT
          </div>
          <CardHeader className="text-center pb-4">
            <Badge className="mb-2 w-fit mx-auto bg-amber-500/20 text-amber-300 border-amber-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Accès à vie
            </Badge>
            <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
              <Crown className="w-6 h-6 text-amber-400" />
              Pro Lifetime
            </CardTitle>
            <div>
              <p className="text-gray-400 line-through text-lg">{NORMAL_PRICE}€</p>
              <p className="text-4xl font-bold text-white">
                {LAUNCH_PRICE}€ <span className="text-sm font-normal text-gray-400">unique à vie</span>
              </p>
              <Badge className="mt-2 bg-green-500/20 text-green-300">
                Économie de {NORMAL_PRICE - LAUNCH_PRICE}€
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

        {/* CTA */}
        <div className="text-center space-y-4">
          <Button
            size="lg"
            className="text-xl px-12 py-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold shadow-2xl shadow-amber-500/30"
            onClick={handleUpgrade}
          >
            <Zap className="w-6 h-6 mr-2" />
            Accès Pro Lifetime — {LAUNCH_PRICE}€ à vie
          </Button>

          <div>
            <Button variant="ghost" className="text-gray-400 hover:text-gray-300" onClick={handleSkip}>
              Non merci, continuer sans upgrade →
            </Button>
          </div>

          <p className="text-sm text-gray-500 max-w-md mx-auto">
            🔒 Paiement 100% sécurisé par PayPal. Cette offre expire dans{" "}
            {countdown.minutes}:{countdown.seconds.toString().padStart(2, "0")}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpsellPage;
