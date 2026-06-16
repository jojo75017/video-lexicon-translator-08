import { useState, useEffect } from "react";
import { trackLeadMagnetDownload, trackCTAClick, trackFormSubmit } from "@/utils/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calendar, Mail, Loader2, Sparkles, CheckCircle2, Clock,
  Video, Users, BookOpen, Rocket,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const WebinairePage = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    document.title = "Webinaire gratuit : publiez votre 1er ebook en 7 jours | EbookStudio";
  }, []);


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
        body: { email: emailLower, first_name: firstName.trim() || null },
      });
      trackLeadMagnetDownload("webinaire_publier_ebook_7j");
      trackFormSubmit("webinaire_inscription", emailLower);
      setIsSuccess(true);
      toast.success("✅ Inscription confirmée ! Vérifiez votre boîte mail.");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erreur, réessayez");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Vous êtes inscrit ! 🎉</h1>
          <p className="text-muted-foreground text-lg">
            Vous recevrez le lien d'accès et un rappel par email. En attendant, découvrez l'outil :
          </p>
          <div className="space-y-3 mt-6">
            <a
              href="/demo"
              onClick={() => trackCTAClick("webinaire_success_demo", "/demo")}
              className="block w-full py-4 px-6 bg-primary hover:opacity-90 text-primary-foreground font-semibold text-lg rounded-xl text-center transition-all"
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Essayer le générateur gratuitement
              </span>
            </a>
            <a href="/offres" className="inline-block text-primary hover:underline text-sm">
              Voir toutes les offres →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Webinaire gratuit : publiez votre 1er ebook en 7 jours | EbookStudio</title>
        <meta
          name="description"
          content="Webinaire gratuit en ligne : la méthode pas-à-pas pour publier votre premier ebook rentable sur Amazon KDP en 7 jours, avec l'IA. Inscription gratuite."
        />
        <link rel="canonical" href="https://ebookstudio.fr/webinaire" />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: pitch */}
          <div className="space-y-6">
            <Badge className="bg-primary/10 text-primary border-primary/20">
              🔴 Webinaire en ligne — 100% gratuit
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
              Publiez votre 1<sup>er</sup> ebook rentable en{" "}
              <span className="text-primary">7 jours</span> grâce à l'IA
            </h1>
            <p className="text-muted-foreground text-lg">
              En 45 minutes, je vous montre la méthode exacte que j'utilise pour publier
              des livres sur Amazon KDP — sans écrire pendant des semaines et pour ~0,30€ par livre.
            </p>

            <ul className="space-y-3">
              {[
                { icon: Video, text: "Démonstration en direct du workflow complet" },
                { icon: BookOpen, text: "Comment trouver une niche rentable (données Amazon réelles)" },
                { icon: Rocket, text: "Le plan d'action pour publier en 7 jours" },
                { icon: Users, text: "Session de questions / réponses en direct" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground/90">{text}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary" /> Sessions chaque semaine
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" /> 45 min + Q/R
              </span>
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Réservez votre place</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Places limitées — recevez le lien d'accès par email.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Votre prénom (optionnel)"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="h-12"
                disabled={isSubmitting}
              />
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12"
                  disabled={isSubmitting}
                  required
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-base font-semibold">
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Je réserve ma place gratuite
                  </>
                )}
              </Button>
              <p className="text-center text-muted-foreground text-xs">
                🔒 Vos données sont protégées. Désinscription en 1 clic.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebinairePage;
