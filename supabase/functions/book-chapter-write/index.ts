// Studio Pro — Phase 2 : ChatGPT rédige UN chapitre à la fois.
// Rôle ChatGPT = rédaction, narration, style (jamais l'architecture).
// Contexte transmis : fiche maître + Bible + mémoire des chapitres précédents.
// Passerelle Lovable AI (Responses API, streaming obligatoire côté serveur).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const LANGUE_RULE = `RÈGLE ABSOLUE DE LANGUE : tout est rédigé en français courant.
INTERDIT : latin, faux latin, langues mortes, pseudo-langues, mots inventés, mots étrangers décoratifs, titres en langue étrangère.
Seules exceptions : noms propres réels et titres d'œuvres réelles.`;

interface Body {
  sheet?: Record<string, unknown>;
  bible?: Record<string, unknown>;
  chapter?: {
    position?: number;
    title?: string;
    objective?: string;
    planned_summary?: string;
    subsections?: unknown;
    word_target?: number;
  };
  /** Mémoire des chapitres déjà rédigés (résumés + faits) */
  memory?: Array<Record<string, unknown>>;
  /** Texte existant si on demande une reprise stylistique */
  existing?: string;
  /** 'redaction' = premier jet, 'polissage' = passe de style */
  task?: "redaction" | "polissage";
  guidance?: string;
}

function sheetBlock(s: Record<string, unknown>): string {
  const labels: Record<string, string> = {
    title: "Titre du livre",
    subtitle: "Sous-titre",
    book_kind: "Type de livre",
    genre: "Genre",
    target_audience: "Public cible",
    objective: "Objectif du livre",
    length_target: "Longueur visée",
    tone: "Ton",
    writing_style: "Style d'écriture",
    language_level: "Niveau de langage",
    narrative_pov: "Point de vue narratif",
    era: "Époque",
    places: "Lieux",
    main_characters: "Personnages principaux",
    constraints: "Contraintes",
  };
  return Object.entries(labels)
    .map(([k, label]) => {
      const v = String(s?.[k] ?? "").trim();
      return v ? `${label} : ${v}` : "";
    })
    .filter(Boolean)
    .join("\n");
}

function bibleBlock(b: Record<string, unknown>): string {
  const parts: string[] = [];
  const push = (label: string, v: unknown) => {
    if (!v) return;
    const txt = typeof v === "string" ? v : JSON.stringify(v);
    if (txt && txt !== "[]" && txt !== "{}") parts.push(`${label} :\n${txt.slice(0, 6000)}`);
  };
  push("Concept", b?.concept);
  push("Promesse", b?.promise);
  push("Synopsis", b?.synopsis);
  push("Personnages", b?.characters);
  push("Chronologie", b?.timeline);
  push("Lieux", b?.places);
  push("Fils narratifs / indices", b?.plot_threads);
  push("Progression pédagogique", b?.pedagogy);
  push("Points de vigilance", b?.notes);
  return parts.join("\n\n");
}

function memoryBlock(memory: Array<Record<string, unknown>>): string {
  if (!memory?.length) return "Aucun chapitre rédigé pour l'instant : c'est l'ouverture du livre.";
  return memory
    .slice(-25)
    .map((m) => {
      const lines = [`— Chapitre ${m.chapter_position}: ${String(m.summary || "").slice(0, 900)}`];
      const add = (label: string, v: unknown) => {
        if (Array.isArray(v) && v.length) lines.push(`  ${label}: ${v.map((x) => String(x)).join(" | ").slice(0, 600)}`);
      };
      add("Personnages présents", m.characters_present);
      add("Faits établis", m.events);
      add("Informations révélées", m.revealed_info);
      add("Indices plantés", m.clues);
      add("Décisions", m.decisions);
      add("Questions ouvertes", m.open_questions);
      return lines.join("\n");
    })
    .join("\n");
}

