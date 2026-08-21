import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { isQuotaExhausted, sendResendEmailThrottled } from "../_shared/resendThrottle.ts";
import { EMAIL_SENDING_ENABLED, emailSendingBlockedResult } from "../_shared/emailSendingGuard.ts";
import { CHECKOUT_URL } from "../_shared/checkoutUrl.ts";
import { FROM_CAMPAIGN, REPLY_TO } from "../_shared/emailIdentity.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

const CAMPAIGN = "fin-47-lancement-v3-2026";
const CHECKOUT = CHECKOUT_URL;

/** Rappels du 21 au 31 août : 21 → 24 → 27 → 29 → 31. */
const DELAYS = [0, 3, 3, 2, 2];

/** Lien du média de lancement (vidéo ou audio), lu dans `launch_settings` à chaque appel. */
let VIDEO_URL = "";
let VIDEO_KIND: "video" | "audio" = "video";

async function loadVideoUrl(db: ReturnType<typeof createClient>) {
  const { data } = await db.from("launch_settings").select("value").eq("key", "launch_video").maybeSingle();
  const value = (data?.value ?? {}) as { url?: string; enabled?: boolean; kind?: "video" | "audio" };
  VIDEO_URL = value.enabled === false ? "" : String(value.url || "");
  VIDEO_KIND = value.kind || (VIDEO_URL.endsWith(".mp3") ? "audio" : "video");
}


/** Nouveau tunnel de conversion : 1 email = 1 promesse = 1 seul lien vers une
 *  « fiche » (page pont), et la fiche n'a qu'un seul bouton vers /commander.
 *  L'email ne vend plus : il intrigue et fait cliquer. C'est la fiche qui vend. */
interface StepContent {
  subject: string;
  preheader: string;
  badge: string;
  heading: string;
  paragraphs: string[];
  cta: string;
  /** Chemin public de la fiche pont (unique destination de l'email). */
  fiche: string;
  ps: string;
}

const STEPS: StepContent[] = [
  {
    subject: "Marie n'y connaissait rien aux livres",
    preheader: "Rachel, elle, avait une autre histoire. Toutes les deux ont publié.",
    badge: "LEUR HISTOIRE",
    heading: "Deux histoires vraies, une même fin",
    paragraphs: [
      "Marie voulait écrire un guide pour les grands-parents. Elle n'avait jamais rien publié de sa vie.",
      "Rachel avait tout essayé : deux formations, des mois sur un manuscrit jamais terminé.",
      "Toutes les deux ont publié leur livre sur Amazon. Pas grâce à un talent caché — grâce à un chemin différent. J'ai raconté leur histoire sur une page : elle prend trois minutes à lire.",
    ],
    cta: "Lire l'histoire de Marie et Rachel",
    fiche: "/fiche/histoire",
    ps: "Jusqu'au 31 août, l'accès complet est à 47 € en un seul paiement. Mais lisez d'abord leur histoire.",
  },
  {
    subject: "Un message de 2 minutes, rien d'autre",
    preheader: "Pourquoi EbookStudio change la publication sur Amazon — en audio.",
    badge: "MESSAGE AUDIO — 2 MINUTES",
    heading: "Je vous parle 2 minutes, en audio",
    paragraphs: [
      "Aujourd'hui, pas de long email. J'ai enregistré un message de deux minutes.",
      "Je vous y explique pourquoi les anciens outils KDP deviennent inutiles au moment de la publication — et ce qui change le 31 août pour votre livre.",
      "Installez-vous, appuyez sur lecture. Le reste se décide après.",
    ],
    cta: "Écouter le message (2 minutes)",
    fiche: "/message",
    ps: "Vous pouvez l'écouter depuis votre téléphone. Et si une phrase vous accroche, répondez-moi.",
  },
  {
    subject: "Votre premier chapitre, écrit gratuitement",
    preheader: "Donnez votre idée : le premier chapitre est écrit devant vous. Sans carte.",
    badge: "CADEAU — SANS INSCRIPTION",
    heading: "Et si on écrivait votre premier chapitre ?",
    paragraphs: [
      "Je ne vais pas vous vendre quoi que ce soit aujourd'hui. Je vous propose un essai.",
      "Vous donnez votre idée de livre, vous choisissez le ton, et le premier chapitre est écrit sous vos yeux — corrigé, propre, avec votre sommaire.",
      "Gratuit, sans inscription, sans carte. Après, c'est vous qui décidez de la suite.",
    ],
    cta: "Écrire mon premier chapitre gratuitement",
    fiche: "/essai",
    ps: "Cinq minutes suffisent. Le chapitre vous appartient, même si vous ne revenez jamais.",
  },
  {
    subject: "Ils ont publié leur livre — leurs mots",
    preheader: "Témoignages d'auteurs, la méthode des 15 agents, et la garantie.",
    badge: "LA PREUVE",
    heading: "Des livres publiés, pas des promesses",
    paragraphs: [
      "Vous vous demandez si ça marche vraiment ? C'est légitime.",
      "J'ai réuni sur une page les témoignages d'auteurs qui ont publié avec l'atelier, la méthode exacte en 15 agents, et ce que vous repartez avoir entre les mains : manuscrit, couverture aux normes, fiche Amazon remplie.",
      "Regardez, lisez leurs mots. C'est la seule preuve qui compte.",
    ],
    cta: "Voir ce qu'ils ont publié",
    fiche: "/fiche/preuve",
    ps: "Une question précise sur votre projet ? Répondez à cet email, je réponds moi-même.",
  },
  {
    subject: "Ce soir à minuit, c'est terminé",
    preheader: "Après ce soir, plus de paiement unique à 47 €. Dernier message de la série.",
    badge: "DERNIER JOUR — 47 € CE SOIR",
    heading: "Ce soir, l'accès à 47 € disparaît",
    paragraphs: [
      "C'est le dernier message de cette série, alors je suis direct.",
      "Ce soir à minuit, le paiement unique à 47 € s'arrête. Demain, les inscriptions à la V3 ouvrent par abonnement mensuel — et l'accès à vie ne reviendra pas.",
      "Tout est récapitulé sur une page, avec le compte à rebours. La décision vous prend deux minutes.",
    ],
    cta: "Voir ce que je reçois pour 47 €",
    fiche: "/fiche/dernier-jour",
    ps: "Si vous préférez la V3 par abonnement, ne faites rien : je vous envoie le lien d'inscription demain.",
  },
];


