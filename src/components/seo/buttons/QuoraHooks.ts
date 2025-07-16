
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const useQuoraHooks = () => {
  const [activeTab, setActiveTab] = useState('ask');
  const [textDetails, setTextDetails] = useState('');
  const [textAnswer, setTextAnswer] = useState('');
  const [textSources, setTextSources] = useState('');
  const [selectedText, setSelectedText] = useState({ start: 0, end: 0, text: '' });
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const [linkUrl, setLinkUrl] = useState('https://');
  const [open, setOpen] = useState(false);
  const linkButtonRef = useRef(null);
  const [activeTextareaType, setActiveTextareaType] = useState<'details' | 'answer' | 'sources' | null>(null);

  const askForm = useForm();
  const answerForm = useForm();

  const handleQuoraSubmit = (data: any) => {
    toast.success('Question soumise avec succès');
    console.log('Question data:', data);
  };

  const handleQuoraAnswerSubmit = (data: any) => {
    toast.success('Réponse soumise avec succès');
    console.log('Answer data:', data);
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
  activeTextareaType: 'details' | 'answer' | 'sources' | null,
  setActiveTextareaType: React.Dispatch<React.SetStateAction<'details' | 'answer' | 'sources' | null>>,
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
  const handleTextSelection = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start !== end) {
      const selectedText = textarea.value.substring(start, end);
      setSelectedText({ start, end, text: selectedText });

      // Set active textarea type based on the id of the textarea
      const textareaId = textarea.id;
      if (textareaId.includes('details')) {
        setActiveTextareaType('details');
      } else if (textareaId.includes('answer')) {
        setActiveTextareaType('answer');
      } else if (textareaId.includes('sources')) {
        setActiveTextareaType('sources');
      }
    }
  };

  const applyFormatting = (fieldType: 'details' | 'answer' | 'sources', format: 'bold' | 'italic' | 'underline' | 'link' | 'image' | 'list' | 'numbered-list' | 'quote') => {
    if (fieldType !== activeTextareaType) {
      return false;
    }

    let text: string;
    let setText: React.Dispatch<React.SetStateAction<string>>;

    switch (fieldType) {
      case 'details':
        text = textDetails;
        setText = setTextDetails;
        break;
      case 'answer':
        text = textAnswer;
        setText = setTextAnswer;
        break;
      case 'sources':
        text = textSources;
        setText = setTextSources;
        break;
      default:
        return false;
    }

    const { start, end } = selectedText;
    if (start === end) return false;

    const selectedContent = text.substring(start, end);
    let formattedText = '';

    switch (format) {
      case 'bold':
        formattedText = `**${selectedContent}**`;
        break;
      case 'italic':
        formattedText = `*${selectedContent}*`;
        break;
      case 'underline':
        formattedText = `__${selectedContent}__`;
        break;
      case 'link':
        return true; // Will show link popover
      case 'image':
        formattedText = `![${selectedContent}](image-url)`;
        break;
      case 'list':
        formattedText = selectedContent
          .split('\n')
          .map(line => `- ${line}`)
          .join('\n');
        break;
      case 'numbered-list':
        formattedText = selectedContent
          .split('\n')
          .map((line, i) => `${i + 1}. ${line}`)
          .join('\n');
        break;
      case 'quote':
        formattedText = selectedContent
          .split('\n')
          .map(line => `> ${line}`)
          .join('\n');
        break;
      default:
        return false;
    }

    const newText = text.substring(0, start) + formattedText + text.substring(end);
    setText(newText);
    return false;
  };

  const handleApplyLink = (url: string) => {
    if (!activeTextareaType) return;

    let text: string;
    let setText: React.Dispatch<React.SetStateAction<string>>;

    switch (activeTextareaType) {
      case 'details':
        text = textDetails;
        setText = setTextDetails;
        break;
      case 'answer':
        text = textAnswer;
        setText = setTextAnswer;
        break;
      case 'sources':
        text = textSources;
        setText = setTextSources;
        break;
      default:
        return;
    }

    const { start, end } = selectedText;
    if (start === end) return;

    const selectedContent = text.substring(start, end);
    const markdownLink = `[${selectedContent}](${url})`;
    const newText = text.substring(0, start) + markdownLink + text.substring(end);
    setText(newText);
  };

  return {
    handleTextSelection,
    applyFormatting,
    handleApplyLink
  };
};
