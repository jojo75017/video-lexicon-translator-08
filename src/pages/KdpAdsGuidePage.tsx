import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Target,
  Calculator,
  Search,
  BarChart3,
  ListChecks,
  ArrowLeft,
  TrendingDown,
  TrendingUp,
  Skull,
  Shield,
} from "lucide-react";

const SCAMS = [
  {
    title: "Le piège du « Ciblage Automatique »",
    risk: "Brûle 80 % du budget sur des mots-clés non pertinents.",
    fix: "Lance une campagne auto SEULEMENT 14 jours pour récolter des mots-clés, puis tue-la et bascule en manuel.",
  },
  {
    title: "Les enchères par défaut trop élevées",
    risk: "Amazon suggère TOUJOURS plus haut (0,75 € à 1,20 €) — c'est leur business.",
    fix: "Démarre à 0,15 €–0,25 € max. Tu peux toujours monter ; tu ne peux jamais récupérer ce que tu as cramé.",
  },
  {
    title: "Les mots-clés « broad match » qui matchent n'importe quoi",
    risk: "« livre cuisine » peut déclencher sur « livre de cuisine pour chien végan » → clic à perte.",
    fix: "Utilise « phrase match » et « exact match » à 90 %. Le broad uniquement pour la découverte.",
  },
  {
    title: "Le ACOS qui ment (ACOS vs TACOS)",
    risk: "ACOS 30 % ≠ rentable. Le ACOS ignore les ventes organiques boostées par les pubs.",
    fix: "Suis le TACOS (Total ACOS) = dépense pub / ventes TOTALES. Vise un TACOS < 15 %.",
  },
  {
    title: "Les campagnes « Lock & Leave » abandonnées",
    risk: "Une campagne non touchée pendant 30 jours sur-paye en moyenne 40 % au-dessus du marché.",
    fix: "Audit obligatoire chaque dimanche : tuer les mots-clés > 10 clics sans vente, baisser les enchères ACOS > 50 %.",
  },
  {
    title: "Les « agences KDP Ads » à 500 €/mois",
    risk: "90 % font ce que ce guide t'apprend en 2 h, et prennent 30 % de ta marge.",
    fix: "Apprends les 4 KPI (CTR, CVR, ACOS, TACOS). En 1 mois tu fais mieux qu'eux.",
  },
  {
    title: "Le mythe « plus je dépense, plus je vends »",
    risk: "Au-delà d'un certain seuil, chaque euro ajouté ne ramène plus rien. Tu nourris Amazon, pas ton chiffre.",
    fix: "Trouve ton seuil de rentabilité (TACOS plafond) et reste DESSOUS. Mieux vaut 5 €/jour rentables que 50 €/jour à perte.",
  },
];

const CAMPAIGN_TYPES = [
  {
    name: "Sponsored Products — Manuel",
    when: "À utiliser DÈS LE DÉBUT",
    why: "Contrôle total sur les mots-clés et les enchères. C'est 80 % de ton ROI.",
    color: "border-l-4 border-l-emerald-500 bg-emerald-50/50",
    icon: CheckCircle2,
    iconColor: "text-emerald-600",
  },
  {
    name: "Sponsored Products — Auto",
    when: "Phase de découverte UNIQUEMENT (14 jours max)",
    why: "Amazon teste pour toi. Tu récoltes les mots-clés gagnants, puis tu coupes.",
    color: "border-l-4 border-l-amber-500 bg-amber-50/50",
    icon: AlertTriangle,
    iconColor: "text-amber-600",
  },
  {
    name: "Sponsored Brands",
    when: "Réservé aux séries de 3+ livres ou auteurs établis",
    why: "Bandeau en haut des résultats. Inutile sur 1 seul livre ; cher si pas de notoriété.",
    color: "border-l-4 border-l-blue-500 bg-blue-50/50",
    icon: Target,
    iconColor: "text-blue-600",
  },
  {
    name: "Lockscreen Ads (écran verrouillé Kindle)",
    when: "À ÉVITER pour 95 % des niches",
    why: "ROI quasi nul. CPC élevé, conversion < 0,5 %. Réservé à la fiction grand public à très gros catalogue.",
    color: "border-l-4 border-l-red-500 bg-red-50/50",
    icon: XCircle,
    iconColor: "text-red-600",
  },
];

