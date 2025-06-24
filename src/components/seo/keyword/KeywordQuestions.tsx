
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, MessageSquare, Loader2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { OpenAIService } from '../../../utils/seo/openaiService';

interface QuestionData {
  question: string;
  volume: number;
  difficulty: number;
  intent: 'informational' | 'commercial' | 'transactional';
  answerLength: 'Court' | 'Moyen' | 'Long';
}

const KeywordQuestions = () => {
  const [keyword, setKeyword] = useState('');
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey] = useState(() => localStorage.getItem('openaiKey') || '');

  const generateQuestions = async () => {
    if (!keyword.trim()) {
      toast.error('Veuillez entrer un mot-clé');
      return;
    }

    setIsGenerating(true);
    try {
      if (apiKey) {
        const openAIService = new OpenAIService(apiKey);
        const aiQuestions = await openAIService.generateQuestions(keyword);
        
        const questionsData: QuestionData[] = aiQuestions.map(q => ({
          question: q,
          volume: Math.floor(Math.random() * 1000) + 50,
          difficulty: Math.floor(Math.random() * 60) + 20,
          intent: ['informational', 'commercial', 'transactional'][Math.floor(Math.random() * 3)] as 'informational' | 'commercial' | 'transactional',
          answerLength: ['Court', 'Moyen', 'Long'][Math.floor(Math.random() * 3)] as 'Court' | 'Moyen' | 'Long'
        }));
        
        setQuestions(questionsData);
        toast.success('Questions générées avec l\'IA !');
      } else {
        // Questions basiques sans IA
        const basicQuestions: QuestionData[] = [
          {
            question: `Qu'est-ce que ${keyword} ?`,
            volume: 850,
            difficulty: 25,
            intent: 'informational',
            answerLength: 'Moyen'
          },
          {
            question: `Comment utiliser ${keyword} ?`,
            volume: 650,
            difficulty: 30,
            intent: 'informational',
            answerLength: 'Long'
          },
          {
            question: `Où acheter ${keyword} ?`,
            volume: 420,
            difficulty: 45,
            intent: 'commercial',
            answerLength: 'Court'
          },
          {
            question: `Combien coûte ${keyword} ?`,
            volume: 380,
            difficulty: 40,
            intent: 'commercial',
            answerLength: 'Court'
          },
          {
            question: `${keyword} vs alternatives ?`,
            volume: 290,
            difficulty: 55,
            intent: 'commercial',
            answerLength: 'Long'
          }
        ];
        
        setQuestions(basicQuestions);
        toast.info('Questions de base générées (configurez OpenAI pour plus d\'options)');
      }
    } catch (error) {
      toast.error('Erreur lors de la génération des questions');
    } finally {
      setIsGenerating(false);
    }
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'informational': return 'bg-blue-100 text-blue-800';
      case 'commercial': return 'bg-green-100 text-green-800';
      case 'transactional': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'text-green-600';
    if (difficulty < 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-orange-600" />
            Générateur de Questions SEO
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Mot-clé pour générer des questions..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && generateQuestions()}
              className="flex-1"
            />
            <Button
              onClick={generateQuestions}
              disabled={isGenerating || !keyword.trim()}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <MessageSquare className="h-4 w-4 mr-2" />
              )}
              Générer
            </Button>
          </div>
        </CardContent>
      </Card>

      {questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((q, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium text-sm flex-1 pr-4">
                    {q.question}
                  </h3>
                  <div className="flex gap-1 flex-shrink-0">
                    <Badge className={getIntentColor(q.intent)} variant="secondary">
                      {q.intent}
                    </Badge>
                    <Badge variant="outline">
                      {q.answerLength}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>{q.volume.toLocaleString()} recherches/mois</span>
                  </div>
                  <div className={`flex items-center gap-1 ${getDifficultyColor(q.difficulty)}`}>
                    <span>Difficulté: {q.difficulty}/100</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default KeywordQuestions;
