// Ebookstudio-Génie : à partir d'un seul message libre de l'abonné, on déduit
// toute la fiche du livre (titre, catégorie, ton, longueur, illustrations…).
// Repli : clé personnelle Gemini -> clé serveur -> Lovable AI.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

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

async function callGemini(prompt: string, apiKey: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${encodeURIComponent(sanitizeApiKey(apiKey))}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.5, maxOutputTokens: 4000 },
    }),
  });
  if (!res.ok) {
    console.error("Gemini error:", res.status, (await res.text()).slice(0, 300));
    return { ok: false as const, status: res.status };
  }
  const data = await res.json();
  return { ok: true as const, text: data?.candidates?.[0]?.content?.parts?.[0]?.text || "" };
}

async function callLovableAI(prompt: string) {
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
        { role: "system", content: "Tu réponds uniquement en JSON valide, sans markdown." },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 4000,
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error("Lovable AI error:", res.status, text.slice(0, 300));
    return { ok: false as const, status: res.status };
  }
  try {
    const data = JSON.parse(text);
    return { ok: true as const, text: data?.choices?.[0]?.message?.content || "" };
  } catch {
    return { ok: true as const, text };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const body = (await req.json()) as {
      message?: string;
      userApiKey?: string;
      author?: string;
      history?: Array<{ role?: string; content?: string }>;
      mode?: string;
      accepted?: Array<{ titre?: string; objectif?: string }>;
      target?: number;
      bookTitle?: string;
      bookDescription?: string;
      tone?: string;
      language?: string;
      sourceText?: string;
      /** 'biography' = récit de vie : chronologie stricte, zéro invention. */
      kind?: string;
      /** Mode polish-passage : le passage brut à corriger. */
      passage?: string;
      /** Contexte : numéro du passage et titre du livre. */
      passageIndex?: number;
    };
    const message = String(body.message || "").trim();
    const mode = String(body.mode || "brief");
    const isBiography = String(body.kind || "") === "biography";
    /** Règles propres au récit de vie : rien d'inventé, rien de raccourci. */
    const biographyRules = isBiography
      ? `\nRÈGLES BIOGRAPHIE (prioritaires sur tout le reste) :
- l'auteur raconte SA vie : aucun fait, prénom, lieu, date, métier ou maladie ne peut être inventé, déduit ou embelli ;
- chronologie stricte : on suit l'ordre réel des années racontées, jamais un regroupement thématique ;
- vocabulaire de la vie réelle (souvenirs, personnes, lieux, dates), pas de vocabulaire de méthode ou de développement personnel ;
- INTERDIT de résumer : la matière de l'auteur est développée, corrigée, jamais raccourcie ;
- si une information manque, on pose une question à l'auteur au lieu de l'inventer ;\n`
      : "";
    if (mode !== "outline-step" && mode !== "polish-passage" && message.length < 10) {
      return json(400, { error: "Décrivez votre livre en quelques mots." });
    }

    // Mémoire de conversation : le Génie doit tenir compte de tout ce qui a déjà été dit.
    const history = (Array.isArray(body.history) ? body.history : [])
      .filter((m) => m && typeof m.content === "string" && m.content.trim())
      .slice(-12)
      // Les messages de l'auteur ne sont plus rognés à 900 caractères : un long
      // souvenir raconté d'un seul bloc doit rester entier dans la mémoire.
      .map((m) =>
        m.role === "assistant"
          ? `Génie : ${String(m.content).slice(0, 900)}`
          : `Auteur : ${String(m.content).slice(0, 6000)}`,
      )
      .join("\n");

    const historyBlock = history
      ? `\nHistorique de la conversation (à respecter : ne perds rien de ce qui a déjà été décidé, applique seulement les nouvelles précisions) :\n"""${history}"""\n`
      : "";

    const askAI = async (prompt: string) => {
      const userKey = sanitizeApiKey(body.userApiKey);
      const serverKey = sanitizeApiKey(Deno.env.get("GEMINI_API_KEY") || "");
      let r: { ok: boolean; status?: number; text?: string } | null = null;
      if (isValidGoogleKey(userKey)) r = await callGemini(prompt, userKey);
      if (!r?.ok && isValidGoogleKey(serverKey)) r = await callGemini(prompt, serverKey);
      if (!r?.ok) r = await callLovableAI(prompt);
      return r;
    };

    const parseJson = (raw: string) => {
      const cleaned = String(raw || "").replace(/```json|```/gi, "").trim();
      try {
        return JSON.parse(cleaned);
      } catch {
        const m = cleaned.match(/\{[\s\S]*\}/);
        if (m) { try { return JSON.parse(m[0]); } catch { /* noop */ } }
        return null;
      }
    };

    /* ---------------- Mode « Copilot » : corriger et développer un passage ---------------- */
    // L'auteur donne ses mots tels qu'ils viennent ; le Génie les rend propres,
    // sans jamais retirer un fait ni écrire moins de mots que l'original.
    if (mode === "polish-passage") {
      const passage = String(body.passage || "").trim();
      if (passage.length < 20) return json(400, { error: "Écrivez d'abord quelques phrases à corriger." });
      const floor = passage.trim().split(/\s+/).filter(Boolean).length;
      const polishPrompt = `Tu es correcteur et plume d'une maison d'édition francophone. L'auteur t'a écrit un passage de son livre au fil de la plume, avec des fautes, des abréviations et une ponctuation approximative.

PASSAGE DE L'AUTEUR (ses faits sont la vérité absolue) :
"""${passage.slice(0, 20000)}"""
${body.bookTitle ? `Livre : « ${String(body.bookTitle).slice(0, 200)} »` : ""}
Ton souhaité : ${String(body.tone || "Émotionnel")}
${biographyRules}
Rends ce passage prêt à imprimer. Réponds STRICTEMENT en JSON valide, sans markdown :
{"corrected":"","notes":""}

Règles absolues :
- 100 % français, aucun latin, aucune langue étrangère, aucun mot inventé ;
- corrige l'orthographe, la grammaire, la ponctuation, les majuscules et les abréviations (« aps » -> « pas », « d ema » -> « de ma ») ;
- conserve TOUS les faits, dates, âges, lieux, prénoms, liens de famille et incertitudes (« je ne me souviens plus très bien » reste) ;
- n'invente rien : pas de dialogue, pas de détail sensoriel qui ne soit pas déjà suggéré par l'auteur ;
- développe en phrases complètes et en paragraphes lisibles : le résultat doit contenir AU MOINS ${floor} mots, idéalement 1,5 fois plus ;
- garde la voix de l'auteur à la première personne, sans style journalistique ;
- "notes" : une phrase disant ce que tu as corrigé (facultatif).`;

      const rp = await askAI(polishPrompt);
      if (!rp?.ok) {
        const status = rp?.status === 429 ? 429 : rp?.status === 402 ? 402 : 502;
        return json(status, {
          error:
            status === 429
              ? "Limite IA atteinte. Réessayez dans quelques secondes."
              : status === 402
                ? "Crédits IA indisponibles pour le moment."
                : "Service IA temporairement indisponible.",
        });
      }
      const parsedPolish = parseJson(String(rp.text || ""));
      const corrected = String(parsedPolish?.corrected || "").trim();
      if (!corrected) return json(502, { error: "Réponse IA illisible. Réessayez." });
      const words = corrected.split(/\s+/).filter(Boolean).length;
      return json(200, {
        corrected,
        notes: String(parsedPolish?.notes || "").trim(),
        words,
        originalWords: floor,
        // Garde-fou visible côté écran : jamais moins de mots que l'auteur.
        shorter: words < floor,
      });
    }

    /* ---------------- Mode « on construit le sommaire ensemble » ---------------- */
    // L'IA ne propose JAMAIS le sommaire complet : au plus 3 chapitres à la fois,
    // en tenant compte des chapitres déjà acceptés par l'auteur.
    if (mode === "outline-step") {
      const acceptedList = Array.isArray(body.accepted) ? body.accepted : [];
      const accepted = acceptedList
        .map((c, i) => {
          const src = Array.isArray((c as any)?.sources) && (c as any).sources.length
            ? ` [passages ${(c as any).sources.join(", ")}]`
            : "";
          return `${i + 1}. ${String(c?.titre || "").trim()}${c?.objectif ? ` — ${String(c.objectif).trim()}` : ""}${src}`;
        })
        .filter((line) => line.length > 3)
        .join("\n");
      const target = Math.min(40, Math.max(3, Number(body.target) || 12));
      const remaining = Math.max(0, target - acceptedList.length);
      const count = Math.min(3, remaining || 3);

      // Passages numérotés du récit : le sommaire DOIT les suivre dans l'ordre.
      // On garde le DÉBUT du récit en priorité (l'enfance vient en premier),
      // au lieu de tronquer la fin comme avant.
      const stepSource = String(body.sourceText || "").trim();
      const passages = stepSource
        ? stepSource.split(/\n{2,}/).map((p) => p.trim()).filter((p) => p.length > 0)
        : [];
      let budget = 60000;
      const numbered: string[] = [];
      for (let i = 0; i < passages.length; i++) {
        const line = `[Passage ${i + 1}] ${passages[i]}`;
        if (line.length > budget) {
          numbered.push(line.slice(0, Math.max(0, budget)));
          break;
        }
        numbered.push(line);
        budget -= line.length;
      }
      // Passages déjà couverts par les chapitres gardés : on repart après eux.
      const coveredNumbers = acceptedList
        .flatMap((c) => (Array.isArray((c as any)?.sources) ? (c as any).sources : []))
        .map((n: unknown) => Number(n))
        .filter((n: number) => Number.isFinite(n) && n > 0);
      const nextPassage = coveredNumbers.length ? Math.max(...coveredNumbers) + 1 : 1;

      const stepSourceBlock = numbered.length
        ? `\nRÉCIT DE L'AUTEUR DÉCOUPÉ EN PASSAGES NUMÉROTÉS (ses mots exacts, dans son ordre) :\n"""\n${numbered.join("\n\n")}\n"""\nNombre total de passages : ${passages.length}. Premier passage encore à couvrir : ${nextPassage}.\n`
        : "";

      const anchorRules = numbered.length
        ? `- Chaque chapitre proposé doit couvrir des passages RÉELS du récit, en commençant au passage ${nextPassage} et en avançant dans l'ordre du récit ;
- "sources" : la liste des numéros de passages couverts par le chapitre (obligatoire, jamais vide, jamais un passage déjà couvert) ;
- INTERDIT d'inventer un épisode, un lieu, une date, un prénom ou un métier qui n'est pas écrit dans les passages ;
- INTERDIT de proposer un chapitre thématique générique (« développement personnel », « leçons de vie ») si le récit raconte des faits précis : suis la chronologie vécue par l'auteur ;
- "titre" : titre concret tiré du contenu réel du passage (les mots, lieux et personnes de l'auteur), 8 mots maximum ;
- "objectif" : une phrase qui rappelle QUELS souvenirs du récit ce chapitre raconte ;
- si les passages restants ne suffisent pas pour ${count} chapitres, propose moins de chapitres et demande à l'auteur de raconter la suite ;`
        : `- "titre" : titre de chapitre concret (8 mots maximum) ;
- "objectif" : une seule phrase disant ce que le lecteur y gagne ;
- "sources" : laisse un tableau vide, l'auteur n'a pas encore fourni de récit ;`;

      const stepPrompt = `Tu es directeur éditorial KDP francophone. Tu construis un sommaire AVEC l'auteur, à partir de SON récit, pas à sa place et jamais à partir d'un résumé.
Livre : « ${String(body.bookTitle || "").slice(0, 200)}${String(body.bookTitle || "") ? "" : ""}»
Ton souhaité : ${String(body.tone || "Inspirant")}
Nombre total de chapitres visé : ${target}
${numbered.length ? "" : `Sujet indiqué : """${String(body.bookDescription || message).slice(0, 2000)}"""\n`}${stepSourceBlock}${historyBlock}
Chapitres DÉJÀ acceptés par l'auteur (ne les répète jamais, ne les modifie pas) :
"""${accepted || "aucun pour le moment"}"""

${message ? `Dernière demande de l'auteur : """${message.slice(0, 1500)}"""` : ""}

Propose au maximum ${count} nouveaux chapitres qui suivent la suite du récit.
Réponds STRICTEMENT en JSON valide, sans markdown :
{"chapters":[{"titre":"","objectif":"","sources":[1]}],"question":""}

Règles :
- 100 % français : aucun latin, aucune langue étrangère, aucun mot inventé ;
${biographyRules}${anchorRules}
- jamais plus de ${count} chapitres, jamais de doublon avec les chapitres acceptés ;
- "question" : une seule question courte pour faire valider ces chapitres à l'auteur.`;

      const r = await askAI(stepPrompt);
      if (!r?.ok) {
        const status = r?.status === 429 ? 429 : r?.status === 402 ? 402 : 502;
        return json(status, {
          error:
            status === 429
              ? "Limite IA atteinte. Réessayez dans quelques secondes."
              : status === 402
                ? "Crédits IA indisponibles pour le moment."
                : "Service IA temporairement indisponible.",
        });
      }
      const parsedStep = parseJson(String(r.text || ""));
      const list = Array.isArray(parsedStep?.chapters) ? parsedStep.chapters : [];
      const chapters = list
        .map((c: any) => ({
          titre: String(c?.titre || c?.title || "").trim(),
          objectif: String(c?.objectif || c?.goal || "").trim(),
          sources: Array.isArray(c?.sources)
            ? c.sources
              .map((n: unknown) => Number(n))
              .filter((n: number) => Number.isFinite(n) && n >= 1 && n <= passages.length)
            : [],
        }))
        .filter((c: any) => c.titre.length > 2)
        .slice(0, count);
      if (!chapters.length) return json(502, { error: "Réponse IA illisible. Réessayez." });
      return json(200, {
        chapters,
        totalPassages: passages.length,
        nextPassage,
        question: String(parsedStep?.question || "On garde ces chapitres ?").trim(),
        remaining: Math.max(0, remaining - chapters.length),
      });
    }


    const sourceText = String((body as any).sourceText || "").trim();
    const sourceBlock = sourceText
      ? `\nMATIÈRE BRUTE DE L'AUTEUR (ses mots exacts, à conserver et à développer — INTERDIT de la résumer, de la raccourcir ou de la remplacer) :\n"""${sourceText.slice(-24000)}"""\n`
      : "";

    const prompt = `Tu es directeur éditorial KDP francophone. Un auteur te décrit librement son projet de livre.
${historyBlock}${sourceBlock}
Dernier message de l'auteur :
"""${message.slice(0, 5000)}"""

Déduis la fiche complète du livre. Réponds STRICTEMENT en JSON valide, sans markdown :
{"title":"","subtitle":"","author":"","category":"","tone":"","description":"","chapters":20,"wordsPerChapter":2500,"wantsIllustrations":false,"audience":"","promesseCentrale":"","questions":[""]}

Règles :
- 100 % français : aucun latin, aucune langue étrangère décorative, aucun mot inventé ;
${biographyRules}
- "title" : titre commercial court et vendeur (invente-le si l'auteur n'en donne pas) ;
- "category" : une catégorie Amazon KDP parmi Roman, Thriller / Policier, Romance, Fantasy / Fantastique, Science-fiction, Développement personnel, Business / Entrepreneuriat, Santé / Bien-être, Cuisine / Recettes, Voyage / Guide, Enfants / Jeunesse, Histoire / Culture, Biographie / Récit de vie ;
- "tone" : un seul mot parmi Inspirant, Pédagogique, Émotionnel, Direct, Humoristique, Premium, Romanesque, Expert ;
- "description" : présentation du projet en 4 à 8 phrases. Tu NE RÉSUMES PAS la matière brute : tu la conserves comme socle et tu annonces qu'elle sera développée. Ne supprime aucun lieu, aucune date, aucun prénom ni aucun souvenir cité par l'auteur ;
- INTERDIT de condenser un récit de vie en quelques lignes : chaque souvenir donné est un matériau de chapitre ;
- "chapters" : entre 8 et 30 selon l'ambition du projet ; "wordsPerChapter" entre 2200 et 3500 (2500 par défaut) ;
- "wantsIllustrations" : true si le sujet appelle des images (enfants, cuisine, voyage, pratique) ;
- "author" : reprends le nom si l'auteur le donne, sinon "" ;
- "questions" : 0 à 2 questions courtes qui invitent l'auteur à donner PLUS de détails, de scènes et de souvenirs.`;


    const userKey = sanitizeApiKey(body.userApiKey);
    const serverKey = sanitizeApiKey(Deno.env.get("GEMINI_API_KEY") || "");

    let r: { ok: boolean; status?: number; text?: string } | null = null;
    if (isValidGoogleKey(userKey)) r = await callGemini(prompt, userKey);
    if (!r?.ok && isValidGoogleKey(serverKey)) r = await callGemini(prompt, serverKey);
    if (!r?.ok) r = await callLovableAI(prompt);

    if (!r?.ok) {
      const status = r?.status === 429 ? 429 : r?.status === 402 ? 402 : 502;
      return json(status, {
        error:
          status === 429
            ? "Limite IA atteinte. Réessayez dans quelques secondes."
            : status === 402
              ? "Crédits IA indisponibles pour le moment."
              : "Service IA temporairement indisponible.",
      });
    }

    const raw = String(r.text || "").replace(/```json|```/gi, "").trim();
    let parsed: any = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const m = raw.match(/\{[\s\S]*\}/);
      if (m) { try { parsed = JSON.parse(m[0]); } catch { /* noop */ } }
    }
    if (!parsed || typeof parsed !== "object") { console.error("brief parse failed:", raw.slice(0, 600)); }
    if (!parsed || typeof parsed !== "object") return json(502, { error: "Réponse IA illisible. Réessayez." });

    const clamp = (n: unknown, min: number, max: number, fallback: number) => {
      const v = Number(n);
      return Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : fallback;
    };

    const brief = {
      title: String(parsed.title || "").trim(),
      subtitle: String(parsed.subtitle || "").trim(),
      author: String(parsed.author || body.author || "").trim(),
      category: String(parsed.category || "").trim(),
      tone: String(parsed.tone || "Inspirant").trim(),
      description: String(parsed.description || message).trim(),
      chapters: clamp(parsed.chapters, 8, 30, 20),
      wordsPerChapter: clamp(parsed.wordsPerChapter, 2200, 3500, 2500),
      wantsIllustrations: Boolean(parsed.wantsIllustrations),
      cibleProfil: String(parsed.audience || "").trim(),
      promesseCentrale: String(parsed.promesseCentrale || "").trim(),
    };

    const questions = (Array.isArray(parsed.questions) ? parsed.questions : [])
      .map((q: unknown) => String(q || "").trim())
      .filter(Boolean)
      .slice(0, 2);

    return json(200, { brief, questions });
  } catch (e) {
    console.error("v3-genie-brief error", e);
    return json(500, { error: "Erreur inattendue." });
  }
});
