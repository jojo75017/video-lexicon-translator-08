// Deuxième vague — nouvelle histoire pour openers non-cliqueurs
// qui n'ont pas ouvert/cliqué la v1. Angle : le "premier chapitre" + promo été 59€.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { sendResendEmailThrottled, isQuotaExhausted } from "../_shared/resendThrottle.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FROM_ADDRESS = "Georges Boubet <noreply@ebookstudio.fr>";
const EXCLUDED_EMAILS = ["boubetgeorges@gmail.com"];
const TEMPLATE_NAME = "marie-rachel-story-v2";
const PREVIOUS_TEMPLATE = "marie-rachel-story-v1";
const SUBJECT = "Publiez votre livre sur Amazon en 7 jours";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const TRACK_CLICK = `${SUPABASE_URL}/functions/v1/track-email-click`;
const CHECKOUT_LINK = "https://www.ebookstudio.fr/promo/commande";

function trackedUrl(email: string, dest: string): string {
  return `${TRACK_CLICK}?e=${encodeURIComponent(email)}&s=11&u=${encodeURIComponent(dest)}&t=${encodeURIComponent(TEMPLATE_NAME)}`;
}

function buildHtml(email: string): string {
  // Direct-to-payment: prefill email + auto-open Stripe checkout on arrival.
  const dest = `${CHECKOUT_LINK}?autopay=1&email=${encodeURIComponent(email)}`;
  const cta = trackedUrl(email, dest);
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; color:#232F3E; max-width:560px; margin:0 auto; line-height:1.6; font-size:16px;">

    <p style="margin:0 0 18px; color:#555; font-size:15px;">
      Vous avez une idée de livre, mais ni le temps ni l’envie de passer des mois à l’écrire et à le mettre en page ?
    </p>
    <p style="margin:0 0 22px;">
      EbookStudio vous accompagne de la première idée jusqu’au fichier prêt à publier sur Amazon KDP.
    </p>

    <div style="background:#FAFAFA; border:1px solid #eee; border-radius:8px; padding:18px 22px; margin:20px 0;">
      <p style="margin:0 0 10px; font-weight:bold; color:#008296;">Vous obtenez notamment :</p>
      <p style="margin:6px 0;">✅ un <strong>plan de livre structuré</strong> en quelques minutes ;</p>
      <p style="margin:6px 0;">✅ des <strong>chapitres générés et personnalisables</strong> ;</p>
      <p style="margin:6px 0;">✅ une <strong>couverture adaptée à Amazon KDP</strong> ;</p>
      <p style="margin:6px 0;">✅ des <strong>fichiers Word et PDF</strong> prêts à être utilisés ;</p>
      <p style="margin:6px 0;">✅ un <strong>accompagnement étape par étape</strong>, sans logiciel à installer.</p>
    </div>

    <p style="margin:20px 0 22px;">
      Jusqu’au <strong>31 août</strong>, l’accès à vie est proposé à <strong>59&nbsp;€</strong>, en un seul paiement et sans abonnement.
    </p>
    <p style="margin:0 0 22px; color:#555; font-size:15px;">
      Vous bénéficierez également automatiquement de la future <strong>V3</strong>, qui sera commercialisée <strong>120&nbsp;€</strong>, sans rien avoir à repayer.
    </p>

    <p style="text-align:center; margin:28px 0;">
      <a href="${cta}"
         style="background:#FF9E2D; color:#232F3E; text-decoration:none; padding:16px 36px; border-radius:8px; font-weight:bold; font-size:17px; display:inline-block;">
        Commencer mon livre maintenant
      </a>
    </p>

    <p style="margin:0 0 22px;">
      Vous pouvez ainsi commencer dès aujourd’hui, avancer à votre rythme et transformer enfin votre idée en un véritable livre publié.
    </p>

    <div style="background:#f0fdfa; border:1px solid #99f6e4; border-radius:8px; padding:14px 18px; margin:20px 0;">
      <p style="margin:0; font-size:14px; color:#0f766e;">
        <strong>Garantie 30 jours.</strong> Vous testez EbookStudio, et si vous n’êtes pas satisfait, je vous rembourse intégralement. Aucun risque pour vous.
      </p>
    </div>

    <p style="margin:0;">À très vite,<br/>
    <strong>Georges</strong><br/>EbookStudio</p>

    <p style="font-size:13px; color:#777; border-top:1px solid #eee; padding-top:14px; margin-top:24px;">
      PS : Vous avez une question avant de vous lancer ? Répondez simplement à cet email, je vous répondrai personnellement.
    </p>
  </div>`;
}

async function sendResendEmail(to: string, subject: string, html: string) {
  const r = await sendResendEmailThrottled({ from: FROM_ADDRESS, to: [to], subject, html });
  return { ok: r.ok, id: r.id, detail: r.ok ? undefined : `HTTP ${r.status ?? ""}: ${r.detail ?? ""}` };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");

    let testMode = false;
    let onlyPreviousSent = true; // par défaut : cible ceux qui ont reçu v1 sans cliquer
    try {
      const body = await req.json();
      testMode = body?.test === true;
      if (typeof body?.onlyPreviousSent === "boolean") onlyPreviousSent = body.onlyPreviousSent;
    } catch (_) {}

    const { data: opens, error: oErr } = await supabase.from("email_opens").select("prospect_email");
    if (oErr) throw oErr;
    const { data: clicks, error: cErr } = await supabase.from("email_clicks").select("prospect_email");
    if (cErr) throw cErr;

    const norm = (e: string) => (e ?? "").trim().toLowerCase();
    const clickers = new Set((clicks ?? []).map((c: any) => norm(c.prospect_email)));

    // Ceux qui ont reçu la v1
    const { data: v1Sent } = await supabase
      .from("email_send_log")
      .select("recipient_email")
      .eq("template_name", PREVIOUS_TEMPLATE)
      .eq("status", "sent");
    const v1Set = new Set((v1Sent ?? []).map((s: any) => norm(s.recipient_email)));

    // Ceux qui ont déjà reçu la v2 (anti-doublon)
    const { data: v2Sent } = await supabase
      .from("email_send_log")
      .select("recipient_email")
      .eq("template_name", TEMPLATE_NAME)
      .eq("status", "sent");
    const v2Set = new Set((v2Sent ?? []).map((s: any) => norm(s.recipient_email)));

    const openerPool = Array.from(new Set((opens ?? []).map((o: any) => norm(o.prospect_email))));

    let recipients = openerPool.filter((e) =>
      e && e.includes("@") &&
      !clickers.has(e) &&
      !v2Set.has(e) &&
      !EXCLUDED_EMAILS.includes(e) &&
      (!onlyPreviousSent || v1Set.has(e)),
    );

    if (testMode) recipients = ["boubetgeorges@gmail.com"];

    const results: any[] = [];
    for (const to of recipients) {
      const result = await sendResendEmail(to, SUBJECT, buildHtml(to));
      results.push({ to, ...result });
      try {
        await supabase.from("email_send_log").insert({
          recipient_email: to,
          template_name: TEMPLATE_NAME,
          message_id: result.id ?? null,
          status: result.ok ? "sent" : "error",
          error_message: result.ok ? null : (result.detail ?? null),
        });
      } catch (_) {}
      if (isQuotaExhausted()) { console.warn("[marie-rachel-v2] Resend daily quota atteint, arrêt"); break; }
    }

    const sent = results.filter((r) => r.ok).length;
    return new Response(
      JSON.stringify({
        target: onlyPreviousSent ? "v1_recipients_non_clickers" : "all_openers_non_clickers",
        total: recipients.length,
        sent,
        testMode,
        template: TEMPLATE_NAME,
        results: results.slice(0, 30),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500,
    });
  }
});
