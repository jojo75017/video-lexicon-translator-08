
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from "lucide-react";
import KeywordSuggestions from '@/components/seo/analysis/KeywordSuggestions';
import KeywordForm from '../keyword/KeywordForm';
import TitleTab from '../keyword/TitleTab';
import DescriptionTab from '../keyword/DescriptionTab';
import SuggestionsPlaceholder from '../keyword/SuggestionsPlaceholder';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { toast } from 'sonner';

const maxTitleLength = 60;
const maxDescriptionLength = 155;

const KeywordTabContent = () => {
  // Définir les états localement plutôt que d'utiliser le hook incompatible
  const [keyword, setKeyword] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [generatedKeywords, setGeneratedKeywords] = useState<KeywordSuggestion[]>([]);
  const [activeTab, setActiveTab] = useState('title');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateSuggestions = () => {
    if (!keyword.trim()) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }
    
    setIsGenerating(true);
    
    // Simuler l'appel à une API
    setTimeout(() => {
      const suggestions: KeywordSuggestion[] = [
        { keyword: `${keyword} optimisé`, volume: 1200, difficulty: 32, cpc: 1.5, competition: 0.4, relevance: 95 },
        { keyword: `meilleur ${keyword}`, volume: 880, difficulty: 28, cpc: 2.2, competition: 0.3, relevance: 90 },
        { keyword: `comment trouver ${keyword}`, volume: 590, difficulty: 15, cpc: 0.8, competition: 0.2, relevance: 85 },
        { keyword: `${keyword} professionnel`, volume: 740, difficulty: 45, cpc: 3.1, competition: 0.5, relevance: 93 },
      ];
      
      setGeneratedKeywords(suggestions);
      setIsGenerating(false);
      toast.success("Suggestions générées avec succès");
    }, 1500);
  };
  
  const handleInsertTitle = (suggestion: string) => {
    setTitle(suggestion.substring(0, maxTitleLength));
    toast.info(`Titre mis à jour avec "${suggestion.substring(0, 20)}..."`);
  };
  
  const handleInsertDescription = (suggestion: string) => {
    setDescription(suggestion.substring(0, maxDescriptionLength));
    toast.info(`Description mise à jour avec "${suggestion.substring(0, 20)}..."`);
  };

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
        />
      )}

      {keyword && (!generatedKeywords || generatedKeywords.length === 0) && !isGenerating && (
        <SuggestionsPlaceholder keyword={keyword} onGenerateClick={generateSuggestions} />
      )}
    </div>
  );
};

export default KeywordTabContent;
