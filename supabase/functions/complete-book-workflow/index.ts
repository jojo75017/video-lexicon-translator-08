import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// System prompts for each step - HUMAN VOICE, NO ROBOT
const HUMAN_VOICE_RULES = `
RÈGLES ABSOLUES POUR UNE VOIX HUMAINE :
- Tu es un éditeur professionnel expérimenté, pas une IA
- Jamais de langage robotique, générique ou corporate
- Jamais de "dans ce chapitre nous allons explorer..."
- Jamais de flatterie vide ou promesses creuses
- Ton naturel, direct, comme une vraie conversation
- Chaque phrase apporte de la valeur concrète
- Utilise des exemples réels, des anecdotes, du vécu
- Écris comme un auteur humain passionné par son sujet
`;

async function callAI(systemPrompt: string, userPrompt: string, maxTokens = 4000): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  
  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: systemPrompt + HUMAN_VOICE_RULES },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 429) throw new Error('RATE_LIMIT');
    if (status === 402) throw new Error('CREDITS_EXHAUSTED');
    throw new Error(`AI Error: ${status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

function parseJSON(content: string): any {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return null;
  } catch {
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { step, title, authorName, numberOfChapters = 8, previousContext = {} } = await req.json();

    if (!title) {
      return new Response(
        JSON.stringify({ error: 'Title is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Step ${step} for: "${title}"`);

    let result: any = {};
    let displayContent = '';

    switch (step) {
      case 'P1': {
        // DIRECTEUR ÉDITORIAL - Vision stratégique
        const content = await callAI(
          `Tu es un DIRECTEUR ÉDITORIAL avec 20 ans d'expérience. Tu analyses un projet de livre et donnes ta vision stratégique. Sois direct, incisif, comme un vrai pro.`,
          `Analyse ce projet de livre :
TITRE : "${title}"
AUTEUR : ${authorName}
CHAPITRES PRÉVUS : ${numberOfChapters}

Donne ta vision éditoriale en JSON :
{
  "promesseCentrale": "la promesse unique de ce livre pour le lecteur",
  "angleUnique": "ce qui le différencie de la concurrence",
  "lecteurCible": "profil précis du lecteur idéal (qui il est, ses frustrations, ses désirs)",
  "tonEditorial": "le ton recommandé pour ce livre",
  "forcesProjet": ["force1", "force2", "force3"],
  "risques": ["risque1", "risque2"],
  "recommandation": "ton avis franc de professionnel"
}`
        );
        result = parseJSON(content) || { raw: content };
        displayContent = result.promesseCentrale 
          ? `**Promesse centrale :** ${result.promesseCentrale}\n\n**Angle unique :** ${result.angleUnique}\n\n**Lecteur cible :** ${result.lecteurCible}\n\n**Ton éditorial :** ${result.tonEditorial}\n\n**Recommandation :** ${result.recommandation}`
          : content;
        break;
      }

      case 'P2': {
        // ANALYSE DE MARCHÉ + 7 MOTS-CLÉS KDP OPTIMISÉS
        const content = await callAI(
          `Tu es un expert en SEO Amazon KDP et en analyse d'intention de recherche. Tu connais les tendances, les niches rentables, la concurrence. Parle comme un consultant business pragmatique.`,
          `Analyse le marché pour ce livre et génère 7 mots-clés KDP très performants :

TITRE EXACT DE L'EBOOK : "${title}"
VISION ÉDITORIALE : ${JSON.stringify(previousContext.P1 || {})}

MISSION MOTS-CLÉS KDP :
Trouve 7 mots-clés très performants pour Amazon KDP France basés EXCLUSIVEMENT sur le TITRE EXACT.

CONTRAINTES OBLIGATOIRES pour les mots-clés :
- Correspondre à des recherches réelles d'internautes (Amazon + Google)
- Avoir un bon potentiel de visibilité (volume réel + concurrence raisonnable)
- Être strictement cohérents avec le titre et la promesse implicite
- Être adaptés à Amazon KDP (ni trop génériques, ni trop vagues)
- Un seul mot-clé par entrée (pas de phrases longues)
- Pas de répétition exacte du titre
- Pas de hashtags, pas de virgules

OBJECTIF MOTS-CLÉS :
- Maximiser la découvrabilité sur Amazon.fr
- Déclencher des catégories Amazon secondaires (dites "cachées")
- Attirer une audience qualifiée et réellement intéressée

MÉTHODE :
1. Analyse sémantique du titre
2. Identification des intentions de recherche principales et secondaires
3. Sélection de mots-clés orientés problème, solution, action ou bénéfice

Donne ton analyse marché en JSON :
{
  "nichePrincipale": "la niche KDP précise",
  "tailleMarche": "estimation de la taille (grand/moyen/niche)",
  "concurrenceNiveau": "faible/moyenne/forte",
  "opportunite": "l'opportunité identifiée",
  "motsClésKDP": ["7 mots-clés classés du plus stratégique au plus secondaire"],
  "justificationMotsCles": ["justification pour chaque mot-clé"],
  "categoriesKDP": ["2 catégories recommandées"],
  "categoriesSecondaires": ["3 catégories cachées potentielles"],
  "prixOptimal": "prix suggéré avec justification",
  "potentielVentes": "estimation réaliste"
}`
        );
        result = parseJSON(content) || { raw: content };
        displayContent = result.nichePrincipale
          ? `**Niche :** ${result.nichePrincipale}\n\n**Concurrence :** ${result.concurrenceNiveau}\n\n**Opportunité :** ${result.opportunite}\n\n**Prix optimal :** ${result.prixOptimal}\n\n**🔑 7 Mots-clés KDP stratégiques :**\n${(result.motsClésKDP || []).map((kw: string, i: number) => `${i + 1}. ${kw}`).join('\n')}\n\n**Catégories :** ${(result.categoriesKDP || []).join(', ')}\n**Catégories secondaires :** ${(result.categoriesSecondaires || []).join(', ')}`
          : content;
        break;
      }

      case 'P3': {
        // ARCHITECTE DE CONTENU - Structure pour 400+ pages
        const wordsPerChapter = Math.ceil(100000 / numberOfChapters);
        const content = await callAI(
          `Tu es un ARCHITECTE DE CONTENU expert. Tu structures les livres LONGS (400+ pages) pour maximiser l'impact et la rétention du lecteur. Tu penses progression pédagogique, storytelling, points de bascule. Chaque chapitre doit avoir 6-10 sous-sections pour atteindre ${wordsPerChapter} mots.`,
          `Structure ce livre LONG (400+ pages) en ${numberOfChapters} chapitres :
TITRE : "${title}"
VISION : ${JSON.stringify(previousContext.P1 || {})}
MARCHÉ : ${JSON.stringify(previousContext.P2 || {})}

OBJECTIF : 100 000+ mots total (400+ pages)
Chaque chapitre doit avoir ~${wordsPerChapter} mots avec 6-10 sous-sections détaillées.

Crée la structure en JSON :
{
  "structureGlobale": "description de l'arc narratif/pédagogique du livre",
  "nombrePagesEstime": 400,
  "chapitres": [
    {
      "numero": 1,
      "titre": "Titre accrocheur du chapitre",
      "objectif": "Ce que le lecteur maîtrisera après ce chapitre",
      "nombreMotsPrevu": ${wordsPerChapter},
      "sousSections": ["sous-section 1", "sous-section 2", "sous-section 3", "sous-section 4", "sous-section 5", "sous-section 6"],
      "pointsCles": ["point1", "point2", "point3", "point4", "point5"],
      "exercicesPratiques": ["exercice1", "exercice2"],
      "accroche": "Phrase d'ouverture captivante"
    }
  ],
  "progressionLogique": "explication de pourquoi cet ordre"
}`,
          10000
        );
        result = parseJSON(content) || { raw: content };
        if (result.chapitres) {
          const totalMotsPrevu = result.chapitres.reduce((acc: number, ch: any) => acc + (ch.nombreMotsPrevu || wordsPerChapter), 0);
          displayContent = `**Structure globale :** ${result.structureGlobale}\n\n**📖 ${result.nombrePagesEstime || 400}+ pages prévues (~${totalMotsPrevu} mots)**\n\n**${result.chapitres.length} chapitres structurés :**\n\n` +
            result.chapitres.map((ch: any) => `**Ch.${ch.numero} - ${ch.titre}** (~${ch.nombreMotsPrevu || wordsPerChapter} mots, ${(ch.sousSections || []).length} sous-sections)\n_Objectif :_ ${ch.objectif}`).join('\n\n');
        } else {
          displayContent = content;
        }
        break;
      }

      case 'P4': {
        // RÉDACTION EXPERTE - Génère CHAQUE chapitre SÉPARÉMENT pour 400+ pages
        const structure = previousContext.P3?.chapitres || [];
        const wordsPerChapter = 5000; // 5000 mots par chapitre = 20 pages par chapitre
        const allChapters: any[] = [];
        
        // Générer chaque chapitre un par un
        for (let i = 0; i < structure.length; i++) {
          const chapterInfo = structure[i];
          console.log(`Generating chapter ${i + 1}/${structure.length}: ${chapterInfo.titre}`);
          
          const chapterContent = await callAI(
            `Tu es un AUTEUR PROFESSIONNEL PROLIFIQUE. Tu écris des chapitres TRÈS LONGS et DÉTAILLÉS (${wordsPerChapter} mots minimum). PAS DE STYLE ROBOT. Écris comme un vrai auteur humain passionné.`,
            `Rédige LE CHAPITRE ${chapterInfo.numero} de ce livre (MINIMUM ${wordsPerChapter} MOTS) :

TITRE DU LIVRE : "${title}"
AUTEUR : ${authorName}
VISION : ${JSON.stringify(previousContext.P1 || {})}

CHAPITRE À RÉDIGER :
- Numéro : ${chapterInfo.numero}
- Titre : ${chapterInfo.titre}
- Objectif : ${chapterInfo.objectif}
- Sous-sections prévues : ${JSON.stringify(chapterInfo.sousSections || chapterInfo.pointsCles)}
- Accroche : ${chapterInfo.accroche}

OBJECTIF CRITIQUE : Ce chapitre DOIT faire MINIMUM ${wordsPerChapter} MOTS (environ 20 pages).

Structure obligatoire du chapitre :
1. ACCROCHE PUISSANTE (300+ mots) - Histoire, anecdote ou question percutante
2. INTRODUCTION DU CHAPITRE (400+ mots) - Contexte et promesse
3. SECTION 1 (800+ mots) - Premier concept clé avec exemples détaillés
4. SECTION 2 (800+ mots) - Deuxième concept avec études de cas
5. SECTION 3 (800+ mots) - Troisième concept avec histoires vraies
6. SECTION 4 (600+ mots) - Applications pratiques et exercices
7. SECTION 5 (600+ mots) - Conseils avancés et astuces
8. RÉCAPITULATIF (400+ mots) - Points clés à retenir
9. TRANSITION (300+ mots) - Lien vers le chapitre suivant

SOIS EXTRÊMEMENT GÉNÉREUX EN CONTENU. Développe chaque idée en profondeur avec des exemples concrets, des anecdotes, des métaphores. Le lecteur doit sentir qu'il en a pour son argent.

Format JSON :
{
  "numero": ${chapterInfo.numero},
  "titre": "${chapterInfo.titre}",
  "contenu": "CONTENU COMPLET DU CHAPITRE (${wordsPerChapter}+ mots)",
  "nombreMots": "nombre de mots"
}`,
            16000
          );
          
          const parsedChapter = parseJSON(chapterContent);
          if (parsedChapter) {
            allChapters.push(parsedChapter);
          } else {
            allChapters.push({
              numero: chapterInfo.numero,
              titre: chapterInfo.titre,
              contenu: chapterContent,
              nombreMots: chapterContent.split(' ').length
            });
          }
        }
        
        result = { chapitres: allChapters };
        const totalWords = allChapters.reduce((acc: number, ch: any) => acc + (ch.contenu?.split(' ').length || 0), 0);
        const estimatedPages = Math.ceil(totalWords / 250);
        displayContent = `**${allChapters.length} chapitres rédigés** (~${totalWords} mots / ~${estimatedPages} pages)\n\n` +
          allChapters.slice(0, 3).map((ch: any) => {
            const chWords = (ch.contenu || '').split(' ').length;
            return `**${ch.titre}** (${chWords} mots)\n${(ch.contenu || '').substring(0, 400)}...`;
          }).join('\n\n') +
          (allChapters.length > 3 ? `\n\n_...et ${allChapters.length - 3} autres chapitres_` : '');
        break;
      }

      case 'P5': {
        // RÉÉCRITURE NATURELLE
        const chapitres = previousContext.P4?.chapitres || [];
        const content = await callAI(
          `Tu es un RÉÉCRIVALN expert qui humanise les textes. Tu supprimes tout ce qui sonne "IA" ou "corporate". Tu ajoutes de la vie, des tournures naturelles, du rythme. Ton but : qu'on ne puisse JAMAIS deviner que c'est écrit par une IA.`,
          `Réécris ces chapitres pour les rendre 100% humains et naturels :
CHAPITRES ACTUELS : ${JSON.stringify(chapitres.slice(0, 3))}

Supprime :
- Les formules génériques
- Les transitions prévisibles
- Le ton corporate/distant
- Les répétitions ennuyeuses

Ajoute :
- Des tournures conversationnelles
- Des exemples concrets du quotidien
- Du rythme varié (phrases courtes/longues)
- De la personnalité

Format JSON :
{
  "chapitresHumanises": [
    {
      "numero": 1,
      "titre": "titre",
      "contenu": "CONTENU HUMANISÉ COMPLET"
    }
  ],
  "modificationsApportees": ["liste des types de modifications"]
}`,
          20000
        );
        result = parseJSON(content) || { raw: content };
        // Merge humanized chapters with originals
        if (result.chapitresHumanises && chapitres.length > 0) {
          result.chapitresFinal = chapitres.map((ch: any, idx: number) => {
            const humanized = result.chapitresHumanises.find((h: any) => h.numero === ch.numero);
            return humanized || ch;
          });
        }
        displayContent = result.modificationsApportees
          ? `**Humanisation effectuée :**\n\n${result.modificationsApportees.map((m: string) => `✓ ${m}`).join('\n')}`
          : 'Texte humanisé avec succès';
        break;
      }

      case 'P6': {
        // QUALITÉ ÉDITORIALE
        const content = await callAI(
          `Tu es un CORRECTEUR-ÉDITEUR professionnel. Tu vérifies la qualité, la cohérence, la grammaire. Tu es exigeant mais constructif.`,
          `Analyse la qualité éditoriale de ce projet :
TITRE : "${title}"
VISION : ${JSON.stringify(previousContext.P1 || {})}
NOMBRE DE CHAPITRES : ${(previousContext.P4?.chapitres || []).length}

Évalue en JSON :
{
  "scoreGlobal": 8,
  "grammaire": { "score": 9, "remarques": "..." },
  "coherence": { "score": 8, "remarques": "..." },
  "style": { "score": 8, "remarques": "..." },
  "structure": { "score": 9, "remarques": "..." },
  "correctionsEffectuees": ["correction1", "correction2"],
  "recommandations": ["reco1", "reco2"]
}`
        );
        result = parseJSON(content) || { raw: content };
        displayContent = result.scoreGlobal
          ? `**Score global : ${result.scoreGlobal}/10**\n\n` +
            `📝 Grammaire : ${result.grammaire?.score}/10\n` +
            `🔗 Cohérence : ${result.coherence?.score}/10\n` +
            `✨ Style : ${result.style?.score}/10\n` +
            `📐 Structure : ${result.structure?.score}/10\n\n` +
            `**Recommandations :**\n${(result.recommandations || []).map((r: string) => `• ${r}`).join('\n')}`
          : content;
        break;
      }

      case 'P7': {
        // PACKAGING ÉDITORIAL
        const content = await callAI(
          `Tu es un expert en MARKETING ÉDITORIAL pour Amazon KDP. Tu crées des métadonnées qui convertissent. Tu connais les techniques de copywriting qui vendent.`,
          `Crée le packaging marketing complet :
TITRE : "${title}"
AUTEUR : ${authorName}
MARCHÉ : ${JSON.stringify(previousContext.P2 || {})}
VISION : ${JSON.stringify(previousContext.P1 || {})}

Format JSON :
{
  "sousTitre": "sous-titre accrocheur et SEO",
  "descriptionKDP": "description de 150 mots maximum qui vend",
  "bulletPoints": ["5 bénéfices clés pour l'acheteur"],
  "accroche4emeCouverture": "phrase d'accroche percutante",
  "biographieAuteur": "bio courte et crédible de ${authorName}",
  "motsClésOptimises": ["7 mots-clés KDP finaux"]
}`
        );
        result = parseJSON(content) || { raw: content };
        displayContent = result.sousTitre
          ? `**Sous-titre :** ${result.sousTitre}\n\n**Accroche :** ${result.accroche4emeCouverture}\n\n**Description KDP :**\n${result.descriptionKDP}\n\n**Points forts :**\n${(result.bulletPoints || []).map((b: string) => `✓ ${b}`).join('\n')}`
          : content;
        break;
      }

      case 'P8': {
        // DIAGNOSTIC FINAL
        const content = await callAI(
          `Tu es un DIAGNOSTIQUEUR ÉDITORIAL. Tu vérifies que tout le projet est cohérent du début à la fin. Tu cherches les incohérences, les contradictions, les faiblesses.`,
          `Diagnostic complet du projet :
TITRE : "${title}"
VISION P1 : ${JSON.stringify(previousContext.P1 || {})}
MARCHÉ P2 : ${JSON.stringify(previousContext.P2 || {})}
STRUCTURE P3 : ${JSON.stringify(previousContext.P3 || {})}
QUALITÉ P6 : ${JSON.stringify(previousContext.P6 || {})}

Format JSON :
{
  "coherenceGlobale": 9,
  "alignementVisionContenu": "analyse",
  "pointsForts": ["force1", "force2", "force3"],
  "incoherencesDetectees": ["ou 'Aucune incohérence détectée'"],
  "correctionsSuggérées": ["correction1"],
  "verdict": "Le projet est cohérent / nécessite ajustements"
}`
        );
        result = parseJSON(content) || { raw: content };
        displayContent = result.coherenceGlobale
          ? `**Cohérence globale : ${result.coherenceGlobale}/10**\n\n**${result.verdict}**\n\n**Points forts :**\n${(result.pointsForts || []).map((p: string) => `✓ ${p}`).join('\n')}\n\n**Incohérences :**\n${(result.incoherencesDetectees || ['Aucune']).map((i: string) => `• ${i}`).join('\n')}`
          : content;
        break;
      }

      case 'P9': {
        // MÉMOIRE ÉDITORIALE
        const content = await callAI(
          `Tu es un expert en IDENTITÉ D'AUTEUR. Tu captures l'essence de la voix unique d'un projet pour garantir sa cohérence à travers tous les textes.`,
          `Capture la mémoire éditoriale de ce projet :
TITRE : "${title}"
AUTEUR : ${authorName}
TON DÉFINI : ${previousContext.P1?.tonEditorial || 'Non défini'}

Format JSON :
{
  "voixAuteur": "description de la voix unique",
  "ticsDeLangage": ["expressions récurrentes à utiliser"],
  "expressionsInterdites": ["formules à éviter absolument"],
  "niveauLangue": "accessible/soutenu/technique",
  "rythmePhrases": "description du rythme idéal",
  "personnalité": "traits de personnalité qui transparaissent",
  "signature": "ce qui rend ce texte reconnaissable"
}`
        );
        result = parseJSON(content) || { raw: content };
        displayContent = result.voixAuteur
          ? `**Voix de l'auteur :** ${result.voixAuteur}\n\n**Niveau de langue :** ${result.niveauLangue}\n\n**Personnalité :** ${result.personnalité}\n\n**Signature unique :** ${result.signature}\n\n**Expressions à éviter :**\n${(result.expressionsInterdites || []).map((e: string) => `✗ ${e}`).join('\n')}`
          : content;
        break;
      }

      case 'P10': {
        // COHÉRENCE CHAPITRES
        const content = await callAI(
          `Tu es un expert en TRANSITIONS NARRATIVES. Tu vérifies que les chapitres s'enchaînent naturellement, que le fil conducteur est maintenu.`,
          `Analyse les transitions entre chapitres :
STRUCTURE : ${JSON.stringify(previousContext.P3?.chapitres || [])}
MÉMOIRE : ${JSON.stringify(previousContext.P9 || {})}

Format JSON :
{
  "fluiditeGlobale": 9,
  "transitionsAnalysees": [
    { "de": 1, "vers": 2, "qualite": "fluide/acceptable/à améliorer", "suggestion": "..." }
  ],
  "filConducteur": "description du fil rouge qui lie tout",
  "progressionNarrative": "analyse de la montée en puissance",
  "recommandations": ["reco1", "reco2"]
}`
        );
        result = parseJSON(content) || { raw: content };
        displayContent = result.fluiditeGlobale
          ? `**Fluidité globale : ${result.fluiditeGlobale}/10**\n\n**Fil conducteur :** ${result.filConducteur}\n\n**Progression narrative :** ${result.progressionNarrative}\n\n**Recommandations :**\n${(result.recommandations || []).map((r: string) => `• ${r}`).join('\n')}`
          : content;
        break;
      }

      case 'P11': {
        // AUTO-CRITIQUE
        const content = await callAI(
          `Tu es un CRITIQUE LITTÉRAIRE exigeant mais juste. Tu identifies les faiblesses sans complaisance mais toujours de manière constructive. Pas de flatterie.`,
          `Critique ce projet sans complaisance :
TITRE : "${title}"
SCORES QUALITÉ : ${JSON.stringify(previousContext.P6 || {})}
DIAGNOSTIC : ${JSON.stringify(previousContext.P8 || {})}

Format JSON (sois HONNÊTE, pas de flatterie) :
{
  "pointsFaibles": ["faiblesse1", "faiblesse2", "faiblesse3"],
  "risquesCommercials": ["risque1", "risque2"],
  "chapitresARetravailler": [{ "numero": 1, "raison": "..." }],
  "manquesIdentifies": ["ce qui manque au projet"],
  "critiqueHonnete": "ton avis franc de professionnel",
  "scoreReelEstime": 7
}`
        );
        result = parseJSON(content) || { raw: content };
        displayContent = result.critiqueHonnete
          ? `**Score réel estimé : ${result.scoreReelEstime}/10**\n\n**Critique honnête :**\n${result.critiqueHonnete}\n\n**Points faibles identifiés :**\n${(result.pointsFaibles || []).map((p: string) => `⚠️ ${p}`).join('\n')}\n\n**Risques commerciaux :**\n${(result.risquesCommercials || []).map((r: string) => `• ${r}`).join('\n')}`
          : content;
        break;
      }

      case 'P12': {
        // BOUCLE ITÉRATIVE
        const content = await callAI(
          `Tu es un AMÉLIORATEUR DE CONTENU. Tu prends les critiques P11 et proposes des solutions concrètes pour chaque faiblesse identifiée.`,
          `Propose des améliorations basées sur la critique :
CRITIQUE P11 : ${JSON.stringify(previousContext.P11 || {})}
STRUCTURE P3 : ${JSON.stringify(previousContext.P3 || {})}

Format JSON :
{
  "ameliorationsProposees": [
    {
      "faiblesseCorrigee": "description de la faiblesse",
      "solution": "solution concrète proposée",
      "priorite": "haute/moyenne/basse"
    }
  ],
  "chapitresAmeliors": [{ "numero": 1, "amelioration": "..." }],
  "nouveauScoreEstime": 8,
  "tempsEstimeCorrections": "estimation du temps"
}`
        );
        result = parseJSON(content) || { raw: content };
        displayContent = result.ameliorationsProposees
          ? `**Nouveau score estimé : ${result.nouveauScoreEstime}/10**\n\n**Améliorations proposées :**\n\n${result.ameliorationsProposees.map((a: any) => `**[${a.priorite}]** ${a.faiblesseCorrigee}\n→ ${a.solution}`).join('\n\n')}`
          : content;
        break;
      }

      case 'P13': {
        // SIGNATURE DE STYLE
        const content = await callAI(
          `Tu es un STYLISTE LITTÉRAIRE. Tu unifie la voix de l'auteur sur l'ensemble du texte pour créer une signature reconnaissable. Tu élimines les variations de ton involontaires.`,
          `Définis et applique la signature de style finale :
MÉMOIRE P9 : ${JSON.stringify(previousContext.P9 || {})}
AUTEUR : ${authorName}

Format JSON :
{
  "signatureUnique": "description de ce qui rend ce texte unique",
  "elementsRecurrents": ["élément1", "élément2", "élément3"],
  "tonUnifie": "description du ton final cohérent",
  "marquesDeStyle": ["marque1", "marque2"],
  "certificatStyle": "Ce texte porte la signature distinctive de ${authorName}",
  "coherenceVoix": 9
}`
        );
        result = parseJSON(content) || { raw: content };
        displayContent = result.signatureUnique
          ? `**Signature unique :** ${result.signatureUnique}\n\n**Ton unifié :** ${result.tonUnifie}\n\n**Cohérence de voix : ${result.coherenceVoix}/10**\n\n**Marques de style :**\n${(result.marquesDeStyle || []).map((m: string) => `✦ ${m}`).join('\n')}\n\n_${result.certificatStyle}_`
          : content;
        break;
      }

      case 'P14': {
        // VERDICT ULTIME
        const content = await callAI(
          `Tu es le VERDICT FINAL. Tu donnes ton avis définitif en tant qu'éditeur senior. Sois honnête : ce livre est-il prêt à être publié ? Donne un vrai verdict professionnel, pas de la complaisance.`,
          `Verdict final pour ce projet :
TITRE : "${title}"
AUTEUR : ${authorName}
QUALITÉ P6 : ${JSON.stringify(previousContext.P6 || {})}
CRITIQUE P11 : ${JSON.stringify(previousContext.P11 || {})}
AMÉLIORATIONS P12 : ${JSON.stringify(previousContext.P12 || {})}
STYLE P13 : ${JSON.stringify(previousContext.P13 || {})}

Format JSON (VERDICT HONNÊTE - pas de flatterie) :
{
  "publiable": true,
  "scoreFinakl": 8,
  "verdict": "Verdict honnête en 2-3 phrases",
  "forcesFinales": ["force1", "force2", "force3"],
  "reservesRestantes": ["réserve1 ou 'Aucune réserve majeure'"],
  "recommandationFinale": "Publier / Publier après corrections / Retravailler",
  "potentielCommercial": "estimation honnête",
  "certificat": "Validé par le système éditorial le ${new Date().toLocaleDateString('fr-FR')}"
}`
        );
        result = parseJSON(content) || { raw: content };
        displayContent = result.verdict
          ? `# VERDICT FINAL\n\n**${result.recommandationFinale}**\n\n**Score final : ${result.scoreFinal}/10**\n\n${result.verdict}\n\n**Forces :**\n${(result.forcesFinales || []).map((f: string) => `✓ ${f}`).join('\n')}\n\n**Réserves :**\n${(result.reservesRestantes || []).map((r: string) => `• ${r}`).join('\n')}\n\n**Potentiel commercial :** ${result.potentielCommercial}\n\n---\n_${result.certificat}_`
          : content;
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unknown step: ${step}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    console.log(`Step ${step} completed successfully`);

    return new Response(
      JSON.stringify({ 
        success: true,
        step,
        result,
        displayContent,
        title,
        authorName,
        numberOfChapters
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Workflow step error:', error);
    
    const errorMessage = error.message || 'Unknown error';
    let status = 500;
    let userMessage = errorMessage;
    
    if (errorMessage === 'RATE_LIMIT') {
      status = 429;
      userMessage = 'Limite de requêtes atteinte. Patientez quelques secondes.';
    } else if (errorMessage === 'CREDITS_EXHAUSTED') {
      status = 402;
      userMessage = 'Crédits épuisés. Veuillez recharger.';
    }

    return new Response(
      JSON.stringify({ error: userMessage }),
      { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});