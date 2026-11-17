// Envoi unique (admin) du message court aux contacts marqués "ouvert-16-11-2026".
// Ne renvoie jamais à un contact déjà servi (last_email_sent_at) ni désinscrit.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { requireAdmin } from "../_shared/authGuard.ts";
import { FROM_CAMPAIGN, REPLY_TO } from "../_shared/emailIdentity.ts";
import { unsubUrl } from "../_shared/unsubToken.ts";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const TAG = "ouvert-16-11-2026";
const SUBJECT = "Votre avis sur ce nouvel outil pour votre livre ?";

const body = (unsub: string) => `<div style="font-family:Georgia,serif;font-size:16px;line-height:1.6;color:#232F3E;max-width:560px">
<p>Bonjour,</p>
<p>Vous avez lu mon dernier message, alors je voulais vous partager directement ce que je viens de mettre en ligne.</p>
<p>J'ai créé un module où vous écrivez une seule phrase, votre idée de livre, et le système vous génère sous les yeux :</p>
<ul><li>un titre adapté</li><li>un plan structuré en 12 chapitres</li><li>les premières lignes de votre chapitre 1</li></ul>
<p>C'est gratuit et sans carte bancaire :<br><a href="https://ebookstudio.fr/r/essai1" style="color:#008296;font-weight:bold">Essayer avec mon idée</a></p>
<p>Dites-moi ce que vous en pensez, je lis toutes les réponses.</p>
<p>Bien amicalement,<br><strong>Georges Boubet</strong><br>Fondateur d'EbookStudio</p>
<p style="font-size:12px;color:#888;margin-top:32px"><a href="${unsub}" style="color:#888">Se désinscrire</a></p></div>`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const guard = await requireAdmin(req);
  if (guard instanceof Response) return guard;
  const url = Deno.env.get("SUPABASE_URL")!;
  const db = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return new Response(JSON.stringify({ error: "RESEND_API_KEY absente" }), { status: 500, headers: cors });
  const { data: rows } = await db.from("sales_prospects").select("id,email")
    .eq("source", TAG).is("last_email_sent_at", null).or("unsubscribed.is.null,unsubscribed.eq.false").limit(100);
  let sent = 0; const errors: string[] = [];
  for (const r of rows ?? []) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM_CAMPAIGN, to: [r.email], reply_to: REPLY_TO, subject: SUBJECT, html: body(await unsubUrl(`${url}/functions/v1`, r.email)), tags: [{ name: "tag", value: "ouvert-16-11-2026" }] }),
    });
    if (res.ok) { sent++; await db.from("sales_prospects").update({ last_email_sent_at: new Date().toISOString() }).eq("id", r.id); }
    else errors.push(`${r.email}: ${res.status} ${(await res.text()).slice(0, 150)}`);
    await new Promise((s) => setTimeout(s, 600));
  }
  return new Response(JSON.stringify({ sent, errors }), { headers: { ...cors, "Content-Type": "application/json" } });
});
