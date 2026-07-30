import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { bookData, csvSummary, auditType = 'book' } = await req.json();
    if (!bookData && !csvSummary) return jsonResponse({ success: false, error: 'Données requises pour l’audit' }, 400);

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) return jsonResponse({ success: false, error: 'Clé Gemini non configurée. Ajoutez votre clé dans les paramètres.' }, 500);

    const prompt = auditType === 'csv'
      ? buildCsvAuditPrompt(csvSummary)
      : buildBookAuditPrompt(bookData);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.45, maxOutputTokens: 32768, responseMimeType: 'application/json' },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      if (response.status === 429) return jsonResponse({ success: false, error: 'Trop de requêtes Gemini, réessayez dans quelques secondes.' }, 429);
      return jsonResponse({ success: false, error: 'Erreur Gemini: ' + response.status }, 500);
    }

    const aiData = await response.json();
    const candidate = aiData?.candidates?.[0];
    const finishReason = candidate?.finishReason;
    const rawText = candidate?.content?.parts?.[0]?.text;
    if (!rawText) return jsonResponse({ success: false, error: 'Réponse Gemini vide' }, 500);
    if (finishReason && finishReason !== 'STOP') {
      console.warn('Gemini finishReason:', finishReason, '- réponse possiblement tronquée, tentative de réparation.');
    }

    let audit: Record<string, unknown>;
    try {
      audit = JSON.parse(cleanJson(rawText));
    } catch (parseErr) {
      console.warn('JSON direct invalide, tentative de réparation:', parseErr instanceof Error ? parseErr.message : parseErr);
      const repaired = repairJson(cleanJson(rawText));
      try {
        audit = JSON.parse(repaired);
      } catch (repairErr) {
        console.error('Réparation JSON échouée:', repairErr instanceof Error ? repairErr.message : repairErr);
        return jsonResponse({ success: false, error: 'Réponse IA incomplète, relancez l’audit.' }, 502);
      }
    }
    return jsonResponse({ success: true, data: normalizeAudit(audit) });
  } catch (error) {
    console.error('Audit error:', error);
    return jsonResponse({ success: false, error: error instanceof Error ? error.message : 'Erreur interne' }, 500);
  }
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

function cleanJson(text: string) {
  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  return match ? match[0] : cleaned;
}

/**
 * Répare un JSON tronqué par la limite de tokens :
 * coupe après la dernière virgule de fin de valeur complète, puis ferme
 * les chaînes/objets/tableaux encore ouverts.
 */
function repairJson(input: string): string {
  let s = (input || '').trim();
  // Retire un objet/clé partiel en fin de chaîne (après la dernière accolade/crochet/valeur fermée).
  const lastClose = Math.max(s.lastIndexOf('}'), s.lastIndexOf(']'), s.lastIndexOf('"'));
  if (lastClose > 0 && lastClose < s.length - 1) {
    s = s.slice(0, lastClose + 1);
  }
  s = s.replace(/,\s*$/, '');

  // Compte les structures ouvertes en ignorant ce qui est dans des chaînes.
  let inString = false;
  let escaped = false;
  const stack: string[] = [];
  for (const ch of s) {
    if (escaped) { escaped = false; continue; }
    if (ch === '\\') { escaped = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{' || ch === '[') stack.push(ch);
    else if (ch === '}' || ch === ']') stack.pop();
  }
  if (inString) s += '"';
  while (stack.length) {
    const open = stack.pop();
    s += open === '{' ? '}' : ']';
  }
  return s;
}

function buildBookAuditPrompt(bookData: Record<string, unknown>) {
  return `Tu es un expert Amazon KDP senior. Analyse cette fiche publique et retourne UNIQUEMENT un JSON valide, sans markdown.

Structure obligatoire:
{
  "overall_score": number,
  "overall_verdict": string,
  "globalScore": number,
  "verdict": string,
  "priorityLevel": "critique" | "important" | "recommandé",
  "potential": "faible" | "moyen" | "bon" | "fort",
  "criteria": [{"name": string, "score": number, "status": "excellent" | "bon" | "moyen" | "faible" | "critique", "recommendation": string, "priority": "haute" | "moyenne" | "basse"}],
  "quick_wins": string[],
  "titleAudit": {"score": number, "problems": string[], "suggestedTitles": string[], "keywordsToInclude": string[]},
  "subtitleAudit": {"score": number, "promiseClarity": string, "seoLevel": string, "suggestedSubtitles": string[]},
  "descriptionAudit": {"score": number, "weaknesses": string[], "missingSections": string[], "improvedDescription": string},
  "categoriesAudit": {"score": number, "currentFit": string, "opportunities": string[], "suggestedCategories": string[]},
  "keywordsAudit": {"backendKeywords": string[], "competitorKeywords": string[], "missingKeywords": string[], "keywordsToAvoid": string[]},
  "pricingAudit": {"score": number, "diagnosis": string, "recommendedPriceRange": string},
  "conversionAudit": {"score": number, "positiveSignals": string[], "conversionFriction": string[]},
  "positioningAudit": {"diagnosis": string, "priorityActions": string[]},
  "actionPlan": string[]
}

Contraintes:
- Réponds en français.
- Donne des corrections concrètes prêtes à copier.
- Propose exactement 4 titres alternatifs si le titre peut être amélioré.
- Propose exactement 7 mots-clés backend.
- Ne prétends jamais connaître des ventes privées; utilise uniquement les estimations fournies.

Données livre:
${JSON.stringify(bookData, null, 2)}`;
}

function buildCsvAuditPrompt(csvSummary: Record<string, unknown>) {
  return `Tu es un analyste KDP/Amazon Ads. Analyse ce résumé CSV importé par l’utilisateur et retourne UNIQUEMENT un JSON valide.

Structure obligatoire:
{
  "overall_score": number,
  "overall_verdict": string,
  "globalScore": number,
  "verdict": string,
  "priorityLevel": "critique" | "important" | "recommandé",
  "potential": "faible" | "moyen" | "bon" | "fort",
  "criteria": [{"name": string, "score": number, "status": "excellent" | "bon" | "moyen" | "faible" | "critique", "recommendation": string, "priority": "haute" | "moyenne" | "basse"}],
  "quick_wins": string[],
  "performanceSummary": {"booksAnalyzed": number, "underperformers": number, "bestOpportunities": string[]},
  "bookPriorities": [{"title": string, "status": string, "probableProblem": string, "recommendedAction": string}],
  "actionPlan": string[]
}

Analyse:
- livres qui vendent peu
- trafic avec mauvaise conversion
- prix potentiellement mal optimisé
- dépenses Ads non rentables si colonnes disponibles
- livres à prioriser

Données CSV résumées:
${JSON.stringify(csvSummary, null, 2)}`;
}

function normalizeAudit(audit: Record<string, unknown>) {
  const score = Number(audit.globalScore || audit.overall_score || 0);
  return {
    ...audit,
    globalScore: score,
    overall_score: score,
    verdict: String(audit.verdict || audit.overall_verdict || ''),
    overall_verdict: String(audit.overall_verdict || audit.verdict || ''),
    criteria: Array.isArray(audit.criteria) ? audit.criteria : [],
    quick_wins: Array.isArray(audit.quick_wins) ? audit.quick_wins : [],
    actionPlan: Array.isArray(audit.actionPlan) ? audit.actionPlan : [],
  };
}