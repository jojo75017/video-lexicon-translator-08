// Maintenance quotidienne des essais gratuits 7 jours.
//
// Passage automatique (cron) :
//   1. J+7  → statut « expire », accès applicatif en lecture seule ;
//   2. reprise de la file Systeme.io (contacts non synchronisés) ;
//   3. après achat → statut « converti », tag ESSAI retiré + tag CLIENT ajouté.
//
// Actions admin (POST authentifié) : { action: 'expire' | 'retry' | 'convert', id }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import {
  findSystemeIoContactId,
  pushToSystemeIo,
  pushTrialContact,
  removeSystemeIoTag,
} from "../_shared/systemeio.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TRIAL_TAG = "ESSAI_EBOOKSTUDIO";
const CLIENT_TAG = "CLIENT_EBOOKSTUDIO";
const MAX_ATTEMPTS = 6;

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

/** Coupe l'accès applicatif : le livre reste visible, en lecture seule. */
async function lockSubscriber(email: string) {
  await admin
    .from("subscribers")
    .update({ status: "expired" })
    .ilike("email", email)
    .eq("plan_tier", "essai");
}

async function expireTrial(id: string, email: string) {
  await admin
    .from("free_trials")
    .update({ status: "expire", expired_at: new Date().toISOString() })
    .eq("id", id);
  await lockSubscriber(email);
}

/** Bascule un essai en « converti » et neutralise la relance côté Systeme.io. */
async function convertTrial(row: { id: string; email: string; first_name: string | null; systemeio_contact_id: string | null }) {
  await admin
    .from("free_trials")
    .update({ status: "converti", converted_at: new Date().toISOString() })
    .eq("id", row.id);

  let tagged = false;
  try {
    const res = await pushToSystemeIo(row.email, row.first_name ?? "", [CLIENT_TAG]);
    tagged = res.ok;
    const contactId = res.contactId ?? row.systemeio_contact_id ??
      (await findSystemeIoContactId(row.email));
    if (contactId) await removeSystemeIoTag(contactId, TRIAL_TAG);
    if (res.ok) {
      await admin
        .from("free_trials")
        .update({ client_tag_synced_at: new Date().toISOString() })
        .eq("id", row.id);
    }
  } catch (e) {
    console.error("convertTrial systemeio error", row.email, (e as Error).message);
  }
  return tagged;
}

/** Rejoue l'envoi vers Systeme.io pour un essai non synchronisé. */
async function retrySync(row: {
  id: string; email: string; first_name: string | null; ends_at: string; systemeio_attempts: number;
}) {
  try {
    const res = await pushTrialContact(row.email, row.first_name ?? "", [TRIAL_TAG], [
      { slug: "source", value: "lovable" },
      { slug: "date_fin_essai", value: new Date(row.ends_at).toLocaleDateString("fr-FR") },
    ]);
    const attempts = (row.systemeio_attempts ?? 0) + 1;
    // Reprise exponentielle : 10 min, 20, 40, 80… puis abandon après 6 essais.
    const delayMs = Math.min(10 * 60_000 * 2 ** (attempts - 1), 12 * 3600_000);
    await admin
      .from("free_trials")
      .update({
        systemeio_synced_at: res.ok ? new Date().toISOString() : null,
        ...(res.contactId ? { systemeio_contact_id: String(res.contactId) } : {}),
        systemeio_attempts: attempts,
        systemeio_last_error: res.ok ? null : (res.detail ?? "unknown"),
        systemeio_next_attempt_at: res.ok || attempts >= MAX_ATTEMPTS
          ? null
          : new Date(Date.now() + delayMs).toISOString(),
      })
      .eq("id", row.id);
    return res.ok;
  } catch (e) {
    await admin
      .from("free_trials")
      .update({
        systemeio_attempts: (row.systemeio_attempts ?? 0) + 1,
        systemeio_last_error: (e as Error).message.slice(0, 300),
        systemeio_next_attempt_at: new Date(Date.now() + 30 * 60_000).toISOString(),
      })
      .eq("id", row.id);
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const action = typeof body.action === "string" ? body.action : null;

  // --- Actions admin ---------------------------------------------------------
  if (action) {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
    const { data: { user } } = await admin.auth.getUser(token);
    if (!user) return json({ ok: false, error: "Non authentifié" }, 401);
    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return json({ ok: false, error: "Accès refusé" }, 403);

    const id = String(body.id || "");
    const { data: row } = await admin.from("free_trials").select("*").eq("id", id).maybeSingle();
    if (!row) return json({ ok: false, error: "Essai introuvable" }, 404);

    if (action === "expire") {
      await expireTrial(row.id, row.email);
      return json({ ok: true, status: "expire" });
    }
    if (action === "convert") {
      const tagged = await convertTrial(row);
      return json({ ok: true, status: "converti", tagged });
    }
    if (action === "retry") {
      const ok = await retrySync(row);
      return json({ ok, retried: true });
    }
    return json({ ok: false, error: "Action inconnue" }, 400);
  }

  // --- Passage automatique ---------------------------------------------------
  const nowIso = new Date().toISOString();
  const report = { expired: 0, retried: 0, retrySuccess: 0, converted: 0 };

  // 1) Essais arrivés à échéance
  const { data: due } = await admin
    .from("free_trials")
    .select("id, email")
    .eq("status", "actif")
    .lte("ends_at", nowIso)
    .limit(500);
  for (const t of due ?? []) {
    await expireTrial(t.id, t.email);
    report.expired++;
  }

  // 2) File de reprise Systeme.io
  const { data: pending } = await admin
    .from("free_trials")
    .select("id, email, first_name, ends_at, systemeio_attempts")
    .is("systemeio_synced_at", null)
    .lt("systemeio_attempts", MAX_ATTEMPTS)
    .or(`systemeio_next_attempt_at.is.null,systemeio_next_attempt_at.lte.${nowIso}`)
    .limit(100);
  for (const t of pending ?? []) {
    report.retried++;
    if (await retrySync(t)) report.retrySuccess++;
  }

  // 3) Essais devenus clients (commande payée sur le même email)
  const { data: open } = await admin
    .from("free_trials")
    .select("id, email, first_name, systemeio_contact_id")
    .neq("status", "converti")
    .limit(500);
  for (const t of open ?? []) {
    const { data: paid } = await admin
      .from("funnel_orders")
      .select("id")
      .ilike("email", t.email)
      .eq("status", "paid")
      .limit(1);
    if (paid && paid.length > 0) {
      await convertTrial(t);
      report.converted++;
    }
  }

  console.log("trials-maintenance", report);
  return json({ ok: true, ...report });
});
