
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import KeywordResults from './KeywordResults';
import IntelligentExpansion from './IntelligentExpansion';
import SeasonalTrends from './SeasonalTrends';
import CompetitorKeywords from './CompetitorKeywords';
import SearchVolumePredictor from './SearchVolumePredictor';
import ContentOpportunities from './ContentOpportunities';
import KeywordOpportunityChart from './KeywordOpportunityChart';
import InternalLinkSuggestions from './InternalLinkSuggestions';
import SerpAnalysis from './SerpAnalysis';
import KeywordGrouping from './KeywordGrouping';
import RankingTracker from './RankingTracker';
import CompetitorGapAnalysis from './CompetitorGapAnalysis';
import RoiCalculator from './RoiCalculator';
import MultiLanguageSupport from './MultiLanguageSupport';
import VoiceSearchAnalysis from './VoiceSearchAnalysis';
import MobileOptimization from './MobileOptimization';
import KeywordInsightsAnalyzer from './KeywordInsightsAnalyzer';
import KeywordClusteringTool from './KeywordClusteringTool';
import KeywordTrendAnalyzer from './KeywordTrendAnalyzer';
import CompetitiveIntelligence from './CompetitiveIntelligence';
import ContentStrategyPlanner from './ContentStrategyPlanner';

interface KeywordTabsContentProps {
  standardKeywords: KeywordSuggestion[];
  longTailKeywords: KeywordSuggestion[];
  allKeywords: KeywordSuggestion[];
  selectedKeywords: string[];
  keyword: string;
  toggleKeywordSelection: (kw: string) => void;
  clearSelectedKeywords: () => void;
  exportSelectedKeywords: () => void;
  handleIntelligentKeywords: (keywords: KeywordSuggestion[]) => void;
  handleCompetitorKeywords: (keywords: string[]) => void;
}

const KeywordTabsContent: React.FC<KeywordTabsContentProps> = ({
  standardKeywords,
  longTailKeywords,
  allKeywords,
  selectedKeywords,
  keyword,
  toggleKeywordSelection,
  clearSelectedKeywords,
  exportSelectedKeywords,
  handleIntelligentKeywords,
  handleCompetitorKeywords
}) => {
  return (
    <>
      <TabsContent value="generator" className="space-y-4">
        {(standardKeywords.length > 0 || longTailKeywords.length > 0) && (
          <KeywordResults
            standardKeywords={standardKeywords}
            longTailKeywords={longTailKeywords}
            selectedKeywords={selectedKeywords}
            competitors={[]}
            serpResults={[]}
            hasCompetitorData={false}
            totalKeywords={standardKeywords.length + longTailKeywords.length}
            activeTab="standard"
            setActiveTab={() => {}}
            toggleKeywordSelection={toggleKeywordSelection}
            clearSelectedKeywords={clearSelectedKeywords}
            exportSelectedKeywords={exportSelectedKeywords}
            keyword={keyword}
          />
        )}
      </TabsContent>

      <TabsContent value="intelligent" className="space-y-4">
        <IntelligentExpansion
          keyword={keyword}
          onKeywordsGenerated={handleIntelligentKeywords}
        />
        <KeywordInsightsAnalyzer keywords={allKeywords} />
      </TabsContent>

      <TabsContent value="trends" className="space-y-4">
        <SeasonalTrends keyword={keyword} />
        <SearchVolumePredictor keywords={allKeywords} />
      </TabsContent>

      <TabsContent value="trend-analyzer" className="space-y-4">
        <KeywordTrendAnalyzer keywords={allKeywords} />
      </TabsContent>

      <TabsContent value="competitors" className="space-y-4">
        <CompetitorKeywords onKeywordsFound={handleCompetitorKeywords} />
      </TabsContent>

      <TabsContent value="competitive-intel" className="space-y-4">
        <CompetitiveIntelligence keywords={allKeywords} />
      </TabsContent>

      <TabsContent value="content" className="space-y-4">
        <ContentOpportunities keywords={allKeywords} />
        <KeywordOpportunityChart keywords={allKeywords} />
      </TabsContent>

      <TabsContent value="content-strategy" className="space-y-4">
        <ContentStrategyPlanner keywords={allKeywords} />
      </TabsContent>

      <TabsContent value="predictions" className="space-y-4">
        <SearchVolumePredictor keywords={allKeywords} />
      </TabsContent>

      <TabsContent value="links" className="space-y-4">
        <InternalLinkSuggestions keywords={allKeywords} />
      </TabsContent>

      <TabsContent value="serp" className="space-y-4">
        <SerpAnalysis keywords={allKeywords} />
      </TabsContent>

      <TabsContent value="grouping" className="space-y-4">
        <KeywordGrouping keywords={allKeywords} />
        <KeywordClusteringTool keywords={allKeywords} />
      </TabsContent>

      <TabsContent value="ranking" className="space-y-4">
        <RankingTracker keywords={allKeywords} />
      </TabsContent>

      <TabsContent value="gaps" className="space-y-4">
        <CompetitorGapAnalysis keywords={allKeywords} />
      </TabsContent>

      <TabsContent value="roi" className="space-y-4">
        <RoiCalculator keywords={allKeywords} />
      </TabsContent>

      <TabsContent value="multilang" className="space-y-4">
        <MultiLanguageSupport keywords={allKeywords} />
      </TabsContent>

      <TabsContent value="voice" className="space-y-4">
        <VoiceSearchAnalysis keywords={allKeywords} />
      </TabsContent>

      <TabsContent value="mobile" className="space-y-4">
        <MobileOptimization keywords={allKeywords} />
      </TabsContent>
    </>
  );
};

export default KeywordTabsContent;
