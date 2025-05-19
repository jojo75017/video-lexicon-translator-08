
import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import WordCounter from '@/components/text/WordCounter';

const WordCountPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="bg-white border-b p-4 mb-6">
        <div className="container mx-auto flex items-center">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour au tableau de bord
            </Button>
          </Link>
          <h1 className="ml-4 text-xl font-bold">Comptage de mots et caractères</h1>
        </div>
      </header>
      
      <div className="container mx-auto">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FileText className="h-6 w-6 mr-2 text-blue-600" />
            Outil de comptage de texte
          </h2>
          <p className="text-gray-600 mb-6">
            Utilisez cet outil pour compter précisément le nombre de mots, caractères, phrases et paragraphes dans votre texte.
          </p>
          
          <WordCounter className="mt-6" />
        </Card>
      </div>
    </div>
  );
};

export default WordCountPage;
