import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';
import { Resend } from 'npm:resend@2.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateAccessCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'EBK-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function getPlanFromProduct(productName: string): string {
  const name = productName.toLowerCase();
  if (name.includes('enterprise') || name.includes('illimité')) return 'enterprise';
  if (name.includes('pro')) return 'pro';
  return 'starter';
}

async function sendWelcomeEmail(email: string, accessCode: string, planType: string) {
  const planLabels: Record<string, string> = {
    starter: 'Starter',
    pro: 'Pro',
    enterprise: 'Enterprise'
  };

  const html = `
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
            <h1>🎉 Bienvenue !</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Générateur d'Ebook IA - Plan ${planLabels[planType] || 'Starter'}</p>
          </div>
          <div class="content">
            <p>Félicitations pour votre achat ! 🎉</p>
            <p>Votre compte sur le <strong>Générateur d'Ebook IA</strong> est maintenant actif.</p>
            
            <div class="code-box">
              <div style="color: #666; font-size: 14px; margin-bottom: 10px;">Votre code d'accès personnel :</div>
              <div class="code">${accessCode}</div>
            </div>

            <div class="info">
              <strong>📧 Comment vous connecter ?</strong>
              <ol style="margin: 10px 0 0 0; padding-left: 20px;">
                <li>Rendez-vous sur <a href="https://votre-app.lovable.app">votre générateur d'ebook</a></li>
                <li>Entrez votre email : <strong>${email}</strong></li>
                <li>Entrez votre code d'accès : <strong>${accessCode}</strong></li>
                <li>Cliquez sur "Accéder au générateur"</li>
              </ol>
            </div>

            <p style="margin-top: 30px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; font-size: 14px;">
              <strong>⚠️ Important :</strong> Ce code est personnel et confidentiel. Conservez-le précieusement !
            </p>
          </div>
          <div class="footer">
            <p><strong>Générateur d'Ebook IA</strong></p>
            <p>Besoin d'aide ? Répondez à cet email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  console.log('Sending welcome email to:', email);

  const emailResponse = await resend.emails.send({
    from: 'Générateur Ebook <onboarding@resend.dev>',
    to: [email],
    subject: '🎉 Votre accès au Générateur d\'Ebook IA',
    html: html,
  });

  console.log('Email sent:', emailResponse);
  return emailResponse;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('Webhook received from Systeme.io:', JSON.stringify(body));

    // Systeme.io envoie les données sous différents formats selon le type d'événement
    // Format typique: { email, first_name, last_name, product_name, ... }
    const email = body.email || body.contact?.email || body.buyer?.email;
    const productName = body.product_name || body.product?.name || body.offer_name || 'starter';

    if (!email) {
      console.error('No email found in webhook payload');
      return new Response(
        JSON.stringify({ error: 'Email requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Vérifier si l'abonné existe déjà
    const { data: existingSubscriber } = await supabaseAdmin
      .from('subscribers')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    const planType = getPlanFromProduct(productName);
    const accessCode = existingSubscriber?.access_code || generateAccessCode();

    // Calculer la date d'expiration (1 an par défaut)
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    if (existingSubscriber) {
      // Mettre à jour l'abonné existant
      const { error: updateError } = await supabaseAdmin
        .from('subscribers')
        .update({
          status: 'active',
          plan_type: planType,
          expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('email', email.toLowerCase());

      if (updateError) {
        console.error('Error updating subscriber:', updateError);
        throw updateError;
      }

      console.log('Subscriber updated:', email);
    } else {
      // Créer un nouvel abonné
      const { error: insertError } = await supabaseAdmin
        .from('subscribers')
        .insert({
          email: email.toLowerCase(),
          access_code: accessCode,
          plan_type: planType,
          status: 'active',
          expires_at: expiresAt.toISOString()
        });

      if (insertError) {
        console.error('Error creating subscriber:', insertError);
        throw insertError;
      }

      console.log('New subscriber created:', email);
    }

    // Envoyer l'email de bienvenue avec le code d'accès
    try {
      await sendWelcomeEmail(email.toLowerCase(), accessCode, planType);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // On continue même si l'email échoue
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Abonné créé/mis à jour avec succès',
        email: email.toLowerCase()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
