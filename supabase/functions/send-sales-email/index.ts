import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Email subjects and strategies for the 5-step sequence
const EMAIL_SEQUENCE = [
  {
    step: 1,
    day_offset: 0,
    subject: "📖 J'ai généré 150 pages en 47 minutes... voici comment",
    preheader: "Le secret des auteurs qui publient un livre par semaine sur Amazon",
  },
  {
    step: 2,
    day_offset: 2,
    subject: "⚠️ Les 3 erreurs qui tuent 90% des auteurs KDP",
    preheader: "Erreur #2 est celle que TOUT LE MONDE fait...",
  },
  {
    step: 3,
    day_offset: 4,
    subject: "💰 De 0 à 35 livres Amazon — Mon parcours transparent",
    preheader: "Chiffres réels, résultats réels, outil réel.",
  },
  {
    step: 4,
    day_offset: 6,
    subject: "⏰ [Dernière chance] L'offre Fondateur disparaît dans 48h",
    preheader: "Après ça, le prix passe à 147€. Point final.",
  },
  {
    step: 5,
    day_offset: 7,
    subject: "🔒 C'est terminé ce soir à minuit",
    preheader: "Votre dernière chance de rejoindre les fondateurs.",
  },
];

const DEMO_LINK = "https://video-lexicon-translator-08.lovable.app/demo";
const OFFRES_LINK = "https://video-lexicon-translator-08.lovable.app/offres";

function getEmailBody(step: number, firstName: string): string {
  const name = firstName || "cher lecteur";
  
  const bodies: Record<number, string> = {
    1: `Bonjour ${name},

Je vais être direct avec vous.

La semaine dernière, j'ai publié mon 36ème livre sur Amazon.
Pas en 3 mois. Pas en 3 semaines.

En 47 minutes.

150 pages. Structurées. Illustrées. Prêtes pour KDP.

Ce qui a changé ? J'ai construit un outil. Un vrai générateur d'ebooks propulsé par l'IA la plus avancée du marché.

🔥 EbookStudio Pro 2026 — L'usine à ebooks que j'utilise personnellement :

→ 300+ idées de titres par niche rentable
→ Plan complet généré en 30 secondes
→ Chapitres rédigés avec votre ton et votre style
→ Couvertures professionnelles en 1 clic
→ Export direct PDF/EPUB prêt pour Amazon KDP
→ Coût par ebook : environ 0,30€

👉 Testez gratuitement la démo : ${DEMO_LINK}

Pas de carte bancaire, pas d'engagement.

L'offre Fondateur à 67€ ne durera pas éternellement.

À vous de jouer,
Georges

P.S: Mon profil Amazon avec mes 35+ livres publiés : https://www.amazon.fr/Mr-Georges-Boubet/e/B0CGVLHNX7`,

    2: `${name},

Savez-vous pourquoi 90% des gens qui veulent publier sur Amazon... n'y arrivent jamais ?

❌ ERREUR #1 : Écrire sans plan — abandon garanti à la page 12.
❌ ERREUR #2 : Passer 3 semaines sur un seul livre — pendant que d'autres en publient 5.
❌ ERREUR #3 : Négliger la couverture et les mots-clés — 0 vente.

EbookStudio Pro résout ces 3 problèmes en même temps :
✅ Plan structuré automatiquement
✅ Génération en 47 min
✅ Couvertures pro + optimisation KDP intégrée

Le tout pour ~0,30€ par livre.

📊 Le calcul : 1 ebook/semaine × 52 = 52 livres/an, pour ~15€ de production.

👉 Découvrir EbookStudio Pro : ${OFFRES_LINK}

L'offre Fondateur à 67€ (au lieu de 147€) est disponible jusqu'au 1er juillet.

Georges

P.S: Testez d'abord gratuitement : ${DEMO_LINK}`,

    3: `${name},

Aujourd'hui, pas de pitch. Juste des faits.

📊 Mon parcours Amazon KDP :
• 2023 : 0 livre publié
• 2024 : 18 livres (méthode manuelle)
• 2025-2026 : 35+ livres (avec EbookStudio)

EbookStudio Pro 2026 inclut :
📝 Générateur IA (Gemini 3 Flash)
🎨 Créateur de couvertures pro
🔊 Convertisseur en livre audio
📊 Dashboard marketing complet
📧 Système email marketing inclus

Le tout à 67€ (paiement unique).
Ou en facilités : 2×35€ ou 3×25€.

👉 Accéder à l'offre Fondateur : ${OFFRES_LINK}

Mes livres sont sur Amazon, mon nom est public, mes résultats sont transparents.

Cordialement,
Georges Boubet
https://www.amazon.fr/Mr-Georges-Boubet/e/B0CGVLHNX7`,

    4: `${name},

L'offre Fondateur EbookStudio Pro à 67€ se termine dans 48 heures.

Après ? Le prix passe à 147€.

🧮 Ce que vous obtenez (valeur 749€) :
- Générateur IA illimité (197€)
- Créateur de couvertures (67€)
- Convertisseur livre audio (147€)
- Dashboard marketing (67€)
- Outils réseaux sociaux (47€)
- Templates email (67€)
- Optimisateur KDP (67€)

Votre prix aujourd'hui : 67€ (-66%)
💳 Ou 2×35€ / 3×25€

🎁 BONUS inclus : Pack 300+ idées, Guide 10 Niches KDP 2026, Groupe privé, MAJ à vie, Support Zoom.

⚡ Coût par ebook : ~0,30€. Rentabilisé dès le 1er livre vendu.

👉 J'accède à l'offre Fondateur : ${OFFRES_LINK}

Georges

P.S: Je ne relancerai pas après cet email.`,

    5: `${name},

Dernier email. Dernier appel.

Ce soir à minuit, l'offre Fondateur à 67€ se ferme définitivement.

Où serez-vous dans 90 jours ?

📍 Scénario A : Toujours cette idée de livre dans un coin de votre tête.
📍 Scénario B : 10, 15, 20 ebooks sur Amazon. Vos premiers revenus passifs tombent.

La seule différence ? Un clic. Aujourd'hui.

👉 Rejoindre les Fondateurs : ${OFFRES_LINK}

Merci d'avoir lu mes emails cette semaine, ${name}.

Si une petite voix vous dit "et si ça marchait pour moi ?"...
Écoutez-la. Juste cette fois.

À bientôt de l'autre côté,
Georges

---
📖 35+ livres publiés sur Amazon
🛠️ Créateur d'EbookStudio Pro
🔗 amazon.fr/Mr-Georges-Boubet/e/B0CGVLHNX7`,
  };

  return bodies[step] || "";
}