const normalize = (value: string) => value.trim().toLowerCase();
const templateName = (step: number) => `rappel-47-${step}`;
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/** Site public : les liens visibles dans les emails ne doivent JAMAIS pointer
 *  vers l'URL technique du backend (elle répond « requested path is invalid »). */
const SITE = "https://ebookstudio.fr";

/** Relais de clic sur notre domaine (/r) : chaque lien de l'email est mesuré,
 *  y compris l'audio et le MP3 — sinon on pilote à l'aveugle. `lk` identifie le lien. */
function trackedUrl(email: string, step: number, destination: string, tag: string, template?: string) {
  const sep = destination.includes("?") ? "&" : "?";
  const dest = `${destination}${sep}lk=${tag}`;
  const t = template || templateName(step);
  return `${SITE}/r?e=${encodeURIComponent(email)}&s=${step}&t=${t}&u=${encodeURIComponent(dest)}`;
}

/** Lien unique de l'email : vers la fiche de l'étape, avec le suivi src/email
 *  que la fiche transmet à /commander. */
function ficheLink(email: string, step: number) {
  return trackedUrl(email, step, `${SITE}${STEPS[step - 1].fiche}?src=${CAMPAIGN}-${step}&email=${encodeURIComponent(email)}`, "fiche");
}

function ctaButton(link: string, label: string) {
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse;margin:26px 0"><tr><td align="center" bgcolor="#FF9E2D" style="border-radius:6px"><a href="${link}" style="display:block;padding:17px 24px;color:#232F3E;text-decoration:none;font:700 17px/1.3 Arial,Helvetica,sans-serif;text-align:center">${label}</a></td></tr></table>`;
}


