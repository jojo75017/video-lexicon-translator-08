import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
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

    // For now, we'll process without webhook signature verification
    // In production, you should add STRIPE_WEBHOOK_SECRET and verify
    const event = JSON.parse(body);

    console.log("Received Stripe event:", event.type);

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
            await supabase
              .from("subscribers")
              .update({
                plan_type: planType,
                status: "active",
                expires_at: expiresAt,
                updated_at: new Date().toISOString(),
              })
              .eq("email", email);
            
            console.log("Updated existing subscriber:", email);

            // Send reminder email with existing access code
            const resendKey = Deno.env.get("RESEND_API_KEY");
            if (resendKey && existingSubscriber.access_code) {
              try {
                await fetch("https://api.resend.com/emails", {
                  method: "POST",
                  headers: {
                    "Authorization": `Bearer ${resendKey}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    from: "Ebook Generator <onboarding@resend.dev>",
                    to: [email],
                    subject: "Votre abonnement a été renouvelé !",
                    html: `
                      <h1>Merci pour votre renouvellement !</h1>
                      <p>Votre abonnement au Générateur d'Ebooks a été mis à jour.</p>
                      <p><strong>Email :</strong> ${email}</p>
                      <p><strong>Votre code d'accès :</strong> ${existingSubscriber.access_code}</p>
                      <p><strong>Nouveau plan :</strong> ${planType.charAt(0).toUpperCase() + planType.slice(1)}</p>
                      <p><a href="https://xvdgazrewsuaqtalqxue.lovableproject.com/ebook-planner">Accéder à l'application</a></p>
                    `,
                  }),
                });
                console.log("Renewal email sent to:", email);
              } catch (emailError) {
                console.error("Failed to send renewal email:", emailError);
              }
            }
          } else {
            // Create new subscriber
            await supabase
              .from("subscribers")
              .insert({
                email,
                access_code: accessCode,
                plan_type: planType,
                status: "active",
                expires_at: expiresAt,
              });
            
            console.log("Created new subscriber:", email, "with code:", accessCode);

            // Send access code email via Resend
            const resendKey = Deno.env.get("RESEND_API_KEY");
            if (resendKey) {
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
                    subject: "Votre accès au Générateur d'Ebooks",
                    html: `
                      <h1>Bienvenue dans le Générateur d'Ebooks !</h1>
                      <p>Merci pour votre achat. Voici vos informations de connexion :</p>
                      <p><strong>Email :</strong> ${email}</p>
                      <p><strong>Code d'accès :</strong> ${accessCode}</p>
                      <p><strong>Plan :</strong> ${planType.charAt(0).toUpperCase() + planType.slice(1)}</p>
                      <p><a href="https://xvdgazrewsuaqtalqxue.lovableproject.com/ebook-planner">Accéder à l'application</a></p>
                      <p>À bientôt !</p>
                    `,
                  }),
                });
                console.log("Email sent:", await emailResponse.json());
              } catch (emailError) {
                console.error("Failed to send email:", emailError);
              }
            }
          }
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Get customer email
        const customer = await stripe.customers.retrieve(customerId);
        if (customer.deleted) break;

        const email = (customer as Stripe.Customer).email;
        if (!email) break;

        const status = subscription.status === "active" ? "active" : "inactive";

        await supabase
          .from("subscribers")
          .update({
            status,
            updated_at: new Date().toISOString(),
          })
          .eq("email", email);

        console.log("Updated subscription status for:", email, "to:", status);
        break;
      }
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
