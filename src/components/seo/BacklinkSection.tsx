
import React from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import BacklinksAnalysis from '@/components/seo/BacklinksAnalysis';
import { SeoAnalysis } from '@/types/seo';

interface BacklinkSectionProps {
  isLoading: boolean;
  seoAnalysis: SeoAnalysis | null;
}

const BacklinkSection: React.FC<BacklinkSectionProps> = ({ isLoading, seoAnalysis }) => {
  return (
    <>
      {isLoading ? (
        <Card className="p-6">
          <Skeleton className="h-[300px]" />
        </Card>
      ) : seoAnalysis ? (
        <BacklinksAnalysis 
          backlinks={seoAnalysis.backlinks}
          backlinkDetails={seoAnalysis.backlinkDetails}
          topBacklinkDomains={seoAnalysis.topBacklinkDomains}
          doFollowBacklinks={seoAnalysis.doFollowBacklinks}
          noFollowBacklinks={seoAnalysis.noFollowBacklinks}
        />
      ) : null}
    </>
  );
};

export default BacklinkSection;
