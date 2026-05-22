import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Crown,
  Eye,
  Loader2,
  Mail,
  MessageCircle,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
  X as XIcon,
  CalendarDays,
} from "lucide-react";
import { trackEvent } from "@/utils/analytics";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PRICE = 47;
const NORMAL_PRICE = 197;
const SEATS = 10;
const VIDEO_SRC = "/videos/coaching-vip-georges.mp4";

const PAYPAL_LINK = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=boubetgeorges@gmail.com&amount=${PRICE}&currency_code=EUR&item_name=${encodeURIComponent(
  "Coaching VIP 30 jours - Ebookstudio Pro V2"
)}`;

const inclusions = [
  {
    icon: Video,
    title: "3 sessions Zoom 1-à-1",
    desc: "Réparties sur 30 jours pour avancer concrètement sur ton business.",
  },
  {
    icon: Mail,
    title: "Accès à mon email perso",
    desc: "Tu m'écris quand tu veux pendant 30 jours, je réponds personnellement.",
  },
  {
    icon: Eye,
    title: "Audit de ton 1er ebook",
    desc: "Je relis et corrige ton contenu avant publication sur Amazon KDP.",
  },
  {
    icon: MessageCircle,
    title: "Conseils stratégiques",
    desc: "Niche, positionnement, tarification, marketing : on travaille ton projet en profondeur.",
  },
];

const weeks = [
  {
    n: 1,
    title: "Semaine 1 - Cadrage",
    desc: "Niche validée, angle unique, structure claire de ton ebook. On évite les erreurs qui font perdre 3 mois.",
  },
  {
    n: 2,
    title: "Semaine 2 - Production",
    desc: "Rédaction guidée + corrections du manuscrit. Tu avances sans bloquer, je relis et je corrige avec toi.",
  },
  {
    n: 3,
    title: "Semaine 3 - Packaging",
    desc: "Couverture qui vend, description Amazon optimisée, mots-clés KDP qui rapportent.",
  },
  {
    n: 4,
    title: "Semaine 4 - Lancement",
    desc: "Publication sur Amazon KDP + plan de lancement concret pour tes premières ventes.",
  },
];

const forYou = [
  "Tu as une idée d'ebook (même floue) et tu veux enfin la sortir.",
  "Tu as commencé un projet et tu n'arrives pas à le finir seul.",
  "Tu veux publier sur Amazon KDP sans perdre 6 mois à tâtonner.",
  "Tu es prêt(e) à appliquer, pas juste à consommer du contenu.",
];

const notForYou = [
  "Tu cherches une formation passive à regarder en mangeant.",
  "Tu n'as pas 2 à 3 heures par semaine à investir sur ton projet.",
  "Tu attends une recette magique sans rien faire.",
  "Tu n'es pas prêt(e) à recevoir des retours francs sur ton travail.",
];

const steps = [
  {
    n: 1,
    title: "Tu règles 47€ via PayPal",
    desc: "Paiement sécurisé avec ton compte PayPal ou ta carte bancaire.",
  },
  {
    n: 2,
    title: "Tu reçois un questionnaire",
    desc: "Pour que je prépare correctement notre 1ère session de coaching.",
  },
  {
    n: 3,
    title: "Je te contacte sous 24h",
    desc: "Pour fixer un RDV Zoom ou téléphonique selon ta préférence.",
  },
];

const faqs = [
  {
    q: "Et si je n'ai pas encore d'idée d'ebook ?",
    a: "Pas de souci. La 1ère session sert justement à ça : on creuse ton expérience, ta cible, et on sort 2 à 3 angles d'ebook que tu peux vraiment porter.",
  },
  {
    q: "Je débute totalement, c'est pour moi ?",
    a: "Oui, c'est même l'idéal. Mieux vaut être bien accompagné dès le départ que devoir corriger 6 mois d'erreurs. Je t'évite tous les pièges classiques.",
  },
  {
    q: "Combien de temps ça me demande par semaine ?",
    a: "Compte 2 à 3 heures par semaine en moyenne, plus la session Zoom. C'est compatible avec un job à côté, à condition de bloquer ces créneaux.",
  },
  {
    q: "Que se passe-t-il après le paiement ?",
    a: "Tu reçois immédiatement un email avec un court questionnaire. Sous 24h max, je te contacte personnellement pour caler notre première session Zoom.",
  },
  {
    q: "Et si finalement ça ne me convient pas ?",
    a: "Dis-le moi dès la 1ère session. Je préfère qu'on s'arrête tout de suite plutôt que de perdre du temps tous les deux. On reste corrects.",
  },
];

const handleVideoPlay = () => {
  trackEvent("coaching_video_play", {});
};

const CoachingVipPage = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(false);
  const [ctaLocation, setCtaLocation] = useState<string>("main_cta");

  const openCheckout = (location: string) => {
    setCtaLocation(location);
    trackEvent("coaching_paypal_click", { location });
    setOpen(true);
  };

  const submitAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      toast.error("Email invalide");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("funnel-create-order", {
        body: {
          email: cleanEmail,
          first_name: firstName.trim(),
          product_key: "coaching_vip",
          payment_method: "paypal",
        },
      });
      if (error) throw error;
      toast.success("Bonus envoyés par email ! Direction PayPal...");
      trackEvent("coaching_order_created", { location: ctaLocation });
      // Open PayPal in new tab
      window.open(PAYPAL_LINK, "_blank", "noopener,noreferrer");
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'enregistrement. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#232F3E] py-10 px-4">
      <Helmet>
        <title>Coaching VIP 30 jours - 10 places à 47€ | Ebookstudio Pro V2</title>
        <meta
          name="description"
          content="Accompagnement privé de 30 jours avec Georges Boubet : 3 sessions Zoom, email perso, audit ebook. 10 places seulement à 47€ au lieu de 197€."
        />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="max-w-3xl mx-auto">
        <Link
          to="/offres"
          className="inline-flex items-center gap-2 text-[#008296] hover:text-[#FF9E2D] transition-colors mb-6 text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux offres
        </Link>

        {/* HERO */}
        <div className="text-center mb-8">
          <Badge className="bg-[#FF9E2D]/15 text-[#FF9E2D] border border-[#FF9E2D]/40 mb-4 font-bold">
            <Crown className="w-3 h-3 mr-1" />
            ACCÈS PRIVÉ - 10 PLACES SEULEMENT
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
            Tu fais partie des personnes
            <br />
            que je surveille de près{" "}
            <span className="inline-block">😏</span>
          </h1>
          <p className="text-lg text-[#232F3E]/70 max-w-2xl mx-auto">
            En <strong>30 jours</strong>, on transforme ton projet d'ebook en livre
            <strong> publié et vendable</strong> sur Amazon KDP.
            <br />
            Avec moi, en privé, étape par étape.
          </p>
        </div>

        {/* VIDÉO HEYGEN */}
        <div className="mb-8">
          <div className="relative rounded-2xl overflow-hidden shadow-xl ring-2 ring-[#008296]/30 bg-black aspect-video">
            <video
              src={VIDEO_SRC}
              controls
              playsInline
              preload="metadata"
              poster=""
              onPlay={handleVideoPlay}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-center text-xs text-[#232F3E]/60 mt-2 flex items-center justify-center gap-1.5">
            <PlayCircle className="w-3.5 h-3.5 text-[#008296]" />
            1 min - regarde avant de réserver ta place
          </p>
        </div>

        {/* INTRO */}
        <Card className="mb-6 border-[#008296]/20 bg-white shadow-sm">
          <CardContent className="p-6 md:p-8 space-y-4 text-[15px] leading-relaxed">
            <p>
              Aujourd'hui, j'ouvre quelque chose que je ne proposerai pas
              publiquement.
            </p>
            <p className="font-bold text-[#008296]">
              👉 Un accompagnement privé, avec moi, pendant 30 jours.
            </p>
            <p>
              Pas une formation. Pas du contenu que tu consommes puis que tu
              oublies.
              <br />
              Un <strong>vrai accompagnement</strong> pour faire avancer{" "}
              <strong>TON business</strong>.
            </p>
          </CardContent>
        </Card>

        {/* INCLUSIONS */}
        <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#FF9E2D]" />
          Ce que tu obtiens concrètement
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {inclusions.map((item, i) => (
            <Card key={i} className="border-[#008296]/15 bg-white">
              <CardContent className="p-5">
                <div className="w-10 h-10 rounded-xl bg-[#008296]/10 flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-[#008296]" />
                </div>
                <h3 className="font-bold mb-1">{item.title}</h3>
                <p className="text-sm text-[#232F3E]/70">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* PLAN 30 JOURS */}
        <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-[#008296]" />
          Ton plan sur 30 jours
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {weeks.map((w) => (
            <Card key={w.n} className="border-[#008296]/15 bg-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#008296] to-[#FF9E2D]" />
              <CardContent className="p-5 pl-6">
                <div className="text-xs font-black text-[#008296] uppercase tracking-wider mb-1">
                  Semaine {w.n}
                </div>
                <h3 className="font-bold mb-1">{w.title.replace(/^Semaine \d+ - /, "")}</h3>
                <p className="text-sm text-[#232F3E]/70">{w.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* POUR QUI / PAS POUR QUI */}
        <h2 className="text-2xl font-black mb-4">C'est pour qui (et pas pour qui) ?</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="border-[#008296]/30 bg-[#008296]/5">
            <CardContent className="p-5">
              <h3 className="font-black text-[#008296] mb-3 flex items-center gap-2">
                <Check className="w-5 h-5" />
                C'est pour toi si...
              </h3>
              <ul className="space-y-2 text-sm">
                {forYou.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="w-4 h-4 text-[#008296] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-[#232F3E]/15 bg-[#232F3E]/[0.03]">
            <CardContent className="p-5">
              <h3 className="font-black text-[#232F3E]/70 mb-3 flex items-center gap-2">
                <XIcon className="w-5 h-5" />
                Ce n'est PAS pour toi si...
              </h3>
              <ul className="space-y-2 text-sm">
                {notForYou.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <XIcon className="w-4 h-4 text-[#232F3E]/50 flex-shrink-0 mt-0.5" />
                    <span className="text-[#232F3E]/75">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* HONNÊTETÉ PRIX */}
        <Card className="border-[#FF9E2D]/40 bg-gradient-to-br from-[#FFF5E6] to-white mb-8">
          <CardContent className="p-6 md:p-8 space-y-3 text-[15px] leading-relaxed">
            <h3 className="text-xl font-black flex items-center gap-2">
              <Users className="w-5 h-5 text-[#FF9E2D]" />
              Soyons honnêtes
            </h3>
            <p>
              Ce type d'accompagnement, je le propose normalement à{" "}
              <strong className="text-[#232F3E]">{NORMAL_PRICE}€</strong>. Et à
              ce prix-là, il part sans problème.
            </p>
            <p>
              Mais aujourd'hui, ce n'est pas le sujet.
              <br />
              👉 Je veux bosser avec des personnes <strong>motivées</strong>.
              <br />
              👉 Des gens qui <strong>appliquent</strong>.
              <br />
              👉 Des gens qui veulent vraiment des <strong>résultats</strong>.
            </p>
            <p className="font-bold text-[#008296]">
              Je préfère accompagner {SEATS} personnes sérieuses à {PRICE}€ que{" "}
              {SEATS} curieux à {NORMAL_PRICE}€ qui ne font rien.
            </p>
          </CardContent>
        </Card>

        {/* CTA PAYPAL */}
        <Card className="border-2 border-[#008296] shadow-xl mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-[#008296] to-[#00a3b4] text-white text-center py-3 text-sm font-bold tracking-wide">
            ⚠️ {SEATS} PLACES MAXIMUM - UNE FOIS REMPLI, JE FERME
          </div>
          <CardContent className="p-8 text-center bg-white">
            <p className="text-sm text-[#232F3E]/60 mb-1">Tarif unique</p>
            <div className="flex items-center justify-center gap-3 mb-1">
              <span className="text-2xl text-[#232F3E]/40 line-through font-bold">
                {NORMAL_PRICE}€
              </span>
              <span className="text-6xl font-black text-[#008296]">
                {PRICE}€
              </span>
            </div>
            <p className="text-xs text-[#232F3E]/60 mb-6">
              Paiement unique • 30 jours d'accompagnement • Réponse sous 24h
            </p>

            <Button
              size="lg"
              onClick={() => openCheckout("main_cta")}
              className="w-full md:w-auto px-10 py-6 text-lg font-black bg-[#FF9E2D] hover:bg-[#FF8C00] text-[#232F3E] rounded-xl shadow-lg"
            >
              Je réserve ma place - {PRICE}€
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-xs text-[#232F3E]/60 mt-4 flex items-center justify-center gap-2">
              <ShieldCheck className="w-3 h-3" />
              Paiement sécurisé PayPal (carte bancaire acceptée)
            </p>

            {/* Bonus inclus — envoi par email après commande */}
            <div className="mt-6 bg-gradient-to-r from-[#FF9E2D]/10 to-[#008296]/10 border-2 border-[#FF9E2D]/40 rounded-xl p-4 text-left">
              <p className="text-sm font-black text-[#232F3E] mb-2 flex items-center gap-2">
                🎁 Bonus inclus avec votre commande
              </p>
              <ul className="text-sm text-[#232F3E]/80 space-y-1.5 mb-3">
                <li className="flex gap-2"><span>✅</span><span><strong>Licence commerciale étendue</strong> — revendez vos ebooks sans limite</span></li>
                <li className="flex gap-2"><span>✅</span><span><strong>Guide des 10 niches KDP rentables 2026</strong> — mots-clés, exemples, prix conseillés</span></li>
              </ul>
              <p className="text-xs text-[#232F3E]/70 flex items-start gap-1.5 bg-white/60 rounded-lg p-2.5 border border-[#FF9E2D]/30">
                <span className="text-base leading-none">🔒</span>
                <span><strong>Liens d'accès envoyés par email dans les minutes suivant le paiement</strong> — réservés aux acheteurs uniquement (non publics).</span>
              </p>
            </div>

          </CardContent>
        </Card>

        {/* PROCESS */}
        <h2 className="text-2xl font-black mb-4">Comment ça se passe ?</h2>
        <div className="space-y-3 mb-8">
          {steps.map((s) => (
            <Card key={s.n} className="border-[#008296]/15 bg-white">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#008296] text-white flex items-center justify-center font-black flex-shrink-0">
                  {s.n}
                </div>
                <div>
                  <h3 className="font-bold mb-1">{s.title}</h3>
                  <p className="text-sm text-[#232F3E]/70">{s.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <h2 className="text-2xl font-black mb-4">Questions fréquentes</h2>
        <Card className="border-[#008296]/15 bg-white mb-8">
          <CardContent className="p-2 md:p-4">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left font-bold text-[#232F3E] hover:text-[#008296]">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#232F3E]/75 text-sm leading-relaxed">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* CTA FINAL */}
        <Card className="border-[#008296]/30 bg-[#008296]/5 mb-8">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-black mb-2">
              Prêt(e) à vraiment passer à l'action ?
            </h3>
            <p className="text-sm text-[#232F3E]/70 mb-5">
              {SEATS} places. Une fois rempli, je ferme et je n'ouvre plus
              avant longtemps.
            </p>
            <Button
              size="lg"
              onClick={() => openCheckout("final_cta")}
              className="bg-[#008296] hover:bg-[#006d7e] text-white font-black rounded-xl px-8"
            >
              <Check className="w-5 h-5 mr-2" />
              Je réserve ma place ({PRICE}€)
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-[#232F3E]/60">
          Une question ? Écris-moi à{" "}
          <a
            href="mailto:boubetgeorges@gmail.com"
            className="text-[#008296] underline hover:text-[#FF9E2D]"
          >
            boubetgeorges@gmail.com
          </a>
        </p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Réserve ta place — {PRICE}€</DialogTitle>
            <DialogDescription>
              Indique ton email : tes bonus (licence + 10 niches) te seront envoyés immédiatement, puis tu seras redirigé(e) vers PayPal pour finaliser le paiement.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitAndPay} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vip-firstname">Prénom</Label>
              <Input
                id="vip-firstname"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                maxLength={80}
                placeholder="Georges"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vip-email">Email *</Label>
              <Input
                id="vip-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                placeholder="ton@email.com"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF9E2D] hover:bg-[#FF8C00] text-[#232F3E] font-black py-6 text-base"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Recevoir mes bonus & payer {PRICE}€ sur PayPal</>
              )}
            </Button>
            <p className="text-xs text-center text-[#232F3E]/60 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3 h-3" /> Bonus envoyés avant le paiement • PayPal sécurisé
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoachingVipPage;
