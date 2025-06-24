
import React from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import ModernKeywordGenerator from '@/components/seo/keyword/ModernKeywordGenerator';

const KeywordGeneratorPage = () => {
  return (
    <UnifiedDashboard>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Générateur de Mots-Clés IA
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Générez des mots-clés intelligents avec l'IA d'OpenAI. Obtenez des suggestions sémantiques, longue traîne et des analyses approfondies.
          </p>
        </div>

        <ModernKeywordGenerator />
      </div>
    </UnifiedDashboard>
  );
};

export default KeywordGeneratorPage;
