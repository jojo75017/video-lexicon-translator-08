import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { pushToSystemeIo } from "../_shared/systemeio.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

/** Délai entre deux contacts : ~3 requêtes API par contact, limite Systeme.io ~120 req/min. */
const CONTACT_DELAY_MS = 900;
/** Budget temps par invocation : on s'arrête proprement avant le timeout worker, puis on s'auto-relance. */
const TIME_BUDGET_MS = 100_000;
/** Sécurité anti-boucle : nombre maximal de relances en chaîne. */
const MAX_CHAIN_DEPTH = 120;
/** Verrou anti double-lancement (manuel + chaîne). */
const LOCK_TTL_MS = 3 * 60_000;
/**
 * Correctif tags (23/08/2026) : avant cette date, les contacts étaient synchronisés
 * SANS tags (l'API exige tagId, l'ancien code envoyait tagName → refus 422 silencieux).
 * Le mode "retag" re-pousse uniquement les contacts synchronisés avant ce cutoff
 * (ou marqués tag_failed) pour leur appliquer leurs tags.
 */
const TAGS_FIX_CUTOFF = "2026-08-23T13:00:00.000Z";

type ContactRow = {
  source: "sales_prospects" | "funnel_leads" | "buyers";
  id: string;
  email: string;
  first_name: string | null;
  tags: string[];
};

type CollectFilter = "unsynced" | "retag" | "all";
type JobMode = "sync" | "retag";

type Db = ReturnType<typeof createClient>;

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

/** Rassemble tous les contacts à synchroniser, dédupliqués par email.
 *  Les désabonnés (sales_prospects.unsubscribed = true) ne sont JAMAIS poussés.
 *  filter "unsynced" : jamais synchronisés · "retag" : synchronisés sans tags (avant cutoff) · "all" : tout. */
async function collectContacts(db: Db, filter: CollectFilter): Promise<ContactRow[]> {
  const byEmail = new Map<string, ContactRow>();

  // 1) Acheteurs (priorité maximale : tag client) — toujours inclus (très peu nombreux)
  const { data: orders } = await db
    .from("funnel_orders")
    .select("email, first_name")
    .eq("status", "paid");
  const { data: installments } = await db
    .from("v3_installment_orders")
    .select("email")
    .in("status", ["paid", "completed", "active"]);
  const buyerEmails = new Set<string>();
  for (const o of orders ?? []) {
    const email = String(o.email || "").trim().toLowerCase();
    if (!email || !email.includes("@")) continue;
    buyerEmails.add(email);
    byEmail.set(email, {
      source: "buyers",
      id: email,
      email,
      first_name: o.first_name || null,
      tags: ["ebookstudio-client"],
    });
  }
  for (const o of installments ?? []) {
    const email = String(o.email || "").trim().toLowerCase();
    if (!email || !email.includes("@")) continue;
    buyerEmails.add(email);
    if (!byEmail.has(email)) {
      byEmail.set(email, { source: "buyers", id: email, email, first_name: null, tags: ["ebookstudio-client"] });
    }
  }

  // 2) Prospects (jamais les désabonnés) — pagination : PostgREST plafonne à 1000 lignes/requête.
  const prospects: Record<string, unknown>[] = [];
  for (let from = 0; ; from += 1000) {
    let q = db
      .from("sales_prospects")
      .select("id, email, first_name, status, unsubscribed, systemeio_synced_at")
      .eq("unsubscribed", false)
      .order("id")
      .range(from, from + 999);
    if (filter === "unsynced") {
      q = q.is("systemeio_synced_at", null);
    } else if (filter === "retag") {
      // Synchronisés avant le correctif tags, ou échec d'assignation de tag : à re-tagueter.
      q = q.or(`systemeio_synced_at.lt.${TAGS_FIX_CUTOFF},systemeio_sync_error.like.tag_failed*`);
    }
    const { data } = await q;
    prospects.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }
  for (const p of prospects) {
    const row = p as { id: string; email: string; first_name: string | null; status: string };
    const email = String(row.email || "").trim().toLowerCase();
    if (!email || !email.includes("@") || buyerEmails.has(email)) continue;
    const existing = byEmail.get(email);
    const tags = ["ebookstudio-prospect", row.status === "active" ? "segment-actif" : "segment-froid"];
    if (existing) {
      existing.source = "sales_prospects";
      existing.id = String(row.id);
      existing.tags = [...new Set([...existing.tags, ...tags])];
      if (!existing.first_name && row.first_name) existing.first_name = row.first_name;
    } else {
      byEmail.set(email, { source: "sales_prospects", id: String(row.id), email, first_name: row.first_name || null, tags });
    }
  }

  // 3) Leads de tunnel (quiz, pages cadeau) — pagination idem.
  const leads: Record<string, unknown>[] = [];
  for (let from = 0; ; from += 1000) {
    let q = db
      .from("funnel_leads")
      .select("id, email, first_name, lead_magnet, systemeio_synced_at")
      .order("id")
      .range(from, from + 999);
    if (filter === "unsynced") {
      q = q.is("systemeio_synced_at", null);
    } else if (filter === "retag") {
      q = q.or(`systemeio_synced_at.lt.${TAGS_FIX_CUTOFF},systemeio_sync_error.like.tag_failed*`);
    }
    const { data } = await q;
    leads.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }
  for (const l of leads) {
    const row = l as { id: string; email: string; first_name: string | null; lead_magnet: string | null };
    const email = String(row.email || "").trim().toLowerCase();
    if (!email || !email.includes("@") || buyerEmails.has(email)) continue;
    const tag = row.lead_magnet ? `lm-${String(row.lead_magnet).slice(0, 40)}` : "ebookstudio-lead";
    const existing = byEmail.get(email);
    if (existing) {
      existing.tags = [...new Set([...existing.tags, tag])];
      if (!existing.first_name && row.first_name) existing.first_name = row.first_name;
    } else {
      byEmail.set(email, { source: "funnel_leads", id: String(row.id), email, first_name: row.first_name || null, tags: ["ebookstudio-lead", tag] });
    }
  }

  return [...byEmail.values()];
}

