
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PinterestGenerator from '@/components/pinterest/PinterestGenerator';

const PinterestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-indigo-600 hover:text-indigo-800 flex items-center">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour à l'accueil
            </Link>
            <h1 className="text-xl font-bold hidden sm:block">Générateur d'Images Pinterest</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/generateur-prompts" className="flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                Générateur de Prompts
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://free.theresanaiforthat.com/@taaft/image-generator/?ref=header" target="_blank" rel="noopener noreferrer" className="flex items-center">
                <ExternalLink className="h-4 w-4 mr-2" />
                Générateur AI
              </a>
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto p-4 space-y-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold mb-2">Générateur d'Images Pinterest</h1>
          <p className="text-gray-600 mb-6">
            Créez des visuels Pinterest optimisés (1000x1500) avec titres, descriptions et hashtags
          </p>
          
          <PinterestGenerator />
        </div>
      </div>
    </div>
  );
};

export default PinterestPage;
