import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { EMAIL_SENDING_ENABLED } from '../_shared/emailSendingGuard.ts';
import {
  JVZOO_AUTEUR_PRODUCT_ID, verifyCverify, extendAuteurExpiry, canGrantAuteur, canRevokeOnRefund, eventKey,
} from '../_shared/jvzipn.ts';

const text = (body: string, status = 200) => new Response(body, { status, headers: { 'Content-Type': 'text/plain' } });

function accessCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'EBK-' + Array.from(crypto.getRandomValues(new Uint8Array(6)), (b) => alphabet[b % alphabet.length]).join('');
}

async function sendLoginEmail(email: string, firstName: string, code: string, expiresAt: string) {
  if (!EMAIL_SENDING_ENABLED) return 'email disabled';
  const key = Deno.env.get('RESEND_API_KEY');
  if (!key) return 'no email key';
  const end = new Date(expiresAt).toLocaleDateString('fr-FR');
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#232F3E">
    <h1 style="color:#008296">Votre offre EbookStudio Auteur est active</h1>
    <p>Bonjour ${firstName.replace(/[<>&"]/g, '')},</p>
    <p>Merci pour votre achat. Votre accès est valable jusqu'au <strong>${end}</strong> et sera prolongé à chaque renouvellement.</p>
    <p><a href="https://ebookstudio.fr/connexion-abonne" style="display:inline-block;background:#FF9E2D;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Me connecter</a></p>
    <p><strong>Email :</strong> ${email}<br><strong>Code d'accès :</strong> ${code}</p>
    <p>L'équipe EbookStudio</p></div>`;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'EbookStudio <noreply@ebookstudio.fr>', to: [email], subject: 'Vos accès EbookStudio Auteur', html }),
  });
  return res.ok ? 'email sent' : `email failed ${res.status}`;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return text('Method not allowed', 405);
  const secret = Deno.env.get('JVZIPN_SECRET_KEY') ?? '';
  if (!secret) return text('Not configured', 503);

  const form = new URLSearchParams(await req.text());
  const f: Record<string, string> = {};
  form.forEach((v, k) => { f[k] = v; });
  if (!(await verifyCverify(f, secret))) return text('Verification failed', 403);

  const type = String(f.transaction_type ?? '').toUpperCase();
  const email = String(f.customer_email ?? '').trim().toLowerCase();
  if (String(f.product_id ?? '') !== JVZOO_AUTEUR_PRODUCT_ID) return text('OK ignored product');
  if (!f.transaction_id || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return text('Invalid payload', 400);

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
  const key = eventKey(f);
  const { error: dupError } = await db.from('jvzoo_ipn_events').insert({
    event_key: key, transaction_id: f.transaction_id, transaction_type: type, paykey: f.paykey ?? null,
    product_id: f.product_id, email, total: Number(f.total) || 0,
  });
  if (dupError) {
    if (dupError.code === '23505') return text('OK duplicate');
    return text('Storage error', 500);
  }
  const finish = (outcome: string, detail = '') =>
    db.from('jvzoo_ipn_events').update({ outcome, detail }).eq('event_key', key);

  try {
    const { data: sub } = await db.from('subscribers')
      .select('id,access_code,status,plan_type,plan_tier,expires_at,stripe_subscription_id').eq('email', email).maybeSingle();
    const { data: link } = await db.from('jvzoo_access').select('paykey,created_subscriber').eq('email', email).maybeSingle();

    if (type === 'SALE' || type === 'BILL') {
      const paid = String(f.status ?? '').toUpperCase() === 'COMPLETED' && Number(f.total) > 0;
      if (!paid) { await finish('ignored', 'not completed'); return text('OK not completed'); }
      if (!canGrantAuteur(sub)) { await finish('kept', 'existing higher or Stripe right preserved'); return text('OK preserved'); }
      const code = sub?.access_code || accessCode();
      const expiresAt = extendAuteurExpiry(sub?.status === 'active' ? sub.expires_at : null);
      const { error } = await db.from('subscribers').upsert({
        email, access_code: code, status: 'active', plan_type: 'annual', plan_tier: 'auteur', expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });
      if (error) throw error;
      await db.from('jvzoo_access').upsert({
        email, paykey: f.paykey || f.transaction_id, created_subscriber: link?.created_subscriber ?? !sub,
        refunded_at: null, updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });
      const mail = type === 'SALE' ? await sendLoginEmail(email, f.customer_first_name ?? '', code, expiresAt) : '';
      await finish('granted', `${expiresAt} ${mail}`.trim());
      return text('OK');
    }

    if (type === 'RFND') {
      if (!canRevokeOnRefund(sub, !!link)) { await finish('kept', 'refund: no JVZoo-only Auteur right to revoke'); return text('OK preserved'); }
      const now = new Date().toISOString();
      const { error } = await db.from('subscribers').update({ status: 'cancelled', expires_at: now, updated_at: now }).eq('id', sub!.id);
      if (error) throw error;
      await db.from('jvzoo_access').update({ refunded_at: now, updated_at: now }).eq('email', email);
      await finish('revoked');
      return text('OK');
    }

    // Cancellation of future rebills (or any other type): keep the already-paid period.
    await finish('recorded', 'paid period kept');
    return text('OK');
  } catch (e) {
    // Allow JVZoo's retry to process again.
    await db.from('jvzoo_ipn_events').delete().eq('event_key', key);
    console.error('jvzoo-ipn failed', e);
    return text('Processing error', 500);
  }
});
