import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface ErrorLog {
  id: string;
  created_at: string;
  user_email: string | null;
  error_type: string;
  error_message: string;
  error_stack: string | null;
  url: string | null;
  severity: string;
  context: any;
}

const SEVERITY_COLORS: Record<string, string> = {
  info: "bg-blue-500/10 text-blue-700 border-blue-200",
  warning: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  error: "bg-orange-500/10 text-orange-700 border-orange-200",
  critical: "bg-red-500/10 text-red-700 border-red-200",
};

export const ErrorLogsViewer = () => {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, lastHour: 0, critical: 0 });

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("error_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      toast.error("Erreur chargement logs : " + error.message);
      setLoading(false);
      return;
    }

    const all = (data || []) as ErrorLog[];
    setLogs(all);

    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    setStats({
      total: all.length,
      lastHour: all.filter((l) => new Date(l.created_at).getTime() >= oneHourAgo).length,
      critical: all.filter((l) => l.severity === "critical").length,
    });
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const purgeOld = async () => {
    if (!confirm("Supprimer toutes les erreurs de plus de 7 jours ?")) return;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { error } = await supabase.from("error_logs").delete().lt("created_at", sevenDaysAgo);
    if (error) toast.error(error.message);
    else {
      toast.success("Erreurs purgées");
      load();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Erreurs production
        </CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button size="sm" variant="outline" onClick={purgeOld}>
            <Trash2 className="h-4 w-4 mr-1" /> Purger &gt; 7j
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Total (200 dernières)</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Dernière heure</div>
            <div className="text-2xl font-bold">{stats.lastHour}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Critiques</div>
            <div className="text-2xl font-bold text-destructive">{stats.critical}</div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Aucune erreur 🎉</p>
        ) : (
          <div className="h-[500px] overflow-y-auto pr-3">
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="rounded-lg border p-3 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={SEVERITY_COLORS[log.severity]}>
                        {log.severity}
                      </Badge>
                      <span className="font-mono text-xs">{log.error_type}</span>
                      {log.user_email && (
                        <span className="text-xs text-muted-foreground">{log.user_email}</span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString("fr-FR")}
                    </span>
                  </div>
                  <p className="mt-1 text-foreground">{log.error_message}</p>
                  {log.url && (
                    <p className="mt-1 text-xs text-muted-foreground truncate">{log.url}</p>
                  )}
                  {log.error_stack && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer text-muted-foreground">
                        Stack trace
                      </summary>
                      <pre className="mt-1 text-xs whitespace-pre-wrap bg-muted p-2 rounded max-h-40 overflow-auto">
                        {log.error_stack}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
