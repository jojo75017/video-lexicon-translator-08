import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { sendResendEmailThrottled, isQuotaExhausted } from "../_shared/resendThrottle.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ===== Envoi via Resend (API directe, throttlé à 8 req/s) =====
const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_ADDRESS = "Georges Boubet <noreply@ebookstudio.fr>";

async function sendResendEmail(
  to: string,
  _name: string | undefined,
  subject: string,
  html: string,
): Promise<{ ok: boolean; detail?: string; id?: string }> {
  const r = await sendResendEmailThrottled({ from: FROM_ADDRESS, to: [to], subject, html });
  return {
    ok: r.ok,
    id: r.id,
    detail: r.ok ? undefined : `HTTP ${r.status ?? ""}: ${r.detail ?? ""}`,
  };
}

// Enregistre chaque envoi dans email_send_log (preuve de délivrabilité côté Resend)
async function logSend(
  supabase: any,
  recipient: string,
  templateName: string,
  result: { ok: boolean; detail?: string; id?: string },
): Promise<void> {
  try {
    await supabase.from("email_send_log").insert({
      recipient_email: recipient,
      template_name: templateName,
      message_id: result.id ?? null,
      status: result.ok ? "sent" : "error",
      error_message: result.ok ? null : (result.detail ?? null),
    });
  } catch (e) {
    console.error("logSend error:", e);
  }
}


// Email subjects and strategies — séquence courte 5 étapes + 1 relance non-cliqueurs (étape 6)
const EMAIL_SEQUENCE = [
  {
    step: 1,
    day_offset: 0,
    subject: "📖 150 pages générées en 47 minutes",
    preheader: "Comment je publie un livre par semaine sur Amazon.",
  },
  {
    step: 2,
    day_offset: 1,
    subject: "⚠️ Les 3 erreurs qui bloquent 90% des auteurs KDP",
    preheader: "La n°2, presque tout le monde la fait.",
  },
  {
    step: 3,
    day_offset: 2,
    subject: "💰 0 à 35 livres Amazon — mes vrais chiffres",
    preheader: "Pas de pitch, juste des faits.",
  },
  {
    step: 4,
    day_offset: 3,
    subject: "🎁 67€ aujourd'hui = la V3 à 197€ offerte",
    preheader: "L'offre Fondateur inclut la future V3 gratuitement.",
  },
  {
    step: 5,
    day_offset: 4,
    subject: "🔒 Dernier rappel sur l'offre Fondateur",
    preheader: "67€ à vie, mise à jour V3 incluse.",
  },
  {
    step: 6,
    day_offset: 6,
    subject: "👋 Une dernière chose, {name}",
    preheader: "Je n'ai pas eu de nouvelles — on en reste là ?",
  },
];

const DEMO_LINK = "https://www.ebookstudio.fr/demo";
const OFFRES_LINK = "https://www.ebookstudio.fr/offres";

