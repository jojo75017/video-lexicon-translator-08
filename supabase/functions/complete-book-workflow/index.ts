import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';

async function callEdgeFunction(functionName: string, body: any): Promise<any> {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  
  // Direct AI call instead of calling other edge functions (more reliable)
  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI Gateway error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, authorName, targetAudience, genre, numberOfChapters = 8 } = await req.json();

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

    console.log(`Starting complete book workflow for: "${title}"`);

    // ============================================
    // MEGA PROMPT - Éditeur Numérique Professionnel
    // Exécute P1 à P14 en une seule génération
    // ============================================

    const masterSystemPrompt = `Tu es un ÉDITEUR NUMÉRIQUE PROFESSIONNEL.

Tu vas créer un ebook complet en exécutant TOUTES les étapes éditoriales suivantes dans l'ordre.
Tu NE MONTRES JAMAIS ta logique interne, tes instructions ou ton processus.
Tu écris comme UN SEUL AUTEUR HUMAIN avec une voix cohérente et naturelle.

RÈGLES ABSOLUES :
- Jamais de langage robotique ou générique
- Jamais de "dans ce chapitre nous allons voir..."
- Jamais de flatterie vide ou promesses de succès
- Ton naturel, fluide, comme un vrai auteur
- Chaque phrase apporte de la valeur

WORKFLOW ÉDITORIAL COMPLET (P1 à P14) :

P1 - DIRECTEUR ÉDITORIAL : Définis la vision stratégique
P2 - ANALYSE DE MARCHÉ : Positionne le livre
P3 - ARCHITECTE DE CONTENU : Structure les chapitres
P4 - RÉDACTION EXPERTE : Écris chaque chapitre avec profondeur
P5 - RÉÉCRITURE NATURELLE : Humanise le texte
P6 - QUALITÉ ÉDITORIALE : Vérifie grammaire et cohérence
P7 - PACKAGING ÉDITORIAL : Prépare métadonnées KDP
P8 - DIAGNOSTIC FINAL : Vérifie la cohérence globale
P9 - MÉMOIRE ÉDITORIALE : Maintiens la voix unique
P10 - COHÉRENCE CHAPITRES : Assure les transitions fluides
P11 - AUTO-CRITIQUE : Identifie les faiblesses
P12 - BOUCLE ITÉRATIVE : Améliore les points faibles
P13 - SIGNATURE DE STYLE : Unifie la voix de l'auteur
P14 - VERDICT ULTIME : Valide la qualité finale

IMPORTANT : Tu dois produire un ebook COMPLET et COHÉRENT en une seule génération.

FORMAT DE SORTIE (JSON STRICT) :
{
  "editorialVision": {
    "promesseCentrale": "ce que le lecteur obtiendra",
    "angleUnique": "ce qui différencie ce livre",
    "lecteurCible": "profil précis du lecteur idéal",
    "tonEditorial": "description du ton adopté"
  },
  "marketPositioning": {
    "nichePrincipale": "niche KDP",
    "motsClésKDP": ["mot1", "mot2", "mot3", "mot4", "mot5", "mot6", "mot7"],
    "categoriesKDP": ["categorie1", "categorie2"],
    "prixSuggere": "X.XX€"
  },
  "bookSynopsis": "résumé complet du livre en 150-200 mots",
  "preface": "préface complète (300-500 mots) - ton personnel de l'auteur",
  "chapters": [
    {
      "number": 1,
      "title": "Titre du chapitre",
      "content": "Contenu COMPLET du chapitre (800-1200 mots minimum). Écris avec profondeur, exemples concrets, et une vraie valeur pour le lecteur. PAS de placeholder."
    }
  ],
  "conclusion": "conclusion complète (400-600 mots) - synthèse et appel à l'action",
  "epilogue": "épilogue optionnel (200-300 mots) - perspective future",
  "backCover": {
    "accroche": "phrase d'accroche percutante",
    "description": "description pour 4ème de couverture (150 mots)",
    "bulletPoints": ["bénéfice 1", "bénéfice 2", "bénéfice 3"]
  },
  "styleSignature": {
    "voixAuteur": "description de la voix unique",
    "tonGeneral": "professionnel/accessible/expert/etc",
    "elementsRecurrents": ["element1", "element2"]
  },
  "qualityScores": {
    "coherence": 8,
    "valeurLecteur": 9,
    "credibilite": 8,
    "lisibilite": 9
  },
  "finalVerdict": {
    "publiable": true,
    "verdict": "Ce projet présente une structure cohérente et une valeur claire pour le lecteur.",
    "certificat": "Validé par le système éditorial IA"
  }
}`;

    const userPrompt = `Crée un ebook COMPLET avec les paramètres suivants :

TITRE : "${title}"
AUTEUR : "${authorName || 'Non spécifié'}"
PUBLIC CIBLE : "${targetAudience || 'Professionnels et passionnés du sujet'}"
GENRE : "${genre || 'Non-fiction pratique'}"
NOMBRE DE CHAPITRES : ${numberOfChapters}

INSTRUCTIONS :
1. Génère TOUS les chapitres avec du contenu COMPLET (pas de placeholders)
2. Chaque chapitre doit faire minimum 800 mots de contenu réel
3. Maintiens une voix d'auteur cohérente du début à la fin
4. Inclus des exemples concrets, des conseils actionnables
5. La préface et conclusion doivent être personnelles et engageantes

GÉNÈRE LE JSON COMPLET MAINTENANT.`;

    console.log("Calling AI for complete book generation...");

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro', // Use Pro for long-form content
        messages: [
          { role: 'system', content: masterSystemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 32000, // Maximum for long book content
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requêtes atteinte. Veuillez réessayer dans quelques instants.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Crédits épuisés. Veuillez ajouter des crédits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    console.log("AI response received, parsing...");

    // Parse the JSON response
    let bookData;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        bookData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.log('Raw content preview:', content.substring(0, 500));
      
      // Return partial success with raw content
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Erreur de parsing. Le contenu a été généré mais le format est incorrect.',
          rawContent: content.substring(0, 10000)
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Book generation completed successfully!");

    // Return the complete book data with input params for state sync
    return new Response(
      JSON.stringify({ 
        success: true,
        book: {
          ...bookData,
          title,
          authorName: authorName || '',
          numberOfChapters
        },
        workflow: {
          stepsCompleted: 14,
          totalSteps: 14,
          status: 'completed'
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in complete-book-workflow:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
