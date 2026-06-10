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
  userApiKey?: string;
}

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
      userApiKey = "",
    } = body;

    const geminiKey = (userApiKey || "").trim();
    if (!geminiKey) {
      return new Response(
        JSON.stringify({
          error:
            "Clé API Gemini requise. Configurez votre clé personnelle dans Paramètres > Clés API pour utiliser l'auto-pilote.",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Contexte accumulé des étapes précédentes (tronqué pour rester léger).
    const contextText =
      priorOutputs.length === 0
        ? "(Aucune étape précédente — c'est la toute première étape du parcours.)"
        : priorOutputs
            .map(
              (p, i) =>
                `### Étape précédente ${i + 1} — ${p.title}\n${(p.output || "").slice(0, 1200)}`,
            )
            .join("\n\n");

    const themeLine = theme.trim()
      ? `Thème / direction donnée par l'auteur : « ${theme.trim()} ».`
      : `Aucun thème imposé : si cette étape consiste à choisir une niche ou un sujet, choisis toi-même la niche la plus rentable et réaliste pour Amazon KDP (marché francophone), en t'appuyant sur des critères concrets (demande, concurrence, rentabilité).`;

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

    const user = `# Étape ${stepNumber} du parcours : ${stepTitle || moduleTitle}

Objectif de l'étape : ${stepHint || moduleDescription}
Outil correspondant : ${moduleTitle} — ${moduleDescription}

${themeLine}

${briefBlock}

## Contexte du projet (décisions des étapes précédentes)
${contextText}

## Ta mission
Réalise concrètement cette étape maintenant et renvoie uniquement le livrable final.`;

    async function callGemini(
      sys: string,
      usr: string,
      maxOutputTokens: number,
    ): Promise<{ ok: true; text: string } | { ok: false; status: number; body: string }> {
      const response = await fetch(
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
      if (!response.ok) {
        const t = await response.text();
        return { ok: false, status: response.status, body: t };
      }
      const data = await response.json();
      const text = (data.candidates?.[0]?.content?.parts?.[0]?.text || "").trim();
      return { ok: true, text };
    }

    function geminiError(status: number, logBody: string) {
      console.error("Gemini error", status, logBody);
      if (status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite Gemini atteinte. Réessaie dans un instant." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (status === 400 || status === 403) {
        return new Response(
          JSON.stringify({
            error:
              "Clé API Gemini invalide ou refusée. Vérifie ta clé dans Paramètres > Clés API.",
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      return new Response(
        JSON.stringify({ error: "L'IA n'a pas pu générer cette étape. Réessaie." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const isManuscript = moduleId === "p20-chat-manuscript";

    // === Étape « Développer le manuscrit » : rédaction chapitre par chapitre ===
    if (isManuscript) {
      const n = Math.min(Math.max(parseInt(brief.chapterCount || "", 10) || 8, 1), 40);
      const chapters: string[] = [];
      for (let i = 1; i <= n; i++) {
        const prev = chapters.length
          ? `\n## Fin du chapitre précédent (pour la continuité)\n${chapters[chapters.length - 1].slice(-800)}`
          : "";
        const chapUser = `# Rédige intégralement le CHAPITRE ${i} sur ${n} du livre.

${themeLine}

${briefBlock}

## Contexte du projet (concept, plan et décisions précédentes)
${contextText}
${prev}

## Ta mission
Rédige le chapitre ${i} EN ENTIER, prêt à publier (1200 à 2000 mots), avec un titre de chapitre clair en titre Markdown (## Chapitre ${i} — …), un contenu développé, fluide et cohérent avec le plan et les chapitres précédents. Ne résume pas, n'écris pas "voici le chapitre" : écris directement le chapitre complet.`;
        const r = await callGemini(system, chapUser, 4000);
        if (!r.ok) return geminiError(r.status, r.body);
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

    const r = await callGemini(system, user, 3000);
    if (!r.ok) return geminiError(r.status, r.body);
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
