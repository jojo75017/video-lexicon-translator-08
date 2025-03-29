
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import LocalBusinessSection from '@/components/LocalBusinessSection';
import SectionEntreprisesLocales from '@/components/SectionEntreprisesLocales';
import { Card } from '@/components/ui/card';
import { MapPin, Search, Globe, BarChart } from 'lucide-react';

const LocalBusinessPage = () => {
  return (
    <PageLayout 
      title="Entreprises Locales" 
      description="Optimisez votre présence en ligne locale et apparaissez dans les recherches géolocalisées"
      currentTab="local-business"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-5 border-indigo-100 shadow-md">
          <div className="flex items-center mb-3">
            <div className="bg-indigo-100 p-2 rounded-full mr-3">
              <MapPin className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="font-medium text-lg">Présence locale</h3>
          </div>
          <p className="text-gray-600 text-sm">Assurez votre visibilité sur Google Maps et les résultats de recherche locaux pour attirer plus de clients près de chez vous.</p>
        </Card>
        
        <Card className="p-5 border-blue-100 shadow-md">
          <div className="flex items-center mb-3">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <Search className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-medium text-lg">SEO local</h3>
          </div>
          <p className="text-gray-600 text-sm">Optimisez votre site pour les recherches géolocalisées avec des mots-clés pertinents et une structure adaptée.</p>
        </Card>
        
        <Card className="p-5 border-emerald-100 shadow-md">
          <div className="flex items-center mb-3">
            <div className="bg-emerald-100 p-2 rounded-full mr-3">
              <BarChart className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="font-medium text-lg">Analytics locaux</h3>
          </div>
          <p className="text-gray-600 text-sm">Analysez les performances de votre entreprise sur les recherches locales et identifiez les opportunités d'amélioration.</p>
        </Card>
      </div>
      
      <div data-section="local-business" className="space-y-8">
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
      </div>
    </PageLayout>
  );
};

export default LocalBusinessPage;
