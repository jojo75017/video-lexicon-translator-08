
import React from 'react';
import { Card } from '@/components/ui/card';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import KeywordGeneratorEnhanced from '@/components/seo/KeywordGeneratorEnhanced';
import { Sparkles } from 'lucide-react';

const KeywordGeneratorPage: React.FC = () => {
  return (
    <UnifiedDashboard>
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-bold">Générateur de mots-clés avancé</h1>
          </div>
          <p className="text-gray-600 mb-6">
            Outil complet pour la recherche et l'analyse de mots-clés avec IA, analyse concurrentielle, 
            prédictions de volume et suggestions de contenu. Fonctionnalités inspirées de SEMrush, Ahrefs et SISTRIX.
          </p>
          
          <KeywordGeneratorEnhanced />
        </Card>
      </div>
    </UnifiedDashboard>
  );
};

export default KeywordGeneratorPage;
