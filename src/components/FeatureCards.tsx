
import React from 'react';
import { Search, FileText, TrendingUp } from 'lucide-react';

export const FeatureCards = () => {
  return (
    <div className="mt-12 grid gap-8 md:grid-cols-3">
      <div className="bg-purple-900 p-6 rounded-xl text-white hover:bg-purple-800 transition-colors duration-200 cursor-pointer hover:shadow-lg">
        <div className="flex flex-col items-start gap-4 h-full">
          <div className="w-16 h-16 bg-purple-800 rounded-full flex items-center justify-center">
            <Search className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-semibold text-xl mb-2">Saisir le nom de l'entreprise</h3>
            <p className="text-sm opacity-90">
              Effectuez une analyse de la visibilité de votre entreprise locale en quelques secondes
            </p>
          </div>
        </div>
      </div>

      <div className="bg-purple-900 p-6 rounded-xl text-white hover:bg-purple-800 transition-colors duration-200 cursor-pointer hover:shadow-lg">
        <div className="flex flex-col items-start gap-4 h-full">
          <div className="w-16 h-16 bg-purple-800 rounded-full flex items-center justify-center">
            <FileText className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-semibold text-xl mb-2">Obtenir un rapport gratuit</h3>
            <p className="text-sm opacity-90">
              Découvrez les répertoires dans lesquels votre entreprise doit être inscrite ou corrigée + les notes attribuées dans les avis
            </p>
          </div>
        </div>
      </div>

      <div className="bg-purple-900 p-6 rounded-xl text-white hover:bg-purple-800 transition-colors duration-200 cursor-pointer hover:shadow-lg">
        <div className="flex flex-col items-start gap-4 h-full">
          <div className="w-16 h-16 bg-purple-800 rounded-full flex items-center justify-center">
            <TrendingUp className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-semibold text-xl mb-2">Dopez vos classements locaux</h3>
            <p className="text-sm opacity-90">
              Découvrez les améliorations que vous pouvez apporter pour occuper la première place dans la recherche locale
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
