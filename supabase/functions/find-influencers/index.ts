import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Platform = "tiktok" | "instagram" | "youtube" | "facebook";

const PLATFORM_SITE: Record<Platform, string> = {
  tiktok: "tiktok.com",
  instagram: "instagram.com",
  youtube: "youtube.com",
  facebook: "facebook.com",
};

interface Influencer {
  platform: Platform;
  name: string;
  handle: string | null;
  url: string;
  description: string;
  followers: string | null;
}

function extractHandle(url: string, platform: Platform): string | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    if (platform === "tiktok") {
      const at = parts.find((p) => p.startsWith("@"));
      return at || (parts[0] ? `@${parts[0]}` : null);
    }
    if (platform === "instagram") return parts[0] ? `@${parts[0]}` : null;
    if (platform === "youtube") {
      const at = parts.find((p) => p.startsWith("@"));
      return at || (parts[0] === "c" || parts[0] === "channel" ? parts[1] || null : parts[0] || null);
    }
    if (platform === "facebook") return parts[0] || null;
    return null;
  } catch {
    return null;
  }
}

function extractFollowers(text: string): string | null {
  // ex: "1.2M followers", "350K abonnés", "12 k abonnés"
  const m = text.match(/([\d.,]+\s?[KkMm]?)\s*(followers|abonn|subscribers|fans|j['’]aime)/i);
  return m ? m[1].trim() : null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");

    // --- Auth: admin only ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const anon = createClient(supabaseUrl, anonKey);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await anon.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const admin = createClient(supabaseUrl, serviceKey);
    const { data: roleData } = await admin
      .from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (!roleData) {
      return new Response(JSON.stringify({ error: "Accès admin requis" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!firecrawlKey) {
      return new Response(JSON.stringify({ error: "Firecrawl non configuré." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const keyword: string = (body.keyword || "").toString().trim();
    const platforms: Platform[] = Array.isArray(body.platforms) && body.platforms.length
      ? body.platforms.filter((p: string): p is Platform => p in PLATFORM_SITE)
      : ["tiktok", "instagram", "youtube", "facebook"];
    const perPlatform: number = Math.min(Math.max(Number(body.limit) || 6, 1), 10);

    if (!keyword) {
      return new Response(JSON.stringify({ error: "Mot-clé / niche requis." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: Influencer[] = [];

    for (const platform of platforms) {
      const site = PLATFORM_SITE[platform];
      const query = `${keyword} site:${site}`;
      try {
        const resp = await fetch("https://api.firecrawl.dev/v2/search", {
          method: "POST",
          headers: { Authorization: `Bearer ${firecrawlKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ query, limit: perPlatform, lang: "fr", country: "fr" }),
        });
        const data = await resp.json();
        if (!resp.ok) {
          console.error(`Firecrawl ${platform} error:`, data?.error || resp.status);
          continue;
        }
        const items: any[] = data?.data?.web || data?.data || data?.web || [];
        for (const it of items) {
          const url: string = it.url || it.link || "";
          if (!url || !url.includes(site)) continue;
          const title: string = (it.title || "").toString();
          const desc: string = (it.description || it.snippet || "").toString();
          results.push({
            platform,
            name: title.replace(/\s*[|\-•].*$/, "").trim() || extractHandle(url, platform) || url,
            handle: extractHandle(url, platform),
            url,
            description: desc.slice(0, 220),
            followers: extractFollowers(`${title} ${desc}`),
          });
        }
      } catch (e) {
        console.error(`Search failed for ${platform}:`, e);
      }
    }

    // dédoublonnage par URL
    const seen = new Set<string>();
    const unique = results.filter((r) => {
      if (seen.has(r.url)) return false;
      seen.add(r.url);
      return true;
    });

    return new Response(JSON.stringify({ success: true, keyword, count: unique.length, influencers: unique }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("find-influencers error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
