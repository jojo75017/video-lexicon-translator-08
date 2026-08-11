// Renomme les chapitres génériques (« Chapitre 12 ») d'un projet à partir de leur contenu,
// puis enregistre les titres dans ebook_projects.chapters (le sommaire d'export suit).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const isGeneric = (t: string) =>
  !t || t.trim().length < 3 || /^\s*(chapitre|chapter)\s*\d+\s*$/i.test(t.trim()) || /^\s*\d+\s*$/.test(t.trim());

const cleanExcerpt = (c: string) =>
  String(c || "")
    .replace(/^\s*(chapitre|chapter)\s*\d+\s*[:–—-]?\s*/i, "")
    .replace(/[#*_>]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 800);

async function nameBatch(bookTitle: string, batch: { number: number; excerpt: string }[], apiKey: string) {
  const prompt = [
    `Livre : « ${bookTitle || "Sans titre"} ».`,
    "Pour chaque extrait de chapitre, propose UN titre littéraire évocateur de 2 à 6 mots,",
    "sans numéro, sans guillemets, sans le mot « Chapitre », en français, fidèle à l'extrait.",
    "Tous les titres doivent être différents.",
    "INTERDIT : latin ou faux latin, langue morte, mot inventé, expression en langue étrangère. 100 % français.",
    'Réponds STRICTEMENT en JSON : {"titles":[{"number":1,"title":"..."}]}',
    "",
    ...batch.map((c) => `--- Chapitre ${c.number} ---\n${c.excerpt}`),
  ].join("\n");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: "Tu es un éditeur littéraire francophone. Tu réponds uniquement en JSON valide." },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Erreur IA (${res.status})`);
  const data = await res.json();
  const raw = String(data?.choices?.[0]?.message?.content || "").replace(/```json|```/gi, "").trim();
  const m = raw.match(/\{[\s\S]*\}/);
  const parsed = JSON.parse(m ? m[0] : raw);
  const list: { number: number; title: string }[] = Array.isArray(parsed?.titles) ? parsed.titles : [];
  return list
    .map((t) => ({
      number: Number(t?.number),
      title: String(t?.title || "")
        .replace(/^\s*chapitre\s*\d*\s*[:–—-]?\s*/i, "")
        .replace(/["«»*#]/g, "")
        .trim()
        .slice(0, 90),
    }))
    .filter((t) => Number.isFinite(t.number) && t.title.length >= 3);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { projectId } = (await req.json()) as { projectId?: string };
    if (!projectId) return json(400, { error: "projectId requis" });

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json(500, { error: "Service IA indisponible." });

    const url = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    const admin = createClient(url, serviceKey);

    // Le service role peut réparer n'importe quel projet ; un abonné, uniquement les siens.
    let ownerCheck: string | null = null;
    if (token && token !== serviceKey) {
      const { data: userData } = await admin.auth.getUser(token);
      if (!userData?.user) return json(401, { error: "Non authentifié" });
      ownerCheck = userData.user.id;
    }

    const { data: project, error } = await admin
      .from("ebook_projects")
      .select("id,user_id,title,chapters")
      .eq("id", projectId)
      .maybeSingle();
    if (error || !project) return json(404, { error: "Projet introuvable" });
    if (ownerCheck && project.user_id !== ownerCheck) return json(403, { error: "Accès refusé" });

    const chapters = Array.isArray(project.chapters) ? [...(project.chapters as any[])] : [];
    if (!chapters.length) return json(400, { error: "Aucun chapitre" });

    const targets = chapters
      .map((c, i) => ({ index: i, number: i + 1, title: String(c?.title || c?.titre || ""), excerpt: cleanExcerpt(c?.content || "") }))
      .filter((c) => isGeneric(c.title) && c.excerpt.length > 80);

    if (!targets.length) return json(200, { updated: 0, message: "Tous les chapitres ont déjà un titre." });

    const used = new Set(
      chapters
        .map((c) => String(c?.title || c?.titre || "").trim().toLowerCase())
        .filter((t) => t && !isGeneric(t)),
    );

    const renamed: { number: number; title: string }[] = [];
    for (let i = 0; i < targets.length; i += 10) {
      const batch = targets.slice(i, i + 10);
      const titles = await nameBatch(project.title || "", batch.map(({ number, excerpt }) => ({ number, excerpt })), apiKey);
      for (const t of titles) {
        const key = t.title.toLowerCase();
        if (used.has(key)) continue;
        const target = batch.find((b) => b.number === t.number);
        if (!target) continue;
        used.add(key);
        chapters[target.index] = { ...chapters[target.index], title: t.title, titre: t.title };
        renamed.push({ number: t.number, title: t.title });
      }
    }

    if (!renamed.length) return json(502, { error: "L'IA n'a renvoyé aucun titre exploitable." });

    const { error: upError } = await admin
      .from("ebook_projects")
      .update({ chapters, updated_at: new Date().toISOString() })
      .eq("id", projectId);
    if (upError) return json(500, { error: upError.message });

    return json(200, { updated: renamed.length, titles: renamed });
  } catch (e) {
    return json(500, { error: e instanceof Error ? e.message : "Erreur inconnue" });
  }
});
