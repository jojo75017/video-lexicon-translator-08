/**
 * Envoi par lots de l'annonce « 15 jours ou 15 places à 47 € ».
 *
 * - réservé aux admins (has_role) ;
 * - destinataires : `sales_prospects` non désinscrits, adresses personnelles,
 *   sans les acheteurs, les abonnés actifs ni les adresses internes ;
 * - journal `offre_fondateur_sends` : un prospect n'est jamais contacté deux fois ;
 * - lots de 300 ou 500 adresses : on relance le bouton pour le lot suivant ;
 * - arrêt immédiat si Resend signale un quota épuisé.
 *
 * Aucune écriture de tarif, de droit d'accès ou de commande.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { sendResendEmailThrottled, isQuotaExhausted } from "../_shared/resendThrottle.ts";
import { FROM_CAMPAIGN, REPLY_TO, DIRECT_EMAIL } from "../_shared/emailIdentity.ts";
import { SITE_ORIGIN } from "../_shared/checkoutUrl.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EMAIL_ID = "offre-fondateur-15-places";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Tailles de lot autorisées. */
const BATCH_SIZES = [50, 100, 300, 500];

const SEATS = 15;
const PRICE = 47;
const END_LABEL = "15 octobre 2026";
const COMMANDER = `${SITE_ORIGIN}/commander?src=email&t=${EMAIL_ID}`;

const SUBJECT = `15 jours ou 15 places : les tout derniers accès à vie à ${PRICE} €`;
const PREHEADER = `EbookStudio passe en abonnement. Avant de fermer, j'ouvre ${SEATS} derniers accès à vie.`;
const CTA_LABEL = `Prendre une des ${SEATS} places à ${PRICE} €`;

const PARAGRAPHS = [
  "EbookStudio vient de passer en V3, et cette version se prend désormais par abonnement : 27 € par mois pour Plume, 47 € par mois pour Édition, 97 € par mois pour Maison d'Édition.",
  `Avant de fermer définitivement l'accès à vie, j'ouvre un tout dernier contingent : ${SEATS} places à ${PRICE} €, une seule fois, sans mensualité, jamais.`,
  `Deux limites, et la première atteinte ferme l'offre : les ${SEATS} places, ou le ${END_LABEL}. Le compteur affiché sur la page correspond aux commandes réellement réglées — quand il tombe à zéro, c'est terminé.`,
  "Ce que vous obtenez pour ce paiement unique :",
  "- votre livre construit avec vous : sujet, sommaire, chapitres rédigés un par un ;\n- la correction professionnelle du manuscrit ;\n- les exports Word, PDF, EPUB et Kindle aux normes Amazon KDP ;\n- la couverture Kindle et broché, recadrée aux dimensions exactes ;\n- la fiche de vente KDP : description, mots-clés, catégories ;\n- la traduction dans 10 langues et le livre audio.",
  "Deux studios restent vendus séparément, pour tout le monde : Cover Studio Pro (67 €) et Studio Jeunesse (47 €). Je préfère vous le dire franchement plutôt que de vous laisser le découvrir après.",
  "Garantie 30 jours, sans justification : si l'outil ne vous convient pas, un simple message et vous êtes remboursé.",
  "Si vous hésitez, répondez à cet email : c'est moi qui lis et qui réponds.",
];

const SIGN_NAME = "Georges Boubet";
const SIGN_ROLE = "Fondateur d'EbookStudio";

/** Adresses internes ou de test : jamais contactées en masse. */
function isInternalEmail(email: string): boolean {
  const e = email.trim().toLowerCase();
  if (!e || !e.includes("@")) return true;
  if (e.endsWith("@example.com")) return true;
  if (e.endsWith("@ebookstudio.fr")) return true;
  if (e.endsWith("@systemeio.local")) return true;
  if (e.includes("+test")) return true;
  if (e.includes("test-") || e.includes("-test")) return true;
  if (e.startsWith("boubetgeorges")) return true;
  if (e.includes("mail-tester.com")) return true;
  return false;
}

