import { useState, useCallback } from 'react';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { CompetitorData } from '@/types/seo';

export const useKeywordGenerator = () => {
  const [keywords, setKeywords] = useState<KeywordSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateKeywords = useCallback(async (mainKeyword: string) => {
    setLoading(true);
    setError(null);

    try {
      // Simulation de génération de mots-clés
      const generatedKeywords: KeywordSuggestion[] = [
        {
          keyword: mainKeyword,
          volume: Math.floor(Math.random() * 5000) + 1000,
          difficulty: Math.floor(Math.random() * 70) + 30,
          cpc: parseFloat((Math.random() * 2 + 0.5).toFixed(2)),
          competition: parseFloat((Math.random() * 0.7).toFixed(2)),
          intent: 'informational',
          relevance: 95
        },
        {
          keyword: `${mainKeyword} tutoriel`,
          volume: Math.floor(Math.random() * 2500) + 500,
          difficulty: Math.floor(Math.random() * 50) + 20,
          cpc: parseFloat((Math.random() * 1.5 + 0.3).toFixed(2)),
          competition: parseFloat((Math.random() * 0.5).toFixed(2)),
          intent: 'informational',
          relevance: 80
        },
        {
          keyword: `comment utiliser ${mainKeyword}`,
          volume: Math.floor(Math.random() * 1800) + 300,
          difficulty: Math.floor(Math.random() * 40) + 10,
          cpc: parseFloat((Math.random() * 1.2 + 0.1).toFixed(2)),
          competition: parseFloat((Math.random() * 0.4).toFixed(2)),
          intent: 'informational',
          relevance: 75
        },
        {
          keyword: `acheter ${mainKeyword}`,
          volume: Math.floor(Math.random() * 3000) + 800,
          difficulty: Math.floor(Math.random() * 60) + 40,
          cpc: parseFloat((Math.random() * 2.8 + 0.8).toFixed(2)),
          competition: parseFloat((Math.random() * 0.8).toFixed(2)),
          intent: 'transactional',
          relevance: 90
        },
        {
          keyword: `prix ${mainKeyword}`,
          volume: Math.floor(Math.random() * 2200) + 400,
          difficulty: Math.floor(Math.random() * 55) + 35,
          cpc: parseFloat((Math.random() * 2.2 + 0.6).toFixed(2)),
          competition: parseFloat((Math.random() * 0.6).toFixed(2)),
          intent: 'transactional',
          relevance: 85
        }
      ];

      setKeywords(generatedKeywords);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
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
