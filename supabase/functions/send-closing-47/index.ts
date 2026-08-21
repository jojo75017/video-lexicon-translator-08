import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { isQuotaExhausted, sendResendEmailThrottled } from "../_shared/resendThrottle.ts";
import { EMAIL_SENDING_ENABLED, emailSendingBlockedResult } from "../_shared/emailSendingGuard.ts";
import { CHECKOUT_URL } from "../_shared/checkoutUrl.ts";
import { DIRECT_EMAIL, FROM_CAMPAIGN, REPLY_TO } from "../_shared/emailIdentity.ts";

/**
 * Campagne de conversion 2026 — trois séquences, un seul objectif par email.
 *
 *  A. `reactivation-a1..a3`  → 208 adresses qui n'ont jamais ouvert : obtenir une ouverture.
 *  B. `clic-b1..b4`          → 440 lecteurs qui n'ont jamais cliqué : obtenir un premier clic
 *                              gratuit vers le cadeau (10 niches), l'achat vient en second.
 *  C. `chaud-c1..c2`         → les cliqueurs : demander la vente.
 *
 * Règles appliquées à tous les envois :
 *  - un email = un objectif = un lien principal ;
 *  - les acheteurs, désinscrits et contacts inactifs sont exclus ;
 *  - un même gabarit n'est jamais envoyé deux fois à la même adresse ;
 *  - débit Resend respecté et reprise sans doublon ;
 *  - adresse directe boubetgeorges@gmail.com dans chaque signature.
 *
 * Sécurité : admin (has_role) ou secret cron.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

const CAMPAIGN = "conversion-2026";
const CHECKOUT = CHECKOUT_URL;
const DEMO_URL = "https://ebookstudio.fr/demo";
const GIFT_URL = "https://ebookstudio.fr/10-niches-offertes";
type Segment = "never_opened" | "openers_no_click" | "clickers" | "all";
/** Cible du bouton principal : le cadeau (sans risque) ou la page de paiement. */
type Primary = "gift" | "checkout" | "demo";

interface Letter {
  key: string;
  label: string;
  subject: string;
  /** Objet alternatif testé sur une partie de la vague. */
  subjectB?: string;
  preheader: string;
  body: string;
  cta: string;
  ps: string;
  segment: Segment;
  primary: Primary;
  /** Affiche le pavé prix 47 € (jamais dans les emails « clic gratuit »). */
  price?: boolean;
  /** Ajoute le pavé cadeau au-dessus du bouton. */
  gift?: boolean;
}

const PRICE_BLOCK = `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse;margin:24px 0"><tr><td align="center" style="background:#232F3E;padding:20px;color:#ffffff;font:16px/1.5 Arial,Helvetica,sans-serif">
<div style="font:700 38px/1.1 Arial,Helvetica,sans-serif;color:#FF9E2D">47 €</div>
<div style="margin-top:8px">paiement unique &nbsp;·&nbsp; accès à vie</div>
<div style="margin-top:6px;font-size:14px;opacity:.9">Possible en 2 fois (2 × 25 €) ou 3 fois (3 × 18 €). Carte bancaire ou PayPal.</div>
</td></tr></table>`;

