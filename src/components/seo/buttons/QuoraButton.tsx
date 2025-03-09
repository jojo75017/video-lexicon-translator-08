
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquareText, MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const quoraFormSchema = z.object({
  question: z.string().min(10, "La question doit contenir au moins 10 caractères"),
  details: z.string().optional(),
  topics: z.string().min(2, "Ajoutez au moins un sujet"),
});

const quoraAnswerSchema = z.object({
  questionToAnswer: z.string().min(10, "Sélectionnez une question à répondre"),
  answer: z.string().min(50, "La réponse doit contenir au moins 50 caractères"),
  sources: z.string().optional(),
});

type QuoraFormData = z.infer<typeof quoraFormSchema>;
type QuoraAnswerData = z.infer<typeof quoraAnswerSchema>;

export const QuoraButton = () => {
  const [activeTab, setActiveTab] = useState("ask");

  const askForm = useForm<QuoraFormData>({
    resolver: zodResolver(quoraFormSchema),
    defaultValues: {
      question: "",
      details: "",
      topics: "SEO, Marketing Digital",
    }
  });

  const answerForm = useForm<QuoraAnswerData>({
    resolver: zodResolver(quoraAnswerSchema),
    defaultValues: {
      questionToAnswer: "",
      answer: "",
      sources: "",
    }
  });

  // Liste exemple de questions populaires sur Quora liées au SEO
  const popularQuestions = [
    "Comment améliorer le référencement de mon site e-commerce en 2024?",
    "Quelles sont les meilleures stratégies de backlinks pour un nouveau site web?",
    "Comment optimiser mon contenu pour le featured snippet de Google?",
    "Quels outils SEO sont indispensables pour analyser la concurrence?",
    "Comment rédiger du contenu qui performe bien pour le SEO et la conversion?"
  ];

  const handleQuoraSubmit = (data: QuoraFormData) => {
    console.log("Question Quora:", data);
    toast.success("Question préparée pour Quora !");
    askForm.reset();
  };

  const handleQuoraAnswerSubmit = (data: QuoraAnswerData) => {
    console.log("Réponse Quora:", data);
    toast.success("Réponse préparée pour Quora !");
    answerForm.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="quora"
          className="flex flex-row items-center gap-2 py-3 px-4 text-center"
        >
          <MessageSquareText className="h-5 w-5" />
          <span>Utiliser Quora</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Quora - Questions & Réponses</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="ask">Poser une question</TabsTrigger>
            <TabsTrigger value="answer">Répondre à une question</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ask" className="space-y-4">
            <Form {...askForm}>
              <form onSubmit={askForm.handleSubmit(handleQuoraSubmit)} className="space-y-4">
                <FormField
                  control={askForm.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Votre question</FormLabel>
                      <FormControl>
                        <Input placeholder="Comment améliorer mon référencement SEO ?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={askForm.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Détails (optionnel)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ajoutez des détails pour contextualiser votre question..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={askForm.control}
                  name="topics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sujets (séparés par des virgules)</FormLabel>
                      <FormControl>
                        <Input placeholder="SEO, Marketing, Référencement" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" onClick={() => askForm.reset()}>Annuler</Button>
                  <Button type="submit" variant="quora">Publier sur Quora</Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="answer" className="space-y-4">
            <Form {...answerForm}>
              <form onSubmit={answerForm.handleSubmit(handleQuoraAnswerSubmit)} className="space-y-4">
                <FormField
                  control={answerForm.control}
                  name="questionToAnswer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question à répondre</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="">Sélectionnez une question</option>
                          {popularQuestions.map((question, index) => (
                            <option key={index} value={question}>
                              {question}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={answerForm.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Votre réponse</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Rédigez une réponse détaillée et informative..."
                          className="min-h-[200px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={answerForm.control}
                  name="sources"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sources (optionnel)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ajoutez des liens ou références pour appuyer votre réponse..."
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" onClick={() => answerForm.reset()}>Annuler</Button>
                  <Button type="submit" variant="quora">Publier la réponse</Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default QuoraButton;
