
import React from 'react';
import { RocketIcon } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <div className="relative overflow-hidden mb-12">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 animate-gradient opacity-70" />
      
      {/* Animated blobs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-32 left-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      {/* Content */}
      <div className="relative">
        <div className="text-center py-16 px-4 sm:px-6 lg:px-8">
          {/* Icon container */}
          <div className="inline-flex items-center justify-center p-2 mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient" />
            <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4">
              <RocketIcon className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-text-gradient pb-2">
              Optimisez votre visibilité
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed mb-8">
            Une suite complète d'outils professionnels pour analyser et améliorer votre SEO
          </p>

          {/* Status indicators */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-indigo-100">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium text-gray-600">
                Analyses en temps réel
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-purple-100">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-sm font-medium text-gray-600">
                Rapports détaillés
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
