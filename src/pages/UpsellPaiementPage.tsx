import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import StripeCheckoutButton from "@/components/StripeCheckoutButton";
import { 
  Check, CreditCard, ArrowLeft, ArrowRight, Sparkles, Cpu, Headphones, 
  Image, ShieldCheck, Lock, Clock, Users, Star, Zap, Gift, CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LAUNCH_PRICE = 67;
const NORMAL_PRICE = 197;
const SERENITY_PRICE = 30;
const EXTENDED_LICENSE_PRICE = 47;

const buildPaypalLink = (amount: number, label: string) =>
  `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=boubetgeorges@gmail.com&amount=${amount}&currency_code=EUR&item_name=${encodeURIComponent(label)}`;

const PLAN = {
  name: "Pro Lifetime",
  price: String(LAUNCH_PRICE),
  originalPrice: String(NORMAL_PRICE),
  features: [
    "Workflow éditorial 15 rôles IA",
    "Gemini 3 Flash - IA ultra-rapide",
    "Imagen 3 - couvertures pro",
    "Azure Neural - audiobooks",
    "Export PDF/EPUB/Word",
    "18 modules de formation (197€ offerts)",
    "Outils KDP Premium + SEO",
    "Traduction 30+ langues",
    "P15 Humanisation Anti-IA",
    "Mises à jour à vie",
    "Support prioritaire + Zoom gratuit"
  ],
};

const UpsellPaiementPage = () => {
  const [email, setEmail] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<'full' | 'installment2' | 'installment3'>('full');
  const [serenityAddon, setSerenityAddon] = useState(false);
  const [extendedLicense, setExtendedLicense] = useState(false);
  const [buyerCount, setBuyerCount] = useState(12);
  const navigate = useNavigate();

  // Simulate live buyer count
  useEffect(() => {
    const base = new Date().getDate() % 8 + 9;
    setBuyerCount(base);
  }, []);

  const baseAmounts = { full: LAUNCH_PRICE, installment2: 35, installment3: 25 };
  const baseLabels = {
    full: "Ebookstudio Pro V2 Lifetime",
    installment2: "Ebookstudio Pro V2 (1/2)",
    installment3: "Ebookstudio Pro V2 (1/3)",
  };

  // Les add-ons s'ajoutent uniquement à la 1ère échéance (paiement initial)
  const addonsAmount = (serenityAddon ? SERENITY_PRICE : 0) + (extendedLicense ? EXTENDED_LICENSE_PRICE : 0);
  const currentAmount = baseAmounts[selectedPayment] + addonsAmount;
  const addonLabels: string[] = [];
  if (serenityAddon) addonLabels.push("Pack Sérénité");
  if (extendedLicense) addonLabels.push("Licence Étendue");
  const currentLabel = addonLabels.length
    ? `${baseLabels[selectedPayment]} + ${addonLabels.join(" + ")}`
    : baseLabels[selectedPayment];
  const currentPaypalLink = buildPaypalLink(currentAmount, currentLabel);

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
    if (serenityAddon) {
      sessionStorage.setItem('serenity_addon', 'true');
    }
    if (extendedLicense) {
      sessionStorage.setItem('extended_license', 'true');
    }
  };

  const goToConfirmation = () => {
    if (!email.trim()) {
      toast.error("Veuillez d'abord entrer votre email");
      return;
    }
    sessionStorage.setItem('payment_email', email.trim());
    localStorage.setItem('payment_email_backup', email.trim());
    if (serenityAddon) sessionStorage.setItem('serenity_addon', 'true');
    if (extendedLicense) sessionStorage.setItem('extended_license', 'true');
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
              <p className="text-foreground/80 mt-1 text-sm">Ebookstudio Pro V2 - Accès à vie</p>
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

              {/* Add-on Pack Sérénité */}
              <div className="space-y-2">
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    serenityAddon
                      ? 'border-amber-400 bg-amber-950/20 shadow-lg shadow-amber-500/10'
                      : 'border-border hover:border-amber-500/50 bg-muted/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={serenityAddon}
                    onChange={(e) => setSerenityAddon(e.target.checked)}
                    className="mt-1 w-5 h-5 accent-amber-400 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="font-semibold text-white text-sm">
                          Ajouter le Pack Sérénité
                        </span>
                        <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px] px-1.5 py-0">
                          OPTIONNEL
                        </Badge>
                      </div>
                      <span className="text-amber-300 font-bold text-base">+{SERENITY_PRICE}€</span>
                    </div>
                    <ul className="mt-2 space-y-1 text-[12px] text-foreground/75">
                      <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-amber-400 flex-shrink-0" />Session Zoom 1-à-1 (30 min) avec un expert</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-amber-400 flex-shrink-0" />Support prioritaire (réponse sous 24h)</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-amber-400 flex-shrink-0" />Audit de votre 1er ebook avant publication</li>
                    </ul>
                  </div>
                </label>
              </div>

              {/* Add-on Licence Étendue */}
              <div className="space-y-2">
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    extendedLicense
                      ? 'border-purple-400 bg-purple-950/20 shadow-lg shadow-purple-500/10'
                      : 'border-border hover:border-purple-500/50 bg-muted/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={extendedLicense}
                    onChange={(e) => setExtendedLicense(e.target.checked)}
                    className="mt-1 w-5 h-5 accent-purple-400 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="font-semibold text-white text-sm">
                          🚀 Licence Commerciale Étendue
                        </span>
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-[10px] px-1.5 py-0">
                          PRO / FREELANCE
                        </Badge>
                      </div>
                      <span className="text-purple-300 font-bold text-base">+{EXTENDED_LICENSE_PRICE}€</span>
                    </div>
                    <ul className="mt-2 space-y-1 text-[12px] text-foreground/75">
                      <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-purple-400 flex-shrink-0" />Créez des ebooks pour vos clients</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-purple-400 flex-shrink-0" />Usage freelance et agence autorisé</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-purple-400 flex-shrink-0" />Projets commerciaux illimités</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-purple-400 flex-shrink-0" />Revente des prestations autorisée</li>
                    </ul>
                    <Link to="/licence-etendue" target="_blank" className="text-[11px] text-purple-300 hover:text-purple-200 underline mt-2 inline-block">
                      En savoir plus →
                    </Link>
                  </div>
                </label>
              </div>
              <div className="space-y-3">
                <label className="text-white font-medium text-sm flex items-center gap-2">
                  <span className="bg-cyan-500 text-slate-900 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  Payer maintenant
                </label>

                {/* Récap du total */}
                {(serenityAddon || extendedLicense) && (
                  <div className="bg-muted/60 border border-amber-500/30 rounded-lg p-3 text-sm">
                    <div className="flex justify-between text-foreground/80">
                      <span>{paymentOptions.find(o => o.id === selectedPayment)?.label}</span>
                      <span>{baseAmounts[selectedPayment]}€</span>
                    </div>
                    {serenityAddon && (
                      <div className="flex justify-between text-amber-300">
                        <span>+ Pack Sérénité</span>
                        <span>+{SERENITY_PRICE}€</span>
                      </div>
                    )}
                    {extendedLicense && (
                      <div className="flex justify-between text-purple-300">
                        <span>+ Licence Étendue</span>
                        <span>+{EXTENDED_LICENSE_PRICE}€</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-white pt-2 mt-2 border-t border-border">
                      <span>Total à payer maintenant</span>
                      <span>{currentAmount}€</span>
                    </div>
                    {selectedPayment !== 'full' && (
                      <p className="text-[11px] text-muted-foreground mt-1">
                        (Suppléments ajoutés à la 1ère échéance uniquement)
                      </p>
                    )}
                  </div>
                )}

                {selectedPayment === 'full' ? (
                  <StripeCheckoutButton
                    email={email}
                    planId="pro"
                    addons={[
                      ...(serenityAddon ? ['serenity'] : []),
                      ...(extendedLicense ? ['extended_license'] : []),
                    ]}
                    cancelPath="/upsell-paiement?plan=pro"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 py-7 text-lg font-bold text-slate-900 shadow-xl shadow-cyan-500/20 transition-all hover:from-cyan-400 hover:to-emerald-400 hover:shadow-cyan-500/30 disabled:opacity-60 disabled:hover:scale-100"
                  >
                    <>
                      <CreditCard className="w-5 h-5" />
                      Payer {currentAmount}€ par carte
                      <ArrowRight className="w-5 h-5" />
                    </>
                  </StripeCheckoutButton>
                ) : (
                  <a 
                    href={currentPaypalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handlePayPalClick}
                    className="block"
                  >
                    <Button size="lg" className="w-full py-7 text-lg font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-900 rounded-xl shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Payer {currentAmount}€ - PayPal ou CB
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                )}
                <p className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-3">
                  <span className="flex items-center gap-1"><Lock className="w-3 h-3" />SSL 256-bit</span>
                  <span>•</span>
                  <span>{selectedPayment === 'full' ? 'Carte bancaire via Stripe' : 'PayPal ou carte bancaire'}</span>
                </p>
                {selectedPayment !== 'full' && (
                  <p className="text-center text-[11px] text-muted-foreground">
                    Le paiement en plusieurs fois est traité via PayPal.
                  </p>
                )}
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
                    <p className="text-emerald-300 font-semibold text-sm">Garantie 30 jours - Satisfait ou remboursé</p>
                    <p className="text-emerald-400/70 text-xs mt-1">
                      Testez Ebookstudio Pro V2 pendant 30 jours. Si vous ne publiez pas votre premier ebook, remboursement intégral. Aucune question posée.
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
