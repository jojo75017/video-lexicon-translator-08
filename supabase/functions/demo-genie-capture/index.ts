import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { EMAIL_SENDING_ENABLED } from "../_shared/emailSendingGuard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

const OFFER_URL = "https://ebookstudio.fr/commander";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendSummaryEmail(
  email: string,
  firstName: string,
  title: string,
  subtitle: string,
  chapters: { numero: number; titre: string }[],
) {
  if (!EMAIL_SENDING_ENABLED) return false;
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) {
    console.warn("RESEND_API_KEY missing — skipping email");
    return false;
  }
  const greeting = firstName ? `Bonjour ${escapeHtml(firstName)},` : "Bonjour,";
  const list = chapters
    .slice(0, 60)
    .map((c) => `<li style="margin-bottom:6px">${escapeHtml(c.titre)}</li>`)
    .join("");

  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:580px;margin:0 auto;color:#2A2118;background:#FBF6EC;padding:24px;border-radius:12px">
    <p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#C97A14;margin:0 0 6px">Votre sommaire</p>
    <h1 style="margin:0 0 4px;font-size:24px">${escapeHtml(title)}</h1>
    ${subtitle ? `<p style="margin:0 0 16px;color:#6B6257">${escapeHtml(subtitle)}</p>` : ""}
    <p>${greeting}</p>
    <p>Voici le sommaire complet généré à partir de votre idée. Vous pouvez l'utiliser tel quel, ou le faire rédiger chapitre par chapitre dans Ebookstudio.</p>
    <ol style="padding-left:20px">${list}</ol>
    <p style="text-align:center;margin:28px 0">
      <a href="${OFFER_URL}" style="background:#E8951E;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">
        Faire écrire mon livre en entier — 47 € à vie
      </a>
    </p>
    <p style="font-size:13px;color:#6B6257">L'accès à vie à 47 € est disponible jusqu'au 30 septembre 2026. Ensuite, l'accès se fera uniquement par abonnement.</p>
    <hr style="border:none;border-top:1px solid #e5ded0;margin:20px 0"/>
    <p style="font-size:12px;color:#8a8178">Vous recevez cet email car vous avez testé la démo sur ebookstudio.fr.</p>
  </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "EbookStudio <contact@ebookstudio.fr>",
      to: [email],
      subject: `Votre sommaire : ${title}`.slice(0, 120),
      html,
    }),
  });
  if (!res.ok) {
    console.error("Resend error", res.status, (await res.text()).slice(0, 300));
    return false;
  }
  return true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const body = await req.json();

    // Piège à robots
    if (String(body.website || "").trim()) return json(200, { ok: true });

    const email = String(body.email || "").trim().toLowerCase();
    if (!isValidEmail(email)) return json(400, { error: "Email invalide" });

    const firstName = String(body.first_name || "").trim().slice(0, 80);
    const title = String(body.title || "").trim().slice(0, 200) || "Votre livre";
    const subtitle = String(body.subtitle || "").trim().slice(0, 240);
    const chapters = (Array.isArray(body.chapters) ? body.chapters : [])
      .map((c: unknown, i: number) => ({
        numero: Number((c as { numero?: number })?.numero) || i + 1,
        titre: String((c as { titre?: string })?.titre || "").trim().slice(0, 240),
      }))
      .filter((c: { titre: string }) => c.titre.length > 1)
      .slice(0, 60);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      null;

    const payload = {
      email,
      first_name: firstName || null,
      lead_magnet: "demo-genie",
      utm_source: String(body.utm_source || "").slice(0, 80) || null,
      utm_medium: String(body.utm_medium || "").slice(0, 80) || null,
      utm_campaign: String(body.utm_campaign || "").slice(0, 120) || null,
      landing_url: String(body.landing_url || "").slice(0, 500) || null,
      user_agent: req.headers.get("user-agent") || null,
      ip,
    };

    const { data: existing } = await supabase
      .from("funnel_leads")
      .select("id")
      .ilike("email", email)
      .maybeSingle();

    let leadId = existing?.id as string | undefined;
    if (leadId) {
      await supabase.from("funnel_leads").update(payload).eq("id", leadId);
    } else {
      const { data: inserted, error: insErr } = await supabase
        .from("funnel_leads")
        .insert(payload)
        .select("id")
        .single();
      if (insErr) throw insErr;
      leadId = inserted.id;
    }

    const sent = await sendSummaryEmail(email, firstName, title, subtitle, chapters);
    if (sent && leadId) {
      await supabase
        .from("funnel_leads")
        .update({ lead_magnet_sent_at: new Date().toISOString() })
        .eq("id", leadId);
    }

    return json(200, { ok: true, lead_id: leadId, emailed: sent });
  } catch (e) {
    console.error("demo-genie-capture error", e);
    return json(500, { error: "Erreur serveur" });
  }
});