function buildPrompt(body: Body): string {
  const sheet = body.sheet || {};
  const chapter = body.chapter || {};
  const target = Math.min(6000, Math.max(700, Number(chapter.word_target) || 2500));
  const subs = Array.isArray(chapter.subsections) ? (chapter.subsections as unknown[]).map(String) : [];
  const source = String((body as any).sourceText || "").trim();
  const sourceBlock = source
    ? `\nMATIÈRE BRUTE DE L'AUTEUR (ses mots exacts)\n"""${source.slice(0, 20000)}"""\nRÈGLE ABSOLUE : tu DÉVELOPPES cette matière, tu ne la résumes JAMAIS. Tu corriges l'orthographe, la grammaire et le style, tu gardes les faits, les lieux, les dates et les prénoms tels quels, et tu transformes chaque souvenir en scène complète (décor, sensations, dialogues).\n`
    : "";


  if (body.task === "polissage") {
    return `Tu es ÉCRIVAIN PROFESSIONNEL et RELECTEUR ÉDITORIAL francophone.
Tu améliores le style du chapitre ci-dessous SANS changer les faits, l'intrigue, les noms, les lieux ni la longueur globale.

${LANGUE_RULE}

CONTEXTE DU LIVRE
${sheetBlock(sheet)}

MÉMOIRE DES CHAPITRES PRÉCÉDENTS (faits à ne jamais contredire)
${memoryBlock(body.memory || [])}
${body.guidance ? `\nCONSIGNE DE L'AUTEUR : ${body.guidance}` : ""}

TRAVAIL : rythme, fluidité, variété des phrases, dialogues naturels, suppression des répétitions et des formules creuses, transitions soignées.
Réponds uniquement par le texte final du chapitre, sans titre ajouté, sans commentaire, sans balise.

CHAPITRE À AMÉLIORER
${String(body.existing || "").slice(0, 40000)}`;
  }

  return `Tu es ÉCRIVAIN PROFESSIONNEL francophone publié. Tu rédiges UN SEUL chapitre, complet et immédiatement publiable.

${LANGUE_RULE}

CONTEXTE DU LIVRE (fiche maître)
${sheetBlock(sheet)}

BIBLE DU LIVRE (architecture validée par l'auteur — à respecter strictement)
${bibleBlock(body.bible || {})}

MÉMOIRE DES CHAPITRES DÉJÀ RÉDIGÉS (faits à ne jamais contredire ni répéter)
${memoryBlock(body.memory || [])}

CHAPITRE À RÉDIGER MAINTENANT
Numéro : ${chapter.position || 1}
Titre : ${chapter.title || ""}
Objectif : ${chapter.objective || ""}
Résumé prévu : ${chapter.planned_summary || ""}
${subs.length ? `Sous-chapitres à couvrir dans l'ordre :\n${subs.map((s, i) => `${i + 1}. ${s}`).join("\n")}` : ""}
Longueur visée : environ ${target} mots (ne descends jamais sous ${Math.round(target * 0.85)} mots).
${body.guidance ? `\nCONSIGNE DE L'AUTEUR : ${body.guidance}` : ""}

EXIGENCES
- Enchaîne naturellement avec la fin du chapitre précédent, sans résumer ce qui précède.
- Aucun remplissage, aucune redite, aucune phrase creuse.
- Prose vivante et concrète : scènes, détails sensoriels, dialogues utiles (fiction) ou exemples et cas pratiques (non-fiction).
- Respecte les sous-chapitres et l'objectif ; termine sur une clôture qui donne envie de lire la suite.
- N'annonce pas ce que tu fais, n'écris aucun méta-commentaire.

FORMAT DE SORTIE
Le texte du chapitre uniquement, en paragraphes. Tu peux utiliser des intertitres en markdown "## " pour les sous-chapitres. Ne répète PAS le titre du chapitre en tête. Aucun JSON, aucune balise de code.`;
}

/** Appel ChatGPT via la passerelle Lovable AI (Responses API, en streaming). */
async function callChatGpt(prompt: string, model: string): Promise<{ ok: boolean; text?: string; status?: number; message?: string }> {
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) return { ok: false, status: 500, message: "LOVABLE_API_KEY manquante" };

  const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
    method: "POST",
    headers: {
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "fetch",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, input: prompt, stream: true }),
  });

  if (!res.ok || !res.body) {
    const errText = await res.text().catch(() => "");
    console.error("Gateway error:", res.status, errText.slice(0, 500));
    return { ok: false, status: res.status, message: errText.slice(0, 300) };
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let out = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const evt = JSON.parse(payload);
        if (evt?.type === "response.output_text.delta" && typeof evt.delta === "string") {
          out += evt.delta;
        } else if (evt?.type === "response.completed" && !out) {
          out = String(evt?.response?.output_text || "");
        } else if (evt?.type === "error") {
          console.error("Gateway stream error:", JSON.stringify(evt).slice(0, 300));
        }
      } catch { /* fragment non JSON, ignoré */ }
    }
  }

  return { ok: true, text: out.trim() };
}

function cleanChapter(text: string): string {
  return text
    .replace(/^```(?:markdown|md|text)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .replace(/^\s*(?:#+\s*)?chapitre\s+\d+\s*[:–—-]?[^\n]*\n+/i, "")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const body = (await req.json()) as Body;
    if (!body?.chapter?.title && body.task !== "polissage") {
      return json(400, { error: "Chapitre introuvable : validez d'abord la Bible du livre." });
    }
    if (body.task === "polissage" && !String(body.existing || "").trim()) {
      return json(400, { error: "Aucun texte à améliorer." });
    }

    const prompt = buildPrompt(body);
    const models = ["openai/gpt-5.4-mini", "openai/gpt-5-mini"];

    let text = "";
    let engine = "";
    let lastStatus = 0;
    let lastMessage = "";
    for (const model of models) {
      const r = await callChatGpt(prompt, model);
      if (r.ok && r.text && r.text.length > 200) {
        text = r.text;
        engine = model;
        break;
      }
      lastStatus = r.status || lastStatus;
      lastMessage = r.message || lastMessage;
      if (r.status === 429 || r.status === 402) break;
    }

    if (!text) {
      if (lastStatus === 429) return json(429, { error: "Trop de demandes en même temps. Réessayez dans une minute." });
      if (lastStatus === 402) return json(402, { error: "Crédits IA épuisés. Rechargez vos crédits pour continuer." });
      return json(502, { error: lastMessage || "La plume IA n'a pas répondu. Relancez la rédaction." });
    }

    const content = cleanChapter(text);
    const wordCount = content.split(/\s+/).filter(Boolean).length;

    return json(200, { engine, content, word_count: wordCount, task: body.task || "redaction" });
  } catch (e) {
    console.error("book-chapter-write error:", e);
    return json(500, { error: (e as Error)?.message || "Erreur interne" });
  }
});
