
import { useState, useEffect } from 'react';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { toast } from 'sonner';

// Mock data for keyword suggestions
const mockKeywordSuggestions = (baseKeyword: string): KeywordSuggestion[] => {
  const prefixes = ['comment', 'pourquoi', 'meilleur', 'top', 'guide'];
  const suffixes = ['gratuit', 'en ligne', 'pas cher', 'professionnel', 'rapide', 'facile'];
  
  const suggestions: KeywordSuggestion[] = [];
  
  // Add variations with prefixes
  prefixes.forEach(prefix => {
    suggestions.push({
      keyword: `${prefix} ${baseKeyword}`,
      volume: Math.floor(Math.random() * 10000),
      competition: Math.random(),
      cpc: Math.random() * 2,
      difficulty: Math.floor(Math.random() * 100),
      trend: Array(12).fill(0).map(() => Math.floor(Math.random() * 100)),
      type: Math.random() > 0.5 ? 'standard' : 'long-tail'
    });
  });
  
  // Add variations with suffixes
  suffixes.forEach(suffix => {
    suggestions.push({
      keyword: `${baseKeyword} ${suffix}`,
      volume: Math.floor(Math.random() * 10000),
      competition: Math.random(),
      cpc: Math.random() * 2,
      difficulty: Math.floor(Math.random() * 100),
      trend: Array(12).fill(0).map(() => Math.floor(Math.random() * 100)),
      type: Math.random() > 0.5 ? 'standard' : 'long-tail'
    });
  });
  
  // Add some related keywords
  const relatedKeywords = [
    'formation professionnelle',
    'apprentissage',
    'cours en ligne',
    'tutoriel',
    'certification'
  ];
  
  relatedKeywords.forEach(related => {
    if (!related.includes(baseKeyword) && !baseKeyword.includes(related)) {
      suggestions.push({
        keyword: related,
        volume: Math.floor(Math.random() * 10000),
        competition: Math.random(),
        cpc: Math.random() * 2,
        difficulty: Math.floor(Math.random() * 100),
        trend: Array(12).fill(0).map(() => Math.floor(Math.random() * 100)),
        type: Math.random() > 0.5 ? 'standard' : 'long-tail'
      });
    }
  });
  
  // Sort by volume descending
  return suggestions.sort((a, b) => (b.volume || 0) - (a.volume || 0));
};

export const useKeywordGenerator = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [language, setLanguage] = useState<string>('fr');
  const [searchVolume, setSearchVolume] = useState<string>('all');
  const [competition, setCompetition] = useState<string>('all');
  const [keywordSuggestions, setKeywordSuggestions] = useState<KeywordSuggestion[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Generate keywords based on input
  const generateKeywords = async () => {
    if (!keyword) {
      setError('Veuillez entrer un mot-clé');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real application, you would make an API call here
      // For now, we'll use mock data
      setTimeout(() => {
        const suggestions = mockKeywordSuggestions(keyword);
        setKeywordSuggestions(suggestions);
        setLoading(false);
        toast.success(`${suggestions.length} suggestions générées`);
      }, 1000); // Shorter delay for better UX
    } catch (err) {
      setError('Une erreur est survenue lors de la génération des mots-clés');
      setLoading(false);
      toast.error('Échec de la génération des mots-clés');
    }
  };

  // Toggle selection of a keyword
  const selectKeyword = (keywordToToggle: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keywordToToggle)
        ? prev.filter(k => k !== keywordToToggle)
        : [...prev, keywordToToggle]
    );
  };

  // Get all keywords (for other components)
  const getAllKeywords = (): KeywordSuggestion[] => {
    return keywordSuggestions;
  };

  return {
    keyword,
    setKeyword,
    language,
    setLanguage,
    searchVolume,
    setSearchVolume,
    competition,
    setCompetition,
    keywordSuggestions,
    selectedKeywords,
    loading,
    error,
    generateKeywords,
    selectKeyword,
    getAllKeywords
  };
};
