import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

Il y a 18 mois, j'avais une idée de livre... et la page blanche me bloquait à chaque fois.

Le problème n'était pas moi. C'était la méthode.

Alors j'ai construit un outil qui gère tout : idée → plan → rédaction → illustrations → couverture → export Amazon KDP.

Résultat : mon dernier livre, 150 pages, généré en 47 minutes.

Aujourd'hui c'est EbookStudio Pro, et il est accessible à **67€ à vie** (paiement unique).

👉 Découvrir l'outil : ${OFFRES_LINK}
👉 Tester la démo gratuitement : ${DEMO_LINK}

À demain pour la suite,
Georges`,

    2: `${name},

Pourquoi 90% des gens qui veulent publier sur Amazon n'y arrivent jamais ?

❌ Écrire sans plan → abandon à la page 12
❌ Passer 3 semaines sur un seul livre
❌ Négliger couverture et mots-clés → 0 vente

EbookStudio Pro règle les 3 d'un coup : plan automatique, génération en 47 min, couvertures pro + optimisation KDP.

Coût : ~0,30€ par livre.

👉 Voir l'outil : ${OFFRES_LINK}

Georges`,

    3: `${name},

Pas de pitch aujourd'hui, juste mes vrais chiffres :

• 2023 : 0 livre publié
• 2024 : 18 livres (à la main)
• 2025-2026 : 35+ livres (avec EbookStudio)

Mon profil Amazon est public : https://www.amazon.fr/Mr-Georges-Boubet/e/B0CGVLHNX7

L'outil complet (générateur IA, couvertures, livre audio, marketing) est à **67€ à vie**.

👉 Accéder à l'offre : ${OFFRES_LINK}

Georges`,

    4: `${name},

Une raison de ne pas attendre :

Aujourd'hui, EbookStudio Pro est à **67€ à vie**. Bientôt arrive la V3 "Publication Assistée Pro", qui sera vendue 197€.

🎁 Et les membres actuels recevront la V3 en **mise à jour gratuite**.

Autrement dit : 67€ aujourd'hui = l'accès à un outil qui en vaudra 197€ demain.

👉 Verrouiller mon accès : ${OFFRES_LINK}

Georges`,

    5: `${name},

Dernier rappel, je ne reviendrai pas dessus.

EbookStudio Pro, c'est :
✅ Générateur IA illimité
✅ Couvertures pro
✅ Livre audio
✅ Marketing & KDP intégrés
✅ Mise à jour V3 incluse

Le tout à **67€ à vie** (ou 2×35€ / 3×25€).

👉 Rejoindre : ${OFFRES_LINK}

Merci de m'avoir lu cette semaine,
Georges`,

    6: `${name},

Je vous ai écrit plusieurs fois et je n'ai pas eu de retour — c'est tout à fait OK.

Avant de vous laisser tranquille, juste une question honnête : qu'est-ce qui vous retient ?

Le prix ? Le doute que ça marche pour vous ? Pas le temps ?

Répondez-moi simplement à cet email, je lis tout personnellement. Et si vous préférez juste tester sans rien payer :

👉 La démo gratuite est ici : ${DEMO_LINK}
👉 Et l'offre à 67€ à vie reste là : ${OFFRES_LINK}

Au plaisir d'échanger,
Georges`,
  };

  return bodies[step] || "";
}

// ===== Segment "intéressés" : prospects qui ont déjà manifesté un intérêt =====
// Version plus directe, orientée DÉMO + OFFRE (moins de pédagogie, plus d'action)
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

Le plus simple, c'est de voir l'outil en action :

👉 Démo gratuite (idée → livre Amazon en quelques clics) : ${DEMO_LINK}

Et si vous voulez déjà l'offre complète :
👉 ${OFFRES_LINK} — **67€ à vie** (paiement unique).

Testez, puis dites-moi ce que vous en pensez.
Georges`,

    2: `${name},

Avez-vous pris 2 minutes pour regarder la démo ? 👉 ${DEMO_LINK}

Si oui, vous avez vu de quoi l'outil est capable : plan automatique, rédaction IA, couvertures pro, export Amazon KDP.

L'offre Fondateur est à **67€ à vie** (ou 2×35€ / 3×25€) :
👉 ${OFFRES_LINK}

Georges`,

    3: `${name},

Une vraie raison d'agir maintenant :

Aujourd'hui = **67€ à vie**. La future V3 "Publication Assistée Pro" sera vendue 197€… et elle vous sera offerte en mise à jour.

67€ aujourd'hui = un outil qui en vaudra 197€ demain.

👉 Verrouiller mon accès : ${OFFRES_LINK}
👉 Revoir la démo : ${DEMO_LINK}

Georges`,

    4: `${name},

Pourquoi ne pas attendre :

• Le prix Fondateur (67€) augmentera au lancement de la V3.
• Chaque semaine sans outil = des livres non publiés.
• La démo est gratuite, vous ne risquez rien à tester.

👉 Tester : ${DEMO_LINK}
👉 Rejoindre à 67€ : ${OFFRES_LINK}

Georges`,

    5: `${name},

Dernier rappel sur l'offre Fondateur.

EbookStudio Pro à **67€ à vie** :
✅ Générateur IA illimité
✅ Couvertures pro
✅ Livre audio
✅ Marketing & KDP intégrés
✅ Mise à jour V3 incluse

👉 Rejoindre : ${OFFRES_LINK}
👉 Ou tester d'abord : ${DEMO_LINK}

Georges`,

    6: `${name},

Je vous ai écrit plusieurs fois sans retour — c'est OK.

Une question honnête : qu'est-ce qui vous retient ? Le prix, le doute, le temps ?

Répondez-moi simplement, je lis tout. Et la démo reste gratuite :
👉 ${DEMO_LINK}
👉 L'offre 67€ à vie : ${OFFRES_LINK}

Au plaisir d'échanger,
Georges`,
  };

  return bodies[step] || "";
}

