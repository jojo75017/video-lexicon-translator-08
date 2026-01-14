import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotifyAdminRequest {
  email: string;
  timestamp: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, timestamp }: NotifyAdminRequest = await req.json();

    const adminEmail = "boubetgeorges@gmail.com";
    const formattedTime = new Date(timestamp).toLocaleString('fr-FR', {
      dateStyle: 'full',
      timeStyle: 'short'
    });

    const emailResponse = await resend.emails.send({
      from: "EbookStudio Pro <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `🎉 Nouvelle confirmation de paiement - ${email}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6; padding: 20px;">
          <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            
            <div style="background: linear-gradient(135deg, #7c3aed, #10b981); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">💰 Nouveau Paiement !</h1>
            </div>
            
            <div style="padding: 30px;">
              <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
                Un client vient de confirmer son paiement PayPal :
              </p>
              
              <div style="background: #f3e8ff; border: 2px solid #7c3aed; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 20px;">
                <p style="color: #6b21a8; margin: 0 0 10px 0; font-size: 14px;">Email du client</p>
                <p style="color: #7c3aed; margin: 0; font-size: 20px; font-weight: bold;">${email}</p>
              </div>
              
              <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">
                📅 Date : ${formattedTime}
              </p>
              
              <div style="background: #fef3c7; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                <p style="color: #92400e; margin: 0; font-size: 14px;">
                  ⚡ <strong>Action requise :</strong> Vérifiez le paiement PayPal, puis créez le compte sur le dashboard admin.
                </p>
              </div>
              
              <a href="https://ebookstudio.fr/admin" 
                 style="display: block; background: linear-gradient(135deg, #7c3aed, #6d28d9); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; text-align: center; font-weight: bold; font-size: 16px;">
                🔧 Accéder au Dashboard Admin
              </a>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                EbookStudio Pro - Notification automatique
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Admin notification email sent:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending admin notification:", error);
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
