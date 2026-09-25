// Correction éditoriale d'un livre complet (lecture seule, BYOK).
// Analyse : adéquation au sujet, continuité des personnages, chronologie, lieux,
// événements, incohérences internes, répétitions, grammaire, ponctuation,
// typographie française, fluidité. Ne réécrit jamais le livre.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const CATEGORIES = [
  "sujet", "personnages", "chronologie", "lieux", "evenements",
  "incoherences", "repetitions", "grammaire", "ponctuation", "typographie", "fluidite",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { title, subject, chapters, userProvider, userApiKey, userModel } = await req.json();
    if (!Array.isArray(chapters) || chapters.length === 0) return json({ error: "Aucun chapitre à analyser." }, 400);
    const key = String(userApiKey || "").trim();
    const provider = String(userProvider || "").trim();
    if (!key) return json({ error: "Aucune clé IA : configurez votre clé dans Paramètres > Clés API." }, 400);

    // Limite raisonnable : ~ 300 000 caractères, extraits équilibrés par chapitre.
    const budget = Math.floor(300000 / chapters.length);
    const text = chapters.slice(0, 80).map((c: any, i: number) =>
      `### Chapitre ${i + 1} — ${String(c.title || "").slice(0, 150)}\n${String(c.content || "").slice(0, budget)}`
    ).join("\n\n");

    const system = `Tu es directeur éditorial d'une maison d'édition française. Tu relis un livre entier et tu produis un rapport de correction éditoriale, en français uniquement.
Tu ne réécris pas le livre. Tu signales uniquement des problèmes RÉELLEMENT présents dans le texte fourni, avec une citation exacte courte. N'invente jamais un problème. Si une catégorie est sans problème, renvoie une liste vide.
Catégories (clés exactes) :
- sujet : chapitres ou passages qui ne correspondent pas au sujet / titre annoncé du livre
- personnages : continuité des personnages (nom, âge, apparence, caractère, relations qui changent sans raison)
- chronologie : dates, durées, ordre des faits contradictoires
- lieux : lieux décrits de façon contradictoire ou déplacements impossibles
- evenements : événements oubliés, contredits ou répétés
- incoherences : autres incohérences factuelles internes
- repetitions : mots, tournures ou idées répétés de façon gênante
- grammaire, ponctuation, typographie (règles françaises : espaces insécables avant ; : ! ?, guillemets « », tirets de dialogue, majuscules accentuées), fluidite (phrases lourdes, transitions abruptes)
Réponds UNIQUEMENT en JSON : {"score": 0-100, "synthese": "3 phrases", "categories": {"<clé>": [{"chapitre": n, "extrait": "citation", "probleme": "...", "suggestion": "..."}]}}. Maximum 8 remarques par catégorie, les plus importantes.`;
    const user = `Titre : ${title || "Sans titre"}\nSujet annoncé : ${subject || "(déduire du titre)"}\n\n${text}`;

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    let endpoint = ""; let body: any; const engine = provider || "gemini";
    if (engine === "gemini") {
      endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${encodeURIComponent(key)}`;
      body = { system_instruction: { parts: [{ text: system }] }, contents: [{ role: "user", parts: [{ text: user }] }], generationConfig: { temperature: 0.2, maxOutputTokens: 12000, responseMimeType: "application/json" } };
    } else if (engine === "claude") {
      endpoint = "https://api.anthropic.com/v1/messages";
      headers["x-api-key"] = key; headers["anthropic-version"] = "2023-06-01";
      body = { model: userModel || "claude-3-5-haiku-20241022", max_tokens: 8000, system, messages: [{ role: "user", content: user }] };
    } else {
      endpoint = engine === "openrouter" ? "https://openrouter.ai/api/v1/chat/completions" : "https://api.openai.com/v1/chat/completions";
      headers.Authorization = `Bearer ${key}`;
      body = { model: userModel || (engine === "openrouter" ? "google/gemini-2.5-flash" : "gpt-4o-mini"), messages: [{ role: "system", content: system }, { role: "user", content: user }], max_tokens: 12000, response_format: { type: "json_object" } };
    }

    const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 140000);
    const r = await fetch(endpoint, { method: "POST", headers, body: JSON.stringify(body), signal: ctrl.signal }).finally(() => clearTimeout(t));
    if (!r.ok) {
      console.error("editorial-review", r.status, (await r.text()).slice(0, 400));
      if (r.status === 429) return json({ error: "Limite de requêtes de votre clé IA atteinte, réessayez dans une minute." }, 429);
      if (r.status === 401 || r.status === 403) return json({ error: "Clé API refusée par votre fournisseur IA." }, 400);
      return json({ error: `Le service IA a répondu ${r.status}.` }, 502);
    }
    const d = await r.json();
    const raw = engine === "gemini" ? d?.candidates?.[0]?.content?.parts?.[0]?.text
      : engine === "claude" ? (d?.content || []).map((c: any) => c?.text || "").join("")
      : d?.choices?.[0]?.message?.content;
    const m = String(raw || "").match(/\{[\s\S]*\}/);
    if (!m) return json({ error: "Rapport illisible, relancez l'analyse." }, 502);
    const report = JSON.parse(m[0]);
    const categories: Record<string, unknown[]> = {};
    for (const c of CATEGORIES) categories[c] = Array.isArray(report?.categories?.[c]) ? report.categories[c] : [];
    return json({ score: Number(report?.score) || null, synthese: String(report?.synthese || ""), categories });
  } catch (e) {
    console.error("editorial-review error", e);
    return json({ error: (e as Error)?.name === "AbortError" ? "L'analyse a pris trop de temps, réessayez." : "Erreur pendant l'analyse." }, 500);
  }
});
