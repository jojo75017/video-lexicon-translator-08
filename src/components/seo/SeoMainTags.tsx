
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Tag, FileText, Heading1, Heading2, Heading3, Image } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SeoMainTagsProps {
  title: string;
  description: string;
  keywords: string[];
  h1Count?: number;
  h2Count?: number;
  h3Count?: number;
  imgCount?: number;
}

const SeoMainTags = ({ 
  title, 
  description, 
  keywords, 
  h1Count = 0,
  h2Count = 0,
  h3Count = 0,
  imgCount = 0
}: SeoMainTagsProps) => {
  // Fallback if i18n is not available
  const t = (key: string, fallback: string) => {
    try {
      // Check if useTranslation is available and working
      const { t: translate } = useTranslation();
      return translate(key) || fallback;
    } catch (e) {
      return fallback;
    }
  };
  
  // Ensure keywords is always an array
  const keywordsArray = Array.isArray(keywords) ? keywords : 
    (typeof keywords === 'string' ? [keywords] : []);
  
  return (
    <div className="space-y-6">
      <h3 className="font-medium mb-4 text-lg border-b pb-2">Balises SEO principales</h3>
      <ul className="space-y-4">
        <li>
          <div className="flex items-center gap-2">
            <span className="font-medium">Titre :</span>
            {title && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {title.length} caractères
              </Badge>
            )}
          </div>
          <p className="mt-1 text-gray-600">
            {title || "Non défini"}
          </p>
        </li>
        
        <li>
          <div className="flex items-center gap-2">
            <span className="font-medium">Description :</span>
            {description && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {description.length} caractères
              </Badge>
            )}
          </div>
          <p className="mt-1 text-gray-600">
            {description || "Non définie"}
          </p>
        </li>
        
        <li>
          <div className="flex items-center gap-2 mb-2">
            <Tag className="h-4 w-4" />
            <span className="font-medium">Mots-clés :</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywordsArray.length > 0 ? (
              keywordsArray.map((keyword, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  {keyword}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500 italic">Aucun mot-clé défini</span>
            )}
          </div>
        </li>
      </ul>
      
      <div className="mt-8 pt-4 border-t">
        <h4 className="font-medium mb-4 flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Structure de balises
        </h4>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className={`p-3 rounded-lg border flex flex-col items-center ${h1Count === 1 ? 'bg-green-50 border-green-100' : h1Count === 0 ? 'bg-gray-50 border-gray-100' : 'bg-red-50 border-red-100'}`}>
            <Heading1 className={`h-5 w-5 mb-1 ${h1Count === 1 ? 'text-green-600' : h1Count === 0 ? 'text-gray-400' : 'text-red-600'}`} />
            <span className={`text-2xl font-bold ${h1Count === 1 ? 'text-green-800' : h1Count === 0 ? 'text-gray-500' : 'text-red-800'}`}>{h1Count}</span>
            <span className={`text-xs ${h1Count === 1 ? 'text-green-700' : h1Count === 0 ? 'text-gray-500' : 'text-red-700'}`}>Balises H1</span>
            {h1Count !== 1 && (
              <span className="text-xs text-red-600 mt-1">{h1Count === 0 ? 'Manquante !' : 'Trop nombreuses !'}</span>
            )}
          </div>
          
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 flex flex-col items-center">
            <Heading2 className="h-5 w-5 text-orange-600 mb-1" />
            <span className="text-2xl font-bold text-orange-800">{h2Count}</span>
            <span className="text-xs text-orange-700">Balises H2</span>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex flex-col items-center">
            <Heading3 className="h-5 w-5 text-yellow-600 mb-1" />
            <span className="text-2xl font-bold text-yellow-800">{h3Count}</span>
            <span className="text-xs text-yellow-700">Balises H3</span>
          </div>
          
          <div className={`p-3 rounded-lg border flex flex-col items-center ${imgCount === 0 ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
            <Image className={`h-5 w-5 mb-1 ${imgCount === 0 ? 'text-red-600' : 'text-blue-600'}`} />
            <span className={`text-2xl font-bold ${imgCount === 0 ? 'text-red-800' : 'text-blue-800'}`}>{imgCount}</span>
            <span className={`text-xs ${imgCount === 0 ? 'text-red-700' : 'text-blue-700'}`}>Images</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoMainTags;
