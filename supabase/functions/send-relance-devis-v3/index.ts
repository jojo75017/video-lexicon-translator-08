import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { sendResendEmailThrottled } from "../_shared/resendThrottle.ts";
import { EMAIL_SENDING_ENABLED, emailSendingBlockedResult } from "../_shared/emailSendingGuard.ts";
import { FROM_CAMPAIGN, REPLY_TO } from "../_shared/emailIdentity.ts";

/**
 * Relance unique « devis correction / mise en forme + inscription V3 ».
 *
 * Deux blocs de poids égal : je le fais pour vous (prestation, devis à partir
 * de 149 €) ou vous le faites vous-même (V3 au 1er octobre).
 *
 * Cible, dans cet ordre : paniers abandonnés (funnel_orders en attente),
 * prospects actifs non désinscrits, leads de tunnel.
 * Un seul email par adresse, jamais deux : garde-fou sur `email_send_log`.
 *
 * Modes : `status` / `preview` (aucun envoi), `test` (vers l'admin), `send`.
 * Réservé aux administrateurs (has_role).
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TEMPLATE = "relance-devis-v3";
const SUBJECT = "Votre livre est écrit. Il n'est pas encore publiable.";
const TEMPLATE_SUIVI = "relance-devis-v3-suivi";
const SUBJECT_SUIVI = "Il reste peu de jours avant le 1er octobre";
const TEMPLATE_DERNIERE_CHANCE = "relance-devis-v3-derniere-chance";
const SUBJECT_DERNIERE_CHANCE = "Dernière chance : voici ce que vous perdez";
const LINK_DEVIS = "https://ebookstudio.fr/r/devis1";
const LINK_V3 = "https://ebookstudio.fr/r/v3insc";
const BATCH_MAX = 200;

function isInternalEmail(email: string): boolean {
  const e = email.trim().toLowerCase();
  if (!e || !e.includes("@")) return true;
  if (e.endsWith("@example.com")) return true;
  if (e.endsWith("@ebookstudio.fr")) return true;
  if (e.includes("+test") || e.includes("test-") || e.includes("-test")) return true;
  if (e.startsWith("boubetgeorges")) return true;
  return false;
}

function html(firstName: string | null): string {
  const hello = firstName ? `Bonjour ${firstName},` : "Bonjour,";
  return `<!DOCTYPE html><html lang="fr"><body style="margin:0;background:#FAFAFA">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAFAFA;padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
<tr><td style="background:#232F3E;padding:22px 26px;color:#ffffff;font:700 20px/1.35 Arial,Helvetica,sans-serif">
Un manuscrit n'est pas un livre publiable
</td></tr>
<tr><td style="padding:26px;color:#232F3E;font:16px/1.6 Arial,Helvetica,sans-serif">
<p style="margin:0 0 16px">${hello}</p>
<p style="margin:0 0 16px">Soyons direct. Un texte écrit n'est pas un livre vendable. Sans correction sérieuse, sans mise en page aux normes, sans couverture aux bons gabarits, Amazon refuse le fichier ou les lecteurs referment le livre à la page trois. C'est la raison numéro un des publications qui ne vendent rien.</p>
<p style="margin:0 0 20px">Deux façons d'en sortir. Choisissez la vôtre.</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;border:1px solid #e5e7eb;border-radius:10px">
<tr><td style="padding:18px 20px">
<p style="margin:0 0 8px;font:700 17px Arial,Helvetica,sans-serif;color:#0f5132">1. Je le fais pour vous</p>
<p style="margin:0 0 12px;font-size:15px">Correction complète, mise en forme aux normes KDP, couverture professionnelle, accompagnement jusqu'au dépôt sur votre compte. Devis à partir de 149 €, réponse sous 24 h.</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="background:#FF9E2D;border-radius:8px"><a href="${LINK_DEVIS}" style="display:inline-block;padding:13px 24px;color:#232F3E;text-decoration:none;font:700 15px Arial,Helvetica,sans-serif">Demander mon devis (à partir de 149 €)</a></td>
</tr></table>
</td></tr></table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;border:1px solid #e5e7eb;border-radius:10px">
<tr><td style="padding:18px 20px">
<p style="margin:0 0 8px;font:700 17px Arial,Helvetica,sans-serif;color:#0f5132">2. Je le fais moi-même</p>
<p style="margin:0 0 12px;font-size:15px">EbookStudio V3 ouvre le 1<sup>er</sup> octobre : écriture chapitre par chapitre, correcteur intégré, couvertures Kindle et broché, fiche KDP prête à coller. 27 € par mois (Plume) ou 47 € par mois (Édition), sans engagement.</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="background:#232F3E;border-radius:8px"><a href="${LINK_V3}" style="display:inline-block;padding:13px 24px;color:#ffffff;text-decoration:none;font:700 15px Arial,Helvetica,sans-serif">M'inscrire à la V3</a></td>
</tr></table>
</td></tr></table>

<p style="margin:0 0 16px;font-size:15px">Le 1<sup>er</sup> octobre, la V3 ouvre et les places d'accompagnement de la rentrée sont prises en premier arrivé. Si votre manuscrit dort depuis des mois, c'est maintenant qu'il faut trancher.</p>
<p style="margin:0 0 8px;font-size:14px;color:#555">Une question avant de décider ? Répondez à ce message : je lis et je réponds personnellement.</p>
<p style="margin:18px 0 0">Georges Boubet<br><span style="color:#555;font-size:14px">EbookStudio</span></p>
<p style="margin:18px 0 0;font-size:12px;color:#888">Vous recevez ce message parce que vous avez laissé votre adresse sur EbookStudio. Répondez « STOP » et je vous retire définitivement de la liste.</p>
</td></tr>
</table></td></tr></table></body></html>`;
}

/** Relance nº2 : uniquement pour ceux qui n'ont cliqué sur aucun des deux liens. */
function htmlSuivi(firstName: string | null): string {
  const hello = firstName ? `Bonjour ${firstName},` : "Bonjour,";
  return `<!DOCTYPE html><html lang="fr"><body style="margin:0;background:#FAFAFA">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAFAFA;padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
<tr><td style="background:#232F3E;padding:22px 26px;color:#ffffff;font:700 20px/1.35 Arial,Helvetica,sans-serif">
Le 1<sup>er</sup> octobre, c'est dans quelques jours
</td></tr>
<tr><td style="padding:26px;color:#232F3E;font:16px/1.6 Arial,Helvetica,sans-serif">
<p style="margin:0 0 16px">${hello}</p>
<p style="margin:0 0 16px">Je vous ai écrit il y a peu au sujet de votre manuscrit. Vous n'avez pas encore choisi, et je comprends : on remet toujours à plus tard ce qui demande une décision.</p>
<p style="margin:0 0 16px">Mais un manuscrit qui dort ne rapporte rien. Ni lecteur, ni euro, ni retour. Le 1<sup>er</sup> octobre, EbookStudio V3 ouvre et les places d'accompagnement de la rentrée partent dans l'ordre d'arrivée.</p>
<p style="margin:0 0 20px">Deux chemins, un seul clic.</p>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 14px"><tr>
<td style="background:#FF9E2D;border-radius:8px"><a href="${LINK_DEVIS}" style="display:inline-block;padding:13px 24px;color:#232F3E;text-decoration:none;font:700 15px Arial,Helvetica,sans-serif">Je veux qu'on s'en occupe (devis dès 149 €)</a></td>
</tr></table>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px"><tr>
<td style="background:#232F3E;border-radius:8px"><a href="${LINK_V3}" style="display:inline-block;padding:13px 24px;color:#ffffff;text-decoration:none;font:700 15px Arial,Helvetica,sans-serif">Je le fais moi-même avec la V3 (27 € / 47 €)</a></td>
</tr></table>

<p style="margin:0 0 8px;font-size:14px;color:#555">Si aucun des deux ne vous convient, répondez-moi en une ligne pour me dire pourquoi : ça m'aide vraiment.</p>
<p style="margin:18px 0 0">Georges Boubet<br><span style="color:#555;font-size:14px">EbookStudio</span></p>
<p style="margin:18px 0 0;font-size:12px;color:#888">Répondez « STOP » et je vous retire définitivement de la liste.</p>
</td></tr>
</table></td></tr></table></body></html>`;
}

