// Campagne "démo vidéo" ciblant les OUVREURS (email_opens), pas les cliqueurs.
// Tous les liens sont trackés via track-email-click (t=video-demo-openers)
// afin de mesurer enfin les clics : vidéo vs offre.
//
// Body : { test: true }  => envoi uniquement à l'admin
//        { limit: 200 }  => plafonne le lot (reprise possible ensuite)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { sendResendEmailThrottled, isQuotaExhausted } from "../_shared/resendThrottle.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FROM_ADDRESS = "Georges Boubet <noreply@ebookstudio.fr>";
const ADMIN_EMAIL = "boubetgeorges@gmail.com";
const TEMPLATE_NAME = "video-demo-openers";
const SUBJECT = "je vous montre l'outil en vidéo (rien à lire)";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const TRACK_CLICK = `${SUPABASE_URL}/functions/v1/track-email-click`;
const VIDEO_URL = "https://www.youtube.com/watch?v=rOwQYrC1KYM";
const VIDEO_THUMB = "https://i.ytimg.com/vi/rOwQYrC1KYM/hqdefault.jpg";
const COMMANDER = "https://www.ebookstudio.fr/commander";

function trackedUrl(email: string, dest: string, step: number): string {
  return `${TRACK_CLICK}?e=${encodeURIComponent(email)}&s=${step}&u=${encodeURIComponent(dest)}&t=${encodeURIComponent(TEMPLATE_NAME)}`;
}

function videoLink(email: string): string {
  return trackedUrl(email, VIDEO_URL, 1);
}

function offerLink(email: string): string {
  return trackedUrl(email, `${COMMANDER}?src=video&email=${encodeURIComponent(email)}`, 2);
}

function buildText(email: string): string {
  return `Bonjour,

Georges, d'EbookStudio.

Plutôt que de vous réécrire un long email, j'ai filmé l'outil.
Vous voyez tout : le plan du livre, l'écriture, la couverture,
et le fichier final prêt pour Amazon KDP.

La vidéo est ici : ${videoLink(email)}

Deux choses à savoir :

1. L'accès est à 59 € une seule fois. Pas d'abonnement.
2. La V3 (nouveaux outils, nouvelle interface) vous sera ajoutée
   automatiquement, sans repayer.

Si après la vidéo vous voulez commencer : ${offerLink(email)}

Et si quelque chose n'est pas clair, répondez-moi en une ligne.
Je lis tout et je réponds personnellement.

Bien à vous,
Georges Boubet
EbookStudio

--
Pour ne plus recevoir mes emails, répondez simplement "STOP".`;
}

function buildHtml(email: string): string {
  const v = videoLink(email);
  const o = offerLink(email);
  return `<div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.65;color:#111;max-width:560px;">
<p>Bonjour,</p>
<p>Georges, d'EbookStudio.</p>
<p>Plutôt que de vous réécrire un long email, <strong>j'ai filmé l'outil</strong>.<br>
Vous voyez tout : le plan du livre, l'écriture, la couverture, et le fichier final prêt pour Amazon KDP.</p>

<p style="margin:24px 0;">
  <a href="${v}" style="display:block;text-decoration:none;">
    <img src="${VIDEO_THUMB}" alt="Voir la démonstration vidéo d'EbookStudio" width="480" style="display:block;width:100%;max-width:480px;border:1px solid #ddd;border-radius:6px;" />
  </a>
  <a href="${v}" style="display:inline-block;margin-top:10px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1155cc;">▶ Voir la vidéo (démonstration complète)</a>
</p>

<p>Deux choses à savoir :</p>
<p style="margin:0 0 8px;">1. L'accès est à <strong>59 € une seule fois</strong>. Pas d'abonnement.</p>
<p style="margin:0 0 18px;">2. La V3 (nouveaux outils, nouvelle interface) vous sera ajoutée automatiquement, sans repayer.</p>

<p>Si après la vidéo vous voulez commencer :<br>
<a href="${o}" style="color:#1155cc;">${COMMANDER}</a></p>

<p>Et si quelque chose n'est pas clair, répondez-moi en une ligne. Je lis tout et je réponds personnellement.</p>

<p style="margin:18px 0 0;">Bien à vous,<br><strong>Georges Boubet</strong><br>EbookStudio</p>
<p style="font-size:13px;color:#777;border-top:1px solid #eee;padding-top:14px;margin-top:24px;">Pour ne plus recevoir mes emails, répondez simplement "STOP".</p>
<img src="${SUPABASE_URL}/functions/v1/track-email-open?e=${encodeURIComponent(email)}&s=1&t=${encodeURIComponent(TEMPLATE_NAME)}" width="1" height="1" alt="" style="display:none;" />
</div>`;
}