const NEGATIVE_KEYWORDS = [
  "gratuit", "free", "pdf", "telecharger", "download", "torrent", "epub gratuit",
  "résumé", "résumé livre", "fiche de lecture", "wikipedia", "wikipédia",
  "occasion", "d'occasion", "seconde main", "amazon prime gratuit",
  "audible gratuit", "audiobook free", "livre audio gratuit",
  "kindle unlimited gratuit", "ku gratuit", "abonnement gratuit",
  "pour enfant", "pour adulte", "version anglaise", "english version",
  "edition limitée", "collector", "broché occasion", "poche occasion",
  "neuf", "promo", "soldes", "destockage", "lot",
];

const KPIS = [
  { name: "CTR (Click-Through Rate)", formula: "Clics ÷ Impressions × 100", good: "≥ 0,40 %", bad: "< 0,20 %", meaning: "Mesure si ta couverture + titre attirent l'œil." },
  { name: "CVR (Conversion Rate)", formula: "Ventes ÷ Clics × 100", good: "≥ 10 %", bad: "< 5 %", meaning: "Mesure si ta page produit (description, A+, prix) convertit." },
  { name: "ACOS", formula: "Dépense pub ÷ Ventes pub × 100", good: "≤ 30 %", bad: "> 50 %", meaning: "Coût direct de tes pubs. Indicateur tactique uniquement." },
  { name: "TACOS", formula: "Dépense pub ÷ Ventes TOTALES × 100", good: "≤ 15 %", bad: "> 25 %", meaning: "LE vrai indicateur de rentabilité globale." },
];

const CHECKLIST = [
  { phase: "J-1 — Prérequis (NE PAS LANCER SANS)", items: [
    "Description optimisée 7 keywords + bullet points",
    "Minimum 5 reviews authentiques (3,8 ★ minimum)",
    "A+ Content publié et validé",
    "Prix calibré marché (±10 % des concurrents directs)",
    "Couverture A/B testée (au moins 2 versions)",
  ]},
  { phase: "J+0 à J+7 — Phase d'apprentissage", items: [
    "Lance 1 campagne auto + 1 manuelle exact match",
    "Budget : 5 €/jour MAX par campagne",
    "Enchère de départ : 0,20 €",
    "NE TOUCHE À RIEN pendant 7 jours (Amazon a besoin de data)",
  ]},
  { phase: "J+8 à J+14 — Premières optimisations", items: [
    "Identifie les mots-clés > 10 clics sans vente → en negative",
    "Identifie les mots-clés > 1 vente → migrer en campagne manuelle exact",
    "Baisse les enchères des mots-clés ACOS > 50 %",
    "Augmente de +10 % les mots-clés ACOS < 20 %",
  ]},
  { phase: "J+15 à J+30 — Scaling intelligent", items: [
    "Tue les campagnes avec TACOS > 25 %",
    "Double le budget des campagnes TACOS < 10 %",
    "Lance 2 nouvelles campagnes phrase match basées sur les gagnants",
    "Audit hebdo (dimanche) : 30 min suffisent",
  ]},
];

