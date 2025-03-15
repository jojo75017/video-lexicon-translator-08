
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Plus, Heading1, Heading2, Heading3, Heading4, ListOrdered, List, 
  Image as ImageIcon, Quote, AlignJustify, AlignLeft, Bold, Italic, Underline, 
  Link as LinkIcon, Palette, AlignCenter, AlignRight 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";

interface Block {
  id: string;
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'unordered-list' | 'ordered-list' | 'image' | 'quote';
  content: string;
}

interface GutenbergEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const TEXT_COLORS = {
  default: { name: "Défaut", class: "" },
  black: { name: "Noir", class: "text-black" },
  gray: { name: "Gris", class: "text-gray-500" },
  red: { name: "Rouge", class: "text-red-500" },
  orange: { name: "Orange", class: "text-orange-500" },
  yellow: { name: "Jaune", class: "text-yellow-500" },
  green: { name: "Vert", class: "text-green-500" },
  blue: { name: "Bleu", class: "text-blue-500" },
  purple: { name: "Violet", class: "text-purple-500" },
  pink: { name: "Rose", class: "text-pink-500" },
};

const HIGHLIGHT_COLORS = {
  default: { name: "Aucun", class: "" },
  yellow: { name: "Jaune", class: "bg-yellow-100" },
  green: { name: "Vert", class: "bg-green-100" },
  blue: { name: "Bleu", class: "bg-blue-100" },
  purple: { name: "Violet", class: "bg-purple-100" },
  pink: { name: "Rose", class: "bg-pink-100" },
  gray: { name: "Gris", class: "bg-gray-100" },
};

