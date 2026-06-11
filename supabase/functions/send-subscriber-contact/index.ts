import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { pushToSystemeIo } from "../_shared/systemeio.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "boubetgeorges@gmail.com";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { email, name, subject, category, message, source, handle } = await req.json();

    if (!email || !message) {
      return new Response(JSON.stringify({ error: "Email et message requis" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const safe = (s: string) => String(s || "").replace(/[<>]/g, "");
    const html = `
      <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#008296,#00b4cc);padding:24px;color:#fff;">
          <h1 style="margin:0;font-size:22px;">📬 Nouveau message abonné</h1>
          <p style="margin:8px 0 0;opacity:0.9;font-size:14px;">${safe(category || "Question générale")}</p>
        </div>
        <div style="padding:24px;color:#232F3E;">
          <p><strong>De :</strong> ${safe(name || "—")} &lt;${safe(email)}&gt;</p>
          <p><strong>Sujet :</strong> ${safe(subject || "(sans sujet)")}</p>
          <div style="margin-top:16px;padding:16px;background:#FAFAFA;border-left:4px solid #FF9E2D;border-radius:6px;white-space:pre-wrap;">${safe(message)}</div>
          <p style="margin-top:24px;font-size:13px;color:#666;">Répondre directement à <a href="mailto:${safe(email)}" style="color:#008296;">${safe(email)}</a></p>
        </div>
      </div>`;

    const r = await resend.emails.send({
      from: "Ebookstudio Support <noreply@ebookstudio.fr>",
      to: [ADMIN_EMAIL],
      reply_to: email,
      subject: `[Contact abonné] ${subject || category || "Nouveau message"} — ${email}`,
      html,
    });

    console.log("Contact email sent:", r);

    // Si le message vient de la page influenceurs, on inscrit le contact dans Systeme.io.
    let systemeio: { ok: boolean; detail?: string } | undefined;
    if (source === "influenceurs") {
      systemeio = await pushToSystemeIo(email, name || handle || "", [
        "promoteur-interesse",
        "ambassadeur-ebookstudio",
        "contact-influenceur",
      ], handle ? [{ slug: "pseudo", value: String(handle) }] : []);
    }

    return new Response(JSON.stringify({ success: true, systemeio: systemeio?.ok }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("send-subscriber-contact error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
