import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";

const OFFRES_LINK = "https://video-lexicon-translator-08.lovable.app/offres";
const SAFE_V3_OFFER_LINK = "https://video-lexicon-translator-08.lovable.app/v3/offre";
const SAFE_V3_WHY_LINK = "https://video-lexicon-translator-08.lovable.app/v3/pourquoi";

function isSafeUrl(u: string): boolean {
  try {
    const parsed = new URL(u);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function rescueKnownBrokenUrl(u: string): string {
  try {
    const parsed = new URL(u);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "ebookstudio.fr" && parsed.pathname.startsWith("/v3/offre")) {
      return SAFE_V3_OFFER_LINK;
    }
    if (host === "ebookstudio.fr" && parsed.pathname.startsWith("/v3/pourquoi")) {
      return SAFE_V3_WHY_LINK;
    }
    return u;
  } catch {
    return u;
  }
}

Deno.serve(async (req) => {
  let target = OFFRES_LINK;
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("e");
    const step = url.searchParams.get("s");
    const dest = url.searchParams.get("u");
    const template = url.searchParams.get("t");

    if (dest) {
      const decoded = decodeURIComponent(dest);
      if (isSafeUrl(decoded)) target = rescueKnownBrokenUrl(decoded);
    }

    if (email && dest) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, serviceKey);

      await supabase.from("email_clicks").insert({
        prospect_email: decodeURIComponent(email),
        email_step: step ? parseInt(step, 10) : null,
        template_name: template ? decodeURIComponent(template) : null,
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
