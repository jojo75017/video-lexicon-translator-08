
import React from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AnalyticsOverview from '@/components/seo/AnalyticsOverview';

interface MetricsSectionProps {
  isLoading: boolean;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({ isLoading }) => {
  return (
    <>
      {isLoading ? (
        <Card className="p-6">
          <Skeleton className="h-[400px]" />
        </Card>
      ) : (
        <AnalyticsOverview />
      )}
    </>
  );
};

export default MetricsSection;
