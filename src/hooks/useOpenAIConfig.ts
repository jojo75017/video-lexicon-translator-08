import { useState, useEffect } from 'react';
import { validateOpenAIApiKey } from '@/services/openai/openaiApiUtils';

const OPENAI_API_KEY = 'openai_api_key';
const OPENAI_MODEL = 'openai_model';

export const useOpenAIConfig = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [model, setModel] = useState<string>('gpt-4.1-2025-04-14');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  // Charger la configuration depuis localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem(OPENAI_API_KEY);
    const savedModel = localStorage.getItem(OPENAI_MODEL);
    
    if (savedApiKey) {
      setApiKey(savedApiKey);
      // Valider automatiquement la clé sauvegardée
      setTimeout(() => validateApiKey(savedApiKey), 100);
    }
    if (savedModel) {
      setModel(savedModel);
    }
  }, []);

  const updateApiKey = async (newApiKey: string) => {
    setApiKey(newApiKey);
    setIsValid(null);
    
    if (newApiKey) {
      localStorage.setItem(OPENAI_API_KEY, newApiKey);
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

  return {
    apiKey,
    model,
    isValidating,
    isValid,
    updateApiKey,
    updateModel,
    validateApiKey,
    hasValidApiKey,
    getConfig
  };
};