import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { testAIProviderKey } from '@/services/aiProviderKeyTest';

const validateOpenAIApiKey = async (apiKey: string, _model: string): Promise<boolean> => {
  try {
    toast.loading("Validation de la clé API Gemini...", { id: "validate-openai-key" });
    const normalizedKey = sanitizeKey(apiKey);
    const result = await testAIProviderKey('gemini', normalizedKey);
    if (result.ok) {
      toast.success(`Clé API Gemini validée ✓${result.extra || ''}`, { id: "validate-openai-key" });
      return true;
    }
    toast.error(result.error || "Clé API Gemini rejetée", { id: "validate-openai-key" });
    return false;
  } catch {
    toast.error("Erreur de connexion", { id: "validate-openai-key" });
    return false;
  }
};
import { 
  maskApiKey, 
  getApiKeySecurityWarning 
} from '@/utils/security/secureStorage';
import { getProvider, getProviderKey, sanitizeKey, validateKeyFormat } from '@/services/aiWritingService';

const GEMINI_API_KEY = 'openai_api_key'; // Keep same localStorage key for backward compat
const GEMINI_MODEL = 'openai_model';

// Accepte les DEUX formats de clé Google : l'ancien (AIza...) et le nouveau
// format (clés Google Cloud / AI Studio qui ne commencent plus par AIza).
// On valide donc sur une base de longueur/caractères plausibles.
const isValidGeminiKey = (key: string): boolean => validateKeyFormat('gemini', key);


// Security: Log warning about localStorage API key storage
const logSecurityWarning = () => {
  console.warn(
    '[Security] Gemini API key is stored in localStorage. ' +
    'This is accessible to any JavaScript code on this page. ' +
    'Avoid using this on shared or public computers.'
  );
};

export const useOpenAIConfig = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [model, setModel] = useState<string>('gemini-2.5-flash');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [securityWarningShown, setSecurityWarningShown] = useState(false);

  // Charger la configuration depuis localStorage
  useEffect(() => {
    const savedModel = localStorage.getItem(GEMINI_MODEL);
    if (savedModel) setModel(savedModel);

    // Si l'abonné utilise un AUTRE provider (Claude / OpenAI / OpenRouter)
    // avec une clé valide, on considère la config comme valide SANS exiger
    // de clé Gemini. La clé du provider actif est exposée comme `apiKey`
    // (callGemini route automatiquement vers le bon provider).
    const provider = getProvider();
    if (provider !== 'gemini') {
      const providerKey = getProviderKey(provider);
      if (providerKey && validateKeyFormat(provider, providerKey)) {
        setApiKey(providerKey);
        setIsValid(true);
        return;
      }
    }

    // Toujours relire la clé active du gestionnaire multi-clés. Le slot legacy
    // peut contenir une ancienne clé après un changement de projet.
    const savedApiKey = getProviderKey('gemini') || localStorage.getItem(GEMINI_API_KEY);
    if (savedApiKey) {
      const normalizedSavedApiKey = sanitizeKey(savedApiKey);
      if (isValidGeminiKey(normalizedSavedApiKey)) {
        setApiKey(normalizedSavedApiKey);
        logSecurityWarning();
        // Le format valide suffit pour démarrer. Le test réseau reste informatif
        // et ne doit jamais reverrouiller un workflow sur une panne temporaire.
        setIsValid(true);
      } else {
        console.warn('[Security] Stored API key has invalid format, removing.');
        localStorage.removeItem(GEMINI_API_KEY);
      }
    }
  }, []);


  const updateApiKey = async (newApiKey: string) => {
    setApiKey(newApiKey);
    setIsValid(null);
    
    if (newApiKey) {
      const normalizedApiKey = newApiKey.trim();
      const isValidFormat = isValidGeminiKey(normalizedApiKey);
      if (!isValidFormat) {
        console.warn('[Security] API key has invalid format');
        setIsValid(false);
        return;
      }
      
      localStorage.setItem(GEMINI_API_KEY, normalizedApiKey);
      setApiKey(normalizedApiKey);
      logSecurityWarning();
      
      if (!securityWarningShown) {
        setSecurityWarningShown(true);
      }
      
      await validateApiKey(normalizedApiKey);
    } else {
      localStorage.removeItem(GEMINI_API_KEY);
    }
  };

  const updateModel = (newModel: string) => {
    setModel(newModel);
    localStorage.setItem(GEMINI_MODEL, newModel);
    setIsValid(null);
  };

  const validateApiKey = async (keyToValidate?: string) => {
    const key = keyToValidate || apiKey;
    if (!key) return false;

    const normalizedKey = sanitizeKey(key);
    const isValidFormat = isValidGeminiKey(normalizedKey);
    if (!isValidFormat) {
      setIsValid(false);
      return false;
    }

    setIsValidating(true);
    try {
      const isValidKey = await validateOpenAIApiKey(normalizedKey, model);
      setIsValid(isValidKey);
      return isValidKey;
    } catch (error) {
      setIsValid(false);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const hasValidApiKey = () => {
    return apiKey && isValid === true;
  };

  const getConfig = () => ({
    apiKey,
    model,
    hasValidKey: hasValidApiKey()
  });

  const getMaskedApiKey = () => {
    return apiKey ? maskApiKey(apiKey) : '';
  };

  const getSecurityWarning = () => {
    return getApiKeySecurityWarning();
  };

  const clearApiKey = () => {
    setApiKey('');
    setIsValid(null);
    localStorage.removeItem(GEMINI_API_KEY);
    console.log('[Security] API key cleared from storage');
  };

  return {
    apiKey,
    model,
    isValidating,
    isValid,
    updateApiKey,
    updateModel,
    validateApiKey,
    hasValidApiKey,
    getConfig,
    getMaskedApiKey,
    getSecurityWarning,
    clearApiKey,
    securityWarningShown
  };
};
