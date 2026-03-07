
import { toast } from 'sonner';

/**
 * Validates a Gemini API key by making a test request to Google AI Studio
 */
export const validateOpenAIApiKey = async (apiKey: string, model: string): Promise<boolean> => {
  try {
    toast.loading("Validation de la clé API Gemini...", {
      id: "validate-openai-key"
    });
    
    // Utiliser l'endpoint /models de Google AI pour valider la clé
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, {
      method: 'GET',
    });

    if (response.status === 429) {
      toast.warning("Clé API valide mais limite de requêtes atteinte", {
        id: "validate-openai-key",
        description: "Attendez quelques minutes avant de réessayer"
      });
      return true;
    }

    if (response.status === 400 || response.status === 401 || response.status === 403) {
      toast.error("Clé API Gemini invalide", {
        id: "validate-openai-key",
        description: "Vérifiez votre clé API sur aistudio.google.com"
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

    toast.success("Clé API Gemini validée ✓", {
      id: "validate-openai-key"
    });
    return true;
  } catch (error) {
    console.error('Erreur lors de la validation de la clé Gemini:', error);
    toast.error("Erreur de connexion", {
      id: "validate-openai-key",
      description: error instanceof Error ? error.message : "Erreur réseau"
    });
    return false;
  }
};
