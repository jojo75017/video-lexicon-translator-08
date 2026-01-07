import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Nettoie le texte généré des artefacts JSON et caractères échappés
function cleanGeneratedText(text: string): string {
  if (!text) return text;
  
  return text
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '')
    .replace(/\\t/g, '\t')
    .replace(/\\\//g, '/')
    .replace(/  +/g, ' ')
    .replace(/ ([.,;:!?])/g, '$1')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replace(/^\s*{\s*"[^"]+"\s*:\s*"/gm, '')
    .replace(/"\s*}\s*$/gm, '')
    .replace(/^\s*\[\s*"/gm, '')
    .replace(/"\s*\]\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Corrige la grammaire et l'orthographe d'un texte
async function correctGrammar(text: string): Promise<string> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey || !text || text.length < 50) return text;

  try {
    // Diviser en chunks de 4000 caractères max pour éviter les timeouts
    const chunks: string[] = [];
    const maxChunkSize = 4000;
    let remaining = text;
    
    while (remaining.length > 0) {
      if (remaining.length <= maxChunkSize) {
        chunks.push(remaining);
        break;
      }
      // Trouver une coupure naturelle (fin de phrase ou paragraphe)
      let cutPoint = remaining.lastIndexOf('\n\n', maxChunkSize);
      if (cutPoint < maxChunkSize / 2) cutPoint = remaining.lastIndexOf('. ', maxChunkSize);
      if (cutPoint < maxChunkSize / 2) cutPoint = maxChunkSize;
      
      chunks.push(remaining.substring(0, cutPoint + 1));
      remaining = remaining.substring(cutPoint + 1);
    }

    console.log(`📝 Correction grammaticale: ${chunks.length} chunks à traiter`);

    const correctedChunks: string[] = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`📝 Correction chunk ${i + 1}/${chunks.length} (${chunk.length} chars)`);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Tu es un correcteur professionnel. Corrige UNIQUEMENT les fautes d'orthographe et de grammaire du texte suivant. 
RÈGLES STRICTES:
- NE MODIFIE PAS le style, le ton ou le contenu
- NE REFORMULE PAS les phrases
- Conserve EXACTEMENT la mise en forme (sauts de ligne, titres, etc.)
- Retourne UNIQUEMENT le texte corrigé, sans commentaires ni explications`
            },
            { role: 'user', content: chunk }
          ],
          temperature: 0.1,
          max_tokens: 4096,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        correctedChunks.push(data.choices[0]?.message?.content || chunk);
      } else {
        console.error(`❌ Erreur correction chunk ${i + 1}:`, await response.text());
        correctedChunks.push(chunk);
      }
    }

    return correctedChunks.join('');
  } catch (error) {
    console.error('❌ Erreur correction grammaticale:', error);
    return text;
  }
}

// Extrait les URLs d'images du contenu
function extractImageUrls(content: string): { cleanContent: string; imageUrls: Array<{ position: number; url: string }> } {
  const imageUrls: Array<{ position: number; url: string }> = [];
  let cleanContent = content;
  let offset = 0;
  
  const urlRegex = /\[IMAGE_URL:(https?:\/\/[^\]]+)\]/g;
  let match;
  
  while ((match = urlRegex.exec(content)) !== null) {
    const fullMatch = match[0];
    const url = match[1];
    const position = match.index - offset;
    
    console.log(`📷 Image trouvée à position ${position}: ${url.substring(0, 100)}...`);
    imageUrls.push({ position, url });
    offset += fullMatch.length;
  }
  
  cleanContent = content
    .replace(/\[IMAGE_URL:https?:\/\/[^\]]+\]/g, '\n[IMAGE SERA INSÉRÉE ICI]\n')
    .replace(/\[IMAGE:\d+:data:image\/[^;]+;base64,[^\]]+\]/g, '\n')
    .replace(/\[IMAGE:[^\]]+\]/g, '\n')
    .replace(/\[IMAGE_REMOVED\]/g, '\n');
  
  cleanContent = cleanGeneratedText(cleanContent);
  
  return { cleanContent, imageUrls };
}

// Télécharger une image et l'uploader vers Google Drive
async function uploadImageToDrive(imageUrl: string, accessToken: string): Promise<string | null> {
  try {
    console.log(`📥 Téléchargement de l'image: ${imageUrl.substring(0, 80)}...`);
    
    // Télécharger l'image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      console.error(`❌ Impossible de télécharger l'image: ${imageResponse.status} ${imageResponse.statusText}`);
      return null;
    }
    
    const imageBlob = await imageResponse.blob();
    const contentType = imageResponse.headers.get('content-type') || 'image/png';
    console.log(`✅ Image téléchargée: ${imageBlob.size} bytes, type: ${contentType}`);
    
    // Créer les métadonnées du fichier
    const metadata = {
      name: `ebook-image-${Date.now()}.png`,
      mimeType: contentType,
    };
    
    // Créer le form data pour l'upload multipart
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const closeDelimiter = "\r\n--" + boundary + "--";
    
    const metadataPart = delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata);
    
    const arrayBuffer = await imageBlob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Construire le body manuellement
    const encoder = new TextEncoder();
    const metadataBytes = encoder.encode(metadataPart);
    const mediaHeader = encoder.encode('\r\n--' + boundary + '\r\nContent-Type: ' + contentType + '\r\n\r\n');
    const closeBytes = encoder.encode(closeDelimiter);
    
    const bodyLength = metadataBytes.length + mediaHeader.length + uint8Array.length + closeBytes.length;
    const body = new Uint8Array(bodyLength);
    
    let offset = 0;
    body.set(metadataBytes, offset); offset += metadataBytes.length;
    body.set(mediaHeader, offset); offset += mediaHeader.length;
    body.set(uint8Array, offset); offset += uint8Array.length;
    body.set(closeBytes, offset);
    
    // Upload vers Google Drive
    const uploadResponse = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: body,
      }
    );
    
    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.text();
      console.error(`❌ Erreur upload Drive: ${uploadResponse.status}`, errorData);
      return null;
    }
    
    const fileData = await uploadResponse.json();
    console.log(`✅ Image uploadée vers Drive: ${fileData.id}`);
    
    // Rendre l'image accessible publiquement
    await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileData.id}/permissions`,
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
    
    // Retourner l'URL publique de l'image Google Drive
    const publicUrl = `https://drive.google.com/uc?export=view&id=${fileData.id}`;
    console.log(`🔗 URL publique: ${publicUrl}`);
    return publicUrl;
    
  } catch (error) {
    console.error(`❌ Erreur lors de l'upload de l'image:`, error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, content, authorName } = await req.json();
    
    console.log(`📄 Export Google Docs demandé pour: "${title}"`);
    console.log(`📝 Longueur du contenu: ${content?.length || 0} caractères`);

    if (!title || !content) {
      return new Response(
        JSON.stringify({ error: 'Le titre et le contenu sont requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const serviceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');
    if (!serviceAccountKey) {
      return new Response(
        JSON.stringify({ error: 'Clé de compte de service Google non configurée' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const credentials = JSON.parse(serviceAccountKey);

    // Extraire les URLs d'images et nettoyer le contenu
    const { cleanContent, imageUrls } = extractImageUrls(content);
    console.log(`🖼️ Total images trouvées: ${imageUrls.length}`);
    if (imageUrls.length > 0) {
      console.log(`📷 URLs des images:`, imageUrls.map(i => i.url.substring(0, 60) + '...'));
    }

    // Correction grammaticale du contenu
    console.log(`📝 Début de la correction grammaticale...`);
    const correctedContent = await correctGrammar(cleanContent);
    console.log(`✅ Correction grammaticale terminée`);

    // Créer le JWT pour l'authentification Google
    const header = {
      alg: 'RS256',
      typ: 'JWT',
    };

    const now = Math.floor(Date.now() / 1000);
    const claim = {
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive',
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
      console.error('❌ Erreur d\'authentification:', tokenData);
      return new Response(
        JSON.stringify({ error: 'Erreur d\'authentification avec Google' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('✅ Authentification Google réussie');

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
      console.error('❌ Erreur de création du document:', docData);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la création du document Google Docs' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`✅ Document créé: ${documentId}`);

    // Construire le texte complet dans le bon ordre
    let fullText = `${title}\n\n`;
    let titleEndIndex = fullText.length;
    
    if (authorName) {
      fullText += `Par ${authorName}\n\n`;
    }
    
    fullText += correctedContent;

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
      console.error('❌ Erreur de mise à jour du document:', updateData);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de l\'ajout du contenu au document' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('✅ Contenu textuel ajouté');

    // Insérer les images si des URLs sont disponibles
    let imagesInserted = 0;
    let imageErrors: string[] = [];
    
    if (imageUrls.length > 0) {
      console.log(`🖼️ Début de l'insertion de ${imageUrls.length} images...`);
      
      // Récupérer la longueur actuelle du document
      const getDocResponse = await fetch(
        `https://docs.googleapis.com/v1/documents/${documentId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      
      const currentDoc = await getDocResponse.json();
      let insertIndex = 1;
      
      if (currentDoc.body?.content) {
        const lastElement = currentDoc.body.content[currentDoc.body.content.length - 1];
        if (lastElement?.endIndex) {
          insertIndex = lastElement.endIndex - 1;
        }
      }
      
      console.log(`📍 Position d'insertion des images: ${insertIndex}`);
      
      // Traiter chaque image
      for (let i = 0; i < imageUrls.length; i++) {
        const img = imageUrls[i];
        console.log(`🖼️ Traitement image ${i + 1}/${imageUrls.length}: ${img.url.substring(0, 60)}...`);
        
        try {
          // D'abord, essayer d'uploader vers Google Drive pour avoir une URL accessible
          let imageUrlToUse = img.url;
          
          // Si l'URL n'est pas de Google, on l'upload vers Drive
          if (!img.url.includes('google.com') && !img.url.includes('googleapis.com')) {
            const driveUrl = await uploadImageToDrive(img.url, accessToken);
            if (driveUrl) {
              imageUrlToUse = driveUrl;
            } else {
              console.log(`⚠️ Utilisation de l'URL originale car upload Drive échoué`);
            }
          }
          
          // Ajouter un saut de ligne avant l'image
          const addNewlineResponse = await fetch(
            `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                requests: [{
                  insertText: {
                    location: { index: insertIndex },
                    text: '\n\n',
                  },
                }],
              }),
            }
          );
          
          if (addNewlineResponse.ok) {
            insertIndex += 2;
          }
          
          // Insérer l'image
          const imageInsertResponse = await fetch(
            `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                requests: [{
                  insertInlineImage: {
                    location: { index: insertIndex },
                    uri: imageUrlToUse,
                    objectSize: {
                      width: { magnitude: 400, unit: 'PT' },
                      height: { magnitude: 300, unit: 'PT' },
                    },
                  },
                }],
              }),
            }
          );
          
          if (!imageInsertResponse.ok) {
            const imageError = await imageInsertResponse.json();
            console.error(`❌ Erreur insertion image ${i + 1}:`, JSON.stringify(imageError));
            imageErrors.push(`Image ${i + 1}: ${imageError.error?.message || 'Erreur inconnue'}`);
          } else {
            console.log(`✅ Image ${i + 1} insérée avec succès`);
            imagesInserted++;
            insertIndex += 1;
          }
          
        } catch (imgErr) {
          console.error(`❌ Exception pour image ${i + 1}:`, imgErr);
          imageErrors.push(`Image ${i + 1}: ${imgErr.message}`);
        }
      }
    }
    
    console.log(`📊 Résultat: ${imagesInserted}/${imageUrls.length} images insérées`);
    if (imageErrors.length > 0) {
      console.log(`⚠️ Erreurs: ${imageErrors.join(', ')}`);
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
        imagesInserted,
        totalImages: imageUrls.length,
        imageErrors: imageErrors.length > 0 ? imageErrors : undefined,
        message: `Document créé avec succès (${imagesInserted}/${imageUrls.length} images)`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Erreur globale:', error);
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
