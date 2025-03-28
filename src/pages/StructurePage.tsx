
import React from 'react';
import { ArrowLeft, FileSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CrawlForm } from "@/components/CrawlForm";

const StructurePage = () => {
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
          <h1 className="ml-4 text-xl font-bold">Structure du site</h1>
        </div>
      </header>
      
      <div className="container mx-auto">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FileSearch className="h-6 w-6 mr-2 text-purple-600" />
            Structure du site
          </h2>
          <p className="text-gray-600 mb-6">
            Visualisez l'architecture de votre site web et identifiez les améliorations possibles.
            Cette analyse vous aidera à optimiser la navigation et le maillage interne.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold mb-4">Architecture des pages</h3>
            <p className="text-gray-600 mb-4">
              Analysez comment les pages de votre site sont connectées entre elles et 
              optimisez la navigation pour les utilisateurs et les moteurs de recherche.
            </p>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium mb-3">Éléments à analyser</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 text-lg">•</span>
                  <div>
                    <p className="font-medium">Profondeur des pages</p>
                    <p className="text-sm text-gray-600">Évitez que les pages importantes soient trop éloignées de la page d'accueil</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 text-lg">•</span>
                  <div>
                    <p className="font-medium">Maillage interne</p>
                    <p className="text-sm text-gray-600">Créez des liens entre vos pages pour répartir le "link juice"</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 text-lg">•</span>
                  <div>
                    <p className="font-medium">Architecture thématique</p>
                    <p className="text-sm text-gray-600">Regroupez vos contenus par thèmes pour renforcer votre expertise</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <CrawlForm />
        </Card>
      </div>
    </div>
  );
};

export default StructurePage;
