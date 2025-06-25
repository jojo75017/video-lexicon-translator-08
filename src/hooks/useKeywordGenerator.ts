
import { useState } from 'react';
import { KeywordSuggestion } from '@/types/seo/Keyword';

export const useKeywordGenerator = () => {
  const [keywords, setKeywords] = useState<KeywordSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateKeywords = async (seedKeyword: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      const mockKeywords: KeywordSuggestion[] = [
        {
          keyword: `${seedKeyword} guide`,
          volume: 1200,
          difficulty: 45,
          cpc: 1.23,
          type: 'standard',
          intent: 'informational',
          opportunity: 75
        },
        {
          keyword: `meilleur ${seedKeyword}`,
          volume: 950,
          difficulty: 52,
          cpc: 2.15,
          type: 'standard',
          intent: 'commercial',
          opportunity: 68
        },
        {
          keyword: `${seedKeyword} prix`,
          volume: 800,
          difficulty: 38,
          cpc: 1.87,
          type: 'standard',
          intent: 'commercial',
          opportunity: 82
        },
        {
          keyword: `comment ${seedKeyword}`,
          volume: 650,
          difficulty: 33,
          cpc: 0.95,
          type: 'question',
          intent: 'informational',
          opportunity: 79
        },
        {
          keyword: `${seedKeyword} avis`,
          volume: 420,
          difficulty: 29,
          cpc: 1.45,
          type: 'standard',
          intent: 'commercial',
          opportunity: 73
        }
      ];
      
      setKeywords(mockKeywords);
    } catch (error) {
      console.error('Error generating keywords:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    keywords,
    isLoading,
    generateKeywords
  };
};
