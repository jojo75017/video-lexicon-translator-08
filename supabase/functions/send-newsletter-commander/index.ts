// Envoi unique (admin) de la newsletter « El Cuervo / nouvelle page de vente »
// aux contacts "ouvert-16-11-2026". Un contact déjà servi après CUTOFF n'est jamais relancé.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { requireAdmin } from "../_shared/authGuard.ts";
import { FROM_CAMPAIGN, REPLY_TO } from "../_shared/emailIdentity.ts";
import { unsubUrl } from "../_shared/unsubToken.ts";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const TAG = "ouvert-16-11-2026";
const CUTOFF = "2026-11-18T15:00:00Z";
const SUBJECT = "J'ai publié mon roman de 241 pages sur Amazon (voici la méthode)";
const LINK = "https://ebookstudio.fr/commander?utm_source=newsletter&utm_medium=email&utm_campaign=el-cuervo";

const html = (unsub: string) => `<!doctype html><html><body style="margin:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:24px 0"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden">
<tr><td style="background:#0b1120;padding:36px 32px;text-align:center">
<div style="color:#ff9e2d;font-size:13px;font-weight:bold;letter-spacing:2px;text-transform:uppercase">EbookStudio</div>
<h1 style="color:#ffffff;font-size:28px;line-height:1.25;margin:14px 0 8px">Mon roman de 241 pages est en vente sur Amazon</h1>
<div style="color:#cbd5e1;font-size:16px">Kindle et broché, publié avec l'atelier EbookStudio</div>
</td></tr>
<tr><td style="padding:32px;color:#0f172a;font-size:16px;line-height:1.65">
<p style="margin:0 0 16px">Bonjour,</p>
<p style="margin:0 0 16px">On me pose souvent la même question : <strong>« Peut-on vraiment écrire un roman complet, cohérent de A à Z, et le publier pour de vrai sur Amazon ? »</strong></p>
<p style="margin:0 0 16px">Plutôt qu'un long discours, j'ai voulu vous le prouver. J'ai conçu, écrit et mis en page <strong>« Le Fils d'El Cuervo »</strong>, un western d'aventures de 241 pages. Il est aujourd'hui en vente sur Amazon, en Kindle et en livre broché.</p>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ed;border-left:4px solid #ff9e2d;border-radius:8px;margin:8px 0 24px"><tr><td style="padding:18px 20px;font-size:15px;line-height:1.7;color:#0f172a">
<strong>Ce que vous trouvez dans l'atelier :</strong><br>
✅ 15 spécialistes qui écrivent dans l'ordre, sans répétitions<br>
✅ Une couverture brochée aux dimensions Amazon<br>
✅ La fiche Amazon et les mots-clés prêts à copier<br>
✅ <strong>Une séance d'accueil de 30 min avec moi, offerte</strong>
</td></tr></table>
<p style="margin:0 0 24px">J'ai tout réuni sur une seule page, avec la démonstration et les formules dès 19 €/mois, sans engagement.</p>
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:4px 0 28px">
<a href="${LINK}" style="display:inline-block;background:#ff9e2d;color:#0b1120;font-size:18px;font-weight:bold;text-decoration:none;padding:16px 34px;border-radius:10px">Découvrir la méthode →</a>
</td></tr></table>
<p style="margin:0 0 16px">Si une idée de livre dort dans un coin de votre tête, c'est le bon moment. Répondez simplement à cet email si vous avez une question, je lis tout.</p>
<p style="margin:0">Bien amicalement,<br><strong>Georges Boubet</strong><br><span style="color:#475569">Auteur et fondateur d'EbookStudio</span></p>
</td></tr>
<tr><td style="background:#f8fafc;padding:18px 32px;text-align:center;font-size:12px;color:#64748b">
Vous recevez ce message car vous avez ouvert un email d'EbookStudio.<br><a href="${unsub}" style="color:#64748b">Se désinscrire</a>
</td></tr></table></td></tr></table></body></html>`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const guard = await requireAdmin(req);
  if (guard instanceof Response) return guard;
  const url = Deno.env.get("SUPABASE_URL")!;
  const db = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return new Response(JSON.stringify({ error: "RESEND_API_KEY absente" }), { status: 500, headers: cors });
  const { dryRun, to } = await req.json().catch(() => ({}));
  let rows: { id: string | null; email: string }[] = [];
  if (typeof to === "string" && to.includes("@")) rows = [{ id: null, email: to }];
  else {
    const { data } = await db.from("sales_prospects").select("id,email").eq("source", TAG)
      .or(`last_email_sent_at.is.null,last_email_sent_at.lt.${CUTOFF}`)
      .or("unsubscribed.is.null,unsubscribed.eq.false").limit(100);
    rows = data ?? [];
  }
  if (dryRun) return new Response(JSON.stringify({ count: rows.length }), { headers: { ...cors, "Content-Type": "application/json" } });
  let sent = 0; const errors: string[] = [];
  for (const r of rows) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM_CAMPAIGN, to: [r.email], reply_to: REPLY_TO, subject: SUBJECT, html: html(await unsubUrl(`${url}/functions/v1`, r.email)), tags: [{ name: "tag", value: "newsletter-el-cuervo" }] }),
    });
    if (res.ok) { sent++; if (r.id) await db.from("sales_prospects").update({ last_email_sent_at: new Date().toISOString() }).eq("id", r.id); }
    else errors.push(`${r.email}: ${res.status} ${(await res.text()).slice(0, 150)}`);
    await new Promise((s) => setTimeout(s, 600));
  }
  return new Response(JSON.stringify({ sent, errors }), { headers: { ...cors, "Content-Type": "application/json" } });
});
