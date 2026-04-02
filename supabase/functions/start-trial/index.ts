import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateAccessCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'EBK-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Email invalide' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if subscriber already exists
    const { data: existing } = await supabase
      .from('subscribers')
      .select('*')
      .ilike('email', normalizedEmail)
      .single();

    if (existing) {
      // Already has an active/trialing subscription
      if (existing.status === 'active' || existing.status === 'trialing') {
        return new Response(
          JSON.stringify({ 
            ok: true, 
            alreadyExists: true,
            email: existing.email,
            accessCode: existing.access_code,
            status: existing.status,
            message: 'Vous avez déjà un accès actif.'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Expired trial or inactive — reactivate trial
      const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const accessCode = existing.access_code || generateAccessCode();

      const { error: updateError } = await supabase
        .from('subscribers')
        .update({
          status: 'trialing',
          trial_ends_at: trialEndsAt,
          access_code: accessCode,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (updateError) throw updateError;

      return new Response(
        JSON.stringify({
          ok: true,
          email: normalizedEmail,
          accessCode,
          trialEndsAt,
          status: 'trialing',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // New subscriber — create trial
    const accessCode = generateAccessCode();
    const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const { error: insertError } = await supabase
      .from('subscribers')
      .insert({
        email: normalizedEmail,
        access_code: accessCode,
        status: 'trialing',
        plan_type: 'pro',
        plan_tier: 'standard',
        trial_ends_at: trialEndsAt,
      });

    if (insertError) throw insertError;

    // Send welcome email with access code via Resend
    const resendKey = Deno.env.get('RESEND_API_KEY');
    if (resendKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'EbookStudio <noreply@ebookstudio.fr>',
            to: [normalizedEmail],
            subject: '🎉 Votre essai gratuit EbookStudio Pro est activé !',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #0891b2; text-align: center;">🎉 Bienvenue sur EbookStudio Pro !</h1>
                <p>Votre essai gratuit de <strong>7 jours</strong> est maintenant actif.</p>
                <div style="background: #f0f9ff; border: 2px solid #0891b2; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
                  <p style="margin: 0 0 8px; color: #666;">Votre code d'accès :</p>
                  <p style="font-size: 28px; font-weight: bold; font-family: monospace; color: #0891b2; margin: 0;">${accessCode}</p>
                </div>
                <p><strong>Email :</strong> ${normalizedEmail}</p>
                <p>Connectez-vous sur <a href="https://video-lexicon-translator-08.lovable.app/subscription">EbookStudio</a> avec votre email et ce code.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #999; font-size: 12px; text-align: center;">
                  Votre essai expire le ${new Date(trialEndsAt).toLocaleDateString('fr-FR')}. 
                  Pour continuer après l'essai, il suffira de régler 67€ (paiement unique, accès à vie).
                </p>
              </div>
            `,
          }),
        });
      } catch (emailErr) {
        console.error('Email sending failed:', emailErr);
      }
    }

    console.log('Trial started for:', normalizedEmail, 'Code:', accessCode);

    return new Response(
      JSON.stringify({
        ok: true,
        email: normalizedEmail,
        accessCode,
        trialEndsAt,
        status: 'trialing',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in start-trial:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message || 'Erreur serveur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
