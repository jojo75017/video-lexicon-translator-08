import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { isQuotaExhausted, sendResendEmailThrottled } from "../_shared/resendThrottle.ts";
import { EMAIL_SENDING_ENABLED, emailSendingBlockedResult } from "../_shared/emailSendingGuard.ts";
import { CHECKOUT_URL } from "../_shared/checkoutUrl.ts";

/**
 * Campagne de clôture de l'offre 47 € (fin le 30/09/2026).
 *
 * Deux usages :
 *  - `cliqueurs-personnel` : message personnel aux prospects qui ont déjà cliqué
 *    (les plus chauds). Ton au singulier, réponse aux objections, paiement en 2 fois.
 *  - `cloture-47-1..3` : séquence courte de clôture pour les ouvreurs sans clic.
 *
 * Sécurité : admin (has_role) ou secret cron. Les acheteurs, désinscrits et
 * contacts inactifs sont toujours exclus, et un même gabarit n'est jamais
 * envoyé deux fois à la même adresse.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

const CAMPAIGN = "cloture-47-2026";
const CHECKOUT = CHECKOUT_URL;
const DEMO_URL = "https://ebookstudio.fr/demo";

type TemplateKey = "cliqueurs-personnel" | "cloture-47-1" | "cloture-47-2" | "cloture-47-3";

interface Letter {
  key: TemplateKey;
  label: string;
  subject: string;
  preheader: string;
  /** Corps en HTML simple (paragraphes déjà balisés). */
  body: string;
  cta: string;
  ps: string;
  /** Cible par défaut : cliqueurs, ou ouvreurs qui n'ont jamais cliqué. */
  segment: "clickers" | "openers_no_click";
}

const PRICE_BLOCK = `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse;margin:24px 0"><tr><td align="center" style="background:#232F3E;padding:20px;color:#ffffff;font:16px/1.5 Arial,Helvetica,sans-serif">
<div style="font:700 38px/1.1 Arial,Helvetica,sans-serif;color:#FF9E2D">47 €</div>
<div style="margin-top:8px">paiement unique &nbsp;·&nbsp; accès à vie</div>
<div style="margin-top:6px;font-size:14px;opacity:.9">Possible en 2 fois (2 × 25 €) ou 3 fois (3 × 18 €). Carte bancaire ou PayPal.</div>
</td></tr></table>`;

