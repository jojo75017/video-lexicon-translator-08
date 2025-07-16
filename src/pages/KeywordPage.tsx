
import React from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import AdvancedKeywordGenerator from '@/components/seo/keyword/AdvancedKeywordGenerator';

const KeywordPage = () => {
  return (
    <UnifiedDashboard>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Analyse de Mots-Clés
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez et analysez les mots-clés les plus performants pour votre stratégie SEO.
          </p>
        </div>

        <AdvancedKeywordGenerator />
      </div>
    </UnifiedDashboard>
  );
};

export default KeywordPage;
