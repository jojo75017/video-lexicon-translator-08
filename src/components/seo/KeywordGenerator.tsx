
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { SeasonalityData } from '@/types/seo';

interface KeywordGeneratorProps {
  onGenerate?: (keywords: string[]) => void;
}

const KeywordGenerator: React.FC<KeywordGeneratorProps> = ({ onGenerate }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedKeywords, setGeneratedKeywords] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState('general');

  // Sample seasonality data
  const seasonalityData: Record<string, SeasonalityData> = {
    'marketing': {
      peak: ['January', 'September', 'November'],
      low: ['July', 'August']
    },
    'seo': {
      peak: ['February', 'October'],
      low: ['December', 'August']
    },
    'ecommerce': {
      peak: ['November', 'December'],
      low: ['January', 'February']
    }
  };

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast.error("Veuillez entrer un sujet pour générer des mots-clés");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Simulate API call with mock data
      const mockKeywords = getMockKeywords(topic);
      setGeneratedKeywords(mockKeywords);
      setLoading(false);
      if (onGenerate) onGenerate(mockKeywords);
    }, 1500);
  };

  const getMockKeywords = (topic: string): string[] => {
    const baseKeywords = [
      `${topic} guide`, 
      `meilleur ${topic}`, 
      `${topic} pour débutants`, 
      `comment trouver ${topic}`, 
      `${topic} comparatif`, 
      `${topic} pas cher`, 
      `${topic} professionnel`, 
      `${topic} en ligne`, 
      `${topic} gratuit`, 
      `${topic} 2023`
    ];
    
    return baseKeywords;
  };

  const getSeasonality = (keyword: string): SeasonalityData | null => {
    // Check if any key in seasonalityData is in the keyword
    for (const key in seasonalityData) {
      if (keyword.toLowerCase().includes(key.toLowerCase())) {
        return seasonalityData[key];
      }
    }
    return null;
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Générateur de mots-clés</h2>
      <p className="text-gray-600 mb-4">
        Générez des idées de mots-clés pertinents pour votre contenu SEO.
      </p>
      
      <div className="mb-6 flex gap-2">
        <Input
          placeholder="Entrez un sujet (ex: marketing digital)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Génération..." : "Générer"}
        </Button>
      </div>
      
      {generatedKeywords.length > 0 && (
        <div>
          <Tabs defaultValue="general" onValueChange={setSelectedTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="seasonal">Saisonnalité</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {generatedKeywords.map((keyword, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded-md hover:bg-gray-100 flex justify-between items-center">
                    <span>{keyword}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(keyword);
                        toast.success("Mot-clé copié");
                      }}
                    >
                      Copier
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="seasonal">
              <div className="space-y-4">
                {generatedKeywords.map((keyword, index) => {
                  const seasonality = getSeasonality(keyword);
                  return (
                    <div key={index} className="p-3 bg-gray-50 rounded-md">
                      <p className="font-medium mb-2">{keyword}</p>
                      {seasonality ? (
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-green-600 font-medium">Pics de recherche:</span>
                            <ul className="mt-1 list-disc list-inside">
                              {seasonality.peak.map((month, i) => (
                                <li key={i}>{month}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="text-amber-600 font-medium">Basse saison:</span>
                            <ul className="mt-1 list-disc list-inside">
                              {seasonality.low.map((month, i) => (
                                <li key={i}>{month}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">Pas de données saisonnières disponibles</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="questions">
              <div className="space-y-2">
                {generatedKeywords.map((keyword, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded-md">
                    {["Comment", "Pourquoi", "Quels sont", "Quelle est", "Où"][Math.floor(Math.random() * 5)]} {keyword} ?
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </Card>
  );
};

export default KeywordGenerator;