/** Boîtes grand public : les personnes qui peuvent vraiment vouloir écrire un livre. */
const PERSONAL_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "hotmail.fr", "hotmail.com", "hotmail.be",
  "outlook.fr", "outlook.com", "live.fr", "live.com", "msn.com",
  "yahoo.fr", "yahoo.com", "ymail.com",
  "orange.fr", "wanadoo.fr", "free.fr", "sfr.fr", "neuf.fr", "laposte.net",
  "bbox.fr", "numericable.fr", "aliceadsl.fr", "club-internet.fr",
  "icloud.com", "me.com", "mac.com", "protonmail.com", "proton.me", "gmx.fr", "aol.com",
]);

function isPersonalAddress(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return PERSONAL_DOMAINS.has(domain);
}

function renderParagraphs(): string {
  return PARAGRAPHS.map((block) => {
    const trimmed = block.trim();
    if (trimmed.startsWith("- ")) {
      const items = trimmed
        .split("\n")
        .map((line) => line.replace(/^-\s*/, "").replace(/;$/, "").trim())
        .filter(Boolean)
        .map((line) => `<li style="margin:0 0 8px;line-height:1.6">${line}</li>`)
        .join("");
      return `<ul style="margin:0 0 16px;padding-left:22px">${items}</ul>`;
    }
    return `<p style="margin:0 0 16px;line-height:1.65">${trimmed.replace(/\n/g, "<br />")}</p>`;
  }).join("\n");
}

function buildHtml(firstName: string | null): string {
  const hello = firstName ? `Bonjour ${firstName},` : "Bonjour,";
  return `<!DOCTYPE html><html lang="fr"><body style="margin:0;background:#FAFAFA">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${PREHEADER}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAFAFA;padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;font-family:Georgia,'Times New Roman',serif;color:#1f2937">
<tr><td style="background:#232F3E;padding:22px 26px;color:#ffffff;font:700 20px/1.3 Arial,Helvetica,sans-serif">
EbookStudio — ${SEATS} derniers accès à vie à ${PRICE} €
</td></tr>
<tr><td style="padding:26px;font-size:16px;line-height:1.6">
<p style="margin:0 0 16px">${hello}</p>
${renderParagraphs()}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:10px 0 22px"><tr>
<td style="background:#c2410c;border-radius:8px"><a href="${COMMANDER}" style="display:inline-block;padding:15px 28px;color:#ffffff;text-decoration:none;font:700 16px Arial,Helvetica,sans-serif">${CTA_LABEL}</a></td>
</tr></table>
<p style="margin:0;font-size:14px;color:#555">Une question avant de vous lancer ? Répondez à cet email : je lis et je réponds personnellement.</p>
<p style="margin:20px 0 0">${SIGN_NAME}<br><span style="color:#555;font-size:14px">${SIGN_ROLE} — ${DIRECT_EMAIL}</span></p>
</td></tr>
</table>
<p style="font-size:11px;color:#999;text-align:center;margin:16px 0 0">Vous recevez cet email car vous avez demandé à découvrir EbookStudio. Répondez « STOP » pour ne plus rien recevoir.</p>
</td></tr></table></body></html>`;
}

