import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Quota = { plan: string; books_used: number; books_limit: number; covers_used: number; covers_limit: number };

const PLAN_LABEL: Record<string, string> = {
  v3m_debutant_monthly: "Débutant · 19 €/mois",
  v3m_auteur_monthly: "Auteur · 29 €/mois",
  v3m_vip_monthly: "Édition VIP · 59 €/mois",
};

/** Affiché seulement pour les abonnés mensuels : quotas du mois + gestion/arrêt de l'abonnement. */
export function V3MonthlySubscriptionCard() {
  const [q, setQ] = useState<Quota | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (supabase as any).rpc("get_my_monthly_quota").then(({ data }: any) => {
      if (Array.isArray(data) && data[0]?.plan) setQ(data[0]);
    });
  }, []);

  if (!q) return null;

  const openPortal = async () => {
    setBusy(true); setErr(null);
    const win = window.open("", "_blank");
    const { data, error } = await supabase.functions.invoke("v3-subscription-portal", {
      body: { returnUrl: window.location.href },
    });
    setBusy(false);
    if (error || !data?.url) { win?.close(); setErr("Impossible d'ouvrir la gestion de l'abonnement. Réessayez dans un instant."); return; }
    if (win) win.location.href = data.url; else window.location.href = data.url;
  };

  const bar = (used: number, limit: number) => {
    const pct = limit === -1 ? 0 : Math.min(100, Math.round((used / Math.max(1, limit)) * 100));
    return (
      <div className="h-2 rounded-full mt-1" style={{ background: "#e5e7eb" }}>
        <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: pct >= 100 ? "#B91C1C" : "#008296" }} />
      </div>
    );
  };

  return (
    <div className="rounded-2xl bg-white p-5 border mb-8" style={{ borderColor: "#e5e7eb" }}>
      <h2 className="text-lg font-serif mb-1" style={{ color: "#232F3E" }}>Mon abonnement mensuel</h2>
      <p className="text-sm mb-4" style={{ color: "#6b7280" }}>{PLAN_LABEL[q.plan] ?? q.plan} — compteurs remis à zéro le 1er de chaque mois.</p>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm" style={{ color: "#232F3E" }}>
            Livres ce mois : <b>{q.books_used}</b> / {q.books_limit === -1 ? "illimité" : q.books_limit}
          </div>
          {bar(q.books_used, q.books_limit)}
        </div>
        <div>
          <div className="text-sm" style={{ color: "#232F3E" }}>
            Couvertures ce mois : <b>{q.covers_used}</b> / {q.covers_limit}
          </div>
          {bar(q.covers_used, q.covers_limit)}
        </div>
      </div>
      <button
        type="button"
        onClick={openPortal}
        disabled={busy}
        className="v3-flat-btn rounded-lg px-4 py-2 text-sm font-semibold"
        style={{ background: "#232F3E", color: "#fff" }}
      >
        {busy ? "Ouverture…" : "Gérer ou arrêter mon abonnement"}
      </button>
      <p className="text-xs mt-2" style={{ color: "#6b7280" }}>
        Sans engagement : si vous arrêtez, vous gardez l'accès jusqu'à la fin du mois déjà payé.
      </p>
      {err && <p className="text-sm mt-2" style={{ color: "#B91C1C" }}>{err}</p>}
    </div>
  );
}
