
import React from 'react';
import { Building, MapPin, Star, Phone, Globe, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const SectionEntreprisesLocales = () => {
  return (
    <div className="my-12 bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Solutions SEO pour entreprises locales
        </h2>
        <p className="text-lg text-gray-600">
          Améliorez votre visibilité dans les recherches locales et attirez plus de clients dans votre zone géographique
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="text-indigo-600 mb-4">
            <MapPin className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Référencement local</h3>
          <p className="text-gray-600 mb-4">
            Optimisez votre présence sur Google Maps et les recherches locales
          </p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-center text-sm text-gray-600">
              <span className="h-2 w-2 bg-indigo-500 rounded-full mr-2"></span>
              Google Business Profile optimisé
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <span className="h-2 w-2 bg-indigo-500 rounded-full mr-2"></span>
              Citations locales cohérentes
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <span className="h-2 w-2 bg-indigo-500 rounded-full mr-2"></span>
              Optimisation pour "près de moi"
            </li>
          </ul>
        </Card>
        
        <Card className="p-6">
          <div className="text-indigo-600 mb-4">
            <Star className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Réputation en ligne</h3>
          <p className="text-gray-600 mb-4">
            Gérez vos avis clients et améliorez votre e-réputation
          </p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-center text-sm text-gray-600">
              <span className="h-2 w-2 bg-indigo-500 rounded-full mr-2"></span>
              Gestion des avis Google
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <span className="h-2 w-2 bg-indigo-500 rounded-full mr-2"></span>
              Stratégie de réponse aux avis
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <span className="h-2 w-2 bg-indigo-500 rounded-full mr-2"></span>
              Surveillance de réputation
            </li>
          </ul>
        </Card>
        
        <Card className="p-6">
          <div className="text-indigo-600 mb-4">
            <Building className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-semibold mb-2">SEO spécifique au secteur</h3>
          <p className="text-gray-600 mb-4">
            Solutions adaptées aux spécificités de votre secteur d'activité
          </p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-center text-sm text-gray-600">
              <span className="h-2 w-2 bg-indigo-500 rounded-full mr-2"></span>
              Mots-clés spécifiques au métier
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <span className="h-2 w-2 bg-indigo-500 rounded-full mr-2"></span>
              Contenu adapté aux clients locaux
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <span className="h-2 w-2 bg-indigo-500 rounded-full mr-2"></span>
              Stratégie concurrentielle locale
            </li>
          </ul>
        </Card>
      </div>
      
      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-semibold text-indigo-900 mb-1">Vous êtes une entreprise locale ?</h3>
          <p className="text-indigo-700">
            Découvrez notre programme spécial pour les commerces et entreprises de proximité
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          En savoir plus
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
              <Phone className="h-8 w-8 text-amber-600" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Support dédié</h3>
            <p className="text-gray-600 mb-2">
              Bénéficiez d'un accompagnement personnalisé pour développer votre présence en ligne locale
            </p>
            <Button variant="outline" className="mt-2 text-amber-600 border-amber-200 hover:bg-amber-50">
              Nous contacter
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Globe className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Ressources gratuites</h3>
            <p className="text-gray-600 mb-2">
              Accédez à nos guides et ressources pour optimiser vous-même votre présence locale
            </p>
            <Button variant="outline" className="mt-2 text-green-600 border-green-200 hover:bg-green-50">
              Télécharger nos guides
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionEntreprisesLocales;
