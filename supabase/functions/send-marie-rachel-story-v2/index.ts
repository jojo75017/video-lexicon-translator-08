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
const SUBJECT = "Votre livre publié sur Amazon en 7 jours (à 59€)";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const TRACK_CLICK = `${SUPABASE_URL}/functions/v1/track-email-click`;
const OFFRES_LINK = "https://www.ebookstudio.fr/offres";

function trackedUrl(email: string, dest: string): string {
  return `${TRACK_CLICK}?e=${encodeURIComponent(email)}&s=11&u=${encodeURIComponent(dest)}&t=${encodeURIComponent(TEMPLATE_NAME)}`;
}

function buildHtml(email: string): string {
  const cta = trackedUrl(email, OFFRES_LINK);
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; color:#232F3E; max-width:560px; margin:0 auto; line-height:1.6; font-size:16px;">

    <p style="font-size:20px; font-weight:bold; margin:0 0 8px; color:#232F3E;">
      Publiez votre livre sur Amazon KDP en <span style="color:#FF9E2D;">7 jours</span>, sans écrire une ligne.
    </p>
    <p style="margin:0 0 22px; color:#555; font-size:15px;">
      EbookStudio est à <strong>59&nbsp;€ à vie</strong> jusqu'au 31 août — puis le prix remonte.
    </p>

    <p style="text-align:center; margin:22px 0;">
      <a href="${cta}"
         style="background:#FF9E2D; color:#232F3E; text-decoration:none; padding:16px 36px; border-radius:8px; font-weight:bold; font-size:17px; display:inline-block;">
        👉 J'accède à EbookStudio à 59&nbsp;€
      </a>
    </p>

    <div style="background:#FAFAFA; border:1px solid #eee; border-radius:8px; padding:18px 22px; margin:26px 0;">
      <p style="margin:0 0 10px; font-weight:bold; color:#008296;">Ce que vous obtenez concrètement :</p>
      <p style="margin:6px 0;">✅ Un <strong>plan de livre structuré</strong> en 1 minute</p>
      <p style="margin:6px 0;">✅ Des <strong>chapitres rédigés par IA</strong> dans votre style</p>
      <p style="margin:6px 0;">✅ Une <strong>couverture Amazon KDP</strong> prête à publier</p>
      <p style="margin:6px 0;">✅ Un <strong>fichier .docx / .pdf</strong> conforme KDP</p>
      <p style="margin:10px 0 0; font-size:14px; color:#555;">Aucune compétence technique. Aucun logiciel à installer.</p>
    </div>

    <p style="margin:0 0 6px;"><strong>Pourquoi 59 € et pas plus ?</strong></p>
    <p style="margin:0 0 22px;">Parce que je préfère avoir 100 auteurs qui publient réellement leur livre cet été, plutôt que 10 qui hésitent. Après le 31 août, le tarif repart à son niveau normal.</p>

    <p style="text-align:center; margin:30px 0 10px;">
      <a href="${cta}"
         style="background:#008296; color:#ffffff; text-decoration:none; padding:14px 30px; border-radius:8px; font-weight:bold; font-size:16px; display:inline-block;">
        Commencer mon livre maintenant →
      </a>
    </p>
    <p style="text-align:center; margin:0 0 24px; font-size:13px; color:#888;">
      Accès à vie · Paiement unique · Sans abonnement
    </p>

    <p style="margin:0;">À très vite,<br/>
    <strong>Georges</strong> — EbookStudio</p>

    <p style="font-size:13px; color:#777; border-top:1px solid #eee; padding-top:14px; margin-top:24px;">
      PS : Un livre publié ouvre des portes qu'aucun CV ne peut ouvrir. Crédibilité, réseau, revenus complémentaires. Tout commence par une décision.
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
