import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Wand2, Copy, CheckCircle, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';
import { OpenAIConfigPanel } from '@/components/shared/OpenAIConfigPanel';

const PromptsGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [customTopic, setCustomTopic] = useState('');
  
  const { apiKey, model, hasValidApiKey, getConfig } = useOpenAIConfig();

  const generateCustomPrompts = async () => {
    if (!hasValidApiKey() || !customTopic.trim()) {
      toast.error("Veuillez configurer votre clé API OpenAI et saisir un sujet");
      return;
    }

    setIsGenerating(true);
    
    try {
      const config = getConfig();
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            {
              role: 'system',
              content: `Tu es un expert en création de prompts professionnels. Tu dois créer 10 prompts détaillés et professionnels sur le sujet demandé. Chaque prompt doit suivre cette structure exacte :

🎯 Prompt [numéro] : [Titre accrocheur]
Demande : [Description claire de ce qui est demandé]
Rôle : [Tu es un expert en...]
Mission : [Objectif précis à accomplir]
Structure attendue :
• Point 1
• Point 2
• Point 3
• Point 4
• Point 5
• Point 6
Style : [Ton et approche à adopter]

Les prompts doivent être variés, couvrir différents aspects du sujet, et être immédiatement utilisables.`
            },
            {
              role: 'user',
              content: `Crée 10 prompts professionnels détaillés sur le sujet : "${customTopic}"`
            }
          ],
          temperature: 0.8,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      const generatedContent = data.choices[0].message.content;
      
      // Séparer les prompts générés
      const generatedPrompts = generatedContent.split(/🎯 Prompt \d+/).filter(p => p.trim()).map((prompt, index) => `🎯 Prompt ${index + 1}${prompt.trim()}`);
      
      setPrompts(generatedPrompts);
      toast.success(`${generatedPrompts.length} prompts personnalisés générés !`);
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast.error("Erreur lors de la génération des prompts");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyPrompt = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast.success('Prompt copié !');
    } catch (err) {
      toast.error('Erreur lors de la copie');
    }
  };

  const exportPrompts = () => {
    if (prompts.length === 0) {
      toast.error('Aucun prompt à exporter');
      return;
    }
    
    const content = prompts.join('\n\n' + '='.repeat(50) + '\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompts-${customTopic.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Prompts exportés avec succès !');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Générateur de Prompts IA</h1>
          <p className="text-muted-foreground">Créez des prompts professionnels personnalisés</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <OpenAIConfigPanel />
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wand2 className="w-5 h-5 mr-2" />
                Génération Personnalisée
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Sujet des prompts
                </label>
                <Input
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Ex: Marketing digital, Développement personnel..."
                  className="w-full"
                />
              </div>
              
              <Button
                onClick={generateCustomPrompts}
                disabled={isGenerating || !hasValidApiKey() || !customTopic.trim()}
                className="w-full"
              >
                {isGenerating ? 'Génération...' : 'Générer 10 Prompts'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Prompts Générés</CardTitle>
                {prompts.length > 0 && (
                  <Button onClick={exportPrompts} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {prompts.length === 0 ? (
                <div className="text-center py-12">
                  <Wand2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Saisissez un sujet et cliquez sur "Générer" pour créer vos prompts personnalisés
                  </p>
                </div>
              ) : (
                <div className="space-y-6 max-h-[600px] overflow-y-auto">
                  {prompts.map((prompt, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-card">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-sm text-primary">
                          {prompt.split('\n')[0]}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyPrompt(prompt, index)}
                          className="h-8 w-8 p-0"
                        >
                          {copiedIndex === index ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <pre className="whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                        {prompt.split('\n').slice(1).join('\n')}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PromptsGeneratorPage;