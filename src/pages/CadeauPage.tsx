import { useState } from "react";
import { trackLeadMagnetDownload, trackCTAClick, trackFormSubmit } from "@/utils/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Gift, Mail, Loader2, Sparkles, CheckCircle2, BookOpen, TrendingUp, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CadeauPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Veuillez entrer un email valide");
      return;
    }

    setIsSubmitting(true);
    try {
      const emailLower = email.trim().toLowerCase();
      await supabase.functions.invoke("add-to-email-sequence", {
        body: { email: emailLower }
      });
      trackLeadMagnetDownload("10_niches_kdp_2026");
      trackFormSubmit('cadeau_guide', emailLower);
      setIsSuccess(true);
      toast.success("🎁 Votre guide arrive dans votre boîte mail !");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erreur, réessayez");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-violet-950 to-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">C'est envoyé ! 🎉</h1>
          <p className="text-gray-300 text-lg">
            Vérifiez votre boîte mail (et vos spams). Vous recevrez aussi des conseils exclusifs les jours suivants.
          </p>
          <div className="space-y-4 mt-6">
            <a
              href="/demo"
              className="block w-full py-4 px-6 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-semibold text-lg rounded-xl text-center transition-all"
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Essayer le générateur d'ebook gratuitement
              </span>
            </a>
            <a
              href="/offres"
              className="inline-block text-violet-400 hover:text-violet-300 underline text-sm"
            >
              Voir toutes nos offres →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-violet-950 to-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-violet-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            🎁 Guide GRATUIT : 10 Niches KDP Rentables en 2026
          </h1>
          <p className="text-gray-300 text-lg">
            Recevez immédiatement notre guide PDF exclusif + des conseils quotidiens pour réussir sur Amazon KDP.
          </p>
        </div>

        {/* What's included */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            Ce que vous recevez :
          </h2>
          <div className="space-y-3">
            {[
              { icon: BookOpen, text: "Guide PDF de 40+ pages", badge: "Immédiat" },
              { icon: Target, text: "10 niches rentables analysées", badge: "Exclusif" },
              { icon: TrendingUp, text: "Plan d'action étape par étape", badge: "Actionnable" },
            ].map(({ icon: Icon, text, badge }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-violet-400" />
                </div>
                <span className="text-gray-200 flex-1">{text}</span>
                <Badge variant="secondary" className="bg-violet-500/20 text-violet-300 border-primary/20 text-xs">
                  {badge}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-lg rounded-xl"
              disabled={isSubmitting}
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-lg rounded-xl font-semibold"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Gift className="w-5 h-5 mr-2" />
                Recevoir mon guide gratuit
              </>
            )}
          </Button>
          <p className="text-center text-gray-500 text-xs">
            🔒 Vos données sont protégées. Désabonnement en 1 clic.
          </p>
        </form>
      </div>
    </div>
  );
};

export default CadeauPage;
