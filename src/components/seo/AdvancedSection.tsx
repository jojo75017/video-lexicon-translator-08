
import React from 'react';
import { Card } from '@/components/ui/card';
import { SeoAnalysisResult } from '@/types/seo';
import { Settings2, Zap, Cpu } from 'lucide-react';

interface AdvancedSectionProps {
  isLoading: boolean;
  seoAnalysis: SeoAnalysisResult | null;
}

const AdvancedSection: React.FC<AdvancedSectionProps> = ({ isLoading, seoAnalysis }) => {
  return (
    <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-white to-slate-50">
      <div className="flex items-center mb-4">
        <div className="w-1 h-6 bg-indigo-500 rounded-full mr-3"></div>
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Settings2 className="h-5 w-5 mr-2" />
          Options avancées
        </h2>
      </div>
      <p className="text-gray-600 mb-6">
        Accédez aux outils d'analyse SEO avancés pour les utilisateurs expérimentés
      </p>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div>
          {seoAnalysis ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center mb-3">
                  <Zap className="h-5 w-5 text-amber-500" />
                  <h3 className="text-sm font-medium text-gray-700 ml-2">Optimisation technique</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Analyse des balises structurées
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Vérification des liens internes
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    Optimisation des images
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center mb-3">
                  <Cpu className="h-5 w-5 text-indigo-500" />
                  <h3 className="text-sm font-medium text-gray-700 ml-2">Analyse IA</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Extraction de mots-clés sémantiques
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Évaluation du contenu concurrent
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Recommandations intelligentes
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-500 font-medium">
                Analysez un site pour accéder aux options avancées
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Des fonctionnalités avancées d'analyse seront disponibles ici
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default AdvancedSection;
