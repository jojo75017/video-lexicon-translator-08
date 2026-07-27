import { useNavigate } from "react-router-dom";
import { ArrowLeft, Table2, Check, Lock, Infinity } from "lucide-react";
import { V3_PLANS, getYearlySavingsPercent, getYearlySavingsAmount, formatPrice } from "@/data/v3Pricing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminPanelNav } from "@/components/admin/AdminPanelNav";
import { KdpPilotTiersMatrix } from "@/components/admin/KdpPilotTiersMatrix";
import { V3ToolsPlanMatrix } from "@/components/admin/V3ToolsPlanMatrix";

interface PlanRow {
  letter: string;
  domain: string;
  debutant: string;
  expert: string;
  auteur: string;
}

const planRows: PlanRow[] = [
  { letter: "A", domain: "Accueil V3", debutant: "✅", expert: "✅", auteur: "✅" },
  { letter: "B", domain: "Bibliothèque personnelle", debutant: "15 projets actifs", expert: "60 projets actifs", auteur: "Illimité + versioning" },
  { letter: "C", domain: "Création de livre (wizard)", debutant: "20 chapitres · 3 500 mots/ch · 3 pers.", expert: "40 chapitres · 5 000 mots/ch · 8 pers.", auteur: "60 chapitres · 8 000 mots/ch · ∞ pers." },
  { letter: "D", domain: "Dashboard / Hub V3", debutant: "✅", expert: "✅", auteur: "✅ + Studio Pro" },
  { letter: "E", domain: "Édition / Passe éditoriale", debutant: "Correction base", expert: "Lissage IA", auteur: "Passe multi-agent Pro (P24)" },
  { letter: "F", domain: "Formatage & Export", debutant: "PDF/DOCX/EPUB + TOC", expert: "Templates KDP standard", auteur: "Templates premium + KDP print-ready" },
  { letter: "G", domain: "Génération de couverture HAUT DE GAMME (recto + tranche + 4e)", debutant: "Wrap PDF pro · 5 var./mois", expert: "Wrap PDF pro · 20 var./mois + variantes", auteur: "Cover Studio Pro (P23) illimité + DA IA" },
  { letter: "H", domain: "Historique / Versioning", debutant: "5 versions", expert: "20 versions", auteur: "Illimité + comparateur" },
  { letter: "I", domain: "Import de manuscrit", debutant: "3/mois", expert: "15/mois", auteur: "Illimité + reformatage IA" },
  { letter: "J", domain: "Journal IA & Clés BYOK", debutant: "Multi-clés Gemini", expert: "Multi-clés Gemini", auteur: "Gemini + OpenAI/Claude/DeepSeek" },
  { letter: "K", domain: "KDP Spy (P27 Pro)", debutant: "🔒", expert: "🔒", auteur: "Recherche niches Amazon live" },
  { letter: "L", domain: "Livres spéciaux (V2 migrés)", debutant: "Journaux / Cahiers / Enfants", expert: "+ Illustrés / Recueils / Guides", auteur: "14 modules incl. BD & Audiobooks" },
  { letter: "M", domain: "Marketing & Lancement", debutant: "Checklist J-7", expert: "+ Emails + visuels RS", auteur: "+ CRM + pages de vente + affiliation" },
  { letter: "N", domain: "Niches & Étude de marché", debutant: "3/mois", expert: "20/mois", auteur: "Illimité + comparateur multi-niches" },
  { letter: "O", domain: "Outils annexes", debutant: "Sommaire, Word Count, Idées", expert: "+ Quiz, Audit, Keywords", auteur: "Tous les outils incl. Pro" },
  { letter: "P", domain: "Personnages & Bibles", debutant: "3 pers., bible simple", expert: "8 pers., bible étendue", auteur: "Illimité + générateur d'univers" },
  { letter: "Q", domain: "Quotas & Compteurs", debutant: "20 livres/mois", expert: "50 livres/mois", auteur: "Illimité" },
  { letter: "R", domain: "Résiliation / Portail client", debutant: "✅", expert: "✅", auteur: "✅" },
  { letter: "S", domain: "Sélection éditeurs (P26 Pro)", debutant: "🔒", expert: "🔒", auteur: "Moteur maisons d'édition FR" },
  { letter: "T", domain: "TOC / Sommaire Ultime", debutant: "20 chapitres", expert: "40 chapitres", auteur: "60 chapitres + éditeur avancé" },
  { letter: "U", domain: "Upgrades / Bascule", debutant: "Upgrade instantané", expert: "Upgrade instantané", auteur: "Downgrade fin de période" },
  { letter: "V", domain: "Voix & Audiobook (P29 Pro)", debutant: "🔒", expert: "1 chapitre démo", auteur: "Audiobook complet ACX-ready" },
  { letter: "W", domain: "Workflow 30 agents", debutant: "P1 → P18 (18 agents)", expert: "P1 → P22 (22 agents) + priorité", auteur: "P1 → P30 (30 agents)" },
  { letter: "X", domain: "eXport groupé & Bundle KDP", debutant: "Livre par livre", expert: "Lot max 5 livres", auteur: "Bundle illimité + ZIP KDP" },
  { letter: "Y", domain: "Yield / Suivi ventes", debutant: "🔒", expert: "🔒", auteur: "Dashboard royalties KDP (à venir)" },
  { letter: "Z", domain: "Zone support & Communauté", debutant: "Email 48h", expert: "Email 24h + forum", auteur: "12h + coaching mensuel + Discord" },
  { letter: "★", domain: "KDP Pilot (audit & recommandations)", debutant: "Audit basique (score + top 3 axes)", expert: "Audit complet + suggestions mots-clés", auteur: "Pilot Pro : scoring avancé, BSR live, comparateur niches, plan d'action IA" },
  { letter: "🌍", domain: "Traductions multilingues (10 langues)", debutant: "10 langues incluses", expert: "10 langues incluses", auteur: "10 langues + relecture IA premium" },
];