const LETTERS: Letter[] = [
  // ------------------------------------------------------------ Séquence A
  {
    key: "reactivation-a1",
    label: "A1 — Réactivation : une question courte",
    subject: "Votre livre, il parle de quoi ?",
    subjectB: "Une question sur votre projet de livre",
    preheader: "Une phrase de votre part, un sommaire complet en retour.",
    segment: "never_opened",
    primary: "gift",
    body: `<p style="margin:0 0 18px">Je vous écris court, parce que je n'ai qu'une question : votre livre, il parle de quoi ?</p>
<p style="margin:0 0 18px">Si vous n'avez pas encore d'idée arrêtée, j'ai préparé pour vous <strong>10 niches Amazon rentables</strong> : le thème, le public visé et l'angle du livre. C'est offert, sans achat et sans carte bancaire.</p>`,
    cta: "Voir mes 10 niches offertes",
    ps: `Si vous préférez me répondre directement : ${DIRECT_EMAIL}. C'est moi qui lis.`,
  },
  {
    key: "reactivation-a2",
    label: "A2 — Réactivation : le sommaire en deux minutes",
    subject: "Le sommaire de votre livre en deux minutes",
    subjectB: "Deux minutes pour voir le plan de votre livre",
    preheader: "Vous décrivez votre sujet en une phrase, le plan sort tout seul.",
    segment: "never_opened",
    primary: "gift",
    body: `<p style="margin:0 0 18px">La partie qui bloque presque tout le monde, c'est le plan du livre. C'est justement celle qui prend deux minutes avec EbookStudio.</p>
<p style="margin:0 0 18px">Vous décrivez votre sujet en une phrase, vous obtenez un sommaire chapitre par chapitre, et vous le modifiez librement.</p>
<p style="margin:0 0 18px">Pour choisir un sujet qui se vend, commencez par mes 10 niches offertes.</p>`,
    cta: "Voir mes 10 niches offertes",
    ps: `Une question, un doute, un blocage : écrivez-moi à ${DIRECT_EMAIL}.`,
  },
  {
    key: "reactivation-a3",
    label: "A3 — Réactivation : dernier message",
    subject: "Je vous laisse tranquille",
    subjectB: "Dernier message de ma part",
    preheader: "Le cadeau reste à vous, ensuite je m'arrête.",
    segment: "never_opened",
    primary: "gift",
    body: `<p style="margin:0 0 18px">C'est mon dernier message : je ne veux pas encombrer votre boîte.</p>
<p style="margin:0 0 18px">Le cadeau reste à vous : <strong>10 niches Amazon rentables</strong>, avec le public visé et l'angle du livre. Rien à payer, rien à installer.</p>`,
    cta: "Récupérer mes 10 niches",
    ps: "Si ce n'est pas le bon moment, ignorez simplement ce message : vous ne recevrez plus cette relance.",
  },

  // ------------------------------------------------------------ Séquence B
  {
    key: "clic-b1",
    label: "B1 — Cadeau immédiat (10 niches)",
    subject: "Vos 10 niches Amazon, offertes",
    subjectB: "10 niches rentables, sans rien payer",
    preheader: "Thème, public visé, angle du livre. Offert, sans condition.",
    segment: "openers_no_click",
    primary: "gift",
    gift: true,
    body: `<p style="margin:0 0 18px">Je commence par le cadeau, parce qu'il ne vous coûte rien et qu'il sert tout de suite.</p>
<p style="margin:0 0 18px">Voici <strong>10 niches Amazon rentables</strong>, extraites de notre base de 600 niches analysées : pour chacune, le thème, le public visé et l'angle du livre à écrire.</p>
<p style="margin:0 0 18px">Vous les consultez immédiatement : aucun achat, aucune carte bancaire.</p>`,
    cta: "Voir mes 10 niches offertes",
    ps: `Choisissez-en une et répondez-moi : je vous dis franchement ce que j'en pense (${DIRECT_EMAIL}).`,
  },
  {
    key: "clic-b2",
    label: "B2 — Preuve : du sommaire au fichier Amazon",
    subject: "Du sommaire au fichier Amazon, en 5 étapes",
    subjectB: "Ce qui sort vraiment à la fin",
    preheader: "Les cinq étapes visibles, sans promesse floue.",
    segment: "openers_no_click",
    primary: "demo",
    gift: true,
    body: `<p style="margin:0 0 18px">Plutôt que de décrire l'outil, voici ce qui sort concrètement d'un projet complet.</p>
<p style="margin:0 0 12px"><strong>1. Le sommaire.</strong> Votre sujet en une phrase, un plan chapitre par chapitre que vous modifiez librement.</p>
<p style="margin:0 0 12px"><strong>2. Les chapitres.</strong> Rédigés un par un, en français, avec la mémoire du livre : personnages, lieux et faits restent cohérents jusqu'à la fin.</p>
<p style="margin:0 0 12px"><strong>3. La correction.</strong> Le manuscrit entier est relu et les corrections vous sont proposées une par une.</p>
<p style="margin:0 0 12px"><strong>4. La couverture.</strong> Face avant, dos calculé selon le nombre de pages, 4<sup>e</sup> de couverture aux dimensions exigées par Amazon.</p>
<p style="margin:0 0 18px"><strong>5. Le dépôt.</strong> Word et PDF avec table des matières propre, plus la fiche Amazon : titre, description, mots-clés, catégories.</p>`,
    cta: "Voir la démonstration",
    ps: "Rien à installer, rien à configurer : tout se passe dans votre navigateur.",
  },
  {
    key: "clic-b3",
    label: "B3 — Objections : « je n'écris pas bien »",
    subject: "« Je n'écris pas bien » : et alors ?",
    subjectB: "Trois blocages, trois réponses courtes",
    preheader: "Les trois phrases qu'on me dit le plus, et ce qu'il en est.",
    segment: "openers_no_click",
    primary: "gift",
    gift: true,
    body: `<p style="margin:0 0 18px">Trois phrases reviennent tout le temps. Voici mes réponses, sans détour.</p>
<p style="margin:0 0 12px"><strong>« Je n'écris pas bien. »</strong> Vous n'écrivez pas : vous décidez. Vous validez le plan, vous relisez, vous corrigez un mot ici ou là. La rédaction est faite pour vous, en français correct.</p>
<p style="margin:0 0 12px"><strong>« C'est trop technique. »</strong> Vous répondez à des questions, vous cliquez, vous téléchargez un Word et un PDF déjà aux normes Amazon. Aucun logiciel à installer.</p>
<p style="margin:0 0 18px"><strong>« Je n'ai pas le temps. »</strong> La première séance utile dure vingt minutes. Le reste se fait chapitre par chapitre, à votre rythme, et tout est sauvegardé entre deux sessions.</p>
<p style="margin:0 0 18px">Le plus simple : prenez une de mes 10 niches offertes et regardez ce que devient l'idée.</p>`,
    cta: "Voir mes 10 niches offertes",
    ps: `Il vous reste une question qui bloque tout ? Écrivez-moi : ${DIRECT_EMAIL}, je réponds moi-même.`,
  },
  {
    key: "clic-b4",
    label: "B4 — Échéance : l'accès à vie disparaît",
    subject: "Après le 31 août, ce tarif n'existe plus",
    subjectB: "47 € une fois, ou 324 € par an",
    preheader: "Le calcul est simple, et la date ne bougera pas.",
    segment: "openers_no_click",
    primary: "checkout",
    price: true,
    body: `<p style="margin:0 0 18px">Jusqu'au <strong>31 août 2026</strong>, EbookStudio est accessible pour <strong>47 €, une seule fois, à vie</strong>. À partir du 1<sup>er</sup> septembre, il ne restera que l'abonnement : 27 € par mois, soit <strong>324 € la première année</strong>, et autant les suivantes.</p>
<p style="margin:0 0 18px">Avec l'accès à vie, vous gardez tout : la rédaction complète de vos livres, les exports Word et PDF aux normes Amazon KDP, les couvertures avec dos calculé, la fiche de vente, les livres illustrés pour enfants — et les nouveaux outils au fur et à mesure, sans repayer.</p>
<p style="margin:0 0 14px;font:700 17px Arial,Helvetica,sans-serif">Ce qui lève le risque</p>
<p style="margin:0 0 12px"><strong>Garantie 30 jours</strong> : remboursé sur simple demande, sans justification.</p>
<p style="margin:0 0 12px"><strong>Accès immédiat</strong> : vos identifiants arrivent par email juste après le paiement.</p>
<p style="margin:0 0 18px"><strong>Mon adresse directe</strong> : ${DIRECT_EMAIL}. Si quelque chose bloque, vous m'écrivez et je réponds moi-même.</p>`,
    cta: "Ouvrir mon accès à vie — 47 €",
    ps: "Paiement en 2 fois (2 × 25 €) ou 3 fois (3 × 18 €), accès ouvert dès la première échéance.",
  },

  // ------------------------------------------------------------ Séquence C
  {
    key: "chaud-c1",
    label: "C1 — Cliqueurs : qu'est-ce qui vous retient ?",
    subject: "Qu'est-ce qui vous retient ?",
    subjectB: "Une phrase et je vous fais votre sommaire",
    preheader: "Répondez-moi, je construis votre premier sommaire avec vous.",
    segment: "clickers",
    primary: "gift",
    body: `<p style="margin:0 0 18px">Vous êtes venu voir EbookStudio, puis vous n'êtes pas allé plus loin. C'est votre droit — mais si quelque chose vous retient, je préfère y répondre directement.</p>
<p style="margin:0 0 18px">Ma proposition est simple : <strong>répondez à cet email avec le sujet de votre livre en une phrase</strong>, et je construis le premier sommaire avec vous. Vous verrez le résultat avant de décider quoi que ce soit.</p>
<p style="margin:0 0 18px">En attendant, prenez le cadeau : 10 niches Amazon rentables, offertes.</p>`,
    cta: "Voir mes 10 niches offertes",
    ps: `Vous pouvez aussi m'écrire directement à ${DIRECT_EMAIL}. Si ce n'est pas le moment, répondez « pas maintenant » et je vous retire des relances.`,
  },
  {
    key: "chaud-c2",
    label: "C2 — Cliqueurs : rappel final avec achat",
    subject: "Je ferme l'accès à vie le 31 août",
    subjectB: "Dernier rappel avant le passage en abonnement",
    preheader: "Garantie 30 jours, paiement en 2 ou 3 fois, PayPal accepté.",
    segment: "clickers",
    primary: "checkout",
    price: true,
    body: `<p style="margin:0 0 18px">Dernier message sur cette offre, et il est court.</p>
<p style="margin:0 0 18px">Le <strong>31 août 2026</strong>, l'accès à vie à 47 € disparaît. Ensuite, c'est 27 € par mois, soit 324 € la première année.</p>
<p style="margin:0 0 12px"><strong>Garantie 30 jours</strong> : remboursé sur simple demande.</p>
<p style="margin:0 0 12px"><strong>2 × 25 € ou 3 × 18 €</strong>, accès ouvert dès la première échéance.</p>
<p style="margin:0 0 12px"><strong>PayPal ou carte bancaire</strong>, au choix sur la page de paiement.</p>
<p style="margin:0 0 18px">Juste après le paiement, vous recevez vos identifiants, le lien de vos 10 niches et mon adresse directe (${DIRECT_EMAIL}).</p>`,
    cta: "Ouvrir mon accès à vie — 47 €",
    ps: "Après le 31 août, ce tarif ne reviendra pas.",
  },

  // ------------------------------------------------------------ Offre directe
  {
    key: "offre-47-directe",
    label: "Offre directe — 47 € à vie (test de clics)",
    subject: "47 € une fois, à vie — jusqu'au 31 août",
    subjectB: "Votre accès à vie à 47 € se termine bientôt",
    preheader: "Paiement unique, accès immédiat, garantie 30 jours.",
    segment: "all",
    primary: "checkout",
    price: true,
    body: `<p style="margin:0 0 18px">Je vais droit au but : jusqu'au <strong>31 août 2026</strong>, l'accès complet à EbookStudio est à <strong>47 €, une seule fois, à vie</strong>. Ensuite, il ne restera que l'abonnement à 27 € par mois.</p>
<p style="margin:0 0 12px">Pour 47 €, vous repartez avec tout ceci, sans limite de durée :</p>
<p style="margin:0 0 8px">— votre livre rédigé chapitre par chapitre, en français soigné ;</p>
<p style="margin:0 0 8px">— le fichier Word et le PDF aux normes Amazon KDP ;</p>
<p style="margin:0 0 8px">— la couverture complète : face, dos calculé, 4<sup>e</sup> de couverture ;</p>
<p style="margin:0 0 18px">— la fiche de vente Amazon : titre, description, mots-clés, catégories.</p>
<p style="margin:0 0 18px"><strong>Garantie 30 jours</strong> : remboursé sur simple demande. Paiement possible en 2 ou 3 fois, par carte ou PayPal.</p>`,
    cta: "Je prends l'accès à vie — 47 €",
    ps: `Une question avant de décider ? Répondez à cet email, ou écrivez-moi à ${DIRECT_EMAIL} : je lis et je réponds moi-même.`,
  },
];

