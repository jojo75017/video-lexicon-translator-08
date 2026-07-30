import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_ADDRESS = "Georges Boubet <noreply@ebookstudio.fr>";
const EXCLUDED = ["boubetgeorges@gmail.com", "qa-test-tunnel@ebookstudio.fr", "test-debug@example.com"];
const SUBJECT = "🎁 Vos 2 cadeaux + l'offre EbookStudio à 59€";
const OFFRES_LINK = "https://www.ebookstudio.fr/commander?src=email";
const PDF_NICHES = "https://www.ebookstudio.fr/lead-magnets/5-niches-rentables-2026.pdf";
const PDF_GUIDE = "https://www.ebookstudio.fr/lead-magnets/guide-generateur-ebookstudio-principal.pdf";

function buildHtml(): string {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;color:#232F3E;max-width:600px;margin:0 auto;line-height:1.6;">
    <p>Bonjour,</p>
    <p>Je vous ai déjà envoyé quelques emails ces derniers jours à propos d'<strong>EbookStudio</strong>. Aujourd'hui, je vous fais parvenir <strong>2 cadeaux</strong> pour vous remercier de votre intérêt&nbsp;:</p>

    <ul style="padding-left:18px;">
      <li>📘 <a href="${PDF_NICHES}"><strong>Les 5 niches les plus rentables Amazon KDP en 2026</strong></a></li>
      <li>📕 <a href="${PDF_GUIDE}"><strong>Le Guide EbookStudio</strong> — écrire et publier son ebook pas à pas</a></li>
    </ul>

    <blockquote style="border-left:4px solid #FF9E2D;padding:12px 18px;background:#FFF7ED;border-radius:6px;font-style:italic;">
      Le problème n'est pas d'écrire.<br/>
      C'est de ne jamais commencer.<br/>
      <strong>Commencez votre livre.</strong>
    </blockquote>

    <div style="background:#FFF7ED;border:2px solid #FF9E2D;border-radius:12px;padding:20px;margin:24px 0;text-align:center;">
      <p style="margin:0;font-size:18px;"><strong>EbookStudio à 59€ à vie</strong></p>
      <p style="margin:8px 0 0;color:#666;text-decoration:line-through;">au lieu de 197€</p>
      <p style="margin:12px 0 0;color:#C2410C;font-weight:bold;">⏳ Offre temporaire — elle peut s'arrêter d'un jour à l'autre</p>
    </div>

    <p style="text-align:center;margin:28px 0;">
      <a href="${OFFRES_LINK}" style="background:#008296;color:#fff;text-decoration:none;padding:16px 32px;border-radius:8px;font-weight:bold;display:inline-block;font-size:16px;">
        Je profite de l'offre 59€
      </a>
    </p>

    <p>Une question&nbsp;? Répondez à cet email, je vous réponds personnellement.</p>
    <p style="margin-top:24px;">Bien à vous,<br/><strong>Georges Boubet</strong><br/>EbookStudio</p>
  </div>`;
}

import { sendResendEmailThrottled, isQuotaExhausted } from "../_shared/resendThrottle.ts";

async function sendResendEmail(to: string, subject: string, html: string) {
  const r = await sendResendEmailThrottled({ from: FROM_ADDRESS, to: [to], subject, html });
  return { ok: r.ok, id: r.id, detail: r.ok ? undefined : `HTTP ${r.status ?? ""}: ${r.detail ?? ""}` };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { data: seq, error } = await supabase
      .from("email_sequences")
      .select("email,current_step")
      .eq("sequence_name", "promo_funnel")
      .gte("current_step", 1);
    if (error) throw error;

    const { data: paid } = await supabase.from("funnel_orders").select("email").eq("status", "paid");
    const paidSet = new Set((paid ?? []).map((p: any) => (p.email ?? "").trim().toLowerCase()));

    const recipients = Array.from(new Set(
      (seq ?? [])
        .map((r: any) => (r.email ?? "").trim().toLowerCase())
        .filter((e: string) => e && e.includes("@") && !EXCLUDED.includes(e) && !paidSet.has(e))
    ));

    const html = buildHtml();
    const results: any[] = [];
    for (const to of recipients) {
      const r = await sendResendEmail(to, SUBJECT, html);
      results.push({ to, ...r });
      try {
        await supabase.from("email_send_log").insert({
          recipient_email: to,
          template_name: "prospects-gift-59",
          message_id: r.id ?? null,
          status: r.ok ? "sent" : "error",
          error_message: r.ok ? null : (r.detail ?? null),
        });
      } catch (_) {}
      if (isQuotaExhausted()) { console.warn("[prospects-gift-59] Resend daily quota atteint, arrêt"); break; }
    }

    const sent = results.filter((r) => r.ok).length;
    return new Response(JSON.stringify({ total: recipients.length, sent, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
