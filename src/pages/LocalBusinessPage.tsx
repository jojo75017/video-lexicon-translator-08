
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import LocalBusinessSection from '@/components/LocalBusinessSection';
import SectionEntreprisesLocales from '@/components/SectionEntreprisesLocales';
import { Card } from '@/components/ui/card';
import { MapPin, Search, Globe, BarChart, Building, Settings, PieChart } from 'lucide-react';

const LocalBusinessPage = () => {
  return (
    <PageLayout 
      title="Entreprises Locales" 
      description="Optimisez votre présence en ligne locale et apparaissez dans les recherches géolocalisées"
      currentTab="local-business"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-5 border-indigo-100 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-3">
            <div className="bg-indigo-100 p-2 rounded-full mr-3">
              <MapPin className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="font-medium text-lg">Présence locale</h3>
          </div>
          <p className="text-gray-600 text-sm">Assurez votre visibilité sur Google Maps et les résultats de recherche locaux pour attirer plus de clients près de chez vous.</p>
        </Card>
        
        <Card className="p-5 border-blue-100 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-3">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <Search className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-medium text-lg">SEO local</h3>
          </div>
          <p className="text-gray-600 text-sm">Optimisez votre site pour les recherches géolocalisées avec des mots-clés pertinents et une structure adaptée.</p>
        </Card>
        
        <Card className="p-5 border-emerald-100 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-3">
            <div className="bg-emerald-100 p-2 rounded-full mr-3">
              <BarChart className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="font-medium text-lg">Analytics locaux</h3>
          </div>
          <p className="text-gray-600 text-sm">Analysez les performances de votre entreprise sur les recherches locales et identifiez les opportunités d'amélioration.</p>
        </Card>
      </div>
      
      <div data-section="local-business" className="space-y-8 block">
        <Card className="p-6 border-gray-200 shadow-md">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Globe className="mr-2 h-5 w-5 text-blue-600" />
            Gestion de votre présence locale
          </h2>
          <LocalBusinessSection />
        </Card>
        
        <Card className="p-6 border-gray-200 shadow-md">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-indigo-600" />
            Optimisation pour les entreprises locales
          </h2>
          <SectionEntreprisesLocales />
        </Card>
        
        <Card className="p-6 border-gray-200 shadow-md">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Building className="mr-2 h-5 w-5 text-green-600" />
            Configuration de votre entreprise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-base">Informations générales</h3>
              <div className="space-y-2">
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">Nom de l'entreprise</label>
                  <input 
                    type="text" 
                    className="border border-gray-300 rounded-md p-2 w-full"
                    placeholder="Ex: Ma Super Entreprise"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">Adresse complète</label>
                  <input 
                    type="text" 
                    className="border border-gray-300 rounded-md p-2 w-full"
                    placeholder="Ex: 123 rue du Commerce, 75001 Paris"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">Numéro de téléphone</label>
                  <input 
                    type="tel" 
                    className="border border-gray-300 rounded-md p-2 w-full"
                    placeholder="Ex: +33 1 23 45 67 89"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium text-base">Paramètres d'optimisation</h3>
              <div className="space-y-2">
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">Catégorie principale</label>
                  <select className="border border-gray-300 rounded-md p-2 w-full">
                    <option>Restaurant</option>
                    <option>Hôtel</option>
                    <option>Boutique</option>
                    <option>Service professionnel</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">Mots-clés locaux</label>
                  <input 
                    type="text" 
                    className="border border-gray-300 rounded-md p-2 w-full"
                    placeholder="Ex: restaurant italien, paris, pasta"
                  />
                </div>
                <div className="flex items-center mt-2">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurer Google My Business
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-gray-200 shadow-md">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <PieChart className="mr-2 h-5 w-5 text-amber-600" />
            Statistiques locales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <div className="text-2xl font-bold text-amber-700">84%</div>
              <div className="text-sm text-amber-600">des utilisateurs recherchent des commerces locaux</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-2xl font-bold text-blue-700">76%</div>
              <div className="text-sm text-blue-600">visitent un commerce dans la journée</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="text-2xl font-bold text-green-700">28%</div>
              <div className="text-sm text-green-600">de ces recherches se convertissent en achat</div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium text-base mb-3">Conseils pour améliorer votre présence locale</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>Créez et vérifiez votre fiche Google My Business</li>
              <li>Assurez-vous que vos informations sont cohérentes sur tous les sites</li>
              <li>Collectez des avis clients positifs</li>
              <li>Utilisez des mots-clés locaux dans votre contenu</li>
              <li>Créez du contenu spécifique à votre localité</li>
            </ul>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default LocalBusinessPage;
