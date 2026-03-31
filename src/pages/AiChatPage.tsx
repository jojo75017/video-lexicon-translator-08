import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Send, Sparkles, Loader2, BookOpen, TrendingUp,
  MessageSquare, Settings, Key, User, Bot
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { callGemini } from '@/services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AiChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Bonjour ! Je suis votre assistant IA pour trouver des idées d'ebook à succès. Posez-moi des questions sur les tendances du marché, les niches rentables, ou demandez-moi de rechercher les meilleures idées d'ebook inspirées du top Amazon. Comment puis-je vous aider aujourd'hui ?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [tempApiKey, setTempApiKey] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load API key from localStorage
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const saveApiKey = () => {
    if (!tempApiKey.trim()) {
      toast.error('Veuillez entrer une clé API');
      return;
    }
    
    if (!tempApiKey.startsWith('AIza')) {
      toast.error('La clé API Gemini doit commencer par "AIza"');
      return;
    }

    localStorage.setItem('openai_api_key', tempApiKey);
    setApiKey(tempApiKey);
    setShowSettings(false);
    toast.success('Clé API Gemini enregistrée avec succès');
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    if (!apiKey) {
      toast.error('Veuillez configurer votre clé API Gemini dans les paramètres');
      setShowSettings(true);
      return;
    }

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = messages.map(m => `${m.role === 'user' ? 'Utilisateur' : 'Assistant'}: ${m.content}`).join('\n\n');
      
      const response = await callGemini(apiKey,
        `Historique de la conversation:\n${chatHistory}\n\nUtilisateur: ${input}`,
        {
          systemPrompt: `Tu es un expert en marketing d'ebook et en analyse des tendances Amazon. 
Tu aides les auteurs à trouver des idées d'ebook à succès. 
Tu peux analyser les tendances du marché, suggérer des niches rentables, 
et recommander des sujets basés sur le top 50 Amazon et autres classements.
Réponds toujours en français de manière concise et actionnable.
Donne des conseils pratiques et des exemples concrets.`,
          maxTokens: 1000,
          temperature: 0.7,
        }
      );

      const assistantMessage: Message = {
        role: 'assistant',
        content: response
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error calling Gemini:', error);
      toast.error(error.message || 'Erreur lors de la génération de la réponse');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    "Quelles sont les tendances d'ebook les plus rentables en ce moment ?",
    "Suggère-moi 5 idées d'ebook inspirées du top Amazon",
    "Quelle niche d'ebook est la moins saturée ?",
    "Comment créer un ebook à succès sur le développement personnel ?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-background to-cream/50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={() => navigate('/ebook-ideas')}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux idées
            </Button>
            
            <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              {apiKey ? 'Clé configurée' : 'Configurer'}
            </Button>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="h-10 w-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-playfair font-bold text-foreground">
                Parlez avec l'IA
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez les meilleures idées d'ebook avec l'aide de l'IA. 
              Recherchez dans le top Amazon et obtenez des conseils personnalisés.
            </p>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <Card className="mb-6 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Configuration de votre clé API OpenAI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Clé API OpenAI (commençant par sk-)
                </label>
                <Input
                  type="password"
                  placeholder="sk-..."
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  className="mb-2"
                />
                <p className="text-xs text-muted-foreground">
                  Votre clé est stockée localement et n'est jamais partagée. 
                  <a 
                    href="https://platform.openai.com/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline ml-1"
                  >
                    Obtenez votre clé ici
                  </a>
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={saveApiKey} className="gap-2">
                  <Key className="h-4 w-4" />
                  Enregistrer la clé
                </Button>
                <Button onClick={() => setShowSettings(false)} variant="outline">
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chat Container */}
        <Card className="shadow-xl">
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-[500px] overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-gradient-primary text-white'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-coral-pink to-royal-purple flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="bg-muted p-4 rounded-2xl">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length === 1 && (
              <div className="px-6 pb-4">
                <p className="text-sm font-medium mb-3 text-muted-foreground">
                  Suggestions :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {quickPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start text-left h-auto py-3 px-4 text-sm"
                      onClick={() => setInput(prompt)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="line-clamp-2">{prompt}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    apiKey 
                      ? "Posez votre question sur les idées d'ebook..." 
                      : "Configurez d'abord votre clé API..."
                  }
                  className="min-h-[60px] resize-none"
                  disabled={!apiKey || isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || !apiKey || isLoading}
                  size="lg"
                  className="gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="text-center p-6">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Tendances Amazon</h3>
            <p className="text-sm text-muted-foreground">
              Découvrez ce qui cartonne dans le top 50 Amazon
            </p>
          </Card>
          
          <Card className="text-center p-6">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Niches Rentables</h3>
            <p className="text-sm text-muted-foreground">
              Identifiez les marchés à fort potentiel
            </p>
          </Card>
          
          <Card className="text-center p-6">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Conseils IA</h3>
            <p className="text-sm text-muted-foreground">
              Obtenez des recommandations personnalisées
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AiChatPage;
