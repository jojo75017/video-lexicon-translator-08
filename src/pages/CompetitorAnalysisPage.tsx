
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TripleCompetitorAnalyzer from '@/components/seo/competitor/TripleCompetitorAnalyzer';

const CompetitorAnalysisPage = () => {
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
          <h1 className="ml-4 text-xl font-bold text-purple-600">Analyse Concurrentielle Triple</h1>
        </div>
      </header>
      
      <div className="container mx-auto pb-10">
        <Card className="p-6 mb-6 border-purple-500 border-t-4">
          <h2 className="text-2xl font-bold mb-2 text-purple-600">Analyse Comparative Avancée</h2>
          <p className="text-gray-600 mb-6">
            Comparez votre site avec 2 concurrents simultanément. Analysez les positions, 
            mots-clés, forces SEO et identifiez les opportunités d'amélioration.
          </p>
          
          <TripleCompetitorAnalyzer />
        </Card>
      </div>
    </div>
  );
};

export default CompetitorAnalysisPage;
