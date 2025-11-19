
import { toast } from 'sonner';

/**
 * Validates an OpenAI API key by making a test request
 */
export const validateOpenAIApiKey = async (apiKey: string, model: string): Promise<boolean> => {
  try {
    toast.loading("Validation de la clé API OpenAI...", {
      id: "validate-openai-key"
    });
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // On utilise un modèle compatible pour la simple validation de clé,
        // indépendamment du modèle choisi dans l'UI.
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'This is a simple test to verify API key validity.'
          },
          {
            role: 'user',
            content: 'Say "valid"'
          }
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      toast.error("Clé API OpenAI invalide", {
        id: "validate-openai-key",
        description: `Erreur ${response.status}: ${response.statusText}`
      });
      return false;
    }

    const data = await response.json();
    const isValid = data.choices[0]?.message?.content?.toLowerCase().includes('valid');
    
    if (isValid) {
      toast.success("Clé API OpenAI validée", {
        id: "validate-openai-key"
      });
    } else {
      toast.error("Réponse OpenAI inattendue", {
        id: "validate-openai-key"
      });
    }
    
    return isValid;
  } catch (error) {
    console.error('Erreur lors de la validation de la clé OpenAI:', error);
    toast.error("Erreur de validation de la clé API", {
      id: "validate-openai-key",
      description: error instanceof Error ? error.message : "Erreur inconnue"
    });
    return false;
  }
};
