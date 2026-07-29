// Envoi de l'offre passerelle V2 → V3 à tous les prospects
// qui n'ont JAMAIS cliqué sur un email précédent.
//
// - Corps HTML autonome (reprend les blocs clés de /v3/offre)
// - Trackage clic via track-email-click
// - Log dans email_send_log + relance_sent_at sur sales_prospects
// - Reprise après quota Resend
// - Support test: { test: true } => envoie uniquement à boubetgeorges@gmail.com

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { sendResendEmailThrottled, isQuotaExhausted } from "../_shared/resendThrottle.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FROM_ADDRESS = "Georges Boubet <noreply@ebookstudio.fr>";
const EXCLUDED = ["boubetgeorges@gmail.com"];

const TEMPLATE_NAME = "v2-v3-passerelle-oct2026";
const SUBJECT = "V2 maintenant, premier plan V3 offert le 1er octobre";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const TRACK_CLICK = `${SUPABASE_URL}/functions/v1/track-email-click`;
const OFFRE_LINK = "https://video-lexicon-translator-08.lovable.app/v3/offre";
const PAY_LINK = "https://www.trafic-affiliation.com/ebookstudiopv";

function trackedUrl(email: string, dest: string): string {
  return `${TRACK_CLICK}?e=${encodeURIComponent(email)}&s=1&u=${encodeURIComponent(dest)}&t=${encodeURIComponent(TEMPLATE_NAME)}`;
}

