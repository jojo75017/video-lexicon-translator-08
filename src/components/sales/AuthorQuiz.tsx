import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, ArrowRight, ArrowLeft, CheckCircle2, BookOpen, 
  Rocket, PenTool, Target, Trophy, Mail, Gift, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
    icon: React.ReactNode;
    points: { expert: number; creatif: number; entrepreneur: number; debutant: number };
  }[];
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "Quel est votre objectif principal avec l'écriture ?",
    options: [
      { id: 'a', text: "Générer des revenus passifs", icon: <Target className="w-5 h-5" />, points: { expert: 1, creatif: 0, entrepreneur: 3, debutant: 0 } },
      { id: 'b', text: "Partager ma passion/expertise", icon: <BookOpen className="w-5 h-5" />, points: { expert: 3, creatif: 1, entrepreneur: 0, debutant: 0 } },
      { id: 'c', text: "Exprimer ma créativité", icon: <PenTool className="w-5 h-5" />, points: { expert: 0, creatif: 3, entrepreneur: 0, debutant: 1 } },
      { id: 'd', text: "Découvrir l'auto-édition", icon: <Rocket className="w-5 h-5" />, points: { expert: 0, creatif: 0, entrepreneur: 1, debutant: 3 } },
    ]
  },
  {
    id: 2,
    question: "Combien de temps pouvez-vous consacrer à l'écriture par semaine ?",
    options: [
      { id: 'a', text: "Moins de 2 heures", icon: <span>⏰</span>, points: { expert: 0, creatif: 0, entrepreneur: 1, debutant: 3 } },
      { id: 'b', text: "2 à 5 heures", icon: <span>📅</span>, points: { expert: 1, creatif: 2, entrepreneur: 2, debutant: 1 } },
      { id: 'c', text: "5 à 10 heures", icon: <span>💪</span>, points: { expert: 2, creatif: 2, entrepreneur: 2, debutant: 0 } },
      { id: 'd', text: "Plus de 10 heures", icon: <span>🔥</span>, points: { expert: 3, creatif: 3, entrepreneur: 1, debutant: 0 } },
    ]
  },
  {
    id: 3,
    question: "Avez-vous déjà publié un livre ?",
    options: [
      { id: 'a', text: "Jamais", icon: <span>🌱</span>, points: { expert: 0, creatif: 1, entrepreneur: 0, debutant: 3 } },
      { id: 'b', text: "1-2 livres", icon: <span>📚</span>, points: { expert: 1, creatif: 2, entrepreneur: 2, debutant: 0 } },
      { id: 'c', text: "3-5 livres", icon: <span>📖</span>, points: { expert: 2, creatif: 2, entrepreneur: 3, debutant: 0 } },
      { id: 'd', text: "Plus de 5 livres", icon: <span>🏆</span>, points: { expert: 3, creatif: 1, entrepreneur: 3, debutant: 0 } },
    ]
  },
  {
    id: 4,
    question: "Quel genre de livre souhaitez-vous créer ?",
    options: [
      { id: 'a', text: "Guide pratique / How-to", icon: <span>📋</span>, points: { expert: 3, creatif: 0, entrepreneur: 2, debutant: 1 } },
      { id: 'b', text: "Roman / Fiction", icon: <span>✨</span>, points: { expert: 0, creatif: 3, entrepreneur: 0, debutant: 2 } },
      { id: 'c', text: "Développement personnel", icon: <span>🧠</span>, points: { expert: 2, creatif: 1, entrepreneur: 2, debutant: 1 } },
      { id: 'd', text: "Je ne sais pas encore", icon: <span>🤔</span>, points: { expert: 0, creatif: 1, entrepreneur: 0, debutant: 3 } },
    ]
  },
  {
    id: 5,
    question: "Qu'est-ce qui vous freine le plus aujourd'hui ?",
    options: [
      { id: 'a', text: "Le manque de temps", icon: <span>⏳</span>, points: { expert: 2, creatif: 1, entrepreneur: 3, debutant: 0 } },
      { id: 'b', text: "Le syndrome de la page blanche", icon: <span>📝</span>, points: { expert: 0, creatif: 2, entrepreneur: 0, debutant: 3 } },
      { id: 'c', text: "Les aspects techniques (formatage, KDP...)", icon: <span>⚙️</span>, points: { expert: 1, creatif: 3, entrepreneur: 1, debutant: 1 } },
      { id: 'd', text: "Trouver la bonne niche", icon: <span>🎯</span>, points: { expert: 2, creatif: 0, entrepreneur: 3, debutant: 1 } },
    ]
  }
];

interface AuthorProfile {
  type: 'expert' | 'creatif' | 'entrepreneur' | 'debutant';
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  recommendation: string;
  features: string[];
}

