// Inscription d'un membre fondateur à la liste d'attente du 1er octobre.
// Appelée après la création du compte / du paiement : le rang est attribué
// par la base, jamais par le client.
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

const ALLOWED_PLANS = new Set(["plume", "edition"]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ error: "Méthode non autorisée" }, 405);

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return json({ error: "Non authentifié" }, 401);
    const { data: auth, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !auth?.user?.email) return json({ error: "Non authentifié" }, 401);

    const body = await req.json().catch(() => ({}));
    const plan = String(body?.plan ?? "plume");
    if (!ALLOWED_PLANS.has(plan)) return json({ error: "Forfait invalide" }, 400);
    const interval = body?.interval === "year" ? "year" : "month";
    const trialChapterId = /^[0-9a-f-]{36}$/.test(String(body?.trialChapterId ?? ""))
      ? String(body.trialChapterId)
      : null;

    const email = auth.user.email.toLowerCase();

    const { data: existing } = await supabase
      .from("launch_waitlist")
      .select("id, rank, plan, billing_interval, status, trial_ends_at")
      .ilike("email", email)
      .maybeSingle();

    if (existing) {
      const { data: updated } = await supabase
        .from("launch_waitlist")
        .update({
          plan,
          billing_interval: interval,
          user_id: auth.user.id,
          ...(trialChapterId && { trial_chapter_id: trialChapterId }),
        })
        .eq("id", existing.id)
        .select("id, rank, plan, billing_interval, status, trial_ends_at")
        .single();
      return json({ entry: updated ?? existing });
    }

    const { data: created, error } = await supabase
      .from("launch_waitlist")
      .insert({
        email,
        user_id: auth.user.id,
        plan,
        billing_interval: interval,
        status: "pending",
        trial_ends_at: "2026-11-01T07:00:00Z",
        trial_chapter_id: trialChapterId,
        source: String(body?.source ?? "essai").slice(0, 60),
      })
      .select("id, rank, plan, billing_interval, status, trial_ends_at")
      .single();
    if (error) throw error;

    // On relie l'essai gratuit au compte créé : le chapitre 1 sera retrouvé
    // dans la salle d'attente puis dans le studio le 1er octobre.
    if (trialChapterId) {
      await supabase
        .from("trial_chapters")
        .update({
          converted_user_id: auth.user.id,
          converted_at: new Date().toISOString(),
          status: "converted",
          email,
        })
        .eq("id", trialChapterId);
    }

    return json({ entry: created });
  } catch (e) {
    console.error("launch-waitlist-join error", e);
    return json({ error: (e as Error).message ?? "Erreur inconnue" }, 400);
  }
});
