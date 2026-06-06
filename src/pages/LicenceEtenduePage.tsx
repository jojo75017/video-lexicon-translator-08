import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Check, Sparkles, Briefcase, Users, TrendingUp, ShieldCheck, Lock, CreditCard } from "lucide-react";

const EXTENDED_PRICE = 67;

const PAYPAL_LINK = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=boubetgeorges@gmail.com&amount=${EXTENDED_PRICE}&currency_code=EUR&item_name=${encodeURIComponent("Ebookstudio Pro V2 - Licence Commerciale Etendue")}`;

const benefits = [
  { icon: Briefcase, title: "Créez pour vos clients", desc: "Réalisez des ebooks à la commande pour des clients tiers (entrepreneurs, coachs, marques)." },
  { icon: Users, title: "Usage freelance & agence", desc: "Utilisez Ebookstudio Pro V2 dans un cadre professionnel : freelance, agence, studio." },
  { icon: TrendingUp, title: "Projets illimités", desc: "Exploitez les contenus générés pour autant de projets commerciaux que vous le souhaitez." },
  { icon: Sparkles, title: "Revente autorisée", desc: "Revendez vos prestations incluant les contenus générés (ebooks, couvertures, audio)." },
];

const restrictions = [
  "Revente, partage ou mise à disposition du Service strictement interdite",
  "L'accès au Service reste personnel et non transférable",
  "Interdiction de proposer un outil concurrent basé sur Ebookstudio Pro V2",
];

const LicenceEtenduePage = () => {
  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/offres" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Retour aux offres
        </Link>

        {/* Hero */}
        <div className="text-center mb-10">
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-4">
            🚀 OPTION PRO / FREELANCE
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Passez à la Licence Étendue
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Débloquez l'usage commercial avancé : créez des ebooks pour vos clients,
            lancez votre activité freelance, multipliez vos revenus.
          </p>
        </div>

        {/* Comparison */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="border-border opacity-80">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Licence Commerciale</h3>
                <Badge variant="secondary">Inclus</Badge>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />Créer et vendre vos propres ebooks</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />Usage personnel professionnel</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />Publication KDP, Apple Books, etc.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-purple-500/40 bg-purple-950/10 shadow-xl shadow-purple-500/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-purple-300">Licence Étendue</h3>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">+67€</Badge>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2"><Sparkles className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" /><strong>Tout de la commerciale +</strong></li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />Créer pour des clients tiers</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />Usage freelance / agence</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />Projets commerciaux illimités</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />Revente de prestations autorisée</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Benefits */}
        <h2 className="text-2xl font-bold mb-4">Ce que vous débloquez</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {benefits.map((b, i) => (
            <Card key={i} className="border-border">
              <CardContent className="p-5">
                <b.icon className="w-6 h-6 text-purple-400 mb-3" />
                <h3 className="font-semibold mb-1">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <Card className="border-purple-500/40 bg-gradient-to-br from-purple-950/30 to-pink-950/20 mb-6">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">Supplément à la licence commerciale standard</p>
            <div className="text-5xl font-black mb-1">{EXTENDED_PRICE}€</div>
            <p className="text-xs text-muted-foreground mb-6">Paiement unique • À vie</p>

            <a href={PAYPAL_LINK} target="_blank" rel="noopener noreferrer" className="block">
              <Button size="lg" className="w-full md:w-auto px-10 py-6 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-xl">
                <CreditCard className="w-5 h-5 mr-2" />
                Débloquer la Licence Étendue - {EXTENDED_PRICE}€
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
            <p className="text-[11px] text-muted-foreground mt-3 flex items-center justify-center gap-3">
              <span className="flex items-center gap-1"><Lock className="w-3 h-3" />SSL 256-bit</span>
              <span>•</span>
              <span>PayPal ou carte bancaire</span>
            </p>
          </CardContent>
        </Card>

        {/* Restrictions */}
        <Card className="border-border bg-muted/30 mb-6">
          <CardContent className="p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Restrictions spécifiques
            </h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {restrictions.map((r, i) => (
                <li key={i}>• {r}</li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-3">
              Voir l'<Link to="/licence" className="text-primary underline">EULA complet (article 15)</Link> pour les détails juridiques.
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Vous avez déjà payé ? Envoyez votre preuve de paiement à{" "}
          <a href="mailto:tanboub75017@gmail.com" className="text-primary underline">tanboub75017@gmail.com</a>{" "}
          pour activer votre licence étendue sous 24h.
        </p>
      </div>
    </div>
  );
};

export default LicenceEtenduePage;
