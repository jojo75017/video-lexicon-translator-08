
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Phone, Clock, Navigation } from "lucide-react";
import { toast } from "sonner";

const LocalSeoAnalyzer = () => {
  const [location, setLocation] = useState('');
  const [business, setBusiness] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [localData, setLocalData] = useState<any>(null);

  const analyzeLocalSeo = async () => {
    if (!location.trim() || !business.trim()) {
      toast.error("Veuillez entrer une localisation et un type d'entreprise");
      return;
    }

    setIsAnalyzing(true);
    
    setTimeout(() => {
      const mockData = {
        localKeywords: [
          { keyword: `${business} ${location}`, volume: 850, difficulty: 35, localIntent: 95 },
          { keyword: `${business} près de ${location}`, volume: 420, difficulty: 28, localIntent: 90 },
          { keyword: `meilleur ${business} ${location}`, volume: 320, difficulty: 45, localIntent: 85 },
          { keyword: `${business} ${location} avis`, volume: 280, difficulty: 30, localIntent: 80 },
          { keyword: `horaires ${business} ${location}`, volume: 180, difficulty: 25, localIntent: 95 }
        ],
        competitors: [
          { name: "Aqua Store Marseille", distance: "0.5km", rating: 4.3, reviews: 127 },
          { name: "Poissons Tropicaux 13", distance: "1.2km", rating: 4.1, reviews: 89 },
          { name: "Aquarium Paradise", distance: "2.1km", rating: 4.5, reviews: 203 }
        ],
        opportunities: [
          { type: "Google My Business", status: "Optimisé", score: 85 },
          { type: "Avis clients", status: "À améliorer", score: 65 },
          { type: "Photos de qualité", status: "Manquant", score: 40 },
          { type: "Horaires d'ouverture", status: "Optimisé", score: 95 }
        ]
      };

      setLocalData(mockData);
      setIsAnalyzing(false);
      toast.success("Analyse SEO local terminée !");
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          Analyseur SEO Local
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Type d'entreprise (ex: aquariophilie)"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
          />
          <Input
            placeholder="Localisation (ex: Marseille)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        <Button onClick={analyzeLocalSeo} disabled={isAnalyzing} className="w-full">
          {isAnalyzing ? 'Analyse en cours...' : 'Analyser le SEO Local'}
        </Button>

        {localData && (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Mots-clés locaux recommandés</h3>
              <div className="space-y-2">
                {localData.localKeywords.map((kw: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">{kw.keyword}</span>
                    <div className="flex gap-2">
                      <Badge>Vol: {kw.volume}</Badge>
                      <Badge variant="outline">Diff: {kw.difficulty}</Badge>
                      <Badge className="bg-green-100 text-green-800">
                        Local: {kw.localIntent}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Concurrents locaux</h3>
              <div className="space-y-2">
                {localData.competitors.map((comp: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{comp.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">{comp.distance}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{comp.rating}</span>
                        <span className="text-sm text-gray-500">({comp.reviews})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Opportunités d'optimisation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {localData.opportunities.map((opp: any, index: number) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{opp.type}</span>
                      <Badge className={
                        opp.score >= 80 ? 'bg-green-100 text-green-800' :
                        opp.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {opp.score}%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{opp.status}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocalSeoAnalyzer;
