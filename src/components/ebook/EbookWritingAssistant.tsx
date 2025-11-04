import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lightbulb, RefreshCw, Copy, Sparkles, FileText, Heading } from 'lucide-react';
import { toast } from 'sonner';

interface EbookWritingAssistantProps {
  ebookTitle: string;
}

const writingPrompts = [
  {
    category: '🎬 Débuts accrocheurs',
    prompts: [
      'Commencez par une question provocante qui remet en question les idées reçues de vos lecteurs',
      'Débutez avec une anecdote personnelle captivante qui illustre le problème principal',
      'Ouvrez avec une statistique choquante qui capte immédiatement l\'attention',
      'Commencez par décrire une scène vivante qui plonge le lecteur dans l\'action'
    ]
  },
  {
    category: '✍️ Développement',
    prompts: [
      'Utilisez la règle du 3 : listez trois raisons, trois exemples, trois solutions',
      'Intégrez des citations d\'experts pour renforcer votre crédibilité',
      'Ajoutez des exemples concrets et des cas pratiques pour illustrer vos points',
      'Créez des analogies simples pour expliquer des concepts complexes'
    ]
  },
  {
    category: '🎯 Conclusions',
    prompts: [
      'Résumez les points clés en 3 à 5 takeaways actionnables',
      'Terminez par un appel à l\'action clair et inspirant',
      'Posez une question de réflexion pour prolonger l\'engagement',
      'Partagez une vision optimiste de ce que le lecteur peut accomplir'
    ]
  }
];

export const EbookWritingAssistant: React.FC<EbookWritingAssistantProps> = ({
  ebookTitle
}) => {
  const [synopsis, setSynopsis] = useState('');
  const [alternateTitles, setAlternateTitles] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentContext, setCurrentContext] = useState('');

  const generateSynopsis = async () => {
    if (!ebookTitle) {
      toast.error('Titre requis');
      return;
    }
    toast.info('Fonctionnalité disponible via la page de gestion');
  };

  const generateAlternateTitles = async () => {
    if (!ebookTitle) {
      toast.error('Titre requis');
      return;
    }
    toast.info('Fonctionnalité disponible via la page de gestion');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papiers !');
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center gap-3 text-lg font-bold text-blue-700">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-blue-700" />
            </div>
            Assistant d'Écriture IA
          </CardTitle>
          <CardDescription>
            Outils pour vous aider à écrire plus efficacement
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs defaultValue="prompts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="prompts">
                <Lightbulb className="h-4 w-4 mr-2" />
                Prompts
              </TabsTrigger>
              <TabsTrigger value="synopsis">
                <FileText className="h-4 w-4 mr-2" />
                Synopsis
              </TabsTrigger>
              <TabsTrigger value="titles">
                <Heading className="h-4 w-4 mr-2" />
                Titres
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prompts" className="space-y-4">
              <div className="space-y-6">
                {writingPrompts.map((section, idx) => (
                  <div key={idx} className="space-y-3">
                    <h3 className="font-semibold text-sm text-primary">{section.category}</h3>
                    <div className="space-y-2">
                      {section.prompts.map((prompt, promptIdx) => (
                        <div 
                          key={promptIdx}
                          className="bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg p-3 border border-gray-200 cursor-pointer group"
                          onClick={() => copyToClipboard(prompt)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm text-gray-700">{prompt}</p>
                            <Copy className="h-4 w-4 text-gray-400 group-hover:text-primary flex-shrink-0 mt-0.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    💡 <strong>Astuce :</strong> Cliquez sur un prompt pour le copier dans le presse-papiers
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="synopsis" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Contexte additionnel (optionnel)</Label>
                  <Textarea
                    placeholder="Ex: Public cible, thème principal, ton souhaité..."
                    value={currentContext}
                    onChange={(e) => setCurrentContext(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={generateSynopsis}
                  disabled={isGenerating || !ebookTitle}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Générer le synopsis
                    </>
                  )}
                </Button>

                {synopsis && (
                  <div className="space-y-3">
                    <div className="bg-gray-50 border rounded-lg p-4">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {synopsis}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => copyToClipboard(synopsis)}
                        variant="outline"
                        className="flex-1"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copier
                      </Button>
                      <Button 
                        onClick={generateSynopsis}
                        variant="outline"
                        disabled={isGenerating}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Régénérer
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="titles" className="space-y-4">
              <div className="space-y-4">
                <Button 
                  onClick={generateAlternateTitles}
                  disabled={isGenerating || !ebookTitle}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Générer 8 titres alternatifs
                    </>
                  )}
                </Button>

                {alternateTitles.length > 0 && (
                  <div className="space-y-2">
                    {alternateTitles.map((title, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg p-3 border border-gray-200 cursor-pointer group"
                        onClick={() => copyToClipboard(title)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <span className="text-xs text-gray-500 font-medium">#{idx + 1}</span>
                            <p className="text-sm text-gray-700 font-medium mt-1">{title}</p>
                          </div>
                          <Copy className="h-4 w-4 text-gray-400 group-hover:text-primary flex-shrink-0" />
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      onClick={generateAlternateTitles}
                      variant="outline"
                      className="w-full mt-2"
                      disabled={isGenerating}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Générer d'autres suggestions
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
