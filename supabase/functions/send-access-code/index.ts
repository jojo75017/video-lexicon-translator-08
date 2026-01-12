import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendCodeRequest {
  email: string;
  accessCode: string;
  planType: string;
}

// SECURITY: Simple in-memory rate limiting (3 emails per hour per email)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const key = email.toLowerCase().trim();
  const limit = rateLimitMap.get(key);
  
  // Clean up old entries periodically
  if (rateLimitMap.size > 1000) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (now > v.resetTime) rateLimitMap.delete(k);
    }
  }
  
  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + 3600000 }); // 1 hour
    return true;
  }
  
  if (limit.count >= 3) {
    console.warn(`Rate limit exceeded for ${email}`);
    return false;
  }
  
  limit.count++;
  return true;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, accessCode, planType }: SendCodeRequest = await req.json();

    // SECURITY: Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Email invalide" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // SECURITY: Check rate limit
    if (!checkRateLimit(email)) {
      return new Response(
        JSON.stringify({ error: "Trop de requêtes. Réessayez dans 1 heure." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sending access code to ${email}`);

    const emailResponse = await resend.emails.send({
      from: "Ebook Studio <onboarding@resend.dev>",
      to: [email],
      subject: "🎉 Votre accès à Ebook Studio AI",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #8B5CF6, #D946EF); padding: 40px 30px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { padding: 40px 30px; }
            .code-box { background: linear-gradient(135deg, #F3E8FF, #FCE7F3); border: 2px solid #8B5CF6; border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0; }
            .code { font-size: 32px; font-weight: bold; color: #7C3AED; letter-spacing: 3px; font-family: monospace; }
            .plan-badge { display: inline-block; background: #8B5CF6; color: white; padding: 8px 20px; border-radius: 20px; font-weight: bold; margin-bottom: 20px; }
            .steps { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .step { display: flex; align-items: center; margin: 10px 0; }
            .step-number { background: #8B5CF6; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; font-size: 14px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #8B5CF6, #D946EF); color: white; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ Bienvenue sur Ebook Studio AI !</h1>
            </div>
            <div class="content">
              <p>Bonjour,</p>
              <p>Merci pour votre achat ! Voici votre code d'accès personnel pour commencer à créer des ebooks avec l'IA :</p>
              
              <div class="code-box">
                <div class="plan-badge">Plan ${planType.toUpperCase()}</div>
                <div class="code">${accessCode}</div>
              </div>
              
              <div class="steps">
                <p style="margin-top: 0; font-weight: bold;">📋 Comment accéder à votre compte :</p>
                <div class="step">
                  <div class="step-number">1</div>
                  <span>Rendez-vous sur l'application Ebook Studio</span>
                </div>
                <div class="step">
                  <div class="step-number">2</div>
                  <span>Entrez votre email : <strong>${email}</strong></span>
                </div>
                <div class="step">
                  <div class="step-number">3</div>
                  <span>Entrez votre code d'accès : <strong>${accessCode}</strong></span>
                </div>
                <div class="step">
                  <div class="step-number">4</div>
                  <span>Commencez à créer vos ebooks !</span>
                </div>
              </div>
              
              <p style="text-align: center;">
                <strong>⚠️ Conservez précieusement ce code, il est unique et personnel.</strong>
              </p>
              
              <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
              
              <p>À très vite sur Ebook Studio ! 🚀</p>
            </div>
            <div class="footer">
              <p>© 2024 Ebook Studio AI - Tous droits réservés</p>
              <p>Cet email a été envoyé à ${email}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending access code email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
