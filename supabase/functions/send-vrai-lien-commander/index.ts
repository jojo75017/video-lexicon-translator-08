// Campagne "vrai lien" — envoie à tous les prospects actifs le lien officiel
// de commande interne (https://www.ebookstudio.fr/commander), en remplacement
// des anciens liens 1TPE / /offres qui ne convertissaient pas.
//
// Body options : { test: true } => envoi uniquement à l'admin
//                { limit: 200 } => plafonne le lot (reprise possible ensuite)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { sendResendEmailThrottled, isQuotaExhausted } from "../_shared/resendThrottle.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FROM_ADDRESS = "Georges Boubet <noreply@ebookstudio.fr>";
const ADMIN_EMAIL = "boubetgeorges@gmail.com";
const TEMPLATE_NAME = "vrai-lien-commander-59";
const SUBJECT = "Le bon lien pour l'accès à vie à 59 € (l'ancien ne fonctionnait plus)";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const TRACK_CLICK = `${SUPABASE_URL}/functions/v1/track-email-click`;
const COMMANDER = "https://www.ebookstudio.fr/commander";

function trackedUrl(email: string, dest: string): string {
  return `${TRACK_CLICK}?e=${encodeURIComponent(email)}&s=1&u=${encodeURIComponent(dest)}&t=${encodeURIComponent(TEMPLATE_NAME)}`;
}