function getEmailBody(step: number, firstName: string): string {
  const name = firstName || "cher lecteur";

  const bodies: Record<number, string> = {
    1: `Bonjour ${name},

Et si vous pouviez voir un livre de 150 pages s'écrire **sous vos yeux**, en quelques minutes ?

Pas une promesse. Une démo gratuite, en direct : vous tapez un sujet, l'IA génère le plan, puis les chapitres, puis la couverture. Prêt pour Amazon KDP.

Mon dernier livre ? **150 pages, 47 minutes.** (J'en ai 35+ publiés, profil Amazon public.)

Le plus simple, c'est de le voir vous-même 👇

[[ 🎬 Voir la démo gratuite (sans carte) | ${DEMO_LINK} ]]

À demain pour la suite,
Georges`,

    2: `${name},

90% des gens qui veulent publier sur Amazon n'y arrivent jamais. Pas par manque de talent — à cause de 3 erreurs :

❌ Écrire sans plan → abandon à la page 12
❌ Y passer 3 semaines → découragement
❌ Couverture + mots-clés négligés → 0 vente

EbookStudio Pro règle les 3 d'un coup : plan automatique, rédaction en quelques minutes, couvertures pro et optimisation KDP incluses.

Voyez à quoi ça ressemble en vrai 👇

[[ 🎬 Tester la démo gratuitement | ${DEMO_LINK} ]]

Georges`,

    3: `${name},

Pas de pitch aujourd'hui. Juste mes vrais chiffres :

• 2023 : 0 livre
• 2024 : 18 livres (écrits à la main)
• 2025-2026 : 35+ livres (avec EbookStudio)

Tout est public et vérifiable sur mon profil Amazon. La même machine qui m'a permis ça est désormais accessible à **67€ à vie**.

[[ 👉 Découvrir l'offre Fondateur (67€) | ${OFFRES_LINK} ]]

Georges`,

    4: `${name},

Une seule raison de ne pas attendre :

Aujourd'hui, EbookStudio Pro est à **67€ à vie**. Bientôt, la V3 « Publication Assistée Pro » sera vendue **197€**.

🎁 Les membres actuels la recevront en **mise à jour gratuite**.

Autrement dit : 67€ aujourd'hui = un outil qui en vaudra 197€ demain. Le calcul est vite fait.

[[ 🔒 Verrouiller mon accès à 67€ | ${OFFRES_LINK} ]]

Georges`,

    5: `${name},

Dernier rappel, je ne reviendrai pas dessus.

EbookStudio Pro, à **67€ à vie** :
✅ Générateur IA illimité
✅ Couvertures pro
✅ Livre audio
✅ Marketing & KDP intégrés
✅ Mise à jour V3 (197€) incluse

(Possible en 2×35€ ou 3×25€.)

[[ 👉 Rejoindre les Fondateurs | ${OFFRES_LINK} ]]

Merci de m'avoir lu cette semaine,
Georges`,

    6: `${name},

Je vous ai écrit plusieurs fois sans retour — et c'est tout à fait OK.

Avant de vous laisser tranquille, une question honnête : qu'est-ce qui vous retient ? Le prix, le doute que ça marche pour vous, le temps ?

Le plus simple pour lever le doute, c'est d'essayer sans rien payer 👇

[[ 🎬 Tester la démo gratuite | ${DEMO_LINK} ]]

Et si vous préférez m'écrire, répondez simplement à cet email : je lis tout personnellement.

Au plaisir,
Georges`,
  };

  return bodies[step] || "";
}

// ===== 3 relances tournantes (non-cliqueurs) — alternance démo / offre =====
// Tournent via sales_prospects.relance_round (0 → 1 → 2). Objectif : maximiser les clics.
const RELANCE_VARIANTS: { subject: string; body: (name: string) => string }[] = [
  // Variante 1 — Démo / curiosité
  {
    subject: "🎬 {name}, regardez un livre s'écrire en 2 min",
    body: (name) => `Bonjour ${name},

Je vais faire plus simple que tous mes emails : je vous montre.

👀 En **2 minutes chrono**, vous voyez l'IA générer en direct :
• le plan complet d'un livre
• les premiers chapitres rédigés
• une couverture professionnelle

Aucune carte bancaire, aucun engagement. Juste pour voir si ça vous parle.

[[ 🎬 Lancer la démo gratuite maintenant | ${DEMO_LINK} ]]

À tout de suite,
Georges`,
  },
  // Variante 2 — Offre / valeur
  {
    subject: "🎁 {name}, 67€ à vie = la V3 (197€) offerte",
    body: (name) => `${name},

Petit rappel important : l'offre Fondateur ne durera pas.

Pour **67€ une seule fois**, vous obtenez :
✅ Le générateur d'ebooks IA en illimité
✅ Les couvertures pro incluses
✅ Le livre audio + le marketing & KDP intégrés
✅ Et surtout : la **V3 (197€) offerte** à son lancement

Le prix Fondateur augmentera dès la sortie de la V3. Aujourd'hui, c'est le meilleur moment.

[[ 👉 Rejoindre les Fondateurs (67€ à vie) | ${OFFRES_LINK} ]]

À bientôt,
Georges`,
  },
  // Variante 3 — Démo + dernière main tendue
  {
    subject: "👋 {name}, une dernière démo avant qu'on arrête",
    body: (name) => `${name},

C'est sans doute mon dernier email — je ne veux pas vous harceler.

Avant de tourner la page, une question honnête : qu'est-ce qui vous retient ? Le prix, le doute, le temps ?

Le plus simple pour trancher, c'est de voir l'outil travailler, sans rien payer 👇

[[ 🎬 Voir la démo gratuite (sans carte) | ${DEMO_LINK} ]]

Et si vous préférez m'écrire, répondez simplement à cet email : je lis tout.

Au plaisir d'échanger,
Georges`,
  },
];
const RELANCE_MAX_ROUNDS = RELANCE_VARIANTS.length;

