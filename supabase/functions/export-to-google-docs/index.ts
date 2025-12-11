import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Extrait les images base64 du contenu et retourne le texte nettoyé + les infos d'images
function extractImagesFromContent(content: string): { cleanContent: string; images: Array<{ position: number; base64: string; mimeType: string }> } {
  const images: Array<{ position: number; base64: string; mimeType: string }> = [];
  let cleanContent = content;
  
  // Pattern pour détecter [IMAGE:index:data:image/xxx;base64,...]
  const imageRegex = /\[IMAGE:(\d+):(data:image\/([^;]+);base64,([^\]]+))\]/g;
  let match;
  let offset = 0;
  
  while ((match = imageRegex.exec(content)) !== null) {
    const fullMatch = match[0];
    const mimeType = `image/${match[3]}`;
    const base64Data = match[4];
    const position = match.index - offset;
    
    images.push({
      position,
      base64: base64Data,
      mimeType,
    });
    
    // Remplace le marqueur par un placeholder pour calculer les positions
    cleanContent = cleanContent.replace(fullMatch, '\n[IMG]\n');
    offset += fullMatch.length - 7; // 7 = length of '\n[IMG]\n'
  }
  
  return { cleanContent, images };
}

// Upload une image base64 vers Supabase Storage et retourne l'URL publique
async function uploadImageToStorage(
  supabase: any,
  base64Data: string,
  mimeType: string,
  index: number
): Promise<string | null> {
  try {
    // Convertir base64 en Uint8Array
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const extension = mimeType.split('/')[1] || 'png';
    const fileName = `google-docs-export/${Date.now()}-${index}.${extension}`;
    
    const { data, error } = await supabase.storage
      .from('ebook-images')
      .upload(fileName, bytes, {
        contentType: mimeType,
        upsert: true,
      });
    
    if (error) {
      console.error('Erreur upload image:', error);
      return null;
    }
    
    // Obtenir l'URL publique
    const { data: publicData } = supabase.storage
      .from('ebook-images')
      .getPublicUrl(fileName);
    
    return publicData?.publicUrl || null;
  } catch (error) {
    console.error('Erreur lors de l\'upload de l\'image:', error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, content, authorName } = await req.json();

    if (!title || !content) {
      return new Response(
        JSON.stringify({ error: 'Le titre et le contenu sont requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialiser Supabase client pour l'upload des images
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const serviceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');
    if (!serviceAccountKey) {
      return new Response(
        JSON.stringify({ error: 'Clé de compte de service Google non configurée' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const credentials = JSON.parse(serviceAccountKey);

    // Extraire les images du contenu
    const { cleanContent, images } = extractImagesFromContent(content);
    console.log(`Images trouvées: ${images.length}`);

    // Uploader les images vers Supabase Storage
    const imageUrls: Array<{ position: number; url: string }> = [];
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const url = await uploadImageToStorage(supabase, img.base64, img.mimeType, i);
      if (url) {
        imageUrls.push({ position: img.position, url });
        console.log(`Image ${i} uploadée: ${url}`);
      }
    }

    // Créer le JWT pour l'authentification Google
    const header = {
      alg: 'RS256',
      typ: 'JWT',
    };

    const now = Math.floor(Date.now() / 1000);
    const claim = {
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.file',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };

    const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const encodedClaim = btoa(JSON.stringify(claim)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const signatureInput = `${encodedHeader}.${encodedClaim}`;

    // Import la clé privée
    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      pemToBinary(credentials.private_key),
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
      },
      false,
      ['sign']
    );

    // Signer le JWT
    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      privateKey,
      new TextEncoder().encode(signatureInput)
    );

    const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    const jwt = `${signatureInput}.${encodedSignature}`;

    // Échanger le JWT contre un access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error('Erreur d\'authentification:', tokenData);
      return new Response(
        JSON.stringify({ error: 'Erreur d\'authentification avec Google' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Créer le document Google Docs
    const createDocResponse = await fetch('https://docs.googleapis.com/v1/documents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
      }),
    });

    const docData = await createDocResponse.json();
    const documentId = docData.documentId;

    if (!documentId) {
      console.error('Erreur de création du document:', docData);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la création du document Google Docs' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Construire le texte complet dans le bon ordre
    let fullText = `${title}\n\n`;
    let titleEndIndex = fullText.length;
    
    if (authorName) {
      fullText += `Par ${authorName}\n\n`;
    }
    
    // Utiliser le contenu nettoyé (sans les marqueurs base64)
    fullText += cleanContent;

    // Préparer les requêtes pour ajouter le contenu
    const requests: any[] = [];
    
    // Insérer tout le texte d'un coup
    requests.push({
      insertText: {
        location: { index: 1 },
        text: fullText,
      },
    });

    // Styliser le titre
    requests.push({
      updateParagraphStyle: {
        range: {
          startIndex: 1,
          endIndex: titleEndIndex,
        },
        paragraphStyle: {
          namedStyleType: 'TITLE',
        },
        fields: 'namedStyleType',
      },
    });

    // Ajouter le contenu au document
    const updateResponse = await fetch(
      `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requests }),
      }
    );

    const updateData = await updateResponse.json();

    if (!updateResponse.ok) {
      console.error('Erreur de mise à jour du document:', updateData);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de l\'ajout du contenu au document' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Maintenant, insérer les images aux positions [IMG]
    if (imageUrls.length > 0) {
      // Récupérer le document pour trouver les positions des [IMG]
      const getDocResponse = await fetch(
        `https://docs.googleapis.com/v1/documents/${documentId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      
      const docContent = await getDocResponse.json();
      
      // Trouver toutes les positions de [IMG] dans le document
      const imgPositions: number[] = [];
      let docText = '';
      
      if (docContent.body && docContent.body.content) {
        for (const element of docContent.body.content) {
          if (element.paragraph && element.paragraph.elements) {
            for (const textElement of element.paragraph.elements) {
              if (textElement.textRun && textElement.textRun.content) {
                const text = textElement.textRun.content;
                const startIndex = textElement.startIndex || 0;
                
                // Chercher [IMG] dans ce texte
                let searchIndex = 0;
                while (true) {
                  const imgIndex = text.indexOf('[IMG]', searchIndex);
                  if (imgIndex === -1) break;
                  imgPositions.push(startIndex + imgIndex);
                  searchIndex = imgIndex + 5;
                }
              }
            }
          }
        }
      }
      
      console.log(`Positions [IMG] trouvées: ${imgPositions.length}`);
      
      // Insérer les images en ordre inverse (pour ne pas décaler les positions)
      const imageRequests: any[] = [];
      
      // D'abord supprimer tous les [IMG] et insérer les images
      for (let i = Math.min(imgPositions.length, imageUrls.length) - 1; i >= 0; i--) {
        const pos = imgPositions[i];
        const imgUrl = imageUrls[i]?.url;
        
        if (imgUrl) {
          // Supprimer [IMG]
          imageRequests.push({
            deleteContentRange: {
              range: {
                startIndex: pos,
                endIndex: pos + 5, // [IMG] = 5 caractères
              },
            },
          });
          
          // Insérer l'image
          imageRequests.push({
            insertInlineImage: {
              location: { index: pos },
              uri: imgUrl,
              objectSize: {
                width: {
                  magnitude: 400,
                  unit: 'PT',
                },
                height: {
                  magnitude: 300,
                  unit: 'PT',
                },
              },
            },
          });
        }
      }
      
      if (imageRequests.length > 0) {
        const imageUpdateResponse = await fetch(
          `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ requests: imageRequests }),
          }
        );
        
        const imageUpdateData = await imageUpdateResponse.json();
        if (!imageUpdateResponse.ok) {
          console.error('Erreur lors de l\'insertion des images:', imageUpdateData);
        } else {
          console.log(`${imageUrls.length} images insérées avec succès`);
        }
      }
    }

    // Rendre le document accessible (permission de lecture pour tous)
    await fetch(
      `https://www.googleapis.com/drive/v3/files/${documentId}/permissions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone',
        }),
      }
    );

    const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;

    return new Response(
      JSON.stringify({
        success: true,
        documentId,
        documentUrl,
        imagesInserted: imageUrls.length,
        message: 'Document créé avec succès sur Google Docs',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erreur:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function pemToBinary(pem: string): ArrayBuffer {
  const pemHeader = '-----BEGIN PRIVATE KEY-----';
  const pemFooter = '-----END PRIVATE KEY-----';
  const pemContents = pem
    .replace(pemHeader, '')
    .replace(pemFooter, '')
    .replace(/\s/g, '');
  const binaryString = atob(pemContents);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
