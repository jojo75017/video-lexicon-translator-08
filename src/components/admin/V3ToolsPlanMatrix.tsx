import { V2_TOOLS, V2_TOOL_CATEGORIES, type V2Tool } from '@/data/v2ToolsRegistry';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Lock } from 'lucide-react';
import { planForTool } from '@/data/v3ToolPlans';

/**
 * Répartition des outils V3 par forfait (Plume / Édition).
 * Source de vérité : `src/data/v3ToolPlans.ts` (partagée avec le hub V3).
 */
const planFor = (tool: V2Tool) => planForTool(tool);

const Cell = ({ ok }: { ok: boolean }) =>
  ok ? <Check className="h-4 w-4 text-green-600 inline" /> : <Lock className="h-4 w-4 text-muted-foreground inline" />;

export function V3ToolsPlanMatrix() {
  const counts = { plume: 0, edition: V2_TOOLS.length };
  V2_TOOLS.forEach((t) => {
    if (planFor(t) === 'plume') counts.plume++;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Outils V3 — Répartition par forfait ({V2_TOOLS.length} outils)</span>
          <span className="text-xs font-normal text-muted-foreground">
            Plume : {counts.plume} · Édition : {counts.edition}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {V2_TOOL_CATEGORIES.map((cat) => {
          const tools = V2_TOOLS.filter((t) => t.category === cat.id);
          if (tools.length === 0) return null;
          return (
            <div key={cat.id}>
              <h3 className="font-semibold text-sm mb-2">
                <span className="mr-1">{cat.emoji}</span>
                {cat.label}
                <span className="ml-2 text-xs text-muted-foreground">({tools.length})</span>
              </h3>
              <div className="overflow-x-auto rounded-md border">
                <table className="w-full min-w-[620px] text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Outil</th>
                      <th className="px-3 py-2 text-left font-medium hidden md:table-cell">Route</th>
                      <th className="px-3 py-2 text-center font-medium text-emerald-600 w-24">Plume</th>
                      <th className="px-3 py-2 text-center font-medium text-purple-600 w-24">Édition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tools.map((t, i) => {
                      const okPlume = planFor(t) === 'plume';
                      return (
                        <tr key={t.id} className={i % 2 ? 'bg-muted/20' : ''}>
                          <td className="px-3 py-2">
                            <div className="font-medium">{t.label}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">{t.description}</div>
                          </td>
                          <td className="px-3 py-2 text-xs text-muted-foreground hidden md:table-cell font-mono">{t.route}</td>
                          <td className="px-3 py-2 text-center"><Cell ok={okPlume} /></td>
                          <td className="px-3 py-2 text-center"><Cell ok={true} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