/** Relance nº3 : dernier message, uniquement après la relance nº2 et sans clic. */
function htmlDerniereChance(firstName: string | null): string {
  const hello = firstName ? `Bonjour ${firstName},` : "Bonjour,";
  return `<!DOCTYPE html><html lang="fr"><body style="margin:0;background:#FAFAFA">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAFAFA;padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
<tr><td style="background:#232F3E;padding:22px 26px;color:#ffffff;font:700 20px/1.35 Arial,Helvetica,sans-serif">
Dernière chance : voici ce que vous perdez
</td></tr>
<tr><td style="padding:26px;color:#232F3E;font:16px/1.6 Arial,Helvetica,sans-serif">
<p style="margin:0 0 16px">${hello}</p>
<p style="margin:0 0 16px">Je vais être direct : c'est mon dernier message à ce sujet.</p>
<p style="margin:0 0 12px">En laissant votre manuscrit de côté, vous perdez :</p>
<ul style="margin:0 0 18px;padding-left:22px">
<li style="margin-bottom:8px">le temps déjà consacré à l'écrire ;</li>
<li style="margin-bottom:8px">la possibilité d'en faire un livre propre et publiable ;</li>
<li style="margin-bottom:8px">des lecteurs, des avis et des ventes qui ne peuvent pas arriver tant que le livre reste dans un dossier ;</li>
<li>l'accompagnement de rentrée et l'accès à EbookStudio V3 dès son ouverture le 1<sup>er</sup> octobre.</li>
</ul>
<p style="margin:0 0 20px"><strong>Vous avez deux choix. Après cet email, je ne vous relancerai plus.</strong></p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 14px;border:1px solid #e5e7eb;border-radius:10px">
<tr><td style="padding:18px 20px">
<p style="margin:0 0 10px;font:700 17px Arial,Helvetica,sans-serif;color:#0f5132">Je confie mon livre à un professionnel</p>
<p style="margin:0 0 12px;font-size:15px">Correction, mise en forme, couverture et accompagnement KDP. Devis à partir de 149 €.</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:#FF9E2D;border-radius:8px"><a href="${LINK_DEVIS}" style="display:inline-block;padding:13px 24px;color:#232F3E;text-decoration:none;font:700 15px Arial,Helvetica,sans-serif">Demander mon devis</a></td></tr></table>
</td></tr></table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;border:1px solid #e5e7eb;border-radius:10px">
<tr><td style="padding:18px 20px">
<p style="margin:0 0 10px;font:700 17px Arial,Helvetica,sans-serif;color:#0f5132">Je publie moi-même avec la V3</p>
<p style="margin:0 0 12px;font-size:15px">Plume à 27 € par mois ou Édition à 47 € par mois, sans engagement.</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:#232F3E;border-radius:8px"><a href="${LINK_V3}" style="display:inline-block;padding:13px 24px;color:#ffffff;text-decoration:none;font:700 15px Arial,Helvetica,sans-serif">Voir les offres V3</a></td></tr></table>
</td></tr></table>

<p style="margin:0 0 8px;font-size:14px;color:#555"><strong>Si cela ne vous intéresse pas, ne tenez pas compte de cet email.</strong> Vous ne recevrez pas d'autre relance sur cette offre.</p>
<p style="margin:18px 0 0">Georges Boubet<br><span style="color:#555;font-size:14px">EbookStudio</span></p>
<p style="margin:18px 0 0;font-size:12px;color:#888">Répondez « STOP » et je vous retire définitivement de la liste.</p>
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
    const mode = String((body as Record<string, unknown>).mode || "status");
    const limit = Math.min(BATCH_MAX, Math.max(1, Number((body as Record<string, unknown>).limit) || BATCH_MAX));

    if (!(await isAdmin(req, baseUrl))) return respond({ error: "Accès administrateur requis" }, 403);

    // Envoi de contrôle vers la boîte de l'administrateur.
    if (mode === "test") {
      if (!EMAIL_SENDING_ENABLED) return respond(emailSendingBlockedResult(), 423);
      const res = await sendResendEmailThrottled({
        from: FROM_CAMPAIGN,
        to: [REPLY_TO],
        reply_to: REPLY_TO,
        subject: `[TEST] ${SUBJECT}`,
        html: html("Georges"),
      });
      return res?.ok
        ? respond({ success: true, mode, sent: 1, to: REPLY_TO })
        : respond({ success: false, mode, sent: 0, error: res?.detail || "envoi refusé" });
    }

    if (mode === "suivi-test") {
      if (!EMAIL_SENDING_ENABLED) return respond(emailSendingBlockedResult(), 423);
      const res = await sendResendEmailThrottled({
        from: FROM_CAMPAIGN,
        to: [REPLY_TO],
        reply_to: REPLY_TO,
        subject: `[TEST] ${SUBJECT_SUIVI}`,
        html: htmlSuivi("Georges"),
      });
      return res?.ok
        ? respond({ success: true, mode, sent: 1, to: REPLY_TO })
        : respond({ success: false, mode, sent: 0, error: res?.detail || "envoi refusé" });
    }

    if (mode === "derniere-chance-test") {
      if (!EMAIL_SENDING_ENABLED) return respond(emailSendingBlockedResult(), 423);
      const res = await sendResendEmailThrottled({
        from: FROM_CAMPAIGN,
        to: [REPLY_TO],
        reply_to: REPLY_TO,
        subject: `[TEST] ${SUBJECT_DERNIERE_CHANCE}`,
        html: htmlDerniereChance("Georges"),
      });
      return res?.ok
        ? respond({ success: true, mode, sent: 1, to: REPLY_TO })
        : respond({ success: false, mode, sent: 0, error: res?.detail || "envoi refusé" });
    }

    /* ---------------- Relance nº3 : dernière chance ---------------- */
    if (mode === "derniere-chance-status" || mode === "derniere-chance-send") {
      const readEmails = async (templateName: string) => {
        const emails = new Set<string>();
        for (let from = 0; from < 40000; from += 1000) {
          const { data } = await db.from("email_send_log").select("recipient_email")
            .eq("template_name", templateName).range(from, from + 999);
          if (!data?.length) break;
          for (const row of data) emails.add(String(row.recipient_email || "").toLowerCase());
          if (data.length < 1000) break;
        }
        return emails;
      };

      const receivedSuivi = await readEmails(TEMPLATE_SUIVI);
      const alreadyFinal = await readEmails(TEMPLATE_DERNIERE_CHANCE);
      const clickers = new Set<string>();
      for (let from = 0; from < 40000; from += 1000) {
        const { data } = await db.from("email_clicks").select("prospect_email,clicked_url").range(from, from + 999);
        if (!data?.length) break;
        for (const row of data) {
          const url = String(row.clicked_url || "");
          if (url.includes("devis1") || url.includes("v3insc")) {
            clickers.add(String(row.prospect_email || "").toLowerCase());
          }
        }
        if (data.length < 1000) break;
      }
      const excludedPaid = new Set<string>();
      const { data: paidO } = await db.from("funnel_orders").select("email").eq("status", "paid").limit(5000);
      for (const row of paidO || []) excludedPaid.add(String(row.email || "").toLowerCase());
      const { data: activeSubs } = await db.from("subscribers").select("email").eq("status", "active").limit(5000);
      for (const row of activeSubs || []) excludedPaid.add(String(row.email || "").toLowerCase());

      const finalTargets = [...receivedSuivi].filter(
        (email) => !clickers.has(email) && !alreadyFinal.has(email) && !excludedPaid.has(email) && !isInternalEmail(email),
      );

      if (mode === "derniere-chance-status") {
        return respond({
          success: true,
          mode,
          template: TEMPLATE_DERNIERE_CHANCE,
          subject: SUBJECT_DERNIERE_CHANCE,
          received_followup: receivedSuivi.size,
          clickers: clickers.size,
          already_sent: alreadyFinal.size,
          would_send: finalTargets.length,
          batch_max: BATCH_MAX,
        });
      }

      if (!EMAIL_SENDING_ENABLED) return respond(emailSendingBlockedResult(), 423);
      let finalSent = 0;
      const finalErrors: string[] = [];
      for (const email of finalTargets.slice(0, limit)) {
        const res = await sendResendEmailThrottled({
          from: FROM_CAMPAIGN,
          to: [email],
          reply_to: REPLY_TO,
          subject: SUBJECT_DERNIERE_CHANCE,
          html: htmlDerniereChance(null),
          tags: [{ name: "template", value: TEMPLATE_DERNIERE_CHANCE }],
        });
        if (res?.ok) {
          finalSent++;
          await db.from("email_send_log").insert({
            message_id: res.id ?? null,
            template_name: TEMPLATE_DERNIERE_CHANCE,
            recipient_email: email,
            status: "sent",
          });
        } else {
          finalErrors.push(`${email}: ${res?.detail || "envoi refusé"}`);
          if (res?.quotaExhausted || res?.status === 429 || res?.status === 401 || res?.status === 403) break;
        }
      }
      return respond({
        success: true,
        mode,
        template: TEMPLATE_DERNIERE_CHANCE,
        targets: finalTargets.length,
        sent: finalSent,
        remaining: Math.max(0, finalTargets.length - finalSent),
        errors: finalErrors,
      });
    }

    /* ---------------- Relance nº2 : non-cliqueurs ---------------- */
    if (mode === "suivi-status" || mode === "suivi-send") {
      const readAll = async (
        table: string,
        columns: string,
        apply: (q: ReturnType<typeof db.from>) => unknown,
      ) => {
        const rows: Record<string, unknown>[] = [];
        for (let from = 0; from < 40000; from += 1000) {
          // deno-lint-ignore no-explicit-any
          const q: any = (apply as any)(db.from(table).select(columns)).range(from, from + 999);
          const { data } = await q;
          if (!data?.length) break;
          rows.push(...(data as Record<string, unknown>[]));
          if (data.length < 1000) break;
        }
        return rows;
      };

      // Adresses ayant reçu la relance nº1.
      const received = new Set<string>();
      for (const r of await readAll("email_send_log", "recipient_email,template_name", (q) =>
        // deno-lint-ignore no-explicit-any
        (q as any).eq("template_name", TEMPLATE))) {
        received.add(String(r.recipient_email || "").toLowerCase());
      }
      // Déjà relancés une seconde fois : jamais deux fois.
      const alreadySuivi = new Set<string>();
      for (const r of await readAll("email_send_log", "recipient_email,template_name", (q) =>
        // deno-lint-ignore no-explicit-any
        (q as any).eq("template_name", TEMPLATE_SUIVI))) {
        alreadySuivi.add(String(r.recipient_email || "").toLowerCase());
      }
      // Cliqueurs : engagés, on ne les relance pas.
      const clickers = new Set<string>();
      for (const r of await readAll("email_clicks", "prospect_email,clicked_url", (q) => q)) {
        const url = String(r.clicked_url || "");
        if (url.includes("devis1") || url.includes("v3insc")) {
          clickers.add(String(r.prospect_email || "").toLowerCase());
        }
      }

      const paidSet = new Set<string>();
      const { data: paidO } = await db.from("funnel_orders").select("email").eq("status", "paid").limit(5000);
      for (const r of paidO || []) paidSet.add(String((r as Record<string, unknown>).email || "").toLowerCase());
      const { data: activeSubs } = await db.from("subscribers").select("email").eq("status", "active").limit(5000);
      for (const r of activeSubs || []) paidSet.add(String((r as Record<string, unknown>).email || "").toLowerCase());

      const suiviTargets = [...received].filter(
        (e) => !clickers.has(e) && !alreadySuivi.has(e) && !paidSet.has(e) && !isInternalEmail(e),
      );

      if (mode === "suivi-status") {
        return respond({
          success: true,
          mode,
          template: TEMPLATE_SUIVI,
          subject: SUBJECT_SUIVI,
          received: received.size,
          clickers: clickers.size,
          already_sent: alreadySuivi.size,
          would_send: suiviTargets.length,
          batch_max: BATCH_MAX,
          targets: suiviTargets.slice(0, 50).map((email) => ({ email, source: "non-cliqueur" })),
        });
      }

      if (!EMAIL_SENDING_ENABLED) return respond(emailSendingBlockedResult(), 423);
      const suiviBatch = suiviTargets.slice(0, limit);
      let suiviSent = 0;
      const suiviErrors: string[] = [];
      for (const email of suiviBatch) {
        const res = await sendResendEmailThrottled({
          from: FROM_CAMPAIGN,
          to: [email],
          reply_to: REPLY_TO,
          subject: SUBJECT_SUIVI,
          html: htmlSuivi(null),
          tags: [{ name: "template", value: TEMPLATE_SUIVI }],
        });
        if (res?.ok) {
          suiviSent++;
          await db.from("email_send_log").insert({
            message_id: res.id ?? null,
            template_name: TEMPLATE_SUIVI,
            recipient_email: email,
            status: "sent",
          });
        } else {
          suiviErrors.push(`${email}: ${res?.detail || "envoi refusé"}`);
          if (res?.quotaExhausted || res?.status === 429 || res?.status === 401 || res?.status === 403) break;
        }
      }
      return respond({
        success: true,
        mode,
        template: TEMPLATE_SUIVI,
        targets: suiviTargets.length,
        sent: suiviSent,
        remaining: Math.max(0, suiviTargets.length - suiviSent),
        errors: suiviErrors,
      });
    }

    /* ---------------- Exclusions ---------------- */
    const excluded = new Set<string>();
    const { data: paidOrders } = await db.from("funnel_orders").select("email").eq("status", "paid").limit(5000);
    for (const r of paidOrders || []) excluded.add(String((r as Record<string, unknown>).email || "").toLowerCase());
    const { data: paidInst } = await db
      .from("v3_installment_orders").select("email").in("status", ["active", "completed", "paid"]).limit(5000);
    for (const r of paidInst || []) excluded.add(String((r as Record<string, unknown>).email || "").toLowerCase());
    const { data: subs } = await db.from("subscribers").select("email").eq("status", "active").limit(5000);
    for (const r of subs || []) excluded.add(String((r as Record<string, unknown>).email || "").toLowerCase());

    // Déjà touché par cette relance : jamais deux fois.
    for (let from = 0; from < 20000; from += 1000) {
      const { data: already } = await db
        .from("email_send_log").select("recipient_email").eq("template_name", TEMPLATE)
        .range(from, from + 999);
      if (!already?.length) break;
      for (const r of already) excluded.add(String((r as Record<string, unknown>).recipient_email || "").toLowerCase());
      if (already.length < 1000) break;
    }

    /* ---------------- Candidats ---------------- */
    type Candidate = { email: string; first_name: string | null; source: string };
    const seen = new Set<string>();
    const candidates: Candidate[] = [];
    const push = (email: string, first_name: string | null, source: string) => {
      const e = email.trim().toLowerCase();
      if (isInternalEmail(e) || excluded.has(e) || seen.has(e)) return;
      seen.add(e);
      candidates.push({ email: e, first_name: first_name || null, source });
    };

    // 1. Paniers abandonnés d'abord.
    const { data: pending } = await db
      .from("funnel_orders").select("email,first_name,created_at")
      .eq("status", "pending").order("created_at", { ascending: false }).limit(1000);
    for (const r of pending || []) {
      push(String((r as Record<string, unknown>).email || ""), (r as Record<string, unknown>).first_name as string | null, "panier");
    }

    // 2. Prospects actifs non désinscrits.
    for (let from = 0; from < 10000; from += 1000) {
      const { data: prospects } = await db
        .from("sales_prospects").select("email,first_name,unsubscribed")
        .or("unsubscribed.is.null,unsubscribed.eq.false")
        .range(from, from + 999);
      if (!prospects?.length) break;
      for (const r of prospects) {
        push(String((r as Record<string, unknown>).email || ""), (r as Record<string, unknown>).first_name as string | null, "prospect");
      }
      if (prospects.length < 1000) break;
    }

    // 3. Leads de tunnel.
    const { data: leads } = await db.from("funnel_leads").select("email,first_name").limit(1000);
    for (const r of leads || []) {
      push(String((r as Record<string, unknown>).email || ""), (r as Record<string, unknown>).first_name as string | null, "lead");
    }

    if (mode === "status" || mode === "preview") {
      return respond({
        success: true,
        mode,
        template: TEMPLATE,
        subject: SUBJECT,
        would_send: candidates.length,
        batch_max: BATCH_MAX,
        targets: candidates.slice(0, 50).map((c) => ({ email: c.email, source: c.source })),
      });
    }

    if (mode !== "send") return respond({ error: "Mode inconnu" }, 400);
    if (!EMAIL_SENDING_ENABLED) return respond(emailSendingBlockedResult(), 423);

    const batch = candidates.slice(0, limit);
    let sent = 0;
    const errors: string[] = [];
    for (const target of batch) {
      const res = await sendResendEmailThrottled({
        from: FROM_CAMPAIGN,
        to: [target.email],
        reply_to: REPLY_TO,
        subject: SUBJECT,
        html: html(target.first_name),
        tags: [{ name: "template", value: TEMPLATE }],
      });
      if (res?.ok) {
        sent++;
        await db.from("email_send_log").insert({
          message_id: res.id ?? null,
          template_name: TEMPLATE,
          recipient_email: target.email,
          status: "sent",
        });
      } else {
        errors.push(`${target.email}: ${res?.detail || "envoi refusé"}`);
        // Refus de la plateforme (quota, clé, domaine) : on arrête net le lot.
        if (res?.quotaExhausted || res?.status === 429 || res?.status === 401 || res?.status === 403) break;
      }
    }

    return respond({
      success: true,
      mode,
      template: TEMPLATE,
      targets: candidates.length,
      sent,
      remaining: Math.max(0, candidates.length - sent),
      errors,
    });
  } catch (e) {
    console.error("send-relance-devis-v3 error:", e);
    return respond({ error: e instanceof Error ? e.message : "Erreur inconnue" }, 500);
  }
});
