
import { useState } from 'react';
import { type KeywordSuggestion } from '@/types/seo';

const useKeywordGenerator = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [language, setLanguage] = useState<string>('fr');
  const [generatedKeywords, setGeneratedKeywords] = useState<KeywordSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('title');

  // Generate keyword suggestions
  const generateSuggestions = async () => {
    if (!keyword.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // This is a mockup function that would typically make an API call
      // In a real application, this would call an actual API endpoint
      setTimeout(() => {
        const mockKeywords: KeywordSuggestion[] = [
          { keyword: `${keyword} conseils`, score: 95, volume: 1200, cpc: 0.75, competition: 0.3 },
          { keyword: `${keyword} tutoriel`, score: 87, volume: 880, cpc: 0.65, competition: 0.5 },
          { keyword: `meilleur ${keyword}`, score: 82, volume: 1500, cpc: 1.2, competition: 0.7 },
          { keyword: `${keyword} débutant`, score: 78, volume: 720, cpc: 0.55, competition: 0.4 },
          { keyword: `${keyword} guide`, score: 76, volume: 950, cpc: 0.8, competition: 0.6 },
          { keyword: `${keyword} professionnel`, score: 71, volume: 450, cpc: 1.5, competition: 0.8 },
          { keyword: `${keyword} gratuit`, score: 69, volume: 2200, cpc: 0.4, competition: 0.65 },
        ];
        
        setGeneratedKeywords(mockKeywords);
        setIsGenerating(false);
      }, 1500);
    } catch (error) {
      console.error('Error generating keyword suggestions:', error);
      setIsGenerating(false);
    }
  };

  // Handle inserting title suggestion
  const handleInsertTitle = (suggestion: string) => {
    setTitle(suggestion);
  };

  // Handle inserting description suggestion
  const handleInsertDescription = (suggestion: string) => {
    setDescription(suggestion);
  };

  // Get all keywords for presentation
  const getAllKeywords = (): KeywordSuggestion[] => {
    return generatedKeywords;
  };

  return {
    keyword,
    setKeyword,
    language,
    setLanguage,
    title,
    setTitle,
    description,
    setDescription,
    generatedKeywords,
    activeTab,
    setActiveTab,
    isGenerating,
    generateSuggestions,
    handleInsertTitle,
    handleInsertDescription,
    getAllKeywords
  };
};

export default useKeywordGenerator;
