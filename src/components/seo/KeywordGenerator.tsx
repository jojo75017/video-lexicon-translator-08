
// Correction des erreurs de typage dans KeywordGenerator.tsx

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tag, TrendingUp, BarChart2 } from 'lucide-react';
import { KeywordData } from '@/types/seo';

const KeywordGenerator = () => {
  const [keywords, setKeywords] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Correction des types - utilisation de tableaux d'objets au lieu de nombres
  const [basicKeywords, setBasicKeywords] = useState<KeywordData[]>([]);
  const [longTailKeywords, setLongTailKeywords] = useState<KeywordData[]>([]);
  
  const [questionsKeywords, setQuestionsKeywords] = useState<KeywordData[]>([]);
  const [commercialKeywords, setCommercialKeywords] = useState<KeywordData[]>([]);
  
  const [localKeywords, setLocalKeywords] = useState<KeywordData[]>([]);
  const [relatedKeywords, setRelatedKeywords] = useState<KeywordData[]>([]);
  
  const generateKeywords = () => {
    if (!keywords.trim()) return;
    
    setIsLoading(true);
    
    // Simuler un délai d'API
    setTimeout(() => {
      try {
        // Générer des mots-clés fictifs basés sur l'entrée utilisateur
        const baseKeyword = keywords.trim().toLowerCase();
        
        // Mots-clés de base
        const basic = [
          { keyword: baseKeyword, count: Math.floor(Math.random() * 1000) + 500, density: Math.random() * 3 + 1 },
          { keyword: `${baseKeyword} en ligne`, count: Math.floor(Math.random() * 800) + 300, density: Math.random() * 2 + 0.5 },
          { keyword: `meilleur ${baseKeyword}`, count: Math.floor(Math.random() * 700) + 200, density: Math.random() * 1.5 + 0.3 },
          { keyword: `${baseKeyword} professionnel`, count: Math.floor(Math.random() * 600) + 100, density: Math.random() * 1 + 0.2 }
        ];
        
        // Mots-clés longue traîne
        const longTail = [
          { keyword: `comment trouver un bon ${baseKeyword}`, count: Math.floor(Math.random() * 500) + 50, density: Math.random() * 0.8 + 0.1 },
          { keyword: `${baseKeyword} pas cher et de qualité`, count: Math.floor(Math.random() * 400) + 30, density: Math.random() * 0.6 + 0.1 },
          { keyword: `meilleur ${baseKeyword} pour débutants`, count: Math.floor(Math.random() * 300) + 20, density: Math.random() * 0.5 + 0.1 }
        ];
        
        // Questions
        const questions = [
          { keyword: `comment choisir un ${baseKeyword}`, count: Math.floor(Math.random() * 400) + 40, density: Math.random() * 0.7 + 0.1 },
          { keyword: `pourquoi utiliser un ${baseKeyword}`, count: Math.floor(Math.random() * 350) + 30, density: Math.random() * 0.6 + 0.1 },
          { keyword: `quand acheter un ${baseKeyword}`, count: Math.floor(Math.random() * 300) + 20, density: Math.random() * 0.5 + 0.1 }
        ];
        
        // Commerciaux
        const commercial = [
          { keyword: `acheter ${baseKeyword}`, count: Math.floor(Math.random() * 800) + 200, density: Math.random() * 1.5 + 0.3 },
          { keyword: `prix ${baseKeyword}`, count: Math.floor(Math.random() * 700) + 150, density: Math.random() * 1.3 + 0.2 },
          { keyword: `${baseKeyword} promotion`, count: Math.floor(Math.random() * 600) + 100, density: Math.random() * 1.1 + 0.1 }
        ];
        
        // Locaux
        const local = [
          { keyword: `${baseKeyword} Paris`, count: Math.floor(Math.random() * 500) + 100, density: Math.random() * 1 + 0.2 },
          { keyword: `${baseKeyword} Lyon`, count: Math.floor(Math.random() * 400) + 80, density: Math.random() * 0.9 + 0.1 },
          { keyword: `${baseKeyword} Marseille`, count: Math.floor(Math.random() * 350) + 70, density: Math.random() * 0.8 + 0.1 }
        ];
        
        // Connexes
        const related = [
          { keyword: `alternative à ${baseKeyword}`, count: Math.floor(Math.random() * 600) + 150, density: Math.random() * 1.2 + 0.2 },
          { keyword: `${baseKeyword} vs concurrent`, count: Math.floor(Math.random() * 500) + 120, density: Math.random() * 1 + 0.1 },
          { keyword: `comparaison ${baseKeyword}`, count: Math.floor(Math.random() * 400) + 100, density: Math.random() * 0.9 + 0.1 }
        ];
        
        // Mettre à jour l'état avec les résultats générés
        setBasicKeywords(basic);
        setLongTailKeywords(longTail);
        setQuestionsKeywords(questions);
        setCommercialKeywords(commercial);
        setLocalKeywords(local);
        setRelatedKeywords(related);
      } catch (error) {
        console.error("Erreur lors de la génération des mots-clés:", error);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };
  
  const displayKeywords = (keywordList: KeywordData[]) => {
    return (
      <div className="space-y-3 mt-2">
        {keywordList.map((kw, idx) => (
          <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="font-medium">{kw.keyword}</div>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span className="flex items-center"><TrendingUp className="h-4 w-4 mr-1" />{kw.count}</span>
              <span className="flex items-center"><BarChart2 className="h-4 w-4 mr-1" />{kw.density.toFixed(1)}%</span>
            </div>
          </div>
        ))}
        {keywordList.length === 0 && (
          <div className="text-center p-4 text-gray-400">
            Aucun mot-clé généré
          </div>
        )}
      </div>
    );
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-blue-500" />
          Générateur de mots-clés
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input 
            placeholder="Entrez un mot-clé principal (ex: SEO)" 
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={generateKeywords}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Génération...' : 'Générer'}
          </Button>
        </div>
        
        {(basicKeywords.length > 0 || longTailKeywords.length > 0) && (
          <Tabs defaultValue="basic">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="basic">Mots-clés de base</TabsTrigger>
              <TabsTrigger value="longtail">Longue traîne</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
            </TabsList>
            <TabsContent value="basic">
              {displayKeywords(basicKeywords)}
            </TabsContent>
            <TabsContent value="longtail">
              {displayKeywords(longTailKeywords)}
            </TabsContent>
            <TabsContent value="questions">
              {displayKeywords(questionsKeywords)}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default KeywordGenerator;
