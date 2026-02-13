import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, ArrowLeft, ArrowRight, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const PLANS = {
  starter: {
    name: "Starter",
    price: "47",
    originalPrice: "97",
    paypalLink: "https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=boubetgeorges@gmail.com&amount=47&currency_code=EUR&item_name=EbookStudio%20Starter",
    description: "20 ebooks/mois • Export PDF • Modules 1-4",
    features: [
      "20 ebooks par mois",
      "Chapitres inclus",
      "Export PDF",
      "Modules de formation 1-4",
      "Support email"
    ],
    badge: "🚀 DÉMARRAGE",
    color: "from-blue-600 to-cyan-600"
  },
  pro: {
    name: "Pro Lifetime",
    price: "97",
    originalPrice: "197",
    paypalLink: "https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=boubetgeorges@gmail.com&amount=97&currency_code=EUR&item_name=EbookStudio%20Pro%20Lifetime",
    description: "Tout illimité à vie • Toutes les formations",
    features: [
      "Ebooks illimités à vie",
      "Chapitres illimités",
      "10 couvertures IA/mois",
      "Export PDF/EPUB/Word",
      "Toutes les formations (18 modules)",
      "Outils KDP Premium",
      "Traduction multi-langues",
      "Générateur Audiobooks",
      "Mises à jour à vie",
      "Support prioritaire"
    ],
    badge: "⭐ MEILLEURE OFFRE",
    color: "from-violet-600 to-purple-600"
  }
};

const UpsellPaiementPage = () => {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('plan') || 'pro';
  const plan = PLANS[planId as keyof typeof PLANS] || PLANS.pro;
  
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handlePayPalClick = () => {
    if (email.trim()) {
      sessionStorage.setItem('payment_email', email.trim());
    }
  };

  const goToConfirmation = () => {
    if (!email.trim()) {
      toast.error("Veuillez d'abord entrer votre email");
      return;
    }
    sessionStorage.setItem('payment_email', email.trim());
    navigate('/confirmation-paiement');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/offres" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" />
          Retour aux offres
        </Link>

        <Card className="border-2 border-purple-500/30 shadow-2xl bg-slate-900/90 backdrop-blur">
          <CardHeader className={`text-center bg-gradient-to-r ${plan.color} text-white rounded-t-lg py-8`}>
            <Badge className="mx-auto mb-3 bg-white/20 text-white border-white/30">
              {plan.badge}
            </Badge>
            <CardTitle className="text-3xl font-bold">{plan.name}</CardTitle>
            <p className="text-white/80 mt-2">{plan.description}</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="text-2xl text-white/50 line-through">{plan.originalPrice}€</span>
              <span className="text-5xl font-black text-white">{plan.price}€</span>
            </div>
            <p className="text-sm text-white/70 mt-2">Paiement unique • Accès immédiat</p>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Features */}
            <div className="bg-slate-800/50 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Ce qui est inclus
              </h3>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-white/80">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-white font-medium flex items-center gap-2">
                <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                Votre email
              </label>
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
              <p className="text-xs text-slate-400">Vous recevrez votre code d'accès à cette adresse</p>
            </div>

            {/* PayPal Button */}
            <div className="space-y-3">
              <label className="text-white font-medium flex items-center gap-2">
                <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                Payer {plan.price}€
              </label>
              <a 
                href={plan.paypalLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handlePayPalClick}
                className="block border-2 border-blue-400/50 rounded-xl p-5 hover:border-blue-400 hover:bg-blue-900/20 transition-all bg-gradient-to-r from-blue-900/30 to-cyan-900/30"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500 p-3 rounded-xl">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">💳 Payer {plan.price}€ avec PayPal</p>
                    <p className="text-sm text-blue-300">Paiement sécurisé - PayPal ou carte bancaire</p>
                  </div>
                </div>
              </a>
            </div>

            {/* Confirmation */}
            <div className="space-y-3">
              <label className="text-white font-medium flex items-center gap-2">
                <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                Après paiement
              </label>
              <Button 
                onClick={goToConfirmation} 
                className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white`}
                size="lg"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                J'ai payé, confirmer mon achat
              </Button>
              <p className="text-xs text-center text-slate-400">
                Code d'accès envoyé sous 24h max (souvent en quelques minutes)
              </p>
            </div>

            {/* Garantie */}
            <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-4 text-center">
              <p className="text-emerald-300 font-medium">✅ Garantie 30 jours satisfait ou remboursé</p>
              <p className="text-sm text-emerald-400/80">Remboursement intégral sans question</p>
            </div>
          </CardContent>
        </Card>

        {/* Comparaison rapide */}
        {planId === 'starter' && (
          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="font-bold text-yellow-300">Passez à Pro pour seulement 50€ de plus !</span>
            </div>
            <p className="text-sm text-yellow-200/80 mb-3">
              Débloquez l'accès illimité à vie, les couvertures IA, l'audiobook et toutes les formations.
            </p>
            <Link to="/upsell-paiement?plan=pro">
              <Button variant="outline" className="border-yellow-500/50 text-yellow-300 hover:bg-yellow-900/30">
                Voir l'offre Pro à 97€ →
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpsellPaiementPage;
