import { useState, useEffect } from 'react';
import { validateOpenAIApiKey } from '@/services/openai/openaiApiUtils';
import { 
  isValidApiKeyFormat, 
  maskApiKey, 
  getApiKeySecurityWarning 
} from '@/utils/security/secureStorage';

const OPENAI_API_KEY = 'openai_api_key';
const OPENAI_MODEL = 'openai_model';

// Security: Log warning about localStorage API key storage
const logSecurityWarning = () => {
  console.warn(
    '[Security] OpenAI API key is stored in localStorage. ' +
    'This is accessible to any JavaScript code on this page. ' +
    'Avoid using this on shared or public computers.'
  );
};

export const useOpenAIConfig = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [model, setModel] = useState<string>('gpt-4.1-2025-04-14');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [securityWarningShown, setSecurityWarningShown] = useState(false);

  // Charger la configuration depuis localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem(OPENAI_API_KEY);
    const savedModel = localStorage.getItem(OPENAI_MODEL);
    
    if (savedApiKey) {
      // Security: Validate format before using
      if (isValidApiKeyFormat(savedApiKey, 'sk-')) {
        setApiKey(savedApiKey);
        logSecurityWarning();
        // Valider automatiquement la clé sauvegardée
        setTimeout(() => validateApiKey(savedApiKey), 100);
      } else {
        // Remove potentially malicious key
        console.warn('[Security] Stored API key has invalid format, removing.');
        localStorage.removeItem(OPENAI_API_KEY);
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
      // Security: Validate format before storing
      if (!isValidApiKeyFormat(newApiKey, 'sk-')) {
        console.warn('[Security] API key has invalid format');
        setIsValid(false);
        return;
      }
      
      localStorage.setItem(OPENAI_API_KEY, newApiKey);
      logSecurityWarning();
      
      // Show security warning to user once
      if (!securityWarningShown) {
        setSecurityWarningShown(true);
      }
      
      // Valider automatiquement la nouvelle clé
      await validateApiKey(newApiKey);
    } else {
      localStorage.removeItem(OPENAI_API_KEY);
    }
  };

  const updateModel = (newModel: string) => {
    setModel(newModel);
    localStorage.setItem(OPENAI_MODEL, newModel);
    setIsValid(null); // Reset validation status when model changes
  };

  const validateApiKey = async (keyToValidate?: string) => {
    const key = keyToValidate || apiKey;
    if (!key) return false;

    // Security: Pre-validate format
    if (!isValidApiKeyFormat(key, 'sk-')) {
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

  // Security: Get masked version of API key for display
  const getMaskedApiKey = () => {
    return apiKey ? maskApiKey(apiKey) : '';
  };

  // Security: Get warning message
  const getSecurityWarning = () => {
    return getApiKeySecurityWarning();
  };

  // Security: Clear stored API key
  const clearApiKey = () => {
    setApiKey('');
    setIsValid(null);
    localStorage.removeItem(OPENAI_API_KEY);
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