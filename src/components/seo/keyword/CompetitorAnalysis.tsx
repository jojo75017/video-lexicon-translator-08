import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp, Users, ExternalLink } from 'lucide-react';
import { CompetitorData } from '../../../types/seo/Competitor';

interface CompetitorAnalysisProps {
  keyword: string;
}

const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({ keyword }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);

  React.useEffect(() => {
    if (keyword) {
      // Generate mock competitor data
      const mockCompetitors: CompetitorData[] = [
        {
          name: 'Booking.com',
          url: 'https://booking.com',
          domain: 'booking.com',
          title: 'Réservation d\'hôtels à Paris',
          description: 'Trouvez et réservez votre hôtel à Paris',
          ranking: 1,
          traffic: 500000,
          strength: 95,
          organic_traffic: 450000,
          estimatedTraffic: 500000,
          keywords: 15000,
          topKeywords: ['hotel paris', 'reservation hotel', 'hotel pas cher paris'],
          gaps: ['hotel boutique paris', 'hotel romantique paris']
        },
        {
          name: 'Leboncoin',
          url: 'https://leboncoin.fr',
          domain: 'leboncoin.fr',
          title: 'Annonces de locations de vacances à Paris',
          description: 'Consultez nos annonces de locations de vacances à Paris et trouvez le logement idéal pour votre séjour',
          ranking: 2,
          traffic: 400000,
          strength: 88,
          organic_traffic: 380000,
          estimatedTraffic: 400000,
          keywords: 12000,
          topKeywords: ['location vacances paris', 'appartement paris', 'studio paris'],
          gaps: ['location courte durée paris', 'location meublée paris']
        },
        {
          name: 'Airbnb',
          url: 'https://airbnb.fr',
          domain: 'airbnb.fr',
          title: 'Location de logements et chambres à Paris',
          description: 'Réservez un logement unique à Paris auprès d\'hôtes locaux',
          ranking: 3,
          traffic: 350000,
          strength: 92,
          organic_traffic: 330000,
          estimatedTraffic: 350000,
          keywords: 10000,
          topKeywords: ['location appartement paris', 'chambre paris', 'logement paris'],
          gaps: ['location atypique paris', 'location de luxe paris']
        }
      ];

      setCompetitors(mockCompetitors);
    }
  }, [keyword]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-500" />
          Analyse de la concurrence
        </CardTitle>
      </CardHeader>
      <CardContent>
        {competitors.length > 0 ? (
          <div className="space-y-4">
            {competitors.map((competitor, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{competitor.name}</h3>
                    <p className="text-sm text-gray-600">{competitor.description}</p>
                  </div>
                  <Badge variant="secondary">#{competitor.ranking}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Trafic:</span>
                    <span className="ml-1 font-medium">{competitor.traffic.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Force:</span>
                    <span className="ml-1 font-medium">{competitor.strength}/100</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Mots-clés:</span>
                    <span className="ml-1 font-medium">{competitor.keywords.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Aucune donnée de concurrence disponible pour ce mot-clé.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CompetitorAnalysis;
