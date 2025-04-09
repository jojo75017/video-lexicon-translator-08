
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send } from 'lucide-react';

interface QuoraQuestionFormProps {
  onSubmit: (data: any) => void;
  loading: boolean;
}

const QuoraQuestionForm: React.FC<QuoraQuestionFormProps> = ({ onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      question: '',
      details: '',
      topic: ''
    }
  });

  const topics = [
    "Marketing Digital",
    "SEO",
    "Développement Web",
    "Technologie",
    "Entrepreneuriat",
    "Finances Personnelles",
    "Santé & Bien-être",
    "Voyages",
    "Développement personnel",
    "Autre"
  ];

  const submitForm = (data: any) => {
    if (!data.question.trim()) {
      toast.error("Veuillez saisir une question");
      return;
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="question" className="font-medium">Votre question *</Label>
        <Input
          id="question"
          placeholder="Ex: Comment améliorer le référencement de mon site web?"
          {...register('question', { required: true })}
          className={errors.question ? 'border-red-500' : ''}
        />
        {errors.question && <p className="text-red-500 text-xs mt-1">Veuillez saisir votre question</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="details" className="font-medium">Détails (optionnel)</Label>
        <Textarea
          id="details"
          placeholder="Ajoutez des informations supplémentaires pour obtenir une réponse plus précise..."
          {...register('details')}
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="topic" className="font-medium">Sujet</Label>
        <Select 
          onValueChange={(value) => setValue('topic', value)}
          value={watch('topic')}
        >
          <SelectTrigger id="topic">
            <SelectValue placeholder="Sélectionnez un sujet" />
          </SelectTrigger>
          <SelectContent>
            {topics.map((topic) => (
              <SelectItem key={topic} value={topic}>
                {topic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button 
        type="submit" 
        disabled={loading} 
        className="w-full bg-[#b92b27] hover:bg-[#a62520]"
      >
        {loading ? (
          <>Génération de la réponse...</>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Générer une réponse Quora
          </>
        )}
      </Button>
    </form>
  );
};

export default QuoraQuestionForm;
