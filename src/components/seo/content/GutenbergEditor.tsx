import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Plus, Heading1, Heading2, Heading3, Heading4, ListOrdered, List, 
  Image as ImageIcon, Quote, AlignJustify, AlignLeft, Bold, Italic, Underline, 
  Link as LinkIcon, Palette, AlignCenter, AlignRight 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the valid block types
type BlockType = 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'unordered-list' | 'ordered-list' | 'image' | 'quote';

interface Block {
  id: string;
  type: BlockType;
  content: string;
}

interface GutenbergEditorProps {
  value: string;
  onChange: (content: string) => void;
}

// Color palettes for styling
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
      // Try to parse if it's JSON
      const parsedBlocks = JSON.parse(value);
      
      // Check that the types are valid
      if (Array.isArray(parsedBlocks)) {
        const validBlocks = parsedBlocks
          .filter(block => 
            block && typeof block === 'object' && 
            typeof block.type === 'string' && 
            isValidBlockType(block.type)
          )
          .map(block => ({
            id: block.id || generateId(),
            type: block.type as BlockType,
            content: block.content || ''
          }));
        
        return validBlocks.length > 0 ? validBlocks : [{ id: generateId(), type: 'paragraph', content: '' }];
      }
      return [{ id: generateId(), type: 'paragraph', content: '' }];
    } catch {
      // If it's not valid JSON, consider it as plain text and convert to paragraph block
      return [{ id: generateId(), type: 'paragraph', content: value }];
    }
  });
  
  const [activeBlock, setActiveBlock] = useState<string | null>(blocks[0]?.id || null);
  const [showBlockSelector, setShowBlockSelector] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Function to validate block types
  function isValidBlockType(type: string): type is BlockType {
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

  const addBlock = (type: BlockType, afterId: string) => {
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
      // Always keep at least one block
      const resetBlocks = [{ id: generateId(), type: 'paragraph' as BlockType, content: '' }];
      setBlocks(resetBlocks);
      setActiveBlock(resetBlocks[0].id);
      updateParentContent(resetBlocks);
      return;
    }
    
    const index = blocks.findIndex(block => block.id === id);
    const updatedBlocks = blocks.filter(block => block.id !== id);
    setBlocks(updatedBlocks);
    
    // Select the previous or next block
    const newActiveIndex = Math.min(index, updatedBlocks.length - 1);
    setActiveBlock(updatedBlocks[newActiveIndex]?.id || null);
    updateParentContent(updatedBlocks);
  };

  const updateBlockType = (id: string, newType: BlockType) => {
    const updatedBlocks = blocks.map(block => 
      block.id === id ? { ...block, type: newType } : block
    );
    setBlocks(updatedBlocks);
    updateParentContent(updatedBlocks);
  };

  const updateParentContent = (currentBlocks: Block[]) => {
    try {
      // Convert blocks to HTML
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
            return block.content ? `<ul><li>${block.content.split('\n').join('</li><li>')}</li></ul>` : '<ul><li></li></ul>';
          case 'ordered-list':
            return block.content ? `<ol><li>${block.content.split('\n').join('</li><li>')}</li></ol>` : '<ol><li></li></ol>';
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
    } catch (error) {
      console.error("Error updating content:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, id: string) => {
    // Add a new paragraph on Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addBlock('paragraph', id);
    }
  };

  // Functions for text formatting
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
    
    // Reset focus and selection after content update
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

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // If the click is not in a menu or a button that controls a menu
      if (!target.closest('[id^="type-menu-"]') && 
          !target.closest('[id^="color-menu-"]') && 
          !target.closest('[id^="highlight-menu-"]')) {
        document.querySelectorAll('[id^="type-menu-"],[id^="color-menu-"],[id^="highlight-menu-"]')
          .forEach(el => {
            if (el instanceof HTMLElement) el.classList.add('hidden');
          });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="gutenberg-editor rounded-md" ref={editorRef}>
      {blocks.map((block) => (
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
            <div className="formatting-toolbar flex flex-wrap gap-1 mb-2 p-2 bg-gray-100 rounded-md">
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
              
              {/* Text Color Selector */}
              <div className="relative z-10">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Couleur du texte"
                  onClick={() => {
                    const menu = document.getElementById(`color-menu-${block.id}`);
                    if (menu) {
                      menu.classList.toggle('hidden');
                    }
                  }}
                >
                  <Palette className="h-4 w-4" />
                </Button>
                
                <div id={`color-menu-${block.id}`} className="absolute left-0 top-full mt-1 bg-white shadow-lg border rounded-md p-2 hidden w-40 z-50">
                  <div className="space-y-1">
                    {Object.entries(TEXT_COLORS).map(([key, value]) => (
                      <button
                        key={`text-${key}`}
                        className="flex items-center gap-2 w-full px-2 py-1 text-sm hover:bg-gray-100 rounded-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          applyTextColor(block.id, value.class);
                          document.getElementById(`color-menu-${block.id}`)?.classList.add('hidden');
                        }}
                      >
                        <div className={`w-4 h-4 rounded-full ${value.class || 'bg-black'}`} />
                        <span>{value.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Highlight Color Selector */}
              <div className="relative z-10">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm" 
                  className="h-8 w-8 p-0"
                  title="Surlignage"
                  onClick={() => {
                    const menu = document.getElementById(`highlight-menu-${block.id}`);
                    if (menu) {
                      menu.classList.toggle('hidden');
                    }
                  }}
                >
                  <span className="flex items-center justify-center w-4 h-4 bg-yellow-200">A</span>
                </Button>
                
                <div id={`highlight-menu-${block.id}`} className="absolute left-0 top-full mt-1 bg-white shadow-lg border rounded-md p-2 hidden w-40 z-50">
                  <div className="space-y-1">
                    {Object.entries(HIGHLIGHT_COLORS).map(([key, value]) => (
                      <button
                        key={`highlight-${key}`}
                        className="flex items-center gap-2 w-full px-2 py-1 text-sm hover:bg-gray-100 rounded-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          applyHighlightColor(block.id, value.class);
                          document.getElementById(`highlight-menu-${block.id}`)?.classList.add('hidden');
                        }}
                      >
                        <div className={`w-4 h-4 rounded-full ${value.class || 'bg-transparent border border-gray-300'}`} />
                        <span>{value.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-l border-gray-300 mx-1"></div>
              
              {/* Block Type Selector */}
              <div className="relative z-10">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  title="Type de bloc"
                  onClick={() => {
                    const menu = document.getElementById(`type-menu-${block.id}`);
                    if (menu) {
                      menu.classList.toggle('hidden');
                    }
                  }}
                >
                  <BlockTypeIcon type={block.type} />
                  <span className="text-xs ml-1">{getBlockTypeShortName(block.type)}</span>
                </Button>
                
                <div id={`type-menu-${block.id}`} className="absolute left-0 top-full mt-1 bg-white shadow-lg border rounded-md p-2 hidden w-40 z-50">
                  <div className="space-y-1">
                    <TypeOption 
                      icon={<AlignJustify className="h-4 w-4" />} 
                      label="Paragraphe" 
                      onClick={() => updateBlockType(block.id, 'paragraph')} 
                    />
                    <TypeOption 
                      icon={<Heading1 className="h-4 w-4" />} 
                      label="Titre H1" 
                      onClick={() => updateBlockType(block.id, 'heading1')} 
                    />
                    <TypeOption 
                      icon={<Heading2 className="h-4 w-4" />} 
                      label="Titre H2" 
                      onClick={() => updateBlockType(block.id, 'heading2')} 
                    />
                    <TypeOption 
                      icon={<Heading3 className="h-4 w-4" />} 
                      label="Titre H3" 
                      onClick={() => updateBlockType(block.id, 'heading3')} 
                    />
                    <TypeOption 
                      icon={<Heading4 className="h-4 w-4" />} 
                      label="Titre H4" 
                      onClick={() => updateBlockType(block.id, 'heading4')} 
                    />
                    <TypeOption 
                      icon={<List className="h-4 w-4" />} 
                      label="Liste à puces" 
                      onClick={() => updateBlockType(block.id, 'unordered-list')} 
                    />
                    <TypeOption 
                      icon={<ListOrdered className="h-4 w-4" />} 
                      label="Liste numérotée" 
                      onClick={() => updateBlockType(block.id, 'ordered-list')} 
                    />
                    <TypeOption 
                      icon={<Quote className="h-4 w-4" />} 
                      label="Citation" 
                      onClick={() => updateBlockType(block.id, 'quote')} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="border-l border-gray-300 mx-1"></div>
              
              {/* Text Alignment */}
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
            <div className="block-selector bg-white shadow-lg border rounded-md p-2 mb-3 z-10 relative">
              <Tabs defaultValue="text">
                <TabsList className="w-full">
                  <TabsTrigger value="text" className="flex-1">Texte</TabsTrigger>
                  <TabsTrigger value="list" className="flex-1">Listes</TabsTrigger>
                  <TabsTrigger value="media" className="flex-1">Média</TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="flex flex-wrap gap-2 mt-2">
                  <BlockButton 
                    icon={<AlignJustify className="h-4 w-4" />} 
                    label="Paragraphe" 
                    onClick={() => addBlock('paragraph', block.id)} 
                  />
                  <BlockButton 
                    icon={<Heading1 className="h-4 w-4" />} 
                    label="Titre H1" 
                    onClick={() => addBlock('heading1', block.id)} 
                  />
                  <BlockButton 
                    icon={<Heading2 className="h-4 w-4" />} 
                    label="Titre H2" 
                    onClick={() => addBlock('heading2', block.id)} 
                  />
                  <BlockButton 
                    icon={<Heading3 className="h-4 w-4" />} 
                    label="Titre H3" 
                    onClick={() => addBlock('heading3', block.id)} 
                  />
                  <BlockButton 
                    icon={<Heading4 className="h-4 w-4" />} 
                    label="Titre H4" 
                    onClick={() => addBlock('heading4', block.id)} 
                  />
                  <BlockButton 
                    icon={<Quote className="h-4 w-4" />} 
                    label="Citation" 
                    onClick={() => addBlock('quote', block.id)} 
                  />
                </TabsContent>
                <TabsContent value="list" className="flex flex-wrap gap-2 mt-2">
                  <BlockButton 
                    icon={<List className="h-4 w-4" />} 
                    label="Liste à puces" 
                    onClick={() => addBlock('unordered-list', block.id)} 
                  />
                  <BlockButton 
                    icon={<ListOrdered className="h-4 w-4" />} 
                    label="Liste numérotée" 
                    onClick={() => addBlock('ordered-list', block.id)} 
                  />
                </TabsContent>
                <TabsContent value="media" className="flex flex-wrap gap-2 mt-2">
                  <BlockButton 
                    icon={<ImageIcon className="h-4 w-4" />} 
                    label="Image" 
                    onClick={() => addBlock('image', block.id)} 
                  />
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

// Component for each block type button
const BlockButton = ({ 
  icon, 
  label, 
  onClick 
}: { 
  icon: React.ReactNode, 
  label: string, 
  onClick: () => void 
}) => (
  <Button 
    type="button" 
    variant="outline" 
    size="sm" 
    className="flex items-center gap-1" 
    onClick={onClick}
  >
    {icon}
    <span className="text-xs">{label}</span>
  </Button>
);

// Component for the block type icon
const BlockTypeIcon: React.FC<{ type: BlockType }> = ({ type }) => {
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

// Component for type option in dropdown
const TypeOption = ({ 
  icon, 
  label, 
  onClick 
}: { 
  icon: React.ReactNode, 
  label: string, 
  onClick: () => void 
}) => (
  <button
    type="button"
    className="flex items-center gap-2 w-full px-2 py-1 text-sm hover:bg-gray-100 rounded-md"
    onClick={(e) => {
      e.stopPropagation();
      onClick();
      // Close menu after selection
      document.querySelectorAll('[id^="type-menu-"]').forEach(el => {
        if (el instanceof HTMLElement) el.classList.add('hidden');
      });
    }}
  >
    {icon}
    <span>{label}</span>
  </button>
);

// Function to get the block type name
const getBlockTypeName = (type: BlockType): string => {
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

// Function to get the short block type name (for display in dropdown)
const getBlockTypeShortName = (type: BlockType): string => {
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
    default: return 'Para';
  }
};

// Block Editor component
const BlockEditor: React.FC<{ 
  block: Block, 
  updateContent: (content: string) => void,
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}> = ({ block, updateContent, onKeyDown }) => {
  const [content, setContent] = useState(block.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    updateContent(e.target.value);
    adjustHeight(e);
  };

  // Dynamically adjust textarea height
  const adjustHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  // Update local content if block changes
  useEffect(() => {
    setContent(block.content);
    
    // Adjust height on load
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [block.content]);

  let placeholder = 'Saisissez votre texte ici...';
  if (block.type === 'heading1') placeholder = 'Titre principal...';
  else if (block.type === 'heading2' || block.type === 'heading3' || block.type === 'heading4') placeholder = 'Sous-titre...';
  else if (block.type === 'unordered-list' || block.type === 'ordered-list') placeholder = 'Ajoutez des éléments (un par ligne)...';
  else if (block.type === 'image') placeholder = 'URL de l\'image...';
  else if (block.type === 'quote') placeholder = 'Ajoutez une citation...';

  return (
    <textarea
      id={`block-${block.id}`}
      ref={textareaRef}
      className={`w-full border-0 bg-transparent outline-none resize-none transition-all ${
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
      onChange={handleChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      rows={1}
      style={{ minHeight: '2rem' }}
    />
  );
};

export default GutenbergEditor;
