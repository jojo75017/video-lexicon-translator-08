import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, HelpCircle, Trophy, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizProps {
  moduleId: number;
  moduleTitle: string;
  onComplete: (moduleId: number, score: number) => void;
  onClose: () => void;
}

const quizQuestions: Record<number, Question[]> = {
  1: [
    {
      id: 1,
      question: "Quelle est la première étape pour configurer le générateur d'ebook ?",
      options: ["Créer un chapitre", "Configurer l'API OpenAI", "Choisir un template", "Exporter en PDF"],
      correctAnswer: 1,
      explanation: "La configuration de l'API OpenAI est essentielle pour permettre la génération de contenu par l'IA."
    },
    {
      id: 2,
      question: "Combien d'idées d'ebooks pré-générées sont disponibles ?",
      options: ["25+", "50+", "100+", "10+"],
      correctAnswer: 1,
      explanation: "Le générateur propose plus de 50 idées d'ebooks réparties dans différentes catégories."
    },
    {
      id: 3,
      question: "Quelles catégories d'idées sont disponibles ?",
      options: ["Uniquement Business", "Business et Fiction", "Business, Santé, Technologie, Finance", "Uniquement Fiction"],
      correctAnswer: 2,
      explanation: "Les idées sont diversifiées : Business, Santé, Technologie, Finance et bien d'autres."
    }
  ],
  2: [
    {
      id: 1,
      question: "Comment réorganiser les chapitres dans le planificateur ?",
      options: ["Par menu contextuel", "Par Drag & Drop", "Par raccourci clavier", "Impossible de réorganiser"],
      correctAnswer: 1,
      explanation: "Le Drag & Drop permet de réorganiser facilement les chapitres par glisser-déposer."
    },
    {
      id: 2,
      question: "Peut-on diviser un chapitre en plusieurs parties ?",
      options: ["Non, impossible", "Oui, via le menu avancé", "Uniquement les sous-chapitres", "Seulement en mode expert"],
      correctAnswer: 1,
      explanation: "La gestion avancée permet de diviser, fusionner et dupliquer les chapitres."
    },
    {
      id: 3,
      question: "Qu'inclut la génération automatique de structure ?",
      options: ["Seulement les titres", "Titres et descriptions", "Préface, chapitres, conclusion", "Uniquement la conclusion"],
      correctAnswer: 2,
      explanation: "La structure générée inclut la préface, les chapitres avec sous-chapitres et la conclusion."
    }
  ],
  3: [
    {
      id: 1,
      question: "Quels types de templates sont disponibles ?",
      options: ["Uniquement Business", "Business, Fiction, Mémoires, Guides", "Seulement Fiction", "Aucun template"],
      correctAnswer: 1,
      explanation: "La galerie propose des templates pour Business, Fiction, Mémoires et Guides."
    },
    {
      id: 2,
      question: "Peut-on sauvegarder des templates personnalisés ?",
      options: ["Non", "Oui", "Seulement en version premium", "Uniquement les admins"],
      correctAnswer: 1,
      explanation: "Vous pouvez personnaliser et sauvegarder vos propres templates pour une utilisation future."
    }
  ],
  4: [
    {
      id: 1,
      question: "Qu'est-ce que l'optimisation SEO automatique fait ?",
      options: ["Améliore le référencement du contenu", "Change les couleurs", "Ajoute des images", "Traduit le texte"],
      correctAnswer: 0,
      explanation: "L'optimisation SEO améliore automatiquement le contenu pour un meilleur référencement."
    },
    {
      id: 2,
      question: "Quel outil permet de transcrire la voix en texte ?",
      options: ["Le correcteur", "Le dictaphone IA", "L'exportateur", "Le compteur de mots"],
      correctAnswer: 1,
      explanation: "Le dictaphone IA avec transcription permet de dicter votre contenu vocalement."
    }
  ],
  5: [
    {
      id: 1,
      question: "Quelle fonctionnalité permet de créer des couvertures ?",
      options: ["L'éditeur d'images", "Le générateur de couverture IA", "Photoshop intégré", "Aucune disponible"],
      correctAnswer: 1,
      explanation: "Le générateur de couverture IA crée automatiquement des couvertures professionnelles."
    },
    {
      id: 2,
      question: "Les couvertures peuvent-elles être exportées en haute résolution ?",
      options: ["Non, basse résolution uniquement", "Oui, haute résolution disponible", "Seulement en PDF", "Uniquement en JPEG"],
      correctAnswer: 1,
      explanation: "L'export haute résolution est disponible pour des couvertures professionnelles."
    }
  ],
  6: [
    {
      id: 1,
      question: "Quels styles d'images IA sont disponibles ?",
      options: ["Réaliste uniquement", "Réaliste, artistique, cartoon", "Cartoon seulement", "Aucun style"],
      correctAnswer: 1,
      explanation: "Plusieurs styles sont disponibles : réaliste, artistique et cartoon."
    },
    {
      id: 2,
      question: "Les images sont-elles optimisées pour différents formats ?",
      options: ["Non", "Oui, JPEG, PNG, WebP", "Seulement JPEG", "Format unique"],
      correctAnswer: 1,
      explanation: "L'optimisation automatique supporte JPEG, PNG et WebP."
    }
  ],
  7: [
    {
      id: 1,
      question: "Qu'est-ce que KDP ?",
      options: ["Kindle Direct Publishing", "Kindle Document Parser", "Kindle Design Pro", "Kindle Digital Platform"],
      correctAnswer: 0,
      explanation: "KDP signifie Kindle Direct Publishing, la plateforme d'Amazon pour publier des ebooks."
    },
    {
      id: 2,
      question: "L'analyse concurrentielle permet de...",
      options: ["Copier les concurrents", "Identifier les niches rentables", "Voler du contenu", "Rien d'utile"],
      correctAnswer: 1,
      explanation: "L'analyse concurrentielle aide à identifier les niches rentables et les stratégies gagnantes."
    }
  ],
  8: [
    {
      id: 1,
      question: "Quels réseaux sociaux sont supportés pour le marketing ?",
      options: ["Facebook uniquement", "Facebook, Twitter, Instagram, LinkedIn", "LinkedIn seulement", "Aucun réseau"],
      correctAnswer: 1,
      explanation: "Le module marketing supporte Facebook, Twitter/X, Instagram et LinkedIn."
    },
    {
      id: 2,
      question: "Les campagnes email sont-elles automatisées ?",
      options: ["Non, tout est manuel", "Oui, avec séquences de lancement", "Partiellement", "Seulement les templates"],
      correctAnswer: 1,
      explanation: "Les campagnes email sont automatisées avec des séquences de lancement et de suivi."
    }
  ],
  9: [
    {
      id: 1,
      question: "Le calculateur de ROI sert à...",
      options: ["Calculer le nombre de pages", "Estimer le retour sur investissement optimal", "Compter les mots", "Choisir les couleurs"],
      correctAnswer: 1,
      explanation: "Le calculateur de ROI aide à estimer le retour sur investissement pour optimiser les prix."
    },
    {
      id: 2,
      question: "Les bundles peuvent être créés ?",
      options: ["Non, vente unitaire seulement", "Oui, stratégies de bundle disponibles", "Seulement manuellement", "Uniquement sur Amazon"],
      correctAnswer: 1,
      explanation: "Les stratégies de bundle permettent de vendre plusieurs ebooks ensemble."
    }
  ],
  10: [
    {
      id: 1,
      question: "Combien de formats d'export sont disponibles ?",
      options: ["2 formats", "4 formats", "6+ formats", "1 format"],
      correctAnswer: 2,
      explanation: "6+ formats : PDF, EPUB, MOBI, DOCX, HTML, InDesign (IDML)."
    },
    {
      id: 2,
      question: "La table des matières est-elle interactive ?",
      options: ["Non", "Oui, pour certains formats", "Seulement en PDF", "Jamais"],
      correctAnswer: 1,
      explanation: "La table des matières interactive est générée automatiquement pour les formats compatibles."
    }
  ],
  11: [
    {
      id: 1,
      question: "Quelle technologie est utilisée pour le livre audio ?",
      options: ["Google TTS", "ElevenLabs", "Amazon Polly", "Microsoft Azure"],
      correctAnswer: 1,
      explanation: "ElevenLabs est utilisé pour la conversion texte vers audio avec des voix naturelles."
    },
    {
      id: 2,
      question: "La génération en masse est-elle possible ?",
      options: ["Non, un ebook à la fois", "Oui, avec workflows automatisés", "Seulement manuellement", "Uniquement en premium"],
      correctAnswer: 1,
      explanation: "Les workflows automatisés permettent la génération en masse et la planification de contenu."
    }
  ]
};

