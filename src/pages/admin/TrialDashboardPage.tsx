import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import { Users, Mail, CheckCircle2, TrendingUp, Loader2, RefreshCw } from "lucide-react";

interface Stats {
  trials_today: number;
  emails_collected: number;
  total_trials: number;
  customers: number;
  conversion_rate: number;
}

const TEAL = "#008296";

export default function TrialDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("trial-stats");
      if (fnError) throw fnError;
      if (!data?.ok) throw new Error(data?.error || "Erreur");
      setStats(data);
    } catch (e) {
      console.error("trial-stats failed:", e);
      setError("Impossible de charger les statistiques.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cards = stats
    ? [
        { label: "Demandes d'essai aujourd'hui", value: stats.trials_today, icon: Users, color: TEAL },
        { label: "Emails collectés", value: stats.emails_collected, icon: Mail, color: "#FF9E2D" },
        { label: "Essais convertis en clients", value: stats.customers, icon: CheckCircle2, color: "#16a34a" },
        { label: "Taux de conversion Essai → Client", value: `${stats.conversion_rate}%`, icon: TrendingUp, color: "#7c3aed" },
      ]
    : [];

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "#FAFAFA", color: "#232F3E" }}>
      <Helmet>
        <title>Tableau de bord — Tunnel d'essai</title>
      </Helmet>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">Tunnel d'essai gratuit</h1>
            <p className="text-muted-foreground" style={{ color: "#5b6472" }}>
              Vos indicateurs clés Visiteur → Essai → Client.
            </p>
          </div>
          <button
            onClick={load}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-white"
            style={{ background: TEAL }}
          >
            <RefreshCw className="w-4 h-4" /> Actualiser
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: TEAL }} />
          </div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {cards.map((c) => {
                const Icon = c.icon;
                return (
                  <div
                    key={c.label}
                    className="rounded-2xl bg-white p-6"
                    style={{ boxShadow: "0 10px 30px -12px rgba(0,0,0,0.12)", border: "1px solid #eef1f4" }}
                  >
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${c.color}1a` }}>
                      <Icon className="w-6 h-6" style={{ color: c.color }} />
                    </div>
                    <div className="text-3xl font-extrabold mb-1">{c.value}</div>
                    <div className="text-sm text-muted-foreground" style={{ color: "#5b6472" }}>{c.label}</div>
                  </div>
                );
              })}
            </div>
            {stats && (
              <p className="text-sm text-muted-foreground mt-6" style={{ color: "#7a8492" }}>
                Total d'essais démarrés (toutes dates) : <strong>{stats.total_trials}</strong>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
