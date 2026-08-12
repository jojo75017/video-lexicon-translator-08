import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";

/**
 * Santé des emails : rend la délivrabilité visible.
 *
 * Le webhook Resend n'ayant remonté aucun évènement, cette fonction interroge
 * directement l'API Resend (`GET /emails/:id`) pour chaque envoi dont le
 * `last_event` est inconnu, puis met à jour `email_send_log`.
 *
 * Modes :
 *  - `status`   : agrégats (envoyés / livrés / rebonds / plaintes / ouvertures / clics)
 *  - `sync`     : interroge Resend pour les envois sans évènement connu
 *  - `hygiene`  : coupe l'envoi automatique pour les rebonds durs et les
 *                 adresses jamais ouvertes après 5 envois (mode `preview` sans écriture)
 *
 * Sécurité : admin (has_role) ou secret cron.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

const RESEND_API = "https://api.resend.com/emails";
const MAX_SYNC = 200;
const NEVER_OPENED_MIN_SENDS = 5;

const isTestAddress = (email: string) =>
  /@example\.com$/i.test(email) || /^test[.\-+]/i.test(email) || email.includes("+test@");

async function isAdmin(req: Request, baseUrl: string) {
  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return false;
  const client = createClient(baseUrl, Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
    global: { headers: { Authorization: authorization } },
  });
  const { data } = await client.auth.getUser();
  if (!data.user) return false;
  const { data: allowed } = await client.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
  return allowed === true;
}

/** Traduit un `last_event` Resend en statut interne. */
function statusFromEvent(event: string): string | null {
  if (event === "delivered" || event === "opened" || event === "clicked") return "delivered";
  if (event === "bounced" || event === "complained" || event === "failed") return "error";
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const respond = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const baseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const db = createClient(baseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    const body = await req.json().catch(() => ({}));
    const mode = String((body as { mode?: string }).mode || "status");
    const days = Math.min(Math.max(Number((body as { days?: number }).days) || 14, 1), 90);

    const { data: cronSecret } = await db.from("app_secrets").select("value").eq("key", "cron_secret").maybeSingle();
    const hasCronSecret = !!cronSecret?.value && req.headers.get("x-cron-secret") === cronSecret.value;
    if (!hasCronSecret && !(await isAdmin(req, baseUrl))) {
      return respond({ error: "Accès administrateur requis" }, 403);
    }

    const since = new Date(Date.now() - days * 86_400_000).toISOString();

    // ---------------------------------------------------------------- status
    if (mode === "status") {
      const { data: logs } = await db
        .from("email_send_log")
        .select("template_name,status,last_event,recipient_email")
        .gte("created_at", since)
        .limit(20000);

      const rows = logs || [];
      const byTemplate = new Map<string, {
        template: string; sent: number; delivered: number; bounced: number;
        complained: number; failed: number; unknown: number;
      }>();

      for (const r of rows) {
        const key = String(r.template_name || "(sans modèle)");
        const entry = byTemplate.get(key) ?? {
          template: key, sent: 0, delivered: 0, bounced: 0, complained: 0, failed: 0, unknown: 0,
        };
        entry.sent++;
        const ev = String(r.last_event || "");
        if (ev === "delivered" || ev === "opened" || ev === "clicked") entry.delivered++;
        else if (ev === "bounced") entry.bounced++;
        else if (ev === "complained") entry.complained++;
        else if (r.status === "failed" || r.status === "error") entry.failed++;
        else entry.unknown++;
        byTemplate.set(key, entry);
      }

      const { count: opens } = await db
        .from("email_opens").select("id", { count: "exact", head: true }).gte("opened_at", since);
      const { count: clicks } = await db
        .from("email_clicks").select("id", { count: "exact", head: true }).gte("clicked_at", since);

      const totals = [...byTemplate.values()].reduce(
        (a, t) => ({
          sent: a.sent + t.sent, delivered: a.delivered + t.delivered, bounced: a.bounced + t.bounced,
          complained: a.complained + t.complained, failed: a.failed + t.failed, unknown: a.unknown + t.unknown,
        }),
        { sent: 0, delivered: 0, bounced: 0, complained: 0, failed: 0, unknown: 0 },
      );

      return respond({
        success: true, mode, days,
        totals: { ...totals, opens: opens ?? 0, clicks: clicks ?? 0 },
        templates: [...byTemplate.values()].sort((a, b) => b.sent - a.sent).slice(0, 30),
        resend_key_configured: !!Deno.env.get("RESEND_API_KEY"),
      });
    }

    // ------------------------------------------------------------------ sync
    if (mode === "sync") {
      const apiKey = Deno.env.get("RESEND_API_KEY");
      if (!apiKey) return respond({ error: "RESEND_API_KEY manquante" }, 400);

      const { data: pending } = await db
        .from("email_send_log")
        .select("id,message_id,recipient_email")
        .is("last_event", null)
        .not("message_id", "is", null)
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(MAX_SYNC);

      let checked = 0, updated = 0, unknown = 0;
      const events: Record<string, number> = {};

      for (const row of pending || []) {
        const id = String(row.message_id || "");
        // Les identifiants internes de repli ne sont pas des ID Resend.
        if (!/^[0-9a-f-]{30,40}$/i.test(id)) { unknown++; continue; }
        checked++;
        try {
          const res = await fetch(`${RESEND_API}/${id}`, {
            headers: { Authorization: `Bearer ${apiKey}` },
          });
          if (!res.ok) { unknown++; await new Promise((r) => setTimeout(r, 120)); continue; }
          const payload = await res.json() as { last_event?: string };
          const event = String(payload.last_event || "").trim();
          if (event) {
            events[event] = (events[event] ?? 0) + 1;
            const update: Record<string, unknown> = { last_event: event };
            const st = statusFromEvent(event);
            if (st) update.status = st;
            await db.from("email_send_log").update(update).eq("id", row.id);
            updated++;
          } else {
            unknown++;
          }
        } catch {
          unknown++;
        }
        // Resend limite à 2 requêtes/seconde.
        await new Promise((r) => setTimeout(r, 520));
      }

      return respond({ success: true, mode, candidates: (pending || []).length, checked, updated, unknown, events });
    }

    // --------------------------------------------------------------- hygiene
    if (mode === "hygiene" || mode === "hygiene_preview") {
      const apply = mode === "hygiene";

      // 1. Rebonds durs et plaintes relevés dans le journal d'envoi.
      const { data: bad } = await db
        .from("email_send_log")
        .select("recipient_email,last_event")
        .in("last_event", ["bounced", "complained"])
        .limit(20000);
      const bounced = new Set(
        (bad || []).map((r) => String(r.recipient_email || "").trim().toLowerCase()).filter(Boolean),
      );

      // 2. Adresses jamais ouvertes après plusieurs envois.
      const { data: allLogs } = await db
        .from("email_send_log")
        .select("recipient_email")
        .in("status", ["sent", "delivered"])
        .limit(50000);
      const sendCount = new Map<string, number>();
      for (const r of allLogs || []) {
        const e = String(r.recipient_email || "").trim().toLowerCase();
        if (!e) continue;
        sendCount.set(e, (sendCount.get(e) ?? 0) + 1);
      }
      const { data: openRows } = await db.from("email_opens").select("prospect_email").limit(50000);
      const openers = new Set(
        (openRows || []).map((r) => String(r.prospect_email || "").trim().toLowerCase()),
      );
      const neverOpened = [...sendCount.entries()]
        .filter(([e, n]) => n >= NEVER_OPENED_MIN_SENDS && !openers.has(e) && !bounced.has(e))
        .map(([e]) => e);

      // Restreint aux prospects encore actifs, hors adresses de test.
      const { data: prospects } = await db
        .from("sales_prospects")
        .select("id,email,auto_send,status")
        .eq("auto_send", true)
        .limit(20000);

      const toBounce: string[] = [];
      const toPause: string[] = [];
      for (const p of prospects || []) {
        const e = String(p.email || "").trim().toLowerCase();
        if (!e || isTestAddress(e)) continue;
        if (bounced.has(e)) toBounce.push(e);
        else if (neverOpened.includes(e)) toPause.push(e);
      }

      if (apply) {
        if (toBounce.length) {
          await db.from("sales_prospects")
            .update({ auto_send: false, status: "bounced" })
            .in("email", toBounce);
        }
        if (toPause.length) {
          await db.from("sales_prospects")
            .update({ auto_send: false, status: "inactif" })
            .in("email", toPause);
        }
      }

      return respond({
        success: true, mode, applied: apply,
        bounced_paused: toBounce.length,
        never_opened_paused: toPause.length,
        sample_bounced: toBounce.slice(0, 10),
        sample_never_opened: toPause.slice(0, 10),
      });
    }

    return respond({ error: `Mode inconnu : ${mode}` }, 400);
  } catch (e) {
    console.error("email-health-sync error:", e);
    return respond({ error: e instanceof Error ? e.message : "Erreur inconnue" }, 500);
  }
});
