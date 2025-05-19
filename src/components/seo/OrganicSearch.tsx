
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

interface OrganicSearchProps {
  domain?: string;
}

interface KeywordData {
  keyword: string;
  position: number;
  volume: number;
  difficulty: number;
  change: number;
}

const OrganicSearch: React.FC<OrganicSearchProps> = ({ domain }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  
  useEffect(() => {
    if (domain) {
      setIsLoading(true);
      // Simulation d'un appel API
      setTimeout(() => {
        const generatedKeywords: KeywordData[] = [];
        
        if (domain.includes('voyage') || domain.includes('travel')) {
          generatedKeywords.push(
            { keyword: 'voyage paris', position: Math.floor(Math.random() * 10) + 1, volume: 12500, difficulty: 65, change: 2 },
            { keyword: 'séjour all inclusive', position: Math.floor(Math.random() * 10) + 1, volume: 8700, difficulty: 72, change: -1 },
            { keyword: 'hotel pas cher', position: Math.floor(Math.random() * 10) + 1, volume: 15400, difficulty: 80, change: 3 },
            { keyword: 'billet avion promotion', position: Math.floor(Math.random() * 10) + 1, volume: 6200, difficulty: 70, change: 0 },
            { keyword: 'destinations vacances été', position: Math.floor(Math.random() * 10) + 1, volume: 5100, difficulty: 62, change: -2 }
          );
        } else if (domain.includes('tech') || domain.includes('digital')) {
          generatedKeywords.push(
            { keyword: 'smartphone comparatif', position: Math.floor(Math.random() * 10) + 1, volume: 9400, difficulty: 75, change: 1 },
            { keyword: 'meilleur ordinateur portable', position: Math.floor(Math.random() * 10) + 1, volume: 11200, difficulty: 82, change: -1 },
            { keyword: 'tablette pas cher', position: Math.floor(Math.random() * 10) + 1, volume: 7800, difficulty: 68, change: 3 },
            { keyword: 'casque audio bluetooth', position: Math.floor(Math.random() * 10) + 1, volume: 5600, difficulty: 63, change: 2 },
            { keyword: 'écouteurs sans fil', position: Math.floor(Math.random() * 10) + 1, volume: 8300, difficulty: 70, change: -2 }
          );
        } else {
          // Domaine générique
          generatedKeywords.push(
            { keyword: domain.split('.')[0] + ' avis', position: Math.floor(Math.random() * 10) + 1, volume: Math.floor(Math.random() * 10000) + 1000, difficulty: Math.floor(Math.random() * 20) + 60, change: Math.floor(Math.random() * 5) - 2 },
            { keyword: 'acheter ' + domain.split('.')[0], position: Math.floor(Math.random() * 10) + 1, volume: Math.floor(Math.random() * 10000) + 1000, difficulty: Math.floor(Math.random() * 20) + 60, change: Math.floor(Math.random() * 5) - 2 },
            { keyword: domain.split('.')[0] + ' comparatif', position: Math.floor(Math.random() * 10) + 1, volume: Math.floor(Math.random() * 10000) + 1000, difficulty: Math.floor(Math.random() * 20) + 60, change: Math.floor(Math.random() * 5) - 2 },
            { keyword: domain.split('.')[0] + ' prix', position: Math.floor(Math.random() * 10) + 1, volume: Math.floor(Math.random() * 10000) + 1000, difficulty: Math.floor(Math.random() * 20) + 60, change: Math.floor(Math.random() * 5) - 2 },
            { keyword: domain.split('.')[0] + ' meilleur', position: Math.floor(Math.random() * 10) + 1, volume: Math.floor(Math.random() * 10000) + 1000, difficulty: Math.floor(Math.random() * 20) + 60, change: Math.floor(Math.random() * 5) - 2 }
          );
        }
        
        setKeywords(generatedKeywords);
        setIsLoading(false);
      }, 1500);
    } else {
      setKeywords([]);
    }
  }, [domain]);
  
  if (!domain) {
    return (
      <div className="bg-green-50 p-6 rounded-lg text-center">
        <Search className="h-12 w-12 mx-auto text-green-600 mb-3" />
        <h3 className="text-lg font-medium text-green-800">Recherche organique</h3>
        <p className="text-green-700 mt-2">
          Entrez un nom de domaine ci-dessus pour analyser ses performances en recherche organique.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5 text-green-600" />
            Mots-clés organiques pour {domain}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex justify-between items-center border-b pb-3">
                  <Skeleton className="h-6 w-[200px]" />
                  <Skeleton className="h-6 w-[100px]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              <div className="grid grid-cols-12 gap-2 py-2 px-2 bg-gray-50 text-xs font-medium text-gray-500 rounded">
                <div className="col-span-5">Mot-clé</div>
                <div className="col-span-2 text-center">Position</div>
                <div className="col-span-2 text-center">Volume</div>
                <div className="col-span-2 text-center">Difficulté</div>
                <div className="col-span-1 text-right">Évolution</div>
              </div>
              
              {keywords.map((kw, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 py-3 px-2 border-b items-center hover:bg-gray-50">
                  <div className="col-span-5 font-medium">{kw.keyword}</div>
                  <div className="col-span-2 text-center">
                    <Badge variant={kw.position <= 3 ? "success" : kw.position <= 10 ? "default" : "secondary"} className={kw.position <= 3 ? "bg-green-100 text-green-800" : ""}>
                      {kw.position}
                    </Badge>
                  </div>
                  <div className="col-span-2 text-center">{kw.volume.toLocaleString()}</div>
                  <div className="col-span-2 text-center">
                    <Badge variant="outline" className={kw.difficulty >= 75 ? "text-red-700" : kw.difficulty >= 50 ? "text-amber-700" : "text-green-700"}>
                      {kw.difficulty}/100
                    </Badge>
                  </div>
                  <div className="col-span-1 text-right">
                    {kw.change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600 inline" />
                    ) : kw.change < 0 ? (
                      <TrendingDown className="h-4 w-4 text-red-600 inline" />
                    ) : (
                      <ArrowRight className="h-4 w-4 text-gray-600 inline" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganicSearch;