// ===== Segment "intéressés" : prospects qui ont déjà manifesté un intérêt =====
const INTERESSE_SUBJECTS: Record<number, string> = {
  1: "🎬 Votre démo EbookStudio est prête",
  2: "👀 Vous l'avez testé ? Voici l'offre Fondateur",
  3: "💰 67€ à vie = la V3 (197€) offerte",
  4: "🔥 Pourquoi maintenant et pas dans 3 mois",
  5: "🔒 Dernier rappel : offre Fondateur 67€",
  6: "👋 {name}, on en reste là ?",
};

function getInteresseEmailBody(step: number, firstName: string): string {
  const name = firstName || "cher lecteur";

  const bodies: Record<number, string> = {
    1: `Bonjour ${name},

Vous avez manifesté de l'intérêt pour EbookStudio Pro — alors allons droit au but.

Le plus parlant, c'est de voir l'outil travailler en direct : un sujet → un plan → des chapitres → une couverture, prêt pour Amazon KDP.

[[ 🎬 Voir la démo gratuite (sans carte) | ${DEMO_LINK} ]]

Testez, puis dites-moi ce que vous en pensez.
Georges`,

    2: `${name},

Avez-vous pris 2 minutes pour regarder la démo ?

Si oui, vous avez vu de quoi l'outil est capable : plan automatique, rédaction IA, couvertures pro, export Amazon KDP. Il est temps de passer à l'action.

L'offre Fondateur est à **67€ à vie** (ou 2×35€ / 3×25€) :

[[ 👉 Profiter de l'offre Fondateur | ${OFFRES_LINK} ]]

Georges`,

    3: `${name},

Une vraie raison d'agir maintenant :

Aujourd'hui = **67€ à vie**. La future V3 « Publication Assistée Pro » sera vendue **197€**… et elle vous sera offerte en mise à jour.

67€ aujourd'hui = un outil qui en vaudra 197€ demain.

[[ 🔒 Verrouiller mon accès à 67€ | ${OFFRES_LINK} ]]

Georges`,

    4: `${name},

Pourquoi ne pas attendre :

• Le prix Fondateur (67€) augmentera au lancement de la V3.
• Chaque semaine sans outil = des livres non publiés.
• La démo est gratuite, vous ne risquez rien à tester.

[[ 🎬 Tester gratuitement maintenant | ${DEMO_LINK} ]]

Georges`,

    5: `${name},

Dernier rappel sur l'offre Fondateur.

EbookStudio Pro à **67€ à vie** :
✅ Générateur IA illimité
✅ Couvertures pro
✅ Livre audio
✅ Marketing & KDP intégrés
✅ Mise à jour V3 (197€) incluse

[[ 👉 Rejoindre les Fondateurs | ${OFFRES_LINK} ]]

Georges`,

    6: `${name},

Je vous ai écrit plusieurs fois sans retour — c'est OK.

Une question honnête : qu'est-ce qui vous retient ? Le prix, le doute, le temps ?

Le plus simple pour trancher, c'est d'essayer sans rien payer 👇

[[ 🎬 Tester la démo gratuite | ${DEMO_LINK} ]]

Et si vous préférez m'écrire, répondez simplement à cet email : je lis tout.

Au plaisir d'échanger,
Georges`,
  };

  return bodies[step] || "";
}

