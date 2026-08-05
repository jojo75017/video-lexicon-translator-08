import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';
import { Resend } from 'npm:resend@2.0.0';
import { EMAIL_SENDING_ENABLED, emailSendingBlockedResult } from '../_shared/emailSendingGuard.ts';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function buildHtml(email: string, code: string, activateUrl: string) {
  return `
  <!DOCTYPE html>
  <html lang="fr">
    <head><meta charset="utf-8" /></head>
    <body style="margin:0;background:#FAFAFA;font-family:Arial,Helvetica,sans-serif;color:#232F3E;">
      <div style="max-width:600px;margin:0 auto;padding:24px;">
        <div style="background:#008296;color:#ffffff;padding:28px 24px;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="margin:0;font-size:22px;">Vous êtes bêta-testeur EbookStudio Pro V2 🎉</h1>
        </div>
        <div style="background:#ffffff;padding:28px 24px;border:1px solid #e6e6e6;border-top:none;border-radius:0 0 12px 12px;">
          <p>Bonjour,</p>
          <p>Félicitations ! Vous êtes officiellement bêta-testeur d'<strong>EbookStudio Pro V2</strong>. Voici votre code d'accès gratuit à vie :</p>
          <div style="background:#FAFAFA;border:2px solid #008296;border-radius:10px;padding:18px;margin:22px 0;text-align:center;">
            <div style="font-size:28px;font-weight:bold;color:#008296;letter-spacing:3px;font-family:monospace;">${code}</div>
          </div>
          <p>Pour l'activer, rendez-vous sur la page d'activation, entrez votre email (<strong>${email}</strong>) ainsi que ce code. Votre accès sera activé immédiatement et vous recevrez votre code de connexion personnel par email.</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${activateUrl}" style="display:inline-block;background:#FF9E2D;color:#232F3E;font-weight:bold;padding:12px 28px;border-radius:8px;text-decoration:none;">Activer mon accès</a>
          </div>
          <p>Merci et bienvenue dans la communauté.</p>
          <p style="margin-top:24px;">Georges</p>
        </div>
      </div>
    </body>
  </html>`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!EMAIL_SENDING_ENABLED) {
      return new Response(JSON.stringify(emailSendingBlockedResult()), {
        status: 423,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const body = await req.json().catch(() => ({}));
    const email = String(body?.email ?? '').trim().toLowerCase();
    const code = String(body?.code ?? '').trim().toUpperCase();

    if (!email || !email.includes('@') || !code) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email ou code manquant/invalide.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify the code exists and is still available
    const { data: codeRow, error: codeErr } = await admin
      .from('beta_promo_codes')
      .select('*')
      .eq('code', code)
      .maybeSingle();

    if (codeErr || !codeRow) {
      return new Response(
        JSON.stringify({ success: false, error: "Ce code n'existe pas." }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (codeRow.status === 'used') {
      return new Response(
        JSON.stringify({ success: false, error: 'Ce code a déjà été utilisé.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const origin = req.headers.get('origin') || 'https://www.ebookstudio.fr';
    const activateUrl = `${origin}/activer-beta`;

    const res = await resend.emails.send({
      from: 'EbookStudio <noreply@ebookstudio.fr>',
      to: [email],
      subject: 'Votre code bêta-testeur EbookStudio Pro V2',
      html: buildHtml(email, code, activateUrl),
    });

    console.log('Beta code email sent to', email, res);

    // Record the recipient so the admin can track sent invitations
    await admin
      .from('beta_promo_codes')
      .update({ sent_to_email: email, sent_at: new Date().toISOString() })
      .eq('id', codeRow.id);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('send-beta-code error:', error);
    return new Response(
      JSON.stringify({ success: false, error: "Erreur lors de l'envoi de l'email." }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
