import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { sendResendEmailThrottled } from "../_shared/resendThrottle.ts";
import { EMAIL_SENDING_ENABLED, emailSendingBlockedResult } from "../_shared/emailSendingGuard.ts";
import { CHECKOUT_URL } from "../_shared/checkoutUrl.ts";

/**
 * Relance des paniers abandonnés du tunnel 47 €.
 *
 * Cible : les commandes restées en `pending` depuis plus de 2 heures et moins de
 * 14 jours, jamais relancées (marquage dans `metadata.relance_sent_at`).
 * Un seul email par commande, jamais deux.
 *
 * Sécurité : admin (has_role) ou secret cron (appel planifié).
 * Modes : `status` / `preview` (aucun envoi) et `send`.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

const TEMPLATE = "relance-panier-47";
const MIN_AGE_HOURS = 2;
const MAX_AGE_DAYS = 60;

/** Adresses internes / de test : jamais relancées. */
function isInternalEmail(email: string): boolean {
  const e = email.trim().toLowerCase();
  if (!e || !e.includes("@")) return true;
  if (e.endsWith("@example.com")) return true;
  if (e.endsWith("@ebookstudio.fr")) return true;
  if (e.includes("+test")) return true;
  if (e.includes("test-") || e.includes("-test")) return true;
  if (e.startsWith("boubetgeorges")) return true;
  return false;
}


function html(firstName: string | null, link: string): string {
  const hello = firstName ? `Bonjour ${firstName},` : "Bonjour,";
  return `<!DOCTYPE html><html lang="fr"><body style="margin:0;background:#FAFAFA">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAFAFA;padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
<tr><td style="background:#232F3E;padding:22px 26px;color:#ffffff;font:700 21px/1.3 Arial,Helvetica,sans-serif">
Votre commande est restée en attente
</td></tr>
<tr><td style="padding:26px;color:#232F3E;font:16px/1.6 Arial,Helvetica,sans-serif">
<p style="margin:0 0 16px">${hello}</p>
<p style="margin:0 0 16px">Vous avez commencé votre commande d'EbookStudio, mais le paiement n'est pas allé au bout. C'est peut-être un détail technique — ou une hésitation légitime. Dans les deux cas, voici de quoi trancher.</p>
<ul style="margin:0 0 18px;padding-left:22px">
<li style="margin-bottom:8px"><strong>47 € une seule fois</strong>, accès conservé à vie. À partir du 1<sup>er</sup> octobre, ce sera un abonnement à 17 € par mois, soit 204 € la première année.</li>
<li style="margin-bottom:8px"><strong>Garantie 30 jours</strong> : si l'outil ne vous convient pas, vous êtes remboursé sur simple demande, sans justification.</li>
<li style="margin-bottom:8px"><strong>Carte bancaire ou PayPal</strong>, en 1, 2 ou 3 fois.</li>
<li>Aucun abonnement, rien à résilier.</li>
</ul>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px"><tr>
<td style="background:#008296;border-radius:8px"><a href="${link}" style="display:inline-block;padding:14px 26px;color:#ffffff;text-decoration:none;font:700 16px Arial,Helvetica,sans-serif">Terminer ma commande</a></td>
</tr></table>
<p style="margin:0 0 8px;font-size:14px;color:#555">Le paiement a échoué, la page a bloqué, ou vous avez une question précise avant de payer ? Répondez simplement à ce message : je regarde personnellement et je vous réponds.</p>
<p style="margin:20px 0 0">Georges Boubet<br><span style="color:#555;font-size:14px">EbookStudio</span></p>
</td></tr>
</table></td></tr></table></body></html>`;
}

