
import React from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import KeywordGeneratorEnhanced from '@/components/seo/KeywordGeneratorEnhanced';

const KeywordGeneratorPage = () => {
  return (
    <UnifiedDashboard>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Générateur de mots-clés IA</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Utilisez l'intelligence artificielle pour générer des mots-clés pertinents et optimiser votre contenu SEO. 
            Configurez votre clé API OpenAI pour des suggestions encore plus précises.
          </p>
        </div>
        
        <KeywordGeneratorEnhanced />
      </div>
    </UnifiedDashboard>
  );
};

export default KeywordGeneratorPage;
