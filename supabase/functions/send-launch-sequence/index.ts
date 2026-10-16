import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { sendResendEmailThrottled, isQuotaExhausted } from "../_shared/resendThrottle.ts";
import { EMAIL_SENDING_ENABLED, emailSendingBlockedResult } from "../_shared/emailSendingGuard.ts";
import { SITE_ORIGIN } from "../_shared/checkoutUrl.ts";
import { FROM_CAMPAIGN, REPLY_TO, DIRECT_EMAIL } from "../_shared/emailIdentity.ts";
import { canSendLaunchEmail, LAUNCH_EMAIL_DATES } from "../_shared/launchEmailSchedule.ts";
import { launchEmailBatchLimit } from "../_shared/launchEmailBatch.ts";

/**
 * Séquence de lancement V3 (calée sur le 1er octobre 2026).
 *
 * 6 emails :
 *  1. J-18  l'essai gratuit           → /essai      (v3l-essai-J18)
 *  2. J-10  un livre écrit sous vos yeux → /essai   (v3l-livre-J10)
 *  3. J-4   ce qui change au 1er octobre → /commander (v3l-changement-J4)
 *  4. J-1   dernier jour à 47 €         → /commander (v3l-dernier-J1)
 *
 * Envoi contrôlé par Resend (lots, throttle, arrêt au quota quotidien/mensuel).
 * Sécurité : admin (has_role) OU secret cron. Modes : status / preview / send.
 *
 * Aucune écriture en base nouvelle : on lit sales_prospects / funnel_leads /
 * email_clicks / email_send_log / funnel_orders / v3_installment_orders /
 * subscribers, et on écrit uniquement dans email_send_log + last_email_sent_at
 * sur sales_prospects. Aucun changement de tarif, de paiement ou de sécurité.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

const DEADLINE = "30 septembre 2026";
const AFTER_OFFER = "abonnement mensuel sans engagement : 27 €/mois (Plume) ou 47 €/mois (Édition)";

interface LaunchEmail {
  step: number;
  template: string;
  shortKey: string;
  subject: string;
  preheader: string;
  ctaLabel: string;
  goal: string;
  header?: string;
  /** Paragrapes du corps (texte). Le CTA est inséré automatiquement. */
  paragraphs: string[];
  /** Relances ciblées selon le comportement face à l'email 1. */
  audience?: "clicked_t16a" | "not_clicked_t16a";
}

