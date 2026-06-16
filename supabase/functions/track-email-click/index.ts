import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";

const OFFRES_LINK = "https://video-lexicon-translator-08.lovable.app/offres";

function isSafeUrl(u: string): boolean {
  try {
    const parsed = new URL(u);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  let target = OFFRES_LINK;
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("e");
    const step = url.searchParams.get("s");
    const dest = url.searchParams.get("u");

    if (dest) {
      const decoded = decodeURIComponent(dest);
      if (isSafeUrl(decoded)) target = decoded;
    }

    if (email && dest) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, serviceKey);

      await supabase.from("email_clicks").insert({
        prospect_email: decodeURIComponent(email),
        email_step: step ? parseInt(step, 10) : null,
        clicked_url: target,
        user_agent: req.headers.get("user-agent") || null,
      });
    }
  } catch (err) {
    console.error("track-email-click error:", err);
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: target,
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    },
  });
});
