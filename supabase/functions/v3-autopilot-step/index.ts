import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PriorOutput {
  title: string;
  output: string;
}

interface Brief {
  title?: string;
  subtitle?: string;
  author?: string;
  category?: string;
  chapterCount?: string;
  wordsPerChapter?: string;
}

interface Body {
  moduleId?: string;
  stepNumber?: number;
  stepTitle?: string;
  stepHint?: string;
  moduleTitle?: string;
  moduleDescription?: string;
  theme?: string;
  brief?: Brief;
  priorOutputs?: PriorOutput[];
  provider?: "gemini" | "openai" | "openrouter";
  model?: string;
  userApiKey?: string;
}

type CallResult =
  | { ok: true; text: string }
  | { ok: false; status: number; body: string };

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as Body;
    const {
      moduleId = "",
      stepNumber = 1,
      stepTitle = "",
      stepHint = "",
      moduleTitle = "",
      moduleDescription = "",
      theme = "",
      brief = {},
      priorOutputs = [],
      provider = "gemini",
      userApiKey = "",
    } = body;

    // === Sélection du fournisseur ===
    const geminiKey = (userApiKey || "").trim() || Deno.env.get("GEMINI_API_KEY") || "";
    const openaiKey = (userApiKey || "").trim() || Deno.env.get("OPENAI_API_KEY") || "";

    if (provider === "gemini" && !geminiKey) {
      return new Response(
        JSON.stringify({
          error:
            "Clé API Gemini requise. Configurez votre clé personnelle dans Paramètres > Clés API, ou choisissez OpenAI.",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (provider === "openai" && !openaiKey) {
      return new Response(
        JSON.stringify({
          error: "Aucune clé OpenAI disponible. Configurez une clé OpenAI ou choisissez Gemini.",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    async function callAI(
      sys: string,
      usr: string,
      maxOutputTokens: number,
    ): Promise<CallResult> {
      if (provider === "openai") {
        const r = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: sys },
              { role: "user", content: usr },
            ],
            temperature: 0.8,
            max_tokens: maxOutputTokens,
          }),
        });
        if (!r.ok) return { ok: false, status: r.status, body: await r.text() };
        const d = await r.json();
        return { ok: true, text: (d.choices?.[0]?.message?.content || "").trim() };
      }
      // Gemini par défaut
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: sys }] },
            contents: [{ role: "user", parts: [{ text: usr }] }],
            generationConfig: { temperature: 0.8, maxOutputTokens },
          }),
        },
      );
      if (!r.ok) return { ok: false, status: r.status, body: await r.text() };
      const d = await r.json();
      return { ok: true, text: (d.candidates?.[0]?.content?.parts?.[0]?.text || "").trim() };
    }

    function aiError(status: number, logBody: string) {
      console.error("AI error", provider, status, logBody);
      if (status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite atteinte. Réessaie dans un instant." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (status === 400 || status === 401 || status === 403) {
        return new Response(
          JSON.stringify({
            error: "Clé API invalide ou refusée. Vérifie ta clé dans Paramètres > Clés API.",
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      return new Response(
        JSON.stringify({ error: "L'IA n'a pas pu générer cette étape. Réessaie." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Contexte accumulé des étapes précédentes.
    // On garde plus de contexte pour le plan/concept (clé pour rédiger les chapitres).
    const contextText =
      priorOutputs.length === 0
        ? "(Aucune étape précédente — c'est la toute première étape du parcours.)"
        : priorOutputs
            .map(
              (p, i) =>
                `### Étape précédente ${i + 1} — ${p.title}\n${(p.output || "").slice(0, 4000)}`,
            )
            .join("\n\n");

    const themeLine = theme.trim()
      ? `Thème / direction donnée par l'auteur : « ${theme.trim()} ».`
      : `Aucun thème imposé : si cette étape consiste à choisir une niche ou un sujet, choisis toi-même la niche la plus rentable et réaliste pour Amazon KDP (marché francophone).`;

    const briefRows = [
      ["Titre du livre", brief.title],
      ["Sous-titre", brief.subtitle],
      ["Nom de l'auteur", brief.author],
      ["Catégorie / genre", brief.category],
      ["Nombre de chapitres visés", brief.chapterCount],
    ].filter(([, v]) => (v || "").toString().trim());
    const briefBlock = briefRows.length
      ? `## Brief fourni par l'auteur\n${briefRows
          .map(([k, v]) => `- **${k}** : ${(v as string).trim()}`)
          .join("\n")}\nUtilise ces informations telles quelles et reste cohérent avec elles. Pour les champs non fournis, propose toi-même une valeur pertinente et garde-la cohérente tout au long du parcours.`
      : `## Brief fourni par l'auteur\nAucun champ rempli : c'est à toi de proposer le titre, le sous-titre, l'auteur (nom de plume si besoin) et la catégorie, puis de rester cohérent avec ces choix sur toutes les étapes.`;

    const system = `Tu es l'auto-pilote IA d'EbookStudio, un studio professionnel de publication de livres sur Amazon KDP.
Tu exécutes UNE étape précise d'un parcours en 30 étapes qui mène de l'idée au livre publié et vendu.
C'est TOI qui fais le travail concret à la place de l'auteur : tu produis un livrable directement utilisable, pas des conseils génériques ni des "voici comment faire".

Règles :
- Réponds en français.
- Produis un résultat CONCRET, finalisé et prêt à l'emploi pour cette étape précise.
- Reste cohérent avec tout ce qui a été décidé dans les étapes précédentes (même niche, même titre, même ton, mêmes personnages).
- Utilise du Markdown clair (titres, listes, tableaux si utile).
- Pas de blabla d'introduction du type "Bien sûr, voici…". Va droit au livrable.
- Aucune donnée inventée présentée comme une vérité chiffrée officielle : si tu estimes des chiffres (ventes, recherches), précise que ce sont des estimations.`;

    const isManuscript = moduleId === "p20-chat-manuscript";

    // === Étape « Développer le manuscrit » : rédaction chapitre par chapitre ===
    if (isManuscript) {
      const n = Math.min(Math.max(parseInt(brief.chapterCount || "", 10) || 8, 1), 40);
      const chapters: string[] = [];
      for (let i = 1; i <= n; i++) {
        const prev = chapters.length
          ? `\n## Fin du chapitre précédent (pour la continuité)\n${chapters[chapters.length - 1].slice(-1000)}`
          : "";
        const chapUser = `# Rédige INTÉGRALEMENT le CHAPITRE ${i} sur ${n} du livre.

${themeLine}

${briefBlock}

## Contexte du projet (concept, plan détaillé et décisions précédentes)
${contextText}
${prev}

## Consignes de rédaction (IMPÉRATIVES)
- Écris un VRAI chapitre complet, long et développé : entre 1200 et 2200 mots.
- Commence par un titre de chapitre en Markdown : "## Chapitre ${i} — [titre]".
- Développe plusieurs sous-parties avec des paragraphes pleins, des exemples concrets et des transitions.
- INTERDIT : un résumé, un plan, une liste de puces sèche, ou seulement quelques lignes. Le lecteur doit pouvoir LIRE ce chapitre tel quel dans le livre publié.
- Reste cohérent avec le plan et les chapitres précédents.
- N'écris pas "voici le chapitre", ne commente pas : écris directement le contenu du chapitre.`;
        const r = await callAI(system, chapUser, 8192);
        if (!r.ok) return aiError(r.status, r.body);
        if (r.text) chapters.push(r.text);
      }
      const result = chapters.join("\n\n---\n\n").trim();
      if (!result) {
        return new Response(
          JSON.stringify({ error: "Réponse vide de l'IA. Réessaie." }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      return new Response(JSON.stringify({ result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const user = `# Étape ${stepNumber} du parcours : ${stepTitle || moduleTitle}

Objectif de l'étape : ${stepHint || moduleDescription}
Outil correspondant : ${moduleTitle} — ${moduleDescription}

${themeLine}

${briefBlock}

## Contexte du projet (décisions des étapes précédentes)
${contextText}

## Ta mission
Réalise concrètement cette étape maintenant et renvoie uniquement le livrable final, complet et développé.`;

    const r = await callAI(system, user, 8192);
    if (!r.ok) return aiError(r.status, r.body);
    const result = r.text;

    if (!result) {
      return new Response(
        JSON.stringify({ error: "Réponse vide de l'IA. Réessaie." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("v3-autopilot-step failed:", e);
    return new Response(
      JSON.stringify({ error: "Erreur interne de l'auto-pilote." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
