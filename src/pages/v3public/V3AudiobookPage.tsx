import { useMemo, useRef, useState } from 'react';
import BackButton from '@/components/v3/BackButton';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Headphones, Upload, Loader2 } from 'lucide-react';
import AudiobookCoverPicker from '@/components/v3public/AudiobookCoverPicker';
import AudiobookBookPicker from '@/components/v3public/AudiobookBookPicker';
import { Button } from '@/components/ui/button';
import { EbookAudioGenerator } from '@/components/ebook/EbookAudioGenerator';
import { parseManuscript } from '@/lib/manuscriptParser';
import { cleanPastedManuscript } from '@/lib/audiobook/cleanPastedManuscript';
import { importAudioFile, type AudioBookContent } from '@/lib/audiobook/bookImport';
import { AudioExpressWorkflow } from '@/components/ebook/AudioExpressWorkflow';
import { AudiobookLibrary } from '@/components/ebook/AudiobookLibrary';
import { EbookFormationAudio } from '@/components/ebook/EbookFormationAudio';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

/**
 * Studio livre audio professionnel — reprend l'outil complet déjà en service
 * (voix premium, sections, lecture, fusion MP3, exports).
 */
export default function V3AudiobookPage() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [preface, setPreface] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [epilogue, setEpilogue] = useState('');
  const [tab, setTab] = useState('studio');
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const applyBook = (book: AudioBookContent) => {
    setTitle(book.title); setAuthor(book.author); setPreface(book.preface);
    setConclusion(book.conclusion); setEpilogue(book.epilogue); setManuscript(book.manuscript);
    setImportError('');
  };
  const [manuscript, setManuscript] = useState('');
  const [cover, setCover] = useState<{ title: string | null; url: string | null } | null>(null);

  const cleaned = useMemo(() => cleanPastedManuscript(manuscript), [manuscript]);

  const chapters = useMemo(() => {
    const sections = parseManuscript(cleaned.text, 'Chapitre 1');
    return sections
      .map((s, i) => ({
        id: `ch-${i + 1}`,
        title: s.title,
        content: s.blocks.map((b) => b.text).join('\n\n'),
        subChapters: [],
      }))
      .filter((c) => c.content.trim().length > 0);
  }, [cleaned.text]);

  const totalWords = useMemo(
    () => chapters.reduce((n, c) => n + (c.content?.split(/\s+/).filter(Boolean).length || 0), 0),
    [chapters],
  );

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <BackButton to="/v3/nouveautes" />

        <header className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Headphones className="h-6 w-6" />
            </div>
            <div>
              <Badge className="mb-1">Studio Audio</Badge>
              <h1 className="text-3xl font-bold text-foreground">Studio livre audio</h1>
            </div>
          </div>
        </header>

        <Button size="lg" className="mb-3" disabled={importing} onClick={() => fileInput.current?.click()}>
          {importing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Upload className="mr-2 h-5 w-5" />}
          {importing ? 'Import en cours…' : 'Importer mon livre'}
        </Button>
        <input ref={fileInput} type="file" className="hidden" aria-label="Fichier du livre" accept=".docx,.txt,.md,.pdf" onChange={async e => {
          const file = e.target.files?.[0];
          if (!file) return;
          setImporting(true); setImportError('');
          try { applyBook(await importAudioFile(file)); }
          catch (error) { setImportError(error instanceof Error ? error.message : 'Import impossible.'); }
          finally { setImporting(false); if (fileInput.current) fileInput.current.value = ''; }
        }} />
        {importError && <p role="alert" className="text-destructive mb-4">{importError}</p>}

        <AudiobookBookPicker onLoaded={applyBook} />
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex h-auto flex-wrap justify-start mb-6">
            <TabsTrigger className="v3-chip-toggle" value="studio">Livre audio</TabsTrigger>
            <TabsTrigger className="v3-chip-toggle" value="express">Audio Express</TabsTrigger>
            <TabsTrigger className="v3-chip-toggle" value="library">Mes livres audio</TabsTrigger>
            <TabsTrigger className="v3-chip-toggle" value="formation">Formation audio</TabsTrigger>
          </TabsList>
          <TabsContent value="library"><AudiobookLibrary /></TabsContent>
          <TabsContent value="formation"><EbookFormationAudio /></TabsContent>
          <TabsContent value="express"><AudioExpressWorkflow key={`${title}:${manuscript.length}`} ebookTitle={title} authorName={author} chapters={chapters} preface={preface} conclusion={conclusion} onNavigateToAudio={() => setTab('studio')} /></TabsContent>
          <TabsContent value="studio" forceMount className="data-[state=inactive]:hidden">

        <AudiobookCoverPicker
          onSelected={({ title: coverTitle, url }) => {
            setCover({ title: coverTitle, url });
            if (coverTitle && !title.trim()) setTitle(coverTitle);
          }}
        />

        <Card className="p-5 mb-6 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="ab-title">Titre du livre</Label>
            <Input
              id="ab-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Les flammes du passé"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="ab-author">Nom de l'auteur</Label>
            <Input
              id="ab-author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Georges Boubet"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="ab-preface">Préface (facultatif)</Label>
            <Textarea
              id="ab-preface"
              value={preface}
              onChange={(e) => setPreface(e.target.value)}
              className="mt-1 min-h-[90px]"
            />
          </div>
          <div>
            <Label htmlFor="ab-conclusion">Conclusion (facultatif)</Label>
            <Textarea
              id="ab-conclusion"
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              className="mt-1 min-h-[90px]"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="ab-epilogue">Épilogue (facultatif)</Label>
            <Textarea id="ab-epilogue" value={epilogue} onChange={e => setEpilogue(e.target.value)} className="mt-1 min-h-[90px]" />
          </div>
        </Card>

        <Card className="p-5 mb-6">
          <Label htmlFor="ab-manuscript">Manuscrit complet</Label>
          <p className="text-xs text-slate-500 mt-1">
            Collez votre livre. Les titres « Chapitre 1 », « # Titre » ou « ## Titre » créent
            automatiquement les chapitres audio.
          </p>
          <Textarea
            id="ab-manuscript"
            value={manuscript}
            onChange={(e) => setManuscript(e.target.value)}
            placeholder={'Chapitre 1 — Le départ\n\nTexte du chapitre…'}
            className="min-h-[260px] mt-2"
          />
          <div className="text-xs text-slate-500 mt-2">
            {chapters.length} chapitre(s) détecté(s) · {totalWords.toLocaleString('fr-FR')} mots ·
            ≈ {Math.max(1, Math.round(totalWords / 150))} min d'écoute
          </div>

          {cleaned.changed && (
            <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs text-amber-900">
                Texte remis au propre automatiquement :
                {cleaned.removedHeader ? ' titre répété en haut de chaque page retiré,' : ''}
                {cleaned.removedToc ? ' sommaire retiré,' : ''} numéros de page enlevés, titres de
                chapitre remis en place et mots coupés recollés. La lecture audio utilise déjà cette
                version propre.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setManuscript(cleaned.text)}
              >
                Voir le texte nettoyé ici
              </Button>
            </div>
          )}
        </Card>

        <EbookAudioGenerator
          ebookTitle={title || cover?.title || 'Mon livre'}
          authorName={author || 'Auteur'}
          preface={preface}
          conclusion={conclusion}
          epilogue={epilogue}
          chapters={chapters}
        />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
