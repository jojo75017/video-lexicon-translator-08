
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AnalyseAvancee = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">
          Analyse avancée des données SEO
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="mb-4 text-gray-600">
          Les analyses avancées vous permettent d'obtenir des insights détaillés sur votre référencement et vos performances
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <div className="text-indigo-600 mb-4">
              <BarChart className="h-10 w-10" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Analyse de la concurrence</h3>
            <p className="text-sm text-gray-600 mb-4">
              Comparez votre site avec vos concurrents directs et identifiez les opportunités d'amélioration
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                Premium
              </span>
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <div className="text-amber-600 mb-4">
              <Sparkles className="h-10 w-10" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Intelligence artificielle</h3>
            <p className="text-sm text-gray-600 mb-4">
              Utilisez notre IA pour générer des recommandations personnalisées pour votre site
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                Premium
              </span>
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <div className="text-green-600 mb-4">
              <BarChart className="h-10 w-10" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Suivi des positions</h3>
            <p className="text-sm text-gray-600 mb-4">
              Suivez l'évolution de vos positions sur les moteurs de recherche au fil du temps
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">
                Premium
              </span>
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-indigo-50 p-6 rounded-lg border border-indigo-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-indigo-900 mb-1">Passez à la version Premium</h3>
            <p className="text-sm text-indigo-700">
              Débloquez toutes les fonctionnalités avancées et maximisez votre potentiel SEO
            </p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            Découvrir Premium
          </Button>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Fonctionnalités incluses</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                Analyse de base des méta-tags
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                Structure et aperçu SERP
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                Recommandations basiques
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                Génération de méta-tags
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Premium exclusif</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <span className="h-2 w-2 bg-indigo-500 rounded-full mr-2"></span>
                Analyse de la concurrence
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <span className="h-2 w-2 bg-indigo-500 rounded-full mr-2"></span>
                Suivi des positions
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <span className="h-2 w-2 bg-indigo-500 rounded-full mr-2"></span>
                Audit technique complet
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <span className="h-2 w-2 bg-indigo-500 rounded-full mr-2"></span>
                Recommandations IA avancées
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyseAvancee;
