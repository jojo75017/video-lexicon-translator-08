
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { FileText } from 'lucide-react';
import { Card } from "@/components/ui/card";
import WordCounter from '@/components/text/WordCounter';

const WordCountPage = () => {
  return (
    <PageLayout
      title="Comptage de mots et caractères"
      description="Utilisez cet outil pour compter précisément le nombre de mots, caractères, phrases et paragraphes dans votre texte."
    >
      <Card className="p-6 border-green-300">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <FileText className="h-6 w-6 mr-2 text-green-600" />
          Outil de comptage de texte
        </h2>
        <p className="text-gray-600 mb-6">
          Utilisez cet outil pour compter précisément le nombre de mots, caractères, phrases et paragraphes dans votre texte.
        </p>
        
        <WordCounter className="mt-6" />
      </Card>
    </PageLayout>
  );
};

export default WordCountPage;
