import { useEffect, useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { importAudioFile, type AudioBookContent } from '@/lib/audiobook/bookImport';
import AudiobookBookPicker from '@/components/v3public/AudiobookBookPicker';
import { parseManuscript } from '@/lib/manuscriptParser';
import { useSearchParams } from 'react-router-dom';
import EbookMultiTranslator from '@/components/ebook/EbookMultiTranslator';
import { BackButton } from "@/components/v3/BackButton";
import { supabase } from '@/integrations/supabase/client';
import globeImg from '@/assets/v3-translator-globe.jpg';

type TranslationBook = { title: string; preface?: string | null; conclusion?: string | null; chapters?: Array<{ title?: string; content?: string; text?: string }> | null };

export default function V3TranslatorPage() {
  const [params] = useSearchParams();
  const [book, setBook] = useState<TranslationBook | null>(null);
  const projectId = params.get('projectId');
  const fileInput = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const applyBook = (b: AudioBookContent) => {
    const sections = parseManuscript(b.manuscript, 'Chapitre 1');
    setBook({ title: b.title, preface: b.preface, conclusion: b.conclusion, chapters: sections.map((sec) => ({ title: sec.title, content: sec.blocks.map((x) => x.text).join('\n\n') })) });
    document.getElementById('traducteur')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!projectId) return;
    supabase.from('ebook_projects').select('title,preface,conclusion,chapters').eq('id', projectId).maybeSingle()
      .then(({ data }) => setBook((data as TranslationBook) || null));
  }, [projectId]);

  const chapters = (book?.chapters || []).map((chapter, index) => ({
    id: `${projectId || 'book'}-${index}`,
    title: chapter.title || `Chapitre ${index + 1}`,
    content: chapter.content || chapter.text || '',
  }));
  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
      <div className="max-w-6xl mx-auto px-4 pt-4"><BackButton /></div>
      <div className="mb-8 rounded-2xl overflow-hidden grid md:grid-cols-2 items-center gap-6 p-6 md:p-10" style={{ background: 'radial-gradient(circle at 75% 50%, #0F2A5C 0%, #0B0F17 70%)', border: '1px solid #1F2937' }}>
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight" style={{ color: '#F9FAFB' }}>
            TRADUCTEUR<br />D'EBOOKS
          </h1>
          <p className="mt-3 text-lg font-semibold uppercase" style={{ color: '#34D399' }}>
            Votre livre, traduit dans les principales langues
          </p>
          <p className="mt-3 text-[15px]" style={{ color: '#D1D5DB' }}>
            Choisissez un livre, cochez les pays et les langues, puis lancez la traduction : texte, titre et 4e de couverture dans chaque langue.
          </p>
          <ul className="mt-3 space-y-1 text-[14px]" style={{ color: '#E5E7EB' }}>
            <li>✓ Chaque langue part de votre texte original</li>
            <li>✓ Plusieurs langues en une seule fois</li>
            <li>✓ Fichiers prêts pour Amazon KDP</li>
          </ul>
          <a href="#traducteur" className="inline-block mt-5 px-6 py-3 rounded-lg font-bold uppercase tracking-wider text-sm" style={{ background: '#059669', color: '#fff' }}>
            Traduire mon livre
          </a>
        </div>
        <img src={globeImg} alt="Globe terrestre entouré des drapeaux des pays de traduction" width={1024} height={1024} className="w-full max-w-md mx-auto rounded-full" />
      </div>
      <div className="mb-6 rounded-2xl p-5" style={{ background: '#111827', border: '1px solid #059669' }}>
        <h2 className="text-xl font-bold mb-1" style={{ color: '#F9FAFB' }}>📥 Importer votre livre</h2>
        <p className="text-[14px] mb-3" style={{ color: '#D1D5DB' }}>Word, PDF, TXT ou Markdown depuis votre ordinateur, ou un livre de votre bibliothèque.</p>
        <button type="button" disabled={importing} onClick={() => fileInput.current?.click()} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-bold text-sm mb-4" style={{ background: '#EA580C', color: '#fff' }}>
          {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Importer votre livre
        </button>
        <input ref={fileInput} type="file" className="hidden" aria-label="Fichier du livre" accept=".docx,.txt,.md,.pdf" onChange={async (e) => {
          const file = e.target.files?.[0]; if (!file) return;
          setImporting(true); setImportError('');
          try { applyBook(await importAudioFile(file)); }
          catch (error) { setImportError(error instanceof Error ? error.message : 'Import impossible.'); }
          finally { setImporting(false); if (fileInput.current) fileInput.current.value = ''; }
        }} />
        {importError && <p role="alert" className="mb-3" style={{ color: '#F87171' }}>{importError}</p>}
        {book?.title && <p className="mb-3 text-[14px]" style={{ color: '#34D399' }}>✓ Livre chargé : {book.title} ({book.chapters?.length || 0} chapitres)</p>}
        <AudiobookBookPicker onLoaded={applyBook} />
      </div>
      <div id="traducteur" />
      <EbookMultiTranslator ebookTitle={book?.title || ''} chapters={chapters} preface={book?.preface || ''} conclusion={book?.conclusion || ''} />
    </div>
  );
}
