import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOGIN_URL = "https://ebookstudio.fr/subscription";
const BONUS_PDF_URL = "https://ebookstudio.fr/lead-magnets/5-niches-rentables-2026.pdf";

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

function generateAccessCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "EBK-";
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}

// --- Email d'accès + bonus PDF (best-effort) ---
async function sendAccessEmail(email: string, firstName: string, accessCode: string, trialEndsAt: string) {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) {
    console.warn("RESEND_API_KEY missing — skipping email");
    return false;
  }
  const greeting = firstName ? `Bonjour ${firstName},` : "Bonjour,";
  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#232F3E;background:#FAFAFA;padding:28px;border-radius:12px">
    <h1 style="color:#008296;margin:0 0 12px">🎉 Votre accès gratuit à EbookStudio Pro</h1>
    <p>${greeting}</p>
    <p>Votre essai gratuit de <strong>7 jours</strong> est activé. Voici votre accès :</p>
    <div style="background:#fff;border:2px solid #008296;border-radius:12px;padding:18px;text-align:center;margin:18px 0">
      <p style="margin:0 0 6px;color:#666;font-size:13px">Votre code d'accès :</p>
      <p style="font-size:26px;font-weight:bold;font-family:monospace;color:#008296;margin:0">${accessCode}</p>
      <p style="margin:8px 0 0;color:#666;font-size:13px">Email : ${email}</p>
    </div>
    <p style="text-align:center;margin:22px 0">
      <a href="${LOGIN_URL}" style="background:#FF9E2D;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">
        🚀 Accéder au logiciel
      </a>
    </p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:22px 0"/>
    <h2 style="color:#008296;font-size:18px;margin:0 0 8px">🎁 Votre bonus offert</h2>
    <p>Comme promis, voici votre guide gratuit : <strong>Les 5 niches d'eBooks rentables 2026</strong>.</p>
    <p style="text-align:center;margin:16px 0">
      <a href="${BONUS_PDF_URL}" style="background:#008296;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">
        📥 Télécharger le guide PDF
      </a>
    </p>
    <p style="color:#999;font-size:12px;text-align:center;margin-top:18px">
      Votre essai expire le ${new Date(trialEndsAt).toLocaleDateString("fr-FR")}. Pour continuer, l'accès à vie est à 67€ (paiement unique).
    </p>
  </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "EbookStudio <contact@ebookstudio.fr>",
      to: [email],
      subject: "🎉 Votre accès gratuit EbookStudio Pro + votre guide offert",
      html,
    }),
  });
  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return false;
  }
  return true;
}

// --- Ajout du contact dans Brevo (best-effort) ---
async function addToBrevo(email: string, firstName: string) {
  const brevoKey = Deno.env.get("BREVO_API_KEY");
  if (!brevoKey) {
    console.warn("BREVO_API_KEY missing — skipping Brevo sync");
    return false;
  }
  const listIdRaw = Deno.env.get("BREVO_TRIAL_LIST_ID");
  const listId = listIdRaw ? parseInt(listIdRaw, 10) : NaN;
  try {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: { "api-key": brevoKey, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        email,
        attributes: firstName ? { PRENOM: firstName, FIRSTNAME: firstName } : {},
        updateEnabled: true,
        ...(Number.isFinite(listId) ? { listIds: [listId] } : {}),
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      // 400 "Contact already exist" est acceptable
      console.warn("Brevo add contact non-OK:", res.status, body);
      return res.status === 400 && body.includes("already");
    }
    return true;
  } catch (e) {
    console.error("Brevo sync failed:", (e as Error).message);
    return false;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const firstName = String(body.first_name || "").trim().slice(0, 80);
    const honeypot = String(body.website || "").trim();

    if (honeypot) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ ok: false, error: "Email invalide" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 1) Créer / réactiver l'essai
    const { data: existing } = await supabase
      .from("subscribers")
      .select("*")
      .ilike("email", email)
      .maybeSingle();

    let accessCode: string;
    let trialEndsAt: string;
    let alreadyActive = false;

    if (existing) {
      accessCode = existing.access_code || generateAccessCode();
      if (existing.status === "active" || existing.status === "trialing") {
        alreadyActive = true;
        trialEndsAt = existing.trial_ends_at || new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
      } else {
        // Un seul essai gratuit autorisé par email : ne pas réactiver un essai déjà utilisé
        return new Response(
          JSON.stringify({
            ok: false,
            alreadyUsed: true,
            error: "Vous avez déjà utilisé votre essai gratuit. Pour continuer, passez à l'accès à vie (67€, paiement unique).",
          }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

    } else {
      accessCode = generateAccessCode();
      trialEndsAt = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
      const { error: insErr } = await supabase.from("subscribers").insert({
        email,
        access_code: accessCode,
        status: "trialing",
        plan_type: "pro",
        plan_tier: "standard",
        trial_ends_at: trialEndsAt,
      });
      if (insErr) throw insErr;
    }

    // 2) Enregistrer le lead (pour le tableau de bord / relances)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    try {
      const leadRow = {
        first_name: firstName || null,
        lead_magnet: "essai-gratuit",
        utm_source: body.utm_source || null,
        utm_medium: body.utm_medium || null,
        utm_campaign: body.utm_campaign || null,
        landing_url: body.landing_url || null,
        user_agent: req.headers.get("user-agent") || null,
        ip,
      };
      const { data: existingLead } = await supabase
        .from("funnel_leads")
        .select("id")
        .ilike("email", email)
        .maybeSingle();
      if (existingLead?.id) {
        await supabase.from("funnel_leads").update(leadRow).eq("id", existingLead.id);
      } else {
        await supabase.from("funnel_leads").insert({ email, ...leadRow });
      }
    } catch (e) {
      console.warn("funnel_leads record skipped:", (e as Error).message);
    }


    // 3) Email d'accès + bonus PDF
    await sendAccessEmail(email, firstName, accessCode, trialEndsAt);

    // 4) Synchronisation Brevo
    await addToBrevo(email, firstName);

    // 5) Enrôlement dans la séquence d'onboarding automatique (8 emails)
    try {
      const { data: existingSeq } = await supabase
        .from("email_sequences")
        .select("id")
        .ilike("email", email)
        .eq("sequence_name", "onboarding")
        .maybeSingle();
      if (!existingSeq) {
        await supabase.from("email_sequences").insert({
          email,
          sequence_name: "onboarding",
          current_step: 0,
          subscribed_at: new Date().toISOString(),
          next_email_at: new Date().toISOString(), // 1er email dès le prochain passage du cron
        });
      }
    } catch (e) {
      console.warn("onboarding enroll skipped:", (e as Error).message);
    }


    return new Response(
      JSON.stringify({ ok: true, email, alreadyActive, access_code: accessCode, trial_ends_at: trialEndsAt, bonus_pdf_url: BONUS_PDF_URL }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("trial-signup error:", e);
    return new Response(JSON.stringify({ ok: false, error: (e as Error).message || "Erreur serveur" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