function buildHtmlEmail(body: string, email?: string, step?: number): string {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";

  // Construit un lien traçable : passe par track-email-click qui enregistre le clic puis redirige
  const trackedLink = (dest: string): string => {
    if (!email || !supabaseUrl) return dest;
    return `${supabaseUrl}/functions/v1/track-email-click?e=${encodeURIComponent(email)}&s=${step ?? ""}&u=${encodeURIComponent(dest)}`;
  };

  const htmlBody = body
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>")
    .replace(/→/g, "→")
    .replace(/(https?:\/\/[^\s<]+)/g, (m) => `<a href="${trackedLink(m)}" style="color:#D4A017;">${m}</a>`)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  const trackingPixel = email && step
    ? `<img src="${supabaseUrl}/functions/v1/track-email-open?e=${encodeURIComponent(email)}&s=${step}" width="1" height="1" alt="" style="display:none;" />`
    : "";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#ffffff;color:#1a1a1a;padding:32px;max-width:600px;margin:0 auto;">
<div style="border-top:3px solid #D4A017;padding-top:20px;">
${htmlBody}
</div>
<hr style="border-color:#D4A017;margin-top:32px;">
<p style="font-size:12px;color:#888;">
Vous recevez cet email car vous avez manifesté un intérêt pour EbookStudio Pro.<br>
<a href="${trackedLink(OFFRES_LINK)}" style="color:#D4A017;">Voir l'offre</a> · <a href="${trackedLink(DEMO_LINK)}" style="color:#D4A017;">Tester la démo</a><br>
Pour ne plus recevoir ces emails, répondez "STOP" à cet email.
</p>
${trackingPixel}
</body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const brevoKey = Deno.env.get("BREVO_API_KEY");
    const supabase = createClient(supabaseUrl, serviceKey);

    if (!brevoKey) {
      return new Response(JSON.stringify({ error: "BREVO_API_KEY manquante" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const mode = body.mode || "auto"; // "auto" = cron, "manual" = admin trigger
    const targetStep = body.step; // for manual: which step to send
    const prospectIds = body.prospect_ids; // for manual: specific prospects

    const batchSize = body.batch_size || 50; // Increased batch for faster processing

    let query = supabase
      .from("sales_prospects")
      .select("*")
      .eq("status", "active")
      .eq("unsubscribed", false)
      .eq("completed", false);

    if (mode === "manual" && prospectIds?.length) {
      query = query.in("id", prospectIds);
    } else if (mode === "auto") {
      query = query.eq("auto_send", true).lte("next_email_at", new Date().toISOString());
    }

    query = query.order("next_email_at", { ascending: true }).limit(batchSize);

    const { data: prospects, error: fetchErr } = await query;
    if (fetchErr) throw fetchErr;

    if (!prospects || prospects.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: "Aucun prospect à traiter" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let sent = 0;
    let errors = 0;

    for (let i = 0; i < prospects.length; i++) {
      const prospect = prospects[i];
      
      // Rate limit doux pour rester sous les limites Brevo
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 400));
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
      const emailBody = getEmailBody(stepToSend, prospect.first_name);
      const htmlContent = buildHtmlEmail(emailBody, prospect.email, stepToSend);
      const subject = seqInfo.subject.replace(/\{name\}/g, prospect.first_name || "vous");

      try {
        const res = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "api-key": brevoKey,
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            sender: { name: "Georges Boubet", email: "noreply@ebookstudio.fr" },
            to: [{ email: prospect.email, name: prospect.first_name || undefined }],
            subject,
            htmlContent,
            tags: [`sales-step-${stepToSend}`],
          }),
        });

        if (!res.ok) {
          const errData = await res.text();
          console.error(`Brevo error for ${prospect.email}:`, errData);
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
      } catch (sendErr) {
        console.error(`Send error for ${prospect.email}:`, sendErr);
        errors++;
      }
    }

    return new Response(
      JSON.stringify({ success: true, sent, errors, total: prospects.length, batchSize }),
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
