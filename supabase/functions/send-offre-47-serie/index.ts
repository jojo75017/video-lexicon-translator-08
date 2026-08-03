// Campagne « Offre d'été 47 € » — série de 3 emails.
// Objectif : faire cliquer puis acheter. Un seul lien par email, prix bas, échéance claire.
//
// Body : { step: 1 | 2 | 3, test?: true, limit?: number, audience?: "openers" | "all" }
//   test: true   => envoi uniquement à l'admin
//   limit        => plafonne le lot (reprise possible)
//   audience     => "openers" (défaut, ceux qui ouvrent) ou "all" (toute la liste)

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
const COMMANDER = "https://www.ebookstudio.fr/commander";
const DEADLINE = "30 septembre";

const templateName = (step: number) => `offre-47-serie-${step}`;

function trackedUrl(email: string, step: number, params: string): string {
  const dest = `${COMMANDER}?src=offre47-${step}&email=${encodeURIComponent(email)}${params}`;
  return `${TRACK_CLICK}?e=${encodeURIComponent(email)}&s=${step}&u=${encodeURIComponent(dest)}&t=${encodeURIComponent(templateName(step))}`;
}

const SUBJECTS: Record<number, string> = {
  1: "47 € au lieu de 59 € (jusqu'au 30 septembre)",
  2: "la question que tout le monde me pose",
  3: "après le 30 septembre, ce sera 59 €",
};

/* ------------------------------------------------------------------ */
/* Contenus                                                            */
/* ------------------------------------------------------------------ */

function bodyText(step: number, link: string): string {
  if (step === 1) {
    return `Bonjour,

Georges, d'EbookStudio.

Je fais simple : jusqu'au ${DEADLINE}, l'accès complet passe de 59 € à 47 €.
Une seule fois. Pas d'abonnement. Pas de prélèvement mensuel.

Pour 47 € vous avez, à vie :
- le livre écrit chapitre par chapitre à partir de votre idée
- le sommaire et le fichier Word/PDF prêts pour Amazon KDP
- la couverture (dos et 4e de couverture calculés au bon format)
- les livres illustrés pour enfants 3-7 ans
- la fiche Amazon : description, mots-clés, catégories
- la V3 ajoutée automatiquement, sans repayer

C'est le prix d'un repas au restaurant, pour un outil que vous gardez à vie.

Je prends l'offre à 47 € : ${link}

Si vous hésitez, répondez-moi en une ligne : je réponds moi-même.

Georges Boubet
EbookStudio

--
Pour ne plus recevoir mes emails, répondez "STOP".`;
  }

  if (step === 2) {
    return `Bonjour,

La question qui revient le plus souvent dans ma boîte :
« Est-ce que je dois savoir écrire ? »

Non. C'est exactement pour ça que l'outil existe.

Vous donnez votre idée en une phrase. L'outil propose le sommaire.
Vous le validez (ou vous le changez). Il écrit les chapitres.
Vous relisez, vous corrigez ce que vous voulez, vous exportez.
Le fichier sort au bon format pour Amazon, avec la table des matières
et la couverture. Vous n'avez rien à mettre en page.

Deuxième question la plus fréquente : « c'est un abonnement ? »
Non. 47 € une seule fois, jusqu'au ${DEADLINE}. Vous gardez l'accès à vie,
V3 comprise, sans repayer.

Voir l'offre et commencer : ${link}

Georges Boubet
EbookStudio

--
Pour ne plus recevoir mes emails, répondez "STOP".`;
  }

  return `Bonjour,

Dernier message sur ce tarif.

Le ${DEADLINE} au soir, l'accès repasse à 59 €, et il n'y aura pas
de nouvelle remise ensuite : la V3 arrive avec beaucoup plus d'outils,
et son tarif suivra.

Donc si votre projet de livre traîne depuis des mois, c'est le bon
moment pour 47 € : vous n'aurez plus jamais à repayer, même pour la V3.

Trois choses que je veux que vous sachiez avant de décider :
1. Aucun abonnement, aucun prélèvement caché. Un paiement, terminé.
2. Possible en 2 × 25 € ou 3 × 18 € si vous préférez étaler.
3. Une question, un doute, un blocage : vous me répondez, je réponds.

J'en profite avant le ${DEADLINE} : ${link}

Et si ce n'est pas pour vous, aucun souci : je ne vous en reparlerai plus.

Georges Boubet
EbookStudio

--
Pour ne plus recevoir mes emails, répondez "STOP".`;
}

