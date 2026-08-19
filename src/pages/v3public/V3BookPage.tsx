import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Feather, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AudiobookOfferCard from '@/components/v3public/AudiobookOfferCard';
import { readBookBrief } from '@/lib/v3/bookBrief';
import {
  effectiveChapterText,
  readWrittenChapters,
  WRITTEN_CHAPTERS_EVENT,
  type WrittenChapter,
} from '@/lib/v3/writtenChapters';

type Book = {
  id: string;
  title: string;
  author_name?: string | null;
  preface?: string | null;
  conclusion?: string | null;
  chapters?: Array<{ title?: string; content?: string; text?: string }> | null;
};

export default function V3BookPage() {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeChapter, setActiveChapter] = useState(0);
  const [liveChapters, setLiveChapters] = useState<WrittenChapter[]>([]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase.from('ebook_projects')
        .select('id,title,author_name,preface,conclusion,chapters')
        .eq('id', id).maybeSingle();
      setBook((data as Book) || null);
      setLoading(false);
    })();
  }, [id]);

  // L'aperçu doit refléter instantanément le texte retenu dans « Mon livre »
  // (retouche manuelle > correction IA > premier jet), sans attendre un nouvel
  // enregistrement du projet dans le cloud.
  useEffect(() => {
    const sync = () => {
      const brief = readBookBrief();
      setLiveChapters(brief?.projectId === id ? readWrittenChapters() : []);
    };
    sync();
    window.addEventListener(WRITTEN_CHAPTERS_EVENT, sync);
    return () => window.removeEventListener(WRITTEN_CHAPTERS_EVENT, sync);
  }, [id]);

  if (loading) {
    return (
      <section className="min-h-[calc(100vh-4rem)] grid place-items-center">
        <div className="text-center">
          <Feather className="w-10 h-10 text-[var(--v3-orange)] mx-auto v3-pulse" />
          <div className="mt-4 text-sm text-[var(--v3-muted)]">Chargement de l'histoire…</div>
        </div>
      </section>
    );
  }
  if (!book) {
    return (
      <section className="min-h-[calc(100vh-4rem)] grid place-items-center px-5">
        <div className="text-center">
          <h1 className="v3-serif text-3xl font-bold">Livre introuvable</h1>
          <p className="text-sm text-[var(--v3-muted)] mt-2">Ce livre a peut-être été supprimé ou n'est pas public.</p>
          <Link to="/v3/gallery" className="v3-btn v3-btn-outline mt-6"><ArrowLeft className="w-4 h-4" /> Galerie</Link>
        </div>
      </section>
    );
  }

  const storedChapters = book.chapters || [];
  const chapters = liveChapters.length > 0
    ? liveChapters.map((chapter, index) => ({
        title: chapter.title || storedChapters[index]?.title,
        content: effectiveChapterText(chapter),
        text: undefined,
      }))
    : storedChapters;
  const current = chapters[activeChapter];

  return (
    <>
      <section className="v3-section-dark">
        <div className="max-w-4xl mx-auto px-5 md:px-8 py-14">
          <Link to="/v3/gallery" className="text-white/60 text-sm hover:text-white flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Retour à la galerie
          </Link>
          <h1 className="v3-serif text-4xl md:text-5xl font-bold mt-6">{book.title}</h1>
          {book.author_name && <div className="mt-2 text-white/60">par {book.author_name}</div>}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-5 md:px-8 py-10 grid md:grid-cols-[220px_1fr] gap-10">
        <aside className="md:sticky md:top-28 self-start space-y-1 max-h-[70vh] overflow-y-auto pr-2">
          <div className="text-xs uppercase tracking-wider text-[var(--v3-muted)] mb-2">Chapitres</div>
          {book.preface && (
            <button
              onClick={() => setActiveChapter(-1)}
              className={`w-full text-left text-sm px-3 py-2 rounded-md ${activeChapter === -1 ? 'bg-[var(--v3-orange-50)] text-[var(--v3-orange-600)]' : 'hover:bg-black/5'}`}
            >Préface</button>
          )}
          {chapters.map((c, i) => (
            <button
              key={i}
              onClick={() => setActiveChapter(i)}
              className={`w-full text-left text-sm px-3 py-2 rounded-md ${i === activeChapter ? 'bg-[var(--v3-orange-50)] text-[var(--v3-orange-600)] font-medium' : 'hover:bg-black/5'}`}
            >
              {i + 1}. {c.title || `Chapitre ${i + 1}`}
            </button>
          ))}
          {book.conclusion && (
            <button
              onClick={() => setActiveChapter(-2)}
              className={`w-full text-left text-sm px-3 py-2 rounded-md ${activeChapter === -2 ? 'bg-[var(--v3-orange-50)] text-[var(--v3-orange-600)]' : 'hover:bg-black/5'}`}
            >Conclusion</button>
          )}
        </aside>

        <article className="v3-serif prose max-w-none" style={{ lineHeight: 1.8, fontSize: 18 }}>
          {activeChapter === -1 && book.preface && (
            <>
              <h2 className="v3-serif text-3xl font-bold mb-6">Préface</h2>
              <div className="whitespace-pre-wrap">{book.preface}</div>
            </>
          )}
          {activeChapter === -2 && book.conclusion && (
            <>
              <h2 className="v3-serif text-3xl font-bold mb-6">Conclusion</h2>
              <div className="whitespace-pre-wrap">{book.conclusion}</div>
            </>
          )}
          {current && (
            <>
              <h2 className="v3-serif text-3xl font-bold mb-6">{current.title || `Chapitre ${activeChapter + 1}`}</h2>
              <div className="whitespace-pre-wrap">{current.content || current.text || 'Ce chapitre est vide.'}</div>
            </>
          )}
          {!current && activeChapter >= 0 && (
            <div className="text-[var(--v3-muted)] italic">Aucun chapitre à afficher.</div>
          )}

          <div className="mt-10">
            <AudiobookOfferCard bookId={book.id} bookTitle={book.title} />
          </div>
        </article>
      </section>
    </>
  );
}
