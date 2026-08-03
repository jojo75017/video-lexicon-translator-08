// Test A/B « Offre d'été 47 € » — variante A (offre directe) vs variante B (histoire de Marie).
// Split 50/50 déterministe, un lien tracé distinct par variante.
//
// Body : {
//   test?: true,                       // envoi des 2 variantes à l'admin uniquement
//   limit?: number,                    // plafonne le lot (reprise possible)
//   audience?: "fresh" | "openers" | "all"
// }
//   fresh (défaut) : prospects qui n'ont PAS déjà reçu l'étape 1 de la série 47 €
//   openers        : ceux qui ont ouvert au moins un email
//   all            : toute la liste

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { isQuotaExhausted, sendResendEmailThrottled } from "../_shared/resendThrottle.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FROM_ADDRESS = "Georges Boubet <noreply@ebookstudio.fr>";
const ADMIN_EMAIL = "boubetgeorges@gmail.com";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const TRACK_CLICK = `${SUPABASE_URL}/functions/v1/track-email-click`;
const TRACK_OPEN = `${SUPABASE_URL}/functions/v1/track-email-open`;
const COMMANDER = "https://www.ebookstudio.fr/commander";
const DEADLINE = "30 septembre";

type Variant = "a" | "b";

const templateName = (v: Variant) => `ab-47-${v}`;

const SUBJECTS: Record<Variant, string> = {
  a: "47 € au lieu de 59 € (jusqu'au 30 septembre)",
  b: "Elle ne savait pas écrire. Elle a quand même publié.",
};

const CTA_LABEL: Record<Variant, string> = {
  a: "Je prends l'accès à 47 €",
  b: "Voir l'offre et commencer",
};

function trackedUrl(email: string, v: Variant): string {
  const dest = `${COMMANDER}?src=email-ab-47-${v}&email=${encodeURIComponent(email)}`;
  return `${TRACK_CLICK}?e=${encodeURIComponent(email)}&s=1&u=${encodeURIComponent(dest)}&t=${encodeURIComponent(templateName(v))}`;
}

/* ------------------------------------------------------------------ */
/* Contenus                                                            */
/* ------------------------------------------------------------------ */

function bodyText(v: Variant, link: string): string {
  if (v === "a") {
    return `Bonjour,

Georges, d'EbookStudio.

Je fais simple : jusqu'au ${DEADLINE}, l'accès complet passe de 59 € à 47 €.
Une seule fois. Pas d'abonnement. Pas de prélèvement mensuel.

Pour 47 € vous avez, à vie :
- le livre écrit chapitre par chapitre à partir de votre idée
- le sommaire et le fichier Word/PDF prêts pour Amazon KDP
- la couverture KDP (dos, 4e de couverture, format exact)
- les livres illustrés pour enfants 3-7 ans
- la fiche Amazon : description, mots-clés, catégories
- la V3 ajoutée automatiquement, sans repayer

C'est le prix d'un repas au restaurant, pour un outil que vous gardez à vie.

Je prends l'accès à 47 € : ${link}

Si vous hésitez, répondez-moi en une ligne : je réponds moi-même.

Georges Boubet
EbookStudio

--
Pour ne plus recevoir mes emails, répondez "STOP".`;
  }

  return `Bonjour,

Marie n'y connaissait absolument rien aux livres.

Elle avait une idée — un guide pratique autour d'une passion — mais elle ne
savait pas comment transformer ça en un vrai ebook, au bon format, prêt à
vendre sur Amazon.

Elle a donné son idée en une phrase. L'outil a proposé le sommaire. Elle a
validé. Les chapitres se sont écrits. Elle a relu, corrigé ce qui lui
importait, et a téléchargé son fichier KDP.

Elle n'a pas mis en page. Elle n'a pas calculé les marges. Elle a juste
suivi le workflow.

La question qu'elle m'a posée après : « Pourquoi je ne l'ai pas fait plus tôt ? »

47 € au lieu de 59 € — une seule fois, pas d'abonnement, jusqu'au ${DEADLINE}.

Si Marie a pu le faire en partant de zéro, il y a de fortes chances que vous
puissiez le faire aussi.

Voir l'offre et commencer : ${link}

Si vous avez une question, répondez à cet email. Je lis tout et je réponds
personnellement.

Georges Boubet
EbookStudio

--
Pour ne plus recevoir mes emails, répondez "STOP".`;
}

function button(link: string, label: string): string {
  return `<p style="margin:28px 0;">
  <a href="${link}" style="background:#064e3b;color:#ffffff;padding:15px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-family:Arial,Helvetica,sans-serif;font-size:16px;display:inline-block;">${label}</a>
</p>`;
}