const LETTERS: Letter[] = [
  {
    key: "cliqueurs-personnel",
    label: "Message personnel aux cliqueurs",
    subject: "Vous avez regardé EbookStudio — qu'est-ce qui vous retient ?",
    preheader: "Trois objections, trois réponses claires. Et une proposition concrète.",
    segment: "clickers",
    body: `<p style="margin:0 0 18px">Vous avez ouvert la page d'EbookStudio, puis vous n'êtes pas allé plus loin. C'est votre droit le plus strict — mais si quelque chose vous retient, je préfère y répondre directement.</p>
<p style="margin:0 0 14px;font:700 17px Arial,Helvetica,sans-serif">Les trois raisons qui reviennent le plus</p>
<p style="margin:0 0 12px"><strong>« 47 €, c'est un budget. »</strong> C'est un paiement unique, sans abonnement. Vous pouvez le régler en 2 fois (2 × 25 €) ou en 3 fois (3 × 18 €), et l'accès s'ouvre dès la première échéance. À partir du 1<sup>er</sup> octobre, l'accès à vie disparaît : il ne restera que l'abonnement à 17 €/mois, soit 204 € sur un an.</p>
<p style="margin:0 0 12px"><strong>« Je n'aurai pas le temps. »</strong> La première séance utile dure vingt minutes : vous décrivez votre sujet, vous obtenez le sommaire, vous le corrigez. Le reste se fait chapitre par chapitre, à votre rythme, et votre projet est sauvegardé entre deux sessions.</p>
<p style="margin:0 0 12px"><strong>« C'est trop technique pour moi. »</strong> Vous répondez à des questions, vous cliquez, vous téléchargez un fichier Word et un PDF déjà aux normes Amazon. Il n'y a aucun logiciel à installer.</p>
<p style="margin:0 0 18px">Et je vous propose autre chose : <strong>répondez à cet email avec le sujet de votre livre en une phrase</strong>, et je construis le premier sommaire avec vous. Vous verrez le résultat avant de décider quoi que ce soit.</p>`,
    cta: "Ouvrir mon accès à vie pour 47 €",
    ps: "Si ce n'est pas le bon moment, répondez-moi simplement « pas maintenant » : je vous retire de ces relances.",
  },
  {
    key: "cloture-47-1",
    label: "Clôture 1 — ce qui change le 1er octobre",
    subject: "Le 1er octobre, l'accès à vie disparaît (le calcul est simple)",
    preheader: "47 € une fois aujourd'hui, ou 204 € par an à partir d'octobre.",
    segment: "openers_no_click",
    body: `<p style="margin:0 0 18px">Je vais être direct, parce que la date approche.</p>
<p style="margin:0 0 18px">Jusqu'au <strong>30 septembre 2026</strong>, EbookStudio est accessible pour <strong>47 €, une seule fois, à vie</strong>. À partir du <strong>1<sup>er</sup> octobre</strong>, cette formule n'existe plus : il ne restera que des abonnements mensuels, à partir de 17 €/mois.</p>
<p style="margin:0 0 14px;font:700 17px Arial,Helvetica,sans-serif">Le calcul, fait pour vous</p>
<p style="margin:0 0 12px">47 € une seule fois aujourd'hui.<br>17 €/mois à partir d'octobre, soit <strong>204 € sur un an</strong>, et autant chaque année suivante.</p>
<p style="margin:0 0 18px">Ce n'est pas une urgence fabriquée : c'est le passage de la version à vie au modèle par abonnement, et il ne sera pas annulé.</p>
<p style="margin:0 0 18px">Avec l'accès à vie, vous gardez tout : la rédaction complète de vos livres, l'export Word et PDF aux normes Amazon KDP, les couvertures avec dos calculé, la fiche de vente, les livres illustrés pour enfants — et les nouveaux outils au fur et à mesure, sans repayer.</p>`,
    cta: "Prendre l'accès à vie avant le 30 septembre",
    ps: "Vous pouvez aussi tester gratuitement le sommaire de votre livre avant de décider.",
  },
  {
    key: "cloture-47-2",
    label: "Clôture 2 — la preuve en images",
    subject: "Un livre entier, du sommaire au fichier Amazon",
    preheader: "Ce que vous obtenez réellement à la fin, étape par étape.",
    segment: "openers_no_click",
    body: `<p style="margin:0 0 18px">Plutôt que de vous décrire l'outil, voici exactement ce qui sort d'un projet complet.</p>
<p style="margin:0 0 12px"><strong>1. Le sommaire.</strong> Vous décrivez votre sujet en une phrase. Vous recevez un sommaire chapitre par chapitre, que vous modifiez librement : vous ajoutez, supprimez, réorganisez.</p>
<p style="margin:0 0 12px"><strong>2. Les chapitres.</strong> Ils sont rédigés un par un, en français, avec une mémoire du livre : les personnages, les lieux et les faits déjà racontés restent cohérents jusqu'à la fin.</p>
<p style="margin:0 0 12px"><strong>3. La correction.</strong> Un module relit le manuscrit entier et vous propose les corrections une par une : vous acceptez ou vous gardez votre mot.</p>
<p style="margin:0 0 12px"><strong>4. La couverture.</strong> Face avant, dos calculé selon votre nombre de pages, 4<sup>e</sup> de couverture, aux dimensions exactes exigées par Amazon.</p>
<p style="margin:0 0 12px"><strong>5. Le dépôt.</strong> Fichier Word et PDF avec table des matières propre, plus la fiche Amazon : titre, description, mots-clés, catégories.</p>
<p style="margin:0 0 18px">Le plus simple reste de l'essayer sur votre propre idée : décrivez votre livre en une phrase et regardez le sommaire qui en sort. C'est gratuit et cela prend deux minutes.</p>`,
    cta: "Tester sur mon idée de livre, gratuitement",
    ps: "L'accès complet reste à 47 € à vie jusqu'au 30 septembre.",
  },
  {
    key: "cloture-47-3",
    label: "Clôture 3 — dernier jour utile",
    subject: "Dernier rappel : après le 30 septembre, ce tarif n'existe plus",
    preheader: "Garantie 30 jours, paiement en 2 fois, PayPal accepté.",
    segment: "openers_no_click",
    body: `<p style="margin:0 0 18px">C'est mon dernier message sur cette offre.</p>
<p style="margin:0 0 18px">Après le <strong>30 septembre 2026</strong>, l'accès à vie à 47 € disparaît définitivement, remplacé par des abonnements mensuels. Si votre projet de livre attend depuis des mois, c'est le moment de le sortir — ou de le laisser attendre une année de plus.</p>
<p style="margin:0 0 14px;font:700 17px Arial,Helvetica,sans-serif">Ce qui doit lever vos derniers doutes</p>
<p style="margin:0 0 12px"><strong>Garantie 30 jours.</strong> Si l'outil ne vous convient pas, vous demandez le remboursement et vous l'obtenez.</p>
<p style="margin:0 0 12px"><strong>Paiement fractionné.</strong> 2 × 25 € ou 3 × 18 €, accès ouvert dès la première échéance.</p>
<p style="margin:0 0 12px"><strong>PayPal accepté</strong> au même titre que la carte bancaire, sur la page de paiement.</p>
<p style="margin:0 0 12px"><strong>Aucun abonnement caché.</strong> Un paiement, un accès conservé, les nouveaux outils inclus.</p>
<p style="margin:0 0 18px">Si vous avez une seule question qui vous retient encore, répondez à cet email : je réponds moi-même, et vite.</p>`,
    cta: "Ouvrir mon accès à vie — 47 €",
    ps: "Après le 30 septembre, ce tarif ne reviendra pas.",
  },
];

