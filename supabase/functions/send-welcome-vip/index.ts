import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, accessCode, name } = await req.json();

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const displayName = name || 'cher client';

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0f0a1e;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    
    <!-- Header -->
    <div style="text-align:center;margin-bottom:30px;">
      <div style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#ec4899);padding:15px 25px;border-radius:16px;margin-bottom:20px;">
        <span style="color:white;font-size:28px;font-weight:bold;">EbookStudio</span>
      </div>
    </div>

    <!-- Main Card -->
    <div style="background:linear-gradient(135deg,#1e1333,#2d1f4e);border:1px solid rgba(124,58,237,0.3);border-radius:20px;padding:40px 30px;text-align:center;">
      
      <div style="font-size:48px;margin-bottom:15px;">🎉</div>
      
      <h1 style="color:#ffffff;font-size:26px;margin:0 0 10px 0;">
        Bienvenue dans le programme VIP Fondateur !
      </h1>
      
      <p style="color:#a78bfa;font-size:16px;margin:0 0 30px 0;">
        Merci pour votre confiance, ${displayName} !
      </p>

      <!-- Access Code Box -->
      <div style="background:linear-gradient(135deg,#7c3aed,#ec4899);border-radius:16px;padding:3px;margin:0 0 30px 0;">
        <div style="background:#1a1030;border-radius:14px;padding:25px;">
          <p style="color:#a78bfa;font-size:13px;margin:0 0 8px 0;text-transform:uppercase;letter-spacing:2px;">
            Votre code d'acces personnel
          </p>
          <p style="color:#ffffff;font-size:32px;font-weight:bold;margin:0;letter-spacing:4px;font-family:monospace;">
            ${accessCode}
          </p>
        </div>
      </div>

      <!-- Steps -->
      <div style="text-align:left;margin:0 0 30px 0;">
        <p style="color:#ffffff;font-size:16px;font-weight:bold;margin:0 0 15px 0;">
          Pour activer votre acces :
        </p>
        
        <div style="background:rgba(124,58,237,0.1);border-radius:12px;padding:15px;margin-bottom:10px;">
          <p style="color:#e2d8f5;font-size:14px;margin:0;">
            <span style="color:#a78bfa;font-weight:bold;">1.</span> Rendez-vous sur <a href="https://ebookstudio.fr/subscription" style="color:#a78bfa;text-decoration:underline;">ebookstudio.fr/subscription</a>
          </p>
        </div>
        
        <div style="background:rgba(124,58,237,0.1);border-radius:12px;padding:15px;margin-bottom:10px;">
          <p style="color:#e2d8f5;font-size:14px;margin:0;">
            <span style="color:#a78bfa;font-weight:bold;">2.</span> Entrez votre code <strong style="color:#ffffff;">${accessCode}</strong>
          </p>
        </div>
        
        <div style="background:rgba(124,58,237,0.1);border-radius:12px;padding:15px;">
          <p style="color:#e2d8f5;font-size:14px;margin:0;">
            <span style="color:#a78bfa;font-weight:bold;">3.</span> Profitez de votre acces <strong style="color:#10b981;">illimite a vie</strong> !
          </p>
        </div>
      </div>

      <!-- What's included -->
      <div style="text-align:left;border-top:1px solid rgba(124,58,237,0.2);padding-top:25px;margin-bottom:25px;">
        <p style="color:#ffffff;font-size:16px;font-weight:bold;margin:0 0 15px 0;">
          Ce qui est inclus dans votre acces VIP :
        </p>
        <table style="width:100%;">
          <tr>
            <td style="padding:6px 0;color:#e2d8f5;font-size:14px;">&#10003; Generation d'ebooks complets (150+ pages)</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#e2d8f5;font-size:14px;">&#10003; Couvertures professionnelles par IA</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#e2d8f5;font-size:14px;">&#10003; Optimisation SEO pour Amazon KDP</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#e2d8f5;font-size:14px;">&#10003; Workflow editorial complet</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#e2d8f5;font-size:14px;">&#10003; Toutes les mises a jour futures</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#e2d8f5;font-size:14px;">&#10003; Support prioritaire</td>
          </tr>
        </table>
      </div>

      <!-- CTA Button -->
      <a href="https://ebookstudio.fr/subscription" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#ec4899);color:white;font-size:18px;font-weight:bold;padding:16px 40px;border-radius:12px;text-decoration:none;margin-bottom:20px;">
        Activer mon acces VIP
      </a>

    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:30px;">
      <p style="color:#6b5b8a;font-size:13px;margin:0 0 5px 0;">
        Une question ? Repondez simplement a cet email.
      </p>
      <p style="color:#4a3d6a;font-size:12px;margin:0;">
        EbookStudio - Creez des ebooks professionnels avec l'IA
      </p>
    </div>

  </div>
</body>
</html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'EbookStudio <noreply@ebookstudio.fr>',
        to: [email],
        subject: '🎉 Bienvenue VIP ! Voici votre code d\'accès EbookStudio',
        html: htmlContent,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Resend error:', data);
      throw new Error(`Email sending failed: ${JSON.stringify(data)}`);
    }

    console.log(`[WELCOME-VIP] Email sent to ${email} with code ${accessCode}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Email envoyé' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in send-welcome-vip:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
