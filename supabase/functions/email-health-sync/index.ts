import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { FROM_CAMPAIGN, REPLY_TO } from "../_shared/emailIdentity.ts";
import { sendResendEmailThrottled } from "../_shared/resendThrottle.ts";

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
 *  - `diagnostic` : contrôle SPF/DKIM/DMARC et capacité de la clé
 *  - `deliverability_test` : envoi [TEST] vers Gmail/Outlook/Yahoo pour vérifier l'arrivée
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

const SEND_DOMAIN = "ebookstudio.fr";
const FROM_ADDRESS = `noreply@${SEND_DOMAIN}`;
const REPLY_TO_ADDRESS = "support@georgesboubet.com";

/** Lit un enregistrement TXT public (résolveur DNS de Google). */
async function txtRecord(name: string): Promise<string> {
  try {
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(name)}&type=TXT`);
    if (!res.ok) return "";
    const payload = await res.json() as { Answer?: Array<{ data?: string }> };
    return (payload.Answer || [])
      .map((a) => String(a.data || "").replace(/^"|"$/g, ""))
      .join(" | ");
  } catch {
    return "";
  }
}

/** Contrôles d'authentification attendus sur le domaine d'envoi. */
const DNS_CHECKS: Array<[string, string, string, (v: string) => boolean, string]> = [
  [
    "spf",
    "SPF (autorisation d'envoi)",
    SEND_DOMAIN,
    (v) => /v=spf1/i.test(v) && /amazonses\.com/i.test(v),
    `Publier sur ${SEND_DOMAIN} : v=spf1 include:amazonses.com ~all`,
  ],
  [
    "dkim",
    "DKIM (signature des messages)",
    `resend._domainkey.${SEND_DOMAIN}`,
    (v) => /p=[A-Za-z0-9+/]{100,}/.test(v),
    `Publier la clé DKIM fournie par le moteur d'envoi sur resend._domainkey.${SEND_DOMAIN}`,
  ],
  [
    "dmarc",
    "DMARC (politique déclarée)",
    `_dmarc.${SEND_DOMAIN}`,
    // Gmail exige une politique lisible : `p=none` sans espace et en anglais.
    (v) => /v=DMARC1\s*;/i.test(v) && /(^|;)\s*p=(none|quarantine|reject)\s*(;|$)/i.test(v),
    "Remplacer l'enregistrement TXT _dmarc par : v=DMARC1; p=none; rua=mailto:boubetgeorges@gmail.com; adkim=r; aspf=r; fo=1",
  ],
];

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

      // Une clé « envoi seul » ne peut pas lire les évènements : on le dit
      // clairement au lieu de laisser tous les statuts en « inconnu ».
      const probe = await fetch("https://api.resend.com/domains", {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (probe.status === 401 || probe.status === 403) {
        const detail = (await probe.text()).slice(0, 200);
        return respond({
          error:
            "La clé d'envoi est restreinte à l'envoi seul : impossible de lire les livraisons. " +
            "Créez une clé à accès complet (envoi + lecture) et remplacez-la dans les secrets du projet.",
          key_restricted: true,
          detail,
        }, 400);
      }

      const { data: pending } = await db
        .from("email_send_log")
        .select("id,message_id,provider_message_id,recipient_email")
        .is("last_event", null)
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(MAX_SYNC);


      let checked = 0, updated = 0, unknown = 0;
      const events: Record<string, number> = {};

      for (const row of pending || []) {
        // On interroge Resend avec son propre identifiant : `message_id`
        // contient souvent notre clé d'idempotence, inutilisable côté API.
        const id = String(row.provider_message_id || row.message_id || "");
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

    // ------------------------------------------------------------ diagnostic
    // Contrôle réel de l'authentification du domaine d'envoi (SPF, DKIM,
    // DMARC) et de la capacité de la clé à lire les évènements de livraison.
    if (mode === "diagnostic") {
      const checks: Array<{
        key: string; label: string; ok: boolean; value: string; fix: string;
      }> = [];

      for (const [key, label, name, test, fix] of DNS_CHECKS) {
        const value = await txtRecord(name);
        checks.push({
          key, label, ok: test(value), value: value || "(aucun enregistrement)", fix,
        });
      }

      // Capacité de la clé : une clé « envoi seul » renvoie 401 restricted_api_key.
      const apiKey = Deno.env.get("RESEND_API_KEY");
      let keyOk = false;
      let keyValue = "RESEND_API_KEY absente";
      if (apiKey) {
        try {
          const res = await fetch("https://api.resend.com/domains", {
            headers: { Authorization: `Bearer ${apiKey}` },
          });
          const text = (await res.text()).slice(0, 200);
          keyOk = res.ok;
          keyValue = res.ok
            ? "clé complète : lecture des évènements possible"
            : `HTTP ${res.status} — ${text}`;
        } catch (err) {
          keyValue = `appel impossible : ${String(err)}`;
        }
      }
      checks.push({
        key: "api_key",
        label: "Clé d'envoi (lecture des livraisons)",
        ok: keyOk,
        value: keyValue,
        fix: "Créer une clé à accès complet (envoi + lecture) et la remplacer dans les secrets du projet.",
      });

      // Part d'envois dont la livraison n'est pas confirmée.
      const { count: total } = await db
        .from("email_send_log").select("id", { count: "exact", head: true }).gte("created_at", since);
      const { count: confirmed } = await db
        .from("email_send_log").select("id", { count: "exact", head: true })
        .gte("created_at", since).not("last_event", "is", null);

      return respond({
        success: true,
        mode,
        days,
        from_address: FROM_ADDRESS,
        reply_to: REPLY_TO_ADDRESS,
        checks,
        blocking: checks.filter((c) => !c.ok).map((c) => c.key),
        delivery_confirmed: confirmed ?? 0,
        delivery_total: total ?? 0,
      });
    }

    // --------------------------------------------- deliverability_test
    // Envoie un email [TEST] vers une liste de destinataires (par défaut
    // l'adresse de l'admin) et enregistre les message_id pour suivi.
    if (mode === "deliverability_test") {
      const checks: Array<{
        key: string; label: string; ok: boolean; value: string; fix: string;
      }> = [];
      const blocking: string[] = [];

      for (const [key, label, name, test, fix] of DNS_CHECKS) {
        const value = await txtRecord(name);
        const ok = test(value);
        checks.push({ key, label, ok, value: value || "(aucun enregistrement)", fix });
        if (!ok) blocking.push(key);
      }

      const apiKey = Deno.env.get("RESEND_API_KEY");
      let keyOk = false;
      let keyValue = "RESEND_API_KEY absente";
      if (apiKey) {
        try {
          const res = await fetch("https://api.resend.com/domains", {
            headers: { Authorization: `Bearer ${apiKey}` },
          });
          const text = (await res.text()).slice(0, 200);
          keyOk = res.ok;
          keyValue = res.ok
            ? "clé complète : lecture des évènements possible"
            : `HTTP ${res.status} — ${text}`;
        } catch (err) {
          keyValue = `appel impossible : ${String(err)}`;
        }
      }
      checks.push({
        key: "api_key",
        label: "Clé d'envoi (lecture des livraisons)",
        ok: keyOk,
        value: keyValue,
        fix: "Créer une clé à accès complet (envoi + lecture) et la remplacer dans les secrets du projet.",
      });
      if (!keyOk) blocking.push("api_key");

      if (blocking.length) {
        return respond({
          error: "Impossible d'envoyer le test : authentification ou clé incorrecte.",
          checks,
          blocking,
        }, 400);
      }

      const rawAddresses = (body as { addresses?: string[] }).addresses;
      const addresses = Array.isArray(rawAddresses) && rawAddresses.length
        ? rawAddresses
          .map(String)
          .map((s) => s.trim().toLowerCase())
          .filter((s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s))
        : ["boubetgeorges@gmail.com"];

      if (!addresses.length) {
        return respond({ error: "Aucune adresse de test valide." }, 400);
      }

      const testId = crypto.randomUUID();
      const shortId = testId.slice(0, 8);
      const subject = `[TEST] EbookStudio — vérification de délivrabilité (${shortId})`;
      const html = [
        `<!doctype html>`,
        `<html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#232F3E;background:#FAFAFA;padding:24px;">`,
        `<div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:24px;">`,
        `<h2 style="color:#008296;margin-top:0;">Test de délivrabilité EbookStudio</h2>`,
        `<p>Cet email a été envoyé depuis le panneau admin pour vérifier que vos messages arrivent bien dans les boîtes Gmail, Outlook et Yahoo.</p>`,
        `<p><strong>ID du test :</strong> ${shortId}</p>`,
        `<p>Si vous le recevez, l'authentification SPF/DKIM/DMARC est fonctionnelle.</p>`,
        `<hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />`,
        `<p style="font-size:13px;color:#6b7280;">`,
        `Réponses : <a href="mailto:${REPLY_TO}">${REPLY_TO}</a><br/>`,
        `Contact direct : boubetgeorges@gmail.com`,
        `</p>`,
        `</div></body></html>`,
      ].join("\n");

      const results: Array<{
        to: string; ok: boolean; message_id?: string; detail?: string; quotaExhausted?: boolean;
      }> = [];

      for (const to of addresses) {
        const res = await sendResendEmailThrottled({
          from: FROM_CAMPAIGN,
          to,
          subject,
          html,
          reply_to: REPLY_TO,
          tags: [{ name: "type", value: "deliverability-test" }],
        });

        if (res.ok && res.id) {
          await db.from("email_send_log").insert({
            message_id: res.id,
            provider_message_id: res.id,
            template_name: "deliverability-test",
            recipient_email: to,
            status: "sent",
            metadata: { test_id: testId, provider: "resend", source: "deliverability_test" },
          });
        }

        results.push({
          to,
          ok: res.ok,
          message_id: res.id,
            provider_message_id: res.id,
          detail: res.detail,
          quotaExhausted: res.quotaExhausted,
        });
      }

      return respond({
        success: true,
        mode,
        test_id: testId,
        short_id: shortId,
        checks,
        addresses,
        results,
      });
    }

    return respond({ error: `Mode inconnu : ${mode}` }, 400);

  } catch (e) {
    console.error("email-health-sync error:", e);
    return respond({ error: e instanceof Error ? e.message : "Erreur inconnue" }, 500);
  }
});
