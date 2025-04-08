
import React from 'react';
import { Search, FileText, TrendingUp, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FeatureCards = () => {
  return (
    <div className="mt-12 grid gap-8 md:grid-cols-3">
      <Link to="/local-business" className="block">
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
      </Link>

      <Link to="/local-business" className="block">
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
      </Link>

      <Link to="/translation" className="block">
        <div className="bg-indigo-700 p-6 rounded-xl text-white hover:bg-indigo-600 transition-colors duration-200 cursor-pointer hover:shadow-lg">
          <div className="flex flex-col items-start gap-4 h-full">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
              <Languages className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-2">Traduction Vidéo</h3>
              <p className="text-sm opacity-90">
                Traduisez vos vidéos de l'anglais vers le français avec notre outil de traduction avancé
              </p>
              <span className="inline-block mt-2 bg-white text-indigo-700 text-xs font-bold px-2 py-1 rounded">NOUVEAU</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
