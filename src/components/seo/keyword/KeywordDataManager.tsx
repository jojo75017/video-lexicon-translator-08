
import React, { useState } from 'react';
import { KeywordSuggestion } from '@/types/seo/Keyword';

interface KeywordDataManagerProps {
  children: (props: {
    keyword: string;
    setKeyword: (value: string) => void;
    standardKeywords: KeywordSuggestion[];
    longTailKeywords: KeywordSuggestion[];
    intelligentKeywords: KeywordSuggestion[];
    competitorKeywords: KeywordSuggestion[];
    selectedKeywords: string[];
    allKeywords: KeywordSuggestion[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
    generateStandardKeywords: () => void;
    handleIntelligentKeywords: (keywords: KeywordSuggestion[]) => void;
    handleCompetitorKeywords: (keywords: string[]) => void;
    toggleKeywordSelection: (kw: string) => void;
    clearSelectedKeywords: () => void;
    exportSelectedKeywords: () => void;
    isGenerating: boolean;
  }) => React.ReactNode;
}

const KeywordDataManager: React.FC<KeywordDataManagerProps> = ({ children }) => {
  const [keyword, setKeyword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [standardKeywords, setStandardKeywords] = useState<KeywordSuggestion[]>([]);
  const [longTailKeywords, setLongTailKeywords] = useState<KeywordSuggestion[]>([]);
  const [intelligentKeywords, setIntelligentKeywords] = useState<KeywordSuggestion[]>([]);
  const [competitorKeywords, setCompetitorKeywords] = useState<KeywordSuggestion[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('standard');

  const generateStandardKeywords = () => {
    if (!keyword.trim()) return;
    
    setIsGenerating(true);
    console.log('Generating keywords for:', keyword);
    
    setTimeout(() => {
      const mockStandard: KeywordSuggestion[] = [
        {
          keyword: keyword,
          volume: Math.floor(Math.random() * 5000) + 1000,
          difficulty: Math.floor(Math.random() * 70) + 30,
          cpc: parseFloat((Math.random() * 2 + 0.5).toFixed(2)),
          competition: parseFloat((Math.random() * 0.7).toFixed(2)),
          intent: 'navigational',
          type: 'standard',
          relevance: 95
        },
        {
          keyword: `${keyword} pas cher`,
          volume: Math.floor(Math.random() * 3000) + 500,
          difficulty: Math.floor(Math.random() * 60) + 20,
          cpc: parseFloat((Math.random() * 1.8 + 0.3).toFixed(2)),
          competition: parseFloat((Math.random() * 0.6).toFixed(2)),
          intent: 'transactional',
          type: 'standard',
          relevance: 85
        },
        {
          keyword: `meilleur ${keyword}`,
          volume: Math.floor(Math.random() * 2500) + 400,
          difficulty: Math.floor(Math.random() * 65) + 25,
          cpc: parseFloat((Math.random() * 2.2 + 0.4).toFixed(2)),
          competition: parseFloat((Math.random() * 0.75).toFixed(2)),
          intent: 'commercial',
          type: 'standard',
          relevance: 90
        }
      ];

      const mockLongTail: KeywordSuggestion[] = [
        {
          keyword: `comment choisir ${keyword} pour débutant`,
          volume: Math.floor(Math.random() * 800) + 100,
          difficulty: Math.floor(Math.random() * 30) + 10,
          cpc: parseFloat((Math.random() * 1 + 0.2).toFixed(2)),
          competition: parseFloat((Math.random() * 0.4).toFixed(2)),
          intent: 'informational',
          type: 'long-tail',
          relevance: 80
        },
        {
          keyword: `où acheter ${keyword} pas cher en ligne`,
          volume: Math.floor(Math.random() * 600) + 80,
          difficulty: Math.floor(Math.random() * 25) + 8,
          cpc: parseFloat((Math.random() * 0.8 + 0.15).toFixed(2)),
          competition: parseFloat((Math.random() * 0.35).toFixed(2)),
          intent: 'transactional',
          type: 'long-tail',
          relevance: 75
        },
        {
          keyword: `guide complet ${keyword} étape par étape`,
          volume: Math.floor(Math.random() * 400) + 50,
          difficulty: Math.floor(Math.random() * 20) + 5,
          cpc: parseFloat((Math.random() * 0.6 + 0.1).toFixed(2)),
          competition: parseFloat((Math.random() * 0.3).toFixed(2)),
          intent: 'informational',
          type: 'long-tail',
          relevance: 85
        }
      ];

      console.log('Generated standard keywords:', mockStandard.length);
      console.log('Generated long-tail keywords:', mockLongTail.length);

      setStandardKeywords(mockStandard);
      setLongTailKeywords(mockLongTail);
      setActiveTab('standard'); // Reset to standard tab
      setIsGenerating(false);
    }, 2000);
  };

  const handleIntelligentKeywords = (keywords: KeywordSuggestion[]) => {
    setIntelligentKeywords(keywords);
  };

  const handleCompetitorKeywords = (keywords: string[]) => {
    const competitorKws: KeywordSuggestion[] = keywords.map(kw => ({
      keyword: kw,
      volume: Math.floor(Math.random() * 2000) + 300,
      difficulty: Math.floor(Math.random() * 50) + 20,
      cpc: parseFloat((Math.random() * 1.5 + 0.3).toFixed(2)),
      competition: parseFloat((Math.random() * 0.6).toFixed(2)),
      intent: 'commercial',
      type: 'competitor',
      relevance: 70
    }));
    setCompetitorKeywords(competitorKws);
  };

  const toggleKeywordSelection = (kw: string) => {
    console.log('Toggling keyword selection:', kw);
    setSelectedKeywords(prev => 
      prev.includes(kw) 
        ? prev.filter(k => k !== kw)
        : [...prev, kw]
    );
  };

  const clearSelectedKeywords = () => {
    setSelectedKeywords([]);
  };

  const exportSelectedKeywords = () => {
    if (selectedKeywords.length === 0) return;
    
    const dataStr = selectedKeywords.join('\n');
    const dataBlob = new Blob([dataStr], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mots-cles-selectionnes.txt';
    link.click();
  };

  const allKeywords = [
    ...standardKeywords,
    ...longTailKeywords,
    ...intelligentKeywords,
    ...competitorKeywords
  ];

  return (
    <>
      {children({
        keyword,
        setKeyword,
        standardKeywords,
        longTailKeywords,
        intelligentKeywords,
        competitorKeywords,
        selectedKeywords,
        allKeywords,
        activeTab,
        setActiveTab,
        generateStandardKeywords,
        handleIntelligentKeywords,
        handleCompetitorKeywords,
        toggleKeywordSelection,
        clearSelectedKeywords,
        exportSelectedKeywords,
        isGenerating
      })}
    </>
  );
};

export default KeywordDataManager;
