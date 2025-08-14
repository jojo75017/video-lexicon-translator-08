import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, MessageCircle, Target, Copy, ExternalLink, Download, History, Lightbulb, Zap, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { generateQuoraContent } from '@/utils/seo/quoraGenerator';

interface QuoraQuestion {
  question: string;
  views: number;
  answers: number;
  category: string;
  url: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
}

interface QuoraContent {
  title: string;
  question: string;
  answer: string;
  topics?: string[];
}

const QuoraPage: React.FC = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [questions, setQuestions] = useState<QuoraQuestion[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<QuoraContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  
  // Paramètres avancés
  const [minWordCount, setMinWordCount] = useState(200);
  const [responseStyle, setResponseStyle] = useState<'professional' | 'conversational' | 'expert' | 'storytelling'>('professional');
  const [includeTopics, setIncludeTopics] = useState(true);
  const [history, setHistory] = useState<QuoraContent[]>([]);

  const findQuestions = () => {
    if (!keyword.trim()) {
      toast.error('Veuillez entrer un mot-clé');
      return;
    }

    setIsLoading(true);

    // Simulation de recherche de questions Quora enrichie
    setTimeout(() => {
      const difficulties: ('Facile' | 'Moyen' | 'Difficile')[] = ['Facile', 'Moyen', 'Difficile'];
      const categories = ['Éducation', 'Débutant', 'Outils', 'Conseils', 'Prix', 'Stratégie', 'Tendances', 'Comparaison'];
      
      const questionTemplates = [
        `Quelle est la meilleure façon d'apprendre le ${keyword} ?`,
        `Comment débuter en ${keyword} en 2024 ?`,
        `Quels sont les meilleurs outils pour ${keyword} ?`,
        `${keyword} : erreurs courantes à éviter ?`,
        `Combien coûte un service de ${keyword} professionnel ?`,
        `${keyword} vs alternatives : que choisir ?`,
        `Quelles sont les tendances ${keyword} pour 2024 ?`,
        `Formation ${keyword} : en ligne ou présentiel ?`,
        `${keyword} pour débutants : par où commencer ?`,
        `Comment mesurer le ROI de ${keyword} ?`,
        `${keyword} gratuit vs payant : différences ?`,
        `Certification ${keyword} : laquelle choisir ?`
      ];

      const mockQuestions: QuoraQuestion[] = questionTemplates.slice(0, 8).map((question, index) => ({
        question,
        views: Math.floor(Math.random() * 20000) + 5000,
        answers: Math.floor(Math.random() * 50) + 5,
        category: categories[index % categories.length],
        url: `https://fr.quora.com/question-${keyword}-${index + 1}`,
        difficulty: difficulties[Math.floor(Math.random() * difficulties.length)]
      }));

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

    setIsGeneratingAnswer(true);

    // Utilisation du générateur de contenu Quora
    setTimeout(() => {
      try {
        console.log('Génération du contenu Quora avec:', { keyword, minWordCount, responseStyle });
        const content = generateQuoraContent(
          keyword,
          minWordCount,
          includeTopics ? undefined : [],
          responseStyle
        );
        
        console.log('Contenu généré:', content);
        setGeneratedContent(content);
        setActiveTab('answer');
        toast.success('Contenu Quora généré avec succès !');
      } catch (error) {
        toast.error('Erreur lors de la génération du contenu');
        console.error('Erreur génération Quora:', error);
      } finally {
        setIsGeneratingAnswer(false);
      }
    }, 2000);
  };

  const saveToHistory = () => {
    if (generatedContent) {
      setHistory(prev => [generatedContent, ...prev.slice(0, 9)]); // Garder les 10 derniers
      toast.success('Contenu sauvegardé dans l\'historique');
    }
  };

  const loadFromHistory = (content: QuoraContent) => {
    setGeneratedContent(content);
    setActiveTab('answer');
    toast.success('Contenu chargé depuis l\'historique');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié dans le presse-papier !`);
  };

  const exportContent = () => {
    if (!generatedContent) return;
    
    const exportData = {
      ...generatedContent,
      keyword,
      settings: {
        minWordCount,
        responseStyle,
        includeTopics
      },
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quora-content-${keyword}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Contenu exporté avec succès !');
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Éducation': 'bg-blue-100 text-blue-800',
      'Débutant': 'bg-green-100 text-green-800',
      'Outils': 'bg-purple-100 text-purple-800',
      'Conseils': 'bg-yellow-100 text-yellow-800',
      'Prix': 'bg-orange-100 text-orange-800',
      'Stratégie': 'bg-red-100 text-red-800',
      'Tendances': 'bg-pink-100 text-pink-800',
      'Comparaison': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      'Facile': 'bg-green-100 text-green-800',
      'Moyen': 'bg-yellow-100 text-yellow-800',
      'Difficile': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              🗣️ Générateur Quora Pro
            </h1>
          </div>
          
          <div className="flex gap-2">
            {generatedContent && (
              <>
                <Button variant="outline" onClick={saveToHistory} className="gap-2">
                  <History className="h-4 w-4" />
                  Sauvegarder
                </Button>
                <Button variant="outline" onClick={exportContent} className="gap-2">
                  <Download className="h-4 w-4" />
                  Exporter
                </Button>
              </>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="search">🔍 Recherche</TabsTrigger>
            <TabsTrigger value="answer">✍️ Réponse</TabsTrigger>
            <TabsTrigger value="settings">⚙️ Paramètres</TabsTrigger>
            <TabsTrigger value="history">📚 Historique</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
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
                      <div className="max-h-96 overflow-y-auto space-y-2">
                        {questions.map((q, index) => (
                          <div 
                            key={index} 
                            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                              selectedQuestion === q.question ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                            }`}
                            onClick={() => setSelectedQuestion(q.question)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <span className="text-sm font-medium pr-2">{q.question}</span>
                              <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                              <span>{q.views.toLocaleString()} vues</span>
                              <span>•</span>
                              <span>{q.answers} réponses</span>
                              <Badge variant="outline" className={`text-xs ${getCategoryColor(q.category)}`}>
                                {q.category}
                              </Badge>
                              <Badge variant="outline" className={`text-xs ${getDifficultyColor(q.difficulty)}`}>
                                {q.difficulty}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Générateur de Contenu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedQuestion ? (
                    <>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Question sélectionnée</label>
                        <div className="p-3 bg-primary/5 rounded border text-sm">
                          {selectedQuestion}
                        </div>
                      </div>

                      <Button 
                        onClick={generateAnswer} 
                        disabled={isGeneratingAnswer}
                        className="w-full gap-2"
                      >
                        {isGeneratingAnswer ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                            Génération...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4" />
                            Générer le contenu complet
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Sélectionnez une question à gauche pour générer un contenu optimisé</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="answer" className="space-y-6">
            {generatedContent ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {/* Titre */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        📝 Titre de la réponse
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(generatedContent.title, 'Titre')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={generatedContent.title}
                        onChange={(e) => setGeneratedContent({...generatedContent, title: e.target.value})}
                        rows={2}
                        className="font-medium"
                      />
                    </CardContent>
                  </Card>

                  {/* Question reformulée */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        ❓ Question reformulée
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(generatedContent.question, 'Question')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={generatedContent.question}
                        onChange={(e) => setGeneratedContent({...generatedContent, question: e.target.value})}
                        rows={3}
                      />
                    </CardContent>
                  </Card>

                  {/* Topics */}
                  {generatedContent.topics && (
                    <Card>
                      <CardHeader>
                        <CardTitle>🏷️ Topics suggérés</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {generatedContent.topics.map((topic, index) => (
                            <Badge key={index} variant="secondary">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Réponse complète */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        📖 Réponse complète
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(generatedContent.answer, 'Réponse')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={generatedContent.answer}
                        onChange={(e) => setGeneratedContent({...generatedContent, answer: e.target.value})}
                        rows={20}
                        className="text-sm"
                      />
                      <div className="mt-2 text-xs text-muted-foreground">
                        Mots: {generatedContent.answer.split(' ').length} | 
                        Caractères: {generatedContent.answer.length}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-16">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Aucun contenu généré</h3>
                <p>Générez d'abord du contenu depuis l'onglet Recherche</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Paramètres de génération
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Nombre de mots minimum</label>
                    <Input
                      type="number"
                      value={minWordCount}
                      onChange={(e) => setMinWordCount(Number(e.target.value))}
                      min={100}
                      max={1000}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum recommandé: 200 mots
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Style de réponse</label>
                    <Select value={responseStyle} onValueChange={(value: any) => setResponseStyle(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professionnel</SelectItem>
                        <SelectItem value="conversational">Conversationnel</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                        <SelectItem value="storytelling">Narratif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeTopics"
                    checked={includeTopics}
                    onChange={(e) => setIncludeTopics(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="includeTopics" className="text-sm font-medium">
                    Inclure des topics suggérés
                  </label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Historique des contenus ({history.length}/10)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {history.length > 0 ? (
                  <div className="space-y-4">
                    {history.map((content, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => loadFromHistory(content)}
                      >
                        <h4 className="font-medium mb-2 line-clamp-2">{content.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                          {content.question}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          {content.answer.split(' ').length} mots
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Aucun contenu dans l'historique</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QuoraPage;