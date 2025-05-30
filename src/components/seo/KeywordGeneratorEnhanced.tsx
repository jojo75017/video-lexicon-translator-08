
import React, { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import KeywordGeneratorForm from './keyword/KeywordGeneratorForm';
import KeywordDataManager from './keyword/KeywordDataManager';
import KeywordTabsNavigation from './keyword/KeywordTabsNavigation';
import KeywordTabsContent from './keyword/KeywordTabsContent';

const KeywordGeneratorEnhanced: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState('generator');

  return (
    <div className="space-y-6">
      <KeywordDataManager>
        {({
          keyword,
          setKeyword,
          standardKeywords,
          longTailKeywords,
          intelligentKeywords,
          competitorKeywords,
          selectedKeywords,
          allKeywords,
          activeTab,
          setActiveTab,
          generateStandardKeywords,
          handleIntelligentKeywords,
          handleCompetitorKeywords,
          toggleKeywordSelection,
          clearSelectedKeywords,
          exportSelectedKeywords,
          isGenerating
        }) => (
          <>
            <KeywordGeneratorForm
              keyword={keyword}
              setKeyword={setKeyword}
              isGenerating={isGenerating}
              onGenerate={generateStandardKeywords}
            />

            <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="space-y-4">
              <KeywordTabsNavigation 
                activeTab={activeMainTab} 
                setActiveTab={setActiveMainTab} 
              />

              <KeywordTabsContent
                standardKeywords={standardKeywords}
                longTailKeywords={longTailKeywords}
                allKeywords={allKeywords}
                selectedKeywords={selectedKeywords}
                keyword={keyword}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                toggleKeywordSelection={toggleKeywordSelection}
                clearSelectedKeywords={clearSelectedKeywords}
                exportSelectedKeywords={exportSelectedKeywords}
                handleIntelligentKeywords={handleIntelligentKeywords}
                handleCompetitorKeywords={handleCompetitorKeywords}
              />
            </Tabs>
          </>
        )}
      </KeywordDataManager>
    </div>
  );
};

export default KeywordGeneratorEnhanced;