const LAUNCH_EMAILS: LaunchEmail[] = [
  {
    step: 1,
    template: "t16-ouverture-2026-10-16",
    shortKey: "t16a",
    subject: "C'est ouvert : votre maison d'édition IA vous attend",
    preheader: "Les portes de la nouvelle offre EbookStudio viennent de s'ouvrir.",
    ctaLabel: "Découvrir la nouvelle offre",
    goal: "Ouvrir le tunnel du 16 octobre",
    header: "EbookStudio — c'est ouvert aujourd'hui",
    paragraphs: [
      "Ça y est : la nouvelle version d'EbookStudio est ouverte depuis ce matin.",
      "Imaginez : vous posez votre idée, et une équipe de spécialistes IA vous accompagne jusqu'au livre fini — sommaire, chapitres, correction, couverture et fiche Amazon KDP.",
      "- Écrire un livre complet, chapitre par chapitre ;\n- Une couverture prête pour Amazon ;\n- Une correction éditoriale qui chasse les répétitions ;\n- Tout en français, sans jargon.",
      "J'ai préparé une page qui vous montre tout, en quelques minutes. Jetez-y un œil : vous verrez tout de suite si c'est fait pour vous.",
    ],
  },
  {
    step: 2,
    template: "t16-livre-fini-2026-10-16",
    shortKey: "t16b",
    subject: "Le livre que vous repoussez peut exister ce mois-ci",
    preheader: "Ce qui vous bloque n'est pas le talent. C'est la méthode.",
    ctaLabel: "Voir comment ça marche",
    goal: "Ouvrir le tunnel du 16 octobre (relance)",
    header: "EbookStudio — votre livre, enfin",
    paragraphs: [
      "Combien de fois vous êtes-vous dit « un jour, j'écrirai ce livre » ?",
      "Ce qui bloque, presque toujours, ce n'est pas le talent : c'est la page blanche, le plan qui n'arrive pas, la peur de mal faire.",
      "EbookStudio prend tout ça en charge, étape par étape. Vous gardez la main sur votre histoire ; l'équipe IA fait le travail lourd.",
      "Regardez la page ci-dessous : en deux minutes, vous saurez si votre livre peut voir le jour ce mois-ci.",
    ],
  },
  {
    step: 3,
    template: "t16-derniere-chance-2026-10-16",
    shortKey: "t16c",
    subject: "Vous n'avez pas encore regardé ?",
    preheader: "Deux minutes suffisent pour savoir si c'est pour vous.",
    ctaLabel: "Je regarde maintenant",
    goal: "Ouvrir le tunnel du 16 octobre (dernier rappel)",
    header: "EbookStudio — un dernier mot",
    paragraphs: [
      "Je vous écris une dernière fois à ce sujet, promis.",
      "La nouvelle offre EbookStudio est ouverte, et beaucoup d'auteurs ont déjà commencé leur livre.",
      "Si vous avez une idée qui dort dans un coin de votre tête, c'est peut-être le bon moment. Un clic pour voir, sans aucun engagement.",
      "Et si vous avez une question, répondez simplement à cet email : je lis tout personnellement.",
    ],
  },
  {
    step: 4,
    audience: "clicked_t16a",
    template: "t17-niches-cliqueurs-2026-10-17",
    shortKey: "t17a",
    subject: "Vos 10 niches Amazon KDP offertes (à télécharger ici)",
    preheader: "Un cadeau pour vous remercier d'avoir regardé vendredi.",
    ctaLabel: "Télécharger mes 10 niches",
    goal: "Cliqueurs de l'email 1 : cadeau 10 niches",
    header: "EbookStudio — votre cadeau",
    paragraphs: [
      "Vous avez jeté un œil à l'ouverture d'EbookStudio vendredi, et je voulais vous remercier pour votre intérêt.",
      "Trouver la bonne idée de livre est souvent l'étape qui bloque tout le monde. Alors pour vous aider à démarrer concrètement, je vous offre 10 niches Amazon KDP sélectionnées pour vous, sans condition d'achat.",
      "Vous pouvez les utiliser pour :\n- Écrire un guide pratique ;\n- Positionner un ebook professionnel pour votre activité ;\n- Ou simplement lancer votre premier titre sur Amazon.",
      "Et quand vous aurez choisi votre niche, EbookStudio vous aide à écrire le livre de A à Z : https://ebookstudio-2026-offre-47.landaa.io/f/tunnel-de-vente/page-de-vente-copy?utm_source=email&utm_medium=resend&utm_campaign=t17&utm_content=offre-texte",
      "Votre cadeau est ici, en un clic :",
    ],
  },
  {
    step: 5,
    audience: "not_clicked_t16a",
    template: "t18-question-non-cliqueurs-2026-10-18",
    shortKey: "t18a",
    subject: "Une question rapide : quel est votre projet ?",
    preheader: "Pour vous, pour transmettre, ou pour votre entreprise ?",
    ctaLabel: "Découvrir ce que vous pouvez créer",
    goal: "Non-cliqueurs de l'email 1 : levée d'objection",
    header: "EbookStudio — une question",
    paragraphs: [
      "Vendredi, je vous annonçais l'ouverture de la nouvelle version d'EbookStudio, mais vous n'avez peut-être pas eu le temps d'y jeter un œil.",
      "Je me posais une question toute simple : quel est votre projet ? Écrivez-vous pour vous, pour transmettre une histoire, ou pour votre entreprise ?",
      "Beaucoup pensent qu'EbookStudio sert uniquement aux romans. En réalité, vous pouvez aussi :\n- Créer un livre pour votre entreprise ou votre marque ;\n- Rédiger un guide pour attirer des clients ;\n- Transmettre un savoir, une méthode ou votre parcours de vie.",
      "Vous n'avez plus besoin de passer des mois devant une page blanche. Prenez deux minutes pour voir si cela correspond à votre projet :",
    ],
  },
];

