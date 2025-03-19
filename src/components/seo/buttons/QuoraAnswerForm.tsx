import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bold, Italic, Underline, Link, Image, List, ListOrdered, Quote, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export interface QuoraAnswerFormProps {
  form: UseFormReturn<any, any, undefined>;
  popularQuestions: string[];
  textAnswer: string;
  setTextAnswer: React.Dispatch<React.SetStateAction<string>>;
  textSources: string;
  setTextSources: React.Dispatch<React.SetStateAction<string>>;
  handleTextSelection: (e: React.MouseEvent<HTMLTextAreaElement>) => void;
  applyFormatting: (fieldType: 'details' | 'answer' | 'sources', format: 'bold' | 'italic' | 'underline' | 'link' | 'image' | 'list' | 'numbered-list' | 'quote') => void;
  onSubmit: (data: any) => void;
}

const QuoraAnswerForm: React.FC<QuoraAnswerFormProps> = ({
  form,
  popularQuestions,
  textAnswer,
  setTextAnswer,
  textSources,
  setTextSources,
  handleTextSelection,
  applyFormatting,
  onSubmit
}) => {
  const { register, handleSubmit, setValue, watch } = form;
  const questionToAnswer = watch('questionToAnswer');
  
  const handleGenerateAnswer = () => {
    if (!questionToAnswer) {
      toast.error("Veuillez d'abord sélectionner une question");
      return;
    }
    
    toast.loading("Génération d'une réponse...");
    
    // Simulate API call
    setTimeout(() => {
      const generatedAnswer = `Merci pour cette excellente question sur ${questionToAnswer.split(' ').slice(0, 3).join(' ')}...

Après plusieurs années d'expérience dans ce domaine, je peux vous partager quelques points essentiels:

1. **Commencez par une analyse approfondie** - Avant de vous lancer, prenez le temps d'étudier votre situation spécifique et vos objectifs.

2. **Adoptez une approche systématique** - Les meilleurs résultats viennent d'une méthode structurée plutôt que d'actions isolées.

3. **Mesurez vos résultats** - Ce qui ne peut être mesuré ne peut être amélioré. Définissez des KPIs clairs.

4. **Restez flexible** - Soyez prêt à ajuster votre stratégie en fonction des résultats et des changements du marché.

Selon une étude récente de McKinsey, les entreprises qui suivent ces principes voient une amélioration de 37% de leurs performances dans ce domaine.

N'hésitez pas à me demander des précisions sur l'un de ces points!`;
      
      setTextAnswer(generatedAnswer);
      
      const generatedSources = `1. "Guide stratégique 2024", Harvard Business Review, https://example.com/hbr
2. "Étude sectorielle sur les performances", McKinsey & Company, https://example.com/mckinsey
3. "Analyse comparative des meilleures pratiques", Journal of Business Strategy, https://example.com/jbs`;
      
      setTextSources(generatedSources);
      
      toast.dismiss();
      toast.success("Réponse générée avec succès!");
    }, 2000);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="questionToAnswer">Question à répondre</Label>
        <Select 
          onValueChange={(value) => setValue('questionToAnswer', value)}
          value={questionToAnswer}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une question..." />
          </SelectTrigger>
          <SelectContent>
            {popularQuestions.map((question, index) => (
              <SelectItem key={index} value={question}>
                {question}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label htmlFor="answer">Votre réponse</Label>
          <div className="flex items-center space-x-1">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={() => applyFormatting('answer', 'bold')}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={() => applyFormatting('answer', 'italic')}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={() => applyFormatting('answer', 'underline')}
            >
              <Underline className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={() => applyFormatting('answer', 'link')}
            >
              <Link className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={() => applyFormatting('answer', 'list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={() => applyFormatting('answer', 'numbered-list')}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={() => applyFormatting('answer', 'quote')}
            >
              <Quote className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Textarea
          id="answer"
          value={textAnswer}
          onChange={(e) => setTextAnswer(e.target.value)}
          onMouseUp={(e) => handleTextSelection(e)}
          placeholder="Rédigez votre réponse ici..."
          className="min-h-[200px] font-sans"
          {...register('answer')}
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label htmlFor="sources">Sources et références</Label>
          <div className="flex items-center space-x-1">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={() => applyFormatting('sources', 'link')}
            >
              <Link className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Textarea
          id="sources"
          value={textSources}
          onChange={(e) => setTextSources(e.target.value)}
          onMouseUp={(e) => handleTextSelection(e)}
          placeholder="Ajoutez vos sources et références ici..."
          className="min-h-[100px] font-sans"
          {...register('sources')}
        />
      </div>
      
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleGenerateAnswer}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Générer une réponse
        </Button>
        
        <Button type="submit" className="bg-[#b92b27] hover:bg-[#a42520]">
          Publier sur Quora
        </Button>
      </div>
      
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Conseils pour une réponse efficace</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-gray-500 space-y-1">
          <p>• Commencez par une introduction qui montre votre expertise</p>
          <p>• Structurez votre réponse avec des points numérotés ou des listes</p>
          <p>• Incluez des données et statistiques pour renforcer vos arguments</p>
          <p>• Terminez par une conclusion qui résume vos points principaux</p>
          <p>• Ajoutez des sources crédibles pour augmenter votre autorité</p>
        </CardContent>
      </Card>
    </form>
  );
};

export default QuoraAnswerForm;
