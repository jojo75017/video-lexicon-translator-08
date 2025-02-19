
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';

interface SeoStructureProps {
  h1Count: number;
  h2Count: number;
  h3Count: number;
  imgCount: number;
}

const SeoStructure = ({ h1Count, h2Count, h3Count, imgCount }: SeoStructureProps) => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h3 className="font-medium mb-2">{t('seo.structure')}</h3>
      <ul className="space-y-2">
        <li className="flex items-center gap-2">
          <span className="font-medium">H1 :</span> 
          <Badge variant={h1Count === 1 ? "secondary" : "destructive"}>
            {h1Count || 0}
          </Badge>
          {h1Count !== 1 && (
            <span className="text-sm text-red-500">
              {t('seo.suggestions.h1Count')}
            </span>
          )}
        </li>
        <li><span className="font-medium">H2 :</span> {h2Count || 0}</li>
        <li><span className="font-medium">H3 :</span> {h3Count || 0}</li>
        <li>
          <span className="font-medium">{t('seo.imageCount')} :</span> 
          {imgCount || 0}
        </li>
      </ul>
    </div>
  );
};

export default SeoStructure;
