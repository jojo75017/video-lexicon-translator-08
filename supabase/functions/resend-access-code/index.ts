import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';
import { Resend } from 'npm:resend@2.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting store (in-memory, simple implementation)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const key = email.toLowerCase();
  const limit = rateLimitStore.get(key);

  if (!limit || now > limit.resetTime) {
    // Reset or create new limit (3 requests per hour)
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + 60 * 60 * 1000 // 1 hour
    });
    return true;
  }

  if (limit.count >= 3) {
    return false;
  }

  limit.count++;
  return true;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Email requis' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return new Response(
        JSON.stringify({ error: 'Format d\'email invalide' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Check rate limit
    if (!checkRateLimit(normalizedEmail)) {
      console.log('Rate limit exceeded for:', normalizedEmail);
      return new Response(
        JSON.stringify({ 
          error: 'Trop de tentatives. Veuillez réessayer dans une heure.',
          rateLimitExceeded: true 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
      );
    }

    // Use service role to query subscribers
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: subscriber, error: dbError } = await supabase
      .from('subscribers')
      .select('email, access_code, status, plan_type')
      .eq('email', normalizedEmail)
      .single();

    if (dbError || !subscriber) {
      console.log('Subscriber not found:', normalizedEmail);
      // Don't reveal if email exists or not for security
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Si cet email est enregistré, vous recevrez un code d\'accès.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (subscriber.status !== 'active') {
      console.log('Inactive subscriber:', normalizedEmail);
      return new Response(
        JSON.stringify({ 
          error: 'Votre abonnement n\'est pas actif. Contactez le support.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    // Send email with access code
    try {
      const emailResponse = await resend.emails.send({
        from: 'EbookStudio <noreply@ebookstudio.fr>',
        to: [subscriber.email],
        subject: 'Votre code d\'accès - Générateur Ebook',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .code-box { background: white; border: 3px solid #667eea; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
                .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 4px; font-family: monospace; }
                .info { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🔑 Votre Code d'Accès</h1>
                </div>
                <div class="content">
                  <p>Bonjour,</p>
                  <p>Vous avez demandé votre code d'accès pour le Générateur d'Ebook.</p>
                  
                  <div class="code-box">
                    <div style="color: #666; font-size: 14px; margin-bottom: 10px;">Votre code d'accès :</div>
                    <div class="code">${subscriber.access_code}</div>
                  </div>

                  <div class="info">
                    <strong>ℹ️ Informations de votre abonnement :</strong><br>
                    Email : ${subscriber.email}<br>
                    Plan : ${subscriber.plan_type.toUpperCase()}<br>
                    Statut : ${subscriber.status === 'active' ? '✅ Actif' : '❌ Inactif'}
                  </div>

                  <p><strong>Comment se connecter :</strong></p>
                  <ol>
                    <li>Allez sur la page de connexion</li>
                    <li>Entrez votre email : <strong>${subscriber.email}</strong></li>
                    <li>Entrez votre code d'accès : <strong>${subscriber.access_code}</strong></li>
                    <li>Cliquez sur "Accéder au générateur"</li>
                  </ol>

                  <p style="margin-top: 30px; color: #666; font-size: 14px;">
                    ⚠️ Ce code est personnel et confidentiel. Ne le partagez avec personne.
                  </p>
                </div>
                <div class="footer">
                  <p>Générateur d'Ebook - Créez des ebooks professionnels en quelques clics</p>
                  <p>Si vous n'avez pas demandé ce code, ignorez cet email.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      console.log('Email sent successfully to:', normalizedEmail, emailResponse);

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Un email contenant votre code d\'accès a été envoyé.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (emailError: any) {
      console.error('Error sending email:', emailError);
      return new Response(
        JSON.stringify({ 
          error: 'Erreur lors de l\'envoi de l\'email. Contactez le support.',
          details: emailError.message
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Resend access code error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur inconnue' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});