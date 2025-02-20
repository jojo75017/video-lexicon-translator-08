
import React from 'react';
import { RocketIcon, Sparkles, Zap } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <div className="text-center py-16 fade-in relative">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50 -z-10" />
      
      <div className="mb-8 relative">
        <div className="inline-flex p-4 rounded-full animated-gradient transform hover:scale-110 transition-transform duration-500">
          <RocketIcon className="h-12 w-12 text-white animate-pulse" />
        </div>
        <div className="absolute -right-4 top-0">
          <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
        </div>
      </div>

      <h1 className="text-5xl font-bold mb-6 gradient-text flex items-center justify-center gap-4">
        <Zap className="h-8 w-8 text-indigo-600 animate-pulse" />
        Optimisez votre visibilité
        <Zap className="h-8 w-8 text-purple-600 animate-pulse" />
      </h1>

      <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
        Une suite complète d'outils professionnels pour analyser et améliorer votre SEO
      </p>

      <div className="flex justify-center gap-4">
        <div className="glass-card px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
          <span className="gradient-text font-medium flex items-center gap-2">
            <RocketIcon className="h-5 w-5" />
            Analyses en temps réel
          </span>
        </div>
        <div className="glass-card px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
          <span className="gradient-text font-medium flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Rapports détaillés
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