const byKey = new Map(LETTERS.map((l) => [l.key, l]));

const normalize = (value: string) => value.trim().toLowerCase();
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/** Destination du bouton principal, selon l'objectif de l'email. */
function primaryDestination(email: string, letter: Letter) {
  if (letter.primary === "gift") {
    return `${GIFT_URL}?src=${letter.key}&email=${encodeURIComponent(email)}`;
  }
  if (letter.primary === "demo") {
    return `${DEMO_URL}?utm_source=email&utm_medium=${CAMPAIGN}&utm_campaign=${letter.key}`;
  }
  return `${CHECKOUT}?src=${CAMPAIGN}-${letter.key}&email=${encodeURIComponent(email)}`;
}

/** Lien de clic hébergé sur notre domaine (/r) : plus de confiance, clic enregistré. */
function trackedLink(email: string, letter: Letter, suffix = "") {
  const destination = suffix === "-achat"
    ? `${CHECKOUT}?src=${CAMPAIGN}-${letter.key}&email=${encodeURIComponent(email)}`
    : suffix === "-cadeau"
      ? `${GIFT_URL}?src=${letter.key}&email=${encodeURIComponent(email)}`
      : primaryDestination(email, letter);
  return `https://ebookstudio.fr/r?e=${encodeURIComponent(email)}&s=1&t=${letter.key}${suffix}&u=${encodeURIComponent(destination)}`;
}

