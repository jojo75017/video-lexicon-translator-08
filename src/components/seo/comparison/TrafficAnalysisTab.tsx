
import React from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { ExternalLink, TrendingUp, Globe } from 'lucide-react';

interface TrafficData {
  date: string;
  traffic: number;
}

interface KeywordData {
  keyword: string;
  volume: number;
  position: number;
}

interface PageData {
  url: string;
  traffic: number;
  title: string;
}

interface TrafficAnalysisTabProps {
  site1: {
    url: string;
    monthlyVisitors: number;
    trafficHistory: TrafficData[];
    topKeywords: KeywordData[];
    topPages: PageData[];
  };
  site2: {
    url: string;
    monthlyVisitors: number;
    trafficHistory: TrafficData[];
    topKeywords: KeywordData[];
    topPages: PageData[];
  };
}

const TrafficAnalysisTab = ({ site1, site2 }: TrafficAnalysisTabProps) => {
  return (
    <div className="space-y-8">
      {/* Estimation du trafic mensuel */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Estimation du trafic mensuel
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-700">Page principale</div>
            <div className="text-2xl font-bold text-blue-900">
              {new Intl.NumberFormat('fr-FR').format(site1.monthlyVisitors)}
            </div>
            <div className="text-sm text-blue-600 mt-1">visiteurs / mois</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-green-700">Page comparée</div>
            <div className="text-2xl font-bold text-green-900">
              {new Intl.NumberFormat('fr-FR').format(site2.monthlyVisitors)}
            </div>
            <div className="text-sm text-green-600 mt-1">visiteurs / mois</div>
          </div>
        </div>
      </Card>

      {/* Évolution du trafic */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Évolution du trafic
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                allowDuplicatedCategory={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip />
              <Line 
                data={site1.trafficHistory} 
                type="monotone" 
                dataKey="traffic" 
                stroke="#3b82f6" 
                name="Page principale"
                strokeWidth={2}
              />
              <Line 
                data={site2.trafficHistory} 
                type="monotone" 
                dataKey="traffic" 
                stroke="#22c55e"
                name="Page comparée"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Top mots-clés */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Meilleurs mots-clés</h3>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-sm font-medium text-blue-700 mb-3">Page principale</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mot-clé</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Position</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {site1.topKeywords.map((keyword, index) => (
                  <TableRow key={index}>
                    <TableCell>{keyword.keyword}</TableCell>
                    <TableCell>{new Intl.NumberFormat('fr-FR').format(keyword.volume)}</TableCell>
                    <TableCell>{keyword.position}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <h4 className="text-sm font-medium text-green-700 mb-3">Page comparée</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mot-clé</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Position</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {site2.topKeywords.map((keyword, index) => (
                  <TableRow key={index}>
                    <TableCell>{keyword.keyword}</TableCell>
                    <TableCell>{new Intl.NumberFormat('fr-FR').format(keyword.volume)}</TableCell>
                    <TableCell>{keyword.position}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      {/* Top pages */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Pages les plus populaires</h3>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-sm font-medium text-blue-700 mb-3">Page principale</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead>Trafic mensuel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {site1.topPages.map((page, index) => (
                  <TableRow key={index}>
                    <TableCell className="max-w-[200px]">
                      <div className="flex items-center gap-2">
                        <div className="truncate">{page.title || page.url}</div>
                        <a 
                          href={page.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>{new Intl.NumberFormat('fr-FR').format(page.traffic)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <h4 className="text-sm font-medium text-green-700 mb-3">Page comparée</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead>Trafic mensuel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {site2.topPages.map((page, index) => (
                  <TableRow key={index}>
                    <TableCell className="max-w-[200px]">
                      <div className="flex items-center gap-2">
                        <div className="truncate">{page.title || page.url}</div>
                        <a 
                          href={page.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-500 hover:text-green-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>{new Intl.NumberFormat('fr-FR').format(page.traffic)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TrafficAnalysisTab;
