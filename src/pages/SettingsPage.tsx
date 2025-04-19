
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import AnalysisSettings from '@/components/settings/AnalysisSettings';

const SettingsPage = () => {
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
          <h1 className="ml-4 text-xl font-bold">Paramètres</h1>
        </div>
      </header>
      
      <div className="container mx-auto space-y-6">
        <AnalysisSettings />
      </div>
    </div>
  );
};

export default SettingsPage;
