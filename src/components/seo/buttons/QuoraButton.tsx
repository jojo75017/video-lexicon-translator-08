
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquareText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const quoraFormSchema = z.object({
  question: z.string().min(10, "La question doit contenir au moins 10 caractères"),
  details: z.string().optional(),
  topics: z.string().min(2, "Ajoutez au moins un sujet"),
});

type QuoraFormData = z.infer<typeof quoraFormSchema>;

export const QuoraButton = () => {
  const form = useForm<QuoraFormData>({
    resolver: zodResolver(quoraFormSchema),
    defaultValues: {
      question: "",
      details: "",
      topics: "SEO, Marketing Digital",
    }
  });

  const handleQuoraSubmit = (data: QuoraFormData) => {
    console.log("Question Quora:", data);
    toast.success("Question préparée pour Quora !");
    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="quora"
          className="flex flex-row items-center gap-2 py-3 px-4 text-center"
        >
          <MessageSquareText className="h-5 w-5" />
          <span>Poser sur Quora</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Préparer une question pour Quora</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleQuoraSubmit)} className="space-y-4">
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
            <FormField
              control={form.control}
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
              <Button type="button" variant="outline" onClick={() => form.reset()}>Annuler</Button>
              <Button type="submit" variant="quora">Publier sur Quora</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default QuoraButton;