async function fetchAll<T = any>(
  supabase: any, table: string, columns: string, filter?: (q: any) => any,
): Promise<T[]> {
  const pageSize = 1000;
  let all: T[] = [];
  let start = 0;
  while (true) {
    let q = supabase.from(table).select(columns).range(start, start + pageSize - 1);
    if (filter) q = filter(q);
    const { data, error } = await q;
    if (error) throw error;
    if (!data || data.length === 0) break;
    all = all.concat(data);
    if (data.length < pageSize) break;
    start += pageSize;
  }
  return all;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");

    let testMode = false;
    let limit: number | null = null;
    try {
      const body = await req.json();
      testMode = body?.test === true;
      if (typeof body?.limit === "number") limit = body.limit;
    } catch { /* no body */ }

    const norm = (e: string) => (e ?? "").trim().toLowerCase();

    // Cible : les ouvreurs réels
    const opens = await fetchAll(supabase, "email_opens", "prospect_email");

    // Exclusions
    const unsub = await fetchAll(supabase, "sales_prospects", "email", (q: any) =>
      q.eq("unsubscribed", true));
    const unsubSet = new Set((unsub ?? []).map((p: any) => norm(p.email)));

    const paid = await fetchAll(supabase, "funnel_orders", "email", (q: any) => q.eq("status", "paid"));
    const paidSet = new Set((paid ?? []).map((p: any) => norm(p.email)));

    const already = await fetchAll(supabase, "email_send_log", "recipient_email", (q: any) =>
      q.eq("template_name", TEMPLATE_NAME).eq("status", "sent"));
    const sentSet = new Set((already ?? []).map((s: any) => norm(s.recipient_email)));

    let recipients = Array.from(new Set(
      (opens ?? [])
        .map((o: any) => norm(o.prospect_email))
        .filter((e: string) =>
          e && e.includes("@") &&
          !unsubSet.has(e) && !paidSet.has(e) && !sentSet.has(e) && e !== ADMIN_EMAIL),
    ));

    if (testMode) recipients = [ADMIN_EMAIL];
    if (limit && limit > 0) recipients = recipients.slice(0, limit);

    const results: any[] = [];
    for (const to of recipients) {
      const r = await sendResendEmailThrottled({
        from: FROM_ADDRESS,
        to: [to],
        subject: SUBJECT,
        text: buildText(to),
        html: buildHtml(to),
        reply_to: ADMIN_EMAIL,
      });
      results.push({ to, ok: r.ok, id: r.id });
      try {
        await supabase.from("email_send_log").insert({
          recipient_email: to,
          template_name: TEMPLATE_NAME,
          message_id: r.id ?? null,
          status: r.ok ? "sent" : "error",
          error_message: r.ok ? null : `HTTP ${r.status ?? ""}: ${r.detail ?? ""}`,
        });
      } catch { /* noop */ }
      if (isQuotaExhausted()) { console.warn("[video-demo-openers] Quota Resend atteint, arrêt"); break; }
    }

    const sent = results.filter((r) => r.ok).length;
    return new Response(JSON.stringify({
      template: TEMPLATE_NAME, total: recipients.length, sent, testMode,
      results: results.slice(0, 50),
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
