import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { AdminPanelNav } from '@/components/admin/AdminPanelNav';

const DEMO_LINK = "https://ebookstudio.fr/demo";
const OFFRES_LINK = "https://ebookstudio.fr/offres";

interface EmailStep {
  step: number;
  dayOffset: number;
  dayLabel: string;
  subject: string;
  preheader: string;
  strategy: string;
  strategyColor: string;
  body: string;
}

const TUNNEL = "https://ebookstudio-2026-offre-47.landaa.io/f/tunnel-de-vente/page-de-vente-copy";

const EMAIL_SEQUENCE: EmailStep[] = [
  {
    step: 1, dayOffset: 0, dayLabel: "16 oct. matin",
    subject: "C'est ouvert : votre maison d'édition IA vous attend",
    preheader: "Les portes de la nouvelle offre EbookStudio viennent de s'ouvrir.",
    strategy: "OUVERTURE", strategyColor: "bg-primary/10 text-primary border-primary/30",
    body: `Bonjour [PRÉNOM],

Ça y est : la nouvelle version d'EbookStudio est ouverte depuis ce matin.

Imaginez : vous posez votre idée, et une équipe de spécialistes IA vous accompagne jusqu'au livre fini — sommaire, chapitres, correction, couverture et fiche Amazon KDP.

• Écrire un livre complet, chapitre par chapitre
• Une couverture prête pour Amazon
• Une correction éditoriale qui chasse les répétitions
• Tout en français, sans jargon

J'ai préparé une page qui vous montre tout, en quelques minutes.

**👉 Découvrir la nouvelle offre** : ${TUNNEL}

Georges Boubet
Fondateur d'EbookStudio`,
  },
  {
    step: 2, dayOffset: 3, dayLabel: "19 octobre",
    subject: "Le livre que vous repoussez peut exister ce mois-ci",
    preheader: "Ce qui vous bloque n'est pas le talent. C'est la méthode.",
    strategy: "ÉMOTION", strategyColor: "bg-primary/10 text-primary border-primary/30",
    body: `Bonjour [PRÉNOM],

Combien de fois vous êtes-vous dit « un jour, j'écrirai ce livre » ?

Ce qui bloque, presque toujours, ce n'est pas le talent : c'est la page blanche, le plan qui n'arrive pas, la peur de mal faire.

EbookStudio prend tout ça en charge, étape par étape. Vous gardez la main sur votre histoire ; l'équipe IA fait le travail lourd.

**👉 Voir comment ça marche** : ${TUNNEL}

Georges Boubet
Fondateur d'EbookStudio`,
  },
  {
    step: 3, dayOffset: 4, dayLabel: "20 octobre",
    subject: "Vous n'avez pas encore regardé ?",
    preheader: "Deux minutes suffisent pour savoir si c'est pour vous.",
    strategy: "RAPPEL", strategyColor: "bg-primary/10 text-primary border-primary/30",
    body: `Bonjour [PRÉNOM],

Je vous écris une dernière fois à ce sujet, promis.

La nouvelle offre EbookStudio est ouverte, et beaucoup d'auteurs ont déjà commencé leur livre.

Si une idée dort dans un coin de votre tête, c'est peut-être le bon moment. Un clic pour voir, sans aucun engagement.

**👉 Je regarde maintenant** : ${TUNNEL}

Une question ? Répondez simplement à cet email : je lis tout personnellement.

Georges Boubet
Fondateur d'EbookStudio`,
  },
];

function renderEmailHtml(body: string): string {
  return body
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>")
    .replace(/→/g, "→")
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#D4A017;text-decoration:underline;">$1</a>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

const EmailPreviewPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const email = EMAIL_SEQUENCE[activeStep];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <AdminPanelNav />

        {/* Header */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
              <Mail className="w-7 h-7 text-primary" />
              Emails du tunnel du 16 octobre
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Les 3 nouveaux emails — un seul bouton vers le tunnel. Les anciens emails ont été retirés.</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {EMAIL_SEQUENCE.map((e, i) => (
            <button
              key={e.step}
              onClick={() => setActiveStep(i)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                activeStep === i
                  ? "bg-primary/10 border-primary/50 text-primary"
                  : "bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                activeStep === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {e.step}
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold">{e.dayLabel}</div>
                <div className="text-[10px] opacity-70">{e.strategy}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Email Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Meta info */}
          <div className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-foreground text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Détails de l'email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Étape</span>
                  <p className="text-foreground font-semibold">{email.step} / {EMAIL_SEQUENCE.length}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Envoi</span>
                  <p className="text-foreground font-semibold">{email.dayLabel}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Stratégie</span>
                  <div className="mt-1">
                    <Badge className={email.strategyColor}>{email.strategy}</Badge>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Objet</span>
                  <p className="text-foreground font-medium text-xs mt-1">{email.subject}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Pré-header</span>
                  <p className="text-muted-foreground text-xs mt-1 italic">{email.preheader}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Expéditeur</span>
                  <p className="text-foreground text-xs mt-1">Georges Boubet &lt;noreply@ebookstudio.fr&gt;</p>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={activeStep === 0}
                onClick={() => setActiveStep(activeStep - 1)}
                className="flex-1"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={activeStep === EMAIL_SEQUENCE.length - 1}
                onClick={() => setActiveStep(activeStep + 1)}
                className="flex-1"
              >
                Suivant <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Right: Email render */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-gray-200 overflow-hidden">
              {/* Email header bar */}
              <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 space-y-1">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">De :</span>
                  Georges Boubet &lt;noreply@ebookstudio.fr&gt;
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">Objet :</span>
                  <span className="text-gray-900 font-medium">{email.subject}</span>
                </div>
                <div className="text-[10px] text-gray-400 italic">{email.preheader}</div>
              </div>
              {/* Email body */}
              <div className="p-6" style={{ borderTop: "3px solid #D4A017" }}>
                <div
                  className="text-gray-800 text-sm leading-relaxed"
                  style={{ fontFamily: "Arial, sans-serif" }}
                  dangerouslySetInnerHTML={{ __html: renderEmailHtml(email.body) }}
                />
              </div>
              {/* Email footer */}
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                <p className="text-[11px] text-gray-400">
                  Vous recevez cet email car vous avez manifesté un intérêt pour EbookStudio.<br />
                  <span className="text-amber-600 underline cursor-pointer">Voir l'offre</span> · <span className="text-amber-600 underline cursor-pointer">Tester la démo</span><br />
                  Pour ne plus recevoir ces emails, répondez "STOP" à cet email.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Summary table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-sm">📋 Récapitulatif de la séquence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-2 px-3">Étape</th>
                    <th className="text-left py-2 px-3">Jour</th>
                    <th className="text-left py-2 px-3">Stratégie</th>
                    <th className="text-left py-2 px-3">Objet</th>
                  </tr>
                </thead>
                <tbody>
                  {EMAIL_SEQUENCE.map((e, i) => (
                    <tr
                      key={e.step}
                      onClick={() => setActiveStep(i)}
                      className={`border-b border-border/50 cursor-pointer transition-colors ${
                        activeStep === i ? "bg-primary/5" : "hover:bg-muted/50"
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          activeStep === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          {e.step}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-foreground font-semibold">{e.dayLabel}</td>
                      <td className="py-2.5 px-3">
                        <Badge className={`text-[10px] ${e.strategyColor}`}>{e.strategy}</Badge>
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground text-xs">{e.subject}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailPreviewPage;
