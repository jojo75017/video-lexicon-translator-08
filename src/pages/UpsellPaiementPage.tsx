import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, ArrowLeft, ArrowRight, Sparkles, Cpu, Headphones, Image } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const LAUNCH_PRICE = 67;
const NORMAL_PRICE = 147;
const PROMO_DISCOUNT = 50;
const FUTURE_PRICE = NORMAL_PRICE - PROMO_DISCOUNT;

const PLANS = {
  pro: {
    name: "Pro Lifetime",
    price: String(LAUNCH_PRICE),
    originalPrice: String(NORMAL_PRICE),
    paypalLinks: {
      full: `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=boubetgeorges@gmail.com&amount=${LAUNCH_PRICE}&currency_code=EUR&item_name=EbookStudio%20Pro%20Lifetime`,
      installment2: `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=boubetgeorges@gmail.com&amount=35&currency_code=EUR&item_name=EbookStudio%20Pro%20(1/2)`,
      installment3: `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=boubetgeorges@gmail.com&amount=25&currency_code=EUR&item_name=EbookStudio%20Pro%20(1/3)`,
    },
    description: "Gemini 3 Flash • Imagen 3 • Azure Neural Voices • Tout illimité à vie",
    features: [
      "Workflow éditorial 15 rôles IA",
      "Gemini 3 Flash — IA la plus rapide",
      "Imagen 3 — couvertures photoréalistes",
      "Azure Neural Voices — audiobooks",
      "Export PDF/EPUB/Word",
      "Toutes les formations (18 modules)",
      "Outils KDP Premium",
      "Traduction multi-langues (30+)",
      "P15 Humanisation Anti-IA",
      "Mises à jour à vie",
      "Support prioritaire + Zoom gratuit"
    ],
    badge: "🔥 OFFRE DE LANCEMENT",
    color: "from-violet-600 to-purple-600"
  }
};

const UpsellPaiementPage = () => {
  const [searchParams] = useSearchParams();
  const plan = PLANS.pro;
  
  const [email, setEmail] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<'full' | 'installment2' | 'installment3'>('full');
  const navigate = useNavigate();

  const paymentOptions = [
    { id: 'full' as const, label: 'Paiement unique', price: `${LAUNCH_PRICE}€`, detail: `Paiement unique de ${LAUNCH_PRICE}€` },
    { id: 'installment2' as const, label: 'En 2 fois', price: '35€', detail: '35€/mois pendant 2 mois' },
    { id: 'installment3' as const, label: 'En 3 fois', price: '25€', detail: '25€/mois pendant 3 mois' },
  ];

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
            <p className="text-sm text-white/70 mt-2">Paiement unique • Accès immédiat à vie</p>
            <p className="text-xs text-white/50 mt-1">Prix après lancement : {FUTURE_PRICE}€</p>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Tech stack */}
            <div className="flex flex-wrap justify-center gap-3 -mt-2">
              {[
                { icon: Cpu, label: "Gemini 3 Flash", color: "bg-blue-500" },
                { icon: Image, label: "Imagen 3", color: "bg-violet-500" },
                { icon: Headphones, label: "Azure Speech", color: "bg-emerald-500" },
              ].map((tech, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-slate-800/80 rounded-full px-3 py-1.5 text-xs text-white/80">
                  <tech.icon className="w-3.5 h-3.5" />
                  <span>{tech.label}</span>
                </div>
              ))}
            </div>

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

            {/* Payment Options */}
            <div className="space-y-3">
              <label className="text-white font-medium flex items-center gap-2">
                <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                Choisissez votre mode de paiement
              </label>
              <div className="space-y-2">
                {paymentOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedPayment(option.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      selectedPayment === option.id 
                        ? 'border-purple-400 bg-purple-900/30' 
                        : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                    }`}
                  >
                    <div className="text-left">
                      <span className="font-semibold text-white">{option.label}</span>
                      <p className="text-xs text-slate-400">{option.detail}</p>
                    </div>
                    <span className="text-xl font-bold text-white">{option.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* PayPal Button */}
            <div className="space-y-3">
              <label className="text-white font-medium flex items-center gap-2">
                <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                Payer
              </label>
              <a 
                href={plan.paypalLinks[selectedPayment]}
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
                    <p className="font-bold text-white text-lg">
                      💳 Payer {paymentOptions.find(o => o.id === selectedPayment)?.price} avec PayPal
                    </p>
                    <p className="text-sm text-blue-300">Paiement sécurisé - PayPal ou carte bancaire</p>
                  </div>
                </div>
              </a>
            </div>

            {/* Confirmation */}
            <div className="space-y-3">
              <label className="text-white font-medium flex items-center gap-2">
                <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">4</span>
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
      </div>
    </div>
  );
};

export default UpsellPaiementPage;
