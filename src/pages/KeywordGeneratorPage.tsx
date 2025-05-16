
import React from 'react';
import { ArrowLeft, Sparkles, Globe } from 'lucide-react';
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
          <div className="flex items-center ml-4">
            <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
            <h1 className="text-xl font-bold">Générateur de mots-clés SEO</h1>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto">
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-blue-900">Analyse concurrentielle et SERP avec OpenAI</h2>
              <p className="text-blue-700 mt-1">
                En configurant votre clé API OpenAI, vous pouvez maintenant obtenir des données de concurrence réelles 
                et voir les résultats actuels des moteurs de recherche pour vos mots-clés. Visualisez les principaux sites
                concurrents, leur trafic estimé et leur force SEO.
              </p>
            </div>
          </div>
        </div>
        
        <KeywordGenerator />
      </div>
    </div>
  );
};

export default KeywordGeneratorPage;
