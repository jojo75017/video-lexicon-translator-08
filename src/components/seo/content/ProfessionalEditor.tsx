
import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Link, List, ListOrdered, Heading1, Heading2, Heading3, 
  AlignLeft, AlignCenter, AlignRight, Image, Quote, Code, 
  Type, Palette, Highlighter, Undo, Redo } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

type FormatAction = 'bold' | 'italic' | 'underline' | 'link' | 'ul' | 'ol' | 'h1' | 'h2' | 'h3' |
  'alignLeft' | 'alignCenter' | 'alignRight' | 'image' | 'quote' | 'code' | 'color' | 'highlight';

const ProfessionalEditor: React.FC<EditorProps> = ({ value, onChange, placeholder = "Commencez à rédiger...", height = "300px" }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('https://');
  const [isColorPopoverOpen, setIsColorPopoverOpen] = useState(false);
  const [isHighlightPopoverOpen, setIsHighlightPopoverOpen] = useState(false);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [editorState, setEditorState] = useState(value);
  const [isImagePopoverOpen, setIsImagePopoverOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  // Initialiser l'éditeur avec le contenu HTML
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  // Mettre à jour l'état interne et déclencher onChange quand le contenu change
  const updateContent = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setEditorState(newContent);
      onChange(newContent);
      
      // Mettre à jour l'historique pour undo/redo
      setUndoStack(prev => [...prev, editorState]);
      setRedoStack([]);
    }
  };

  // Appliquer le formatage au texte sélectionné
  const applyFormat = (action: FormatAction) => {
    // Sauvegarder l'état actuel pour l'historique
    if (editorRef.current) {
      const currentContent = editorRef.current.innerHTML;
      if (currentContent !== editorState) {
        setUndoStack(prev => [...prev, editorState]);
        setEditorState(currentContent);
      }
    }

    // Exécuter la commande d'édition appropriée
    switch (action) {
      case 'bold':
        document.execCommand('bold', false);
        break;
      case 'italic':
        document.execCommand('italic', false);
        break;
      case 'underline':
        document.execCommand('underline', false);
        break;
      case 'link':
        setIsLinkPopoverOpen(true);
        return; // Retourner tôt pour ne pas appeler updateContent
      case 'ul':
        document.execCommand('insertUnorderedList', false);
        break;
      case 'ol':
        document.execCommand('insertOrderedList', false);
        break;
      case 'h1':
        // Remplacer le paragraphe sélectionné par un H1
        document.execCommand('formatBlock', false, '<h1>');
        break;
      case 'h2':
        document.execCommand('formatBlock', false, '<h2>');
        break;
      case 'h3':
        document.execCommand('formatBlock', false, '<h3>');
        break;
      case 'alignLeft':
        document.execCommand('justifyLeft', false);
        break;
      case 'alignCenter':
        document.execCommand('justifyCenter', false);
        break;
      case 'alignRight':
        document.execCommand('justifyRight', false);
        break;
      case 'image':
        setIsImagePopoverOpen(true);
        return;
      case 'quote':
        document.execCommand('formatBlock', false, '<blockquote>');
        break;
      case 'code':
        document.execCommand('formatBlock', false, '<pre>');
        break;
      case 'color':
        setIsColorPopoverOpen(true);
        return;
      case 'highlight':
        setIsHighlightPopoverOpen(true);
        return;
    }

    updateContent();
  };

  // Appliquer un lien au texte sélectionné
  const applyLink = () => {
    if (linkUrl) {
      document.execCommand('createLink', false, linkUrl);
      setIsLinkPopoverOpen(false);
      setLinkUrl('https://');
      updateContent();
    }
  };

  // Insérer une image
  const insertImage = () => {
    if (imageUrl) {
      document.execCommand('insertHTML', false, `<img src="${imageUrl}" alt="Image" class="max-w-full h-auto my-2" />`);
      setIsImagePopoverOpen(false);
      setImageUrl('');
      updateContent();
    }
  };

  // Appliquer une couleur au texte
  const applyColor = (color: string) => {
    document.execCommand('foreColor', false, color);
    setIsColorPopoverOpen(false);
    updateContent();
  };

  // Appliquer une couleur de surlignage
  const applyHighlight = (color: string) => {
    document.execCommand('hiliteColor', false, color);
    setIsHighlightPopoverOpen(false);
    updateContent();
  };

  // Fonctions Undo/Redo
  const handleUndo = () => {
    if (undoStack.length > 0) {
      const prevState = undoStack[undoStack.length - 1];
      const newUndoStack = undoStack.slice(0, -1);
      
      setRedoStack([...redoStack, editorState]);
      setEditorState(prevState);
      setUndoStack(newUndoStack);
      
      if (editorRef.current) {
        editorRef.current.innerHTML = prevState;
        onChange(prevState);
      }
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      const newRedoStack = redoStack.slice(0, -1);
      
      setUndoStack([...undoStack, editorState]);
      setEditorState(nextState);
      setRedoStack(newRedoStack);
      
      if (editorRef.current) {
        editorRef.current.innerHTML = nextState;
        onChange(nextState);
      }
    }
  };

  // Gérer les raccourcis clavier (Ctrl+B, Ctrl+I, etc.)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          applyFormat('bold');
          break;
        case 'i':
          e.preventDefault();
          applyFormat('italic');
          break;
        case 'u':
          e.preventDefault();
          applyFormat('underline');
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
          break;
        case 'y':
          e.preventDefault();
          handleRedo();
          break;
      }
    }
  };

  // Palette de couleurs
  const colors = [
    '#1e293b', '#ef4444', '#f97316', '#f59e0b', '#84cc16',
    '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef'
  ];

  // Palette de couleurs de surlignage
  const highlightColors = [
    '#fef3c7', '#fce7f3', '#dbeafe', '#f3e8ff', '#dcfce7',
    '#ffedd5', '#ecfccb', '#cffafe', '#f8fafc', '#ffe4e6'
  ];

  return (
    <div className="border rounded-md overflow-hidden bg-white shadow-sm">
      <div className="bg-gray-50 border-b p-2 flex flex-wrap items-center gap-1">
        <TooltipProvider>
          {/* Groupe Formatage de texte */}
          <ToolButton onClick={() => applyFormat('bold')} tooltip="Gras (Ctrl+B)">
            <Bold className="h-4 w-4" />
          </ToolButton>
          <ToolButton onClick={() => applyFormat('italic')} tooltip="Italique (Ctrl+I)">
            <Italic className="h-4 w-4" />
          </ToolButton>
          <ToolButton onClick={() => applyFormat('underline')} tooltip="Souligné (Ctrl+U)">
            <Underline className="h-4 w-4" />
          </ToolButton>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Groupe Titres */}
          <ToolButton onClick={() => applyFormat('h1')} tooltip="Titre 1">
            <Heading1 className="h-4 w-4" />
          </ToolButton>
          <ToolButton onClick={() => applyFormat('h2')} tooltip="Titre 2">
            <Heading2 className="h-4 w-4" />
          </ToolButton>
          <ToolButton onClick={() => applyFormat('h3')} tooltip="Titre 3">
            <Heading3 className="h-4 w-4" />
          </ToolButton>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Groupe Alignement */}
          <ToolButton onClick={() => applyFormat('alignLeft')} tooltip="Aligner à gauche">
            <AlignLeft className="h-4 w-4" />
          </ToolButton>
          <ToolButton onClick={() => applyFormat('alignCenter')} tooltip="Centrer">
            <AlignCenter className="h-4 w-4" />
          </ToolButton>
          <ToolButton onClick={() => applyFormat('alignRight')} tooltip="Aligner à droite">
            <AlignRight className="h-4 w-4" />
          </ToolButton>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Groupe Listes */}
          <ToolButton onClick={() => applyFormat('ul')} tooltip="Liste à puces">
            <List className="h-4 w-4" />
          </ToolButton>
          <ToolButton onClick={() => applyFormat('ol')} tooltip="Liste numérotée">
            <ListOrdered className="h-4 w-4" />
          </ToolButton>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Groupe Éléments avancés */}
          <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
            <PopoverTrigger asChild>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Link className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Insérer un lien</TooltipContent>
              </Tooltip>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <p className="text-sm">URL du lien:</p>
                <div className="flex gap-2">
                  <Input 
                    value={linkUrl} 
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                  <Button size="sm" onClick={applyLink}>Appliquer</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={isImagePopoverOpen} onOpenChange={setIsImagePopoverOpen}>
            <PopoverTrigger asChild>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Image className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Insérer une image</TooltipContent>
              </Tooltip>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <p className="text-sm">URL de l'image:</p>
                <div className="flex gap-2">
                  <Input 
                    value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button size="sm" onClick={insertImage}>Insérer</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <ToolButton onClick={() => applyFormat('quote')} tooltip="Citation">
            <Quote className="h-4 w-4" />
          </ToolButton>
          <ToolButton onClick={() => applyFormat('code')} tooltip="Bloc de code">
            <Code className="h-4 w-4" />
          </ToolButton>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Groupe Couleurs */}
          <Popover open={isColorPopoverOpen} onOpenChange={setIsColorPopoverOpen}>
            <PopoverTrigger asChild>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Type className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Couleur de texte</TooltipContent>
              </Tooltip>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <div className="grid grid-cols-5 gap-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => applyColor(color)}
                    className="w-6 h-6 rounded-full border border-gray-200 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={isHighlightPopoverOpen} onOpenChange={setIsHighlightPopoverOpen}>
            <PopoverTrigger asChild>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Highlighter className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Surlignage</TooltipContent>
              </Tooltip>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <div className="grid grid-cols-5 gap-1">
                {highlightColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => applyHighlight(color)}
                    className="w-6 h-6 rounded-full border border-gray-200 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Undo/Redo */}
          <ToolButton 
            onClick={handleUndo} 
            tooltip="Annuler (Ctrl+Z)"
            disabled={undoStack.length === 0}
          >
            <Undo className="h-4 w-4" />
          </ToolButton>
          <ToolButton 
            onClick={handleRedo} 
            tooltip="Rétablir (Ctrl+Y)"
            disabled={redoStack.length === 0}
          >
            <Redo className="h-4 w-4" />
          </ToolButton>
        </TooltipProvider>
      </div>

      <div 
        ref={editorRef}
        className="p-4 focus:outline-none min-h-[100px] prose max-w-none w-full"
        contentEditable
        onInput={updateContent}
        onKeyDown={handleKeyDown}
        onBlur={updateContent}
        style={{ height, overflowY: 'auto' }}
        dangerouslySetInnerHTML={{ __html: value || placeholder }}
      />
    </div>
  );
};

// Composant auxiliaire pour les boutons d'outils avec tooltip
const ToolButton = ({ 
  onClick, 
  tooltip, 
  children, 
  disabled = false 
}: { 
  onClick: () => void;
  tooltip: string;
  children: React.ReactNode;
  disabled?: boolean;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8" 
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
};

export default ProfessionalEditor;
