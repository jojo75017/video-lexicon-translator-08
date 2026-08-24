// Diagnostic Systeme.io : vérifie les tags homonymes et les tags réellement
// posés sur un contact. Aucune donnée sensible n'est renvoyée (noms/ids de tags).
import { getContactTags, findSystemeIoContactId } from "../_shared/systemeio.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEMEIO_BASE = "https://api.systeme.io/api";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const apiKey = Deno.env.get("SYSTEMEIO_API_KEY");
  if (!apiKey) return json({ ok: false, error: "SYSTEMEIO_API_KEY absente" }, 500);
  const headers = { Accept: "application/json", "X-API-Key": apiKey };

  const body = await req.json().catch(() => ({}));
  const tagName = String(body.tag || "ESSAI_EBOOKSTUDIO").trim();
  const email = String(body.email || "").trim().toLowerCase();

  // 1) Tous les tags du compte (toutes les pages) portant ce nom.
  const matches: { id: number; name: string }[] = [];
  let total = 0;
  let url: string | null = `${SYSTEMEIO_BASE}/tags?limit=100`;
  let guard = 0;
  while (url && guard++ < 30) {
    const res = await fetch(url, { headers });
    if (!res.ok) return json({ ok: false, error: `tags_${res.status}`, detail: (await res.text()).slice(0, 300) }, 502);
    const data = await res.json().catch(() => ({}));
    const items = Array.isArray(data?.items) ? data.items : [];
    total += items.length;
    for (const t of items) {
      if (String(t?.name ?? "").trim().toLowerCase() === tagName.toLowerCase()) {
        matches.push({ id: Number(t.id), name: String(t.name) });
      }
    }
    url = data?.hasMore && items.length > 0
      ? `${SYSTEMEIO_BASE}/tags?limit=100&startingAfter=${items[items.length - 1]?.id}`
      : null;
  }

  // 2) Tags réellement posés sur le contact demandé.
  let contact: unknown = null;
  if (email) {
    const contactId = await findSystemeIoContactId(email);
    const tags = contactId ? await getContactTags(contactId, headers) : null;
    contact = {
      email,
      contactId,
      tags,
      hasTag: !!tags?.some((t) => t.name.trim().toLowerCase() === tagName.toLowerCase()),
    };
  }

  return json({
    ok: true,
    tagName,
    totalTagsInAccount: total,
    matchingTags: matches,
    duplicateTagWarning: matches.length > 1,
    contact,
  });
});
