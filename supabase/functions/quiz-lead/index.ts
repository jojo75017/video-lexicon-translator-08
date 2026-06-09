import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

const SYSTEMEIO_BASE = "https://api.systeme.io/api";

// Crée (ou récupère) un contact Systeme.io puis lui assigne un tag.
async function pushToSystemeIo(
  email: string,
  firstName: string,
  tag: string,
): Promise<{ ok: boolean; detail?: string }> {
  const apiKey = Deno.env.get("SYSTEMEIO_API_KEY");
  if (!apiKey) {
    console.warn("SYSTEMEIO_API_KEY missing — skipping Systeme.io push");
    return { ok: false, detail: "missing_key" };
  }
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-API-Key": apiKey,
  };

  // 1) Créer le contact
  let contactId: number | string | null = null;
  try {
    const createRes = await fetch(`${SYSTEMEIO_BASE}/contacts`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email,
        fields: firstName ? [{ slug: "first_name", value: firstName }] : [],
      }),
    });

    if (createRes.ok) {
      const data = await createRes.json().catch(() => ({}));
      contactId = data?.id ?? null;
    } else if (createRes.status === 422) {
      // Contact existe déjà — on le retrouve par email
      const findRes = await fetch(
        `${SYSTEMEIO_BASE}/contacts?email=${encodeURIComponent(email)}`,
        { headers },
      );
      if (findRes.ok) {
        const found = await findRes.json().catch(() => ({}));
        contactId = found?.items?.[0]?.id ?? null;
      }
    } else {
      const txt = await createRes.text();
      console.error("Systeme.io create error", createRes.status, txt);
      return { ok: false, detail: `create_${createRes.status}` };
    }
  } catch (e) {
    console.error("Systeme.io create exception", (e as Error).message);
    return { ok: false, detail: "create_exception" };
  }

  if (!contactId) return { ok: false, detail: "no_contact_id" };

  // 2) Assigner le tag (Systeme.io attend un tag déjà créé côté compte ;
  //    on tente par nom, l'API ignore proprement si non trouvé)
  try {
    const tagRes = await fetch(`${SYSTEMEIO_BASE}/contacts/${contactId}/tags`, {
      method: "POST",
      headers,
      body: JSON.stringify({ tagName: tag }),
    });
    if (!tagRes.ok) {
      console.warn("Systeme.io tag warning", tagRes.status, await tagRes.text());
    }
  } catch (e) {
    console.warn("Systeme.io tag exception", (e as Error).message);
  }

  return { ok: true };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const first_name = String(body.first_name || "").trim().slice(0, 80);
    const profile_key = String(body.profile_key || "").trim().slice(0, 32);
    const profile_title = String(body.profile_title || "").trim().slice(0, 120);
    const tag = String(body.tag || "quiz-auteur").trim().slice(0, 64);
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

    // Envoi vers Systeme.io (non bloquant)
    const sio = await pushToSystemeIo(email, first_name, tag);

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