const GutenbergEditor: React.FC<GutenbergEditorProps> = ({ value, onChange }) => {
  const [blocks, setBlocks] = useState<Block[]>(() => {
    if (!value || value.trim() === '') {
      return [{ id: generateId(), type: 'paragraph', content: '' }];
    }
    
    try {
      // Tenter de parser si c'est du JSON
      const parsedBlocks = JSON.parse(value);
      // Vérifier que les types sont valides
      if (Array.isArray(parsedBlocks)) {
        const validBlocks = parsedBlocks.filter(block => 
          isValidBlockType(block.type)
        ).map(block => ({
          id: block.id || generateId(),
          type: block.type as Block['type'],
          content: block.content || ''
        }));
        
        return validBlocks.length > 0 ? validBlocks : [{ id: generateId(), type: 'paragraph', content: '' }];
      }
      return [{ id: generateId(), type: 'paragraph', content: '' }];
    } catch {
      // Sinon, considérer comme du texte simple et convertir en bloc paragraphe
      return [{ id: generateId(), type: 'paragraph', content: value }];
    }
  });
  
  const [activeBlock, setActiveBlock] = useState<string | null>(blocks[0]?.id || null);
  const [showBlockSelector, setShowBlockSelector] = useState<string | null>(null);

  // Valider les types de blocs
  function isValidBlockType(type: string): boolean {
    return ['paragraph', 'heading1', 'heading2', 'heading3', 'heading4', 
            'unordered-list', 'ordered-list', 'image', 'quote'].includes(type);
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  const updateBlockContent = (id: string, content: string) => {
    const updatedBlocks = blocks.map(block => 
      block.id === id ? { ...block, content } : block
    );
    setBlocks(updatedBlocks);
    updateParentContent(updatedBlocks);
  };

  const addBlock = (type: Block['type'], afterId: string) => {
    const index = blocks.findIndex(block => block.id === afterId);
    const newBlock = { id: generateId(), type, content: '' };
    const updatedBlocks = [
      ...blocks.slice(0, index + 1),
      newBlock,
      ...blocks.slice(index + 1)
    ];
    setBlocks(updatedBlocks);
    setActiveBlock(newBlock.id);
    setShowBlockSelector(null);
    updateParentContent(updatedBlocks);
  };

  const removeBlock = (id: string) => {
    if (blocks.length <= 1) {
      // Toujours garder au moins un bloc
      const resetBlocks = [{ id: generateId(), type: 'paragraph', content: '' }];
      setBlocks(resetBlocks);
      setActiveBlock(resetBlocks[0].id);
      updateParentContent(resetBlocks);
      return;
    }
    
    const index = blocks.findIndex(block => block.id === id);
    const updatedBlocks = blocks.filter(block => block.id !== id);
    setBlocks(updatedBlocks);
    
    // Sélectionner le bloc précédent ou suivant
    const newActiveIndex = Math.min(index, updatedBlocks.length - 1);
    setActiveBlock(updatedBlocks[newActiveIndex]?.id || null);
    updateParentContent(updatedBlocks);
  };

  const updateBlockType = (id: string, newType: Block['type']) => {
    const updatedBlocks = blocks.map(block => 
      block.id === id ? { ...block, type: newType } : block
    );
    setBlocks(updatedBlocks);
    updateParentContent(updatedBlocks);
  };

  const updateParentContent = (currentBlocks: Block[]) => {
    // Convertir les blocs en HTML
    const htmlContent = currentBlocks.map(block => {
      switch (block.type) {
        case 'heading1':
          return `<h1>${block.content}</h1>`;
        case 'heading2':
          return `<h2>${block.content}</h2>`;
        case 'heading3':
          return `<h3>${block.content}</h3>`;
        case 'heading4':
          return `<h4>${block.content}</h4>`;
        case 'unordered-list':
          return `<ul><li>${block.content.split('\n').join('</li><li>')}</li></ul>`;
        case 'ordered-list':
          return `<ol><li>${block.content.split('\n').join('</li><li>')}</li></ol>`;
        case 'quote':
          return `<blockquote>${block.content}</blockquote>`;
        case 'image':
          return `<figure><img src="${block.content}" alt="Image" /></figure>`;
        case 'paragraph':
        default:
          return `<p>${block.content}</p>`;
      }
    }).join('\n\n');
    
    onChange(htmlContent);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, id: string) => {
    // Ajouter un nouveau paragraphe sur Entrée
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addBlock('paragraph', id);
    }
  };

  // Fonctions pour le formatage du texte
  const applyFormat = (format: string, blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    const textarea = document.querySelector(`#block-${blockId}`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let newContent = '';
    let newCursorPos = 0;

    switch (format) {
      case 'bold':
        newContent = textarea.value.substring(0, start) + `**${selectedText}**` + textarea.value.substring(end);
        newCursorPos = end + 4;
        break;
      case 'italic':
        newContent = textarea.value.substring(0, start) + `*${selectedText}*` + textarea.value.substring(end);
        newCursorPos = end + 2;
        break;
      case 'underline':
        newContent = textarea.value.substring(0, start) + `<u>${selectedText}</u>` + textarea.value.substring(end);
        newCursorPos = end + 7;
        break;
      case 'link':
        newContent = textarea.value.substring(0, start) + `[${selectedText}](url)` + textarea.value.substring(end);
        newCursorPos = end + 7;
        break;
      default:
        return;
    }

    updateBlockContent(blockId, newContent);
    
    // Remettre le focus et la sélection après l'update du contenu
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start, newCursorPos);
      } else {
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const applyTextColor = (blockId: string, colorClass: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    const textarea = document.querySelector(`#block-${blockId}`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    if (!selectedText) return;
    
    const newContent = textarea.value.substring(0, start) + 
      `<span class="${colorClass}">${selectedText}</span>` + 
      textarea.value.substring(end);
    
    updateBlockContent(blockId, newContent);
  };

  const applyHighlightColor = (blockId: string, colorClass: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    const textarea = document.querySelector(`#block-${blockId}`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    if (!selectedText) return;
    
    const newContent = textarea.value.substring(0, start) + 
      `<span class="${colorClass}">${selectedText}</span>` + 
      textarea.value.substring(end);
    
    updateBlockContent(blockId, newContent);
  };

  return (
    <div className="gutenberg-editor border rounded-md">
      {blocks.map((block, index) => (
        <div 
          key={block.id}
          className={`block-wrapper p-3 border-b ${activeBlock === block.id ? 'bg-gray-50' : ''}`}
          onClick={() => setActiveBlock(block.id)}
        >
          <div className="flex items-center gap-2 mb-2">
            <BlockTypeIcon type={block.type} />
            <div className="text-xs text-gray-500 flex-1">
              {getBlockTypeName(block.type)}
            </div>
            <div className="flex gap-1">
              <Button 
                type="button" 
                size="sm" 
                variant="ghost" 
                className="h-7 w-7 p-0" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBlockSelector(showBlockSelector === block.id ? null : block.id);
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
              {blocks.length > 1 && (
                <Button 
                  type="button" 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 w-7 p-0 text-red-500" 
                  onClick={() => removeBlock(block.id)}
                >
                  ×
                </Button>
              )}
            </div>
          </div>

          {activeBlock === block.id && (
            <div className="formatting-toolbar flex flex-wrap gap-1 mb-2 p-1 bg-gray-100 rounded-md">
              <Button 
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => applyFormat('bold', block.id)}
                title="Gras"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button 
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => applyFormat('italic', block.id)}
                title="Italique"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button 
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => applyFormat('underline', block.id)}
                title="Souligné"
              >
                <Underline className="h-4 w-4" />
              </Button>
              <Button 
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => applyFormat('link', block.id)}
                title="Lien"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title="Couleur du texte"
                  >
                    <Palette className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  {Object.entries(TEXT_COLORS).map(([key, value]) => (
                    <DropdownMenuItem
                      key={`text-${key}`}
                      onClick={() => applyTextColor(block.id, value.class)}
                      className="flex items-center gap-2"
                    >
                      <div className={`w-4 h-4 rounded-full ${value.class || 'bg-black'}`} />
                      <span>{value.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm" 
                    className="h-8 w-8 p-0"
                    title="Surlignage"
                  >
                    <span className="flex items-center justify-center w-4 h-4 bg-yellow-200">A</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  {Object.entries(HIGHLIGHT_COLORS).map(([key, value]) => (
                    <DropdownMenuItem
                      key={`highlight-${key}`}
                      onClick={() => applyHighlightColor(block.id, value.class)}
                      className="flex items-center gap-2"
                    >
                      <div className={`w-4 h-4 rounded-full ${value.class || 'bg-transparent border border-gray-300'}`} />
                      <span>{value.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="border-l border-gray-300 mx-1"></div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    title="Type de bloc"
                  >
                    <BlockTypeIcon type={block.type} />
                    <span className="text-xs ml-1">{getBlockTypeShortName(block.type)}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  <DropdownMenuItem onClick={() => updateBlockType(block.id, 'paragraph')}>
                    <AlignJustify className="h-4 w-4 mr-2" />
                    <span>Paragraphe</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateBlockType(block.id, 'heading1')}>
                    <Heading1 className="h-4 w-4 mr-2" />
                    <span>Titre H1</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateBlockType(block.id, 'heading2')}>
                    <Heading2 className="h-4 w-4 mr-2" />
                    <span>Titre H2</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateBlockType(block.id, 'heading3')}>
                    <Heading3 className="h-4 w-4 mr-2" />
                    <span>Titre H3</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateBlockType(block.id, 'heading4')}>
                    <Heading4 className="h-4 w-4 mr-2" />
                    <span>Titre H4</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateBlockType(block.id, 'unordered-list')}>
                    <List className="h-4 w-4 mr-2" />
                    <span>Liste à puces</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateBlockType(block.id, 'ordered-list')}>
                    <ListOrdered className="h-4 w-4 mr-2" />
                    <span>Liste numérotée</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateBlockType(block.id, 'quote')}>
                    <Quote className="h-4 w-4 mr-2" />
                    <span>Citation</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="border-l border-gray-300 mx-1"></div>
              
              <Button 
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Aligner à gauche"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button 
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Centrer"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button 
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Aligner à droite"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {showBlockSelector === block.id && (
            <div className="block-selector bg-white shadow-lg border rounded-md p-2 mb-3">
              <Tabs defaultValue="text">
                <TabsList className="w-full">
                  <TabsTrigger value="text" className="flex-1">Texte</TabsTrigger>
                  <TabsTrigger value="list" className="flex-1">Listes</TabsTrigger>
                  <TabsTrigger value="media" className="flex-1">Média</TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="flex flex-wrap gap-2 mt-2">
                  <BlockButton icon={<AlignJustify className="h-4 w-4" />} label="Paragraphe" onClick={() => addBlock('paragraph', block.id)} />
                  <BlockButton icon={<Heading1 className="h-4 w-4" />} label="Titre H1" onClick={() => addBlock('heading1', block.id)} />
                  <BlockButton icon={<Heading2 className="h-4 w-4" />} label="Titre H2" onClick={() => addBlock('heading2', block.id)} />
                  <BlockButton icon={<Heading3 className="h-4 w-4" />} label="Titre H3" onClick={() => addBlock('heading3', block.id)} />
                  <BlockButton icon={<Heading4 className="h-4 w-4" />} label="Titre H4" onClick={() => addBlock('heading4', block.id)} />
                  <BlockButton icon={<Quote className="h-4 w-4" />} label="Citation" onClick={() => addBlock('quote', block.id)} />
                </TabsContent>
                <TabsContent value="list" className="flex flex-wrap gap-2 mt-2">
                  <BlockButton icon={<List className="h-4 w-4" />} label="Liste à puces" onClick={() => addBlock('unordered-list', block.id)} />
                  <BlockButton icon={<ListOrdered className="h-4 w-4" />} label="Liste numérotée" onClick={() => addBlock('ordered-list', block.id)} />
                </TabsContent>
                <TabsContent value="media" className="flex flex-wrap gap-2 mt-2">
                  <BlockButton icon={<ImageIcon className="h-4 w-4" />} label="Image" onClick={() => addBlock('image', block.id)} />
                </TabsContent>
              </Tabs>
            </div>
          )}

          <div className="block-content">
            <BlockEditor
              block={block}
              updateContent={(content) => updateBlockContent(block.id, content)}
              onKeyDown={(e) => handleKeyDown(e, block.id)}
            />
          </div>
        </div>
      ))}
      
      <div className="p-3">
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => {
            const lastBlockId = blocks[blocks.length - 1].id;
            addBlock('paragraph', lastBlockId);
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Ajouter un bloc
        </Button>
      </div>
    </div>
  );
};

// Composant pour chaque bouton de type de bloc
const BlockButton = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <Button type="button" variant="outline" size="sm" className="flex items-center gap-1" onClick={onClick}>
    {icon}
    <span className="text-xs">{label}</span>
  </Button>
);

