
import React from 'react';
import { ArrowLeft, BarChart2, PieChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CrawlForm } from "@/components/CrawlForm";

const AnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="bg-white border-b p-4 mb-6">
        <div className="container mx-auto flex items-center">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour au tableau de bord
            </Button>
          </Link>
          <h1 className="ml-4 text-xl font-bold">Analyse d'audience</h1>
        </div>
      </header>
      
      <div className="container mx-auto">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <BarChart2 className="h-6 w-6 mr-2 text-emerald-600" />
            Statistiques d'audience
          </h2>
          <p className="text-gray-600 mb-6">
            Consultez les statistiques et analyses de trafic de votre site web.
            Cette section vous permet de comprendre le comportement de vos visiteurs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-3">Sources de trafic</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Recherche organique</span>
                    <span className="text-sm font-medium">48%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '48%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Réseaux sociaux</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Trafic direct</span>
                    <span className="text-sm font-medium">18%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Liens référents</span>
                    <span className="text-sm font-medium">9%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '9%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-3">Statistiques des visiteurs</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded border border-gray-100 text-center">
                  <div className="text-sm text-gray-500">Visiteurs uniques</div>
                  <div className="text-2xl font-bold text-emerald-600">1,248</div>
                  <div className="text-xs text-emerald-500">+12% vs dernier mois</div>
                </div>
                
                <div className="bg-white p-3 rounded border border-gray-100 text-center">
                  <div className="text-sm text-gray-500">Pages par visite</div>
                  <div className="text-2xl font-bold text-blue-600">3.4</div>
                  <div className="text-xs text-blue-500">+0.2 vs dernier mois</div>
                </div>
                
                <div className="bg-white p-3 rounded border border-gray-100 text-center">
                  <div className="text-sm text-gray-500">Taux de rebond</div>
                  <div className="text-2xl font-bold text-amber-600">52%</div>
                  <div className="text-xs text-amber-500">-3% vs dernier mois</div>
                </div>
                
                <div className="bg-white p-3 rounded border border-gray-100 text-center">
                  <div className="text-sm text-gray-500">Durée moyenne</div>
                  <div className="text-2xl font-bold text-purple-600">2:34</div>
                  <div className="text-xs text-purple-500">+0:12 vs dernier mois</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-6 text-center mb-6">
            <h3 className="text-lg font-medium text-emerald-800 mb-3">
              <PieChart className="h-5 w-5 inline-block mr-2" />
              Module d'analyse avancée
            </h3>
            <p className="text-emerald-700 mb-4">
              Notre module d'analyse avancée sera bientôt disponible avec la version Premium.
              Vous pourrez accéder à des rapports détaillés et des données en temps réel.
            </p>
            <div className="inline-flex items-center justify-center px-4 py-2 border border-emerald-300 text-sm font-medium rounded-md text-emerald-700 bg-emerald-100">
              Bientôt disponible
            </div>
          </div>
          
          <CrawlForm />
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
