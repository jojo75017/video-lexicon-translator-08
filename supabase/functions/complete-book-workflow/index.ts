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
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt + HUMAN_VOICE_RULES },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 429) throw new Error('RATE_LIMIT');
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
    const payload = await req.json();
    const {
      step,
      title,
      subtitle = '',
      category = '',
      authorName,
      numberOfChapters = 8,
      characters = [],
      previousContext = {},
      chapter,
    } = payload;

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

    // Construire la liste des personnages pour le contexte
    const charactersContext = characters.length > 0
      ? `\n\nPERSONNAGES DU LIVRE (OBLIGATOIRES À UTILISER) :\n${characters.map((c: any) => `- ${c.name} (${c.role || 'personnage'}): ${c.description}`).join('\n')}`
      : '';

    // Construire le contexte complet du livre
    const fullTitle = subtitle ? `${title} : ${subtitle}` : title;
    const bookContext = `
TITRE COMPLET : "${fullTitle}"
CATÉGORIE : ${category || 'Non spécifiée'}
AUTEUR : ${authorName}
CHAPITRES PRÉVUS : ${numberOfChapters}${charactersContext}
`.trim();

    console.log(`Step ${step} for: "${fullTitle}" (Category: ${category}, Characters: ${characters.length})`);

    let result: any = {};
    let displayContent = '';

    switch (step) {
      case 'P1': {
        // DIRECTEUR ÉDITORIAL - Génère AUTOMATIQUEMENT la description + vision stratégique
        const content = await callAI(
          `Tu es un DIRECTEUR ÉDITORIAL avec 20 ans d'expérience. Tu analyses un projet de livre et donnes ta vision stratégique. 
MISSION CRITIQUE : À partir du TITRE, SOUS-TITRE et CATÉGORIE, tu dois DEVINER et CRÉER une description précise du livre. 
Sois direct, incisif, comme un vrai pro.`,
          `Analyse ce projet de livre :
${bookContext}

ÉTAPE 1 - INTERPRÉTATION DU TITRE :
Analyse le titre "${fullTitle}" dans la catégorie "${category}".
Devine quel est le VRAI sujet du livre. Par exemple :
- "Elle faisait partie de la famille" + catégorie "Animaux" = histoire émouvante d'un animal de compagnie
- "Les secrets du marketing digital" + catégorie "Business" = guide pratique sur le marketing en ligne

ÉTAPE 2 - GÉNÈRE UNE DESCRIPTION (tu dois la créer, personne ne te l'a fournie) :
Crée une description de 2-3 phrases qui explique clairement le sujet du livre basée sur ton interprétation.

Donne ta vision éditoriale en JSON :
{
  "descriptionGeneree": "La description que TU as créée pour ce livre (2-3 phrases précises expliquant le sujet)",
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
        displayContent = result.descriptionGeneree 
          ? `**📖 Description générée :** ${result.descriptionGeneree}\n\n**Promesse centrale :** ${result.promesseCentrale}\n\n**Angle unique :** ${result.angleUnique}\n\n**Lecteur cible :** ${result.lecteurCible}\n\n**Ton éditorial :** ${result.tonEditorial}\n\n**Recommandation :** ${result.recommandation}`
          : content;
        console.log('Step P1 completed successfully - Description auto-générée');
        break;
      }

      case 'P2': {
        // ANALYSE DE MARCHÉ + 7 MOTS-CLÉS KDP OPTIMISÉS
        const content = await callAI(
          `Tu es un expert en SEO Amazon KDP et en analyse d'intention de recherche. Tu connais les tendances, les niches rentables, la concurrence. Parle comme un consultant business pragmatique. UTILISE LA CATÉGORIE fournie pour cibler la bonne niche.`,
          `Analyse le marché pour ce livre et génère 7 mots-clés KDP très performants :

${bookContext}
VISION ÉDITORIALE : ${JSON.stringify(previousContext.P1 || {})}

MISSION MOTS-CLÉS KDP :
Trouve 7 mots-clés très performants pour Amazon KDP France basés sur le TITRE et la CATÉGORIE.

CONTRAINTES OBLIGATOIRES pour les mots-clés :
- Correspondre à des recherches réelles d'internautes (Amazon + Google)
- Être strictement cohérents avec la CATÉGORIE "${category}"
- Être adaptés à Amazon KDP (ni trop génériques, ni trop vagues)
- Pas de répétition exacte du titre

Donne ton analyse marché en JSON :
{
  "nichePrincipale": "la niche KDP précise basée sur la catégorie ${category}",
  "tailleMarche": "estimation de la taille (grand/moyen/niche)",
  "concurrenceNiveau": "faible/moyenne/forte",
  "opportunite": "l'opportunité identifiée",
  "motsClésKDP": ["7 mots-clés classés du plus stratégique au plus secondaire"],
  "justificationMotsCles": ["justification pour chaque mot-clé"],
  "categoriesKDP": ["2 catégories Amazon principales recommandées"],
  "categoriesSecondaires": ["3 catégories cachées potentielles"],
  "prixOptimal": "prix suggéré avec justification",
  "potentielVentes": "estimation réaliste"
}`
        );
        result = parseJSON(content) || { raw: content };
        console.log('Step P2 completed successfully');
        displayContent = result.nichePrincipale
          ? `**Niche :** ${result.nichePrincipale}\n\n**Concurrence :** ${result.concurrenceNiveau}\n\n**Opportunité :** ${result.opportunite}\n\n**Prix optimal :** ${result.prixOptimal}\n\n**🔑 7 Mots-clés KDP stratégiques :**\n${(result.motsClésKDP || []).map((kw: string, i: number) => `${i + 1}. ${kw}`).join('\n')}\n\n**Catégories :** ${(result.categoriesKDP || []).join(', ')}\n**Catégories secondaires :** ${(result.categoriesSecondaires || []).join(', ')}`
          : content;
        break;
      }

      case 'P3': {
        // ARCHITECTE DE CONTENU - Structure + GÉNÉRATION AUTOMATIQUE DES PERSONNAGES
        const wordsPerChapter = 3500;
        const totalWords = numberOfChapters * wordsPerChapter;
        const estimatedPages = Math.ceil(totalWords / 250);
        const descriptionGeneree = previousContext.P1?.descriptionGeneree || '';
        
        console.log(`Step P3: Structuring ${numberOfChapters} chapters + generating characters for "${fullTitle}"`);
        
        const content = await callAI(
          `Tu es un ARCHITECTE DE CONTENU et CRÉATEUR DE PERSONNAGES expert. Tu structures des livres ET tu crées les personnages adaptés au récit.`,
          `Structure ce livre en ${numberOfChapters} chapitres ET crée les personnages adaptés :
${bookContext}
DESCRIPTION DU LIVRE (générée en P1): ${descriptionGeneree}
VISION : ${JSON.stringify(previousContext.P1 || {})}
MARCHÉ : ${JSON.stringify(previousContext.P2 || {})}

OBJECTIF : ~${totalWords} mots total (~${estimatedPages} pages)
Chaque chapitre doit avoir ~${wordsPerChapter} mots avec 4-6 sous-sections.

MISSION CRITIQUE - PERSONNAGES :
Crée 4-6 personnages UNIQUES et COHÉRENTS pour CE LIVRE SPÉCIFIQUE :
- Personnage principal (héros/narrateur)
- 2-3 personnages secondaires importants
- 1-2 personnages d'appui ou antagonistes

Chaque personnage doit être ADAPTÉ au titre "${fullTitle}" et à la catégorie "${category}".
NE RÉUTILISE JAMAIS des personnages d'autres livres. Crée des personnages 100% originaux.

Crée la structure en JSON :
{
  "structureGlobale": "description de l'arc narratif/pédagogique du livre adapté à la catégorie ${category}",
  "nombrePagesEstime": ${estimatedPages},
  "nombreMotsEstime": ${totalWords},
  "personnages": [
    {
      "name": "Nom du personnage",
      "role": "protagoniste/antagoniste/secondaire/mentor",
      "description": "Description physique et psychologique détaillée (2-3 phrases)",
      "arc": "Son évolution au cours du récit"
    }
  ],
  "chapitres": [
    {
      "numero": 1,
      "titre": "Titre accrocheur du chapitre",
      "objectif": "Ce que le lecteur maîtrisera après ce chapitre",
      "nombreMotsPrevu": ${wordsPerChapter},
      "sousSections": ["sous-section 1", "sous-section 2", "sous-section 3", "sous-section 4"],
      "pointsCles": ["point1", "point2", "point3"],
      "accroche": "Phrase d'ouverture captivante"
    }
  ],
  "progressionLogique": "explication de pourquoi cet ordre"
}`,
          10000
        );
        result = parseJSON(content) || { raw: content };
        console.log(`Step P3 completed - Generated ${result.personnages?.length || 0} characters`);
        
        if (result.chapitres) {
          const totalMotsPrevu = result.chapitres.reduce((acc: number, ch: any) => acc + (ch.nombreMotsPrevu || wordsPerChapter), 0);
          const pagesEstime = result.nombrePagesEstime || estimatedPages;
          
          const personnagesDisplay = result.personnages?.length > 0
            ? `\n\n**🎭 ${result.personnages.length} Personnages créés :**\n${result.personnages.map((p: any) => `- **${p.name}** (${p.role}): ${p.description}`).join('\n')}`
            : '';
          
          displayContent = `**Structure globale :** ${result.structureGlobale}${personnagesDisplay}\n\n**📖 ~${pagesEstime} pages prévues (~${totalMotsPrevu} mots)**\n\n**${result.chapitres.length} chapitres structurés :**\n\n` +
            result.chapitres.map((ch: any) => `**Ch.${ch.numero} - ${ch.titre}** (~${ch.nombreMotsPrevu || wordsPerChapter} mots)\n_Objectif :_ ${ch.objectif}`).join('\n\n');
        } else {
          displayContent = content;
        }
        break;
      }

      case 'P4': {
        // RÉDACTION EXPERTE
        // IMPORTANT: cette étape est lourde. Pour éviter les timeouts, on supporte 2 modes :
        // - Mode "un chapitre" (recommandé) via `chapter` dans le body
        // - Mode legacy (tout d'un coup) si `chapter` n'est pas fourni

        const structure = previousContext.P3?.chapitres || [];
        const descriptionGeneree = previousContext.P1?.descriptionGeneree || '';
        const tonEditorial = previousContext.P1?.tonEditorial || '';
        const lecteurCible = previousContext.P1?.lecteurCible || '';

        // PRIORITÉ : utiliser les personnages générés en P3, sinon ceux passés en paramètre
        const personnagesP3 = previousContext.P3?.personnages || [];
        const personnagesAUtiliser = personnagesP3.length > 0 ? personnagesP3 : characters;
        
        console.log(`Step P4: Using ${personnagesAUtiliser.length} characters (from P3: ${personnagesP3.length}, from params: ${characters.length})`);

        // Construire la section personnages pour P4
        const personnagesSection = personnagesAUtiliser.length > 0
          ? `\n\nPERSONNAGES À UTILISER OBLIGATOIREMENT :\n${personnagesAUtiliser.map((c: any) => `- **${c.name}** (${c.role || 'personnage'}): ${c.description}${c.arc ? ` | Arc: ${c.arc}` : ''}`).join('\n')}\n\nATTENTION : Tu DOIS utiliser ces personnages et UNIQUEMENT ces personnages. N'invente PAS d'autres personnages principaux.`
          : '';

        // Nouveau: génération par chapitre (évite le timeout)
        // `chapter` peut être soit un chapitre complet (numero/titre/...), soit juste { numero }
        // Dans ce cas, on le retrouve depuis P3.
        // IMPORTANT: on lit `chapter` depuis le body déjà parsé (payload), sinon Deno ne peut pas relire req.json() une 2e fois.


        if (chapter) {
          const chapitre = chapter?.titre ? chapter : structure.find((c: any) => c.numero === chapter.numero) || chapter;

          if (!chapitre?.numero || !chapitre?.titre) {
            return new Response(
              JSON.stringify({ error: 'Invalid chapter payload for P4' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          console.log(`Step P4 (single): Generating chapter ${chapitre.numero}: ${chapitre.titre} with ${personnagesAUtiliser.length} characters`);

          const chapterContent = await callAI(
            `Tu es un AUTEUR PROFESSIONNEL avec 20 ans d'expérience. Tu rédiges des chapitres COMPLETS, captivants, dans le style du genre "${category}".

RÈGLES D'ÉCRITURE :
- Style naturel et humain, JAMAIS robotique
- Phrases variées (courtes et longues)
- Dialogues si approprié au genre
- Descriptions vivantes et immersives
- Transitions fluides entre paragraphes
- TON : ${tonEditorial}${personnagesSection}`,
            `Rédige le CHAPITRE COMPLET suivant (environ 2500-3500 mots) :

LIVRE : "${fullTitle}"
CATÉGORIE : ${category}
DESCRIPTION : ${descriptionGeneree}
LECTEUR CIBLE : ${lecteurCible}${personnagesSection}

CHAPITRE ${chapitre.numero} : "${chapitre.titre}"
OBJECTIF DU CHAPITRE : ${chapitre.objectif || ''}
SOUS-SECTIONS À COUVRIR : ${(chapitre.sousSections || []).join(', ')}
POINTS CLÉS : ${(chapitre.pointsCles || []).join(', ')}
ACCROCHE : ${chapitre.accroche || ''}

IMPORTANT :
- Écris le contenu COMPLET du chapitre
- Utilise UNIQUEMENT les personnages définis ci-dessus
- Inclus des exemples concrets, anecdotes, ou dialogues selon le genre
- Termine par une transition vers le chapitre suivant

Retourne le contenu en JSON :
{
  "numero": ${chapitre.numero},
  "titre": "${chapitre.titre}",
  "contenu": "LE CONTENU COMPLET DU CHAPITRE ICI",
  "nombreMots": 3000
}`,
            6000
          );

          const parsedChapter = parseJSON(chapterContent);
          const chapitreGenere = parsedChapter || {
            numero: chapitre.numero,
            titre: chapitre.titre,
            contenu: chapterContent,
            nombreMots: chapterContent.split(/\s+/).length,
          };

          result = {
            chapitre: chapitreGenere,
            numero: chapitreGenere.numero,
            titre: chapitreGenere.titre,
            nombreMots: chapitreGenere.nombreMots,
          };

          displayContent = `**Ch.${chapitreGenere.numero} - ${chapitreGenere.titre}** (~${chapitreGenere.nombreMots || 3000} mots)\n_${(chapitreGenere.contenu || '').substring(0, 200)}..._`;
          break;
        }

        // Mode legacy: tout générer dans une seule requête (peut timeout sur de gros livres)
        console.log(`Step P4 (legacy): Generating FULL CONTENT for ${structure.length} chapters with ${characters.length} characters`);

        const chapitresComplets: any[] = [];
        for (const chapitre of structure) {
          console.log(`Generating chapter ${chapitre.numero}: ${chapitre.titre}`);

          const chapterContent = await callAI(
            `Tu es un AUTEUR PROFESSIONNEL avec 20 ans d'expérience. Tu rédiges des chapitres COMPLETS, captivants, dans le style du genre "${category}".\n\nTON : ${tonEditorial}${personnagesSection}`,
            `Rédige le CHAPITRE COMPLET suivant :\n\nLIVRE : "${fullTitle}"\nCATÉGORIE : ${category}\nDESCRIPTION : ${descriptionGeneree}\nLECTEUR CIBLE : ${lecteurCible}${personnagesSection}\n\nCHAPITRE ${chapitre.numero} : "${chapitre.titre}"\nSOUS-SECTIONS : ${(chapitre.sousSections || []).join(', ')}\n\nIMPORTANT : Utilise UNIQUEMENT les personnages définis ci-dessus.\n\nRetourne le contenu en JSON :\n{\n  "numero": ${chapitre.numero},\n  "titre": "${chapitre.titre}",\n  "contenu": "...",\n  "nombreMots": 3000\n}`,
            6000
          );

          const parsed = parseJSON(chapterContent);
          chapitresComplets.push(parsed || {
            numero: chapitre.numero,
            titre: chapitre.titre,
            contenu: chapterContent,
            nombreMots: chapterContent.split(/\s+/).length,
          });
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
        // RÉÉCRITURE NATURELLE - Analyse et améliore les chapitres complets
        const chapitres = previousContext.P4?.chapitres || [];
        console.log(`Step P5: Analyzing ${chapitres.length} complete chapters for humanization`);
        
        // Prendre un échantillon du contenu de chaque chapitre pour l'analyse
        const echantillons = chapitres.slice(0, 5).map((ch: any) => 
          `Ch.${ch.numero} "${ch.titre}": ${(ch.contenu || '').substring(0, 500)}`
        ).join('\n\n');
        
        const content = await callAI(
          `Tu es un RÉÉCRIVAIN expert qui humanise les textes. Tu supprimes tout ce qui sonne "IA" ou "corporate". Tu ajoutes de la vie, des tournures naturelles, du rythme.`,
          `Analyse ces extraits de chapitres et donne des conseils d'humanisation :

EXTRAITS DES CHAPITRES :
${echantillons}

Analyse et donne tes recommandations en JSON :
{
  "analyseGlobale": "ton évaluation du ton actuel et de la qualité d'écriture",
  "pointsForts": ["ce qui fonctionne bien"],
  "pointsAHumaniser": ["élément 1 à améliorer", "élément 2"],
  "exemplesReformulation": [
    {"avant": "phrase originale", "apres": "version humanisée"}
  ],
  "conseilsStyle": ["conseil 1", "conseil 2", "conseil 3"],
  "scoreHumanite": 8
}`,
          4000
        );
        
        result = parseJSON(content) || { raw: content };
        console.log('Step P5 completed successfully');
        
        // Transférer les chapitres complets de P4 vers le résultat final
        result.chapitresFinal = chapitres;
        
        displayContent = result.analyseGlobale
          ? `**Analyse d'humanisation :**\n\n${result.analyseGlobale}\n\n**Score d'humanité : ${result.scoreHumanite || '?'}/10**\n\n**Points forts :**\n${(result.pointsForts || []).map((p: string) => `✓ ${p}`).join('\n')}\n\n**Points à améliorer :**\n${(result.pointsAHumaniser || []).map((p: string) => `• ${p}`).join('\n')}\n\n**Conseils de style :**\n${(result.conseilsStyle || []).map((c: string) => `→ ${c}`).join('\n')}`
          : 'Analyse d\'humanisation effectuée';
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
        
        // Sécurisation : s'assurer que les tableaux sont bien des tableaux
        const forces = Array.isArray(result.forcesFinales) ? result.forcesFinales : [];
        const reserves = Array.isArray(result.reservesRestantes) ? result.reservesRestantes : 
          (typeof result.reservesRestantes === 'string' ? [result.reservesRestantes] : []);
        
        displayContent = result.verdict
          ? `# VERDICT FINAL\n\n**${result.recommandationFinale}**\n\n**Score final : ${result.scoreFinal}/10**\n\n${result.verdict}\n\n**Forces :**\n${forces.map((f: string) => `✓ ${f}`).join('\n')}\n\n**Réserves :**\n${reserves.map((r: string) => `• ${r}`).join('\n')}\n\n**Potentiel commercial :** ${result.potentielCommercial}\n\n---\n_${result.certificat}_`
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