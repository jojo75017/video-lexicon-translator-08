
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageGenerator from '@/components/image-generator/ImageGenerator';

const ImageGeneratorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-indigo-600 hover:text-indigo-800 flex items-center">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour à l'accueil
            </Link>
            <h1 className="text-xl font-bold hidden sm:block">Générateur d'Images IA</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <a href="https://platform.openai.com/docs/guides/images" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Docs OpenAI
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://www.pexels.com/fr-fr/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Pexels
              </a>
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto p-4 space-y-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold mb-2">Générateur d'Images</h1>
          <p className="text-gray-600 mb-6">
            Créez des images uniques à partir de descriptions textuelles ou trouvez des images gratuites
          </p>
          
          <ImageGenerator />
        </div>
      </div>
    </div>
  );
};

export default ImageGeneratorPage;
