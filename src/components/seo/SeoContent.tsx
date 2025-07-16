
import React from 'react';
import { FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SeoContentProps {
  wordCount: number;
  internalLinks: number;
  externalLinks: number;
}

const SeoContent = ({ wordCount, internalLinks, externalLinks }: SeoContentProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="mt-6">
      <h3 className="font-medium mb-2 flex items-center gap-2">
        <FileText className="h-5 w-5" />
        {t('seo.content')}
      </h3>
      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        <div>
          <span className="font-medium">{t('seo.wordCount')} :</span> 
          {wordCount || 0}
        </div>
        <div>
          <span className="font-medium">{t('seo.internalLinks')} :</span> 
          {internalLinks || 0}
        </div>
        <div>
          <span className="font-medium">{t('seo.externalLinks')} :</span> 
          {externalLinks || 0}
        </div>
      </div>
    </div>
  );
};

export default SeoContent;
