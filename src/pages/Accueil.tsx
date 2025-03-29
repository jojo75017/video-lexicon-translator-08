
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search, BarChart2, FileText, Globe } from 'lucide-react';

const Accueil = () => {
  return (
    <PageLayout title="Accueil" description="Tableau de bord SEO et analyses">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Analyses SEO</h3>
            <p className="text-gray-600 mb-4">
              Explorez les analyses détaillées de vos pages web et améliorez votre référencement.
            </p>
            <Link to="/seo" className="mt-auto">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Voir les analyses
              </Button>
            </Link>
          </Card>
          
          <Card className="p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Contenu</h3>
            <p className="text-gray-600 mb-4">
              Analysez la structure et la qualité de votre contenu pour l'optimiser pour les moteurs de recherche.
            </p>
            <Link to="/hierarchy" className="mt-auto">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Analyser le contenu
              </Button>
            </Link>
          </Card>
          
          <Card className="p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <BarChart2 className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Performance</h3>
            <p className="text-gray-600 mb-4">
              Évaluez les performances techniques de votre site web et identifiez les améliorations.
            </p>
            <Link to="/performance" className="mt-auto">
              <Button className="bg-amber-600 hover:bg-amber-700">
                Voir la performance
              </Button>
            </Link>
          </Card>
        </div>
        
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center">
              <Globe className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Entreprises Locales</h3>
              <p className="text-gray-600 mb-4">
                Optimisez votre présence en ligne pour les recherches locales et attirez plus de clients dans votre zone géographique.
              </p>
              <Link to="/local-business">
                <Button className="bg-green-600 hover:bg-green-700">
                  Explorer les solutions locales
                </Button>
              </Link>
            </div>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Outils populaires</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/signature" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">S</span>
                  </div>
                  <div>
                    <div className="font-medium">Signature Email</div>
                    <div className="text-sm text-gray-600">Créez une signature professionnelle pour vos emails</div>
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/quora" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <div className="w-8 h-8 rounded-full bg-[#b92b27]/20 flex items-center justify-center mr-3">
                    <span className="text-[#b92b27] font-bold">Q</span>
                  </div>
                  <div>
                    <div className="font-medium">Questions Quora</div>
                    <div className="text-sm text-gray-600">Trouvez des questions pertinentes sur Quora</div>
                  </div>
                </Link>
              </li>
            </ul>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Dernières analyses</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">example.com</div>
                <div className="text-sm text-gray-600 mt-1">Score SEO: 78/100</div>
                <div className="mt-2 flex justify-end">
                  <Link to="/seo" className="text-blue-600 text-sm font-medium hover:underline">
                    Voir le rapport
                  </Link>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">business-site.fr</div>
                <div className="text-sm text-gray-600 mt-1">Score SEO: 65/100</div>
                <div className="mt-2 flex justify-end">
                  <Link to="/seo" className="text-blue-600 text-sm font-medium hover:underline">
                    Voir le rapport
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Accueil;
