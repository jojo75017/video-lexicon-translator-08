import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';
import { Resend } from 'npm:resend@2.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ALREADY_USED_MSG =
  "Ce code a déjà été utilisé. Contactez-nous si vous pensez qu'il s'agit d'une erreur à cette adresse : tranboub75017@gmail.com";
const INVALID_MSG =
  "Code invalide. Vérifiez votre code et réessayez. Si le problème persiste contactez-nous.";
const SUCCESS_MSG =
  "Félicitations ! Votre accès gratuit à vie à EbookStudio Pro V2 est activé. Bienvenue dans la communauté !";

function generateAccessCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'EBK-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function sendWelcomeEmail(email: string, accessCode: string, loginUrl: string) {
  const html = `
  <!DOCTYPE html>
  <html lang="fr">
    <head><meta charset="utf-8" /></head>
    <body style="margin:0;background:#FAFAFA;font-family:Arial,Helvetica,sans-serif;color:#232F3E;">
      <div style="max-width:600px;margin:0 auto;padding:24px;">
        <div style="background:#008296;color:#ffffff;padding:28px 24px;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="margin:0;font-size:22px;">Bienvenue chez EbookStudio Pro V2</h1>
          <p style="margin:8px 0 0;opacity:.9;">Votre accès est activé</p>
        </div>
        <div style="background:#ffffff;padding:28px 24px;border:1px solid #e6e6e6;border-top:none;border-radius:0 0 12px 12px;">
          <p>Bonjour,</p>
          <p>Votre accès gratuit à vie à <strong>EbookStudio Pro V2</strong> est maintenant actif. Vous pouvez vous connecter immédiatement et commencer à créer vos premiers ebooks KDP.</p>
          <div style="background:#FAFAFA;border:2px solid #008296;border-radius:10px;padding:18px;margin:22px 0;text-align:center;">
            <div style="font-size:13px;color:#555;margin-bottom:8px;">Vos identifiants de connexion</div>
            <div style="font-size:14px;margin-bottom:6px;">Email : <strong>${email}</strong></div>
            <div style="font-size:13px;color:#555;">Code d'accès :</div>
            <div style="font-size:28px;font-weight:bold;color:#008296;letter-spacing:3px;font-family:monospace;">${accessCode}</div>
          </div>
          <div style="text-align:center;margin:24px 0;">
            <a href="${loginUrl}" style="display:inline-block;background:#FF9E2D;color:#232F3E;font-weight:bold;padding:12px 28px;border-radius:8px;text-decoration:none;">Me connecter maintenant</a>
          </div>
          <p>En tant que bêta-testeur, nous comptons sur votre retour honnête après 7 jours d'utilisation.</p>
          <p>Merci de votre confiance et bienvenue dans la communauté.</p>
          <p style="margin-top:24px;">Georges</p>
        </div>
      </div>
    </body>
  </html>`;

  try {
    const res = await resend.emails.send({
      from: 'EbookStudio <noreply@ebookstudio.fr>',
      to: [email],
      subject: 'Bienvenue chez EbookStudio Pro V2 — Votre accès est activé',
      html,
    });
    console.log('Welcome email sent to', email, res);
    return true;
  } catch (e) {
    console.error('Failed to send welcome email:', e);
    return false;
  }
}

// Adresses qui reçoivent une notification à chaque activation bêta
const ADMIN_NOTIFY_EMAILS = ['boubetgeorges@gmail.com', 'tranboub75017@gmail.com'];

async function notifyAdmin(email: string, code: string, accessCode: string) {
  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;color:#232F3E;max-width:600px;margin:0 auto;">
    <h2 style="color:#008296;">Nouvelle activation bêta-testeur 🎉</h2>
    <p>Un bêta-testeur vient d'activer son accès gratuit à vie :</p>
    <ul>
      <li><strong>Email :</strong> ${email}</li>
      <li><strong>Code bêta utilisé :</strong> ${code}</li>
      <li><strong>Code d'accès attribué :</strong> ${accessCode}</li>
      <li><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</li>
    </ul>
  </div>`;
  try {
    const res = await resend.emails.send({
      from: 'EbookStudio <noreply@ebookstudio.fr>',
      to: ADMIN_NOTIFY_EMAILS,
      subject: `Nouveau bêta-testeur : ${email}`,
      html,
    });
    console.log('Admin notification sent', res);
  } catch (e) {
    console.error('Failed to send admin notification:', e);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body?.email ?? '').trim().toLowerCase();
    const code = String(body?.code ?? '').trim().toUpperCase();

    if (!email || !email.includes('@') || !code) {
      return new Response(
        JSON.stringify({ success: false, reason: 'invalid', error: INVALID_MSG }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Look up the code
    const { data: codeRow, error: codeErr } = await admin
      .from('beta_promo_codes')
      .select('*')
      .eq('code', code)
      .maybeSingle();

    if (codeErr) {
      console.error('Code lookup error:', codeErr);
      return new Response(
        JSON.stringify({ success: false, reason: 'error', error: INVALID_MSG }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (!codeRow) {
      return new Response(
        JSON.stringify({ success: false, reason: 'invalid', error: INVALID_MSG }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (codeRow.status === 'used') {
      return new Response(
        JSON.stringify({ success: false, reason: 'used', error: ALREADY_USED_MSG }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Atomically claim the code (only succeeds if still available)
    const { data: claimed, error: claimErr } = await admin
      .from('beta_promo_codes')
      .update({ status: 'used', used_by_email: email, used_at: new Date().toISOString() })
      .eq('id', codeRow.id)
      .eq('status', 'available')
      .select()
      .maybeSingle();

    if (claimErr || !claimed) {
      // Lost the race — code was just used
      return new Response(
        JSON.stringify({ success: false, reason: 'used', error: ALREADY_USED_MSG }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Create or update the subscriber with lifetime access
    let accessCode = generateAccessCode();

    const { data: existing } = await admin
      .from('subscribers')
      .select('id, access_code')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      accessCode = existing.access_code || accessCode;
      await admin
        .from('subscribers')
        .update({
          plan_type: 'lifetime',
          plan_tier: 'vip',
          status: 'active',
          license_type: 'commercial',
          access_code: accessCode,
          expires_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      await admin.from('subscribers').insert({
        email,
        plan_type: 'lifetime',
        plan_tier: 'vip',
        status: 'active',
        license_type: 'commercial',
        access_code: accessCode,
      });
    }

    const origin = req.headers.get('origin') || 'https://www.ebookstudio.fr';
    const loginUrl = `${origin}/subscription`;

    await sendWelcomeEmail(email, accessCode, loginUrl);
    await notifyAdmin(email, code, accessCode);

    return new Response(
      JSON.stringify({ success: true, message: SUCCESS_MSG, access_code: accessCode }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('redeem-beta-code error:', error);
    return new Response(
      JSON.stringify({ success: false, reason: 'error', error: INVALID_MSG }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
