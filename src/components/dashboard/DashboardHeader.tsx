
import React from 'react';
import { RocketIcon } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <div className="text-center space-y-8 mb-16">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <RocketIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6 drop-shadow-sm">
            Optimisez votre visibilité
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Une suite complète d'outils professionnels pour analyser et améliorer votre SEO
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
