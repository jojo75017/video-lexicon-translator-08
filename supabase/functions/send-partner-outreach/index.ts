import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { sendResendEmailThrottled } from "../_shared/resendThrottle.ts";
import { FROM_CAMPAIGN, REPLY_TO } from "../_shared/emailIdentity.ts";

/**
 * Envoi d'un message de démarchage partenaire, une cible à la fois.
 *
 * Réservé aux administrateurs (has_role). Aucun envoi de masse : un appel =
 * un destinataire, saisi manuellement par l'administrateur. Aucune écriture
 * en base ici : le suivi est mis à jour côté application.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const RATE = 15;
const PARTNER_URL = "https://ebookstudio.fr/partenaires";
const OPENING = "1er octobre 2026";

const buildMessage = (name: string, niche: string, relance: boolean) => {
  const who = name || "Bonjour";
  if (relance) {
    return {
      subject: "Petite relance — partenariat EbookStudio",
      text: `Bonjour ${who},

Je me permets un seul message de relance, au cas où le précédent serait passé inaperçu.

La proposition tient en deux lignes : accès complet gratuit à EbookStudio V3 pour le tester, et ${RATE} % de commission sur le premier paiement si vous décidez de le recommander.

Le détail : ${PARTNER_URL}

Sans réponse de votre part, je ne vous écrirai plus — bonne continuation dans tous les cas.

Georges Boubet`,
    };
  }
  return {
    subject: `Partenariat — outil d'écriture et de publication KDP (${RATE} % de commission)`,
    text: `Bonjour ${who},

Je suis Georges Boubet, auteur sur Amazon KDP. J'ai développé EbookStudio, un studio francophone qui accompagne un livre du sommaire jusqu'au fichier accepté par KDP : écriture chapitre par chapitre avec mémoire du livre, correction en quatre passes, couverture aux gabarits Amazon, données KDP prêtes à coller.

La version 3 ouvre le ${OPENING}, en abonnement (27 € et 47 € par mois).

Je vous écris parce que votre travail${niche ? ` sur ${niche}` : ""} parle à des gens qui publient déjà. La proposition est simple : ${RATE} % de commission sur le premier paiement de chaque abonnement souscrit via votre lien. Je vous ouvre un accès complet gratuit pour que vous testiez avant de décider — je ne vous demande pas de recommander à l'aveugle.

Le détail est ici : ${PARTNER_URL}

Si le sujet ne colle pas à votre ligne, dites-le moi simplement, je n'insisterai pas.

Bien à vous,
Georges Boubet`,
  };
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader) return json({ success: false, error: "Non authentifié." }, 401);

    const client = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData?.user) return json({ success: false, error: "Non authentifié." }, 401);

    const { data: allowed } = await client.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!allowed) return json({ success: false, error: "Accès réservé à l'administration." }, 403);

    const body = await req.json().catch(() => ({}));
    const to = String(body?.to ?? "").trim();
    const name = String(body?.name ?? "").trim();
    const niche = String(body?.niche ?? "").trim();
    const relance = body?.relance === true;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(to)) {
      return json({ success: false, error: "Adresse e-mail invalide." }, 400);
    }

    const { subject, text } = buildMessage(name, niche, relance);
    const res = await sendResendEmailThrottled({
      from: FROM_CAMPAIGN,
      to,
      subject,
      text,
      reply_to: REPLY_TO,
      tags: [{ name: "template", value: relance ? "partner-relance" : "partner-premier" }],
    });

    if (!res.ok) {
      const quota = res.quotaExhausted || res.status === 429;
      return json(
        {
          success: false,
          error: quota
            ? "Quota d'envoi atteint pour aujourd'hui, réessayez demain."
            : `Envoi refusé (${res.detail ?? res.status ?? "erreur"}).`,
        },
        200,
      );
    }

    return json({ success: true, id: res.id, subject });
  } catch (error) {
    console.error("send-partner-outreach error:", error);
    return json({ success: false, error: "Erreur lors de l'envoi." }, 200);
  }
});
