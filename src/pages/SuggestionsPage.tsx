import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Lightbulb, Search, Target, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const SuggestionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateSuggestions = () => {
    if (!keyword.trim()) {
      toast.error('Veuillez entrer un mot-clé');
      return;
    }

    setIsLoading(true);

    // Simulation de génération de suggestions
    setTimeout(() => {
      const baseSuggestions = [
        { text: `${keyword} guide complet`, volume: 2400, difficulty: 'Moyen', intent: 'Informationnel' },
        { text: `meilleur ${keyword}`, volume: 1800, difficulty: 'Difficile', intent: 'Commercial' },
        { text: `${keyword} pas cher`, volume: 3200, difficulty: 'Facile', intent: 'Transactionnel' },
        { text: `${keyword} avis`, volume: 1200, difficulty: 'Facile', intent: 'Informationnel' },
        { text: `comment choisir ${keyword}`, volume: 950, difficulty: 'Moyen', intent: 'Informationnel' },
        { text: `${keyword} 2024`, volume: 1600, difficulty: 'Moyen', intent: 'Informationnel' },
        { text: `${keyword} prix`, volume: 2100, difficulty: 'Moyen', intent: 'Commercial' },
        { text: `acheter ${keyword}`, volume: 1400, difficulty: 'Difficile', intent: 'Transactionnel' },
        { text: `${keyword} comparatif`, volume: 800, difficulty: 'Moyen', intent: 'Commercial' },
        { text: `${keyword} débutant`, volume: 600, difficulty: 'Facile', intent: 'Informationnel' }
      ];

      setSuggestions(baseSuggestions);
      setIsLoading(false);
      toast.success(`${baseSuggestions.length} suggestions générées !`);
    }, 1500);
  };

  const copyKeyword = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Mot-clé copié !');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return 'bg-green-100 text-green-800';
      case 'Moyen': return 'bg-yellow-100 text-yellow-800';
      case 'Difficile': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'Informationnel': return 'bg-blue-100 text-blue-800';
      case 'Commercial': return 'bg-purple-100 text-purple-800';
      case 'Transactionnel': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-yellow-50/30 to-orange-50/30 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            💡 Suggestions de Mots-clés
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Générateur de Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Mot-clé principal</label>
                <Input
                  placeholder="smartphone, voyage, marketing..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && generateSuggestions()}
                />
              </div>

              <Button onClick={generateSuggestions} disabled={isLoading} className="w-full">
                {isLoading ? 'Génération...' : 'Générer des suggestions'}
              </Button>

              {suggestions.length > 0 && (
                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-600 mb-2">Statistiques</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total suggestions:</span>
                      <span className="font-medium">{suggestions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Volume moyen:</span>
                      <span className="font-medium">
                        {Math.round(suggestions.reduce((acc, s) => acc + s.volume, 0) / suggestions.length)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {suggestions.length > 0 && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Suggestions trouvées
                  <Badge variant="outline">{suggestions.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{suggestion.text}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyKeyword(suggestion.text)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-sm text-gray-600">
                          {suggestion.volume.toLocaleString()} recherches/mois
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Badge variant="outline" className={getDifficultyColor(suggestion.difficulty)}>
                          {suggestion.difficulty}
                        </Badge>
                        <Badge variant="outline" className={getIntentColor(suggestion.intent)}>
                          {suggestion.intent}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    Exporter toutes les suggestions
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuggestionsPage;