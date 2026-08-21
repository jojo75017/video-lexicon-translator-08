import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { EMAIL_SENDING_ENABLED } from "../_shared/emailSendingGuard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

// Systeme.io désactivé — les contacts quiz restent dans la base interne.
// const SYSTEMEIO_BASE = "https://api.systeme.io/api";

// Systeme.io désactivé — la fonction pushToSystemeIo n'est plus appelée.
// async function pushToSystemeIo(
//   email: string,
//   firstName: string,
//   tags: string[],
// ): Promise<{ ok: boolean; detail?: string }> {
//   ...
// }

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const first_name = String(body.first_name || "").trim().slice(0, 80);
    const profile_key = String(body.profile_key || "").trim().slice(0, 32);
    const profile_title = String(body.profile_title || "").trim().slice(0, 120);
    const tag = String(body.tag || "Tag quiz Ebookstudio").trim().slice(0, 64);
    const base_tag = String(body.base_tag || "").trim().slice(0, 64);
    const source = String(body.source || "").trim().slice(0, 32);
    const honeypot = String(body.website || "").trim();

    if (honeypot) {
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

    // Upsert dans funnel_leads (campagne quiz)
    const { data: existing } = await supabase
      .from("funnel_leads")
      .select("id")
      .ilike("email", email)
      .maybeSingle();

    const leadPayload = {
      first_name: first_name || null,
      utm_source: body.utm_source || "quiz",
      utm_medium: body.utm_medium || "quiz_auteur",
      utm_campaign: body.utm_campaign || `quiz_${profile_key || "auteur"}`,
      landing_url: body.landing_url || null,
      user_agent: req.headers.get("user-agent") || null,
      ip,
    };

    let leadId = existing?.id;
    if (leadId) {
      await supabase.from("funnel_leads").update(leadPayload).eq("id", leadId);
    } else {
      const { data: inserted, error: insErr } = await supabase
        .from("funnel_leads")
        .insert({ email, ...leadPayload })
        .select("id")
        .single();
      if (insErr) throw insErr;
      leadId = inserted.id;
    }

    // Systeme.io désactivé — les tags quiz restent internes.
    // const tags = [tag];
    // if (base_tag) tags.push(base_tag);
    // if (source) tags.push(`quiz-source-${source}`);
    // const sio = EMAIL_SENDING_ENABLED
    //   ? await pushToSystemeIo(email, first_name, tags)
    //   : { ok: false, detail: "domain_pending_validation" };
    const sio = { ok: false, detail: "disabled" };

    return new Response(
      JSON.stringify({ ok: true, lead_id: leadId, systemeio: sio.ok, systemeio_detail: sio.detail, profile_key, profile_title }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("quiz-lead error:", e);
    return new Response(
      JSON.stringify({ error: (e as Error).message || "Erreur serveur" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
