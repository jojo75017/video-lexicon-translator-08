
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Star, HelpCircle } from 'lucide-react';
import { SerpFeature } from '../../../types/seo/Competitor';

interface SerpFeaturesAnalyzerProps {
  keyword?: string;
}

const SerpFeaturesAnalyzer: React.FC<SerpFeaturesAnalyzerProps> = ({ keyword }) => {
  const [features] = useState<SerpFeature[]>([
    {
      type: 'Featured Snippet',
      present: true,
      position: 1,
      title: 'Guide des hôtels à Paris',
      content: 'Les meilleurs quartiers pour dormir à Paris...'
    },
    {
      type: 'People Also Ask',
      present: true,
      position: 3,
      title: 'Questions fréquentes',
      content: 'Où dormir à Paris pour la première fois ?'
    },
    {
      type: 'Local Pack',
      present: false,
      position: undefined,
      title: '',
      content: ''
    },
    {
      type: 'Image Pack',
      present: true,
      position: 2,
      title: 'Images d\'hôtels parisiens',
      content: 'Galerie de photos des meilleurs hôtels'
    }
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-purple-500" />
          Fonctionnalités SERP
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h3 className="font-medium">{feature.type}</h3>
                {feature.present && feature.title && (
                  <p className="text-sm text-gray-600">{feature.title}</p>
                )}
              </div>
              <Badge variant={feature.present ? "default" : "secondary"}>
                {feature.present ? `Position ${feature.position}` : 'Absent'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SerpFeaturesAnalyzer;