const proModules = [
  { code: "P23", name: "Cover Studio Pro", desc: "Couverture complète (front + dos + 4e) + direction artistique IA" },
  { code: "P24", name: "Passe éditoriale multi-agent", desc: "Style, rythme, cohérence, homogénéité" },
  { code: "P25", name: "Séries & Tomes", desc: "Bibles multi-tomes, chronologies croisées" },
  { code: "P26", name: "Sélection éditeurs", desc: "Matching maisons d'édition FR" },
  { code: "P27", name: "KDP Spy", desc: "Analyse niches Amazon + BSR + mots-clés cachés" },
  { code: "P27+", name: "KDP Pilot Pro", desc: "Audit avancé + scoring, BSR live, plan d'action IA (perf renforcée plan Auteur)" },
  { code: "P28", name: "Amazon Spy", desc: "Scraping concurrence + tendances" },
  { code: "P29", name: "Audiobook Studio", desc: "Conversion voix Azure + ElevenLabs" },
  { code: "P30", name: "BD Studio", desc: "Génération BD illustrée + bulles + planches" },
];

function renderCell(value: string) {
  if (value === "✅") {
    return <Check className="h-5 w-5 text-green-600" />;
  }
  if (value === "🔒") {
    return <Lock className="h-5 w-5 text-muted-foreground" />;
  }
  if (value.includes("Illimité") || value.includes("∞")) {
    return (
      <span className="flex items-center gap-1 text-sm font-medium text-primary">
        <Infinity className="h-4 w-4" /> {value.replace("Illimité", "").replace("∞", "").trim() || "Illimité"}
      </span>
    );
  }
  return <span className="text-sm text-foreground">{value}</span>;
}

