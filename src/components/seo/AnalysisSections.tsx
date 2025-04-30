
import React, { useState, useEffect } from 'react';
import { KeywordSuggestion } from '@/types/seo';
import { Card } from "@/components/ui/card";
import { OpenAIService } from '@/utils/seo/openaiService';
import ApiKeyConfig from './analysis/ApiKeyConfig';
import AnalysisWrapper from './analysis/AnalysisWrapper';

interface AnalysisSectionsProps {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  showCorsWarning: boolean;
  seoAnalysis: any | null;
  setSeoAnalysis: (analysis: any) => void;
  comparisonSite: string;
  setComparisonSite: (site: string) => void;
  generatedKeywords: KeywordSuggestion[];
  setGeneratedKeywords: (keywords: KeywordSuggestion[]) => void;
  generatedContent: {
    title: string;
    intro: string;
    sections: Array<{ heading: string; content: string; }>;
  } | null;
  setGeneratedContent: (content: any) => void;
  contentKeyword: string;
  mockContentIdeas: any[];
  analyzeSite: () => void;
  error: string | null;
  handleActivateProxy: () => void;
  handleContentKeywordChange: (keyword: string) => void;
  handleGeneratedKeywords: (keywords: KeywordSuggestion[]) => void;
  handleContentGenerated: (content: any) => void;
}

const AnalysisSections: React.FC<AnalysisSectionsProps> = ({
  url,
  setUrl,
  isLoading,
  showCorsWarning,
  seoAnalysis,
  comparisonSite,
  setComparisonSite,
  generatedKeywords,
  generatedContent,
  contentKeyword,
  mockContentIdeas,
  analyzeSite,
  error,
  handleActivateProxy,
  handleContentKeywordChange,
  handleGeneratedKeywords
}) => {
  // State variables for component
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [openaiKey, setOpenaiKey] = React.useState(() => localStorage.getItem('openaiKey') || '');
  const [apiKeyStatus, setApiKeyStatus] = useState<'unchecked' | 'valid' | 'invalid'>('unchecked');
  const [validationMessage, setValidationMessage] = useState<string>('');
  
  // Check API key on component load
  useEffect(() => {
    const checkApiKey = async () => {
      const apiKey = localStorage.getItem('openaiKey');
      if (!apiKey) {
        setApiKeyStatus('invalid');
        setValidationMessage("Aucune clé API configurée");
        return;
      }

      try {
        setOpenaiKey(apiKey);
        const openAIService = new OpenAIService(apiKey);
        // Try to validate API key
        OpenAIService.enableProxy();
        const isValid = await openAIService.validateApiKey();
        setApiKeyStatus(isValid ? 'valid' : 'invalid');
        
        if (isValid) {
          setValidationMessage("Clé API validée avec succès");
          // Generate suggestions automatically
          if (generatedKeywords.length === 0) {
            generateKeywordSuggestions(openAIService);
          }
        } else {
          setValidationMessage("La clé API n'a pas pu être validée");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de la clé API:", error);
        setApiKeyStatus('invalid');
        setValidationMessage("Impossible de vérifier la clé API (problème réseau)");
      }
    };
    
    checkApiKey();
  }, []);
  
  const generateKeywordSuggestions = async (openAIService: OpenAIService) => {
    try {
      // Use a default keyword for the first generation
      const defaultKeyword = "référencement";
      const newKeywords = await openAIService.getKeywordSuggestions(defaultKeyword);
      
      if (handleGeneratedKeywords) {
        handleGeneratedKeywords(newKeywords);
      }
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
    }
  };
  
  const handleGenerateMore = () => {
    if (!openaiKey) {
      return;
    }
    
    // Call to API to generate new suggestions
    const openAIService = new OpenAIService(openaiKey);
    OpenAIService.enableProxy();
    
    // Example with a default keyword if none is defined
    const keyword = generatedKeywords.length > 0 
      ? generatedKeywords[0].keyword 
      : "référencement";
      
    openAIService.getKeywordSuggestions(keyword)
      .then(newKeywords => {
        if (handleGeneratedKeywords) {
          handleGeneratedKeywords(newKeywords);
        }
      })
      .catch(error => {
        console.error("Erreur lors de la génération:", error);
      });
  };

  const handleInsertTitle = (value: string) => {
    setTitle(value);
  };
  
  const handleInsertDescription = (value: string) => {
    setDescription(value);
  };
  
  const handleKeyValidated = () => {
    // Generate suggestions automatically when key is validated
    const apiKey = localStorage.getItem('openaiKey');
    if (apiKey) {
      const openAIService = new OpenAIService(apiKey);
      generateKeywordSuggestions(openAIService);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Analyse SEO</h2>
      <p className="text-gray-600 mb-4">
        Cette section contient les analyses SEO pour votre site. 
        Veuillez utiliser le formulaire d'analyse pour commencer.
      </p>
      
      <div className="space-y-6">
        {/* API Key Configuration Section */}
        <ApiKeyConfig
          openaiKey={openaiKey}
          setOpenaiKey={setOpenaiKey}
          apiKeyStatus={apiKeyStatus}
          setApiKeyStatus={setApiKeyStatus}
          validationMessage={validationMessage}
          setValidationMessage={setValidationMessage}
          onKeyValidated={handleKeyValidated}
        />
        
        {/* Main Analysis Components */}
        <AnalysisWrapper
          url={url}
          setUrl={setUrl}
          isLoading={isLoading}
          showCorsWarning={showCorsWarning}
          seoAnalysis={seoAnalysis}
          comparisonSite={comparisonSite}
          setComparisonSite={setComparisonSite}
          generatedKeywords={generatedKeywords}
          contentKeyword={contentKeyword}
          generatedContent={generatedContent}
          mockContentIdeas={mockContentIdeas}
          analyzeSite={analyzeSite}
          error={error}
          handleActivateProxy={handleActivateProxy}
          handleContentKeywordChange={handleContentKeywordChange}
          handleGenerateMore={handleGenerateMore}
          onInsertTitle={handleInsertTitle}
          onInsertDescription={handleInsertDescription}
        />
      </div>
    </Card>
  );
};

export default AnalysisSections;
