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
  kind: "createur" | "maison_edition";
}

/** Heuristic: detect publishing houses / brands vs individual creators. */
const BRAND_RX = /(\b|_|\.)(editions?|éditions?|edition|press|presse|publishing|maison|books|livres|magazine|media|m[ée]dias?|prod|productions?|studio|officiel|official|store|shop|boutique)(\b|_|\.|s\b)/i;
function classify(name: string, handle: string | null): "createur" | "maison_edition" {
  const t = `${name} ${handle || ""}`;
  return BRAND_RX.test(t) ? "maison_edition" : "createur";
}

const RESERVED = new Set([
  "tag", "video", "reel", "reels", "p", "explore", "channel", "c", "watch",
  "shorts", "hashtag", "discover", "music", "live", "about", "search", "pages",
  "groups", "story", "stories", "user", "embed", "popular", "directory", "topic",
]);

/** Returns a clean profile {handle, url} or null if the URL is not a creator profile. */
function toProfile(rawUrl: string, platform: Platform): { handle: string; url: string } | null {
  try {
    const u = new URL(rawUrl);
    const parts = u.pathname.split("/").filter(Boolean);
    if (!parts.length) return null;

    if (platform === "tiktok") {
      const at = parts.find((p) => p.startsWith("@"));
      if (!at || at.length < 3) return null;
      const handle = at;
      return { handle, url: `https://www.tiktok.com/${handle}` };
    }
    if (platform === "youtube") {
      const at = parts.find((p) => p.startsWith("@"));
      if (at) return { handle: at, url: `https://www.youtube.com/${at}` };
      if ((parts[0] === "channel" || parts[0] === "c") && parts[1]) {
        return { handle: parts[1], url: `https://www.youtube.com/${parts[0]}/${parts[1]}` };
      }
      return null;
    }
    if (platform === "instagram") {
      const first = parts[0];
      if (!first || RESERVED.has(first.toLowerCase())) return null;
      return { handle: `@${first}`, url: `https://www.instagram.com/${first}/` };
    }
    if (platform === "facebook") {
      const first = parts[0];
      if (!first || RESERVED.has(first.toLowerCase()) || first.includes(".php")) return null;
      return { handle: first, url: `https://www.facebook.com/${first}` };
    }
    return null;
  } catch {
    return null;
  }
}

function extractFollowers(text: string): string | null {
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
          // over-fetch since many results are videos/hashtags that get filtered out
          body: JSON.stringify({ query, limit: Math.min(perPlatform * 3, 25), lang: "fr", country: "fr" }),
        });
        const data = await resp.json();
        if (!resp.ok) {
          console.error(`Firecrawl ${platform} error:`, data?.error || resp.status);
          continue;
        }
        const items: any[] = data?.data?.web || data?.data || data?.web || [];
        let kept = 0;
        for (const it of items) {
          if (kept >= perPlatform) break;
          const url: string = it.url || it.link || "";
          if (!url || !url.includes(site)) continue;
          const profile = toProfile(url, platform);
          if (!profile) continue;
          const title: string = (it.title || "").toString();
          const desc: string = (it.description || it.snippet || "").toString();
          results.push({
            platform,
            name: title.replace(/\s*[|\-•(].*$/, "").trim() || profile.handle,
            handle: profile.handle,
            url: profile.url,
            description: desc.slice(0, 220),
            followers: extractFollowers(`${title} ${desc}`),
          });
          kept++;
        }
      } catch (e) {
        console.error(`Search failed for ${platform}:`, e);
      }
    }

    // dédoublonnage par profil (url)
    const seen = new Set<string>();
    const unique = results.filter((r) => {
      const key = r.url.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
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
