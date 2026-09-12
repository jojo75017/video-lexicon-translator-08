import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { sendResendEmailThrottled, isQuotaExhausted } from "../_shared/resendThrottle.ts";
import { EMAIL_SENDING_ENABLED, emailSendingBlockedResult } from "../_shared/emailSendingGuard.ts";
import { SITE_ORIGIN } from "../_shared/checkoutUrl.ts";
import { FROM_CAMPAIGN, REPLY_TO, DIRECT_EMAIL } from "../_shared/emailIdentity.ts";

/**
 * Séquence de lancement V3 (calée sur le 1er octobre 2026).
 *
 * 4 emails :
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
  /** Paragrapes du corps (texte). Le CTA est inséré automatiquement. */
  paragraphs: string[];
}

const LAUNCH_EMAILS: LaunchEmail[] = [
  {
    step: 1,
    template: "v3l-essai-J18",
    shortKey: "l1",
    subject: "Votre chapitre 1 écrit en 2 minutes (gratuit)",
    preheader: "Une phrase suffit. Sans carte bancaire, sans inscription.",
    ctaLabel: "Écrire mon chapitre 1 gratuitement",
    goal: "Démarrer l'essai gratuit sur /essai",
    paragraphs: [
      "Le 1er octobre, EbookStudio passe en V3. Avant cela, je vous propose de voir votre livre de vos yeux, sans rien payer.",
      "Écrivez une seule phrase : votre idée de livre. En deux minutes, vous avez sous les yeux le titre, le sous-titre, le sommaire complet et le début de votre chapitre 1 — écrit pour votre sujet, pas pour un exemple.",
      "C'est votre livre, pas une démonstration. Et ça ne coûte rien : pas de carte bancaire, pas de compte à créer pour voir le résultat.",
      "Si le début vous plaît, vous demandez le chapitre 1 en entier : il s'affiche et vous le recevez par email pour le garder.",
    ],
  },
  {
    step: 2,
    template: "v3l-livre-J10",
    shortKey: "l2",
    subject: "J'ai écrit un livre entier en une soirée",
    preheader: "Le trajet exact, étape par étape. Reproductible chez vous.",
    ctaLabel: "Voir comment j'ai fait",
    goal: "Démarrer l'essai gratuit sur /essai",
    paragraphs: [
      "Hier soir, j'ai pris une idée simple et j'en ai fait un livre complet. Voici le trajet exact :",
      "- une phrase de sujet → un sommaire chapitre par chapitre, corrigé à la main ;",
      "- chaque chapitre rédigé séparément, en tenant compte des précédents ;",
      "- une relecture professionnelle pour les répétitions et le français ;",
      "- un export Word et PDF aux normes Amazon KDP, sommaire compris ;",
      "- la couverture générée puis recadrée aux dimensions exactes d'Amazon.",
      "Ce n'est pas un cours pour plus tard. C'est un livre fini à la fin de la soirée. Et la première étape, celle qui décide de tout, vous pouvez la faire maintenant en deux minutes, gratuitement.",
    ],
  },
  {
    step: 3,
    template: "v3l-changement-J4",
    shortKey: "l3",
    subject: "Après le 30/09, l'accès à vie disparaît",
    preheader: "47 € une fois aujourd'hui, ou un abonnement ensuite. Le choix est maintenant.",
    ctaLabel: "Profiter de l'accès à vie à 47 €",
    goal: "Commander l'accès à vie 47 €",
    paragraphs: [
      `Je pose le calcul en clair, à 4 jours de la date butoir.`,
      `Aujourd'hui : 47 € une seule fois, accès à vie, la V3 incluse. Aucun prélèvement mensuel, par carte ou par PayPal, en 1, 2 ou 3 fois.`,
      `Après le ${DEADLINE} : l'accès à vie disparaît. EbookStudio passe en ${AFTER_OFFER}. En trois mois d'abonnement, vous aurez dépassé le prix d'aujourd'hui — et vous continuerez de payer chaque mois.`,
      "Ceux qui entrent avant la date ne repayeront jamais. Garantie 30 jours, sans justification : si l'outil ne vous convient pas, vous êtes remboursé sur simple demande.",
    ],
  },
  {
    step: 4,
    template: "v3l-dernier-J1",
    shortKey: "l4",
    subject: "Dernier jour : l'accès à vie 47 € ferme ce soir",
    preheader: "Demain, l'entrée se fait uniquement par abonnement mensuel.",
    ctaLabel: "Commander avant ce soir",
    goal: "Commander l'accès à vie 47 € (dernier jour)",
    paragraphs: [
      `C'est mon dernier message sur cette offre.`,
      `Ce soir, l'accès à vie à 47 € se termine. Demain, l'entrée se fait uniquement par ${AFTER_OFFER}.`,
      "Si vous hésitez encore, répondez à cet email : c'est moi qui lis, et je réponds avant ce soir.",
      "Garantie 30 jours, sans justification. Aucune question, aucun formulaire.",
    ],
  },
  {
    step: 5,
    template: "v3l-niches-offertes",
    shortKey: "l5",
    subject: "10 niches Amazon rentables, offertes",
    preheader: "Cliquez pour recevoir votre PDF des 10 niches.",
    ctaLabel: "Cliquer pour recevoir mon PDF des 10 niches",
    goal: "Ouvrir la page cadeau /10-niches-offertes (le PDF est débloqué par le clic)",
    paragraphs: [
      "Avant d'écrire quoi que ce soit, il y a une question à trancher : est-ce que quelqu'un cherche ce livre sur Amazon ?",
      "Je vous offre la réponse pour 10 sujets. Une niche par grande catégorie (romance, thriller, développement personnel, finances, santé, cuisine, jeunesse, parascolaire, carnets, pratique), avec pour chacune :",
      "- le mot-clé exact tapé par les lecteurs sur Amazon ;",
      "- le BSR à viser pour être visible ;",
      "- le niveau de concurrence et le prix de vente constaté.",
      "Le PDF n'est pas joint à cet email : il est réservé à ceux qui cliquent. Un clic sur le bouton ci-dessous ouvre votre page cadeau et débloque le téléchargement du PDF.",
      `Et si l'envie d'écrire vous prend : l'accès à vie à EbookStudio reste à 47 € une seule fois jusqu'au ${DEADLINE}. Après cette date, l'entrée se fera par ${AFTER_OFFER}.`,
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

function buildText(email: LaunchEmail, firstName: string | null, ctaUrl: string): string {
  const hello = firstName ? `Bonjour ${firstName},` : "Bonjour,";
  const body = email.paragraphs.join("\n\n");
  return `${hello}\n\n${body}\n\n>> ${email.ctaLabel} : ${ctaUrl}\n\n${SIGN}`;
}

function buildHtml(email: LaunchEmail, firstName: string | null, ctaUrl: string, pixelUrl: string): string {
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
EbookStudio — V3 arrive le 1er octobre
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
<p style="font-size:11px;color:#999;text-align:center;margin:16px 0 0">Vous recevez cet email car vous avez demandé à découvrir EbookStudio. Désinscription via le lien de pied de page.</p>
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
    const email = LAUNCH_EMAILS.find((e) => e.step === stepNum) ?? LAUNCH_EMAILS[0];
    const segment = String(body.segment || "hot"); // hot | all | cold | personal
    const limit = Math.max(1, Math.min(300, Number(body.limit) || 100));
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
    const { data: prospects, error: pErr } = await db
      .from("sales_prospects")
      .select("email,first_name,source,status,unsubscribed")
      .eq("status", "active")
      .eq("unsubscribed", false)
      .limit(5000);
    if (pErr) throw pErr;

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

    const seen = new Set<string>();
    const recipients: Recipient[] = [];
    for (const p of prospects || []) {
      const raw = String((p as any).email || "").trim().toLowerCase();
      if (!raw || isInternalEmail(raw)) continue;
      if (exclude.has(raw)) continue;
      if (alreadySent.has(raw)) continue;
      if (seen.has(raw)) continue;
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

      const res = await sendResendEmailThrottled({
        from: FROM_CAMPAIGN,
        to: [to],
        reply_to: REPLY_TO,
        subject: email.subject,
        html: buildHtml(email, r.first_name, ctaUrl, pixelUrl),
        text: buildText(email, r.first_name, ctaUrl),
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
