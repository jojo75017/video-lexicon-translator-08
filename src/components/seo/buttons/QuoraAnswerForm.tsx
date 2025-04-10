
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Search, Send, Sparkles, ThumbsUp, Eye, TrendingUp, BarChart2 } from 'lucide-react';
import { getResponseForQuestion } from './QuoraConstants';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface QuoraAnswerFormProps {
  onSubmit: (data: any) => void;
  loading: boolean;
}

interface QuestionAnalysis {
  engagement: number;
  potential: number;
  difficulty: number;
  competition: number;
}

const QuoraAnswerForm: React.FC<QuoraAnswerFormProps> = ({ onSubmit, loading }) => {
  const [questionToAnswer, setQuestionToAnswer] = useState('');
  const [generatedAnswer, setGeneratedAnswer] = useState('');
  const [questionAnalysis, setQuestionAnalysis] = useState<QuestionAnalysis | null>(null);
  const [currentTab, setCurrentTab] = useState('editor');
  const [trendingQuestions, setTrendingQuestions] = useState<string[]>([]);

  useEffect(() => {
    // Simuler le chargement de questions tendances
    const trending = [
      "Comment améliorer le référencement de mon site e-commerce?",
      "Quelles sont les meilleures stratégies de marketing digital en 2024?",
      "Comment créer un contenu qui engage vraiment mon audience?",
      "Quels sont les outils SEO indispensables pour une petite entreprise?",
      "Comment optimiser ma présence sur les réseaux sociaux?",
      "Quels sont les impacts de l'IA sur le marketing digital?",
      "Comment se démarquer sur un marché saturé?",
      "Quelles sont les tendances UX/UI à suivre en 2024?",
      "Comment mesurer efficacement le ROI de mes campagnes marketing?",
      "Quelles compétences développer pour réussir dans le digital aujourd'hui?"
    ];
    
    // Simuler un délai de chargement réaliste
    setTimeout(() => {
      setTrendingQuestions(trending);
    }, 800);
  }, []);

  const handleGenerateAnswer = () => {
    if (!questionToAnswer.trim()) {
      toast.error("Veuillez saisir la question à laquelle vous souhaitez répondre");
      return;
    }

    // Analyser la question
    analyzeQuestion(questionToAnswer);

    onSubmit({
      question: questionToAnswer,
      type: 'answer'
    });

    // Générer une réponse en utilisant notre fonction
    setTimeout(() => {
      const answer = getResponseForQuestion(questionToAnswer);
      setGeneratedAnswer(answer);
    }, 1500);
  };

  const analyzeQuestion = (question: string) => {
    // Simulation d'une analyse de question basée sur certains mots-clés
    const lowerQuestion = question.toLowerCase();
    
    // Facteurs d'analyse
    let engagement = 65; // Base score
    let potential = 70;
    let difficulty = 50;
    let competition = 60;
    
    // Mots-clés à forte valeur
    const highValueKeywords = ['comment', 'pourquoi', 'meilleur', 'guide', 'tutoriel', 'astuces', 'conseils'];
    highValueKeywords.forEach(keyword => {
      if (lowerQuestion.includes(keyword)) {
        engagement += 5;
        potential += 3;
      }
    });
    
    // Sujets populaires
    const popularTopics = ['intelligence artificielle', 'ia', 'seo', 'marketing', 'crypto', 'blockchain', 'tech', 'développement'];
    popularTopics.forEach(topic => {
      if (lowerQuestion.includes(topic)) {
        engagement += 8;
        potential += 7;
        competition += 10;
        difficulty += 5;
      }
    });
    
    // Longueur de la question (les questions plus longues sont souvent plus spécifiques)
    const wordCount = question.split(' ').length;
    if (wordCount > 10) {
      difficulty += 3;
      competition -= 5;
      potential += 5;
    }
    
    // Contraindre les valeurs entre 0 et 100
    const clamp = (value: number) => Math.min(100, Math.max(0, value));
    
    setQuestionAnalysis({
      engagement: clamp(engagement),
      potential: clamp(potential),
      difficulty: clamp(difficulty),
      competition: clamp(competition)
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getEngagementBadge = (score: number) => {
    if (score >= 80) return { label: "Élevé", color: "bg-green-100 text-green-800 border-green-200" };
    if (score >= 60) return { label: "Moyen", color: "bg-amber-100 text-amber-800 border-amber-200" };
    return { label: "Faible", color: "bg-red-100 text-red-800 border-red-200" };
  };

  return (
    <div className="space-y-6">
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="editor" className="flex items-center gap-1">
            <Send className="h-4 w-4" />
            Éditeur de réponse
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            Questions populaires
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question-to-answer" className="font-medium">Question à répondre *</Label>
              <div className="flex gap-2">
                <Input
                  id="question-to-answer"
                  value={questionToAnswer}
                  onChange={(e) => setQuestionToAnswer(e.target.value)}
                  placeholder="Copiez-collez une question Quora ici"
                  className="flex-1"
                />
                <Button 
                  variant="ghost"
                  onClick={() => {
                    if (trendingQuestions.length > 0) {
                      const random = Math.floor(Math.random() * trendingQuestions.length);
                      setQuestionToAnswer(trendingQuestions[random]);
                      analyzeQuestion(trendingQuestions[random]);
                    }
                  }}
                  className="whitespace-nowrap"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Exemple
                </Button>
              </div>
            </div>
            
            {questionAnalysis && (
              <Card className="p-4 bg-gray-50">
                <h3 className="font-medium mb-3 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
                  Analyse de la question
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 flex items-center">
                        <ThumbsUp className="h-3 w-3 mr-1" /> Potentiel d'engagement
                      </span>
                      <Badge className={getEngagementBadge(questionAnalysis.engagement).color}>
                        {getEngagementBadge(questionAnalysis.engagement).label}
                      </Badge>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${questionAnalysis.engagement}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 flex items-center">
                        <Eye className="h-3 w-3 mr-1" /> Potentiel de vues
                      </span>
                      <span className={`font-bold ${getScoreColor(questionAnalysis.potential)}`}>
                        {questionAnalysis.potential}/100
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${questionAnalysis.potential}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 flex items-center">
                        <BarChart2 className="h-3 w-3 mr-1" /> Niveau de difficulté
                      </span>
                      <span className={`font-bold ${getScoreColor(100 - questionAnalysis.difficulty)}`}>
                        {questionAnalysis.difficulty}/100
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full" 
                        style={{ width: `${questionAnalysis.difficulty}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" /> Niveau de compétition
                      </span>
                      <span className={`font-bold ${getScoreColor(100 - questionAnalysis.competition)}`}>
                        {questionAnalysis.competition}/100
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 rounded-full" 
                        style={{ width: `${questionAnalysis.competition}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {questionToAnswer && (
              <Button 
                onClick={handleGenerateAnswer}
                disabled={loading || !questionToAnswer.trim()} 
                className="w-full bg-[#b92b27] hover:bg-[#a62520]"
              >
                {loading ? (
                  <>Génération en cours...</>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Générer une réponse
                  </>
                )}
              </Button>
            )}

            {generatedAnswer && (
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium mb-2">Réponse générée</h3>
                  <div className="bg-white p-4 rounded border text-gray-700 whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                    {generatedAnswer}
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const modifiedAnswer = generatedAnswer.replace(/\*\*/g, '**'); // Assurez-vous que le format Markdown est correct
                        navigator.clipboard.writeText(modifiedAnswer);
                        toast.success("Réponse copiée dans le presse-papiers");
                      }}
                    >
                      Copier (Markdown)
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // Convertir le markdown en texte simple pour copier/coller dans Quora
                        const plainText = generatedAnswer.replace(/\*\*/g, '');
                        navigator.clipboard.writeText(plainText);
                        toast.success("Texte brut copié dans le presse-papiers");
                      }}
                    >
                      Copier (Texte brut)
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-medium mb-2 text-blue-700">Conseils pour une réponse efficace</h3>
                  <ul className="list-disc pl-5 space-y-1 text-blue-700">
                    <li>Personnalisez cette réponse avec vos propres expériences</li>
                    <li>Ajoutez des exemples concrets pour illustrer vos points</li>
                    <li>Incluez des données ou statistiques si pertinent</li>
                    <li>Formatez votre réponse pour faciliter la lecture</li>
                    <li>Ajoutez un call-to-action subtil à la fin si approprié</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="questions">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Questions tendances sur Quora</h3>
            
            {trendingQuestions.length > 0 ? (
              <div className="space-y-3">
                {trendingQuestions.map((question, index) => (
                  <Card 
                    key={index} 
                    className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setQuestionToAnswer(question);
                      analyzeQuestion(question);
                      setCurrentTab('editor');
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-gray-800">{question}</p>
                      <Button size="sm" variant="ghost">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" /> 
                        {Math.floor(Math.random() * 900) + 100} vues
                      </span>
                      <span className="flex items-center">
                        <ThumbsUp className="h-3 w-3 mr-1" /> 
                        {Math.floor(Math.random() * 20) + 1} réponses
                      </span>
                      <Badge 
                        variant="outline" 
                        className={Math.random() > 0.5 ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}
                      >
                        {Math.random() > 0.5 ? "Forte demande" : "Moyen"}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <TrendingUp className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">Chargement des questions tendances...</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuoraAnswerForm;
