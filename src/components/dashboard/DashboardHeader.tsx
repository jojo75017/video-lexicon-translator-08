
import React from 'react';
import { RocketIcon, Sparkles, Zap, BarChart4 } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
              <BarChart4 className="h-7 w-7 text-blue-600 mr-2" />
              Tableau de bord SEO
            </h1>
            <p className="text-gray-600">
              Analysez et optimisez votre présence en ligne avec nos outils professionnels
            </p>
          </div>
          
          <div className="flex space-x-4">
            <div className="px-4 py-2 bg-blue-50 rounded-lg border border-blue-100 flex items-center shadow-sm hover:shadow transition-shadow duration-300">
              <RocketIcon className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-blue-700 font-medium">Analyse avancée</span>
            </div>
            
            <div className="px-4 py-2 bg-purple-50 rounded-lg border border-purple-100 flex items-center shadow-sm hover:shadow transition-shadow duration-300">
              <Zap className="h-5 w-5 text-purple-600 mr-2" />
              <span className="text-purple-700 font-medium">Temps réel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
