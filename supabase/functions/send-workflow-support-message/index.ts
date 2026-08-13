import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const EmailSchema = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    const backendUrl = Deno.env.get("SUPABASE_URL");
    const publishableKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!authHeader || !backendUrl || !publishableKey || !resendKey) {
      return new Response(JSON.stringify({ error: "Configuration indisponible" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const client = createClient(backendUrl, publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: authHeader } },
    });
    const { data: authData, error: authError } = await client.auth.getUser();
    if (authError || !authData.user) {
      return new Response(JSON.stringify({ error: "Non authentifié" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: isAdmin } = await client.rpc("has_role", {
      _user_id: authData.user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Accès refusé" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!EmailSchema.test(email)) {
      return new Response(JSON.stringify({ error: "Email invalide" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const subject = typeof body?.subject === "string" && body.subject.trim()
      ? body.subject.trim()
      : "Votre workflow EbookStudio peut reprendre à P10";
    const html = typeof body?.html === "string" && body.html.trim()
      ? body.html.trim()
      : `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#232f3e;line-height:1.65">
          <p>Bonjour,</p>
          <p>J’ai vérifié votre compte et votre livre <strong>« Reconversion professionnelle après 40 ans »</strong>.</p>
          <p>Votre accès est bien actif et les étapes <strong>P1 à P9 sont sauvegardées</strong>. Le nouveau blocage à P10 venait de la limite quotidienne de requêtes de votre clé Gemini gratuite.</p>
          <p>J’ai ajouté un relais automatique sécurisé : lorsque cette limite est atteinte pendant un workflow, EbookStudio poursuit désormais la génération sans supprimer les étapes déjà terminées.</p>
          <p>Vous pouvez vous reconnecter à EbookStudio, ouvrir votre workflow puis cliquer sur <strong>« Reprendre le workflow »</strong>. Il reprendra à P10 : vous ne devez pas repartir de zéro.</p>
          <p>Si le navigateur affiche encore l’ancien message, actualisez la page une fois avant de cliquer sur la reprise.</p>
          <p>Bien cordialement,<br><strong>Georges — EbookStudio</strong></p>
        </div>`;

    const resend = new Resend(resendKey);
    const sent = await resend.emails.send({
      from: "Georges Boubet <noreply@ebookstudio.fr>",
      to: [email],
      reply_to: "contact@ebookstudio.fr",
      subject,
      html,
    });

    if (sent.error) throw new Error(sent.error.message);
    return new Response(JSON.stringify({ success: true, id: sent.data?.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Erreur interne" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