// Composant pour l'icône du type de bloc
const BlockTypeIcon: React.FC<{ type: Block['type'] }> = ({ type }) => {
  switch (type) {
    case 'heading1': return <Heading1 className="h-4 w-4" />;
    case 'heading2': return <Heading2 className="h-4 w-4" />;
    case 'heading3': return <Heading3 className="h-4 w-4" />;
    case 'heading4': return <Heading4 className="h-4 w-4" />;
    case 'unordered-list': return <List className="h-4 w-4" />;
    case 'ordered-list': return <ListOrdered className="h-4 w-4" />;
    case 'image': return <ImageIcon className="h-4 w-4" />;
    case 'quote': return <Quote className="h-4 w-4" />;
    case 'paragraph':
    default: return <AlignLeft className="h-4 w-4" />;
  }
};

// Fonction pour obtenir le nom du type de bloc
const getBlockTypeName = (type: Block['type']): string => {
  switch (type) {
    case 'heading1': return 'Titre H1';
    case 'heading2': return 'Titre H2';
    case 'heading3': return 'Titre H3';
    case 'heading4': return 'Titre H4';
    case 'unordered-list': return 'Liste à puces';
    case 'ordered-list': return 'Liste numérotée';
    case 'image': return 'Image';
    case 'quote': return 'Citation';
    case 'paragraph':
    default: return 'Paragraphe';
  }
};

