
import React, { useRef } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from 'react-hook-form';
import * as z from "zod";
import QuoraFormatToolbar from './QuoraFormatToolbar';

export const quoraFormSchema = z.object({
  question: z.string().min(10, "La question doit contenir au moins 10 caractères"),
  details: z.string().optional(),
  topics: z.string().min(2, "Ajoutez au moins un sujet"),
});

export type QuoraFormData = z.infer<typeof quoraFormSchema>;

interface QuoraQuestionFormProps {
  form: UseFormReturn<QuoraFormData>;
  textDetails: string;
  setTextDetails: (text: string) => void;
  handleTextSelection: (fieldType: 'details' | 'answer' | 'sources', start: number, end: number, text: string) => void;
  applyFormatting: (fieldType: 'details' | 'answer' | 'sources', format: 'bold' | 'italic' | 'underline' | 'link' | 'image' | 'list' | 'numbered-list' | 'quote') => void;
  onSubmit: (data: QuoraFormData) => void;
}

const QuoraQuestionForm = ({
  form,
  textDetails,
  setTextDetails,
  handleTextSelection,
  applyFormatting,
  onSubmit
}: QuoraQuestionFormProps) => {
  const detailsRef = useRef<HTMLTextAreaElement>(null);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
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
        
        <FormItem>
          <FormLabel>Détails (optionnel)</FormLabel>
          <QuoraFormatToolbar fieldType="details" onFormat={applyFormatting} />
          <Textarea 
            placeholder="Ajoutez des détails pour contextualiser votre question..."
            className="min-h-[100px]"
            value={textDetails}
            onChange={(e) => setTextDetails(e.target.value)}
            onSelect={(start, end, text) => handleTextSelection('details', start, end, text)}
            ref={detailsRef}
          />
          <div className="text-xs text-[#6E59A5] mt-1">
            Astuce: Sélectionnez du texte et utilisez le bouton de lien pour créer un lien hypertexte.
          </div>
        </FormItem>
        
        <FormField
          control={form.control}
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
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              form.reset();
              setTextDetails("");
            }}
          >
            Annuler
          </Button>
          <Button type="submit" variant="quora">Publier sur Quora</Button>
        </div>
      </form>
    </Form>
  );
};

export default QuoraQuestionForm;
