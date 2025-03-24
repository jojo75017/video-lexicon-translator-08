
import React from 'react';
import { Card } from "@/components/ui/card";
import MetaContentGenerator from '@/components/seo/MetaContentGenerator';

const SuggestionsTabContent = () => {
  return (
    <div className="space-y-4">
      <MetaContentGenerator />
    </div>
  );
};

export default SuggestionsTabContent;
