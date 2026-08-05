import { createClient } from 'npm:@supabase/supabase-js@2';
import { Resend } from 'npm:resend@2.0.0';
import { pushToSystemeIo } from '../_shared/systemeio.ts';
import { EMAIL_SENDING_ENABLED } from '../_shared/emailSendingGuard.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PLATFORMS = ['instagram', 'tiktok', 'youtube', 'autre'];

function buildHtml(name: string, kitUrl: string, joinUrl: string, pdfUrl: string) {
  const hello = name ? `Salut ${name} 👋` : 'Salut 👋';
  return `
  <!DOCTYPE html>
  <html lang="fr"><head><meta charset="utf-8" /></head>
  <body style="margin:0;background:#FAFAFA;font-family:Arial,Helvetica,sans-serif;color:#232F3E;">
    <div style="max-width:600px;margin:0 auto;padding:24px;">
      <div style="background:#008296;color:#fff;padding:28px 24px;border-radius:12px 12px 0 0;text-align:center;">
        <h1 style="margin:0;font-size:22px;">Bienvenue dans le programme Ambassadeur 🚀</h1>
      </div>
      <div style="background:#fff;padding:28px 24px;border:1px solid #e6e6e6;border-top:none;border-radius:0 0 12px 12px;">
        <p>${hello}</p>
        <p>Merci pour ta candidature ! Tu fais maintenant partie des ambassadeurs <strong>Ebookstudio Pro</strong> 🎉</p>
        <p>Tu touches <strong>30% de commission</strong> sur chaque vente générée via ton lien. Voici comment activer ton lien de suivi perso :</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${joinUrl}" style="display:inline-block;background:#FF9E2D;color:#232F3E;font-weight:bold;padding:14px 32px;border-radius:8px;text-decoration:none;">Activer mon lien ambassadeur</a>
        </div>
        <p>Tu y trouveras aussi le kit complet : <a href="${kitUrl}" style="color:#008296;">scripts TikTok/Reels + visuels</a>.</p>
        <p>Et le dossier PDF récap : <a href="${pdfUrl}" style="color:#008296;">Dossier Influenceur (PDF)</a></p>
        <p style="margin-top:24px;">À très vite,<br/>Georges — Ebookstudio</p>
      </div>
    </div>
  </body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body?.email ?? '').trim().toLowerCase();
    const name = String(body?.name ?? '').trim().slice(0, 120);
    const handle = String(body?.handle ?? '').trim().slice(0, 120);
    const niche = String(body?.niche ?? '').trim().slice(0, 160);
    let platform = String(body?.platform ?? 'instagram').trim().toLowerCase();
    if (!PLATFORMS.includes(platform)) platform = 'autre';

    if (!email || !email.includes('@') || (!handle && !name)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email et pseudo requis.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Find an admin to own the outreach record
    const { data: adminRow } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin')
      .limit(1)
      .maybeSingle();

    const ownerId = adminRow?.user_id;

    if (ownerId) {
      // Avoid duplicates for the same owner + email
      const { data: existing } = await supabase
        .from('ambassador_outreach')
        .select('id')
        .eq('owner_id', ownerId)
        .eq('email', email)
        .maybeSingle();

      if (existing?.id) {
        await supabase
          .from('ambassador_outreach')
          .update({
            status: 'inscrit',
            handle: handle || name,
            platform,
            niche: niche || null,
            last_contact_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        await supabase.from('ambassador_outreach').insert({
          owner_id: ownerId,
          handle: handle || name,
          platform,
          niche: niche || null,
          email,
          status: 'inscrit',
          source: 'self_service',
          last_contact_at: new Date().toISOString(),
        });
      }
    }

    // Pousse le contact dans Systeme.io avec des tags pour déclencher les automations.
    // "promoteur-interesse" = candidat à la promotion ; "ambassadeur-{plateforme}" = segmentation réseau.
    const sioTags = [
      'promoteur-interesse',
      'ambassadeur-ebookstudio',
      `ambassadeur-${platform}`,
    ];
    if (niche) sioTags.push('client-prospect');
    const systemeio = EMAIL_SENDING_ENABLED ? await pushToSystemeIo(
      email,
      name || handle,
      sioTags,
      [
        ...(handle ? [{ slug: 'pseudo', value: handle }] : []),
        ...(niche ? [{ slug: 'niche', value: niche }] : []),
      ],
    ) : { ok: false, detail: 'domain_pending_validation' };

    const origin = req.headers.get('origin') || 'https://ebookstudio.fr';
    const kitUrl = `${origin}/influenceurs`;
    const joinUrl = `${origin}/influenceurs`;
    const pdfUrl = `${origin}/kit-influenceurs.pdf`;

    const resendKey = Deno.env.get('RESEND_API_KEY');
    if (EMAIL_SENDING_ENABLED && resendKey) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: 'Ebookstudio <noreply@ebookstudio.fr>',
        to: [email],
        subject: 'Bienvenue ambassadeur Ebookstudio — active ton lien 🚀',
        html: buildHtml(name || handle, kitUrl, joinUrl, pdfUrl),
      });
    }

    return new Response(
      JSON.stringify({ success: true, systemeio: systemeio.ok, systemeio_detail: systemeio.detail }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('submit-ambassador-application error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Erreur lors de la candidature.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
