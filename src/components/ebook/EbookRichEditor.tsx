import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Type, Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Heading3,
  AlignLeft, AlignCenter, AlignRight, Quote, Minus, Undo2, Redo2, 
  FileText, Eye, Edit3, Maximize2, Minimize2, Copy, Download
} from 'lucide-react';
import { toast } from 'sonner';
import { Chapter } from '@/hooks/useSubscriptionGeneration';

interface EbookRichEditorProps {
  chapters: Chapter[];
  onUpdateChapterContent: (chapterId: string, content: string) => void;
  onUpdateSubChapterContent: (chapterId: string, subChapterId: string, content: string) => void;
  targetWordsPerChapter?: number;
}

export const EbookRichEditor: React.FC<EbookRichEditorProps> = ({
  chapters,
  onUpdateChapterContent,
  onUpdateSubChapterContent,
  targetWordsPerChapter = 2500,
}) => {
  const [selectedChapter, setSelectedChapter] = useState<string>(chapters[0]?.id || '');
  const [selectedSubChapter, setSelectedSubChapter] = useState<string>('main');
  const [isPreview, setIsPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const chapter = chapters.find(c => c.id === selectedChapter);
  const currentContent = selectedSubChapter === 'main'
    ? chapter?.content || ''
    : chapter?.subChapters.find(sc => sc.id === selectedSubChapter)?.content || '';

  const wordCount = currentContent.split(/\s+/).filter(Boolean).length;
  const charCount = currentContent.length;
  const progressPercent = targetWordsPerChapter > 0 ? Math.min(100, (wordCount / targetWordsPerChapter) * 100) : 0;

  const handleContentChange = useCallback((newContent: string) => {
    if (!chapter) return;
    if (selectedSubChapter === 'main') {
      onUpdateChapterContent(chapter.id, newContent);
    } else {
      onUpdateSubChapterContent(chapter.id, selectedSubChapter, newContent);
    }
  }, [chapter, selectedSubChapter, onUpdateChapterContent, onUpdateSubChapterContent]);

  const insertFormatting = useCallback((before: string, after: string = '') => {
    const textarea = document.querySelector('#rich-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const newText = text.substring(0, start) + before + selected + after + text.substring(end);
    handleContentChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = start + before.length + selected.length;
    }, 0);
  }, [handleContentChange]);

  const formatActions = [
    { icon: Bold, label: 'Gras', action: () => insertFormatting('**', '**') },
    { icon: Italic, label: 'Italique', action: () => insertFormatting('*', '*') },
    { icon: Underline, label: 'Souligné', action: () => insertFormatting('__', '__') },
    { type: 'separator' },
    { icon: Heading1, label: 'Titre 1', action: () => insertFormatting('\n# ', '\n') },
    { icon: Heading2, label: 'Titre 2', action: () => insertFormatting('\n## ', '\n') },
    { icon: Heading3, label: 'Titre 3', action: () => insertFormatting('\n### ', '\n') },
    { type: 'separator' },
    { icon: List, label: 'Liste', action: () => insertFormatting('\n- ') },
    { icon: ListOrdered, label: 'Liste numérotée', action: () => insertFormatting('\n1. ') },
    { icon: Quote, label: 'Citation', action: () => insertFormatting('\n> ') },
    { icon: Minus, label: 'Séparateur', action: () => insertFormatting('\n\n---\n\n') },
  ];

  const renderPreview = (text: string) => {
    return text
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/__(.+?)__/g, '<u>$1</u>')
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-3">$1</blockquote>')
      .replace(/^- (.+)$/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
      .replace(/^---$/gm, '<hr class="my-6 border-border" />')
      .replace(/\n\n/g, '</p><p class="mb-3">')
      .replace(/\n/g, '<br />');
  };

  const copyContent = () => {
    navigator.clipboard.writeText(currentContent);
    toast.success('Contenu copié !');
  };

  const totalChapterWords = chapter
    ? (chapter.content?.split(/\s+/).filter(Boolean).length || 0)
      + chapter.subChapters.reduce((acc, sc) => acc + (sc.content?.split(/\s+/).filter(Boolean).length || 0), 0)
    : 0;

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-6 overflow-auto' : ''}`}>
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-xl bg-primary/10">
              <Edit3 className="h-6 w-6 text-primary" />
            </div>
            Éditeur Enrichi
            <Badge className="bg-primary/10 text-primary border-primary/30">WYSIWYG</Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Chapter selector */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={selectedChapter} onValueChange={(v) => { setSelectedChapter(v); setSelectedSubChapter('main'); }}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Sélectionner un chapitre" />
          </SelectTrigger>
          <SelectContent>
            {chapters.map((ch, i) => (
              <SelectItem key={ch.id} value={ch.id}>
                Ch. {i + 1}: {ch.title || `Chapitre ${i + 1}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {chapter && chapter.subChapters.length > 0 && (
          <Select value={selectedSubChapter} onValueChange={setSelectedSubChapter}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main">Contenu principal</SelectItem>
              {chapter.subChapters.map((sc, i) => (
                <SelectItem key={sc.id} value={sc.id}>
                  Sous-ch. {i + 1}: {sc.title || `Sous-chapitre ${i + 1}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Editor */}
      <Card>
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b flex-wrap">
          {formatActions.map((action, i) => {
            if ('type' in action && action.type === 'separator') {
              return <div key={i} className="w-px h-6 mx-1 bg-border" />;
            }
            const Icon = (action as any).icon;
            return (
              <Button
                key={i}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(action as any).action}
                title={(action as any).label}
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
          
          <div className="flex-1" />
          
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyContent} title="Copier">
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsPreview(!isPreview)}
            title={isPreview ? 'Éditer' : 'Prévisualiser'}
          >
            {isPreview ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Réduire' : 'Plein écran'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>

        <CardContent className="p-0">
          {isPreview ? (
            <div 
              className="prose prose-sm max-w-none p-6 min-h-[500px]"
              dangerouslySetInnerHTML={{ __html: `<p class="mb-3">${renderPreview(currentContent)}</p>` }}
            />
          ) : (
            <textarea
              id="rich-textarea"
              value={currentContent}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full min-h-[500px] p-6 bg-transparent border-0 resize-none focus:outline-none font-mono text-sm leading-relaxed"
              placeholder="Commencez à écrire votre chapitre ici...

Utilisez la barre d'outils pour formater votre texte :
**gras**, *italique*, # Titres, > Citations..."
            />
          )}
        </CardContent>

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/30 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>{wordCount.toLocaleString()} mots</span>
            <span>{charCount.toLocaleString()} caractères</span>
            <span>~{Math.ceil(wordCount / 250)} pages</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span>Objectif: {targetWordsPerChapter}</span>
              <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${progressPercent >= 100 ? 'bg-green-500' : progressPercent >= 60 ? 'bg-amber-500' : 'bg-primary'}`}
                  style={{ width: `${Math.min(100, progressPercent)}%` }}
                />
              </div>
              <span className="font-medium">{Math.round(progressPercent)}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Chapter words overview */}
      {chapter && (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>Total chapitre "{chapter.title}": <strong className="text-foreground">{totalChapterWords.toLocaleString()}</strong> mots</span>
        </div>
      )}
    </div>
  );
};

export default EbookRichEditor;