function bodyHtml(v: Variant, link: string, email: string): string {
  const open = `<img src="${TRACK_OPEN}?e=${encodeURIComponent(email)}&s=1&t=${encodeURIComponent(templateName(v))}" width="1" height="1" alt="" style="display:none;" />`;
  const foot = `<p style="margin:24px 0 0;">Bien à vous,<br><strong>Georges Boubet</strong><br>EbookStudio</p>
<p style="font-size:13px;color:#777;border-top:1px solid #e0e0e0;padding-top:14px;margin-top:28px;">Offre valable jusqu'au 30 septembre 2026. Pour ne plus recevoir mes emails, répondez simplement "STOP".</p>${open}`;
  const shell = (badge: string, inner: string) =>
    `<div style="font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.7;color:#1a1a1a;max-width:560px;">
<p style="margin:0 0 18px;"><span style="display:inline-block;background:#064e3b;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;padding:6px 12px;border-radius:4px;text-transform:uppercase;letter-spacing:0.5px;">${badge}</span></p>
${inner}${foot}</div>`;

  const priceTag = `<p style="margin:26px 0;font-family:Arial,Helvetica,sans-serif;">
  <span style="font-size:34px;font-weight:bold;color:#064e3b;">47 €</span>
  <span style="font-size:16px;color:#555;margin-left:8px;">au lieu de <span style="text-decoration:line-through;">59 €</span></span>
</p>`;

  if (v === "a") {
    return shell("Offre d'été", `<p style="margin:0 0 18px;">Bonjour,</p>
<p style="margin:0 0 18px;">Georges, d'EbookStudio.</p>
<p style="margin:0 0 18px;">Je fais simple : jusqu'au <strong>${DEADLINE}</strong>, l'accès complet passe de <span style="text-decoration:line-through;color:#888;">59 €</span> à <strong style="color:#064e3b;">47 €</strong>.</p>
<p style="margin:0 0 18px;">Une seule fois. Pas d'abonnement. Pas de prélèvement mensuel.</p>
${priceTag}
<p style="margin:0 0 18px;">Pour 47 € vous avez, <strong>à vie</strong> :</p>
<ul style="padding-left:22px;margin:0 0 22px;">
  <li style="margin-bottom:8px;">le livre écrit chapitre par chapitre à partir de votre idée</li>
  <li style="margin-bottom:8px;">le sommaire et le fichier Word/PDF prêts pour Amazon KDP</li>
  <li style="margin-bottom:8px;">la couverture KDP (dos, 4e de couverture, format exact)</li>
  <li style="margin-bottom:8px;">les livres illustrés pour enfants 3-7 ans</li>
  <li style="margin-bottom:8px;">la fiche Amazon : description, mots-clés, catégories</li>
  <li style="margin-bottom:8px;">la V3 ajoutée automatiquement, sans repayer</li>
</ul>
<p style="margin:0 0 28px;">C'est le prix d'un repas au restaurant, pour un outil que vous gardez à vie.</p>
${button(link, CTA_LABEL.a)}
<p style="margin:0 0 18px;">Si vous hésitez, répondez-moi en une ligne : je réponds moi-même.</p>`);
  }

  return shell("Histoire vraie", `<p style="margin:0 0 18px;">Bonjour,</p>
<p style="margin:0 0 18px;">Marie n'y connaissait absolument rien aux livres.</p>
<p style="margin:0 0 18px;">Elle avait une idée — un guide pratique autour d'une passion — mais elle ne savait pas comment transformer ça en un vrai ebook, au bon format, prêt à vendre sur Amazon.</p>
<p style="margin:0 0 18px;">Elle a donné son idée en une phrase. L'outil a proposé le sommaire. Elle a validé. Les chapitres se sont écrits. Elle a relu, corrigé ce qui lui importait, et a téléchargé son fichier KDP.</p>
<p style="margin:0 0 18px;">Elle n'a pas mis en page. Elle n'a pas calculé les marges. Elle a juste suivi le workflow.</p>
<p style="margin:0 0 18px;"><strong>La question qu'elle m'a posée après :</strong><br>« Pourquoi je ne l'ai pas fait plus tôt ? »</p>
<table role="presentation" width="100%" style="margin:26px 0;background:#f9fafb;border-radius:8px;">
  <tr><td style="padding:20px;text-align:center;">
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:32px;font-weight:bold;color:#064e3b;line-height:1.2;">47 € <span style="font-size:16px;color:#555;font-weight:normal;">au lieu de 59 €</span></p>
    <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#666;">une seule fois — pas d'abonnement — jusqu'au ${DEADLINE}</p>
  </td></tr>
</table>
<p style="margin:0 0 18px;">Si Marie a pu le faire en partant de zéro, il y a de fortes chances que vous puissiez le faire aussi.</p>
${button(link, CTA_LABEL.b)}
<p style="margin:0 0 18px;">Si vous avez une question, répondez à cet email. Je lis tout et je réponds personnellement.</p>`);
}

