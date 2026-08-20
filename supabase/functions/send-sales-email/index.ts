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


interface StepContent {
  subject: string;
  preheader: string;
  /** Rappel court affiché sous la salutation (optionnel). */
  reminder?: string;
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

const RAW_STEPS: StepContent[] = [
  {
    subject: "L’accès à 47 € se termine le 31 août",
    preheader: "Le 1er octobre, EbookStudio passe en V3 par abonnement. Avant, l’accès complet reste à 47 €.",
    badge: "ACCÈS COMPLET 47 € — JUSQU’AU 31 AOÛT",
    heading: "Le 31 août, le paiement unique à 47 € disparaît",
    intro: "Je vous écris pour être clair sur le calendrier, sans détour.<br><br>Jusqu’au <strong>31 août 2026</strong>, l’accès complet à EbookStudio reste à <strong>47 € en un seul paiement</strong>. Après cette date, il n’y a plus de paiement unique : la <strong>V3 ouvre le 1er octobre</strong> et fonctionne par abonnement mensuel.",
    bulletsTitle: "Ce que contient l’accès à 47 €",
    bullets: OFFER_BULLETS,
    valueTitle: "Le calendrier, en trois dates",
    valueBody: "<strong>31 août</strong> : dernier jour du paiement unique à 47 €.<br><strong>1er septembre</strong> : les inscriptions à la V3 ouvrent, avec le <strong>premier mois offert</strong>.<br><strong>1er octobre</strong> : la V3 ouvre pour de bon et tout le monde entre en même temps.",
    result: "vous obtenez aujourd’hui le workflow complet — plan, rédaction, export KDP, couverture, fiche Amazon — pour un seul paiement, et vous gardez cet accès.",
    reassurance: "Aucun abonnement, aucun prélèvement mensuel, aucune date de fin sur votre accès.",
    cta: "Prendre l’accès complet à 47 € avant le 31 août",
    closing: "Si votre projet de livre attend depuis des mois, c’est la dernière fenêtre à ce tarif.",
    ps: "Une question sur votre projet ? Répondez à cet email : je réponds moi-même.",
    showPrice: true,
    doubleCta: true,
  },
  {
    subject: "Ce qui change vraiment le 1er octobre",
    preheader: "V3 en abonnement, premier mois offert, inscriptions dès le 1er septembre.",
    badge: "JOUR 2 · LA V3 ARRIVE LE 1ER OCTOBRE",
    heading: "La V3 ouvre le 1er octobre. Voici comment y entrer.",
    intro: "La V3 n’est pas une mise à jour cosmétique : c’est l’atelier complet, avec les 15 agents qui fabriquent le livre étape par étape, le studio de couverture, la fiche KDP et l’aperçu du livre en direct.<br><br>Elle ouvre le <strong>1er octobre 2026</strong>. Les inscriptions, elles, ouvrent dès le <strong>1er septembre</strong>.",
    bulletsTitle: "Comment se passe l’entrée en V3",
    bullets: [
      { label: "1er septembre", text: "vous pouvez vous inscrire immédiatement et réserver votre place." },
      { label: "Premier mois offert", text: "vous ne payez rien le premier mois ; la première facture tombe après l’ouverture." },
      { label: "1er octobre", text: "votre espace V3 s’ouvre, avec l’atelier complet et vos projets." },
      { label: "Sans engagement", text: "vous arrêtez quand vous voulez, en un clic, avant la fin du mois offert." },
      { label: "Avant l’ouverture", text: "vous accédez tout de suite aux cadeaux de bienvenue et au kit de démarrage." },
    ],
    valueTitle: "Et si vous prenez l’accès à 47 € avant le 31 août ?",
    valueBody: "Vous n’avez rien à payer ensuite : les évolutions sont <strong>incluses dans votre accès</strong>. C’est la seule manière d’avoir EbookStudio sans abonnement mensuel, et elle se ferme le 31 août.",
    result: "deux chemins, un seul choix à faire ce mois-ci : un paiement unique de 47 € maintenant, ou un abonnement mensuel à partir du 1er octobre.",
    reassurance: "Dans les deux cas, vous savez exactement ce que vous payez et quand.",
    cta: "Choisir l’accès unique à 47 € (jusqu’au 31 août)",
    closing: "Le 1er septembre, je vous enverrai le lien d’inscription à la V3.",
    ps: "Vous hésitez entre les deux ? Répondez-moi en une ligne, je vous dis lequel correspond à votre situation.",
    showPrice: false,
    doubleCta: false,
  },
  {
    subject: "Un livre complet, du sommaire au fichier Amazon",
    preheader: "Ce que la machine fabrique réellement, étape par étape.",
    reminder: "Rappel du calendrier : <strong>47 € en paiement unique jusqu’au 31 août</strong>, puis V3 par abonnement à partir du 1er octobre (inscriptions dès le 1er septembre, premier mois offert).",
    badge: "JOUR 3 · CE QUE VOUS OBTENEZ CONCRÈTEMENT",
    heading: "De trois lignes d’idée à un livre déposable sur Amazon",
    intro: "Vous écrivez votre sujet et à qui il s’adresse. Ensuite, chaque étape est prise en charge et vous validez au fur et à mesure.",
    bulletsTitle: "Les 5 étapes",
    bullets: [
      { label: "1. Le cadrage", text: "votre sujet, votre lecteur, le ton. Une seule information est obligatoire : l’idée." },
      { label: "2. Le sommaire", text: "le plan est proposé chapitre par chapitre ; vous ajoutez, supprimez, réorganisez." },
      { label: "3. La rédaction", text: "les chapitres sont écrits un par un, relus, corrigés, et visibles en direct à côté." },
      { label: "4. L’habillage", text: "couverture, dos calculé, 4e de couverture, mise en page aux normes KDP." },
      { label: "5. La publication", text: "export Word et PDF, description, 7 mots-clés et catégories prêtes à coller." },
    ],
    valueTitle: "Le bon calibre, pour éviter le rejet au dépôt",
    valueBody: "Un guide pratique qui se vend fait le plus souvent <strong>120 à 180 pages</strong> (25 000 à 40 000 mots), en <strong>8 à 12 chapitres</strong>. Format broché courant : <strong>15,24 × 22,86 cm</strong>. Marges intérieures de <strong>1,9 cm</strong> dès 150 pages. Sous 100 pages, le dos est trop fin pour un titre lisible.",
    result: "vous ne repartez pas avec des conseils : vous repartez avec un manuscrit, une couverture au bon format et une fiche Amazon remplie.",
    reassurance: "Vous gardez la main sur chaque mot : rien n’avance sans votre validation, et votre projet est sauvegardé.",
    cta: "Voir l’accès complet à 47 €",
    closing: "La première étape prend cinq minutes.",
    ps: "Bloqué sur votre sujet ? Écrivez-le moi en une phrase, je vous aide à le cadrer.",
    showPrice: false,
    doubleCta: false,
  },
  {
    subject: "« Je n’écris pas bien », « c’est trop technique » : mes réponses",
    preheader: "Les six questions qui reviennent le plus, et les réponses sans détour.",
    badge: "JOUR 4 · VOS QUESTIONS, MES RÉPONSES",
    heading: "Avant de décider, les réponses essentielles",
    intro: "Il reste peu de jours avant le 31 août. Voici les questions qu’on me pose le plus souvent.",
    bulletsTitle: "Vos questions",
    bullets: [
      { label: "« Je n’écris pas bien »", text: "vous n’écrivez pas le premier jet : vous le relisez et le corrigez. Bien plus facile qu’une page blanche." },
      { label: "« C’est trop technique »", text: "vous répondez à des questions, vous cliquez, vous téléchargez. Aucun logiciel à installer." },
      { label: "« 47 €, c’est un abonnement ? »", text: "non. Un seul paiement, aucun prélèvement mensuel, jusqu’au 31 août." },
      { label: "« Et la V3 ? »", text: "elle ouvre le 1er octobre. Avec l’accès à 47 € vous la recevez sans repayer." },
      { label: "« Je préfère attendre octobre »", text: "c’est possible : inscriptions dès le 1er septembre, premier mois offert, sans engagement." },
      { label: "« Et si je bloque ? »", text: "vous répondez à mes emails et je vous réponds personnellement." },
    ],
    valueTitle: "Ce que rapporte réellement un livre sur Amazon",
    valueBody: "En broché, KDP verse <strong>60 % du prix de vente moins les frais d’impression</strong> (environ 2,15 € + 0,0112 € par page). Un livre de 150 pages vendu 14,99 € rapporte donc autour de <strong>5,20 € par exemplaire</strong>. En ebook, la redevance monte à <strong>70 %</strong> entre 2,99 € et 9,99 €.",
    result: "le vrai risque n’est pas de payer 47 € une fois. C’est de relire ce même email dans un an avec la même idée de livre, toujours au même point.",
    reassurance: "Paiement unique, accès conservé, V3 incluse : rien à surveiller, rien à résilier.",
    cta: "Prendre l’accès à 47 € avant le 31 août",
    closing: "Si une question manque à cette liste, posez-la moi.",
    ps: "Je lis chaque réponse à cet email.",
    showPrice: true,
    doubleCta: false,
  },
  {
    subject: "Dernier jour : 47 € ce soir, abonnement ensuite",
    preheader: "Après ce soir, plus de paiement unique. Rendez-vous le 1er septembre pour la V3.",
    badge: "DERNIER JOUR · 47 € JUSQU’À CE SOIR",
    heading: "Ce soir, le paiement unique s’arrête",
    intro: "C’est le dernier message de cette série.<br><br>Ce soir, <strong>31 août</strong>, l’accès complet à 47 € en paiement unique disparaît. Ensuite, il n’existe plus qu’un chemin : l’abonnement V3, dont les inscriptions ouvrent <strong>demain 1er septembre</strong> avec le <strong>premier mois offert</strong>, pour une ouverture le <strong>1er octobre</strong>.",
    bulletsTitle: "Ce que vous obtenez encore aujourd’hui pour 47 €",
    bullets: [
      { label: "Plan et rédaction", text: "du sommaire au manuscrit complet, chapitre par chapitre." },
      { label: "Export KDP", text: "Word et PDF aux normes Amazon, sommaire propre." },
      { label: "Couverture complète", text: "face avant, dos calculé, 4e de couverture." },
      { label: "Fiche Amazon", text: "description, 7 mots-clés, catégories." },
      { label: "Livres enfants et outils annexes", text: "illustrés 3-7 ans, traduction, niches, analyse de la concurrence." },
      { label: "La V3 incluse", text: "au 1er octobre, sans abonnement à payer." },
    ],
    valueTitle: "Les 7 mots-clés qui décident de votre visibilité",
    valueBody: "Amazon vous laisse <strong>7 champs de mots-clés</strong> et <strong>2 catégories</strong>. Utilisez des expressions que le lecteur tape vraiment (« méthode pour arrêter de procrastiner »), jamais votre nom ni le titre : ils sont déjà indexés. Une fiche bien remplie fait souvent plus de ventes qu’un chapitre de plus.",
    result: "un seul paiement aujourd’hui, ou un abonnement mensuel à partir d’octobre. À vous de choisir, mais choisissez avant ce soir.",
    reassurance: "C’est le dernier email de cette série : aucune relance cachée ensuite.",
    cta: "Profiter des 47 € avant ce soir",
    closing: "Merci de m’avoir lu jusqu’ici.",
    ps: "Si vous préférez la V3, ne faites rien : je vous envoie le lien d’inscription demain.",
    showPrice: true,
    doubleCta: true,
  },
];



/** Ordre des rappels : fin du 47 €, vidéo/démo, objections, ce qui change, dernier jour. */
const STEPS: StepContent[] = [RAW_STEPS[0], RAW_STEPS[2], RAW_STEPS[3], RAW_STEPS[1], RAW_STEPS[4]];

const normalize = (value: string) => value.trim().toLowerCase();
const templateName = (step: number) => `rappel-47-${step}`;
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/** Lien de clic hébergé sur notre propre domaine (/r) : plus de confiance
 *  côté messageries qu'une URL technique, et le suivi reste enregistré. */
function trackedLink(_baseUrl: string, email: string, step: number) {
  const destination = `${CHECKOUT}?src=${CAMPAIGN}-${step}&email=${encodeURIComponent(email)}`;
  return `https://ebookstudio.fr/r?e=${encodeURIComponent(email)}&s=${step}&t=${templateName(step)}&u=${encodeURIComponent(destination)}`;
}

function ctaButton(link: string, label: string) {
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse;margin:26px 0"><tr><td align="center" bgcolor="#FF9E2D" style="border-radius:6px"><a href="${link}" style="display:block;padding:17px 24px;color:#232F3E;text-decoration:none;font:700 17px/1.3 Arial,Helvetica,sans-serif;text-align:center">${label}</a></td></tr></table>`;
}

/** Bloc média : vignette cliquable vers la vidéo ou le message audio. Masqué si aucune URL. */
function mediaBlock(baseUrl: string, url: string, kind: "video" | "audio") {
  if (!url) return "";
  if (kind === "audio" || url.endsWith(".mp3")) {
    const audioPage = `${baseUrl}/message`;
    return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse;margin:24px 0"><tr><td align="center" style="background:#064e3b;padding:22px 20px"><p style="margin:0 0 6px;font:700 13px Arial,Helvetica,sans-serif;color:#C9A84C;letter-spacing:.6px">LE MESSAGE AUDIO — 2 MINUTES</p><p style="margin:0 0 14px;font:16px/1.55 Arial,Helvetica,sans-serif;color:#ffffff">Je vous explique pourquoi EbookStudio change la publication sur Amazon.</p><a href="${audioPage}" style="display:inline-block;background:#C9A84C;color:#0b2b22;text-decoration:none;padding:14px 22px;border-radius:6px;font:700 16px Arial,Helvetica,sans-serif">&#9658;&nbsp; Écouter le message</a></td></tr></table>`;
  }
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse;margin:24px 0"><tr><td align="center" style="background:#064e3b;padding:22px 20px"><p style="margin:0 0 6px;font:700 13px Arial,Helvetica,sans-serif;color:#C9A84C;letter-spacing:.6px">LA VIDÉO — 2 MINUTES</p><p style="margin:0 0 14px;font:16px/1.55 Arial,Helvetica,sans-serif;color:#ffffff">Je vous montre un livre complet, du sommaire au fichier prêt pour Amazon.</p><a href="${url}" style="display:inline-block;background:#C9A84C;color:#0b2b22;text-decoration:none;padding:14px 22px;border-radius:6px;font:700 16px Arial,Helvetica,sans-serif">&#9658;&nbsp; Regarder la vidéo</a></td></tr></table>`;
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
${c.reminder ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse;margin:0 0 18px"><tr><td style="background:#f2f8f9;border-left:4px solid #008296;padding:12px 16px;font:15px/1.6 Arial,Helvetica,sans-serif;color:#232F3E">${c.reminder}</td></tr></table>` : ""}
<h1 style="margin:0 0 16px;font:700 25px/1.3 Arial,Helvetica,sans-serif;color:#232F3E">${c.heading}</h1>
<p style="margin:0 0 20px">${c.intro}</p>
<p style="margin:0 0 14px;font:700 17px Arial,Helvetica,sans-serif;color:#232F3E">${c.bulletsTitle}</p>
${bulletList(c.bullets)}
${mediaBlock(VIDEO_URL, VIDEO_KIND)}
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse;margin:24px 0"><tr><td style="background:#fffaf2;border:1px solid #FF9E2D;padding:18px 20px;font:16px/1.65 Arial,Helvetica,sans-serif;color:#232F3E"><p style="margin:0 0 8px;font:700 16px Arial,Helvetica,sans-serif;color:#8a4b00">${c.valueTitle}</p>${c.valueBody}</td></tr></table>
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse;margin:22px 0"><tr><td style="background:#f2f8f9;border-left:4px solid #008296;padding:16px 18px;font:16px/1.6 Arial,Helvetica,sans-serif;color:#232F3E"><strong>Le résultat :</strong> ${c.result}</td></tr></table>
<p style="margin:0 0 20px">${c.reassurance}</p>
${c.showPrice ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse"><tr><td align="center" style="background:#232F3E;padding:20px;color:#ffffff;font:16px/1.5 Arial,Helvetica,sans-serif"><div style="font:700 38px/1.1 Arial,Helvetica,sans-serif;color:#FF9E2D">47 €</div><div style="margin-top:8px"><span style="text-decoration:line-through;opacity:.75">59 €</span> &nbsp;·&nbsp; paiement unique</div><div style="margin-top:6px;font-size:14px;opacity:.9">Pas d’abonnement, pas de prélèvement mensuel, accès conservé.</div></td></tr></table>` : `<p style="margin:0 0 20px;font:16px/1.6 Arial,Helvetica,sans-serif;color:#232F3E"><strong>47 €</strong> en un seul paiement (au lieu de 59 €), jusqu’au 31 août. Pas d’abonnement.</p>`}
${ctaButton(link, c.cta)}
<p style="margin:0 0 18px">${c.closing}</p>
<p style="margin:0 0 6px">Bien à vous,<br><strong>Georges Boubet</strong><br>EbookStudio</p>
<p style="margin:18px 0 0;padding:14px 0 0;border-top:1px solid #e5e7eb;font:15px/1.6 Arial,Helvetica,sans-serif;color:#4b5563">${c.ps}</p>
${c.doubleCta ? ctaButton(link, "J’accède à EbookStudio pour 47 €") : ""}

</td></tr>
<tr><td style="padding:18px 24px;background:#f6f7f8;text-align:center;color:#68737d;font:12px/1.6 Arial,Helvetica,sans-serif">Offre valable jusqu’au 31 août 2026 (23h59, Paris), sous réserve des conditions indiquées sur le site.<br>Vous recevez cet email car vous avez manifesté un intérêt pour EbookStudio.<br><a href="${unsubscribe}" style="color:#008296">Se désinscrire de tous les emails marketing</a></td></tr>
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
    if (mode === "auto") {
      if (!hasCronSecret) return respond({ error: "Non autorisé" }, 401);
    } else if (!hasCronSecret && !(await isAdmin(req, baseUrl))) return respond({ error: "Accès administrateur requis" }, 403);


    if (mode === "status") return respond({ campaign: CAMPAIGN, active: true, blocked: !EMAIL_SENDING_ENABLED, steps: STEPS.map((s, i) => ({ step: i + 1, subject: s.subject, template: templateName(i + 1) })) });
    if (mode === "preview") {
      const step = Math.min(Math.max(Number(body.step || 1), 1), 5);
      return new Response(render(baseUrl, "apercu@ebookstudio.fr", "Georges", step), { headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" } });
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
      if (!isEmail(email) || buyers.has(email) || !STEPS[step - 1]) { skipped++; continue; }
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
