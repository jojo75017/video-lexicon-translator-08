// Studio Pro — Phase 1 : Gemini construit la BIBLE du livre depuis la fiche maître.
// Rôle Gemini = architecture / analyse / cohérence (JAMAIS la rédaction).
// Clé de l'abonné en priorité, repli clé serveur, puis repli passerelle Lovable AI.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

interface MasterSheet {
  title?: string;
  subtitle?: string;
  book_kind?: string;
  genre?: string;
  target_audience?: string;
  objective?: string;
  chapters_target?: number;
  length_target?: string;
  tone?: string;
  writing_style?: string;
  language_level?: string;
  narrative_pov?: string;
  era?: string;
  places?: string;
  main_characters?: string;
  constraints?: string;
  source_notes?: string;
  with_images?: boolean;
}

interface Body {
  sheet?: MasterSheet;
  userApiKey?: string;
  /** 'full' = bible complète ; sinon une section précise à régénérer */
  section?: "full" | "synopsis" | "structure" | "characters" | "timeline" | "places" | "plot_threads" | "pedagogy";
  /** Bible actuelle (pour une régénération ciblée) */
  current?: Record<string, unknown>;
  /** Consigne libre de l'auteur */
  guidance?: string;
}

const FICTION_KINDS = ["roman", "thriller", "policier", "fantasy", "romance", "biographie", "nouvelle"];

function sanitizeApiKey(value: unknown): string {
  return typeof value === "string"
    ? value.replace(/[\u200B-\u200D\uFEFF\u00A0]/g, "").replace(/["'`]/g, "").replace(/\s+/g, "").trim()
    : "";
}

function isValidGoogleKey(key: string): boolean {
  const k = sanitizeApiKey(key);
  if (!k) return false;
  if (/^AIza[A-Za-z0-9_-]{20,}$/.test(k)) return true;
  return /^[A-Za-z0-9._-]{30,}$/.test(k);
}

async function callGemini(prompt: string, apiKey: string, maxTokens: number) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${encodeURIComponent(sanitizeApiKey(apiKey))}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.6, maxOutputTokens: maxTokens },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("Gemini error:", res.status, text.slice(0, 400));
    return { ok: false as const, status: res.status };
  }
  const data = await res.json();
  return { ok: true as const, text: data?.candidates?.[0]?.content?.parts?.[0]?.text || "" };
}

async function callLovableAI(prompt: string, maxTokens: number) {
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) return { ok: false as const, status: 500 };
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "edge-function-direct",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3.6-flash",
      messages: [
        { role: "system", content: "Tu réponds uniquement en JSON valide, sans markdown, en français." },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      max_tokens: maxTokens,
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error("Lovable AI error:", res.status, text.slice(0, 400));
    return { ok: false as const, status: res.status };
  }
  try {
    const data = JSON.parse(text);
    return { ok: true as const, text: data?.choices?.[0]?.message?.content || "" };
  } catch {
    return { ok: true as const, text };
  }
}

function parseJson(raw: string): any {
  try {
    return JSON.parse(raw);
  } catch {
    const m = raw.match(/\{[\s\S]*\}/);
    if (m) { try { return JSON.parse(m[0]); } catch { /* noop */ } }
    return null;
  }
}

const LANGUE_RULE = `RÈGLE ABSOLUE DE LANGUE : tout est rédigé en français courant.
INTERDIT : latin, faux latin, langues mortes, pseudo-langues, mots inventés, mots étrangers décoratifs, titres en langue étrangère.
Seules exceptions : noms propres réels et titres d'œuvres réelles.`;

function sheetBlock(s: MasterSheet): string {
  const lines: string[] = [];
  const add = (label: string, v?: unknown) => {
    const val = typeof v === "number" ? String(v) : String(v ?? "").trim();
    if (val) lines.push(`${label} : ${val}`);
  };
  add("Titre provisoire", s.title);
  add("Sous-titre", s.subtitle);
  add("Type de livre", s.book_kind);
  add("Genre", s.genre);
  add("Public cible", s.target_audience);
  add("Objectif du livre", s.objective);
  add("Nombre de chapitres souhaité", s.chapters_target);
  add("Longueur approximative", s.length_target);
  add("Ton", s.tone);
  add("Style", s.writing_style);
  add("Niveau de langage", s.language_level);
  add("Point de vue narratif", s.narrative_pov);
  add("Époque", s.era);
  add("Lieux", s.places);
  add("Personnages principaux", s.main_characters);
  add("Contraintes particulières", s.constraints);
  add("Informations / documents sources", s.source_notes);
  add("Illustrations prévues", s.with_images ? "oui" : "non");
  return lines.join("\n");
}

