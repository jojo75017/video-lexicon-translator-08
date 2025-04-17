
/**
 * Service pour générer des images à l'aide de l'API OpenAI DALL-E
 */

export const generateImage = async (
  prompt: string, 
  size: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792',
  apiKey: string,
  model: string = 'dall-e-3',
  quality: 'standard' | 'hd' = 'hd',
  style: 'vivid' | 'natural' = 'vivid'
): Promise<string> => {
  try {
    // Amélioration du prompt pour de meilleurs résultats
    const enhancedPrompt = enhancePromptForBetterResults(prompt);
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        model: model, // 'dall-e-3' pour le modèle le plus récent
        n: 1,
        size,
        quality, // 'hd' pour haute définition
        style, // 'vivid' pour des couleurs plus vives
        response_format: 'url'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(error.error?.message || 'Erreur lors de la génération de l\'image');
    }

    const data = await response.json();
    return data.data[0].url;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

// Améliore le prompt pour obtenir de meilleurs résultats
const enhancePromptForBetterResults = (prompt: string): string => {
  // Vérifier si le prompt contient déjà des instructions de qualité
  const hasQualityInstructions = /haute qualité|haute résolution|détaillé|professional/i.test(prompt);
  
  // Ajouter des instructions de qualité si elles ne sont pas déjà présentes
  if (!hasQualityInstructions) {
    prompt = `${prompt}, haute résolution, image détaillée de qualité professionnelle`;
  }
  
  return prompt;
};

/**
 * Fonction pour générer une image à partir d'une URL (utilisée pour les tests sans clé API)
 */
export const generateImageMock = async (
  prompt: string,
  size: string
): Promise<string> => {
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Une liste d'images de test haute qualité qui peuvent être utilisées pendant le développement
  const mockImages = [
    'https://images.unsplash.com/photo-1682686581498-5e85c7228119?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1683009427540-c5bd6a32abf6?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1682687982501-1e58ab814714?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1683009427666-9c17ecf58d76?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1683009427598-9c21a169f9e5?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1682687219573-3fd75f982b77?q=80&w=2070&auto=format&fit=crop'
  ];
  
  // Choisir une image aléatoire de la liste en tenant compte du prompt
  // Si le prompt contient certains mots-clés, essayons de correspondre à une image spécifique
  if (/montagne|nature|paysage/i.test(prompt)) {
    return mockImages[0];
  } else if (/urbain|ville|building/i.test(prompt)) {
    return mockImages[1];
  } else if (/art|couleur|abstrait/i.test(prompt)) {
    return mockImages[4];
  } else if (/portrait|personne|visage/i.test(prompt)) {
    return mockImages[5];
  }
  
  // Si aucun mot-clé spécifique, choisir une image aléatoire
  return mockImages[Math.floor(Math.random() * mockImages.length)];
};

/**
 * Fonction pour rechercher des images sur Pexels
 */
export const searchPexelsAPI = async (query: string, page: number = 1, perPage: number = 10) => {
  try {
    // Cette clé est une clé démo pour Pexels
    const apiKey = "563492ad6f91700001000001b3c9c2fb1df54302850f8185e752c274";
    
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`, {
      headers: {
        Authorization: apiKey
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur Pexels: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erreur de recherche Pexels:", error);
    throw error;
  }
};

/**
 * Fonction pour récupérer les images à la une de Pexels
 */
export const getCuratedPexelsImages = async (page: number = 1, perPage: number = 10) => {
  try {
    // Cette clé est une clé démo pour Pexels
    const apiKey = "563492ad6f91700001000001b3c9c2fb1df54302850f8185e752c274";
    
    const response = await fetch(`https://api.pexels.com/v1/curated?page=${page}&per_page=${perPage}`, {
      headers: {
        Authorization: apiKey
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur Pexels: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erreur de récupération des images Pexels:", error);
    // Retourner un résultat vide en cas d'erreur
    return {
      total_results: 0,
      page: 1,
      per_page: perPage,
      photos: [],
      next_page: ""
    };
  }
};

/**
 * Fonction pour récupérer une image spécifique sur Pexels
 */
export const getPexelsPhoto = async (photoId: number) => {
  try {
    // Cette clé est une clé démo pour Pexels
    const apiKey = "563492ad6f91700001000001b3c9c2fb1df54302850f8185e752c274";
    
    const response = await fetch(`https://api.pexels.com/v1/photos/${photoId}`, {
      headers: {
        Authorization: apiKey
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur Pexels: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erreur de récupération de l'image Pexels:", error);
    throw error;
  }
};