function giftBlock(link: string) {
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse;margin:24px 0"><tr><td style="background:#FFF7EA;border:1px solid #FF9E2D;padding:18px 20px;color:#232F3E;font:16px/1.6 Arial,Helvetica,sans-serif">
<div style="font:700 17px Arial,Helvetica,sans-serif;margin-bottom:8px">🎁 Votre cadeau : 10 niches Amazon rentables</div>
<div style="margin-bottom:12px">Offert, sans achat et sans carte bancaire.</div>
<a href="${link}" style="color:#008296;font-weight:700;text-decoration:underline">Voir mes 10 niches offertes</a>
</td></tr></table>`;
}

function ctaButton(link: string, label: string) {
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse;margin:26px 0"><tr><td align="center" bgcolor="#FF9E2D" style="border-radius:6px"><a href="${link}" style="display:block;padding:17px 24px;color:#232F3E;text-decoration:none;font:700 17px/1.3 Arial,Helvetica,sans-serif;text-align:center">${label}</a></td></tr></table>`;
}

/** Rappel discret de l'offre, quand l'email n'a pas pour but de vendre. */
function softOfferLine(link: string) {
  return `<p style="margin:0 0 18px;font:14px/1.6 Arial,Helvetica,sans-serif;color:#4b5563">Si vous voulez aller plus loin : l'accès complet est à 47 € une seule fois, à vie, jusqu'au 31 août 2026 (ensuite 27 €/mois). <a href="${link}" style="color:#008296">Voir l'offre</a>.</p>`;
}

