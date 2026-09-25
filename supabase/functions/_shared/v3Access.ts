// Accès abonné V3 : attribution du droit + email de bienvenue avec le code.
// Utilisé par le webhook de paiement et par la page de remerciement du tunnel.
// Aucun envoi n'a lieu sans paiement confirmé côté Stripe.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { EMAIL_SENDING_ENABLED } from "./emailSendingGuard.ts";

export type V3PlanKey = "plume" | "edition" | "maison";

export interface V3PlanInfo {
  plan: V3PlanKey;
  interval: "month" | "year";
  label: string;
}

const PLAN_LABELS: Record<V3PlanKey, string> = {
  plume: "Plume",
  edition: "Édition",
  maison: "Maison d'Édition",
};

/** Déduit le forfait et la périodicité depuis un identifiant de prix `v3_*`. */
export function parseV3PriceId(priceId: string): V3PlanInfo | null {
  const m = /^v3_(plume|edition|maison)_(monthly|annual)(_legacy)?$/.exec(priceId || "");
  if (!m) return null;
  const plan = m[1] as V3PlanKey;
  const interval = m[2] === "monthly" ? "month" : "year";
  return {
    plan,
    interval,
    label: `${PLAN_LABELS[plan]} — ${interval === "month" ? "abonnement mensuel" : "abonnement annuel"}${m[3] ? " (tarif ancien client)" : ""}`,
  };
}

export function generateAccessCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const value = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `EBK-${value}`;
}

function admin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

/**
 * Ouvre l'accès abonné et renvoie le code d'accès (stable : un abonné garde
 * toujours le même code s'il en possède déjà un).
 */
export async function grantV3SubscriptionAccess(
  email: string,
  priceId: string,
): Promise<{ code: string; info: V3PlanInfo | null }> {
  const supabase = admin();
  const clean = email.trim().toLowerCase();
  const info = parseV3PriceId(priceId);

  const { data: existing } = await supabase
    .from("subscribers")
    .select("access_code")
    .ilike("email", clean)
    .maybeSingle();

  const code = (existing as { access_code?: string } | null)?.access_code || generateAccessCode();

  await supabase.from("subscribers").upsert(
    {
      email: clean,
      access_code: code,
      status: "active",
      plan_type: "subscription",
      plan_tier: info?.plan ?? "plume",
      expires_at: null,
    },
    { onConflict: "email" },
  );

  return { code, info };
}

/** Email de service : confirmation de paiement + code d'accès. */
export async function sendV3AccessEmail(
  email: string,
  planLabel: string,
  code: string,
): Promise<boolean> {
  if (!EMAIL_SENDING_ENABLED) return false;
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) {
    console.warn("RESEND_API_KEY manquante — email d'accès non envoyé");
    return false;
  }

  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#232F3E;background:#FAFAFA;padding:24px;border-radius:12px">
    <h1 style="color:#008296;margin:0 0 12px">Votre accès EbookStudio V3 est ouvert</h1>
    <p>Bonjour,</p>
    <p>Votre paiement est confirmé : <strong>${planLabel}</strong>.</p>
    <p>Voici votre accès personnel. Conservez cet email : le code ci-dessous vous permet de récupérer votre accès à tout moment.</p>
    <p style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:20px 0">
      <strong>Votre email :</strong> ${email}<br/>
      <strong>Votre code d'accès :</strong> <span style="font-size:20px;letter-spacing:2px;color:#008296"><strong>${code}</strong></span>
    </p>
    <p style="text-align:center;margin:26px 0">
      <a href="https://ebookstudio.fr/connexion-abonne" style="background:#FF9E2D;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">
        Ouvrir mon espace
      </a>
    </p>
    <p>Première étape conseillée : créez votre premier livre depuis le tableau de bord, le Génie vous guide de la fiche du livre jusqu'au sommaire.</p>
    <p>À très vite,<br/>Georges</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
    <p style="font-size:12px;color:#6b7280">Vous recevez cet email car votre paiement vient d'être confirmé sur ebookstudio.fr.</p>
  </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "EbookStudio <noreply@ebookstudio.fr>",
        to: [email],
        subject: "🎉 Votre accès EbookStudio V3 est ouvert (code à l'intérieur)",
        html,
      }),
    });
    if (!res.ok) {
      console.error("Resend accès V3:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("Email accès V3 échoué:", (e as Error).message);
    return false;
  }
}
