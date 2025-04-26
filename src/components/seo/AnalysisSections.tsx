
import React from 'react';
import { KeywordSuggestion } from '@/types/seo';
import KeywordSuggestions from '@/components/seo/analysis/KeywordSuggestions';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { OpenAIService } from '@/utils/seo/openaiService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmojiTab from '@/components/seo/analysis/EmojiTab';
import HashtagsTab from '@/components/seo/analysis/HashtagsTab';
import { Card } from "@/components/ui/card";
import { generateBothDescriptions } from '@/utils/seo/generators/descriptionGenerator';
import SeoAnalysisForm from './analysis/SeoAnalysisForm';
import ResultsDisplay from './analysis/ResultsDisplay';
import ComparisonSection from './analysis/ComparisonSection';
import ContentGenerator from './analysis/ContentGenerator';

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
  // Add these state variables and functions needed for KeywordSuggestions
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  
  const handleInsertTitle = (value: string) => {
    setTitle(value);
    toast.success("Titre inséré");
  };
  
  const handleInsertDescription = (value: string) => {
    setDescription(value);
    toast.success("Description insérée");
  };
  
  const handleGenerateMore = () => {
    toast.info("Génération de nouvelles suggestions...");
    // Here you would typically call your generation function
  };

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
          onGenerateClick={handleGenerateMore}
          fieldValue={title}
          onInsert={handleInsertTitle}
          maxLength={60}
          descriptionValue={description}
          onInsertDescription={handleInsertDescription}
          maxLengthDescription={155}
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
