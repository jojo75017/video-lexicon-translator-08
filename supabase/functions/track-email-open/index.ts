import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";

const TRANSPARENT_PIXEL = Uint8Array.from(atob(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
), c => c.charCodeAt(0));

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("e");
    const step = url.searchParams.get("s");
    const template = url.searchParams.get("t");

    // Les balises de fusion non remplacées ({{contact.email}}) ne sont pas loggées.
    const decodedEmail = email ? decodeURIComponent(email).trim() : "";
    const isRealEmail = /^[^@\s{}]+@[^@\s{}]+\.[^@\s{}]+$/.test(decodedEmail);

    if (isRealEmail && step) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, serviceKey);

      await supabase.from("email_opens").insert({
        prospect_email: decodeURIComponent(email),
        email_step: parseInt(step, 10),
        template_name: template ? decodeURIComponent(template) : null,
        user_agent: req.headers.get("user-agent") || null,
      });
    }

    return new Response(TRANSPARENT_PIXEL, {
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  } catch {
    return new Response(TRANSPARENT_PIXEL, {
      headers: { "Content-Type": "image/gif" },
    });
  }
});
