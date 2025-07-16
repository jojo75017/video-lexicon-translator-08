import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageCircle, Target, Copy, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const QuoraPage: React.FC = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string>('');
  const [generatedAnswer, setGeneratedAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const findQuestions = () => {
    if (!keyword.trim()) {
      toast.error('Veuillez entrer un mot-clé');
      return;
    }

    setIsLoading(true);

    // Simulation de recherche de questions Quora
    setTimeout(() => {
      const mockQuestions = [
        {
          question: `Quelle est la meilleure façon d'apprendre le ${keyword} ?`,
          views: 12500,
          answers: 23,
          category: 'Éducation',
          url: `https://fr.quora.com/question-${keyword}-1`
        },
        {
          question: `Comment débuter en ${keyword} en 2024 ?`,
          views: 8900,
          answers: 15,
          category: 'Débutant',
          url: `https://fr.quora.com/question-${keyword}-2`
        },
        {
          question: `Quels sont les meilleurs outils pour ${keyword} ?`,
          views: 15600,
          answers: 31,
          category: 'Outils',
          url: `https://fr.quora.com/question-${keyword}-3`
        },
        {
          question: `${keyword} : erreurs courantes à éviter ?`,
          views: 6700,
          answers: 18,
          category: 'Conseils',
          url: `https://fr.quora.com/question-${keyword}-4`
        },
        {
          question: `Combien coûte un service de ${keyword} professionnel ?`,
          views: 9200,
          answers: 12,
          category: 'Prix',
          url: `https://fr.quora.com/question-${keyword}-5`
        }
      ];

      setQuestions(mockQuestions);
      setIsLoading(false);
      toast.success(`${mockQuestions.length} questions trouvées !`);
    }, 1500);
  };

  const generateAnswer = () => {
    if (!selectedQuestion) {
      toast.error('Veuillez sélectionner une question');
      return;
    }

    // Simulation de génération de réponse
    const answer = `Excellente question ! Voici mon point de vue sur ${keyword} :

**Points clés à retenir :**

1. **Commencez par les bases** - Il est essentiel de bien comprendre les fondamentaux avant de se lancer dans des aspects plus avancés.

2. **Choisissez les bons outils** - Investir dans des outils de qualité peut faire une énorme différence dans vos résultats.

3. **Pratiquez régulièrement** - La constance est la clé du succès dans ${keyword}.

4. **Restez informé** - Le domaine évolue rapidement, il est important de suivre les dernières tendances.

**Mon conseil personnel :**
Après plusieurs années d'expérience, je recommande de commencer petit et de progresser étape par étape. N'hésitez pas à poser des questions à la communauté !

J'espère que cela vous aide. N'hésitez pas si vous avez d'autres questions ! 😊`;

    setGeneratedAnswer(answer);
    toast.success('Réponse générée !');
  };

  const copyAnswer = () => {
    navigator.clipboard.writeText(generatedAnswer);
    toast.success('Réponse copiée !');
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Éducation': 'bg-blue-100 text-blue-800',
      'Débutant': 'bg-green-100 text-green-800',
      'Outils': 'bg-purple-100 text-purple-800',
      'Conseils': 'bg-yellow-100 text-yellow-800',
      'Prix': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-pink-50/30 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            🗣️ Générateur Quora
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Recherche de Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Sujet / Mot-clé</label>
                <Input
                  placeholder="marketing digital, cuisine, voyage..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && findQuestions()}
                />
              </div>

              <Button onClick={findQuestions} disabled={isLoading} className="w-full">
                {isLoading ? 'Recherche...' : 'Trouver des questions'}
              </Button>

              {questions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Questions trouvées ({questions.length})</h4>
                  {questions.map((q, index) => (
                    <div 
                      key={index} 
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedQuestion === q.question ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedQuestion(q.question)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-medium">{q.question}</span>
                        <ExternalLink className="h-3 w-3 text-gray-400" />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span>{q.views.toLocaleString()} vues</span>
                        <span>•</span>
                        <span>{q.answers} réponses</span>
                        <Badge variant="outline" className={getCategoryColor(q.category)}>
                          {q.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Générateur de Réponse
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedQuestion ? (
                <>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Question sélectionnée</label>
                    <div className="p-3 bg-blue-50 rounded border text-sm">
                      {selectedQuestion}
                    </div>
                  </div>

                  <Button onClick={generateAnswer} className="w-full">
                    Générer une réponse optimisée
                  </Button>

                  {generatedAnswer && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Réponse générée</label>
                        <Button variant="outline" size="sm" onClick={copyAnswer}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copier
                        </Button>
                      </div>
                      <Textarea
                        value={generatedAnswer}
                        onChange={(e) => setGeneratedAnswer(e.target.value)}
                        rows={12}
                        className="text-sm"
                      />
                      <div className="mt-2 text-xs text-gray-500">
                        Mots: {generatedAnswer.split(' ').length} | Caractères: {generatedAnswer.length}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Sélectionnez une question à gauche pour générer une réponse optimisée
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuoraPage;