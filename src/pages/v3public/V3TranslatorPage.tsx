import { useEffect, useState } from 'react';
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
      <div id="traducteur" />
      <EbookMultiTranslator ebookTitle={book?.title || ''} chapters={chapters} preface={book?.preface || ''} conclusion={book?.conclusion || ''} />
    </div>
  );
}
