
import React from 'react';
import { Card } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion } from "framer-motion";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SearchTrendsProps {
  clicks: number;
  impressions: number;
}

const SearchTrends = ({ clicks, impressions }: SearchTrendsProps) => {
  const generateSearchTrendData = () => {
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString();
    }).reverse();

    return dates.map(date => ({
      date,
      clicks: Math.floor(Math.random() * clicks),
      impressions: Math.floor(Math.random() * impressions)
    }));
  };

  const generateTopPages = () => [
    { page: "/blog/seo-guide", visits: 2800, seoTraffic: 65 },
    { page: "/services", visits: 2400, seoTraffic: 58 },
    { page: "/about", visits: 1900, seoTraffic: 45 },
    { page: "/blog/marketing", visits: 1600, seoTraffic: 42 },
    { page: "/contact", visits: 1200, seoTraffic: 35 }
  ];

  const generateTopKeywords = () => [
    { keyword: "marketing digital", volume: 2800, competition: 0.75 },
    { keyword: "seo optimisation", volume: 2400, competition: 0.65 },
    { keyword: "référencement naturel", volume: 1900, competition: 0.55 },
    { keyword: "analytics web", volume: 1600, competition: 0.45 },
    { keyword: "marketing contenu", volume: 1200, competition: 0.40 }
  ];

  const searchTrendData = generateSearchTrendData();
  const topPages = generateTopPages();
  const topKeywords = generateTopKeywords();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="space-y-6"
    >
      <Card className="p-6">
        <Tabs defaultValue="trends">
          <TabsList className="mb-4">
            <TabsTrigger value="trends">Tendances de trafic</TabsTrigger>
            <TabsTrigger value="pages">Pages populaires</TabsTrigger>
            <TabsTrigger value="keywords">Mots-clés</TabsTrigger>
          </TabsList>

          <TabsContent value="trends">
            <h3 className="text-xl font-semibold mb-4">Tendances de recherche</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={searchTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="clicks" 
                    stackId="1"
                    stroke="#3b82f6" 
                    fill="#93c5fd" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="impressions" 
                    stackId="1"
                    stroke="#6366f1" 
                    fill="#818cf8" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="pages">
            <h3 className="text-xl font-semibold mb-4">Pages les plus visitées</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead>Visites</TableHead>
                  <TableHead>Trafic SEO (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPages.map((page, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{page.page}</TableCell>
                    <TableCell>{page.visits}</TableCell>
                    <TableCell>{page.seoTraffic}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="keywords">
            <h3 className="text-xl font-semibold mb-4">Mots-clés les plus performants</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mot-clé</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Compétition</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topKeywords.map((keyword, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{keyword.keyword}</TableCell>
                    <TableCell>{keyword.volume}</TableCell>
                    <TableCell>{(keyword.competition * 100).toFixed(0)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  );
};

export default SearchTrends;
