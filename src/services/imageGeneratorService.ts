
/**
 * Service pour générer des images à l'aide de l'API OpenAI DALL-E
 */

export const generateImage = async (
  prompt: string, 
  size: '256x256' | '512x512' | '1024x1024',
  apiKey: string
): Promise<string> => {
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size,
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

/**
 * Fonction pour générer une image à partir d'une URL (utilisée pour les tests sans clé API)
 */
export const generateImageMock = async (
  prompt: string,
  size: string
): Promise<string> => {
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Une liste d'images de test qui peuvent être utilisées pendant le développement
  const mockImages = [
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2073&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?q=80&w=2064&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?q=80&w=2073&auto=format&fit=crop'
  ];
  
  // Choisir une image aléatoire de la liste
  return mockImages[Math.floor(Math.random() * mockImages.length)];
};
