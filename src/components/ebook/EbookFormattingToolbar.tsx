import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, Italic, Underline, Strikethrough, 
  List, ListOrdered, Quote, Heading1, Heading2, Minus
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FormattingToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  value: string;
  onChange: (value: string) => void;
}

export const EbookFormattingToolbar: React.FC<FormattingToolbarProps> = ({
  textareaRef,
  value,
  onChange
}) => {
  const wrapSelection = (before: string, after: string = before) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newText = value.substring(0, start) + text + value.substring(start);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const tools = [
    { icon: Bold, label: 'Gras (Ctrl+B)', action: () => wrapSelection('**'), shortcut: 'b' },
    { icon: Italic, label: 'Italique (Ctrl+I)', action: () => wrapSelection('*'), shortcut: 'i' },
    { icon: Underline, label: 'Souligné', action: () => wrapSelection('<u>', '</u>') },
    { icon: Strikethrough, label: 'Barré', action: () => wrapSelection('~~') },
    { type: 'separator' },
    { icon: Heading1, label: 'Titre 1', action: () => insertAtCursor('\n# ') },
    { icon: Heading2, label: 'Titre 2', action: () => insertAtCursor('\n## ') },
    { type: 'separator' },
    { icon: List, label: 'Liste à puces', action: () => insertAtCursor('\n- ') },
    { icon: ListOrdered, label: 'Liste numérotée', action: () => insertAtCursor('\n1. ') },
    { icon: Quote, label: 'Citation', action: () => wrapSelection('\n> ', '\n') },
    { type: 'separator' },
    { icon: Minus, label: 'Séparateur', action: () => insertAtCursor('\n\n---\n\n') },
  ];

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!textareaRef.current || document.activeElement !== textareaRef.current) return;
      
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'b') {
          e.preventDefault();
          wrapSelection('**');
        } else if (e.key === 'i') {
          e.preventDefault();
          wrapSelection('*');
        } else if (e.key === 'u') {
          e.preventDefault();
          wrapSelection('<u>', '</u>');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [value]);

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 p-2 bg-muted/50 rounded-t-md border border-b-0 border-border flex-wrap">
        {tools.map((tool, index) => {
          if (tool.type === 'separator') {
            return <div key={index} className="w-px h-6 bg-border mx-1" />;
          }
          
          const Icon = tool.icon!;
          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-primary/10"
                  onClick={tool.action}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
        
        <div className="ml-auto text-xs text-muted-foreground hidden sm:block">
          Markdown supporté • Ctrl+B gras • Ctrl+I italique
        </div>
      </div>
    </TooltipProvider>
  );
};
