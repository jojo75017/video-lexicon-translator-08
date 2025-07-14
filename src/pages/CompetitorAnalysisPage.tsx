
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import EnhancedCompetitorAnalyzer from '@/components/seo/competitor/EnhancedCompetitorAnalyzer';

const CompetitorAnalysisPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <header className="bg-white/80 backdrop-blur-sm border-b p-4 mb-6">
        <div className="container mx-auto flex items-center">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour au tableau de bord
            </Button>
          </Link>
          <h1 className="ml-4 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Analyse Concurrentielle Avancée
          </h1>
        </div>
      </header>
      
      <div className="container mx-auto pb-10">
        <Card className="p-6 mb-6 border-purple-500 border-t-4 bg-gradient-to-r from-purple-50/50 to-blue-50/50">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Analyse Comparative Complète - Toutes Thématiques
          </h2>
          <p className="text-gray-600 mb-6">
            Analysez n'importe quel secteur : e-commerce, voyage, santé, finance, tech, immobilier...
            Comparez votre site avec 2 concurrents et obtenez un plan d'action détaillé pour les surpasser.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-700 mb-2">🌐 Analyse Universelle</h3>
              <p className="text-sm text-gray-600">Fonctionne avec tous les secteurs et thématiques</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-700 mb-2">🤖 IA Avancée</h3>
              <p className="text-sm text-gray-600">Intégration OpenAI pour des insights personnalisés</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-700 mb-2">📊 Analyse Complète</h3>
              <p className="text-sm text-gray-600">Mots-clés, positions, opportunités, plan d'action</p>
            </div>
          </div>
          
          <EnhancedCompetitorAnalyzer />
        </Card>
      </div>
    </div>
  );
};

export default CompetitorAnalysisPage;
