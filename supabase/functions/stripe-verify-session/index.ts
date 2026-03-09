import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type VerifyRequest = {
  sessionId: string;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { sessionId }: VerifyRequest = await req.json();
    if (!sessionId) {
      return new Response(JSON.stringify({ error: "Missing sessionId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Validate paid session: we require BOTH paid + complete
    const paymentStatus = (session as any).payment_status;
    const status = (session as any).status;

    // NOTE: previous logic used "&&" which could incorrectly accept sessions that are
    // marked complete but not actually paid.
    if (paymentStatus !== "paid" || status !== "complete") {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Payment not completed",
          paymentStatus,
          status,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const email = session.metadata?.email || (session as any).customer_details?.email;
    const planId = session.metadata?.planId;

    if (!email) {
      return new Response(JSON.stringify({ ok: false, error: "No email found on session" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Determine plan type and expiration
    let planType = "starter";
    let expiresAt: string | null = null;

    if (planId === "pro") {
      planType = "pro";
      const expDate = new Date();
      expDate.setMonth(expDate.getMonth() + 1);
      expiresAt = expDate.toISOString();
    } else if (planId === "lifetime") {
      planType = "lifetime";
      expiresAt = null;
    } else {
      planType = "starter";
      const expDate = new Date();
      expDate.setMonth(expDate.getMonth() + 1);
      expiresAt = expDate.toISOString();
    }

    // Fetch existing subscriber (if any)
    const { data: existingSubscriber, error: existingErr } = await supabase
      .from("subscribers")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (existingErr) {
      console.error("Error checking subscriber:", existingErr);
    }

    const accessCode =
      existingSubscriber?.access_code || `EBK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    if (existingSubscriber) {
      const { error: updateError } = await supabase
        .from("subscribers")
        .update({
          plan_type: planType,
          status: "active",
          expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq("email", email);

      if (updateError) {
        console.error("Error updating subscriber:", updateError);
      }

      // Best effort email (do not fail the flow)
      await sendEmail(email, accessCode, planType, true).catch((e) => {
        console.error("Email send failed (renewal):", e);
      });

      return new Response(
        JSON.stringify({ ok: true, email, accessCode, subscriber: { ...existingSubscriber, plan_type: planType, status: "active", expires_at: expiresAt } }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { error: insertError } = await supabase.from("subscribers").insert({
      email,
      access_code: accessCode,
      plan_type: planType,
      status: "active",
      expires_at: expiresAt,
    });

    if (insertError) {
      console.error("Error creating subscriber:", insertError);
    }

    await sendEmail(email, accessCode, planType, false).catch((e) => {
      console.error("Email send failed (welcome):", e);
    });

    return new Response(
      JSON.stringify({ ok: true, email, accessCode, subscriber: { email, access_code: accessCode, plan_type: planType, status: "active", expires_at: expiresAt } }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in stripe-verify-session:", error);
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function sendEmail(email: string, accessCode: string, planType: string, isRenewal: boolean) {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) {
    console.warn("RESEND_API_KEY not configured - email not sent");
    return;
  }

  const subject = isRenewal ? "Votre accès a été réactivé" : "Votre accès au Générateur d'Ebooks";
  const title = isRenewal ? "Accès réactivé" : "Bienvenue dans le Générateur d'Ebooks !";
  const intro = isRenewal
    ? "Votre accès a été mis à jour. Voici votre code :"
    : "Merci pour votre achat. Voici vos informations de connexion :";

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "EbookStudio Pro <noreply@ebookstudio.fr>",
      to: [email],
      subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #111; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #8B5CF6, #D946EF); color: white; padding: 24px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 24px; border-radius: 0 0 10px 10px; }
              .code-box { background: #8B5CF6; color: white; font-size: 22px; font-weight: 700; padding: 12px 24px; border-radius: 8px; display: inline-block; margin: 12px 0; letter-spacing: 1px; }
              .button { background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 16px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header"><h1 style="margin:0;">${title}</h1></div>
              <div class="content">
                <p>${intro}</p>
                <p><strong>Email :</strong> ${email}</p>
                <p><strong>Votre code d'accès :</strong></p>
                <div class="code-box">${accessCode}</div>
                <p><strong>Plan :</strong> ${planType.charAt(0).toUpperCase() + planType.slice(1)}</p>
                <p>Connectez-vous avec votre email et ce code.</p>
                <a href="https://ebookstudio.fr/subscription" class="button">Se connecter →</a>
              </div>
            </div>
          </body>
        </html>
      `,
    }),
  });

  const result = await emailResponse.json();
  if ((result as any)?.error) {
    console.error("Resend API error:", (result as any).error);
  }
}
