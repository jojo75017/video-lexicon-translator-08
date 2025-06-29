
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { KeywordSuggestion } from '@/types/seo/Keyword';
import KeywordTable from './KeywordTable';
import SerpAnalysis from './SerpAnalysis';
import ArticlePlanGenerator from './ArticlePlanGenerator';
import PageStructurePlanner from './PageStructurePlanner';
import UrlContentAnalyzer from './UrlContentAnalyzer';
import CompetitorAnalysis from './CompetitorAnalysis';
import TrendAnalysis from './TrendAnalysis';
import SemanticAnalysis from './SemanticAnalysis';

interface KeywordTabsContentProps {
  activeTab: string;
  keywords: KeywordSuggestion[];
  keyword: string;
}

const KeywordTabsContent: React.FC<KeywordTabsContentProps> = ({ 
  activeTab, 
  keywords, 
  keyword 
}) => {
  return (
    <>
      <TabsContent value="keywords">
        <KeywordTable keywords={keywords} />
      </TabsContent>

      <TabsContent value="serp">
        <SerpAnalysis keywords={keywords} />
      </TabsContent>

      <TabsContent value="plan">
        <ArticlePlanGenerator keywords={keywords} mainKeyword={keyword} />
      </TabsContent>

      <TabsContent value="structure">
        <PageStructurePlanner />
      </TabsContent>

      <TabsContent value="analyzer">
        <UrlContentAnalyzer />
      </TabsContent>

      <TabsContent value="competitor">
        <CompetitorAnalysis keyword={keyword} />
      </TabsContent>

      <TabsContent value="trends">
        <TrendAnalysis keywords={keywords} />
      </TabsContent>

      <TabsContent value="semantic">
        <SemanticAnalysis keyword={keyword} />
      </TabsContent>
    </>
  );
};

export default KeywordTabsContent;