/* ------------------------------------------------------------------ */

async function fetchAll<T = any>(
  supabase: any,
  table: string,
  columns: string,
  filter?: (q: any) => any,
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

// Split déterministe 50/50 basé sur l'email (même adresse => toujours même variante)
function pickVariant(email: string): Variant {
  let h = 0;
  for (let i = 0; i < email.length; i++) h = (h * 31 + email.charCodeAt(i)) >>> 0;
  return h % 2 === 0 ? "a" : "b";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");

    let testMode = false;
    let limit: number | null = null;
    let audience = "fresh";
    try {
      const body = await req.json();
      testMode = body?.test === true;
      if (typeof body?.limit === "number") limit = body.limit;
      if (body?.audience === "openers" || body?.audience === "all") audience = body.audience;
    } catch { /* pas de body */ }

    const norm = (e: string) => (e ?? "").trim().toLowerCase();

    // Base d'audience
    let base: string[];
    if (audience === "openers") {
      const opens = await fetchAll(supabase, "email_opens", "prospect_email");
      base = (opens ?? []).map((o: any) => norm(o.prospect_email));
    } else {
      const prospects = await fetchAll(supabase, "sales_prospects", "email");
      base = (prospects ?? []).map((p: any) => norm(p.email));
    }

    // Exclusions
    const unsub = await fetchAll(supabase, "sales_prospects", "email", (q: any) => q.eq("unsubscribed", true));
    const unsubSet = new Set((unsub ?? []).map((p: any) => norm(p.email)));

    const paid = await fetchAll(supabase, "funnel_orders", "email", (q: any) => q.eq("status", "paid"));
    const paidSet = new Set((paid ?? []).map((p: any) => norm(p.email)));

    // Déjà servis par ce test A/B
    const alreadyAb = await fetchAll(supabase, "email_send_log", "recipient_email", (q: any) =>
      q.in("template_name", ["ab-47-a", "ab-47-b"]).eq("status", "sent"));
    const abSet = new Set((alreadyAb ?? []).map((s: any) => norm(s.recipient_email)));

    // Audience "fresh" : on retire ceux qui ont déjà reçu l'étape 1 de la série 47 €
    let serieSet = new Set<string>();
    if (audience === "fresh") {
      const serie = await fetchAll(supabase, "email_send_log", "recipient_email", (q: any) =>
        q.eq("template_name", "offre-47-serie-1").eq("status", "sent"));
      serieSet = new Set((serie ?? []).map((s: any) => norm(s.recipient_email)));
    }

    let recipients = Array.from(new Set(
      base.filter((e) =>
        e && e.includes("@") &&
        !unsubSet.has(e) && !paidSet.has(e) && !abSet.has(e) &&
        !serieSet.has(e) && e !== ADMIN_EMAIL),
    ));

    if (limit && limit > 0) recipients = recipients.slice(0, limit);

    // Mode test : les 2 variantes à l'admin
    const jobs: Array<{ to: string; v: Variant }> = testMode
      ? [{ to: ADMIN_EMAIL, v: "a" }, { to: ADMIN_EMAIL, v: "b" }]
      : recipients.map((to) => ({ to, v: pickVariant(to) }));

    const results: any[] = [];
    for (const job of jobs) {
      const link = trackedUrl(job.to, job.v);
      const r = await sendResendEmailThrottled({
        from: FROM_ADDRESS,
        to: [job.to],
        subject: SUBJECTS[job.v],
        text: bodyText(job.v, link),
        html: bodyHtml(job.v, link, job.to),
        reply_to: ADMIN_EMAIL,
      });
      results.push({ to: job.to, variant: job.v, ok: r.ok, id: r.id });
      try {
        await supabase.from("email_send_log").insert({
          recipient_email: job.to,
          template_name: templateName(job.v),
          message_id: r.id ?? null,
          status: r.ok ? "sent" : "error",
          error_message: r.ok ? null : `HTTP ${r.status ?? ""}: ${r.detail ?? ""}`,
        });
      } catch { /* noop */ }
      if (isQuotaExhausted()) {
        console.warn("[ab-47] Quota Resend atteint, arrêt du lot");
        break;
      }
    }

    const sentA = results.filter((r) => r.ok && r.variant === "a").length;
    const sentB = results.filter((r) => r.ok && r.variant === "b").length;

    return new Response(JSON.stringify({
      audience,
      testMode,
      total: jobs.length,
      sent: sentA + sentB,
      sentA,
      sentB,
      results: results.slice(0, 50),
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("[ab-47] error", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
