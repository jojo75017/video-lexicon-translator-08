
import React from 'react';
import { KeywordSuggestion } from '@/types/seo';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter } from 'recharts';

interface KeywordVisualizationsProps {
  mainKeywords: KeywordSuggestion[];
  allKeywords: KeywordSuggestion[];
}

const KeywordVisualizations: React.FC<KeywordVisualizationsProps> = ({ 
  mainKeywords, 
  allKeywords 
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Graphique Volume */}
      <div>
        <h3 className="text-md font-medium mb-3">Volume de recherche</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[...mainKeywords].sort((a, b) => (b.volume || b.searchVolume || 0) - (a.volume || a.searchVolume || 0)).slice(0, 5)}
              margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="keyword" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value} recherches`, "Volume"]} 
                labelFormatter={(label) => `Mot-clé: ${label}`}
              />
              <Bar dataKey={item => item.volume || item.searchVolume || 0} fill="#8884d8" name="Volume de recherche" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Graphique Difficulté */}
      <div>
        <h3 className="text-md font-medium mb-3">Difficulté et concurrence</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid />
              <XAxis type="number" dataKey="difficulty" name="Difficulté" unit="/100" />
              <YAxis 
                type="number" 
                dataKey={item => typeof item.competition === 'number' ? item.competition : 0} 
                name="Concurrence" 
                unit="%" 
                tickFormatter={(tick) => `${(tick * 100).toFixed(0)}%`} 
              />
              <Tooltip 
                formatter={(value, name) => [
                  name === "Difficulté" ? `${value}/100` : `${(Number(value) * 100).toFixed(1)}%`, 
                  name
                ]}
                labelFormatter={(index) => {
                  const item = allKeywords[index];
                  return item ? `Mot-clé: ${item.keyword}` : '';
                }}
              />
              <Legend />
              <Scatter 
                name="Mots-clés" 
                data={allKeywords} 
                fill="#8884d8" 
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default KeywordVisualizations;
