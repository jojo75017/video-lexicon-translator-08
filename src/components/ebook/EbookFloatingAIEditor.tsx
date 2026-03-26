import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Maximize2, Minimize2, Sparkles, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface FloatingToolbarPosition {
  top: number;
  left: number;
}

interface EbookFloatingAIEditorProps {
  containerRef: React.RefObject<HTMLElement>;
  onReplaceText: (original: string, replacement: string) => void;
}

const AI_ACTIONS = [
  { id: 'reformulate', label: 'Reformuler', emoji: '🔄', prompt: 'Reformule ce texte en gardant le même sens mais avec un style différent et plus fluide.' },
  { id: 'extend', label: 'Allonger', emoji: '📝', prompt: 'Développe et allonge ce texte avec plus de détails, descriptions et nuances. Garde le même ton.' },
  { id: 'shorten', label: 'Raccourcir', emoji: '✂️', prompt: 'Raccourcis ce texte en gardant uniquement les idées essentielles. Sois concis et percutant.' },
  { id: 'formal', label: 'Ton formel', emoji: '🎩', prompt: 'Réécris ce texte dans un ton plus formel et professionnel.' },
  { id: 'casual', label: 'Ton décontracté', emoji: '😊', prompt: 'Réécris ce texte dans un ton plus décontracté et accessible.' },
  { id: 'dramatic', label: 'Dramatiser', emoji: '🎭', prompt: 'Réécris ce texte avec plus de tension dramatique et d\'émotion.' },
];

export const EbookFloatingAIEditor: React.FC<EbookFloatingAIEditorProps> = ({
  containerRef,
  onReplaceText,
}) => {
  const [selectedText, setSelectedText] = useState('');
  const [position, setPosition] = useState<FloatingToolbarPosition | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      // Don't hide if we have a result showing
      if (!result) {
        setPosition(null);
        setSelectedText('');
      }
      return;
    }

    const text = selection.toString().trim();
    if (text.length < 5) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Check if selection is within our container
    if (containerRef.current && !containerRef.current.contains(range.commonAncestorContainer)) {
      return;
    }

    setSelectedText(text);
    setResult(null);
    setPosition({
      top: rect.top - 50,
      left: rect.left + rect.width / 2,
    });
  }, [containerRef, result]);

  useEffect(() => {
    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, [handleSelection]);

  const handleAction = async (action: typeof AI_ACTIONS[0]) => {
    if (!selectedText) return;
    setIsProcessing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'floating-ai-edit',
          content: selectedText,
          instruction: action.prompt,
        },
      });

      if (error) throw error;
      const newText = data?.content || data?.result;
      if (!newText) throw new Error('Pas de résultat');
      
      setResult(newText);
    } catch (err: any) {
      console.error('Floating AI error:', err);
      toast.error('Erreur IA', { description: err.message || 'Réessayez' });
    } finally {
      setIsProcessing(false);
    }
  };

  const applyResult = () => {
    if (result && selectedText) {
      onReplaceText(selectedText, result);
      toast.success('Texte remplacé !');
      setPosition(null);
      setSelectedText('');
      setResult(null);
    }
  };

  const dismiss = () => {
    setPosition(null);
    setSelectedText('');
    setResult(null);
  };

  if (!position) return null;

  return (
    <div
      ref={toolbarRef}
      className="fixed z-[9999] animate-in fade-in slide-in-from-bottom-2 duration-200"
      style={{
        top: `${Math.max(10, position.top)}px`,
        left: `${Math.max(10, Math.min(position.left - 150, window.innerWidth - 320))}px`,
      }}
    >
      <div className="bg-popover border border-border rounded-xl shadow-xl p-2 min-w-[300px]">
        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-wrap mb-1">
          <Sparkles className="h-3.5 w-3.5 text-primary mr-1" />
          {AI_ACTIONS.map((action) => (
            <Button
              key={action.id}
              variant="ghost"
              size="sm"
              className="h-7 text-xs px-2 hover:bg-primary/10"
              onClick={() => handleAction(action)}
              disabled={isProcessing}
            >
              <span className="mr-1">{action.emoji}</span>
              {action.label}
            </Button>
          ))}
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 ml-auto" onClick={dismiss}>
            ✕
          </Button>
        </div>

        {/* Loading state */}
        {isProcessing && (
          <div className="flex items-center gap-2 px-2 py-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Transformation en cours...
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="border-t border-border pt-2 mt-1">
            <p className="text-xs text-muted-foreground mb-1 px-1">Résultat :</p>
            <div className="bg-muted/50 rounded-lg p-2 text-sm max-h-32 overflow-y-auto mb-2">
              {result}
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1 h-7 text-xs" onClick={applyResult}>
                ✓ Appliquer
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={dismiss}>
                Annuler
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EbookFloatingAIEditor;