function button(link: string, label: string): string {
  return `<p style="margin:26px 0;">
  <a href="${link}" style="background:#064e3b;color:#ffffff;padding:15px 30px;border-radius:10px;text-decoration:none;font-weight:bold;font-family:Arial,Helvetica,sans-serif;font-size:16px;display:inline-block;">${label}</a>
</p>`;
}

const priceTag = `<p style="margin:18px 0;font-family:Arial,Helvetica,sans-serif;">
  <span style="font-size:20px;color:#888;text-decoration:line-through;">59 €</span>
  <span style="font-size:34px;font-weight:bold;color:#064e3b;margin-left:8px;">47 €</span>
  <span style="font-size:15px;color:#555;margin-left:6px;">une seule fois — pas d'abonnement</span>
</p>`;

function bodyHtml(step: number, link: string, email: string): string {
  const open = `<img src="${SUPABASE_URL}/functions/v1/track-email-open?e=${encodeURIComponent(email)}&s=${step}&t=${encodeURIComponent(templateName(step))}" width="1" height="1" alt="" style="display:none;" />`;
  const foot = `<p style="margin:18px 0 0;">Georges Boubet<br>EbookStudio</p>
<p style="font-size:13px;color:#777;border-top:1px solid #eee;padding-top:14px;margin-top:24px;">Pour ne plus recevoir mes emails, répondez simplement "STOP".</p>${open}`;
  const shell = (inner: string) =>
    `<div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.65;color:#111;max-width:560px;">${inner}${foot}</div>`;

  if (step === 1) {
    return shell(`<p>Bonjour,</p>
<p>Georges, d'EbookStudio.</p>
<p>Je fais simple : <strong>jusqu'au ${DEADLINE}, l'accès complet passe de 59 € à 47 €</strong>.
Une seule fois. Pas d'abonnement, pas de prélèvement mensuel.</p>
${priceTag}
<p>Pour 47 € vous avez, <strong>à vie</strong> :</p>
<ul style="padding-left:20px;margin:0 0 14px;">
  <li>le livre écrit chapitre par chapitre à partir de votre idée</li>
  <li>le sommaire et le fichier Word/PDF prêts pour Amazon KDP</li>
  <li>la couverture (dos et 4e de couverture calculés au bon format)</li>
  <li>les livres illustrés pour enfants 3-7 ans</li>
  <li>la fiche Amazon : description, mots-clés, catégories</li>
  <li>la V3 ajoutée automatiquement, sans repayer</li>
</ul>
<p>C'est le prix d'un repas au restaurant, pour un outil que vous gardez à vie.</p>
${button(link, "Je prends l'offre à 47 €")}
<p>Si vous hésitez, répondez-moi en une ligne : je réponds moi-même.</p>`);
  }

  if (step === 2) {
    return shell(`<p>Bonjour,</p>
<p>La question qui revient le plus souvent dans ma boîte :<br>
<em>« Est-ce que je dois savoir écrire ? »</em></p>
<p><strong>Non.</strong> C'est exactement pour ça que l'outil existe.</p>
<p>Vous donnez votre idée en une phrase. L'outil propose le sommaire.
Vous le validez (ou vous le changez). Il écrit les chapitres.
Vous relisez, vous corrigez ce que vous voulez, vous exportez.
Le fichier sort au bon format pour Amazon, avec la table des matières
et la couverture. <strong>Vous n'avez rien à mettre en page.</strong></p>
<p>Deuxième question la plus fréquente : <em>« c'est un abonnement ? »</em><br>
Non. <strong>47 € une seule fois, jusqu'au ${DEADLINE}.</strong> Vous gardez l'accès à vie,
V3 comprise, sans repayer.</p>
${priceTag}
${button(link, "Voir l'offre et commencer")}`);
  }

  return shell(`<p>Bonjour,</p>
<p><strong>Dernier message sur ce tarif.</strong></p>
<p>Le ${DEADLINE} au soir, l'accès repasse à 59 €, et il n'y aura pas de nouvelle
remise ensuite : la V3 arrive avec beaucoup plus d'outils, et son tarif suivra.</p>
<p>Donc si votre projet de livre traîne depuis des mois, c'est le bon moment :
vous n'aurez plus jamais à repayer, même pour la V3.</p>
${priceTag}
<p>Trois choses avant de décider :</p>
<p style="margin:0 0 6px;">1. Aucun abonnement, aucun prélèvement caché. Un paiement, terminé.</p>
<p style="margin:0 0 6px;">2. Possible en <strong>2 × 25 €</strong> ou <strong>3 × 18 €</strong> si vous préférez étaler.</p>
<p style="margin:0 0 14px;">3. Une question, un doute : vous me répondez, je réponds.</p>
${button(link, `J'en profite avant le ${DEADLINE}`)}
<p>Et si ce n'est pas pour vous, aucun souci : je ne vous en reparlerai plus.</p>`);
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");

    let step = 1;
    let testMode = false;
    let limit: number | null = null;
    let audience = "openers";
    try {
      const body = await req.json();
      if (body?.step === 2 || body?.step === 3) step = body.step;
      testMode = body?.test === true;
      if (typeof body?.limit === "number") limit = body.limit;
      if (body?.audience === "all") audience = "all";
    } catch { /* pas de body */ }

    const TEMPLATE = templateName(step);
    const norm = (e: string) => (e ?? "").trim().toLowerCase();

    // Audience
    let base: string[];
    if (audience === "all") {
      const prospects = await fetchAll(supabase, "sales_prospects", "email");
      base = (prospects ?? []).map((p: any) => norm(p.email));
    } else {
      const opens = await fetchAll(supabase, "email_opens", "prospect_email");
      base = (opens ?? []).map((o: any) => norm(o.prospect_email));
    }

    // Exclusions : désinscrits, acheteurs, déjà envoyés sur cette étape
    const unsub = await fetchAll(supabase, "sales_prospects", "email", (q: any) => q.eq("unsubscribed", true));
    const unsubSet = new Set((unsub ?? []).map((p: any) => norm(p.email)));

    const paid = await fetchAll(supabase, "funnel_orders", "email", (q: any) => q.eq("status", "paid"));
    const paidSet = new Set((paid ?? []).map((p: any) => norm(p.email)));

    const already = await fetchAll(supabase, "email_send_log", "recipient_email", (q: any) =>
      q.eq("template_name", TEMPLATE).eq("status", "sent"));
    const sentSet = new Set((already ?? []).map((s: any) => norm(s.recipient_email)));

    let recipients = Array.from(new Set(
      base.filter((e) =>
        e && e.includes("@") &&
        !unsubSet.has(e) && !paidSet.has(e) && !sentSet.has(e) && e !== ADMIN_EMAIL),
    ));

    if (testMode) recipients = [ADMIN_EMAIL];
    if (limit && limit > 0) recipients = recipients.slice(0, limit);

    const results: any[] = [];
    for (const to of recipients) {
      const link = trackedUrl(to, step, "");
      const r = await sendResendEmailThrottled({
        from: FROM_ADDRESS,
        to: [to],
        subject: SUBJECTS[step],
        text: bodyText(step, link),
        html: bodyHtml(step, link, to),
        reply_to: ADMIN_EMAIL,
      });
      results.push({ to, ok: r.ok, id: r.id });
      try {
        await supabase.from("email_send_log").insert({
          recipient_email: to,
          template_name: TEMPLATE,
          message_id: r.id ?? null,
          status: r.ok ? "sent" : "error",
          error_message: r.ok ? null : `HTTP ${r.status ?? ""}: ${r.detail ?? ""}`,
        });
      } catch { /* noop */ }
      if (isQuotaExhausted()) {
        console.warn("[offre-47] Quota Resend atteint, arrêt du lot");
        break;
      }
    }

    const sent = results.filter((r) => r.ok).length;
    return new Response(JSON.stringify({
      template: TEMPLATE, step, audience, total: recipients.length, sent, testMode,
      results: results.slice(0, 50),
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("[offre-47] error", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
