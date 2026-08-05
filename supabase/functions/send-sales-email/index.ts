import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { isQuotaExhausted, sendResendEmailThrottled } from "../_shared/resendThrottle.ts";
import { EMAIL_SENDING_ENABLED, emailSendingBlockedResult } from "../_shared/emailSendingGuard.ts";
import { CHECKOUT_URL } from "../_shared/checkoutUrl.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

const CAMPAIGN = "offre-47-sequence-2026";
const CHECKOUT = CHECKOUT_URL;

const DELAYS = [0, 2, 3, 2, 3];

interface StepContent {
  subject: string;
  preheader: string;
  badge: string;
  heading: string;
  intro: string;
  bulletsTitle: string;
  bullets: Array<{ label: string; text: string }>;
  valueTitle: string;
  valueBody: string;
  result: string;
  reassurance: string;
  cta: string;
  closing: string;
  ps: string;
  showPrice: boolean;
  doubleCta: boolean;
}


const OFFER_BULLETS: Array<{ label: string; text: string }> = [
  { label: "Un plan structuré", text: "chapitres et sous-parties générés à partir de votre sujet, que vous validez et modifiez librement." },
  { label: "La rédaction chapitre par chapitre", text: "vous gardez la main : vous relisez, ajustez et réécrivez à chaque étape." },
  { label: "L’export prêt à publier", text: "fichiers Word et PDF conformes aux exigences Amazon KDP, sommaire propre, mise en page respectée." },
  { label: "La couverture KDP complète", text: "face avant, dos calculé selon votre nombre de pages, 4e de couverture, au format exact demandé par Amazon." },
  { label: "La fiche Amazon préparée", text: "titre, description, mots-clés et catégories — l’étape que la plupart des auteurs bâclent et qui décide de la visibilité du livre." },
  { label: "Les livres illustrés pour enfants 3-7 ans", text: "histoires et illustrations générées, format carré aux normes KDP." },
  { label: "Les outils annexes", text: "traduction, studio de couverture, recherche de niches, analyse de la concurrence Amazon." },
  { label: "La V3 incluse", text: "les évolutions à venir sont ajoutées à votre accès, sans repayer." },
];

