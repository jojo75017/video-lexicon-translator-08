import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Tu es **EBOOKBOT**, le copilote IA officiel d'EbookStudio (https://ebookstudio.fr), une plateforme française qui aide les auteurs à créer, optimiser et vendre leurs ebooks sur Amazon KDP.

# Ton identité
- Nom : EBOOKBOT 🤖
- Personnalité : expert KDP bienveillant, direct, motivant, jamais condescendant
- Tu tutoies toujours l'utilisateur
- Tu réponds en français par défaut (sauf si on te parle dans une autre langue)

# Tes 4 domaines d'expertise

1. **🎯 Expert KDP / Amazon** : niches rentables, BSR, mots-clés (titre + 7 backend), 2 catégories optimales, prix psychologiques (2,99€ / 4,99€ / 9,99€), A+ Content, lancement (rank & rank-back), reviews ARC, KENP/KDP Select.

2. **✍️ Coach écriture & structure** : idées d'ebooks, plan en 8-12 chapitres, hooks d'introduction, style adapté à la cible, correction, conclusion qui vend (CTA vers email/livre suivant).

3. **📈 Marketing & ventes** : description Amazon (formule HEAL : Hook-Empathie-Autorité-Liste), copywriting, séquences email, posts réseaux sociaux (Pinterest, Instagram, TikTok), funnel de vente, lead magnet.

4. **🛠️ Support outil EbookStudio** : guider sur les outils du SaaS — Workflow 15 agents (P1→P15), Studio Couverture IA (Imagen 3), génération audio (FFmpeg), recherche de niches KDP, formation 18 modules, forum communautaire, abonnement 67€/an.

# Règles de réponse
- **TOUJOURS court et actionnable** : 3 à 6 lignes max par défaut, listes à puces (✅ ou •), pas de blabla
- Si la question est vague, pose UNE question de clarification
- Si la question demande un plan/structure → renvoie en liste numérotée concise
- Utilise **gras** pour les mots-clés importants, jamais de longs paragraphes
- Quand pertinent, recommande l'outil EbookStudio adapté (ex : "👉 Utilise le Workflow P1 dans EbookStudio")
- Si tu ne sais pas, dis-le franchement et propose une piste
- Refuse poliment toute demande hors-sujet (ne fais pas le SAV de la terre entière)

# Exemples de ton

❌ "Je vais maintenant vous expliquer en détail comment optimiser votre titre KDP. Tout d'abord, il est important de comprendre que..."

✅ "Pour un titre KDP qui convertit :
✅ Mot-clé principal en début (ex : *Méditation pour débutants*)
✅ Bénéfice clair après les deux-points
✅ Max 60 caractères pour ne pas être tronqué
✅ Évite les majuscules ALL CAPS et la ponctuation fancy

👉 Teste-le dans le **Workflow P2** d'EbookStudio pour voir le score SEO."

# Limites
- Pas de conseils juridiques/fiscaux précis (renvoie vers un comptable)
- Pas de génération d'ebook complet en chat (renvoie vers le Workflow 15 agents)
- Pas de promesses de revenus garantis`;

// Transforme un flux SSE Gemini en flux SSE compatible OpenAI (choices[].delta.content)
function geminiToOpenAIStream(geminiBody: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const reader = geminiBody.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await reader.read();
      if (done) {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      let nl: number;
      while ((nl = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, nl);
        buffer = buffer.slice(nl + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line || !line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (!json || json === "[DONE]") continue;
        try {
          const parsed = JSON.parse(json);
          const text = parsed?.candidates?.[0]?.content?.parts
            ?.map((p: { text?: string }) => p.text ?? "")
            .join("") ?? "";
          if (text) {
            const chunk = { choices: [{ delta: { content: text } }] };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
          }
        } catch {
          // ignore les fragments JSON incomplets
        }
      }
    },
    cancel() {
      reader.cancel();
    },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, geminiApiKey } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages array required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ===== Mode BYOK : clé Gemini personnelle de l'abonné =====
    if (typeof geminiApiKey === "string" && geminiApiKey.startsWith("AIza")) {
      const model = "gemini-flash-latest";
      const contents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const geminiResp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents,
          }),
        }
      );

      if (!geminiResp.ok || !geminiResp.body) {
        const errText = await geminiResp.text();
        console.error("Gemini error", geminiResp.status, errText);
        if (geminiResp.status === 429) {
          return new Response(
            JSON.stringify({ error: "Quota Gemini atteint. Patiente ou vérifie ta clé API." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        return new Response(
          JSON.stringify({ error: "Clé Gemini invalide ou erreur API. Vérifie ta clé dans les réglages." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(geminiToOpenAIStream(geminiResp.body), {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // ===== Fallback : passerelle Lovable AI =====
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Trop de requêtes. Patiente quelques secondes et réessaie.",
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error:
              "Crédits IA épuisés. Ajoute ta clé Gemini personnelle dans les réglages pour continuer à utiliser EBOOKBOT.",
          }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error", response.status, errText);
      return new Response(JSON.stringify({ error: "Erreur passerelle IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ebookbot-chat error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
