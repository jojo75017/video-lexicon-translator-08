import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Crown,
  Eye,
  Mail,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

const PRICE = 47;
const NORMAL_PRICE = 197;
const SEATS = 10;

const PAYPAL_LINK = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=boubetgeorges@gmail.com&amount=${PRICE}&currency_code=EUR&item_name=${encodeURIComponent(
  "Coaching VIP 30 jours - EbookStudio"
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

const CoachingVipPage = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#232F3E] py-10 px-4">
      <Helmet>
        <title>Coaching VIP 30 jours — 10 places à 47€ | EbookStudio</title>
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
        <div className="text-center mb-10">
          <Badge className="bg-[#FF9E2D]/15 text-[#FF9E2D] border border-[#FF9E2D]/40 mb-4 font-bold">
            <Crown className="w-3 h-3 mr-1" />
            ACCÈS PRIVÉ — 10 PLACES SEULEMENT
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
            Tu fais partie des personnes
            <br />
            que je surveille de près{" "}
            <span className="inline-block">😏</span>
          </h1>
          <p className="text-lg text-[#232F3E]/70 max-w-2xl mx-auto">
            Pas par hasard. Parce que tu passes à l'action.
            <br />
            Et ça, ça change tout.
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
            ⚠️ {SEATS} PLACES MAXIMUM — UNE FOIS REMPLI, JE FERME
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
              Paiement unique • 30 jours d'accompagnement
            </p>

            <a href={PAYPAL_LINK} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="w-full md:w-auto px-10 py-6 text-lg font-black bg-[#FF9E2D] hover:bg-[#FF8C00] text-[#232F3E] rounded-xl shadow-lg"
              >
                Je réserve ma place — {PRICE}€
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
            <p className="text-xs text-[#232F3E]/60 mt-4 flex items-center justify-center gap-2">
              <ShieldCheck className="w-3 h-3" />
              Paiement sécurisé PayPal (carte bancaire acceptée)
            </p>
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
            <a href={PAYPAL_LINK} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="bg-[#008296] hover:bg-[#006d7e] text-white font-black rounded-xl px-8"
              >
                <Check className="w-5 h-5 mr-2" />
                Je réserve ma place ({PRICE}€)
              </Button>
            </a>
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
    </div>
  );
};

export default CoachingVipPage;
