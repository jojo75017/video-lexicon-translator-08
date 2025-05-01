
import React from 'react';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const AnalyticsDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b p-4 mb-6">
        <div className="container mx-auto flex items-center">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour au tableau de bord
            </Button>
          </Link>
          <h1 className="ml-4 text-xl font-bold">Analytics</h1>
        </div>
      </header>
      
      <div className="container mx-auto pb-10">
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Tableau de bord Analytics</h2>
          <p className="text-gray-600 mb-6">
            Visualisez et analysez les performances de votre site web.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">Trafic</h3>
              <p className="text-3xl font-bold">1,245</p>
              <p className="text-sm text-green-500">+18% par rapport au mois précédent</p>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">Taux de conversion</h3>
              <p className="text-3xl font-bold">3.2%</p>
              <p className="text-sm text-green-500">+0.5% par rapport au mois précédent</p>
            </Card>
          </div>
        </Card>
      </div>
    </div>
  );
};
