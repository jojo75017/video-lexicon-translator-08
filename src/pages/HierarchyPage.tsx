
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CrawlForm } from "@/components/CrawlForm";

const HierarchyPage = () => {
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
          <h1 className="ml-4 text-xl font-bold">Hiérarchie de contenu</h1>
        </div>
      </header>
      
      <div className="container mx-auto">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
            Analyse de hiérarchie
          </h2>
          <p className="text-gray-600 mb-6">
            Analysez la structure et la hiérarchie de votre contenu pour améliorer son SEO.
            Cette analyse vous permettra d'optimiser la disposition de vos titres et sous-titres.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-3">Structure des titres</h3>
              <p className="text-gray-600 text-sm mb-4">
                Une hiérarchie de titres bien structurée améliore l'expérience utilisateur et le référencement.
              </p>
              
              <div className="space-y-2">
                <div className="bg-blue-50 p-3 rounded border border-blue-100">
                  <h4 className="font-medium text-sm mb-1">Bonnes pratiques</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    <li>Une seule balise H1 par page</li>
                    <li>Structure logique (H1 → H2 → H3...)</li>
                    <li>Mots-clés dans les titres principaux</li>
                    <li>Titres descriptifs et concis</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-3">Densité de contenu</h3>
              <p className="text-gray-600 text-sm mb-4">
                L'équilibre entre le texte et les autres éléments est crucial pour un bon SEO.
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Texte / HTML</span>
                  <span className="text-sm font-medium">24%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '24%' }}></div>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm">Mots / Page</span>
                  <span className="text-sm font-medium">~850</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <CrawlForm />
        </Card>
      </div>
    </div>
  );
};

export default HierarchyPage;
