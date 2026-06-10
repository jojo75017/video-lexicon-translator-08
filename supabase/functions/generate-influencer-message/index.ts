import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const name = String(body?.name ?? '').trim();
    const niche = String(body?.niche ?? '').trim();
    const platform = String(body?.platform ?? '').trim();
    const link = String(body?.link ?? '').trim();
    const commission = String(body?.commission ?? '20,10 €').trim();
    const commissionV3 = String(body?.commissionV3 ?? '59,10 €').trim();
    const kitUrl = String(body?.kitUrl ?? 'https://ebookstudio.fr/influenceurs').trim();

    if (!link) {
      return new Response(
        JSON.stringify({ success: false, error: 'Lien manquant.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY non configurée.');

    const prompt = `Tu es Georges, fondateur d'EbookStudio Pro (outil qui génère un ebook complet — plan, chapitres, couverture Amazon KDP, SEO — en 30 min).
Rédige un message d'approche court, chaleureux et naturel (PAS commercial agressif) pour recruter un ambassadeur affilié.

Infos :
- Influenceur : ${name || 'créateur de contenu'}
- Niche / thématique : ${niche || 'création de contenu'}
- Plateforme : ${platform || 'réseaux sociaux'}
- Offre : programme ambassadeur, 30% de commission, soit ${commission} par vente maintenant et ${commissionV3}/vente dès octobre. Pas de cash en avance, suivi automatique.
- Lien perso de suivi à intégrer tel quel : ${link}
- Kit complet (scripts vidéo + visuels) : ${kitUrl}

Contraintes :
- Français, tutoiement, ton authentique d'humain à humain.
- Fais référence concrètement à sa niche (${niche || 'son contenu'}) pour montrer que ce n'est pas un copier-coller.
- 6 à 9 lignes max, avec 1 ou 2 emojis maximum.
- Termine par une question ouverte et le lien.
- Ne mets PAS d'objet, ni de signature formelle longue. Réponds UNIQUEMENT avec le message.`;

    const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.85,
      }),
    });

    if (res.status === 429) {
      return new Response(
        JSON.stringify({ success: false, error: 'Trop de requêtes, réessaie dans un instant.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }
    if (res.status === 402) {
      return new Response(
        JSON.stringify({ success: false, error: 'Crédits IA épuisés.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Gateway error ${res.status}: ${t}`);
    }

    const data = await res.json();
    const message = data?.choices?.[0]?.message?.content?.trim() || '';

    return new Response(
      JSON.stringify({ success: true, message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('generate-influencer-message error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Erreur lors de la génération du message.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