/** Enregistre l'issue d'un contact : synchronisé, ou en échec (avec la raison, sans nouvelle tentative auto). */
async function markOutcome(db: Db, c: ContactRow, error: string | null) {
  const now = new Date().toISOString();
  const table = c.source === "sales_prospects" ? "sales_prospects" : c.source === "funnel_leads" ? "funnel_leads" : null;
  if (!table) return; // acheteurs sans ligne prospect/lead : pas de colonne de suivi
  await db
    .from(table)
    .update({ systemeio_synced_at: now, systemeio_sync_error: error })
    .eq("id", c.id);
}

async function refreshLock(db: Db) {
  await db
    .from("app_secrets")
    .upsert({ key: "systemeio_sync_lock", value: new Date().toISOString() }, { onConflict: "key" });
}

interface SyncLog {
  state: "running" | "done";
  started_at: string;
  updated_at: string;
  synced: number;
  failed: number;
  remaining: number;
  last_errors: { email: string; detail: string }[];
}

const logKeyFor = (mode: JobMode) => (mode === "retag" ? "systemeio_retag_log" : "systemeio_sync_log");

async function writeLog(db: Db, mode: JobMode, log: SyncLog) {
  await db
    .from("app_secrets")
    .upsert({ key: logKeyFor(mode), value: JSON.stringify(log) }, { onConflict: "key" });
}

async function readLog(db: Db, mode: JobMode): Promise<SyncLog | null> {
  const { data } = await db.from("app_secrets").select("value").eq("key", logKeyFor(mode)).maybeSingle();
  if (!data?.value) return null;
  try {
    return JSON.parse(data.value) as SyncLog;
  } catch {
    return null;
  }
}

