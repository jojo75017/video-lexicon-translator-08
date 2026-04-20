import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Check, CreditCard, ArrowLeft, ArrowRight, Sparkles, Cpu, Headphones, 
  Image, ShieldCheck, Lock, Clock, Users, Star, Zap, Gift, CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const LAUNCH_PRICE = 67;
const NORMAL_PRICE = 147;

const PLAN = {
  name: "Pro Lifetime",
  price: String(LAUNCH_PRICE),
  originalPrice: String(NORMAL_PRICE),
  paypalLinks: {
    full: `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=boubetgeorges@gmail.com&amount=${LAUNCH_PRICE}&currency_code=EUR&item_name=EbookStudio%20Pro%20Lifetime`,
    installment2: `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=boubetgeorges@gmail.com&amount=35&currency_code=EUR&item_name=EbookStudio%20Pro%20(1/2)`,
    installment3: `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=boubetgeorges@gmail.com&amount=25&currency_code=EUR&item_name=EbookStudio%20Pro%20(1/3)`,
  },
  features: [
    "Workflow éditorial 15 rôles IA",
    "Gemini 3 Flash — IA ultra-rapide",
    "Imagen 3 — couvertures pro",
    "Azure Neural — audiobooks",
    "Export PDF/EPUB/Word",
    "18 modules de formation (147€ offerts)",
    "Outils KDP Premium + SEO",
    "Traduction 30+ langues",
    "P15 Humanisation Anti-IA",
    "Mises à jour à vie",
    "Support prioritaire + Zoom gratuit"
  ],
};

