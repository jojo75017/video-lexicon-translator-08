
import React from 'react';
import { Card } from "@/components/ui/card";
import ContentHierarchy from '@/components/ContentHierarchy';

const HierarchyTabContent = () => {
  return (
    <div className="space-y-4">
      <ContentHierarchy 
        headings={[]} 
        paragraphs={[]} 
        recommendations={[]}
      />
    </div>
  );
};

export default HierarchyTabContent;
