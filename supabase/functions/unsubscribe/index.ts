import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const html = (title: string, body: string) => `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>${title}</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{font-family:Inter,Arial,sans-serif;background:#FAFAFA;color:#232F3E;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:24px}
.card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:40px;max-width:480px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.04)}
h1{color:#008296;margin-top:0}a{color:#008296}</style>
</head><body><div class="card">${body}</div></body></html>`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = new URL(req.url);
  const email = (url.searchParams.get("email") || "").trim().toLowerCase();
  const seq = (url.searchParams.get("seq") || "all").trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(html("Erreur", "<h1>Lien invalide</h1><p>Cet email est invalide.</p>"), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    let sequenceQuery = supabase
      .from("email_sequences")
      .update({ unsubscribed: true, completed: true })
      .ilike("email", email);
    if (seq !== "all") sequenceQuery = sequenceQuery.eq("sequence_name", seq);
    await sequenceQuery;

    await supabase
      .from("sales_prospects")
      .update({ unsubscribed: true, auto_send: false, completed: true, next_email_at: null })
      .ilike("email", email);

    return new Response(
      html(
        "Désinscription confirmée",
        `<h1>✅ Désinscription confirmée</h1>
         <p>L'adresse <strong>${email}</strong> ne recevra plus aucun email marketing EbookStudio.</p>
         <p><a href="https://ebookstudio.fr">Retour au site</a></p>`,
      ),
      { headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" } },
    );
  } catch (e) {
    return new Response(html("Erreur", `<h1>Erreur</h1><p>${(e as Error).message}</p>`), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
    });
  }
});
