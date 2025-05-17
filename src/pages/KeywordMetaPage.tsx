
import React, { useState } from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Card } from '@/components/ui/card';
import { KeywordMetaContent } from '@/components/seo/keyword/KeywordMetaContent';

const KeywordMetaPage = () => {
  return (
    <UnifiedDashboard>
      <div className="container mx-auto py-4">
        <Card className="p-6 shadow-sm">
          <KeywordMetaContent />
        </Card>
      </div>
    </UnifiedDashboard>
  );
};

export default KeywordMetaPage;
