
import { useState, useEffect } from 'react';
import { OpenAICompetitorService } from '@/services/openaiCompetitorService';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { toast } from 'sonner';

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

  // Initialize service
  const getService = () => {
    const key = apiKey || localStorage.getItem('openaiKey') || '';
    if (!key) throw new Error('Clé API OpenAI non configurée');
    return OpenAICompetitorService.createService(key);
  };

  // Validate API key
  const validateApiKey = async () => {
    try {
      if (!apiKey) {
        toast.error('Veuillez entrer une clé API OpenAI');
        return false;
      }

      const service = OpenAICompetitorService.createService(apiKey);
      const isValid = await service.validateApiKey();

      if (isValid) {
        localStorage.setItem('openaiKey', apiKey);
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

  // Generate example keywords based on the provided keyword
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
          const service = getService();
          const { competitors, serps } = await service.getCompetitorData(searchKeyword);
          setCompetitors(competitors || []);
          setSerpResults(serps || []);
          setShowCompetitors(competitors && competitors.length > 0);
        } catch (err) {
          console.error('Erreur lors de la récupération des données concurrentielles:', err);
          // We don't fail the entire operation if competitor data fails
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

  // Generate standard keywords (without API, just examples)
  const generateStandardKeywords = (baseKeyword: string): KeywordSuggestion[] => {
    const keywords = [
      { keyword: baseKeyword, volume: Math.floor(Math.random() * 5000) + 1000, difficulty: Math.floor(Math.random() * 50) + 30 },
      { keyword: `meilleur ${baseKeyword}`, volume: Math.floor(Math.random() * 3000) + 500, difficulty: Math.floor(Math.random() * 40) + 40 },
      { keyword: `${baseKeyword} pas cher`, volume: Math.floor(Math.random() * 2500) + 800, difficulty: Math.floor(Math.random() * 40) + 35 },
      { keyword: `${baseKeyword} avis`, volume: Math.floor(Math.random() * 2000) + 700, difficulty: Math.floor(Math.random() * 30) + 30 },
      { keyword: `comparatif ${baseKeyword}`, volume: Math.floor(Math.random() * 1800) + 600, difficulty: Math.floor(Math.random() * 50) + 40 },
      { keyword: `acheter ${baseKeyword}`, volume: Math.floor(Math.random() * 1500) + 800, difficulty: Math.floor(Math.random() * 50) + 45 },
      { keyword: `${baseKeyword} professionnel`, volume: Math.floor(Math.random() * 1200) + 400, difficulty: Math.floor(Math.random() * 60) + 30 },
      { keyword: `prix ${baseKeyword}`, volume: Math.floor(Math.random() * 1000) + 500, difficulty: Math.floor(Math.random() * 40) + 30 },
      { keyword: `${baseKeyword} en ligne`, volume: Math.floor(Math.random() * 900) + 400, difficulty: Math.floor(Math.random() * 45) + 35 },
      { keyword: `top ${baseKeyword}`, volume: Math.floor(Math.random() * 800) + 300, difficulty: Math.floor(Math.random() * 40) + 40 }
    ];

    return keywords.map(k => ({
      keyword: k.keyword,
      volume: k.volume,
      difficulty: k.difficulty,
      cpc: parseFloat((Math.random() * 2 + 0.5).toFixed(2)),
      competition: parseFloat((Math.random() * 0.8).toFixed(2)),
      suggestedTitle: `${k.keyword.charAt(0).toUpperCase() + k.keyword.slice(1)} - Guide complet et conseils`,
      suggestedDescription: `Découvrez tout sur ${k.keyword}. Conseils d'experts, astuces pratiques et guide complet pour vous aider.`
    }));
  };

  // Generate long-tail keywords (without API, just examples)
  const generateLongTailKeywords = (baseKeyword: string): KeywordSuggestion[] => {
    const keywords = [
      { keyword: `comment choisir le meilleur ${baseKeyword}`, volume: Math.floor(Math.random() * 800) + 200, difficulty: Math.floor(Math.random() * 30) + 20 },
      { keyword: `où trouver un ${baseKeyword} pas cher`, volume: Math.floor(Math.random() * 700) + 150, difficulty: Math.floor(Math.random() * 25) + 25 },
      { keyword: `${baseKeyword} pour débutant guide complet`, volume: Math.floor(Math.random() * 600) + 100, difficulty: Math.floor(Math.random() * 25) + 20 },
      { keyword: `quels sont les avantages d'un ${baseKeyword}`, volume: Math.floor(Math.random() * 500) + 100, difficulty: Math.floor(Math.random() * 20) + 15 },
      { keyword: `${baseKeyword} comparatif des meilleurs modèles`, volume: Math.floor(Math.random() * 450) + 150, difficulty: Math.floor(Math.random() * 35) + 25 },
      { keyword: `comment utiliser efficacement un ${baseKeyword}`, volume: Math.floor(Math.random() * 400) + 100, difficulty: Math.floor(Math.random() * 25) + 15 },
      { keyword: `quel est le prix moyen d'un ${baseKeyword}`, volume: Math.floor(Math.random() * 350) + 80, difficulty: Math.floor(Math.random() * 20) + 20 },
      { keyword: `${baseKeyword} professionnel ou amateur différences`, volume: Math.floor(Math.random() * 300) + 70, difficulty: Math.floor(Math.random() * 30) + 25 },
      { keyword: `${baseKeyword} les erreurs à éviter absolument`, volume: Math.floor(Math.random() * 250) + 50, difficulty: Math.floor(Math.random() * 25) + 15 },
      { keyword: `comment entretenir son ${baseKeyword} conseils pratiques`, volume: Math.floor(Math.random() * 200) + 50, difficulty: Math.floor(Math.random() * 20) + 10 }
    ];

    return keywords.map(k => ({
      keyword: k.keyword,
      volume: k.volume,
      difficulty: k.difficulty,
      cpc: parseFloat((Math.random() * 1 + 0.3).toFixed(2)),
      competition: parseFloat((Math.random() * 0.5).toFixed(2)),
      suggestedTitle: `${k.keyword.charAt(0).toUpperCase() + k.keyword.slice(1)} | Guide étape par étape`,
      suggestedDescription: `Découvrez comment ${k.keyword}. Nos conseils d'experts vous guideront dans toutes les étapes.`
    }));
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
