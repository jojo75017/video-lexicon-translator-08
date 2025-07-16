import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CompetitorData, SocialMetricsProps } from "@/types/seo";

interface DetailedMetricsProps {
  data: {
    domain: string;
    title: string;
    description: string;
    keywords: string[];
    rankingKeywords: number;
    traffic: number;
    authorityScore: number;
    backlinks: number;
    socialMetrics: {
      facebook: number;
      twitter: number;
      pinterest: number;
      linkedin: number;
    };
    competitors: CompetitorData[];
  };
}

const SocialMetrics: React.FC<SocialMetricsProps> = ({ metrics }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Métriques Sociales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{metrics.facebook}</div>
            <div className="text-sm text-gray-600">Facebook</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{metrics.twitter}</div>
            <div className="text-sm text-gray-600">Twitter</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{metrics.pinterest}</div>
            <div className="text-sm text-gray-600">Pinterest</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">{metrics.linkedin}</div>
            <div className="text-sm text-gray-600">LinkedIn</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DetailedMetrics: React.FC<DetailedMetricsProps> = ({ data }) => {
  const competitorData = data.competitors || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Aperçu du Site</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              <span className="font-bold">Domaine:</span> {data.domain}
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-bold">Titre:</span> {data.title}
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-bold">Description:</span> {data.description}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance SEO</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {data.rankingKeywords}
              </div>
              <div className="text-sm text-gray-600">Mots-clés Positionnés</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{data.traffic}</div>
              <div className="text-sm text-gray-600">Trafic Estimé</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {data.authorityScore}
              </div>
              <div className="text-sm text-gray-600">Score d'Autorité</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{data.backlinks}</div>
              <div className="text-sm text-gray-600">Backlinks</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <SocialMetrics 
        metrics={{
          facebook: data.socialMetrics?.facebook || 0,
          twitter: data.socialMetrics?.twitter || 0,
          pinterest: data.socialMetrics?.pinterest || 0,
          linkedin: data.socialMetrics?.linkedin || 0
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mots-clés Principaux</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.keywords.map((keyword, index) => (
              <Badge key={index} variant="secondary">
                {keyword}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Concurrents</CardTitle>
        </CardHeader>
        <CardContent>
          {competitorData.length > 0 ? (
            <div className="space-y-4">
              {competitorData.map((competitor, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800">{competitor.domain}</h3>
                  <p className="text-sm text-gray-600">{competitor.title}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {competitor.keywords.map((keyword, i) => (
                      <Badge key={i} variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Aucun concurrent trouvé.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedMetrics;