function fullPrompt(s: MasterSheet, fiction: boolean, count: number, guidance?: string) {
  const fictionSchema = `"characters": [{"nom":"","role":"","age":"","personnalite":"","motivations":"","relations":"","secrets":"","arc":""}],
  "timeline": [{"repere":"","evenement":"","consequence":""}],
  "places": [{"nom":"","description":"","importance":""}],
  "plot_threads": [{"fil":"","plante_au_chapitre":1,"recolte_au_chapitre":3,"type":"indice|fausse piste|revelation|retournement","resolution":""}],
  "pedagogy": []`;
  const nonFictionSchema = `"characters": [],
  "timeline": [],
  "places": [],
  "plot_threads": [{"fil":"notion introduite puis réutilisée","plante_au_chapitre":1,"recolte_au_chapitre":4,"type":"notion","resolution":""}],
  "pedagogy": [{"etape":"","acquis":"","prerequis":"","chapitre":1}]`;

  return `Tu es DIRECTEUR ÉDITORIAL et ARCHITECTE de livres publiés sur Amazon KDP.
Tu ne rédiges AUCUN chapitre : tu construis uniquement l'architecture complète et vérifiable du livre (la « Bible du livre »).

${LANGUE_RULE}

FICHE MAÎTRE DU LIVRE
${sheetBlock(s)}
${guidance ? `\nCONSIGNE DE L'AUTEUR : ${guidance}` : ""}

TRAVAIL DEMANDÉ
1. Concept général et promesse claire du livre.
2. Synopsis complet (250 à 400 mots) qui couvre le début, le milieu et la fin.
3. Structure en ${count} chapitres exactement, regroupés en parties cohérentes.
4. Pour chaque chapitre : titre définitif évocateur (jamais « Chapitre 1 »), objectif précis, résumé prévu (2 à 4 phrases), 2 à 5 sous-chapitres, nombre de mots visé.
5. Les éléments introduits tôt doivent être repris plus tard : renseigne-les dans plot_threads.
${fiction
    ? "6. Fiches personnages détaillées, chronologie datée, lieux, arcs narratifs, indices, révélations, retournements et résolution finale cohérente."
    : "6. Progression pédagogique du simple au complexe, sans doublon entre chapitres, avec prérequis et acquis par étape."}

Réponds UNIQUEMENT en JSON valide, sans markdown :
{
  "concept": "",
  "promise": "",
  "synopsis": "",
  "structure": [{"partie":"","numero":1,"titre":"","objectif":"","resume":"","sous_chapitres":["",""],"mots_vises":1800}],
  ${fiction ? fictionSchema : nonFictionSchema},
  "notes": "points de vigilance pour la rédaction"
}
La liste "structure" doit contenir exactement ${count} éléments numérotés de 1 à ${count}.`;
}

function sectionPrompt(section: string, s: MasterSheet, current: Record<string, unknown>, count: number, guidance?: string) {
  const shapes: Record<string, string> = {
    synopsis: `{"concept":"","promise":"","synopsis":""}`,
    structure: `{"structure":[{"partie":"","numero":1,"titre":"","objectif":"","resume":"","sous_chapitres":["",""],"mots_vises":1800}]}`,
    characters: `{"characters":[{"nom":"","role":"","age":"","personnalite":"","motivations":"","relations":"","secrets":"","arc":""}]}`,
    timeline: `{"timeline":[{"repere":"","evenement":"","consequence":""}]}`,
    places: `{"places":[{"nom":"","description":"","importance":""}]}`,
    plot_threads: `{"plot_threads":[{"fil":"","plante_au_chapitre":1,"recolte_au_chapitre":3,"type":"","resolution":""}]}`,
    pedagogy: `{"pedagogy":[{"etape":"","acquis":"","prerequis":"","chapitre":1}]}`,
  };
  return `Tu es DIRECTEUR ÉDITORIAL. Tu régénères UNIQUEMENT la section « ${section} » de la Bible d'un livre, en gardant une cohérence totale avec le reste.

${LANGUE_RULE}

FICHE MAÎTRE
${sheetBlock(s)}

BIBLE ACTUELLE (à respecter, ne pas contredire)
${JSON.stringify(current).slice(0, 12000)}
${guidance ? `\nCONSIGNE DE L'AUTEUR : ${guidance}` : ""}

${section === "structure" ? `La structure doit contenir exactement ${count} chapitres numérotés de 1 à ${count}.` : ""}

Réponds UNIQUEMENT en JSON valide, sans markdown, avec cette forme :
${shapes[section] || shapes.synopsis}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const body = (await req.json()) as Body;
    const sheet = body.sheet || {};
    const title = String(sheet.title || "").trim();
    if (title.length < 3) return json(400, { error: "Titre requis (au moins 3 caractères)" });

    const count = Math.min(40, Math.max(3, Number(sheet.chapters_target) || 12));
    const fiction = FICTION_KINDS.includes(String(sheet.book_kind || "roman").toLowerCase());
    const section = body.section || "full";
    const maxTokens = section === "full" ? Math.min(24000, 4000 + count * 320) : 6000;

    const prompt = section === "full"
      ? fullPrompt(sheet, fiction, count, body.guidance)
      : sectionPrompt(section, sheet, body.current || {}, count, body.guidance);

    const userKey = sanitizeApiKey(body.userApiKey);
    const serverKey = sanitizeApiKey(Deno.env.get("GEMINI_API_KEY") || "");

    let raw = "";
    let engine = "gemini";
    const keys = [userKey, serverKey].filter((k) => isValidGoogleKey(k));
    for (const k of keys) {
      const r = await callGemini(prompt, k, maxTokens);
      if (r.ok && r.text) { raw = r.text; break; }
    }
    if (!raw) {
      const r = await callLovableAI(prompt, maxTokens);
      if (r.ok && r.text) { raw = r.text; engine = "gemini-lovable"; }
    }
    if (!raw) return json(502, { error: "L'architecte IA n'a pas répondu. Réessayez dans un instant." });

    const parsed = parseJson(raw);
    if (!parsed) return json(502, { error: "Réponse IA illisible. Relancez la génération." });

    if (section === "full") {
      const structure = Array.isArray(parsed.structure) ? parsed.structure : [];
      if (structure.length < 2) return json(502, { error: "Structure incomplète. Relancez la génération." });
      return json(200, {
        engine,
        section,
        bible: {
          concept: String(parsed.concept || ""),
          promise: String(parsed.promise || ""),
          synopsis: String(parsed.synopsis || ""),
          structure: structure.slice(0, count).map((c: any, i: number) => ({
            partie: String(c?.partie || ""),
            numero: Number(c?.numero) || i + 1,
            titre: String(c?.titre || c?.title || `Chapitre ${i + 1}`).trim(),
            objectif: String(c?.objectif || ""),
            resume: String(c?.resume || ""),
            sous_chapitres: Array.isArray(c?.sous_chapitres) ? c.sous_chapitres.map((x: any) => String(x)) : [],
            mots_vises: Number(c?.mots_vises) || 1800,
          })),
          characters: Array.isArray(parsed.characters) ? parsed.characters : [],
          timeline: Array.isArray(parsed.timeline) ? parsed.timeline : [],
          places: Array.isArray(parsed.places) ? parsed.places : [],
          plot_threads: Array.isArray(parsed.plot_threads) ? parsed.plot_threads : [],
          pedagogy: Array.isArray(parsed.pedagogy) ? parsed.pedagogy : [],
          notes: String(parsed.notes || ""),
        },
      });
    }

    return json(200, { engine, section, patch: parsed });
  } catch (e) {
    console.error("book-bible-generate error:", e);
    return json(500, { error: (e as Error)?.message || "Erreur interne" });
  }
});
