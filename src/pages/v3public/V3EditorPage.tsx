import { useState, useRef } from 'react';
import BackButton from '@/components/v3public/BackButton';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit3, Bold, Italic, List, Heading1, Heading2, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function V3EditorPage() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [wordCount, setWordCount] = useState(0);

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
  };

  const handleInput = () => {
    const text = editorRef.current?.innerText || '';
    setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
  };

  const exportHtml = () => {
    const html = editorRef.current?.innerHTML || '';
    const blob = new Blob([`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Chapitre</title></head><body>${html}</body></html>`], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'chapitre.html'; a.click();
    toast.success('HTML téléchargé');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <BackButton to="/v3/nouveautes" />

        <header className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Edit3 className="h-6 w-6" />
            </div>
            <div>
              <Badge className="bg-amber-500 mb-1">NEW · Débutant 9,99€</Badge>
              <h1 className="text-3xl font-bold text-[#232F3E]">Éditeur WYSIWYG</h1>
            </div>
          </div>
          <p className="text-slate-600">Retouchez vos chapitres directement dans EbookStudio. Simple, rapide, sans quitter la plateforme.</p>
        </header>

        <Card className="p-4 mb-4 flex flex-wrap gap-2 items-center">
          <Button variant="outline" size="sm" onClick={() => exec('bold')}><Bold className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={() => exec('italic')}><Italic className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={() => exec('formatBlock', 'H1')}><Heading1 className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={() => exec('formatBlock', 'H2')}><Heading2 className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={() => exec('insertUnorderedList')}><List className="h-4 w-4" /></Button>
          <div className="ml-auto text-sm text-slate-600">{wordCount} mots</div>
          <Button size="sm" onClick={exportHtml}><Download className="h-4 w-4 mr-1" /> Export HTML</Button>
        </Card>

        <Card className="p-6">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            className="min-h-[500px] outline-none prose max-w-none focus:ring-2 focus:ring-[#008296]/30 rounded-lg p-4"
            dangerouslySetInnerHTML={{ __html: '<h1>Chapitre 1</h1><p>Commencez à écrire ici…</p>' }}
          />
        </Card>
      </div>
    </div>
  );
}