export default function KdpAdsGuidePage() {
  const navigate = useNavigate();
  const [royalty, setRoyalty] = useState<string>("3.50");
  const [conversionRate, setConversionRate] = useState<string>("10");

  const maxBid = (() => {
    const r = parseFloat(royalty);
    const c = parseFloat(conversionRate);
    if (isNaN(r) || isNaN(c) || c <= 0) return "—";
    const bid = (r * (c / 100)) / 2;
    return `${bid.toFixed(2)} €`;
  })();

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <header className="border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Retour
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#008296]" />
            <h1 className="text-lg md:text-xl font-bold text-[#232F3E]">Guide Anti-Arnaque KDP Ads</h1>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <Badge className="mb-3 bg-[#008296] hover:bg-[#008296]">Module pédagogique exclusif</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-[#232F3E] mb-3">
            Maîtrise Amazon KDP Ads sans te faire arnaquer
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pas de promesses magiques, pas de vraies pubs lancées depuis cette page : juste les
            règles concrètes qui t'évitent de cramer 500 € en 2 semaines comme 90 % des nouveaux auteurs KDP.
          </p>
        </div>

        <Alert className="mb-6 border-amber-300 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-900">À lire avant de commencer</AlertTitle>
          <AlertDescription className="text-amber-800">
            Ce guide est <strong>éducatif uniquement</strong>. Aucune campagne n'est créée ni gérée depuis EbookStudio.
            Tu dois te connecter à <a href="https://advertising.amazon.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">advertising.amazon.com</a> pour appliquer ces conseils.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="scams" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 mb-6 h-auto">
            <TabsTrigger value="scams" className="gap-1 py-2"><Skull className="h-4 w-4" /> Arnaques</TabsTrigger>
            <TabsTrigger value="campaigns" className="gap-1 py-2"><Target className="h-4 w-4" /> Campagnes</TabsTrigger>
            <TabsTrigger value="bids" className="gap-1 py-2"><Calculator className="h-4 w-4" /> Enchères</TabsTrigger>
            <TabsTrigger value="keywords" className="gap-1 py-2"><Search className="h-4 w-4" /> Mots-clés</TabsTrigger>
            <TabsTrigger value="reports" className="gap-1 py-2"><BarChart3 className="h-4 w-4" /> Rapports</TabsTrigger>
            <TabsTrigger value="checklist" className="gap-1 py-2"><ListChecks className="h-4 w-4" /> Checklist</TabsTrigger>
          </TabsList>

          {/* ARNAQUES */}
          <TabsContent value="scams" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-[#232F3E]">Les 7 arnaques KDP Ads à éviter absolument</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {SCAMS.map((scam, i) => (
                  <Card key={i} className="border-l-4 border-l-red-500">
                    <CardContent className="pt-4">
                      <h3 className="font-bold text-[#232F3E] flex items-start gap-2">
                        <span className="bg-red-100 text-red-700 rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0">{i + 1}</span>
                        {scam.title}
                      </h3>
                      <div className="mt-3 grid md:grid-cols-2 gap-3">
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                          <div className="flex items-center gap-2 text-red-700 font-semibold text-sm mb-1">
                            <XCircle className="h-4 w-4" /> Le risque
                          </div>
                          <p className="text-sm text-red-900">{scam.risk}</p>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-200 rounded-md p-3">
                          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm mb-1">
                            <CheckCircle2 className="h-4 w-4" /> La parade
                          </div>
                          <p className="text-sm text-emerald-900">{scam.fix}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CAMPAGNES */}
          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-[#232F3E]">Les 3 types de campagnes : quand & pourquoi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {CAMPAIGN_TYPES.map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <Card key={i} className={c.color}>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <Icon className={`h-5 w-5 mt-1 flex-shrink-0 ${c.iconColor}`} />
                          <div>
                            <h3 className="font-bold text-[#232F3E]">{c.name}</h3>
                            <p className="text-sm font-medium mt-1"><strong>Quand :</strong> {c.when}</p>
                            <p className="text-sm text-muted-foreground mt-1"><strong>Pourquoi :</strong> {c.why}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                <Alert className="border-[#008296] bg-[#008296]/5">
                  <CheckCircle2 className="h-4 w-4 text-[#008296]" />
                  <AlertTitle className="text-[#008296]">Recommandation EbookStudio</AlertTitle>
                  <AlertDescription>
                    <strong>1 livre = 2 campagnes maximum :</strong> 1 auto (14 jours) + 1 manuelle exact match.
                    C'est tout. Le reste, c'est de la complexité inutile qui te fait perdre de l'argent.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ENCHERES */}
          <TabsContent value="bids" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-[#232F3E]">Stratégie d'enchères sécurisée</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Card className="bg-gradient-to-br from-[#008296]/10 to-[#008296]/5 border-[#008296]">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-[#232F3E] mb-2 flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-[#008296]" /> Calculateur d'enchère maximale
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Formule : <code className="bg-white px-2 py-1 rounded text-xs">Enchère max = (Royalty × Taux conversion) / 2</code>
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 items-end">
                      <div>
                        <Label htmlFor="royalty">Royalty par vente (€)</Label>
                        <Input
                          id="royalty"
                          type="number"
                          step="0.10"
                          value={royalty}
                          onChange={(e) => setRoyalty(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvr">Taux de conversion estimé (%)</Label>
                        <Input
                          id="cvr"
                          type="number"
                          step="1"
                          value={conversionRate}
                          onChange={(e) => setConversionRate(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div className="bg-white rounded-lg p-4 border-2 border-[#008296]">
                        <div className="text-xs text-muted-foreground">Enchère max recommandée</div>
                        <div className="text-3xl font-bold text-[#008296]">{maxBid}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h3 className="font-bold text-[#232F3E] mb-3">Tableau de référence par type de livre</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border">
                      <thead className="bg-[#232F3E] text-white">
                        <tr>
                          <th className="p-3 text-left">Type de livre</th>
                          <th className="p-3 text-left">Enchère départ</th>
                          <th className="p-3 text-left">Enchère plafond</th>
                          <th className="p-3 text-left">CVR cible</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        <tr className="border-b">
                          <td className="p-3 font-medium">Non-fiction (guides, méthodes)</td>
                          <td className="p-3">0,25 €</td>
                          <td className="p-3">0,55 €</td>
                          <td className="p-3">10–15 %</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-medium">Fiction (roman, thriller)</td>
                          <td className="p-3">0,15 €</td>
                          <td className="p-3">0,40 €</td>
                          <td className="p-3">8–12 %</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-medium">Low-content (cahiers, journaux)</td>
                          <td className="p-3">0,10 €</td>
                          <td className="p-3">0,25 €</td>
                          <td className="p-3">5–8 %</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-medium">Livre jeunesse</td>
                          <td className="p-3">0,20 €</td>
                          <td className="p-3">0,45 €</td>
                          <td className="p-3">12–18 %</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-l-4 border-l-emerald-500">
                    <CardContent className="pt-4">
                      <h4 className="font-bold flex items-center gap-2 text-emerald-700">
                        <TrendingUp className="h-4 w-4" /> Quand monter (+10 % max)
                      </h4>
                      <ul className="text-sm mt-2 space-y-1 list-disc list-inside text-muted-foreground">
                        <li>ACOS &lt; 20 % depuis 14 jours</li>
                        <li>Position moyenne &gt; 3 (bas de page)</li>
                        <li>Impressions chutent semaine après semaine</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-red-500">
                    <CardContent className="pt-4">
                      <h4 className="font-bold flex items-center gap-2 text-red-700">
                        <TrendingDown className="h-4 w-4" /> Quand baisser (−20 %)
                      </h4>
                      <ul className="text-sm mt-2 space-y-1 list-disc list-inside text-muted-foreground">
                        <li>ACOS &gt; 50 % depuis 7 jours</li>
                        <li>10+ clics sans vente sur un mot-clé</li>
                        <li>CTR &lt; 0,15 % (problème couverture/titre)</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MOTS-CLES */}
          <TabsContent value="keywords" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-[#232F3E]">Les mots-clés qui marchent (sans payer 0,80 €/clic)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-l-4 border-l-red-500">
                    <CardContent className="pt-4">
                      <h4 className="font-bold text-red-700">❌ Head terms (à éviter)</h4>
                      <p className="text-sm mt-1 text-muted-foreground">Ex : « cuisine », « roman », « marketing »</p>
                      <p className="text-xs mt-2"><strong>CPC :</strong> 0,60 €–1,20 € · <strong>CVR :</strong> &lt; 3 %</p>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-emerald-500">
                    <CardContent className="pt-4">
                      <h4 className="font-bold text-emerald-700">✅ Long-tail (à privilégier)</h4>
                      <p className="text-sm mt-1 text-muted-foreground">Ex : « livre cuisine végétarienne débutant rapide »</p>
                      <p className="text-xs mt-2"><strong>CPC :</strong> 0,15 €–0,30 € · <strong>CVR :</strong> 12–20 %</p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="font-bold text-[#232F3E] mb-2">Les 50 mots-clés défensifs (toujours les avoir)</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Ce sont les variantes de TON nom d'auteur + TON titre. Un concurrent peut t'enchérir dessus sinon.
                  </p>
                  <div className="bg-slate-50 border rounded-md p-4 text-sm">
                    <p className="font-medium mb-2">Liste type (à adapter avec tes vrais éléments) :</p>
                    <ul className="grid md:grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground">
                      <li>• [Ton nom d'auteur]</li>
                      <li>• [Nom auteur] livres</li>
                      <li>• [Titre exact du livre]</li>
                      <li>• [Titre] [auteur]</li>
                      <li>• [Titre] kindle</li>
                      <li>• [Titre] broché</li>
                      <li>• [Sous-titre]</li>
                      <li>• [Nom de série] tome 1</li>
                      <li>• … etc. (50 variantes au total)</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-[#232F3E] mb-2">Voler les mots-clés des concurrents (légalement)</h3>
                  <ol className="space-y-2 text-sm list-decimal list-inside">
                    <li>Identifie 5 livres concurrents dans ta niche (top 20 BSR).</li>
                    <li>Note leur ASIN (10 caractères dans l'URL Amazon).</li>
                    <li>Crée une campagne « Product Targeting » qui cible ces ASIN.</li>
                    <li>Tes pubs apparaissent sur LEUR fiche produit. Légal et redoutable.</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-bold text-[#232F3E] mb-2">Les 30+ negative keywords à exclure d'office</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    À ajouter dans « Negative keyword targeting » dès la création de la campagne.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {NEGATIVE_KEYWORDS.map((kw) => (
                      <Badge key={kw} variant="outline" className="bg-red-50 border-red-200 text-red-700">
                        −{kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* RAPPORTS */}
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-[#232F3E]">Lire les rapports sans se faire avoir</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-bold text-[#232F3E] mb-3">Les 4 KPI qui comptent vraiment</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border">
                      <thead className="bg-[#232F3E] text-white">
                        <tr>
                          <th className="p-2 text-left">KPI</th>
                          <th className="p-2 text-left">Formule</th>
                          <th className="p-2 text-left">✅ Bon</th>
                          <th className="p-2 text-left">❌ Mauvais</th>
                          <th className="p-2 text-left">Ce que ça mesure</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {KPIS.map((k) => (
                          <tr key={k.name} className="border-b">
                            <td className="p-2 font-medium">{k.name}</td>
                            <td className="p-2 text-xs"><code>{k.formula}</code></td>
                            <td className="p-2 text-emerald-700 font-semibold">{k.good}</td>
                            <td className="p-2 text-red-700 font-semibold">{k.bad}</td>
                            <td className="p-2 text-muted-foreground">{k.meaning}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <Alert className="border-[#008296] bg-[#008296]/5">
                  <BarChart3 className="h-4 w-4 text-[#008296]" />
                  <AlertTitle>Décrypter le Search Term Report</AlertTitle>
                  <AlertDescription className="space-y-2 mt-2">
                    <p>Va dans « Reports » → « Search term report » → Filtre 30 derniers jours.</p>
                    <p><strong>Trie par « Spend » décroissant</strong> et regarde les 20 premières lignes :</p>
                    <ul className="list-disc list-inside text-sm">
                      <li>Si <strong>Orders = 0</strong> et <strong>Clicks &gt; 10</strong> → ajoute en negative keyword IMMÉDIATEMENT.</li>
                      <li>Si <strong>ACOS &lt; 20 %</strong> → bascule ce mot-clé en campagne manuelle exact.</li>
                      <li>Si <strong>CTR &lt; 0,1 %</strong> → mot-clé hors-sujet, en negative.</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <Card className="border-l-4 border-l-red-500">
                  <CardContent className="pt-4">
                    <h4 className="font-bold text-red-700 flex items-center gap-2">
                      <Skull className="h-4 w-4" /> Quand tuer une campagne (sans regret)
                    </h4>
                    <ul className="text-sm mt-2 space-y-1 list-disc list-inside text-muted-foreground">
                      <li>TACOS &gt; 30 % pendant 21 jours d'affilée</li>
                      <li>0 vente après 50 € dépensés</li>
                      <li>CTR &lt; 0,1 % malgré 3 ajustements de bid</li>
                      <li>Tu dois te forcer à la regarder = elle est morte</li>
                    </ul>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CHECKLIST */}
          <TabsContent value="checklist" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-[#232F3E]">Checklist lancement Ads (J-1 à J+30)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-[#FF9E2D] bg-[#FF9E2D]/10">
                  <AlertTriangle className="h-4 w-4 text-[#FF9E2D]" />
                  <AlertTitle>Budget de test recommandé</AlertTitle>
                  <AlertDescription>
                    <strong>5 €/jour × 14 jours = 70 € MAX</strong> pour valider une niche.
                    Si après 70 € tu n'as pas 1 vente, ce n'est PAS un problème de pub : c'est un problème
                    de couverture, prix, description ou produit.
                  </AlertDescription>
                </Alert>

                {CHECKLIST.map((phase, i) => (
                  <Card key={i} className="border-l-4 border-l-[#008296]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-[#232F3E]">{phase.phase}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {phase.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-[#008296] mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}

                <Card className="bg-[#232F3E] text-white">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-lg mb-2">🎯 Règle d'or EbookStudio</h3>
                    <p className="text-sm opacity-90">
                      <strong>Mieux vaut 5 €/jour rentables pendant 6 mois que 50 €/jour à perte pendant 1 mois.</strong><br />
                      Les pubs Amazon ne sauvent pas un mauvais livre. Elles amplifient un bon livre.
                      Travaille d'abord ta couverture, ta description et tes 5 premières reviews.
                      ENSUITE seulement, lance les pubs.
                    </p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
