import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from 'lucide-react';
import { OrganicSearchProps } from '@/types/seo';

const OrganicSearch: React.FC<OrganicSearchProps> = ({ 
  keywords, 
  totalKeywords, 
  averagePosition, 
  visibility 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Search className="h-5 w-5 text-green-600" />
          Recherche Organique
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-gray-900">{totalKeywords}</div>
            <div className="text-sm text-gray-600">Mots-clés total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{averagePosition.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Position moyenne</div>
          </div>
          <div className="col-span-2">
            <div className="text-lg font-bold text-green-600">{visibility}%</div>
            <div className="text-sm text-gray-600">Visibilité</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface InfoCardsProps {
  data: {
    keywords?: string[];
    totalKeywords?: number;
    averagePosition?: number;
    visibility?: number;
  };
}

const InfoCards: React.FC<InfoCardsProps> = ({ data }) => {
  return (
    <OrganicSearch 
      keywords={data.keywords || []}
      totalKeywords={data.totalKeywords || 0}
      averagePosition={data.averagePosition || 0}
      visibility={data.visibility || 0}
    />
  );
};

export default InfoCards;
