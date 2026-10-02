/**
 * Campagne « Offre de lancement 47 € » — envoi MANUEL par tranches de 500 max.
 * - réservé aux admins ; destinataires : sales_prospects segment_lancement = 'actif' ;
 * - journal offre_lancement_sends : jamais deux envois à la même adresse ;
 * - mode test : uniquement à l'adresse de l'admin connecté.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { sendResendEmailThrottled, isQuotaExhausted } from "../_shared/resendThrottle.ts";
import { FROM_CAMPAIGN, REPLY_TO } from "../_shared/emailIdentity.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EMAIL_ID = "offre-lancement-47";
const STEP = 47;
const TRANCHE = 500;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CTA_URL = "https://ebookstudio-2026-offre-47.landaa.io/f/tunnel-de-vente/de-vente";
const PREHEADER = "Accès à vie, payé une seule fois. Sans abonnement.";

const subjectFor = (prenom: string | null) =>
  prenom
    ? `${prenom}, 15 places à 47 € pour EbookStudio V3 (jusqu'au 15 octobre)`
    : "15 places à 47 € pour EbookStudio V3 (jusqu'au 15 octobre)";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

function buildHtml(email: string, prenom: string | null, baseUrl: string): string {
  const e = encodeURIComponent(email);
  const fn = `${baseUrl}/functions/v1`;
  const click = `${fn}/track-email-click?e=${e}&s=${STEP}&t=${EMAIL_ID}&u=${encodeURIComponent(CTA_URL)}`;
  const pixel = `${fn}/track-email-open?e=${e}&s=${STEP}&t=${EMAIL_ID}`;
  const unsub = `${fn}/unsubscribe?email=${e}`;
  const hello = prenom ? `Bonjour ${esc(prenom)},` : "Bonjour,";
  const p = (t: string) => `<p style="margin:0 0 16px;line-height:1.65">${t}</p>`;
  return `<!DOCTYPE html><html lang="fr"><body style="margin:0;background:#FAFAFA">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${PREHEADER}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAFAFA;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;font-family:Georgia,'Times New Roman',serif;color:#1f2937">
<tr><td style="padding:26px;font-size:16px">
${p(hello)}
${p("EbookStudio V3 est ouvert. Pour le lancement, je propose 15 places à un tarif que je ne referai pas : l'accès à vie au niveau Édition pour 47 €, payés une seule fois. Aucun abonnement.")}
${p("Avec l'atelier, vous passez de l'idée au livre prêt pour Amazon KDP : sujet, sommaire, rédaction chapitre par chapitre, correction, couverture, mise en page et fiche de vente. Vous gardez la main sur tout, et vos livres vous appartiennent.")}
${p("L'offre s'arrête dès que les 15 places sont prises, et au plus tard le 15 octobre 2026. Ensuite, la V3 passe en abonnement : 27 €, 47 € ou 97 € par mois.")}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:10px 0 22px"><tr>
<td style="background:#c2410c;border-radius:8px"><a href="${click}" style="display:inline-block;padding:15px 28px;color:#ffffff;text-decoration:none;font:700 16px Arial,Helvetica,sans-serif">Je réserve ma place à 47 €</a></td>
</tr></table>
${p("À très vite dans l'atelier,<br>Georges Boubet")}
<p style="margin:0;font-size:14px;color:#555">PS : si vous avez une question avant de vous décider, répondez simplement à cet email, je vous lis.</p>
</td></tr></table>
<p style="font-size:11px;color:#999;text-align:center;margin:16px 0 0">Vous recevez cet email car vous avez demandé à découvrir EbookStudio. <a href="${unsub}" style="color:#999">Se désinscrire</a></p>
<img src="${pixel}" width="1" height="1" alt="" style="display:block;border:0" />
</td></tr></table></body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const respond = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const baseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const authorization = req.headers.get("Authorization") ?? "";
    const userClient = createClient(baseUrl, Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
      global: { headers: { Authorization: authorization } },
    });
    const { data: u } = await userClient.auth.getUser();
    if (!u.user) return respond({ error: "Non connecté" }, 401);
    const { data: isAdmin } = await userClient.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
    if (isAdmin !== true) return respond({ error: "Réservé aux administrateurs" }, 403);

    const db = createClient(baseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    const body = await req.json().catch(() => ({} as Record<string, unknown>));
    const mode = body.mode === "send" ? "send" : body.mode === "test" ? "test" : "preview";

    if (mode === "test") {
      const to = (u.user.email ?? "").toLowerCase();
      if (!EMAIL_RE.test(to)) return respond({ error: "Adresse admin introuvable" }, 400);
      const res = await sendResendEmailThrottled({
        from: FROM_CAMPAIGN, to, reply_to: REPLY_TO,
        subject: `[TEST] ${subjectFor("Georges")}`,
        html: buildHtml("test@ebookstudio.local", "Georges", baseUrl),
      });
      return res.ok ? respond({ success: true, to }) : respond({ error: res.detail || "Envoi refusé" }, 502);
    }

    const { data: done } = await db.from("offre_lancement_sends").select("email").eq("email_id", EMAIL_ID).eq("status", "sent").limit(20000);
    const sentSet = new Set((done ?? []).map((r) => String(r.email).toLowerCase()));

    const { data: prospects, error } = await db.from("sales_prospects")
      .select("email, first_name").eq("segment_lancement", "actif").eq("unsubscribed", false).neq("status", "bounced").limit(20000);
    if (error) return respond({ error: error.message }, 500);

    const seen = new Set<string>();
    const pending: { email: string; first_name: string | null }[] = [];
    for (const r of prospects ?? []) {
      const e = String(r.email ?? "").trim().toLowerCase();
      if (!EMAIL_RE.test(e) || seen.has(e) || sentSet.has(e)) continue;
      seen.add(e);
      const n = String(r.first_name ?? "").trim();
      pending.push({ email: e, first_name: n || null });
    }

    if (mode === "preview") {
      return respond({ totalPending: pending.length, alreadySent: sentSet.size, trancheSize: TRANCHE });
    }

    const batch = pending.slice(0, TRANCHE);
    let sentCount = 0, failedCount = 0, quotaStopped = false;
    for (const person of batch) {
      const res = await sendResendEmailThrottled({
        from: FROM_CAMPAIGN, to: person.email, reply_to: REPLY_TO,
        subject: subjectFor(person.first_name),
        html: buildHtml(person.email, person.first_name, baseUrl),
      });
      if (res.ok) sentCount++; else failedCount++;
      await db.from("offre_lancement_sends").upsert({
        email: person.email, email_id: EMAIL_ID, batch_index: Math.floor(sentSet.size / TRANCHE) + 1,
        status: res.ok ? "sent" : "error",
        error: res.ok ? null : String(res.detail || `status ${res.status}`).slice(0, 500),
        sent_at: res.ok ? new Date().toISOString() : null,
      }, { onConflict: "email,email_id" });
      if (res.quotaExhausted || isQuotaExhausted()) { quotaStopped = true; break; }
    }
    return respond({ success: true, sentCount, failedCount, remaining: Math.max(0, pending.length - sentCount), quotaStopped });
  } catch (err) {
    console.error("send-offre-lancement error", err);
    return respond({ error: (err as Error).message }, 500);
  }
});
