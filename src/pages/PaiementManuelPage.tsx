import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, CreditCard, ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useVipAvailability } from "@/hooks/useVipAvailability";

const BASE_PRICE = 67;
const SERENITY_PRICE = 30;

const buildPaypalLink = (amount: number, label: string) =>
  `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=boubetgeorges@gmail.com&amount=${amount}&currency_code=EUR&item_name=${encodeURIComponent(label)}`;

const PaiementManuelPage = () => {
  const [email, setEmail] = useState("");
  const [serenityAddon, setSerenityAddon] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isVipAvailable, isLoading: vipLoading } = useVipAvailability();

  // Rediriger si les places VIP sont épuisées
  useEffect(() => {
    if (!vipLoading && isVipAvailable === false) {
      toast.info("Le paiement manuel n'est plus disponible. Retrouvez l'offre à 67€ sur la page de paiement.");
      navigate('/upsell-paiement?plan=pro');
    }
  }, [vipLoading, isVipAvailable, navigate]);

  const totalPrice = BASE_PRICE + (serenityAddon ? SERENITY_PRICE : 0);
  const itemName = serenityAddon
    ? "EbookStudio Pro Lifetime + Pack Sérénité"
    : "EbookStudio Pro - Acces a Vie";

  const paymentInfo = {
    price: String(totalPrice),
    name: "EbookStudio Pro - Accès à Vie",
    description: "Offre de lancement • Accès complet à vie",
    paypalLink: buildPaypalLink(totalPrice, itemName),
    iban: "FR76 XXXX XXXX XXXX XXXX XXXX XXX",
  };

  // Afficher un loader pendant la vérification
  if (vipLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copié !`);
    setTimeout(() => setCopied(null), 2000);
  };

  const handlePayPalClick = () => {
    // Sauvegarder l'email (sessionStorage + localStorage backup pour résister aux fermetures d'onglet)
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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/offres" className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-800 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>

        <Card className="border-2 border-violet-200 shadow-xl">
          <CardHeader className="text-center bg-gradient-to-r from-violet-600 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">💳 Paiement Sécurisé</CardTitle>
            <p className="text-violet-100">Accès instantané après confirmation</p>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Récapitulatif */}
            <div className="bg-violet-50 rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-violet-900">{paymentInfo.name}</p>
                <p className="text-sm text-violet-600">{paymentInfo.description}</p>
              </div>
              <Badge className="text-xl bg-emerald-500 hover:bg-emerald-600">{paymentInfo.price}€</Badge>
            </div>

            {/* Étape 1: Email */}
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="bg-violet-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                Votre email
              </h3>
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-violet-200"
              />
              <p className="text-xs text-muted-foreground">Vous recevrez votre code d'accès à cette adresse</p>
            </div>

            {/* Add-on Pack Sérénité */}
            <label
              className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                serenityAddon
                  ? 'border-amber-400 bg-amber-50 shadow-md'
                  : 'border-violet-100 hover:border-amber-300 bg-white'
              }`}
            >
              <input
                type="checkbox"
                checked={serenityAddon}
                onChange={(e) => setSerenityAddon(e.target.checked)}
                className="mt-1 w-5 h-5 accent-amber-500 cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold text-violet-900 text-sm">
                      Ajouter le Pack Sérénité
                    </span>
                    <Badge className="bg-amber-100 text-amber-700 border border-amber-300 text-[10px]">
                      OPTIONNEL
                    </Badge>
                  </div>
                  <span className="text-amber-700 font-bold">+{SERENITY_PRICE}€</span>
                </div>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-amber-500 flex-shrink-0" />Session Zoom 1-à-1 (30 min) avec un expert</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-amber-500 flex-shrink-0" />Support prioritaire (réponse sous 24h)</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-amber-500 flex-shrink-0" />Audit de votre 1er ebook avant publication</li>
                </ul>
              </div>
            </label>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="bg-violet-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                Effectuez votre paiement de {paymentInfo.price}€

              </h3>

              {/* PayPal */}
              <a 
                href={paymentInfo.paypalLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handlePayPalClick}
                className="block border-2 border-blue-300 rounded-lg p-5 hover:border-blue-500 hover:bg-blue-50 transition-all bg-gradient-to-r from-blue-50 to-white"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500 p-3 rounded-xl">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-blue-700 text-lg">💳 Payer {paymentInfo.price}€ avec PayPal</p>
                    <p className="text-sm text-blue-600">Paiement sécurisé - PayPal ou carte bancaire</p>
                  </div>
                </div>
              </a>

              {/* Virement */}
              <div className="border rounded-lg p-4 hover:border-violet-400 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                      <CreditCard className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium">Virement bancaire</p>
                      <p className="text-sm text-muted-foreground font-mono">{paymentInfo.iban}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(paymentInfo.iban, "IBAN")}
                    type="button"
                  >
                    {copied === "IBAN" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Étape 3: Confirmation */}
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="bg-violet-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                Après paiement, confirmez ici
              </h3>
              <Button 
                onClick={goToConfirmation} 
                className="w-full bg-gradient-to-r from-emerald-600 to-violet-600 hover:from-emerald-700 hover:to-violet-700"
                size="lg"
                type="button"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                J'ai payé, confirmer mon achat
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Vous recevrez votre code d'accès sous 24h maximum (souvent en quelques minutes)
              </p>
            </div>

            {/* Garantie */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
              <p className="text-emerald-800 font-medium">✅ Garantie 30 jours satisfait ou remboursé</p>
              <p className="text-sm text-emerald-600">Si vous n'êtes pas satisfait, remboursement intégral sans question</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaiementManuelPage;
