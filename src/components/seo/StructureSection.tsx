
import React from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import SiteStructureVisualizer from '@/components/SiteStructureVisualizer';

interface StructureSectionProps {
  isLoading: boolean;
  siteStructure: { name: string; children: any[] } | null;
}

const StructureSection: React.FC<StructureSectionProps> = ({ isLoading, siteStructure }) => {
  return (
    <>
      {isLoading ? (
        <Card className="p-6">
          <Skeleton className="h-[400px]" />
        </Card>
      ) : siteStructure ? (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Structure du Site</h2>
          <SiteStructureVisualizer structure={siteStructure} />
        </Card>
      ) : null}
    </>
  );
};

export default StructureSection;
