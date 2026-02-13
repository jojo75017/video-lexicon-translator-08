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

function getPlanLimits(planType: string) {
  const plans: any = {
    starter: {
      label: 'Starter - 27€/mois',
      ebooks: '5 ebooks par mois',
      chapters: '50 chapitres maximum',
      covers: '3 couvertures par mois',
      features: ['Génération automatique', 'Export PDF', 'Formation Ebook incluse', 'Support email']
    },
    pro: {
      label: 'Pro - 67€/mois',
      ebooks: '20 ebooks par mois',
      chapters: '200 chapitres maximum',
      covers: '10 couvertures par mois',
      features: ['Tout de Starter', '3 Formations incluses', 'Gestionnaire Séries/Sagas', 'Export PDF/EPUB', 'Support prioritaire']
    },
    lifetime: {
      label: 'Lifetime - Accès à vie',
      ebooks: 'Ebooks illimités à vie',
      chapters: 'Chapitres illimités',
      covers: 'Couvertures illimitées',
      features: ['Toutes les fonctionnalités', 'Toutes les formations', 'Mises à jour à vie', 'Support VIP 24/7']
    },
    enterprise: {
      label: 'Enterprise',
      ebooks: 'Ebooks illimités',
      chapters: 'Chapitres illimités',
      covers: 'Couvertures illimitées',
      features: ['Tout de Pro', 'API Access', 'Support dédié 24/7', 'Formation personnalisée']
    }
  };
  return plans[planType] || plans.starter;
}

async function sendAdminNotification(subscriberEmail: string, planType: string, planTier: string, isNew: boolean) {
  try {
    const adminEmail = 'boubetgeorges@gmail.com';
    const action = isNew ? '🆕 Nouvel abonné' : '🔄 Abonnement mis à jour';
    const tierBadge = planTier === 'vip' ? '⭐ VIP' : 'Standard';
    
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px;">
        <div style="background:linear-gradient(135deg,#10b981,#059669);color:white;padding:20px;border-radius:10px 10px 0 0;text-align:center;">
          <h2 style="margin:0;">${action}</h2>
        </div>
        <div style="background:#f0fdf4;padding:20px;border-radius:0 0 10px 10px;border:1px solid #bbf7d0;">
          <p><strong>📧 Email :</strong> ${subscriberEmail}</p>
          <p><strong>📦 Plan :</strong> ${planType}</p>
          <p><strong>🏷️ Tier :</strong> ${tierBadge}</p>
          <p><strong>📅 Date :</strong> ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}</p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'EbookStudio <onboarding@resend.dev>',
      to: [adminEmail],
      subject: `${action} — ${subscriberEmail} (${planType})`,
      html,
    });
    console.log('Admin notification sent for:', subscriberEmail);
  } catch (error) {
    console.error('Failed to send admin notification:', error);
  }
}

