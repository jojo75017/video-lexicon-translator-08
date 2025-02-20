
import React from 'react';
import { RocketIcon, Sparkles, Zap, Star } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <div className="text-center py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-70" />
      
      <div className="relative">
        <div className="mb-8 inline-block relative">
          <div className="p-4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg transform hover:scale-110 transition-transform duration-500">
            <RocketIcon className="h-12 w-12 text-white" />
          </div>
          <div className="absolute -right-2 -top-2">
            <Star className="h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
        </div>

        <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center gap-4">
          <Zap className="h-8 w-8 text-blue-500" />
          Optimisez votre visibilité
          <Zap className="h-8 w-8 text-purple-500" />
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          Une suite complète d'outils professionnels pour analyser et améliorer votre SEO
        </p>

        <div className="flex justify-center gap-4">
          <div className="bg-white/80 backdrop-blur-lg px-6 py-3 rounded-full shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 hover:border-blue-200">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-medium flex items-center gap-2">
              <RocketIcon className="h-5 w-5 text-blue-500" />
              Analyses en temps réel
            </span>
          </div>
          <div className="bg-white/80 backdrop-blur-lg px-6 py-3 rounded-full shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 hover:border-blue-200">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-medium flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Rapports détaillés
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
