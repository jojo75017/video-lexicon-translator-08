
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Network, Users2, Target, Zap } from "lucide-react";
import { KeywordSuggestion } from "@/types/seo/Keyword";

interface KeywordGroupingProps {
  keywords: KeywordSuggestion[];
}

interface KeywordGroup {
  name: string;
  keywords: KeywordSuggestion[];
  theme: string;
  difficulty: 'easy' | 'medium' | 'hard';
  opportunity: number;
}

const KeywordGrouping: React.FC<KeywordGroupingProps> = ({ keywords }) => {
  const [groups, setGroups] = useState<KeywordGroup[]>([]);
  const [groupingMethod, setGroupingMethod] = useState<'semantic' | 'intent' | 'difficulty'>('semantic');

  const generateGroups = () => {
    if (keywords.length === 0) return;

    let newGroups: KeywordGroup[] = [];

    switch (groupingMethod) {
      case 'semantic':
        newGroups = [
          {
            name: "Mots-clés informationnels",
            keywords: keywords.filter(k => k.intent === 'informational'),
            theme: "Contenu éducatif",
            difficulty: 'easy',
            opportunity: 85
          },
          {
            name: "Mots-clés commerciaux",
            keywords: keywords.filter(k => k.intent === 'commercial'),
            theme: "Considération d'achat",
            difficulty: 'medium',
            opportunity: 75
          },
          {
            name: "Mots-clés transactionnels",
            keywords: keywords.filter(k => k.intent === 'transactional'),
            theme: "Intention d'achat",
            difficulty: 'hard',
            opportunity: 95
          }
        ];
        break;
      case 'intent':
        newGroups = [
          {
            name: "Recherche locale",
            keywords: keywords.slice(0, Math.ceil(keywords.length / 3)),
            theme: "Géolocalisation",
            difficulty: 'medium',
            opportunity: 80
          },
          {
            name: "Comparaisons",
            keywords: keywords.slice(Math.ceil(keywords.length / 3), Math.ceil(keywords.length * 2 / 3)),
            theme: "Analyse comparative",
            difficulty: 'medium',
            opportunity: 70
          },
          {
            name: "Questions fréquentes",
            keywords: keywords.slice(Math.ceil(keywords.length * 2 / 3)),
            theme: "FAQ et support",
            difficulty: 'easy',
            opportunity: 60
          }
        ];
        break;
      case 'difficulty':
        newGroups = [
          {
            name: "Opportunités faciles",
            keywords: keywords.filter(k => (k.difficulty || 0) < 30),
            theme: "Quick wins",
            difficulty: 'easy',
            opportunity: 90
          },
          {
            name: "Opportunités moyennes",
            keywords: keywords.filter(k => (k.difficulty || 0) >= 30 && (k.difficulty || 0) < 60),
            theme: "Investissement modéré",
            difficulty: 'medium',
            opportunity: 70
          },
          {
            name: "Opportunités difficiles",
            keywords: keywords.filter(k => (k.difficulty || 0) >= 60),
            theme: "Long terme",
            difficulty: 'hard',
            opportunity: 50
          }
        ];
        break;
    }

    setGroups(newGroups.filter(g => g.keywords.length > 0));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5 text-purple-500" />
          Groupement sémantique
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={groupingMethod} onValueChange={(value) => setGroupingMethod(value as any)}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="semantic" className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              Sémantique
            </TabsTrigger>
            <TabsTrigger value="intent" className="flex items-center gap-1">
              <Users2 className="h-4 w-4" />
              Intention
            </TabsTrigger>
            <TabsTrigger value="difficulty" className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              Difficulté
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button 
          onClick={generateGroups}
          disabled={keywords.length === 0}
          className="w-full gap-2"
        >
          <Network className="h-4 w-4" />
          Grouper les mots-clés
        </Button>

        {groups.length > 0 && (
          <div className="space-y-4">
            {groups.map((group, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{group.name}</h4>
                  <div className="flex gap-2">
                    <Badge className={getDifficultyColor(group.difficulty)}>
                      {group.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      {group.opportunity}% opportunité
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600">{group.theme}</p>
                
                <div className="text-sm">
                  <span className="font-medium">{group.keywords.length} mots-clés:</span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {group.keywords.slice(0, 5).map((keyword, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {keyword.keyword}
                      </Badge>
                    ))}
                    {group.keywords.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{group.keywords.length - 5} autres
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KeywordGrouping;