function render(baseUrl: string, email: string, firstName: string, step: number) {
  const c = STEPS[step - 1];
  const link = ficheLink(email, step);
  const unsubscribe = `${baseUrl}/functions/v1/unsubscribe?email=${encodeURIComponent(email)}&seq=all`;
  const pixel = `${baseUrl}/functions/v1/track-email-open?e=${encodeURIComponent(email)}&s=${step}&t=${templateName(step)}`;
  const paragraphs = c.paragraphs
    .map((p) => `<p style="margin:0 0 18px">${p}</p>`)
    .join("\n");
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#f6f7f8;padding:24px 10px">
<div style="display:none;font-size:1px;color:#f6f7f8;max-height:0;overflow:hidden">${c.preheader}</div>
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse"><tr><td align="center">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e5e7eb;border-collapse:collapse">
<tr><td style="background:#008296;padding:18px 28px;color:#ffffff;font:700 22px Arial,Helvetica,sans-serif">EbookStudio</td></tr>
<tr><td style="padding:26px 28px 0"><span style="display:inline-block;background:#FFF4E5;color:#8a4b00;border:1px solid #FF9E2D;border-radius:4px;padding:7px 12px;font:700 12px Arial,Helvetica,sans-serif;letter-spacing:.4px">${c.badge}</span></td></tr>
<tr><td style="padding:20px 28px 0;color:#232F3E;font:16px/1.65 Arial,Helvetica,sans-serif">
<p style="margin:0 0 18px">Bonjour${firstName ? ` ${firstName}` : ""},</p>
<h1 style="margin:0 0 16px;font:700 25px/1.3 Arial,Helvetica,sans-serif;color:#232F3E">${c.heading}</h1>
${paragraphs}
${ctaButton(link, c.cta)}
<p style="margin:0 0 6px">Bien à vous,<br><strong>Georges Boubet</strong><br>EbookStudio</p>
<p style="margin:18px 0 0;padding:14px 0 0;border-top:1px solid #e5e7eb;font:15px/1.6 Arial,Helvetica,sans-serif;color:#4b5563">P.-S. — ${c.ps}</p>
</td></tr>
<tr><td style="padding:18px 24px;background:#f6f7f8;text-align:center;color:#68737d;font:12px/1.6 Arial,Helvetica,sans-serif">Offre valable jusqu'au 31 août 2026 (23h59, Paris), sous réserve des conditions indiquées sur le site.<br>Vous recevez cet email car vous avez manifesté un intérêt pour EbookStudio.<br><a href="${unsubscribe}" style="color:#008296">Se désinscrire de tous les emails marketing</a></td></tr>
</table></td></tr></table><img src="${pixel}" width="1" height="1" alt="" style="display:none"></body></html>`;
}

/** Gabarit de relance des non-ouvreurs (envoyé 48 h après l'email d'origine).
 *  Message entièrement différent : pas de prix, pas de vente — un seul geste,
 *  récupérer les deux cadeaux. Suivi propre au segment (`-non-ouvreurs`). */
export const NON_OPENER_SUBJECTS = [
  "Vos 2 cadeaux vous attendent (10 niches + le kit)",
  "Je vous ai mis 10 niches de côté",
];

function renderNonOpener(baseUrl: string, email: string, firstName: string, step: number) {
  const tpl = `${templateName(step)}-non-ouvreurs`;
  const gift = trackedUrl(email, step, `${SITE}/cadeau?src=${CAMPAIGN}-non-ouvreurs&email=${encodeURIComponent(email)}`, "cadeau2", tpl);
  const trial = trackedUrl(email, step, `${SITE}/essai?src=${CAMPAIGN}-non-ouvreurs&email=${encodeURIComponent(email)}`, "essai", tpl);
  const unsubscribe = `${baseUrl}/functions/v1/unsubscribe?email=${encodeURIComponent(email)}&seq=all`;
  const pixel = `${baseUrl}/functions/v1/track-email-open?e=${encodeURIComponent(email)}&s=${step}&t=${tpl}`;
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#f6f7f8;padding:24px 10px">
<div style="display:none;font-size:1px;color:#f6f7f8;max-height:0;overflow:hidden">Deux cadeaux, rien à payer : 10 niches Amazon analysées et le kit de démarrage.</div>
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse"><tr><td align="center">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e5e7eb;border-collapse:collapse">
<tr><td style="background:#064e3b;padding:18px 28px;color:#ffffff;font:700 22px Arial,Helvetica,sans-serif">EbookStudio</td></tr>
<tr><td style="padding:26px 28px 0;color:#232F3E;font:16px/1.65 Arial,Helvetica,sans-serif">
<p style="margin:0 0 18px">Bonjour${firstName ? ` ${firstName}` : ""},</p>
<h1 style="margin:0 0 16px;font:700 25px/1.3 Arial,Helvetica,sans-serif;color:#232F3E">Mon message précédent est passé inaperçu — ce n'est pas grave.</h1>
<p style="margin:0 0 18px">Je ne vais donc rien vous vendre aujourd'hui. Je vous laisse simplement deux documents que j'ai préparés pour les auteurs qui débutent sur Amazon KDP :</p>
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse;margin:0 0 20px">
<tr><td valign="top" style="padding:0 10px 12px 0;font:700 16px/1.5 Arial,Helvetica,sans-serif;color:#008296;width:18px">1.</td><td style="padding:0 0 12px 0"><strong>10 niches Amazon à fort potentiel</strong> — analysées, avec le type de livre qui fonctionne dans chacune.</td></tr>
<tr><td valign="top" style="padding:0 10px 12px 0;font:700 16px/1.5 Arial,Helvetica,sans-serif;color:#008296;width:18px">2.</td><td style="padding:0 0 12px 0"><strong>Le kit de démarrage V3</strong> — 16 pages illustrées, de la première connexion jusqu'à la mise en vente.</td></tr>
</table>
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse;margin:24px 0"><tr><td align="center" bgcolor="#064e3b" style="border-radius:6px"><a href="${gift}" style="display:block;padding:17px 24px;color:#ffffff;text-decoration:none;font:700 17px/1.3 Arial,Helvetica,sans-serif;text-align:center">Récupérer mes 2 cadeaux (gratuit)</a></td></tr></table>
<p style="margin:0 0 18px;font:15px/1.6 Arial,Helvetica,sans-serif;color:#4b5563">Pas de carte bancaire, pas d'engagement. Lisez-les, et si vous vous dites « je pourrais écrire ce livre-là », vous saurez quoi faire ensuite.</p>
<p style="margin:0 0 18px">Si vous préférez essayer directement : <a href="${trial}" style="color:#008296">écrivez le premier chapitre de votre livre gratuitement</a>.</p>
<p style="margin:0 0 6px">Bien à vous,<br><strong>Georges Boubet</strong><br>EbookStudio</p>
<p style="margin:18px 0 0;padding:14px 0 0;border-top:1px solid #e5e7eb;font:15px/1.6 Arial,Helvetica,sans-serif;color:#4b5563">P.-S. — Répondez-moi en une ligne si quelque chose vous a fait hésiter : je lis tous les messages.</p>
</td></tr>
<tr><td style="padding:18px 24px;background:#f6f7f8;text-align:center;color:#68737d;font:12px/1.6 Arial,Helvetica,sans-serif">Vous recevez cet email car vous avez manifesté un intérêt pour EbookStudio.<br><a href="${unsubscribe}" style="color:#008296">Se désinscrire de tous les emails marketing</a></td></tr>
</table></td></tr></table><img src="${pixel}" width="1" height="1" alt="" style="display:none"></body></html>`;
}

