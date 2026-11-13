import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface FlipPage {
  imageUrl?: string | null;
  title?: string;
  text: string;
  caption?: string;
}

interface Props {
  bookTitle: string;
  pages: FlipPage[];
  onClose?: () => void;
  /** Liseuse plein écran pour albums jeunesse : gros titres, texte centré. */
  kids?: boolean;
  textPx?: number;
}

/** Feuilletoir illustré : image à gauche, texte à droite, une double page à la fois. */
export default function IllustratedFlipbook({ bookTitle, pages, onClose, kids = false, textPx = 24 }: Props) {
  const [index, setIndex] = useState(0);
  const [turning, setTurning] = useState<'next' | 'prev' | null>(null);
  const touchX = useRef<number | null>(null);
  const last = Math.max(0, pages.length - 1);
  const page = pages[index];

  const go = (dir: 'next' | 'prev') => {
    const target = dir === 'next' ? index + 1 : index - 1;
    if (target < 0 || target > last) return;
    setTurning(dir);
    window.setTimeout(() => { setIndex(target); setTurning(null); }, 260);
  };

  if (!page) return null;

  const book = (
    <section className={kids ? 'mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center p-4 md:p-8' : 'rounded-xl border border-border bg-card p-4 md:p-6'} aria-label="Feuilleter le livre">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className={`v3-serif font-semibold text-foreground ${kids ? 'text-2xl md:text-4xl' : 'text-lg'}`}>📖 {bookTitle}</p>
        {onClose && (
          <button type="button" onClick={onClose} className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm text-foreground">
            <X className="h-4 w-4" /> Fermer
          </button>
        )}
      </div>

      <div
        className={`mx-auto grid w-full ${kids ? 'h-[75vh] max-w-6xl' : 'h-[380px] max-w-4xl md:h-[440px]'} overflow-hidden rounded-md bg-[#FBF8F1] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] ring-1 ring-black/10 md:grid-cols-[1fr_24px_1fr]`}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) go(dx < 0 ? 'next' : 'prev');
          touchX.current = null;
        }}
        style={{
          transition: 'transform 260ms ease, opacity 260ms ease',
          transform: turning ? `perspective(1600px) rotateY(${turning === 'next' ? -8 : 8}deg)` : 'none',
          opacity: turning ? 0.6 : 1,
        }}
      >
        <div className="flex items-center justify-center overflow-hidden bg-[#F1ECE2]">
          {page.imageUrl ? (
            <img src={page.imageUrl} alt={page.title || `Page ${index + 1}`} className="h-full w-full object-cover" />
          ) : (
            <p className="text-sm text-[#8A8072]">Illustration à venir</p>
          )}
        </div>
        <div aria-hidden className="hidden bg-gradient-to-r from-black/0 via-black/15 to-black/0 md:block" />
        <div className={`flex flex-col px-6 py-7 text-[#2A2118] ${kids ? 'items-center justify-center text-center md:px-12' : ''}`}>
          {page.title && <h3 className={`v3-serif mb-3 font-bold !text-inherit ${kids ? 'text-3xl md:text-4xl' : 'text-xl'}`}>{page.title}</h3>}
          <div className={kids ? 'flex flex-1 items-center justify-center overflow-y-auto whitespace-pre-line font-medium leading-[1.55]' : 'flex-1 overflow-y-auto whitespace-pre-line text-[15px] leading-[1.7]'} style={kids ? { fontSize: `${textPx}px` } : undefined}>{page.text}</div>
          {page.caption && <p className="mt-3 text-xs italic text-[#8A8072]">{page.caption}</p>}
          <p className="mt-4 text-center text-xs text-[#8A8072]">{index + 1}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button type="button" onClick={() => go('prev')} disabled={index === 0} className="v3-flat-btn inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground disabled:opacity-40">
          <ChevronLeft className="h-4 w-4" /> Page précédente
        </button>
        <span className="text-xs text-muted-foreground">Page {index + 1} sur {pages.length}</span>
        <button type="button" onClick={() => go('next')} disabled={index >= last} className="inline-flex items-center gap-1 rounded-lg bg-[#008296] px-3 py-2 text-sm font-semibold text-white disabled:opacity-40">
          Page suivante <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );

  if (!kids) return book;
  return <div className="fixed inset-0 z-50 overflow-y-auto bg-background/95 backdrop-blur-sm" role="dialog" aria-modal="true">{book}</div>;
}
