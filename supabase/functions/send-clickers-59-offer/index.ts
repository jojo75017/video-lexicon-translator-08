import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_ADDRESS = "Georges Boubet <noreply@ebookstudio.fr>";
const EXCLUDED_EMAILS = ["boubetgeorges@gmail.com"];
const SUBJECT = "🎁 Offre inédite 59€ + BONUS : les 10 niches rentables Amazon KDP";
const OFFRES_LINK = "https://www.ebookstudio.fr/offres";

function buildHtml(): string {
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; color:#232F3E; max-width:600px; margin:0 auto; line-height:1.6;">
    <p>Bonjour,</p>

    <p>Vous avez cliqué récemment sur l'un de mes emails à propos d'<strong>EbookStudio</strong> — merci pour votre intérêt&nbsp;!</p>

    <p>Comme vous faites partie des personnes les plus engagées, je vous réserve une <strong>offre inédite</strong>&nbsp;:</p>

    <div style="background:#FFF7ED; border:2px solid #FF9E2D; border-radius:12px; padding:20px; margin:24px 0; text-align:center;">
      <p style="margin:0; font-size:18px;"><strong>EbookStudio à 59€ seulement</strong></p>
      <p style="margin:8px 0 0; color:#666; text-decoration:line-through;">au lieu de 197€</p>
      <p style="margin:12px 0 0; color:#C2410C; font-weight:bold;">⏳ Offre limitée — elle peut s'arrêter d'un jour à l'autre</p>
    </div>

    <p style="background:#ECFDF5; border-left:4px solid #008296; padding:14px 18px; border-radius:6px;">
      🎁 <strong>BONUS EXCLUSIF réservé aux cliqueurs</strong> :<br/>
      Recevez en cadeau mon guide <strong>« Les 10 niches les plus rentables sur Amazon KDP en 2026 »</strong>
      — celles qui se vendent réellement, avec chiffres et exemples concrets.
    </p>

    <p style="text-align:center; margin:28px 0;">
      <a href="${OFFRES_LINK}"
         style="background:#008296; color:#ffffff; text-decoration:none; padding:16px 32px; border-radius:8px; font-weight:bold; display:inline-block; font-size:16px;">
        Je profite de l'offre 59€ + bonus
      </a>
    </p>

    <p>Le bonus « 10 niches » vous sera envoyé automatiquement dans les 24h après votre commande.</p>

    <p>Une question&nbsp;? Répondez simplement à cet email, je vous réponds personnellement.</p>

    <p style="margin-top:24px;">
      Bien à vous,<br/>
      <strong>Georges Boubet</strong><br/>
      EbookStudio
    </p>
  </div>`;
}

async function sendResendEmail(to: string, subject: string, html: string) {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) return { ok: false, detail: "RESEND_API_KEY manquante" };
  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendKey}`,
      },
      body: JSON.stringify({ from: FROM_ADDRESS, to: [to], subject, html }),
    });
    if (!res.ok) {
      const detail = await res.text();
      return { ok: false, detail: `HTTP ${res.status}: ${detail}` };
    }
    const json = await res.json().catch(() => ({}));
    return { ok: true, id: json?.id };
  } catch (err) {
    return { ok: false, detail: String(err) };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { data: clicks, error } = await supabase
      .from("email_clicks")
      .select("prospect_email");
    if (error) throw error;

    // Exclude already-paying customers
    const { data: paid } = await supabase
      .from("funnel_orders")
      .select("email")
      .eq("status", "paid");
    const paidSet = new Set((paid ?? []).map((p: any) => (p.email ?? "").trim().toLowerCase()));

    const recipients = Array.from(
      new Set(
        (clicks ?? [])
          .map((c: any) => (c.prospect_email ?? "").trim().toLowerCase())
          .filter((e: string) =>
            e && e.includes("@") && !EXCLUDED_EMAILS.includes(e) && !paidSet.has(e)
          ),
      ),
    );

    const html = buildHtml();
    const results: any[] = [];

    for (const to of recipients) {
      const result = await sendResendEmail(to, SUBJECT, html);
      results.push({ to, ...result });
      try {
        await supabase.from("email_send_log").insert({
          recipient_email: to,
          template_name: "clickers-59-offer-bonus",
          message_id: result.id ?? null,
          status: result.ok ? "sent" : "error",
          error_message: result.ok ? null : (result.detail ?? null),
        });
      } catch (_) { /* noop */ }
      // small delay to respect Resend rate limits (~2 req/s)
      await new Promise((r) => setTimeout(r, 550));
    }

    const sent = results.filter((r) => r.ok).length;
    return new Response(
      JSON.stringify({ total: recipients.length, sent, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
    );
  }
});
