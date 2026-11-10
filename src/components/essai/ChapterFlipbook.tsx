import { useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  title: string;
  chapterTitle: string;
  paragraphs: string[];
  /** Nombre approximatif de caractères par page. */
  charsPerPage?: number;
}

/** Découpe les paragraphes en pages de longueur comparable. */
export function paginate(paragraphs: string[], charsPerPage: number): string[][] {
  const pages: string[][] = [];
  let current: string[] = [];
  let size = 0;
  for (const p of paragraphs) {
    if (size > 0 && size + p.length > charsPerPage) {
      pages.push(current);
      current = [];
      size = 0;
    }
    current.push(p);
    size += p.length;
  }
  if (current.length) pages.push(current);
  return pages;
}

/** Lecteur façon livre : double page sur ordinateur, simple page sur mobile. */
export default function ChapterFlipbook({ title, chapterTitle, paragraphs, charsPerPage = 900 }: Props) {
  const pages = useMemo(() => paginate(paragraphs, charsPerPage), [paragraphs, charsPerPage]);
  const [index, setIndex] = useState(0);
  const [turning, setTurning] = useState<'next' | 'prev' | null>(null);
  const touchX = useRef<number | null>(null);
  const isWide = typeof window !== 'undefined' && window.innerWidth >= 768;
  const step = isWide ? 2 : 1;
  const last = Math.max(0, pages.length - 1);

  const go = (dir: 'next' | 'prev') => {
    const target = dir === 'next' ? index + step : index - step;
    if (target < 0 || target > last) return;
    setTurning(dir);
    window.setTimeout(() => {
      setIndex(isWide ? target - (target % 2) : target);
      setTurning(null);
    }, 280);
  };

  const renderPage = (i: number) => {
    const content = pages[i];
    if (!content) return <div className="flex-1" />;
    return (
      <div className="flex flex-1 flex-col px-6 py-7 md:px-8">
        {i === 0 && (
          <div className="mb-5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8A6D1B]">{title}</p>
            <h3 className="v3-serif mt-2 text-xl font-bold text-[#2A2118]">{chapterTitle}</h3>
          </div>
        )}
        <div className="flex-1 space-y-3 text-[15px] leading-[1.7] text-[#2A2118]">
          {content.map((p, k) => (
            <p
              key={k}
              className={
                i === 0 && k === 0
                  ? 'first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-5xl first-letter:font-bold first-letter:leading-none first-letter:text-[#008296]'
                  : 'indent-5'
              }
            >
              {p}
            </p>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-[#8A8072]">{i + 1}</p>
      </div>
    );
  };

  return (
    <div className="mt-5">
      <div
        className="relative mx-auto flex min-h-[520px] overflow-hidden rounded-md bg-[#FBF8F1] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.45)] ring-1 ring-black/10"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) go(dx < 0 ? 'next' : 'prev');
          touchX.current = null;
        }}
        style={{
          transition: 'transform 280ms ease, opacity 280ms ease',
          transform: turning ? `perspective(1600px) rotateY(${turning === 'next' ? -8 : 8}deg)` : 'none',
          opacity: turning ? 0.6 : 1,
        }}
      >
        {renderPage(index)}
        {isWide && (
          <>
            <div aria-hidden className="w-6 flex-none bg-gradient-to-r from-black/0 via-black/15 to-black/0" />
            {renderPage(index + 1)}
          </>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => go('prev')}
          disabled={index === 0}
          className="inline-flex items-center gap-1 rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-semibold text-[#2A2118] disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> Page précédente
        </button>
        <span className="text-xs text-[#5B5245]">
          Page {index + 1}
          {isWide && pages[index + 1] ? `–${index + 2}` : ''} sur {pages.length}
        </span>
        <button
          type="button"
          onClick={() => go('next')}
          disabled={index + step > last}
          className="inline-flex items-center gap-1 rounded-lg bg-[#008296] px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
        >
          Page suivante <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
