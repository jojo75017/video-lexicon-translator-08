
import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from "lucide-react";
import KeywordSuggestions from '@/components/seo/analysis/KeywordSuggestions';
import KeywordForm from '../keyword/KeywordForm';
import TitleTab from '../keyword/TitleTab';
import DescriptionTab from '../keyword/DescriptionTab';
import SuggestionsPlaceholder from '../keyword/SuggestionsPlaceholder';
import useKeywordGenerator from '@/hooks/useKeywordGenerator';

const maxTitleLength = 60;
const maxDescriptionLength = 155;

const KeywordTabContent = () => {
  const {
    keyword,
    setKeyword,
    title,
    setTitle,
    description,
    setDescription,
    generatedKeywords,
    activeTab,
    setActiveTab,
    isGenerating,
    generateSuggestions,
    handleInsertTitle,
    handleInsertDescription
  } = useKeywordGenerator();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Générateur de Title & Meta Description
          </h2>
          
          <KeywordForm 
            keyword={keyword}
            setKeyword={setKeyword}
            isGenerating={isGenerating}
            onGenerateClick={generateSuggestions}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList>
              <TabsTrigger value="title">Title Tag</TabsTrigger>
              <TabsTrigger value="description">Meta Description</TabsTrigger>
            </TabsList>
            
            <TabsContent value="title">
              <TitleTab 
                title={title} 
                setTitle={setTitle} 
                maxTitleLength={maxTitleLength}
                keyword={keyword}
              />
            </TabsContent>
            
            <TabsContent value="description">
              <DescriptionTab 
                description={description} 
                setDescription={setDescription} 
                maxDescriptionLength={maxDescriptionLength}
                keyword={keyword}
              />
            </TabsContent>
          </Tabs>
        </div>
      </Card>

      {generatedKeywords && generatedKeywords.length > 0 && (
        <KeywordSuggestions 
          generatedKeywords={generatedKeywords}
          onGenerateClick={generateSuggestions}
          fieldValue={activeTab === 'title' ? title : description}
          onInsert={activeTab === 'title' ? handleInsertTitle : handleInsertDescription}
          maxLength={activeTab === 'title' ? maxTitleLength : maxDescriptionLength}
          descriptionValue={description}
          onInsertDescription={handleInsertDescription}
          maxLengthDescription={maxDescriptionLength}
        />
      )}

      {keyword && (!generatedKeywords || generatedKeywords.length === 0) && !isGenerating && (
        <SuggestionsPlaceholder keyword={keyword} onGenerateClick={generateSuggestions} />
      )}
    </div>
  );
};

export default KeywordTabContent;