const FormationQuiz: React.FC<QuizProps> = ({ moduleId, moduleTitle, onComplete, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const questions = quizQuestions[moduleId] || [];
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (questions.length === 0) {
    return (
      <Card className="border-primary/20">
        <CardContent className="py-8 text-center">
          <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Aucun quiz disponible pour ce module.</p>
          <Button onClick={onClose} className="mt-4">Fermer</Button>
        </CardContent>
      </Card>
    );
  }

  const handleAnswer = (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    if (answerIndex === question.correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#A855F7']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#A855F7']
      });
    }, 250);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      const finalScore = Math.round((correctAnswers / questions.length) * 100);
      setIsComplete(true);
      
      // Déclencher les confettis pour un score parfait (100%)
      if (finalScore === 100) {
        triggerConfetti();
        toast.success('🎊 Score parfait ! Vous êtes un expert !', {
          duration: 5000
        });
      }
      
      onComplete(moduleId, finalScore);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCorrectAnswers(0);
    setIsComplete(false);
  };

  if (isComplete) {
    const score = Math.round((correctAnswers / questions.length) * 100);
    const isPassed = score >= 70;
    const isPerfect = score === 100;

    return (
      <Card className="border-primary/20 overflow-hidden">
        <CardHeader className={`${isPerfect ? 'bg-gradient-to-r from-yellow-500/30 via-amber-500/20 to-orange-500/30' : isPassed ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' : 'bg-gradient-to-r from-orange-500/20 to-red-500/20'}`}>
          <CardTitle className="flex items-center gap-2">
            {isPerfect ? (
              <>
                <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
                <span className="bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
                  Score Parfait !
                </span>
              </>
            ) : isPassed ? (
              <Trophy className="h-6 w-6 text-yellow-500" />
            ) : (
              <RotateCcw className="h-6 w-6 text-orange-500" />
            )}
            {!isPerfect && 'Résultats du Quiz'}
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <div className={`text-7xl font-bold mb-4 ${isPerfect ? 'bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 bg-clip-text text-transparent' : isPassed ? 'text-green-500' : 'text-orange-500'}`}>
              {score}%
            </div>
          </motion.div>
          
          <p className="text-lg mb-2">
            {correctAnswers} / {questions.length} réponses correctes
          </p>
          
          <p className={`text-lg mb-6 ${isPerfect ? 'text-yellow-600 font-semibold' : isPassed ? 'text-green-600' : 'text-orange-600'}`}>
            {isPerfect ? '🏆✨ Incroyable ! Vous êtes un véritable expert ! ✨🏆' : isPassed ? '🎉 Félicitations ! Module validé !' : '💪 Continuez à réviser pour améliorer votre score !'}
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={handleRestart} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Recommencer
            </Button>
            <Button onClick={onClose} className="gap-2">
              Fermer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline">Module {moduleId}</Badge>
          <span className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} / {questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2 mb-2" />
        <CardTitle className="text-lg">{moduleTitle}</CardTitle>
      </CardHeader>
      
      <CardContent className="py-6">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-lg font-medium mb-6">{question.question}</p>
          
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isCorrect = index === question.correctAnswer;
              const isSelected = selectedAnswer === index;
              
              let buttonStyle = "border-2 text-left justify-start h-auto py-3 px-4";
              if (isAnswered) {
                if (isCorrect) {
                  buttonStyle += " border-green-500 bg-green-500/10 text-green-700";
                } else if (isSelected && !isCorrect) {
                  buttonStyle += " border-red-500 bg-red-500/10 text-red-700";
                } else {
                  buttonStyle += " border-muted opacity-50";
                }
              } else {
                buttonStyle += isSelected 
                  ? " border-primary bg-primary/10" 
                  : " border-muted hover:border-primary/50";
              }
              
              return (
                <Button
                  key={index}
                  variant="outline"
                  className={buttonStyle}
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswered}
                >
                  <span className="flex items-center gap-3 w-full">
                    <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </span>
                </Button>
              );
            })}
          </div>
          
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-6 p-4 rounded-lg ${
                  selectedAnswer === question.correctAnswer 
                    ? 'bg-green-500/10 border border-green-500/20' 
                    : 'bg-orange-500/10 border border-orange-500/20'
                }`}
              >
                <p className="text-sm font-medium mb-1">
                  {selectedAnswer === question.correctAnswer ? '✅ Correct !' : '❌ Incorrect'}
                </p>
                <p className="text-sm text-muted-foreground">{question.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button variant="ghost" onClick={onClose}>
            Quitter
          </Button>
          {isAnswered && (
            <Button onClick={handleNext} className="gap-2">
              {currentQuestion < questions.length - 1 ? (
                <>
                  Suivant
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  Voir les résultats
                  <Trophy className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FormationQuiz;
