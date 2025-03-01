
import React from 'react';
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { SeoAnalysis, KeywordSuggestion } from '@/types/seo';
import { toast } from "sonner";
import UrlInput from '@/components/UrlInput';
import SeoResults from '@/components/SeoResults';
import BacklinksAnalysis from '@/components/seo/BacklinksAnalysis';
import KeywordSuggestions from '@/components/seo/KeywordSuggestions';
import MobileAnalysis from '@/components/seo/MobileAnalysis';
import SeoSuggestions from '@/components/seo/SeoSuggestions';
import KeywordGenerator from '@/components/seo/KeywordGenerator';
import AiWriter from '@/components/seo/AiWriter';
import SiteComparison from '@/components/seo/SiteComparison';
import ContentIdeas from '@/components/seo/ContentIdeas';

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
  setGeneratedContent: (content: {
    title: string;
    intro: string;
    sections: Array<{ heading: string; content: string; }>;
  } | null) => void;
  contentKeyword: string;
  mockContentIdeas: Array<{
    title: string;
    url: string;
    visits: number;
    backlinks: number;
    socialShares: {
      facebook: number;
      pinterest: number;
      reddit: number;
    }
  }>;
  analyzeSite: () => void;
  error: string | null;
  handleActivateProxy: () => void;
  handleContentKeywordChange: (keyword: string) => void;
  handleGeneratedKeywords: (keywords: KeywordSuggestion[]) => void;
  handleContentGenerated: (content: { 
    title: string; 
    intro: string; 
    sections: Array<{ heading: string; content: string; }> 
  }) => void;
}

const AnalysisSections: React.FC<AnalysisSectionsProps> = ({
  url,
  setUrl,
  isLoading,
  showCorsWarning,
  seoAnalysis,
  setSeoAnalysis,
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
  handleGeneratedKeywords,
  handleContentGenerated
}) => {
  return (
    <>
      <Card className="p-8 shadow-xl bg-gradient-to-br from-purple-50 to-blue-50 border-0">
        <UrlInput 
          url={url}
          setUrl={setUrl}
          onAnalyze={analyzeSite}
          isLoading={isLoading}
        />
        {showCorsWarning && (
          <div className="mt-6">
            <Alert className="bg-yellow-50 border-yellow-200 mb-4">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                Pour accéder aux sites web, vous devez d'abord activer le proxy CORS. Cliquez sur le bouton ci-dessous, puis sur "Request temporary access".
              </AlertDescription>
            </Alert>
            <Button 
              onClick={handleActivateProxy}
              variant="outline"
              className="w-full bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-400 text-yellow-700 font-medium h-auto py-4"
            >
              <div className="flex flex-col items-center w-full">
                <span className="flex items-center mb-1">
                  Étape 1: Activer le Proxy CORS
                  <AlertCircle className="ml-2 h-4 w-4" />
                </span>
                <span className="text-sm text-yellow-600">
                  Une fois activé, revenez ici pour analyser votre site
                </span>
              </div>
            </Button>
          </div>
        )}
      </Card>

      {error && (
        <Alert className="mt-4 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <Card className="p-6 mt-6">
          <div className="space-y-3">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </Card>
      ) : seoAnalysis ? (
        <div className="space-y-6 mt-6">
          <Card className="p-6">
            <KeywordGenerator onKeywordsGenerated={handleGeneratedKeywords} />
          </Card>
          {generatedKeywords.length > 0 && (
            <Card className="p-6">
              <AiWriter 
                keywords={generatedKeywords}
                onContentGenerated={handleContentGenerated}
              />
              {generatedContent && (
                <div className="mt-8 space-y-6">
                  <h2 className="text-2xl font-bold">{generatedContent.title}</h2>
                  <p className="text-gray-700">{generatedContent.intro}</p>
                  {generatedContent.sections.map((section, index) => (
                    <div key={index} className="mt-6">
                      <h3 className="text-xl font-semibold mb-4">{section.heading}</h3>
                      <p className="text-gray-600">{section.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
          <SeoResults seoAnalysis={seoAnalysis} />
          <SiteComparison 
            site1={{ url, analysis: seoAnalysis }}
            site2={comparisonSite ? { url: comparisonSite, analysis: seoAnalysis } : undefined}
            onCompare={setComparisonSite}
          />
          <KeywordSuggestions suggestions={seoAnalysis.keywordSuggestions || []} />
          <MobileAnalysis 
            viewportMeta={seoAnalysis.mobileAnalysis?.viewportMeta || false}
            responsiveImages={seoAnalysis.mobileAnalysis?.responsiveImages || false}
            touchTargetSize={seoAnalysis.mobileAnalysis?.touchTargetSize || false}
            fontScale={seoAnalysis.mobileAnalysis?.fontScale || false}
            score={seoAnalysis.mobileAnalysis?.score || 0}
          />
          <SeoSuggestions suggestions={seoAnalysis.technicalSuggestions || []} />
          <ContentIdeas 
            keyword={contentKeyword}
            ideas={mockContentIdeas}
            onKeywordChange={handleContentKeywordChange}
          />
        </div>
      ) : (
        <Card className="p-6 mt-6">
          <ContentIdeas 
            keyword={contentKeyword}
            ideas={mockContentIdeas}
            onKeywordChange={handleContentKeywordChange}
          />
        </Card>
      )}
    </>
  );
};

export default AnalysisSections;
