import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  GripVertical, Trash2, FileText, Split, Copy, ArrowUp, ArrowDown, Plus 
} from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Chapter, SubChapter } from '@/hooks/useEbookGeneration';

interface EbookChapterProps {
  chapter: Chapter;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onUpdateContent: (id: string, content: string) => void;
  onAddSubChapter: (id: string) => void;
  onRemoveSubChapter: (chapterId: string, subChapterId: string) => void;
  onUpdateSubChapterTitle: (chapterId: string, subChapterId: string, title: string) => void;
  onMoveChapter: (id: string, direction: 'up' | 'down') => void;
  onDuplicateChapter: (id: string) => void;
  onSplitChapter: (id: string) => void;
  onGenerateChapterContent: (id: string) => void;
  onRemoveChapter: (id: string) => void;
  isGenerating: boolean;
  apiKey: string;
  totalChapters: number;
}

export const EbookChapter: React.FC<EbookChapterProps> = ({
  chapter,
  index,
  isSelected,
  onSelect,
  onUpdateTitle,
  onUpdateContent,
  onAddSubChapter,
  onRemoveSubChapter,
  onUpdateSubChapterTitle,
  onMoveChapter,
  onDuplicateChapter,
  onSplitChapter,
  onGenerateChapterContent,
  onRemoveChapter,
  isGenerating,
  apiKey,
  totalChapters
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg p-4 space-y-3 transition-colors ${
        isDragging ? 'bg-accent' : ''
      } ${isSelected ? 'border-primary bg-primary/5' : ''}`}
    >
      <div className="flex items-center gap-2">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(chapter.id)}
          className="mr-2"
        />
        <span className="font-medium">Chapitre {index + 1}:</span>
        <Input
          placeholder="Titre du chapitre"
          value={chapter.title}
          onClick={() => onSelect(chapter.id)}
          onChange={(e) => onUpdateTitle(chapter.id, e.target.value)}
          className={`flex-1 cursor-pointer transition-colors ${
            isSelected ? 'border-blue-500 bg-blue-50 text-blue-900' : ''
          }`}
        />
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMoveChapter(chapter.id, 'up')}
            disabled={index === 0}
            title="Déplacer vers le haut"
          >
            <ArrowUp className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMoveChapter(chapter.id, 'down')}
            disabled={index === totalChapters - 1}
            title="Déplacer vers le bas"
          >
            <ArrowDown className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDuplicateChapter(chapter.id)}
            title="Dupliquer le chapitre"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSplitChapter(chapter.id)}
            disabled={isGenerating || !apiKey}
            title="Diviser automatiquement"
          >
            <Split className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onGenerateChapterContent(chapter.id)}
            disabled={isGenerating || !apiKey || !chapter.title}
            title="Rédiger le chapitre (350 mots)"
          >
            <FileText className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRemoveChapter(chapter.id)}
            title="Supprimer le chapitre"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="ml-6">
        {chapter.content ? (
          <div className="bg-muted p-3 rounded-lg mb-3 text-sm leading-relaxed whitespace-pre-wrap">
            {chapter.content.split('\n').map((line, lineIndex) => (
              <p key={lineIndex} className="mb-2">
                {line.split(/(\*[^*]+\*|"[^"]+"|(\([^)]+\)))/).map((part, partIndex) => {
                  if (part.startsWith('*') && part.endsWith('*')) {
                    return <em key={partIndex} className="font-medium text-primary">{part.slice(1, -1)}</em>;
                  }
                  if (part.startsWith('"') && part.endsWith('"')) {
                    return <span key={partIndex} className="text-accent-foreground font-medium">"{part.slice(1, -1)}"</span>;
                  }
                  if (part.startsWith('(') && part.endsWith(')')) {
                    return <span key={partIndex} className="text-muted-foreground italic">{part}</span>;
                  }
                  return part;
                })}
              </p>
            ))}
          </div>
        ) : (
          <Textarea
            placeholder="Contenu du chapitre (optionnel, pour la division automatique)"
            value=""
            onChange={(e) => onUpdateContent(chapter.id, e.target.value)}
            rows={3}
            className="mb-3"
          />
        )}
      </div>
      
      <div className="ml-6 space-y-2">
        {chapter.subChapters.map((subChapter, subIndex) => (
          <div key={subChapter.id} className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {index + 1}.{subIndex + 1}:
            </span>
            <Input
              placeholder="Titre du sous-chapitre"
              value={subChapter.title}
              onChange={(e) => onUpdateSubChapterTitle(chapter.id, subChapter.id, e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemoveSubChapter(chapter.id, subChapter.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddSubChapter(chapter.id)}
          className="ml-8"
        >
          <Plus className="h-3 w-3 mr-1" />
          Ajouter un sous-chapitre
        </Button>
      </div>
    </div>
  );
};