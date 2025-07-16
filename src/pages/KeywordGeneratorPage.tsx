import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Target, TrendingUp, Copy, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const KeywordGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [seedKeyword, setSeedKeyword] = useState('');
  const [keywords, setKeywords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());

  const generateKeywords = () => {
    if (!seedKeyword.trim()) {
      toast.error('Veuillez entrer un mot-clé');
      return;
    }

    setIsLoading(true);

    // Simulation de génération de mots-clés
    setTimeout(() => {
      const prefixes = ['meilleur', 'comment', 'pourquoi', 'guide', 'prix', 'avis', 'comparatif', 'pas cher'];
      const suffixes = ['2024', 'france', 'gratuit', 'en ligne', 'débutant', 'professionnel', 'facile', 'rapide'];
      
      const generatedKeywords = [
        // Mot-clé principal
        { 
          keyword: seedKeyword, 
          volume: 15000, 
          difficulty: 85, 
          cpc: 2.40, 
          trend: 'stable',
          type: 'Principal' 
        },
        
        // Variations avec préfixes
        ...prefixes.slice(0, 4).map((prefix, i) => ({
          keyword: `${prefix} ${seedKeyword}`,
          volume: Math.floor(Math.random() * 8000) + 1000,
          difficulty: Math.floor(Math.random() * 40) + 30,
          cpc: Math.random() * 3 + 0.5,
          trend: ['hausse', 'baisse', 'stable'][Math.floor(Math.random() * 3)],
          type: 'Longue traîne'
        })),
        
        // Variations avec suffixes
        ...suffixes.slice(0, 4).map((suffix, i) => ({
          keyword: `${seedKeyword} ${suffix}`,
          volume: Math.floor(Math.random() * 5000) + 500,
          difficulty: Math.floor(Math.random() * 30) + 20,
          cpc: Math.random() * 2 + 0.3,
          trend: ['hausse', 'baisse', 'stable'][Math.floor(Math.random() * 3)],
          type: 'Longue traîne'
        })),

        // Questions
        ...['que', 'quel', 'comment', 'pourquoi'].map((question, i) => ({
          keyword: `${question} ${seedKeyword}`,
          volume: Math.floor(Math.random() * 2000) + 200,
          difficulty: Math.floor(Math.random() * 25) + 15,
          cpc: Math.random() * 1.5 + 0.2,
          trend: ['hausse', 'baisse', 'stable'][Math.floor(Math.random() * 3)],
          type: 'Question'
        }))
      ];

      setKeywords(generatedKeywords);
      setIsLoading(false);
      toast.success(`${generatedKeywords.length} mots-clés générés !`);
    }, 2000);
  };

  const toggleKeywordSelection = (keyword: string) => {
    const newSelection = new Set(selectedKeywords);
    if (newSelection.has(keyword)) {
      newSelection.delete(keyword);
    } else {
      newSelection.add(keyword);
    }
    setSelectedKeywords(newSelection);
  };

  const copyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    toast.success('Mot-clé copié !');
  };

  const exportKeywords = () => {
    const exportData = keywords.map(k => ({
      'Mot-clé': k.keyword,
      'Volume': k.volume,
      'Difficulté': k.difficulty,
      'CPC': k.cpc.toFixed(2),
      'Tendance': k.trend,
      'Type': k.type
    }));

    const csv = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keywords-${seedKeyword}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Export réussi !');
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'bg-green-100 text-green-800';
    if (difficulty < 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'hausse': return '📈';
      case 'baisse': return '📉';
      default: return '➡️';
    }
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'Principal': 'bg-blue-100 text-blue-800',
      'Longue traîne': 'bg-purple-100 text-purple-800',
      'Question': 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            🔍 Générateur de Mots-clés
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Mot-clé principal</label>
                <Input
                  placeholder="marketing digital"
                  value={seedKeyword}
                  onChange={(e) => setSeedKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && generateKeywords()}
                />
              </div>

              <Button onClick={generateKeywords} disabled={isLoading} className="w-full">
                {isLoading ? 'Génération...' : 'Générer des mots-clés'}
              </Button>

              {keywords.length > 0 && (
                <div className="pt-4 border-t space-y-3">
                  <div className="text-sm font-medium">Statistiques</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-medium">{keywords.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Volume moyen:</span>
                      <span className="font-medium">
                        {Math.round(keywords.reduce((acc, k) => acc + k.volume, 0) / keywords.length).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sélectionnés:</span>
                      <span className="font-medium">{selectedKeywords.size}</span>
                    </div>
                  </div>

                  <Button variant="outline" onClick={exportKeywords} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter CSV
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {keywords.length > 0 && (
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Mots-clés générés
                  <Badge variant="outline">{keywords.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {keywords.map((keyword, index) => (
                    <div 
                      key={index} 
                      className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                        selectedKeywords.has(keyword.keyword) ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedKeywords.has(keyword.keyword)}
                            onChange={() => toggleKeywordSelection(keyword.keyword)}
                            className="rounded"
                          />
                          <span className="font-medium">{keyword.keyword}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyKeyword(keyword.keyword)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getTypeColor(keyword.type)}>
                            {keyword.type}
                          </Badge>
                          <span className="text-lg">{getTrendIcon(keyword.trend)}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Volume</div>
                          <div className="font-medium flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {keyword.volume.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Difficulté</div>
                          <Badge variant="outline" className={getDifficultyColor(keyword.difficulty)}>
                            {keyword.difficulty}%
                          </Badge>
                        </div>
                        <div>
                          <div className="text-gray-500">CPC</div>
                          <div className="font-medium">{keyword.cpc.toFixed(2)}€</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Tendance</div>
                          <div className="font-medium capitalize">{keyword.trend}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default KeywordGeneratorPage;