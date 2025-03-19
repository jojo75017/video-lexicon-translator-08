import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bold, Italic, Underline, Link, Image, List, ListOrdered, Quote, Send, HelpCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

export interface QuoraQuestionFormProps {
  form: UseFormReturn<any, any, undefined>;
  textDetails: string;
  setTextDetails: React.Dispatch<React.SetStateAction<string>>;
  handleTextSelection: (e: React.MouseEvent<HTMLTextAreaElement>) => void;
  applyFormatting: (fieldType: 'details' | 'answer' | 'sources', format: 'bold' | 'italic' | 'underline' | 'link' | 'image' | 'list' | 'numbered-list' | 'quote') => void;
  onSubmit: (data: any) => void;
}

const QuoraQuestionForm: React.FC<QuoraQuestionFormProps> = ({
  form,
  textDetails,
  setTextDetails,
  handleTextSelection,
  applyFormatting,
  onSubmit
}) => {
  const categories = [
    "Marketing Digital",
    "SEO",
    "Réseaux Sociaux",
    "E-commerce",
    "Développement Web",
    "Intelligence Artificielle",
    "Entrepreneuriat",
    "Business",
    "Technologie",
    "Autre"
  ];

  const handleFormattingClick = (format: 'bold' | 'italic' | 'underline' | 'link' | 'image' | 'list' | 'numbered-list' | 'quote') => {
    applyFormatting('details', format);
  };

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
                <Input 
                  placeholder="Posez une question claire et précise..." 
                  {...field} 
                  className="font-medium"
                />
              </FormControl>
              <FormDescription>
                Les questions directes et spécifiques obtiennent plus de réponses
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <Label htmlFor="details">Détails de la question</Label>
          <div className="flex items-center gap-1 mb-2">
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              onClick={() => handleFormattingClick('bold')}
              className="h-8 w-8"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              onClick={() => handleFormattingClick('italic')}
              className="h-8 w-8"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              onClick={() => handleFormattingClick('underline')}
              className="h-8 w-8"
            >
              <Underline className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="mx-1 h-6" />
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              onClick={() => handleFormattingClick('link')}
              className="h-8 w-8"
            >
              <Link className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              onClick={() => handleFormattingClick('image')}
              className="h-8 w-8"
            >
              <Image className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="mx-1 h-6" />
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              onClick={() => handleFormattingClick('list')}
              className="h-8 w-8"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              onClick={() => handleFormattingClick('numbered-list')}
              className="h-8 w-8"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              onClick={() => handleFormattingClick('quote')}
              className="h-8 w-8"
            >
              <Quote className="h-4 w-4" />
            </Button>
          </div>
          <Textarea
            id="details"
            placeholder="Ajoutez des détails pour clarifier votre question et donner du contexte..."
            value={textDetails}
            onChange={(e) => setTextDetails(e.target.value)}
            onMouseUp={handleTextSelection}
            className="min-h-[150px]"
          />
          <p className="text-xs text-gray-500">
            Utilisez le formatage pour rendre votre question plus lisible
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (séparés par des virgules)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="seo, marketing, stratégie..." 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Card className="bg-blue-50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center">
              <HelpCircle className="h-4 w-4 mr-2" />
              Conseils pour obtenir de bonnes réponses
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-blue-700 space-y-1 py-0">
            <p>• Posez une question spécifique et directe</p>
            <p>• Incluez suffisamment de contexte</p>
            <p>• Évitez les questions trop larges ou vagues</p>
            <p>• Utilisez des tags pertinents pour atteindre les bons experts</p>
          </CardContent>
          <CardFooter className="pt-2">
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">Spécifique</Badge>
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">Contextualisée</Badge>
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">Pertinente</Badge>
            </div>
          </CardFooter>
        </Card>

        <div className="flex justify-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" className="mr-2">
                Prévisualiser
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px]" align="end">
              <div className="space-y-2">
                <h3 className="font-bold">{form.watch("question") || "Votre question"}</h3>
                <div className="text-sm whitespace-pre-wrap">{textDetails || "Détails de votre question..."}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {form.watch("tags") && form.watch("tags").split(',').map((tag: string, i: number) => (
                    <Badge key={i} variant="secondary" className="bg-gray-100">{tag.trim()}</Badge>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            type="submit" 
            className="bg-[#b92b27] hover:bg-[#a42521]"
          >
            <Send className="mr-2 h-4 w-4" />
            Publier sur Quora
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuoraQuestionForm;
