
import React from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AdvancedOptimizations from '@/components/seo/AdvancedOptimizations';
import { SeoAnalysis } from '@/types/seo';

interface AdvancedSectionProps {
  isLoading: boolean;
  seoAnalysis: SeoAnalysis | null;
}

const AdvancedSection: React.FC<AdvancedSectionProps> = ({ isLoading, seoAnalysis }) => {
  return (
    <>
      {isLoading ? (
        <Card className="p-6">
          <Skeleton className="h-[300px]" />
        </Card>
      ) : seoAnalysis ? (
        <AdvancedOptimizations 
          content={seoAnalysis.paragraphs.map(p => p.text).join(' ')}
          links={seoAnalysis.backlinkDetails.map(b => b.url)}
        />
      ) : null}
    </>
  );
};

export default AdvancedSection;