export function buildHtml(email: string): string {
  const cta = trackedUrl(email, OFFRE_LINK);
  const pay = trackedUrl(email, PAY_LINK);
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0b1220;">
<div style="max-width:640px;margin:0 auto;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#232F3E;">

  <div style="background:linear-gradient(135deg,#0b1220 0%,#0f2a3a 100%);padding:36px 28px;text-align:center;color:#fff;">
    <div style="display:inline-block;background:#FF9E2D;color:#0b1220;font-weight:bold;padding:6px 14px;border-radius:20px;font-size:12px;letter-spacing:1px;">OFFRE PASSERELLE V2 → V3</div>
    <h1 style="margin:16px 0 8px;font-size:28px;line-height:1.25;">Prenez la V2 maintenant,<br><span style="color:#FF9E2D;">la V3 arrive sans surcoût</span></h1>
    <p style="margin:0;font-size:16px;color:#cfe6ea;line-height:1.5;">Accès V2 immédiat · tarif avantageux · premier plan V3 inclus le 1er octobre 2026</p>
  </div>

  <div style="padding:28px;">
    <p style="font-size:16px;line-height:1.6;margin:0 0 14px;">Bonjour,</p>
    <p style="font-size:16px;line-height:1.6;margin:0 0 14px;">
      La V3 ouvrira officiellement le <strong>1er octobre 2026</strong>. En attendant, vous n'êtes pas obligé d'attendre : vous pouvez rejoindre <strong>EbookStudio V2 maintenant</strong>, à un tarif intéressant, et commencer vos livres tout de suite.
    </p>
    <p style="font-size:16px;line-height:1.6;margin:0 0 14px;">
      Le plus important : si vous prenez la V2 avec cette offre, le <strong>premier plan V3 sera ajouté à votre accès sans surcoût</strong> au lancement.
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;">
      <tr><td style="border-radius:10px;background:#FF9E2D;">
        <a href="${pay}" style="display:inline-block;padding:16px 32px;color:#0b1220;text-decoration:none;font-weight:bold;font-size:17px;border-radius:10px;">Je prends la V2 maintenant →</a>
      </td></tr>
    </table>

    <div style="background:#FFF7E6;border-left:4px solid #FF9E2D;padding:14px 18px;border-radius:6px;margin:18px 0;font-size:14px;line-height:1.6;">
      🎁 <strong>Ce que cette offre vous donne :</strong><br>
      ✅ Accès immédiat à EbookStudio V2 pour créer sans attendre octobre<br>
      ✅ Tarif avantageux avant le lancement officiel de la V3<br>
      ✅ Premier plan V3 inclus le 1er octobre — <strong>sans supplément</strong><br>
      ✅ Email de rappel le jour de l'ouverture V3
    </div>

    <h3 style="font-size:18px;margin:22px 0 10px;color:#0b1220;">Pourquoi commencer avec la V2 maintenant ?</h3>
    <ul style="font-size:15px;line-height:1.75;padding-left:20px;margin:0 0 18px;">
      <li>Vous commencez vos livres immédiatement, sans attendre le 1er octobre.</li>
      <li>Vous profitez du tarif actuel avant l'arrivée des nouveaux plans.</li>
      <li>Vous gardez votre accès V2 et recevez le premier plan V3 au lancement.</li>
      <li>La V3 apportera ensuite le nouveau workflow, les agents IA enrichis, les couvertures pro et les modules avancés.</li>
    </ul>

    <p style="font-size:15px;line-height:1.6;margin:18px 0;">
      Si vous voulez relire la page avant de vous inscrire :
      <br><a href="${cta}" style="color:#008296;">👉 Voir la page d'explication V2 → V3</a>
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px auto 8px;">
      <tr><td style="border-radius:10px;background:#008296;">
        <a href="${pay}" style="display:inline-block;padding:14px 28px;color:#fff;text-decoration:none;font-weight:bold;font-size:16px;border-radius:10px;">Rejoindre EbookStudio V2 →</a>
      </td></tr>
    </table>

    <p style="font-size:14px;line-height:1.6;color:#555;margin:22px 0 0;">
      Répondez simplement à cet email si vous avez une question — je lis tout personnellement.
    </p>
    <p style="font-size:14px;line-height:1.6;margin:14px 0 0;">
      Bien à vous,<br><strong>Georges Boubet</strong> — EbookStudio
    </p>
  </div>

  <div style="background:#FAFAFA;padding:16px 28px;border-top:1px solid #eee;font-size:12px;color:#888;text-align:center;line-height:1.6;">
    Vous recevez cet email car vous avez manifesté un intérêt pour EbookStudio.<br>
    Pour ne plus recevoir ces emails, répondez "STOP" à cet email.
  </div>
</div>
<img src="${SUPABASE_URL}/functions/v1/track-email-open?e=${encodeURIComponent(email)}&s=1&t=${encodeURIComponent(TEMPLATE_NAME)}" width="1" height="1" alt="" style="display:none;" />
</body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    let testMode = false;
    let limit: number | null = null;
    try {
      const body = await req.json();
      testMode = body?.test === true;
      if (typeof body?.limit === "number") limit = body.limit;
    } catch { /* no body */ }

    // Prospects actifs
    const { data: prospects, error: pErr } = await supabase
      .from("sales_prospects")
      .select("email")
      .eq("unsubscribed", false);
    if (pErr) throw pErr;

    // Cliqueurs = à exclure (ils sont déjà sur d'autres séquences)
    const { data: clicks } = await supabase
      .from("email_clicks")
      .select("prospect_email");
    const norm = (e: string) => (e ?? "").trim().toLowerCase();
    const clickers = new Set((clicks ?? []).map((c: any) => norm(c.prospect_email)));

    // Déjà envoyés (reprise après quota)
    const { data: alreadySent } = await supabase
      .from("email_send_log")
      .select("recipient_email")
      .eq("template_name", TEMPLATE_NAME)
      .eq("status", "sent");
    const sentSet = new Set((alreadySent ?? []).map((s: any) => norm(s.recipient_email)));

    let recipients = Array.from(new Set(
      (prospects ?? [])
        .map((p: any) => norm(p.email))
        .filter((e: string) =>
          e && e.includes("@") &&
          !clickers.has(e) &&
          !sentSet.has(e) &&
          !EXCLUDED.includes(e),
        ),
    ));

    if (testMode) recipients = ["boubetgeorges@gmail.com"];
    if (limit && limit > 0) recipients = recipients.slice(0, limit);

    const results: any[] = [];
    for (const to of recipients) {
      const r = await sendResendEmailThrottled({
        from: FROM_ADDRESS,
        to: [to],
        subject: SUBJECT,
        html: buildHtml(to),
      });
      results.push({ to, ok: r.ok, id: r.id });
      try {
        await supabase.from("email_send_log").insert({
          recipient_email: to,
          template_name: TEMPLATE_NAME,
          message_id: r.id ?? null,
          status: r.ok ? "sent" : "error",
          error_message: r.ok ? null : `HTTP ${r.status ?? ""}: ${r.detail ?? ""}`,
        });
        if (r.ok) {
          await supabase.from("sales_prospects")
            .update({ relance_sent_at: new Date().toISOString(), relance_status: TEMPLATE_NAME })
            .eq("email", to);
        }
      } catch { /* noop */ }
      if (isQuotaExhausted()) { console.warn("[v3-offre-relance] Resend quota atteint, arrêt"); break; }
    }

    const sent = results.filter((r) => r.ok).length;
    return new Response(JSON.stringify({
      template: TEMPLATE_NAME,
      target: "non_clickers_all_prospects",
      total: recipients.length,
      sent,
      testMode,
      results: results.slice(0, 50),
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