export default function AdminPlansV3Page() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminPanelNav />

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => nav("/admin")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour admin
            </Button>
            <h1 className="text-2xl font-bold">Plans V3 — Contenu de A à Z</h1>
          </div>
          <Badge variant="outline" className="w-fit">
            <Table2 className="mr-1 h-4 w-4" /> 3 forfaits · 26 domaines · 8 modules Pro
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {V3_PLANS.map((plan, idx) => {
            const borderColor = idx === 0 ? "border-l-blue-500" : idx === 1 ? "border-l-amber-500" : "border-l-teal-500";
            const savings = getYearlySavingsPercent(plan);
            return (
              <Card key={plan.id} className={`border-l-4 ${borderColor}`}>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">{plan.name}</div>
                  <div className="text-3xl font-bold">{plan.booksPerMonth ? `${plan.booksPerMonth} livres/mois` : "Illimité"}</div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {plan.agentsCount} agents · {plan.chaptersMax} chapitres max
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xl font-bold">{formatPrice(plan.monthlyPrice)}/mois</span>
                    <span className="text-xs text-muted-foreground">ou {formatPrice(plan.yearlyPrice)}/an</span>
                  </div>
                  <div className="mt-1 text-xs text-green-600 font-medium">
                    Économie annuelle : {formatPrice(getYearlySavingsAmount(plan))} ({savings}%)
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Table2 className="h-5 w-5" /> Matrice A → Z
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">#</th>
                  <th className="px-4 py-3 text-left font-semibold">Domaine</th>
                  <th className="px-4 py-3 text-center font-semibold text-blue-600">Débutant</th>
                  <th className="px-4 py-3 text-center font-semibold text-amber-600">Expert</th>
                  <th className="px-4 py-3 text-center font-semibold text-teal-600">Auteur</th>
                </tr>
              </thead>
              <tbody>
                {planRows.map((row, idx) => (
                  <tr key={row.letter} className={idx % 2 === 1 ? "bg-muted/30" : ""}>
                    <td className="px-4 py-3 font-bold text-muted-foreground">{row.letter}</td>
                    <td className="px-4 py-3 font-medium">{row.domain}</td>
                    <td className="px-4 py-3 text-center">{renderCell(row.debutant)}</td>
                    <td className="px-4 py-3 text-center">{renderCell(row.expert)}</td>
                    <td className="px-4 py-3 text-center">{renderCell(row.auteur)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Modules Pro réservés au forfait Auteur (P23 → P30)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {proModules.map((mod) => (
                <div key={mod.code} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{mod.code}</Badge>
                    <span className="font-semibold">{mod.name}</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{mod.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <KdpPilotTiersMatrix />

        <V3ToolsPlanMatrix />

        <Card className="border-2 border-teal-500/50 bg-teal-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📕 Couverture haut de gamme — À intégrer sur les 3 forfaits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="font-medium">
              Objectif : livrer sur Débutant, Expert et Auteur une couverture professionnelle
              prête pour KDP, avec les 3 faces générées à partir des infos du livre.
            </p>
            <ul className="ml-5 list-disc space-y-1 text-muted-foreground">
              <li><strong>Recto (1re de couverture)</strong> — titre, sous-titre, nom d'auteur, visuel IA haut de gamme.</li>
              <li><strong>Tranche (dos)</strong> — calcul auto largeur selon nb de pages × facteur papier, titre + auteur verticaux.</li>
              <li><strong>Verso (4e de couverture)</strong> — résumé, bio courte, réserve code-barres ISBN, logo/tag optionnel.</li>
              <li><strong>Marges & bleed KDP</strong> — 0,125" fond perdu, safe zone 0,25", export PDF 300 DPI unit=in.</li>
              <li><strong>Infos livre injectées</strong> — titre, sous-titre, auteur, genre, résumé, format trim, nb pages, type papier.</li>
              <li><strong>Différenciation forfaits</strong> — Débutant/Expert = wrap PDF base, Auteur = Cover Studio Pro (P23) avec direction artistique IA + variations illimitées.</li>
            </ul>
            <p className="text-xs text-muted-foreground">
              Base technique déjà en place : <code>KdpCoverStudio</code>, <code>generateKdpCoverPdf</code>, edge <code>generate-premium-cover</code> (gpt-image-2 + Gemini). À câbler dans le wizard V3 étape « Couverture » pour les 3 plans.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tarifs V3 — Mensuel & Annuel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              6 prix synchronisés avec Stripe (sandbox → live automatique au publish). Tous les forfaits sont résiliables à tout moment.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
              {V3_PLANS.flatMap((plan) => [
                { label: `${plan.name} mensuel`, price: plan.monthlyPrice, interval: "mois" },
                { label: `${plan.name} annuel`, price: plan.yearlyPrice, interval: "an" },
              ]).map((item) => (
                <div key={item.label} className="rounded-lg border border-border bg-background p-3">
                  <div className="text-xs font-semibold text-muted-foreground">{item.label}</div>
                  <div className="text-lg font-bold">{formatPrice(item.price)}/{item.interval}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
