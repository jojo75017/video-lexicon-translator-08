
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquareText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuoraLinkPopover from './QuoraLinkPopover';
import QuoraQuestionForm, { QuoraFormData, quoraFormSchema } from './QuoraQuestionForm';
import QuoraAnswerForm, { QuoraAnswerData, quoraAnswerSchema } from './QuoraAnswerForm';

export const QuoraButton = () => {
  const [activeTab, setActiveTab] = useState("ask");
  const [textDetails, setTextDetails] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [textSources, setTextSources] = useState("");
  const [selectedText, setSelectedText] = useState({ start: 0, end: 0, text: "" });
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");
  const [quoraProfile, setQuoraProfile] = useState<string>("https://fr.quora.com/profile/Georges-Boubet");

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
    
    // Rediriger l'utilisateur vers sa page Quora pour publier
    window.open(quoraProfile, '_blank');
    
    console.log("Question Quora:", data);
    toast.success(
      <div className="space-y-2">
        <p>Question préparée pour Quora !</p>
        <p className="text-sm">Vous êtes redirigé vers votre profil Quora. Copiez votre question et collez-la pour publication.</p>
      </div>
    );
    
    askForm.reset();
    setTextDetails("");
  };

  const handleQuoraAnswerSubmit = (data: QuoraAnswerData) => {
    data.answer = textAnswer;
    data.sources = textSources;
    
    // Rediriger l'utilisateur vers sa page Quora pour publier
    window.open(quoraProfile, '_blank');
    
    console.log("Réponse Quora:", data);
    toast.success(
      <div className="space-y-2">
        <p>Réponse préparée pour Quora !</p>
        <p className="text-sm">Vous êtes redirigé vers votre profil Quora. Copiez votre réponse et collez-la pour publication.</p>
      </div>
    );
    
    answerForm.reset();
    setTextAnswer("");
    setTextSources("");
  };

  const getTextAreaInfo = (fieldType: 'details' | 'answer' | 'sources') => {
    let text = '';
    let setText: React.Dispatch<React.SetStateAction<string>> = () => {};

    if (fieldType === 'details') {
      text = textDetails;
      setText = setTextDetails;
    } else if (fieldType === 'answer') {
      text = textAnswer;
      setText = setTextAnswer;
    } else {
      text = textSources;
      setText = setTextSources;
    }

    return { text, setText };
  };

  const handleTextSelection = (fieldType: 'details' | 'answer' | 'sources', start: number, end: number, selectedText: string) => {
    setSelectedText({ start, end, text: selectedText });
    activeTextarea.current = fieldType;
  };

  const applyFormatting = (fieldType: 'details' | 'answer' | 'sources', format: 'bold' | 'italic' | 'underline' | 'link' | 'image' | 'list' | 'numbered-list' | 'quote') => {
    const { text, setText } = getTextAreaInfo(fieldType);
    
    if (format === 'link') {
      if (selectedText.start !== selectedText.end) {
        setShowLinkPopover(true);
        return;
      }
    }
    
    if (selectedText.start === selectedText.end) {
      let formattedTemplate = '';
      if (format === 'bold') formattedTemplate = '**texte en gras**';
      else if (format === 'italic') formattedTemplate = '*texte en italique*';
      else if (format === 'underline') formattedTemplate = '__texte souligné__';
      else if (format === 'link') formattedTemplate = '[texte du lien](https://exemple.com)';
      else if (format === 'image') formattedTemplate = '![description de l\'image](https://exemple.com/image.jpg)';
      else if (format === 'list') formattedTemplate = '\n- Élément de liste\n- Élément de liste\n- Élément de liste\n';
      else if (format === 'numbered-list') formattedTemplate = '\n1. Premier élément\n2. Deuxième élément\n3. Troisième élément\n';
      else if (format === 'quote') formattedTemplate = '\n> Votre citation ici\n';
      
      const newText = text.substring(0, selectedText.start) + formattedTemplate + text.substring(selectedText.end);
      setText(newText);
    } else {
      let before = text.substring(0, selectedText.start);
      let after = text.substring(selectedText.end);
      let formattedText = '';
      
      if (format === 'bold') formattedText = `**${selectedText.text}**`;
      else if (format === 'italic') formattedText = `*${selectedText.text}*`;
      else if (format === 'underline') formattedText = `__${selectedText.text}__`;
      else if (format === 'link') {
        return;
      }
      else if (format === 'image') formattedText = `![${selectedText.text}](https://exemple.com/image.jpg)`;
      else if (format === 'quote') formattedText = `\n> ${selectedText.text}\n`;
      else if (format === 'list') {
        const lines = selectedText.text.split('\n');
        formattedText = '\n' + lines.map(line => `- ${line}`).join('\n') + '\n';
      }
      else if (format === 'numbered-list') {
        const lines = selectedText.text.split('\n');
        formattedText = '\n' + lines.map((line, index) => `${index + 1}. ${line}`).join('\n') + '\n';
      }
      
      const newText = before + formattedText + after;
      setText(newText);
    }
  };

  const handleApplyLink = () => {
    const fieldType = activeTextarea.current;
    const { text, setText } = getTextAreaInfo(fieldType);
    
    if (selectedText.start === selectedText.end) return;
    
    const before = text.substring(0, selectedText.start);
    const after = text.substring(selectedText.end);
    const linkMarkdown = `[${selectedText.text}](${linkUrl})`;
    
    const newText = before + linkMarkdown + after;
    setText(newText);
    
    setShowLinkPopover(false);
    setLinkUrl("https://");
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
            <QuoraQuestionForm
              form={askForm}
              textDetails={textDetails}
              setTextDetails={setTextDetails}
              handleTextSelection={handleTextSelection}
              applyFormatting={applyFormatting}
              onSubmit={handleQuoraSubmit}
            />
          </TabsContent>
          
          <TabsContent value="answer" className="space-y-4">
            <QuoraAnswerForm
              form={answerForm}
              popularQuestions={popularQuestions}
              textAnswer={textAnswer}
              setTextAnswer={setTextAnswer}
              textSources={textSources}
              setTextSources={setTextSources}
              handleTextSelection={handleTextSelection}
              applyFormatting={applyFormatting}
              onSubmit={handleQuoraAnswerSubmit}
            />
          </TabsContent>
        </Tabs>
        
        {/* This is a shared popover that appears when needed */}
        {showLinkPopover && (
          <QuoraLinkPopover
            open={showLinkPopover}
            onOpenChange={setShowLinkPopover}
            linkUrl={linkUrl}
            setLinkUrl={setLinkUrl}
            selectedText={selectedText}
            onApplyLink={handleApplyLink}
            triggerRef={linkButtonRef}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuoraButton;
