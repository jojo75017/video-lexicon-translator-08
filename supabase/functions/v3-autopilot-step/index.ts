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

interface Body {
  stepNumber?: number;
  stepTitle?: string;
  stepHint?: string;
  moduleTitle?: string;
  moduleDescription?: string;
  theme?: string;
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
      stepNumber = 1,
      stepTitle = "",
      stepHint = "",
      moduleTitle = "",
      moduleDescription = "",
      theme = "",
      priorOutputs = [],
    } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Service IA non configuré (LOVABLE_API_KEY manquante)." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
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

## Contexte du projet (décisions des étapes précédentes)
${contextText}

## Ta mission
Réalise concrètement cette étape maintenant et renvoie uniquement le livrable final.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          temperature: 0.8,
          max_tokens: 3000,
        }),
      },
    );

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: "Trop de demandes, réessaie dans un instant." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (response.status === 402) {
      return new Response(
        JSON.stringify({ error: "Crédits IA épuisés. Recharge l'espace de travail pour continuer." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error", response.status, t);
      return new Response(
        JSON.stringify({ error: "L'IA n'a pas pu générer cette étape. Réessaie." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    const result: string = data.choices?.[0]?.message?.content?.trim() || "";

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