function render(baseUrl: string, email: string, firstName: string, letter: Letter, subject: string) {
  const primary = trackedLink(email, letter);
  const unsubscribe = `${baseUrl}/functions/v1/unsubscribe?email=${encodeURIComponent(email)}&seq=all`;
  const pixel = `${baseUrl}/functions/v1/track-email-open?e=${encodeURIComponent(email)}&s=1&t=${letter.key}`;
  const showsPrice = letter.price === true;
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${subject}</title></head><body style="margin:0;background:#f6f7f8;padding:24px 10px">
<div style="display:none;font-size:1px;color:#f6f7f8;max-height:0;overflow:hidden">${letter.preheader}</div>
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse"><tr><td align="center">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e5e7eb;border-collapse:collapse">
<tr><td style="background:#008296;padding:18px 28px;color:#ffffff;font:700 22px Arial,Helvetica,sans-serif">EbookStudio</td></tr>
<tr><td style="padding:26px 28px 0;color:#232F3E;font:16px/1.65 Arial,Helvetica,sans-serif">
<p style="margin:0 0 18px">Bonjour${firstName ? ` ${firstName}` : ""},</p>
${letter.body}
${letter.gift && letter.primary !== "gift" ? giftBlock(trackedLink(email, letter, "-cadeau")) : ""}
${showsPrice ? PRICE_BLOCK : ""}
${ctaButton(primary, letter.cta)}
${showsPrice ? "" : softOfferLine(trackedLink(email, letter, "-achat"))}
<p style="margin:0 0 6px">Bien à vous,<br><strong>Georges Boubet</strong><br>EbookStudio — <a href="mailto:${DIRECT_EMAIL}" style="color:#008296">${DIRECT_EMAIL}</a></p>
<p style="margin:18px 0 0;padding:14px 0 0;border-top:1px solid #e5e7eb;font:15px/1.6 Arial,Helvetica,sans-serif;color:#4b5563">${letter.ps}</p>
</td></tr>
<tr><td style="padding:18px 24px;background:#f6f7f8;text-align:center;color:#68737d;font:12px/1.6 Arial,Helvetica,sans-serif">Offre à 47 € valable jusqu'au 31 août 2026.<br>Vous recevez cet email car vous avez manifesté un intérêt pour EbookStudio.<br><a href="${unsubscribe}" style="color:#008296">Se désinscrire de tous les emails marketing</a></td></tr>
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

    const letter = byKey.get(String(body.template || ""));

    // ---------------------------------------------------------------- status
    if (mode === "status") {
      const [{ data: leadRows }, { data: orderRows }] = await Promise.all([
        db.from("funnel_leads").select("email,landing_url,utm_campaign").limit(10000),
        db.from("funnel_orders").select("email,status").limit(10000),
      ]);
      const paidEmails = new Set(
        (orderRows || []).filter((o) => o.status === "paid").map((o) => normalize(o.email || "")),
      );

      const stats = await Promise.all(
        LETTERS.map(async (l) => {
          const { data: sentRows } = await db
            .from("email_send_log")
            .select("recipient_email")
            .eq("template_name", l.key)
            .in("status", ["sent", "delivered"])
            .limit(10000);
          const recipients = new Set((sentRows || []).map((r) => normalize(r.recipient_email || "")));

          const { data: opens } = await db
            .from("email_opens").select("prospect_email").eq("template_name", l.key).limit(10000);
          const { data: clicks } = await db
            .from("email_clicks").select("prospect_email").ilike("template_name", `${l.key}%`).limit(10000);

          const leads = (leadRows || []).filter((r) => {
            const url = String(r.landing_url || "");
            return url.includes(`src=${l.key}`) || String(r.utm_campaign || "") === l.key;
          }).length;
          const orders = [...paidEmails].filter((e) => recipients.has(e)).length;

          return {
            template: l.key,
            label: l.label,
            subject: l.subject,
            segment: l.segment,
            primary: l.primary,
            sent: recipients.size,
            opens: new Set((opens || []).map((r) => normalize(r.prospect_email || ""))).size,
            clicks: new Set((clicks || []).map((r) => normalize(r.prospect_email || ""))).size,
            leads,
            orders,
          };
        }),
      );
      return respond({ campaign: CAMPAIGN, blocked: !EMAIL_SENDING_ENABLED, letters: stats });
    }

    if (!letter) return respond({ error: "Gabarit inconnu" }, 400);

    // ------------------------------------------------ statut par destinataire
    if (mode === "recipients") {
      const [{ data: clicksRows }, { data: opensRows }, { data: logRows }, { data: paidOrders }, { data: profileRows }] =
        await Promise.all([
          db.from("email_clicks").select("prospect_email").limit(20000),
          db.from("email_opens").select("prospect_email").limit(20000),
          db.from("email_send_log")
            .select("message_id,recipient_email,status,error_message,created_at")
            .eq("template_name", letter.key)
            .order("created_at", { ascending: false })
            .limit(20000),
          db.from("funnel_orders").select("email").eq("status", "paid").limit(5000),
          db.from("sales_prospects").select("email,first_name,unsubscribed,status").limit(20000),
        ]);

      const clickers = new Set((clicksRows || []).map((r) => normalize(r.prospect_email || "")));
      const openers = new Set((opensRows || []).map((r) => normalize(r.prospect_email || "")));
      const paid = new Set((paidOrders || []).map((r) => normalize(r.email || "")));
      const profiles = new Map((profileRows || []).map((r) => [normalize(r.email || ""), r]));

      // Dernière ligne de journal par destinataire (le plus récent d'abord).
      const lastLog = new Map<string, { status: string; error_message: string | null; created_at: string }>();
      for (const row of logRows || []) {
        const email = normalize(row.recipient_email || "");
        if (!email || lastLog.has(email)) continue;
        lastLog.set(email, {
          status: String(row.status || ""),
          error_message: (row.error_message as string) || null,
          created_at: String(row.created_at || ""),
        });
      }

      const pool = letter.segment === "clickers"
        ? [...clickers]
        : letter.segment === "openers_no_click"
          ? [...openers].filter((email) => !clickers.has(email))
          : [...profiles.keys()].filter((email) => !openers.has(email) && !clickers.has(email));

      const rows: Array<Record<string, unknown>> = [];
      for (const email of new Set([...pool, ...lastLog.keys()])) {
        if (!isEmail(email)) continue;
        const profile = profiles.get(email);
        const log = lastLog.get(email);
        let status: "sent" | "error" | "pending" | "excluded" = "pending";
        let reason = "";
        if (log && ["sent", "delivered"].includes(log.status)) status = "sent";
        else if (log && log.status === "pending") {
          // Ligne d'attente sans confirmation : le destinataire reste à envoyer.
          status = "pending";
          reason = "Envoi non confirmé, sera repris";
        } else if (log) {
          status = "error";
          reason = log.error_message || `Échec (${log.status})`;
        } else if (paid.has(email)) {

          status = "excluded";
          reason = "Client déjà acheteur";
        } else if (!profile) {
          status = "excluded";
          reason = "Contact inconnu";
        } else if (profile.unsubscribed === true) {
          status = "excluded";
          reason = "Désinscrit";
        } else if (profile.status !== "active") {
          status = "excluded";
          reason = `Contact ${profile.status || "inactif"}`;
        }
        rows.push({
          email,
          first_name: (profile?.first_name as string) || "",
          status,
          reason,
          sent_at: log?.created_at || null,
        });
      }

      const order = { error: 0, pending: 1, sent: 2, excluded: 3 } as Record<string, number>;
      rows.sort((a, b) =>
        (order[String(a.status)] - order[String(b.status)]) || String(a.email).localeCompare(String(b.email)),
      );

      const counts = rows.reduce(
        (acc, r) => {
          const key = String(r.status);
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      return respond({ success: true, template: letter.key, label: letter.label, counts, recipients: rows });
    }


    if (mode === "preview") {
      return new Response(render(baseUrl, "apercu@ebookstudio.fr", "Georges", letter, letter.subject), {
        headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (!EMAIL_SENDING_ENABLED) return respond(emailSendingBlockedResult(), 423);

    if (mode === "test") {
      const testEmail = normalize(String(body.test_email || ""));
      if (!isEmail(testEmail)) return respond({ error: "Adresse de test invalide" }, 400);
      const result = await sendResendEmailThrottled({
        from: FROM_CAMPAIGN,
        to: [testEmail],
        subject: `[TEST] ${letter.subject}`,
        html: render(baseUrl, testEmail, "Georges", letter, letter.subject),
        reply_to: REPLY_TO,
      });
      if (!result.ok) return respond({ error: `Envoi refusé (HTTP ${result.status || ""}) ${result.detail || ""}` }, 502);
      return respond({ success: true, mode, template: letter.key, sent: 1 });
    }

    if (mode !== "send") return respond({ error: "Mode inconnu" }, 400);

    // Le forfait actif couvre 50 000 emails/mois. Le plafond précédent de 100
    // était une limite applicative, pas une limite Resend. 500 garde un lot
    // borné tout en permettant de terminer les segments actuels en un passage.
    const requestedBatchSize = Number(body.batch_size || 500);
    const limit = Math.min(Math.max(Number.isFinite(requestedBatchSize) ? requestedBatchSize : 500, 1), 500);

    const [{ data: clicksRows }, { data: opensRows }, { data: alreadySent }, { data: paidOrders }, { data: profileRows }] =
      await Promise.all([
        db.from("email_clicks").select("prospect_email").limit(20000),
        db.from("email_opens").select("prospect_email").limit(20000),
        db.from("email_send_log").select("recipient_email").eq("template_name", letter.key).in("status", ["sent", "delivered"]).limit(20000),
        db.from("funnel_orders").select("email").eq("status", "paid").limit(5000),
        db.from("sales_prospects").select("email,first_name,unsubscribed,status").limit(20000),
      ]);

    const clickers = new Set((clicksRows || []).map((r) => normalize(r.prospect_email || "")));
    const openers = new Set((opensRows || []).map((r) => normalize(r.prospect_email || "")));
    const done = new Set((alreadySent || []).map((r) => normalize(r.recipient_email || "")));
    const paid = new Set((paidOrders || []).map((r) => normalize(r.email || "")));
    const profiles = new Map((profileRows || []).map((r) => [normalize(r.email || ""), r]));
    const allKnown = [...profiles.keys()];

    const pool = letter.segment === "clickers"
      ? [...clickers]
      : letter.segment === "openers_no_click"
        ? [...openers].filter((email) => !clickers.has(email))
        : allKnown.filter((email) => !openers.has(email) && !clickers.has(email));

    const eligible: string[] = [];
    for (const email of pool) {
      if (!isEmail(email) || done.has(email) || paid.has(email)) continue;
      const profile = profiles.get(email);
      if (!profile) continue; // on n'écrit qu'aux contacts connus et actifs
      if (profile.unsubscribed === true || profile.status !== "active") continue;
      eligible.push(email);
    }
    const targets = eligible.slice(0, limit);

    if (body.dry_run) {
      return respond({
        success: true,
        mode,
        template: letter.key,
        segment: letter.segment,
        would_send: targets.length,
        eligible_total: eligible.length,
      });
    }

    let sent = 0;
    let quotaReached = false;
    let index = 0;
    for (const email of targets) {
      const profile = profiles.get(email);
      // Test d'objet : une adresse sur deux reçoit l'objet alternatif.
      const subject = letter.subjectB && index % 2 === 1 ? letter.subjectB : letter.subject;
      index++;
      const messageId = `${CAMPAIGN}-${letter.key}-${email}`;
      await db.from("email_send_log").insert({
        recipient_email: email,
        template_name: letter.key,
        message_id: messageId,
        status: "pending",
        error_message: null,
      });
      const result = await sendResendEmailThrottled({
        from: FROM_CAMPAIGN,
        to: [email],
        subject,
        html: render(baseUrl, email, (profile?.first_name as string) || "", letter, subject),
        reply_to: REPLY_TO,
      });
      await db.from("email_send_log").insert({
        recipient_email: email,
        template_name: letter.key,
        message_id: messageId,
        provider_message_id: result.id || null,
        status: result.ok ? "sent" : "failed",
        error_message: result.ok
          ? null
          : `HTTP ${result.status || ""}: ${result.detail || ""}${result.id ? ` (fournisseur ${result.id})` : ""}`,
      });
      if (!result.ok) {
        if (isQuotaExhausted()) {
          quotaReached = true;
          break;
        }
        continue;
      }
      sent++;
    }

    const remaining = Math.max(0, eligible.length - sent);
    return respond({
      success: true,
      mode,
      template: letter.key,
      segment: letter.segment,
      sent,
      targets: targets.length,
      eligible_total: eligible.length,
      remaining,
      quota_reached: quotaReached,
      message: quotaReached
        ? `Quota journalier d'envoi atteint : ${sent} emails envoyés, ${remaining} restants. Reprise possible demain, sans doublon.`
        : `${sent} emails envoyés, ${remaining} restants.`,
    });

  } catch (error) {
    console.error("send-closing-47", error);
    return respond({ error: error instanceof Error ? error.message : "Erreur serveur" }, 500);
  }
});
