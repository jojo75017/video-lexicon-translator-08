import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const GrilleFonctionnalites = () => {
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Nos Fonctionnalités</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <Link to="/pinterest" className="text-xl font-semibold text-gray-900 mb-2 block hover:text-blue-600">
              Générateur Pinterest
            </Link>
            <p className="text-gray-600 mb-4">
              Créez des visuels Pinterest optimisés avec titres et descriptions
            </p>
            <Button asChild className="w-full">
              <Link to="/pinterest">
                Essayer
              </Link>
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <Link to="/image-generator" className="text-xl font-semibold text-gray-900 mb-2 block hover:text-blue-600">
              Générateur d'Images IA
            </Link>
            <p className="text-gray-600 mb-4">
              Créez des images uniques à partir de descriptions textuelles avec DALL-E
            </p>
            <Button asChild className="w-full">
              <Link to="/image-generator">
                Essayer
              </Link>
            </Button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default GrilleFonctionnalites;
