import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, Mail, CreditCard, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const PaiementManuelPage = () => {
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const paymentInfo = {
    paypalMe: "https://paypal.me/VotreNom/37", // À remplacer par votre lien PayPal.me
    iban: "FR76 XXXX XXXX XXXX XXXX XXXX XXX", // À remplacer par votre IBAN
    price: "37€",
    product: "EbookStudio Pro - Accès à Vie"
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copié !`);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = () => {
    if (!email) {
      toast.error("Veuillez entrer votre email");
      return;
    }
    
    const subject = encodeURIComponent("Nouveau paiement EbookStudio Pro");
    const body = encodeURIComponent(`Bonjour,

Je viens d'effectuer un paiement de 37€ pour EbookStudio Pro.

Mon email : ${email}

Merci de m'envoyer mon code d'accès.

Cordialement`);
    
    window.open(`mailto:boubetgeorges@gmail.com?subject=${subject}&body=${body}`, '_blank');
    toast.success("Email préparé ! Envoyez-le après votre paiement.");
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
                <p className="font-semibold text-violet-900">{paymentInfo.product}</p>
                <p className="text-sm text-violet-600">Accès illimité à vie</p>
              </div>
              <Badge className="text-xl bg-emerald-500 hover:bg-emerald-600">{paymentInfo.price}</Badge>
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

            {/* Étape 2: Paiement */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="bg-violet-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                Effectuez votre paiement de {paymentInfo.price}
              </h3>

              {/* PayPal */}
              <a 
                href={paymentInfo.paypalMe}
                target="_blank"
                rel="noopener noreferrer"
                className="block border-2 border-blue-200 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-700">💳 Payer avec PayPal</p>
                      <p className="text-sm text-blue-600">Cliquez ici pour payer {paymentInfo.price} directement</p>
                    </div>
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
                Confirmez votre paiement
              </h3>
              <Button 
                onClick={handleSubmit} 
                className="w-full bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-700 hover:to-emerald-700"
                size="lg"
              >
                <Mail className="w-5 h-5 mr-2" />
                Envoyer ma confirmation
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
