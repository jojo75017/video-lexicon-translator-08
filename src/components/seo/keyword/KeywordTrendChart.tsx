
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KeywordTrend } from '@/types/seo/Keyword';
import { generateTrendData } from '@/utils/keyword/keywordAnalyzer';
import { Badge } from '@/components/ui/badge';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Enregistrement des composants ChartJS nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface KeywordTrendChartProps {
  keyword: string;
  trends?: KeywordTrend;
}

const KeywordTrendChart: React.FC<KeywordTrendChartProps> = ({ keyword, trends }) => {
  // Si les tendances ne sont pas fournies, les générer
  const trendData = trends || generateTrendData(keyword);
  
  // Noms des mois pour les labels
  const months = [
    'Jan', 'Fév', 'Mars', 'Avr', 'Mai', 'Juin',
    'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'
  ];
  
  // Données pour le graphique
  const chartData = {
    labels: months.slice(0, trendData.data.length),
    datasets: [
      {
        label: keyword,
        data: trendData.data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Tendance sur 12 mois</CardTitle>
        <div className="flex items-center gap-2">
          {trendData.growth > 0 ? (
            <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +{trendData.growth}%
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
              <TrendingDown className="h-3 w-3" />
              {trendData.growth}%
            </Badge>
          )}
          {trendData.seasonal && (
            <Badge className="bg-blue-100 text-blue-800">
              Saisonnier
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          Évolution du volume de recherche pour "{keyword}" sur les 12 derniers mois.
        </p>
        <div className="h-[300px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordTrendChart;
