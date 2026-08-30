/**
 * Envoi d'un email de TEST de la campagne unique.
 *
 * - réservé aux admins (has_role) ;
 * - n'écrit rien dans email_send_log ni sales_prospects ;
 * - objet préfixé [TEST] pour ne jamais polluer les statistiques.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { FROM_CAMPAIGN, REPLY_TO } from "../_shared/emailIdentity.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/** Les 5 seuls emails de la campagne unique. */
const ALLOWED_IDS = new Set(["cadeau-1", "cadeau-2", "cadeau-3", "cadeau-4", "cadeau-5"]);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const authHeader = req.headers.get("Authorization") ?? "";

    const supabase = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: auth, error: authError } = await supabase.auth.getUser();
    const user = auth?.user;
    if (authError || !user) return json({ error: "Non authentifié" }, 401);

    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (!isAdmin) return json({ error: "Réservé aux administrateurs" }, 403);

    const body = await req.json().catch(() => null);
    const emailId = typeof body?.emailId === "string" ? body.emailId : "";
    const to = typeof body?.to === "string" ? body.to.trim() : "";
    const subject = typeof body?.subject === "string" ? body.subject : "";
    const html = typeof body?.html === "string" ? body.html : "";

    if (!ALLOWED_IDS.has(emailId)) return json({ error: "Email de campagne inconnu" }, 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return json({ error: "Adresse email invalide" }, 400);
    if (!subject || subject.length > 300) return json({ error: "Objet invalide" }, 400);
    if (!html || html.length > 200_000) return json({ error: "Contenu invalide" }, 400);

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) return json({ error: "RESEND_API_KEY absente" }, 500);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_CAMPAIGN,
        to: [to],
        reply_to: REPLY_TO,
        subject: `[TEST] ${subject}`,
        html,
      }),
    });

    const text = await res.text();
    if (!res.ok) {
      console.error(`Resend test failed [${res.status}]: ${text}`);
      return json({ error: "Envoi refusé par Resend", status: res.status, details: text }, res.status);
    }

    return json({ success: true, to, emailId });
  } catch (err) {
    console.error("send-campaign-test error", err);
    return json({ error: (err as Error).message ?? "Erreur inconnue" }, 500);
  }
});
