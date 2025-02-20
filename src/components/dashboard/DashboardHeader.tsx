
import React from 'react';
import { RocketIcon } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/40 via-blue-100/40 to-pink-100/40 animate-gradient" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="relative text-center space-y-8 py-16">
        <div className="space-y-6">
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl blur-lg opacity-50" />
            <div className="relative p-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg">
              <RocketIcon className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 animate-text-gradient">
              Optimisez votre visibilité
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed">
            Une suite complète d'outils professionnels pour analyser et améliorer votre SEO
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-gray-600">Analyses en temps réel</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-sm text-gray-600">Rapports détaillés</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
