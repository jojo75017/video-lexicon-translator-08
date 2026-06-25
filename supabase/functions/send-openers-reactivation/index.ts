import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_ADDRESS = "Georges Boubet <noreply@ebookstudio.fr>";

// Adresses à exclure (compte propriétaire / tests)
const EXCLUDED_EMAILS = ["boubetgeorges@gmail.com"];

const TEMPLATE_NAME = "openers-reactivation";
const SUBJECT = "Votre livre pourrait être sur Amazon ce week-end 📖";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const TRACK_CLICK = `${SUPABASE_URL}/functions/v1/track-email-click`;
const OFFRES_LINK = "https://www.ebookstudio.fr/offres";
const DEMO_LINK = "https://www.ebookstudio.fr/demo";

// Construit une URL de redirection trackée (les clics sont enregistrés)
function trackedUrl(email: string, dest: string): string {
  const e = encodeURIComponent(email);
  const u = encodeURIComponent(dest);
  const t = encodeURIComponent(TEMPLATE_NAME);
  return `${TRACK_CLICK}?e=${e}&s=9&u=${u}&t=${t}`;
}

function buildHtml(email: string): string {
  const cta = trackedUrl(email, OFFRES_LINK);
  const demo = trackedUrl(email, DEMO_LINK);
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; color:#232F3E; max-width:600px; margin:0 auto; line-height:1.6;">
    <p>Bonjour,</p>

    <p>Vous aviez ouvert l'un de mes emails sur <strong>EbookStudio</strong>, sans aller plus loin.
    Je comprends&nbsp;: écrire un livre, ça paraît énorme.</p>

    <p><strong>Sauf qu'avec EbookStudio, vous n'écrivez plus seul.</strong> L'IA rédige, met en page
    et prépare votre livre prêt à publier sur Amazon KDP — vous gardez le contrôle à chaque étape.</p>

    <p>👉 La plupart des utilisateurs ont un manuscrit complet en <strong>moins d'un week-end</strong>.</p>

    <p style="text-align:center; margin:30px 0;">
      <a href="${cta}"
         style="background:#FF9E2D; color:#232F3E; text-decoration:none; padding:16px 34px; border-radius:8px; font-weight:bold; font-size:17px; display:inline-block;">
        Je veux écrire mon livre →
      </a>
    </p>

    <p style="text-align:center; font-size:14px; color:#555;">
      Pas encore convaincu&nbsp;? <a href="${demo}" style="color:#008296;">Voir la démo en 2 minutes</a>
    </p>

    <p style="margin-top:24px;">
      Bien à vous,<br/>
      <strong>Georges Boubet</strong><br/>
      EbookStudio
    </p>
  </div>`;
}

async function sendResendEmail(to: string, subject: string, html: string) {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) return { ok: false, detail: "RESEND_API_KEY manquante" };
  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendKey}`,
      },
      body: JSON.stringify({ from: FROM_ADDRESS, to: [to], subject, html }),
    });
    if (!res.ok) {
      const detail = await res.text();
      return { ok: false, detail: `HTTP ${res.status}: ${detail}` };
    }
    const json = await res.json().catch(() => ({}));
    return { ok: true, id: json?.id };
  } catch (err) {
    return { ok: false, detail: String(err) };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      SUPABASE_URL,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Permet un envoi de test : { test: true } -> uniquement vers le 1er exclu (propriétaire)
    let testMode = false;
    try {
      const body = await req.json();
      testMode = body?.test === true;
    } catch (_) { /* pas de body */ }

    // Tous ceux qui ont OUVERT au moins un email
    const { data: opens, error: oErr } = await supabase
      .from("email_opens")
      .select("prospect_email");
    if (oErr) throw oErr;

    // Tous ceux qui ont déjà CLIQUÉ (on ne les recible pas, ils ont leur propre séquence)
    const { data: clicks, error: cErr } = await supabase
      .from("email_clicks")
      .select("prospect_email");
    if (cErr) throw cErr;

    const norm = (e: string) => (e ?? "").trim().toLowerCase();
    const clickers = new Set((clicks ?? []).map((c: any) => norm(c.prospect_email)));

    // Déjà envoyés avec succès pour ce template -> on ne renvoie pas (reprise après quota)
    const { data: alreadySent } = await supabase
      .from("email_send_log")
      .select("recipient_email")
      .eq("template_name", TEMPLATE_NAME)
      .eq("status", "sent");
    const sentSet = new Set((alreadySent ?? []).map((s: any) => norm(s.recipient_email)));

    let recipients = Array.from(
      new Set(
        (opens ?? [])
          .map((o: any) => norm(o.prospect_email))
          .filter((e: string) =>
            e && e.includes("@") &&
            !clickers.has(e) &&
            !sentSet.has(e) &&
            !EXCLUDED_EMAILS.includes(e)
          ),
      ),
    );

    if (testMode) {
      recipients = ["boubetgeorges@gmail.com"];
    }

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
      } catch (_) { /* noop */ }
      // petite pause pour ménager le rate limit Resend
      await new Promise((r) => setTimeout(r, 120));
    }

    const sent = results.filter((r) => r.ok).length;
    return new Response(
      JSON.stringify({
        target: "openers_non_clickers",
        total: recipients.length,
        sent,
        testMode,
        excluded: EXCLUDED_EMAILS,
        results: results.slice(0, 50),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
    );
  }
});
