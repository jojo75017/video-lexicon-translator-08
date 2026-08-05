import { Resend } from 'npm:resend@2.0.0';
import { EMAIL_SENDING_ENABLED, emailSendingBlockedResult } from '../_shared/emailSendingGuard.ts';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function buildHtml(name: string, link: string, commission: string, commissionV3: string, kitUrl: string, pdfUrl: string) {
  const hello = name ? `Salut ${name} 👋` : 'Salut 👋';
  return `
  <!DOCTYPE html>
  <html lang="fr">
    <head><meta charset="utf-8" /></head>
    <body style="margin:0;background:#FAFAFA;font-family:Arial,Helvetica,sans-serif;color:#232F3E;">
      <div style="max-width:600px;margin:0 auto;padding:24px;">
        <div style="background:#008296;color:#ffffff;padding:28px 24px;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="margin:0;font-size:22px;">Programme Ambassadeur EbookStudio 🚀</h1>
        </div>
        <div style="background:#ffffff;padding:28px 24px;border:1px solid #e6e6e6;border-top:none;border-radius:0 0 12px 12px;">
          <p>${hello}</p>
          <p>J'adore ton contenu ! Je lance <strong>EbookStudio Pro</strong>, un outil qui génère un ebook complet (plan, chapitres, couverture Amazon KDP, SEO) en 30 min.</p>
          <p>Je te propose mon <strong>programme ambassadeur</strong> : <strong>30% de commission</strong> par vente, soit <strong>${commission}</strong> pour toi à chaque achat via ton lien (et <strong>${commissionV3}/vente</strong> dès octobre).</p>
          <div style="background:#FAFAFA;border:2px solid #008296;border-radius:10px;padding:18px;margin:22px 0;text-align:center;">
            <div style="font-size:13px;color:#555;margin-bottom:6px;">Ton lien perso de suivi</div>
            <a href="${link}" style="font-size:15px;font-weight:bold;color:#008296;word-break:break-all;">${link}</a>
          </div>
          <div style="text-align:center;margin:24px 0;">
            <a href="${kitUrl}" style="display:inline-block;background:#FF9E2D;color:#232F3E;font-weight:bold;padding:12px 28px;border-radius:8px;text-decoration:none;">Voir le kit complet (scripts + visuels)</a>
          </div>
          <p>Tu peux aussi télécharger le dossier complet ici : <a href="${pdfUrl}" style="color:#008296;">Dossier Influenceur (PDF)</a></p>
          <p>Pas de cash en avance, suivi automatique. Dis-moi si tu veux tester 🙌</p>
          <p style="margin-top:24px;">Georges — EbookStudio</p>
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
    const name = String(body?.name ?? '').trim();
    const link = String(body?.link ?? '').trim();
    const commission = String(body?.commission ?? '20,10 €').trim();
    const commissionV3 = String(body?.commissionV3 ?? '59,10 €').trim();

    if (!email || !email.includes('@') || !link) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email ou lien manquant/invalide.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const origin = req.headers.get('origin') || 'https://www.ebookstudio.fr';
    const kitUrl = `${origin}/influenceurs`;
    const pdfUrl = `${origin}/kit-influenceurs.pdf`;

    const res = await resend.emails.send({
      from: 'EbookStudio <noreply@ebookstudio.fr>',
      to: [email],
      subject: 'Deviens ambassadeur EbookStudio — 30% de commission 🚀',
      html: buildHtml(name, link, commission, commissionV3, kitUrl, pdfUrl),
    });

    console.log('Influencer invite sent to', email, res);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('send-influencer-invite error:', error);
    return new Response(
      JSON.stringify({ success: false, error: "Erreur lors de l'envoi de l'email." }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
