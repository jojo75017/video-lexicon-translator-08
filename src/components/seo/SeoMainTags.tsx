
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SeoMainTagsProps {
  title: string;
  description: string;
  keywords: string[];
}

const SeoMainTags = ({ title, description, keywords }: SeoMainTagsProps) => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h3 className="font-medium mb-2">{t('seo.mainTags')}</h3>
      <ul className="space-y-4">
        <li>
          <div className="flex items-center gap-2">
            <span className="font-medium">{t('seo.title')} :</span>
            {title && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {title.length} caractères
              </Badge>
            )}
          </div>
          <p className="mt-1 text-gray-600">
            {title || t('seo.notDefined')}
          </p>
        </li>
        <li>
          <div className="flex items-center gap-2">
            <span className="font-medium">{t('seo.description')} :</span>
            {description && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {description.length} caractères
              </Badge>
            )}
          </div>
          <p className="mt-1 text-gray-600">
            {description || t('seo.notDefined_female')}
          </p>
        </li>
        <li>
          <div className="flex items-center gap-2 mb-2">
            <Tag className="h-4 w-4" />
            <span className="font-medium">{t('seo.keywords')} :</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(keywords) && keywords.length > 0 ? (
              keywords.map((keyword, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  {keyword}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500 italic">{t('seo.noKeywords')}</span>
            )}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default SeoMainTags;
