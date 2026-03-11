import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, bookTitle, bookAuthor, downloadUrl, coverUrl } = await req.json();

    if (!email || !downloadUrl || !bookTitle) {
      return new Response(
        JSON.stringify({ error: "email, bookTitle et downloadUrl sont requis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY non configurée");
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#ffffff;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-block;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:50%;width:64px;height:64px;line-height:64px;font-size:28px;margin-bottom:16px;">✅</div>
      <h1 style="font-size:24px;font-weight:800;color:#111;margin:0 0 8px;">Votre livre audio est prêt !</h1>
      <p style="color:#6b7280;font-size:15px;margin:0;">Merci pour votre achat. Voici votre lien de téléchargement.</p>
    </div>

    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:16px;padding:24px;margin-bottom:24px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          ${coverUrl ? `<td style="width:80px;vertical-align:top;padding-right:16px;">
            <img src="${coverUrl}" alt="${bookTitle}" style="width:72px;height:72px;border-radius:12px;object-fit:cover;border:1px solid #e5e7eb;" />
          </td>` : ''}
          <td style="vertical-align:top;">
            <h2 style="font-size:18px;font-weight:700;color:#111;margin:0 0 4px;">${bookTitle}</h2>
            <p style="color:#6b7280;font-size:13px;margin:0 0 8px;">Par ${bookAuthor || 'EbookStudio'}</p>
            <span style="display:inline-block;background:#fef3c7;color:#92400e;font-size:11px;font-weight:600;padding:2px 10px;border-radius:20px;">🎧 MP3 Haute Définition</span>
          </td>
        </tr>
      </table>
    </div>

    <div style="text-align:center;margin-bottom:32px;">
      <a href="${downloadUrl}" 
         style="display:inline-block;background:linear-gradient(135deg,#10b981,#059669);color:#fff;font-size:16px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:12px;box-shadow:0 4px 14px rgba(16,185,129,0.3);">
        📥 Télécharger mon livre audio
      </a>
      <p style="color:#9ca3af;font-size:12px;margin-top:12px;">Ce lien reste valable. Conservez cet email pour re-télécharger.</p>
    </div>

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:#065f46;">
        <strong>🛡️ Garantie 30 jours</strong> — Si vous n'êtes pas satisfait, contactez-nous pour un remboursement intégral.
      </p>
    </div>

    <div style="text-align:center;border-top:1px solid #e5e7eb;padding-top:20px;">
      <p style="color:#9ca3af;font-size:11px;margin:0;">
        EbookStudio • Audio IA Premium<br/>
        Vous recevez cet email suite à votre achat.
      </p>
    </div>
  </div>
</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "EbookStudio <noreply@ebookstudio.fr>",
        to: [email],
        subject: `📥 Votre livre audio "${bookTitle}" est prêt !`,
        html: htmlContent,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Resend error: ${errText}`);
    }

    const data = await res.json();
    return new Response(JSON.stringify({ ok: true, id: data.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e: any) {
    console.error("send-audiobook-delivery error:", e);
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
