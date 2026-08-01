import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Snowflake, Calendar, AlertCircle, Target, CheckCircle2, Wrench, PauseCircle, KeyRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AdminPanelNav } from "@/components/admin/AdminPanelNav";

interface AttenteItem {
  id: number;
  subject: string;
  objectif: string;
  decisions: string[];
  technique?: string[];
  reason: string;
  reprise: string[];
  estimatedResume: string;
}

const attenteItems: AttenteItem[] = [
  {
    id: 1,
    subject: "Facturation annuelle + tacite reconduction",
    objectif:
      "Passer les 3 forfaits d'abonnement en facturation annuelle par défaut, avec tacite reconduction chaque année, tout en laissant l'abonné libre de résilier lui-même à tout moment.",
    decisions: [
      "Trois plans concernés : Débutant 9,99 €/mois, Expert 12,99 €/mois, Auteur/Éditeur 59 €.",
      "Chaque plan propose une formule mensuelle et une formule annuelle, avec l'économie réalisée affichée clairement sur la formule annuelle.",
      "La formule annuelle est reconduite tacitement chaque année, sauf résiliation de l'abonné.",
      "Justification de la reconduction annuelle : les améliorations s'accumulent année après année, et la V4 très professionnelle arrive en 2027.",
      "L'abonné doit pouvoir résilier seul, sans passer par le support : accès à un portail client d'abonnement.",
      "Une résiliation coupe l'accès à la fin de la période déjà payée, pas immédiatement.",
      "Les annulations doivent redescendre automatiquement dans la base pour désactiver les droits au bon moment.",
    ],
    technique: [
      "Page des forfaits : ajout d'un sélecteur Mensuel / Annuel avec badge d'économie.",
      "Création d'un portail d'abonnement self-service (résiliation, changement de formule, historique de factures).",
      "Écoute des événements d'annulation d'abonnement pour synchroniser les droits utilisateur.",
      "Mise à jour des CGV : mention explicite de la tacite reconduction et des modalités de résiliation.",
    ],
    reason: "Gelé sur demande : « met cela en attente on en reparle » — puis « tout cela doit être mis en attente pour août ».",
    reprise: [
      "Reprise prévue en septembre 2026, après le lancement V3 d'octobre.",
      "Nécessite une décision finale sur le prix annuel exact de chaque plan (remise appliquée).",
    ],
    estimatedResume: "Septembre 2026",
  },
  {
    id: 2,
    subject: "Essai gratuit — 1 ebook sans workflow",
    objectif:
      "Offrir une porte d'entrée gratuite au moment du lancement, suffisante pour que le prospect touche le produit, mais volontairement limitée pour ne pas cannibaliser les abonnements.",
    decisions: [
      "1 seul projet de livre autorisé par compte gratuit.",
      "8 chapitres maximum sur ce projet.",
      "Génération en 1 seule passe : pas d'accès au workflow multi-agents complet.",
      "Export limité à un PDF filigrané (pas de DOCX, pas de pack KDP, pas d'export propre).",
      "Aucun accès aux modules Pro : pas de Cover Studio Pro, pas de BD Studio, pas de Recherche Approfondie.",
      "Les abonnés existants et les acheteurs de l'offre à vie ne sont pas impactés : leur accès V2 + V3 reste honoré intégralement.",
      "Question tranchée sur la V4 : les lifetime V2+V3 gardent V2 et V3 à vie, mais la V4 (2027) fera l'objet d'un supplément fidélité — ce n'est pas inclus dans l'offre à vie actuelle.",
    ],
    technique: [
      "Introduction d'un palier `trial` dans la logique de droits d'accès utilisateur.",
      "Blocage des exports non filigranés et des modules Pro pour ce palier.",
      "Compteur de projets plafonné à 1, compteur de chapitres plafonné à 8.",
      "Ajout d'une mention dans les conditions : V4 et versions ultérieures non incluses dans l'accès à vie V3.",
    ],
    reason: "Gelé sur demande : « ok met cela en attente ».",
    reprise: [
      "Reprise prévue en septembre 2026.",
      "À décider avant reprise : durée de l'essai (illimité dans le temps ou fenêtre de X jours).",
    ],
    estimatedResume: "Septembre 2026",
  },
  {
    id: 3,
    subject: "Améliorations workflows V3 (août 2026)",
    objectif:
      "Différencier nettement la qualité de génération entre les trois plans, pour que le prix payé corresponde à une vraie différence de résultat — et que le plan haut de gamme justifie son tarif.",
    decisions: [
      "Plan Débutant (9,99 €) : 10 livres par mois, 20 chapitres maximum, workflow standard, doit fonctionner sans accroc — la fiabilité passe avant la richesse.",
      "Plan Expert (12,99 €) : 20 livres par mois, 40 chapitres maximum, workflow enrichi, accès aux presets Livre Illustré et Histoires du soir 3-7 ans.",
      "Plan Éditeur (59 €) : Mode Recherche Approfondie activé — le workflow va chercher les informations beaucoup plus loin avant d'écrire.",
      "Éditeur : enrichissement marché en amont du plan du livre (analyse de niche, concurrence, angle éditorial) injecté dans les prompts des agents.",
      "Éditeur : fiches produit KDP générées automatiquement (titre, sous-titre, description, mots-clés, catégories).",
      "Éditeur : pack ZIP complet de publication (manuscrit, couverture, métadonnées).",
      "Éditeur : qualité éditoriale renforcée avec passes de relecture supplémentaires.",
      "Principe directeur : « pour les autres cela doit fonctionner sans anicroches » — priorité à la stabilité sur les plans d'entrée.",
    ],
    technique: [
      "Paramétrage des limites livres/mois et chapitres par palier d'abonnement.",
      "Branchement conditionnel du Mode Recherche Approfondie sur le palier Éditeur.",
      "Étapes de workflow supplémentaires réservées au palier haut, avec garde-fous de coût.",
    ],
    reason: "Gelé : « dans le mois d'août on va perfectionner le workflow des 2 plans » et « on va aussi améliorer le workflow à 59 € beaucoup plus performant ».",
    reprise: [
      "Reprise en août 2026 selon le planning utilisateur.",
      "À faire en priorité avant le lancement des abonnements d'octobre 2026.",
    ],
    estimatedResume: "Août 2026 selon planning utilisateur",
  },
  {
    id: 4,
    subject: "KDP Pilot + lien affilié",
    objectif:
      "Alimenter l'outil en données Amazon réelles (et non estimées) pour la recherche de niche, et créer au passage une source de revenus complémentaire via l'affiliation.",
    decisions: [
      "Intégration de l'API Amazon Product Advertising (PA-API) pour récupérer des données réelles : BSR, volumes de mots-clés, notes et nombre d'avis des concurrents.",
      "Objectif affiché aux abonnés : « ils auront les vraies données de KDP », plus d'estimation approximative.",
      "Mise en place d'un lien affilié KDP Pilot : les abonnés qui souhaitent l'outil complet passent par ce lien, avec commission perçue.",
      "Piste étudiée : souscrire soi-même l'abonnement KDP Pilot à 19 €/mois comme source de données côté backend, mutualisée pour tous les abonnés, et ajuster les tarifs en conséquence.",
      "Les données réelles doivent être mises en cache pour maîtriser les coûts et les quotas d'appel.",
    ],
    technique: [
      "Fonction serveur dédiée à la recherche PA-API, clés stockées côté backend uniquement.",
      "Carte d'affiliation KDP Pilot à afficher dans les modules de recherche de niche.",
      "Cache des résultats par ASIN / mot-clé avec durée de validité.",
    ],
    reason: "En attente de réception des clés PA-API de l'utilisateur : « je te le donnerais je ne l'ai pas encore ».",
    reprise: [
      "Déblocage dès réception des clés PA-API (Access Key, Secret Key, Partner Tag).",
      "Décision à prendre en parallèle : prendre ou non l'abonnement KDP Pilot 19 €/mois côté backend.",
    ],
    estimatedResume: "Dès réception des clés",
  },
  {
    id: 5,
    subject: "Stratégie V4 (2027) — Maison d'Édition Professionnelle",
    objectif:
      "Construire en 2027 une véritable maison d'édition professionnelle assistée par IA, adossée à des données de marché précises, et non plus un simple générateur de livres.",
    decisions: [
      "Trois forfaits V4 validés : Auteur 19 €/mois, Studio 29 €/mois, Éditeur 79 €/mois.",
      "Positionnement : données de marché précises comme cœur de valeur, l'écriture devient une conséquence de l'analyse.",
      "Les acheteurs lifetime V2+V3 conservent V2 et V3 à vie, mais la V4 nécessitera un upgrade fidélité (tarif préférentiel, pas gratuit).",
      "Mention à ajouter dans les conditions : l'accès à vie couvre V2 et V3, pas les versions majeures suivantes.",
      "Périmètre arrêté : 15 modules (détaillés ci-dessous).",
      "Décision de lancement à reconfirmer après le lancement V3 d'octobre 2026 et les premiers retours d'abonnés.",
    ],
    technique: [
      "1. Market Intelligence Hub — tableau de bord central des données de marché : niches, tendances, saisonnalité, opportunités.",
      "2. Data Layer multi-sources — couche d'agrégation unifiée (PA-API, KDP Pilot, scraping de secours) avec cache et normalisation.",
      "3. Quota & metering — comptage précis des appels IA et data par abonné, plafonds par forfait, alertes de dépassement.",
      "4. Niche Validator — scoring d'une niche avant écriture : demande, concurrence, prix moyen, saturation, verdict go / no-go.",
      "5. Keyword Engine Pro — génération et qualification de mots-clés Amazon avec volumes réels et difficulté.",
      "6. Deep Research Writing — écriture adossée à une phase de recherche documentée, avec sources et notes conservées.",
      "7. Editorial Board — comité de relecture IA multi-rôles (éditeur, correcteur, lecteur cible) avec rapport de recommandations.",
      "8. Style DNA — capture du style d'un auteur et application cohérente sur tous ses ouvrages.",
      "9. Studio Illustration unifié — couvertures, intérieurs, BD, livres enfants dans une seule interface avec cohérence graphique.",
      "10. Séries & Univers — gestion de collections multi-volumes : bible d'univers, personnages récurrents, continuité narrative.",
      "11. Publication Pack KDP — pack de publication complet prêt à téléverser : manuscrit, couverture 300 DPI, métadonnées, catégories.",
      "12. Post-Launch Tracker — suivi après publication : évolution du BSR, avis, ventes estimées, alertes.",
      "13. Pricing Optimizer — recommandation de prix selon le marché et simulation de royalties.",
      "14. Ads & Lancement — plan de lancement et de campagnes publicitaires Amazon, budgets et mots-clés suggérés.",
      "15. Abonnements & entitlements — gestion complète des forfaits, upgrades, upgrade fidélité lifetime, résiliations.",
    ],
    reason: "Gelé : V4 prévue pour 2027, à décider après le lancement V3 — « et met cela en attente ».",
    reprise: [
      "Reprise fin 2026 / début 2027.",
      "Prérequis : lancement V3 d'octobre 2026 stabilisé, et données KDP réelles opérationnelles (sujet n°4).",
    ],
    estimatedResume: "Fin 2026 / début 2027",
  },
];

