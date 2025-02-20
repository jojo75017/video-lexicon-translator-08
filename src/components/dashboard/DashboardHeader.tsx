
import React from 'react';
import { RocketIcon } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <div className="text-center py-16 fade-in">
      <div className="mb-8">
        <div className="inline-flex p-4 rounded-full animated-gradient">
          <RocketIcon className="h-12 w-12 text-white" />
        </div>
      </div>

      <h1 className="text-5xl font-bold mb-6 gradient-text">
        Optimisez votre visibilité
      </h1>

      <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
        Une suite complète d'outils professionnels pour analyser et améliorer votre SEO
      </p>

      <div className="flex justify-center gap-4">
        <div className="glass-card px-6 py-3 rounded-full">
          <span className="gradient-text font-medium">
            Analyses en temps réel
          </span>
        </div>
        <div className="glass-card px-6 py-3 rounded-full">
          <span className="gradient-text font-medium">
            Rapports détaillés
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
