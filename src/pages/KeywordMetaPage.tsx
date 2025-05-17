
import React from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import KeywordTabContent from '@/components/dashboard/tabs/KeywordTabContent';

const KeywordMetaPage = () => {
  return (
    <UnifiedDashboard>
      <div className="container mx-auto py-4">
        <KeywordTabContent />
      </div>
    </UnifiedDashboard>
  );
};

export default KeywordMetaPage;