const STEPS: StepContent[] = [
  {
    subject: "Votre idée de livre peut être publiée sur Amazon ce mois-ci",
    preheader: "Plan, rédaction, couverture KDP et fiche Amazon réunis dans un seul espace.",
    badge: "OFFRE 47 € AU LIEU DE 59 € — JUSQU’AU 30 SEPTEMBRE",
    heading: "Votre idée est déjà là. Il ne manque que la chaîne de fabrication.",
    intro: "Vous avez une idée de livre. Peut-être depuis des mois. Ce qui bloque, ce n’est presque jamais l’idée : c’est le plan à structurer, les chapitres à écrire, le fichier à mettre aux normes, la couverture à fabriquer et la fiche Amazon à remplir.<br><br>EbookStudio prend en charge cette chaîne complète, de la première idée jusqu’à la mise en vente.",
    bulletsTitle: "Ce que vous obtenez concrètement",
    bullets: OFFER_BULLETS,
    valueTitle: "À faire aujourd’hui, même sans EbookStudio",
    valueBody: "Écrivez votre sujet en une seule phrase : « Ce livre aide <em>[qui]</em> à <em>[résultat précis]</em> en <em>[combien de temps / de pages]</em> ». Si vous n’arrivez pas à remplir les trois trous, votre livre est encore trop large : c’est la première cause d’abandon avant le chapitre 3.",
    result: "vous ne repartez pas avec des conseils, mais avec un manuscrit complet, une couverture au bon format et une fiche produit prête à être publiée. Un projet qui traînait depuis des mois devient un livre disponible sur Amazon.",
    reassurance: "Tout est réuni dans un seul espace : pas d’outils à assembler, pas de logiciel à apprendre, aucune compétence technique requise. Même s’il s’agit de votre premier livre.",
    cta: "Découvrir EbookStudio et profiter de l’offre à 47 €",
    closing: "Votre idée est déjà là. EbookStudio vous aide maintenant à en faire un véritable livre.",
    ps: "Si vous hésitez, répondez simplement à cet email : je vous réponds personnellement.",
    showPrice: true,
    doubleCta: true,
  },
  {
    subject: "De trois lignes d’idée à un manuscrit complet",
    preheader: "Ce que vous saisissez au départ, ce que vous récupérez à la fin.",
    badge: "ÉTAPE 2 · AVANT / APRÈS",
    heading: "Vous apportez l’idée. EbookStudio construit le livre.",
    intro: "Au départ, vous écrivez trois lignes : le sujet de votre livre et à qui il s’adresse.<br><br>À l’arrivée, vous récupérez un dossier complet, prêt à être déposé sur Amazon KDP.",
    bulletsTitle: "Ce que vous récupérez à la fin",
    bullets: [
      { label: "Le manuscrit complet", text: "tous les chapitres rédigés, relus et modifiables jusqu’au dernier mot." },
      { label: "Le fichier intérieur", text: "Word et PDF au bon format, sommaire généré, titres hiérarchisés." },
      { label: "La couverture", text: "face avant, dos calculé, 4e de couverture, aux dimensions exactes de votre format." },
      { label: "La fiche de vente", text: "titre, sous-titre, description, mots-clés et catégories Amazon." },
      { label: "Le pack final", text: "un seul dossier à télécharger, tout est dedans." },
    ],
    valueTitle: "Le repère que personne ne vous donne : le bon calibre",
    valueBody: "Un guide pratique qui se vend bien sur Amazon fait le plus souvent <strong>120 à 180 pages</strong>, soit environ <strong>25 000 à 40 000 mots</strong>, répartis en <strong>8 à 12 chapitres de 2 500 à 3 500 mots</strong>. En dessous de 100 pages, le dos du livre est trop fin pour un titre lisible en broché. Notez ce calibre : c’est lui qui décide de votre plan.",
    result: "le temps que vous passiez à chercher comment faire, vous le passez maintenant à améliorer votre livre. C’est la seule partie que personne ne peut faire à votre place.",
    reassurance: "Vous restez maître du contenu à chaque étape : rien n’avance sans votre validation.",
    cta: "Voir ce que j’obtiens pour 47 €",
    closing: "Votre livre n’attend plus qu’une décision.",
    ps: "Une question sur votre projet précis ? Répondez à cet email, je vous réponds moi-même.",
    showPrice: false,
    doubleCta: false,
  },
  {
    subject: "Les 5 étapes qui créent votre livre",
    preheader: "Le workflow complet, étape par étape, sans page blanche.",
    badge: "ÉTAPE 3 · LE WORKFLOW EN DÉTAIL",
    heading: "Un workflow simple, sans page blanche",
    intro: "Beaucoup abandonnent parce qu’ils ne savent pas par quoi commencer. Voici exactement ce que vous voyez à l’écran, dans l’ordre.",
    bulletsTitle: "Les 5 étapes",
    bullets: [
      { label: "1. Le cadrage", text: "vous décrivez votre sujet, votre lecteur et le ton souhaité." },
      { label: "2. Le plan", text: "le sommaire est proposé ; vous ajoutez, supprimez et réorganisez les chapitres." },
      { label: "3. La rédaction", text: "les chapitres sont rédigés un par un ; vous relisez et corrigez au fil de l’eau." },
      { label: "4. L’habillage", text: "couverture, dos, 4e de couverture et mise en page aux normes KDP." },
      { label: "5. La publication", text: "export du pack complet et fiche Amazon prête à copier-coller." },
    ],
    valueTitle: "Les réglages KDP à connaître avant de publier",
    valueBody: "Format broché le plus courant : <strong>15,24 × 22,86 cm (6″ × 9″)</strong>. Marges intérieures de <strong>1,9 cm minimum</strong> dès 150 pages, sinon le texte se perd dans la reliure. Épaisseur du dos : <strong>nombre de pages × 0,0572 mm</strong> pour du papier blanc — c’est ce calcul qui fait rejeter la plupart des couvertures au premier dépôt.",
    result: "cinq étapes, un seul écran, aucun logiciel à installer. Vous savez à tout moment où vous en êtes et ce qu’il reste à faire.",
    reassurance: "Vous pouvez vous arrêter et reprendre plus tard : votre projet est sauvegardé.",
    cta: "Voir le workflow EbookStudio",
    closing: "La première étape prend cinq minutes.",
    ps: "Bloqué à une étape ? Répondez à cet email, je vous débloque.",
    showPrice: false,
    doubleCta: false,
  },
  {
    subject: "« Je n’écris pas bien », « c’est trop technique » : réponses claires",
    preheader: "Les questions qu’on me pose le plus, et mes réponses sans détour.",
    badge: "ÉTAPE 4 · VOS QUESTIONS, MES RÉPONSES",
    heading: "Avant de décider, voici les réponses essentielles",
    intro: "Ce sont les questions qui reviennent le plus souvent. Voici mes réponses, sans détour.",
    bulletsTitle: "Vos questions",
    bullets: [
      { label: "« Je n’écris pas bien »", text: "vous n’avez pas à écrire le premier jet : vous le relisez et vous le corrigez. C’est beaucoup plus facile que de partir d’une page blanche." },
      { label: "« C’est trop technique pour moi »", text: "aucune compétence technique nécessaire : vous répondez à des questions, vous cliquez, vous téléchargez." },
      { label: "« Est-ce un abonnement ? »", text: "non. 47 € en un seul paiement, aucun prélèvement mensuel." },
      { label: "« Est-ce que mon accès expire ? »", text: "non, l’accès est conservé et la V3 est incluse sans supplément." },
      { label: "« Et si je bloque ? »", text: "vous répondez à mes emails et je vous réponds personnellement." },
      { label: "« Puis-je publier plusieurs livres ? »", text: "oui, l’accès n’est pas limité à un seul projet." },
    ],
    valueTitle: "Comment se rémunère réellement un livre sur Amazon",
    valueBody: "En broché, KDP verse <strong>60 % du prix de vente moins les frais d’impression</strong> (environ 2,15 € + 0,0112 € par page). Un livre de 150 pages vendu 14,99 € rapporte donc à peu près <strong>5,20 € par exemplaire</strong>. En ebook, la redevance passe à <strong>70 %</strong> entre 2,99 € et 9,99 €. C’est ce calcul, pas le hasard, qui fixe le prix de votre livre.",
    result: "le vrai risque n’est pas de payer 47 €. C’est de retrouver dans un an la même idée de livre, toujours au même point.",
    reassurance: "Paiement unique, accès conservé, V3 incluse : rien à surveiller, rien à résilier.",
    cta: "Vérifier l’offre et commander à 47 €",
    closing: "Si une question manque à cette liste, posez-la moi.",
    ps: "Je lis et je réponds à chaque réponse à cet email.",
    showPrice: true,
    doubleCta: false,
  },
  {
    subject: "Le tarif de 47 € se termine le 30 septembre",
    preheader: "Après cette date, l’accès repasse à 59 €. Dernier message de la séquence.",
    badge: "DERNIER RAPPEL · 47 € JUSQU’AU 30 SEPTEMBRE",
    heading: "Dernier message sur le tarif de 47 €",
    intro: "Le 30 septembre 2026 au soir, l’accès complet repasse à <strong>59 €</strong>.<br><br>Ce n’est pas une fausse urgence : c’est simplement la fin du tarif d’été.",
    bulletsTitle: "Ce que vous obtenez encore aujourd’hui pour 47 €",
    bullets: [
      { label: "Plan et rédaction", text: "du sommaire au manuscrit complet, chapitre par chapitre." },
      { label: "Export KDP", text: "Word et PDF aux normes Amazon, sommaire propre." },
      { label: "Couverture complète", text: "face avant, dos calculé, 4e de couverture." },
      { label: "Fiche Amazon", text: "titre, description, mots-clés, catégories." },
      { label: "Livres enfants et outils annexes", text: "illustrés 3-7 ans, traduction, niches, analyse de la concurrence." },
      { label: "V3 incluse", text: "sans repayer." },
    ],
    valueTitle: "Les 7 mots-clés qui décident de votre visibilité",
    valueBody: "Amazon vous laisse <strong>7 champs de mots-clés</strong> et <strong>2 catégories</strong>. Utilisez des expressions que le lecteur tape vraiment (« méthode pour arrêter de procrastiner »), jamais votre nom ni le titre du livre : ils sont déjà indexés, les répéter gaspille un champ. Une fiche bien remplie fait souvent plus de ventes qu’un chapitre de plus.",
    result: "si votre projet de livre attend depuis trop longtemps, c’est le moment de le sortir. Vous obtenez maintenant le workflow complet pour 47 €, une seule fois.",
    reassurance: "C’est le dernier email de cette séquence. Il n’y aura pas de relance cachée ensuite.",
    cta: "Profiter du tarif avant le 30 septembre",
    closing: "Merci de m’avoir lu jusqu’ici.",
    ps: "Après le 30 septembre, ce tarif ne reviendra pas.",
    showPrice: true,
    doubleCta: true,
  },
];