// Fonction pour obtenir le nom court du type de bloc (pour l'affichage dans le menu déroulant)
const getBlockTypeShortName = (type: Block['type']): string => {
  switch (type) {
    case 'heading1': return 'H1';
    case 'heading2': return 'H2';
    case 'heading3': return 'H3';
    case 'heading4': return 'H4';
    case 'unordered-list': return 'Liste';
    case 'ordered-list': return 'Liste num.';
    case 'image': return 'Image';
    case 'quote': return 'Citation';
    case 'paragraph':
    default: return 'Paragraphe';
  }
};

// Composant pour l'éditeur de bloc
const BlockEditor: React.FC<{ 
  block: Block, 
  updateContent: (content: string) => void,
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}> = ({ block, updateContent, onKeyDown }) => {
  const [content, setContent] = useState(block.content);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    updateContent(e.target.value);
  };

  // Ajuster dynamiquement la hauteur du textarea
  const adjustHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  let placeholder = 'Saisissez votre texte ici...';
  if (block.type === 'heading1') placeholder = 'Titre principal...';
  else if (block.type === 'heading2' || block.type === 'heading3' || block.type === 'heading4') placeholder = 'Sous-titre...';
  else if (block.type === 'unordered-list' || block.type === 'ordered-list') placeholder = 'Ajoutez des éléments (un par ligne)...';
  else if (block.type === 'image') placeholder = 'URL de l\'image...';
  else if (block.type === 'quote') placeholder = 'Ajoutez une citation...';

  return (
    <textarea
      id={`block-${block.id}`}
      className={`w-full border-0 bg-transparent outline-none resize-none ${
        block.type.startsWith('heading') 
          ? block.type === 'heading1' 
            ? 'text-2xl font-bold' 
            : block.type === 'heading2'
              ? 'text-xl font-bold'
              : block.type === 'heading3'
                ? 'text-lg font-bold'
                : 'text-base font-bold'
          : block.type === 'quote'
            ? 'italic border-l-4 border-gray-300 pl-3'
            : 'text-base'
      }`}
      value={content}
      onChange={(e) => {
        handleChange(e);
        adjustHeight(e);
      }}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      rows={1}
      style={{ minHeight: '2rem' }}
    />
  );
};

export default GutenbergEditor;