async function sendWelcomeEmail(email: string, accessCode: string, planType: string, isNewSubscriber: boolean) {
  try {
    const planDetails = getPlanLimits(planType);
    const subject = isNewSubscriber 
      ? '🎉 Bienvenue ! Votre accès au Générateur d\'Ebook'
      : '✅ Votre abonnement a été mis à jour';

    const welcomeMessage = isNewSubscriber
      ? `<p>Bienvenue sur le <strong>Générateur d'Ebook IA</strong> ! 🎉</p>
         <p>Votre compte a été créé avec succès et vous êtes maintenant prêt à créer des ebooks professionnels en quelques clics.</p>`
      : `<p>Votre abonnement au <strong>Générateur d'Ebook IA</strong> a été mis à jour avec succès !</p>`;

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
            .plan-box { background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .feature-list { list-style: none; padding: 0; }
            .feature-list li { padding: 8px 0; border-bottom: 1px solid #e0e0e0; }
            .feature-list li:before { content: "✅ "; color: #10b981; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${isNewSubscriber ? '🎉 Bienvenue !' : '✅ Abonnement mis à jour'}</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Générateur d'Ebook IA</p>
            </div>
            <div class="content">
              ${welcomeMessage}
              
              <div class="code-box">
                <div style="color: #666; font-size: 14px; margin-bottom: 10px;">Votre code d'accès personnel :</div>
                <div class="code">${accessCode}</div>
              </div>

              <div class="info">
                <strong>📧 Comment vous connecter ?</strong>
                <ol style="margin: 10px 0 0 0; padding-left: 20px;">
                  <li>Rendez-vous sur la page de connexion</li>
                  <li>Entrez votre email : <strong>${email}</strong></li>
                  <li>Entrez votre code d'accès : <strong>${accessCode}</strong></li>
                  <li>Cliquez sur "Accéder au générateur"</li>
                </ol>
              </div>

              <div class="plan-box">
                <h2 style="margin: 0 0 15px 0; color: #0ea5e9;">📦 Votre Plan : ${planDetails.label}</h2>
                <div style="margin-bottom: 15px;">
                  <strong>Limites mensuelles :</strong>
                  <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>📚 ${planDetails.ebooks}</li>
                    <li>📄 ${planDetails.chapters}</li>
                    <li>🎨 ${planDetails.covers}</li>
                  </ul>
                </div>
                <strong>Fonctionnalités incluses :</strong>
                <ul class="feature-list">
                  ${planDetails.features.map((feature: string) => `<li>${feature}</li>`).join('')}
                </ul>
              </div>

              <div style="text-align: center;">
                <a href="#" class="cta-button">🚀 Commencer maintenant</a>
              </div>

              <p style="margin-top: 30px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; font-size: 14px;">
                <strong>⚠️ Important :</strong> Ce code est personnel et confidentiel. Ne le partagez avec personne.
              </p>

              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                Besoin d'aide ? Répondez simplement à cet email ou contactez notre support.
              </p>
            </div>
            <div class="footer">
              <p><strong>Générateur d'Ebook IA</strong></p>
              <p>Créez des ebooks professionnels en quelques clics grâce à l'intelligence artificielle</p>
              <p style="margin-top: 15px;">Si vous n'avez pas demandé cet accès, ignorez cet email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log('Sending welcome email to:', email);

    const emailResponse = await resend.emails.send({
      from: 'Générateur Ebook <onboarding@resend.dev>',
      to: [email],
      subject: subject,
      html: html,
    });

    console.log('Welcome email sent successfully to:', email, emailResponse);
    return { success: true };
  } catch (error: any) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error: error.message };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin authentication
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error('User authentication error:', userError);
      return new Response(
        JSON.stringify({ error: 'Non authentifié' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Check if user is admin
    const { data: roles, error: rolesError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin');

    if (rolesError || !roles || roles.length === 0) {
      console.error('Admin verification failed:', rolesError);
      return new Response(
        JSON.stringify({ error: 'Accès refusé - droits administrateur requis' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    console.log('Admin verified:', user.email);

    // Parse request body
    const { email, plan_type, expires_at } = await req.json();

    if (!email || !plan_type) {
      return new Response(
        JSON.stringify({ error: 'Email et plan_type requis' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Format d\'email invalide' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Use service role for database operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if subscriber exists
    const { data: existingSubscriber, error: checkError } = await supabaseAdmin
      .from('subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking subscriber:', checkError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la vérification' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    let accessCode: string;
    let emailSent = false;
    let emailError = '';
    let assignedTier = 'standard';

    // Check if VIP slots are available (only for new subscribers)
    if (!existingSubscriber) {
      const { data: canCreateVip } = await supabaseAdmin.rpc('can_create_vip');
      if (canCreateVip === true) {
        assignedTier = 'vip';
        console.log('VIP slot available - assigning VIP tier');
      } else {
        console.log('VIP slots full - assigning standard tier');
      }
    }

    if (existingSubscriber) {
      // Update existing subscriber
      const { error: updateError } = await supabaseAdmin
        .from('subscribers')
        .update({
          status: 'active',
          plan_type: plan_type,
          expires_at: expires_at || null,
          updated_at: new Date().toISOString()
        })
        .eq('email', email);

      if (updateError) {
        console.error('Error updating subscriber:', updateError);
        return new Response(
          JSON.stringify({ error: 'Erreur lors de la mise à jour' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      accessCode = existingSubscriber.access_code;
      assignedTier = existingSubscriber.plan_tier;
      console.log('Subscriber updated:', email);

      // Send update email + admin notification
      const emailResult = await sendWelcomeEmail(email, accessCode, plan_type, false);
      emailSent = emailResult.success;
      if (!emailResult.success) {
        emailError = emailResult.error || 'Erreur inconnue';
      }
      await sendAdminNotification(email, plan_type, assignedTier, false);
    } else {
      // Create new subscriber
      accessCode = generateAccessCode();

      const { error: insertError } = await supabaseAdmin
        .from('subscribers')
        .insert({
          email,
          access_code: accessCode,
          plan_type,
          plan_tier: assignedTier,
          status: 'active',
          expires_at: expires_at || null
        });

      if (insertError) {
        console.error('Error creating subscriber:', insertError);
        return new Response(
          JSON.stringify({ error: 'Erreur lors de la création' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      console.log('New subscriber created:', email, 'with tier:', assignedTier);

      // Send welcome email + admin notification
      const emailResult = await sendWelcomeEmail(email, accessCode, plan_type, true);
      emailSent = emailResult.success;
      if (!emailResult.success) {
        emailError = emailResult.error || 'Erreur inconnue';
      }
      await sendAdminNotification(email, plan_type, assignedTier, true);
    }

    // Get current VIP count
    const { data: vipCount } = await supabaseAdmin.rpc('count_vip_subscribers');

    return new Response(
      JSON.stringify({
        success: true,
        accessCode,
        emailSent,
        emailError: emailSent ? undefined : emailError,
        planTier: assignedTier,
        vipCount: vipCount || 0,
        vipSlotsRemaining: Math.max(0, 30 - (vipCount || 0)),
        message: existingSubscriber 
          ? 'Abonnement mis à jour avec succès' 
          : assignedTier === 'vip' 
            ? `🎉 Nouvel abonné VIP créé ! (${vipCount}/30 places VIP)`
            : 'Nouvel abonné créé avec succès'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Add subscriber error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});