const normalize = (value: string) => value.trim().toLowerCase();
const templateName = (step: number) => `offre-47-unique-${step}`;
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function trackedLink(baseUrl: string, email: string, step: number) {
  const destination = `${CHECKOUT}?src=${CAMPAIGN}-${step}&email=${encodeURIComponent(email)}`;
  return `${baseUrl}/functions/v1/track-email-click?e=${encodeURIComponent(email)}&s=${step}&t=${templateName(step)}&u=${encodeURIComponent(destination)}`;
}

function ctaButton(link: string, label: string) {
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse;margin:26px 0"><tr><td align="center" bgcolor="#FF9E2D" style="border-radius:6px"><a href="${link}" style="display:block;padding:17px 24px;color:#232F3E;text-decoration:none;font:700 17px/1.3 Arial,Helvetica,sans-serif;text-align:center">${label}</a></td></tr></table>`;
}

function bulletList(bullets: Array<{ label: string; text: string }>) {
  const rows = bullets
    .map(
      (b) =>
        `<tr><td valign="top" style="padding:0 10px 12px 0;font:700 16px/1.5 Arial,Helvetica,sans-serif;color:#008296;width:18px">&#10003;</td><td style="padding:0 0 12px 0;font:16px/1.55 Arial,Helvetica,sans-serif;color:#232F3E"><strong>${b.label}</strong> — ${b.text}</td></tr>`,
    )
    .join("");
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse">${rows}</table>`;
}

