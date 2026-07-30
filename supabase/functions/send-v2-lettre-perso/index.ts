// Campagne "lettre personnelle" — volontairement l'inverse de l'email HTML
// marketing (qui n'a généré que 2 clics) : texte brut, court, une seule
// question, un seul lien discret. Objectif : réponses + clics.
//
// Body : { test: true } => envoi uniquement à l'admin
//        { limit: 200 } => plafonne le lot (reprise possible ensuite)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { sendResendEmailThrottled, isQuotaExhausted } from "../_shared/resendThrottle.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FROM_ADDRESS = "Georges Boubet <noreply@ebookstudio.fr>";
const ADMIN_EMAIL = "boubetgeorges@gmail.com";
const TEMPLATE_NAME = "v2-lettre-perso";
const SUBJECT = "je peux vous poser une question ?";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const TRACK_CLICK = `${SUPABASE_URL}/functions/v1/track-email-click`;
const COMMANDER = "https://www.ebookstudio.fr/commander";

function trackedUrl(email: string, dest: string): string {
  return `${TRACK_CLICK}?e=${encodeURIComponent(email)}&s=1&u=${encodeURIComponent(dest)}&t=${encodeURIComponent(TEMPLATE_NAME)}`;
}

// Texte brut : meilleure délivrabilité, aucun "look pub".
function buildText(email: string): string {
  const link = trackedUrl(email, `${COMMANDER}?src=lettre&email=${encodeURIComponent(email)}`);
  return `Bonjour,

Georges, d'EbookStudio.

Je vous écris sans mise en page ni image, juste une question honnête :
qu'est-ce qui vous empêche aujourd'hui de sortir votre premier livre ?

Le temps ? L'écriture ? La couverture ? Le format Amazon KDP ?

Je pose la question parce que je vois beaucoup de gens rester bloqués des
mois sur la page blanche, alors que le blocage réel est presque toujours
ailleurs : la mise en forme, le sommaire, le fichier refusé par KDP.

C'est exactement ce que fait EbookStudio à votre place.

Deux choses que je veux que vous sachiez :

1. L'accès est à 59 € une seule fois. Pas d'abonnement.
2. La V3 (nouveaux outils, nouvelle interface) vous sera ajoutée
   automatiquement, sans repayer. Ceux qui arriveront après paieront
   au mois.

Si vous voulez voir la page : ${link}

Mais surtout : répondez-moi en une ligne avec votre blocage.
Je lis tout et je réponds personnellement — même si vous n'achetez rien.

Bien à vous,
Georges Boubet
EbookStudio

--
Pour ne plus recevoir mes emails, répondez simplement "STOP".`;
}

// Version HTML minimaliste (aucun bouton, aucune couleur) pour les clients
// qui n'affichent pas le text/plain.
function buildHtml(email: string): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const link = trackedUrl(email, `${COMMANDER}?src=lettre&email=${encodeURIComponent(email)}`);
  const body = esc(buildText(email))
    .replace(esc(link), `<a href="${link}" style="color:#1155cc;">${COMMANDER}</a>`)
    .replace(/\n/g, "<br>");
  return `<div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.65;color:#111;max-width:560px;">${body}
<img src="${SUPABASE_URL}/functions/v1/track-email-open?e=${encodeURIComponent(email)}&s=1&t=${encodeURIComponent(TEMPLATE_NAME)}" width="1" height="1" alt="" style="display:none;" /></div>`;
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

    const prospects = await fetchAll(supabase, "sales_prospects", "email", (q: any) =>
      q.eq("unsubscribed", false));

    const paid = await fetchAll(supabase, "funnel_orders", "email", (q: any) => q.eq("status", "paid"));
    const paidSet = new Set((paid ?? []).map((p: any) => norm(p.email)));

    const already = await fetchAll(supabase, "email_send_log", "recipient_email", (q: any) =>
      q.eq("template_name", TEMPLATE_NAME).eq("status", "sent"));
    const sentSet = new Set((already ?? []).map((s: any) => norm(s.recipient_email)));

    let recipients = Array.from(new Set(
      (prospects ?? [])
        .map((p: any) => norm(p.email))
        .filter((e: string) =>
          e && e.includes("@") && !paidSet.has(e) && !sentSet.has(e) && e !== ADMIN_EMAIL),
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
      if (isQuotaExhausted()) { console.warn("[v2-lettre-perso] Quota Resend atteint, arrêt"); break; }
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
