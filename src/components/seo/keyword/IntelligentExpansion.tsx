
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, TrendingUp, Users } from "lucide-react";
import { toast } from "sonner";
import { KeywordSuggestion } from "@/types/seo/Keyword";

interface IntelligentExpansionProps {
  keyword: string;
  onKeywordsGenerated: (keywords: KeywordSuggestion[]) => void;
}

const IntelligentExpansion: React.FC<IntelligentExpansionProps> = ({ 
  keyword, 
  onKeywordsGenerated 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [expansionType, setExpansionType] = useState<'semantic' | 'intent' | 'competitor'>('semantic');
  const [expandedKeywords, setExpandedKeywords] = useState<KeywordSuggestion[]>([]);

  const generateExpansions = async () => {
    if (!keyword.trim()) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }

    setIsGenerating(true);
    
    // Simulation d'expansion intelligente basée sur le type
    setTimeout(() => {
      let expansions: KeywordSuggestion[] = [];
      
      switch (expansionType) {
        case 'semantic':
          expansions = [
            {
              keyword: `${keyword} définition`,
              volume: Math.floor(Math.random() * 2000) + 500,
              difficulty: Math.floor(Math.random() * 40) + 20,
              cpc: parseFloat((Math.random() * 1.5 + 0.3).toFixed(2)),
              competition: parseFloat((Math.random() * 0.6).toFixed(2)),
              intent: 'informational',
              type: 'semantic',
              relevance: 95
            },
            {
              keyword: `comprendre ${keyword}`,
              volume: Math.floor(Math.random() * 1500) + 300,
              difficulty: Math.floor(Math.random() * 35) + 15,
              cpc: parseFloat((Math.random() * 1.2 + 0.2).toFixed(2)),
              competition: parseFloat((Math.random() * 0.5).toFixed(2)),
              intent: 'informational',
              type: 'semantic',
              relevance: 90
            },
            {
              keyword: `${keyword} avantages`,
              volume: Math.floor(Math.random() * 1800) + 400,
              difficulty: Math.floor(Math.random() * 45) + 25,
              cpc: parseFloat((Math.random() * 2 + 0.5).toFixed(2)),
              competition: parseFloat((Math.random() * 0.7).toFixed(2)),
              intent: 'commercial',
              type: 'semantic',
              relevance: 85
            }
          ];
          break;
          
        case 'intent':
          expansions = [
            {
              keyword: `acheter ${keyword}`,
              volume: Math.floor(Math.random() * 2500) + 800,
              difficulty: Math.floor(Math.random() * 60) + 40,
              cpc: parseFloat((Math.random() * 3 + 1).toFixed(2)),
              competition: parseFloat((Math.random() * 0.8).toFixed(2)),
              intent: 'transactional',
              type: 'intent-based',
              relevance: 95
            },
            {
              keyword: `prix ${keyword}`,
              volume: Math.floor(Math.random() * 2000) + 600,
              difficulty: Math.floor(Math.random() * 55) + 35,
              cpc: parseFloat((Math.random() * 2.5 + 0.8).toFixed(2)),
              competition: parseFloat((Math.random() * 0.75).toFixed(2)),
              intent: 'commercial',
              type: 'intent-based',
              relevance: 90
            },
            {
              keyword: `comment choisir ${keyword}`,
              volume: Math.floor(Math.random() * 1200) + 200,
              difficulty: Math.floor(Math.random() * 30) + 10,
              cpc: parseFloat((Math.random() * 1 + 0.3).toFixed(2)),
              competition: parseFloat((Math.random() * 0.4).toFixed(2)),
              intent: 'informational',
              type: 'intent-based',
              relevance: 88
            }
          ];
          break;
          
        case 'competitor':
          expansions = [
            {
              keyword: `alternative à ${keyword}`,
              volume: Math.floor(Math.random() * 1500) + 300,
              difficulty: Math.floor(Math.random() * 50) + 30,
              cpc: parseFloat((Math.random() * 2 + 0.6).toFixed(2)),
              competition: parseFloat((Math.random() * 0.7).toFixed(2)),
              intent: 'commercial',
              type: 'competitor',
              relevance: 85
            },
            {
              keyword: `${keyword} vs concurrents`,
              volume: Math.floor(Math.random() * 1000) + 150,
              difficulty: Math.floor(Math.random() * 45) + 25,
              cpc: parseFloat((Math.random() * 1.8 + 0.4).toFixed(2)),
              competition: parseFloat((Math.random() * 0.6).toFixed(2)),
              intent: 'commercial',
              type: 'competitor',
              relevance: 80
            }
          ];
          break;
      }
      
      setExpandedKeywords(expansions);
      onKeywordsGenerated(expansions);
      setIsGenerating(false);
      toast.success(`${expansions.length} mots-clés intelligents générés`);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-500" />
          Expansion intelligente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 mb-4">
          {[
            { key: 'semantic', label: 'Sémantique', icon: <Target className="h-4 w-4" /> },
            { key: 'intent', label: 'Intention', icon: <TrendingUp className="h-4 w-4" /> },
            { key: 'competitor', label: 'Concurrentiel', icon: <Users className="h-4 w-4" /> }
          ].map((type) => (
            <Button
              key={type.key}
              variant={expansionType === type.key ? "default" : "outline"}
              size="sm"
              onClick={() => setExpansionType(type.key as any)}
              className="gap-1"
            >
              {type.icon}
              {type.label}
            </Button>
          ))}
        </div>

        <Button 
          onClick={generateExpansions}
          disabled={isGenerating}
          className="w-full gap-2"
        >
          {isGenerating ? (
            <>Génération intelligente...</>
          ) : (
            <>
              <Brain className="h-4 w-4" />
              Générer ({expansionType})
            </>
          )}
        </Button>

        {expandedKeywords.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Mots-clés générés :</h4>
            <div className="space-y-2">
              {expandedKeywords.map((kw, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{kw.keyword}</span>
                    <Badge variant="secondary">
                      {kw.relevance}% pertinent
                    </Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-xs text-gray-600">
                    <span>Vol: {kw.volume?.toLocaleString()}</span>
                    <span>Diff: {kw.difficulty}</span>
                    <span>CPC: {kw.cpc}€</span>
                    <span>Intent: {kw.intent}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IntelligentExpansion;
