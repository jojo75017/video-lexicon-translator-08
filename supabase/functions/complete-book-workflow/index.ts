import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DEFAULT_WORDS_PER_CHAPTER = 3500;

// STANDARDS ÉDITORIAUX PRO — Voix d'éditeur professionnel
const EDITORIAL_PRO_RULES = `
STANDARDS ÉDITORIAUX PROFESSIONNELS (niveau maison d'édition) :

1. DENSITÉ INFORMATIONNELLE : Chaque phrase apporte une info nouvelle. Zéro remplissage, zéro phrase creuse.
2. VOIX AUTHENTIQUE : Tu es un éditeur avec 20 ans d'expérience. Tu parles avec autorité et clarté.
3. INTERDICTIONS ABSOLUES :
   - "Dans ce chapitre, nous allons explorer..." → BANNI
   - "Il est important de noter que..." → BANNI
   - "Comme nous l'avons vu précédemment..." → BANNI
   - Listes à puces sans contexte → BANNI
   - Phrases de plus de 30 mots → À REFORMULER
   - Adverbes inutiles (vraiment, très, absolument) → SUPPRIMER
   - Tournures passives excessives → REMPLACER par actif
4. STYLE BEST-SELLER :
   - Accroche dès la première ligne
   - Anecdotes concrètes, pas de théorie abstraite
   - Exemples réels et vérifiables
   - Rythme varié : phrases courtes percutantes + développements fluides
   - Transitions naturelles entre les idées
5. SCORING : Tu dois t'auto-évaluer honnêtement sur 10.
   Score 9-10 = publiable tel quel par une maison d'édition
   Score 7-8 = bon mais perfectible
   Score < 7 = à refaire
`;

// Variable globale pour stocker la clé API
let activeApiKey: string | null = null;

// Token tracking global
let totalTokenUsage = {
  promptTokens: 0,
  completionTokens: 0,
  totalTokens: 0
};

