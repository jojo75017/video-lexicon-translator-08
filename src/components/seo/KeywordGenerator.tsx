
import React, { useState } from 'react';
import useKeywordGenerator from '@/hooks/useKeywordGenerator';
import KeywordGeneratorForm from './keyword/KeywordGeneratorForm';
import KeywordResultsList from './keyword/KeywordResultsList';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText } from 'lucide-react';

const KeywordGenerator: React.FC = () => {
  const {
    keyword,
    setKeyword,
    isGenerating,
    generateSuggestions,
    generatedKeywords
  } = useKeywordGenerator();

  return (
    <div className="space-y-6">
      <KeywordGeneratorForm
        keyword={keyword}
        setKeyword={setKeyword}
        isGenerating={isGenerating}
        onGenerate={generateSuggestions}
      />
      
      {generatedKeywords.length > 0 ? (
        <KeywordResultsList
          keywords={generatedKeywords}
          isLoading={isGenerating}
        />
      ) : !isGenerating && (
        <Card className="p-6">
          <Alert className="bg-blue-50">
            <FileText className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Entrez un mot-clé ci-dessus pour générer des suggestions pertinentes pour votre contenu SEO.
            </AlertDescription>
          </Alert>
        </Card>
      )}
    </div>
  );
};

export default KeywordGenerator;
