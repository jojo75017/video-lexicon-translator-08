// Edge function: génère une séquence de 5 emails de lancement de livre.
// Utilise la clé Gemini BYOK fournie par l'abonné. Aucun envoi : retourne juste le contenu.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Body {
  ebookTitle?: string;
  authorName?: string;
  targetAudience?: string;
  bookSummary?: string;
  bookPitch?: string;
  launchDate?: string;
  buyLink?: string;
  geminiApiKey?: string;
}

interface EmailOut {
  step: number;
  label: string;
  dayOffset: string;
  subject: string;
  preheader: string;
  bodyText: string;
  bodyHtml: string;
}

const SYSTEM_PROMPT = `Tu es un copywriter français expert en email marketing pour le lancement de livres / ebooks.
Tu écris des emails CHALEUREUX, AUTHENTIQUES, qui ressemblent à un email personnel d'auteur à ses lecteurs.
Pas de superlatifs ridicules ("révolutionnaire", "incroyable"), pas d'emojis abusifs (max 1-2 par email).
Chaque email fait 120 à 220 mots maximum dans le corps. Phrases courtes. Tutoiement.
Tu retournes UNIQUEMENT du JSON valide, rien d'autre.`;

function buildUserPrompt(b: Body): string {
  const launch = b.launchDate || 'prochainement';
  return `Génère une séquence de 5 emails de lancement pour ce livre :

TITRE : ${b.ebookTitle || '(à définir)'}
AUTEUR : ${b.authorName || '(auteur)'}
PUBLIC CIBLE : ${b.targetAudience || 'lecteurs'}
PITCH / RÉSUMÉ : ${b.bookPitch || b.bookSummary || '(résumé du livre à intégrer)'}
DATE DE SORTIE : ${launch}
LIEN D'ACHAT : ${b.buyLink || '[LIEN_ACHAT]'}

Les 5 emails de la séquence doivent être :
1. J-7  TEASING       — annoncer qu'un projet arrive sans tout révéler, créer l'attente.
2. J-3  RÉVÉLATION    — dévoiler le titre, le sujet, à qui s'adresse le livre.
3. J0   LANCEMENT     — c'est le jour J, appel à l'action clair pour acheter.
4. J+3  PREUVE SOCIALE— premiers retours/témoignages, lever les dernières objections.
5. J+7  DERNIÈRE CHANCE— bonus de lancement / urgence douce, dernier rappel.

Pour CHAQUE email retourne :
- subject     : objet de l'email (max 60 caractères, accrocheur, pas de clickbait)
- preheader   : texte d'aperçu (60-90 caractères)
- bodyText    : corps de l'email en TEXTE BRUT (pas de markdown), avec sauts de ligne \\n entre paragraphes,
                signé "${b.authorName || 'L\\'auteur'}" à la fin.
                Inclure le lien d'achat ${b.buyLink || '[LIEN_ACHAT]'} dans les emails 3, 4 et 5.
- bodyHtml    : même contenu en HTML simple (uniquement <p>, <strong>, <em>, <a href>, <br>),
                pas de styles inline, pas de couleurs, prêt à coller dans Mailchimp/Brevo/Systeme.io.

Retourne STRICTEMENT ce JSON (et rien d'autre) :
{
  "emails": [
    { "step": 1, "label": "J-7 Teasing",         "dayOffset": "J-7", "subject": "...", "preheader": "...", "bodyText": "...", "bodyHtml": "..." },
    { "step": 2, "label": "J-3 Révélation",      "dayOffset": "J-3", "subject": "...", "preheader": "...", "bodyText": "...", "bodyHtml": "..." },
    { "step": 3, "label": "Jour J Lancement",    "dayOffset": "J0",  "subject": "...", "preheader": "...", "bodyText": "...", "bodyHtml": "..." },
    { "step": 4, "label": "J+3 Preuve sociale",  "dayOffset": "J+3", "subject": "...", "preheader": "...", "bodyText": "...", "bodyHtml": "..." },
    { "step": 5, "label": "J+7 Dernière chance", "dayOffset": "J+7", "subject": "...", "preheader": "...", "bodyText": "...", "bodyHtml": "..." }
  ]
}`;
}

function extractJson(text: string): any {
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  try { return JSON.parse(cleaned); } catch (_) {}
  const m = cleaned.match(/\{[\s\S]*\}/);
  if (m) {
    try { return JSON.parse(m[0]); } catch (_) {}
  }
  throw new Error('Réponse IA non-JSON');
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const body = (await req.json()) as Body;

    if (!body.ebookTitle || body.ebookTitle.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Titre du livre requis' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = (body.geminiApiKey || Deno.env.get('GEMINI_API_KEY') || '').trim();
    if (!apiKey || !apiKey.startsWith('AIza')) {
      return new Response(JSON.stringify({ error: 'Clé Gemini manquante ou invalide (doit commencer par AIza)' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userPrompt = buildUserPrompt(body);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { role: 'system', parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.85,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error('[launch-email-campaign] Gemini error', resp.status, errText);
      return new Response(JSON.stringify({ error: `Gemini ${resp.status}`, details: errText.slice(0, 500) }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await resp.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text || '').join('') ||
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      '';

    if (!text) {
      return new Response(JSON.stringify({ error: 'Réponse IA vide' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const parsed = extractJson(text);
    const emails: EmailOut[] = Array.isArray(parsed?.emails) ? parsed.emails : [];

    if (emails.length < 5) {
      return new Response(JSON.stringify({ error: 'Séquence incomplète', got: emails.length }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, emails }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[launch-email-campaign] error', err);
    return new Response(JSON.stringify({ error: err?.message || 'Erreur inconnue' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
