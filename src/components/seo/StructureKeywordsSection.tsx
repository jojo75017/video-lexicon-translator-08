
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Search, Target } from 'lucide-react';

interface Keyword {
  keyword: string;
  volume: number;
  cpc: number;
  difficulty: number;
}

interface StructureKeywordsSectionProps {
  keywords: Keyword[];
}

const StructureKeywordsSection: React.FC<StructureKeywordsSectionProps> = ({ keywords = [] }) => {
  if (keywords.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5 text-green-600" />
            Mots-clés détectés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Aucun mot-clé détecté dans le contenu.</p>
        </CardContent>
      </Card>
    );
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'bg-green-100 text-green-800';
    if (difficulty < 70) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Search className="h-5 w-5 text-green-600" />
          Mots-clés détectés ({keywords.length})
        </CardTitle>
        <p className="text-sm text-gray-600">
          Mots-clés extraits du contenu de la page
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {keywords.map((keyword, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{keyword.keyword}</div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {keyword.volume.toLocaleString()} vol/mois
                  </span>
                  <span>{keyword.cpc.toFixed(2)}€ CPC</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(keyword.difficulty)}>
                  {keyword.difficulty < 30 ? 'Facile' : keyword.difficulty < 70 ? 'Moyen' : 'Difficile'}
                </Badge>
                <Target className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
        
        {keywords.length > 5 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700">
              💡 <strong>Conseil:</strong> Utilisez ces mots-clés dans vos titres H2/H3 et 
              dans le contenu pour améliorer votre référencement naturel.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StructureKeywordsSection;
