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
const SUBJECT = "Le premier chapitre est le plus dur (voici pourquoi)";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const TRACK_CLICK = `${SUPABASE_URL}/functions/v1/track-email-click`;
const OFFRES_LINK = "https://www.ebookstudio.fr/offres";

function trackedUrl(email: string, dest: string): string {
  return `${TRACK_CLICK}?e=${encodeURIComponent(email)}&s=11&u=${encodeURIComponent(dest)}&t=${encodeURIComponent(TEMPLATE_NAME)}`;
}

function buildHtml(email: string): string {
  const cta = trackedUrl(email, OFFRES_LINK);
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; color:#232F3E; max-width:620px; margin:0 auto; line-height:1.65; font-size:16px;">
    <p>Bonjour,</p>

    <p>Je vais être direct avec vous.</p>

    <p>La plupart des gens qui rêvent d'écrire un livre <strong>ne bloquent pas sur l'écriture</strong>. Ils bloquent sur <em>le premier chapitre</em>. Cette page qui ne veut rien dire, ce plan qui part dans tous les sens, ce titre qui n'accroche pas… et au bout de deux soirs, le projet retourne dans le tiroir. 😔</p>

    <p>C'est là que 90 % des futurs auteurs abandonnent. Pas par manque de talent — <strong>par manque de méthode</strong>.</p>

    <p>C'est exactement pour ça que j'ai construit <strong>EbookStudio</strong>.</p>

    <p>Vous entrez votre idée. L'outil vous propose un <strong>plan structuré</strong>, chapitre par chapitre, avec des titres qui donnent envie de lire. Vous validez, vous ajustez, et la rédaction s'enchaîne. Pas de page blanche. Pas de « je ne sais pas par où commencer ». Vous avancez.</p>

    <p style="background:#FFF3DF; border-left:4px solid #FF9E2D; padding:14px 18px; margin:24px 0; border-radius:6px;">
      <strong>👉 Ce que vous obtenez concrètement :</strong><br/>
      • Un plan clair dès la première minute<br/>
      • Des chapitres rédigés avec votre style<br/>
      • Une couverture et un fichier prêt pour Amazon KDP<br/>
      • Le tout <strong>sans compétences techniques</strong>
    </p>

    <p>Et jusqu'au <strong>31 août</strong>, EbookStudio est à <strong>59&nbsp;€</strong> (accès à vie), au lieu du prix habituel. C'est une promotion d'été — après, elle disparaît.</p>

    <p style="text-align:center; margin:34px 0;">
      <a href="${cta}"
         style="background:#FF9E2D; color:#232F3E; text-decoration:none; padding:16px 34px; border-radius:8px; font-weight:bold; font-size:17px; display:inline-block;">
        👉 Commencer mon livre à 59&nbsp;€
      </a>
    </p>

    <p>Vous n'êtes pas obligé de finir votre livre demain. Mais si vous ne <strong>commencez</strong> pas, dans six mois vous en serez au même point qu'aujourd'hui.</p>

    <p>À très vite,<br/>
    <strong>Georges</strong><br/>
    EbookStudio</p>

    <p style="font-size:14px; color:#555; border-top:1px solid #eee; padding-top:16px; margin-top:28px;">
      <em>PS : Un livre publié, même modeste, ouvre des portes qu'aucun CV ne peut ouvrir. Crédibilité, réseau, revenus complémentaires. Mais tout commence par une décision — pas par un talent.</em>
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
