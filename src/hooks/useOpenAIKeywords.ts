
import { useState, useEffect } from 'react';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { toast } from 'sonner';
import { 
  generateStandardKeywords,
  generateLongTailKeywords 
} from '@/utils/keyword/keywordGeneratorUtils';
import {
  validateOpenAIApiKey,
  fetchCompetitorData,
  getOpenAIService
} from '@/utils/keyword/keywordApiUtils';
import { exportKeywordsToCSV } from '@/utils/keyword/keywordExportUtils';

export interface UseOpenAIKeywordsProps {
  defaultKeyword?: string;
  autoGenerate?: boolean;
  onSuccess?: (standardKeywords: KeywordSuggestion[], longTailKeywords: KeywordSuggestion[]) => void;
  onError?: (error: Error) => void;
}

export function useOpenAIKeywords({
  defaultKeyword = '',
  autoGenerate = false,
  onSuccess,
  onError
}: UseOpenAIKeywordsProps = {}) {
  const [keyword, setKeyword] = useState<string>(defaultKeyword);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('openaiKey') || '');
  const [isConfigured, setIsConfigured] = useState<boolean>(Boolean(localStorage.getItem('openaiKey')));
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [standardKeywords, setStandardKeywords] = useState<KeywordSuggestion[]>([]);
  const [longTailKeywords, setLongTailKeywords] = useState<KeywordSuggestion[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [serpResults, setSerpResults] = useState<any[]>([]);
  const [showCompetitors, setShowCompetitors] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Validate API key and save to localStorage if valid
  const validateApiKey = async (): Promise<boolean> => {
    try {
      const isValid = await validateOpenAIApiKey(apiKey);
      setIsConfigured(isValid);
      return isValid;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue');
      setError(error);
      onError?.(error);
      return false;
    }
  };

  // Generate keywords based on the provided keyword
  const generateKeywords = async (searchTerm?: string) => {
    const searchKeyword = searchTerm || keyword;
    if (!searchKeyword) {
      toast.error('Veuillez entrer un mot-clé');
      return;
    }

    try {
      setError(null);
      setIsGenerating(true);
      
      // Generate standard keywords
      const standardKeywordsData = generateStandardKeywords(searchKeyword);
      setStandardKeywords(standardKeywordsData);

      // Generate long-tail keywords
      const longTailKeywordsData = generateLongTailKeywords(searchKeyword);
      setLongTailKeywords(longTailKeywordsData);

      // Generate competitor data and SERP results if we have a configured API
      if (isConfigured) {
        try {
          const { competitors, serps } = await fetchCompetitorData(searchKeyword);
          setCompetitors(competitors || []);
          setSerpResults(serps || []);
          setShowCompetitors(competitors && competitors.length > 0);
        } catch (err) {
          console.error('Erreur lors de la récupération des données concurrentielles:', err);
        }
      }

      toast.success(
        `${standardKeywordsData.length + longTailKeywordsData.length} suggestions générées pour "${searchKeyword}"`
      );

      onSuccess?.(standardKeywordsData, longTailKeywordsData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue');
      console.error('Erreur lors de la génération de mots-clés:', error);
      toast.error('Échec de la génération des mots-clés');
      setError(error);
      onError?.(error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Toggle keyword selection
  const toggleKeywordSelection = (keywordText: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keywordText)
        ? prev.filter(k => k !== keywordText)
        : [...prev, keywordText]
    );
  };

  // Export keywords to CSV
  const exportSelectedKeywords = () => {
    exportKeywordsToCSV(selectedKeywords, [...standardKeywords, ...longTailKeywords], keyword);
  };

  // Toggle competitor section visibility
  const toggleCompetitors = () => {
    setShowCompetitors(!showCompetitors);
  };

  // Auto-generate on first load if needed
  useEffect(() => {
    if (autoGenerate && defaultKeyword && isConfigured && !standardKeywords.length) {
      generateKeywords(defaultKeyword);
    }
  }, [autoGenerate, defaultKeyword, isConfigured]);

  return {
    // State
    keyword,
    apiKey,
    isConfigured,
    isGenerating,
    standardKeywords,
    longTailKeywords,
    selectedKeywords,
    competitors,
    serpResults,
    showCompetitors,
    error,

    // Setters
    setKeyword,
    setApiKey,
    setSelectedKeywords,
    setShowCompetitors,

    // Actions
    validateApiKey,
    generateKeywords,
    toggleKeywordSelection,
    exportSelectedKeywords,
    toggleCompetitors,

    // Computed
    hasResults: standardKeywords.length > 0 || longTailKeywords.length > 0,
    totalKeywords: standardKeywords.length + longTailKeywords.length,
    allKeywords: [...standardKeywords, ...longTailKeywords],
    hasCompetitorData: competitors.length > 0 || serpResults.length > 0
  };
}
