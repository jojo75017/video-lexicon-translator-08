import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESEND_API_URL = 'https://api.resend.com/emails';
const FROM_ADDRESS = 'EbookStudio <noreply@ebookstudio.fr>';
const SUBJECT = 'La phase bêta est terminée — voici ce qui arrive en octobre 🚀';

function buildHtml(offerUrl: string): string {
  return `
  <!DOCTYPE html>
  <html lang="fr">
    <head><meta charset="utf-8" /></head>
    <body style="margin:0;background:#FAFAFA;font-family:Arial,Helvetica,sans-serif;color:#232F3E;">
      <div style="max-width:600px;margin:0 auto;padding:24px;">
        <div style="background:#008296;color:#ffffff;padding:28px 24px;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="margin:0;font-size:22px;">Merci d'avoir été bêta-testeur 🙏</h1>
        </div>
        <div style="background:#ffffff;padding:28px 24px;border:1px solid #e6e6e6;border-top:none;border-radius:0 0 12px 12px;line-height:1.6;">
          <p>Bonjour,</p>
          <p>Vous faites partie des tout premiers à avoir testé <strong>EbookStudio Pro</strong>, et je tenais à vous remercier sincèrement pour votre confiance et vos retours.</p>
          <p>La <strong>phase bêta est aujourd'hui terminée</strong> : les accès gratuits de test prennent fin. Mais j'ai une bonne nouvelle pour vous.</p>

          <div style="background:#FAFAFA;border:2px solid #008296;border-radius:10px;padding:18px;margin:22px 0;">
            <p style="margin:0 0 8px;font-weight:bold;color:#008296;">Aujourd'hui, EbookStudio reste à 67€ à vie.</p>
            <p style="margin:0;">En <strong>octobre</strong>, je lance la nouvelle version <strong>Publication Assistée Pro</strong> (paliers 197€ et 347€), bien plus complète — à un tarif nettement supérieur. C'est donc le meilleur moment pour sécuriser votre accès à vie au prix actuel.</p>
          </div>

          <div style="text-align:center;margin:24px 0;">
            <a href="${offerUrl}" style="display:inline-block;background:#FF9E2D;color:#232F3E;font-weight:bold;padding:14px 30px;border-radius:8px;text-decoration:none;">Garder mon accès à vie — 67€</a>
          </div>

          <p>Je prépare une vidéo pour tout vous expliquer sur ce qui arrive en octobre. Restez connectés !</p>
          <p>Encore merci pour votre participation à l'aventure.</p>
          <p style="margin-top:24px;">Georges</p>
        </div>
      </div>
    </body>
  </html>`;
}

import { sendResendEmailThrottled, isQuotaExhausted } from '../_shared/resendThrottle.ts';

async function sendResendEmail(to: string, html: string) {
  const r = await sendResendEmailThrottled({ from: FROM_ADDRESS, to: [to], subject: SUBJECT, html });
  return { ok: r.ok, id: r.id, detail: r.ok ? undefined : `HTTP ${r.status ?? ''}: ${r.detail ?? ''}` };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Emails des bêta-testeurs (codes utilisés)
    const { data: codes, error: codesErr } = await admin
      .from('beta_promo_codes')
      .select('used_by_email')
      .eq('status', 'used');
    if (codesErr) throw codesErr;

    // Bêta-testeurs à conserver (accès maintenu)
    const EXCLUDED = new Set(['rachel.mlm63@gmail.com']);

    const emails = Array.from(
      new Set(
        (codes ?? [])
          .map((c: any) => (c.used_by_email ?? '').trim().toLowerCase())
          .filter((e: string) => e && e.includes('@') && !EXCLUDED.has(e))
      )
    );

    if (emails.length === 0) {
      return new Response(
        JSON.stringify({ revoked: 0, sent: 0, errors: 0, results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const origin = req.headers.get('origin') || 'https://www.ebookstudio.fr';
    const offerUrl = `${origin}/offres`;
    const html = buildHtml(offerUrl);

    const results: any[] = [];
    let revoked = 0;
    let sent = 0;
    let errors = 0;

    for (const email of emails) {
      // Ne traiter que les abonnés encore actifs (idempotent)
      const { data: sub } = await admin
        .from('subscribers')
        .select('id, status')
        .ilike('email', email)
        .maybeSingle();

      if (!sub || (sub.status !== 'active' && sub.status !== 'trialing')) {
        results.push({ email, skipped: true, reason: 'déjà inactif ou introuvable' });
        continue;
      }

      // Couper l'accès
      const { error: updErr } = await admin
        .from('subscribers')
        .update({ status: 'expired', updated_at: new Date().toISOString() })
        .eq('id', sub.id);
      if (updErr) {
        results.push({ email, revoked: false, detail: updErr.message });
        errors++;
        continue;
      }
      revoked++;

      // Envoyer l'email de clôture
      const mail = await sendResendEmail(email, html);
      if (mail.ok) sent++;
      else errors++;

      try {
        await admin.from('email_send_log').insert({
          recipient_email: email,
          template_name: 'beta-closure',
          message_id: (mail as any).id ?? null,
          status: mail.ok ? 'sent' : 'error',
          error_message: mail.ok ? null : ((mail as any).detail ?? null),
        });
      } catch (_) { /* noop */ }

      results.push({ email, revoked: true, emailSent: mail.ok });
    }

    return new Response(
      JSON.stringify({ revoked, sent, errors, total: emails.length, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('revoke-beta-access error:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
