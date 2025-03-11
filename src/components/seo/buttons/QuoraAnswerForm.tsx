
import React, { useRef } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from 'react-hook-form';
import * as z from "zod";
import QuoraFormatToolbar from './QuoraFormatToolbar';

export const quoraAnswerSchema = z.object({
  questionToAnswer: z.string().min(10, "Sélectionnez une question à répondre"),
  answer: z.string().min(50, "La réponse doit contenir au moins 50 caractères"),
  sources: z.string().optional(),
});

export type QuoraAnswerData = z.infer<typeof quoraAnswerSchema>;

interface QuoraAnswerFormProps {
  form: UseFormReturn<QuoraAnswerData>;
  popularQuestions: string[];
  textAnswer: string;
  setTextAnswer: (text: string) => void;
  textSources: string;
  setTextSources: (text: string) => void;
  handleTextSelection: (fieldType: 'details' | 'answer' | 'sources', start: number, end: number, text: string) => void;
  applyFormatting: (fieldType: 'details' | 'answer' | 'sources', format: 'bold' | 'italic' | 'underline' | 'link' | 'image' | 'list' | 'numbered-list' | 'quote') => void;
  onSubmit: (data: QuoraAnswerData) => void;
}

const QuoraAnswerForm = ({
  form,
  popularQuestions,
  textAnswer,
  setTextAnswer,
  textSources,
  setTextSources,
  handleTextSelection,
  applyFormatting,
  onSubmit
}: QuoraAnswerFormProps) => {
  const answerRef = useRef<HTMLTextAreaElement>(null);
  const sourcesRef = useRef<HTMLTextAreaElement>(null);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
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
        
        <FormItem>
          <FormLabel>Votre réponse</FormLabel>
          <QuoraFormatToolbar fieldType="answer" onFormat={applyFormatting} />
          <Textarea 
            placeholder="Rédigez une réponse détaillée et informative..."
            className="min-h-[200px]" 
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            onSelect={(start, end, text) => handleTextSelection('answer', start, end, text)}
            ref={answerRef}
          />
          <div className="text-xs text-[#6E59A5] mt-1">
            Astuce: Sélectionnez du texte et cliquez sur l'icône de lien pour ajouter un lien hypertexte.
          </div>
        </FormItem>
        
        <FormItem>
          <FormLabel>Sources (optionnel)</FormLabel>
          <QuoraFormatToolbar fieldType="sources" onFormat={applyFormatting} />
          <Textarea 
            placeholder="Ajoutez des liens ou références pour appuyer votre réponse..."
            className="min-h-[80px]"
            value={textSources}
            onChange={(e) => setTextSources(e.target.value)}
            onSelect={(start, end, text) => handleTextSelection('sources', start, end, text)}
            ref={sourcesRef}
          />
        </FormItem>
        
        <div className="flex justify-between mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              form.reset();
              setTextAnswer("");
              setTextSources("");
            }}
          >
            Annuler
          </Button>
          <Button type="submit" variant="quora">Publier la réponse</Button>
        </div>
      </form>
    </Form>
  );
};

export default QuoraAnswerForm;
