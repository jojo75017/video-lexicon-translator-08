
import React from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import AdvancedKeywordGenerator from '@/components/seo/keyword/AdvancedKeywordGenerator';

const KeywordGeneratorPage = () => {
  return (
    <UnifiedDashboard>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Générateur de Mots-Clés IA Avancé
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Générez des mots-clés intelligents avec l'IA OpenAI. Obtenez des suggestions sémantiques, 
            longue traîne, analyses approfondies, générateur de contenu, FAQ automatique et optimisation complète.
          </p>
        </div>

        <AdvancedKeywordGenerator />
      </div>
    </UnifiedDashboard>
  );
};

export default KeywordGeneratorPage;
