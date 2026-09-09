import { AlignJustify, Smile, Type } from 'lucide-react';
import { toast } from 'sonner';
import { BOOK_FONTS, readBookBrief, writeBookBrief, type BookBrief } from '@/lib/v3/bookBrief';
import { saveBookDraftToCloud } from '@/lib/v3/bookDraftCloud';

/**
 * La barre du typographe : police, taille, interligne, justification et emojis.
 * Ces réglages servent à la lecture crème et sont repris par les exports.
 */
export default function V3TypographyBar({ brief, onChange }: {
  brief: BookBrief;
  onChange?: (next: BookBrief) => void;
}) {
  const apply = (values: Partial<BookBrief>) => {
    const next = { ...(readBookBrief() || {}), ...values };
    writeBookBrief(next);
    onChange?.(next);
    void saveBookDraftToCloud(next);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border px-3 py-2"
      style={{ borderColor: 'rgba(201,168,76,0.5)', background: '#fff' }}>
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: 'var(--v3-muted)' }}>
        <Type className="h-3 w-3" /> Mise en page du livre
      </span>

      <label className="text-[11.5px]" style={{ color: 'var(--v3-ink)' }}>
        Police{' '}
        <select value={brief.bookFont || 'garamond'} onChange={(event) => apply({ bookFont: event.target.value as never })}
          className="rounded-lg border px-1.5 py-1 text-[11.5px]" style={{ borderColor: 'rgba(201,168,76,0.5)' }}>
          {BOOK_FONTS.map((font) => <option key={font.id} value={font.id}>{font.label}</option>)}
        </select>
      </label>

      <label className="text-[11.5px]" style={{ color: 'var(--v3-ink)' }}>
        Taille{' '}
        <select value={brief.bookSize || 'medium'} onChange={(event) => apply({ bookSize: event.target.value as never })}
          className="rounded-lg border px-1.5 py-1 text-[11.5px]" style={{ borderColor: 'rgba(201,168,76,0.5)' }}>
          <option value="small">Petite</option>
          <option value="medium">Normale</option>
          <option value="large">Grande</option>
        </select>
      </label>

      <label className="text-[11.5px]" style={{ color: 'var(--v3-ink)' }}>
        Interligne{' '}
        <select value={brief.bookLeading || 'normal'} onChange={(event) => apply({ bookLeading: event.target.value as never })}
          className="rounded-lg border px-1.5 py-1 text-[11.5px]" style={{ borderColor: 'rgba(201,168,76,0.5)' }}>
          <option value="tight">Serré</option>
          <option value="normal">Normal</option>
          <option value="airy">Aéré</option>
        </select>
      </label>

      <label className="inline-flex items-center gap-1.5 text-[11.5px]" style={{ color: 'var(--v3-ink)' }}>
        <input type="checkbox" checked={brief.justify !== false}
          onChange={(event) => {
            apply({ justify: event.target.checked });
            toast.success(event.target.checked ? 'Texte justifié, comme un livre imprimé.' : 'Texte aligné à gauche.');
          }} />
        <AlignJustify className="h-3 w-3" /> Justifié
      </label>

      <label className="inline-flex items-center gap-1.5 text-[11.5px]" style={{ color: 'var(--v3-ink)' }}>
        <input type="checkbox" checked={brief.emojis !== false}
          onChange={(event) => {
            apply({ emojis: event.target.checked });
            toast.success(event.target.checked
              ? 'Le Génie pourra glisser au maximum un emoji discret par passage.'
              : 'Le Génie n’ajoutera plus aucun emoji.');
          }} />
        <Smile className="h-3 w-3" /> Emojis
      </label>
    </div>
  );
}