function buildHtmlEmail(body: string, email?: string, step?: number, template?: string): string {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const tParam = template ? `&t=${encodeURIComponent(template)}` : "";

  // Construit un lien traçable : passe par track-email-click qui enregistre le clic puis redirige
  const trackedLink = (dest: string): string => {
    if (!email || !supabaseUrl) return dest;
    return `${supabaseUrl}/functions/v1/track-email-click?e=${encodeURIComponent(email)}&s=${step ?? ""}${tParam}&u=${encodeURIComponent(dest)}`;
  };

  // Gros bouton CTA centré (c'est lui qui fait grimper les clics)
  const bigButton = (label: string, dest: string): string =>
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto;">
      <tr><td style="border-radius:10px;background:#FF9E2D;">
        <a href="${trackedLink(dest)}" style="display:inline-block;padding:16px 34px;color:#ffffff;text-decoration:none;font-weight:bold;font-size:17px;border-radius:10px;">${label}</a>
      </td></tr>
    </table>`;

  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // 1) Boutons via syntaxe [[ label | url ]]   2) gras **...**   3) liens nus
  const htmlBody = body
    .split(/\n/)
    .map((line) => {
      const btnMatch = line.match(/^\s*\[\[\s*(.+?)\s*\|\s*(\S+)\s*\]\]\s*$/);
      if (btnMatch) return bigButton(esc(btnMatch[1]), btnMatch[2]);
      const safe = esc(line)
        .replace(/(https?:\/\/[^\s<]+)/g, (m) => `<a href="${trackedLink(m)}" style="color:#008296;">${m}</a>`)
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return safe;
    })
    .join("<br>")
    // évite les <br> superflus autour des boutons
    .replace(/<br>(<table)/g, "$1")
    .replace(/(<\/table>)<br>/g, "$1");

  const trackingPixel = email && step
    ? `<img src="${supabaseUrl}/functions/v1/track-email-open?e=${encodeURIComponent(email)}&s=${step}${tParam}" width="1" height="1" alt="" style="display:none;" />`
    : "";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAFAFA;">
<div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
  <div style="background:#008296;padding:22px 32px;">
    <span style="color:#ffffff;font-family:Arial,sans-serif;font-size:20px;font-weight:bold;">EbookStudio <span style="color:#FF9E2D;">Pro</span></span>
    <div style="color:#cdeef0;font-family:Arial,sans-serif;font-size:12px;margin-top:4px;">Votre livre, écrit par l'IA — prêt pour Amazon KDP</div>
  </div>
  <div style="padding:30px 32px 8px 32px;font-family:Arial,sans-serif;color:#232F3E;font-size:16px;line-height:1.6;">
    ${htmlBody}
  </div>
  <div style="margin:8px 32px 24px 32px;padding:14px 18px;background:#e6f4f5;border-left:4px solid #008296;border-radius:8px;font-family:Arial,sans-serif;font-size:13px;color:#1f5f63;">
    ✅ 35+ livres publiés par le créateur · 📖 Profil Amazon public · ⏱️ Un livre généré en 47 min
  </div>
  <div style="background:#FAFAFA;padding:18px 32px;border-top:1px solid #eee;font-family:Arial,sans-serif;font-size:12px;color:#888;text-align:center;">
    Vous recevez cet email car vous avez manifesté un intérêt pour EbookStudio Pro.<br>
    <a href="${trackedLink(OFFRES_LINK)}" style="color:#008296;">Voir l'offre</a> ·
    <a href="${trackedLink(DEMO_LINK)}" style="color:#008296;">Tester la démo</a><br>
    Pour ne plus recevoir ces emails, répondez "STOP" à cet email.
  </div>
</div>
${trackingPixel}
</body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    if (!Deno.env.get("RESEND_API_KEY")) {
      return new Response(JSON.stringify({ error: "Configuration email Resend manquante" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const mode = body.mode || "auto"; // "auto" = cron, "manual" = admin trigger
    const targetStep = body.step; // for manual: which step to send
    const prospectIds = body.prospect_ids; // for manual: specific prospects

    // relance = email dédié aux non-cliqueurs (ne touche pas à l'étape de séquence)
    const isRelance = mode === "relance";
    const batchSize = body.batch_size || (isRelance ? 200 : 50);

    // ===== SÉCURITÉ : empêcher tout déclenchement non autorisé d'une campagne =====
    if (mode === "auto") {
      // Le cron doit fournir le secret partagé (stocké côté serveur uniquement)
      const provided = req.headers.get("x-cron-secret");
      const { data: secretRow } = await supabase
        .from("app_secrets").select("value").eq("key", "cron_secret").maybeSingle();
      const cronSecret = secretRow?.value;
      if (!cronSecret || provided !== cronSecret) {
        return new Response(JSON.stringify({ error: "Non autorisé" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      // manual / relance : réservé aux administrateurs authentifiés
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Non authentifié" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const authClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: authData } = await authClient.auth.getUser();
      if (!authData?.user) {
        return new Response(JSON.stringify({ error: "Non authentifié" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: isAdmin } = await authClient.rpc("has_role", { _user_id: authData.user.id, _role: "admin" });
      if (isAdmin !== true) {
        return new Response(JSON.stringify({ error: "Accès réservé aux administrateurs" }), {
          status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ===== MODE VERIFY_DELIVERY : interroge Resend pour confirmer la livraison =====
    // Récupère les derniers envois enregistrés (avec message_id) et lit leur statut réel
    // via l'API Resend GET /emails/{id}, puis met à jour email_send_log.
    if (mode === "verify_delivery") {
      const resendKey = Deno.env.get("RESEND_API_KEY");
      if (!resendKey) {
        return new Response(JSON.stringify({ error: "RESEND_API_KEY manquante" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const limit = Math.min(body.limit || 60, 150);
      const { data: rows } = await supabase
        .from("email_send_log")
        .select("id, message_id, recipient_email, template_name, status")
        .not("message_id", "is", null)
        .order("created_at", { ascending: false })
        .limit(limit);

      let checked = 0;
      let delivered = 0;
      const counts: Record<string, number> = {};
      for (let i = 0; i < (rows?.length || 0); i++) {
        const row = rows![i];
        if (i > 0) await new Promise((r) => setTimeout(r, 120));
        try {
          const res = await fetch(`${RESEND_API_URL}/${row.message_id}`, {
            headers: { "Authorization": `Bearer ${resendKey}` },
          });
          if (!res.ok) { const t = await res.text(); console.error(`Resend GET ${res.status}: ${t}`); counts[`http_${res.status}`] = (counts[`http_${res.status}`] || 0) + 1; continue; }
          const j = await res.json().catch(() => ({}));
          const ev = (j?.last_event || j?.status || "unknown") as string;
          counts[ev] = (counts[ev] || 0) + 1;
          if (ev === "delivered") delivered++;
          checked++;
          await supabase.from("email_send_log").update({
            last_event: ev,
            status: ev === "delivered" ? "delivered"
              : (ev === "bounced" || ev === "failed") ? "error"
              : row.status,
          }).eq("id", row.id);
        } catch (e) {
          console.error("verify_delivery error:", e);
        }
      }

      return new Response(
        JSON.stringify({ success: true, checked, delivered, breakdown: counts }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ===== MODE TEST : envoie les 15 templates à une adresse de test =====
    if (mode === "test") {
      const testEmail = (body.test_email || "").trim();
      if (!testEmail || !testEmail.includes("@")) {
        return new Response(JSON.stringify({ error: "test_email invalide" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const testName = body.test_name || "Test";
      const results: { template: string; subject: string; ok: boolean; detail?: string }[] = [];

      const runTest = async (template: string, step: number, subject: string, htmlBody: string) => {
        const html = buildHtmlEmail(htmlBody, testEmail, step, template);
        const subj = `[TEST] ${subject.replace(/\{name\}/g, testName)}`;
        const r = await sendResendEmail(testEmail, testName, subj, html);
        await logSend(supabase, testEmail, template, r);
        results.push({ template, subject: subj, ok: r.ok, detail: r.detail });
        await new Promise((res) => setTimeout(res, 400));
      };

      // 6 templates séquence standard
      for (let s = 1; s <= 6; s++) {
        await runTest(`standard-${s}`, s, EMAIL_SEQUENCE[s - 1].subject, getEmailBody(s, testName));
      }
      // 6 templates séquence intéressés
      for (let s = 1; s <= 6; s++) {
        await runTest(`interesse-${s}`, s, INTERESSE_SUBJECTS[s] || EMAIL_SEQUENCE[s - 1].subject, getInteresseEmailBody(s, testName));
      }
      // 3 relances tournantes
      for (let r = 0; r < RELANCE_VARIANTS.length; r++) {
        await runTest(`relance-${r + 1}`, 7 + r, RELANCE_VARIANTS[r].subject, RELANCE_VARIANTS[r].body(testName));
      }

      const okCount = results.filter((r) => r.ok).length;
      return new Response(
        JSON.stringify({ success: okCount === results.length, total: results.length, ok: okCount, failed: results.length - okCount, results }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }


    let query = supabase
      .from("sales_prospects")
      .select("*")
      .eq("status", "active")
      .eq("unsubscribed", false);

    // La relance vise aussi les prospects ayant terminé la séquence (sans avoir cliqué).
    if (!isRelance) {
      query = query.eq("completed", false);
    }

    // Anti-doublon par variante : on relance tant que les 3 variantes ne sont pas épuisées
    // (relance_round < RELANCE_MAX_ROUNDS), sauf si l'appel force explicitement (body.force === true).
    if (isRelance && !body.force) {
      query = query.lt("relance_round", RELANCE_MAX_ROUNDS);
    }

    if ((mode === "manual" || isRelance) && prospectIds?.length) {
      query = query.in("id", prospectIds);
    } else if (mode === "auto") {
      query = query.eq("auto_send", true).lte("next_email_at", new Date().toISOString());
    }

    query = query.order("next_email_at", { ascending: true }).limit(batchSize);

    const { data: prospects, error: fetchErr } = await query;
    if (fetchErr) throw fetchErr;

    // En mode auto on continue même sans prospect de séquence : la passe relance s'exécute ensuite.
    if ((!prospects || prospects.length === 0) && mode !== "auto") {
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: "Aucun prospect à traiter" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let sent = 0;
    let errors = 0;
    let quotaHit = false;

    for (let i = 0; i < (prospects?.length || 0); i++) {
      const prospect = prospects![i];

      // Rate limit doux pour rester sous les limites de l'API
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 400));
      }

      // ===== Mode RELANCE : 3 variantes tournantes, n'incrémente pas l'étape =====
      if (isRelance) {
        const round = Math.min(prospect.relance_round ?? 0, RELANCE_MAX_ROUNDS - 1);
        const variant = RELANCE_VARIANTS[round];
        const relanceStep = 7 + round; // distingue chaque relance dans le tracking des clics
        const relanceTemplate = `relance-${round + 1}`;
        const htmlContent = buildHtmlEmail(
          variant.body(prospect.first_name),
          prospect.email,
          relanceStep,
          relanceTemplate,
        );
        const subject = variant.subject.replace(/\{name\}/g, prospect.first_name || "vous");
        const result = await sendResendEmail(prospect.email, prospect.first_name, subject, htmlContent);
        await logSend(supabase, prospect.email, relanceTemplate, result);
        if (!result.ok) {
          console.error(`Resend relance error for ${prospect.email}:`, result.detail);
          await supabase.from("sales_prospects").update({
            relance_status: "error",
          }).eq("id", prospect.id);
          errors++;
          continue;
        }
        const nowIso = new Date().toISOString();
        await supabase.from("sales_prospects").update({
          last_email_sent_at: nowIso,
          relance_sent_at: nowIso,
          relance_status: "sent",
          relance_round: round + 1,
        }).eq("id", prospect.id);
        sent++;
        continue;
      }

      const stepToSend = mode === "manual" && targetStep
        ? targetStep
        : prospect.current_step + 1;

      if (stepToSend > 6) {
        await supabase.from("sales_prospects").update({ completed: true }).eq("id", prospect.id);
        continue;
      }

      // Étape 6 = relance UNIQUEMENT pour ceux qui n'ont jamais cliqué.
      // Ceux qui ont cliqué sont des leads chauds : on clôture la séquence sans les relancer.
      if (stepToSend === 6) {
        const { count: clickCount } = await supabase
          .from("email_clicks")
          .select("id", { count: "exact", head: true })
          .ilike("prospect_email", prospect.email);
        if ((clickCount || 0) > 0) {
          await supabase.from("sales_prospects").update({
            completed: true,
            next_email_at: null,
          }).eq("id", prospect.id);
          continue;
        }
      }

      const seqInfo = EMAIL_SEQUENCE[stepToSend - 1];
      const isInteresse = prospect.source === "interesses";
      const templateName = `${isInteresse ? "interesse" : "standard"}-${stepToSend}`;
      const emailBody = isInteresse
        ? getInteresseEmailBody(stepToSend, prospect.first_name)
        : getEmailBody(stepToSend, prospect.first_name);
      const htmlContent = buildHtmlEmail(emailBody, prospect.email, stepToSend, templateName);
      const rawSubject = isInteresse
        ? (INTERESSE_SUBJECTS[stepToSend] || seqInfo.subject)
        : seqInfo.subject;
      const subject = rawSubject.replace(/\{name\}/g, prospect.first_name || "vous");

      const result = await sendResendEmail(prospect.email, prospect.first_name, subject, htmlContent);
      await logSend(supabase, prospect.email, templateName, result);
      if (!result.ok) {
        console.error(`Resend error for ${prospect.email}:`, result.detail);
        errors++;
        continue;
      }

      // Calculate next email time
      const nextStep = stepToSend + 1;
      const nextSeq = EMAIL_SEQUENCE[nextStep - 1];
      const daysBetween = nextSeq
        ? nextSeq.day_offset - seqInfo.day_offset
        : 0;

      const nextAt = new Date();
      nextAt.setDate(nextAt.getDate() + daysBetween);

      await supabase.from("sales_prospects").update({
        current_step: stepToSend,
        last_email_sent_at: new Date().toISOString(),
        next_email_at: nextSeq ? nextAt.toISOString() : null,
        completed: stepToSend >= 6,
      }).eq("id", prospect.id);

      sent++;
      if (isQuotaExhausted()) { console.warn("[sales-email] Resend daily quota atteint, arrêt de la séquence"); quotaHit = true; break; }
    }

    // ===== Passe RELANCE AUTOMATIQUE (cron) =====
    // Prospects ayant terminé la séquence, non-cliqueurs, non-clients,
    // avec encore des relances disponibles, espacées d'au moins 3 jours.
    let relanceAutoSent = 0;
    if (mode === "auto") {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
      const { data: relanceTargets } = await supabase
        .from("sales_prospects")
        .select("*")
        .eq("status", "active")
        .eq("unsubscribed", false)
        .gte("current_step", 5)
        .lt("relance_round", RELANCE_MAX_ROUNDS)
        .or(`relance_sent_at.is.null,relance_sent_at.lte.${threeDaysAgo}`)
        .order("relance_sent_at", { ascending: true, nullsFirst: true })
        .limit(batchSize);

      for (let i = 0; i < (relanceTargets?.length || 0); i++) {
        const prospect = relanceTargets![i];
        if (i > 0) await new Promise((r) => setTimeout(r, 400));

        // Stop si le prospect a déjà cliqué (lead chaud) → on ne le relance plus
        const { count: clickCount } = await supabase
          .from("email_clicks")
          .select("id", { count: "exact", head: true })
          .ilike("prospect_email", prospect.email);
        if ((clickCount || 0) > 0) {
          await supabase.from("sales_prospects")
            .update({ relance_round: RELANCE_MAX_ROUNDS })
            .eq("id", prospect.id);
          continue;
        }

        const round = Math.min(prospect.relance_round ?? 0, RELANCE_MAX_ROUNDS - 1);
        const variant = RELANCE_VARIANTS[round];
        const relanceStep = 7 + round;
        const relanceTemplate = `relance-${round + 1}`;
        const htmlContent = buildHtmlEmail(variant.body(prospect.first_name), prospect.email, relanceStep, relanceTemplate);
        const subject = variant.subject.replace(/\{name\}/g, prospect.first_name || "vous");
        const result = await sendResendEmail(prospect.email, prospect.first_name, subject, htmlContent);
        await logSend(supabase, prospect.email, relanceTemplate, result);
        if (!result.ok) {
          // Quota Resend atteint (429) : inutile de continuer, on s'arrête net pour
          // ne pas marquer en "error" tous les prospects restants (ils seront repris
          // au prochain passage du cron une fois le quota réinitialisé).
          const isQuota = /\b429\b|quota|rate.?limit/i.test(result.detail || "");
          if (isQuota) {
            console.error(`Resend quota atteint, arrêt de la relance auto (${prospect.email}):`, result.detail);
            quotaHit = true;
            break;
          }
          console.error(`Resend relance auto error for ${prospect.email}:`, result.detail);
          await supabase.from("sales_prospects").update({ relance_status: "error" }).eq("id", prospect.id);
          errors++;
          continue;
        }
        const nowIso = new Date().toISOString();
        await supabase.from("sales_prospects").update({
          last_email_sent_at: nowIso,
          relance_sent_at: nowIso,
          relance_status: "sent",
          relance_round: round + 1,
        }).eq("id", prospect.id);
        relanceAutoSent++;
        if (isQuotaExhausted()) { console.warn("[sales-email] Resend daily quota atteint pendant la relance auto, arrêt"); quotaHit = true; break; }
      }
    }

    return new Response(
      JSON.stringify({ success: true, sent: sent + relanceAutoSent, relanceAutoSent, errors, quotaHit, total: prospects?.length || 0, batchSize }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Sales email error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