const profiles: Record<string, AuthorProfile> = {
  expert: {
    type: 'expert',
    title: "L'Expert Passionné",
    description: "Vous avez des connaissances précieuses à partager. Votre expertise mérite d'être transformée en guides pratiques qui aideront des milliers de lecteurs.",
    icon: <Trophy className="w-8 h-8" />,
    color: 'from-amber-500 to-orange-500',
    recommendation: "Commencez par un guide pratique sur votre domaine d'expertise",
    features: ['Générateur de structure', 'Templates guides pratiques', 'Optimisation KDP']
  },
  creatif: {
    type: 'creatif',
    title: "L'Âme Créative",
    description: "Votre imagination débordante est votre plus grand atout. L'IA peut vous aider à structurer vos idées tout en préservant votre voix unique.",
    icon: <PenTool className="w-8 h-8" />,
    color: 'from-pink-500 to-rose-500',
    recommendation: "Explorez la fiction avec notre assistant de création de personnages",
    features: ['Générateur de personnages', 'Assistant de style', 'Cohérence narrative IA']
  },
  entrepreneur: {
    type: 'entrepreneur',
    title: "L'Entrepreneur Ambitieux",
    description: "Vous voyez les ebooks comme une source de revenus passifs. Avec la bonne stratégie, vous pouvez créer une machine à cash automatisée.",
    icon: <Rocket className="w-8 h-8" />,
    color: 'from-emerald-500 to-teal-500',
    recommendation: "Utilisez notre analyse de marché KDP pour trouver les niches rentables",
    features: ['Analyse de marché KDP', 'Simulateur Amazon Ads', 'Plan de lancement 30 jours']
  },
  debutant: {
    type: 'debutant',
    title: "L'Auteur en Devenir",
    description: "Chaque expert a commencé quelque part ! Avec les bons outils et un accompagnement pas à pas, votre premier ebook est à portée de main.",
    icon: <Sparkles className="w-8 h-8" />,
    color: 'from-violet-500 to-purple-500',
    recommendation: "Notre workflow complet vous guide de A à Z pour votre premier livre",
    features: ['Tutoriel interactif', 'Workflow guidé P1-P14', 'Formation intégrée']
  }
};

interface AuthorQuizProps {
  onComplete?: (profile: AuthorProfile, email?: string) => void;
  showEmailCapture?: boolean;
}

const AuthorQuiz: React.FC<AuthorQuizProps> = ({ 
  onComplete,
  showEmailCapture = true 
}) => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [scores, setScores] = useState({ expert: 0, creatif: 0, entrepreneur: 0, debutant: 0 });
  const [showResult, setShowResult] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (optionId: string, points: typeof scores) => {
    setAnswers({ ...answers, [currentQuestion]: optionId });
    setScores({
      expert: scores.expert + points.expert,
      creatif: scores.creatif + points.creatif,
      entrepreneur: scores.entrepreneur + points.entrepreneur,
      debutant: scores.debutant + points.debutant
    });

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setTimeout(() => setShowResult(true), 300);
    }
  };

  const getResultProfile = (): AuthorProfile => {
    const maxScore = Math.max(scores.expert, scores.creatif, scores.entrepreneur, scores.debutant);
    if (scores.entrepreneur === maxScore) return profiles.entrepreneur;
    if (scores.expert === maxScore) return profiles.expert;
    if (scores.creatif === maxScore) return profiles.creatif;
    return profiles.debutant;
  };

  const handleSubmitEmail = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Veuillez entrer un email valide');
      return;
    }

    setIsSubmitting(true);
    try {
      const emailLower = email.trim().toLowerCase();
      
      // Sauvegarder l'email dans la séquence automatique
      await supabase.functions.invoke('add-to-email-sequence', {
        body: { email: emailLower }
      });

      // Sauvegarder localement
      localStorage.setItem('quiz_email', emailLower);
      localStorage.setItem('quiz_profile', getResultProfile().type);
      
      toast.success('🎁 Votre guide personnalisé arrive dans votre boîte mail !');
      
      if (onComplete) {
        onComplete(getResultProfile(), emailLower);
      }
      
      // Rediriger vers la démo ou les offres
      setTimeout(() => navigate('/demo'), 1500);
    } catch (error) {
      console.error('Quiz email error:', error);
      toast.error('Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQ = questions[currentQuestion];
  const profile = getResultProfile();

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-card via-card to-card/80">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-violet-500/10 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Quel type d'auteur êtes-vous ?
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {showResult ? 'Résultat' : `${currentQuestion + 1}/${questions.length}`}
          </Badge>
        </div>
        {!showResult && <Progress value={progress} className="h-2 mt-3" />}
      </CardHeader>

      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-foreground">
                {currentQ.question}
              </h3>

              <div className="grid gap-3">
                {currentQ.options.map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() => handleAnswer(option.id, option.points)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                      answers[currentQuestion] === option.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {option.icon}
                    </div>
                    <span className="font-medium">{option.text}</span>
                  </motion.button>
                ))}
              </div>

              {currentQuestion > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  className="mt-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Question précédente
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Résultat */}
              <div className={`p-6 rounded-2xl bg-gradient-to-br ${profile.color} text-foreground`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                    {profile.icon}
                  </div>
                  <div>
                    <div className="text-sm opacity-80">Vous êtes</div>
                    <h3 className="text-2xl font-bold">{profile.title}</h3>
                  </div>
                </div>
                <p className="text-foreground/90">{profile.description}</p>
              </div>

              {/* Recommandation */}
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                  <div>
                    <div className="font-semibold text-foreground">Notre recommandation</div>
                    <p className="text-sm text-muted-foreground">{profile.recommendation}</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Fonctionnalités idéales pour vous :</div>
                <div className="flex flex-wrap gap-2">
                  {profile.features.map((feature, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Email capture */}
              {showEmailCapture && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-violet-500/10 border border-primary/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Gift className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Recevez votre guide personnalisé gratuit</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="votre@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button 
                      onClick={handleSubmitEmail}
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-primary to-violet-600"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Recevoir'}
                    </Button>
                  </div>
                </div>
              )}

              {/* CTA */}
              <Button 
                onClick={() => navigate('/demo')}
                className="w-full bg-gradient-to-r from-primary to-violet-600 h-12 text-lg"
              >
                Essayer le générateur gratuitement
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default AuthorQuiz;
