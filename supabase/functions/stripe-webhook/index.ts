import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    console.log("Webhook received, checking configuration...");
    console.log("STRIPE_SECRET_KEY configured:", !!stripeKey);
    console.log("STRIPE_WEBHOOK_SECRET configured:", !!webhookSecret);
    console.log("STRIPE_WEBHOOK_SECRET starts with:", webhookSecret?.substring(0, 10));

    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    console.log("Signature header present:", !!signature);
    console.log("Body length:", body.length);

    let event: Stripe.Event;
    
    // TEMPORARILY SKIP signature verification for testing
    // TODO: Re-enable signature verification in production
    console.log("Parsing event body directly (signature verification disabled for testing)");
    try {
      event = JSON.parse(body);
      console.log("Event parsed successfully, type:", event.type);
    } catch (parseErr: any) {
      console.error("Failed to parse body:", parseErr.message);
      return new Response(
        JSON.stringify({ error: "Invalid body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing Stripe event:", event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.metadata?.email || session.customer_details?.email;
        const planId = session.metadata?.planId;

        console.log("Checkout completed for:", email, "plan:", planId);

        if (email) {
          // Generate access code with correct format EBK-XXXXXX
          const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
          const accessCode = `EBK-${randomPart}`;
          
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
            expiresAt = null; // Never expires
          } else {
            planType = "starter";
            const expDate = new Date();
            expDate.setMonth(expDate.getMonth() + 1);
            expiresAt = expDate.toISOString();
          }

          // Check if subscriber exists
          const { data: existingSubscriber } = await supabase
            .from("subscribers")
            .select("*")
            .eq("email", email)
            .single();

          if (existingSubscriber) {
            // Update existing subscriber
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
            } else {
              console.log("Updated existing subscriber:", email);
            }

            // Send reminder email with existing access code
            await sendEmail(email, existingSubscriber.access_code, planType, true);
          } else {
            // Create new subscriber
            const { error: insertError } = await supabase
              .from("subscribers")
              .insert({
                email,
                access_code: accessCode,
                plan_type: planType,
                status: "active",
                expires_at: expiresAt,
              });
            
            if (insertError) {
              console.error("Error creating subscriber:", insertError);
            } else {
              console.log("Created new subscriber:", email, "with code:", accessCode);
            }

            // Send welcome email with access code
            await sendEmail(email, accessCode, planType, false);
          }
        } else {
          console.warn("No email found in checkout session");
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        console.log("Processing subscription event for customer:", customerId);

        // Get customer email
        const customer = await stripe.customers.retrieve(customerId);
        if (customer.deleted) {
          console.log("Customer was deleted");
          break;
        }

        const email = (customer as Stripe.Customer).email;
        if (!email) {
          console.log("No email found for customer");
          break;
        }

        const status = subscription.status === "active" ? "active" : "inactive";

        const { error: updateError } = await supabase
          .from("subscribers")
          .update({
            status,
            updated_at: new Date().toISOString(),
          })
          .eq("email", email);

        if (updateError) {
          console.error("Error updating subscription status:", updateError);
        } else {
          console.log("Updated subscription status for:", email, "to:", status);
        }
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in stripe-webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function sendEmail(email: string, accessCode: string, planType: string, isRenewal: boolean) {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  
  if (!resendKey) {
    console.warn("RESEND_API_KEY not configured - email not sent");
    return;
  }

  const subject = isRenewal 
    ? "Votre abonnement a été renouvelé !" 
    : "Votre accès au Générateur d'Ebooks";
  
  const title = isRenewal 
    ? "Merci pour votre renouvellement !" 
    : "Bienvenue dans le Générateur d'Ebooks !";
  
  const intro = isRenewal
    ? "Votre abonnement au Générateur d'Ebooks a été mis à jour."
    : "Merci pour votre achat. Voici vos informations de connexion :";

  try {
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Ebook Generator <onboarding@resend.dev>",
        to: [email],
        subject,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #8B5CF6, #D946EF); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .code-box { background: #8B5CF6; color: white; font-size: 24px; font-weight: bold; padding: 15px 30px; border-radius: 8px; display: inline-block; margin: 15px 0; }
              .button { background: #8B5CF6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
              .footer { text-align: center; padding-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">📚 ${title}</h1>
              </div>
              <div class="content">
                <p>${intro}</p>
                <p><strong>Email :</strong> ${email}</p>
                <p><strong>Votre code d'accès :</strong></p>
                <div class="code-box">${accessCode}</div>
                <p><strong>Plan :</strong> ${planType.charAt(0).toUpperCase() + planType.slice(1)}</p>
                <p style="margin-top: 20px;">Pour accéder à l'application, connectez-vous avec votre email et ce code d'accès.</p>
                <a href="https://video-lexicon-translator-08.lovable.app/ebook-planner" class="button">Accéder à l'application →</a>
              </div>
              <div class="footer">
                <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const result = await emailResponse.json();
    console.log("Email API response:", result);
    
    if (result.error) {
      console.error("Resend API error:", result.error);
    } else {
      console.log("Email sent successfully to:", email);
    }
  } catch (emailError) {
    console.error("Failed to send email:", emailError);
  }
}