const SIGN = `Georges Boubet\nFondateur d'EbookStudio\n${DIRECT_EMAIL}`;

/** Adresses internes / de test : jamais contactées en masse. */
function isInternalEmail(email: string): boolean {
  const e = email.trim().toLowerCase();
  if (!e || !e.includes("@")) return true;
  if (e.endsWith("@example.com")) return true;
  if (e.endsWith("@ebookstudio.fr")) return true;
  if (e.endsWith("@systemeio.local")) return true;
  if (e.includes("+test")) return true;
  if (e.includes("test-") || e.includes("-test")) return true;
  if (e.startsWith("boubetgeorges")) return true;
  if (e.includes("mail-tester.com")) return true;
  return false;
}

/**
 * Boîtes grand public : ce sont les personnes qui peuvent réellement
 * vouloir écrire un livre. Les adresses d'entreprises, mairies,
 * associations et cabinets sont écartées de ce segment.
 */
const PERSONAL_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "hotmail.fr", "hotmail.com", "hotmail.be",
  "outlook.fr", "outlook.com", "live.fr", "live.com", "msn.com",
  "yahoo.fr", "yahoo.com", "ymail.com",
  "orange.fr", "wanadoo.fr", "free.fr", "sfr.fr", "neuf.fr", "laposte.net",
  "bbox.fr", "numericable.fr", "aliceadsl.fr", "club-internet.fr",
  "icloud.com", "me.com", "mac.com", "protonmail.com", "proton.me", "gmx.fr", "aol.com",
]);

function isPersonalAddress(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return PERSONAL_DOMAINS.has(domain);
}

