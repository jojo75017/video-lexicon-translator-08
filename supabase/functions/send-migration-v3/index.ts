/**
 * Envoi en 1 clic de l'email de passage à la V3 aux abonnés existants.
 *
 * - réservé aux admins (has_role) ;
 * - destinataires = `subscribers` au statut actif, jamais les désabonnés ;
 * - journal `v3_migration_sends` : un abonné ne reçoit jamais deux fois l'email ;
 * - modes : `preview` (liste sans envoi), `send` (envoi réel), `test` (à soi).
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { FROM_CAMPAIGN, REPLY_TO } from "../_shared/emailIdentity.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const EMAIL_ID = "passage-abonnes-v3";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function admin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

async function sendOne(resendKey: string, to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM_CAMPAIGN, to: [to], reply_to: REPLY_TO, subject, html }),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`Resend refuse ${to} [${res.status}]: ${text}`);
    return { ok: false, error: `${res.status}: ${text}` };
  }
  return { ok: true, error: null as string | null };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const asUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: auth } = await asUser.auth.getUser();
    const user = auth?.user;
    if (!user) return json({ error: "Non authentifié" }, 401);

    const { data: isAdmin } = await asUser.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return json({ error: "Réservé aux administrateurs" }, 403);

    const body = await req.json().catch(() => null);
    const mode = body?.mode === "send" ? "send" : body?.mode === "test" ? "test" : "preview";
    const ALLOWED_IDS = [EMAIL_ID, "micro-series-precommande"];
    const emailId = ALLOWED_IDS.includes(body?.emailId) ? body.emailId as string : EMAIL_ID;
    const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
    const html = typeof body?.html === "string" ? body.html : "";

    const db = admin();

    // Abonnés actifs de la base, dédupliqués par email.
    const { data: subs, error: subsError } = await db
      .from("subscribers")
      .select("email, status")
      .in("status", ["active", "trialing"]);
    if (subsError) return json({ error: `Lecture des abonnés impossible : ${subsError.message}` }, 500);

    const { data: already } = await db
      .from("v3_migration_sends")
      .select("email, status")
      .eq("email_id", EMAIL_ID);
    const sentSet = new Set(
      (already ?? [])
        .filter((r) => String((r as { status?: string }).status) === "sent")
        .map((r) => String((r as { email: string }).email).toLowerCase()),
    );

    const all = Array.from(
      new Set(
        (subs ?? [])
          .map((s) => String((s as { email: string }).email ?? "").trim().toLowerCase())
          .filter((e) => EMAIL_RE.test(e)),
      ),
    );
    const pending = all.filter((e) => !sentSet.has(e));

    if (mode === "preview") {
      return json({ emailId: EMAIL_ID, total: all.length, pending, alreadySent: [...sentSet] });
    }

    if (!subject || subject.length > 300) return json({ error: "Objet invalide" }, 400);
    if (!html || html.length > 200_000) return json({ error: "Contenu invalide" }, 400);

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) return json({ error: "RESEND_API_KEY absente" }, 500);

    if (mode === "test") {
      const to = typeof body?.to === "string" ? body.to.trim().toLowerCase() : "";
      if (!EMAIL_RE.test(to)) return json({ error: "Adresse de test invalide" }, 400);
      const r = await sendOne(resendKey, to, `[TEST] ${subject}`, html);
      return r.ok ? json({ success: true, to }) : json({ error: r.error }, 502);
    }

    // Envoi réel, un par un, avec journal et petite pause entre les envois.
    const sent: string[] = [];
    const failed: Array<{ email: string; error: string }> = [];
    for (const to of pending) {
      const r = await sendOne(resendKey, to, subject, html);
      if (r.ok) sent.push(to);
      else failed.push({ email: to, error: r.error! });
      await db.from("v3_migration_sends").upsert(
        {
          email: to,
          email_id: EMAIL_ID,
          status: r.ok ? "sent" : "error",
          error: r.error,
          sent_at: r.ok ? new Date().toISOString() : null,
        },
        { onConflict: "email,email_id" },
      );
      await new Promise((res) => setTimeout(res, 600));
    }

    return json({ success: true, sentCount: sent.length, sent, failed });
  } catch (err) {
    console.error("send-migration-v3 error", err);
    return json({ error: (err as Error).message ?? "Erreur inconnue" }, 500);
  }
});