function render(baseUrl: string, email: string, firstName: string, step: number) {
  const c = STEPS[step - 1];
  const link = trackedLink(baseUrl, email, step);
  const unsubscribe = `${baseUrl}/functions/v1/unsubscribe?email=${encodeURIComponent(email)}&seq=all`;
  const pixel = `${baseUrl}/functions/v1/track-email-open?e=${encodeURIComponent(email)}&s=${step}&t=${templateName(step)}`;
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#f6f7f8;padding:24px 10px">
<div style="display:none;font-size:1px;color:#f6f7f8;max-height:0;overflow:hidden">${c.preheader}</div>
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse"><tr><td align="center">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e5e7eb;border-collapse:collapse">
<tr><td style="background:#008296;padding:18px 28px;color:#ffffff;font:700 22px Arial,Helvetica,sans-serif">EbookStudio</td></tr>
<tr><td style="padding:26px 28px 0"><span style="display:inline-block;background:#FFF4E5;color:#8a4b00;border:1px solid #FF9E2D;border-radius:4px;padding:7px 12px;font:700 12px Arial,Helvetica,sans-serif;letter-spacing:.4px">${c.badge}</span></td></tr>
<tr><td style="padding:20px 28px 0;color:#232F3E;font:16px/1.65 Arial,Helvetica,sans-serif">
<p style="margin:0 0 18px">Bonjour${firstName ? ` ${firstName}` : ""},</p>
<h1 style="margin:0 0 16px;font:700 25px/1.3 Arial,Helvetica,sans-serif;color:#232F3E">${c.heading}</h1>
<p style="margin:0 0 20px">${c.intro}</p>
<p style="margin:0 0 14px;font:700 17px Arial,Helvetica,sans-serif;color:#232F3E">${c.bulletsTitle}</p>
${bulletList(c.bullets)}
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse;margin:24px 0"><tr><td style="background:#fffaf2;border:1px solid #FF9E2D;padding:18px 20px;font:16px/1.65 Arial,Helvetica,sans-serif;color:#232F3E"><p style="margin:0 0 8px;font:700 16px Arial,Helvetica,sans-serif;color:#8a4b00">${c.valueTitle}</p>${c.valueBody}</td></tr></table>
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse;margin:22px 0"><tr><td style="background:#f2f8f9;border-left:4px solid #008296;padding:16px 18px;font:16px/1.6 Arial,Helvetica,sans-serif;color:#232F3E"><strong>Le résultat :</strong> ${c.result}</td></tr></table>
<p style="margin:0 0 20px">${c.reassurance}</p>
${c.showPrice ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse"><tr><td align="center" style="background:#232F3E;padding:20px;color:#ffffff;font:16px/1.5 Arial,Helvetica,sans-serif"><div style="font:700 38px/1.1 Arial,Helvetica,sans-serif;color:#FF9E2D">47 €</div><div style="margin-top:8px"><span style="text-decoration:line-through;opacity:.75">59 €</span> &nbsp;·&nbsp; paiement unique</div><div style="margin-top:6px;font-size:14px;opacity:.9">Pas d’abonnement, pas de prélèvement mensuel, accès conservé.</div></td></tr></table>` : `<p style="margin:0 0 20px;font:16px/1.6 Arial,Helvetica,sans-serif;color:#232F3E"><strong>47 €</strong> en un seul paiement (au lieu de 59 €), jusqu’au 30 septembre. Pas d’abonnement.</p>`}
${ctaButton(link, c.cta)}
<p style="margin:0 0 18px">${c.closing}</p>
<p style="margin:0 0 6px">Bien à vous,<br><strong>Georges Boubet</strong><br>EbookStudio</p>
<p style="margin:18px 0 0;padding:14px 0 0;border-top:1px solid #e5e7eb;font:15px/1.6 Arial,Helvetica,sans-serif;color:#4b5563">${c.ps}</p>
${c.doubleCta ? ctaButton(link, "J’accède à EbookStudio pour 47 €") : ""}

</td></tr>
<tr><td style="padding:18px 24px;background:#f6f7f8;text-align:center;color:#68737d;font:12px/1.6 Arial,Helvetica,sans-serif">Offre valable jusqu’au 30 septembre 2026, sous réserve des conditions indiquées sur le site.<br>Vous recevez cet email car vous avez manifesté un intérêt pour EbookStudio.<br><a href="${unsubscribe}" style="color:#008296">Se désinscrire de tous les emails marketing</a></td></tr>
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
    if (mode === "auto") {
      const { data: secret } = await db.from("app_secrets").select("value").eq("key", "cron_secret").maybeSingle();
      if (!secret?.value || req.headers.get("x-cron-secret") !== secret.value) return respond({ error: "Non autorisé" }, 401);
    } else if (!(await isAdmin(req, baseUrl))) return respond({ error: "Accès administrateur requis" }, 403);

    if (mode === "status") return respond({ campaign: CAMPAIGN, active: true, blocked: !EMAIL_SENDING_ENABLED, steps: STEPS.map((s, i) => ({ step: i + 1, subject: s.subject, template: templateName(i + 1) })) });
    if (mode === "preview") {
      const step = Math.min(Math.max(Number(body.step || 1), 1), 5);
      return new Response(render(baseUrl, "apercu@ebookstudio.fr", "Georges", step), { headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" } });
    }
    if (!EMAIL_SENDING_ENABLED) return respond(emailSendingBlockedResult(), 423);

    let recipients: Array<{ id?: string; email: string; first_name: string; current_step: number }> = [];
    if (mode === "test") {
      const requested = Number(body.step || 0);
      const testEmail = normalize(String(body.test_email || ""));
      if (!isEmail(testEmail)) return respond({ error: "Adresse de test invalide" }, 400);
      recipients = (requested >= 1 && requested <= 5 ? [requested] : [1, 2, 3, 4, 5]).map((step) => ({ email: testEmail, first_name: "Georges", current_step: step - 1 }));
    } else {
      let query = db.from("sales_prospects").select("id,email,first_name,current_step").eq("status", "active").eq("unsubscribed", false).eq("auto_send", true).eq("completed", false).lte("next_email_at", new Date().toISOString()).order("next_email_at").limit(Math.min(Number(body.batch_size || 50), 100));
      if (mode === "manual" && Array.isArray(body.prospect_ids) && body.prospect_ids.length) query = db.from("sales_prospects").select("id,email,first_name,current_step").in("id", body.prospect_ids).eq("status", "active").eq("unsubscribed", false).limit(100);
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
      if (!isEmail(email) || buyers.has(email) || !STEPS[step - 1]) { skipped++; continue; }
      const template = templateName(step);
      if (mode !== "test") {
        const { count } = await db.from("email_send_log").select("id", { count: "exact", head: true }).eq("recipient_email", email).eq("template_name", template).in("status", ["sent", "delivered"]);
        if ((count || 0) > 0) { skipped++; continue; }
      }
      const result = await sendResendEmailThrottled({ from: "Georges Boubet <noreply@ebookstudio.fr>", to: [email], subject: `${mode === "test" ? "[TEST] " : ""}${STEPS[step - 1].subject}`, html: render(baseUrl, email, recipient.first_name || "", step), reply_to: "contact@ebookstudio.fr" });
      await db.from("email_send_log").insert({ recipient_email: email, template_name: template, message_id: result.id || `${CAMPAIGN}-${step}-${email}`, status: result.ok ? "sent" : "failed", error_message: result.ok ? null : `HTTP ${result.status || ""}: ${result.detail || ""}` });
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
