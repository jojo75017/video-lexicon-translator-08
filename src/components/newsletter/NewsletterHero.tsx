
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Sparkles, TrendingUp, Users, Zap } from 'lucide-react';

const NewsletterHero = () => {
  return (
    <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-purple-100 p-4 rounded-full">
            <Mail className="h-12 w-12 text-purple-600" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          La méthode accélérée pour créer des newsletters rentables en 2025
        </h1>
        
        <p className="text-xl mb-8 text-gray-700 leading-relaxed">
          💸 <strong>Transforme tes abonnés en clients</strong> avec des newsletters magnétiques qu'ils ADORENT recevoir 
          et qui génèrent (naturellement) des ventes <strong>SANS avoir à vendre</strong>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <TrendingUp className="h-8 w-8 text-green-600 mb-3 mx-auto" />
            <h3 className="font-semibold mb-2">+400 Sujets Testés</h3>
            <p className="text-sm text-gray-600">Idées de newsletters approuvées sur des milliers d'envois</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <Users className="h-8 w-8 text-blue-600 mb-3 mx-auto" />
            <h3 className="font-semibold mb-2">Communauté Engagée</h3>
            <p className="text-sm text-gray-600">Transforme ta liste email endormie en fans fidèles</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <Zap className="h-8 w-8 text-purple-600 mb-3 mx-auto" />
            <h3 className="font-semibold mb-2">Création Rapide</h3>
            <p className="text-sm text-gray-600">Combine finesse humaine et vitesse de l'IA</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Ce que tu vas découvrir :</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start gap-2">
              <Sparkles className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">La formule "15-12-12-1" pour des emails uniques</span>
            </div>
            <div className="flex items-start gap-2">
              <Sparkles className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Les 2 seuls types d'histoires qui vendent</span>
            </div>
            <div className="flex items-start gap-2">
              <Sparkles className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Techniques volées aux écrivains et journalistes</span>
            </div>
            <div className="flex items-start gap-2">
              <Sparkles className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">La "Curiosity Matrix" pour des objets percutants</span>
            </div>
          </div>
        </div>

        <Link to="/newsletter">
          <Button size="xl" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-4 text-lg">
            <Mail className="h-5 w-5 mr-2" />
            Créer ma première newsletter maintenant
          </Button>
        </Link>
        
        <p className="text-sm text-gray-500 mt-4">
          ✨ Générateur IA inclus • 🚀 Résultats immédiats • 💎 Méthodes éprouvées
        </p>
      </div>
    </Card>
  );
};

export default NewsletterHero;
