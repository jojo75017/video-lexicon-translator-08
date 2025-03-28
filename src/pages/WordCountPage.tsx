
import React from 'react';
import { ArrowLeft, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CrawlForm } from "@/components/CrawlForm";

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
          <h1 className="ml-4 text-xl font-bold">Analyse des mots-clés</h1>
        </div>
      </header>
      
      <div className="container mx-auto">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <List className="h-6 w-6 mr-2 text-green-600" />
            Analyse des mots-clés
          </h2>
          <p className="text-gray-600 mb-6">
            Examinez la densité et la pertinence des mots-clés dans votre contenu.
            Cette analyse vous aidera à optimiser vos textes pour les moteurs de recherche.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-3">Mots-clés principaux</h3>
              <p className="text-gray-600 text-sm mb-4">
                Identifiez les mots-clés les plus utilisés dans votre contenu.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">référencement</div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">SEO</div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">analyse</div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">optimisation</div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">contenu</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-3">Densité de mots-clés</h3>
              <p className="text-gray-600 text-sm mb-4">
                Évaluez le pourcentage de présence des mots-clés principaux.
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">SEO</span>
                  <span className="text-sm font-medium">2.3%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '57%' }}></div>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm">référencement</span>
                  <span className="text-sm font-medium">1.8%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }}></div>
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

export default WordCountPage;
