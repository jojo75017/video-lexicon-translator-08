import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { title, context, style, preset, folder, openrouterKey } = await req.json();
    if (!title) {
      return new Response(JSON.stringify({ error: 'title requis' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Si l'abonné fournit sa clé OpenRouter (sk-or-...), on route vers OpenRouter
    // sinon on utilise Lovable AI Gateway (crédits Lovable).
    const useOpenRouter = typeof openrouterKey === 'string' && openrouterKey.trim().startsWith('sk-or-');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!useOpenRouter && !LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY manquante' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const PRESETS: Record<string, string> = {
      'hatier-school':
        'Vibrant educational illustration in the style of a modern Hatier school workbook. Friendly cartoon mascot character (a young teacher or curious student) demonstrating the concept with visual metaphors, colorful speech bubbles, bright banners with arrows, playful didactic scene, energetic and dynamic composition, hand-drawn cartoon style with confident inked outlines, rich saturated colors (orange #FF9E2D, teal #008296, sunny yellow, deep purple), white background with bold colored accent shapes and curved ribbons, suitable for ages 10-17, engaging and motivating. No text, no letters, no numbers, no words in the image.',
      'soft-planner':
        'Soft pastel watercolor planner illustration, hand-drawn, minimalist, light and airy, white background, no text, clean composition for low-content KDP book.',
      'flat-clean':
        'Clean educational illustration, flat vector style, bright friendly colors, white background, simple shapes, clear lines, suitable for a school workbook or planner. No text in the image. High readability, pedagogical clarity.',
    };

    const baseStyle = style || PRESETS[preset as string] || PRESETS['hatier-school'];

    const prompt = `${baseStyle}\n\nSubject: ${title}.${context ? ` Context: ${context}.` : ''}\n\nStrict rules: NO text, NO letters, NO numbers, NO words, NO writing of any kind in the image. Only pure illustration.`;

    console.log('[generate-educational-image] Generating:', title);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        messages: [{ role: 'user', content: prompt }],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const txt = await response.text();
      console.error('Image gen error:', txt);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Limite atteinte, réessayez plus tard' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Crédits IA épuisés' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      throw new Error('Erreur génération image');
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!imageUrl) throw new Error('Aucune image générée');

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    const safeTitle = title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '-').substring(0, 40);
    const fileName = `${folder || 'educational'}/${Date.now()}-${safeTitle}.png`;

    const { error: uploadError } = await supabase.storage.from('ebook-images').upload(fileName, imageBuffer, {
      contentType: 'image/png', upsert: true
    });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(JSON.stringify({ imageUrl }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { data: publicUrlData } = supabase.storage.from('ebook-images').getPublicUrl(fileName);
    return new Response(JSON.stringify({ imageUrl: publicUrlData.publicUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Erreur inconnue' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
