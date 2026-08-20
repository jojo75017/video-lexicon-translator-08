import { useState } from "react";
import { trackLeadMagnetDownload, trackCTAClick, trackFormSubmit } from "@/utils/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Gift, Mail, Loader2, Sparkles, CheckCircle2, BookOpen, TrendingUp, Target, Download, PenLine } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/** Cadeau de bienvenue : 10 niches + kit de démarrage V3 (la vidéo reste réservée aux abonnés). */
const KIT_PDF_URL = "/kit-demarrage-ebookstudio-v3.pdf";

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
      const { error } = await supabase.functions.invoke("funnel-capture-lead", {
        body: { email: emailLower, lead_magnet: "niches10_kit", landing_url: window.location.href },
      });
      if (error) throw error;
      trackLeadMagnetDownload("niches10_kit");
      trackFormSubmit('cadeau_guide', emailLower);
      setIsSuccess(true);
      toast.success("🎁 Vos deux cadeaux arrivent dans votre boîte mail !");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erreur, réessayez");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-emerald-950 to-background flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">C'est à vous 🎉</h1>
          <p className="text-gray-300 text-lg">
            Vos 10 niches partent par email. Le kit de démarrage se télécharge tout de suite ci-dessous.
          </p>

          <a
            href={KIT_PDF_URL}
            download
            onClick={() => trackCTAClick('kit_demarrage_pdf', 'cadeau_merci')}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c9a84c] px-6 py-4 text-lg font-semibold text-[#1a1a1a] transition hover:brightness-110"
          >
            <Download className="h-5 w-5" />
            Télécharger le kit de démarrage (PDF)
          </a>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left">
            <p className="text-sm font-semibold text-white">Et maintenant, la suite logique</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-300">
              Écrivez le premier chapitre de votre livre gratuitement, sans carte bancaire.
              Vous verrez de vos yeux ce que donne le studio sur votre idée.
            </p>
            <a
              href="/essai"
              onClick={() => trackCTAClick('essai_chapitre_gratuit', 'cadeau_merci')}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 font-semibold text-white transition hover:brightness-110"
            >
              <PenLine className="h-5 w-5" />
              Écrire mon premier chapitre gratuitement
            </a>
          </div>

          <a href="/v3/forfaits" className="inline-block text-emerald-400 hover:text-emerald-300 underline text-sm">
            Voir les formules (Plume 27 € · Édition 47 € · Studio Pro 97 €) →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-emerald-950 to-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 to-[#c9a84c] rounded-2xl flex items-center justify-center">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            🎁 Vos 2 cadeaux : 10 niches KDP + le kit de démarrage V3
          </h1>
          <p className="text-gray-300 text-lg">
            Gratuit, sans carte bancaire. Vous voyez de vos yeux comment un livre se construit
            jusqu'à la publication Amazon.
          </p>
        </div>

        {/* What's included */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#e7cf8c]" />
            Ce que vous recevez :
          </h2>
          <div className="space-y-3">
            {[
              { icon: Target, text: "10 niches Amazon à fort potentiel, analysées", badge: "Cadeau 1" },
              { icon: BookOpen, text: "Kit de démarrage V3 : 16 pages illustrées", badge: "Cadeau 2" },
              { icon: TrendingUp, text: "Checklist de lancement 7 jours incluse", badge: "Bonus" },
            ].map(({ icon: Icon, text, badge }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-emerald-300" />
                </div>
                <span className="text-gray-200 flex-1">{text}</span>
                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-200 border-primary/20 text-xs">
                  {badge}
                </Badge>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400">
            La vidéo de présentation complète de la V3 (7 minutes) est réservée aux abonnés.
          </p>
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
            className="w-full h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-lg rounded-xl font-semibold"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Gift className="w-5 h-5 mr-2" />
                Recevoir mes 2 cadeaux gratuitement
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
