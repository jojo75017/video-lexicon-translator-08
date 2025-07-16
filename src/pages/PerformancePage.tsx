
import React from 'react';
import { ArrowLeft, Zap, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CrawlForm } from "@/components/CrawlForm";

const PerformancePage = () => {
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
          <h1 className="ml-4 text-xl font-bold">Performance du site</h1>
        </div>
      </header>
      
      <div className="container mx-auto">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Zap className="h-6 w-6 mr-2 text-amber-600" />
            Analyse de performance
          </h2>
          <p className="text-gray-600 mb-6">
            Analysez les performances techniques de votre site web et identifiez les opportunités d'amélioration.
            La vitesse de chargement est un facteur important pour le référencement et l'expérience utilisateur.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <h3 className="text-sm font-medium text-gray-500 mb-2">VITESSE DE CHARGEMENT</h3>
              <div className="text-3xl font-bold">3.2s</div>
              <p className="text-sm text-amber-600">Amélioration possible</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <h3 className="text-sm font-medium text-gray-500 mb-2">TAILLE DE PAGE</h3>
              <div className="text-3xl font-bold">1.8 MB</div>
              <p className="text-sm text-green-600">Bonne performance</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <h3 className="text-sm font-medium text-gray-500 mb-2">REQUÊTES HTTP</h3>
              <div className="text-3xl font-bold">42</div>
              <p className="text-sm text-amber-600">Réduction possible</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-3">Optimisations recommandées</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 text-lg">•</span>
                  <div>
                    <p className="font-medium">Compression des images</p>
                    <p className="text-sm text-gray-600">Réduisez le poids des images sans perdre en qualité</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 text-lg">•</span>
                  <div>
                    <p className="font-medium">Minification CSS/JS</p>
                    <p className="text-sm text-gray-600">Réduisez la taille des fichiers CSS et JavaScript</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 text-lg">•</span>
                  <div>
                    <p className="font-medium">Mise en cache navigateur</p>
                    <p className="text-sm text-gray-600">Configurez correctement les en-têtes de cache</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-3">Répartition des ressources</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Images</span>
                    <span className="text-sm font-medium">840 KB</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">JavaScript</span>
                    <span className="text-sm font-medium">520 KB</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CSS</span>
                    <span className="text-sm font-medium">240 KB</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">HTML</span>
                    <span className="text-sm font-medium">85 KB</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '5%' }}></div>
                  </div>
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

export default PerformancePage;
