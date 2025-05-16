
import { useState, useEffect } from 'react';
import { PerplexityService } from '@/services/perplexityService';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { toast } from 'sonner';

export interface UsePerplexityKeywordsProps {
  defaultKeyword?: string;
  autoGenerate?: boolean;
  onSuccess?: (standardKeywords: KeywordSuggestion[], longTailKeywords: KeywordSuggestion[]) => void;
  onError?: (error: Error) => void;
}

export function usePerplexityKeywords({
  defaultKeyword = '',
  autoGenerate = false,
  onSuccess,
  onError
}: UsePerplexityKeywordsProps = {}) {
  const [keyword, setKeyword] = useState<string>(defaultKeyword);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('perplexityKey') || '');
  const [isConfigured, setIsConfigured] = useState<boolean>(Boolean(localStorage.getItem('perplexityKey')));
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [standardKeywords, setStandardKeywords] = useState<KeywordSuggestion[]>([]);
  const [longTailKeywords, setLongTailKeywords] = useState<KeywordSuggestion[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [error, setError] = useState<Error | null>(null);

  // Initialize service
  const getService = () => {
    const key = apiKey || localStorage.getItem('perplexityKey') || '';
    if (!key) throw new Error('Clé API Perplexity non configurée');
    return PerplexityService.createService(key);
  };

  // Validate API key
  const validateApiKey = async () => {
    try {
      if (!apiKey) {
        toast.error('Veuillez entrer une clé API Perplexity');
        return false;
      }

      const service = PerplexityService.createService(apiKey);
      const isValid = await service.validateApiKey();

      if (isValid) {
        localStorage.setItem('perplexityKey', apiKey);
        setIsConfigured(true);
        return true;
      }

      return false;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue');
      setError(error);
      onError?.(error);
      return false;
    }
  };

  // Generate keywords
  const generateKeywords = async (searchTerm?: string) => {
    const searchKeyword = searchTerm || keyword;
    if (!searchKeyword) {
      toast.error('Veuillez entrer un mot-clé');
      return;
    }

    if (!isConfigured) {
      toast.error('Veuillez configurer votre clé API Perplexity');
      return;
    }

    try {
      setError(null);
      setIsGenerating(true);
      const service = getService();

      // Generate standard keywords
      const standardResults = await service.getKeywordSuggestions(searchKeyword);
      setStandardKeywords(standardResults);

      // Generate long-tail keywords
      const longTailResults = await service.getLongTailKeywords(searchKeyword);
      setLongTailKeywords(longTailResults);

      toast.success(
        `${standardResults.length + longTailResults.length} suggestions générées pour "${searchKeyword}"`
      );

      onSuccess?.(standardResults, longTailResults);
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
    if (selectedKeywords.length === 0) {
      toast.error('Aucun mot-clé sélectionné pour l\'export');
      return;
    }

    const keywordsToExport = [...standardKeywords, ...longTailKeywords]
      .filter(k => selectedKeywords.includes(k.keyword));

    const csv = [
      ['Mot-clé', 'Volume', 'Difficulté', 'CPC', 'Compétition'].join(','),
      ...keywordsToExport.map(k => [
        `"${k.keyword}"`,
        k.volume,
        k.difficulty,
        k.cpc,
        k.competition
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mots-cles-${keyword.replace(/\s+/g, '-')}.csv`);
    link.click();

    toast.success(`${keywordsToExport.length} mots-clés exportés`);
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
    error,

    // Setters
    setKeyword,
    setApiKey,
    setSelectedKeywords,

    // Actions
    validateApiKey,
    generateKeywords,
    toggleKeywordSelection,
    exportSelectedKeywords,

    // Computed
    hasResults: standardKeywords.length > 0 || longTailKeywords.length > 0,
    totalKeywords: standardKeywords.length + longTailKeywords.length,
    allKeywords: [...standardKeywords, ...longTailKeywords],
  };
}