function buildHtmlEmail(body: string, email?: string, step?: number): string {
  const htmlBody = body
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>")
    .replace(/→/g, "→")
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#D4A017;">$1</a>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
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
<a href="${OFFRES_LINK}" style="color:#D4A017;">Voir l'offre</a> · <a href="${DEMO_LINK}" style="color:#D4A017;">Tester la démo</a><br>
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
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const supabase = createClient(supabaseUrl, serviceKey);

    if (!resendKey) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY manquante" }), {
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
      
      // Rate limit: max 2 emails/sec per Resend, use 600ms spacing
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      const stepToSend = mode === "manual" && targetStep
        ? targetStep
        : prospect.current_step + 1;

      if (stepToSend > 5) {
        await supabase.from("sales_prospects").update({ completed: true }).eq("id", prospect.id);
        continue;
      }

      const seqInfo = EMAIL_SEQUENCE[stepToSend - 1];
      const emailBody = getEmailBody(stepToSend, prospect.first_name);
      const htmlContent = buildHtmlEmail(emailBody, prospect.email, stepToSend);

      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Georges Boubet <noreply@ebookstudio.fr>",
            to: [prospect.email],
            subject: seqInfo.subject,
            html: htmlContent,
          }),
        });

        if (!res.ok) {
          const errData = await res.text();
          console.error(`Resend error for ${prospect.email}:`, errData);
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
          completed: stepToSend >= 5,
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
