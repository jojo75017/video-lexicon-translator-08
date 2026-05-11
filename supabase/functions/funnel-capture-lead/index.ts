import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LEAD_MAGNET_URL =
  "https://ebookstudio.fr/lead-magnets/5-niches-rentables-ebooks-2026.pdf";

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

async function sendLeadMagnetEmail(email: string, firstName: string) {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY missing — skipping email");
    return false;
  }
  const greeting = firstName ? `Bonjour ${firstName},` : "Bonjour,";
  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#232F3E;background:#FAFAFA;padding:24px;border-radius:12px">
    <h1 style="color:#008296;margin:0 0 12px">📘 Vos 5 niches rentables 2026</h1>
    <p>${greeting}</p>
    <p>Merci pour votre inscription ! Voici votre guide gratuit, compilé à partir des données Amazon les plus récentes :</p>
    <p style="text-align:center;margin:24px 0">
      <a href="${LEAD_MAGNET_URL}" style="background:#FF9E2D;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">
        📥 Télécharger le PDF
      </a>
    </p>
    <p>À l'intérieur :</p>
    <ul>
      <li>5 niches non saturées avec demande forte</li>
      <li>Mots-clés Amazon à fort volume pour chaque niche</li>
      <li>Plan d'ebook type pour démarrer</li>
      <li>Prix moyens et top 3 best-sellers par niche</li>
    </ul>
    <p>Bonne lecture,<br/>L'équipe EbookStudio</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
    <p style="font-size:12px;color:#6b7280">Vous recevez cet email car vous l'avez demandé sur ebookstudio.fr.</p>
  </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "EbookStudio <contact@ebookstudio.fr>",
      to: [email],
      subject: "📘 Vos 5 niches rentables 2026 (PDF à l'intérieur)",
      html,
    }),
  });
  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return false;
  }
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const first_name = String(body.first_name || "").trim().slice(0, 80);
    const ref_code = String(body.ref_code || "").trim().slice(0, 64) || null;
    const honeypot = String(body.website || "").trim();

    if (honeypot) {
      // Bot detected — silently succeed
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ error: "Email invalide" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      null;

    // Upsert by lowercase email
    const { data: existing } = await supabase
      .from("funnel_leads")
      .select("id")
      .ilike("email", email)
      .maybeSingle();

    let leadId = existing?.id;
    if (leadId) {
      await supabase
        .from("funnel_leads")
        .update({
          first_name: first_name || null,
          ref_code: ref_code,
          utm_source: body.utm_source || null,
          utm_medium: body.utm_medium || null,
          utm_campaign: body.utm_campaign || null,
          landing_url: body.landing_url || null,
          user_agent: req.headers.get("user-agent") || null,
          ip,
        })
        .eq("id", leadId);
    } else {
      const { data: inserted, error: insErr } = await supabase
        .from("funnel_leads")
        .insert({
          email,
          first_name: first_name || null,
          ref_code,
          utm_source: body.utm_source || null,
          utm_medium: body.utm_medium || null,
          utm_campaign: body.utm_campaign || null,
          landing_url: body.landing_url || null,
          user_agent: req.headers.get("user-agent") || null,
          ip,
        })
        .select("id")
        .single();
      if (insErr) throw insErr;
      leadId = inserted.id;
    }

    // Send lead magnet email (non-blocking failure)
    const sent = await sendLeadMagnetEmail(email, first_name);
    if (sent) {
      await supabase
        .from("funnel_leads")
        .update({ lead_magnet_sent_at: new Date().toISOString() })
        .eq("id", leadId);
    }

    // Enroll in nurturing sequence (optional table)
    try {
      await supabase.from("email_sequences").upsert(
        {
          email,
          sequence_name: "promo_funnel",
          current_step: 0,
          next_email_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        },
        { onConflict: "email,sequence_name" },
      );
    } catch (e) {
      console.warn("Sequence enrollment skipped:", (e as Error).message);
    }

    return new Response(
      JSON.stringify({ ok: true, lead_id: leadId, lead_magnet_url: LEAD_MAGNET_URL }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("funnel-capture-lead error:", e);
    return new Response(
      JSON.stringify({ error: (e as Error).message || "Erreur serveur" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
