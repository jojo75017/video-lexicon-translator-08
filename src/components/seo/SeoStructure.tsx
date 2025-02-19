
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';
import { List, Heading1, Heading2, Heading3, Image } from 'lucide-react';

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
      <div className="flex items-center gap-2 mb-4">
        <List className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Structure de la page</h3>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Heading1 className="h-4 w-4 text-gray-600" />
            <span className="font-medium">Titres H1</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={h1Count === 1 ? "success" : "destructive"}>
              {h1Count || 0}
            </Badge>
            {h1Count !== 1 && (
              <span className="text-sm text-red-500">
                Devrait être égal à 1
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Heading2 className="h-4 w-4 text-gray-600" />
            <span className="font-medium">Titres H2</span>
          </div>
          <Badge variant="secondary">{h2Count || 0}</Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Heading3 className="h-4 w-4 text-gray-600" />
            <span className="font-medium">Titres H3</span>
          </div>
          <Badge variant="secondary">{h3Count || 0}</Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Image className="h-4 w-4 text-gray-600" />
            <span className="font-medium">Images</span>
          </div>
          <Badge variant="secondary">{imgCount || 0}</Badge>
        </div>
      </div>
    </div>
  );
};

export default SeoStructure;