const UpsellPaiementPage = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<'full' | 'installment2' | 'installment3'>('full');
  const [buyerCount, setBuyerCount] = useState(12);
  const navigate = useNavigate();

  // Simulate live buyer count
  useEffect(() => {
    const base = new Date().getDate() % 8 + 9;
    setBuyerCount(base);
  }, []);

  const paymentOptions = [
    { id: 'full' as const, label: 'Paiement unique', price: `${LAUNCH_PRICE}€`, detail: 'Meilleur rapport qualité-prix', badge: 'POPULAIRE' },
    { id: 'installment2' as const, label: 'En 2 fois', price: '35€/mois', detail: '2 mensualités de 35€', badge: null },
    { id: 'installment3' as const, label: 'En 3 fois', price: '25€/mois', detail: '3 mensualités de 25€', badge: null },
  ];

  const handlePayPalClick = () => {
    if (email.trim()) {
      sessionStorage.setItem('payment_email', email.trim());
      localStorage.setItem('payment_email_backup', email.trim());
    }
  };

  const goToConfirmation = () => {
    if (!email.trim()) {
      toast.error("Veuillez d'abord entrer votre email");
      return;
    }
    sessionStorage.setItem('payment_email', email.trim());
    localStorage.setItem('payment_email_backup', email.trim());
    navigate('/confirmation-paiement');
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-xl mx-auto">
        <Link to="/offres" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Retour aux offres
        </Link>

        {/* Trust banner */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-emerald-400" />Paiement sécurisé</span>
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />Garantie 30 jours</span>
          <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400" />Accès instantané</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="border border-border shadow-2xl bg-card/95 backdrop-blur overflow-hidden">
            {/* Header */}
            <CardHeader className="text-center bg-gradient-to-r from-cyan-600 to-emerald-600 text-white py-8 relative">
              <div className="absolute top-3 right-3">
                <Badge className="bg-white/20 text-white border-white/30 text-[10px]">
                  🔥 OFFRE DE LANCEMENT
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold">Finalisez votre commande</CardTitle>
              <p className="text-foreground/80 mt-1 text-sm">EbookStudio Pro — Accès à vie</p>
              <div className="mt-5 flex items-baseline justify-center gap-3">
                <span className="text-xl text-muted-foreground line-through">{PLAN.originalPrice}€</span>
                <span className="text-6xl font-black text-white">{PLAN.price}€</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Paiement unique • Sans abonnement</p>
              
              {/* Live social proof */}
              <div className="mt-4 inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-xs text-foreground/80">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {buyerCount} personnes ont rejoint aujourd'hui
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Quick recap - collapsed */}
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-foreground/80 hover:text-white transition-colors">
                  <span className="flex items-center gap-2 font-medium text-sm">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Voir tout ce qui est inclus ({PLAN.features.length} fonctionnalités)
                  </span>
                  <ArrowRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-3 bg-muted rounded-xl p-4">
                  <div className="grid grid-cols-1 gap-1.5">
                    {PLAN.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-foreground/80 text-sm">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                  {/* Tech badges */}
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
                    {[
                      { icon: Cpu, label: "Gemini 3 Flash" },
                      { icon: Image, label: "Imagen 3" },
                      { icon: Headphones, label: "Azure Speech" },
                    ].map((t, i) => (
                      <span key={i} className="inline-flex items-center gap-1 bg-slate-700/50 rounded-full px-2.5 py-1 text-[11px] text-muted-foreground">
                        <t.icon className="w-3 h-3" />{t.label}
                      </span>
                    ))}
                  </div>
                </div>
              </details>

              {/* Step 1: Email */}
              <div className="space-y-2">
                <label className="text-white font-medium text-sm flex items-center gap-2">
                  <span className="bg-cyan-500 text-slate-900 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  Votre email
                </label>
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-muted border-border text-white placeholder:text-slate-500 h-12 rounded-xl"
                />
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Votre code d'accès sera envoyé à cette adresse
                </p>
              </div>

              {/* Step 2: Payment mode */}
              <div className="space-y-3">
                <label className="text-white font-medium text-sm flex items-center gap-2">
                  <span className="bg-cyan-500 text-slate-900 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  Mode de paiement
                </label>
                <div className="space-y-2">
                  {paymentOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedPayment(option.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        selectedPayment === option.id 
                          ? 'border-cyan-400 bg-cyan-950/30 shadow-lg shadow-cyan-500/10' 
                          : 'border-border hover:border-slate-600 bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedPayment === option.id ? 'border-cyan-400' : 'border-slate-600'
                        }`}>
                          {selectedPayment === option.id && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white text-sm">{option.label}</span>
                            {option.badge && (
                              <Badge className="bg-cyan-500/20 text-cyan-400 border-primary/20 text-[10px] px-1.5 py-0">
                                {option.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground">{option.detail}</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-white">{option.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Pay */}
              <div className="space-y-3">
                <label className="text-white font-medium text-sm flex items-center gap-2">
                  <span className="bg-cyan-500 text-slate-900 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  Payer maintenant
                </label>
                <a 
                  href={PLAN.paypalLinks[selectedPayment]}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handlePayPalClick}
                  className="block"
                >
                  <Button size="lg" className="w-full py-7 text-lg font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-900 rounded-xl shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payer {paymentOptions.find(o => o.id === selectedPayment)?.price} — PayPal ou CB
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
                <p className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-3">
                  <span className="flex items-center gap-1"><Lock className="w-3 h-3" />SSL 256-bit</span>
                  <span>•</span>
                  <span>PayPal ou carte bancaire</span>
                </p>
              </div>

              {/* Step 4: Confirm */}
              <div className="space-y-2 pt-2 border-t border-border">
                <label className="text-white font-medium text-sm flex items-center gap-2">
                  <span className="bg-slate-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  Après paiement
                </label>
                <Button 
                  onClick={goToConfirmation} 
                  variant="outline"
                  className="w-full border-border text-white hover:bg-muted hover:border-slate-600 rounded-xl"
                  size="lg"
                >
                  <CheckCircle className="w-5 h-5 mr-2 text-emerald-400" />
                  J'ai payé → Confirmer mon achat
                </Button>
                <p className="text-[11px] text-center text-slate-500">
                  Code d'accès envoyé en quelques minutes (24h max)
                </p>
              </div>

              {/* Guarantee */}
              <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-emerald-300 font-semibold text-sm">Garantie 30 jours — Satisfait ou remboursé</p>
                    <p className="text-emerald-400/70 text-xs mt-1">
                      Testez EbookStudio pendant 30 jours. Si vous ne publiez pas votre premier ebook, remboursement intégral. Aucune question posée.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom social proof */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  <span className="text-muted-foreground text-sm ml-1">4.8/5 (47 avis)</span>
                </div>
                <p className="text-slate-500 text-xs">
                  Rejoint par 47+ auteurs KDP • Créé par Georges Boubet (35+ ebooks publiés)
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ mini */}
        <div className="mt-8 space-y-3 text-sm">
          {[
            { q: "Quand est-ce que je reçois mon accès ?", a: "En quelques minutes après confirmation. 24h maximum." },
            { q: "Est-ce vraiment un paiement unique ?", a: "Oui, 67€ une seule fois. Pas d'abonnement, pas de frais cachés. Accès à vie." },
            { q: "Et si ça ne me convient pas ?", a: "Vous avez 30 jours pour tester. Remboursement intégral sans justification." },
          ].map((faq, i) => (
            <details key={i} className="group bg-card border border-border rounded-xl">
              <summary className="px-4 py-3 cursor-pointer text-foreground/80 hover:text-white font-medium flex items-center justify-between">
                {faq.q}
                <ArrowRight className="w-4 h-4 group-open:rotate-90 transition-transform flex-shrink-0" />
              </summary>
              <p className="px-4 pb-3 text-muted-foreground text-sm">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpsellPaiementPage;