async function isAdmin(req: Request, baseUrl: string): Promise<boolean> {
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

function buildText(email: LaunchEmail, firstName: string | null, ctaUrl: string, unsubscribeUrl: string): string {
  const hello = firstName ? `Bonjour ${firstName},` : "Bonjour,";
  const body = email.paragraphs.join("\n\n");
  return `${hello}\n\n${body}\n\n>> ${email.ctaLabel} : ${ctaUrl}\n\n${SIGN}\n\nSe désinscrire : ${unsubscribeUrl}`;
}

function buildHtml(email: LaunchEmail, firstName: string | null, ctaUrl: string, pixelUrl: string, unsubscribeUrl: string): string {
  const hello = firstName ? `Bonjour ${firstName},` : "Bonjour,";
  const paragraphs = email.paragraphs
    .map((p) => {
      const trimmed = p.trim();
      if (trimmed.startsWith("- ")) {
        const items = trimmed
          .split("\n")
          .map((line) => line.replace(/^-\s*/, "").trim())
          .filter(Boolean)
          .map((line) => `<li style="margin:0 0 8px;line-height:1.6;">${line}</li>`)
          .join("");
        return `<ul style="margin:0 0 16px;padding-left:22px;">${items}</ul>`;
      }
      return `<p style="margin:0 0 16px;line-height:1.65;">${trimmed.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");

  return `<!DOCTYPE html><html lang="fr"><body style="margin:0;background:#FAFAFA">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAFAFA;padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;font-family:Georgia,'Times New Roman',serif;color:#1f2937">
<tr><td style="background:#232F3E;padding:22px 26px;color:#ffffff;font:700 21px/1.3 Arial,Helvetica,sans-serif">
${email.header ?? "EbookStudio"}
</td></tr>
<tr><td style="padding:26px;font-size:16px;line-height:1.6">
<p style="margin:0 0 16px">${hello}</p>
${paragraphs}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 22px"><tr>
<td style="background:#008296;border-radius:8px"><a href="${ctaUrl}" style="display:inline-block;padding:14px 26px;color:#ffffff;text-decoration:none;font:700 16px Arial,Helvetica,sans-serif">${email.ctaLabel}</a></td>
</tr></table>
<p style="margin:0;font-size:14px;color:#555">Une question avant de vous lancer ? Répondez à cet email : je lis et je réponds personnellement.</p>
<p style="margin:20px 0 0">Georges Boubet<br><span style="color:#555;font-size:14px">EbookStudio — 71 livres déjà publiés</span></p>
</td></tr>
</table>
<p style="font-size:11px;color:#999;text-align:center;margin:16px 0 0">Vous recevez cet email car vous avez demandé à découvrir EbookStudio. <a href="${unsubscribeUrl}" style="color:#999">Se désinscrire</a></p>
<img src="${pixelUrl}" width="1" height="1" alt="" style="display:none;width:1px;height:1px" />
</td></tr></table></body></html>`;
}

interface Recipient {
  email: string;
  first_name: string | null;
  source: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const respond = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const baseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const db = createClient(baseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");

    // Auth : admin OU secret cron.
    const { data: cronSecret } = await db.from("app_secrets").select("value").eq("key", "cron_secret").maybeSingle();
    const hasCronSecret = !!cronSecret?.value && req.headers.get("x-cron-secret") === cronSecret.value;
    if (!hasCronSecret && !(await isAdmin(req, baseUrl))) {
      return respond({ error: "Accès administrateur requis" }, 403);
    }

    const body = await req.json().catch(() => ({}));
    const mode = String(body.mode || "status"); // status | preview | send
    const stepNum = Number(body.step) || 1;
    const email = LAUNCH_EMAILS.find((e) => e.step === stepNum);
    if (!email) return respond({ error: "Email inconnu" }, 400);
    if (mode === "send" && !canSendLaunchEmail(stepNum)) {
      return respond({ error: `L’email ${stepNum} peut être envoyé uniquement le ${LAUNCH_EMAIL_DATES[stepNum]} (heure de Paris).`, scheduled_date: LAUNCH_EMAIL_DATES[stepNum] }, 409);
    }
    const segment = String(body.segment || "hot"); // hot | all | cold | personal
    const limit = launchEmailBatchLimit(body.limit);
    // Pour test : rediriger tous les envois vers une seule adresse.
    const overrideTestTo = typeof body.overrideTestTo === "string" && /.+@.+\..+/.test(body.overrideTestTo)
      ? body.overrideTestTo.trim().toLowerCase()
      : null;

    // --- Adresses à exclure : clients déjà payants + abonnés actifs. ---
    const exclude = new Set<string>();
    const { data: paid } = await db.from("funnel_orders").select("email").in("status", ["paid"]).limit(5000);
    for (const r of paid || []) {
      const e = String((r as any).email || "").toLowerCase();
      if (e) exclude.add(e);
    }
    const { data: paidInst } = await db
      .from("v3_installment_orders").select("email").in("status", ["active", "completed", "paid"]).limit(5000);
    for (const r of paidInst || []) {
      const e = String((r as any).email || "").toLowerCase();
      if (e) exclude.add(e);
    }
    const { data: subs } = await db.from("subscribers").select("email").eq("status", "active").limit(5000);
    for (const r of subs || []) {
      const e = String((r as any).email || "").toLowerCase();
      if (e) exclude.add(e);
    }

    // --- Segment « chaud » : funnel_leads + clics identifiés. ---
    const hot = new Set<string>();
    const { data: leads } = await db.from("funnel_leads").select("email");
    for (const r of leads || []) {
      const e = String((r as any).email || "").toLowerCase();
      if (e) hot.add(e);
    }
    const { data: clicks } = await db
      .from("email_clicks").select("prospect_email").neq("prospect_email", "").limit(20000);
    for (const r of clicks || []) {
      const e = String((r as any).prospect_email || "").toLowerCase();
      if (e && !e.includes("anonyme")) hot.add(e);
    }

    // --- Base : prospects actifs, non désabonnés. ---
    const prospects: { email: string; first_name: string | null; source: string | null; status: string | null; unsubscribed: boolean | null }[] = [];
    for (let offset = 0; ; offset += 1000) {
      const { data: page, error: pErr } = await db
        .from("sales_prospects")
        .select("email,first_name,source,status,unsubscribed")
        .eq("status", "active")
        .eq("unsubscribed", false)
        .order("id")
        .range(offset, offset + 999);
      if (pErr) throw pErr;
      prospects.push(...(page || []));
      if (!page || page.length < 1000) break;
    }

    // --- Déjà reçus CET email (anti-doublon par template). ---
    const alreadySent = new Set<string>();
    const { data: prior } = await db
      .from("email_send_log")
      .select("recipient_email")
      .eq("template_name", email.template)
      .limit(20000);
    for (const r of prior || []) {
      const e = String((r as any).recipient_email || "").toLowerCase();
      if (e) alreadySent.add(e);
    }

    // --- Adresses mortes : rebonds, plaintes spam ou bloquées par Resend. ---
    // Elles ne doivent plus jamais recevoir d'email, quel que soit le segment.
    const deadEmails = new Set<string>();
    for (let offset = 0; ; offset += 1000) {
      const { data: page } = await db.from("email_send_log").select("recipient_email,last_event,status")
        .range(offset, offset + 999);
      for (const r of page || []) {
        const ev = String((r as any).last_event || "");
        if (["suppressed", "bounced", "complained"].includes(ev) || String((r as any).status) === "error") {
          const e = String((r as any).recipient_email || "").toLowerCase();
          if (e) deadEmails.add(e);
        }
      }
      if (!page || page.length < 1000) break;
    }

    // --- Relances ciblées : comportement face à l'email 1. ---
    const receivedT16a = new Set<string>();
    const clickedT16a = new Set<string>();
    if (email.audience) {
      for (let offset = 0; ; offset += 1000) {
        const { data: page } = await db.from("email_send_log").select("recipient_email,status")
          .eq("template_name", "t16-ouverture-2026-10-16").range(offset, offset + 999);
        for (const r of page || []) {
          if (["sent", "delivered"].includes(String((r as any).status))) receivedT16a.add(String((r as any).recipient_email || "").toLowerCase());
        }
        if (!page || page.length < 1000) break;
      }
      const { data: c16 } = await db.from("email_clicks").select("prospect_email")
        .eq("template_name", "t16-ouverture-2026-10-16").limit(20000);
      for (const r of c16 || []) clickedT16a.add(String((r as any).prospect_email || "").toLowerCase());
    }

    const seen = new Set<string>();
    const recipients: Recipient[] = [];
    for (const p of prospects || []) {
      const raw = String((p as any).email || "").trim().toLowerCase();
      if (!raw || isInternalEmail(raw)) continue;
      if (exclude.has(raw)) continue;
      if (deadEmails.has(raw)) continue;
      if (alreadySent.has(raw)) continue;
      if (seen.has(raw)) continue;
      if (email.audience === "clicked_t16a" && !clickedT16a.has(raw)) continue;
      if (email.audience === "not_clicked_t16a" && (!receivedT16a.has(raw) || clickedT16a.has(raw))) continue;
      if (email.audience) { seen.add(raw); recipients.push({ email: raw, first_name: (p as any).first_name ?? null, source: String((p as any).source ?? "") }); continue; }
      if (segment === "hot" && !hot.has(raw)) continue;
      // Segment « non-cliqueurs » : jamais de clic identifié, jamais entré dans le tunnel.
      if (segment === "cold" && hot.has(raw)) continue;
      // Segment « personnel » : uniquement les boîtes grand public (futurs auteurs),
      // pas les adresses d'entreprises, mairies, associations ou cabinets.
      if (segment === "personal" && !isPersonalAddress(raw)) continue;
      seen.add(raw);
      recipients.push({ email: raw, first_name: (p as any).first_name ?? null, source: String((p as any).source ?? "") });
    }

    // Les adresses personnelles passent toujours en premier dans le lot.
    recipients.sort((a, b) => Number(isPersonalAddress(b.email)) - Number(isPersonalAddress(a.email)));

    const totalEligible = recipients.length;
    const personalEligible = recipients.filter((r) => isPersonalAddress(r.email)).length;
    const targets = recipients.slice(0, limit);

    if (mode === "status" || mode === "preview") {
      return respond({
        success: true,
        mode,
        email: {
          step: email.step,
          template: email.template,
          subject: email.subject,
          preheader: email.preheader,
          ctaLabel: email.ctaLabel,
          goal: email.goal,
          ctaShortKey: email.shortKey,
        },
        segment,
        total_eligible: totalEligible,
        personal_eligible: personalEligible,
        batch_limit: limit,
        targets_in_batch: targets.length,
        sample: targets.slice(0, 12).map((t) => ({
          email: t.email,
          first_name: t.first_name,
          source: t.source,
        })),
        excluded_counts: {
          paid_or_subscribed: exclude.size,
          already_received_template: alreadySent.size,
          hot_segment: hot.size,
        },
      });
    }

    // mode 'send'
    if (!EMAIL_SENDING_ENABLED) return respond(emailSendingBlockedResult(), 423);

    const sent: string[] = [];
    const errors: string[] = [];
    let quotaStopped = false;

    for (const r of targets) {
      const to = overrideTestTo ?? r.email;
      const encEmail = encodeURIComponent(r.email);
      const ctaUrl = `${SITE_ORIGIN}/r/${email.shortKey}?e=${encEmail}&t=${encodeURIComponent(email.template)}`;
      const pixelUrl = `${baseUrl}/functions/v1/track-email-open?s=${email.step}&t=${encodeURIComponent(email.template)}&e=${encEmail}`;
      const unsubscribeUrl = `${baseUrl}/functions/v1/unsubscribe?email=${encEmail}`;

      const res = await sendResendEmailThrottled({
        from: FROM_CAMPAIGN,
        to: [to],
        reply_to: REPLY_TO,
        subject: email.subject,
        html: buildHtml(email, r.first_name, ctaUrl, pixelUrl, unsubscribeUrl),
        text: buildText(email, r.first_name, ctaUrl, unsubscribeUrl),
        tags: [{ name: "sequence", value: email.template }],
      });

      if (res?.ok) {
        sent.push(to);
        await db.from("email_send_log").insert({
          message_id: res.id ?? null,
          provider_message_id: res.id ?? null,
          template_name: email.template,
          recipient_email: to,
          status: "sent",
        });
        // Marque le prospect (adresse réelle uniquement).
        if (!overrideTestTo) {
          await db.from("sales_prospects").update({ last_email_sent_at: new Date().toISOString() }).eq("email", r.email);
        }
      } else {
        errors.push(`${to}: ${res?.detail || res?.status || "envoi refusé"}`);
      }

      if (isQuotaExhausted()) {
        quotaStopped = true;
        break;
      }
    }

    return respond({
      success: true,
      mode,
      email: { step: email.step, template: email.template, subject: email.subject },
      segment,
      limit,
      targeted: targets.length,
      sent: sent.length,
      errors: errors.slice(0, 30),
      quota_stopped: quotaStopped,
      override_test_to: overrideTestTo,
    });
  } catch (e) {
    return respond({ error: e instanceof Error ? e.message : "Erreur inconnue" }, 500);
  }
});
