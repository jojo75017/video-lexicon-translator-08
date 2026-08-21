import { useState, useEffect } from "react";
import Helmet from "react-helmet";
import { trackLeadMagnetDownload, trackCTAClick, trackFormSubmit } from "@/utils/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Gift, Mail, Loader2, Sparkles, CheckCircle2, BookOpen, TrendingUp, Target,
  Download, PenLine, ShieldCheck, Clock, Star, ChevronDown,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useReferralTracking, getStoredRefCode } from "@/hooks/useReferralTracking";

/** Cadeau de bienvenue : 10 niches + kit de démarrage V3 (la vidéo reste réservée aux abonnés). */
const KIT_PDF_URL = "/kit-demarrage-ebookstudio-v3.pdf";
/** Fin de l'offre accès à vie 47 € */
const OFFER_END = new Date("2026-08-31T23:59:59+02:00");

const useCountdown = (target: Date) => {
  const [left, setLeft] = useState(() => target.getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setLeft(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  if (left <= 0) return null;
  const days = Math.floor(left / 86400000);
  const hours = Math.floor((left % 86400000) / 3600000);
  const minutes = Math.floor((left % 3600000) / 60000);
  return { days, hours, minutes };
};

const FAQ = [
  {
    q: "C'est vraiment gratuit ?",
    a: "Oui. Les 10 niches et le kit de démarrage sont offerts, sans carte bancaire et sans engagement. Vous pouvez vous désabonner en un clic.",
  },
  {
    q: "Je n'ai jamais écrit un livre, c'est pour moi ?",
    a: "C'est fait exactement pour ça. Vous donnez votre idée, le studio construit le sommaire avec vous, écrit les chapitres, corrige le texte et prépare le fichier prêt pour Amazon KDP.",
  },
  {
    q: "Qu'est-ce que je reçois exactement ?",
    a: "Les 10 niches Amazon analysées arrivent par email, et le kit de démarrage (16 pages illustrées) se télécharge immédiatement après votre inscription.",
  },
  {
    q: "Et si je veux aller plus loin ?",
    a: "Vous pouvez écrire votre premier chapitre gratuitement, puis choisir une formule si le résultat vous convainc. Aucune obligation.",
  },
];

const CadeauPage = () => {
  useReferralTracking();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const countdown = useCountdown(OFFER_END);

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
        body: {
          email: emailLower,
          lead_magnet: "niches10_kit",
          landing_url: window.location.href,
          ref_code: getStoredRefCode() || undefined,
        },
      });
      if (error) throw error;
      trackLeadMagnetDownload("niches10_kit");
      trackFormSubmit("cadeau_guide", emailLower);
      setIsSuccess(true);
      toast.success("🎁 Vos deux cadeaux arrivent dans votre boîte mail !");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erreur, réessayez");
    } finally {
      setIsSubmitting(false);
    }
  };

  const head = (
    <Helmet>
      <title>10 niches Amazon KDP + kit de démarrage offerts | Ebookstudio</title>
      <meta
        name="description"
        content="Recevez gratuitement 10 niches Amazon KDP à fort potentiel et le kit de démarrage Ebookstudio V3. Sans carte bancaire, désabonnement en 1 clic."
      />
      <link rel="canonical" href="https://ebookstudio.fr/cadeau" />
    </Helmet>
  );

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-emerald-950 to-background flex items-center justify-center p-4">
        {head}
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
            onClick={() => trackCTAClick("kit_demarrage_pdf", "cadeau_merci")}
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
              onClick={() => trackCTAClick("essai_chapitre_gratuit", "cadeau_merci")}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 font-semibold text-white transition hover:brightness-110"
            >
              <PenLine className="h-5 w-5" />
              Écrire mon premier chapitre gratuitement
            </a>
          </div>

          {countdown && (
            <div className="rounded-2xl border border-[#c9a84c]/40 bg-[#c9a84c]/10 p-5 text-left">
              <p className="flex items-center gap-2 text-sm font-semibold text-[#e7cf8c]">
                <Clock className="h-4 w-4" />
                Accès à vie 47 € — se termine le 31 août
              </p>
              <p className="mt-1 text-sm text-gray-300">
                Il reste {countdown.days} j {countdown.hours} h {countdown.minutes} min. Après cette date,
                l'accès passe en abonnement mensuel uniquement.
              </p>
              <a
                href="/commander"
                onClick={() => trackCTAClick("offre_47_cadeau_merci", "cadeau_merci")}
                className="mt-3 inline-block text-sm font-semibold text-[#e7cf8c] underline hover:text-white"
              >
                Voir l'accès à vie à 47 € →
              </a>
            </div>
          )}

          <a href="/v3/forfaits" className="inline-block text-emerald-400 hover:text-emerald-300 underline text-sm">
            Voir les formules (Plume 27 € · Édition 47 € · Studio Pro 97 €) →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-emerald-950 to-background px-4 py-10 pb-28 md:pb-10">
      {head}
      <div className="mx-auto max-w-lg space-y-8">
        {/* Header */}
        <header className="text-center space-y-4">
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
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-200">
            <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-emerald-400" /> Sans carte bancaire</span>
            <span className="flex items-center gap-1"><Download className="h-4 w-4 text-emerald-400" /> Kit dispo immédiatement</span>
            <span className="flex items-center gap-1"><Star className="h-4 w-4 text-[#e7cf8c]" /> Désabonnement en 1 clic</span>
          </div>
        </header>

        {countdown && (
          <div className="rounded-xl border border-[#c9a84c]/40 bg-[#c9a84c]/10 px-4 py-3 text-center text-sm text-[#e7cf8c]">
            <Clock className="mr-1 inline h-4 w-4" />
            Offre accès à vie 47 € jusqu'au 31 août — il reste {countdown.days} j {countdown.hours} h {countdown.minutes} min
          </div>
        )}

        {/* What's included */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
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
        </section>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="space-y-4" id="form-cadeau">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-lg rounded-xl"
              disabled={isSubmitting}
              autoComplete="email"
              aria-label="Votre adresse email"
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

        {/* Étapes après inscription */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-white font-semibold">Ce qui se passe ensuite</h2>
          <ol className="mt-3 space-y-3 text-sm text-gray-100">
            {[
              "Vous recevez vos 10 niches par email et le kit se télécharge tout de suite.",
              "Vous écrivez votre premier chapitre gratuitement, sur votre propre idée.",
              "Si le résultat vous plaît, vous continuez le livre jusqu'à la publication Amazon.",
            ].map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section className="space-y-2">
          <h2 className="text-white font-semibold">Questions fréquentes</h2>
          {FAQ.map((item, i) => (
            <div key={item.q} className="rounded-xl border border-white/10 bg-white/5">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-white"
                aria-expanded={openFaq === i}
              >
                {item.q}
                <ChevronDown className={`h-4 w-4 shrink-0 transition ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && (
                <p className="px-4 pb-4 text-sm leading-relaxed text-gray-200">{item.a}</p>
              )}
            </div>
          ))}
        </section>
      </div>

      {/* CTA collant mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background/95 p-3 backdrop-blur md:hidden">
        <a
          href="#form-cadeau"
          onClick={() => trackCTAClick("sticky_cadeau", "cadeau")}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-semibold text-white"
        >
          <Gift className="h-5 w-5" />
          Recevoir mes 2 cadeaux
        </a>
      </div>
    </div>
  );
};

export default CadeauPage;