async function isAdmin(req: Request, baseUrl: string) {
  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return false;
  const client = createClient(baseUrl, Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
    global: { headers: { Authorization: authorization } },
  });
  const { data } = await client.auth.getUser();
  if (!data.user) return false;
  const { data: allowed } = await client.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
  return allowed === true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const respond = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const baseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const db = createClient(baseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    const body = await req.json().catch(() => ({}));
    const mode = String(body.mode || "status");

    const { data: cronSecret } = await db.from("app_secrets").select("value").eq("key", "cron_secret").maybeSingle();
    const hasCronSecret = !!cronSecret?.value && req.headers.get("x-cron-secret") === cronSecret.value;
    if (!hasCronSecret && !(await isAdmin(req, baseUrl))) {
      return respond({ error: "Accès administrateur requis" }, 403);
    }

    const now = Date.now();
    const maxDate = new Date(now - MIN_AGE_HOURS * 3600_000).toISOString();
    const minDate = new Date(now - MAX_AGE_DAYS * 86_400_000).toISOString();

    const { data: orders, error } = await db
      .from("funnel_orders")
      .select("id,email,first_name,status,created_at,metadata")
      .eq("status", "pending")
      .lt("created_at", maxDate)
      .gt("created_at", minDate)
      .limit(500);
    if (error) throw error;

    // Paiements échelonnés (2× / 3×) restés en attente : même relance, même règle.
    const { data: installments, error: instErr } = await db
      .from("v3_installment_orders")
      .select("id,email,status,created_at,metadata")
      .eq("status", "pending")
      .lt("created_at", maxDate)
      .gt("created_at", minDate)
      .limit(500);
    if (instErr) throw instErr;

    // Ne jamais relancer une adresse qui a déjà payé, ni une commande déjà relancée.
    const { data: paid } = await db.from("funnel_orders").select("email").eq("status", "paid").limit(5000);
    const paidEmails = new Set((paid || []).map((r: any) => String(r.email || "").toLowerCase()));
    const { data: paidInst } = await db
      .from("v3_installment_orders").select("email").neq("status", "pending").limit(5000);
    for (const r of paidInst || []) paidEmails.add(String((r as any).email || "").toLowerCase());

    type Candidate = {
      table: "funnel_orders" | "v3_installment_orders";
      id: string; email: string; first_name: string | null;
      created_at: string; metadata: Record<string, unknown> | null;
    };

    const seen = new Set<string>();
    const candidates: Candidate[] = [];
    const pushCandidate = (c: Candidate) => {
      const email = c.email.trim().toLowerCase();
      if (isInternalEmail(email)) return;
      if (paidEmails.has(email)) return;
      if (c.metadata && (c.metadata as any).relance_sent_at) return;
      if (seen.has(email)) return; // un seul email par personne
      seen.add(email);
      candidates.push({ ...c, email });
    };

    for (const o of orders || []) {
      pushCandidate({
        table: "funnel_orders", id: String((o as any).id), email: String((o as any).email || ""),
        first_name: (o as any).first_name ?? null, created_at: String((o as any).created_at),
        metadata: (o as any).metadata ?? null,
      });
    }
    for (const o of installments || []) {
      pushCandidate({
        table: "v3_installment_orders", id: String((o as any).id), email: String((o as any).email || ""),
        first_name: null, created_at: String((o as any).created_at),
        metadata: (o as any).metadata ?? null,
      });
    }

    if (mode === "status" || mode === "preview") {
      return respond({
        success: true,
        mode,
        template: TEMPLATE,
        would_send: candidates.length,
        targets: candidates.map((o) => ({ id: o.id, email: o.email, created_at: o.created_at, source: o.table })),
      });
    }

    if (!EMAIL_SENDING_ENABLED) return respond(emailSendingBlockedResult(), 423);

    let sent = 0;
    const errors: string[] = [];
    for (const order of candidates) {
      const email = order.email;
      const link = `${CHECKOUT_URL}?src=relance-panier&email=${encodeURIComponent(email)}`;
      const res = await sendResendEmailThrottled({
        from: "Georges Boubet <noreply@ebookstudio.fr>",
        to: [email],
        reply_to: "contact@ebookstudio.fr",
        subject: "Votre commande EbookStudio n'a pas été finalisée",
        html: html(order.first_name, link),
      });
      if (res?.ok) {
        sent++;
        await db
          .from(order.table)
          .update({
            metadata: { ...(order.metadata ?? {}), relance_sent_at: new Date().toISOString() },
          })
          .eq("id", order.id);
        await db.from("email_send_log").insert({
          message_id: res.id ?? null,
          template_name: TEMPLATE,
          recipient_email: email,
          status: "sent",
        });
      } else {
        errors.push(`${email}: ${res?.detail || "envoi refusé"}`);
      }
    }

    return respond({ success: true, mode, template: TEMPLATE, targets: candidates.length, sent, errors });

  } catch (e) {
    return respond({ error: e instanceof Error ? e.message : "Erreur inconnue" }, 500);
  }
});
