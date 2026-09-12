import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabase = createClient(url, anon, { global: { headers: { Authorization: authHeader } } });
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) return json({ error: "Non authentifié" }, 401);
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: auth.user.id, _role: "admin" });
    if (!isAdmin) return json({ error: "Réservé aux administrateurs" }, 403);

    const key = Deno.env.get("RESEND_API_KEY");
    if (!key) return json({ error: "RESEND_API_KEY absente" }, 500);

    const res = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${key}` },
    });
    const text = await res.text();
    if (!res.ok) {
      console.error(`Resend domains failed [${res.status}]: ${text}`);
      return json({ error: "Resend a refusé", status: res.status, details: text }, res.status);
    }
    let domains = JSON.parse(text);
    if (Array.isArray(domains)) {
      domains = domains.filter((d) => (d.name || "").includes("ebookstudio"));
    }
    return json({ domains });
  } catch (err) {
    console.error("resend-domain-status error", err);
    return json({ error: (err as Error).message ?? "Erreur inconnue" }, 500);
  }
});
