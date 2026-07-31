import { useNavigate } from "react-router-dom";
import { ArrowLeft, Snowflake, Calendar, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminPanelNav } from "@/components/admin/AdminPanelNav";

interface AttenteItem {
  id: number;
  subject: string;
  context: string;
  reason: string;
  estimatedResume: string;
}

const attenteItems: AttenteItem[] = [
  {
    id: 1,
    subject: "Facturation annuelle + tacite reconduction",
    context: "Configurer les 3 plans (Débutant, Studio, Éditeur) en facturation annuelle par défaut, avec tacite reconduction, possibilité de résiliation utilisateur et accès portail Stripe pour annulation.",
    reason: "Gelé sur demande : « met cela en attente on en reparle ».",
    estimatedResume: "Septembre 2026",
  },
  {
    id: 2,
    subject: "Essai gratuit — 1 ebook sans workflow",
    context: "Proposer un plan gratuit limité à 1 projet, 8 chapitres max, génération simplifiée 1 passe, export PDF filigrané. Le V2/V3 lifetime reste honoré.",
    reason: "Gelé sur demande : « ok met cela en attente ».",
    estimatedResume: "Septembre 2026",
  },
  {
    id: 3,
    subject: "Améliorations workflows V3 (août 2026)",
    context: "Différencier les plans (Débutant limité, Expert enrichi, Éditeur avec mode recherche approfondie + workflow de qualité professionnelle).",
    reason: "Gelé : « dans le mois d'août on va perfectionner le workflow des 2 plans ».",
    estimatedResume: "Août 2026 selon planning utilisateur",
  },
  {
    id: 4,
    subject: "KDP Pilot + lien affilié",
    context: "Intégrer Amazon PA-API pour données KDP réelles (BSR, volumes, notes concurrents) et créer un lien affilié KDP Pilot.",
    reason: "En attente de réception des clés PA-API de l'utilisateur : « je te le donnerais je ne l'ai pas encore ».",
    estimatedResume: "Dès réception des clés",
  },
  {
    id: 5,
    subject: "Stratégie V4 (2027)",
    context: "Construire une 'Maison d'Édition Professionnelle' autour des données KDP Pilot (abonnement 19 €/mois interne). 3 forfaits V4 proposés : Auteur 19 €, Studio 29 €, Éditeur 79 €. 15 modules : Market Intelligence Hub, Data Layer multi-sources, Quota & metering, Niche Validator, Keyword Engine Pro, Deep Research Writing, Editorial Board, Style DNA, Studio Illustration unifié, Séries & Univers, Publication Pack KDP, Post-Launch Tracker, Pricing Optimizer, Ads & Lancement, Abonnements & entitlements.",
    reason: "Gelé : V4 prévue pour 2027, à décider après le lancement V3.",
    estimatedResume: "Fin 2026 / début 2027",
  },
];

export default function AdminAttentePage() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="container mx-auto max-w-6xl py-8 space-y-6">
        <AdminPanelNav />

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => nav('/admin')} className="rounded-xl">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour Admin
          </Button>
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Snowflake className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Sujets en attente</h1>
            <p className="text-muted-foreground">Gel demandé jusqu'après août 2026</p>
          </div>
        </div>

        <Card className="border-blue-100 bg-blue-50/50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h2 className="font-semibold text-blue-900">Règle de conduite</h2>
              <p className="text-sm text-blue-800/80">
                Aucun code, migration, edge function ou modification de base de données ne sera effectué sur ces sujets avant la date de reprise indiquée ou une nouvelle décision explicite.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid gap-4">
          {attenteItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                      {item.id}
                    </span>
                    <CardTitle className="text-lg">{item.subject}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    <Calendar className="mr-1 h-3 w-3" />
                    {item.estimatedResume}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contexte</p>
                  <p className="text-sm text-foreground">{item.context}</p>
                </div>
                <div className="rounded-lg bg-amber-50 p-3 border border-amber-100">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">Pourquoi gelé</p>
                  <p className="text-sm text-amber-900">{item.reason}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
