
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import KeywordList from './KeywordList';
import KeywordTrendAnalyzer from './KeywordTrendAnalyzer';
import CompetitorAnalysis from './CompetitorAnalysis';
import IntelligentExpansion from './IntelligentExpansion';
import MobileOptimization from './MobileOptimization';
import VoiceSearchAnalysis from './VoiceSearchAnalysis';
import SeasonalAnalysis from './SeasonalAnalysis';
import KeywordOpportunities from './KeywordOpportunities';
import InternalLinkSuggestions from './InternalLinkSuggestions';
import KeywordDifficultyAnalyzer from './KeywordDifficultyAnalyzer';
import RoiCalculator from './RoiCalculator';
import KeywordFAQ from './KeywordFAQ';
import KeywordClusteringTool from './KeywordClusteringTool';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';

interface KeywordTabsContentProps {
  standardKeywords: KeywordSuggestion[];
  longTailKeywords: KeywordSuggestion[];
  allKeywords: KeywordSuggestion[];
  selectedKeywords: string[];
  keyword: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleKeywordSelection: (keyword: string) => void;
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
  activeTab,
  setActiveTab,
  toggleKeywordSelection,
  clearSelectedKeywords,
  exportSelectedKeywords,
  handleIntelligentKeywords,
  handleCompetitorKeywords
}) => {
  return (
    <>
      <TabsContent value="generator" className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Mots-clés standards ({standardKeywords.length})</h3>
            <KeywordList 
              keywords={standardKeywords}
              selectedKeywords={selectedKeywords}
              onToggleSelection={toggleKeywordSelection}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Mots-clés longue traîne ({longTailKeywords.length})</h3>
            <KeywordList 
              keywords={longTailKeywords}
              selectedKeywords={selectedKeywords}
              onToggleSelection={toggleKeywordSelection}
            />
          </div>
        </div>
        
        {selectedKeywords.length > 0 && (
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-sm text-blue-800">
              {selectedKeywords.length} mot{selectedKeywords.length > 1 ? 's' : ''}-clé{selectedKeywords.length > 1 ? 's' : ''} sélectionné{selectedKeywords.length > 1 ? 's' : ''}
            </span>
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" size="sm" onClick={clearSelectedKeywords}>
                <Trash2 className="w-4 h-4 mr-1" />
                Effacer
              </Button>
              <Button size="sm" onClick={exportSelectedKeywords}>
                <Download className="w-4 h-4 mr-1" />
                Exporter
              </Button>
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="suggestions">
        <KeywordList 
          keywords={allKeywords}
          selectedKeywords={selectedKeywords}
          onToggleSelection={toggleKeywordSelection}
        />
      </TabsContent>

      <TabsContent value="trends">
        <KeywordTrendAnalyzer keywords={[keyword]} />
      </TabsContent>

      <TabsContent value="competitive">
        <CompetitorAnalysis 
          keyword={keyword}
        />
      </TabsContent>

      <TabsContent value="intelligent">
        <IntelligentExpansion 
          keyword={keyword}
          onKeywordsGenerated={handleIntelligentKeywords}
        />
      </TabsContent>

      <TabsContent value="mobile">
        <MobileOptimization keywords={[keyword]} />
      </TabsContent>

      <TabsContent value="voice">
        <VoiceSearchAnalysis keywords={[keyword]} />
      </TabsContent>

      <TabsContent value="seasonal">
        <SeasonalAnalysis keywords={[keyword]} />
      </TabsContent>

      <TabsContent value="opportunities">
        <KeywordOpportunities keywords={[keyword]} />
      </TabsContent>

      <TabsContent value="internal-links">
        <InternalLinkSuggestions keywords={[keyword]} />
      </TabsContent>

      <TabsContent value="difficulty">
        <KeywordDifficultyAnalyzer keywords={allKeywords} />
      </TabsContent>

      <TabsContent value="roi">
        <RoiCalculator keywords={[keyword]} />
      </TabsContent>

      <TabsContent value="faq">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">FAQ pour "{keyword}"</h3>
          <p className="text-gray-600">Génération automatique de questions-réponses optimisées SEO.</p>
        </div>
      </TabsContent>

      <TabsContent value="clustering">
        <KeywordClusteringTool keywords={allKeywords} />
      </TabsContent>

      <TabsContent value="export">
        <div className="text-center py-8">
          <Download className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Exporter vos mots-clés</h3>
          <p className="text-gray-600 mb-4">
            Sélectionnez les mots-clés dans l'onglet "Générateur" puis exportez-les au format CSV.
          </p>
          <Button onClick={() => setActiveTab('generator')}>
            Retour au générateur
          </Button>
        </div>
      </TabsContent>
    </>
  );
};

export default KeywordTabsContent;