async function isAdmin(req: Request, baseUrl: string): Promise<boolean> {
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

interface Recipient {
  email: string;
  first_name: string | null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const respond = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const baseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    if (!(await isAdmin(req, baseUrl))) {
      return respond({ error: "Réservé aux administrateurs" }, 403);
    }

    const db = createClient(baseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    const body = await req.json().catch(() => ({} as Record<string, unknown>));
    const mode = body.mode === "send" ? "send" : body.mode === "test" ? "test" : "preview";
    const requested = Number(body.batchSize);
    const batchSize = BATCH_SIZES.includes(requested) ? requested : 300;

    // --- Test : un seul envoi, à l'adresse demandée, sans rien journaliser. ---
    if (mode === "test") {
      const to = typeof body.to === "string" ? body.to.trim().toLowerCase() : "";
      if (!EMAIL_RE.test(to)) return respond({ error: "Adresse de test invalide" }, 400);
      const res = await sendResendEmailThrottled({
        from: FROM_CAMPAIGN,
        to,
        reply_to: REPLY_TO,
        subject: `[TEST] ${SUBJECT}`,
        html: buildHtml(null),
      });
      return res.ok
        ? respond({ success: true, to })
        : respond({ error: res.detail || "Envoi refusé par Resend" }, 502);
    }

    // --- Exclusions : acheteurs, abonnés actifs, adresses internes. ---
    const exclude = new Set<string>();
    const addAll = (rows: unknown[] | null, key = "email") => {
      for (const row of rows ?? []) {
        const e = String((row as Record<string, unknown>)[key] ?? "").trim().toLowerCase();
        if (e) exclude.add(e);
      }
    };

    const { data: paidFunnel } = await db
      .from("funnel_orders").select("email").eq("status", "paid").limit(5000);
    addAll(paidFunnel);

    const { data: paidInst } = await db
      .from("v3_installment_orders").select("email")
      .in("status", ["active", "completed", "paid"]).limit(5000);
    addAll(paidInst);

    const { data: subs } = await db
      .from("subscribers").select("email").in("status", ["active", "trialing"]).limit(5000);
    addAll(subs);

    // --- Déjà contactés pour cette campagne. ---
    const { data: alreadyRows } = await db
      .from("offre_fondateur_sends").select("email, status").eq("email_id", EMAIL_ID).limit(20000);
    const sentSet = new Set<string>();
    for (const row of alreadyRows ?? []) {
      const r = row as { email?: string; status?: string };
      if (String(r.status) === "sent") sentSet.add(String(r.email ?? "").toLowerCase());
    }

    // --- Prospects candidats. ---
    const { data: prospects, error: prospectsError } = await db
      .from("sales_prospects")
      .select("email, first_name, unsubscribed, status")
      .eq("unsubscribed", false)
      .limit(20000);
    if (prospectsError) {
      return respond({ error: `Lecture des prospects impossible : ${prospectsError.message}` }, 500);
    }

    const seen = new Set<string>();
    const candidates: Recipient[] = [];
    for (const row of prospects ?? []) {
      const r = row as { email?: string; first_name?: string | null };
      const e = String(r.email ?? "").trim().toLowerCase();
      if (!EMAIL_RE.test(e)) continue;
      if (seen.has(e)) continue;
      if (isInternalEmail(e)) continue;
      if (!isPersonalAddress(e)) continue;
      if (exclude.has(e)) continue;
      if (sentSet.has(e)) continue;
      seen.add(e);
      const name = String(r.first_name ?? "").trim();
      candidates.push({ email: e, first_name: name ? name : null });
    }

    if (mode === "preview") {
      return respond({
        emailId: EMAIL_ID,
        subject: SUBJECT,
        batchSize,
        totalPending: candidates.length,
        alreadySent: sentSet.size,
        nextBatch: candidates.slice(0, batchSize).map((c) => c.email),
      });
    }

    // --- Envoi du lot. ---
    const batch = candidates.slice(0, batchSize);
    if (!batch.length) {
      return respond({ success: true, sentCount: 0, failed: [], remaining: 0, quotaStopped: false });
    }

    const sent: string[] = [];
    const failed: Array<{ email: string; error: string }> = [];
    let quotaStopped = false;

    for (const person of batch) {
      const res = await sendResendEmailThrottled({
        from: FROM_CAMPAIGN,
        to: person.email,
        reply_to: REPLY_TO,
        subject: SUBJECT,
        html: buildHtml(person.first_name),
      });

      if (res.ok) sent.push(person.email);
      else failed.push({ email: person.email, error: res.detail || `status ${res.status}` });

      await db.from("offre_fondateur_sends").upsert(
        {
          email: person.email,
          email_id: EMAIL_ID,
          batch_index: batchSize,
          status: res.ok ? "sent" : "error",
          error: res.ok ? null : (res.detail || `status ${res.status}`)?.slice(0, 500),
          sent_at: res.ok ? new Date().toISOString() : null,
        },
        { onConflict: "email,email_id" },
      );

      // Quota Resend épuisé : on arrête le lot, les adresses restantes
      // repartiront au prochain clic sans jamais recevoir deux fois.
      if (res.quotaExhausted || isQuotaExhausted()) {
        quotaStopped = true;
        break;
      }
    }

    return respond({
      success: true,
      sentCount: sent.length,
      failedCount: failed.length,
      failed: failed.slice(0, 20),
      remaining: Math.max(0, candidates.length - sent.length),
      quotaStopped,
    });
  } catch (err) {
    console.error("send-offre-fondateur error", err);
    return respond({ error: (err as Error).message ?? "Erreur inconnue" }, 500);
  }
});