async function callGeminiDirect(systemPrompt: string, userPrompt: string, maxTokens: number, apiKey: string, retryCount = 0): Promise<string> {
  const MAX_RETRIES = 3;
  const cleanKey = apiKey.trim();
  
  // Pre-flight: vérifier le format de la clé Gemini
  if (!cleanKey || cleanKey.length < 20 || !cleanKey.startsWith('AIza')) {
    throw new Error('INVALID_API_KEY: Clé API Gemini invalide. Utilisez une clé Google AI Studio commençant par AIza.');
  }
  
  console.log(`[Gemini] Using key: length=${cleanKey.length}, prefix=${cleanKey.substring(0, 8)}..., retry=${retryCount}`);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${cleanKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt + EDITORIAL_PRO_RULES }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 },
    }),
  });

  if (!response.ok) {
    const status = response.status;
    const errText = await response.text();
    console.error(`Gemini direct error ${status}: ${errText}`);
    
    // Retry automatique sur 429 avec délai exponentiel
    if (status === 429 && retryCount < MAX_RETRIES) {
      // Extraire le délai suggéré par Google ou utiliser un backoff exponentiel
      const retryMatch = errText.match(/retry in (\d+)/i);
      const waitSeconds = retryMatch ? parseInt(retryMatch[1]) + 5 : Math.min(15 * Math.pow(2, retryCount), 120);
      console.log(`⏳ Rate limit Gemini - retry ${retryCount + 1}/${MAX_RETRIES} dans ${waitSeconds}s...`);
      await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000));
      return await callGeminiDirect(systemPrompt, userPrompt, maxTokens, apiKey, retryCount + 1);
    }
    
    if (status === 429) throw new Error('RATE_LIMIT: Limite Gemini atteinte après 3 tentatives. Activez la facturation sur votre projet Google Cloud pour supprimer cette limite.');
    if (status === 400 || status === 401 || status === 403) throw new Error('INVALID_API_KEY: Clé API Gemini invalide. Utilisez une clé Google AI Studio commençant par AIza.');
    throw new Error(`Gemini Error: ${status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callAI(systemPrompt: string, userPrompt: string, maxTokens = 4000): Promise<string> {
  // BYOK OBLIGATOIRE : seule la clé de l'utilisateur est acceptée
  const userKey = activeApiKey;
  
  if (!userKey) {
    throw new Error('NO_API_KEY: Clé API Gemini requise. Configurez votre propre clé Gemini dans les Paramètres avant de générer.');
  }

  return await callGeminiDirect(systemPrompt + EDITORIAL_PRO_RULES, userPrompt, maxTokens, userKey);
}

// BOUCLE QUALITÉ : appelle l'IA, évalue le score, relance si < seuil
async function callAIWithQualityLoop(
  systemPrompt: string, 
  userPrompt: string, 
  maxTokens: number,
  minScore: number = 9,
  maxRetries: number = 2,
  stepName: string = ''
): Promise<{ content: string; qualityScore: number; attempts: number }> {
  let bestContent = '';
  let bestScore = 0;
  let attempts = 0;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    attempts = attempt + 1;
    
    // Ajouter la demande d'auto-évaluation au prompt
    const qualityPrompt = attempt === 0 
      ? userPrompt + `\n\nIMPORTANT : Ajoute un champ "qualityScore" (1-10) dans ton JSON. Sois HONNÊTE. Vise ${minScore}/10 minimum.`
      : userPrompt + `\n\nATTENTION : Le résultat précédent n'a obtenu que ${bestScore}/10. Tu DOIS atteindre ${minScore}/10 minimum cette fois. Améliore la qualité, la profondeur et l'originalité. Ajoute "qualityScore" dans ton JSON.`;
    
    const content = await callAI(systemPrompt, qualityPrompt, maxTokens);
    const parsed = parseJSON(content);
    const score = parsed?.qualityScore || parsed?.scoreGlobal || parsed?.scoreReelEstime || 7;
    
    console.log(`🎯 ${stepName} - Attempt ${attempts}: score ${score}/${minScore}`);
    
    if (score > bestScore) {
      bestScore = score;
      bestContent = content;
    }
    
    if (score >= minScore) {
      console.log(`✅ ${stepName} - Quality target reached: ${score}/10`);
      break;
    }
    
    if (attempt < maxRetries) {
      console.log(`🔄 ${stepName} - Score ${score}/10 < ${minScore}, retrying...`);
    }
  }
  
  return { content: bestContent, qualityScore: bestScore, attempts };
}

function parseJSON(content: string): any {
  if (!content || typeof content !== 'string') return null;
  
  let cleaned = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
  
  try {
    return JSON.parse(cleaned.trim());
  } catch {}
  
  try {
    const start = cleaned.indexOf('{');
    if (start === -1) return null;
    
    let depth = 0;
    let end = -1;
    for (let i = start; i < cleaned.length; i++) {
      if (cleaned[i] === '{') depth++;
      else if (cleaned[i] === '}') {
        depth--;
        if (depth === 0) { end = i; break; }
      }
    }
    
    if (end > start) {
      let jsonStr = cleaned.substring(start, end + 1);
      try {
        return JSON.parse(jsonStr);
      } catch {
        jsonStr = jsonStr.replace(/,\s*([\]}])/g, '$1');
        jsonStr = jsonStr.replace(/(?<="[^"]*)\n(?=[^"]*")/g, '\\n');
        try {
          return JSON.parse(jsonStr);
        } catch (e) {
          console.error('JSON parse failed after repair:', e);
        }
      }
    }
  } catch (e) {
    console.error('JSON extraction error:', e);
  }
  
  return null;
}

function cleanGeneratedText(text: string): string {
  if (!text || typeof text !== 'string') return text;
  
  return text
    .replace(/\\"/g, '')
    .replace(/\\'/g, '')
    .replace(/\\\\/g, '')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\\//g, '/')
    .replace(/^\s*{\s*"[^"]*"\s*:\s*"/gm, '')
    .replace(/"\s*}\s*$/gm, '')
    .replace(/^\s*\[\s*"/gm, '')
    .replace(/"\s*\]\s*$/gm, '')
    .replace(/",\s*"[^"]*"\s*:\s*"/g, ' ')
    .replace(/":\s*"/g, ': ')
    .replace(/{\s*"/g, '')
    .replace(/"\s*}/g, '')
    .replace(/^"+/gm, '')
    .replace(/"+$/gm, '')
    .replace(/(?<![a-zA-ZÀ-ÿ])"(?![a-zA-ZÀ-ÿ])/g, '')
    .replace(/  +/g, ' ')
    .replace(/ ([.,;:!?])/g, '$1')
    .replace(/\.([A-ZÀ-ÖØ-öø-ÿa-z])/g, '. $1')
    .replace(/\!([A-ZÀ-ÖØ-öø-ÿa-z])/g, '! $1')
    .replace(/\?([A-ZÀ-ÖØ-öø-ÿa-z])/g, '? $1')
    .replace(/,([A-ZÀ-ÖØ-öø-ÿa-z])/g, ', $1')
    .replace(/;([A-ZÀ-ÖØ-öø-ÿa-z])/g, '; $1')
    .replace(/:([A-ZÀ-ÖØ-öø-ÿa-z])/g, ': $1')
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function cleanChapter(chapter: any): any {
  if (!chapter) return chapter;
  
  return {
    ...chapter,
    titre: cleanGeneratedText(chapter.titre),
    title: cleanGeneratedText(chapter.title),
    contenu: cleanGeneratedText(chapter.contenu),
    content: cleanGeneratedText(chapter.content),
  };
}

function normalizeP3Chapter(rawChapter: any, index: number, wordsPerChapter: number) {
  if (!rawChapter || (typeof rawChapter !== 'object' && typeof rawChapter !== 'string')) return null;

  const numero = Number(rawChapter.numero) || index + 1;
  const derivedTitle = typeof rawChapter === 'string'
    ? rawChapter
    : rawChapter.titre || rawChapter.title || rawChapter.nom || rawChapter.chapterTitle || rawChapter.heading || `Chapitre ${numero}`;
  const titre = cleanGeneratedText(derivedTitle);
  const objectif = cleanGeneratedText(rawChapter.objectif || rawChapter.goal || rawChapter.resume || rawChapter.summary || rawChapter.description || '');
  const rawSubSections =
    rawChapter.sousSections ||
    rawChapter.subSections ||
    rawChapter.sections ||
    rawChapter.parties ||
    rawChapter.points ||
    [];
  const sousSections = Array.isArray(rawSubSections)
    ? rawSubSections.map((item: any) => cleanGeneratedText(String(item))).filter(Boolean)
    : typeof rawSubSections === 'string'
      ? rawSubSections.split(/\n|•|- /g).map((item: string) => cleanGeneratedText(item)).filter(Boolean)
      : [];
  const rawPointsCles = rawChapter.pointsCles || rawChapter.keyPoints || rawChapter.points_cles || [];
  const pointsCles = Array.isArray(rawPointsCles)
    ? rawPointsCles.map((item: any) => cleanGeneratedText(String(item))).filter(Boolean)
    : typeof rawPointsCles === 'string'
      ? rawPointsCles.split(/\n|•|- /g).map((item: string) => cleanGeneratedText(item)).filter(Boolean)
      : [];

  if (!titre) return null;

  return {
    numero,
    titre,
    objectif,
    nombreMotsPrevu: Number(rawChapter.nombreMotsPrevu) || wordsPerChapter,
    sousSections,
    pointsCles,
    accroche: cleanGeneratedText(rawChapter.accroche || ''),
    lienAvecPrecedent: cleanGeneratedText(rawChapter.lienAvecPrecedent || ''),
  };
}

function normalizeP3Result(result: any, numberOfChapters: number, wordsPerChapter: number) {
  const rawChapters =
    (Array.isArray(result) && result) ||
    (Array.isArray(result?.chapitres) && result.chapitres) ||
    (Array.isArray(result?.chapters) && result.chapters) ||
    (Array.isArray(result?.tableDesMatieres) && result.tableDesMatieres) ||
    (Array.isArray(result?.table_of_contents) && result.table_of_contents) ||
    [];
  const normalizedChapters = rawChapters
    .map((chapter: any, index: number) => normalizeP3Chapter(chapter, index, wordsPerChapter))
    .filter(Boolean);

  const paddedChapters = normalizedChapters.length > 0 && normalizedChapters.length < numberOfChapters
    ? [
        ...normalizedChapters,
        ...Array.from({ length: numberOfChapters - normalizedChapters.length }, (_, offset) => {
          const numero = normalizedChapters.length + offset + 1;
          return {
            numero,
            titre: `Chapitre ${numero}`,
            objectif: 'À détailler',
            nombreMotsPrevu: wordsPerChapter,
            sousSections: [],
            pointsCles: [],
            accroche: '',
            lienAvecPrecedent: '',
          };
        }),
      ]
    : normalizedChapters;

  return {
    ...result,
    chapitres: paddedChapters,
  };
}

function getP3GenerationSettings(numberOfChapters: number) {
  const isLargeProject = numberOfChapters >= 16;
  const isVeryLargeProject = numberOfChapters >= 30;

  return {
    isLargeProject,
    isVeryLargeProject,
    maxTokens: isVeryLargeProject
      ? 4200
      : Math.min(7000, Math.max(3600, 1800 + numberOfChapters * 90)),
    minScore: isLargeProject ? 7 : 9,
    maxRetries: isLargeProject ? 0 : 1,
    sousSectionsRange: isVeryLargeProject ? '2-3' : isLargeProject ? '3-4' : '4-6',
    keyPointsCount: isVeryLargeProject ? 1 : isLargeProject ? 2 : 3,
    characterDescriptionLength: isVeryLargeProject ? '1 phrase maximum' : isLargeProject ? '1-2 phrases maximum' : '2-3 phrases',
  };
}

function getP4GenerationSettings(numberOfChapters: number) {
  const isLargeProject = numberOfChapters >= 16;
  const isVeryLargeProject = numberOfChapters >= 30;

  return {
    isLargeProject,
    isVeryLargeProject,
    maxTokens: isVeryLargeProject ? 2400 : isLargeProject ? 4200 : 6000,
    minWords: isVeryLargeProject ? 1200 : 2500,
    targetWords: isVeryLargeProject ? 1600 : 3000,
    maxWords: isVeryLargeProject ? 1900 : 3500,
    minScore: isVeryLargeProject ? 7 : 8,
    maxRetries: isVeryLargeProject ? 0 : 1,
    previousChapterChars: isVeryLargeProject ? 140 : 400,
    segmentCount: isVeryLargeProject ? 2 : 1,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  totalTokenUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };

  try {
    const payload = await req.json();
    const {
      step,
      title,
      subtitle = '',
      category = '',
      authorName,
      numberOfChapters = 8,
      bookIntroduction = '',
      characters = [],
      previousContext = {},
      chapter,
      chapterSegment,
      userApiKey,
      useUserKey: _useUserKey,
    } = payload;

    // Nettoyer et valider la clé API
    const cleanedApiKey = typeof userApiKey === 'string' ? userApiKey.trim() : '';
    if (!cleanedApiKey) {
      return new Response(
        JSON.stringify({ error: 'NO_API_KEY: Clé API Gemini requise. Configurez votre propre clé dans Paramètres > Clés API.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    activeApiKey = cleanedApiKey;
    console.log(`Using USER API key for step ${step} (length=${cleanedApiKey.length}, prefix=${cleanedApiKey.substring(0, 4)})`);

    if (!title) {
      return new Response(
        JSON.stringify({ error: 'Title is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const charactersContext = characters.length > 0
      ? `\n\nPERSONNAGES DU LIVRE (OBLIGATOIRES À UTILISER) :\n${characters.map((c: any) => `- ${c.name} (${c.role || 'personnage'}): ${c.description}`).join('\n')}`
      : '';

    const fullTitle = subtitle ? `${title} : ${subtitle}` : title;
    const introContext = bookIntroduction ? `\nVISION DE L'AUTEUR : ${bookIntroduction}` : '';
    const bookContext = `
TITRE COMPLET : "${fullTitle}"
CATÉGORIE : ${category || 'Non spécifiée'}
AUTEUR : ${authorName}
CHAPITRES PRÉVUS : ${numberOfChapters}${introContext}${charactersContext}
`.trim();

    console.log(`Step ${step} for: "${fullTitle}" (Category: ${category}, Characters: ${characters.length})`);

    const wordsPerChapter = DEFAULT_WORDS_PER_CHAPTER;
    let result: any = {};
    let displayContent = '';

    switch (step) {
      case 'P1': {
        // DIRECTEUR ÉDITORIAL PRO — Analyse titre + 5 alternatives + INTRO AUTO
        const { content, qualityScore, attempts } = await callAIWithQualityLoop(
          `Tu es un DIRECTEUR ÉDITORIAL avec 20 ans d'expérience chez Gallimard, Hachette et en auto-édition Amazon KDP. Tu as lancé plus de 200 best-sellers.

MISSION CRITIQUE : 
1. Analyser le titre proposé comme un vrai éditeur professionnel
2. Donner un SCORE KDP IMPITOYABLE au titre original (0-100)
3. Proposer 5 TITRES ALTERNATIFS best-seller avec sous-titres et scores
4. Fournir ta vision éditoriale stratégique
5. GÉNÉRER UNE INTRODUCTION PROFESSIONNELLE adaptée au titre et au genre

CRITÈRES DE NOTATION DES TITRES (score sur 100) :
- Impact émotionnel & curiosité (20 pts)
- Mots-clés recherchables Amazon (20 pts)
- Clarté de la promesse (20 pts)
- Mémorabilité & branding (15 pts)
- Format KDP optimal (15 pts)
- Différenciation concurrentielle (10 pts)

RÈGLES TITRES BEST-SELLER :
- TITRE court (2-5 mots), percutant, brandable
- SOUS-TITRE avec promesse + mots-clés (5-15 mots)
- Exemples réels : "Atomic Habits : Tiny Changes, Remarkable Results" (score 95)
- Score ≥ 85 = potentiel best-seller. < 70 = titre à refaire.

INTRODUCTION DU LIVRE :
L'intro doit accrocher dès la première phrase. Pas de banalité.
- Phrase d'ouverture percutante (question provocante, statistique choquante, ou anecdote)
- Présentation du problème que le livre résout
- Promesse claire de transformation pour le lecteur
- Ton adapté au genre et à la catégorie
- 300-500 mots, style professionnel

Sois BRUTAL et HONNÊTE.`,
          `Analyse ce projet et JUGE son titre :

${bookContext}

ÉTAPE 1 — ÉVALUATION DU TITRE ORIGINAL :
Analyse "${fullTitle}" dans la catégorie "${category}".
Score-le selon les 6 critères (total /100).

ÉTAPE 2 — 5 TITRES BEST-SELLER ALTERNATIFS :
Propose 5 titres avec sous-titres qui obtiendraient ≥ 85/100.
Angles différents : émotionnel, pratique, mystérieux, autoritaire, provocateur.

ÉTAPE 3 — INTRODUCTION PROFESSIONNELLE :
Rédige une intro de 300-500 mots adaptée au titre et à la catégorie "${category}".

ÉTAPE 4 — CONCLUSION PROFESSIONNELLE :
Rédige une conclusion de 200-400 mots qui clôt le livre avec impact.

Réponds en JSON :
{
  "titreOriginal": {
    "titre": "${title}",
    "sousTitre": "${subtitle || 'Aucun'}",
    "scoreTotal": 72,
    "details": {
      "impactEmotionnel": 15,
      "motsClesAmazon": 12,
      "clartePromesse": 16,
      "memorabilite": 10,
      "formatKDP": 10,
      "differenciation": 9
    },
    "forces": ["force 1", "force 2"],
    "faiblesses": ["faiblesse 1", "faiblesse 2"],
    "verdict": "Analyse franche en 2 phrases"
  },
  "titresAlternatifs": [
    {
      "titre": "Titre Court",
      "sousTitre": "Sous-titre optimisé avec promesse et mots-clés",
      "scoreTotal": 90,
      "angle": "émotionnel|pratique|mystérieux|autoritaire|provocateur",
      "justification": "Pourquoi ce titre va performer (2 phrases)"
    }
  ],
  "meilleurChoix": {
    "index": 0,
    "explication": "Pourquoi ce titre est le meilleur choix"
  },
  "introductionGeneree": "L'introduction complète du livre (300-500 mots). Accroche dès la première phrase...",
  "conclusionGeneree": "La conclusion complète du livre (200-400 mots). Synthèse puissante...",
  "descriptionGeneree": "Description de 2-3 phrases du livre",
  "promesseCentrale": "la promesse unique",
  "angleUnique": "ce qui le différencie",
  "lecteurCible": "profil précis du lecteur idéal",
  "tonEditorial": "le ton recommandé",
  "forcesProjet": ["force1", "force2", "force3"],
  "risques": ["risque1", "risque2"],
  "recommandation": "ton avis franc de professionnel",
  "qualityScore": 9
}`,
          5000,
          9, 2, 'P1'
        );
        result = parseJSON(content) || { raw: content };
        result._qualityScore = qualityScore;
        result._attempts = attempts;
        
        // Construire l'affichage riche
        const to = result.titreOriginal;
        const alts = result.titresAlternatifs || [];
        const best = result.meilleurChoix;
        
        let titreSection = '';
        if (to) {
          const scoreEmoji = to.scoreTotal >= 85 ? '🟢' : to.scoreTotal >= 70 ? '🟡' : '🔴';
          titreSection = `## 📊 Analyse du titre original\n\n**"${to.titre}"** ${to.sousTitre !== 'Aucun' ? `— ${to.sousTitre}` : ''}\n\n${scoreEmoji} **Score : ${to.scoreTotal}/100**\n\n`;
          if (to.details) {
            titreSection += `| Critère | Score |\n|---|---|\n| Impact émotionnel | ${to.details.impactEmotionnel}/20 |\n| Mots-clés Amazon | ${to.details.motsClesAmazon}/20 |\n| Clarté promesse | ${to.details.clartePromesse}/20 |\n| Mémorabilité | ${to.details.memorabilite}/15 |\n| Format KDP | ${to.details.formatKDP}/15 |\n| Différenciation | ${to.details.differenciation}/10 |\n\n`;
          }
          if (to.forces) titreSection += `**✅ Forces :** ${to.forces.join(' • ')}\n`;
          if (to.faiblesses) titreSection += `**⚠️ Faiblesses :** ${to.faiblesses.join(' • ')}\n`;
          if (to.verdict) titreSection += `\n**💬 Verdict :** ${to.verdict}\n`;
        }
        
        let altSection = '';
        if (alts.length > 0) {
          altSection = `\n\n## 🏆 5 Titres Best-Seller Alternatifs\n\n`;
          alts.forEach((alt: any, i: number) => {
            const isBest = best && best.index === i;
            const medal = isBest ? '👑 ' : '';
            const scoreEmoji = alt.scoreTotal >= 90 ? '🟢' : alt.scoreTotal >= 80 ? '🟡' : '🔴';
            altSection += `${medal}**${i + 1}. "${alt.titre}" : ${alt.sousTitre}**\n${scoreEmoji} Score : **${alt.scoreTotal}/100** | Angle : _${alt.angle}_\n_${alt.justification}_\n\n`;
          });
          if (best) altSection += `\n**👑 Recommandation :** ${best.explication}\n`;
        }

        // Section introduction générée
        let introSection = '';
        if (result.introductionGeneree) {
          introSection = `\n\n---\n\n## 📝 Introduction Générée\n\n${result.introductionGeneree}\n`;
        }

        // Section conclusion générée
        let conclusionSection = '';
        if (result.conclusionGeneree) {
          conclusionSection = `\n\n## 🎯 Conclusion Générée\n\n${result.conclusionGeneree}\n`;
        }

        const qualityBadge = `\n\n---\n🎯 **Score qualité éditorial : ${qualityScore}/10** (${attempts} passage${attempts > 1 ? 's' : ''})`;
        
        displayContent = titreSection + altSection + introSection + conclusionSection +
          `\n\n---\n\n## 📖 Vision Éditoriale\n\n**Description :** ${result.descriptionGeneree || ''}\n\n**Promesse centrale :** ${result.promesseCentrale || ''}\n\n**Angle unique :** ${result.angleUnique || ''}\n\n**Lecteur cible :** ${result.lecteurCible || ''}\n\n**Ton éditorial :** ${result.tonEditorial || ''}\n\n**Recommandation :** ${result.recommandation || ''}` + qualityBadge;
        
        console.log(`Step P1 completed - Quality: ${qualityScore}/10, Attempts: ${attempts}`);
        break;
      }

      case 'P2': {
        // ANALYSE DE MARCHÉ PRO + 7 MOTS-CLÉS KDP
        const { content, qualityScore, attempts } = await callAIWithQualityLoop(
          `Tu es un CONSULTANT en stratégie éditoriale Amazon KDP, ex-analyste chez Nielsen BookScan. Tu analyses les tendances de marché avec des données concrètes. Pas de généralités, que du spécifique.`,
          `Analyse le marché pour ce livre et génère 7 mots-clés KDP ULTRA-PERFORMANTS :

${bookContext}
VISION ÉDITORIALE P1 : ${JSON.stringify(previousContext.P1 || {})}

MISSION — ANALYSE DE MARCHÉ PROFESSIONNELLE :

1. NICHE EXACTE : Identifie la micro-niche KDP précise (pas juste "développement personnel")
2. CONCURRENCE : Cite 3 livres concurrents réels dans cette niche
3. POSITIONNEMENT : Comment se différencier des concurrents
4. 7 MOTS-CLÉS STRATÉGIQUES : Chaque mot-clé doit correspondre à une vraie recherche Amazon
5. CATÉGORIES CACHÉES : Les catégories Amazon moins évidentes mais pertinentes
6. STRATÉGIE DE PRIX : Prix optimal avec justification basée sur la concurrence

CONTRAINTES :
- Mots-clés cohérents avec la catégorie "${category}"
- Pas de répétition exacte du titre
- Chaque mot-clé = une intention de recherche réelle

Format JSON :
{
  "nichePrincipale": "micro-niche KDP précise",
  "tailleMarche": "estimation avec chiffres",
  "concurrenceNiveau": "faible/moyenne/forte",
  "concurrentsDirects": [
    {"titre": "Titre concurrent", "forces": "ce qu'il fait bien", "faiblesses": "ses lacunes"}
  ],
  "opportunite": "l'angle inexploité par la concurrence",
  "motsClésKDP": ["7 mots-clés classés du plus stratégique au plus secondaire"],
  "justificationMotsCles": ["justification détaillée pour chaque mot-clé"],
  "categoriesKDP": ["2 catégories Amazon principales recommandées"],
  "categoriesSecondaires": ["3 catégories cachées potentielles"],
  "prixOptimal": "prix suggéré avec justification basée sur la concurrence",
  "potentielVentes": "estimation réaliste mensuelle",
  "strategieLancement": "3 actions concrètes pour le lancement",
  "qualityScore": 9
}`,
          4000, 9, 1, 'P2'
        );
        result = parseJSON(content) || { raw: content };
        result._qualityScore = qualityScore;
        result._attempts = attempts;
        
        const concurrents = result.concurrentsDirects || [];
        const concurrentsDisplay = concurrents.length > 0
          ? `\n\n**📚 Concurrents directs :**\n${concurrents.map((c: any) => `• _${c.titre}_ — Forces: ${c.forces} | Faiblesses: ${c.faiblesses}`).join('\n')}`
          : '';
        
        const qualityBadge = `\n\n🎯 **Score qualité : ${qualityScore}/10** (${attempts} passage${attempts > 1 ? 's' : ''})`;
        
        displayContent = result.nichePrincipale
          ? `**Niche :** ${result.nichePrincipale}\n\n**Concurrence :** ${result.concurrenceNiveau}\n\n**Opportunité :** ${result.opportunite}${concurrentsDisplay}\n\n**Prix optimal :** ${result.prixOptimal}\n\n**🔑 7 Mots-clés KDP stratégiques :**\n${(result.motsClésKDP || []).map((kw: string, i: number) => `${i + 1}. **${kw}** — _${(result.justificationMotsCles || [])[i] || ''}_`).join('\n')}\n\n**Catégories :** ${(result.categoriesKDP || []).join(', ')}\n**Catégories secondaires :** ${(result.categoriesSecondaires || []).join(', ')}\n\n**🚀 Stratégie lancement :** ${result.strategieLancement || ''}` + qualityBadge
          : content;
        break;
      }

      case 'P3': {
        // ARCHITECTE DE CONTENU PRO
        const totalWords = numberOfChapters * wordsPerChapter;
        const estimatedPages = Math.ceil(totalWords / 250);
        const p3Settings = getP3GenerationSettings(numberOfChapters);
        const descriptionGeneree = previousContext.P1?.descriptionGeneree || '';
        const introductionGeneree = previousContext.P1?.introductionGeneree || '';
        const conclusionGeneree = previousContext.P1?.conclusionGeneree || '';
        
        console.log(`Step P3: Structuring ${numberOfChapters} chapters for "${fullTitle}"`);
        console.log(`P3 settings → largeProject=${p3Settings.isLargeProject}, maxTokens=${p3Settings.maxTokens}, retries=${p3Settings.maxRetries}`);
        
        const { content, qualityScore, attempts } = await callAIWithQualityLoop(
          `Tu es un ARCHITECTE DE CONTENU expert, spécialisé dans les best-sellers Amazon KDP. Tu structures des livres qui se vendent.
          
STRUCTURE KDP PROFESSIONNELLE (dans cet ordre) :
1. PAGE DE TITRE
2. PRÉFACE (pourquoi ce livre existe)
3. TABLE DES MATIÈRES
4. INTRODUCTION (déjà pré-générée, à intégrer)
5. CHAPITRES PRINCIPAUX (progression logique impeccable)
6. BLOCS PRATIQUES (checklist, FAQ, études de cas)
7. CONCLUSION (déjà pré-générée, à intégrer)
8. À PROPOS DE L'AUTEUR
9. ANNEXES

QUALITÉ DE STRUCTURE :
- Chaque chapitre a un OBJECTIF CLAIR et MESURABLE
- Progression pédagogique : du simple au complexe
- Pas de redondance entre chapitres
- Chaque chapitre amène naturellement au suivant
- Sous-sections variées : concepts + exemples + exercices

RÈGLE DE CONCISION ABSOLUE :
- Retourne un JSON compact, sans texte hors JSON
- Chaque champ textuel = 1 phrase utile maximum quand c'est possible
- Pas de paragraphes longs dans les descriptions`,
          `Structure ce livre selon les normes KDP PRO en ${numberOfChapters} chapitres ET crée les personnages :
${bookContext}
DESCRIPTION : ${descriptionGeneree}
INTRODUCTION PRÉ-GÉNÉRÉE : ${introductionGeneree ? 'OUI (sera intégrée automatiquement)' : 'NON'}
CONCLUSION PRÉ-GÉNÉRÉE : ${conclusionGeneree ? 'OUI (sera intégrée automatiquement)' : 'NON'}
VISION P1 : ${JSON.stringify(previousContext.P1 || {})}
MARCHÉ P2 : ${JSON.stringify(previousContext.P2 || {})}

OBJECTIF : ~${totalWords} mots total (~${estimatedPages} pages)
Chaque chapitre ~${wordsPerChapter} mots avec ${p3Settings.sousSectionsRange} sous-sections.

MISSION PERSONNAGES : Crée 4-6 personnages UNIQUES et COHÉRENTS.

IMPORTANT SI LE PROJET EST LONG :
- Objectif, accroche, lienAvecPrecedent = 1 phrase courte chacun
- pointsCles = ${p3Settings.keyPointsCount} entrées maximum, très courtes
- Description personnage = ${p3Settings.characterDescriptionLength}
- Priorité à la structure exploitable, pas aux développements verbeux

Format JSON :
{
  "structureGlobale": "description de l'arc narratif/pédagogique",
  "nombrePagesEstime": ${estimatedPages},
  "nombreMotsEstime": ${totalWords},
  "introduction": {
    "titre": "Introduction",
    "accroche": "Phrase d'ouverture captivante",
    "promesse": "Ce que le lecteur va obtenir",
    "elements": ["élément clé 1", "élément clé 2", "élément clé 3"]
  },
  "personnages": [
    {
      "name": "Nom du personnage",
      "role": "protagoniste/antagoniste/secondaire/mentor",
      "description": "Description physique et psychologique (${p3Settings.characterDescriptionLength})",
      "arc": "Son évolution"
    }
  ],
  "chapitres": [
    {
      "numero": 1,
      "titre": "Titre accrocheur du chapitre",
      "objectif": "Ce que le lecteur maîtrisera après ce chapitre",
      "nombreMotsPrevu": ${wordsPerChapter},
      "sousSections": ["sous-section 1", "sous-section 2", "sous-section 3"],
      "pointsCles": ["point1", "point2"],
      "accroche": "Phrase d'ouverture captivante",
      "lienAvecPrecedent": "comment ce chapitre découle du précédent"
    }
  ],
  "blocsPratiques": {
    "checklist": ["Point 1", "Point 2", "Point 3"],
    "faq": [{"question": "?", "reponse": "..."}],
    "etudeDeCas": "Description d'un scénario réaliste",
    "planAction": ["Étape 1", "Étape 2", "Étape 3"]
  },
  "aproposAuteur": {
    "bio": "Bio professionnelle de ${authorName}",
    "expertise": "Domaine d'expertise",
    "contact": "Placeholder"
  },
  "annexes": {
    "titre": "Annexes",
    "ressources": ["Ressource 1", "Ressource 2"],
    "references": ["Référence 1", "Référence 2"]
  },
  "progressionLogique": "explication de pourquoi cet ordre",
  "qualityScore": 9
}`,
          p3Settings.maxTokens,
          p3Settings.minScore,
          p3Settings.maxRetries,
          'P3'
        );
        result = normalizeP3Result(parseJSON(content) || { raw: content }, numberOfChapters, wordsPerChapter);
        result._qualityScore = qualityScore;
        result._attempts = attempts;

        if (result.chapitres.length < numberOfChapters) {
          throw new Error(`P3_STRUCTURE_INCOMPLETE: ${result.chapitres.length}/${numberOfChapters} chapitres exploitables générés.`);
        }
        
        // Intégrer intro/conclusion pré-générées dans le résultat
        if (introductionGeneree && !result.introductionPreGeneree) {
          result.introductionPreGeneree = introductionGeneree;
        }
        if (conclusionGeneree && !result.conclusionPreGeneree) {
          result.conclusionPreGeneree = conclusionGeneree;
        }
        
        const personnagesDisplay = result.personnages?.length > 0
          ? `\n\n**🎭 ${result.personnages.length} Personnages créés :**\n${result.personnages.map((p: any) => `- **${p.name}** (${p.role}) : ${p.description}${p.arc ? `\n  _Arc :_ ${p.arc}` : ''}`).join('\n')}`
          : '';

        const qualityBadge = `\n\n🎯 **Score qualité : ${qualityScore}/10** (${attempts} passage${attempts > 1 ? 's' : ''})`;

        if (result.chapitres) {
          const totalMotsPrevu = result.chapitres.reduce((acc: number, ch: any) => acc + (ch.nombreMotsPrevu || wordsPerChapter), 0);
          const pagesEstime = result.nombrePagesEstime || estimatedPages;
          
          const introDisplay = result.introduction
            ? `\n\n**📖 Introduction :** ${result.introduction.promesse}`
            : '';
          
          const blocsPratiquesDisplay = result.blocsPratiques
            ? `\n\n**🛠️ Blocs pratiques :** Checklist (${result.blocsPratiques.checklist?.length || 0} points), FAQ (${result.blocsPratiques.faq?.length || 0} questions), Plan d'action (${result.blocsPratiques.planAction?.length || 0} étapes)`
            : '';
          
          displayContent = `**Structure KDP PRO générée :** ${result.structureGlobale || ''}${introDisplay}${personnagesDisplay}${blocsPratiquesDisplay}\n\n**📖 ~${pagesEstime} pages (~${totalMotsPrevu} mots)**\n\n**${result.chapitres.length} chapitres :**\n\n` +
            result.chapitres.map((ch: any) => `**Ch.${ch.numero} - ${ch.titre}** (~${ch.nombreMotsPrevu || wordsPerChapter} mots)\n_Objectif :_ ${ch.objectif}${ch.lienAvecPrecedent ? `\n_Lien :_ ${ch.lienAvecPrecedent}` : ''}`).join('\n\n') + qualityBadge;
        } else {
          displayContent = `**Structure P3 générée**${personnagesDisplay}` + qualityBadge;
        }
        break;
      }

      case 'P4': {
        // RÉDACTION PRO AVEC BOUCLE QUALITÉ
        const structure = previousContext.P3?.chapitres || [];
        const p4Settings = getP4GenerationSettings(structure.length || numberOfChapters);
        const useSegmentedMode = p4Settings.segmentCount > 1;
        const descriptionGeneree = previousContext.P1?.descriptionGeneree || '';
        const tonEditorial = previousContext.P1?.tonEditorial || '';
        const lecteurCible = previousContext.P1?.lecteurCible || '';
        const structureGlobale = previousContext.P3?.structureGlobale || '';

        const personnagesP3 = previousContext.P3?.personnages || [];
        const personnagesAUtiliser = personnagesP3.length > 0 ? personnagesP3 : characters;

        const personnagesSection = personnagesAUtiliser.length > 0
          ? `\n\nPERSONNAGES (à utiliser OBLIGATOIREMENT) :\n${personnagesAUtiliser.map((c: any) => `- ${c.name} (${c.role}): ${c.description}${c.arc ? ` | Arc: ${c.arc}` : ''}`).join('\n')}`
          : '';

        const planComplet = useSegmentedMode
          ? structure.map((ch: any) => `Ch.${ch.numero}: ${cleanGeneratedText(ch.titre || '').slice(0, 70)}`).join(' | ')
          : structure.map((ch: any) => `Ch.${ch.numero}: ${ch.titre} — ${ch.objectif || ''}`).join('\n');
        const chapitresDejaGeneres = previousContext.P4?.chapitres || [];

        if (chapter) {
          const chapitre = chapter?.titre ? chapter : structure.find((c: any) => c.numero === chapter.numero) || chapter;
          const totalParts = Math.max(1, Number(chapterSegment?.totalParts) || 1);
          const partNumber = Math.min(totalParts, Math.max(1, Number(chapterSegment?.partNumber) || 1));
          const segmentSections = Array.isArray(chapterSegment?.sectionTitles)
            ? chapterSegment.sectionTitles.map((item: any) => cleanGeneratedText(String(item))).filter(Boolean)
            : [];
          const previousParts = Array.isArray(chapterSegment?.previousParts) ? chapterSegment.previousParts : [];
          const segmentMinWords = totalParts > 1 ? Math.max(450, Math.floor(p4Settings.minWords / totalParts)) : p4Settings.minWords;
          const segmentTargetWords = totalParts > 1 ? Math.max(650, Math.floor(p4Settings.targetWords / totalParts)) : p4Settings.targetWords;
          const segmentMaxWords = totalParts > 1 ? Math.max(850, Math.floor(p4Settings.maxWords / totalParts)) : p4Settings.maxWords;

          if (!chapitre?.numero || !chapitre?.titre) {
            return new Response(
              JSON.stringify({ error: 'Invalid chapter payload for P4' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          let resumeChapitresPrecedents = '';
          if (chapitresDejaGeneres.length > 0) {
            const resumesList = chapitresDejaGeneres
              .filter((ch: any) => ch.numero < chapitre.numero)
              .sort((a: any, b: any) => a.numero - b.numero)
              .slice(useSegmentedMode ? -2 : -3)
              .map((ch: any) => `Ch.${ch.numero} "${ch.titre}": ${(ch.contenu || '').substring(0, p4Settings.previousChapterChars)}...`);
            if (resumesList.length > 0) {
              resumeChapitresPrecedents = `\n\nCHAPITRES PRÉCÉDENTS (continuité narrative) :\n${resumesList.join('\n\n')}`;
            }
          }

          const previousPartsSection = previousParts.length > 0
            ? `\n\nSEGMENTS DÉJÀ RÉDIGÉS POUR CE CHAPITRE :\n${previousParts.map((part: any) => `Segment ${part.partNumber}/${totalParts}: ${(part.contenu || '').substring(0, 220)}...`).join('\n\n')}`
            : '';

          const chapSuivant = structure.find((c: any) => c.numero === chapitre.numero + 1);
          const transitionVers = chapSuivant ? `\nTRANSITION : Amène naturellement vers "${chapSuivant.titre}".` : '\nDERNIER CHAPITRE : Conclusion forte.';
          const segmentTransition = totalParts > 1
            ? (partNumber < totalParts
                ? `\nFIN DU SEGMENT : termine avec une transition immédiate vers le segment ${partNumber + 1}/${totalParts}, sans conclure tout le chapitre.`
                : transitionVers)
            : transitionVers;
          const segmentSectionsText = (segmentSections.length > 0 ? segmentSections : (chapitre.sousSections || []))
            .join(', ');
          const p4SystemPrompt = totalParts > 1
            ? `Tu es un AUTEUR-ÉDITEUR expert du genre "${category}". Tu rédiges un segment de chapitre dense, fluide et crédible.

RÈGLES STRICTES :
- Respect absolu de la continuité narrative et des personnages
- Aucune redite, aucun remplissage, aucun méta-discours
- Style vivant, concret, immersif
- Si ce n'est pas le dernier segment, ne conclus pas le chapitre
- Retourne uniquement un JSON valide${personnagesSection}`
            : `Tu es un AUTEUR BEST-SELLER avec 20 ans d'expérience. Tu rédiges des chapitres EXCEPTIONNELS dans le genre "${category}".

EXIGENCES QUALITÉ PUBLICATION PROFESSIONNELLE :
- Chaque paragraphe doit être INDISPENSABLE (zéro remplissage, zéro redondance)
- Phrases d'ouverture percutantes pour chaque section
- Exemples concrets et vérifiables
- Dialogues naturels, crédibles, jamais explicatifs
- Rythme varié : tension → relâchement → insight → cliffhanger
- Transitions fluides entre sous-sections
- Le lecteur ne doit JAMAIS s'ennuyer

ANTI-RÉPÉTITIONS (CRITIQUE) :
- JAMAIS répéter une idée déjà exprimée dans un chapitre précédent
- JAMAIS réintroduire un personnage déjà présenté (juste mentionner son nom)
- JAMAIS utiliser deux fois la même tournure de phrase dans le chapitre
- Varier systématiquement le vocabulaire : pas de mot-clé utilisé > 3 fois
- Pas de résumés redondants du contenu précédent

COHÉRENCE NARRATIVE STRICTE :
- Vérifier les arcs personnages : pas de contradiction avec chapitres précédents
- Un personnage secondaire introduit DOIT réapparaître ou être justifié
- Temps narratifs cohérents (ne pas basculer entre passé et présent)
- Les traits de caractère restent constants sauf évolution explicite
- Les lieux et contextes restent fidèles aux descriptions établies

TENSION & RYTHME (THRILLER/ENGAGEMENT) :
- Chaque chapitre se termine par un micro-cliffhanger ou une question ouverte
- Alterner chapitres de tension et chapitres de développement
- Crescendo d'enjeux progressif
- Éviter les résolutions trop faciles
- Les révélations arrivent au bon moment, pas trop tôt

STYLE PROFESSIONNEL :
- Pas de "Il est important de noter", "Comme nous l'avons vu", "Dans ce chapitre"
- Phrases courtes percutantes alternées avec développements fluides
- Montrer (show) au lieu d'expliquer (tell)
- Supprimer tout adverbe inutile (vraiment, absolument, totalement)
- Aucune tournure passive excessive${personnagesSection}`;
          const p4UserPrompt = totalParts > 1
            ? `Rédige uniquement le SEGMENT ${partNumber}/${totalParts} du chapitre, en ${segmentMinWords}-${segmentMaxWords} mots :

LIVRE : "${fullTitle}"
CATÉGORIE : ${category}
DESCRIPTION : ${descriptionGeneree}
LECTEUR CIBLE : ${lecteurCible}
ARC GLOBAL : ${structureGlobale}
PLAN GLOBAL (compact) : ${planComplet}
${resumeChapitresPrecedents}${previousPartsSection}${personnagesSection}

CHAPITRE ${chapitre.numero}/${structure.length} : "${chapitre.titre}"
OBJECTIF : ${chapitre.objectif || ''}
SOUS-SECTIONS DE CE SEGMENT : ${segmentSectionsText}
ACCROCHE : ${chapitre.accroche || ''}
${segmentTransition}

Retourne en JSON :
{
  "numero": ${chapitre.numero},
  "titre": "${chapitre.titre}",
  "contenu": "LE CONTENU COMPLET DU SEGMENT ${partNumber}/${totalParts}",
  "nombreMots": ${segmentTargetWords},
  "partNumber": ${partNumber},
  "totalParts": ${totalParts},
  "qualityScore": 8
}`
            : `Rédige le CHAPITRE COMPLET (${p4Settings.minWords}-${p4Settings.maxWords} mots, qualité best-seller) :

LIVRE : "${fullTitle}"
CATÉGORIE : ${category}
DESCRIPTION : ${descriptionGeneree}
LECTEUR CIBLE : ${lecteurCible}
ARC GLOBAL : ${structureGlobale}
PLAN : ${planComplet}
${resumeChapitresPrecedents}${personnagesSection}

CHAPITRE ${chapitre.numero}/${structure.length} : "${chapitre.titre}"
OBJECTIF : ${chapitre.objectif || ''}
SOUS-SECTIONS : ${(chapitre.sousSections || []).join(', ')}
POINTS CLÉS : ${(chapitre.pointsCles || []).join(', ')}
ACCROCHE : ${chapitre.accroche || ''}
${transitionVers}

Retourne en JSON :
{
  "numero": ${chapitre.numero},
  "titre": "${chapitre.titre}",
  "contenu": "LE CONTENU COMPLET (${p4Settings.minWords}-${p4Settings.maxWords} mots)",
  "nombreMots": ${p4Settings.targetWords},
  "qualityScore": 9
}`;

          // Boucle qualité pour chaque chapitre
          const { content: chapterContent, qualityScore, attempts } = await callAIWithQualityLoop(
            p4SystemPrompt,
            p4UserPrompt,
            p4Settings.maxTokens,
            p4Settings.minScore,
            p4Settings.maxRetries,
            totalParts > 1 ? `P4-Ch${chapitre.numero}-Part${partNumber}` : `P4-Ch${chapitre.numero}`
          );

          const parsedChapter = parseJSON(chapterContent);
          const chapitreGenere = cleanChapter(parsedChapter || {
            numero: chapitre.numero,
            titre: chapitre.titre,
            contenu: chapterContent,
            nombreMots: chapterContent.split(/\s+/).length,
          });

          result = totalParts > 1
            ? {
                chapitrePart: {
                  ...chapitreGenere,
                  partNumber,
                  totalParts,
                },
                numero: chapitreGenere.numero,
                titre: chapitreGenere.titre,
                nombreMots: chapitreGenere.nombreMots,
                _qualityScore: qualityScore,
                _attempts: attempts,
              }
            : {
                chapitre: chapitreGenere,
                numero: chapitreGenere.numero,
                titre: chapitreGenere.titre,
                nombreMots: chapitreGenere.nombreMots,
                _qualityScore: qualityScore,
                _attempts: attempts,
              };

          displayContent = totalParts > 1
            ? `**Ch.${chapitreGenere.numero} - ${chapitreGenere.titre} (segment ${partNumber}/${totalParts})** (~${chapitreGenere.nombreMots || segmentTargetWords} mots) 🎯 ${qualityScore}/10\n_${cleanGeneratedText((chapitreGenere.contenu || '').substring(0, 200))}..._`
            : `**Ch.${chapitreGenere.numero} - ${chapitreGenere.titre}** (~${chapitreGenere.nombreMots || p4Settings.targetWords} mots) 🎯 ${qualityScore}/10\n_${cleanGeneratedText((chapitreGenere.contenu || '').substring(0, 200))}..._`;
          break;
        }

        // Mode legacy
        const chapitresComplets: any[] = [];
        for (const chapitre of structure) {
          let resumePrecedents = '';
          if (chapitresComplets.length > 0) {
            const derniers = chapitresComplets.slice(-3);
            resumePrecedents = `\n\nCHAPITRES RÉDIGÉS :\n${derniers.map((ch: any) => `Ch.${ch.numero} "${ch.titre}": ${(ch.contenu || '').substring(0, 300)}...`).join('\n\n')}`;
          }
          const chapSuivant = structure.find((c: any) => c.numero === chapitre.numero + 1);
          const transition = chapSuivant ? `Termine en amenant vers "${chapSuivant.titre}".` : 'Dernier chapitre, conclusion forte.';

          const chapterContent = await callAI(
            `Tu es un AUTEUR BEST-SELLER. Chapitres EXCEPTIONNELS dans "${category}". TON : ${tonEditorial}${personnagesSection}`,
            `LIVRE : "${fullTitle}"\nDESCRIPTION : ${descriptionGeneree}\nPLAN : ${planComplet}${resumePrecedents}${personnagesSection}\n\nCHAPITRE ${chapitre.numero}/${structure.length} : "${chapitre.titre}"\nSOUS-SECTIONS : ${(chapitre.sousSections || []).join(', ')}\n${transition}\n\nJSON :\n{"numero": ${chapitre.numero}, "titre": "${chapitre.titre}", "contenu": "...", "nombreMots": 3000}`,
            6000
          );
          const parsed = parseJSON(chapterContent);
          chapitresComplets.push(cleanChapter(parsed || {
            numero: chapitre.numero,
            titre: chapitre.titre,
            contenu: chapterContent,
            nombreMots: chapterContent.split(/\s+/).length,
          }));
        }

        const totalMots = chapitresComplets.reduce((acc, ch) => acc + (ch.nombreMots || 3000), 0);
        result = {
          chapitres: chapitresComplets,
          nombreChapitres: chapitresComplets.length,
          nombreMotsTotal: totalMots,
          pagesEstimees: Math.ceil(totalMots / 250),
        };
        displayContent = `**✅ ${chapitresComplets.length} chapitres rédigés** (~${totalMots} mots, ~${result.pagesEstimees} pages)`;
        break;
      }

      case 'P5': {
        const chapitres = previousContext.P4?.chapitres || [];
        const echantillons = chapitres.slice(0, 5).map((ch: any) => 
          `Ch.${ch.numero} "${ch.titre}": ${(ch.contenu || '').substring(0, 500)}`
        ).join('\n\n');
        
        const { content, qualityScore, attempts } = await callAIWithQualityLoop(
          `Tu es un RÉÉCRIVAIN expert. Tu détectes et élimines tout pattern "IA". Tu ajoutes de la vie, des tournures naturelles, du rythme humain.`,
          `Analyse ces extraits et donne des conseils d'humanisation CONCRETS :

EXTRAITS :
${echantillons}

JSON :
{
  "analyseGlobale": "évaluation du ton et de la qualité",
  "pointsForts": ["ce qui fonctionne"],
  "pointsAHumaniser": ["élément à améliorer"],
  "exemplesReformulation": [{"avant": "phrase originale", "apres": "version humanisée"}],
  "conseilsStyle": ["conseil 1", "conseil 2"],
  "scoreHumanite": 8,
  "qualityScore": 9
}`,
          4000, 9, 1, 'P5'
        );
        
        result = parseJSON(content) || { raw: content };
        result.chapitresFinal = chapitres;
        result._qualityScore = qualityScore;
        
        const qualityBadge = `\n\n🎯 **Score qualité : ${qualityScore}/10**`;
        displayContent = result.analyseGlobale
          ? `**Analyse d'humanisation :**\n\n${result.analyseGlobale}\n\n**Score d'humanité : ${result.scoreHumanite || '?'}/10**\n\n**Points forts :**\n${(result.pointsForts || []).map((p: string) => `✓ ${p}`).join('\n')}\n\n**Points à améliorer :**\n${(result.pointsAHumaniser || []).map((p: string) => `• ${p}`).join('\n')}\n\n**Conseils de style :**\n${(result.conseilsStyle || []).map((c: string) => `→ ${c}`).join('\n')}` + qualityBadge
          : 'Analyse d\'humanisation effectuée';
        break;
      }

      case 'P6': {
        const { content, qualityScore } = await callAIWithQualityLoop(
          `Tu es un CORRECTEUR-ÉDITEUR de maison d'édition. Exigeant, méthodique. Tu vérifies tout : grammaire, cohérence, style, rythme. Chaque faiblesse est identifiée avec une solution.`,
          `Analyse la qualité éditoriale COMPLÈTE :
TITRE : "${title}"
VISION : ${JSON.stringify(previousContext.P1 || {})}
CHAPITRES : ${(previousContext.P4?.chapitres || []).length}
STRUCTURE : ${JSON.stringify(previousContext.P3 || {})}

JSON :
{
  "scoreGlobal": 8,
  "grammaire": { "score": 9, "remarques": "détails" },
  "coherence": { "score": 8, "remarques": "détails" },
  "style": { "score": 8, "remarques": "détails" },
  "structure": { "score": 9, "remarques": "détails" },
  "rythme": { "score": 8, "remarques": "détails" },
  "originalite": { "score": 7, "remarques": "détails" },
  "correctionsEffectuees": ["correction1"],
  "recommandations": ["reco1"],
  "qualityScore": 9
}`,
          4000, 9, 1, 'P6'
        );
        result = parseJSON(content) || { raw: content };
        result._qualityScore = qualityScore;
        displayContent = result.scoreGlobal
          ? `**Score global : ${result.scoreGlobal}/10**\n\n` +
            `📝 Grammaire : ${result.grammaire?.score}/10 — _${result.grammaire?.remarques || ''}_\n` +
            `🔗 Cohérence : ${result.coherence?.score}/10 — _${result.coherence?.remarques || ''}_\n` +
            `✨ Style : ${result.style?.score}/10 — _${result.style?.remarques || ''}_\n` +
            `📐 Structure : ${result.structure?.score}/10 — _${result.structure?.remarques || ''}_\n` +
            `🎵 Rythme : ${result.rythme?.score || '?'}/10 — _${result.rythme?.remarques || ''}_\n` +
            `💡 Originalité : ${result.originalite?.score || '?'}/10 — _${result.originalite?.remarques || ''}_\n\n` +
            `**Recommandations :**\n${(result.recommandations || []).map((r: string) => `• ${r}`).join('\n')}\n\n🎯 **Qualité : ${qualityScore}/10**`
          : content;
        break;
      }

      case 'P7': {
        const { content, qualityScore } = await callAIWithQualityLoop(
          `Tu es un COPYWRITER KDP expert. Tu crées des descriptions qui VENDENT. Chaque mot est choisi pour convertir un visiteur en acheteur.`,
          `Crée le packaging marketing BEST-SELLER :
TITRE : "${title}"
AUTEUR : ${authorName}
MARCHÉ : ${JSON.stringify(previousContext.P2 || {})}
VISION : ${JSON.stringify(previousContext.P1 || {})}

JSON :
{
  "sousTitre": "sous-titre SEO + émotionnel",
  "descriptionKDP": "description de 150 mots qui VEND (formule AIDA)",
  "bulletPoints": ["5 bénéfices clés (pas des features, des BÉNÉFICES)"],
  "accroche4emeCouverture": "phrase d'accroche 4e couverture",
  "biographieAuteur": "bio crédible de ${authorName}",
  "motsClésOptimises": ["7 mots-clés KDP finaux"],
  "qualityScore": 9
}`,
          4000, 9, 1, 'P7'
        );
        result = parseJSON(content) || { raw: content };
        result._qualityScore = qualityScore;
        displayContent = result.sousTitre
          ? `**Sous-titre :** ${result.sousTitre}\n\n**Accroche :** ${result.accroche4emeCouverture}\n\n**Description KDP :**\n${result.descriptionKDP}\n\n**Points forts :**\n${(result.bulletPoints || []).map((b: string) => `✓ ${b}`).join('\n')}\n\n🎯 **Qualité : ${qualityScore}/10**`
          : content;
        break;
      }

      case 'P8': {
        const { content, qualityScore } = await callAIWithQualityLoop(
          `Tu es un DIAGNOSTIQUEUR ÉDITORIAL senior. Tu cherches les failles avec une précision chirurgicale. Chaque problème identifié est accompagné d'une solution.`,
          `Diagnostic COMPLET du projet :
TITRE : "${title}"
VISION P1 : ${JSON.stringify(previousContext.P1 || {})}
MARCHÉ P2 : ${JSON.stringify(previousContext.P2 || {})}
STRUCTURE P3 : ${JSON.stringify(previousContext.P3 || {})}
QUALITÉ P6 : ${JSON.stringify(previousContext.P6 || {})}

JSON :
{
  "coherenceGlobale": 9,
  "alignementVisionContenu": "analyse détaillée",
  "pointsForts": ["force1", "force2", "force3"],
  "incoherencesDetectees": ["incohérence ou 'Aucune'"],
  "correctionsSuggérées": [{"probleme": "...", "solution": "..."}],
  "verdict": "verdict clair",
  "qualityScore": 9
}`,
          4000, 9, 1, 'P8'
        );
        result = parseJSON(content) || { raw: content };
        result._qualityScore = qualityScore;
        const pointsForts = Array.isArray(result.pointsForts) ? result.pointsForts : [];
        const incoherences = Array.isArray(result.incoherencesDetectees) ? result.incoherencesDetectees : (typeof result.incoherencesDetectees === 'string' ? [result.incoherencesDetectees] : ['Aucune']);
        displayContent = result.coherenceGlobale
          ? `**Cohérence globale : ${result.coherenceGlobale}/10**\n\n**${result.verdict}**\n\n**Points forts :**\n${pointsForts.map((p: string) => `✓ ${p}`).join('\n')}\n\n**Incohérences :**\n${incoherences.map((i: string) => `• ${i}`).join('\n')}\n\n🎯 **Qualité : ${qualityScore}/10**`
          : content;
        break;
      }

      case 'P9': {
        const content = await callAI(
          `Tu es un expert en IDENTITÉ D'AUTEUR. Tu captures l'essence d'une voix unique pour garantir la cohérence.`,
          `Capture la mémoire éditoriale :
TITRE : "${title}"
AUTEUR : ${authorName}
TON : ${previousContext.P1?.tonEditorial || 'Non défini'}

JSON :
{
  "voixAuteur": "description de la voix unique",
  "ticsDeLangage": ["expressions à utiliser"],
  "expressionsInterdites": ["formules bannies"],
  "niveauLangue": "accessible/soutenu/technique",
  "rythmePhrases": "rythme idéal",
  "personnalité": "traits qui transparaissent",
  "signature": "ce qui rend ce texte reconnaissable"
}`
        );
        result = parseJSON(content) || { raw: content };
        displayContent = result.voixAuteur
          ? `**Voix :** ${result.voixAuteur}\n\n**Niveau :** ${result.niveauLangue}\n\n**Personnalité :** ${result.personnalité}\n\n**Signature :** ${result.signature}\n\n**Expressions bannies :**\n${(result.expressionsInterdites || []).map((e: string) => `✗ ${e}`).join('\n')}`
          : content;
        break;
      }

      case 'P10': {
        const content = await callAI(
          `Tu es un expert en TRANSITIONS NARRATIVES. Tu vérifies que les chapitres s'enchaînent naturellement.`,
          `Analyse les transitions :
STRUCTURE : ${JSON.stringify(previousContext.P3?.chapitres || [])}
MÉMOIRE : ${JSON.stringify(previousContext.P9 || {})}

JSON :
{
  "fluiditeGlobale": 9,
  "transitionsAnalysees": [{"de": 1, "vers": 2, "qualite": "fluide/à améliorer", "suggestion": "..."}],
  "filConducteur": "fil rouge",
  "progressionNarrative": "montée en puissance",
  "recommandations": ["reco1", "reco2"]
}`
        );
        result = parseJSON(content) || { raw: content };
        displayContent = result.fluiditeGlobale
          ? `**Fluidité : ${result.fluiditeGlobale}/10**\n\n**Fil conducteur :** ${result.filConducteur}\n\n**Progression :** ${result.progressionNarrative}\n\n**Recommandations :**\n${(result.recommandations || []).map((r: string) => `• ${r}`).join('\n')}`
          : content;
        break;
      }

      case 'P11': {
        const { content, qualityScore } = await callAIWithQualityLoop(
          `Tu es un CRITIQUE LITTÉRAIRE IMPITOYABLE. Zéro complaisance. Tu identifies TOUTES les faiblesses. Un vrai critique ne flatte jamais.`,
          `Critique ce projet SANS AUCUNE COMPLAISANCE :
TITRE : "${title}"
SCORES P6 : ${JSON.stringify(previousContext.P6 || {})}
DIAGNOSTIC P8 : ${JSON.stringify(previousContext.P8 || {})}

JSON (sois BRUTAL) :
{
  "pointsFaibles": ["faiblesse 1 avec explication détaillée", "faiblesse 2", "faiblesse 3"],
  "risquesCommercials": ["risque 1", "risque 2"],
  "chapitresARetravailler": [{"numero": 1, "raison": "pourquoi", "priorite": "haute/moyenne"}],
  "manquesIdentifies": ["ce qui manque"],
  "critiqueHonnete": "avis FRANC de 3-4 phrases, pas de flatterie",
  "scoreReelEstime": 7,
  "qualityScore": 9
}`,
          4000, 9, 1, 'P11'
        );
        result = parseJSON(content) || { raw: content };
        result._qualityScore = qualityScore;
        displayContent = result.critiqueHonnete
          ? `**Score réel : ${result.scoreReelEstime}/10**\n\n**Critique :**\n${result.critiqueHonnete}\n\n**Faiblesses :**\n${(result.pointsFaibles || []).map((p: string) => `⚠️ ${p}`).join('\n')}\n\n**Risques :**\n${(result.risquesCommercials || []).map((r: string) => `• ${r}`).join('\n')}\n\n🎯 **Qualité critique : ${qualityScore}/10**`
          : content;
        break;
      }

      case 'P12': {
        const { content, qualityScore } = await callAIWithQualityLoop(
          `Tu es un AMÉLIORATEUR DE CONTENU expert. Tu prends les critiques et proposes des solutions CONCRÈTES et APPLICABLES.`,
          `Améliore basé sur la critique :
CRITIQUE P11 : ${JSON.stringify(previousContext.P11 || {})}
STRUCTURE P3 : ${JSON.stringify(previousContext.P3 || {})}

JSON :
{
  "ameliorationsProposees": [
    {"faiblesseCorrigee": "...", "solution": "solution concrète et détaillée", "priorite": "haute/moyenne/basse", "impact": "fort/moyen/faible"}
  ],
  "chapitresAmeliors": [{"numero": 1, "amelioration": "..."}],
  "nouveauScoreEstime": 9,
  "tempsEstimeCorrections": "estimation",
  "qualityScore": 9
}`,
          4000, 9, 1, 'P12'
        );
        result = parseJSON(content) || { raw: content };
        result._qualityScore = qualityScore;
        displayContent = result.ameliorationsProposees
          ? `**Nouveau score : ${result.nouveauScoreEstime}/10**\n\n**Améliorations :**\n\n${result.ameliorationsProposees.map((a: any) => `**[${a.priorite}] [Impact: ${a.impact || '?'}]** ${a.faiblesseCorrigee}\n→ ${a.solution}`).join('\n\n')}\n\n🎯 **Qualité : ${qualityScore}/10**`
          : content;
        break;
      }

      case 'P13': {
        const content = await callAI(
          `Tu es un STYLISTE LITTÉRAIRE. Tu unifie la voix de l'auteur pour créer une signature reconnaissable.`,
          `Signature de style finale :
MÉMOIRE P9 : ${JSON.stringify(previousContext.P9 || {})}
AUTEUR : ${authorName}

JSON :
{
  "signatureUnique": "ce qui rend ce texte unique",
  "elementsRecurrents": ["élément1", "élément2"],
  "tonUnifie": "ton final cohérent",
  "marquesDeStyle": ["marque1", "marque2"],
  "certificatStyle": "Ce texte porte la signature de ${authorName}",
  "coherenceVoix": 9
}`
        );
        result = parseJSON(content) || { raw: content };
        displayContent = result.signatureUnique
          ? `**Signature :** ${result.signatureUnique}\n\n**Ton unifié :** ${result.tonUnifie}\n\n**Cohérence : ${result.coherenceVoix}/10**\n\n**Marques :**\n${(result.marquesDeStyle || []).map((m: string) => `✦ ${m}`).join('\n')}\n\n_${result.certificatStyle}_`
          : content;
        break;
      }

      case 'P14': {
        const { content, qualityScore } = await callAIWithQualityLoop(
          `Tu es le VERDICT FINAL. Éditeur senior avec 25 ans d'expérience. Ton verdict est DÉFINITIF. Sois honnête : ce livre mérite-t-il d'être publié ? Un vrai éditeur ne flatte pas.`,
          `Verdict FINAL et DÉFINITIF :
TITRE : "${title}"
AUTEUR : ${authorName}
QUALITÉ P6 : ${JSON.stringify(previousContext.P6 || {})}
CRITIQUE P11 : ${JSON.stringify(previousContext.P11 || {})}
AMÉLIORATIONS P12 : ${JSON.stringify(previousContext.P12 || {})}
STYLE P13 : ${JSON.stringify(previousContext.P13 || {})}

JSON (VERDICT HONNÊTE) :
{
  "publiable": true,
  "scoreFinal": 9,
  "verdict": "Verdict en 3-4 phrases, HONNÊTE",
  "forcesFinales": ["force1", "force2", "force3"],
  "reservesRestantes": ["réserve ou 'Aucune réserve majeure'"],
  "recommandationFinale": "Publier / Publier après corrections / Retravailler",
  "potentielCommercial": "estimation honnête avec chiffres",
  "noteALAuteur": "message personnel à l'auteur ${authorName}",
  "certificat": "Validé par le système éditorial le ${new Date().toLocaleDateString('fr-FR')}",
  "qualityScore": 9
}`,
          4000, 9, 1, 'P14'
        );
        result = parseJSON(content) || { raw: content };
        result._qualityScore = qualityScore;
        
        const forces = Array.isArray(result.forcesFinales) ? result.forcesFinales : [];
        const reserves = Array.isArray(result.reservesRestantes) ? result.reservesRestantes : 
          (typeof result.reservesRestantes === 'string' ? [result.reservesRestantes] : []);
        
        displayContent = result.verdict
          ? `# VERDICT FINAL\n\n**${result.recommandationFinale}**\n\n**Score final : ${result.scoreFinal}/10**\n\n${result.verdict}\n\n**Forces :**\n${forces.map((f: string) => `✓ ${f}`).join('\n')}\n\n**Réserves :**\n${reserves.map((r: string) => `• ${r}`).join('\n')}\n\n**Potentiel :** ${result.potentielCommercial}\n\n${result.noteALAuteur ? `**📝 Note à ${authorName} :** ${result.noteALAuteur}\n\n` : ''}---\n_${result.certificat}_\n\n🎯 **Qualité verdict : ${qualityScore}/10**`
          : content;
        break;
      }

      case 'P15': {
        const chapitresP5 = previousContext.P5?.chapitresFinal || previousContext.P4?.chapitres || [];
        const chapitresList = Array.isArray(chapitresP5) ? chapitresP5 : [];
        
        if (chapitresList.length === 0) {
          result = { message: "Aucun chapitre à humaniser." };
          displayContent = "⚠️ Aucun chapitre trouvé pour l'humanisation.";
          break;
        }

        const echantillon = chapitresList.slice(0, 3).map((ch: any) => 
          `### ${ch.titre || ch.title || 'Chapitre'}\n${(ch.contenu || ch.content || '').substring(0, 1500)}`
        ).join('\n\n---\n\n');

        const content = await callAI(
          `Tu es un EXPERT EN HUMANISATION DE TEXTE. Mission : rendre le texte INDÉTECTABLE par GPTZero, Originality.ai, Turnitin.

TECHNIQUES :
1. VARIABILITÉ SYNTAXIQUE : phrases courtes et longues alternées
2. IMPERFECTIONS NATURELLES : tournures familières, expressions idiomatiques
3. VOIX ACTIVE prioritaire
4. CONNECTEURS HUMAINS : "D'ailleurs", "Et puis", "Ce qui est intéressant"
5. TOUCHES PERSONNELLES : opinions, anecdotes, questions rhétoriques
6. RYTHME cassé : paragraphes de tailles variées
7. LEXIQUE VARIÉ`,
          `Humanise ces extraits pour les rendre indétectables :

${echantillon}

JSON :
{
  "chapitresHumanises": [{"titre": "...", "contenuHumanise": "texte complet humanisé"}],
  "techniquesAppliquees": ["technique1", "technique2"],
  "scoreAntiDetection": 92,
  "conseilsPourReste": ["conseil1"],
  "avertissement": "note sur les limites"
}`,
          6000
        );
        result = parseJSON(content) || { raw: content };
        
        const score = result.scoreAntiDetection || 90;
        const techniques = Array.isArray(result.techniquesAppliquees) ? result.techniquesAppliquees : [];
        const conseils = Array.isArray(result.conseilsPourReste) ? result.conseilsPourReste : [];
        const nbHumanises = Array.isArray(result.chapitresHumanises) ? result.chapitresHumanises.length : 0;
        
        displayContent = `# 🛡️ HUMANISATION ANTI-IA (BONUS)\n\n**Score anti-détection : ${score}%**\n\n**${nbHumanises} chapitres humanisés**\n\n**Techniques :**\n${techniques.map((t: string) => `✦ ${t}`).join('\n')}\n\n**Conseils :**\n${conseils.map((c: string) => `💡 ${c}`).join('\n')}\n\n${result.avertissement ? `⚠️ _${result.avertissement}_` : ''}`;
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unknown step: ${step}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    console.log(`Step ${step} completed - Total tokens: ${totalTokenUsage.totalTokens}`);

    const estimatedCost = (
      (totalTokenUsage.promptTokens / 1_000_000) * 0.15 +
      (totalTokenUsage.completionTokens / 1_000_000) * 0.60
    );

    return new Response(
      JSON.stringify({ 
        success: true,
        step,
        result,
        displayContent,
        title,
        authorName,
        numberOfChapters,
        tokenUsage: {
          promptTokens: totalTokenUsage.promptTokens,
          completionTokens: totalTokenUsage.completionTokens,
          totalTokens: totalTokenUsage.totalTokens,
          estimatedCost: estimatedCost.toFixed(4)
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Workflow step error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    let status = 500;
    let userMessage = errorMessage;
    
    if (errorMessage.includes('RATE_LIMIT')) {
      status = 429;
      userMessage = 'Limite de requêtes atteinte. Patientez quelques secondes.';
    } else if (errorMessage === 'CREDITS_EXHAUSTED') {
      status = 402;
      userMessage = 'Crédits épuisés. Veuillez recharger.';
    } else if (errorMessage.includes('INVALID_API_KEY')) {
      status = 400;
      userMessage = 'Votre clé Gemini n\'est pas valide. Collez une clé Google AI Studio commençant par AIza dans Paramètres puis relancez le workflow.';
    }

    return new Response(
      JSON.stringify({ error: userMessage }),
      { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
