import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Send, Sparkles, Loader2, User, Bot, Settings, Key, X
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const EbookAiChat: React.FC = () => {
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
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('user_openai_key');
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

  const saveApiKey = async () => {
    if (!tempApiKey.trim()) {
      toast.error('Veuillez entrer une clé API');
      return;
    }
    
    if (!tempApiKey.startsWith('sk-')) {
      toast.error('La clé API doit commencer par "sk-"');
      return;
    }

    // Test de la clé API avec un appel simple
    toast.loading('Validation de la clé API en cours...', { id: 'api-test' });
    
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tempApiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Clé API invalide');
      }

      localStorage.setItem('user_openai_key', tempApiKey);
      setApiKey(tempApiKey);
      setShowSettings(false);
      toast.dismiss('api-test'); // Suppression du toast loading au lieu d'afficher un succès
    } catch (error) {
      toast.error('❌ Clé API invalide. Vérifiez votre clé et réessayez.', { id: 'api-test' });
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    if (!apiKey) {
      toast.error('Veuillez configurer votre clé API OpenAI');
      setShowSettings(true);
      return;
    }

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: `Tu es un expert en marketing d'ebook et en analyse des tendances Amazon. 
              Tu aides les auteurs à trouver des idées d'ebook à succès. 
              Tu peux analyser les tendances du marché, suggérer des niches rentables, 
              et recommander des sujets basés sur le top 50 Amazon et autres classements.
              Réponds toujours en français de manière concise et actionnable.
              Donne des conseils pratiques et des exemples concrets.`
            },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: input }
          ],
          max_completion_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Erreur lors de la communication avec OpenAI');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0].message.content
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la génération de la réponse');
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
  ];

  return (
    <>
      <Card className="mb-8 shadow-2xl border-2 border-primary/20 overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-primary text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="h-8 w-8" />
                <div>
                  <h2 className="text-2xl font-playfair font-bold">Parlez avec l'IA</h2>
                  <p className="text-white/90 text-sm">
                    Découvrez les meilleures idées d'ebook du top Amazon
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowSettings(true)}
                  variant="outline"
                  size="sm"
                  className={`${
                    apiKey 
                      ? 'bg-green-500/20 border-green-500/50 text-green-700 hover:bg-green-500/30' 
                      : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
                  }`}
                >
                  {apiKey ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                      Clé configurée ✓
                    </>
                  ) : (
                    <>
                      <Settings className="h-4 w-4 mr-1" />
                      Configurer
                    </>
                  )}
                </Button>
                {isExpanded && (
                  <Button
                    onClick={() => setIsExpanded(false)}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className={`overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-background to-cream/30 ${isExpanded ? 'h-[600px]' : 'h-[400px]'}`}>
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
                      : 'bg-white shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
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
                <div className="bg-white shadow-md p-4 rounded-2xl">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length === 1 && (
            <div className="px-6 pb-4 bg-gradient-to-b from-cream/30 to-background">
              <p className="text-sm font-medium mb-3 text-muted-foreground">
                Suggestions rapides :
              </p>
              <div className="grid grid-cols-1 gap-2">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left h-auto py-3 px-4 text-sm hover:bg-primary/10 hover:border-primary"
                    onClick={() => setInput(prompt)}
                  >
                    <Sparkles className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
                    <span className="line-clamp-1">{prompt}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t p-4 bg-white">
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
              <div className="flex flex-col gap-2">
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
          </div>
        </CardContent>
      </Card>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Configuration de votre clé API OpenAI
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {apiKey && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="font-medium">✓ Clé API actuellement configurée et validée</span>
                </div>
                <p className="text-xs text-green-600 mt-2">
                  Vous pouvez la remplacer en entrant une nouvelle clé ci-dessous.
                </p>
              </div>
            )}
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
                Valider et enregistrer
              </Button>
              <Button onClick={() => setShowSettings(false)} variant="outline">
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
