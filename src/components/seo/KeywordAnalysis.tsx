
import React from 'react';
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Search, TrendingUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface KeywordAnalysis {
  keyword: string;
  frequency: number;
  density: number;
}

interface KeywordAnalysisProps {
  keywords: KeywordAnalysis[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const KeywordAnalysis = ({ keywords }: KeywordAnalysisProps) => {
  const pieData = keywords.map(k => ({
    name: k.keyword,
    value: k.frequency
  }));

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Search className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Analyse des mots-clés</h3>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Principaux mots-clés
          </h4>
          
          <div className="grid gap-2">
            {keywords.map((keyword, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="font-medium">{keyword.keyword}</span>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    {keyword.frequency}x
                  </Badge>
                  <Badge variant="secondary">
                    {keyword.density.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default KeywordAnalysis;
