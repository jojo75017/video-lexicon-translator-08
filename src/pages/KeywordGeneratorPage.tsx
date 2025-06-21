
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Copy, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface SimpleKeyword {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
}

const KeywordGeneratorPage = () => {
  const [mainKeyword, setMainKeyword] = useState('');
  const [language, setLanguage] = useState('fr');
  const [isGenerating, setIsGenerating] = useState(false);
  const [keywords, setKeywords] = useState<SimpleKeyword[]>([]);

  const generateSimpleKeywords = (baseKeyword: string): SimpleKeyword[] => {
    const prefixes = ['comment', 'pourquoi', 'meilleur', 'guide', 'tutoriel'];
    const suffixes = ['gratuit', 'en ligne', 'pas cher', '2024', 'facile'];
    const generated: SimpleKeyword[] = [];

    // Mot-clé principal
    generated.push({
      keyword: baseKeyword,
      volume: Math.floor(Math.random() * 10000) + 1000,
      difficulty: Math.floor(Math.random() * 100),
      cpc: parseFloat((Math.random() * 3).toFixed(2))
    });

    // Variations avec préfixes
    prefixes.forEach(prefix => {
      generated.push({
        keyword: `${prefix} ${baseKeyword}`,
        volume: Math.floor(Math.random() * 5000) + 100,
        difficulty: Math.floor(Math.random() * 80),
        cpc: parseFloat((Math.random() * 2).toFixed(2))
      });
    });

    // Variations avec suffixes
    suffixes.forEach(suffix => {
      generated.push({
        keyword: `${baseKeyword} ${suffix}`,
        volume: Math.floor(Math.random() * 3000) + 50,
        difficulty: Math.floor(Math.random() * 70),
        cpc: parseFloat((Math.random() * 1.5).toFixed(2))
      });
    });

    return generated;
  };

  const handleGenerate = () => {
    if (!mainKeyword.trim()) {
      toast.error('Veuillez entrer un mot-clé');
      return;
    }

    setIsGenerating(true);
    
    // Simulation du temps de génération
    setTimeout(() => {
      const generatedKeywords = generateSimpleKeywords(mainKeyword);
      setKeywords(generatedKeywords);
      setIsGenerating(false);
      toast.success(`${generatedKeywords.length} mots-clés générés !`);
    }, 1500);
  };

  const copyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    toast.success('Mot-clé copié !');
  };

  const exportCSV = () => {
    if (keywords.length === 0) {
      toast.error('Aucun mot-clé à exporter');
      return;
    }

    const csvContent = "Mot-clé,Volume,Difficulté,CPC\n" 
      + keywords.map(k => `"${k.keyword}",${k.volume},${k.difficulty},${k.cpc}`).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mots-cles-${mainKeyword}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Export CSV téléchargé !');
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'bg-green-100 text-green-800';
    if (difficulty < 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Sparkles className="h-10 w-10 text-blue-600" />
            Générateur de Mots-Clés
          </h1>
          <p className="text-xl text-gray-600">
            Trouvez les meilleurs mots-clés pour votre contenu
          </p>
        </div>

        {/* Formulaire de recherche */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Mot-clé principal</label>
                <Input
                  placeholder="Ex: marketing digital"
                  value={mainKeyword}
                  onChange={(e) => setMainKeyword(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Langue</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">Anglais</SelectItem>
                    <SelectItem value="es">Espagnol</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !mainKeyword.trim()}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>Génération...</>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Générer
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {keywords.length > 0 && (
              <div className="flex gap-2">
                <Button onClick={exportCSV} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter CSV
                </Button>
                <Badge variant="secondary">
                  {keywords.length} mots-clés générés
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Résultats */}
        {keywords.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Mots-clés générés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {keywords.map((keyword, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-lg">{keyword.keyword}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyKeyword(keyword.keyword)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Volume:</span>
                        <div className="font-semibold">{keyword.volume.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Difficulté:</span>
                        <Badge className={getDifficultyColor(keyword.difficulty)}>
                          {keyword.difficulty}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-gray-500">CPC:</span>
                        <div className="font-semibold">{keyword.cpc}€</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* État vide */}
        {keywords.length === 0 && !isGenerating && (
          <Card className="text-center py-12">
            <CardContent>
              <Sparkles className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Prêt à générer des mots-clés ?
              </h3>
              <p className="text-gray-500">
                Entrez un mot-clé principal et cliquez sur "Générer"
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default KeywordGeneratorPage;
