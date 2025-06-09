
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Search, BarChart3, Users, Eye } from 'lucide-react';

interface OrganicSearchProps {
  keywords: string[];
  totalKeywords: number;
  averagePosition: number;
  visibility: number;
  keyword?: string; // Rendre optionnel
}

interface InfoCardsProps {
  organicSearch: OrganicSearchProps;
  paidSearch?: {
    adKeywords: number;
    estimatedBudget: string;
    topAds: string[];
  };
  backlinks?: {
    totalBacklinks: number;
    domains: number;
    newBacklinks: number;
    lostBacklinks: number;
  };
  traffic?: {
    monthlyVisits: number;
    avgSessionDuration: string;
    bounceRate: number;
    pagesPerSession: number;
  };
}

const InfoCards: React.FC<InfoCardsProps> = ({ 
  organicSearch, 
  paidSearch, 
  backlinks, 
  traffic 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Recherche organique */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Search className="h-5 w-5 text-blue-600" />
          <Badge variant="outline" className="text-xs">
            Organique
          </Badge>
        </div>
        <div className="space-y-2">
          <div>
            <p className="text-2xl font-bold">{organicSearch.totalKeywords.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Mots-clés</p>
          </div>
          <div className="flex justify-between text-sm">
            <span>Position moy.</span>
            <span className="font-medium">{organicSearch.averagePosition}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Visibilité</span>
            <span className="font-medium">{organicSearch.visibility}%</span>
          </div>
        </div>
      </Card>

      {/* Recherche payante */}
      {paidSearch && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            <Badge variant="outline" className="text-xs">
              Payant
            </Badge>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-2xl font-bold">{paidSearch.adKeywords.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Mots-clés ads</p>
            </div>
            <div className="flex justify-between text-sm">
              <span>Budget est.</span>
              <span className="font-medium">{paidSearch.estimatedBudget}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Backlinks */}
      {backlinks && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <Badge variant="outline" className="text-xs">
              Backlinks
            </Badge>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-2xl font-bold">{backlinks.totalBacklinks.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Liens entrants</p>
            </div>
            <div className="flex justify-between text-sm">
              <span>Domaines</span>
              <span className="font-medium">{backlinks.domains.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-600">+{backlinks.newBacklinks}</span>
              <TrendingDown className="h-3 w-3 text-red-500 ml-2" />
              <span className="text-red-600">-{backlinks.lostBacklinks}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Trafic */}
      {traffic && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-5 w-5 text-orange-600" />
            <Badge variant="outline" className="text-xs">
              Trafic
            </Badge>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-2xl font-bold">{traffic.monthlyVisits.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Visites/mois</p>
            </div>
            <div className="flex justify-between text-sm">
              <span>Durée</span>
              <span className="font-medium">{traffic.avgSessionDuration}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Rebond</span>
              <span className="font-medium">{traffic.bounceRate}%</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default InfoCards;
