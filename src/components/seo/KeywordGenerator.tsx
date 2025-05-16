
import React, { useState } from 'react';
import { useOpenAIKeywords } from '@/hooks/useOpenAIKeywords';
import ApiConfigSection from './keyword/ApiConfigSection';
import KeywordSearchForm from './keyword/KeywordSearchForm';
import KeywordResults from './keyword/KeywordResults';
import KeywordEmptyState from './keyword/KeywordEmptyState';
import KeywordLoadingState from './keyword/KeywordLoadingState';
import KeywordFAQ from './keyword/KeywordFAQ';

const KeywordGenerator: React.FC = () => {
  const {
    keyword,
    setKeyword,
    apiKey,
    setApiKey,
    isConfigured,
    isGenerating,
    standardKeywords,
    longTailKeywords,
    selectedKeywords,
    competitors,
    serpResults,
    showCompetitors,
    
    validateApiKey,
    generateKeywords,
    toggleKeywordSelection,
    exportSelectedKeywords,
    toggleCompetitors,
    
    hasResults,
    totalKeywords,
    hasCompetitorData,
    setSelectedKeywords
  } = useOpenAIKeywords();
  
  const [showApiConfig, setShowApiConfig] = useState<boolean>(!localStorage.getItem("openaiKey"));
  const [activeTab, setActiveTab] = useState<string>("standard");
  
  const clearSelectedKeywords = () => {
    console.log("Clearing all selected keywords");
    setSelectedKeywords([]);
  };

  return (
    <div className="space-y-6">
      {showApiConfig && (
        <ApiConfigSection
          apiKey={apiKey}
          setApiKey={setApiKey}
          validateApiKey={validateApiKey}
          setShowApiConfig={setShowApiConfig}
        />
      )}
      
      <KeywordSearchForm
        keyword={keyword}
        setKeyword={setKeyword}
        isConfigured={isConfigured}
        isGenerating={isGenerating}
        hasCompetitorData={hasCompetitorData}
        showCompetitors={showCompetitors}
        generateKeywords={generateKeywords}
        setShowApiConfig={setShowApiConfig}
        toggleCompetitors={toggleCompetitors}
      />
      
      {hasResults && (
        <KeywordResults
          standardKeywords={standardKeywords}
          longTailKeywords={longTailKeywords}
          selectedKeywords={selectedKeywords}
          competitors={competitors}
          serpResults={serpResults}
          hasCompetitorData={hasCompetitorData}
          totalKeywords={totalKeywords}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          toggleKeywordSelection={toggleKeywordSelection}
          clearSelectedKeywords={clearSelectedKeywords}
          exportSelectedKeywords={exportSelectedKeywords}
        />
      )}
      
      {!hasResults && !isGenerating && <KeywordEmptyState />}
      
      {isGenerating && <KeywordLoadingState keyword={keyword} />}
      
      {/* Section FAQ - Ajoutée à la fin de la page */}
      <KeywordFAQ />
    </div>
  );
};

export default KeywordGenerator;
