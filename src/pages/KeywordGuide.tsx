
import React from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import KeywordGeneratorGuide from '@/components/seo/keyword/KeywordGeneratorGuide';

const KeywordGuide: React.FC = () => {
  return (
    <UnifiedDashboard>
      <KeywordGeneratorGuide />
    </UnifiedDashboard>
  );
};

export default KeywordGuide;
