/**
 * Source unique du quota de l'opération fondateur (15 jours / 15 places à 47 €).
 * Partagé entre le compteur public et le paiement, pour que la limite soit
 * réellement opposable et pas seulement affichée.
 *
 * Doit rester aligné avec `src/data/offreFondateur.ts`.
 */
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";

export const FONDATEUR_START_ISO = "2026-09-30T00:00:00Z";
export const FONDATEUR_END_ISO = "2026-10-15T21:59:59Z";
export const FONDATEUR_SEATS = 15;
export const FONDATEUR_PLAN = "v2_1x";

/** Statuts qui signifient « réellement payé ». */
const PAID = ["active", "completed", "paid"];

export interface FondateurStatus {
  sold: number;
  remaining: number;
  seats: number;
  closed: boolean;
  reason: "open" | "sold_out" | "expired";
  endsAt: string;
}

/**
 * Compte les places consommées. Un même acheteur ne consomme qu'une place.
 * En cas d'incident de lecture, on renvoie l'offre ouverte : on ne bloque
 * jamais une vente à cause d'une panne technique.
 */
export async function getFondateurStatus(db: SupabaseClient): Promise<FondateurStatus> {
  const open = (sold: number): FondateurStatus => {
    const remaining = Math.max(0, FONDATEUR_SEATS - sold);
    const expired = Date.now() > new Date(FONDATEUR_END_ISO).getTime();
    const soldOut = remaining === 0;
    return {
      sold,
      remaining,
      seats: FONDATEUR_SEATS,
      closed: expired || soldOut,
      reason: soldOut ? "sold_out" : expired ? "expired" : "open",
      endsAt: FONDATEUR_END_ISO,
    };
  };

  try {
    const { data: orders, error } = await db
      .from("v3_installment_orders")
      .select("email")
      .eq("plan", FONDATEUR_PLAN)
      .in("status", PAID)
      .gte("created_at", FONDATEUR_START_ISO);
    if (error) throw new Error(error.message);

    const { data: funnel } = await db
      .from("funnel_orders")
      .select("email")
      .eq("status", "paid")
      .gte("created_at", FONDATEUR_START_ISO);

    const buyers = new Set<string>();
    for (const row of [...(orders ?? []), ...(funnel ?? [])]) {
      const e = String((row as { email?: string }).email ?? "").trim().toLowerCase();
      if (e) buyers.add(e);
    }
    return open(buyers.size);
  } catch (err) {
    console.error("getFondateurStatus error", err);
    return open(0);
  }
}
