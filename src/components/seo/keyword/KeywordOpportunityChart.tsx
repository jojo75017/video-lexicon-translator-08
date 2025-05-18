
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { calculateOpportunityScore } from '@/utils/keyword/keywordAnalyzer';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

// Enregistrement des composants ChartJS nécessaires
ChartJS.register(
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

interface KeywordOpportunityChartProps {
  keywords: KeywordSuggestion[];
}

const KeywordOpportunityChart: React.FC<KeywordOpportunityChartProps> = ({ keywords }) => {
  // Calculer l'opportunité pour chaque mot-clé s'il n'est pas déjà calculé
  const keywordsWithOpportunity = keywords.map(keyword => ({
    ...keyword,
    opportunity: keyword.opportunity || calculateOpportunityScore(keyword)
  }));

  const chartData = {
    datasets: [
      {
        label: 'Opportunités de mots-clés',
        data: keywordsWithOpportunity.map(keyword => ({
          x: keyword.difficulty || 50,
          y: keyword.volume || 0,
          r: (keyword.opportunity || 0) / 5 + 5, // Taille du point basée sur l'opportunité
          keyword: keyword.keyword,
          opportunity: keyword.opportunity || 0
        })),
        backgroundColor: keywordsWithOpportunity.map(keyword => {
          const opp = keyword.opportunity || 0;
          if (opp > 70) return 'rgba(52, 211, 153, 0.8)'; // vert pour les bonnes opportunités
          if (opp > 40) return 'rgba(251, 191, 36, 0.8)'; // jaune pour les opportunités moyennes
          return 'rgba(239, 68, 68, 0.8)'; // rouge pour les faibles opportunités
        }),
        borderColor: 'rgba(255, 255, 255, 0.6)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Difficulté',
        },
        min: 0,
        max: 100,
      },
      y: {
        title: {
          display: true,
          text: 'Volume de recherche',
        },
        min: 0,
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const point = context.raw;
            return [
              `Mot-clé: ${point.keyword}`,
              `Difficulté: ${point.x}`,
              `Volume: ${point.y}`,
              `Opportunité: ${point.opportunity}/100`
            ];
          }
        }
      },
      legend: {
        display: true
      }
    },
    maintainAspectRatio: false
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Opportunités de mots-clés</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          Ce graphique montre le potentiel des mots-clés en fonction de leur volume de recherche, 
          leur difficulté et leur score d'opportunité (taille du cercle).
        </p>
        <div className="h-[400px]">
          <Scatter data={chartData} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordOpportunityChart;
