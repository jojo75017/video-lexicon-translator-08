
import React from 'react';
import { SeoAnalysis, KeywordSuggestion } from '@/types/seo';
import { Card } from '@/components/ui/card';
import SeoAnalysisForm from './analysis/SeoAnalysisForm';
import ResultsDisplay from './analysis/ResultsDisplay';
import ComparisonSection from './analysis/ComparisonSection';
import KeywordSuggestions from './analysis/KeywordSuggestions';
import ContentGenerator from './analysis/ContentGenerator';

interface AnalysisSectionsProps {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  showCorsWarning: boolean;
  seoAnalysis: SeoAnalysis | null;
  setSeoAnalysis: (analysis: SeoAnalysis) => void;
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
  handleContentKeywordChange
}) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Analyse SEO</h2>
      <p className="text-gray-600 mb-4">
        Cette section contient les analyses SEO pour votre site. 
        Veuillez utiliser le formulaire d'analyse pour commencer.
      </p>
      
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
        />
        
        <ContentGenerator 
          contentKeyword={contentKeyword}
          handleContentKeywordChange={handleContentKeywordChange}
          generatedContent={generatedContent}
          mockContentIdeas={mockContentIdeas}
        />
      </div>
    </Card>
  );
};

export default AnalysisSections;
