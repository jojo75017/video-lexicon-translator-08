
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import KeywordGeneratorForm from './keyword/KeywordGeneratorForm';
import KeywordResults from './keyword/KeywordResults';
import IntelligentExpansion from './keyword/IntelligentExpansion';
import SeasonalTrends from './keyword/SeasonalTrends';
import CompetitorKeywords from './keyword/CompetitorKeywords';
import SearchVolumePredictor from './keyword/SearchVolumePredictor';
import ContentOpportunities from './keyword/ContentOpportunities';
import KeywordOpportunityChart from './keyword/KeywordOpportunityChart';
import InternalLinkSuggestions from './keyword/InternalLinkSuggestions';
import SerpAnalysis from './keyword/SerpAnalysis';
import KeywordGrouping from './keyword/KeywordGrouping';
import RankingTracker from './keyword/RankingTracker';
import CompetitorGapAnalysis from './keyword/CompetitorGapAnalysis';
import { Brain, TrendingUp, Users, FileText, Target, BarChart3, Link, Search, Network, Trophy, AlertTriangle } from 'lucide-react';

const KeywordGeneratorEnhanced: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [standardKeywords, setStandardKeywords] = useState<KeywordSuggestion[]>([]);
  const [longTailKeywords, setLongTailKeywords] = useState<KeywordSuggestion[]>([]);
  const [intelligentKeywords, setIntelligentKeywords] = useState<KeywordSuggestion[]>([]);
  const [competitorKeywords, setCompetitorKeywords] = useState<KeywordSuggestion[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('generator');

  const generateStandardKeywords = () => {
    if (!keyword.trim()) return;
    
    setIsGenerating(true);
    
    // Simulation de génération
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
        }
      ];

      setStandardKeywords(mockStandard);
      setLongTailKeywords(mockLongTail);
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
    <div className="space-y-6">
      <KeywordGeneratorForm
        keyword={keyword}
        setKeyword={setKeyword}
        isGenerating={isGenerating}
        onGenerate={generateStandardKeywords}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:grid-cols-11 gap-1">
          <TabsTrigger value="generator" className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Standard</span>
          </TabsTrigger>
          <TabsTrigger value="intelligent" className="flex items-center gap-1">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">IA</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Tendances</span>
          </TabsTrigger>
          <TabsTrigger value="competitors" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Concurrents</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Contenu</span>
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Prédictions</span>
          </TabsTrigger>
          <TabsTrigger value="links" className="flex items-center gap-1">
            <Link className="h-4 w-4" />
            <span className="hidden sm:inline">Liens</span>
          </TabsTrigger>
          <TabsTrigger value="serp" className="flex items-center gap-1">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">SERP</span>
          </TabsTrigger>
          <TabsTrigger value="grouping" className="flex items-center gap-1">
            <Network className="h-4 w-4" />
            <span className="hidden sm:inline">Groupes</span>
          </TabsTrigger>
          <TabsTrigger value="ranking" className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Positions</span>
          </TabsTrigger>
          <TabsTrigger value="gaps" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Gaps</span>
          </TabsTrigger>
        </TabsList>

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
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <SeasonalTrends keyword={keyword} />
          <SearchVolumePredictor keywords={allKeywords} />
        </TabsContent>

        <TabsContent value="competitors" className="space-y-4">
          <CompetitorKeywords onKeywordsFound={handleCompetitorKeywords} />
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <ContentOpportunities keywords={allKeywords} />
          <KeywordOpportunityChart keywords={allKeywords} />
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
        </TabsContent>

        <TabsContent value="ranking" className="space-y-4">
          <RankingTracker keywords={allKeywords} />
        </TabsContent>

        <TabsContent value="gaps" className="space-y-4">
          <CompetitorGapAnalysis keywords={allKeywords} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KeywordGeneratorEnhanced;
