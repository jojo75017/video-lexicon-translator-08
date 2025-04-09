
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuoraQuestionForm from './QuoraQuestionForm';
import QuoraAnswerForm from './QuoraAnswerForm';
import { useQuoraHooks } from './QuoraHooks';
import { getResponseForQuestion } from './QuoraConstants';
import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

export const QuoraButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { activeTab, setActiveTab, askForm, answerForm } = useQuoraHooks();
  const [generatedAnswer, setGeneratedAnswer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastQuestion, setLastQuestion] = useState('');

  const handleQuoraSubmit = async (data: any) => {
    try {
      setIsGenerating(true);
      console.log("Question posée:", data.question);
      
      // Stocker la question pour éviter les réponses dupliquées
      setLastQuestion(data.question);
      
      // Générer une réponse personnalisée basée sur la question
      const answer = getResponseForQuestion(data.question);
      
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

  return (
    <div>
      <Button
        variant="outline"
        className="flex flex-row items-center gap-2 py-3 px-4 text-center border-red-500 text-red-500 hover:bg-red-50 w-full"
        onClick={() => setOpen(true)}
      >
        <MessageCircle className="h-5 w-5" />
        <span>Assistant Quora</span>
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#b92b27]">
              <MessageCircle className="h-5 w-5" />
              Assistant Quora
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="ask">Poser une question</TabsTrigger>
                <TabsTrigger value="answer">Répondre à une question</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ask">
                <QuoraQuestionForm onSubmit={handleQuoraSubmit} loading={isGenerating} />
                
                {generatedAnswer && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium mb-2">Réponse générée</h3>
                    <div className="bg-white p-4 rounded border text-gray-700 whitespace-pre-wrap">
                      {generatedAnswer}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedAnswer);
                          toast.success("Réponse copiée dans le presse-papiers");
                        }}
                      >
                        Copier
                      </Button>
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