const byKey = new Map(LETTERS.map((l) => [l.key, l]));

const normalize = (value: string) => value.trim().toLowerCase();
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/** Lien de clic hébergé sur notre domaine (/r) : plus de confiance, clic enregistré. */
function trackedLink(email: string, letter: Letter) {
  const destination = letter.key === "cloture-47-2"
    ? `${DEMO_URL}?utm_source=email&utm_medium=cloture&utm_campaign=${letter.key}`
    : `${CHECKOUT}?src=${CAMPAIGN}-${letter.key}&email=${encodeURIComponent(email)}`;
  return `https://ebookstudio.fr/r?e=${encodeURIComponent(email)}&s=1&t=${letter.key}&u=${encodeURIComponent(destination)}`;
}

function ctaButton(link: string, label: string) {
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse;margin:26px 0"><tr><td align="center" bgcolor="#FF9E2D" style="border-radius:6px"><a href="${link}" style="display:block;padding:17px 24px;color:#232F3E;text-decoration:none;font:700 17px/1.3 Arial,Helvetica,sans-serif;text-align:center">${label}</a></td></tr></table>`;
}

function render(baseUrl: string, email: string, firstName: string, letter: Letter) {
  const link = trackedLink(email, letter);
  const unsubscribe = `${baseUrl}/functions/v1/unsubscribe?email=${encodeURIComponent(email)}&seq=all`;
  const pixel = `${baseUrl}/functions/v1/track-email-open?e=${encodeURIComponent(email)}&s=1&t=${letter.key}`;
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#f6f7f8;padding:24px 10px">
<div style="display:none;font-size:1px;color:#f6f7f8;max-height:0;overflow:hidden">${letter.preheader}</div>
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse"><tr><td align="center">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e5e7eb;border-collapse:collapse">
<tr><td style="background:#008296;padding:18px 28px;color:#ffffff;font:700 22px Arial,Helvetica,sans-serif">EbookStudio</td></tr>
<tr><td style="padding:26px 28px 0;color:#232F3E;font:16px/1.65 Arial,Helvetica,sans-serif">
<p style="margin:0 0 18px">Bonjour${firstName ? ` ${firstName}` : ""},</p>
${letter.body}
${PRICE_BLOCK}
${ctaButton(link, letter.cta)}
<p style="margin:0 0 6px">Bien à vous,<br><strong>Georges Boubet</strong><br>EbookStudio</p>
<p style="margin:18px 0 0;padding:14px 0 0;border-top:1px solid #e5e7eb;font:15px/1.6 Arial,Helvetica,sans-serif;color:#4b5563">${letter.ps}</p>
</td></tr>
<tr><td style="padding:18px 24px;background:#f6f7f8;text-align:center;color:#68737d;font:12px/1.6 Arial,Helvetica,sans-serif">Offre à 47 € valable jusqu'au 30 septembre 2026.<br>Vous recevez cet email car vous avez manifesté un intérêt pour EbookStudio.<br><a href="${unsubscribe}" style="color:#008296">Se désinscrire de tous les emails marketing</a></td></tr>
</table></td></tr></table><img src="${pixel}" width="1" height="1" alt="" style="display:none"></body></html>`;
}

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

    const letterKey = String(body.template || "") as TemplateKey;
    const letter = byKey.get(letterKey);

    if (mode === "status") {
      const stats = await Promise.all(
        LETTERS.map(async (l) => {
          const { count } = await db
            .from("email_send_log")
            .select("id", { count: "exact", head: true })
            .eq("template_name", l.key)
            .in("status", ["sent", "delivered"]);
          const { data: opens } = await db.from("email_opens").select("prospect_email").eq("template_name", l.key).limit(5000);
          const { data: clicks } = await db.from("email_clicks").select("prospect_email").eq("template_name", l.key).limit(5000);
          return {
            template: l.key,
            label: l.label,
            subject: l.subject,
            segment: l.segment,
            sent: count || 0,
            opens: new Set((opens || []).map((r) => normalize(r.prospect_email || ""))).size,
            clicks: new Set((clicks || []).map((r) => normalize(r.prospect_email || ""))).size,
          };
        }),
      );
      return respond({ campaign: CAMPAIGN, blocked: !EMAIL_SENDING_ENABLED, letters: stats });
    }

    if (!letter) return respond({ error: "Gabarit inconnu" }, 400);

    if (mode === "preview") {
      return new Response(render(baseUrl, "apercu@ebookstudio.fr", "Georges", letter), {
        headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (!EMAIL_SENDING_ENABLED) return respond(emailSendingBlockedResult(), 423);

    if (mode === "test") {
      const testEmail = normalize(String(body.test_email || ""));
      if (!isEmail(testEmail)) return respond({ error: "Adresse de test invalide" }, 400);
      const result = await sendResendEmailThrottled({
        from: "Georges Boubet <noreply@ebookstudio.fr>",
        to: [testEmail],
        subject: `[TEST] ${letter.subject}`,
        html: render(baseUrl, testEmail, "Georges", letter),
        reply_to: "contact@ebookstudio.fr",
      });
      if (!result.ok) return respond({ error: `Envoi refusé (HTTP ${result.status || ""}) ${result.detail || ""}` }, 502);
      return respond({ success: true, mode, template: letter.key, sent: 1 });
    }

    if (mode !== "send") return respond({ error: "Mode inconnu" }, 400);

    const limit = Math.min(Number(body.batch_size || 250), 300);

    const [{ data: clicksRows }, { data: opensRows }, { data: alreadySent }, { data: paidOrders }, { data: profileRows }] =
      await Promise.all([
        db.from("email_clicks").select("prospect_email").limit(10000),
        db.from("email_opens").select("prospect_email").limit(10000),
        db.from("email_send_log").select("recipient_email").eq("template_name", letter.key).in("status", ["sent", "delivered"]).limit(10000),
        db.from("funnel_orders").select("email").eq("status", "paid").limit(5000),
        db.from("sales_prospects").select("email,first_name,unsubscribed,status").limit(5000),
      ]);

    const clickers = new Set((clicksRows || []).map((r) => normalize(r.prospect_email || "")));
    const openers = new Set((opensRows || []).map((r) => normalize(r.prospect_email || "")));
    const done = new Set((alreadySent || []).map((r) => normalize(r.recipient_email || "")));
    const paid = new Set((paidOrders || []).map((r) => normalize(r.email || "")));
    const profiles = new Map((profileRows || []).map((r) => [normalize(r.email || ""), r]));

    const pool = letter.segment === "clickers"
      ? [...clickers]
      : [...openers].filter((email) => !clickers.has(email));

    const targets: string[] = [];
    for (const email of pool) {
      if (!isEmail(email) || done.has(email) || paid.has(email)) continue;
      const profile = profiles.get(email);
      if (!profile) continue; // on n'écrit qu'aux contacts connus et actifs
      if (profile.unsubscribed === true || profile.status !== "active") continue;
      targets.push(email);
      if (targets.length >= limit) break;
    }

    if (body.dry_run) {
      return respond({ success: true, mode, template: letter.key, segment: letter.segment, would_send: targets.length });
    }

    let sent = 0;
    for (const email of targets) {
      const profile = profiles.get(email);
      const result = await sendResendEmailThrottled({
        from: "Georges Boubet <noreply@ebookstudio.fr>",
        to: [email],
        subject: letter.subject,
        html: render(baseUrl, email, (profile?.first_name as string) || "", letter),
        reply_to: "contact@ebookstudio.fr",
      });
      await db.from("email_send_log").insert({
        recipient_email: email,
        template_name: letter.key,
        message_id: result.id || `${CAMPAIGN}-${letter.key}-${email}`,
        status: result.ok ? "sent" : "failed",
        error_message: result.ok ? null : `HTTP ${result.status || ""}: ${result.detail || ""}`,
      });
      if (!result.ok) {
        if (isQuotaExhausted()) break;
        continue;
      }
      sent++;
    }

    return respond({ success: true, mode, template: letter.key, segment: letter.segment, sent, targets: targets.length });
  } catch (error) {
    console.error("send-closing-47", error);
    return respond({ error: error instanceof Error ? error.message : "Erreur serveur" }, 500);
  }
});
