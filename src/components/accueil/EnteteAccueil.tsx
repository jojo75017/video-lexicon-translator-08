
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const EnteteAccueil = () => {
  return (
    <div className="mb-12">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Optimisez votre <span className="text-indigo-600">référencement</span> avec l'intelligence artificielle
          </h1>
          <p className="text-xl text-gray-600">
            Des outils professionnels pour analyser et améliorer votre présence en ligne
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/seo">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Découvrir nos outils
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline">
              En savoir plus
            </Button>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-100 p-6 rounded-2xl shadow-lg border border-indigo-100">
            <img 
              src="https://storage.googleapis.com/lovable-static/seo-dashboard-illustration.svg" 
              alt="SEO Dashboard" 
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                e.currentTarget.src = 'https://storage.googleapis.com/lovable-static/placeholder.svg';
                e.currentTarget.onerror = null;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnteteAccueil;
