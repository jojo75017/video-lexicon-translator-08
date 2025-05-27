
import { useState, useCallback } from 'react';
import { PerplexityService } from '@/services/perplexityService';

export const usePerplexityKeywords = () => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateKeywords = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await PerplexityService.generateKeywords(query);
      setKeywords(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    keywords,
    loading,
    error,
    generateKeywords
  };
};
