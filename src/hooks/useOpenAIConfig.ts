import { useState, useEffect } from 'react';
import { validateOpenAIApiKey } from '@/services/openai/openaiApiUtils';
import { 
  isValidApiKeyFormat, 
  maskApiKey, 
  getApiKeySecurityWarning 
} from '@/utils/security/secureStorage';

const GEMINI_API_KEY = 'openai_api_key'; // Keep same localStorage key for backward compat
const GEMINI_MODEL = 'openai_model';

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
    const savedApiKey = localStorage.getItem(GEMINI_API_KEY);
    const savedModel = localStorage.getItem(GEMINI_MODEL);
    
    if (savedApiKey) {
      // Accept both sk- (legacy OpenAI) and AIza (Gemini) format keys
      const isValidFormat = isValidApiKeyFormat(savedApiKey, 'AIza') || isValidApiKeyFormat(savedApiKey, 'sk-');
      if (isValidFormat) {
        setApiKey(savedApiKey);
        logSecurityWarning();
        setTimeout(() => validateApiKey(savedApiKey), 100);
      } else {
        console.warn('[Security] Stored API key has invalid format, removing.');
        localStorage.removeItem(GEMINI_API_KEY);
      }
    }
    if (savedModel) {
      setModel(savedModel);
    }
  }, []);

  const updateApiKey = async (newApiKey: string) => {
    setApiKey(newApiKey);
    setIsValid(null);
    
    if (newApiKey) {
      const isValidFormat = isValidApiKeyFormat(newApiKey, 'AIza') || isValidApiKeyFormat(newApiKey, 'sk-');
      if (!isValidFormat) {
        console.warn('[Security] API key has invalid format');
        setIsValid(false);
        return;
      }
      
      localStorage.setItem(GEMINI_API_KEY, newApiKey);
      logSecurityWarning();
      
      if (!securityWarningShown) {
        setSecurityWarningShown(true);
      }
      
      await validateApiKey(newApiKey);
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

    const isValidFormat = isValidApiKeyFormat(key, 'AIza') || isValidApiKeyFormat(key, 'sk-');
    if (!isValidFormat) {
      setIsValid(false);
      return false;
    }

    setIsValidating(true);
    try {
      const isValidKey = await validateOpenAIApiKey(key, model);
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
