
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import KeywordGenerator from '@/components/seo/KeywordGenerator';

const KeywordGeneratorPage = () => {
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
          <h1 className="ml-4 text-xl font-bold">Générateur de mots-clés SEO</h1>
        </div>
      </header>
      
      <div className="container mx-auto">
        <KeywordGenerator />
      </div>
    </div>
  );
};

export default KeywordGeneratorPage;
