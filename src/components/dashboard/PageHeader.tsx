
import React from 'react';

const PageHeader = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 shadow-lg mb-8 relative overflow-hidden">
      {/* Blobs décoratifs en arrière-plan */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 opacity-20 rounded-full filter blur-3xl animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 opacity-20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
      
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 drop-shadow-md">
          Optimisation SEO Professionnelle
        </h1>
        <p className="text-lg text-blue-50">
          Améliorez votre visibilité en ligne avec nos outils d'analyse et d'optimisation SEO
        </p>
      </div>
    </div>
  );
};

export default PageHeader;
