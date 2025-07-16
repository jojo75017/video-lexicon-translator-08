
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sparkles, TrendingUp, HelpCircle, Target } from "lucide-react";
import { KeywordSuggestion } from "@/types/seo/KeywordSuggestion";

const AdvancedKeywordGenerator: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [longTailKeywords, setLongTailKeywords] = useState<KeywordSuggestion[]>([]);
  const [questionKeywords, setQuestionKeywords] = useState<KeywordSuggestion[]>([]);
  const [commercialKeywords, setCommercialKeywords] = useState<KeywordSuggestion[]>([]);
  const [localKeywords, setLocalKeywords] = useState<KeywordSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAdvancedKeywords = () => {
    if (!keyword) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      // Generate long-tail keywords
      const longTail: KeywordSuggestion[] = [
        { 
          keyword: `comment ${keyword} efficacement`, 
          volume: 320, 
          difficulty: 25, 
          cpc: 0.85, 
          type: 'longtail',
          intent: 'informational',
          opportunity: 75
        },
        { 
          keyword: `guide complet ${keyword} débutant`, 
          volume: 280, 
          difficulty: 30, 
          cpc: 1.20, 
          type: 'longtail',
          intent: 'informational',
          opportunity: 68
        }
      ];

      // Generate question-based keywords
      const questions: KeywordSuggestion[] = [
        { 
          keyword: `qu'est-ce que ${keyword}`, 
          volume: 450, 
          difficulty: 20, 
          cpc: 0.60, 
          type: 'semantic',
          intent: 'informational',
          opportunity: 82
        },
        { 
          keyword: `pourquoi ${keyword} important`, 
          volume: 380, 
          difficulty: 35, 
          cpc: 0.90, 
          type: 'semantic',
          intent: 'informational',
          opportunity: 70
        }
      ];

      // Generate commercial keywords
      const commercial: KeywordSuggestion[] = [
        { 
          keyword: `meilleur ${keyword} 2024`, 
          volume: 850, 
          difficulty: 65, 
          cpc: 2.50, 
          type: 'primary',
          intent: 'commercial',
          opportunity: 55
        },
        { 
          keyword: `${keyword} prix comparaison`, 
          volume: 420, 
          difficulty: 45, 
          cpc: 1.80, 
          type: 'primary',
          intent: 'commercial',
          opportunity: 62
        }
      ];

      // Generate local keywords
      const local: KeywordSuggestion[] = [
        { 
          keyword: `${keyword} Paris`, 
          volume: 650, 
          difficulty: 40, 
          cpc: 1.40, 
          type: 'primary',
          intent: 'transactional',
          opportunity: 68
        },
        { 
          keyword: `${keyword} près de moi`, 
          volume: 520, 
          difficulty: 35, 
          cpc: 1.60, 
          type: 'primary',
          intent: 'transactional',
          opportunity: 72
        }
      ];

      setLongTailKeywords(longTail);
      setQuestionKeywords(questions);
      setCommercialKeywords(commercial);
      setLocalKeywords(local);
      setIsGenerating(false);
    }, 2000);
  };

  const KeywordSection = ({ 
    title, 
    icon: Icon, 
    keywords, 
    color 
  }: { 
    title: string; 
    icon: any; 
    keywords: KeywordSuggestion[]; 
    color: string;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 text-${color}-600`}>
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {keywords.map((kw, index) => (
            <div key={index} className="border rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">{kw.keyword}</span>
                <Badge variant="outline" className="ml-2">
                  {kw.opportunity}% opportunité
                </Badge>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Volume: {kw.volume?.toLocaleString()}</span>
                <span>Difficulté: {kw.difficulty}/100</span>
                <span>CPC: {kw.cpc?.toFixed(2)}€</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Générateur Avancé de Mots-clés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Mot-clé principal..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={generateAdvancedKeywords}
              disabled={isGenerating || !keyword}
            >
              {isGenerating ? 'Génération...' : 'Générer'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {longTailKeywords.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <KeywordSection
            title="Mots-clés Longue Traîne"
            icon={TrendingUp}
            keywords={longTailKeywords}
            color="blue"
          />
          
          <KeywordSection
            title="Questions Fréquentes"
            icon={HelpCircle}
            keywords={questionKeywords}
            color="green"
          />
          
          <KeywordSection
            title="Intention Commerciale"
            icon={Target}
            keywords={commercialKeywords}
            color="orange"
          />
          
          <KeywordSection
            title="Recherche Locale"
            icon={Sparkles}
            keywords={localKeywords}
            color="purple"
          />
        </div>
      )}
    </div>
  );
};

export default AdvancedKeywordGenerator;
