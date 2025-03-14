import { useState, useRef } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuoraFormData, quoraFormSchema } from './QuoraQuestionForm';
import { QuoraAnswerData, quoraAnswerSchema } from './QuoraAnswerForm';
import { toast } from "sonner";

export const useQuoraHooks = () => {
  const [activeTab, setActiveTab] = useState("ask");
  const [textDetails, setTextDetails] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [textSources, setTextSources] = useState("");
  const [selectedText, setSelectedText] = useState({ start: 0, end: 0, text: "" });
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");
  const [quoraProfile] = useState<string>("https://fr.quora.com/profile/Georges-Boubet");
  const [open, setOpen] = useState(false);

  const linkButtonRef = useRef<HTMLButtonElement>(null);
  const [activeTextareaType, setActiveTextareaType] = useState<'details' | 'answer' | 'sources'>('details');

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

  const handleQuoraSubmit = (data: QuoraFormData) => {
    data.details = textDetails;
    
    // Rediriger l'utilisateur vers sa page Quora pour publier
    const quoraUrl = "https://fr.quora.com/profile/Georges-Boubet";
    window.open(quoraUrl, '_blank');
    
    console.log("Question Quora:", data);
    toast.success(
      <div className="space-y-2">
        <p>Question préparée pour Quora !</p>
        <p className="text-sm">Vous êtes redirigé vers Quora. Copiez votre question et collez-la pour publication.</p>
      </div>
    );
    
    askForm.reset();
    setTextDetails("");
    setOpen(false);
  };

  const handleQuoraAnswerSubmit = (data: QuoraAnswerData) => {
    data.answer = textAnswer;
    data.sources = textSources;
    
    // Rediriger l'utilisateur vers sa page Quora pour publier
    const quoraUrl = "https://fr.quora.com/profile/Georges-Boubet";
    window.open(quoraUrl, '_blank');
    
    console.log("Réponse Quora:", data);
    toast.success(
      <div className="space-y-2">
        <p>Réponse préparée pour Quora !</p>
        <p className="text-sm">Vous êtes redirigé vers Quora. Copiez votre réponse et collez-la pour publication.</p>
      </div>
    );
    
    answerForm.reset();
    setTextAnswer("");
    setTextSources("");
    setOpen(false);
  };

  return {
    activeTab,
    setActiveTab,
    textDetails,
    setTextDetails,
    textAnswer,
    setTextAnswer,
    textSources,
    setTextSources,
    selectedText,
    setSelectedText,
    showLinkPopover,
    setShowLinkPopover,
    linkUrl,
    setLinkUrl,
    open,
    setOpen,
    linkButtonRef,
    activeTextareaType,
    setActiveTextareaType,
    askForm,
    answerForm,
    handleQuoraSubmit,
    handleQuoraAnswerSubmit
  };
};

export const useFormatting = (
  activeTextareaType: 'details' | 'answer' | 'sources',
  setActiveTextareaType: React.Dispatch<React.SetStateAction<'details' | 'answer' | 'sources'>>,
  selectedText: { start: number; end: number; text: string },
  setSelectedText: React.Dispatch<React.SetStateAction<{ start: number; end: number; text: string }>>,
  textDetails: string,
  setTextDetails: React.Dispatch<React.SetStateAction<string>>,
  textAnswer: string,
  setTextAnswer: React.Dispatch<React.SetStateAction<string>>,
  textSources: string,
  setTextSources: React.Dispatch<React.SetStateAction<string>>,
  linkUrl: string
) => {

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
    if (start !== end && selectedText.trim() !== '') {
      console.log(`Text selected in ${fieldType}: "${selectedText}" (${start}:${end})`);
      setSelectedText({ start, end, text: selectedText });
      setActiveTextareaType(fieldType);
    }
  };

  const applyFormatting = (fieldType: 'details' | 'answer' | 'sources', format: 'bold' | 'italic' | 'underline' | 'link' | 'image' | 'list' | 'numbered-list' | 'quote') => {
    const { text, setText } = getTextAreaInfo(fieldType);
    
    // Check if we should show link popover
    if (format === 'link') {
      // Only show link popover if text is selected
      if (selectedText.start !== selectedText.end && selectedText.text.trim().length > 0) {
        console.log("Opening link popover for text:", selectedText.text);
        return true; // Signal to show link popover
      } else {
        // No text selected, show a toast message
        toast.warning("Veuillez d'abord sélectionner le texte à transformer en lien affilié.");
        return false;
      }
    }
    
    if (selectedText.start === selectedText.end) {
      let formattedTemplate = '';
      if (format === 'bold') formattedTemplate = '**texte en gras**';
      else if (format === 'italic') formattedTemplate = '*texte en italique*';
      else if (format === 'underline') formattedTemplate = '__texte souligné__';
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
    
    return false; // No need to show link popover
  };

  const handleApplyLink = (currentLinkUrl: string) => {
    if (!selectedText.text || selectedText.start === selectedText.end) {
      toast.error("Aucun texte sélectionné pour le lien affilié");
      return;
    }
    
    const fieldType = activeTextareaType;
    const { text, setText } = getTextAreaInfo(fieldType);
    
    if (text.length > 0) {
      const before = text.substring(0, selectedText.start);
      const after = text.substring(selectedText.end);
      
      // Create markdown link format
      const linkMarkdown = `[${selectedText.text}](${currentLinkUrl})`;
      
      const newText = before + linkMarkdown + after;
      setText(newText);
      
      toast.success("Lien affilié ajouté avec succès !");
    } else {
      toast.error("Impossible d'ajouter un lien à un texte vide");
    }
  };

  return {
    getTextAreaInfo,
    handleTextSelection,
    applyFormatting,
    handleApplyLink
  };
};
