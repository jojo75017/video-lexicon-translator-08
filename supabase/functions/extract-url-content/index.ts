import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExtractRequest {
  youtubeUrl?: string;
  articleUrl?: string;
  websiteUrl?: string;
}

interface ExtractedContent {
  youtube?: { title: string; content: string; url: string };
  article?: { title: string; content: string; url: string };
  website?: { title: string; content: string; url: string };
}

// Extraire l'ID YouTube depuis une URL
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Récupérer la transcription YouTube via une API tierce
async function getYouTubeTranscript(videoId: string): Promise<{ title: string; content: string } | null> {
  try {
    // Utiliser l'API YouTube oEmbed pour le titre
    const oembedResponse = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    let title = "Vidéo YouTube";
    if (oembedResponse.ok) {
      const oembedData = await oembedResponse.json();
      title = oembedData.title || title;
    }

    // Pour la transcription, on utilise Firecrawl sur la page YouTube
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (firecrawlApiKey) {
      const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${firecrawlApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: `https://www.youtube.com/watch?v=${videoId}`,
          formats: ['markdown'],
          onlyMainContent: true,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const markdown = data.data?.markdown || data.markdown || "";
        
        // Extraire le contenu pertinent
        return {
          title,
          content: markdown.slice(0, 15000) // Limiter la taille
        };
      }
    }

    return { title, content: `[Transcription non disponible pour la vidéo: ${title}]` };
  } catch (error) {
    console.error("Erreur YouTube:", error);
    return null;
  }
}

// Scraper une URL avec Firecrawl
async function scrapeUrl(url: string): Promise<{ title: string; content: string } | null> {
  const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
  
  if (!firecrawlApiKey) {
    console.error("FIRECRAWL_API_KEY non configurée");
    return null;
  }

  try {
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    console.log("Scraping URL:", formattedUrl);

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: formattedUrl,
        formats: ['markdown'],
        onlyMainContent: true,
        waitFor: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur Firecrawl:", response.status, errorText);
      return null;
    }

    const data = await response.json();
    const markdown = data.data?.markdown || data.markdown || "";
    const title = data.data?.metadata?.title || data.metadata?.title || "Article";

    return {
      title,
      content: markdown.slice(0, 20000) // Limiter à 20k caractères
    };
  } catch (error) {
    console.error("Erreur scraping:", error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { youtubeUrl, articleUrl, websiteUrl }: ExtractRequest = await req.json();

    // Vérifier qu'au moins une URL est fournie
    if (!youtubeUrl && !articleUrl && !websiteUrl) {
      return new Response(
        JSON.stringify({ success: false, error: "Au moins une URL est requise" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const extractedContent: ExtractedContent = {};
    const errors: string[] = [];

    // Traiter les URLs en parallèle
    const promises: Promise<void>[] = [];

    if (youtubeUrl) {
      promises.push((async () => {
        const videoId = extractYouTubeId(youtubeUrl);
        if (videoId) {
          const result = await getYouTubeTranscript(videoId);
          if (result) {
            extractedContent.youtube = { ...result, url: youtubeUrl };
          } else {
            errors.push("Impossible d'extraire le contenu YouTube");
          }
        } else {
          errors.push("URL YouTube invalide");
        }
      })());
    }

    if (articleUrl) {
      promises.push((async () => {
        const result = await scrapeUrl(articleUrl);
        if (result) {
          extractedContent.article = { ...result, url: articleUrl };
        } else {
          errors.push("Impossible d'extraire l'article");
        }
      })());
    }

    if (websiteUrl) {
      promises.push((async () => {
        const result = await scrapeUrl(websiteUrl);
        if (result) {
          extractedContent.website = { ...result, url: websiteUrl };
        } else {
          errors.push("Impossible d'extraire le site web");
        }
      })());
    }

    await Promise.all(promises);

    // Vérifier si au moins un contenu a été extrait
    const hasContent = Object.keys(extractedContent).length > 0;

    if (!hasContent) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Aucun contenu n'a pu être extrait",
          details: errors 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Contenu extrait avec succès:", Object.keys(extractedContent));

    return new Response(
      JSON.stringify({ 
        success: true, 
        content: extractedContent,
        warnings: errors.length > 0 ? errors : undefined
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Erreur extract-url-content:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
