
import React from 'react';
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BacklinkInfo } from '@/types/seo';

interface BacklinkSectionProps {
  isLoading: boolean;
  backlinks?: BacklinkInfo[] | number;
  onAnalyze: () => void;
}

const BacklinkSection = ({ isLoading, backlinks, onAnalyze }: BacklinkSectionProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Backlinks</h3>
      
      {isLoading ? (
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      ) : backlinks ? (
        <div className="space-y-4">
          <p>
            Nombre de backlinks: {typeof backlinks === 'number' ? backlinks : backlinks.length}
          </p>
          {typeof backlinks === 'number' ? (
            <p>Analysez le site pour voir les détails des backlinks</p>
          ) : (
            <p>Voir les détails des backlinks dans l'analyse complète</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Alert className="bg-blue-50 border-blue-100">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-700">
              Analysez un site web pour voir ses backlinks et leur qualité.
            </AlertDescription>
          </Alert>
          <Button onClick={onAnalyze} className="w-full">
            Analyser un site
          </Button>
        </div>
      )}
    </Card>
  );
};

export default BacklinkSection;