/** Traite le reste à synchroniser par lots de ~100 s, en s'auto-relancant jusqu'à épuisement. */
async function runSyncJob(db: Db, baseUrl: string, cronSecret: string, depth: number, mode: JobMode) {
  const startedAt = Date.now();
  await refreshLock(db);

  const previous = await readLog(db, mode);
  const cumul = depth > 0 && previous
    ? { synced: previous.synced, failed: previous.failed, started_at: previous.started_at }
    : { synced: 0, failed: 0, started_at: new Date().toISOString() };

  const contacts = await collectContacts(db, mode === "retag" ? "retag" : "unsynced");
  let synced = 0;
  let failed = 0;
  const errors: { email: string; detail: string }[] = [];
  let rateLimited = false;

  for (const contact of contacts) {
    if (Date.now() - startedAt > TIME_BUDGET_MS) break;
    try {
      const res = await pushToSystemeIo(contact.email, contact.first_name ?? "", contact.tags);
      if (res.ok) {
        synced++;
        await markOutcome(db, contact, null);
      } else {
        if (/429|rate/i.test(res.detail ?? "")) {
          rateLimited = true;
          break; // on ne marque pas : le prochain maillon réessaiera
        }
        failed++;
        await markOutcome(db, contact, (res.detail ?? "unknown").slice(0, 300));
        errors.push({ email: contact.email, detail: (res.detail ?? "unknown").slice(0, 200) });
      }
    } catch (e) {
      failed++;
      await markOutcome(db, contact, (e as Error).message.slice(0, 300));
      errors.push({ email: contact.email, detail: (e as Error).message.slice(0, 200) });
    }
    await new Promise((r) => setTimeout(r, CONTACT_DELAY_MS));
  }

  const remaining = contacts.length - synced - failed;
  const done = remaining <= 0 || depth >= MAX_CHAIN_DEPTH;
  await writeLog(db, mode, {
    state: done ? "done" : "running",
    started_at: cumul.started_at,
    updated_at: new Date().toISOString(),
    synced: cumul.synced + synced,
    failed: cumul.failed + failed,
    remaining: Math.max(0, remaining),
    last_errors: errors.slice(0, 20),
  });

  if (done) {
    // Fin de la synchro principale → on enchaîne automatiquement sur le re-tagage
    // des contacts synchronisés sans tags (correctif tagId du 23/08/2026).
    if (mode === "sync") {
      await writeLog(db, "retag", {
        state: "running",
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        synced: 0,
        failed: 0,
        remaining: -1,
        last_errors: [],
      });
      try {
        await fetch(`${baseUrl}/functions/v1/sync-systemeio-contacts`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-cron-secret": cronSecret },
          body: JSON.stringify({ mode: "retag", depth: 0, chained: true }),
        }).then((r) => r.text());
      } catch (e) {
        console.warn("retag chain launch failed:", (e as Error).message);
      }
    }
    return;
  }

  // Auto-relance : le maillon suivant répond immédiatement et poursuit en arrière-plan.
  if (rateLimited) await new Promise((r) => setTimeout(r, 30_000));
  try {
    await fetch(`${baseUrl}/functions/v1/sync-systemeio-contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-cron-secret": cronSecret },
      body: JSON.stringify({ mode, depth: depth + 1, chained: true }),
    }).then((r) => r.text());
  } catch (e) {
    console.warn("sync chain relay failed:", (e as Error).message);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const respond = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const baseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const db = createClient(baseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    const body = await req.json().catch(() => ({}));
    const mode = String(body.mode || "status");

    const { data: cronSecret } = await db.from("app_secrets").select("value").eq("key", "cron_secret").maybeSingle();
    const hasCronSecret = !!cronSecret?.value && req.headers.get("x-cron-secret") === cronSecret.value;
    if (!hasCronSecret && !(await isAdmin(req, baseUrl))) {
      return respond({ error: "Accès administrateur requis" }, 403);
    }

    // Mode test : un seul contact (l'admin), tag de test explicite.
    if (mode === "test") {
      const email = String(body.email || "boubetgeorges@gmail.com").trim().toLowerCase();
      const res = await pushToSystemeIo(email, "Georges", ["ebookstudio-test-sync"]);
      return respond({ success: res.ok, email, detail: res.detail ?? null });
    }

    if (mode === "status") {
      const log = await readLog(db, "sync");
      const retagLog = await readLog(db, "retag");
      const { count: syncedProspects } = await db
        .from("sales_prospects")
        .select("id", { count: "exact", head: true })
        .not("systemeio_synced_at", "is", null);
      const { count: failedProspects } = await db
        .from("sales_prospects")
        .select("id", { count: "exact", head: true })
        .not("systemeio_sync_error", "is", null);
      const { count: syncedLeads } = await db
        .from("funnel_leads")
        .select("id", { count: "exact", head: true })
        .not("systemeio_synced_at", "is", null);
      return respond({
        success: true,
        running: log?.state === "running" || retagLog?.state === "running",
        log,
        retag_log: retagLog,
        synced_prospects: syncedProspects ?? 0,
        failed_prospects: failedProspects ?? 0,
        synced_leads: syncedLeads ?? 0,
      });
    }

    if (mode === "dry_run" || mode === "dry_run_all" || mode === "dry_run_retag") {
      const filter: CollectFilter = mode === "dry_run" ? "unsynced" : mode === "dry_run_retag" ? "retag" : "all";
      const contacts = await collectContacts(db, filter);
      const stats = { total: contacts.length, prospects: 0, leads: 0, buyers: 0 };
      for (const c of contacts) {
        if (c.source === "sales_prospects") stats.prospects++;
        else if (c.source === "funnel_leads") stats.leads++;
        else stats.buyers++;
      }
      return respond({ success: true, dry_run: true, filter, stats });
    }

    if (mode === "sync" || mode === "retag") {
      const jobMode = mode as JobMode;
      // Verrou anti double-lancement (les maillons de la chaîne le contournent).
      if (!body.chained) {
        const { data: lockRow } = await db.from("app_secrets").select("value").eq("key", "systemeio_sync_lock").maybeSingle();
        const lockAt = lockRow?.value ? Date.parse(lockRow.value) : 0;
        if (lockAt && Date.now() - lockAt < LOCK_TTL_MS) {
          const log = await readLog(db, jobMode);
          return respond({ success: false, already_running: true, log });
        }
        // Nouveau lancement manuel : journal remis à zéro par runSyncJob (depth 0).
        await writeLog(db, jobMode, {
          state: "running",
          started_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          synced: 0,
          failed: 0,
          remaining: -1,
          last_errors: [],
        });
      }
      const depth = typeof body.depth === "number" ? body.depth : 0;
      const job = runSyncJob(db, baseUrl, cronSecret?.value ?? "", depth, jobMode);
      const edgeRuntime = (globalThis as { EdgeRuntime?: { waitUntil: (p: Promise<unknown>) => void } }).EdgeRuntime;
      if (edgeRuntime) edgeRuntime.waitUntil(job);
      else await job;
      return respond({ success: true, started: true });
    }

    return respond({ error: `Mode inconnu: ${mode}` }, 400);
  } catch (e) {
    console.error("sync-systemeio-contacts error:", e);
    return respond({ error: (e as Error).message || "Erreur serveur" }, 500);
  }
});
