
import React from 'react';
import { Card } from '@/components/ui/card';
import { SeoAnalysisResult } from '@/types/seo';
import { Settings2, Zap, Cpu, Database, LineChart, Lock, Network } from 'lucide-react';

interface AdvancedSectionProps {
  isLoading: boolean;
  seoAnalysis: SeoAnalysisResult | null;
}

const AdvancedSection: React.FC<AdvancedSectionProps> = ({ isLoading, seoAnalysis }) => {
  return (
    <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-slate-50 to-gray-50">
      <div className="flex items-center mb-4">
        <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full mr-3"></div>
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Settings2 className="h-5 w-5 mr-2 text-indigo-600" />
          Options avancées
        </h2>
      </div>
      <p className="text-gray-600 mb-6 leading-relaxed">
        Accédez aux outils d'analyse SEO avancés pour les utilisateurs expérimentés
      </p>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div>
          {seoAnalysis ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-white to-blue-50 p-5 rounded-lg border border-blue-100 shadow-sm">
                <div className="flex items-center mb-3">
                  <Zap className="h-5 w-5 text-amber-500" />
                  <h3 className="text-sm font-medium text-gray-700 ml-2">Optimisation technique</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="leading-relaxed">Analyse des balises structurées</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="leading-relaxed">Vérification des liens internes</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    <span className="leading-relaxed">Optimisation des images</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-white to-purple-50 p-5 rounded-lg border border-purple-100 shadow-sm">
                <div className="flex items-center mb-3">
                  <Cpu className="h-5 w-5 text-indigo-500" />
                  <h3 className="text-sm font-medium text-gray-700 ml-2">Analyse IA</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="leading-relaxed">Extraction de mots-clés sémantiques</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="leading-relaxed">Évaluation du contenu concurrent</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="leading-relaxed">Recommandations intelligentes</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-white to-green-50 p-5 rounded-lg border border-green-100 shadow-sm">
                <div className="flex items-center mb-3">
                  <Database className="h-5 w-5 text-teal-500" />
                  <h3 className="text-sm font-medium text-gray-700 ml-2">Suivi avancé</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="leading-relaxed">Historiques des performances</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="leading-relaxed">Rapports hebdomadaires</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="leading-relaxed">Alertes de variations</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-white to-blue-50 p-5 rounded-lg border border-blue-100 shadow-sm opacity-70">
                <div className="flex items-center mb-3">
                  <Lock className="h-5 w-5 text-blue-400" />
                  <h3 className="text-sm font-medium text-gray-500 ml-2">Outils SEO avancés</h3>
                </div>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                  Analysez votre site pour déverrouiller nos outils d'optimisation technique avancés.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-white to-purple-50 p-5 rounded-lg border border-purple-100 shadow-sm opacity-70">
                <div className="flex items-center mb-3">
                  <Network className="h-5 w-5 text-purple-400" />
                  <h3 className="text-sm font-medium text-gray-500 ml-2">Analyse concurrentielle</h3>
                </div>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                  Comparez votre site aux concurrents et découvrez des opportunités d'amélioration.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-white to-green-50 p-5 rounded-lg border border-green-100 shadow-sm opacity-70">
                <div className="flex items-center mb-3">
                  <LineChart className="h-5 w-5 text-green-400" />
                  <h3 className="text-sm font-medium text-gray-500 ml-2">Suivi des performances</h3>
                </div>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                  Obtenez des rapports détaillés et suivez l'évolution de vos indicateurs clés.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default AdvancedSection;
