
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";

const IntegrationsSection: React.FC = () => {
  const [searchConsoleCode, setSearchConsoleCode] = useState('');
  const [analyticsCode, setAnalyticsCode] = useState('');
  const [isSearchConsoleConnected, setIsSearchConsoleConnected] = useState(false);
  const [isAnalyticsConnected, setIsAnalyticsConnected] = useState(false);

  const handleSearchConsoleConnect = () => {
    if (!searchConsoleCode.trim()) {
      toast.error("Veuillez entrer un code valide");
      return;
    }
    // Sauvegarder le code dans localStorage pour l'exemple
    localStorage.setItem('search_console_code', searchConsoleCode);
    setIsSearchConsoleConnected(true);
    toast.success("Google Search Console connecté avec succès");
  };

  const handleAnalyticsConnect = () => {
    if (!analyticsCode.trim()) {
      toast.error("Veuillez entrer un code valide");
      return;
    }
    // Sauvegarder le code dans localStorage pour l'exemple
    localStorage.setItem('analytics_code', analyticsCode);
    setIsAnalyticsConnected(true);
    toast.success("Google Analytics connecté avec succès");
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Intégrations</h2>
      <p className="text-gray-600 mb-4">
        Connectez vos outils SEO préférés pour analyser les données consolidées.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
          <h3 className="font-semibold text-lg mb-2">Google Search Console</h3>
          <p className="text-sm text-gray-600 mb-3">Connectez votre compte pour analyser les performances de recherche.</p>
          {!isSearchConsoleConnected ? (
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Code d'authentification"
                value={searchConsoleCode}
                onChange={(e) => setSearchConsoleCode(e.target.value)}
              />
              <Button 
                onClick={handleSearchConsoleConnect}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Connecter
              </Button>
            </div>
          ) : (
            <div className="text-green-600 font-medium">
              ✓ Connecté
            </div>
          )}
        </div>

        <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
          <h3 className="font-semibold text-lg mb-2">Google Analytics</h3>
          <p className="text-sm text-gray-600 mb-3">Intégrez vos statistiques de trafic et de comportement.</p>
          {!isAnalyticsConnected ? (
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Code d'authentification"
                value={analyticsCode}
                onChange={(e) => setAnalyticsCode(e.target.value)}
              />
              <Button 
                onClick={handleAnalyticsConnect}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Connecter
              </Button>
            </div>
          ) : (
            <div className="text-green-600 font-medium">
              ✓ Connecté
            </div>
          )}
        </div>

        <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
          <h3 className="font-semibold text-lg mb-2">Semrush</h3>
          <p className="text-sm text-gray-600">Importez vos données d'analyse concurrentielle.</p>
          <Button className="mt-3 text-purple-600 font-medium">
            Connecter
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default IntegrationsSection;
