import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Lock, Radar, Sparkles, Infinity as InfinityIcon } from "lucide-react";
import { KDP_PILOT_TIERS } from "@/data/kdpPilotTiers";
import type { V3PlanId } from "@/data/v3Pricing";

const ORDER: V3PlanId[] = ["plume", "edition"];

const TIER_COLOR: Record<V3PlanId, string> = {
  plume: "border-l-emerald-500",
  edition: "border-l-purple-600",
};

const BSR_LABEL: Record<string, string> = {
  static: "Snapshot (à l'instant T)",
  daily: "Actualisé chaque jour",
  live: "Live temps réel + historique 30 j",
};

const DEPTH_LABEL: Record<string, string> = {
  basic: "Score global",
  advanced: "Scoring détaillé par critère",
  expert: "12 critères pondérés + benchmark",
};

export function KdpPilotTiersMatrix() {
  return (
    <Card className="border-2 border-teal-500/40 bg-teal-50/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radar className="h-5 w-5 text-teal-600" />
          KDP Pilot — Configuration par forfait
          <Badge variant="outline" className="ml-2">P27 / P27+</Badge>
        </CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">
          Trois niveaux d'audit KDP : complet (Plume), Pro renforcé (Édition) et tout inclus (Studio Pro).
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {ORDER.map((id) => {
            const tier = KDP_PILOT_TIERS[id];
            return (
              <div key={id} className={`rounded-xl border border-border border-l-4 ${TIER_COLOR[id]} bg-card p-4 shadow-sm`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {tier.planId}
                    </div>
                    <div className="text-base font-bold text-foreground">{tier.label}</div>
                  </div>
                  <Badge variant={tier.version === "pro" ? "default" : "secondary"}>
                    {tier.version === "pro" && <Sparkles className="mr-1 h-3 w-3" />}
                    {tier.agentCode}
                  </Badge>
                </div>

                <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  <li>
                    <strong className="text-foreground">Audits :</strong>{" "}
                    {tier.runsPerMonth === null ? (
                      <span className="inline-flex items-center gap-1 font-medium text-teal-700">
                        <InfinityIcon className="h-3 w-3" /> illimités
                      </span>
                    ) : (
                      `${tier.runsPerMonth} / mois`
                    )}
                  </li>
                  <li><strong className="text-foreground">Scoring :</strong> {DEPTH_LABEL[tier.scoreDepth]}</li>
                  <li><strong className="text-foreground">BSR :</strong> {BSR_LABEL[tier.bsrMode]}</li>
                  <li><strong className="text-foreground">Mots-clés :</strong> {tier.keywordSuggestions} suggestions</li>
                </ul>

                <ul className="mt-4 space-y-1.5">
                  {tier.features.map((f) => (
                    <li key={f.key} className="flex items-start gap-2 text-xs">
                      {f.included ? (
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                      ) : (
                        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                      )}
                      <span className={f.included ? "text-foreground" : "text-muted-foreground/60 line-through"}>
                        <strong>{f.label}</strong>
                        <span className="ml-1 font-normal">— {f.description}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default KdpPilotTiersMatrix;
