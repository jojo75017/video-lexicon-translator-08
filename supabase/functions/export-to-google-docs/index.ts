import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const serviceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');
    if (!serviceAccountKey) {
      return new Response(
        JSON.stringify({ error: 'Clé de compte de service Google non configurée' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const credentials = JSON.parse(serviceAccountKey);

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

    // Préparer les requêtes pour ajouter le contenu
    const requests = [];
    
    // Ajouter le titre
    requests.push({
      insertText: {
        location: { index: 1 },
        text: `${title}\n\n`,
      },
    });

    // Ajouter l'auteur si fourni
    if (authorName) {
      requests.push({
        insertText: {
          location: { index: 1 },
          text: `Par ${authorName}\n\n`,
        },
      });
    }

    // Ajouter le contenu
    requests.push({
      insertText: {
        location: { index: 1 },
        text: content,
      },
    });

    // Styliser le titre
    requests.push({
      updateParagraphStyle: {
        range: {
          startIndex: 1,
          endIndex: title.length + 1,
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
