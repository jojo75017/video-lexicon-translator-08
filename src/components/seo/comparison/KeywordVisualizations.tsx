
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, LineChart, Line } from 'recharts';

interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  competition: number;
}

interface KeywordVisualizationsProps {
  keywordSuggestions: KeywordSuggestion[];
}

const KeywordVisualizations = ({ keywordSuggestions }: KeywordVisualizationsProps) => {
  // Préparer les données pour le graphique de distribution des difficultés
  const difficultyGroups = keywordSuggestions.reduce((acc, kw) => {
    const range = Math.floor(kw.difficulty / 20) * 20;
    const key = `${range}-${range + 20}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const difficultyData = Object.entries(difficultyGroups).map(([range, count]) => ({
    range,
    count
  }));

  // Données pour la corrélation CPC/Volume
  const correlationData = keywordSuggestions.map(kw => ({
    keyword: kw.keyword,
    volume: kw.volume,
    cpc: kw.cpc
  }));

  // Trier les données par volume pour le graphique d'évolution
  const volumeData = [...keywordSuggestions]
    .sort((a, b) => b.volume - a.volume)
    .map(kw => ({
      keyword: kw.keyword,
      volume: kw.volume
    }));

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Distribution par difficulté</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={difficultyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Nombre de mots-clés" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Volume de recherche</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="keyword" angle={-45} textAnchor="end" interval={0} height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="volume" stroke="#10b981" name="Volume de recherche" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Corrélation CPC/Volume</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="volume" name="Volume" />
              <YAxis dataKey="cpc" name="CPC" unit="€" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name="Mots-clés" data={correlationData} fill="#8b5cf6" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default KeywordVisualizations;
