import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { sendResendEmailThrottled, isQuotaExhausted } from "../_shared/resendThrottle.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FROM_ADDRESS = "Georges Boubet <noreply@ebookstudio.fr>";
const EXCLUDED_EMAILS = ["boubetgeorges@gmail.com"];
const TEMPLATE_NAME = "marie-rachel-story-v1";
const SUBJECT = "Et vous, qu'est-ce qui vous retient ?";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const TRACK_CLICK = `${SUPABASE_URL}/functions/v1/track-email-click`;
const OFFRES_LINK = "https://www.ebookstudio.fr/offres";

function trackedUrl(email: string, dest: string): string {
  return `${TRACK_CLICK}?e=${encodeURIComponent(email)}&s=10&u=${encodeURIComponent(dest)}&t=${encodeURIComponent(TEMPLATE_NAME)}`;
}

function buildHtml(email: string): string {
  const cta = trackedUrl(email, OFFRES_LINK);
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; color:#232F3E; max-width:620px; margin:0 auto; line-height:1.65; font-size:16px;">
    <p>Bonjour,</p>

    <p>Aujourd'hui, je veux vous présenter deux personnes. <strong>Marie</strong> et <strong>Rachel</strong>. Deux histoires différentes, mais un point commun qui va peut-être vous parler. 😊</p>

    <p><strong>Marie</strong> n'y connaissait absolument rien aux livres.</p>

    <p>Ni à l'écriture, ni à l'édition, ni à Amazon. Le mot « autoédition » lui donnait le vertige. Elle avait une idée, une envie de partager… mais devant la page blanche, le doute revenait toujours : <em>« De toute façon, ce n'est pas pour moi. »</em></p>

    <p>Elle a failli tout laisser tomber. Et puis elle a découvert <strong>EbookStudio Pro</strong>. L'outil l'a prise par la main, étape par étape. Aujourd'hui&nbsp;? Marie a publié ses livres, et elle en vend plus qu'elle n'aurait jamais osé l'imaginer. 🎉</p>

    <p><strong>Rachel</strong>, elle, avait une autre histoire.</p>

    <p>Le temps lui manquait toujours. Entre le travail, la famille et les journées qui filent, écrire un livre semblait un luxe réservé aux autres. Elle avait déjà tenté deux fois : chaque manuscrit s'était arrêté au bout de quelques chapitres, rangé dans un tiroir avec cette petite pointe de regret.</p>

    <p>Ce qui a changé pour Rachel&nbsp;? Un cadre clair, une méthode, et un outil qui fait avancer le livre <strong>même les jours où l'inspiration n'est pas là</strong>. Avec EbookStudio, à son rythme, elle a enfin terminé. Ses ebooks trouvent aujourd'hui leurs lecteurs — et Rachel a retrouvé quelque chose de précieux : la fierté d'avoir osé.</p>

    <p><strong>Vous voyez le point commun&nbsp;?</strong></p>

    <p>Ni Marie ni Rachel n'étaient des « écrivaines nées ». Elles n'avaient ni diplôme d'édition, ni carnet d'adresses, ni talent secret. Elles avaient juste une envie… et le bon outil au bon moment.</p>

    <p>Alors je vous pose la question, avec toute la bienveillance du monde&nbsp;:</p>

    <p style="font-size:19px; font-weight:bold; color:#008296; text-align:center; margin:28px 0;">
      Et vous, qu'est-ce qui vous retient&nbsp;?
    </p>

    <p>Ne restez pas sur votre déception, sur ce projet de livre repoussé « à plus tard » — ce plus tard qui n'arrive jamais 😉. Faites comme Marie. Faites comme Rachel. Le seul vrai regret, c'est de ne pas avoir essayé.</p>

    <p style="text-align:center; margin:34px 0;">
      <a href="${cta}"
         style="background:#FF9E2D; color:#232F3E; text-decoration:none; padding:16px 34px; border-radius:8px; font-weight:bold; font-size:17px; display:inline-block;">
        👉 Découvrir EbookStudio Pro
      </a>
    </p>

    <p>Votre histoire commence peut-être aujourd'hui.</p>

    <p>À très vite,<br/>
    <strong>Georges</strong><br/>
    EbookStudio Pro</p>

    <p style="font-size:14px; color:#555; border-top:1px solid #eee; padding-top:16px; margin-top:28px;">
      <em>PS : Marie a commencé un soir, sans y croire. Rachel aussi. La seule différence entre elles et ceux qui n'ont jamais publié&nbsp;? Elles ont cliqué. 😊</em>
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
    try { const body = await req.json(); testMode = body?.test === true; } catch (_) {}

    const { data: opens, error: oErr } = await supabase.from("email_opens").select("prospect_email");
    if (oErr) throw oErr;
    const { data: clicks, error: cErr } = await supabase.from("email_clicks").select("prospect_email");
    if (cErr) throw cErr;

    const norm = (e: string) => (e ?? "").trim().toLowerCase();
    const clickers = new Set((clicks ?? []).map((c: any) => norm(c.prospect_email)));

    const { data: alreadySent } = await supabase
      .from("email_send_log")
      .select("recipient_email")
      .eq("template_name", TEMPLATE_NAME)
      .eq("status", "sent");
    const sentSet = new Set((alreadySent ?? []).map((s: any) => norm(s.recipient_email)));

    let recipients = Array.from(new Set(
      (opens ?? [])
        .map((o: any) => norm(o.prospect_email))
        .filter((e: string) =>
          e && e.includes("@") &&
          !clickers.has(e) &&
          !sentSet.has(e) &&
          !EXCLUDED_EMAILS.includes(e)
        ),
    ));

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
      if (isQuotaExhausted()) { console.warn("[marie-rachel] Resend daily quota atteint, arrêt"); break; }
    }

    const sent = results.filter((r) => r.ok).length;
    return new Response(
      JSON.stringify({
        target: "openers_non_clickers",
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
