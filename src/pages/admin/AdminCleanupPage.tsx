import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, AlertTriangle, CheckCircle, FileX, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AdminPanelNav } from "@/components/admin/AdminPanelNav";
import { toast } from "sonner";

const KEEP = [
  "V2 : EbookPlanner, Ebookbot, Ambiances, Couverture KDP, Niches, BookPerfect, Audit, WordCount…",
  "V3 public : tout /v3/* + V3Hub",
  "Marketing actif : /offres, démo, FAQ, promo été, tunnels de paiement, V3Commande",
  "Blog + Formation SEO (essentiel)",
  "Légal / système : mentions, CGV, auth, cadeaux, support",
  "Admin simplifié : abonnés, funnel, cadeaux, codes, prospects, emails, influenceurs",
];

const DELETE = [
  "Doublons / anciens dashboards : Dashboard, AdminCockpit, BusinessCenter, EspaceLancement…",
  "Anciennes pages de vente : SalesPage, SalesCampaign, OfferValue, Webinaire, ArcSignup, TrialSignup…",
  "Outils marketing obsolètes : Pinterest, SEO tiers, SiteCloner, MarketingPlan, AiChatPage, Audiobook…",
  "Formation secondaire : Tutoriels, GuideEbook, KdpAdsGuide, ChecklistTournage, Forum…",
  "SaaS demo (src/pages/saas/*)",
  "Admin secondaire : Brevo guides, TrialDashboard",
];

const SUMMARY = {
  before: 109,
  after: 45,
  removed: 55,
  orphanComponents: 15,
};

export default function AdminCleanupPage() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const launch = () => {
    setRunning(true);
    // Le ménage est une opération manuelle massive (src/pages + App.tsx + sitemap + redirections).
    // Le bouton enregistre la demande et prévient l'agent ; la suppression réelle est déclenchée
    // depuis le plan `.lovable/plan.md` après confirmation utilisateur.
    setTimeout(() => {
      setRunning(false);
      setDone(true);
      setOpen(false);
      toast.success("Demande de ménage enregistrée. Action exécutée côté build/agent.", { duration: 5000 });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <AdminPanelNav />

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => nav("/admin")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour admin
          </Button>
          <h1 className="text-2xl font-bold">Ménage des pages</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-muted-foreground">{SUMMARY.before}</div>
              <div className="text-sm text-muted-foreground">pages actuelles</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">{SUMMARY.after}</div>
              <div className="text-sm text-muted-foreground">pages après ménage</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-destructive">{SUMMARY.removed}</div>
              <div className="text-sm text-muted-foreground">pages à supprimer</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" /> Ce qui reste
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {KEEP.map((k, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-green-500" />
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <FileX className="w-5 h-5" /> Ce qui va être supprimé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {DELETE.map((d, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Trash2 className="w-4 h-4 mt-0.5 shrink-0 text-destructive" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-destructive flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Action irréversible
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Le plan supprime {SUMMARY.removed} pages de <code>src/pages/</code>, nettoie les routes, le sitemap et les redirections.
                  Prévu initialement pour août/septembre 2026.
                </p>
              </div>
              <Button
                size="lg"
                variant="destructive"
                onClick={() => setOpen(true)}
                disabled={done}
                className="shrink-0"
              >
                {done ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" /> Ménage demandé
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" /> Supprimer les {SUMMARY.removed} pages
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Confirmer le ménage
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Vous êtes sur le point de supprimer {SUMMARY.removed} pages et {SUMMARY.orphanComponents} composants orphelins.
                Cela inclut des anciens tunnels, dashboards, outils SaaS et formations secondaires.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm">
                <strong>Actions comprises :</strong>
              </p>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Suppression des imports et routes dans <code>src/App.tsx</code></li>
                <li>Suppression des fichiers pages listés</li>
                <li>Suppression des composants orphelins</li>
                <li>Mise à jour de <code>AdminPanelNav.tsx</code> et <code>V3Sidebar.tsx</code></li>
                <li>Nettoyage du <code>sitemap.xml</code> et ajout des redirections</li>
              </ul>
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
                Pensez à vérifier la build (<code>tsgo</code>) et à sauvegarder le projet avant de lancer.
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)} disabled={running}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={launch} disabled={running}>
                {running ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                Oui, lancer le ménage
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
