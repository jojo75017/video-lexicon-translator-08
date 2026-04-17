import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ====== GEMINI 3 FLASH HELPER ======
async function callGemini(
  systemPrompt: string,
  userPrompt: string,
  options: { maxOutputTokens?: number; temperature?: number; timeoutMs?: number; userApiKey?: string } = {}
): Promise<{ text: string; error?: string; status?: number; stage?: string }> {
  // Prefer user-provided BYOK key, fallback to server key
  const GEMINI_API_KEY = options.userApiKey?.trim() || Deno.env.get('GEMINI_API_KEY');
  if (!GEMINI_API_KEY) {
    return {
      text: '',
      error: 'Clé API Gemini manquante. Configurez votre clé dans Paramètres > Clés API (gratuit sur aistudio.google.com/apikey).',
      status: 400,
      stage: 'missing_key',
    };
  }

  const { maxOutputTokens = 4000, temperature = 0.7, timeoutMs = 120000 } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          generationConfig: { temperature, maxOutputTokens },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', response.status, errText);
      if (response.status === 429) {
        return { text: '', error: 'Quota Gemini atteint. Attendez quelques minutes ou vérifiez votre quota sur aistudio.google.com.', status: 429, stage: 'rate_limit' };
      }
      if (response.status === 400 || response.status === 401 || response.status === 403) {
        return { text: '', error: 'Clé API Gemini invalide ou expirée. Vérifiez votre clé sur aistudio.google.com/apikey.', status: response.status, stage: 'invalid_key' };
      }
      return { text: '', error: `Erreur Gemini ${response.status}: ${errText.substring(0, 200)}`, status: response.status, stage: 'gemini_error' };
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!text) {
      console.error('Empty Gemini response:', JSON.stringify(data));
      return { text: '', error: "Réponse vide de l'IA. Réessayez en simplifiant votre demande.", status: 500, stage: 'empty_response' };
    }

    return { text };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return { text: '', error: 'Timeout - la génération a pris trop de temps. Simplifiez votre niche ou réessayez.', status: 504, stage: 'timeout' };
    }
    return { text: '', error: err.message || 'Erreur inconnue', status: 500, stage: 'unknown' };
  }
}

