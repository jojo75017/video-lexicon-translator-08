
import React from 'react';
import { Card } from "@/components/ui/card";
import SeoAnalysisForm from './SeoAnalysisForm';
import ResultsDisplay from './ResultsDisplay';
import ComparisonSection from './ComparisonSection';
import KeywordSuggestions from './KeywordSuggestions';
import ContentGenerator from './ContentGenerator';

interface AnalysisWrapperProps {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  showCorsWarning: boolean;
  seoAnalysis: any | null;
  comparisonSite: string;
  setComparisonSite: (site: string) => void;
  generatedKeywords: any[];
  contentKeyword: string;
  generatedContent: any;
  mockContentIdeas: any[];
  analyzeSite: () => void;
  error: string | null;
  handleActivateProxy: () => void;
  handleContentKeywordChange: (keyword: string) => void;
  handleGenerateMore: () => void;
  onInsertTitle?: (value: string) => void;
  onInsertDescription?: (value: string) => void;
}

const AnalysisWrapper: React.FC<AnalysisWrapperProps> = ({
  url,
  setUrl,
  isLoading,
  showCorsWarning,
  seoAnalysis,
  comparisonSite,
  setComparisonSite,
  generatedKeywords,
  contentKeyword,
  generatedContent,
  mockContentIdeas,
  analyzeSite,
  error,
  handleActivateProxy,
  handleContentKeywordChange,
  handleGenerateMore,
  onInsertTitle,
  onInsertDescription
}) => {
  return (
    <div className="space-y-6">
      <SeoAnalysisForm 
        url={url}
        setUrl={setUrl}
        isLoading={isLoading}
        showCorsWarning={showCorsWarning}
        analyzeSite={analyzeSite}
        error={error}
        handleActivateProxy={handleActivateProxy}
      />
      
      {seoAnalysis && <ResultsDisplay seoAnalysis={seoAnalysis} />}
      
      <ComparisonSection 
        comparisonSite={comparisonSite}
        setComparisonSite={setComparisonSite}
        isLoading={isLoading}
      />
      
      <KeywordSuggestions 
        generatedKeywords={generatedKeywords}
        onGenerateClick={handleGenerateMore}
        fieldValue={onInsertTitle ? "" : undefined}
        onInsert={onInsertTitle}
        maxLength={60}
        descriptionValue={onInsertDescription ? "" : undefined}
        onInsertDescription={onInsertDescription}
        maxLengthDescription={155}
      />
      
      <ContentGenerator 
        contentKeyword={contentKeyword}
        handleContentKeywordChange={handleContentKeywordChange}
        generatedContent={generatedContent}
        mockContentIdeas={mockContentIdeas}
      />
    </div>
  );
};

export default AnalysisWrapper;
