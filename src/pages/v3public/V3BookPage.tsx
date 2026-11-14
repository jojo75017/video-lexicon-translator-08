import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Feather, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AudiobookOfferCard from '@/components/v3public/AudiobookOfferCard';
import V3ResetBookButton from '@/components/v3public/V3ResetBookButton';
import { readBookBrief } from '@/lib/v3/bookBrief';
import type { BookBrief } from '@/lib/v3/bookBrief';
import { restoreWritingBrief } from '@/lib/v3/bookDraftRestore';
import { Button } from '@/components/ui/button';
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
  draft_state?: { brief?: BookBrief } | null;
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
        .select('id,title,author_name,preface,conclusion,chapters,draft_state')
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

  const brief = restoreWritingBrief(book, {});
  const storedChapters = book.chapters?.length ? book.chapters : (brief.outline || []).map((chapter) => ({ title: chapter.titre, content: '', text: undefined }));
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
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link to="/v3/mes-livres" className="text-white/60 text-sm hover:text-white flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Retour à mes livres
            </Link>
            <V3ResetBookButton
              navigateTo="/v3/create"
              title="Créer un nouveau livre"
              subtitle="partir d’une page blanche"
            />
          </div>
          <h1 className="v3-serif text-4xl md:text-5xl font-bold mt-6">{book.title}</h1>
          {brief.subtitle && <p className="mt-3 text-lg text-muted-foreground">{brief.subtitle}</p>}
          {book.author_name && <div className="mt-2 text-white/60">par {book.author_name}</div>}
          <Button asChild className="mt-5"><Link to={`/v3/create?projectId=${book.id}`}>Ouvrir ma fiche et reprendre la rédaction</Link></Button>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-5 md:px-8 py-10 grid md:grid-cols-[220px_1fr] gap-10">
        <div className="md:col-span-2 space-y-4">
          {brief.description && <details open><summary className="cursor-pointer font-semibold">Synopsis</summary><p className="mt-3 whitespace-pre-wrap">{brief.description}</p></details>}
          {!!brief.characters?.length && <details><summary className="cursor-pointer font-semibold">Personnages ({brief.characters.length})</summary><div className="mt-3 space-y-4">{brief.characters.map((character, index) => <div key={index}><h2 className="font-semibold">{character.name} {character.age && `(${character.age})`}</h2><p>{character.role}</p><p className="whitespace-pre-wrap">{character.traits}</p><p>{character.description}</p></div>)}</div></details>}
        </div>
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
              <div className="whitespace-pre-wrap">{current.content || current.text || 'Titre du sommaire enregistré. Ce chapitre n’a pas encore été rédigé.'}</div>
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
