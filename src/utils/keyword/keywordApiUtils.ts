
import { OpenAICompetitorService } from '@/services/openai/openaiCompetitorService';
import { toast } from 'sonner';

/**
 * Validates the OpenAI API key
 */
export const validateOpenAIApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    if (!apiKey) {
      toast.error('Veuillez entrer une clé API OpenAI');
      return false;
    }

    const service = OpenAICompetitorService.createService(apiKey);
    const isValid = await service.validateApiKey();

    if (isValid) {
      localStorage.setItem('openaiKey', apiKey);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Erreur lors de la validation de la clé API:', error);
    return false;
  }
};

/**
 * Gets the OpenAI service instance if configured
 */
export const getOpenAIService = (): OpenAICompetitorService | null => {
  const key = localStorage.getItem('openaiKey') || '';
  if (!key) return null;
  
  return OpenAICompetitorService.createService(key);
};

/**
 * Fetches competitor data and SERP results for a keyword
 */
export const fetchCompetitorData = async (keyword: string): Promise<{
  competitors: any[];
  serps: any[];
}> => {
  try {
    const service = getOpenAIService();
    if (!service) {
      return { competitors: [], serps: [] };
    }
    
    return await service.getCompetitorData(keyword);
  } catch (error) {
    console.error('Erreur lors de la récupération des données concurrentielles:', error);
    return { competitors: [], serps: [] };
  }
};
