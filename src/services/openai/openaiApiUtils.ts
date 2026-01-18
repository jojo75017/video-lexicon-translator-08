
import { toast } from 'sonner';

/**
 * Validates an OpenAI API key by making a test request
 */
export const validateOpenAIApiKey = async (apiKey: string, model: string): Promise<boolean> => {
  try {
    toast.loading("Validation de la clé API OpenAI...", {
      id: "validate-openai-key"
    });
    
    // Utiliser l'endpoint /models qui ne consomme pas de tokens et ne rate-limit pas
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (response.status === 429) {
      // Rate limit atteint - la clé est valide mais temporairement bloquée
      toast.warning("Clé API valide mais limite de requêtes atteinte", {
        id: "validate-openai-key",
        description: "Attendez quelques minutes avant de réessayer"
      });
      // On considère la clé comme valide car le format est correct
      return true;
    }

    if (response.status === 401) {
      toast.error("Clé API OpenAI invalide", {
        id: "validate-openai-key",
        description: "Vérifiez votre clé API"
      });
      return false;
    }

    if (!response.ok) {
      toast.error("Erreur de validation", {
        id: "validate-openai-key",
        description: `Erreur ${response.status}: ${response.statusText}`
      });
      return false;
    }

    toast.success("Clé API OpenAI validée ✓", {
      id: "validate-openai-key"
    });
    return true;
  } catch (error) {
    console.error('Erreur lors de la validation de la clé OpenAI:', error);
    toast.error("Erreur de connexion", {
      id: "validate-openai-key",
      description: error instanceof Error ? error.message : "Erreur réseau"
    });
    return false;
  }
};
