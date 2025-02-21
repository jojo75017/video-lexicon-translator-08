
import React from 'react';
import { Button } from "@/components/ui/button";

interface ComparisonHeaderProps {
  site1Url: string;
  site2Url: string;
  onChangeSite: () => void;
}

const ComparisonHeader = ({ site1Url, site2Url, onChangeSite }: ComparisonHeaderProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
        <div className="text-blue-800 font-semibold mb-1">Page principale</div>
        <div className="text-lg font-bold text-blue-900 break-all">{site1Url}</div>
      </div>
      <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
        <div className="text-green-800 font-semibold mb-1">Page comparée</div>
        <div className="text-lg font-bold text-green-900 break-all">{site2Url}</div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onChangeSite}
          className="mt-2 text-sm text-green-700 hover:text-green-800 hover:bg-green-100"
        >
          Changer de page
        </Button>
      </div>
    </div>
  );
};

export default ComparisonHeader;
