import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquareText, Bold, Italic, Underline, Link as LinkIcon, ImageIcon, ListOrdered, ListIcon, Quote } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  const [textDetails, setTextDetails] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [textSources, setTextSources] = useState("");
  const [selectedText, setSelectedText] = useState({ start: 0, end: 0, text: "" });
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");
  const [quoraProfile, setQuoraProfile] = useState<string>("");

  const detailsRef = useRef<HTMLTextAreaElement>(null);
  const answerRef = useRef<HTMLTextAreaElement>(null);
  const sourcesRef = useRef<HTMLTextAreaElement>(null);
  const linkButtonRef = useRef<HTMLButtonElement>(null);
  const activeTextarea = useRef<'details' | 'answer' | 'sources'>('details');

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

  const popularQuestions = [
    "Comment améliorer le référencement de mon site e-commerce en 2024?",
    "Quelles sont les meilleures stratégies de backlinks pour un nouveau site web?",
    "Comment optimiser mon contenu pour le featured snippet de Google?",
    "Quels outils SEO sont indispensables pour analyser la concurrence?",
    "Comment rédiger du contenu qui performe bien pour le SEO et la conversion?"
  ];

  const handleQuoraSubmit = (data: QuoraFormData) => {
    data.details = textDetails;
    
    const quoraPostUrl = "https://fr.quora.com/";
    
    console.log("Question Quora:", data);
    toast.success(
      <div className="space-y-2">
        <p>Question préparée pour Quora !</p>
        <p className="text-sm">Pour publier votre question :</p>
        <ol className="text-sm list-decimal pl-4">
          <li>Copiez votre question</li>
          <li>
            <a 
              href={quoraPostUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Cliquez ici pour aller sur Quora
            </a>
          </li>
          <li>Collez et publiez votre question sur Quora</li>
        </ol>
      </div>
    );
    
    askForm.reset();
    setTextDetails("");
  };

  const handleQuoraAnswerSubmit = (data: QuoraAnswerData) => {
    data.answer = textAnswer;
    data.sources = textSources;
    
    console.log("Réponse Quora:", data);
    toast.success(
      <div className="space-y-2">
        <p>Réponse préparée pour Quora !</p>
        <p className="text-sm">Pour publier votre réponse :</p>
        <ol className="text-sm list-decimal pl-4">
          <li>Copiez votre réponse</li>
          <li>
            <a 
              href={`https://fr.quora.com/answer`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Cliquez ici pour aller sur Quora
            </a>
          </li>
          <li>Trouvez la question et collez votre réponse</li>
        </ol>
      </div>
    );
    
    answerForm.reset();
    setTextAnswer("");
    setTextSources("");
  };

  const getTextAreaInfo = (fieldType: 'details' | 'answer' | 'sources') => {
    let textareaRef: React.RefObject<HTMLTextAreaElement>;
    let text = '';
    let setText: React.Dispatch<React.SetStateAction<string>> = () => {};

    if (fieldType === 'details') {
      textareaRef = detailsRef;
      text = textDetails;
      setText = setTextDetails;
    } else if (fieldType === 'answer') {
      textareaRef = answerRef;
      text = textAnswer;
      setText = setTextAnswer;
    } else {
      textareaRef = sourcesRef;
      text = textSources;
      setText = setTextSources;
    }

    const textarea = textareaRef.current;
    return { textarea, text, setText };
  };

  const handleTextSelection = (fieldType: 'details' | 'answer' | 'sources', start: number, end: number, selectedText: string) => {
    setSelectedText({ start, end, text: selectedText });
    activeTextarea.current = fieldType;
  };

  const applyFormatting = (fieldType: 'details' | 'answer' | 'sources', format: 'bold' | 'italic' | 'underline' | 'link' | 'image' | 'list' | 'numbered-list' | 'quote') => {
    const { textarea, text, setText } = getTextAreaInfo(fieldType);
    
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    
    if (format === 'link') {
      if (start !== end) {
        setShowLinkPopover(true);
        return;
      }
    }
    
    if (start === end) {
      let formattedTemplate = '';
      if (format === 'bold') formattedTemplate = '**texte en gras**';
      else if (format === 'italic') formattedTemplate = '*texte en italique*';
      else if (format === 'underline') formattedTemplate = '__texte souligné__';
      else if (format === 'link') formattedTemplate = '[texte du lien](https://exemple.com)';
      else if (format === 'image') formattedTemplate = '![description de l\'image](https://exemple.com/image.jpg)';
      else if (format === 'list') formattedTemplate = '\n- Élément de liste\n- Élément de liste\n- Élément de liste\n';
      else if (format === 'numbered-list') formattedTemplate = '\n1. Premier élément\n2. Deuxième élément\n3. Troisième élément\n';
      else if (format === 'quote') formattedTemplate = '\n> Votre citation ici\n';
      
      const newText = text.substring(0, start) + formattedTemplate + text.substring(end);
      setText(newText);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + formattedTemplate.length, start + formattedTemplate.length);
      }, 0);
    } else {
      let before = text.substring(0, start);
      let after = text.substring(end);
      let formattedText = '';
      
      if (format === 'bold') formattedText = `**${selectedText}**';
      else if (format === 'italic') formattedText = `*${selectedText}*`;
      else if (format === 'underline') formattedText = `__${selectedText}__`;
      else if (format === 'link') {
        return;
      }
      else if (format === 'image') formattedText = `![${selectedText}](https://exemple.com/image.jpg)`;
      else if (format === 'quote') formattedText = `\n> ${selectedText}\n`;
      else if (format === 'list') {
        const lines = selectedText.split('\n');
        formattedText = '\n' + lines.map(line => `- ${line}`).join('\n') + '\n';
      }
      else if (format === 'numbered-list') {
        const lines = selectedText.split('\n');
        formattedText = '\n' + lines.map((line, index) => `${index + 1}. ${line}`).join('\n') + '\n';
      }
      
      const newText = before + formattedText + after;
      setText(newText);
      
      setTimeout(() => {
        textarea.focus();
        if (format === 'image') {
          const cursorPos = before.length + selectedText.length + 4;
          textarea.setSelectionRange(cursorPos, cursorPos + 28);
        } else {
          textarea.setSelectionRange(start, start + formattedText.length);
        }
      }, 0);
    }
  };

  const handleApplyLink = () => {
    const fieldType = activeTextarea.current;
    const { textarea, text, setText } = getTextAreaInfo(fieldType);
    
    if (!textarea) return;
    
    const start = selectedText.start;
    const end = selectedText.end;
    
    if (start === end) return;
    
    const before = text.substring(0, start);
    const after = text.substring(end);
    const linkMarkdown = `[${selectedText.text}](${linkUrl})`;
    
    const newText = before + linkMarkdown + after;
    setText(newText);
    
    setShowLinkPopover(false);
    setLinkUrl("https://");
    
    setTimeout(() => {
      textarea.focus();
    }, 0);
  };

  const FormatButtons = ({ fieldType }: { fieldType: 'details' | 'answer' | 'sources' }) => (
    <div className="flex flex-wrap gap-2 mb-2">
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={() => applyFormatting(fieldType, 'bold')}
        title="Gras"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={() => applyFormatting(fieldType, 'italic')}
        title="Italique"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={() => applyFormatting(fieldType, 'underline')}
        title="Souligné"
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Popover open={showLinkPopover} onOpenChange={setShowLinkPopover}>
        <PopoverTrigger asChild>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => applyFormatting(fieldType, 'link')}
            title="Lien"
            ref={linkButtonRef}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" side="top">
          <div className="p-4 space-y-2">
            <h4 className="font-medium">Ajouter un lien</h4>
            <p className="text-sm text-gray-500">Texte sélectionné: {selectedText.text}</p>
            <div className="flex gap-2">
              <Input 
                placeholder="https://exemple.com" 
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <Button onClick={handleApplyLink}>Appliquer</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={() => applyFormatting(fieldType, 'image')}
        title="Image"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={() => applyFormatting(fieldType, 'list')}
        title="Liste à puces"
      >
        <ListIcon className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={() => applyFormatting(fieldType, 'numbered-list')}
        title="Liste numérotée"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={() => applyFormatting(fieldType, 'quote')}
        title="Citation"
      >
        <Quote className="h-4 w-4" />
      </Button>
      <div className="text-xs text-gray-500 flex items-center ml-2">
        Formatage: **gras**, *italique*, __souligné__, [lien](url)
      </div>
    </div>
  );

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
                
                <FormItem>
                  <FormLabel>Détails (optionnel)</FormLabel>
                  <FormatButtons fieldType="details" />
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
                
                <FormItem>
                  <FormLabel>Sujets (séparés par des virgules)</FormLabel>
                  <FormControl>
                    <Input placeholder="SEO, Marketing, Référencement" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <div className="flex justify-between mt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      askForm.reset();
                      setTextDetails("");
                    }}
                  >
                    Annuler
                  </Button>
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
                
                <FormItem>
                  <FormLabel>Votre réponse</FormLabel>
                  <FormatButtons fieldType="answer" />
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
                  <FormatButtons fieldType="sources" />
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
                      answerForm.reset();
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default QuoraButton;
