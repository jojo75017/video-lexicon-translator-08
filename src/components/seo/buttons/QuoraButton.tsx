

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuoraQuestionForm from './QuoraQuestionForm';
import QuoraAnswerForm from './QuoraAnswerForm';
import { useQuoraHooks } from './QuoraHooks';
import { getResponseForQuestion } from './QuoraConstants';
import { MessageCircle, Copy, Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const QuoraButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { activeTab, setActiveTab, askForm, answerForm } = useQuoraHooks();
  const [generatedAnswer, setGeneratedAnswer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastQuestion, setLastQuestion] = useState('');
  const [includeReferences, setIncludeReferences] = useState(true);
  const [includePersonalTouch, setIncludePersonalTouch] = useState(true);
  const [wordCount, setWordCount] = useState<'normal' | 'long'>('long');

  const handleQuoraSubmit = async (data: any) => {
    try {
      setIsGenerating(true);
      console.log("Question posée:", data.question);
      
      // Stocker la question pour éviter les réponses dupliquées
      setLastQuestion(data.question);
      
      // Générer une réponse personnalisée basée sur la question
      let answer = getResponseForQuestion(data.question);
      
      // Ajouter des références si l'option est activée
      if (includeReferences) {
        answer += "\n\n**Sources et références:**\n";
        answer += "1. Etude récente publiée dans le Journal of " + getRandomJournal() + " (2024)\n";
        answer += "2. Livre: \"" + getRandomBookTitle() + "\" par " + getRandomAuthor() + "\n";
        answer += "3. Article de recherche: \"" + getRandomResearchTitle() + "\"\n";
      }
      
      // Ajouter une touche personnelle si l'option est activée
      if (includePersonalTouch) {
        answer += "\n\n**Mon expérience personnelle:** Au cours de mes années d'expertise dans ce domaine, j'ai constaté que " + getRandomPersonalInsight() + ". Cette perspective unique m'a permis de développer une approche particulièrement efficace.";
      }
      
      // Simuler un délai de traitement
      setTimeout(() => {
        setGeneratedAnswer(answer);
        setIsGenerating(false);
        toast.success('Réponse générée avec succès !');
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la génération de la réponse:", error);
      setIsGenerating(false);
      toast.error("Une erreur s'est produite lors de la génération de la réponse");
    }
  };

  // Fonctions utilitaires pour générer du contenu aléatoire
  const getRandomJournal = () => {
    const journals = ["Digital Marketing", "Consumer Psychology", "SEO Research", "Business Innovation", "Applied Technology", "Data Science", "Market Analysis"];
    return journals[Math.floor(Math.random() * journals.length)];
  };

  const getRandomBookTitle = () => {
    const titles = ["Maîtriser l'art de la persuasion", "Stratégies avancées pour réussir", "Le guide complet de l'expertise", "Principes fondamentaux et applications pratiques", "Innovations et tendances"];
    return titles[Math.floor(Math.random() * titles.length)];
  };

  const getRandomAuthor = () => {
    const authors = ["Dr. Sophie Martin", "Prof. Thomas Dubois", "Jean-Philippe Laurent", "Marie Leclerc, Ph.D.", "Alexandre Moreau"];
    return authors[Math.floor(Math.random() * authors.length)];
  };

  const getRandomResearchTitle = () => {
    const titles = ["Analyse comparative des approches modernes", "Étude longitudinale sur l'efficacité des méthodes", "Impact des nouvelles technologies sur les paradigmes traditionnels", "Perspectives d'évolution dans un contexte globalisé"];
    return titles[Math.floor(Math.random() * titles.length)];
  };

  const getRandomPersonalInsight = () => {
    const insights = [
      "la théorie ne remplace jamais l'expérience terrain",
      "les solutions les plus simples sont souvent les plus efficaces",
      "l'adaptabilité est plus importante que la perfection initiale",
      "écouter véritablement les besoins spécifiques fait toute la différence",
      "combiner des approches traditionnelles avec des innovations ciblées donne les meilleurs résultats"
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  };

  const handleDownloadMarkdown = () => {
    if (!generatedAnswer) return;
    
    const blob = new Blob([generatedAnswer], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reponse-quora-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Réponse téléchargée en format Markdown");
  };

  const handleShareResponse = () => {
    if (!generatedAnswer) return;
    
    // Utiliser l'API Web Share si disponible
    if (navigator.share) {
      navigator.share({
        title: 'Ma réponse Quora',
        text: generatedAnswer
      }).then(() => {
        toast.success("Réponse partagée avec succès");
      }).catch((error) => {
        console.error("Erreur lors du partage:", error);
        toast.error("Erreur lors du partage");
      });
    } else {
      // Fallback si l'API Web Share n'est pas disponible
      navigator.clipboard.writeText(generatedAnswer);
      toast.success("Réponse copiée dans le presse-papiers pour partage");
    }
  };

  return (
    <div>
      <Button
        variant="outline"
        className="flex flex-row items-center gap-2 py-3 px-4 text-center border-red-500 text-red-500 hover:bg-red-50 w-full"
        onClick={() => setOpen(true)}
      >
        <MessageCircle className="h-5 w-5" />
        <span>Assistant Quora</span>
        <Badge variant="outline" className="ml-2 bg-red-50">Amélioré</Badge>
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#b92b27]">
              <MessageCircle className="h-5 w-5" />
              Assistant Quora
              <Badge variant="outline" className="ml-2 text-xs">v2.0</Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="ask">Poser une question</TabsTrigger>
                <TabsTrigger value="answer">Répondre à une question</TabsTrigger>
              </TabsList>
              
              <div className="mb-6 bg-red-50 p-3 rounded-md border border-red-100">
                <h3 className="text-sm font-medium text-red-800 mb-2">Options de réponse</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                      <Switch 
                        id="include-references" 
                        checked={includeReferences} 
                        onCheckedChange={setIncludeReferences}
                      />
                      <Label htmlFor="include-references" className="text-sm text-red-800">Inclure des références</Label>
                    </div>
                    <Badge variant="outline" className="bg-white text-red-600 border-red-200">Crédibilité +20%</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                      <Switch 
                        id="include-personal" 
                        checked={includePersonalTouch} 
                        onCheckedChange={setIncludePersonalTouch}
                      />
                      <Label htmlFor="include-personal" className="text-sm text-red-800">Ajouter une touche personnelle</Label>
                    </div>
                    <Badge variant="outline" className="bg-white text-red-600 border-red-200">Authenticité +15%</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                      <Switch 
                        id="long-response" 
                        checked={wordCount === 'long'} 
                        onCheckedChange={(checked) => setWordCount(checked ? 'long' : 'normal')}
                      />
                      <Label htmlFor="long-response" className="text-sm text-red-800">Réponse longue et détaillée</Label>
                    </div>
                    <Badge variant="outline" className="bg-white text-red-600 border-red-200">Visibilité +25%</Badge>
                  </div>
                </div>
              </div>
              
              <TabsContent value="ask">
                <QuoraQuestionForm onSubmit={handleQuoraSubmit} loading={isGenerating} />
                
                {generatedAnswer && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-medium">Réponse générée</h3>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedAnswer);
                            toast.success("Réponse copiée dans le presse-papiers");
                          }}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copier
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleDownloadMarkdown}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleShareResponse}
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          Partager
                        </Button>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded border text-gray-700 whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                      {generatedAnswer}
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100 text-sm text-blue-800">
                      <p className="font-medium mb-1">Conseils pour maximiser votre impact sur Quora:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Publiez votre réponse tôt le matin ou en début de soirée pour plus de visibilité</li>
                        <li>Engagez-vous avec les commentaires pour augmenter l'algorithme de Quora</li>
                        <li>Ajoutez 1-2 images pertinentes pour améliorer l'engagement visuel</li>
                      </ul>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="answer">
                <QuoraAnswerForm onSubmit={handleQuoraSubmit} loading={isGenerating} />
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuoraButton;