function buildHtml(email: string): string {
  const dest = `${COMMANDER}?src=email&email=${encodeURIComponent(email)}`;
  const cta = trackedUrl(email, dest);
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;">
<div style="max-width:600px;margin:0 auto;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#232F3E;line-height:1.6;font-size:16px;">
  <div style="padding:28px;">
    <p style="margin:0 0 16px;">Bonjour,</p>

    <p style="margin:0 0 16px;">
      Petite mise au point importante : la page de commande d'<strong>EbookStudio</strong> a changé.
      Si vous avez essayé de commander ces derniers jours et que vous êtes tombé sur une page de paiement
      externe, un formulaire compliqué ou une erreur, c'était l'ancien système. Il est arrêté.
    </p>

    <p style="margin:0 0 16px;">
      Désormais tout se passe <strong>directement sur EbookStudio</strong> : paiement sécurisé par carte
      ou PayPal, et votre accès est créé automatiquement avec l'email de la commande.
    </p>

    <div style="background:#FFF7ED;border:2px solid #FF9E2D;border-radius:12px;padding:20px;margin:24px 0;text-align:center;">
      <p style="margin:0;font-size:19px;"><strong>Accès à vie — 59 €</strong></p>
      <p style="margin:8px 0 0;color:#555;font-size:15px;">Un seul paiement. Aucun abonnement.</p>
      <p style="margin:10px 0 0;color:#555;font-size:15px;">Ou en <strong>2 × 32 €</strong> / <strong>3 × 22 €</strong> si vous préférez étaler.</p>
    </div>

    <p style="text-align:center;margin:28px 0;">
      <a href="${cta}" style="background:#008296;color:#ffffff;text-decoration:none;padding:16px 34px;border-radius:8px;font-weight:bold;display:inline-block;font-size:17px;">
        Accéder à la vraie page de commande
      </a>
    </p>

    <div style="background:#FAFAFA;border:1px solid #eee;border-radius:8px;padding:18px 22px;margin:22px 0;">
      <p style="margin:0 0 10px;font-weight:bold;color:#008296;">Ce que vous obtenez :</p>
      <p style="margin:6px 0;">✅ Génération complète de vos livres (plan, chapitres, relecture)</p>
      <p style="margin:6px 0;">✅ Export Word &amp; PDF prêts pour Amazon KDP, table des matières professionnelle</p>
      <p style="margin:6px 0;">✅ Couvertures avec dos et 4e de couverture calculés</p>
      <p style="margin:6px 0;">✅ Livres illustrés enfants 3-7 ans et albums carrés</p>
      <p style="margin:6px 0;">✅ Fiche KDP : description, mots-clés, catégories, bio auteur</p>
      <p style="margin:6px 0;">✅ Livres audio + forum communauté et guides</p>
    </div>

    <div style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:8px;padding:14px 18px;margin:20px 0;">
      <p style="margin:0;font-size:14px;color:#0f766e;">
        <strong>Garantie 30 jours.</strong> Vous testez, et si ça ne vous convient pas je vous rembourse intégralement.
      </p>
    </div>

    <p style="margin:0 0 16px;">
      Si un lien vous a déjà fait perdre du temps, j'en suis désolé — celui-ci est le bon, et le seul.
    </p>

    <p style="margin:18px 0 0;">Bien à vous,<br/><strong>Georges Boubet</strong><br/>EbookStudio</p>

    <p style="font-size:13px;color:#777;border-top:1px solid #eee;padding-top:14px;margin-top:24px;">
      PS : une question avant de commander ? Répondez simplement à cet email, je lis tout personnellement.
    </p>
  </div>
  <div style="background:#FAFAFA;padding:16px 28px;border-top:1px solid #eee;font-size:12px;color:#888;text-align:center;">
    Vous recevez cet email car vous avez manifesté un intérêt pour EbookStudio.<br/>
    Pour ne plus rien recevoir, répondez "STOP".
  </div>
</div>
<img src="${SUPABASE_URL}/functions/v1/track-email-open?e=${encodeURIComponent(email)}&s=1&t=${encodeURIComponent(TEMPLATE_NAME)}" width="1" height="1" alt="" style="display:none;" />
</body></html>`;
}

async function fetchAll<T = any>(
  supabase: any, table: string, columns: string, filter?: (q: any) => any,
): Promise<T[]> {
  const pageSize = 1000;
  let all: T[] = [];
  let start = 0;
  while (true) {
    let q = supabase.from(table).select(columns).range(start, start + pageSize - 1);
    if (filter) q = filter(q);
    const { data, error } = await q;
    if (error) throw error;
    if (!data || data.length === 0) break;
    all = all.concat(data);
    if (data.length < pageSize) break;
    start += pageSize;
  }
  return all;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");

    let testMode = false;
    let limit: number | null = null;
    try {
      const body = await req.json();
      testMode = body?.test === true;
      if (typeof body?.limit === "number") limit = body.limit;
    } catch { /* no body */ }

    const norm = (e: string) => (e ?? "").trim().toLowerCase();

    const prospects = await fetchAll(supabase, "sales_prospects", "email", (q: any) =>
      q.eq("unsubscribed", false));

    // Déjà clients : on ne les sollicite pas
    const paid = await fetchAll(supabase, "funnel_orders", "email", (q: any) => q.eq("status", "paid"));
    const paidSet = new Set((paid ?? []).map((p: any) => norm(p.email)));

    // Anti-doublon / reprise après quota
    const already = await fetchAll(supabase, "email_send_log", "recipient_email", (q: any) =>
      q.eq("template_name", TEMPLATE_NAME).eq("status", "sent"));
    const sentSet = new Set((already ?? []).map((s: any) => norm(s.recipient_email)));

    let recipients = Array.from(new Set(
      (prospects ?? [])
        .map((p: any) => norm(p.email))
        .filter((e: string) =>
          e && e.includes("@") && !paidSet.has(e) && !sentSet.has(e) && e !== ADMIN_EMAIL),
    ));

    if (testMode) recipients = [ADMIN_EMAIL];
    if (limit && limit > 0) recipients = recipients.slice(0, limit);

    const results: any[] = [];
    for (const to of recipients) {
      const r = await sendResendEmailThrottled({
        from: FROM_ADDRESS, to: [to], subject: SUBJECT, html: buildHtml(to),
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
      } catch { /* noop */ }
      if (isQuotaExhausted()) { console.warn("[vrai-lien-commander] Quota Resend atteint, arrêt"); break; }
    }

    const sent = results.filter((r) => r.ok).length;
    return new Response(JSON.stringify({
      template: TEMPLATE_NAME, total: recipients.length, sent, testMode,
      results: results.slice(0, 50),
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
