import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Mail, Clock, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

const EMAIL_SEQUENCE: EmailStep[] = [
  {
    step: 1,
    dayOffset: 0,
    dayLabel: "J+0",
    subject: "📖 J'ai généré 150 pages en 47 minutes... voici comment",
    preheader: "Le secret des auteurs qui publient un livre par semaine sur Amazon",
    strategy: "CURIOSITÉ",
    strategyColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    body: `Bonjour [PRÉNOM],

Je vais être direct avec vous.

La semaine dernière, j'ai publié mon 36ème livre sur Amazon.
Pas en 3 mois. Pas en 3 semaines.

En 47 minutes.

150 pages. Structurées. Illustrées. Prêtes pour KDP.

Ce qui a changé ? J'ai construit un outil. Un vrai générateur d'ebooks propulsé par l'IA la plus avancée du marché.

🔥 EbookStudio Pro 2026 — L'usine à ebooks que j'utilise personnellement :

→ 300+ idées de titres par niche rentable
→ Plan complet généré en 30 secondes
→ Chapitres rédigés avec votre ton et votre style
→ Couvertures professionnelles en 1 clic
→ Export direct PDF/EPUB prêt pour Amazon KDP
→ Coût par ebook : environ 0,30€

👉 Testez gratuitement la démo : ${DEMO_LINK}

Pas de carte bancaire, pas d'engagement.

L'offre Fondateur à 67€ ne durera pas éternellement.

À vous de jouer,
Georges

P.S: Mon profil Amazon avec mes 35+ livres publiés : https://www.amazon.fr/Mr-Georges-Boubet/e/B0CGVLHNX7`,
  },
  {
    step: 2,
    dayOffset: 2,
    dayLabel: "J+2",
    subject: "⚠️ Les 3 erreurs qui tuent 90% des auteurs KDP",
    preheader: "Erreur #2 est celle que TOUT LE MONDE fait...",
    strategy: "DOULEUR / SOLUTION",
    strategyColor: "bg-red-500/20 text-red-400 border-red-500/30",
    body: `[PRÉNOM],

Savez-vous pourquoi 90% des gens qui veulent publier sur Amazon... n'y arrivent jamais ?

❌ ERREUR #1 : Écrire sans plan — abandon garanti à la page 12.
❌ ERREUR #2 : Passer 3 semaines sur un seul livre — pendant que d'autres en publient 5.
❌ ERREUR #3 : Négliger la couverture et les mots-clés — 0 vente.

EbookStudio Pro résout ces 3 problèmes en même temps :
✅ Plan structuré automatiquement
✅ Génération en 47 min
✅ Couvertures pro + optimisation KDP intégrée

Le tout pour ~0,30€ par livre.

📊 Le calcul : 1 ebook/semaine × 52 = 52 livres/an, pour ~15€ de production.

👉 Découvrir EbookStudio Pro : ${OFFRES_LINK}

L'offre Fondateur à 67€ (au lieu de 197€) est disponible quelques jours encore.

Georges

P.S: Testez d'abord gratuitement : ${DEMO_LINK}`,
  },
  {
    step: 3,
    dayOffset: 4,
    dayLabel: "J+4",
    subject: "💰 De 0 à 35 livres Amazon — Mon parcours transparent",
    preheader: "Chiffres réels, résultats réels, outil réel.",
    strategy: "PREUVE SOCIALE",
    strategyColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    body: `[PRÉNOM],

Aujourd'hui, pas de pitch. Juste des faits.

📊 Mon parcours Amazon KDP :
• 2023 : 0 livre publié
• 2024 : 18 livres (méthode manuelle)
• 2025-2026 : 35+ livres (avec EbookStudio)

EbookStudio Pro 2026 inclut :
📝 Générateur IA (Gemini 3 Flash)
🎨 Créateur de couvertures pro
🔊 Convertisseur en livre audio
📊 Dashboard marketing complet
📧 Système email marketing inclus

Le tout à 67€ (paiement unique).
Ou en facilités : 3×23€ ou 5×14€.

👉 Accéder à l'offre Fondateur : ${OFFRES_LINK}

Mes livres sont sur Amazon, mon nom est public, mes résultats sont transparents.

Cordialement,
Georges Boubet
https://www.amazon.fr/Mr-Georges-Boubet/e/B0CGVLHNX7`,
  },
  {
    step: 4,
    dayOffset: 6,
    dayLabel: "J+6",
    subject: "⏰ [Dernière chance] L'offre Fondateur disparaît dans 48h",
    preheader: "Après ça, le prix passe à 197€. Point final.",
    strategy: "URGENCE",
    strategyColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    body: `[PRÉNOM],

L'offre Fondateur EbookStudio Pro à 67€ se termine dans 48 heures.

Après ? Le prix passe à 197€.

🧮 Ce que vous obtenez (valeur 749€) :
- Générateur IA illimité (197€)
- Créateur de couvertures (97€)
- Convertisseur livre audio (147€)
- Dashboard marketing (97€)
- Outils réseaux sociaux (67€)
- Templates email (47€)
- Optimisateur KDP (97€)

Votre prix aujourd'hui : 67€ (-66%)
💳 Ou 3×23€ / 5×14€

🎁 BONUS inclus : Pack 300+ idées, Guide 10 Niches KDP 2026, Groupe privé, MAJ à vie, Support Zoom.

⚡ Coût par ebook : ~0,30€. Rentabilisé dès le 1er livre vendu.

👉 J'accède à l'offre Fondateur : ${OFFRES_LINK}

Georges

P.S: Je ne relancerai pas après cet email.`,
  },
  {
    step: 5,
    dayOffset: 7,
    dayLabel: "J+7",
    subject: "🔒 C'est terminé ce soir à minuit",
    preheader: "Votre dernière chance de rejoindre les fondateurs.",
    strategy: "DERNIER APPEL",
    strategyColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    body: `[PRÉNOM],

Dernier email. Dernier appel.

Ce soir à minuit, l'offre Fondateur à 67€ se ferme définitivement.

Où serez-vous dans 90 jours ?

📍 Scénario A : Toujours cette idée de livre dans un coin de votre tête.
📍 Scénario B : 10, 15, 20 ebooks sur Amazon. Vos premiers revenus passifs tombent.

La seule différence ? Un clic. Aujourd'hui.

👉 Rejoindre les Fondateurs : ${OFFRES_LINK}

Merci d'avoir lu mes emails cette semaine, [PRÉNOM].

Si une petite voix vous dit "et si ça marchait pour moi ?"...
Écoutez-la. Juste cette fois.

À bientôt de l'autre côté,
Georges

---
📖 35+ livres publiés sur Amazon
🛠️ Créateur d'EbookStudio Pro
🔗 amazon.fr/Mr-Georges-Boubet/e/B0CGVLHNX7`,
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
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const email = EMAIL_SEQUENCE[activeStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white/60 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <Mail className="w-7 h-7 text-amber-400" />
              Séquence Emails Prospects
            </h1>
            <p className="text-white/50 text-sm mt-1">Prévisualisation des 5 emails envoyés automatiquement à vos prospects</p>
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
                  ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                  : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                activeStep === i ? "bg-amber-500 text-black" : "bg-white/10 text-white/60"
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
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Détails de l'email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="text-white/40">Étape</span>
                  <p className="text-white font-semibold">{email.step} / 5</p>
                </div>
                <div>
                  <span className="text-white/40">Envoi</span>
                  <p className="text-white font-semibold">{email.dayLabel} après inscription</p>
                </div>
                <div>
                  <span className="text-white/40">Stratégie</span>
                  <div className="mt-1">
                    <Badge className={email.strategyColor}>{email.strategy}</Badge>
                  </div>
                </div>
                <div>
                  <span className="text-white/40">Objet</span>
                  <p className="text-white font-medium text-xs mt-1">{email.subject}</p>
                </div>
                <div>
                  <span className="text-white/40">Pré-header</span>
                  <p className="text-white/60 text-xs mt-1 italic">{email.preheader}</p>
                </div>
                <div>
                  <span className="text-white/40">Expéditeur</span>
                  <p className="text-white text-xs mt-1">Georges Boubet &lt;noreply@ebookstudio.fr&gt;</p>
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
                className="flex-1 border-white/20 text-white/70 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={activeStep === EMAIL_SEQUENCE.length - 1}
                onClick={() => setActiveStep(activeStep + 1)}
                className="flex-1 border-white/20 text-white/70 hover:text-white"
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
                  Vous recevez cet email car vous avez manifesté un intérêt pour EbookStudio Pro.<br />
                  <span className="text-amber-600 underline cursor-pointer">Voir l'offre</span> · <span className="text-amber-600 underline cursor-pointer">Tester la démo</span><br />
                  Pour ne plus recevoir ces emails, répondez "STOP" à cet email.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Summary table */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-sm">📋 Récapitulatif de la séquence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/40">
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
                      className={`border-b border-white/5 cursor-pointer transition-colors ${
                        activeStep === i ? "bg-amber-500/10" : "hover:bg-white/5"
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          activeStep === i ? "bg-amber-500 text-black" : "bg-white/10 text-white/60"
                        }`}>
                          {e.step}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-white font-semibold">{e.dayLabel}</td>
                      <td className="py-2.5 px-3">
                        <Badge className={`text-[10px] ${e.strategyColor}`}>{e.strategy}</Badge>
                      </td>
                      <td className="py-2.5 px-3 text-white/70 text-xs">{e.subject}</td>
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