const ALL_IDS = attenteItems.map((i) => `item-${i.id}`);

export default function AdminAttentePage() {
  const nav = useNavigate();
  const [openItems, setOpenItems] = useState<string[]>(["item-1"]);
  const allOpen = openItems.length === ALL_IDS.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="container mx-auto max-w-5xl py-8 space-y-6">
        <AdminPanelNav />

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => nav('/admin')} className="rounded-xl">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour Admin
          </Button>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Snowflake className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Sujets en attente</h1>
            <p className="text-muted-foreground">Intégralité des décisions prises et gelées — {attenteItems.length} sujets</p>
          </div>
        </div>

        <Card className="border-primary/20 bg-primary/5 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div className="space-y-1">
              <h2 className="font-semibold">Règle de conduite</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Aucun code, migration, edge function ou modification de base de données ne sera effectué sur ces sujets
                avant la date de reprise indiquée ou une nouvelle décision explicite. Chaque fiche ci-dessous contient
                l'intégralité de ce qui a été décidé : objectif, décisions actées, détail technique, raison du gel et
                conditions de reprise.
              </p>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => setOpenItems(allOpen ? [] : ALL_IDS)}
          >
            {allOpen ? "Tout replier" : "Tout déplier"}
          </Button>
        </div>

        <Accordion
          type="multiple"
          value={openItems}
          onValueChange={setOpenItems}
          className="space-y-4"
        >
          {attenteItems.map((item) => (
            <AccordionItem
              key={item.id}
              value={`item-${item.id}`}
              className="rounded-xl border bg-card px-5 shadow-sm"
            >
              <AccordionTrigger className="py-5 hover:no-underline">
                <div className="flex flex-1 flex-col items-start gap-3 pr-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 text-left">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                      {item.id}
                    </span>
                    <span className="text-lg font-semibold">{item.subject}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Snowflake className="h-3 w-3" />
                      Gelé
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Calendar className="h-3 w-3" />
                      {item.estimatedResume}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pb-6">
                <div className="space-y-6 border-t pt-5">
                  <section className="space-y-2">
                    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <Target className="h-3.5 w-3.5" />
                      Objectif
                    </h3>
                    <p className="text-sm leading-relaxed text-foreground">{item.objectif}</p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Décisions actées ({item.decisions.length})
                    </h3>
                    <ul className="space-y-2">
                      {item.decisions.map((d, idx) => (
                        <li key={idx} className="flex gap-2.5 text-sm leading-relaxed text-foreground">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {item.technique && item.technique.length > 0 && (
                    <section className="space-y-2 rounded-lg border bg-muted/40 p-4">
                      <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <Wrench className="h-3.5 w-3.5" />
                        {item.id === 5 ? `Les 15 modules prévus` : "Détail technique prévu"}
                      </h3>
                      <ul className="space-y-2">
                        {item.technique.map((t, idx) => (
                          <li key={idx} className="flex gap-2.5 text-sm leading-relaxed text-foreground">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  <section className="space-y-1.5 rounded-lg border border-amber-200/60 bg-amber-50/60 p-4">
                    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
                      <PauseCircle className="h-3.5 w-3.5" />
                      Pourquoi gelé
                    </h3>
                    <p className="text-sm leading-relaxed text-amber-900">{item.reason}</p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <KeyRound className="h-3.5 w-3.5" />
                      Conditions de reprise
                    </h3>
                    <ul className="space-y-2">
                      {item.reprise.map((r, idx) => (
                        <li key={idx} className="flex gap-2.5 text-sm leading-relaxed text-foreground">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
