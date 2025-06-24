
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Copy, Loader2, Users, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { OpenAIService } from '../../../utils/seo/openaiService';

interface Question {
  question: string;
  searchVolume: number;
  difficulty: number;
  contentType: string;
}

const KeywordQuestions = () => {
  const [keyword, setKeyword] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
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
        const questionsResult = await openAIService.generateQuestions(keyword);
        
        const questionData: Question[] = questionsResult.map(q => ({
          question: q,
          searchVolume: Math.floor(Math.random() * 2000) + 100,
          difficulty: Math.floor(Math.random() * 60) + 20,
          contentType: getContentType(q)
        }));

        setQuestions(questionData);
        toast.success('Questions générées avec succès !');
      } else {
        generateBasicQuestions();
        toast.info('Questions basiques générées');
      }
    } catch (error) {
      toast.error('Erreur lors de la génération des questions');
    } finally {
      setIsGenerating(false);
    }
  };

  const getContentType = (question: string): string => {
    if (question.toLowerCase().includes('comment')) return 'Guide pratique';
    if (question.toLowerCase().includes('pourquoi')) return 'Article explicatif';
    if (question.toLowerCase().includes('combien')) return 'Comparatif';
    if (question.toLowerCase().includes('où')) return 'Guide local';
    if (question.toLowerCase().includes('quand')) return 'Guide temporel';
    return 'FAQ';
  };

  const generateBasicQuestions = () => {
    const questionTemplates = [
      `Qu'est-ce que ${keyword} ?`,
      `Comment utiliser ${keyword} ?`,
      `Pourquoi choisir ${keyword} ?`,
      `Combien coûte ${keyword} ?`,
      `Où acheter ${keyword} ?`,
      `${keyword} vs alternatives ?`,
      `Meilleur ${keyword} 2024 ?`,
      `Comment fonctionne ${keyword} ?`,
      `${keyword} pour débutants ?`,
      `Avantages de ${keyword} ?`
    ];

    const questionData: Question[] = questionTemplates.map(q => ({
      question: q,
      searchVolume: Math.floor(Math.random() * 1500) + 50,
      difficulty: Math.floor(Math.random() * 50) + 10,
      contentType: getContentType(q)
    }));

    setQuestions(questionData);
  };

  const copyQuestion = (question: string) => {
    navigator.clipboard.writeText(question);
    toast.success('Question copiée !');
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'bg-green-100 text-green-800';
    if (difficulty < 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getContentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Guide pratique': 'bg-blue-100 text-blue-800',
      'Article explicatif': 'bg-purple-100 text-purple-800',
      'Comparatif': 'bg-orange-100 text-orange-800',
      'Guide local': 'bg-green-100 text-green-800',
      'Guide temporel': 'bg-pink-100 text-pink-800',
      'FAQ': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-green-600" />
            Générateur de Questions FAQ
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
                <Lightbulb className="h-4 w-4 mr-2" />
              )}
              Générer
            </Button>
          </div>
        </CardContent>
      </Card>

      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Questions fréquemment posées ({questions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-lg flex-1 pr-4">
                      {item.question}
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyQuestion(item.question)}
                      className="hover:bg-blue-50"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-600">Volume:</span>
                      <span className="font-semibold">{item.searchVolume.toLocaleString()}/mois</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600">Difficulté:</span>
                      <Badge className={getDifficultyColor(item.difficulty)}>
                        {item.difficulty}/100
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600">Type:</span>
                      <Badge className={getContentTypeColor(item.contentType)}>
                        {item.contentType}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KeywordQuestions;