function geminiError(res: { error?: string; status?: number; stage?: string }) {
  return new Response(
    JSON.stringify({ error: res.error, stage: res.stage }),
    { status: res.status || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

function jsonSuccess(data: any) {
  return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

function cleanJsonResponse(text: string): string {
  return text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { email, actionType, prompt, numberOfChapters, ebookTitle, authorName, apiKey, type, content, openaiApiKey, useOpenAI, maxTokens, userApiKey } = body;
    console.log('Content generation request:', { email, actionType, type, hasUserKey: !!userApiKey });

    // ====== FLOATING AI EDIT ======
    if (type === 'floating-ai-edit') {
      console.log('Processing floating AI edit...');
      const instruction = body.instruction || 'Reformule ce texte.';
      const res = await callGemini(
        `Tu es un éditeur littéraire expert. L'utilisateur va te donner un extrait de texte et une instruction. Applique l'instruction et retourne UNIQUEMENT le texte modifié, sans explication, sans guillemets, sans préfixe.`,
        `Instruction: ${instruction}\n\nTexte à modifier:\n${content}`,
        { maxOutputTokens: 2000, temperature: 0.8 }
      );
      if (res.error) return geminiError(res);
      return jsonSuccess({ content: res.text.trim() });
    }

    // ====== KDP ANALYTICS ======
    if (type === 'kdp-analytics') {
      console.log('Processing KDP analytics (Gemini)...');
      const res = await callGemini(
        'Tu es un expert en analyse KDP Amazon. Réponds toujours en JSON valide sans markdown.',
        prompt,
        { maxOutputTokens: 2000 }
      );
      if (res.error) return geminiError(res);

      try {
        const analysis = JSON.parse(cleanJsonResponse(res.text));
        return jsonSuccess({ content: JSON.stringify(analysis) });
      } catch {
        console.error('JSON parse error, Raw:', res.text);
        return new Response(JSON.stringify({ error: 'Erreur de parsing des données' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // ====== KDP MARKET ANALYSIS ======
    if (type === 'kdp-market-analysis') {
      console.log('Processing KDP market analysis (Gemini)...');
      const res = await callGemini(
        'Tu es un expert en analyse de marché Amazon KDP. Tu fournis des analyses détaillées basées sur les tendances du marché ebook. Réponds toujours en JSON valide sans markdown.',
        prompt,
        { maxOutputTokens: 4000 }
      );
      if (res.error) return geminiError(res);
      return jsonSuccess({ content: res.text });
    }

    // ====== TITLE VOLUME ANALYSIS ======
    if (type === 'title-volume-analysis') {
      console.log('Processing title volume analysis (Gemini)...');
      const res = await callGemini(
        'Tu es un expert en analyse de volumes de titres. Réponds toujours en JSON valide sans markdown.',
        prompt,
        { maxOutputTokens: 2000 }
      );
      if (res.error) return geminiError(res);

      try {
        const analysis = JSON.parse(cleanJsonResponse(res.text));
        return jsonSuccess({ content: JSON.stringify(analysis) });
      } catch {
        return new Response(JSON.stringify({ error: 'Erreur de parsing des données' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // ====== STYLE ANALYSIS ======
    if (type === 'style-analysis') {
      console.log('Processing style analysis (Gemini)...');
      const res = await callGemini(
        'Tu es un expert en écriture et style littéraire. Tu analyses le texte et fournis des suggestions concrètes pour améliorer le style. Réponds toujours en JSON valide.',
        prompt,
        { maxOutputTokens: 2000 }
      );
      if (res.error) return geminiError(res);

      let cleanContent = res.text;
      try {
        cleanContent = cleanJsonResponse(res.text);
        JSON.parse(cleanContent);
      } catch { /* Keep as is */ }
      return jsonSuccess({ content: cleanContent });
    }

    // ====== ENHANCE DICTATION ======
    if (type === 'enhance-dictation') {
      console.log('Processing dictation enhancement (Gemini)...');
      const res = await callGemini(
        'Tu es un éditeur littéraire expert. Améliore le texte dicté en corrigeant la grammaire, la ponctuation et en améliorant le style tout en conservant le sens original. Ne fournis que le texte amélioré, sans commentaires.',
        prompt,
        { maxOutputTokens: 2000 }
      );
      if (res.error) return geminiError(res);
      return jsonSuccess({ content: res.text });
    }

    // ====== NICHE ANALYSIS ======
    if (type === 'niche-analysis') {
      console.log('Processing niche analysis (Gemini)...');
      const res = await callGemini(
        'Tu es un expert en analyse de niches. Réponds toujours en JSON valide sans markdown.',
        prompt,
        { maxOutputTokens: 2000 }
      );
      if (res.error) return geminiError(res);

      try {
        const analysis = JSON.parse(cleanJsonResponse(res.text));
        return jsonSuccess({ content: JSON.stringify(analysis) });
      } catch {
        return new Response(JSON.stringify({ error: 'Erreur de parsing des données' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // ====== KDP RESEARCH ======
    if (type === 'kdp-research') {
      console.log('Processing KDP research (Gemini)...');
      const res = await callGemini(
        `Tu es un expert en analyse de marché Amazon KDP et en optimisation SEO pour les ebooks. 
Tu fournis des données réalistes et exploitables basées sur les tendances actuelles du marché.
Réponds UNIQUEMENT avec du JSON valide, sans markdown, sans \`\`\`, sans commentaires.
Génère des données riches, variées et professionnelles.`,
        prompt,
        { maxOutputTokens: 4000 }
      );
      if (res.error) return geminiError(res);
      return jsonSuccess({ content: res.text });
    }

    // ====== KDP METADATA ======
    if (type === 'kdp-metadata') {
      console.log('Processing KDP metadata generation (Gemini)...');
      const { title, productType, pageCount, targetAudience, theme } = body;

      const productTypeLabels: Record<string, string> = {
        coloring: 'Livre de coloriage', comic: 'Bande dessinée', diary: 'Agenda / Journal intime',
        documentary: 'Livre documentaire', atlas: 'Atlas', encyclopedia: 'Encyclopédie',
      };
      const productLabel = productTypeLabels[productType] || productType;

      const systemPrompt = `Tu es un expert en marketing et SEO Amazon KDP avec une connaissance approfondie de l'algorithme A9.

RÈGLES POUR DES MÉTADONNÉES EXPLOITABLES :

DESCRIPTION (1500-4000 caractères) :
- Hook percutant en première ligne (visible sans cliquer "Lire plus")
- Structure AIDA : Attention → Intérêt → Désir → Action
- Bullet points avec ✅ pour les bénéfices
- HTML autorisé : <b>, <i>, <br>, <h2> UNIQUEMENT
- INTERDIT : liens, prix, promotions, superlatifs non vérifiables
- Intégrer naturellement 3-5 mots-clés SEO

MOTS-CLÉS (7 exactement) :
- Max 50 caractères par mot-clé
- INTERDIT : "kindle", "ebook", "livre", "book", "gratuit", "best-seller"
- Ne PAS répéter le titre
- Couvrir : synonymes, sous-niches, public cible, bénéfices, tendances
- Privilégier les termes ACHETEURS (pas informationnels)

CATÉGORIES :
- Utiliser les VRAIS chemins de catégories Amazon KDP
- Format : "Livres > Sous-catégorie > Sous-sous-catégorie"
- Choisir des catégories avec moins de concurrence quand possible

Réponds UNIQUEMENT avec un JSON valide, sans markdown, sans commentaires.`;

      const userPrompt = `Génère les métadonnées KDP PRÊTES À COLLER dans le tableau de bord Amazon pour ce livre:

INFORMATIONS:
- Titre: "${title || 'Sans Titre'}"
- Type: ${productLabel}
- Pages: ${pageCount || 50}
- Public cible: ${targetAudience || 'Tous publics'}
- Thème: ${theme || 'Non spécifié'}

GÉNÈRE UN JSON avec:
1. "description": Description Amazon HTML (1500-3900 chars, structure AIDA, bullets ✅)
2. "keywords": 7 mots-clés backend (≤50 chars chacun, termes acheteurs, pas de mots interdits)
3. "categories": 3 chemins de catégories Amazon réels
4. "suggestedPrice": {"min": X, "max": Y, "optimal": Z}`;

      const res = await callGemini(systemPrompt, userPrompt, { maxOutputTokens: 4000 });
      if (res.error) return geminiError(res);

      try {
        const parsedData = JSON.parse(cleanJsonResponse(res.text));
        return jsonSuccess({ content: JSON.stringify(parsedData), result: JSON.stringify(parsedData) });
      } catch {
        return jsonSuccess({ content: res.text, result: res.text });
      }
    }

    // ====== NARRATIVE ANALYSIS ======
    if (type === 'narrative-analysis') {
      console.log('Processing narrative analysis (Gemini)...');

      const narrativePrompt = `Tu es un expert en analyse narrative et cohérence littéraire. Analyse le contenu suivant d'un ebook et détecte toutes les incohérences narratives.

CONTENU À ANALYSER:
${content}

Recherche spécifiquement:
1. PERSONNAGES: Noms qui changent, descriptions contradictoires, personnages qui disparaissent
2. LIEUX: Incohérences géographiques, descriptions contradictoires de lieux
3. CHRONOLOGIE: Événements dans le mauvais ordre, anachronismes, dates contradictoires
4. OBJETS: Objets qui apparaissent/disparaissent sans explication
5. INTRIGUE: Trous dans l'histoire, sous-intrigues abandonnées

Réponds UNIQUEMENT avec un JSON valide (sans markdown) dans ce format exact:
{
  "issues": [{"type": "character|location|timeline|object|plot", "severity": "warning|error", "chapter": "nom du chapitre", "description": "description du problème", "suggestion": "suggestion pour corriger"}],
  "characters_mentioned": [{"name": "nom", "chapters": ["chapitre1"]}],
  "locations_mentioned": [{"name": "lieu", "chapters": ["chapitre1"]}],
  "timeline_events": [{"event": "description", "chapter": "chapitre"}],
  "overall_score": 85
}`;

      const res = await callGemini('Tu es un expert en analyse narrative.', narrativePrompt, { maxOutputTokens: 4000 });
      if (res.error) return geminiError(res);

      let analysis;
      try {
        analysis = JSON.parse(cleanJsonResponse(res.text));
      } catch {
        analysis = { issues: [], characters_mentioned: [], locations_mentioned: [], timeline_events: [], overall_score: 75 };
      }
      return jsonSuccess({ analysis });
    }

    // ====== SERIES BIBLE ======
    if (type === 'series-bible') {
      console.log('Processing series bible generation (Gemini)...');
      const res = await callGemini(
        'Tu es un expert en création littéraire. Génère uniquement du JSON valide sans markdown. Assure-toi que le JSON est COMPLET et bien fermé.',
        prompt,
        { maxOutputTokens: 8000, timeoutMs: 120000 }
      );
      if (res.error) return geminiError(res);
      return jsonSuccess({ content: res.text });
    }

    // ====== CHARACTERS ======
    if (type === 'characters') {
      console.log('Processing characters extraction (Gemini)...');
      const hasContent = content && content.trim().length > 50;
      
      const charactersPrompt = hasContent 
        ? `Tu es un expert en analyse littéraire. Analyse le contenu suivant et extrait une liste de 4 à 6 personnages (maximum 6) : personnages principaux + secondaires.

TITRE: ${ebookTitle || 'Sans titre'}

CONTENU:
${content}

Règles:
- Inclus aussi les personnages mentionnés brièvement (même une seule fois)
- Si le texte contient moins de 4 personnages nommés, complète avec des personnages secondaires plausibles et cohérents

Pour chaque personnage, fournis:
- Son nom exact
- Son rôle dans l'histoire (protagonist, antagonist, secondary, mentor, ally, love_interest, comic_relief, narrator, other)
- Une brève description de qui il est et ce qu'il fait`
        : `Tu es un expert en création littéraire. Basé sur le titre suivant, PROPOSE une liste de personnages pertinents pour cette histoire.

TITRE DE L'EBOOK: ${ebookTitle}

Crée 4 à 6 personnages intéressants et cohérents avec le thème du titre. Pour chaque personnage, fournis:
- Un nom approprié au genre/thème
- Son rôle dans l'histoire (protagonist, antagonist, secondary, mentor, ally, love_interest, comic_relief, narrator, other)
- Une description détaillée de qui il est, sa personnalité, ses motivations`;

      const jsonInstruction = `

Réponds UNIQUEMENT avec un JSON valide (sans markdown, sans balises) dans ce format exact:
{
  "characters": [
    { "name": "Nom du personnage", "role": "protagonist", "description": "Description du personnage et de son rôle dans l'histoire" }
  ]
}`;

      const res = await callGemini(
        'Tu es un expert en création littéraire. Génère uniquement du JSON valide sans markdown.',
        charactersPrompt + jsonInstruction,
        { maxOutputTokens: 2000, timeoutMs: 60000 }
      );
      if (res.error) return geminiError(res);

      let result;
      try {
        result = JSON.parse(cleanJsonResponse(res.text));
      } catch {
        result = { characters: [] };
      }
      console.log('Characters extraction completed:', result.characters?.length || 0, 'found');
      return jsonSuccess(result);
    }

    // ====== CHARACTER PROFILE ======
    if (type === 'character-profile') {
      console.log('Processing character profile generation (Gemini)...');
      const characterName = body.characterName || 'Sans nom';
      const characterRole = body.characterRole || 'secondary';
      const characterDescription = body.characterDescription || '';
      const otherCharacters = body.otherCharacters || '';

      const roleLabels: Record<string, string> = {
        protagonist: 'Protagoniste principal', antagonist: 'Antagoniste', secondary: 'Personnage secondaire',
        mentor: 'Mentor / Guide', ally: 'Allié', love_interest: 'Intérêt amoureux',
        comic_relief: 'Comic relief', narrator: 'Narrateur', other: 'Autre'
      };

      const profilePrompt = `Tu es un expert en création de personnages littéraires. Génère une fiche complète pour ce personnage.

PERSONNAGE: ${characterName}
RÔLE: ${roleLabels[characterRole] || characterRole}
DESCRIPTION EXISTANTE: ${characterDescription || 'Aucune'}
TITRE DU LIVRE: ${ebookTitle || 'Non spécifié'}
AUTRES PERSONNAGES DU LIVRE: ${otherCharacters || 'Aucun'}

Crée une fiche détaillée et cohérente avec les informations existantes. Sois créatif mais réaliste.

Réponds UNIQUEMENT avec un JSON valide (sans markdown) dans ce format exact:
{
  "profile": {
    "physicalDescription": "Description physique détaillée",
    "psychology": "Traits de personnalité, forces, faiblesses, peurs profondes, motivations internes",
    "narrativeArc": "Évolution du personnage au fil de l'histoire",
    "objectives": "Objectifs principaux et besoins profonds",
    "relationships": "Relations avec les autres personnages"
  }
}`;

      const res = await callGemini(
        'Tu es un expert en création littéraire. Génère uniquement du JSON valide sans markdown.',
        profilePrompt,
        { maxOutputTokens: 2000, timeoutMs: 60000 }
      );
      if (res.error) return geminiError(res);

      let result;
      try {
        result = JSON.parse(cleanJsonResponse(res.text));
      } catch {
        result = { profile: {} };
      }
      console.log('Character profile generated for:', characterName);
      return jsonSuccess(result);
    }

    // ====== NEXT TOME ======
    if (type === 'next-tome') {
      console.log('Processing next tome generation (Gemini)...');
      const res = await callGemini(
        'Tu es un expert en création littéraire. Génère uniquement du JSON valide sans markdown.',
        prompt,
        { maxOutputTokens: 4000, timeoutMs: 120000 }
      );
      if (res.error) return geminiError(res);
      return jsonSuccess({ content: res.text });
    }

    // ====== TOME CHAPTERS ======
    if (type === 'tome-chapters') {
      console.log('Processing tome chapters generation (Gemini)...');
      const res = await callGemini(
        'Tu es un expert en création littéraire et planification de livres. Génère uniquement du JSON valide sans balises markdown.',
        prompt,
        { maxOutputTokens: 4000, timeoutMs: 120000 }
      );
      if (res.error) return geminiError(res);
      return jsonSuccess({ content: res.text });
    }

    // ====== COMIC SCENARIO ======
    if (type === 'comic-scenario') {
      console.log('Processing comic scenario generation (Gemini)...');
      const comicSystemPrompt = `Tu es un scénariste expert de bandes dessinées pour enfants et adolescents. 
Tu crées des scénarios visuels riches et des dialogues percutants adaptés à l'âge du public.
CHAQUE PAGE doit avoir une description visuelle UNIQUE et des dialogues DIFFÉRENTS.
Réponds UNIQUEMENT avec du JSON valide, sans markdown, sans \`\`\`, sans commentaires.`;

      const res = await callGemini(comicSystemPrompt, prompt, { maxOutputTokens: 4000, timeoutMs: 120000 });
      if (res.error) return geminiError(res);
      return jsonSuccess({ content: res.text });
    }

    // ====== ENCYCLOPEDIA / ATLAS ======
    if (type === 'encyclopedia' || type === 'atlas') {
      console.log(`Processing ${type} generation (Gemini)...`);
      const sysPrompt = type === 'encyclopedia'
        ? "Tu es un expert naturaliste. Génère des fiches encyclopédiques détaillées et précises. Réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ou après, sans balises markdown."
        : "Tu es un expert en géographie naturelle et écologie. Génère des fiches atlas détaillées. Réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ou après, sans balises markdown.";

      const res = await callGemini(sysPrompt, prompt, { maxOutputTokens: 6000, temperature: 0.4, timeoutMs: 180000 });
      if (res.error) return geminiError(res);
      return jsonSuccess({ content: res.text });
    }

    // ====== DOCUMENTARY ======
    if (type === 'documentary-structure' || type === 'documentary-chapter' || type === 'documentary-chapter-regen') {
      console.log(`Processing ${type} generation (Gemini)...`);
      const sysPrompt = type === 'documentary-structure'
        ? `Tu es un auteur documentaire professionnel spécialisé dans la création de livres factuels de haute qualité.
Tu génères des structures complètes avec introduction, chapitres détaillés, conclusion, bibliographie et glossaire.
Réponds UNIQUEMENT avec du JSON valide, sans markdown, sans balises code.`
        : `Tu es un rédacteur documentaire expert.
Tu écris du contenu factuel, bien documenté, engageant et adapté à l'audience cible.
Réponds avec du texte formaté de manière professionnelle, bien structuré avec des paragraphes clairs.`;

      const res = await callGemini(sysPrompt, prompt, {
        maxOutputTokens: maxTokens || (type === 'documentary-structure' ? 8000 : 2500),
        timeoutMs: 180000
      });
      if (res.error) return geminiError(res);
      return jsonSuccess({ content: res.text });
    }

    // ====== TRAVEL SHEETS ======
    if (type === 'travel-sheets') {
      console.log('Processing travel-sheets generation (Gemini)...');
      const res = await callGemini(
        `Tu es un guide touristique. Génère des fiches destinations en JSON.

FORMAT JSON STRICT (sans markdown):
{"destinations": [{
  "destinationName": "Nom", "country": "Pays", "region": "Région", "population": "X habitants",
  "language": "Langue", "currency": "Monnaie", "climate": "Type climat", "bestSeason": "Période",
  "description": "3-4 phrases sur l'ambiance", "history": "2-3 phrases sur l'histoire",
  "mainDish": "Plat local", "dishDescription": "2 phrases sur le plat",
  "localSpecialties": ["Spec1", "Spec2", "Spec3"],
  "accommodations": {"budget": "Hotel eco", "midRange": "Hotel 3*", "luxury": "Hotel 5*"},
  "whereToStay": "Conseils quartiers",
  "mustSee": ["Lieu1", "Lieu2", "Lieu3", "Lieu4", "Lieu5"],
  "hiddenGems": ["Secret1", "Secret2"],
  "activities": ["Activité1", "Activité2", "Activité3"],
  "travelTips": "Conseils pratiques", "transportation": "Transports locaux",
  "faq": [{"question": "Q1?", "answer": "R1"}, {"question": "Q2?", "answer": "R2"}, {"question": "Q3?", "answer": "R3"}]
}]}`,
        prompt,
        { maxOutputTokens: 4000, timeoutMs: 45000 }
      );
      if (res.error) return geminiError(res);
      return jsonSuccess({ content: res.text });
    }

    // ====== RECIPE SHEETS ======
    if (type === 'recipe-sheets') {
      console.log('Processing recipe-sheets generation (Gemini)...');
      const res = await callGemini(
        `Tu es un chef étoilé Michelin et sommelier expert. Tu génères des fiches recettes TRÈS DÉTAILLÉES pour des livres de cuisine premium.

RÈGLES CRITIQUES:
- Chaque recette DOIT contenir MINIMUM 300 MOTS
- Le champ "description" + "history" doit faire minimum 150 mots combinés
- Les "steps" doivent être 10-12 étapes détaillées
- Inclure des détails culturels, historiques et gastronomiques riches
- Réponds UNIQUEMENT en JSON valide sans markdown ni backticks`,
        prompt,
        { maxOutputTokens: 8000, temperature: 0.8, timeoutMs: 120000 }
      );
      if (res.error) return geminiError(res);
      return jsonSuccess({ content: res.text });
    }

    // ====== KDP KEYWORD RESEARCH ======
    if (type === 'kdp-keyword-research') {
      console.log('Processing KDP keyword research (Gemini)...');
      const res = await callGemini(
        `Tu es un EXPERT SEO Amazon KDP avec 10 ans d'expérience en optimisation de fiches produits Kindle.

RÈGLES CRITIQUES POUR DES MOTS-CLÉS AMAZON EXPLOITABLES :

1. VOLUMES RÉALISTES : Amazon ≠ Google. Un volume de 5000/mois sur Amazon est ÉNORME. 
   - Niche étroite : 50-500/mois
   - Niche moyenne : 500-3000/mois  
   - Niche large : 3000-15000/mois
   - Ne JAMAIS dépasser 50000

2. MOTS-CLÉS ACHETEURS : Priorise les termes que les ACHETEURS tapent, pas les curieux :
   - "guide pratique [sujet]" > "qu'est-ce que [sujet]"
   - "livre [sujet] débutant" > "[sujet] définition"
   - Inclure des termes avec "livre", "guide", "méthode", "programme"

3. CONCURRENCE RÉALISTE : 
   - "low" = moins de 50 résultats KDP sur ce terme exact
   - "medium" = 50-200 résultats
   - "high" = 200+ résultats

4. SCORE D'OPPORTUNITÉ = (volume × (100 - difficulty)) / 100

5. DIVERSITÉ OBLIGATOIRE : Inclure un mix de termes exacts, variantes, questions, termes émotionnels, sous-niches.

Réponds UNIQUEMENT avec un tableau JSON valide, sans markdown.`,
        prompt,
        { maxOutputTokens: 8000, temperature: 0.6, timeoutMs: 90000, userApiKey }
      );
      if (res.error) return geminiError(res);
      return jsonSuccess({ content: res.text });
    }

    // ====== KDP LONG-TAIL KEYWORDS ======
    if (type === 'kdp-longtail') {
      console.log('Processing KDP long-tail keywords (Gemini)...');
      const res = await callGemini(
        `Tu es un EXPERT SEO Amazon KDP spécialisé en mots-clés LONGUE TRAÎNE (3-6 mots).

RÈGLES POUR DES MOTS-CLÉS LONGUE TRAÎNE EXPLOITABLES :

1. LONGUEUR : Chaque mot-clé doit contenir 3 à 6 mots minimum
2. SPÉCIFICITÉ : Plus le terme est précis, mieux c'est pour le classement
3. INTENTION D'ACHAT : Prioriser les termes que tapent les ACHETEURS
4. VOLUMES RÉALISTES Amazon : 50-2000/mois pour de la longue traîne
5. FAIBLE CONCURRENCE : Difficulté 5-40 maximum
6. DIVERSITÉ : Couvrir questions, problèmes, solutions, audiences

Réponds UNIQUEMENT avec un tableau JSON valide, sans markdown ni backticks.`,
        prompt,
        { maxOutputTokens: 8000, temperature: 0.6, timeoutMs: 90000, userApiKey }
      );
      if (res.error) return geminiError(res);
      return jsonSuccess({ content: res.text });
    }

    if (type === 'kdp-backend-keywords') {
      console.log('Processing KDP backend keywords (Gemini)...');
      const res = await callGemini(
        `Tu es un EXPERT Amazon KDP spécialisé dans l'optimisation des 7 mots-clés backend du tableau de bord KDP.

RÈGLES AMAZON STRICTES (non-respect = rejet du livre) :
1. EXACTEMENT 7 mots-clés, ni plus ni moins
2. Maximum 50 caractères par champ (espaces inclus)
3. INTERDIT : "kindle", "ebook", "livre", "book", "free", "gratuit", "best-seller", "best seller", noms de marques
4. INTERDIT : répéter des mots déjà dans le titre ou sous-titre
5. INTERDIT : mettre des virgules dans un champ
6. Pas d'accents inutiles si la version sans accent est aussi cherchée
7. Pas de fautes d'orthographe intentionnelles

STRATÉGIE OPTIMALE :
- Champ 1-2 : Synonymes directs du sujet principal
- Champ 3-4 : Termes de sous-niche / audience cible  
- Champ 5-6 : Termes émotionnels / bénéfices
- Champ 7 : Terme saisonnier ou tendance

Réponds UNIQUEMENT avec un tableau JSON de 7 strings, sans markdown ni backticks : ["mot-clé 1", "mot-clé 2", ...]`,
        prompt,
        { maxOutputTokens: 2000, temperature: 0.4, timeoutMs: 60000, userApiKey }
      );
      if (res.error) return geminiError(res);
      return jsonSuccess({ content: res.text });
    }

    // ====== GENERIC FALLBACK HANDLER ======
    console.log('Calling Gemini API (generic handler)...');
    const res = await callGemini(
      'Vous êtes un expert en création de contenu pour ebooks. Répondez en français avec un contenu de haute qualité.',
      prompt,
      { maxOutputTokens: maxTokens || 2000 }
    );
    if (res.error) return geminiError(res);

    console.log('Content generated successfully');
    return jsonSuccess({ content: res.text });

  } catch (error) {
    console.error('Error in generate-content:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erreur inconnue' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
