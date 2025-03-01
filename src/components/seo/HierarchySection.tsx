
import React from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ContentHierarchy from '@/components/ContentHierarchy';
import { SeoAnalysis } from '@/types/seo';

interface HierarchySectionProps {
  isLoading: boolean;
  seoAnalysis: SeoAnalysis | null;
}

const HierarchySection: React.FC<HierarchySectionProps> = ({ isLoading, seoAnalysis }) => {
  return (
    <>
      {isLoading ? (
        <Card className="p-6">
          <Skeleton className="h-[300px]" />
        </Card>
      ) : seoAnalysis ? (
        <ContentHierarchy 
          headings={seoAnalysis.headings || []} 
          paragraphs={seoAnalysis.paragraphs || []} 
        />
      ) : null}
    </>
  );
};

export default HierarchySection;