async function isAdmin(req: Request, baseUrl: string) {
  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return false;
  const client = createClient(baseUrl, Deno.env.get("SUPABASE_ANON_KEY") ?? "", { global: { headers: { Authorization: authorization } } });
  const { data } = await client.auth.getUser();
  if (!data.user) return false;
  const { data: allowed } = await client.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
  return allowed === true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const respond = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  try {
    const baseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const db = createClient(baseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    const body = await req.json().catch(() => ({}));
    const mode = String(body.mode || "status");
    await loadVideoUrl(db);
    const { data: cronSecret } = await db.from("app_secrets").select("value").eq("key", "cron_secret").maybeSingle();
    const hasCronSecret = !!cronSecret?.value && req.headers.get("x-cron-secret") === cronSecret.value;
    const isAuto = mode === "auto" || mode === "auto_non_openers" || mode === "auto_clickers" || mode === "auto_pending";
    if (isAuto) {
      if (!hasCronSecret) return respond({ error: "Non autorisé" }, 401);
      const { data: paused } = await db.from("app_secrets").select("value").eq("key", "email_automation_paused").maybeSingle();
      if (paused?.value === "true") {
        return respond({ success: true, paused: true, sent: 0, message: "Automation paused by admin" });
      }
    } else if (!hasCronSecret && !(await isAdmin(req, baseUrl))) return respond({ error: "Accès administrateur requis" }, 403);


    if (mode === "status") return respond({ campaign: CAMPAIGN, active: true, blocked: !EMAIL_SENDING_ENABLED, steps: STEPS.map((s, i) => ({ step: i + 1, subject: s.subject, template: templateName(i + 1) })) });

    // Lecture / écriture de l'état de pause de l'automation (front-end ne peut pas toucher app_secrets directement).
    if (mode === "automation_status") {
      const { data: paused } = await db.from("app_secrets").select("value").eq("key", "email_automation_paused").maybeSingle();
      const jobs = [
        { jobid: 1, jobname: "sequence-daily", schedule: "0 10 * * *", active: true },
        { jobid: 2, jobname: "relance-non-ouvreurs-48h", schedule: "15 9 * * *", active: true },
        { jobid: 3, jobname: "clickers-followup-24h", schedule: "0 11 * * *", active: true },
        { jobid: 4, jobname: "pending-orders-recovery", schedule: "0 */6 * * *", active: true },
      ];
      return respond({ success: true, paused: paused?.value === "true", jobs });
    }
    if (mode === "set_automation_pause") {
      const paused = body.paused === true || body.paused === "true";
      await db.from("app_secrets").upsert({ key: "email_automation_paused", value: String(paused) }, { onConflict: "key" });
      return respond({ success: true, paused });
    }

    if (mode === "preview") {
      const step = Math.min(Math.max(Number(body.step || 1), 1), 5);
      const html = body.segment === "non_openers"
        ? renderNonOpener(baseUrl, "apercu@ebookstudio.fr", "Georges", step)
        : render(baseUrl, "apercu@ebookstudio.fr", "Georges", step);
      return new Response(html, { headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" } });
    }

    // Métriques par segment : original vs relance non-ouvreurs vs relance cliqueurs.
    if (mode === "segment_stats") {
      const step = Math.min(Math.max(Number(body.step || 1), 1), 5);
      const base = templateName(step);
      const templates = [base, `${base}-non-ouvreurs`, `${base}-cliqueurs`, `${base}-relance`];
      const segments = [];
      for (const tpl of templates) {
        const [{ count: sent }, { count: failed }, opensRes, clicksRes] = await Promise.all([
          db.from("email_send_log").select("id", { count: "exact", head: true }).eq("template_name", tpl).in("status", ["sent", "delivered"]),
          db.from("email_send_log").select("id", { count: "exact", head: true }).eq("template_name", tpl).eq("status", "failed"),
          db.from("email_opens").select("prospect_email").eq("template_name", tpl).limit(5000),
          db.from("email_clicks").select("prospect_email").eq("template_name", tpl).limit(5000),
        ]);
        const opens = new Set((opensRes.data || []).map((r) => normalize(r.prospect_email || "")));
        const clicks = new Set((clicksRes.data || []).map((r) => normalize(r.prospect_email || "")));
        segments.push({
          template: tpl,
          label: tpl === base ? `Étape ${step} (original)` : tpl.endsWith("non-ouvreurs") ? "Relance non-ouvreurs (48 h)" : tpl.endsWith("cliqueurs") ? "Relance cliqueurs" : "Relance ouvreurs",
          sent: sent || 0,
          failed: failed || 0,
          unique_opens: opens.size,
          unique_clicks: clicks.size,
          open_rate: sent ? Math.round((opens.size / sent) * 1000) / 10 : 0,
          click_rate: sent ? Math.round((clicks.size / sent) * 1000) / 10 : 0,
        });
      }
      return respond({ success: true, step, segments });
    }
    if (!EMAIL_SENDING_ENABLED) return respond(emailSendingBlockedResult(), 423);

    // Relance ciblée : ouvreurs non-cliqueurs de l'étape demandée (relance propre à chaque étape)
    if (mode === "resend_openers") {
      const step = Math.min(Math.max(Number(body.step || 1), 1), 5);
      // Par défaut on relance les ouvreurs de l'étape choisie (pas systématiquement ceux de l'étape 1).
      const sourceTemplate = String(body.source_template || templateName(step));
      // Le journal de relance est propre à l'étape, sinon une seule relance bloque toutes les suivantes.
      const resendTemplate = `${sourceTemplate}-relance`;
      const limit = Math.min(Number(body.batch_size || 250), 300);


      const { data: opens } = await db.from("email_opens").select("prospect_email").eq("template_name", sourceTemplate);
      const { data: clicks } = await db.from("email_clicks").select("prospect_email");
      // On exclut aussi l'ancien nom de relance (`-v2`) pour ne pas réécrire deux fois aux mêmes contacts.
      const { data: alreadySent } = await db.from("email_send_log").select("recipient_email").in("template_name", [resendTemplate, `${sourceTemplate}-v2`]).in("status", ["sent", "delivered"]);
      const { data: paidOrders } = await db.from("funnel_orders").select("email").eq("status", "paid");
      const { data: unsub } = await db.from("sales_prospects").select("email,first_name,unsubscribed,status").limit(5000);

      const clickers = new Set((clicks || []).map((r) => normalize(r.prospect_email || "")));
      const done = new Set((alreadySent || []).map((r) => normalize(r.recipient_email || "")));
      const paid = new Set((paidOrders || []).map((r) => normalize(r.email || "")));
      const profiles = new Map((unsub || []).map((r) => [normalize(r.email || ""), r]));

      const targets: string[] = [];
      for (const row of opens || []) {
        const email = normalize(row.prospect_email || "");
        if (!isEmail(email) || targets.includes(email)) continue;
        if (clickers.has(email) || done.has(email) || paid.has(email)) continue;
        const profile = profiles.get(email);
        if (profile && (profile.unsubscribed === true || profile.status !== "active")) continue;
        targets.push(email);
        if (targets.length >= limit) break;
      }

      if (body.dry_run) return respond({ success: true, mode, template: resendTemplate, would_send: targets.length });

      let sentCount = 0;
      for (const email of targets) {
        const profile = profiles.get(email);
        const result = await sendResendEmailThrottled({
          from: FROM_CAMPAIGN,
          to: [email],
          subject: STEPS[step - 1].subject,
          html: render(baseUrl, email, (profile?.first_name as string) || "", step),
          reply_to: REPLY_TO,
        });
        await db.from("email_send_log").insert({ recipient_email: email, template_name: resendTemplate, message_id: result.id || `${CAMPAIGN}-${resendTemplate}-${email}`, provider_message_id: result.id || null, status: result.ok ? "sent" : "failed", error_message: result.ok ? null : `HTTP ${result.status || ""}: ${result.detail || ""}` });
        if (!result.ok) { if (isQuotaExhausted()) break; continue; }
        sentCount++;
      }
      return respond({ success: true, mode, template: resendTemplate, sent: sentCount, targets: targets.length });
    }

    // Segments type GetResponse : non-ouvreurs et cliqueurs d'un gabarit donné.
    // `auto_non_openers` / `auto_clickers` = même logique, déclenchée par le cron.
    if (mode === "resend_non_openers" || mode === "resend_clickers" || mode === "auto_non_openers" || mode === "auto_clickers") {
      const isNonOpeners = mode === "resend_non_openers" || mode === "auto_non_openers";
      const step = Math.min(Math.max(Number(body.step || 1), 1), 5);
      const sourceTemplate = String(body.source_template || templateName(step));
      const suffix = isNonOpeners ? "non-ouvreurs" : "cliqueurs";
      const resendTemplate = `${sourceTemplate}-${suffix}`;
      const limit = Math.min(Number(body.batch_size || 250), 300);
      // Délai minimum avant relance : 48 h par défaut (0 pour forcer manuellement).
      const delayHours = body.delay_hours === undefined ? 48 : Math.max(0, Number(body.delay_hours));
      const cutoff = new Date(Date.now() - delayHours * 3600000).toISOString();

      // === MODE TEST ===
      // `test_mode: true` + `test_emails: ["moi@exemple.fr", ...]` envoie l'email de relance
      // uniquement à cette liste restreinte, avec le préfixe [TEST], sans journaliser le
      // gabarit de relance (donc l'envoi réel reste possible ensuite).
      if (body.test_mode) {
        const rawList: string[] = Array.isArray(body.test_emails)
          ? body.test_emails
          : String(body.test_emails || "").split(/[,;\s]+/);
        const testTargets = Array.from(new Set(rawList.map((e) => normalize(String(e || ""))).filter(isEmail))).slice(0, 20);
        if (!testTargets.length) return respond({ success: false, mode, error: "Aucune adresse de test valide fournie (test_emails)." }, 400);

        const { data: testProfiles } = await db.from("sales_prospects").select("email,first_name").in("email", testTargets);
        const testNames = new Map((testProfiles || []).map((r) => [normalize(r.email || ""), (r.first_name as string) || ""]));

        let testSent = 0;
        const results: Array<{ email: string; ok: boolean; error?: string }> = [];
        for (let i = 0; i < testTargets.length; i++) {
          const email = testTargets[i];
          const subject = `[TEST] ${isNonOpeners ? NON_OPENER_SUBJECTS[i % NON_OPENER_SUBJECTS.length] : "Vous avez regardé — je vous écris le premier chapitre"}`;
          const html = isNonOpeners
            ? renderNonOpener(baseUrl, email, testNames.get(email) || "", step)
            : render(baseUrl, email, testNames.get(email) || "", step);
          const result = await sendResendEmailThrottled({ from: FROM_CAMPAIGN, to: [email], subject, html, reply_to: REPLY_TO });
          await db.from("email_send_log").insert({ recipient_email: email, template_name: `${resendTemplate}-test`, message_id: result.id || `${CAMPAIGN}-${resendTemplate}-test-${email}`, provider_message_id: result.id || null, status: result.ok ? "sent" : "failed", error_message: result.ok ? null : `HTTP ${result.status || ""}: ${result.detail || ""}` });
          results.push({ email, ok: result.ok, error: result.ok ? undefined : `HTTP ${result.status || ""}: ${result.detail || ""}` });
          if (result.ok) testSent++;
        }
        return respond({ success: true, mode, test_mode: true, template: `${resendTemplate}-test`, sent: testSent, targets: testTargets.length, results });
      }


      const { data: received } = await db.from("email_send_log").select("recipient_email,created_at").eq("template_name", sourceTemplate).in("status", ["sent", "delivered"]).lte("created_at", cutoff).limit(5000);
      const { data: opens } = await db.from("email_opens").select("prospect_email").eq("template_name", sourceTemplate);
      const { data: clicks } = await db.from("email_clicks").select("prospect_email").eq("template_name", sourceTemplate);
      const { data: alreadySent } = await db.from("email_send_log").select("recipient_email").eq("template_name", resendTemplate).in("status", ["sent", "delivered"]);
      const { data: paidOrders } = await db.from("funnel_orders").select("email").eq("status", "paid");
      const { data: profilesRows } = await db.from("sales_prospects").select("email,first_name,unsubscribed,status").limit(5000);

      const openers = new Set((opens || []).map((r) => normalize(r.prospect_email || "")));
      const clickers = new Set((clicks || []).map((r) => normalize(r.prospect_email || "")));
      const done = new Set((alreadySent || []).map((r) => normalize(r.recipient_email || "")));
      const paid = new Set((paidOrders || []).map((r) => normalize(r.email || "")));
      const profiles = new Map((profilesRows || []).map((r) => [normalize(r.email || ""), r]));
      const eligible = new Set((received || []).map((r) => normalize(r.recipient_email || "")));

      const pool = isNonOpeners
        ? Array.from(eligible).filter((e) => !openers.has(e) && !clickers.has(e))
        : Array.from(clickers).filter((e) => eligible.has(e));

      const targets: string[] = [];
      for (const email of pool) {
        if (!isEmail(email) || targets.includes(email)) continue;
        if (done.has(email) || paid.has(email)) continue;
        const profile = profiles.get(email);
        if (profile && (profile.unsubscribed === true || profile.status !== "active")) continue;
        targets.push(email);
        if (targets.length >= limit) break;
      }

      if (body.dry_run) return respond({ success: true, mode, template: resendTemplate, delay_hours: delayHours, would_send: targets.length });

      let sentCount = 0;
      for (let i = 0; i < targets.length; i++) {
        const email = targets[i];
        const profile = profiles.get(email);
        // Non-ouvreurs : sujet alterné (A/B) + message dédié « 2 cadeaux », sans prix.
        const subject = isNonOpeners
          ? NON_OPENER_SUBJECTS[i % NON_OPENER_SUBJECTS.length]
          : "Vous avez regardé — je vous écris le premier chapitre";
        const html = isNonOpeners
          ? renderNonOpener(baseUrl, email, (profile?.first_name as string) || "", step)
          : render(baseUrl, email, (profile?.first_name as string) || "", step);
        const result = await sendResendEmailThrottled({ from: FROM_CAMPAIGN, to: [email], subject, html, reply_to: REPLY_TO });
        await db.from("email_send_log").insert({ recipient_email: email, template_name: resendTemplate, message_id: result.id || `${CAMPAIGN}-${resendTemplate}-${email}`, provider_message_id: result.id || null, status: result.ok ? "sent" : "failed", error_message: result.ok ? null : `HTTP ${result.status || ""}: ${result.detail || ""}` });
        if (!result.ok) { if (isQuotaExhausted()) break; continue; }
        sentCount++;
      }
      return respond({ success: true, mode, template: resendTemplate, delay_hours: delayHours, sent: sentCount, targets: targets.length });
    }

    // Relance des commandes restées en attente depuis plus de 2 heures.
    if (mode === "recover_pending" || mode === "auto_pending") {
      const cutoff = new Date(Date.now() - 2 * 3600000).toISOString();
      const { data: pending } = await db
        .from("funnel_orders")
        .select("id,email,first_name,amount,metadata,created_at")
        .eq("status", "pending")
        .lt("created_at", cutoff)
        .limit(200);

      const targets = (pending || []).filter((o) => {
        const meta = (o.metadata ?? {}) as Record<string, unknown>;
        return !meta.recovery_email_sent_at && isEmail(normalize(o.email || ""));
      });

      if (body.dry_run) return respond({ success: true, mode, would_send: targets.length });

      let sentCount = 0;
      for (const order of targets) {
        const email = normalize(order.email || "");
        const link = trackedLink(baseUrl, email, 1);
        const html = `<!doctype html><html lang="fr"><body style="margin:0;background:#f6f7f8;padding:24px 10px"><table role="presentation" width="600" align="center" style="max-width:600px;background:#ffffff;border:1px solid #e5e7eb;border-collapse:collapse"><tr><td style="background:#008296;padding:18px 28px;color:#ffffff;font:700 22px Arial,Helvetica,sans-serif">EbookStudio</td></tr><tr><td style="padding:24px 28px;color:#232F3E;font:16px/1.65 Arial,Helvetica,sans-serif"><p style="margin:0 0 16px">Bonjour${order.first_name ? ` ${order.first_name}` : ""},</p><p style="margin:0 0 16px">Votre commande a été ouverte mais le paiement n’a pas abouti. Rien n’a été prélevé.</p><p style="margin:0 0 16px">Vous pouvez la reprendre là où vous vous étiez arrêté, par carte ou par PayPal, en une ou plusieurs échéances.</p>${ctaButton(link, "Reprendre ma commande")}<p style="margin:0 0 8px">Si quelque chose vous a bloqué, répondez simplement à cet email : je vous réponds personnellement.</p><p style="margin:16px 0 0">Georges Boubet<br>EbookStudio</p></td></tr></table></body></html>`;
        const result = await sendResendEmailThrottled({ from: FROM_CAMPAIGN, to: [email], subject: "Votre commande EbookStudio est restée en attente", html, reply_to: REPLY_TO });
        await db.from("email_send_log").insert({ recipient_email: email, template_name: "panier-en-attente", message_id: result.id || `${CAMPAIGN}-panier-${order.id}`, provider_message_id: result.id || null, status: result.ok ? "sent" : "failed", error_message: result.ok ? null : `HTTP ${result.status || ""}: ${result.detail || ""}` });
        if (!result.ok) { if (isQuotaExhausted()) break; continue; }
        const meta = { ...((order.metadata ?? {}) as Record<string, unknown>), recovery_email_sent_at: new Date().toISOString() };
        await db.from("funnel_orders").update({ metadata: meta }).eq("id", order.id);
        sentCount++;
      }
      return respond({ success: true, mode, sent: sentCount, targets: targets.length });
    }

    // Mode automatique déclenché par le cron quotidien.
    // Envoie l'étape suivante à chaque prospect dont next_email_at est atteint.
    if (mode === "auto") {
      const limit = Math.min(Number(body.batch_size || 300), 400);
      const now = new Date().toISOString();
      const { data: readyProspects } = await db
        .from("sales_prospects")
        .select("email,first_name,current_step")
        .eq("status", "active")
        .lte("next_email_at", now)
        .lt("current_step", 5)
        .order("next_email_at", { ascending: true })
        .limit(limit);

      if (body.dry_run) return respond({ success: true, mode, would_send: (readyProspects || []).length });

      const profiles = (readyProspects || []).filter((p) => isEmail(normalize(p.email || "")));
      let sentCount = 0;
      for (const profile of profiles) {
        const step = Math.min(Math.max((profile.current_step || 0) + 1, 1), 5);
        const template = templateName(step);
        const email = normalize(profile.email || "");
        const result = await sendResendEmailThrottled({
          from: FROM_CAMPAIGN,
          to: [email],
          subject: STEPS[step - 1].subject,
          html: render(baseUrl, email, (profile.first_name as string) || "", step),
          reply_to: REPLY_TO,
        });
        await db.from("email_send_log").insert({ recipient_email: email, template_name: template, message_id: result.id || `${CAMPAIGN}-${step}-${email}`, provider_message_id: result.id || null, status: result.ok ? "sent" : "failed", error_message: result.ok ? null : `HTTP ${result.status || ""}: ${result.detail || ""}` });
        if (!result.ok) { if (isQuotaExhausted()) break; continue; }
        sentCount++;
        const completed = step >= 5;
        await db.from("sales_prospects").update({
          current_step: step,
          last_email_sent_at: new Date().toISOString(),
          next_email_at: completed ? null : new Date(Date.now() + (DELAYS[step] || 3) * 86400000).toISOString(),
          completed,
        }).eq("email", email);
      }
      return respond({ success: true, mode, sent: sentCount, targets: profiles.length });
    }

    // Relance de la séquence : envoie l'étape N aux contacts qui ont reçu l'étape N-1
    if (mode === "send_step") {
      const step = Math.min(Math.max(Number(body.step || 3), 2), 5);
      const limit = Math.min(Number(body.batch_size || 300), 400);
      const template = templateName(step);
      const previous = templateName(step - 1);

      const { data: gotPrevious } = await db.from("email_send_log").select("recipient_email").eq("template_name", previous).in("status", ["sent", "delivered"]).limit(5000);
      const { data: gotCurrent } = await db.from("email_send_log").select("recipient_email").eq("template_name", template).in("status", ["sent", "delivered"]).limit(5000);
      const { data: paidOrders } = await db.from("funnel_orders").select("email").eq("status", "paid");
      const { data: profilesRows } = await db.from("sales_prospects").select("email,first_name,unsubscribed,status").limit(5000);

      const done = new Set((gotCurrent || []).map((r) => normalize(r.recipient_email || "")));
      const paid = new Set((paidOrders || []).map((r) => normalize(r.email || "")));
      const profiles = new Map((profilesRows || []).map((r) => [normalize(r.email || ""), r]));

      const targets: string[] = [];
      for (const row of gotPrevious || []) {
        const email = normalize(row.recipient_email || "");
        if (!isEmail(email) || targets.includes(email)) continue;
        if (done.has(email) || paid.has(email)) continue;
        const profile = profiles.get(email);
        if (profile && (profile.unsubscribed === true || profile.status !== "active")) continue;
        targets.push(email);
        if (targets.length >= limit) break;
      }

      if (body.dry_run) return respond({ success: true, mode, step, template, would_send: targets.length });

      let sentCount = 0;
      for (const email of targets) {
        const profile = profiles.get(email);
        const result = await sendResendEmailThrottled({
          from: FROM_CAMPAIGN,
          to: [email],
          subject: STEPS[step - 1].subject,
          html: render(baseUrl, email, (profile?.first_name as string) || "", step),
          reply_to: REPLY_TO,
        });
        await db.from("email_send_log").insert({ recipient_email: email, template_name: template, message_id: result.id || `${CAMPAIGN}-${step}-${email}`, provider_message_id: result.id || null, status: result.ok ? "sent" : "failed", error_message: result.ok ? null : `HTTP ${result.status || ""}: ${result.detail || ""}` });
        if (!result.ok) { if (isQuotaExhausted()) break; continue; }
        sentCount++;
        // Synchronise l'étape du prospect : sans cela la séquence reste bloquée
        // sur l'étape précédente et l'envoi automatique la renvoie en boucle.
        const completed = step >= 5;
        await db.from("sales_prospects").update({
          current_step: step,
          last_email_sent_at: new Date().toISOString(),
          next_email_at: completed ? null : new Date(Date.now() + (DELAYS[step] || 3) * 86400000).toISOString(),
          completed,
        }).eq("email", email);
      }


      return respond({ success: true, mode, step, template, sent: sentCount, targets: targets.length });
    }

    let recipients: Array<{ id?: string; email: string; first_name: string; current_step: number }> = [];
    if (mode === "test") {
      const requested = Number(body.step || 0);
      const testEmail = normalize(String(body.test_email || ""));
      if (!isEmail(testEmail)) return respond({ error: "Adresse de test invalide" }, 400);
      recipients = (requested >= 1 && requested <= 5 ? [requested] : [1, 2, 3, 4, 5]).map((step) => ({ email: testEmail, first_name: "Georges", current_step: step - 1 }));
    } else if (mode === "manual" && Array.isArray(body.prospect_ids) && body.prospect_ids.length) {
      // Découpage en lots : une URL avec des centaines d'IDs fait échouer la requête PostgREST.
      const ids = (body.prospect_ids as string[]).filter((v) => typeof v === "string" && v.length > 0).slice(0, 500);
      const collected: any[] = [];
      for (let i = 0; i < ids.length && collected.length < 100; i += 40) {
        const chunk = ids.slice(i, i + 40);
        const { data, error } = await db
          .from("sales_prospects")
          .select("id,email,first_name,current_step")
          .in("id", chunk)
          .eq("status", "active")
          .eq("unsubscribed", false);
        if (error) throw error;
        collected.push(...(data || []));
      }
      recipients = collected.slice(0, 100);
    } else {
      const query = db.from("sales_prospects").select("id,email,first_name,current_step").eq("status", "active").eq("unsubscribed", false).eq("auto_send", true).eq("completed", false).lte("next_email_at", new Date().toISOString()).order("next_email_at").limit(Math.min(Number(body.batch_size || 50), 100));
      const { data, error } = await query;
      if (error) throw error;
      recipients = data || [];
    }



    const { data: orders } = await db.from("funnel_orders").select("email").eq("status", "paid");
    const buyers = new Set((orders || []).map((row) => normalize(row.email || "")));
    let sent = 0;
    let skipped = 0;
    for (const recipient of recipients) {
      const email = normalize(recipient.email || "");
      const step = mode === "test" ? recipient.current_step + 1 : Number(body.step || recipient.current_step + 1);
      // En test on n'exclut jamais l'adresse : sinon un test vers une adresse déjà acheteuse part « en silence ».
      if (!isEmail(email) || !STEPS[step - 1] || (mode !== "test" && buyers.has(email))) { skipped++; continue; }

      const template = templateName(step);
      if (mode !== "test") {
        const { count } = await db.from("email_send_log").select("id", { count: "exact", head: true }).eq("recipient_email", email).eq("template_name", template).in("status", ["sent", "delivered"]);
        if ((count || 0) > 0) { skipped++; continue; }
      }
      const result = await sendResendEmailThrottled({ from: FROM_CAMPAIGN, to: [email], subject: `${mode === "test" ? "[TEST] " : ""}${STEPS[step - 1].subject}`, html: render(baseUrl, email, recipient.first_name || "", step), reply_to: REPLY_TO });
      await db.from("email_send_log").insert({ recipient_email: email, template_name: template, message_id: result.id || `${CAMPAIGN}-${step}-${email}`, provider_message_id: result.id || null, status: result.ok ? "sent" : "failed", error_message: result.ok ? null : `HTTP ${result.status || ""}: ${result.detail || ""}` });
      if (!result.ok) { if (isQuotaExhausted()) break; continue; }
      sent++;
      if (mode !== "test" && recipient.id) {
        const completed = step >= 5;
        await db.from("sales_prospects").update({ current_step: step, last_email_sent_at: new Date().toISOString(), next_email_at: completed ? null : new Date(Date.now() + DELAYS[step] * 86400000).toISOString(), completed }).eq("id", recipient.id);
      }
    }
    return respond({ success: true, campaign: CAMPAIGN, sent, skipped });
  } catch (error) {
    console.error("send-sales-email", error);
    return respond({ error: error instanceof Error ? error.message : "Erreur serveur" }, 500);
  }
});
