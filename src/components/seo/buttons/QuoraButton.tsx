
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquareText, Send, Copy, Sparkles, RefreshCw } from "lucide-react";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const QuoraButton = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [isGenerating, setIsGenerating] = useState(false);
  const [quoraQuestion, setQuoraQuestion] = useState("");
  const [quoraAnswer, setQuoraAnswer] = useState("");
  const [toneStyle, setToneStyle] = useState("expert");

  // Liste de questions populaires sur Quora
  const popularQuestions = [
    "Comment voyager pas cher en Europe ?",
    "Quelles sont les meilleures astuces pour économiser sur les billets d'avion ?",
    "Comment organiser un voyage à petit budget ?",
    "Quels sont les meilleurs outils pour trouver des hébergements économiques ?",
    "Comment profiter pleinement d'un voyage sans se ruiner ?"
  ];

  // Schema de validation pour le formulaire
  const formSchema = z.object({
    question: z.string().min(5, {
      message: "La question doit contenir au moins 5 caractères.",
    }),
    category: z.string().optional(),
    tags: z.string().optional(),
  });

  // Configuration du formulaire avec react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      category: "",
      tags: "",
    },
  });

  // Fonction pour gérer la soumission du formulaire
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast.success("Votre question a été créée !");
    setOpen(false);
  };

  // Fonction pour générer une réponse avec l'IA
  const generateAnswer = () => {
    if (!quoraQuestion) {
      toast.error("Veuillez d'abord sélectionner une question");
      return;
    }

    setIsGenerating(true);
    
    // Simuler la génération d'une réponse IA
    setTimeout(() => {
      const answers = {
        expert: `En tant qu'expert en voyages économiques, je peux affirmer que voyager à petit budget en Europe est tout à fait possible avec les bonnes stratégies.

Voici 3 conseils essentiels basés sur mon expérience:

1. **Planifiez hors saison** - Les prix peuvent être jusqu'à 40% moins élevés en basse saison (octobre-novembre, janvier-mars). Les températures restent agréables dans le sud de l'Europe.

2. **Utilisez les bonnes applications** - Skyscanner pour surveiller les vols, Hostelworld pour les auberges, et TooGoodToGo pour économiser sur la nourriture.

3. **Exploitez les transports locaux** - Les pass ferroviaires comme l'Interrail offrent un excellent rapport qualité-prix pour des trajets multiples.

Un budget quotidien de 50-70€ est réaliste en adoptant ces stratégies.`,
        
        conversational: `Ah, voyager en Europe sans se ruiner, c'est tout un art! 😊

J'ai fait l'Europe avec seulement 35€/jour l'année dernière, et voici comment:

• Soyez flexible sur les dates! J'ai trouvé un vol Paris-Lisbonne à 19€ en partant un mardi.

• Les auberges ne sont pas aussi terribles qu'on le pense! J'en ai trouvé des super propres à partir de 15€/nuit.

• La nourriture: les marchés locaux sont vos meilleurs amis. À Barcelone, je me régalais pour 5-7€ par repas.

• Transport: marchez! Les plus belles découvertes se font à pied.

Vous préparez un voyage bientôt? Je serais ravi de partager plus d'astuces spécifiques!`,
        
        storytelling: `Il y a six mois, Marie est partie explorer l'Europe avec seulement 1200€ en poche pour un mois entier. Impossible? C'est ce que pensaient ses amis.

Son premier choc: en arrivant à Porto, elle a découvert que son auberge à 14€/nuit était en réalité un magnifique bâtiment historique avec petit-déjeuner inclus.

Le deuxième jour, elle a rencontré Thomas, un local qui lui a montré comment manger comme un Portugais: acheter du pain frais, du fromage et des fruits au marché pour moins de 5€ par jour.

Sa plus grande économie? Marie a utilisé BlaBlaCar pour se déplacer entre les villes, divisant par trois le coût des transports.

À la fin de son voyage, elle avait visité 6 pays et il lui restait même 150€. La clé? S'adapter aux rythmes locaux et éviter les pièges à touristes.`
      };
      
      setQuoraAnswer(answers[toneStyle as keyof typeof answers] || answers.expert);
      setIsGenerating(false);
      toast.success("Réponse générée avec succès !");
    }, 2000);
  };

  // Fonction pour copier la réponse dans le presse-papier
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié dans le presse-papier !");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-[#b92b27] hover:bg-[#a62520]">
          <MessageSquareText className="mr-2 h-4 w-4" />
          Créer une réponse Quora
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquareText className="h-5 w-5 text-[#b92b27]" />
            Assistant Quora
          </DialogTitle>
          <DialogDescription>
            Créez des réponses optimisées pour Quora et augmentez votre visibilité
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="general">Étape 1: Question</TabsTrigger>
            <TabsTrigger value="response">Étape 2: Réponse</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div>
              <Label htmlFor="quora-question">Sélectionner une question</Label>
              <Select 
                value={quoraQuestion} 
                onValueChange={setQuoraQuestion}
              >
                <SelectTrigger id="quora-question">
                  <SelectValue placeholder="Choisissez une question..." />
                </SelectTrigger>
                <SelectContent>
                  {popularQuestions.map((question) => (
                    <SelectItem key={question} value={question}>
                      {question}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Ou saisissez votre propre question</Label>
              <Textarea
                placeholder="Écrivez votre question Quora ici..."
                className="min-h-[100px] mt-2"
                value={quoraQuestion === popularQuestions.find(q => q === quoraQuestion) ? "" : quoraQuestion}
                onChange={(e) => setQuoraQuestion(e.target.value)}
              />
            </div>
            
            <div>
              <Label>Style de réponse</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button 
                  type="button" 
                  variant={toneStyle === "expert" ? "default" : "outline"}
                  className={toneStyle === "expert" ? "bg-[#b92b27] hover:bg-[#a62520]" : ""}
                  onClick={() => setToneStyle("expert")}
                >
                  Expert
                </Button>
                <Button 
                  type="button" 
                  variant={toneStyle === "conversational" ? "default" : "outline"}
                  className={toneStyle === "conversational" ? "bg-[#b92b27] hover:bg-[#a62520]" : ""}
                  onClick={() => setToneStyle("conversational")}
                >
                  Conversationnel
                </Button>
                <Button 
                  type="button" 
                  variant={toneStyle === "storytelling" ? "default" : "outline"}
                  className={toneStyle === "storytelling" ? "bg-[#b92b27] hover:bg-[#a62520]" : ""}
                  onClick={() => setToneStyle("storytelling")}
                >
                  Storytelling
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button 
                onClick={() => {
                  if (quoraQuestion) {
                    setActiveTab("response");
                    if (!quoraAnswer) {
                      generateAnswer();
                    }
                  } else {
                    toast.error("Veuillez sélectionner ou saisir une question");
                  }
                }}
                className="bg-[#b92b27] hover:bg-[#a62520]"
              >
                Suivant
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="response" className="space-y-4">
            <div className="mb-4">
              <Label>Question sélectionnée</Label>
              <div className="p-3 bg-gray-50 rounded-md mt-1 text-sm">
                {quoraQuestion}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <Label>Réponse générée</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8"
                  onClick={generateAnswer}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-3 w-3" />
                      Régénérer
                    </>
                  )}
                </Button>
              </div>
              
              <div className="relative mt-2">
                <Textarea
                  value={quoraAnswer}
                  onChange={(e) => setQuoraAnswer(e.target.value)}
                  placeholder="Votre réponse apparaîtra ici..."
                  className="min-h-[200px]"
                />
                {quoraAnswer && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(quoraAnswer)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("general")}
              >
                Retour
              </Button>
              <Button 
                onClick={() => {
                  if (quoraAnswer) {
                    copyToClipboard(quoraAnswer);
                    toast.success("Réponse copiée et prête à être publiée sur Quora !");
                    setOpen(false);
                  } else {
                    toast.error("Veuillez d'abord générer une réponse");
                  }
                }}
                className="bg-[#b92b27] hover:bg-[#a62520]"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copier et terminer
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
